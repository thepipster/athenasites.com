<?php
/**
* Process ajax requests sent from the Athena front end
*
* Author: Mike Pritchard
* Date: 5th August, 2010
*/

require_once("../setup.php");

$cmd = CommandHelper::getPara('cmd', true, CommandHelper::$PARA_TYPE_STRING);

// Grab global parameters that all commands must have
$site_id = CommandHelper::getPara('site_id', true, CommandHelper::$PARA_TYPE_STRING);

// Check that a user is logged in, and that they have access to this site
if (!SecurityUtils::isLoggedInForSite($site_id)){
	error_log("You are not authorized for this site!");
	CommandHelper::sendAuthorizationFailMessage("You are not authorized for this site!");	
	die();
}

Logger::debug("Command = " . $cmd);

// Get the command type, and process
switch($cmd){

	case "getAll":
		getAll($site_id); 
		break;			

	default :
		CommandHelper::sendTextMessage("Undefined command '$cmd'");
		
}

// ///////////////////////////////////////////////////////////////////////////////////////

function getAll($site_id){

	
	//Logger::debug("listImages($page_id, $theme_para_id)");
	$blog_id = Session::get('apollo_blog_id');			
	
	$imageList = array();
	
	$gal_images = GalleryTable::getImages($page_id, $theme_para_id, $blog_id);	
	$no_subgalleries = ThemeTable::getNumberGalleriesForMultiGallery($page_id);
	if (!isset($no_subgalleries) || $no_subgalleries == 0) $no_subgalleries = 1;
	
	if (isset($images)){	
		foreach($images as $image){
		
			$temp = array();
			$temp['id'] = $image['id'];
			$temp['image_post_id'] = $image['image_post_id'];
			//$temp['url'] = $image['url'];
			
			$temp['url'] = WordPressHelper::getRealThumbURL($image['image_post_id'], $blog_id);
			
			//$temp['url'] = wp_get_attachment_thumb_url($image['image_post_id']);
			
			if (!isset($temp['url']) || $temp['url'] == ''){
				// Force thumbnail generation!
				Logger::warn("Warning, thumbnail missing for image {$image['id']}, for the blog id $blog_id");
				WordPressHelper::regenerateThumbnail($image['id'], $blog_id, $blog_downloads_root);	
			}
			
			// wp_create_thumbnail
			//$temp['url'] = wp_get_attachment_image_src($image['image_post_id']);
			
			$temp['slot_number'] = $image['slot_number'];
			$temp['gallery_number'] = $image['gallery_number'];
			$temp['theme_para_id'] = $image['theme_para_id'];
			$temp['page_post_id'] = $image['page_post_id'];
			$temp['blog_id'] = $image['blog_id'];
			
			$gal_number = $image['gallery_number'];
			
			$imageList[$gal_number][] = $temp;
		}
	}
	
	
	$msg['cmd'] = 1;
	$msg['result'] = 'ok';
	$msg['data'] = $imageList;
	$msg['number_galleries'] = $no_subgalleries;
		
	CommandHelper::sendMessage($msg);	
	
	
			
	$msg = array();	
	$msg['cmd'] = 'getAll';
	$msg['result'] = 'ok';			
	$msg['data'] = array('folders' => $folder_list, 'media' => $media_data, 'pages' => $page_data, 'theme' => $theme, 'page_templates' => $page_templates);
				
	CommandHelper::sendMessage($msg);		

}

// ///////////////////////////////////////////////////////////////////////////////////////

function getFolders($site_id){
					
	// Get the folder list.........
	$folder_list = FolderTable::getFoldersForSite($site_id);
	
	$msg = array();	
	$msg['cmd'] = 'getFolders';
	$msg['result'] = 'ok';			
	$msg['data'] = $folder_list;
				
	CommandHelper::sendMessage($msg);		
	
}

// //// ///////////////////////////////////////////////////////////////////////////////////////

function getImages($site_id){
	
	$media_list = FolderTable::getMediaForSite($site_id);
	
	$msg = array();	
	$msg['cmd'] = 'getMedia';
	$msg['result'] = 'ok';			

	$data = array();
	foreach ($media_list as $media){
		$temp = $media;
		$temp['created'] = date("m/d/Y H:i", strtotime($media['created'])); // Convert to JS compatible date
		$data[] = $temp;
	}
	
	$msg['data'] = $data;
				

	CommandHelper::sendMessage($msg);		
	
}

// //// ///////////////////////////////////////////////////////////////////////////////////////

function saveMediaInfo($site_id, $title, $desc, $tags){

	$msg = array();	
	$msg['cmd'] = 'saveMediaInfo';
	$msg['result'] = 'ok';			
	$msg['data'] = '';
				
	CommandHelper::sendMessage($msg);	
}

?>