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

    case "getAll":
        getAll($site_id);
        break;

    case "getFolders":
        getFolders($site_id);
        break;

    case "getMedia":
        getImages($site_id);
        break;

    case "getDetailedStats":
        $no_days = CommandHelper::getPara('dys', false, CommandHelper::$PARA_TYPE_NUMERIC);
        if (!isset($no_days) || $no_days == "") $no_days = 30;
        getDetailedStats($site_id, $no_days);
        break;

    // MEDIA /////////////////////////////////////////////////////////////////////////

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
        $media_id = CommandHelper::getPara('media_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
        updateMediaInfo($site_id, $media_id, $title, $desc, $tags);
        break;

    case "deleteMedia":
        $media_id = CommandHelper::getPara('media_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
        deleteMedia($site_id, $media_id);
        break;
/*
    case "addMediaTag":
        $tag = CommandHelper::getPara('tag', true, CommandHelper::$PARA_TYPE_STRING);
        $media_id = CommandHelper::getPara('media_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
        addMediaTag($site_id, $media_id, $tag);
        break;
*/
    case "addMediaTags":
        $csv_tags = CommandHelper::getPara('csvtags', true, CommandHelper::$PARA_TYPE_STRING);
        $media_id = CommandHelper::getPara('media_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
        addMediaTags($site_id, $media_id, $csv_tags);
        break;

    case "removeMediaTag":
        $tag = CommandHelper::getPara('tag', true, CommandHelper::$PARA_TYPE_STRING);
        $media_id = CommandHelper::getPara('media_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
        removeMediaTag($site_id, $media_id, $tag);
        break;

    case "renameMediaTag":
        $tag = CommandHelper::getPara('tag', true, CommandHelper::$PARA_TYPE_STRING);
        $new_tag = CommandHelper::getPara('new_tag', true, CommandHelper::$PARA_TYPE_STRING);
        renameMediaTag($site_id, $tag, $new_tag);
        break;

    case "deleteMediaTag":
        $tag = CommandHelper::getPara('tag', true, CommandHelper::$PARA_TYPE_STRING);
        deleteMediaTag($site_id,  $tag);
        break;

    default :
        CommandHelper::sendTextMessage("Undefined command '$cmd'");
}

// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////

function getAll($site_id) {

    Logger::debug("Loading all data for site $site_id");
    // Get the folder list.........
    $folder_list = MediaTable::getFoldersForSite($site_id);

    // Get the media list
    $media_list = MediaTable::getMediaForSite($site_id);

    // Get the page list
    //$page_list = PagesTable::getPageSummaries($site_id);
    $page_list = PagesTable::getPages($site_id);

    $page_data = array();
    foreach ($page_list as $page) {
    	$pageObj = new Page($page);
        $temp = $page;
        $temp['last_edit'] = date("m/d/Y H:i", strtotime($page['last_edit'])); // Convert to JS compatible date
        $temp['created'] = date("m/d/Y H:i", strtotime($page['created'])); // Convert to JS compatible date
        $temp['url'] = $pageObj->getLink();
        $page_data[] = $temp;
    }

    // Get the post list
    $post_list = PostsTable::getPostSummaries($site_id);

    // Get the media file list
    $media_data = array();
    foreach ($media_list as $media) {
        $temp = $media;
        $temp['created'] = date("m/d/Y H:i", strtotime($media['created'])); // Convert to JS compatible date
        $temp['media_tags'] = MediaTable::getTagsForMedia($site_id, $media['id']);
        $media_data[] = $temp;
    }

    // Get theme and page template data
    $site = SitesTable::getSite($site_id);
    $theme = ThemeTable::getTheme($site['theme_id']);
    $page_templates = TemplateManager::getThemePageTemplates($theme['theme_name']);
	//Logger::dump($page_templates);

    // Get page theme variables
    $site_theme_paras = ThemeTable::getAllThemeParas($site['theme_id']);
	//Logger::dump($site_theme_paras);
	
    // Get any set page paras
    $page_paras = PageParasTable::getAllParas($site_id);

    // Get the tag list
    $tag_list = PostsTable::getTags($site_id);
    $cat_list = PostsTable::getCategories($site_id);
    $media_tag_list = MediaTable::getTags($site_id);

    $msg = array();
    $msg['cmd'] = 'getAll';
    $msg['result'] = 'ok';
    $msg['data'] = array(
        'folders' => $folder_list,
        'media' => $media_data,
        'pages' => $page_data,
        'theme' => $theme,
        'page_templates' => $page_templates,
        'theme_paras' => $site_theme_paras, 
        'page_paras' => $page_paras,
        'posts' => $post_list,
        'tags' => $tag_list,
        'categories' => $cat_list,
        'media_tags' => $media_tag_list);

    CommandHelper::sendMessage($msg);
}


// ///////////////////////////////////////////////////////////////////////////////////////
//
// Media
//
// ///////////////////////////////////////////////////////////////////////////////////////

function addMediaToFolder($site_id, $media_id, $folder_id) {

    //Logger::debug("addMediaToFolder(site_id = $site_id, media_id = $media_id, folder_id = $folder_id)");
    // Is the media already in this folder?
    $current_folder_id = MediaTable::getMediaFolderID($media_id, $site_id);

    if (isset($current_folder_id) && $current_folder_id == $folder_id) {
        $msg['result'] = 'duplicate';
    } 
    else {

        // If this was added to the 'unassigned' or 'all' folder, remove
        if ($folder_id == 0 || $folder_id == 1) {
            $res = MediaTable::removeMedia($media_id, $site_id);
        } else {
            $res = MediaTable::addMediaToFolder($folder_id, $media_id, $site_id);
        }

        $msg['result'] = $res > 0 ? 'ok' : 'fail';
    }

    $msg['cmd'] = "addMediaToFolder";
    $msg['data'] = array('folder_id' => $folder_id, 'media_id' => $media_id);

    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

function renameFolder($site_id, $folder_id, $name) {

    $res = MediaTable::renameFolder($site_id, $folder_id, $name);

    $msg['cmd'] = "renameFolder";
    $msg['result'] = $res > 0 ? 'ok' : 'fail';
    $msg['data'] = array('name' => $name, 'id' => $folder_id);

    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

function deleteFolder($site_id, $folder_id) {

    $res = MediaTable::deleteFolder($site_id, $folder_id);

    $msg['cmd'] = "deleteFolder";
    $msg['result'] = 'ok';
    $msg['data'] = array('id' => $folder_id);

    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

function addFolder($site_id, $folder_name) {

    // Get the folder list.........
    $id = MediaTable::addFolder($folder_name, $site_id);

    $msg = array();
    $msg['cmd'] = 'addFolder';

    if ($id > 0) {
        $msg['result'] = 'ok';
        $msg['data'] = array('name' => $folder_name, 'id' => $id);
    } else {
        $msg['result'] = 'fail';
    }

    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////
/*
function addMediaTag($site_id, $media_id, $tag) {

    $safetag = StringUtils::makeTextSafe($tag);

    $tag_id = MediaTable::addTagToMedia($site_id, $media_id, $safetag);

    $msg['cmd'] = "addMediaTag";
    $msg['result'] = $tag_id > 0 ? 'ok' : 'fail';
    $msg['data'] = array('tag' => $safetag, 'media_id' => $media_id);

    CommandHelper::sendMessage($msg);
}
*/
// ///////////////////////////////////////////////////////////////////////////////////////

/**
 * Add mutliple tags at once, in the form of a csv list of them
 */
function addMediaTags($site_id, $media_id, $csv_tags) {
	
    $tag_list = explode(",", $csv_tags);

    foreach ($tag_list as $tag) {
        $tag = trim($tag);
        if ($tag != "") {
        
            $safetag = StringUtils::makeTextSafe($tag);
            //$tag_id = MediaTable::addTag($site_id, $safetag);
		    $tag_id = MediaTable::addTagToMedia($site_id, $media_id, $safetag);		    
        }
    }

	$media = MediaTable:: getMedia($site_id, $media_id);	
    $media['created'] = date("m/d/Y H:i", strtotime($media['created'])); // Convert to JS compatible date
    $media['media_tags'] = MediaTable::getTagsForMedia($site_id, $media_id);

    $msg['cmd'] = "addMediaTags";
    $msg['result'] = 'ok';
    $msg['data'] = array('media' => $media, 'tags' => MediaTable::getTags($site_id));
    
    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

/**
* Remove a tag from a media file
*/
function removeMediaTag($site_id, $media_id, $tag) {

    MediaTable::removeTag($site_id, $media_id, $tag);

	$media = MediaTable:: getMedia($site_id, $media_id);	
    $media['created'] = date("m/d/Y H:i", strtotime($media['created'])); // Convert to JS compatible date
    $media['media_tags'] = MediaTable::getTagsForMedia($site_id, $media_id);

    $msg['cmd'] = "removeMediaTag";
    $msg['result'] = 'ok';
    $msg['data'] = array('media' => $media);

    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

/**
 * Delete a tag from the entire site, and remove from any media files
 * @param int $site_id
 * @param string $category
 */
function deleteMediaTag($site_id, $tag) {

    MediaTable::globalRemoveTag($site_id, $tag);

    $msg['cmd'] = "deleteMediaTag";
    $msg['result'] = 'ok';
    $msg['data'] = array('tags' => MediaTable::getTags($site_id));

    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

/**
* Rename a tag
*/
function renameMediaTag($site_id, $tag, $new_tag) {

	//Logger::debug("renameMediaTag($site_id, $tag, $new_tag)");
	
	// Make sure the new name is not already in use
	$tagCheck = MediaTable::getTagByName($site_id, $new_tag);

	if (!isset($tagCheck) || !$tagCheck){
	    MediaTable::renameTag($site_id, $tag, $new_tag);
	}

    $msg['cmd'] = "renameMediaTag";
    $msg['result'] = 'ok';
    $msg['data'] = array('tags' => MediaTable::getTags($site_id));

    CommandHelper::sendMessage($msg);
}


// ///////////////////////////////////////////////////////////////////////////////////////

/**
 * Get the detailed stats for the given site
 * @param int $site_id
 */
function getDetailedStats($site_id, $no_days) {

	Logger::debug("getDetailedStats($site_id, $no_days)");

	// SELECT page_id, sum(unique_visitors) FROM stats_5_RollupPageViews WHERE rollup_date > '2010-10-16' GROUP BY page_id
	
    // Get page views for the whole site for each day
    $page_views = StatsRollupTables::getPageViewsRollup($site_id, $no_days);
	
    $views = array();

    if (isset($page_views)) {
        foreach ($page_views as $view) {
            $temp = array();
            $temp['pid'] = $view['page_id'];
            $temp['dt'] = $view['rollup_date'];
            $temp['uv'] = $view['unique_visitors'];
            $temp['pv'] = $view['page_views'];
            $views[] = $temp;
        }
    }

    // Get the hits from search engines...
    $page_views = StatsRollupTables::getCrawlerViewsLastNDays($site_id, $no_days);
    $crawler_views = array();

    if (isset($page_views)) {
        foreach ($page_views as $view) {
            $temp = array();
            $temp['dt'] = $view['rollup_date'];
            $temp['crw'] = $view['crawler'];
            $temp['pv'] = $view['hits'];
            $crawler_views[] = $temp;
        }
    }
	
    $msg['getStats'] = "getDetailedStats";
    $msg['result'] = 'ok';
    $msg['data'] = array('page_views' => $views, 'crawler_views' => $crawler_views);
    
    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

/**
 * Call the 'du' command and parse its response
 */
function du($dir) {

    $res = "du -sk $dir";             // Unix command
    
    exec("du -sk $dir", $KB);
            
    if (isset($KB[0])) {
        $MB = round($KB[0] / 1024, 2);  // From kilobytes to megabytes
        return $MB;    
    }
    
    return 0;
}

// ///////////////////////////////////////////////////////////////////////////////////////

function getFolders($site_id) {

    // Get the folder list.........
    $folder_list = MediaTable::getFoldersForSite($site_id);

    $msg = array();
    $msg['cmd'] = 'getFolders';
    $msg['result'] = 'ok';
    $msg['data'] = $folder_list;

    CommandHelper::sendMessage($msg);
}

// //// ///////////////////////////////////////////////////////////////////////////////////////

function getImages($site_id) {

    $media_list = MediaTable::getMediaForSite($site_id);

    $msg = array();
    $msg['cmd'] = 'getMedia';
    $msg['result'] = 'ok';

    $data = array();
    foreach ($media_list as $media) {
        $temp = $media;
        $temp['created'] = date("m/d/Y H:i", strtotime($media['created'])); // Convert to JS compatible date
        $temp['media_tags'] = MediaTable::getTagsForMedia($site_id, $media['id']);
        $data[] = $temp;
    }

    $msg['data'] = $data;


    CommandHelper::sendMessage($msg);
}

// //// ///////////////////////////////////////////////////////////////////////////////////////

function updateMediaInfo($site_id, $media_id, $title, $desc, $alt_tag) {

	Logger::debug("updateMediaInfo($site_id, $media_id, $title, $desc, $csv_tags)");

    $msg = array();
    $msg['cmd'] = 'saveMediaInfo';
    $msg['result'] = 'ok';

    MediaTable::updateMedia($site_id, $media_id, $title, $desc, $alt_tag);

    $media = MediaTable::getMedia($site_id, $media_id);
   	$media['created'] = date("m/d/Y H:i", strtotime($media['created'])); // Convert to JS compatible date
    
    $msg['data'] = $media;
    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

function deleteMedia($site_id, $media_id) {

    $msg = array();
    $msg['cmd'] = 'deleteMedia';
    $msg['result'] = 'ok';

	// Remove from any galleries
	GalleryTable::removeImageFromAll($media_id, $site_id);
	
    $media = MediaTable::getMedia($site_id, $media_id);
   	$media['created'] = date("m/d/Y H:i", strtotime($media['created'])); // Convert to JS compatible date

    // Phyiscally delete the file, and thumbnail if applicable
    
	$accessKey = 'AKIAJREFWQ2CC3ZIDWOQ';	
	$secretKey = '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';
	$s3 = new S3($accessKey, $secretKey, false);
    
    //$path = SecurityUtils::getMediaFolder($site_id) . $media['filepath'] . $media['filename'];
    //unlink($path);

    $s3_path = $site_id . "/" . $media['filepath'] . $media['filename'];
    if (!S3::deleteObject("apollosites", $s3_path)) {
        Logger::error("Error deleting file $s3_path");
    }
    
    //$path = SecurityUtils::getMediaFolder($site_id) . $media['filepath'] . $media['thumb_filename'];
    //unlink($path);

    $s3_path = $site_id . "/" . $media['filepath'] . $media['thumb_filename'];
    if (!S3::deleteObject("apollosites", $s3_path)) {
        Logger::error("Error deleting file $s3_path");
    }

    // Now remove from the database
    MediaTable::removeMedia($media_id, $site_id);

    $msg['data'] = array('media_id'=>$media_id);
    
    CommandHelper::sendMessage($msg);
}

?>