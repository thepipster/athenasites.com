<?php

require_once("code/php/setup.php");

$csv_tags = CommandHelper::getPara('tag', false, CommandHelper::$PARA_TYPE_STRING);

// Get the site id from the URL
$domain = str_replace('www.', '', $_SERVER['HTTP_HOST']);
$site_id = SitesTable::getSiteIDFromDomain($domain);

// Replace '-' spaces with spaces
$csv_tags = str_replace("-", " ", $csv_tags);

// Get tag list
$tag_list = explode(",", $csv_tags);

//Logger::echoLog();

Logger::debug("Site ID = $site_id Tag = $csv_tags");

$media_id_list = array();
foreach($tag_list as $tag){
	if ($tag != ''){
		Logger::debug("Tag = " . $tag);
		$temp_list = MediaTable::getMediaIDsByTag($site_id, trim($tag));
		if (isset($temp_list)){
			$media_id_list = array_merge($media_id_list, $temp_list);
		}
	}
}

$media_id_list = array_unique($media_id_list);
shuffle($media_id_list);

foreach($media_id_list as $media_id){

	$image = MediaTable::getMedia($site_id, $media_id);
	
	$image_url = "http://files.apollosites.com/$site_id/" . $image['filepath'] . $image['filename'];
	$thumb_url = "http://files.apollosites.com/$site_id/" . $image['filepath'] . $image['thumb_filename'];
	$title =  $image['title'];
	$description = $image['description'];										
	$alt_text = $image['tags'];
		
	Logger::debug($image_url);
		
	echo "<img src='$image_url' title='$title' alt='$alt_text'/>";   
//	echo "<img src='$thumb_url' title='$title' alt='$alt_text'/>";   
	echo "<span class='title'>$title</span>";
	echo "<span class='caption'>$description</span>"; 
	echo "<br/>";	
}

?>