<?php
/**
 * 
 * @author Mike Pritchard
 * @since January 22nd, 2010
 */
  
class PageViewsTable {
	
	/**
	* To keep the database table from growing huge, we break this table up by site id
	*/
	public static function createTableForSite($site_id){
		
		$sql = "CREATE TABLE `athena_{$site_id}_PageViews` (
		  `page_id` bigint(20) default NULL,
		  `view_date` datetime default NULL,
		  `ip_long` bigint(20) default NULL,
		  `is_bot` tinyint(1) default '0',
		  `browser` varchar(25) default NULL,
		  `browser_ver` varchar(8) default NULL,
		  `os_name` varchar(25) default NULL,
		  `os_ver` varchar(8) default NULL,
		  `referer` varchar(255) default NULL,
		  `user_agent` varchar(255) default NULL,
		  `server_ip` bigint(20) default NULL
		) ENGINE=MyISAM DEFAULT CHARSET=utf8;";

		DatabaseManager::submitQuery($sql);

		$sql = "CREATE TABLE `athena_{$site_id}_RollupBrowser` (
		  `id` int(11) NOT NULL auto_increment,
		  `rollup_date` date default NULL,
		  `browser` varchar(30) default NULL,
		  `browser_ver` varchar(10) default NULL,
		  `hits` int(11) default NULL,
		  PRIMARY KEY  (`id`)
		) ENGINE=MyISAM DEFAULT CHARSET=latin1;";

		DatabaseManager::submitQuery($sql);

		$sql = "CREATE TABLE `athena_{$site_id}_RollupCrawler` (
		  `id` int(11) NOT NULL auto_increment,
		  `rollup_date` date default NULL,
		  `crawler` varchar(25) default NULL,
		  `hits` int(11) default NULL,
		  PRIMARY KEY  (`id`)
		) ENGINE=MyISAM DEFAULT CHARSET=latin1;";

		DatabaseManager::submitQuery($sql);

		$sql = "CREATE TABLE `athena_{$site_id}_RollupOS` (
		  `id` int(11) NOT NULL auto_increment,
		  `rollup_date` date default NULL,
		  `os_name` varchar(30) default NULL,
		  `os_ver` varchar(10) default NULL,
		  `hits` int(11) default NULL,
		  PRIMARY KEY  (`id`)
		) ENGINE=MyISAM DEFAULT CHARSET=latin1;";

		DatabaseManager::submitQuery($sql);

		$sql = "CREATE TABLE `athena_{$site_id}_RollupPageViews` (
		  `id` int(11) NOT NULL auto_increment,
		  `rollup_date` date default NULL,
		  `page_views` int(11) default NULL,
		  `unique_visitors` int(11) default NULL,
		  `keywords` text,
		  `page_title` varchar(125) default NULL,
		  PRIMARY KEY  (`id`)
		) ENGINE=MyISAM DEFAULT CHARSET=latin1;";
						
		DatabaseManager::submitQuery($sql);

	}
		
	// //////////////////////////////////////////////////////////////////////////////////////

	public static function logView($site_id, $page_id){
		
		//if (self::isSameView($site_id, $page_id)){
		//	return;
		//}
		
		$browser = new BrowserDetect();
		
		$browser_name = $browser->getBrowser();
		$browser_ver =  $browser->getVersion();
		$platform = $browser->getPlatform();
		$os = $browser->getOS();
		$is_bot = $browser->isRobot();
	
			
		// If BrowserDetect could not find it, try the browser_detection script instead	
		if ($browser_name == BrowserDetect::BROWSER_UNKNOWN){
			$browser_name = browser_detection('browser_name');
		}
		if ($browser_ver == BrowserDetect::VERSION_UNKNOWN){
			$browser_ver = browser_detection('browser_number');
		}
		if ($os == BrowserDetect::OPERATING_SYSTEM_UNKNOWN){
			$os = browser_detection('os');
		}

		$os_ver = browser_detection('os_number');
		
		date_default_timezone_set('UTC');
		$date_now = date("Y-m-d H:i:s", mktime(date("H"), date("i"), date("s"), date("m"), date("d"), date("Y")));
		
		//$referer = $_SERVER['HTTP_REFERER'];
		$referer = $_SERVER['HTTP_REFERER'] OR $_ENV['HTTP_REFERER'];
		$user_agent = $_SERVER['HTTP_USER_AGENT'];

		//if (!isset($referer) || stripos($referer,  $_SERVER['HTTP_HOST']) > 0){
		//	$referer = '';	
		//}
		if (!isset($referer)){
			$referer = '';	
		}
		
		$server_ip = $_SERVER['SERVER_ADDR'];
		error_log("Referer >>>> " . $server_ip);
		
		$true_ip = self::getRealIPAddr();		

		if ($wp_query->post->ID != 0){
//			$sql = DatabaseManager::prepare("INSERT INTO athena_{$site_id}_PageViews (blog_id, page_id, view_date, ip_long, browser, browser_ver, os_name, os_ver, referer) VALUES (%d, %d, %s, %d, %s, %s, %s, %s, %s)", 
//					$blog_id, $wp_query->post->ID, $date_now, ip2long($_SERVER['REMOTE_ADDR']), $browser_name, $browser_ver, $os, $os_ver, $referer );
			$sql = DatabaseManager::prepare("INSERT INTO athena_{$site_id}_PageViews ( page_id, view_date, ip_long, browser, browser_ver, os_name, os_ver, referer, user_agent, is_bot, server_ip) VALUES (%d, %s, %d, %s, %s, %s, %s, %s, %s, %d, %d)", 
					$site_id, $page_id, $date_now, ip2long($true_ip), $browser_name, $browser_ver, $os, $os_ver, $referer, $user_agent, $is_bot, ip2long($server_ip) );
			$wpdb->query($sql);		
		}
		
	}
	
	private static function getRealIPAddr(){
	    if (!empty($_SERVER['HTTP_CLIENT_IP']))   //check ip from share internet
	    {
	      $ip = $_SERVER['HTTP_CLIENT_IP'];
	    }
	    elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))   //to check ip is pass from proxy
	    {
	      $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
	    }
	    else
	    {
	      $ip = $_SERVER['REMOTE_ADDR'];
	    }
	    return $ip;
   	}

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Check to see if this page was hit by the same user within the last few seconds (Safari seems to 
	* report multiple page views for each hit)
	*/
	public static function isSameView($site_id, $page_id){
		
		$ip_long = ip2long($_SERVER['REMOTE_ADDR']);
		date_default_timezone_set('UTC');
		$date_before = date("Y-m-d H:i:s", mktime(date("H"), date("i"), date("s")-10, date("m"), date("d"), date("Y")));
		$date_now = date("Y-m-d H:i:s", mktime(date("H"), date("i"), date("s"), date("m"), date("d"), date("Y")));
		
		$sql = DatabaseManager::prepare("SELECT count(*) FROM athena_{$site_id}_PageViews WHERE page_id = %d AND ip_long = %s AND view_date > %s",  $site_id, $page_id, $ip_long, $date_before ); 		

		$data = DatabaseManager::getResults($sql, ARRAY_N);
		
		if (isset($data) && isset($data[0]) && isset($data[0][0])){
			if ($data[0][0] > 0) return true;
		}
		
		return false;
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getStatsForSite($site_id){
		$sql = DatabaseManager::prepare("SELECT * FROM athena_{$site_id}_PageViews",  $site_id ); 		
		return DatabaseManager::getResults($sql, ARRAY_A);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getViewsLast30Days($site_id){		
		return self::getViewsLastNDays($site_id, 30);
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getViewsLastNDays($site_id, $no_days_ago){
		
		date_default_timezone_set('UTC');
		$date_before = date("Y-m-d H:i", mktime(date("H"), date("i"), date("s"), date("m")  , date("d")-$no_days_ago, date("Y")));
	
		$sql = DatabaseManager::prepare("SELECT count(blog_id) FROM athena_{$site_id}_PageViews WHERE blog_id = %d AND view_date > %s",  $site_id, $date_before ); 		
		$data = DatabaseManager::getResults($sql);		
	
		//error_log(print_r($data[0], true));
		
		if (isset($data[0]) && isset($data[0][0])){
			return $data[0][0];		
		}
		
		return 0;
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Get an array that contains the numberr of unique visitors for each day for the last $no_days for the entire apollosites 
	*/
	public static function getGlobalBinnedUniqueViewsLastNDays($no_days){

		$data = array($no_days);
				
		date_default_timezone_set('UTC');
				
		for ($n=0; $n<$no_days; $n++){
			
			$date_from = date("Y-m-d 00:00:00", mktime(date("H"), date("i"), date("s"), date("m") , date("d")-$n, date("Y")));
			$date_end = date("Y-m-d 23:59:59", mktime(date("H"), date("i"), date("s"), date("m") , date("d")-$n, date("Y")));
			$sql = DatabaseManager::prepare("SELECT count(distinct(ip_long)) FROM athena_{$site_id}_PageViews WHERE view_date > %s AND view_date < %s",  $date_from, $date_end ); 		
			$views = DatabaseManager::getVar($sql);		
			//error_log($n . ' ' . $views);	
			
			if (isset($views)){
				$data[$n] = $views;
			}
			else {
				$data[$n] = 0;
			}
			
		}

		return $data;		
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Get an array that contains the number of total page views for each day for the last $no_days for the entire apollosites 
	*/	
	public static function getGlobalBinnedViewsLastNDays($site_id, $no_days){

		$data = array($no_days);
				
		date_default_timezone_set('UTC');
				
		for ($n=0; $n<$no_days; $n++){
			
			$date_from = date("Y-m-d 00:00:00", mktime(date("H"), date("i"), date("s"), date("m") , date("d")-$n, date("Y")));
			$date_end = date("Y-m-d 23:59:59", mktime(date("H"), date("i"), date("s"), date("m") , date("d")-$n, date("Y")));
			$sql = DatabaseManager::prepare("SELECT count(*) FROM athena_{$site_id}_PageViews WHERE view_date > %s AND view_date < %s",  $date_from, $date_end ); 		
			
			$views = DatabaseManager::getVar($sql);	
			//error_log($n . ' ' . $views);	
			
			if (isset($views)){
				$data[$n] = $views;
			}
			else {
				$data[$n] = 0;
			}		
		}

		return $data;		
	}	

	// //////////////////////////////////////////////////////////////////////////////////////


	public static function getBinnedUniqueViewsLastNDays($site_id, $no_days){

		$data = array($no_days);
				
		date_default_timezone_set('UTC');
				
		for ($n=0; $n<$no_days; $n++){
			
			$date_from = date("Y-m-d 00:00:00", mktime(date("H"), date("i"), date("s"), date("m") , date("d")-$n, date("Y")));
			$date_end = date("Y-m-d 23:59:59", mktime(date("H"), date("i"), date("s"), date("m") , date("d")-$n, date("Y")));
			$sql = DatabaseManager::prepare("SELECT count(distinct(ip_long)) FROM athena_{$site_id}_PageViews WHERE blog_id = %d AND view_date > %s AND view_date < %s",  $site_id, $date_from, $date_end ); 		
			$views = DatabaseManager::getVar($sql);		
			//error_log($n . ' ' . $views);	
			
			if (isset($views)){
				$data[$n] = $views;
			}
			else {
				$data[$n] = 0;
			}
			
		}

		return $data;		
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////
	
	public static function getBinnedViewsLastNDays($site_id, $no_days){

		$data = array($no_days);
				
		date_default_timezone_set('UTC');
				
		for ($n=0; $n<$no_days; $n++){
			
			$date_from = date("Y-m-d 00:00:00", mktime(date("H"), date("i"), date("s"), date("m") , date("d")-$n, date("Y")));
			$date_end = date("Y-m-d 23:59:59", mktime(date("H"), date("i"), date("s"), date("m") , date("d")-$n, date("Y")));
			$sql = DatabaseManager::prepare("SELECT count(blog_id) FROM athena_{$site_id}_PageViews WHERE blog_id = %d AND view_date > %s AND view_date < %s",  $site_id, $date_from, $date_end ); 		
			
			$views = DatabaseManager::getVar($sql);	
			//error_log($n . ' ' . $views);	
			
			if (isset($views)){
				$data[$n] = $views;
			}
			else {
				$data[$n] = 0;
			}		
		}

		return $data;		
	}
			
	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getViewsAllTime($site_id){

		$sql = DatabaseManager::prepare("SELECT count(blog_id) FROM athena_{$site_id}_PageViews WHERE blog_id = %d",  $site_id ); 		
		$data = DatabaseManager::getResults($sql);		
			
		if (isset($data[0]) && isset($data[0][0])){
			return $data[0][0];		
		}
		
		return 0;
	}
		
	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getUniqueViewsLastNDays($site_id, $no_days_ago){

		date_default_timezone_set('UTC');
		$date_before = date("Y-m-d H:i", mktime(date("H"), date("i"), date("s"), date("m")  , date("d")-$no_days_ago, date("Y")));
		
		$sql = DatabaseManager::prepare("SELECT count(distinct(ip_long)) FROM athena_{$site_id}_PageViews WHERE blog_id = %d AND view_date > %s",  $site_id, $date_before ); 		
		$data = DatabaseManager::getResults($sql);		
	
		//error_log(print_r($data[0], true));
		
		if (isset($data[0]) && isset($data[0][0])){
			return $data[0][0];		
		}
		
		return 0;
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getUniqueViewsAllTime($site_id){

		$sql = DatabaseManager::prepare("SELECT count(distinct(ip_long)) FROM athena_{$site_id}_PageViews WHERE blog_id = %d",  $site_id ); 		
		$data = DatabaseManager::getResults($sql);		
			
		if (isset($data[0]) && isset($data[0][0])){
			return $data[0][0];		
		}
		
		return 0;
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Return a list of all the views, and return the post_title
	*/
	//public static function getAllViews($site_id){	
	//	$sql = DatabaseManager::prepare("select posts.post_title, views.page_id, views.view_date, views.ip_long, views.browser, views.browser_ver, views.os_name, views.os_ver, views.referer  from athena_{$site_id}_PageViews views inner join wp_%d_posts posts where views.blog_id = %d and views.page_id = posts.ID ORDER BY views.view_date DESC",  $blog_id, $blog_id ); 		
	//	return DatabaseManager::getResults($sql);		
	//}

	// //////////////////////////////////////////////////////////////////////////////////////
	
}
?>