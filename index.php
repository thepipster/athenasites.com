<?php

require_once("admin/code/php/setup.php");

//Logger::echoLog();

//$domain = strtolower($_SERVER['HTTP_HOST']);
//$page = strtolower(basename($_SERVER['REQUEST_URI']));
//$path = strtolower(dirname($_SERVER['REQUEST_URI']));

$url = "http://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
$parts = parse_url($url);

$tag = '';
$category = '';
$domain = $parts['host'];
$page = strtolower(basename($parts['path']));
$path = strtolower(dirname($parts['path'])) . "/";
if (isset($parts['query'])){
	parse_str($parts['query']);
}
$ext = substr(strrchr($page,'.'),1);

//Logger::debug("Domain: $domain Page: $page Path: $path Tag: $tag Category: $category");

Logger::debug(">>>> Request page: $page Ext: $ext Full request: " . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);

if ($page == '' || (($ext == 'html') || ($ext == 'htm') || ($ext == 'php'))){
	
	// Strip www..
	$domain = str_replace('www.','',$domain);
	
	//Logger::debug("Domain: $domain");
	//Logger::debug("Page: $page");
	
	PageManager::init($page, $path, $tag, $category);
	
	/*
	if (PageManager::$site_id){
		Logger::debug("Site ID: ".PageManager::$site_id." Theme ID: ".PageManager::$theme_id." Theme URL: ".PageManager::$theme_url_root);
	}
	else {
		Logger::echoLog();
		Logger::fatal("Domain does not exist!");
	}
	*/
	
	// Echo header
	require_once(PageManager::$theme_file_root . 'header.php');
	
	// Get the contents..
	require_once(PageManager::$theme_file_root . 'page_templates/' . PageManager::$template_filename);
	
	// Echo footer
	require_once(PageManager::$theme_file_root . 'footer.php');

}
else {
	echo "Oops, 404 ERROR!";
}

?>