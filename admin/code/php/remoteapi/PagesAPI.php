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
if (!SecurityUtils::isLoggedInForSite($site_id)) {
    error_log("You are not authorized for this site!");
    CommandHelper::sendAuthorizationFailMessage("You are not authorized for this site!");
    die();
}

Logger::debug("Command = " . $cmd);

// Get the command type, and process
switch ($cmd) {

    // PAGES /////////////////////////////////////////////////////////////////////////

    case "deletePage":
        $page_id = CommandHelper::getPara('page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
        deletePage($site_id, $page_id);
        break;

    case "updatePage":
        $page_id = CommandHelper::getPara('page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
        $title = CommandHelper::getPara('title', true, CommandHelper::$PARA_TYPE_STRING);
        $browser_title = CommandHelper::getPara('browser_title', true, CommandHelper::$PARA_TYPE_STRING);
        $slug = CommandHelper::getPara('slug', true, CommandHelper::$PARA_TYPE_STRING);
        $parent_page_id = CommandHelper::getPara('parent_page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
        $content = CommandHelper::getPara('content', true, CommandHelper::$PARA_TYPE_STRING);
        $status = CommandHelper::getPara('status', true, CommandHelper::$PARA_TYPE_STRING);
        $template = CommandHelper::getPara('template_id', true, CommandHelper::$PARA_TYPE_STRING);
        $order = CommandHelper::getPara('order', true, CommandHelper::$PARA_TYPE_NUMERIC);
        //$ishome = CommandHelper::getPara('ishome', true, CommandHelper::$PARA_TYPE_NUMERIC);
        $description = CommandHelper::getPara('desc', true, CommandHelper::$PARA_TYPE_STRING);
        updatePage($site_id, $page_id, $title, $parent_page_id, $content, $status, $template, $slug, $order, $description, $browser_title);
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
        $isblog = CommandHelper::getPara('isblog', true, CommandHelper::$PARA_TYPE_NUMERIC);
        addPage($site_id, $title, $parent_page_id, $content, $status, $template, $slug, $order, $ishome, $isblog);
        break;
 
    case "getPage":
        $page_id = CommandHelper::getPara('page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
        getPage($site_id, $page_id);
        break;
        
    // Para management..............

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
//
// Support functions
//
// ///////////////////////////////////////////////////////////////////////////////////////


/**
 * If a page title has changed, then we need to update its path and all of its children
 */
function updatePageAndChildPaths($site_id, $page_id) {

    // Update this page's path
    $path = getPath($site_id, $page_id);
    PagesTable::updatePath($page_id, $site_id, $path);

    // Update its kids
    $children = PagesTable::getChildPages($site_id, $page_id);

    if (isset($children)) {
        foreach ($children as $child) {
            updatePageAndChildPaths($site_id, $child['id']);
        }
    }
}

/**
 * Get the path for the given page
 */
function getPath($site_id, $page_id) {

    $path_array = array();
    $path_array = buildPagePath($page_id, $site_id, $path_array);

    $path = "/";
    for ($i = count($path_array) - 1; $i >= 0; $i--) {
        if ($path_array[$i] != '') {
            $path .= $path_array[$i] . "/";
        }
    }

    return $path;
}

function buildPagePath($page_id, $site_id, $path_array) {

    $page = PagesTable::getPage($site_id, $page_id);

	//Logger::debug("Page '" . $page['title'] . "' parent id = " . $page['parent_page_id']);
	
    if ($page['parent_page_id'] == 0) {
        return $path_array;
    } 
    else {    	
        $parentPage = PagesTable::getPage($site_id, $page['parent_page_id']);
        		
        //$slug = $parentPage['slug'];
        //if ($slug == 'index') $slug = Page::encodeSlug($parentPage['title']);
        
        $slug = Page::encodeSlug($parentPage['title']);
        $path = substr($slug, 0, strrpos($slug, '.'));
        
		//Logger::debug("'" . $parentPage['title'] . "'  ($path) --- '" . $page['title'] . "'");
        
        $path_array[] = strtolower($path);

        if ($parentPage['parent_page_id'] == 0) {
            return $path_array;
        } else {
            return buildPagePath($parentPage['id'], $site_id, $path_array);
        }
    }
}

// ///////////////////////////////////////////////////////////////////////////////////////
//
// Pages....
//
// ///////////////////////////////////////////////////////////////////////////////////////

function deletePage($site_id, $page_id) {

    //Logger::debug("deletePage($site_id, $page_id)");

    PagesTable::delete($site_id, $page_id);

    $msg['cmd'] = "deletePage";
    $msg['result'] = 'ok';
    $msg['data'] = array('page_id' => $page_id);

    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

function updatePage($site_id, $page_id, $title, $parent_page_id, $content, $status, $tamplate_name, $slug, $order, $description, $browser_title) {

    //Logger::debug("updatePage(page_id=$page_id, site_id=$site_id, title=$title, parent_page_id=$parent_page_id, content=$content, status=$status, tamplate_name=$tamplate_name, slug=$slug, path=$path)");

    $user_id = SecurityUtils::getCurrentUserID();
    $path = ""; // Update path *after* we update the page, as the parent page may have changed
		    
    /*
    $tags = array("\\n", "\\r");
    $replace = '';
    
    $safe_content = str_ireplace($tags, $replace, $content);
	$safe_content = stripslashes($safe_content);

    $safe_title = str_ireplace($tags, $replace, $title);
	$safe_title = stripslashes($safe_title);
	*/
	
    $safe_content = StringUtils::makeHtmlSafe($content);
    $safe_title = StringUtils::makeHtmlSafe($title);

//	if (stripos('_'.$tamplate_name, 'home')){
//		Logger::debug("This is the home page!!");
//		$ishome = 1;
//		$slug = "index.html";
//	}

// TODO: is_blogpage being set inside PagesTable::update - should probably pull out to here?	
//	else if (stripos('_'.$tamplate_name, 'blog')){
//		Logger::debug("This is the blog page!!");
//		$isblog = 1;
//		$slug = "blog";
//	}
//	else {
//		$slug = Page::encodeSlug($safe_title);
//	}

    $is_home = PagesTable::getIsHome($site_id, $page_id);

	if ($is_home == 1){
		$slug = "index.html";
	}
	else {
		$slug = Page::encodeSlug($safe_title);
	}
	 
    PagesTable::update($page_id, $user_id, $site_id, $parent_page_id, $safe_content, $status, $safe_title, $tamplate_name, $slug, $path, $order, $description, $browser_title);

    // Update the path for all the page children, as they may have changed
    //updateChildrensPath($site_id, $page_id);
    updatePageAndChildPaths($site_id, $page_id);

    $page = PagesTable::getPage($site_id, $page_id);

    if (isset($page)) {    
    	$pageObj = new Page($page);    
        $page['last_edit'] = date("m/d/Y H:i", strtotime($page['last_edit'])); // Convert to JS compatible date
        $page['created'] = date("m/d/Y H:i", strtotime($page['created'])); // Convert to JS compatible date
        $page['url'] = $pageObj->getLink();
    }

    $msg['cmd'] = "updatePage";
    $msg['result'] = $page_id > 0 ? 'ok' : 'fail';
    $msg['data'] = array('page' => $page);
		
    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

function addPage($site_id, $title, $parent_page_id, $content, $status, $tamplate_name, $slug, $order, $ishome, $isblog) {

    //Logger::debug("addPage(site_id=$site_id, title=$title, parent_page_id=$parent_page_id, content=$content, status=$status, tamplate_name=$tamplate_name, slug=$slug, path=$path)");

    $user_id = SecurityUtils::getCurrentUserID();
    //$path = getPath($site_id, $page_id);
    $path = '';

/*
    $tags = array("\\n", "\\r");
    $replace = '';
    $safe_content = str_ireplace($tags, $replace, $content);
    $safe_title = str_ireplace($tags, $replace, $title);
*/
    $safe_content = StringUtils::makeHtmlSafe($content);
    $safe_title = StringUtils::makeHtmlSafe($title);

    $page_id = PagesTable::create($user_id, $site_id, $parent_page_id, $safe_content, $status, $safe_title, $tamplate_name, Page::encodeSlug($safe_title), $path, $order, $ishome, $isblog);

    $page = PagesTable::getPage($site_id, $page_id);
    if (isset($page_data)) {
    	$pageObj = new Page($page);    
        $page['last_edit'] = date("m/d/Y H:i", strtotime($page['last_edit'])); // Convert to JS compatible date
        $page['created'] = date("m/d/Y H:i", strtotime($page['created'])); // Convert to JS compatible date
        $page['url'] = $pageObj->getLink();
    }

    $msg['cmd'] = "addPage";
    $msg['result'] = $page_id > 0 ? 'ok' : 'fail';
    $msg['data'] = array('page' => $page);

    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

function getPage($site_id, $page_id){

    $page = PagesTable::getPage($site_id, $page_id);

	$msg['result'] = 'fail';
	
    if (isset($page)) {
        $page['last_edit'] = date("m/d/Y H:i", strtotime($page['last_edit'])); // Convert to JS compatible date
        $page['created'] = date("m/d/Y H:i", strtotime($page['created'])); // Convert to JS compatible date
	    $msg['result'] = 'ok';
    }

    $msg['cmd'] = "getPage";
    $msg['data'] = array('page' => $page);

    CommandHelper::sendMessage($msg);

}

// ///////////////////////////////////////////////////////////////////////////////////////

function assignPagePara($site_id, $page_id, $theme_para_id, $new_value) {

    Logger::debug("assignPagePara($site_id, $page_id, $theme_para_id, $new_value)");

    $id = PageParasTable::setParaValue($site_id, $page_id, $theme_para_id, $new_value);

    $msg = array();

    $msg['cmd'] = 6;
    $msg['result'] = $id > 0 ? 'ok' : 'fail';
    $msg['data'] = array('theme_para_id' => $theme_para_id, 'new_value' => $new_value, 'page_id' => $page_id);

    CommandHelper::sendMessage($msg);
}

?>