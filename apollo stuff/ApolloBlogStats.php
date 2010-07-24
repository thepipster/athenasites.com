<?php

// Update page views table
$discRoot = realpath(dirname(__FILE__)) . '/';
$common_code_root = substr($discRoot, 0, strpos($discRoot, 'mu-plugins')) . 'CommonCode/';
$blog_downloads_root = substr($discRoot, 0, strpos($discRoot, 'mu-plugins')) . 'blogs.dir/';

require_once($common_code_root . 'php/dal/ApolloPageViewsTable.class.php');
require_once($common_code_root . 'php/BrowserDetect.class.php');
require_once($common_code_root . 'php/browser_detection.php');
require_once($common_code_root . 'php/utils/ApolloLogger.class.php');
require_once($common_code_root . 'php/utils/Session.class.php');

add_action('admin_menu', 'apolloastats_statsMenu');
//add_action('wp_head', 'apolloadmin_onHeader');
add_action('get_header', 'apolloastats_onHeader');
add_action('init', 'apollo_errorHandler');

// /////////////////////////////////////////////////////////////////////////////////////////////////////////

function apolloastats_onHeader(){

	// Also problem with safari, request from the favicon seems to call the header once again
	if (stripos($_SERVER["REQUEST_URI"], ".png") > 0){
		return;
	}
	
	ApolloPageViewsTable::logView();
}

// /////////////////////////////////////////////////////////////////////////////////////////////////////////

function apolloastats_statsMenu()
{
	if (is_site_admin())
	{
		add_submenu_page('wpmu-admin.php', 'Apollo Stats', 'Apollo Stats', 8, 'ApolloStats', 'showStats');
	}

}

// /////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
* Catch errors 
*/
function apollo_errorHandler(){

	ApolloLogger::catchSysErrors();
	ApolloLogger::setSendEmail(ApolloLogger::$ERROR);

	if (stripos($_SERVER['HTTP_HOST'], 'local') > 0){
		error_log("local");
		ApolloLogger::setLevelDebug();
	}
	else {
		ApolloLogger::setLevelDebug();
		//ApolloLogger::setLevelError();
	}
}

