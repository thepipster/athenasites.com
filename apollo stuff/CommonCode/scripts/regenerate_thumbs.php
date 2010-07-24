<?php

$discRoot = realpath(dirname(__FILE__)) . "/";
$common_code_root = substr($discRoot, 0, strpos($discRoot, 'wp-content')) . 'wp-content/CommonCode/';
$wp_root = substr($discRoot, 0, strpos($discRoot, 'wp-content')) . '/';
$blog_downloads_root = substr($discRoot, 0, strpos($discRoot, 'wp-content')) . 'wp-content/blogs.dir/';

require_once($wp_root . 'wp-load.php');
require_once($wp_root . 'wp-admin/includes/admin.php');

require_once($common_code_root . 'php/utils/Session.class.php');
require_once($common_code_root . 'php/utils/ApolloLogger.class.php');
require_once($common_code_root . 'php/utils/WordPressHelper.class.php');

$blog_id = 2;
$post_id = 42; // 'intro30.jpg'

ApolloLogger::echoLog();

WordPressHelper::setCurrentBlog($blog_id);
WordPressHelper::regenerateThumbnail($post_id, $blog_id, $blog_downloads_root);

?>