<?php

$discRoot = realpath(dirname(__FILE__)) . "/";
$common_code_root = substr($discRoot, 0, strpos($discRoot, 'wp-content')) . 'wp-content/CommonCode/';
$wp_root = substr($discRoot, 0, strpos($discRoot, 'wp-content')) . '/';
$blog_downloads_root = substr($discRoot, 0, strpos($discRoot, 'wp-content')) . 'wp-content/blogs.dir/';

require_once($wp_root . 'wp-load.php');
require_once($wp_root . 'wp-admin/includes/admin.php');

require_once($common_code_root . 'php/utils/ApolloLogger.class.php');
require_once($common_code_root . 'php/dal/ClientGalleryTable.class.php');

global $wpdb;

$sql = $wpdb->prepare("SELECT * FROM apollo_PageViews"); 		
$data_list = $wpdb->get_results($sql, ARRAY_A);

$browser = new BrowserDetect();

foreach($data_list as $page_view){

	$browser->setUserAgent($page_view['user_agent']);
			
	$browser_name = $browser->getBrowser();
	$browser_ver =  $browser->getVersion();
	$platform = $browser->getPlatform();
	$os = $browser->getOS();
	$is_bot = $browser->isRobot();
		
	// If BrowserDetect could not find it, try the browser_detection script instead	
	if ($browser_name == BrowserDetect::BROWSER_UNKNOWN){
		$browser_name = browser_detection('browser_name', '', $page_view['user_agent']);
	}
	if ($browser_ver == BrowserDetect::VERSION_UNKNOWN){
		$browser_ver = browser_detection('browser_number', '', $page_view['user_agent']);
	}
	if ($os == BrowserDetect::OPERATING_SYSTEM_UNKNOWN){
		$os = browser_detection('os', '', $page_view['user_agent']);
	}

	$os_ver = browser_detection('os_number', '', $page_view['user_agent']);
	
	$sql = $wpdb->prepare("UPDATE apollo_PageViews SET browser = %s, browser_ver = %s, os_name = %s, os_ver = %s, is_bot = %d WHERE view_date = %s AND ip_long", 
		$browser_name, $browser_ver, $os, $os_ver, $is_bot, $page_view['view_date'], $page_view['ip_long']);
	$wpdb->query($sql);		
}



?>