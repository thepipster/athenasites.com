<?php

require_once("../setup.php");

Logger::echoLog();

$accessKey = 'AKIAJREFWQ2CC3ZIDWOQ';	
$secretKey = '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';
$s3 = new S3($accessKey, $secretKey, false);


// Get a list of all the users
$site_id_list = DatabaseManager::getColumn("SELECT id FROM apollo_Sites");

foreach($site_id_list as $site_id){

	$media_list = DatabaseManager::getResults("SELECT * FROM athena_{$site_id}_Media");

	if (isset($media_list)){
		
		foreach($media_list as $media){

			$basedir = SecurityUtils::getMediaFolder($site_id);	
			
			//
			// Upload media file....
			//
			
			$media_file = $basedir . $media['filepath'] . $media['filename'];
			$s3_file_path = $site_id . "/" . $media['filepath'] . $media['filename'];
		
			//Logger::debug("File $media_file ($s3_file_path)");
			
			// Upload media file...					
 			if (!$s3->putObject(S3::inputFile($media_file), "apollosites", $s3_file_path, S3::ACL_PUBLIC_READ)) {
				Logger::error("Failed to upload file $media_file to the Amazon S3 servers");
			}
	
			//
			// Upload thumb file....
			//

			$media_thumb_file = $basedir . $media['filepath'] . $media['thumb_filename'];
			$s3_file_path = $site_id . "/" . $media['filepath'] . $media['thumb_filename'];

			//Logger::debug("Thumbnail $media_thumb_file");
	
			// Upload media file...					
			if (!$s3->putObject(S3::inputFile($media_thumb_file), "apollosites", $s3_file_path, S3::ACL_PUBLIC_READ)) {
				Logger::error("Failed to upload thumb file $media_thumb_file to the Amazon S3 servers");
			}
		
		}
	
	}
	
}

?>