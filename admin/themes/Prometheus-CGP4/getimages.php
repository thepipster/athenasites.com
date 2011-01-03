<?php

require_once("../../code/php/setup.php");

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

// Force PageManager setup..

PageManager::init('',4);
PageManager::$page_title = 'Ideas for ' . ucfirst($csv_tags) . ': Charlotte Geary Photography';


// List of title/texts for each media tag

$text_list = array(
	array ('tag' => 'centerpieces', 'title' => 'Ideas for Wedding Bouquets', 'caption' => "Pictures of wedding bouquets for brides, bridesmaids, flower girls, and mothers of the bride, with flowers that include roses, calla lilies, peonies, gerbera daisies, sunflowers, and many others.")
);

$title_text = getTitleText($text_list, $tag_list);

// Get header...
require_once('header.php');

// Echo images....

echo "
<div id='venuePage' class='pageContents'>

	<div class='venuePageContents'>
	
	<h1>WEDDING PLANNING IDEAS</h1>
	
	<h2>".$title_text['title']."</h2>
	
	<p>".$title_text['caption']."</p>

	<p align='left'>";




foreach($media_id_list as $media_id){

	$image = MediaTable::getMedia($site_id, $media_id);
	
	$image_url = "http://files.apollosites.com/$site_id/" . $image['filepath'] . $image['filename'];
	$thumb_url = "http://files.apollosites.com/$site_id/" . $image['filepath'] . $image['thumb_filename'];
	$title =  $image['title'];
	$description = $image['description'];										
	$alt_text = $image['tags'];
		
	Logger::debug($image_url);
		
	echo "<img src='$image_url' title='$title' alt='$alt_text'/><br/>";  
	if ($title != ''){
		echo "<span class='title'>$title</span><br/>";
	} 
	echo "<span class='caption'>$description</span>"; 
	echo "<br/><br/>";	
}

echo "
	</p>
</div>";

// Get header...
require_once('footer.php');



function getTitleText($text_list, $tag_list){

	$data = array('caption' => '', 'title' => '');
	
	foreach ($text_list as $text){
		foreach($tag_list as $tag){
			if ($text['tag'] == $tag){
				$data['caption'] = $text['caption'];
				$data['title'] = $text['title'];
				return $data;
			}
		}
	}
}

?>