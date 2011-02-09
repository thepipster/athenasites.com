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
$site_id = CommandHelper::getPara('site_id', true, CommandHelper::$PARA_TYPE_NUMERIC);

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

	case "addImage" : // Process a new file upload
		$image_id = CommandHelper::getPara('image_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$page_id = CommandHelper::getPara('page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$slot_no = CommandHelper::getPara('slot_no', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$gal_no = CommandHelper::getPara('gallery_no', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$theme_para_id = CommandHelper::getPara('theme_para_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		addImageToGallery($site_id, $image_id, $page_id, $slot_no, $gal_no, $theme_para_id);
		break;

	case "moveImage" : // Process a new file upload
		$old_slot_no = CommandHelper::getPara('old_slot_no', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$new_slot_no = CommandHelper::getPara('new_slot_no', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$page_id = CommandHelper::getPara('page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$old_gal_no = CommandHelper::getPara('old_gallery_no', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$new_gal_no = CommandHelper::getPara('new_gallery_no', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$theme_para_id = CommandHelper::getPara('theme_para_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$image_id = CommandHelper::getPara('image_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		moveImage($site_id, $old_slot_no, $new_slot_no, $page_id, $old_gal_no, $new_gal_no, $theme_para_id, $image_id);
		break;

	case "removeImage" : 
		$image_id = CommandHelper::getPara('image_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$page_id = CommandHelper::getPara('page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$gal_no = CommandHelper::getPara('gallery_no', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$theme_para_id = CommandHelper::getPara('theme_para_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$slot_no = CommandHelper::getPara('slot_no', true, CommandHelper::$PARA_TYPE_NUMERIC);
		removeImage($site_id, $image_id, $page_id, $gal_no, $theme_para_id, $slot_no);
		break;

	case "addMultiGal" : 
		$page_id = CommandHelper::getPara('page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$theme_para_id = CommandHelper::getPara('theme_para_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		addMultiGal($site_id, $page_id, $theme_para_id);
		break;

	case "deleteMultiGal" :
		$page_id = CommandHelper::getPara('page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$theme_para_id = CommandHelper::getPara('theme_para_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$gallery_number = CommandHelper::getPara('gallery_no', true, CommandHelper::$PARA_TYPE_NUMERIC);
		deleteMultiGal($site_id, $page_id, $theme_para_id, $gallery_number);
		break;
		
	case "setGalThumb" :
		$image_id = CommandHelper::getPara('image_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$page_id = CommandHelper::getPara('page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$gal_no = CommandHelper::getPara('gallery_no', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$theme_para_id = CommandHelper::getPara('theme_para_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		assignGalleryThumbnail($site_id, $image_id, $page_id, $gal_no, $theme_para_id);
		break;

	case "setGalTitle" :
		$title = CommandHelper::getPara('title', true, CommandHelper::$PARA_TYPE_STRING);
		$page_id = CommandHelper::getPara('page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$gal_no = CommandHelper::getPara('gallery_no', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$theme_para_id = CommandHelper::getPara('theme_para_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		assignGalleryTitle($site_id, $title, $page_id, $gal_no, $theme_para_id);
		break;

	default :
		CommandHelper::sendTextMessage("Undefined command '$cmd'");
		
}

// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////

function getGalleryImageList($site_id){

	$imageList = array();

	$pages = PagesTable::getPages($site_id);
	
	foreach($pages as $page){

		$page_id = $page['id'];
		
		$gal_images = GalleryTable::getAllImages($page_id, $site_id);	
		
		$no_subgalleries = ThemeTable::getNumberGalleriesForMultiGallery($site_id, $page_id);
	
		if (!isset($no_subgalleries) || $no_subgalleries == 0) $no_subgalleries = 1;
		
		if (isset($gal_images)){	
			foreach($gal_images as $gal_image){
			
				$image = MediaTable::getMedia($site_id, $gal_image['image_id']);
				
				$temp = array();
				$temp['id'] = $gal_image['id'];			
				$temp['image_id'] = $image['id'];
				$temp['slot_number'] = $gal_image['slot_number'];
				$temp['gallery_number'] = $gal_image['gallery_number'];
				$temp['page_id'] = $gal_image['page_id'];
				$temp['theme_para_id'] = $gal_image['theme_para_id'];
								
				$imageList[] = $temp;
			}
		}

	}
	
	return $imageList;
}

// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////

function getAll($site_id){
		
	$msg = array();	
	$msg['cmd'] = 'getAll';
	$msg['result'] = 'ok';			
	$msg['data'] = array('gallery_images' => getGalleryImageList($site_id), 'gallery_meta' => GalleryTable::getAllMeta($site_id));
				
	CommandHelper::sendMessage($msg);		

}

// ///////////////////////////////////////////////////////////////////////////////////////

function addMultiGal($site_id, $page_post_id, $theme_para_id){
		
	// Get the current number of sub-galleries
	$no_galleries = PageParasTable::getParaValue($page_post_id, $theme_para_id, $site_id);
				
	if (!isset($no_galleries)){
		$result = PageParasTable::createParaValue($site_id, $page_post_id, $theme_para_id, 1);
		$gallery_number = 1;
	}
	else {
		if ($no_galleries+1 < 99){
			$gallery_number = $no_galleries+1;
			$result = PageParasTable::updateParaValue($site_id, $page_post_id, $theme_para_id, $gallery_number);
		}	
	}
	
	// Create entry in GalleryMeta table
	GalleryTable::setGalleryTitle($page_post_id, $theme_para_id, $gallery_number, '', $site_id);			
			
	$data = array();
	$data['theme_para_id'] = $theme_para_id;
	$data['page_post_id'] = $page_post_id;
	
	$msg = array();
	
	$msg['cmd'] = 'addMultiGal';
	$msg['result'] = $result > 0 ? 'ok' : 'fail';
	$msg['data'] = $data;

	CommandHelper::sendMessage($msg);
		
}

// ///////////////////////////////////////////////////////////////////////////////////////

function deleteMultiGal($site_id, $page_post_id, $theme_para_id, $gallery_number){

	$msg['cmd'] = 'deleteMultiGal';
	
	// Update the sub-gallery count...............
	
	// Get the current number of sub-galleries
	$no_subgalleries = PageParasTable::getParaValue($page_post_id, $theme_para_id, $site_id);
				
	if ($no_subgalleries > 1){

		PageParasTable::updateParaValue($site_id, $page_post_id, $theme_para_id, $no_subgalleries-1);
		GalleryTable::deleteSubGallery($page_post_id, $theme_para_id, $gallery_number, $site_id);		
		
		$msg['result'] = 'ok';
	}	
	else {
		$msg['result'] = 'fail';
	}	
	
	CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

function assignGalleryThumbnail($site_id, $image_post_id, $page_post_id, $gal_no, $theme_para_id){
		
	$result = GalleryTable::setGalleryThumbnail($page_post_id, $theme_para_id, $gal_no, $image_post_id, $site_id);

	$msg['cmd'] = 'setGalleryThumb';
	$msg['result'] = $result > 0 ? 'ok' : 'fail';

	CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

function assignGalleryTitle($site_id, $title, $page_post_id, $gal_no, $theme_para_id){
	
	$result = GalleryTable::setGalleryTitle($page_post_id, $theme_para_id, $gal_no, $title, $site_id);
	
	$msg['cmd'] = 'setGalleryTitle';
	$msg['result'] = $result > 0 ? 'ok' : 'fail';

	CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

function addImageToGallery($site_id, $image_id, $page_id, $slot_no, $gal_no, $theme_para_id){

	//addImageToGallery(53, 3, 0, 0, 408) 
	//Logger::debug("addImageToGallery($site_id, $image_id, $page_id, $slot_no, $gal_no, $theme_para_id)");
	
	$id = GalleryTable::addImageToSlot($image_id, $page_id, $slot_no, $theme_para_id, $gal_no, $site_id);
	
	$msg['cmd'] = 'addImage';
	$msg['result'] = $id > 0 ? 'ok' : 'fail';
	//$msg['data'] = array('image_id' => $image_id, 'slot_no' => $slot_no);
	$msg['data'] = array('gallery_images' => getGalleryImageList($site_id), 'gallery_meta' => GalleryTable::getAllMeta($site_id));

	CommandHelper::sendMessage($msg);
	
}

// ///////////////////////////////////////////////////////////////////////////////////////

function moveImage($site_id, $old_slot_no, $new_slot_no, $page_id, $old_gal_no, $new_gal_no, $theme_para_id, $image_id){

	//Logger::debug("moveImage(old_slot_no=$old_slot_no, new_slot_no=$new_slot_no, page_id=$page_id, gal_no=$gal_no, theme_para_id=$theme_para_id, image_id=$image_id)");

	$result = GalleryTable::moveSlot($image_id, $old_slot_no, $new_slot_no, $page_id, $theme_para_id, $old_gal_no, $new_gal_no, $site_id);
		
	$msg['cmd'] = 'moveImage';
	
	if (!$result){
		$msg['result'] = 'fail';
	}	
	else {
		$msg['result'] = 'ok';
		//$msg['data'] = array('image_id' => $image_id, 'slot_no' => $new_slot_no);
		$msg['data'] = array('gallery_images' => getGalleryImageList($site_id), 'gallery_meta' => GalleryTable::getAllMeta($site_id));
	} 

	CommandHelper::sendMessage($msg);
		
}

// ///////////////////////////////////////////////////////////////////////////////////////

function removeImage($site_id, $image_id, $page_id, $gal_no, $theme_para_id, $slot_no){
			
	GalleryTable::removeImageFromSlot($image_id, $page_id, $slot_no, $theme_para_id, $gal_no, $site_id);

	$msg['cmd'] = 'removeImage';
	$msg['result'] = 'ok';
	$msg['data'] = array('slot_no' => $slot_no);
	//$msg['data'] = array('gallery_images' => getGalleryImageList($site_id), 'gallery_meta' => GalleryTable::getAllMeta($site_id));

	CommandHelper::sendMessage($msg);	
}

// ///////////////////////////////////////////////////////////////////////////////////////


?>