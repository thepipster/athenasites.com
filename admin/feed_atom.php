<?php

require_once("code/php/setup.php");

// Get site id from domain
$domain = str_replace('www.', '', $_SERVER['HTTP_HOST']);
$site_id = SitesTable::getSiteIDFromDomain($domain);

// Get paras
$page_id = CommandHelper::getPara('pid', false, CommandHelper::$PARA_TYPE_NUMERIC);
$post_id = CommandHelper::getPara('bid', false, CommandHelper::$PARA_TYPE_NUMERIC);

// Get blog info....
$blogPage = PagesTable::getBlogpage($site_id);

$blog_url = $blogPage['path'] . $blogPage['slug'];
$blog_base_url = $blogPage['slug'];
$no_posts = PostsTable::getNoPosts($site_id);


// This is a minimum example of using the Universal Feed Generator Class
//include("FeedWriter.php");

//Creating an instance of FeedWriter class. 
$TestFeed = new FeedWriter(ATOM);
//$TestFeed = new FeedWriter(RSS2);

//Setting the channel elements

//Use wrapper functions for common channel elements

$TestFeed->setTitle('Testing & Checking the RSS writer class');

$TestFeed->setLink('http://www.ajaxray.com/projects/rss');

$TestFeed->setDescription('This is test of creating a RSS 2.0 feed Universal Feed Writer');



//Image title and link must match with the 'title' and 'link' channel elements for valid RSS 2.0

$TestFeed->setImage('Testing the RSS writer class','http://www.ajaxray.com/projects/rss','http://www.rightbrainsolution.com/images/logo.gif');

if (isset($post_id) && $post_id > 0){

	$posts = PostsTable::getRecentPosts($site_id, 20);
	
	foreach($posts as $post){

		$link = "http://" . $_SERVER['HTTP_HOST'] . "/". $blog_base_url . $post['path'] . $post['slug'];

	    //Create an empty FeedItem
	    $newItem = $TestFeed->createNewItem();
	
	    //Add elements to the feed item    
	    $newItem->setTitle($post['title']);
	    $newItem->setLink($link);
	    $newItem->setDate($post['created']);
	    $newItem->setDescription($post['content']);
		   	
	    //Now add the feed item	
	    $TestFeed->addItem($newItem);
	    
	    Logger::dump($post);
		
	}
	


}



//OK. Everything is done. Now genarate the feed.

$TestFeed->genarateFeed();

?>

