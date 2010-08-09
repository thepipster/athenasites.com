<?php

require_once("../admin/code/php/setup.php");

Logger::echoLog();
Logger::dump($_POST);
Logger::dump($_GET);
die();

$domain = strtolower($_SERVER['HTTP_HOST']);
$page = strtolower(basename($_SERVER['REQUEST_URI']));

// Strip www..
$domain = str_replace('www.','',$domain);

Logger::debug("Domain: $domain");
Logger::debug("Page: $page");

PageManager::init();

if (PageManager::$site_id){
	Logger::debug("Site ID: ".PageManager::$site_id." Theme ID: ".PageManager::$theme_id." Theme URL: ".PageManager::$theme_url_root);
}
else {
	Logger::echoLog();
	Logger::fatal("Domain does not exist!");
}


// Echo header
require_once(PageManager::$theme_file_root . 'header.php');


// Echo footer
require_once(PageManager::$theme_file_root . 'footer.php');


// Redirect to correct site!
//header("Location: athena.html");

?>