<?php

require_once("code/php/setup.php");

// Get site id from domain
$domain = str_replace('www.', '', $_SERVER['HTTP_HOST']);
$site_id = SitesTable::getSiteIDFromDomain($domain);

// Get paras
$page_id = CommandHelper::getPara('pid', false, CommandHelper::$PARA_TYPE_NUMERIC);
$post_id = CommandHelper::getPara('bid', false, CommandHelper::$PARA_TYPE_NUMERIC);
$referer = CommandHelper::getPara('ref', false, CommandHelper::$PARA_TYPE_STRING);

// logView($site_id, $page_id, $post_id, $page, $path, $query_string)
// m=post&sid=$site_id&pid=$post_id&pth=$page_path&qs='+window.location.search.substr(1)

$page = PagesTable::getPage($site_id, $page_id);
$slug = $page['slug'];
$path = $page['path'];

if (!isset($post_id) || !$post_id) $post_id = 0;

/*
if (!isset($post_id) || $post_id == 0){
	PageViewsTable::logView($site_id, $page_id, 0, $slug, $path, $query_string);
}
else {
	PageViewsTable::logView($site_id, $page_id, $post_id, $slug, $path, $query_string);
}
*/

$browser = new Browser();

$browser_name = $browser->getBrowser();
$browser_ver = $browser->getVersion();
$os = $browser->getPlatform();
$is_bot = $browser->isRobot();

//$os_ver = browser_detection('os_number');

$date_now = date("Y-m-d H:i:s", mktime(date("H"), date("i"), date("s"), date("m"), date("d"), date("Y")));

/*
if (isset($_SERVER['HTTP_REFERER'])) {
    $referer = $_SERVER['HTTP_REFERER'];
} else if (isset($_ENV['HTTP_REFERER'])) {
    $referer = $_ENV['HTTP_REFERER'];
} else {
    $referer = '';
}
*/

// Extract query string from referal url
$query_string = "";
if (isset($referer) && $referer != ''){
	$parts = parse_url($referer);
	if (isset($parts['query'])){
		$query_string = $parts['query'];
	}
}

$user_agent = $_SERVER['HTTP_USER_AGENT'];
$server_ip = $_SERVER['SERVER_ADDR'];
$true_ip = getRealIPAddr();

$sql = DatabaseManager::prepare("INSERT INTO stats_PageViews ( 
	site_id, 
	page_id, 
	post_id, 
	page, 
	path, 
	query_string, 
	view_date, 
	ip_long, 
	browser, 
	browser_ver, 
	os, 
	referer, 
	user_agent, 
	is_bot, 
	server_ip) 
	VALUES (%d, %d, %d, %s, %s, %s, %s, %d, %s, %s, %s, %s, %s, %d, %d)",
     $site_id, 
     $page_id, 
     $post_id, 
     $slug, 
     $path, 
     $query_string, 
     $date_now, 
     ip2long($true_ip), 
     $browser_name, 
     $browser_ver, 
     $os, 
     $referer, 
     $user_agent, 
     $is_bot, 
     ip2long($server_ip));
     
DatabaseManager::insert($sql);
    
?>