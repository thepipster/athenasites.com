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
/*		
	case $CMD_GET_GALLERY_IMAGE_LIST : // Get the images for the given page (gallery)	
		$page_id = CommandHelper::getPara('page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$theme_para_id = CommandHelper::getPara('theme_para_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		listImages($page_id, $theme_para_id);			
		break;
*/
	case "addImage" : // Process a new file upload
		$image_id = CommandHelper::getPara('image_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$page_id = CommandHelper::getPara('page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$slot_no = CommandHelper::getPara('slot_no', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$gal_no = CommandHelper::getPara('gallery_no', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$theme_para_id = CommandHelper::getPara('theme_para_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		addImageToGallery($image_id, $page_id, $slot_no, $gal_no, $theme_para_id);
		break;

	case "moveImage" : // Process a new file upload
		$old_slot_no = CommandHelper::getPara('old_slot_no', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$new_slot_no = CommandHelper::getPara('new_slot_no', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$page_id = CommandHelper::getPara('page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$old_gal_no = CommandHelper::getPara('old_gallery_no', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$new_gal_no = CommandHelper::getPara('new_gallery_no', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$theme_para_id = CommandHelper::getPara('theme_para_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$image_id = CommandHelper::getPara('image_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		moveImage($old_slot_no, $new_slot_no, $page_id, $old_gal_no, $new_gal_no, $theme_para_id, $image_id);
		break;

	case "removeImage" : 
		$image_id = CommandHelper::getPara('image_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$page_id = CommandHelper::getPara('page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$gal_no = CommandHelper::getPara('gallery_no', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$theme_para_id = CommandHelper::getPara('theme_para_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$slot_no = CommandHelper::getPara('slot_no', true, CommandHelper::$PARA_TYPE_NUMERIC);
		removeImage($image_id, $page_id, $gal_no, $theme_para_id, $slot_no);
		break;

	case "addMultiGal" : 
		$page_id = CommandHelper::getPara('page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$theme_para_id = CommandHelper::getPara('theme_para_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		addMultiGal($page_id, $theme_para_id);
		break;

	case "deleteMultiGal" :
		$page_id = CommandHelper::getPara('page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$theme_para_id = CommandHelper::getPara('theme_para_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$gallery_number = CommandHelper::getPara('gallery_no', true, CommandHelper::$PARA_TYPE_NUMERIC);
		deleteMultiGal($page_id, $theme_para_id, $gallery_number);
		break;
		
	case "setGalThumb" :
		$image_id = CommandHelper::getPara('image_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$page_id = CommandHelper::getPara('page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$gal_no = CommandHelper::getPara('gallery_no', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$theme_para_id = CommandHelper::getPara('theme_para_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		assignGalleryThumbnail($image_id, $page_id, $gal_no, $theme_para_id);
		break;

	case "setGalTitle" :
		$title = CommandHelper::getPara('title', true, CommandHelper::$PARA_TYPE_STRING);
		$page_id = CommandHelper::getPara('page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$gal_no = CommandHelper::getPara('gallery_no', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$theme_para_id = CommandHelper::getPara('theme_para_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		assignGalleryTitle($title, $page_id, $gal_no, $theme_para_id);
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

function addMultiGal($page_post_id, $theme_para_id){

	//error_log("addMultiGal($page_post_id, $theme_para_id)");
	checkPageValidForBlog($page_post_id);
		
	$blogid = Session::get('apollo_blog_id');
		
	// Get the current number of sub-galleries
	$no_galleries = PageParasTable::getParaValue($page_post_id, $theme_para_id, $blogid);
				
	if (!isset($no_galleries)){
		$result = PageParasTable::createParaValue($blog_id, $page_post_id, $theme_para_id, 1);
		$gallery_number = 1;
	}
	else {
		if ($no_galleries+1 < 99){
			$gallery_number = $no_galleries+1;
			$result = PageParasTable::updateParaValue($blogid, $page_post_id, $theme_para_id, $gallery_number);
		}	
	}
	
	// Create entry in GalleryMeta table
	GalleryTable::setGalleryTitle($page_post_id, $theme_para_id, $gallery_number, '', $blogid);			
			
	$data = array();
	$data['theme_para_id'] = $theme_para_id;
	$data['page_post_id'] = $page_post_id;
	
	$msg = array();
	
	$msg['cmd'] = 7;
	$msg['result'] = $result > 0 ? 'ok' : 'fail';
	$msg['data'] = $data;

	CommandHelper::sendMessage($msg);
		
}

// ///////////////////////////////////////////////////////////////////////////////////////

function deleteMultiGal($page_post_id, $theme_para_id, $gallery_number){

	checkPageValidForBlog($page_post_id);

	$blogid = Session::get('apollo_blog_id');

	$msg['cmd'] = 18;
	
	// Update the sub-gallery count...............
	
	// Get the current number of sub-galleries
	$no_subgalleries = PageParasTable::getParaValue($page_post_id, $theme_para_id, $blogid);
				
	if ($no_subgalleries > 1){

		PageParasTable::updateParaValue($blogid, $page_post_id, $theme_para_id, $no_subgalleries-1);
		GalleryTable::deleteSubGallery($page_post_id, $theme_para_id, $gallery_number, $blogid);		
		
		$msg['result'] = 'ok';
	}	
	else {
		$msg['result'] = 'fail';
	}	
	
	CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

function assignGalleryThumbnail($image_post_id, $page_post_id, $gal_no, $theme_para_id){

	checkPageValidForBlog($page_post_id);
	
	$blogid = Session::get('apollo_blog_id');

	Logger::debug("assignGalleryThumbnail($image_post_id, $page_post_id, $gal_no, $theme_para_id)");
		
	$result = GalleryTable::setGalleryThumbnail($page_post_id, $theme_para_id, $gal_no, $image_post_id, $blogid);

	$msg['cmd'] = 8;
	$msg['result'] = $result > 0 ? 'ok' : 'fail';

	CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

function assignGalleryTitle($title, $page_post_id, $gal_no, $theme_para_id){

	checkPageValidForBlog($page_post_id);

	$blogid = Session::get('apollo_blog_id');
	
	//Logger::debug("assignGalleryTitle($title, $page_post_id, $gal_no, $theme_para_id)");
	
	$result = GalleryTable::setGalleryTitle($page_post_id, $theme_para_id, $gal_no, $title, $blogid);
	
	$msg['cmd'] = 9;
	$msg['result'] = $result > 0 ? 'ok' : 'fail';

	CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

function addImageToGallery($image_id, $page_id, $slot_no, $gal_no, $theme_para_id){

	checkPageValidForBlog($page_id);

	$blog_id = Session::get('apollo_blog_id');			

	//addImageToGallery(53, 3, 0, 0, 408) 
	Logger::debug("addImageToGallery($image_id, $page_id, $slot_no, $gal_no, $theme_para_id)");
	
	$id = GalleryTable::addImageToSlot($image_id, $page_id, $slot_no, $theme_para_id, $gal_no, $blog_id);
	
	if (isset($id) && $id > 0){
		//$msg['cmd'] = 2;
		//$msg['result'] = 'ok';
		//$msg['data'] = $id;
		listImages($page_id, $theme_para_id);
	}
	else {
		$msg['cmd'] = 2;
		$msg['result'] = 'error';
		CommandHelper::sendMessage($msg);	
	}
	
}

// ///////////////////////////////////////////////////////////////////////////////////////

function moveImage($old_slot_no, $new_slot_no, $page_id, $old_gal_no, $new_gal_no, $theme_para_id, $image_id){

	checkPageValidForBlog($page_id);

	Logger::debug("moveImage(old_slot_no=$old_slot_no, new_slot_no=$new_slot_no, page_id=$page_id, gal_no=$gal_no, theme_para_id=$theme_para_id, image_id=$image_id)");

	$blog_id = Session::get('apollo_blog_id');			

	$result = GalleryTable::moveSlot($image_id, $old_slot_no, $new_slot_no, $page_id, $theme_para_id, $old_gal_no, $new_gal_no, $blog_id);
		
	$msg['cmd'] = 3;
	
	if (!$result){
		$msg['result'] = 'fail';
		CommandHelper::sendMessage($msg);	
	}	
	else {
		$msg['result'] = 'ok';
		listImages($page_id, $theme_para_id);
	} 
		
}

// ///////////////////////////////////////////////////////////////////////////////////////

function removeImage($image_id, $page_id, $gal_no, $theme_para_id, $slot_no){
	
	checkPageValidForBlog($page_id);
	
	$blog_id = Session::get('apollo_blog_id');			
	
	GalleryTable::removeImage($image_id, $page_id, $slot_no, $theme_para_id, $gal_no, $blog_id);

	$msg['cmd'] = 4;
	$msg['result'] = 'ok';

	CommandHelper::sendMessage($msg);	
}

// ///////////////////////////////////////////////////////////////////////////////////////


?>