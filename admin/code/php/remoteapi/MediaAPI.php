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

	// POSTS /////////////////////////////////////////////////////////////////////////

	case "deletePost":
		$post_id = CommandHelper::getPara('post_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		deletePage($site_id, $page_id);
		break;
		
	case "updatePost":
		$post_id = CommandHelper::getPara('post_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$title = CommandHelper::getPara('title', true, CommandHelper::$PARA_TYPE_STRING);
		$slug = CommandHelper::getPara('slug', true, CommandHelper::$PARA_TYPE_STRING);
		$content = CommandHelper::getPara('content', true, CommandHelper::$PARA_TYPE_STRING);
		$status = CommandHelper::getPara('status', true, CommandHelper::$PARA_TYPE_STRING);
		$can_comment = CommandHelper::getPara('can_comment', true, CommandHelper::$PARA_TYPE_NUMERIC);
		updatePost($site_id, $post_id, $title, $content, $status, $slug, $can_comment);
		break;
		
	case "addPost":
		$title = CommandHelper::getPara('title', true, CommandHelper::$PARA_TYPE_STRING);
		$slug = CommandHelper::getPara('slug', true, CommandHelper::$PARA_TYPE_STRING);
		$content = CommandHelper::getPara('content', true, CommandHelper::$PARA_TYPE_STRING);
		$status = CommandHelper::getPara('status', true, CommandHelper::$PARA_TYPE_STRING);
		$can_comment = CommandHelper::getPara('can_comment', true, CommandHelper::$PARA_TYPE_NUMERIC);
		addPost($site_id, $title, $content, $status, $slug, $can_comment);
		break;

	case "addTag":
		$tag = CommandHelper::getPara('tag', true, CommandHelper::$PARA_TYPE_STRING);
		$post_id = CommandHelper::getPara('post_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		addTag($site_id, $post_id, $tag);
		break;

	case "addCategory":
		$category = CommandHelper::getPara('category', true, CommandHelper::$PARA_TYPE_STRING);
		$post_id = CommandHelper::getPara('post_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		addCategory($site_id, $post_id, $category);
		break;

	case "removeTag":
		$tag = CommandHelper::getPara('tag', true, CommandHelper::$PARA_TYPE_STRING);
		$post_id = CommandHelper::getPara('post_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		removeTag($site_id, $post_id, $tag);
		break;

	case "removeCategory":
		$category = CommandHelper::getPara('category', true, CommandHelper::$PARA_TYPE_STRING);
		$post_id = CommandHelper::getPara('post_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		removeCategory($site_id, $post_id, $category);
		break;
		
	// PAGES /////////////////////////////////////////////////////////////////////////

	case "deletePage":
		$page_id = CommandHelper::getPara('page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		deletePage($site_id, $page_id);
		break;
		
	case "updatePage":
		$page_id = CommandHelper::getPara('page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$title = CommandHelper::getPara('title', true, CommandHelper::$PARA_TYPE_STRING);
		$slug = CommandHelper::getPara('slug', true, CommandHelper::$PARA_TYPE_STRING);
		$parent_page_id = CommandHelper::getPara('parent_page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$content = CommandHelper::getPara('content', true, CommandHelper::$PARA_TYPE_STRING);
		$status = CommandHelper::getPara('status', true, CommandHelper::$PARA_TYPE_STRING);
		$template = CommandHelper::getPara('template_id', true, CommandHelper::$PARA_TYPE_STRING);
		$order = CommandHelper::getPara('order', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$ishome = CommandHelper::getPara('ishome', true, CommandHelper::$PARA_TYPE_NUMERIC);
		updatePage($site_id, $page_id, $title, $parent_page_id, $content, $status, $template, $slug, $order, $ishome);
		break;
		
	case "addPage":
		$title = CommandHelper::getPara('title', true, CommandHelper::$PARA_TYPE_STRING);
		$slug = CommandHelper::getPara('slug', true, CommandHelper::$PARA_TYPE_STRING);
		$parent_page_id = CommandHelper::getPara('parent_page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$content = CommandHelper::getPara('content', true, CommandHelper::$PARA_TYPE_STRING);
		$status = CommandHelper::getPara('status', true, CommandHelper::$PARA_TYPE_STRING);
		$template = CommandHelper::getPara('template_id', true, CommandHelper::$PARA_TYPE_STRING);
		$order = CommandHelper::getPara('order', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$ishome = CommandHelper::getPara('ishome', true, CommandHelper::$PARA_TYPE_NUMERIC);
		addPage($site_id, $title, $parent_page_id, $content, $status, $template, $slug, $order, $ishome);
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
					
	// Para management..............

	case "setGlobalPara" : 
		$theme_para_id = CommandHelper::getPara('theme_para_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$new_value = CommandHelper::getPara('para_value', true, CommandHelper::$PARA_TYPE_STRING);
		assignGlobalPara($site_id, $theme_para_id, $new_value);
		break;

	case "setPagePara" : 
		$page_id = CommandHelper::getPara('page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$theme_para_id = CommandHelper::getPara('theme_para_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$new_value = CommandHelper::getPara('para_value', true, CommandHelper::$PARA_TYPE_STRING);
		assignPagePara($site_id, $page_id, $theme_para_id, $new_value);
		break;
					
	default :
		CommandHelper::sendTextMessage("Undefined command '$cmd'");
		
}

// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////

/**
* Make basic text safe, strip out anything that isn't (e.g. for tags and categories)
*/ 
function makeTextSafe($content){

	$tags = array("\\n", "\\r", "\\'", "\\\"");
	$replace = '';
	$safe_content = str_ireplace($tags, $replace, $content);
	$safe_content = stripslashes(stripslashes($safe_content));

	// Remove all remaining slashes
	$tags = array("\\");
	$safe_content = str_ireplace($tags, $replace, $safe_content);

	// Remove all remaining quotes
	$tags = array("\'", "\"");
	$safe_content = str_ireplace($tags, $replace, $safe_content);
		
	//Logger::debug(">>> content = $content");
	//Logger::debug(">>> safe content = $safe_content");

	return $safe_content;
}

/**
* Make content that is supposed to be HTML safe (for posts and pages for example)
*/
function makeHtmlSafe($content){

	// Json converts single slashes to quadruple slashes
//	$tags = array("\\\\\\\\");
//	$tags = array("\\\\");
//	$replace = "\\";
//	$safe_content = str_ireplace($tags, $replace, $content);

	$tags = array("\\n", "\\r");
	$replace = '';
	$safe_content = str_ireplace($tags, $replace, $content);


	$safe_content = stripslashes($safe_content);


	//$safe_content = htmlspecialchars($safe_content, ENT_QUOTES);
	//$safe_content = nl2br($content);
	
	//Logger::debug(">>> content = $content");
	//Logger::debug(">>> safe content = $safe_content");

	return $safe_content;
}

function encodeTitleAsSlug($post_title){

	// Strip any new lines, just in case
	$tags = array("\\n", "\\r");
	$replace = '';
	$safe_slug = str_ireplace($tags, $replace, $post_title);

	// Replace space with dashes
	$tags = array(" ");
	$replace = '-';
	$safe_slug = str_ireplace($tags, $replace, $safe_slug);
	
	// Strip any special characters
    $tags = array('!', '*', "'", "(", ")", ";", ":", "@", "&", "=", "+", "$", ",", "/", "?", "%", "#", "[", "]");
    //$entities = array('%21', '%2A', '%27', '%28', '%29', '%3B', '%3A', '%40', '%26', '%3D', '%2B', '%24', '%2C', '%2F', '%3F', '%25', '%23', '%5B', '%5D');
	$replace = '';
    $safe_slug = str_replace($tags, $replace, $safe_slug);	
    
    // Encode anyting thats left
    $safe_slug = urlencode($safe_slug);

	// Add html extension
	$safe_slug = $safe_slug . '.html';
	
	$safe_slug = strtolower($safe_slug);
	
	return $safe_slug;
}

// ///////////////////////////////////////////////////////////////////////////////////////

/**
* If a page title has changed, then we need to update its path and all of its children
*/
function updatePageAndChildPaths($site_id, $page_id){

	// Update this page's path
	$path = getPath($site_id, $page_id);
	PagesTable::updatePath($page_id, $site_id, $path);	

	// Update its kids
	$children = PagesTable::getChildPages($site_id, $page_id);
	
	if (isset($children)){
		foreach($children as $child){	
			updatePageAndChildPaths($site_id, $child['id']);
		}
	}
	
}

/**
* Get the path for the given page
*/
function getPath($site_id, $page_id){

	$path_array = array();
	$path_array = buildPagePath($page_id, $site_id, $path_array);
	
	$path = "/";
	for($i=count($path_array)-1; $i>=0; $i--){
		if ($path_array[$i] != ''){
			$path .= $path_array[$i] . "/";
		}
	}
	
	return $path;

}

function buildPagePath($page_id, $site_id, $path_array){

	$page = PagesTable::getPage($site_id, $page_id);
	
	if ($page['parent_page_id'] == 0){
		return $path_array;
	}
	else {
		$parentPage = PagesTable::getPage($site_id, $page['parent_page_id']);
		$path = substr($parentPage['slug'], 0, strrpos($parentPage['slug'], '.')); 
		//$path = $parentPage['slug']; 
		$path_array[] =strtolower($path);
		
		if ($parentPage['parent_page_id'] == 0){
			return $path_array;
		}
		else {
			return buildPagePath($parentPage['id'], $site_id, $path_array);
		}
	}
		
}

// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////

// ///////////////////////////////////////////////////////////////////////////////////////
//
// Posts....
//
// ///////////////////////////////////////////////////////////////////////////////////////

function deletePost($site_id, $post_id){

	//Logger::debug("deletePage($site_id, $page_id)");
	
	PostsTable::delete($site_id, $post_id);
	
	$msg['cmd'] = "deletePost";
	$msg['result'] = 'ok';
	$msg['data'] = array('post_id' => $post_id);

	CommandHelper::sendMessage($msg);	
}

// ///////////////////////////////////////////////////////////////////////////////////////

function updatePost($site_id, $post_id, $title, $content, $status, $slug, $can_comment){
	
	Logger::debug($slug);
	
	$user_id = SecurityUtils::getCurrentUserID();
			
	PostsTable::update($site_id, $post_id, makeHtmlSafe($content), $status, $title, $can_comment, encodeTitleAsSlug($title));
			
	$post = PostsTable::getPost($site_id, $post_id);

	$day = date("d", strtotime($post['created']));
	$month = date("M", strtotime($post['created']));
	$year = date("Y", strtotime($post['created']));
		
	$path = "/$day/$month/$year/";
	PostsTable::updatePath($post_id, $site_id, $path);

	if (isset($post)){
		$post['last_edit'] = date("m/d/Y H:i", strtotime($post['last_edit'])); // Convert to JS compatible date
		$post['created'] = date("m/d/Y H:i", strtotime($post['created'])); // Convert to JS compatible date
		$post['tags'] = PostsTable::getPostTags($site_id, $post['id']);
		$post['categories'] = PostsTable::getPostCategories($site_id, $post['id']);
	}

	$msg['cmd'] = "addPost";
	$msg['result'] = 'ok';
	$msg['data'] = array('post' => $post);
	
	CommandHelper::sendMessage($msg);	
}

// ///////////////////////////////////////////////////////////////////////////////////////

function addPost($site_id, $title, $content, $status, $slug, $can_comment){
	
	$user_id = SecurityUtils::getCurrentUserID();
	//$path = getPath($site_id, $page_id);
	$path = '';
	
	$post_id = PostsTable::create($site_id, $user_id, makeHtmlSafe($content), $status, $title, $can_comment, encodeTitleAsSlug($title));
		
	$post = PostsTable::getPost($site_id, $post_id);
		
	$day = date("d", strtotime($post['created']));
	$month = date("M", strtotime($post['created']));
	$year = date("Y", strtotime($post['created']));
		
	$path = "/$day/$month/$year/";
	PostsTable::updatePath($post_id, $site_id, $path);
			
	if (isset($post)){
		$post['last_edit'] = date("m/d/Y H:i", strtotime($post['last_edit'])); // Convert to JS compatible date
		$post['created'] = date("m/d/Y H:i", strtotime($post['created'])); // Convert to JS compatible date
		$post['tags'] = PostsTable::getPostTags($site_id, $post['id']);
		$post['categories'] = PostsTable::getPostCategories($site_id, $post['id']);
	}
			
	$msg['cmd'] = "addPost";
	$msg['result'] = $post_id > 0 ? 'ok' : 'fail';
	$msg['data'] = array('post' => $post);
	
	CommandHelper::sendMessage($msg);	
	
}

// ///////////////////////////////////////////////////////////////////////////////////////

function addCategory($site_id, $post_id, $category){

	$safecat = makeTextSafe($category);
	
	$category_id = PostsTable::addCategory($site_id, $post_id, $safecat);
					
	$msg['cmd'] = "addCategory";
	$msg['result'] = $category_id > 0 ? 'ok' : 'fail';
	$msg['data'] = array('category' => $safecat, 'post_id' => $post_id);
	
	CommandHelper::sendMessage($msg);	
}

// ///////////////////////////////////////////////////////////////////////////////////////

function addTag($site_id, $post_id, $tag){

	$safetag = makeTextSafe($tag);
	
	$tag_id = PostsTable::addTag($site_id, $post_id, $safetag);

	$msg['cmd'] = "addTag";
	$msg['result'] = $tag_id > 0 ? 'ok' : 'fail';
	$msg['data'] = array('tag' => $safetag, 'post_id' => $post_id);
	
	CommandHelper::sendMessage($msg);	
}

// ///////////////////////////////////////////////////////////////////////////////////////

function removeCategory($site_id, $post_id, $category){

	PostsTable::removeCategory($site_id, $post_id, $category);
					
	$msg['cmd'] = "removeCategory";
	$msg['result'] = 'ok';
	$msg['data'] = array('category' => $category, 'post_id' => $post_id);
	
	CommandHelper::sendMessage($msg);	
}

// ///////////////////////////////////////////////////////////////////////////////////////

function removeTag($site_id, $post_id, $tag){

	PostsTable::removeTag($site_id, $post_id, $tag);

	$msg['cmd'] = "removeTag";
	$msg['result'] = 'ok';
	$msg['data'] = array('tag' => $tag, 'post_id' => $post_id);
	
	CommandHelper::sendMessage($msg);	
}


// ///////////////////////////////////////////////////////////////////////////////////////
//
// Pages....
//
// ///////////////////////////////////////////////////////////////////////////////////////

function deletePage($site_id, $page_id){

	//Logger::debug("deletePage($site_id, $page_id)");
	
	PagesTable::delete($site_id, $page_id);	
	
	$msg['cmd'] = "deletePage";
	$msg['result'] = 'ok';
	$msg['data'] = array('page_id' => $page_id);

	CommandHelper::sendMessage($msg);	
}

// ///////////////////////////////////////////////////////////////////////////////////////

function updatePage($site_id, $page_id, $title, $parent_page_id, $content, $status, $tamplate_name, $slug, $order, $ishome){

	//Logger::debug("updatePage(page_id=$page_id, site_id=$site_id, title=$title, parent_page_id=$parent_page_id, content=$content, status=$status, tamplate_name=$tamplate_name, slug=$slug, path=$path)");
	
	$user_id = SecurityUtils::getCurrentUserID();
	$path = ''; //getPath($site_id, $page_id);
	
	$safe_content = makeHtmlSafe($content);
		
	PagesTable::update($page_id, $user_id, $site_id, $parent_page_id, $safe_content, $status, $title, $tamplate_name, encodeTitleAsSlug($title), $path, $order, $ishome);
		
	$page = PagesTable::getPage($site_id, $page_id);
	if (isset($page)){
		$page['last_edit'] = date("m/d/Y H:i", strtotime($page['last_edit'])); // Convert to JS compatible date
		$page['created'] = date("m/d/Y H:i", strtotime($page['created'])); // Convert to JS compatible date
	}

	// Update the path for all the page children, as they may have changed
	//updateChildrensPath($site_id, $page_id);
	updatePageAndChildPaths($site_id, $page_id);

	
	$msg['cmd'] = "addPage";
	$msg['result'] = $page_id > 0 ? 'ok' : 'fail';
	$msg['data'] = array('page' => $page);
	
	CommandHelper::sendMessage($msg);	
}

// ///////////////////////////////////////////////////////////////////////////////////////

function addPage($site_id, $title, $parent_page_id, $content, $status, $tamplate_name, $slug, $order, $ishome){

	//Logger::debug("addPage(site_id=$site_id, title=$title, parent_page_id=$parent_page_id, content=$content, status=$status, tamplate_name=$tamplate_name, slug=$slug, path=$path)");
	
	$user_id = SecurityUtils::getCurrentUserID();
	//$path = getPath($site_id, $page_id);
	$path = '';
	
	$safe_content = makeHtmlSafe($content);
		
	$page_id = PagesTable::create($user_id, $site_id, $parent_page_id, $safe_content, $status, $title, $tamplate_name, encodeTitleAsSlug($title), $path, $order, $ishome);
		
	$page = PagesTable::getPage($site_id, $page_id);
	if (isset($page_data)){
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
	
	// Get the post list
	$post_list = PostsTable::getPosts($site_id);

	$post_data = array();
	foreach ($post_list as $post){
		$temp = $post;
		$temp['last_edit'] = date("m/d/Y H:i", strtotime($post['last_edit'])); // Convert to JS compatible date
		$temp['created'] = date("m/d/Y H:i", strtotime($post['created'])); // Convert to JS compatible date
		$temp['tags'] = PostsTable::getPostTags($site_id, $post['id']);
		$temp['categories'] = PostsTable::getPostCategories($site_id, $post['id']);
		$post_data[] = $temp;
	}	
			
	$media_data = array();
	foreach ($media_list as $media){
		$temp = $media;
		$temp['created'] = date("m/d/Y H:i", strtotime($media['created'])); // Convert to JS compatible date
		$media_data[] = $temp;
	}
		
	// Get theme and page template data
	$site = SitesTable::getSite($site_id);
	$theme = ThemeTable::getTheme($site['theme_id']);
	$page_templates = TemplateManager::getThemePageTemplates($theme['theme_name']);
		
	// Get page theme variables
	$site_theme_paras = ThemeTable::getAllThemeParas($site['theme_id']);

	// Get any set page paras
	$page_paras = PageParasTable::getAllParas($site_id);
			
	// Get the tag list
	$tag_list = PostsTable::getTags($site_id);
	$cat_list = PostsTable::getCategories($site_id);
						
	$msg = array();	
	$msg['cmd'] = 'getAll';
	$msg['result'] = 'ok';			
	$msg['data'] = array('folders' => $folder_list, 'media' => $media_data, 'pages' => $page_data, 'theme' => $theme, 'page_templates' => $page_templates, 
				'theme_paras' => $site_theme_paras, 'page_paras' => $page_paras,  'posts' => $post_data, 'tags' => $tag_list, 'categories' => $cat_list);
				
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


// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////

function assignGlobalPara($site_id, $theme_para_id, $new_value){

	//Logger::debug("assignGlobalPara($site_id, $theme_para_id, $new_value)");

	$result = GlobalParasTable::setGlobalParaValue($site_id, $theme_para_id, $new_value);
			
	Logger::debug("Result: $result");
			
	$msg = array();
	
	$msg['cmd'] = 5;
	$msg['result'] = $result > 0 ? 'ok' : 'fail';
	$msg['data'] = array('theme_para_id' => $theme_para_id, 'new_value' => $new_value);

	CommandHelper::sendMessage($msg);		

}

// ///////////////////////////////////////////////////////////////////////////////////////


function assignPagePara($site_id, $page_id, $theme_para_id, $new_value){

	//Logger::debug("assignPagePara($site_id, $page_post_id, $theme_para_id, $new_value)");
	

	$id = PageParasTable::setParaValue($site_id, $page_id, $theme_para_id, $new_value);
	
	$msg = array();
	
	$msg['cmd'] = 6;
	$msg['result'] = $id > 0 ? 'ok' : 'fail';
	$msg['data'] = array('theme_para_id' => $theme_para_id, 'new_value' => $new_value, 'page_id' => $page_id);

	CommandHelper::sendMessage($msg);		

}
?>