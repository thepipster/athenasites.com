<?php

require_once("admin/code/php/setup.php");

//Logger::echoLog();
//Logger::dump($_POST);
//Logger::dump($_GET);

$domain = strtolower($_SERVER['HTTP_HOST']);

$path_parts = explode("/", substr($_SERVER['REQUEST_URI'], 1));

$page = strtolower(basename($_SERVER['REQUEST_URI']));

$ext = strtolower(substr(strrchr($page,'.'),1));

Logger::Debug(">>>> Request page: $page Ext: $ext. Full request: " . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);

if (($ext == 'html') || ($ext == 'htm') || ($ext == 'php')){
	
	// Strip www..
	$domain = str_replace('www.','',$domain);
	
	Logger::debug("Domain: $domain");
	Logger::debug("Page: $page");
	
	PageManager::init($page);
	
	if (PageManager::$site_id){
		Logger::debug("Site ID: ".PageManager::$site_id." Theme ID: ".PageManager::$theme_id." Theme URL: ".PageManager::$theme_url_root);
	}
	else {
		Logger::echoLog();
		Logger::fatal("Domain does not exist!");
	}
	
	// Echo header
	require_once(PageManager::$theme_file_root . 'header.php');
	
	// Get the contents..
	require_once(PageManager::$theme_file_root . 'page_templates/' . PageManager::$template_filename);
	
	// Echo footer
	require_once(PageManager::$theme_file_root . 'footer.php');

}

// Redirect to correct site!
//header("Location: athena.html");

?>