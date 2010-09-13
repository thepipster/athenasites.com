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

Logger::debug("Command = " . $cmd);

// Get the command type, and process
switch ($cmd) {

    case "getSummary":
        getSummary($site_id);
        break;

    case "getPosts":
        getPost($site_id);
        break;

    case "getComments":
        $post_id = CommandHelper::getPara('post_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
        getComments($post_id, $site_id);
        break;

    case "addComment":
        $post_id = CommandHelper::getPara('post_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
        $author_name = CommandHelper::getPara('arn', true, CommandHelper::$PARA_TYPE_STRING);
        $author_email = CommandHelper::getPara('aem', true, CommandHelper::$PARA_TYPE_STRING);
        $post_url = CommandHelper::getPara('purl', true, CommandHelper::$PARA_TYPE_STRING);
        $comment = CommandHelper::getPara('content', true, CommandHelper::$PARA_TYPE_STRING);
        $parent_comment_id = CommandHelper::getPara('pid', true, CommandHelper::$PARA_TYPE_NUMERIC);
        addComment($site_id, $post_id, $parent_comment_id, $comment, $author_name, $author_email, $post_url);
        break;

    default :
        CommandHelper::sendTextMessage("Undefined command '$cmd'");
}

// ///////////////////////////////////////////////////////////////////////////////////////
//
// Secure getters
//
// ///////////////////////////////////////////////////////////////////////////////////////

function getSummary($site_id){

    $msg['cmd'] = 'getSummary';
    $msg['result'] = 'ok';

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
        'no_followers' => DatabaseManager::getVar(DatabaseManager::prepare("SELECT count(id) FROM athena_FollowerToSite where site_id = %d", $site_id)),
        'followers' => SiteFollowersTable::getTopNFollowers($site_id, 10)
    );

    CommandHelper::sendMessage($msg);
}

function getStats($site_id){

}

// ///////////////////////////////////////////////////////////////////////////////////////
//
// No-security getters
//
// ///////////////////////////////////////////////////////////////////////////////////////

function addComment($site_id, $post_id, $parent_comment_id, $comment, $author_name, $author_email, $post_url){

    //$site = SitesTable::getSite($site_id);
    $page = PagesTable::getBlogpage($site_id);
    
    // Check if this is spam from AkisMet
    $apiKey = "07d55b1f2e1b";
    $user = "apollosites";
    $pass = "k9G18ReR";    
    //$blogURL = 'http://www.apollosites.com/blog/';
    $blogURL = PageManager::getPageLink($page['id']);

    $author_ip = PageViewsTable::getRealIPAddr();
    $author_url = '';
    
    $akismet = new Akismet($blogURL ,$apiKey);
    $akismet->setCommentAuthor($author_name);
    $akismet->setCommentAuthorEmail($author_email);
    $akismet->setCommentAuthorURL($author_url);
    $akismet->setCommentContent($comment);
    $akismet->setPermalink($post_url);

    //
    // Check to see if this is possible spam or not?
    //

    // Innocent until proven guilty...
    $status = 'Pending';
    $isSpam = false;

    // Check from akismet..
    if($akismet->isCommentSpam()){
        $status = 'Spam';
        $isSpam = true;
    }

    
    //
    // Add follower, unless they are already registered. We
    //
    
    // Create/Update the blog follower....
    if ($author_email != '') {
        $follower_id = SiteFollowersTable::getFollowerIDFromEmail($author_email);
    } else if ($author_url != '') {
        // If they have no email, search by url
        $follower_id = SiteFollowersTable::getFollowerIDFromURL($author_url);
    } else {
        // If they have no email or URL, search by name - which is not ideal as name may not be unique
        $follower_id = SiteFollowersTable::getFollowerIDFromName($author_name);
    }

    if (!isset($follower_id)) {
        $follower_id = SiteFollowersTable::addFollower($author_name, $author_email, $author_ip, $author_url);
        SiteFollowersTable::updateCreatedDate($follower_id, $date_str); // Force the imported comment date as the create date for this follower
    } else {
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
    $comment_id = CommentsTable::create($site_id, $post_id, $parent_comment_id, $content, $status, $author_ip, $follower_id);

    $msg['cmd'] = 'addComment';
    $msg['result'] = 'ok';
    
    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

function getPosts($site_id) {


    $msg['cmd'] = 'getPosts';
    $msg['result'] = 'ok';
    //$msg['data'] = array('gallery_images' => getGalleryImageList($site_id), 'gallery_meta' => GalleryTable::getAllMeta($site_id));

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
    foreach($comment_list as $comment){
        $comment['created'] = date("m/d/Y H:i", strtotime($comment['created'])); // Convert to JS compatible date
        $comments[] = $comment;
    }

    $msg['data'] = array('post_id' => $post_id, 'comments' => $comments);

    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////



?>