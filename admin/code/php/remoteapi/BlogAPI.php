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

/**
* Check that a user is logged in, and that they have access to this site for the secure commands
*/
function checkSecure($site_id){
}

//
// Check that a user is logged in, and that they have access to this site for the secure commands
//

switch ($cmd) {
	
    case "getSummary":
    case "getComments":
    case "getApprovedComments":
    case "addComment":	
    	// Non-secure
        break;

    case "deletePost":
    case "getPostDetails":
    case "updatePost":
    case "addPost":
    case "importPost":
    case "importLJ":
    case "importComments":
    case "updateCommentStatus":
    case "addPostTags":
    case "addTags":
    case "addPostCategories":
    case "addCategories":
    case "removeTag":
    case "removeCategory":
    case "deleteTag":
    case "deleteCategory":
    	// Secure, validate user is signed in and has access
		if (!SecurityUtils::isLoggedInForSite($site_id)) {
		    error_log("You are not authorized for this site!");
		    CommandHelper::sendAuthorizationFailMessage("You are not authorized for this site!");
		    die();
		}
		break;

    default :
    	Logger::error("Command $cmd has not been added to security check code in BlogAPI, need to add it so we know how to authorize requests!");
}

//
// Now exectute the command....
//

Logger::debug("Command = " . $cmd);

