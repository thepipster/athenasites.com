<?php

$discRoot = realpath(dirname(__FILE__)) . "/";
$common_code_root = substr($discRoot, 0, strpos($discRoot, 'wp-content')) . 'wp-content/CommonCode/';
$wp_root = substr($discRoot, 0, strpos($discRoot, 'wp-content')) . '/';
$blog_downloads_root = substr($discRoot, 0, strpos($discRoot, 'wp-content')) . 'wp-content/blogs.dir/';

require_once($wp_root . 'wp-load.php');
require_once($wp_root . 'wp-admin/includes/admin.php');

require_once($common_code_root . 'php/utils/Session.class.php');
require_once($common_code_root . 'php/utils/ApolloLogger.class.php');
require_once($common_code_root . 'php/utils/Browser.class.php');
require_once($common_code_root . 'php/utils/TimeUtils.class.php');
require_once($common_code_root . 'php/utils/KeywordExtractor.class.php');

Logger::echoLog();

global $wpdb;

$gallery_images = $wpdb->get_results("SELECT * FROM apollo_GalleryTable", ARRAY_A);		

// Go through list, and remove any that don't have corresponding entries in the posts table for that blog
foreach($gallery_images as $images){

	$blog_id = $images['blog_id'];	
	$image_post_id = $images['image_post_id'];	
	$page_post_id = $images['page_post_id'];	
	
	$sql = $wpdb->prepare("SELECT * FROM wp_%d_posts WHERE ID = %d",  $blog_id, $image_post_id); 		
	$data = $wpdb->get_results($sql, ARRAY_A);		
	
	if (!isset($data)){
		Logger::debug("Deleting image id $image_post_id for blog id $blog_id <br\>\n");		
		$sql = $wpdb->prepare("DELETE FROM apollo_GalleryTable WHERE blog_id = %d AND image_post_id = %d",  $blog_id, $image_post_id); 		
		$wpdb->query($sql, ARRAY_A);		
	}
	
}
?>