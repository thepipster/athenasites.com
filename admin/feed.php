<?php

require_once("code/php/setup.php");

Logger::echoLog();

PageManager::init();

$type = CommandHelper::getPara('type', false, CommandHelper::$PARA_TYPE_STRING);

$url = "http://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];

$url = str_replace('/feed/rss/', '', $url);
$url = str_replace('/feed/rss', '', $url);

$url = str_replace('/feed/rss2/', '', $url);
$url = str_replace('/feed/rss2', '', $url);

$url = str_replace('/feed/atom/', '', $url);
$url = str_replace('/feed/atom', '', $url);

$url = str_replace('/feed/', '', $url);
$url = str_replace('/feed', '', $url);

$parts = parse_url($url);
$domain = $parts['host'];
$page = strtolower(basename($parts['path']));

$mode = 'BLOG';
if (strpos($url, "/".PageManager::$blog_base_url."/") !== false){
	Logger::debug("Single blog post requested!");
	$mode = 'SINGLE_POST';
}

// The blog is a special case, as convention is to use just 'blog' rather than a real page like 'blog.html'
//if ($page == PageManager::$blog_base_url || ($page."/") == PageManager::$blog_base_url){
//	Logger::debug("Main blog");
//}



// Get site id from domain...
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
if ($type == 'rss'){
	$TestFeed = new FeedWriter(RSS1);
	$TestFeed->setLink($url.'/feed/rss');
}
elseif ($type == 'rss2'){
	$TestFeed = new FeedWriter(RSS2);
	$TestFeed->setLink($url.'/feed/rss2');
}
elseif ($type == 'atom'){
	$TestFeed = new FeedWriter(ATOM);
	$TestFeed->setLink($url.'/feed/atom');
}

if ($mode == 'BLOG'){
	
	$TestFeed->setTitle('Testing & Checking the RSS writer class');
	$TestFeed->setDescription('This is test of creating a RSS 2.0 feed Universal Feed Writer');
	
	//Setting the channel elements
	
	//Use wrapper functions for common channel elements
	
	//Image title and link must match with the 'title' and 'link' channel elements for valid RSS 2.0
	//$TestFeed->setImage('Testing the RSS writer class','http://www.ajaxray.com/projects/rss','http://www.rightbrainsolution.com/images/logo.gif');
	
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

}


//OK. Everything is done. Now genarate the feed.

$TestFeed->genarateFeed();

?>

