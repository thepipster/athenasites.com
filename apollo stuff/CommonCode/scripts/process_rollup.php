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

global $server_list;
$server_list = array( 
	array('no' => 1, 'ip' => ip2long('10.179.62.127')),
	array('no' => 1, 'ip' => ip2long('173.203.126.118')),
	array('no' => 2, 'ip' => ip2long('10.179.52.99')),
	array('no' => 2, 'ip' => ip2long('173.203.123.58')),
	array('no' => 99, 'ip' => ip2long('127.0.0.1'))
);

//print_r($server_list);

global $wpdb;

// FOR DEBUGGING, CLEAR TABLES!!!
/*
$wpdb->query("TRUNCATE TABLE apollo_RollupPageViews");
$wpdb->query("TRUNCATE TABLE apollo_RollupOS");
$wpdb->query("TRUNCATE TABLE apollo_RollupBrowser");
$wpdb->query("TRUNCATE TABLE apollo_RollupCrawler");
$wpdb->query("TRUNCATE TABLE apollo_RollupServer");
*/

date_default_timezone_set('UTC');

// Get the most recent day in the rollup table
$sql = $wpdb->prepare("SELECT max(rollup_date) FROM apollo_RollupPageViews"); 		
$last_date = $wpdb->get_var($sql);

// If the rollup table it empty, need to start at the earliest date in the page views table
if (!isset($last_date)){
	$sql = $wpdb->prepare("SELECT min(view_date) FROM apollo_PageViews"); 		
	$last_datetime = $wpdb->get_var($sql);	
	$epoch = strtotime($last_datetime);
	$last_date = date("Y-m-d 00:00:00", $epoch);
	$no_days = ceil(TimeUtils::getElapsedDays($last_date));
}
else {
	$no_days = floor(TimeUtils::getElapsedDays($last_date));
}

error_log("Last Date: $last_date ($last_datetime), which was $no_days days ago");

// Get a list of all the blogs
$blog_list = ApolloPageViewsTable::getBlogList();

foreach ($blog_list AS $blog) {
	
	$blog_id = $blog['blog_id'];
	$siteid = $blog['site_id'];

	for ($i=1; $i<$no_days; $i++){
	
		$date_from = date("Y-m-d 00:00:00", mktime(date("H"), date("i"), date("s"), date("m") , date("d")-$i, date("Y")));
		$date_end = date("Y-m-d 23:59:59", mktime(date("H"), date("i"), date("s"), date("m") , date("d")-$i, date("Y")));
		$day_date = date("Y-m-d", mktime(date("H"), date("i"), date("s"), date("m") , date("d")-$i, date("Y")));
	
		//error_log("Getting stats for $day_date");

		//
		// Get the combined stats across all pages...
		//
		
		$sql = $wpdb->prepare("SELECT count(blog_id) FROM apollo_PageViews WHERE blog_id = %d AND view_date > '%s' AND view_date <= '%s'", $blog_id, $date_from, $date_end);
		$all_page_views = $wpdb->get_var($sql);

		$sql = $wpdb->prepare("SELECT count(distinct(ip_long)) FROM apollo_PageViews WHERE blog_id = %d AND view_date > '%s' AND view_date <= '%s'", $blog_id, $date_from, $date_end);
		$all_unique_views = $wpdb->get_var($sql);
	
		$sql = $wpdb->prepare("INSERT INTO apollo_RollupPageViews (blog_id, rollup_date, page_views, unique_visitors, page_title, keywords) VALUES (%d, %s, %d, %d, 'all', '')", $blog_id, $day_date, $all_page_views, $all_unique_views); 	
		$wpdb->query($sql);

		//
		// Now get the stats per page
		// 	
		
		// Get the page views
		$sql = $wpdb->prepare("SELECT posts.post_title, count(distinct(ip_long)), count(blog_id), server_ip FROM apollo_PageViews views INNER JOIN wp_%d_posts posts WHERE views.blog_id = %d AND views.page_post_id = posts.ID AND views.view_date > %s AND views.view_date <= %s GROUP BY posts.post_title",  $blog_id, $blog_id, $date_from, $date_end ); 		
		
		$data_list = $wpdb->get_results($sql, ARRAY_N);
		
		
		foreach($data_list as $data){
			
			$page_title = $data[0];		
			$unique_views = $data[1];		
			$page_views = $data[2];
			$server_ip = $data[3];
			
			if ($blog_id == 2 && $page_views > 100){
				ApolloLogger::debug("[$day_date] Page views: " . $page_views . " >>> $sql1");
			}
			
			//error_log(">>> Server IP: $server_ip");
			
			// Get keywords
			$key_str = getKeywordString($blog_id, $date_from, $date_end);
						
			$sql = $wpdb->prepare("INSERT INTO apollo_RollupPageViews (blog_id, rollup_date, page_views, unique_visitors, page_title, keywords) VALUES (%d, %s, %d, %d, %s, %s)", $blog_id, $day_date, $page_views, $unique_views, $page_title, $key_str); 	
			$wpdb->query($sql);
			
		}

		//error_log($key_str);

		// Get browser & OS
		getOSHits($blog_id, $date_from, $date_end, $day_date);
		getBrowserHits($blog_id, $date_from, $date_end, $day_date);

		// Get the crawler info
		getSearchBots($blog_id, $date_from, $date_end, $day_date);	
								
	}
	
		
}

