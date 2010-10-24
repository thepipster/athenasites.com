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

    case "getStats":
        getStats($site_id);
        break;

    case "getDetailedStats":
        $no_days = CommandHelper::getPara('dys', false, CommandHelper::$PARA_TYPE_NUMERIC);
        if (!isset($no_days) || $no_days == "") $no_days = 30;
        getDetailedStats($site_id, $no_days);
        break;

    // POSTS /////////////////////////////////////////////////////////////////////////

    case "deletePost":
        $post_id = CommandHelper::getPara('post_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
        deletePost($site_id, $post_id);
        break;

    case "getPostDetails":
        $post_id = CommandHelper::getPara('post_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
        getPostDetails($site_id, $post_id);
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

    case "importPost":
        $title = CommandHelper::getPara('title', true, CommandHelper::$PARA_TYPE_STRING);
        $content = CommandHelper::getPara('content', true, CommandHelper::$PARA_TYPE_STRING);
        $status = CommandHelper::getPara('status', true, CommandHelper::$PARA_TYPE_STRING);
        $can_comment = CommandHelper::getPara('comment', true, CommandHelper::$PARA_TYPE_NUMERIC);
        $created_date = CommandHelper::getPara('pubdate', true, CommandHelper::$PARA_TYPE_STRING);
        $import_source = CommandHelper::getPara('import_source', true, CommandHelper::$PARA_TYPE_STRING);
        $import_source_id = CommandHelper::getPara('source_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
        $csv_tags = CommandHelper::getPara('csvtags', true, CommandHelper::$PARA_TYPE_STRING);
        $csv_categories = CommandHelper::getPara('csvcats', true, CommandHelper::$PARA_TYPE_STRING);
        importPost($site_id, $content, $status, $title, $created_date, $can_comment, $csv_tags, $csv_categories, $import_source, $import_source_id);
        break;

    /*
      case "importComment":
      $author_name = CommandHelper::getPara('arn', true, CommandHelper::$PARA_TYPE_STRING);
      $author_email = CommandHelper::getPara('aem', true, CommandHelper::$PARA_TYPE_STRING);
      $author_ip = CommandHelper::getPara('aip', true, CommandHelper::$PARA_TYPE_STRING);
      $author_url = CommandHelper::getPara('aurl', true, CommandHelper::$PARA_TYPE_STRING);
      $content = CommandHelper::getPara('content', true, CommandHelper::$PARA_TYPE_STRING);
      $comment_id = CommandHelper::getPara('cid', true, CommandHelper::$PARA_TYPE_NUMERIC);
      $parent_comment_id = CommandHelper::getPara('pcid', true, CommandHelper::$PARA_TYPE_NUMERIC);
      $post_id = CommandHelper::getPara('pid', true, CommandHelper::$PARA_TYPE_NUMERIC);
      $created_date = CommandHelper::getPara('pubdate', true, CommandHelper::$PARA_TYPE_STRING);
      $approved = CommandHelper::getPara('apr', true, CommandHelper::$PARA_TYPE_NUMERIC);
      $import_source = CommandHelper::getPara('import_source', true, CommandHelper::$PARA_TYPE_STRING);
      importComment($site_id, $post_id, $author_name, $author_email, $author_ip, $author_url, $content, $comment_id, $parent_comment_id, $created_date, $approved, $import_source);
      break;
     */

    case "importLJ":
        $lj_user = CommandHelper::getPara('us', true, CommandHelper::$PARA_TYPE_STRING);
        $lj_password = CommandHelper::getPara('ps', true, CommandHelper::$PARA_TYPE_STRING);
        importLiveJournal($site_id, $lj_user, $lj_password);
        break;

    case "importComments":
        $comment_obj = CommandHelper::getPara('com', true, CommandHelper::$PARA_TYPE_JSON);
        $post_id = CommandHelper::getPara('pid', true, CommandHelper::$PARA_TYPE_NUMERIC);
        $import_source = CommandHelper::getPara('ims', true, CommandHelper::$PARA_TYPE_STRING);
        importComments($site_id, $post_id, $comment_obj, $import_source);
        break;

    case "updateCommentStatus":
        $comment_id = CommandHelper::getPara('cid', true, CommandHelper::$PARA_TYPE_NUMERIC);
        $status = CommandHelper::getPara('sts', true, CommandHelper::$PARA_TYPE_STRING);
        updateCommentStatus($site_id, $comment_id, $status);
        break;

    case "addTag":
        $tag = CommandHelper::getPara('tag', true, CommandHelper::$PARA_TYPE_STRING);
        $post_id = CommandHelper::getPara('post_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
        addTag($site_id, $post_id, $tag);
        break;

    case "addTags":
        $csv_tags = CommandHelper::getPara('csvtags', true, CommandHelper::$PARA_TYPE_STRING);
        addTags($site_id, $csv_tags);
        break;

    case "addCategory":
        $category = CommandHelper::getPara('category', true, CommandHelper::$PARA_TYPE_STRING);
        $post_id = CommandHelper::getPara('post_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
        addCategory($site_id, $post_id, $category);
        break;

    case "addCategories":
        $csv_categories = CommandHelper::getPara('csvcats', true, CommandHelper::$PARA_TYPE_STRING);
        addCategories($site_id, $csv_categories);
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


    case "deleteTag":
        $tag = CommandHelper::getPara('tag', true, CommandHelper::$PARA_TYPE_STRING);
        deleteTag($site_id,  $tag);
        break;

    case "deleteCategory":
        $category = CommandHelper::getPara('category', true, CommandHelper::$PARA_TYPE_STRING);
        deleteCategory($site_id, $category);
        break;


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
        $ishome = CommandHelper::getPara('ishome', true, CommandHelper::$PARA_TYPE_NUMERIC);
        $description = CommandHelper::getPara('desc', true, CommandHelper::$PARA_TYPE_STRING);
        updatePage($site_id, $page_id, $title, $parent_page_id, $content, $status, $template, $slug, $order, $ishome, $description, $browser_title);
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
        addPage($site_id, $title, $parent_page_id, $content, $status, $template, $slug, $order, $ishome, $desc);
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
        $media_id = CommandHelper::getPara('media_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
        updateMediaInfo($site_id, $media_id, $title, $desc, $tags);
        break;

    case "deleteMedia":
        $media_id = CommandHelper::getPara('media_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
        deleteMedia($site_id, $media_id);
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

    if ($page['parent_page_id'] == 0) {
        return $path_array;
    } else {
        $parentPage = PagesTable::getPage($site_id, $page['parent_page_id']);
        $path = substr($parentPage['slug'], 0, strrpos($parentPage['slug'], '.'));
        //$path = $parentPage['slug'];
        $path_array[] = strtolower($path);

        if ($parentPage['parent_page_id'] == 0) {
            return $path_array;
        } else {
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


function getPostDetails($site_id, $post_id) {

    $post = PostsTable::getPost($site_id, $post_id);

    if (isset($post)) {
        $post['last_edit'] = date("m/d/Y H:i", strtotime($post['last_edit'])); // Convert to JS compatible date
        $post['created'] = date("m/d/Y H:i", strtotime($post['created'])); // Convert to JS compatible date
        $post['tags'] = PostsTable::getPostTags($site_id, $post['id']);
        $post['categories'] = PostsTable::getPostCategories($site_id, $post['id']);
        $post['content'] = ImportHelper::convertContent($post['content'], $post['source']);
    }

    //Logger::dump($post);

    $msg['cmd'] = "getPostDetails";
    $msg['result'] = 'ok';
    $msg['data'] = array('post' => $post);

    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

function deletePost($site_id, $post_id) {

    //Logger::debug("deletePage($site_id, $page_id)");

    PostsTable::delete($site_id, $post_id);

    $msg['cmd'] = "deletePost";
    $msg['result'] = 'ok';
    $msg['data'] = array('post_id' => $post_id);

    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

function updatePost($site_id, $post_id, $title, $content, $status, $slug, $can_comment) {

    //Logger::debug($content);


    $user_id = SecurityUtils::getCurrentUserID();

    $tags = array("\\n", "\\r");
    $replace = '';
    
    $safe_content = str_ireplace($tags, $replace, $content);
    $safe_content = stripslashes($safe_content);
    
    $safe_title = str_ireplace($tags, $replace, $title);
    $safe_title = stripslashes($safe_title);

    PostsTable::update($site_id, $post_id, $safe_content, $status, $safe_title, $can_comment, StringUtils::encodeSlug($title), 'apollo');
	
    $post = PostsTable::getPost($site_id, $post_id);

	ImportHelper::processPostContent($site_id, $post);

    $day = date("d", strtotime($post['created']));
    $month = date("n", strtotime($post['created']));
    $year = date("Y", strtotime($post['created']));

    $path = "/$year/$month/$day/";
    PostsTable::updatePath($post_id, $site_id, $path);

    if (isset($post)) {
        $post['last_edit'] = date("m/d/Y H:i", strtotime($post['last_edit'])); // Convert to JS compatible date
        $post['created'] = date("m/d/Y H:i", strtotime($post['created'])); // Convert to JS compatible date
        $post['tags'] = PostsTable::getPostTags($site_id, $post['id']);
        $post['categories'] = PostsTable::getPostCategories($site_id, $post['id']);
    }

    $msg['cmd'] = "updatePost";
    $msg['result'] = 'ok';
    $msg['data'] = array('post' => $post);

    CommandHelper::sendMessage($msg);
}




// ///////////////////////////////////////////////////////////////////////////////////////

function addPost($site_id, $title, $content, $status, $slug, $can_comment) {

    $user_id = SecurityUtils::getCurrentUserID();
    //$path = getPath($site_id, $page_id);
    $path = '';

    $post_id = PostsTable::create($site_id, $user_id, StringUtils::makeHtmlSafe($content), $status, StringUtils::makeHtmlSafe($title), $can_comment, StringUtils::encodeSlug($title), 'apollo');

    $post = PostsTable::getPost($site_id, $post_id);

    $day = date("d", strtotime($post['created']));
    $month = date("n", strtotime($post['created']));
    $year = date("Y", strtotime($post['created']));

    $path = "/$year/$month/$day/";
    PostsTable::updatePath($post_id, $site_id, $path);

    if (isset($post)) {
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

function importPost($site_id, $content, $status, $title, $created_date, $can_comment, $csv_tags, $csv_categories, $import_source, $import_source_id) {

    //Logger::debug(">>> importPost(site_id=$site_id, status=$status, title=$title, created_date=$created_date, can_comment=$can_comment, csv_tags=$csv_tags, csv_categories=$csv_categories, import_source=$import_source, import_source_id=$import_source_id");
    
    $user_id = SecurityUtils::getCurrentUserID();

    $post_id = ImportHelper::importPost($user_id, $site_id, $content, $status, $title, $created_date, $can_comment, $csv_tags, $csv_categories, $import_source, $import_source_id);

    $msg['cmd'] = "importPost";
    $msg['result'] = $post_id > 0 ? 'ok' : 'fail';
    $msg['data'] = array('post_id' => $post_id, 'source_post_id' => $import_source_id);

    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////

/**
 * Imports posts and comments from livejournal
 */
function importLiveJournal($site_id, $lj_user, $lj_password) {

    $user_id = SecurityUtils::getCurrentUserID();

    // Do the import
    LiveJournalImporter::import($user_id, $site_id, $lj_user, $lj_password);

    $msg['cmd'] = "importLiveJournal";

    if (LiveJournalImporter::$errorCode != 0) {
        $msg['result'] = 'false';
        $msg['data'] = LiveJournalImporter::$errorMessage;
    } else {
        $msg['result'] = 'ok';
    }

    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

function importComments($site_id, $post_id, $comment_obj, $import_source) {

	//Logger::debug("importComments($site_id, $post_id, $comment_obj, $import_source)");
	
    $comment_list = json_decode($comment_obj);

	//Logger::dump($comment_list);
	
    foreach ($comment_list as $comment) {

        $author_name = $comment->author;
        $author_email = $comment->author_email;
        $author_ip = $comment->author_ip;
        $author_url = $comment->author_url;
        $content = urldecode($comment->content);
        $import_source_id = $comment->id;
        $parent_comment_id = $comment->parent_id;
        $created_date = $comment->date_gmt;
        $approved = $comment->approved;
        $source_post_id = $comment->post_id;

        // Find the comment id that matches the given parent comment id, based on the import source
        $real_parent_id = CommentsTable::getCommentIDFromSourceID($site_id, $parent_comment_id, $import_source);

        $comment_id = ImportHelper::importComment($site_id, $post_id, $author_name, $author_email, $author_ip, $author_url, $content, $real_parent_id, $created_date, $approved, $import_source, $import_source_id);
        CommentsTable::updateSourcePostID($comment_id, $site_id, $source_post_id);
    }

    $msg['cmd'] = "importComments";
    $msg['result'] = 'ok';

    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

function updateCommentStatus($site_id, $comment_id, $status) {

    // Get the current status, and determine if we need to
    // flag or unflag the author as a spammer
    $comment = CommentsTable::getComment($site_id, $comment_id);

    $prev_status = $comment['status'];
    $follower_id = $comment['site_follower_id'];

    if ($prev_status != $status && $prev_status == 'Spam') {
        // Mark the author as not a spammer
        SiteFollowersTable::unflagSpammer($follower_id);
    }

    if ($prev_status != $status && $status == 'Spam') {
        // Mark the author as a spammer
        SiteFollowersTable::flagSpammer($follower_id);
    }

    CommentsTable::updateStatus($comment_id, $site_id, $status);

    $msg['cmd'] = "importComments";
    $msg['result'] = 'ok';
    $msg['data'] = array('comment_id' => $comment_id, 'status' => $status);

    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////

function addCategory($site_id, $post_id, $category) {

    $safecat = StringUtils::makeTextSafe($category);

    $category_id = PostsTable::addCategoryToPost($site_id, $post_id, $safecat);

    $msg['cmd'] = "addCategory";
    $msg['result'] = $category_id > 0 ? 'ok' : 'fail';
    $msg['data'] = array('category' => $safecat, 'post_id' => $post_id);

    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

function addTag($site_id, $post_id, $tag) {

    $safetag = StringUtils::makeTextSafe($tag);

    $tag_id = PostsTable::addTagToPost($site_id, $post_id, $safetag);

    $msg['cmd'] = "addTag";
    $msg['result'] = $tag_id > 0 ? 'ok' : 'fail';
    $msg['data'] = array('tag' => $safetag, 'post_id' => $post_id);

    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

/**
 * Add mutliple categories at once, in the form of a csv list of them
 */
function addCategories($site_id, $csv_categories) {

    //Logger::debug($csv_categories);

    $cat_list = explode(",", $csv_categories);

    foreach ($cat_list as $cat) {
        $cat = trim($cat);
        if ($cat != "") {
            $safecat = StringUtils::makeTextSafe($cat);
            $category_id = PostsTable::addCategory($site_id, $safecat);
        }
    }

    $msg['cmd'] = "addCategories";
    $msg['result'] = 'ok';

    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

/**
 * Add mutliple tags at once, in the form of a csv list of them
 */
function addTags($site_id, $csv_tags) {

    $tag_list = explode(",", $csv_tags);

    foreach ($tag_list as $tag) {
        $tag = trim($tag);
        if ($tag != "") {
            $safetag = StringUtils::makeTextSafe($tag);
            $tag_id = PostsTable::addTag($site_id, $safetag);
        }
    }

    $msg['cmd'] = "addTags";
    $msg['result'] = 'ok';

    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

function removeCategory($site_id, $post_id, $category) {

    PostsTable::removeCategory($site_id, $post_id, $category);

    $msg['cmd'] = "removeCategory";
    $msg['result'] = 'ok';
    $msg['data'] = array('category' => $category, 'post_id' => $post_id);

    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

function removeTag($site_id, $post_id, $tag) {

    PostsTable::removeTag($site_id, $post_id, $tag);

    $msg['cmd'] = "removeTag";
    $msg['result'] = 'ok';
    $msg['data'] = array('tag' => $tag, 'post_id' => $post_id);

    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

/**
 * Delete a category from the entire blog, and remove from any posts
 * @param int $site_id
 * @param string $category
 */
function deleteCategory($site_id, $category) {
    
    PostsTable::globalRemoveCategory($site_id, $category);

    $msg['cmd'] = "deleteCategory";
    $msg['result'] = 'ok';
    $msg['data'] = array('category' => $category);

    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

/**
 * Delete a tag from the entire blog, and remove from any posts
 * @param int $site_id
 * @param string $category
 */

function deleteTag($site_id, $tag) {

    PostsTable::globalRemoveTag($site_id, $tag);

    $msg['cmd'] = "deleteTag";
    $msg['result'] = 'ok';
    $msg['data'] = array('tag' => $tag);

    CommandHelper::sendMessage($msg);
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

function updatePage($site_id, $page_id, $title, $parent_page_id, $content, $status, $tamplate_name, $slug, $order, $ishome, $description, $browser_title) {

    //Logger::debug("updatePage(page_id=$page_id, site_id=$site_id, title=$title, parent_page_id=$parent_page_id, content=$content, status=$status, tamplate_name=$tamplate_name, slug=$slug, path=$path)");

    $user_id = SecurityUtils::getCurrentUserID();
    $path = ''; //getPath($site_id, $page_id);
	
    $tags = array("\\n", "\\r");
    $replace = '';
    
    $safe_content = str_ireplace($tags, $replace, $content);
	$safe_content = stripslashes($safe_content);

    $safe_title = str_ireplace($tags, $replace, $title);
	$safe_title = stripslashes($safe_title);

	Logger::debug(">>>> $tamplate_name - " . stripos($tamplate_name, 'home'));
	
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
		$slug = StringUtils::encodeSlug($title);
//	}
	 
    PagesTable::update($page_id, $user_id, $site_id, $parent_page_id, $safe_content, $status, $safe_title, $tamplate_name, $slug, $path, $order, $ishome, $description, $browser_title);


    $page = PagesTable::getPage($site_id, $page_id);

    if (isset($page)) {
        $page['last_edit'] = date("m/d/Y H:i", strtotime($page['last_edit'])); // Convert to JS compatible date
        $page['created'] = date("m/d/Y H:i", strtotime($page['created'])); // Convert to JS compatible date
    }

    // Update the path for all the page children, as they may have changed
    //updateChildrensPath($site_id, $page_id);
    updatePageAndChildPaths($site_id, $page_id);

    $page = PagesTable::getPage($site_id, $page_id);

    $msg['cmd'] = "updatePage";
    $msg['result'] = $page_id > 0 ? 'ok' : 'fail';
    $msg['data'] = array('page' => $page);

    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

function addPage($site_id, $title, $parent_page_id, $content, $status, $tamplate_name, $slug, $order, $ishome) {

    //Logger::debug("addPage(site_id=$site_id, title=$title, parent_page_id=$parent_page_id, content=$content, status=$status, tamplate_name=$tamplate_name, slug=$slug, path=$path)");

    $user_id = SecurityUtils::getCurrentUserID();
    //$path = getPath($site_id, $page_id);
    $path = '';

    $tags = array("\\n", "\\r");
    $replace = '';
    $safe_content = str_ireplace($tags, $replace, $content);
    $safe_title = str_ireplace($tags, $replace, $title);

    $page_id = PagesTable::create($user_id, $site_id, $parent_page_id, $safe_content, $status, $safe_title, $tamplate_name, StringUtils::encodeSlug($title), $path, $order, $ishome);

    $page = PagesTable::getPage($site_id, $page_id);
    if (isset($page_data)) {
        $page['last_edit'] = date("m/d/Y H:i", strtotime($page['last_edit'])); // Convert to JS compatible date
        $page['created'] = date("m/d/Y H:i", strtotime($page['created'])); // Convert to JS compatible date
    }

    $msg['cmd'] = "addPage";
    $msg['result'] = $page_id > 0 ? 'ok' : 'fail';
    $msg['data'] = array('page' => $page);

    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

function addMediaToFolder($site_id, $media_id, $folder_id) {

    //Logger::debug("addMediaToFolder(site_id = $site_id, media_id = $media_id, folder_id = $folder_id)");
    // Is the media already in this folder?
    $current_folder_id = FolderTable::getMediaFolderID($media_id, $site_id);

    if (isset($current_folder_id) && $current_folder_id == $folder_id) {
        $msg['result'] = 'duplicate';
    } else {

        // If this was added to the 'unassigned' or 'all' folder, remove
        if ($folder_id == 0 || $folder_id == 1) {
            $res = FolderTable::removeMedia($media_id, $site_id);
        } else {
            $res = FolderTable::addMediaToFolder($folder_id, $media_id, $site_id);
        }

        $msg['result'] = $res > 0 ? 'ok' : 'fail';
    }

    $msg['cmd'] = "addMediaToFolder";
    $msg['data'] = array('folder_id' => $folder_id, 'media_id' => $media_id);

    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

function renameFolder($site_id, $folder_id, $name) {

    $res = FolderTable::renameFolder($site_id, $folder_id, $name);

    $msg['cmd'] = "renameFolder";
    $msg['result'] = $res > 0 ? 'ok' : 'fail';
    $msg['data'] = array('name' => $name, 'id' => $folder_id);

    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

function deleteFolder($site_id, $folder_id) {

    $res = FolderTable::deleteFolder($site_id, $folder_id);

    $msg['cmd'] = "deleteFolder";
    $msg['result'] = 'ok';
    $msg['data'] = array('id' => $folder_id);

    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

function addFolder($site_id, $folder_name) {

    // Get the folder list.........
    $id = FolderTable::addFolder($folder_name, $site_id);

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

/**
 * Get the stats summary for the given site
 * @param int $site_id
 */
function getStats($site_id) {

    $disc_usage = du(SecurityUtils::getMediaFolder($site_id)) + du(SecurityUtils::getSitesFolder($site_id));

    // Get page views for the whole site for each day
    $page_views = StatsRollupTables::getAllPageViewsRollup($site_id, 30);
    $views = array();

    if (isset($page_views)) {
        foreach ($page_views as $view) {
            if ($view['page_title'] == 'all') {
                $temp = array();
                $temp['dt'] = $view['rollup_date'];
                $temp['uv'] = $view['unique_visitors'];
                $temp['pv'] = $view['page_views'];
                $views[] = $temp;
            }
        }
    }

    // Get the hits from search engines
    $page_views = StatsRollupTables::getCrawlerViewsLastNDays($site_id, 30);
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


    $msg['getStats'] = "getStats";
    $msg['result'] = 'ok';
    $msg['data'] = array('disc_usage' => $disc_usage . "", 'page_views' => $views, 'crawler_views' => $crawler_views);
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

function getAll($site_id) {

    Logger::debug("Loading all data for site $site_id");
    // Get the folder list.........
    $folder_list = FolderTable::getFoldersForSite($site_id);

    // Get the media list
    $media_list = FolderTable::getMediaForSite($site_id);

    // Get the page list
    //$page_list = PagesTable::getPageSummaries($site_id);
    $page_list = PagesTable::getPages($site_id);

    $page_data = array();
    foreach ($page_list as $page) {
        $temp = $page;
        $temp['last_edit'] = date("m/d/Y H:i", strtotime($page['last_edit'])); // Convert to JS compatible date
        $temp['created'] = date("m/d/Y H:i", strtotime($page['created'])); // Convert to JS compatible date
        $page_data[] = $temp;
    }

    // Get the post list
    $post_list = PostsTable::getPostSummaries($site_id);

    // Get the media file list
    $media_data = array();
    foreach ($media_list as $media) {
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
        'categories' => $cat_list);

    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

function getFolders($site_id) {

    // Get the folder list.........
    $folder_list = FolderTable::getFoldersForSite($site_id);

    $msg = array();
    $msg['cmd'] = 'getFolders';
    $msg['result'] = 'ok';
    $msg['data'] = $folder_list;

    CommandHelper::sendMessage($msg);
}

// //// ///////////////////////////////////////////////////////////////////////////////////////

function getImages($site_id) {

    $media_list = FolderTable::getMediaForSite($site_id);

    $msg = array();
    $msg['cmd'] = 'getMedia';
    $msg['result'] = 'ok';

    $data = array();
    foreach ($media_list as $media) {
        $temp = $media;
        $temp['created'] = date("m/d/Y H:i", strtotime($media['created'])); // Convert to JS compatible date
        $data[] = $temp;
    }

    $msg['data'] = $data;


    CommandHelper::sendMessage($msg);
}

// //// ///////////////////////////////////////////////////////////////////////////////////////

function updateMediaInfo($site_id, $media_id, $title, $desc, $csv_tags) {

    $msg = array();
    $msg['cmd'] = 'saveMediaInfo';
    $msg['result'] = 'ok';

    FolderTable::updateMedia($site_id, $media_id, $title, $desc, $csv_tags);

    $media = FolderTable::getMedia($site_id, $media_id);
    
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
	
    $media = FolderTable::getMedia($site_id, $media_id);

    // Phyiscally delete the file, and thumbnail if applicable
    $path = SecurityUtils::getMediaFolder($site_id) . $media['filepath'] . $media['filename'];
    unlink($path);

    $path = SecurityUtils::getMediaFolder($site_id) . $media['filepath'] . $media['thumb_filename'];
    unlink($path);

    // Now remove from the database
    FolderTable::removeMedia($media_id, $site_id);

    $msg['data'] = array('media_id'=>$media_id);
    
    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////

function assignPagePara($site_id, $page_id, $theme_para_id, $new_value) {

    //Logger::debug("assignPagePara($site_id, $page_post_id, $theme_para_id, $new_value)");

    $id = PageParasTable::setParaValue($site_id, $page_id, $theme_para_id, $new_value);

    $msg = array();

    $msg['cmd'] = 6;
    $msg['result'] = $id > 0 ? 'ok' : 'fail';
    $msg['data'] = array('theme_para_id' => $theme_para_id, 'new_value' => $new_value, 'page_id' => $page_id);

    CommandHelper::sendMessage($msg);
}

?>