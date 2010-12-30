<?php

// Load defines and class auto-loader....
include_once(realpath(dirname(__FILE__)) . '/setup.php');

// We passed the php session id from the flash uploader, so load the session from it!
if (isset($_POST["PHPSESSID"])) {
    $result = session_id(mysql_real_escape_string($_POST["PHPSESSID"]));
} else {
    error_log("[FATAL] No valid php session id! {ProcessUpload}");
    die();
}


// Check for credentials
if (!SecurityUtils::isLoggedIn()) {
    Logger::fatal("Attempted unauthorized access to the ProcessUpload script!");
    die();
}

// We trigger the uploadError event in SWFUpload by returning a status code other than 200 (which is the default returned by PHP)
if (!isset($_FILES["Filedata"]) || !is_uploaded_file($_FILES["Filedata"]["tmp_name"]) || $_FILES["Filedata"]["error"] != 0) {

    // Usually we'll only get an invalid upload if our PHP.INI upload sizes are smaller than the size of the file we allowed
    // to be uploaded.
    header("HTTP/1.1 500 File Upload Error");

    if (isset($_FILES["Filedata"])) {
        echo $_FILES["Filedata"]["error"];
    }
    exit(0);
} 
else {

    // Get user info
    $user_id = SecurityUtils::getCurrentUserID();
    $folder_id = CommandHelper::getPara('folder_id', false, CommandHelper::$PARA_TYPE_NUMERIC);
    $site_id = CommandHelper::getPara('site_id', false, CommandHelper::$PARA_TYPE_NUMERIC);

    if (!isset($folder_id) || !$folder_id){
        $folder_id = 1; // folder id of 1 is considered 'unassigned'
    }

    $year = date("Y");
    $month = date("m");
    $filepath = $year . "/" . $month . "/";
                
    // separate filename from extension to get title
    $title_parts = pathinfo($_FILES["Filedata"]["name"]);
    $title = $title_parts['filename'];
    $original_ext = $title_parts['extension'];
    
    // Copy file to users directory
	$tmp_name = tempnam(sys_get_temp_dir(), 'apollo_') . "." . $original_ext;    
    move_uploaded_file($_FILES["Filedata"]["tmp_name"], $tmp_name);
    
    // Get a safe name, and check for duplicates    
    //$name = friendlyName($_FILES["Filedata"]["name"], $filepath);      
    $name = friendlyName($_FILES["Filedata"]["name"], $site_id, $filepath); 
    
    $s3_file_path = $site_id . "/" . $filepath . $name;
            
	//
	// Upload the file to the Amazon S3 server
	//
	
    Logger::debug("[$tmp_name] Name = $name Path = $s3_file_path");
    
	$accessKey = 'AKIAJREFWQ2CC3ZIDWOQ';	
	$secretKey = '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';
	$s3 = new S3($accessKey, $secretKey, false);
	
	Logger::debug("Init S3 OK!");
	
	if (!$s3->putObject(S3::inputFile($tmp_name), "apollosites", $s3_file_path, S3::ACL_PUBLIC_READ)) {
    	Logger::fatal("Failed to upload file $s3_file_path to the Amazon S3 servers");
	}
	else {
		Logger::debug("File $s3_file_path uploaded ok!");
	}

	//
	// Now add into the apollo system
	//
		
    // If this is an image then get the info
    $image_info = getimagesize($tmp_name);

    if ($image_info) {

        $width = $image_info[0];
        $height = $image_info[1];

		//if (THUMB_WIDTH < $width && THUMB_HEIGHT < $height){

		// Create a temporary file to store the thumbnail 
		$temp_file_thumb = tempnam(sys_get_temp_dir(), 'apollo_') . "." . $original_ext;

        $thumb_name = getThumbName($name);
        $s3_thumb_file_path = $site_id . "/" . $filepath . $thumb_name; 
        
        $mime_type = $image_info['mime'];

        // Create thumbnails!
        //$src_image = ImageUtils::createImageFromFile($tmp_name, $mime_type);
        //$thumb_img = ImageUtils::resizeImage($src_image, $mime_type, 'letterbox', THUMB_WIDTH, THUMB_HEIGHT);
        //$thumb_img = ImageUtils::resizeImage($src_image, $mime_type, 'letterbox', THUMB_WIDTH, THUMB_HEIGHT);
		
		$thumb_img = ImageUtils::resizeImage($tmp_name, THUMB_WIDTH, THUMB_HEIGHT, false, 'return', false);
		
        $thumb_width = imagesx($thumb_img);
        $thumb_height = imagesy($thumb_img);

        //imagepng($thumb_img, $new_thumbfilepath);
        Logger::debug("Temp File: $temp_file_thumb");
        imagepng($thumb_img, $temp_file_thumb);

		if (!$s3->putObject(S3::inputFile($temp_file_thumb), "apollosites", $s3_thumb_file_path, S3::ACL_PUBLIC_READ)) {
	    	Logger::fatal("Failed to upload thumbnail $thumb_name to the Amazon S3 servers");
		}
		
		unlink($temp_file_thumb);
		
        
    } 
    else {
        $mime = new MimeType();
        $mime_type = $mime->getType(strtolower($tmp_name));
        $width = null;
        $height = null;
        $thumb_name = null;
        $thumb_width = null;
        $thumb_height = null;
    }

    $file_size = filesize($tmp_name);


    /*
      $new_filename = $new_file['target_dir'] . $new_file['filename'];
      Logger::debug('move: rename(' . $new_file['tmpname'] . ", $new_filename)");
      rename($new_file['tmpname'], $new_filename);
     */
    //chmod($new_filename, 0777);
    // Add to media table
    
    // addMedia($folder_id, $site_id, $filename, $mime_type, $file_size, $filepath, $title, $descriptions, $tags, $width, $height, $thumb_filename, $thumb_width, $thumb_height)
    $title = "";
    MediaTable::addMedia($folder_id, $site_id, $name, $mime_type, $file_size, $filepath, $title, '', '', $width, $height, $thumb_name, $thumb_width, $thumb_height);

    // Make a thumbnail

    Logger::debug(">>>>>> Upload complete!");
}

