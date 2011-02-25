<?php

require_once("code/php/setup.php");

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

Logger::debug("Feed Generator: Blog mode = $mode type = $type");

if ($mode == 'BLOG'){

	if ($blogPage['browser_title'] == ''){
		$title = $blogPage['title'];
	}
	else {
		$title = $blogPage['browser_title'];
	}
	
	$description = PageParasTable::getParaValue(0, 1, $site_id);
	
	switch($type){
		case 'rss': break;
		case 'rss2': FeedGenerator::blogRSS2($site_id, $title, $description, $url); break;
		case 'atom': FeedGenerator::blogAtom($site_id, $title, $description, $url); break;
	}
	//Creating an instance of FeedWriter class. 
	/*
	if ($type == 'rss'){
		//$TestFeed = new FeedWriter(RSS1);
		//$TestFeed->setLink($url.'/feed/rss');
	}
	elseif ($type == 'rss2'){
		//$TestFeed = new FeedWriter(RSS2);
		//$TestFeed->setLink($url.'/feed/rss2');
		FeedGenerator::blogRSS2($site_id);
	}
	elseif ($type == 'atom'){
		//$TestFeed = new FeedWriter(ATOM);
		//$TestFeed->setLink($url.'/feed/atom');
	}
	*/
	
}


?>

