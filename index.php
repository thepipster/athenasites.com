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

if (!isset(PageManager::$site_id) || PageManager::$site_id == 0){
	header('Location: http://apollosites.com/404.php');
	die();
}

// Check to see if this is a single blog entry
if (strpos($_SERVER['REQUEST_URI'], "/".PageManager::$blog_base_url."/") !== false){
	Logger::debug("Single blog post requested!");
	$ext = "html";
}

// The blog is a special case, as convention is to use just 'blog' rather than a real page like 'blog.html'
if ($page == PageManager::$blog_base_url || ($page."/") == PageManager::$blog_base_url){
	$ext = "html";
}

if ($page == '' || (($ext == 'html') || ($ext == 'htm') || ($ext == 'php'))) {

    PageManager::load($page, $path, $tag, $category, $month, $year, $page_no);

	if ($DEBUG) die();

    // Echo header
    require_once(PageManager::$theme_file_root . 'header.php');

    // Get the contents..
    if (PageManager::$validPage){
	    require_once(PageManager::$theme_file_root . 'page_templates/' . PageManager::$template_filename);
    }
    else {
        $page404 = PageManager::$theme_file_root . '404.php';
        require_once($page404);
        Log404Table::create(PageManager::$site_id, $_SERVER['REQUEST_URI'], getRealIPAddr());
    }

    // Echo footer
    require_once(PageManager::$theme_file_root . 'footer.php');
}
else {

    // Try to get a site id, if we can fint one then hit its 404 page!
	self::$domain = str_replace('www.', '', $domain);
    $site = SitesTable::getSiteFromDomain($domain);

	if ($DEBUG) die();

    if (isset($site)){

        $site_id = $site['id'];
        $page404 = PageManager::$theme_file_root . '404.php';

        if (file_exists($page404) ){
            
            // Echo header
            require_once(PageManager::$theme_file_root . 'header.php');

            // Get the contents..
            require_once($page404);
	        Log404Table::create(PageManager::$site_id, $_SERVER['REQUEST_URI'], getRealIPAddr());

            // Echo footer
            require_once(PageManager::$theme_file_root . 'footer.php');
            
        }
        else {
        	//Logger::error("Could not find 404 page for site $site_id for requested url $url");
	        Log404Table::create(PageManager::$site_id, $_SERVER['REQUEST_URI'], getRealIPAddr());
            echo "Oops, 404 ERROR!";
        }
    }
    else {
        //Logger::error("Could not find page or site for requested url $url");
        echo "Oops, 404 ERROR!";
    }
}
?>