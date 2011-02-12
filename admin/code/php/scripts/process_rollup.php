<?php

require_once("../setup.php");

Logger::echoLog();

$server_list = array(
    array('no' => 1, 'iplong' => ip2long('10.179.34.7'), 'ip' => '10.179.34.7'),
    array('no' => 1, 'iplong' => ip2long('173.203.100.231'), 'ip' => '173.203.100.231'),
    array('no' => 2, 'iplong' => ip2long('10.179.52.99'), 'ip' => '10.179.52.99'),
    array('no' => 2, 'iplong' => ip2long('173.203.123.58'), 'ip' => '173.203.123.58'),
    array('no' => 99, 'iplong' => ip2long('127.0.0.1'), 'ip' => '127.0.0.1')
);

// FOR DEBUGGING, CLEAR TABLES!!!
/*
$NO_SITES = 8;

DatabaseManager::submitQuery("TRUNCATE stats_RollupServer");

// Create/clear rollup tables
for ($i = 1; $i <= $NO_SITES; $i++) {
    DatabaseManager::submitQuery("DROP TABLE IF EXISTS stats_{$i}_RollupBrowser");
    DatabaseManager::submitQuery("DROP TABLE IF EXISTS stats_{$i}_RollupCrawler");
    DatabaseManager::submitQuery("DROP TABLE IF EXISTS stats_{$i}_RollupOS");
    DatabaseManager::submitQuery("DROP TABLE IF EXISTS stats_{$i}_RollupPageViews");
    StatsRollupTables::createTableForSite($i);
}
*/

// Get the most recent day in the rollup table
$last_date = DatabaseManager::getVar("SELECT max(rollup_date) FROM stats_1_RollupPageViews");

// If the rollup table it empty, need to start at the earliest date in the page views table
if (!isset($last_date)) {
    $last_datetime = DatabaseManager::getVar("SELECT min(view_date) FROM stats_PageViews");
    $epoch = strtotime($last_datetime);
    $last_date = date("Y-m-d 00:00:00", $epoch);
    $no_days = ceil(TimeUtils::getElapsedDays($last_date));
} else {
    $no_days = floor(TimeUtils::getElapsedDays($last_date));
}

Logger::debug("Last Date: $last_date, which was $no_days days ago");

// Get a list of all the sites
$site_list = SitesTable::getUniqueSites();


