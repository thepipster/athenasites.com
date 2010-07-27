<?php
/**
* This script processes a file that has been uploaded using the standard
* POST mechanism. The image is moved to a default directory and stored
* in the database
*
* 22nd August, 2007
* Mike Pritchard
*/
// Load defines and class auto-loader....
include_once(realpath(dirname(__FILE__)) . '/setup.php');
//include_once('../code/common/php/CommonDefines.php');

Logger::debug("Enter ProcessUpload.php");
//Logger::dump($_POST);

if ( isset($_GET['u444']) ){
	$username = $_GET['u444'];
	Logger::debug("Username = " . $username);
	//Logger::debug(Session::toString());
	$user_id = UserTable::getUserID($username);
	$folder_id = getPara('folder_id');
} else {
	// Check that the session is valid by getting the user ID
	if (!Session::exists("user_id")) {
		Logger::fatal("User ID not found in session, aborting");
		return;
	}	
	$user_id = Session::get("user_id");
	$folder_id = getPara('folder_id');
}

Logger::debug('Upload script starting');
Logger::debug('User ID = ' . $user_id);
Logger::debug('Folder ID = ' . $folder_id);
	
// Respond to the 2 different file keys in this project
if ( isset($_FILES['Filedata']['size'])) $file_key = 'Filedata';
if ( isset($_FILES['userfile']['size'])) $file_key = 'userfile';

if ( isset($file_key) ){
	// Check file size isn't huge!
	if ($_FILES[$file_key]['size'] > MAX_UPLOAD_FILE_SIZE){
		Logger::fatal("Uploaded file is too big, so ignoring! (" . $_FILES[$file_key]['size'] . " bytes)");
	}

	$site = new SitesTable();
	$site->fromUserID($user_id);
	$user_name = UserTable::getUsername($user_id);


	// put all variables pertaining to image upload into an array, for easy collection
	$new_file = array(
		'user_id' => $user_id,
		'site_root' => $site->site_root,
		'target_dir' => ImageWorkingTable::getImageDir($user_id),
		'filename' => $_FILES[$file_key]['name'],
		'tmpname' => $_FILES[$file_key]['tmp_name'],
		'fileSize' => $_FILES[$file_key]['size'],
		'fileType' => $_FILES[$file_key]['type']
	);

	// Update permissons if required
	if (!is_writable($new_file['target_dir'])){
		chmod($new_file['target_dir'], 0777);			
	}
	
	// make sure filename is unique
	$new_file['filename'] = friendlyName($new_file['filename'], $new_file['target_dir']);

	Logger::dump($new_file);

	// Move file....	
	$new_filename = $new_file['target_dir'] . $new_file['filename'];
	Logger::debug('move: rename(' . $new_file['tmpname'] . ", $new_filename)");
	rename($new_file['tmpname'], $new_filename);
	chmod($new_filename, 0777);

	// Get folder id
	if (!isset($folder_id) || $folder_id == '') $folder_id = FoldersTable::getUploadsFolderID($user_id);
	
	Logger::debug("Image inserted into file table, now inserting in image table");

	// Check to see if this is a valid image
	if (ImageHelper::isImage($new_file['filename'])){

		// Insert into file table
		Logger::debug("Inserting file into table (User ID = $user_id, Path = $new_filename)");
		$imageInfo = getimagesize($new_filename);
		$file_id = FileTable::insertFileIntoTable($new_filename, $folder_id, $user_id, true);	

		// Insert into image table
		Logger::debug("File is an image!");
		$id = ImageOriginalTable::createFromFileTable($user_id, $file_id, $_FILES[$file_key]['name'], $imageInfo);
		Logger::debug("Image ID = $id");	
	}
	else {
		// Insert into file table
		Logger::debug("Inserting file into table (User ID = $user_id, Path = $new_filename)");
		$file_id = FileTable::insertFileIntoTable($new_filename, $folder_id, $user_id, true);			
	}
	
	Logger::debug("Upload complete!");
}	

// The flash uploader needs to get a response (on mac systems) otherwise
// it won't fire its onComplete method - SO DO NOT REOMOVE FOLLOWING!	
echo "Upload complete! <br>";


function friendlyName($url, $dir) {
	//Logger::debug("friendlyName($url, $dir)");

	// separate filename from extension
	$ext = FileHelper::getExtension($url);
	$name = strtolower(strip_ext($url));

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

function strip_ext($name) {
	$ext = strrchr($name, '.');
	if ($ext) {
		 $name = substr($name, 0, -strlen($ext));
	}
	return $name;
}



?>
