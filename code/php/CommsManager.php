<?php

// ///////////////////////////////////////////////////////////////////////////////////////
//
// Includes
//
// ///////////////////////////////////////////////////////////////////////////////////////

// Buffer output, don't echo anything yet!
ob_start();

//error_log("Entering CommsManager...");

global $blog_downloads_root;

$discRoot = realpath(dirname(__FILE__)) . "/";
$common_code_root = substr($discRoot, 0, strpos($discRoot, 'wp-content')) . 'wp-content/CommonCode/';
$wp_root = substr($discRoot, 0, strpos($discRoot, 'wp-content')) . '/';
$blog_downloads_root = substr($discRoot, 0, strpos($discRoot, 'wp-content')) . 'wp-content/blogs.dir/';

require_once($wp_root . 'wp-load.php');
require_once($wp_root . 'wp-admin/includes/admin.php');

require_once($common_code_root . 'php/utils/Session.class.php');
require_once($common_code_root . 'php/utils/ApolloLogger.class.php');
require_once($common_code_root . 'php/utils/Browser.class.php');
require_once($common_code_root . 'php/utils/CommandHelper.class.php');
require_once($common_code_root . 'php/dal/GalleryTable.class.php');
require_once($common_code_root . 'php/dal/ThemeTable.class.php');
require_once($common_code_root . 'php/dal/PageParasTable.class.php');
require_once($common_code_root . 'php/dal/GlobalParasTable.class.php');


// ///////////////////////////////////////////////////////////////////////////////////////
//
// Authenticate
//
// ///////////////////////////////////////////////////////////////////////////////////////

if (!Session::get("apollo_user_logged_in")){
	
	$msg['cmd'] = 0;
	$msg['result'] = 'not authorized!';

	CommandHelper::sendMessage($msg);	
	Logger::fatal("Not authorized! " . $_SERVER['HTTP_REFERER'] . " " . $_SERVER['HTTP_USER_AGENT']);
	die();
	
}


// ///////////////////////////////////////////////////////////////////////////////////////
//
// Process Global Commands
//
// ///////////////////////////////////////////////////////////////////////////////////////

CommandHelper::init();

// ///////////////////////////////////////////////////////////////////////////////////////
//
// Process command
//
// ///////////////////////////////////////////////////////////////////////////////////////

ob_end_clean();

static $CMD_GET_GALLERY_IMAGE_LIST 		= 1; // Get a list of images that are assigned to a gallery page
static $CMD_ADD_IMAGE_TO_GAL 			= 2;
static $CMD_MOVE_GAL_IMAGE 				= 3;
static $CMD_REMOVE_GAL_IMAGE 			= 4;
static $CMD_ADD_MULTIGAL				= 7; // Add a gallery to a multi-gallery object
static $CMD_DELETE_MULTIGAL				= 18; // Delete a gallery for a multi-gallery object

static $CMD_ASSIGN_GLOBAL_PARA			= 5; // Assign a global para
static $CMD_ASSIGN_PAGE_PARA			= 6; // Assign a page para
static $CMD_ASSIGN_GALLERY_THUMB		= 8; 
static $CMD_ASSIGN_GALLERY_TITLE		= 9;

static $CMD_ADD_MEDIA_TO_FOLDER			= 10;
static $CMD_RENAME_FOLDER				= 11;
static $CMD_ADD_FOLDER					= 12;
static $CMD_DELETE_FOLDER				= 14;

static $CMD_UPDATE_IMAGE_INFO			= 15;
static $CMD_DELETE_IMAGE				= 16;
static $CMD_GET_IMAGE_INFO				= 17;


static $CMD_UPDATE_DOMAIN				= 101;
static $CMD_RESET_DOMAIN				= 102;

// Get the command type....
$cmd = CommandHelper::getPara('cmd', true, CommandHelper::$PARA_TYPE_NUMERIC);