foreach ($site_list AS $site) {

    $site_id = $site['id'];
    
    Logger::debug("Processing site id $site_id");    

    for ($i = 1; $i < $no_days; $i++) {

        $date_from = date("Y-m-d 00:00:00", mktime(date("H"), date("i"), date("s"), date("m"), date("d") - $i, date("Y")));
        $date_end = date("Y-m-d 23:59:59", mktime(date("H"), date("i"), date("s"), date("m"), date("d") - $i, date("Y")));
        $day_date = date("Y-m-d", mktime(date("H"), date("i"), date("s"), date("m"), date("d") - $i, date("Y")));

        //Logger::debug("Getting stats for $day_date");
        
        //
        // Get the combined stats across all pages...
        //

        $all_page_views = DatabaseManager::getVar("SELECT count(site_id) FROM stats_PageViews WHERE site_id = $site_id AND view_date > '$date_from' AND view_date <= '$date_end' AND is_bot = 0");

        $all_unique_views = DatabaseManager::getVar("SELECT count(distinct(ip_long)) FROM stats_PageViews WHERE site_id = $site_id AND view_date > '$date_from' AND view_date <= '$date_end' AND is_bot = 0");

        DatabaseManager::insert("INSERT INTO stats_{$site_id}_RollupPageViews (rollup_date, page_views, unique_visitors, page_title, keywords, page_id)
                            VALUES ('$day_date', $all_page_views, $all_unique_views, 'all', '', 0)");

        //
        // Now get the stats per page
        //

		//
		// Add 404 page views (page_id = 0 AND post_id = 0).....
		//	
        
        $sql = "SELECT count(distinct(ip_long)) as unique_views, count(site_id) as page_views
            FROM stats_PageViews views
            WHERE views.site_id = $site_id
            AND views.page_id = 0 AND views.post_id = 0
            AND views.view_date > '$date_from'
            AND views.view_date <= '$date_end'
            AND views.is_bot = 0";

        $data_list = DatabaseManager::getSingleResult($sql);
        
		$data = array();
		$data['title'] = '404 Page';
		$data['page_id'] = 0;
		$data['post_id'] = 0;
		$data['unique_views'] = $data_list['unique_views'];
		$data['page_views'] = $data_list['page_views'];
		
		insertPageView($site_id, $date_from, $date_end, $day_date, $data);
        
		//
		// Add page views.....
		//	
        $sql = "SELECT pages.title as title, views.page_id as page_id, views.post_id as post_id, count(distinct(ip_long)) as unique_views, count(site_id) as page_views
            FROM stats_PageViews views
            INNER JOIN athena_{$site_id}_Pages pages
            WHERE views.site_id = $site_id
            AND views.page_id = pages.id
            AND views.post_id = 0
            AND views.view_date > '$date_from'
            AND views.view_date <= '$date_end'
            AND views.is_bot = 0
            GROUP BY pages.title ORDER BY page_views DESC";
			
        $data_list = DatabaseManager::getResults($sql);

        if (isset($data_list)){
            foreach ($data_list as $data) {
				 insertPageView($site_id, $date_from, $date_end, $day_date, $data);
            }
        }

		//
		// Get post views
		//
		
		//
		// Add page views.....
		//
		
		$sql = "SELECT posts.title as title, views.page_id as page_id, views.post_id as post_id, count(distinct(ip_long)) as unique_views, count(site_id) as page_views
            FROM stats_PageViews views
            INNER JOIN athena_{$site_id}_Posts posts
            WHERE views.site_id = $site_id
            AND views.post_id = posts.id
            AND views.post_id != 0
            AND views.view_date > '$date_from'
            AND views.view_date <= '$date_end'
            AND views.is_bot = 0
            GROUP BY posts.title ORDER BY page_views DESC";
				
        $data_list = DatabaseManager::getResults($sql);

        if (isset($data_list)){
            foreach ($data_list as $data) {
				 insertPageView($site_id, $date_from, $date_end,$day_date,  $data);
            }
        }		
				
        //error_log($key_str);
        // Get browser & OS
        getOSHits($site_id, $date_from, $date_end, $day_date);
        getBrowserHits($site_id, $date_from, $date_end, $day_date);

        // Get the crawler info
        //getSearchBots($site_id, $date_from, $date_end, $day_date);
    }
}

// Do server load rollup (this is not on a per-site basis, so do outside of loop)
for ($i = 1; $i < $no_days; $i++) {

    $date_from = date("Y-m-d 00:00:00", mktime(date("H"), date("i"), date("s"), date("m"), date("d") - $i, date("Y")));
    $date_end = date("Y-m-d 23:59:59", mktime(date("H"), date("i"), date("s"), date("m"), date("d") - $i, date("Y")));
    $day_date = date("Y-m-d", mktime(date("H"), date("i"), date("s"), date("m"), date("d") - $i, date("Y")));

    serverLoadRollup($date_from, $date_end, $day_date);
}

Logger::debug("Done!");

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function insertPageView($site_id, $date_from, $date_end, $day_date, $data){

    $page_title = $data['title'];
    $page_id = $data['page_id'];
    $post_id = $data['post_id'];
    $unique_views = $data['unique_views'];
    $page_views = $data['page_views'];

	if (isset($post_id) && $post_id > 0){
		$page_title = DatabaseManager::getVar("SELECT title FROM athena_{$site_id}_Posts WHERE id = $post_id");					
	}
	
	if (!isset($post_id)){
		$post_id = 0;
	}
	
    //error_log(">>> Server IP: $server_ip");
    // Get keywords
    $key_str = getKeywordString($site_id, $date_from, $date_end);

	$sql = DatabaseManager::prepare("INSERT INTO stats_{$site_id}_RollupPageViews (rollup_date, page_views, unique_visitors, page_title, keywords, page_id, post_id) VALUES (%s, %d, %d, %s, %s, %d, %d)",
    	$day_date, $page_views, $unique_views, $page_title, $key_str, $page_id, $post_id);
    DatabaseManager::insert($sql);
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getServerNoFromIP($server_ip_long) {

    //$server_ip_long = ip2long($server_ip);
    $server_ip = long2ip($server_ip_long);
    
    global $server_list;

    foreach ($server_list as $server_info) {
        //Logger::debug($server_info['ip'] . " == $server_ip");
        if ($server_info['ip'] == $server_ip) {
            return $server_info['no'];
        }
    }
    return 0;
}

function serverLoadRollup($date_from, $date_end, $day_date) {

    $data_list = DatabaseManager::getResults("SELECT server_ip, count(view_date) hits FROM stats_PageViews
        WHERE view_date > '$date_from' AND view_date < '$date_end' GROUP BY server_ip ");

    $hit_list = array();

    if (!isset($data_list)) {
        return;
    }

    foreach ($data_list as $data) {
        $server_no = getServerNoFromIP($data['server_ip']);

        if (isset($hit_list[$server_no])) {
            $hit_list[$server_no] += $data['hits'];
        } else {
            $hit_list[$server_no] = $data['hits'];
        }

    }

    foreach ($hit_list as $server_no => $hits) {
        if (!isset($hits)) $hits = 0;
        DatabaseManager::insert("INSERT INTO stats_RollupServer (rollup_date, server_no, page_views) VALUES ('$day_date', $server_no, $hits)");
    }
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
function getSearchBots($site_id, $date_from, $date_end, $day_date) {

    $data_list = DatabaseManager::getResults("SELECT browser, count(*) AS hits FROM stats_PageViews
        WHERE is_bot=1 AND site_id = $site_id AND view_date > '$date_from' AND view_date <= '$date_end' GROUP BY browser");

    if (!isset($data_list)) return;

    foreach ($data_list as $data) {
        //ApolloLogger::dump($data);
        $botname = $data['browser'];
        $hits = $data['hits'];
        //Logger::debug("SiteID: $site_id Bot: $botname Hits: $hits Date: $day_date");
        DatabaseManager::insert("INSERT INTO stats_{$site_id}_RollupCrawler (rollup_date, crawler, hits) VALUES ('$day_date', '$botname', $hits)");
    }
}
*/
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getOSHits($site_id, $date_from, $date_end, $day_date) {

    $data_list = DatabaseManager::getResults("SELECT os, count(distinct(ip_long)) AS hits FROM stats_PageViews
        WHERE is_bot = 0 AND site_id = $site_id AND view_date > '$date_from' AND view_date <= '$date_end' GROUP BY os");
    
    if (!isset($data_list)) return;

    foreach ($data_list as $data) {
        //if ($site_id == 4) Logger::dump($data);
        $name = $data['os'];
        $hits = $data['hits'];
        DatabaseManager::insert("INSERT INTO stats_{$site_id}_RollupOS (rollup_date, os_name, hits) VALUES ('$day_date', '$name', $hits)");
    }
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getBrowserHits($site_id, $date_from, $date_end, $day_date) {

    $data_list = DatabaseManager::getResults("SELECT browser_ver, browser, count(distinct(ip_long)) AS hits FROM stats_PageViews
        WHERE is_bot = 0 AND site_id = $site_id AND view_date > '$date_from' AND view_date <= '$date_end' GROUP BY browser, browser_ver");

    if (!isset($data_list)) {
        return;
    }

    foreach ($data_list as $data) {
        $ver = $data['browser_ver'];
        $name = $data['browser'];
        $hits = $data['hits'];
        DatabaseManager::insert("INSERT INTO stats_{$site_id}_RollupBrowser (rollup_date, browser, browser_ver, hits)
            VALUES ('$day_date', '$name', '$ver', $hits)");
    }
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getKeywordString($site_id, $date_from, $date_end) {

    $referer_data_list = DatabaseManager::getResults("SELECT views.referer FROM stats_PageViews views
            INNER JOIN athena_{$site_id}_Pages pages
            WHERE views.site_id = $site_id AND views.view_date > '$date_from'
            AND views.view_date < '$date_end' AND views.page_id = pages.id
            AND views.referer != ''");
    
    $keyword_list = Array();

    $key_str = '';
    $ct = 0;

    if (!isset($referer_data_list)) return;
    
    foreach ($referer_data_list as $referer_data) {

        $referer = $referer_data['referer'];

        if (isset($referer) && $referer != '') {

            $keys = KeywordExtractor::getKeywords($referer_data['referer']);

            if (count($keys) > 0) {

                if ($ct != 0) {
                    $key_str .= ',';
                }
                $ct++;

                $key_str .= '{';

                for ($k = 0; $k < count($keys); $k++) {

                    $key = str_replace("{", "(", $keys[$k]);
                    $key = str_replace("}", ")", $key);

                    if ($k != 0) {
                        $key_str .= ' ';
                    }

                    $key_str .= $key;
                }

                $key_str .= '}';
            }
        }
    }
    /*
      $no_keywords = count($keyword_list);

      $key_str = '';
      if ($no_keywords > 0){

      //error_log(">> Found $no_keywords keywords");
      //ApolloLogger::dump($keyword_list);

      for($k=0; $k<$no_keywords; $k++){
      if ($k != 0){
      $key_str .= ',';
      }
      $key_str .= $keyword_list[$k];
      }
      }
     */
    return $key_str;
}

?>
