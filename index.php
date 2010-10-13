<?php

$DEBUG = 0;

require_once("admin/code/php/setup.php");

if ($DEBUG) Logger::echoLog();
//$domain = strtolower($_SERVER['HTTP_HOST']);
//$page = strtolower(basename($_SERVER['REQUEST_URI']));
//$path = strtolower(dirname($_SERVER['REQUEST_URI']));

$url = "http://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
$parts = parse_url($url);

// We support the following query strings
// ?category=xxxx
// ?tag=xxxx
// ?year=xxxxx - displays all blog posts for this year
// ?year=xxxxx&month=xxxxxx - displays all blog posts for this year and month
// ?page=xxxxx - displays a specific blog page, used for older/newer link
$tag = '';
$category = '';
$query_string = '';
$month = '';
$year = '';
$page_no = '';

$domain = $parts['host'];
$page = strtolower(basename($parts['path']));
$path = strtolower(dirname($parts['path']));
if ($path != "/")
    $path .= "/";

if (isset($parts['query'])) {
    $query_string = $parts['query'];
    parse_str($parts['query']); // Read the query string into variables
}
$ext = substr(strrchr($page, '.'), 1);

if ($DEBUG) Logger::debug(">>>> Request page: $page Ext: $ext Full request: " . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
if ($DEBUG) Logger::debug(">>>> Domain: $domain Page: $page Path: $path ");
if ($DEBUG) Logger::debug(">>>> Tag: $tag Category: $category Month: $month Year: $year");

PageManager::init();

// The blog is a special case, as convention is to use just 'blog' rather than a real page like 'blog.html'
if ($page == PageManager::$blog_base_url || ($page."/") == PageManager::$blog_base_url){
	$ext = "html";
}

if ($page == '' || (($ext == 'html') || ($ext == 'htm') || ($ext == 'php'))) {

    PageManager::load($page, $path, $tag, $category, $month, $year, $page_no);

    // Log the page view if this is a real page
    PageViewsTable::logView(PageManager::$site_id, PageManager::$page_id, $page, $path, $query_string);

	if ($DEBUG) die();

    // Echo header
    require_once(PageManager::$theme_file_root . 'header.php');

    // Get the contents..
    require_once(PageManager::$theme_file_root . 'page_templates/' . PageManager::$template_filename);

    // Echo footer
    require_once(PageManager::$theme_file_root . 'footer.php');
}
else {

    // Try to get a site id, if we can fint one then hit its 404 page!
    $site = SitesTable::getSiteFromDomain($domain);

    if (isset($site)){

        $site_id = $site['id'];
        $page404 = PageManager::$theme_file_root . '404.php';

        if (file_exists($page404) ){
            
            // Echo header
            require_once(PageManager::$theme_file_root . 'header.php');

            // Get the contents..
            require_once($page404);

            // Echo footer
            require_once(PageManager::$theme_file_root . 'footer.php');
            
        }
        else {
            echo "Oops, 404 ERROR!";
        }
    }
    else {
        echo "Oops, 404 ERROR!";
    }
}
?>