// Delete the temporary file
unlink($tmp_name);

// The flash uploader needs to get a response (on mac systems) otherwise
// it won't fire its onComplete method - SO DO NOT REOMOVE FOLLOWING!	
echo "Upload complete! <br>";

// ////////////////////////////////////////////////////////////////////////////////

/**
* Get the media id for a the given filepath, filename and site id
*/
function getMediaID($site_id, $filepath, $filename){
	$sql = DatabaseManager::prepare("SELECT id FROM athena_%d_Media WHERE filepath = %s AND filename = %s", $site_id, $filepath, $filename);
	Logger::debug($sql);
	return DatabaseManager::getVar($sql);
}

// ////////////////////////////////////////////////////////////////////////////////

function friendlyName($filename, $site_id, $filepath) {

    // separate filename from extension
    $path_parts = pathinfo($filename);
    $ext = $path_parts['extension'];
    $name = $path_parts['filename'];

    //remove non-standard characters from URL
    $name = ereg_replace("[[:punct:]]+", "", $name);
    $name = ereg_replace("[^[:alnum:]]+", "_", $name);
    
    // Check for duplicates
    //$file_id = DatabaseManager::getVar(DatabaseManager::prepare("SELECT id FROM athena_%d_Media WHERE filepath = %s AND filename = %s", $site_id, $filepath, $name));    

    if (getMediaID($site_id, $filepath, $name . '.' . $ext)) {
        $i = 1;
        $name .= '_';
        while (getMediaID($site_id, $filepath, $name . $i . '.' . $ext)) {
            $i++;
        }
        $name .= $i;
    }

    return $name . '.' . $ext;
}

// ////////////////////////////////////////////////////////////////////////////////

function getThumbName($filename) {

    // separate filename from extension
    $path_parts = pathinfo($filename);
    $ext = $path_parts['extension'];
    $name = $path_parts['filename'];

    Logger::debug(">>>> $name $ext");
    return $name . '_thumb.' . $ext;
}

?>