// /////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
* Stats page
*/
function showStats()
{
	global $blog_downloads_root;
		
	if (!is_site_admin()) return;
	
	$max_hd_space = get_site_option('blog_upload_space', false, false);	 
			
	echo '<div class="wrap" id="ApolloContentWrapper" style="position:relative;">';

	// High level stats

	echo '<h2>Server Status</h2>';

	$stats = get_sitestats();

	$mb = 1048576;
	$gb = 1073741824;
	
	$disc_total = disk_total_space($blog_downloads_root)/$mb;
	$disc_free = disk_free_space($blog_downloads_root)/$mb;
	$disc_usage_pc = ceil(100 * ($disc_total - $disc_free) / $disc_total);
	
	echo '<p>';

	if ($disc_usage_pc < 40){
		$color = 'style="color:green"';	
	}
	else if ($disc_usage_pc < 80){
		$color = 'style="color:orange"';	
	}
	else if ($disc_usage_pc < 90){
		$color = 'style="color:red"';	
	}
	else {
		$color = 'style="color:red;font-weight: bold;"';	
	}
	
	echo 'Disc usage: <span '.$color.'>' . $disc_usage_pc . ' %</span><br/>';
	echo 'Total disc space: ' . number_format($disc_total, 0) . ' MB <br/>';
	echo 'Free disc space: ' . number_format($disc_free, 0) . ' MB <br/>';
	echo 'Number blogs: ' . $stats[ 'blogs' ] . ' <br/>';
	echo 'Number users: ' . $stats[ 'users' ] . ' <br/>';
	echo 'Blog disc space: ' . $max_hd_space . ' MB<br/>';	
	echo 'Max number bogs: ' . floor($disc_total/$max_hd_space) . '<br/>';
	echo '</p>';

	//echo '<p>PHP Memory Usage: ' . number_format(memory_get_usage()/$mb, 0) . ' MB</p>';

	// Global stats graph...	
	echo '<h2>Views Last 30 days</h2>';
	
	echo '<br/>';

	echoPageViewsData(true);
	
	echo '<br/>';
	
	
	// Get detailed stats for all blogs....
	echo '<h2>Blog Statistics</h2>';
	echo '<br/>';
	
	// Get a list of all the blogs on the systems
	//$blog_list = get_blog_list( 0, 'all' );
	$blog_list = ApolloPageViewsTable::getBlogList();
	
	echo '<table class="widefat">';
	echo '<thead>';
	echo '   <tr>';
	echo '      <th>ID</th>';
	echo '      <th>Site</th>';
	echo '      <th>Number Pages</th>';
	echo '      <th>Number Posts</th>';
	echo '      <th>Weeks Page Views</th>';
	echo '      <th>Months Page Views</th>';
	echo '      <th>Total Page Views</th>';
	echo '      <th>Weeks Unique Vistors</th>';
	echo '      <th>Months Unique Vistors</th>';
	echo '      <th>Total Unique Vistors</th>';
	echo '      <th>Disc Usage (MB)</th>';
	echo '      <th>Last Update</th>';
	echo '      <th>Date Registered</th>';
	echo '   </tr>';
	echo '</thead>';
	
	
	$ct = 0;

	foreach ($blog_list AS $blog) {
	
		$ct++;
		// class="alternate"
		
		if ($ct % 2 == 0){
			echo '<tr class="alternate">';
		}
		else {
			echo '<tr>';
		}
			
		$blogid = $blog['blog_id'];
		$siteid = $blog['site_id'];
		$domain = $blog['domain'];
		$date_registered = date("m/d/Y", strtotime($blog['registered']));
		$date_last_update = date("m/d/Y H:i", strtotime($blog['last_updated']));		
		$path = substr($blog['path'], 0, strlen($blog['path'])-1);
		
		$noPages = ApolloPageViewsTable::getNoPages($blogid);
		$noPosts = ApolloPageViewsTable::getNoPosts($blogid);
		$blog_details = get_blog_details($blogid, true);
		    	
		$media_dir =  $blog_downloads_root . $blogid;

		if (file_exists($media_dir)){
			$disc_usage = du($media_dir);
		}
		else {
			$disc_usage = 0;			
		}
		
		$views7 = ApolloPageViewsTable::getViewsLastNDays($blogid, 7);	
		$views30 = ApolloPageViewsTable::getViewsLastNDays($blogid, 30);	
		$viewsAllTime = ApolloPageViewsTable::getViewsAllTime($blogid);	
		
		$views7uniques = ApolloPageViewsTable::getUniqueViewsLastNDays($blogid, 7);
		$views30uniques = ApolloPageViewsTable::getUniqueViewsLastNDays($blogid, 30);
		$viewsAllTimeuniques = ApolloPageViewsTable::getUniqueViewsAllTime($blogid);
		
		$disc_usage_pc = ceil(100*$disc_usage/$max_hd_space);
	
		echo '<td>'.$blogid.'</td>';	
		echo '<td>'.$domain.$path.'</td>';	
		echo '<td>'.$noPages.'</td>';	
		echo '<td>'.$noPosts.'</td>';	
		echo '<td>'.$views7.'</td>';	
		echo '<td>'.$views30.'</td>';	
		echo '<td>'.$viewsAllTime.'</td>';	
		echo '<td>'.$views7uniques.'</td>';	
		echo '<td>'.$views30uniques.'</td>';	
		echo '<td>'.$viewsAllTimeuniques.'</td>';	

		if ($disc_usage_pc < 40){
			echo '<td><span style="color:green">'.$disc_usage.' (' . $disc_usage_pc . '% )</span></td>';	
		}
		else if ($disc_usage_pc < 80){
			echo '<td><span style="color:orange">'.$disc_usage.' (' . $disc_usage_pc . '% )</span></td>';	
		}
		else if ($disc_usage_pc < 90){
			echo '<td><span style="color:red">'.$disc_usage.' (' . $disc_usage_pc . '% )</span></td>';	
		}
		else {
			echo '<td><span style="color:red; font-weight: bold;">'.$disc_usage.' (' . $disc_usage_pc . '% )</span></td>';	
		}
		
//		echo '<td>'.$disc_usage.' ( ' . number_format(100*$disc_usage/$max_hd_space, 1) . '% )</td>';	
		
		echo '<td>'.$date_last_update.'</td>';	
		echo '<td>'.$date_registered.'</td>';	
		
		echo '</tr>';
		
	}	

	echo '</table>';

	echo '<br/>';

	echo '</div>';

}

/**
* Call the 'du' command and parse its response
*/
function du( $dir )
{
    $res = `du -sk $dir`;             // Unix command
    preg_match( '/\d+/', $res, $KB ); // Parse result
    $MB = round( $KB[0] / 1024, 1 );  // From kilobytes to megabytes
    return $MB;
}


?>