Logger::debug(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Command: $cmd");

// Handle the report request type
switch($cmd){

	// Gallery Management................
		
	case $CMD_GET_GALLERY_IMAGE_LIST : // Get the images for the given page (gallery)	
		$page_id = CommandHelper::getPara('page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$theme_para_id = CommandHelper::getPara('theme_para_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		listImages($page_id, $theme_para_id);			
		break;

	case $CMD_ADD_IMAGE_TO_GAL : // Process a new file upload
		$image_id = CommandHelper::getPara('image_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$page_id = CommandHelper::getPara('page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$slot_no = CommandHelper::getPara('slot_no', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$gal_no = CommandHelper::getPara('gallery_no', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$theme_para_id = CommandHelper::getPara('theme_para_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		addImageToGallery($image_id, $page_id, $slot_no, $gal_no, $theme_para_id);
		break;

	case $CMD_MOVE_GAL_IMAGE : // Process a new file upload
		$old_slot_no = CommandHelper::getPara('old_slot_no', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$new_slot_no = CommandHelper::getPara('new_slot_no', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$page_id = CommandHelper::getPara('page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$old_gal_no = CommandHelper::getPara('old_gallery_no', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$new_gal_no = CommandHelper::getPara('new_gallery_no', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$theme_para_id = CommandHelper::getPara('theme_para_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$image_id = CommandHelper::getPara('image_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		moveImage($old_slot_no, $new_slot_no, $page_id, $old_gal_no, $new_gal_no, $theme_para_id, $image_id);

		//$url = CommandHelper::getPara('url', true, CommandHelper::$PARA_TYPE_STRING);
		//$image_id = CommandHelper::getPara('image_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		//moveImage($image_id, $page_id, $slot_no, $url, $gal_no, $theme_para_id);
		break;

	case $CMD_REMOVE_GAL_IMAGE : 
		$image_id = CommandHelper::getPara('image_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$page_id = CommandHelper::getPara('page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$gal_no = CommandHelper::getPara('gallery_no', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$theme_para_id = CommandHelper::getPara('theme_para_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$slot_no = CommandHelper::getPara('slot_no', true, CommandHelper::$PARA_TYPE_NUMERIC);
		removeImage($image_id, $page_id, $gal_no, $theme_para_id, $slot_no);
		break;

	case $CMD_ADD_MULTIGAL : 
		$page_id = CommandHelper::getPara('page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$theme_para_id = CommandHelper::getPara('theme_para_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		addMultiGal($page_id, $theme_para_id);
		break;

	case $CMD_DELETE_MULTIGAL :
		$page_id = CommandHelper::getPara('page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$theme_para_id = CommandHelper::getPara('theme_para_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$gallery_number = CommandHelper::getPara('gallery_no', true, CommandHelper::$PARA_TYPE_NUMERIC);
		deleteMultiGal($page_id, $theme_para_id, $gallery_number);
		break;
		
	case $CMD_ASSIGN_GALLERY_THUMB :
		$image_id = CommandHelper::getPara('image_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$page_id = CommandHelper::getPara('page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$gal_no = CommandHelper::getPara('gallery_no', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$theme_para_id = CommandHelper::getPara('theme_para_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		assignGalleryThumbnail($image_id, $page_id, $gal_no, $theme_para_id);
		break;

	case $CMD_ASSIGN_GALLERY_TITLE :
		$title = CommandHelper::getPara('title', true, CommandHelper::$PARA_TYPE_STRING);
		$page_id = CommandHelper::getPara('page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$gal_no = CommandHelper::getPara('gallery_no', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$theme_para_id = CommandHelper::getPara('theme_para_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		assignGalleryTitle($title, $page_id, $gal_no, $theme_para_id);
		break;

	// Para management..............

	case $CMD_ASSIGN_GLOBAL_PARA : 
		$blog_id = CommandHelper::getPara('blog_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$theme_para_id = CommandHelper::getPara('theme_para_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$new_value = CommandHelper::getPara('para_value', true, CommandHelper::$PARA_TYPE_STRING);
		assignGlobalPara($blog_id, $theme_para_id, $new_value);
		break;

	case $CMD_ASSIGN_PAGE_PARA : 
		$page_post_id = CommandHelper::getPara('page_post_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$theme_para_id = CommandHelper::getPara('theme_para_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$new_value = CommandHelper::getPara('para_value', true, CommandHelper::$PARA_TYPE_STRING);
		assignPagePara($page_post_id, $theme_para_id, $new_value);
		break;

	case $CMD_ADD_MEDIA_TO_FOLDER :
		$media_post_id = CommandHelper::getPara('media_post_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$folder_id = CommandHelper::getPara('folder_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		addMediaToFolder($media_post_id, $folder_id);
		break;
	
	case $CMD_RENAME_FOLDER :
		$folder_id = CommandHelper::getPara('folder_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$name = CommandHelper::getPara('folder_name', true, CommandHelper::$PARA_TYPE_STRING);
		renameFolder($folder_id, stripTags($name));
		break;
	
	case $CMD_ADD_FOLDER :
		$name = CommandHelper::getPara('folder_name', true, CommandHelper::$PARA_TYPE_STRING);
		addFolder(stripTags($name));
		break;

	case $CMD_DELETE_FOLDER :
		$folder_id = CommandHelper::getPara('folder_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		deleteFolder($folder_id);
		break;
		
	// Image updating.........

	case $CMD_UPDATE_IMAGE_INFO :
		$title = stripTags(CommandHelper::getPara('title', true, CommandHelper::$PARA_TYPE_STRING));
		$caption = stripTags(CommandHelper::getPara('caption', true, CommandHelper::$PARA_TYPE_STRING));
		$desc = stripTags(CommandHelper::getPara('description', true, CommandHelper::$PARA_TYPE_STRING));
		$alt_text = stripTags(CommandHelper::getPara('alt_text', true, CommandHelper::$PARA_TYPE_STRING));
		$image_post_id = CommandHelper::getPara('image_post_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		updateImageInfo($image_post_id, $title, $caption, $desc, $alt_text);
		break;	

	case $CMD_GET_IMAGE_INFO :
		$image_post_id = CommandHelper::getPara('image_post_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		getImageInfo($image_post_id);
		break;	

	//case $CMD_DELETE_IMAGE :
	//	$image_post_id = CommandHelper::getPara('image_post_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
	//	deleteImage($image_post_id);
	//	break;	
		
	case $CMD_UPDATE_DOMAIN :
		$new_domain = stripTags(CommandHelper::getPara('domain', true, CommandHelper::$PARA_TYPE_STRING));
		$site_id = CommandHelper::getPara('site_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$blog_id = CommandHelper::getPara('blog_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		updateDomain($new_domain, $site_id, $blog_id);
		break;	

	case $CMD_RESET_DOMAIN :
		$site_id = CommandHelper::getPara('site_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$blog_id = CommandHelper::getPara('blog_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		resetDomain($site_id, $blog_id);
		break;	
			
	default:
		Logger::fatal($cmd, "Command $cmd is not supported yet!");
		break;

}

// ///////////////////////////////////////////////////////////////////////////////////////
//
// Methods
//
// ///////////////////////////////////////////////////////////////////////////////////////

function stripTags($text){
	//$text = mysql_real_escape_string($text);
	Logger::debug("stripTags($text)");	
	$tags = array("\\");
	$replace   = array("");
	return str_replace($tags, $replace, $text);
}

/**
* Check to make sure the given page belongs to the given blog. If not, quit and send 
* not authorized error message
*/
function checkPageValidForBlog($post_id){
	
	global $wpdb;

	$blogid = Session::get('apollo_blog_id');
	//Logger::debug("Blog ID: $blogid Post ID: $post_id");
		
	$sql = $wpdb->prepare("SELECT ID FROM wp_%d_posts WHERE ID=%d",  $blogid, $post_id ); 			
	$found_id = $wpdb->get_var($sql);		
	
	if (!isset($found_id) || $found_id != $post_id){
		$msg['cmd'] = 0;
		$msg['result'] = 'not authorized!';
		CommandHelper::sendMessage($msg);	
		Logger::fatal("Attempted unauthorized access!");
		die();
	}

}

/**
* Check to see if the given blog_id matches the current logged on user
*/
function checkValidBlog($blog_id){

	if ($blog_id != Session::get('apollo_blog_id')){
		$msg['cmd'] = 0;
		$msg['result'] = 'not authorized!';
		CommandHelper::sendMessage($msg);	
		Logger::fatal("Attempted unauthorized access!");
		die();
	}
}

/**
* Check to see if folder belongs to user
*/
function checkValidFolder($folder_id){
	
	global $wpdb;

	$blogid = Session::get('apollo_blog_id');
		
	$sql = $wpdb->prepare("SELECT id FROM apollo_Folders WHERE blog_id=%d AND id=%d",  $blogid, $folder_id ); 			
	Logger::debug($sql);
	$found_id = $wpdb->get_var($sql);		
	
	if (!isset($found_id) || $found_id != $folder_id){
		$msg['cmd'] = 0;
		$msg['result'] = 'not authorized!';
		CommandHelper::sendMessage($msg);	
		Logger::fatal("Attempted unauthorized access!");
		die();
	}

}

// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////

function updateDomain($new_domain, $site_id, $blog_id){

	// If the logged in user is not a site admin, then quit
	if (!is_site_admin()) {
		$msg['cmd'] = 101;
		$msg['result'] = 'unauthorized';	
		CommandHelper::sendMessage($msg);
		return;
	}
	
	// If the site id is 1, then this is a default domain
	// If the site id is not 2, then there is already an entry for this domain so this
	// is an update

	if ($site_id == 1){
		WordPressHelper::setDomain($blog_id, $new_domain, $site_id, false);
	}
	else {
		WordPressHelper::setDomain($blog_id, $new_domain, $site_id, true);
	}
	
	$msg['cmd'] = 101;
	$msg['result'] = 'ok';

	CommandHelper::sendMessage($msg);
	
}

// ///////////////////////////////////////////////////////////////////////////////////////

function resetDomain($site_id, $blog_id){

	// If the logged in user is not a site admin, then quit
	if (!is_site_admin()) {
		$msg['cmd'] = 102;
		$msg['result'] = 'unauthorized';	
		CommandHelper::sendMessage($msg);
		return;
	}

	WordPressHelper::resetDomain($blog_id, $site_id);
	
	$msg['cmd'] = 102;
	$msg['result'] = 'ok';

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

function assignGlobalPara($blog_id, $theme_para_id, $new_value){

	//Logger::debug("assignGlobalPara($blog_id, $theme_para_id, $new_value)");

	checkValidBlog($blog_id);
	
	$result = GlobalParasTable::setGlobalParaValue($blog_id, $theme_para_id, $new_value);
			
	Logger::debug("Result: $result");
			
	$msg = array();
	
	$msg['cmd'] = 5;
	$msg['result'] = $result > 0 ? 'ok' : 'fail';

	CommandHelper::sendMessage($msg);		

}

// ///////////////////////////////////////////////////////////////////////////////////////


function assignPagePara($page_post_id, $theme_para_id, $new_value){

	//Logger::debug("assignPagePara($page_post_id, $theme_para_id, $new_value)");
	
	checkPageValidForBlog($page_post_id);

	$blogid = Session::get('apollo_blog_id');

	$id = PageParasTable::setParaValue($blogid, $page_post_id, $theme_para_id, $new_value);
	
	$msg = array();
	
	$msg['cmd'] = 6;
	$msg['result'] = $id > 0 ? 'ok' : 'fail';

	CommandHelper::sendMessage($msg);		

}

// ///////////////////////////////////////////////////////////////////////////////////////

/**
 * Return a list of files, as if it was a file system where folders
 * are directories and contents are files
 * @return 
 */
function listImages($page_id, $theme_para_id){

	checkPageValidForBlog($page_id);

	global $blog_downloads_root;

	//Logger::debug("listImages($page_id, $theme_para_id)");
	$blog_id = Session::get('apollo_blog_id');			
	
	$imageList = array();
	
	$images = GalleryTable::getImages($page_id, $theme_para_id, $blog_id);
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

function addMediaToFolder($media_post_id, $folder_id){
	
	//Logger::debug("addMediaToFolder($media_post_id, $folder_id)");
	
	checkPageValidForBlog($media_post_id);

	$blog_id = Session::get('apollo_blog_id');			
		
	// Is the media already in this folder?
	$current_folder_id = FolderTable::getMediaFolderID($media_post_id, $blog_id);
		
	if (isset($current_folder_id) && $current_folder_id == $folder_id){
		$msg['result'] = 'duplicate';			
	}	
	else {
		
		// If this was added to the 'unassigned' or 'all' folder, remove
		if ($folder_id == 0 || $folder_id == 1){
			$res = FolderTable::removeMedia($media_post_id, $blog_id);
		}
		else {
			$res = FolderTable::addMediaToFolder($folder_id, $media_post_id, $blog_id);
		}	
		
		$msg['result'] = $res > 0 ? 'ok' : 'fail';
	}
	
	$msg['cmd'] = 10;
	$msg['media_post_id'] = $media_post_id;
	$msg['folder_id'] = $folder_id;

	//Logger::dump($msg);

	CommandHelper::sendMessage($msg);	
}

// ///////////////////////////////////////////////////////////////////////////////////////

function addFolder($name){
				
	$blog_id = Session::get('apollo_blog_id');			
	$id = FolderTable::addFolder($name, $blog_id);
			
	$msg['cmd'] = 12;
	$msg['result'] = $id > 0 ? 'ok' : 'fail';
	$msg['folder_id'] = $id;

	CommandHelper::sendMessage($msg);	
}

// ///////////////////////////////////////////////////////////////////////////////////////

function renameFolder($folder_id, $name){
	
	Logger::debug("Name: $name");
	checkValidFolder($folder_id);
			
	$res = FolderTable::renameFolder($folder_id, $name);
			
	$msg['cmd'] = 11;
	$msg['result'] = $res > 0 ? 'ok' : 'fail';

	CommandHelper::sendMessage($msg);	
}

// ///////////////////////////////////////////////////////////////////////////////////////

function deleteFolder($folder_id){
	
	checkValidFolder($folder_id);
			
	$res = FolderTable::deleteFolder($folder_id);
			
	$msg['cmd'] = 14;
	$msg['result'] = 'ok';

	CommandHelper::sendMessage($msg);	
}

// ///////////////////////////////////////////////////////////////////////////////////////

function updateImageInfo($image_post_id, $title, $caption, $desc, $alt_text){
	
	Logger::debug("updateImageInfo($image_post_id, $title, $caption, $desc, $alt_text)");
	
	checkPageValidForBlog($image_post_id);

/*
	$post = get_post($image_post_id, 'ARRAY_A');
	
	$post['ID'] = $image_post_id;
			
	$post['post_title'] = $title;
	$post['post_excerpt'] = $caption;
	$post['post_content'] = $desc;
//	$post['post_status'] = 'publish'		
			
	Logger::dump($post);
	
	$res = wp_update_post( $post );
*/			
	global $wpdb;				
	$blog_id = Session::get('apollo_blog_id');			
		
	$sql = $wpdb->prepare("UPDATE wp_%d_posts SET post_title = %s, post_excerpt = %s, post_content = %s WHERE ID = %d", $blog_id, $title, $caption, $desc, $image_post_id);
	$res = $wpdb->query($sql);		

	// Update alt text........
	
	$sql = $wpdb->prepare("SELECT meta_value FROM wp_%d_postmeta WHERE post_id = %d AND meta_key = '_wp_attachment_image_alt'", $blog_id, $image_post_id);
	$current_alt_text = $wpdb->get_var($sql);	
	
	if (isset($current_alt_text)){
		$wpdb->query($wpdb->prepare("UPDATE wp_%d_postmeta SET meta_value = %s WHERE post_id = %d AND meta_key = '_wp_attachment_image_alt'", $blog_id, $alt_text, $image_post_id));
	}
	else {
		$wpdb->query($wpdb->prepare("INSERT INTO wp_%d_postmeta (post_id, meta_value, meta_key) VALUES (%d, %s, '_wp_attachment_image_alt')", $blog_id, $image_post_id, $alt_text));
	}
	
	
	if ($res > 0){
		$msg['result'] = 'ok';
	}
	else {
		$msg['result'] = 'fail';
	}
						
	$msg['cmd'] = 15;

	CommandHelper::sendMessage($msg);	
}

// ///////////////////////////////////////////////////////////////////////////////////////

function getImageInfo($image_post_id){

	//Logger::debug("getImageInfo($image_post_id)");
	
	checkPageValidForBlog($image_post_id);
	
	$msg = array();	
	$msg['result'] = 'fail';
	
	global $wpdb;				
	$blog_id = Session::get('apollo_blog_id');			
		
	$sql = $wpdb->prepare("SELECT post_mime_type, post_title, post_excerpt, post_content, guid FROM wp_%d_posts WHERE ID = %d", $blog_id, $image_post_id);
	$data = $wpdb->get_results($sql, ARRAY_A);	
	//$post = get_post($image_post_id);

	$sql = $wpdb->prepare("SELECT meta_value FROM wp_%d_postmeta WHERE post_id = %d AND meta_key = '_wp_attachment_image_alt'", $blog_id, $image_post_id);
	$alt_text = $wpdb->get_var($sql);	
	if (!isset($alt_text)) $alt_text = '';
		
	if (isset($data[0])){
	
		$msg['mime_type'] = $data[0]['post_mime_type']; // e.g. image/jpeg
		//$msg['post_date'] =  $post->post_date_gmt; // e.g. 2010-01-22 01:05:59			
		$msg['title'] = htmlentities($data[0]['post_title'], ENT_QUOTES);
		$msg['caption'] = htmlentities($data[0]['post_excerpt'], ENT_QUOTES);
		$msg['desc'] = htmlentities($data[0]['post_content'], ENT_QUOTES);	
		$msg['image_url'] = $data[0]['guid'];
		$msg['alt_text'] = htmlentities($alt_text, ENT_QUOTES);
		$msg['result'] = 'ok';
	}

	
	$msg['cmd'] = 17;

	//Logger::dump($data);
	Logger::dump($msg);
	
	CommandHelper::sendMessage($msg);	

}

// ///////////////////////////////////////////////////////////////////////////////////////

function deleteImage($image_post_id){
	
	checkPageValidForBlog($image_post_id);
			
	if (wp_delete_post($image_post_id)){
		$msg['result'] = 'ok';
	}
	else {
		$msg['result'] = 'fail';
	}

	$msg['cmd'] = 16;
	
	CommandHelper::sendMessage($msg);	
}

// ///////////////////////////////////////////////////////////////////////////////////////
?>