// Get the command type, and process
switch ($cmd) {

    case "getSummary":
        getSummary($site_id);
        break;

    case "getComments":
        $post_id = CommandHelper::getPara('post_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
        getComments($post_id, $site_id);
        break;

    case "getApprovedComments":
        $post_id = CommandHelper::getPara('post_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
        getApprovedComments($post_id, $site_id);
        break;

    case "addComment":
        $post_id = CommandHelper::getPara('post_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
        $author_name = CommandHelper::getPara('name', true, CommandHelper::$PARA_TYPE_STRING);
        $author_email = CommandHelper::getPara('email', true, CommandHelper::$PARA_TYPE_STRING);
        $author_url = CommandHelper::getPara('author_url', true, CommandHelper::$PARA_TYPE_STRING);
        $comment = CommandHelper::getPara('content', true, CommandHelper::$PARA_TYPE_STRING);
        $parent_comment_id = CommandHelper::getPara('pid', true, CommandHelper::$PARA_TYPE_NUMERIC);
        addComment($site_id, $post_id, $parent_comment_id, $comment, $author_name, $author_email, $author_url);
        break;


	//
    // Commands that need authorization 
	//
	
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
        $can_comment = CommandHelper::getPara('can_comment', false, CommandHelper::$PARA_TYPE_NUMERIC);
        if (!isset($can_comment)) $can_comment = 1;
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

    case "addPostTags":
        $csv_tags = CommandHelper::getPara('csvtags', true, CommandHelper::$PARA_TYPE_STRING);
        $post_id = CommandHelper::getPara('post_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
        addTag($site_id, $post_id, $csv_tags);
        break;

    case "addTags":
        $csv_tags = CommandHelper::getPara('csvtags', true, CommandHelper::$PARA_TYPE_STRING);
        addTags($site_id, $csv_tags);
        break;

    case "addPostCategories":
        $csv_categories = CommandHelper::getPara('csvcats', true, CommandHelper::$PARA_TYPE_STRING);
        $post_id = CommandHelper::getPara('post_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
        addCategory($site_id, $post_id, $csv_categories);
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

    default :
        CommandHelper::sendTextMessage("Undefined command '$cmd'");
}

// ///////////////////////////////////////////////////////////////////////////////////////
//
// Helper functions
//
// ///////////////////////////////////////////////////////////////////////////////////////

/**
* Get all the details we need for a post, and format dates to be JS compatible
*/
function getPostComplete($site_id, $post_id){

    $post = PostsTable::getPost($site_id, $post_id);

    if (isset($post)) {
    	$postObj = new Post($post);
        $post['last_edit'] = date("m/d/Y H:i", strtotime($post['last_edit'])); // Convert to JS compatible date
        $post['created'] = date("m/d/Y H:i", strtotime($post['created'])); // Convert to JS compatible date
        $post['tags'] = PostsTable::getPostTags($site_id, $post['id']);
        $post['categories'] = PostsTable::getPostCategories($site_id, $post['id']);
        $post['content'] = ImportHelper::convertContent($post['content'], $post['source']);
        $post['url'] = $postObj->getLink();
        $post['noComments'] = CommentsTable::getNoCommentsForPost($site_id, $post_id);
    }
    
    return $post;
}

// ///////////////////////////////////////////////////////////////////////////////////////
//
// Non-Secure getters
//
// ///////////////////////////////////////////////////////////////////////////////////////

function getSummary($site_id){

    $msg['cmd'] = 'getSummary';
    $msg['result'] = 'ok';

    $followers = SiteFollowersTable::getTopNFollowers($site_id, 25);
    $folower_list = array();
    if (isset($followers)){
	    foreach($followers as $follower){
	        $follower['last_activity'] = date("m/d/Y H:i", strtotime($follower['last_activity'])); // Convert to JS compatible date
	        $folower_list[] = $follower;
	    }
    }

    $msg['data'] = array(
        'comments_approved' => DatabaseManager::getVar(DatabaseManager::prepare("SELECT count(id) FROM athena_%d_Comments WHERE status = 'Approved'", $site_id)),
        'comments_pending' => DatabaseManager::getVar(DatabaseManager::prepare("SELECT count(id) FROM athena_%d_Comments WHERE status = 'Pending'", $site_id)),
        'comments_trash' => DatabaseManager::getVar(DatabaseManager::prepare("SELECT count(id) FROM athena_%d_Comments WHERE status = 'Trash'", $site_id)),
        'comments_spam' => DatabaseManager::getVar(DatabaseManager::prepare("SELECT count(id) FROM athena_%d_Comments WHERE status = 'Spam'", $site_id)),
        'posts_published' => DatabaseManager::getVar(DatabaseManager::prepare("SELECT count(id) FROM athena_%d_Posts WHERE status = 'Published'", $site_id)),
        'posts_private' => DatabaseManager::getVar(DatabaseManager::prepare("SELECT count(id) FROM athena_%d_Posts WHERE status = 'Private'", $site_id)),
        'posts_draft' => DatabaseManager::getVar(DatabaseManager::prepare("SELECT count(id) FROM athena_%d_Posts WHERE status = 'Draft'", $site_id)),
        'categories' => DatabaseManager::getVar(DatabaseManager::prepare("SELECT count(id) FROM athena_%d_PostCategories", $site_id)),
        'tags' => DatabaseManager::getVar(DatabaseManager::prepare("SELECT count(id) FROM athena_%d_PostTags", $site_id)),
        'no_followers' => SiteFollowersTable::getNoFollowers($site_id),
        'followers' => $folower_list
    );

    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

function getStats($site_id){

}

// ///////////////////////////////////////////////////////////////////////////////////////

function addComment($site_id, $post_id, $parent_comment_id, $content, $author_name, $author_email, $author_url){
	
	Logger::debug("addComment($site_id, $post_id, $parent_comment_id, $content, $author_name, $author_email, $author_url)");
	
    //$site = SitesTable::getSite($site_id);
    $page = PagesTable::getBlogpage($site_id);

    // Get the current date and time
    $date_str = date('Y-m-d H:i:s');

    $author_ip = PageViewsTable::getRealIPAddr();

    // Check if this is spam from AkisMet
    $user = AKISMET_USER;
    $pass = AKISMET_PASS;
    //$blogURL = 'http://www.apollosites.com/blog/';
    $blogURL = PageManager::getPageLink($page['id']);
    
    // Innocent until proven guilty...
    $status = 'Pending';
    $isSpam = false;

	if (!DEV_MODE){    
	    // Check from akismet..
	    try {
	    
		    $akismet = new Akismet($blogURL , AKISMET_API_KEY);
		    $akismet->setCommentAuthor($author_name);
		    $akismet->setCommentAuthorEmail($author_email);
		    $akismet->setCommentAuthorURL($author_url);
		    $akismet->setCommentContent($content);
		    $akismet->setPermalink($author_url);
		
		    //
		    // Check to see if this is possible spam or not?
		    //
	
		    if($akismet->isCommentSpam()){
		        $status = 'Spam';
		        $isSpam = true;
		    }
	    }
	    catch(Exception $e){
	    	Logger::error("Could not reach Akismet!");
	    }
    }
    
    //
    // Add follower, unless they are already registered. We
    //
    
    // Create/Update the blog follower....
    if ($author_email != '') {
        $follower_id = SiteFollowersTable::getFollowerIDFromEmail($author_email);
    } 
    else if ($author_url != '') {
        // If they have no email, search by url
        $follower_id = SiteFollowersTable::getFollowerIDFromURL($author_url);
    } 
    else {
        // If they have no email or URL, search by name - which is not ideal as name may not be unique
        $follower_id = SiteFollowersTable::getFollowerIDFromName($author_name);
    }

    if (!isset($follower_id)) {
        $follower_id = SiteFollowersTable::addFollower($author_name, $author_email, $author_ip, $author_url);
        SiteFollowersTable::updateCreatedDate($follower_id, $date_str); // Force the imported comment date as the create date for this follower
    } 
    else {
        SiteFollowersTable::updateFollower($follower_id, $author_ip, $author_url);
        SiteFollowersTable::updateLastActivityDate($follower_id, $date_str); // Force the imported comment date as the last activity date for this follower
    }

    // Add follower to site
    SiteFollowersTable::addFollowerToSite($follower_id, $site_id);

    // If this is spam, flag this follower as a spammer
    if ($isSpam){
        SiteFollowersTable::flagSpammer($follower_id);
    }

    //
    // Create the comment....
    //
    $comment_id = CommentsTable::create($site_id, $post_id, $parent_comment_id, StringUtils::makeHtmlSafe($content), $status, $author_ip, $follower_id);
	
	// Send email to client
	EmailMessaging::sendGotCommentEmail($site_id, $comment_id);
	
    $msg['cmd'] = 'addComment';
    $msg['result'] = 'ok';
    
    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

function getComments($post_id, $site_id) {

    $msg['cmd'] = 'getComments';
    $msg['result'] = 'ok';

    if ($post_id == 0){
        $comment_list = CommentsTable::getRecentComments($site_id, 30);
    }
    else {
        $comment_list = CommentsTable::getCommentsForPost($site_id, $post_id);
    }
    $comments = array();
    if (isset($comment_list)){
	    foreach($comment_list as $comment){
	        $comment['created'] = date("m/d/Y H:i", strtotime($comment['created'])); // Convert to JS compatible date
	        $comments[] = $comment;
	    }
	}
	
    $msg['data'] = array('post_id' => $post_id, 'comments' => $comments);

    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

/**
* Get the approved comments for this post
*/
function getApprovedComments($post_id, $site_id) {

    $msg['cmd'] = 'getComments';
    $msg['result'] = 'ok';

    $comment_list = CommentsTable::getCommentsForPostForStatus($site_id, $post_id, 'Approved');
    
    $comments = array();
    if (isset($comment_list)){
	    foreach($comment_list as $comment){
	        $comment['created'] = date("m/d/Y H:i", strtotime($comment['created'])); // Convert to JS compatible date
	        $comments[] = $comment;
	    }
    }

    $msg['data'] = array('post_id' => $post_id, 'comments' => $comments);

    CommandHelper::sendMessage($msg);
}


// ///////////////////////////////////////////////////////////////////////////////////////
//
// Posts....
//
// ///////////////////////////////////////////////////////////////////////////////////////


function getPostDetails($site_id, $post_id) {

    $post = getPostComplete($site_id, $post_id);

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

	Logger::debug("Updating post!!");
	
    $user_id = SecurityUtils::getCurrentUserID();
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

    PostsTable::update($site_id, $post_id, $safe_content, $status, $safe_title, $can_comment, Post::encodeSlug($safe_title), 'apollo');
	
    $post = getPostComplete($site_id, $post_id);

	ImportHelper::processPostContent($site_id, $post);

    PostsTable::updatePath($post_id, $site_id, Post::generatePath($post['created']));

    $msg['cmd'] = "updatePost";
    $msg['result'] = 'ok';
    $msg['data'] = array('post' => $post);

	//Logger::dump(PostsTable::getPost($site_id, $post_id));
	
    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

function addPost($site_id, $title, $content, $status, $slug, $can_comment) {

    $user_id = SecurityUtils::getCurrentUserID();
    $path = '';

    $post_id = PostsTable::create($site_id, $user_id, StringUtils::makeHtmlSafe($content), $status, StringUtils::makeHtmlSafe($title), $can_comment, Post::encodeSlug($title), 'apollo');

    $post = getPostComplete($site_id, $post_id);

    PostsTable::updatePath($post_id, $site_id, Post::generatePath($post['created']));

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

function addCategory($site_id, $post_id, $csv_categories) {

	//$cats = array();
    $cat_list = explode(",", $csv_categories);

    foreach ($cat_list as $cat) {
        $cat = trim($cat);
        if ($cat != "") {
            $safecat = StringUtils::makeTextSafe($cat);
		    $category_id = PostsTable::addCategoryToPost($site_id, $post_id, $safecat);
            //$cats[] = $safecat;
        }
    }

    $msg['cmd'] = "addCategory";
    $msg['result'] = 'ok';
    $msg['data'] = array('post' =>  getPostComplete($site_id, $post_id), 'categories' => PostsTable::getCategories($site_id));

    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

function addTag($site_id, $post_id, $csv_tags) {

	//$tags = array();
    $tag_list = explode(",", $csv_tags);

    foreach ($tag_list as $tag) {
        $tag = trim($tag);
        if ($tag != "") {
            $safetag = StringUtils::makeTextSafe($tag);
		    $tag_id = PostsTable::addTagToPost($site_id, $post_id, $safetag);
		    //$tags[] = $safetag;
        }
    }

    $tag_list = PostsTable::getTags($site_id);

    $msg['cmd'] = "addTags";
    $msg['result'] = 'ok';
    $msg['data'] = array('post' =>  getPostComplete($site_id, $post_id), 'tags' => PostsTable::getTags($site_id));

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

?>