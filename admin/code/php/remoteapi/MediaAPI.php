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

	case "getFolders":
		getFolders($site_id); 
		break;			

	case "getMedia":
		getImages($site_id); 
		break;			

	case "updatePage":
		$page_id = CommandHelper::getPara('page_id', true, CommandHelper::$PARA_TYPE_STRING);
		$title = CommandHelper::getPara('title', true, CommandHelper::$PARA_TYPE_STRING);
		$slug = CommandHelper::getPara('slug', true, CommandHelper::$PARA_TYPE_STRING);
		$path = CommandHelper::getPara('path', true, CommandHelper::$PARA_TYPE_STRING);
		$parent_page_id = CommandHelper::getPara('parent_page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$content = CommandHelper::getPara('content', true, CommandHelper::$PARA_TYPE_STRING);
		$status = CommandHelper::getPara('status', true, CommandHelper::$PARA_TYPE_STRING);
		$template = CommandHelper::getPara('template_id', true, CommandHelper::$PARA_TYPE_STRING);
		$order = CommandHelper::getPara('order', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$ishome = CommandHelper::getPara('ishome', true, CommandHelper::$PARA_TYPE_NUMERIC);
		updatePage($site_id, $page_id, $title, $parent_page_id, $content, $status, $template, $slug, $path, $order, $ishome);
		break;
		
	case "addPage":
		$title = CommandHelper::getPara('title', true, CommandHelper::$PARA_TYPE_STRING);
		$slug = CommandHelper::getPara('slug', true, CommandHelper::$PARA_TYPE_STRING);
		$path = CommandHelper::getPara('path', true, CommandHelper::$PARA_TYPE_STRING);
		$parent_page_id = CommandHelper::getPara('parent_page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$content = CommandHelper::getPara('content', true, CommandHelper::$PARA_TYPE_STRING);
		$status = CommandHelper::getPara('status', true, CommandHelper::$PARA_TYPE_STRING);
		$template = CommandHelper::getPara('template_id', true, CommandHelper::$PARA_TYPE_STRING);
		$order = CommandHelper::getPara('order', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$ishome = CommandHelper::getPara('ishome', true, CommandHelper::$PARA_TYPE_NUMERIC);
		addPage($site_id, $title, $parent_page_id, $content, $status, $template, $slug, $path, $order, $ishome);
		break;
		
	case "addFolder":
		$folder_name = CommandHelper::getPara('folder_name', true, CommandHelper::$PARA_TYPE_STRING);
		addFolder($site_id, $folder_name);
		break;

	case "deleteFolder":
		$folder_id = CommandHelper::getPara('folder_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		deleteFolder($site_id, $folder_id);
		break;

	case "renameFolder":
		$folder_id = CommandHelper::getPara('folder_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$new_folder_name = CommandHelper::getPara('folder_name', true, CommandHelper::$PARA_TYPE_STRING);
		renameFolder($site_id, $folder_id, $new_folder_name);
		break;
			
	case "addMediaToFolder" :
		$media_id = CommandHelper::getPara('media_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$folder_id = CommandHelper::getPara('folder_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		addMediaToFolder($site_id, $media_id, $folder_id);
		break;
					
	case "saveMediaInfo":
		$title = CommandHelper::getPara('title', true, CommandHelper::$PARA_TYPE_STRING);
		$desc = CommandHelper::getPara('desc', true, CommandHelper::$PARA_TYPE_STRING);
		$tags = CommandHelper::getPara('tags', true, CommandHelper::$PARA_TYPE_STRING);
		saveMediaInfo($site_id, $title, $desc, $tags);
		break;			
			
	default :
		CommandHelper::sendTextMessage("Undefined command '$cmd'");
		
}

// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////

function updatePage($site_id, $page_id, $title, $parent_page_id, $content, $status, $tamplate_name, $slug, $path, $order, $ishome){

	Logger::debug("updatePage(page_id=$page_id, site_id=$site_id, title=$title, parent_page_id=$parent_page_id, content=$content, status=$status, tamplate_name=$tamplate_name, slug=$slug, path=$path)");
	
	$user_id = SecurityUtils::getCurrentUserID();
	
	PagesTable::update($page_id, $user_id, $site_id, $parent_page_id, $content, $status, $title, $tamplate_name, $slug, $path, $order, $ishome);
		
	$page_data = PagesTable::getPage($site_id, $page_id);
	if (isset($page_data[0])){
		$page = $page_data[0];
		$page['last_edit'] = date("m/d/Y H:i", strtotime($page['last_edit'])); // Convert to JS compatible date
		$page['created'] = date("m/d/Y H:i", strtotime($page['created'])); // Convert to JS compatible date
	}

	$msg['cmd'] = "addPage";
	$msg['result'] = $page_id > 0 ? 'ok' : 'fail';
	$msg['data'] = array('page' => $page);
	
	CommandHelper::sendMessage($msg);	
}

// ///////////////////////////////////////////////////////////////////////////////////////

function addPage($site_id, $title, $parent_page_id, $content, $status, $tamplate_name, $slug, $path, $order, $ishome){

	//Logger::debug("addPage(site_id=$site_id, title=$title, parent_page_id=$parent_page_id, content=$content, status=$status, tamplate_name=$tamplate_name, slug=$slug, path=$path)");
	
	$user_id = SecurityUtils::getCurrentUserID();
	
	$page_id = PagesTable::create($user_id, $site_id, $parent_page_id, $content, $status, $title, $tamplate_name, $slug, $path, $order, $ishome);
		
	$page_data = PagesTable::getPage($site_id, $page_id);
	if (isset($page_data[0])){
		$page = $page_data[0];
		$page['last_edit'] = date("m/d/Y H:i", strtotime($page['last_edit'])); // Convert to JS compatible date
		$page['created'] = date("m/d/Y H:i", strtotime($page['created'])); // Convert to JS compatible date
	}
			
	$msg['cmd'] = "addPage";
	$msg['result'] = $page_id > 0 ? 'ok' : 'fail';
	$msg['data'] = array('page' => $page);
	
	CommandHelper::sendMessage($msg);	
	
}

// ///////////////////////////////////////////////////////////////////////////////////////

function addMediaToFolder($site_id, $media_id, $folder_id){

	//Logger::debug("addMediaToFolder(site_id = $site_id, media_id = $media_id, folder_id = $folder_id)");
	
	// Is the media already in this folder?
	$current_folder_id = FolderTable::getMediaFolderID($media_id, $site_id);
		
	if (isset($current_folder_id) && $current_folder_id == $folder_id){
		$msg['result'] = 'duplicate';			
	}	
	else {
		
		// If this was added to the 'unassigned' or 'all' folder, remove
		if ($folder_id == 0 || $folder_id == 1){
			$res = FolderTable::removeMedia($media_id, $site_id);
		}
		else {
			$res = FolderTable::addMediaToFolder($folder_id, $media_id, $site_id);
		}	
		
		$msg['result'] = $res > 0 ? 'ok' : 'fail';
	}
	
	$msg['cmd'] = "addMediaToFolder";
	$msg['data'] = array('folder_id' => $folder_id, 'media_id' => $media_id);

	CommandHelper::sendMessage($msg);	
}

// ///////////////////////////////////////////////////////////////////////////////////////

function renameFolder($site_id, $folder_id, $name){
				
	$res = FolderTable::renameFolder($site_id, $folder_id, $name);
			
	$msg['cmd'] = "renameFolder";
	$msg['result'] = $res > 0 ? 'ok' : 'fail';
	$msg['data'] = array('name' => $name, 'id' => $folder_id);

	CommandHelper::sendMessage($msg);	
}

// ///////////////////////////////////////////////////////////////////////////////////////

function deleteFolder($site_id, $folder_id){
				
	$res = FolderTable::deleteFolder($site_id, $folder_id);
			
	$msg['cmd'] = "deleteFolder";
	$msg['result'] = 'ok';
	$msg['data'] = array('id' => $folder_id);

	CommandHelper::sendMessage($msg);	
}

// ///////////////////////////////////////////////////////////////////////////////////////

function addFolder($site_id, $folder_name){

	// Get the folder list.........
	$id = FolderTable::addFolder($folder_name, $site_id);
		
	$msg = array();	
	$msg['cmd'] = 'addFolder';
	
	if ($id > 0){
		$msg['result'] = 'ok';			
		$msg['data'] = array('name' => $folder_name, 'id' => $id);
	}
	else {
		$msg['result'] = 'fail';			
	}
				
	CommandHelper::sendMessage($msg);	
}

// ///////////////////////////////////////////////////////////////////////////////////////

function getAll($site_id){

	// Get the folder list.........
	$folder_list = FolderTable::getFoldersForSite($site_id);
	
	// Get the media list
	$media_list = FolderTable::getMediaForSite($site_id);

	// Get the page list
	$page_list = PagesTable::getPages($site_id);
		
	$page_data = array();
	foreach ($page_list as $page){
		$temp = $page;
		$temp['last_edit'] = date("m/d/Y H:i", strtotime($page['last_edit'])); // Convert to JS compatible date
		$temp['created'] = date("m/d/Y H:i", strtotime($page['created'])); // Convert to JS compatible date
		$page_data[] = $temp;
	}	
	
	$media_data = array();
	foreach ($media_list as $media){
		$temp = $media;
		$temp['created'] = date("m/d/Y H:i", strtotime($media['created'])); // Convert to JS compatible date
		$media_data[] = $temp;
	}
		
	$msg = array();	
	$msg['cmd'] = 'getAll';
	$msg['result'] = 'ok';			
	$msg['data'] = array('folders' => $folder_list, 'media' => $media_data, 'pages' => $page_data);
				
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