// Do server load rollup (this is not on a per-blog basis, so do outside of loop)
for ($i=1; $i<$no_days; $i++){
	
	$date_from = date("Y-m-d 00:00:00", mktime(date("H"), date("i"), date("s"), date("m") , date("d")-$i, date("Y")));
	$date_end = date("Y-m-d 23:59:59", mktime(date("H"), date("i"), date("s"), date("m") , date("d")-$i, date("Y")));
	$day_date = date("Y-m-d", mktime(date("H"), date("i"), date("s"), date("m") , date("d")-$i, date("Y")));
	
	serverLoadRollup($date_from, $date_end, $day_date);
}



// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getServerNoFromIP($server_ip){
	
	global $server_list;
	
	foreach($server_list as $server_info){
		if($server_info['ip'] == $server_ip){
			return $server_info['no'];
		}
	}
	return 0;
}

function serverLoadRollup($date_from, $date_end, $day_date){

	global $wpdb;

	$sql = $wpdb->prepare("SELECT server_ip, count(view_date) FROM apollo_PageViews WHERE view_date > '%s' AND view_date < '%s' GROUP BY server_ip ", $date_from, $date_end ); 		
	$data_list = $wpdb->get_results($sql, ARRAY_N);

	$hit_list = array();

	foreach($data_list as $data){
		$server_no = getServerNoFromIP($data[0]);

		if (isset($hit_list[$server_no])){
			$hit_list[$server_no] += $data[1];
		}
		else {
			$hit_list[$server_no] = $data[1];
		}
		
		//echo "Server No: $server_no Server IP: {$data[0]} Hits: $hits<br>";
	}

	foreach($hit_list as $server_no => $hits){
		$sql = $wpdb->prepare("INSERT INTO apollo_RollupServer (rollup_date, server_no, page_views) VALUES (%s, %d, %d)", $day_date, $server_no, $hits); 	
		$res = $wpdb->query($sql);
	}	
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getSearchBots($blog_id, $date_from, $date_end, $day_date){

	global $wpdb;
	
	$sql = $wpdb->prepare("SELECT browser, count(*) AS '#' FROM apollo_PageViews WHERE is_bot=1 AND blog_id = %d AND view_date > %s AND view_date <= %s GROUP BY browser", 
		$blog_id, $date_from, $date_end); 	
				
	$data_list = $wpdb->get_results($sql, ARRAY_N);
	
	foreach($data_list as $data){
		//ApolloLogger::dump($data);
		$botname = $data[0];
		$hits = $data[1];
		//error_log("BlogID: $blog_id Bot: $botname Hits: $hits Date: $day_date");
		$sql = $wpdb->prepare("INSERT INTO apollo_RollupCrawler (blog_id, rollup_date, crawler, hits) VALUES (%d, %s, %s, %d)", $blog_id, $day_date, $botname, $hits); 	
		$res = $wpdb->query($sql);
	}
	
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getOSHits($blog_id, $date_from, $date_end, $day_date){

	global $wpdb;
	
	$sql = $wpdb->prepare("SELECT os_ver, os_name, count(distinct(ip_long)) AS '#' FROM apollo_PageViews WHERE is_bot = 0 AND blog_id = %d AND view_date > %s AND view_date <= %s GROUP BY os_name, os_ver", 
		$blog_id, $date_from, $date_end); 	
		
	$data_list = $wpdb->get_results($sql, ARRAY_N);
	
	foreach($data_list as $data){
		$ver = $data[0];
		$name = $data[1];
		$hits = $data[2];
		$sql = $wpdb->prepare("INSERT INTO apollo_RollupOS (blog_id, rollup_date, os_name, os_ver, hits) VALUES (%d, %s, %s, %s, %d)", $blog_id, $day_date, $name, $ver, $hits); 	
		$res = $wpdb->query($sql);
	}		
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getBrowserHits($blog_id, $date_from, $date_end, $day_date){

	global $wpdb;
	
	$sql = $wpdb->prepare("SELECT browser_ver, browser, count(distinct(ip_long)) AS '#' FROM apollo_PageViews WHERE is_bot = 0 AND blog_id = %d AND view_date > %s AND view_date <= %s GROUP BY os_name, os_ver", 
		$blog_id, $date_from, $date_end); 	
		
	$data_list = $wpdb->get_results($sql, ARRAY_N);
	
	foreach($data_list as $data){
		$ver = $data[0];
		$name = $data[1];
		$hits = $data[2];
		$sql = $wpdb->prepare("INSERT INTO apollo_RollupBrowser (blog_id, rollup_date, browser, browser_ver, hits) VALUES (%d, %s, %s, %s, %d)", $blog_id, $day_date, $name, $ver, $hits); 	
		$res = $wpdb->query($sql);
	}		
		
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getKeywordString($blog_id, $date_from, $date_end){

	global $wpdb;

//	$sql = $wpdb->prepare("SELECT posts.post_title, count(distinct(ip_long)), count(blog_id) FROM apollo_PageViews views INNER JOIN wp_%d_posts posts WHERE views.blog_id = %d AND views.page_post_id = posts.ID AND views.view_date > %s AND views.view_date <= %s GROUP BY posts.post_title",  $blog_id, $blog_id, $date_from, $date_end ); 		
	$sql = $wpdb->prepare("SELECT views.referer FROM apollo_PageViews views INNER JOIN wp_%d_posts posts WHERE views.blog_id = %d AND views.view_date > %s AND views.view_date < %s AND views.page_post_id = posts.ID AND views.referer != ''",  $blog_id, $blog_id, $date_from, $date_end ); 		
	$referer_data_list = $wpdb->get_results($sql, ARRAY_A);
	$keyword_list = Array();
	
	$key_str = '';
	$ct = 0;
		
	foreach($referer_data_list as $referer_data){
				
		$referer = $referer_data['referer'];
		
		if (isset($referer) && $referer != ''){
		
			$keys = KeywordExtractor::getKeywords($referer_data['referer']);
			
			if (count($keys) > 0){

				if ($ct != 0){
					$key_str .= ',';
				}
				$ct++;
							
				$key_str .= '{';
				
				for($k=0; $k<count($keys); $k++){
					
					$key = str_replace("{","(", $keys[$k]);
					$key = str_replace("}",")", $key);
				
					if ($k != 0){
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