<?php

require_once("admin/code/php/setup.php");

//Logger::echoLog();

$domain = $_SERVER['HTTP_HOST'];
$domain = str_replace('www.', '', $domain);

// Get the site id
$site = SitesTable::getSiteFromDomain($domain);
$site_id = $site['id'];

/*
$sql = DatabaseManager::prepare("SELECT max(last_login) FROM apollo_UserToSite uts 
		INNER JOIN apollo_Users u
    	WHERE uts.user_id = u.id AND uts.site_id = %d", $site_id);    	
$last_date = DatabaseManager::getVar($sql);
$last_date = date("Y-m-d", strtotime($last_date));
*/

header ("Content-Type:text/xml");

echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?> \n";
echo "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"> \n";

// Get the list of pages

$sql = DatabaseManager::prepare("SELECT * FROM athena_%d_Pages", $site_id);    	
$page_list = DatabaseManager::getResults($sql);

foreach($page_list as $page) {
	
	$link = trim('http://' . $domain . $page['path'] . $page['slug']);
	$last_date = date("Y-m-d", strtotime($page['last_edit']));
	
	echo "    <url>\n";
	echo "        <loc>$link</loc>\n";
	echo "        <lastmod>$last_date</lastmod>\n";
	//echo "        <changefreq>daily</changefreq>\n";
	//echo "        <priority>0.8</priority>\n";
	echo "    </url>\n";
	
}

echo "</urlset>";
?>