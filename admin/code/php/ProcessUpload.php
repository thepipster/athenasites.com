<?php

// We passed the php session id from the flash uploader, so load the session from it!
if (isset($_POST["PHPSESSID"])) {
	session_id(mysql_real_escape_string($_POST["PHPSESSID"]));
}
else {
	error_log("[FATAL] No valid php session id! {ProcessUpload}");
	die();
}

// Load defines and class auto-loader....
include_once(realpath(dirname(__FILE__)) . '/setup.php');
//include_once('../code/common/php/CommonDefines.php');

Logger::debug("Entering ProcessUpload.php");

// Check for credentials
if(!SecurityUtils::isLoggedIn()){
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
	if (!isset($folder_id) || !$folder_id) $folder_id = 1; // folder id of 1 is considered 'unassigned'
	//$user = UserTable::getUser($user_id);
	
	$folder = SecurityUtils::getMediaFolder($site_id);
		
	Logger::debug('Upload script starting');
	Logger::debug('User ID = ' . $user_id);
	Logger::debug('Folder ID = ' . $folder_id);
	Logger::debug('Folder = ' . $folder);
	
	// Copy file to users directory
    $tmp_name = $_FILES["Filedata"]["tmp_name"];
    $title = $_FILES["Filedata"]["name"];
    $name = friendlyName($_FILES["Filedata"]["name"], $folder);
 	$new_filepath = $folder . $name;
    
    move_uploaded_file($tmp_name, $new_filepath);	
                
    // If this is an image then get the info
	$image_info = getimagesize($new_filepath);

    if ($image_info){

	    $thumb_name = getThumbName($name, $folder);
	 	$new_thumbfilepath = $folder . $thumb_name;
	 	
	 	Logger::debug(">>>> New image name: $name Thumb name: $thumb_name");
    
	    $width = $image_info[0];
	    $height = $image_info[1];
	    $mime_type = $image_info['mime'];
	    
	    // Create thumbnails!
	    $src_image = ImageUtils::createImageFromFile($new_filepath, $mime_type);
	    $thumb_img = ImageUtils::resizeImage($src_image, $mime_type, 'fit', THUMB_WIDTH, THUMB_HEIGHT, null);
	    
	    $thumb_width = imagesx($thumb_img);
	    $thumb_height = imagesy($thumb_img);
	    
		imagepng($thumb_img, $new_thumbfilepath);	    
    }
    else {
	    $mime = new MimeType();                
	    $mime_type = $mime->getType(strtolower($new_filepath));
	    $width = null;
	    $height = null;
	    $thumb_name = null;
	    $thumb_width = null;
	    $thumb_height= null;
    }
    
    $file_size = filesize($new_filepath);
        
    
	/*
	$new_filename = $new_file['target_dir'] . $new_file['filename'];
	Logger::debug('move: rename(' . $new_file['tmpname'] . ", $new_filename)");
	rename($new_file['tmpname'], $new_filename);
	*/
	//chmod($new_filename, 0777);
		
	// Add to media table
	//FolderTable::addMedia($folder_id, $site_id, $name, $mime_type, $file_size);
	FolderTable::addMedia($folder_id, $site_id, $name, $mime_type, $file_size, $title, '', '', $width, $height, $thumb_name, $thumb_width, $thumb_height);
	
	// Make a thumbnail
	
	Logger::debug("Upload complete!");
}	

// The flash uploader needs to get a response (on mac systems) otherwise
// it won't fire its onComplete method - SO DO NOT REOMOVE FOLLOWING!	
echo "Upload complete! <br>";

// ////////////////////////////////////////////////////////////////////////////////

function friendlyName($filename, $dir) {

	// separate filename from extension
	$path_parts = pathinfo($filename);
	$ext = $path_parts['extension'];
	$name = $path_parts['filename'];
	
	//remove non-standard characters from URL
	$name = ereg_replace("[[:punct:]]+", "", $name);
	$name = ereg_replace("[^[:alnum:]]+", "_", $name);

	if (file_exists($dir . $name . '.' . $ext)) {
		$i = 1;
		$name .= '_';
		while (file_exists($dir . $name . $i . '.' . $ext)) {
			$i++;
		}
		$name .= $i;
	}

	return $name . '.' . $ext;
}

// ////////////////////////////////////////////////////////////////////////////////

function getThumbName($filename, $dir) {

	// separate filename from extension
	$path_parts = pathinfo($filename);
	$ext = $path_parts['extension'];
	$name = $path_parts['filename'];
	
	Logger::debug(">>>> $name $ext");
	return $name . '_thumb.' . $ext;
}


?>
