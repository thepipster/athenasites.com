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
	}
		
	// //////////////////////////////////////////////////////////////////////////////////////

	public static function logView($site_id, $page_id){
				
		if (Session::exists('pageview_etime')){
			$etime = microtime(true) - Session::get('pageview_etime');
			Session::set('pageview_etime', microtime(true));
		}
		else {
			Session::set('pageview_etime', microtime(true));
			$etime = 99999;			
		}
		
		Logger::debug("eTime = $etime");

		// If its been less than this number of seconds, for the same session, then disregard this
		// page view		
		if ($etime < 0.25){
			return;
		}
				
		
		$browser = new Browser();
		
		$browser_name = $browser->getBrowser();
		$browser_ver =  $browser->getVersion();
		$os = $browser->getPlatform();
		$is_bot = $browser->isRobot();
	
		//$os_ver = browser_detection('os_number');
		
		date_default_timezone_set('UTC');
		$date_now = date("Y-m-d H:i:s", mktime(date("H"), date("i"), date("s"), date("m"), date("d"), date("Y")));
		
		//$referer = $_SERVER['HTTP_REFERER'];
		if (isset($_SERVER['HTTP_REFERER'])){
			$referer = $_SERVER['HTTP_REFERER'];
		}
		else if (isset($_ENV['HTTP_REFERER'])){
			$referer = $_ENV['HTTP_REFERER'];
		}
		else {
			$referer = '';
		}
		
		$referer = $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
		
		$user_agent = $_SERVER['HTTP_USER_AGENT'];
		
		$server_ip = $_SERVER['SERVER_ADDR'];
		error_log("Referer >>>> " . $server_ip);
		
		$true_ip = self::getRealIPAddr();		

		$sql = DatabaseManager::prepare("INSERT INTO stats_PageViews ( site_id, page_id, view_date, ip_long, browser, browser_ver, os, referer, user_agent, is_bot, server_ip) VALUES (%d, %d, %s, %d, %s, %s, %s, %s, %s, %d, %d)", 
					$site_id, $page_id, $date_now, ip2long($true_ip), $browser_name, $browser_ver, $os, $referer, $user_agent, $is_bot, ip2long($server_ip) );
		DatabaseManager::insert($sql);
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////
	
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
		
		$sql = DatabaseManager::prepare("SELECT count(*) FROM athena_%d_PageViews WHERE page_id = %d AND ip_long = %s AND view_date > %s",  $site_id, $page_id, $ip_long, $date_before ); 		

		$data = DatabaseManager::getResults($sql, ARRAY_N);
		
		if (isset($data) && isset($data[0]) && isset($data[0][0])){
			if ($data[0][0] > 0) return true;
		}
		
		return false;
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getStatsForSite($site_id){
		$sql = DatabaseManager::prepare("SELECT * FROM athena_%d_PageViews",  $site_id ); 		
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
	
		$sql = DatabaseManager::prepare("SELECT count(blog_id) FROM athena_%d_PageViews WHERE blog_id = %d AND view_date > %s",  $site_id, $date_before ); 		
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
			$sql = DatabaseManager::prepare("SELECT count(distinct(ip_long)) FROM athena_%d_PageViews WHERE view_date > %s AND view_date < %s",  $date_from, $date_end ); 		
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
			$sql = DatabaseManager::prepare("SELECT count(*) FROM athena_%d_PageViews WHERE view_date > %s AND view_date < %s",  $date_from, $date_end ); 		
			
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
			$sql = DatabaseManager::prepare("SELECT count(distinct(ip_long)) FROM athena_%d_PageViews WHERE blog_id = %d AND view_date > %s AND view_date < %s",  $site_id, $date_from, $date_end ); 		
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
			$sql = DatabaseManager::prepare("SELECT count(blog_id) FROM athena_%d_PageViews WHERE blog_id = %d AND view_date > %s AND view_date < %s",  $site_id, $date_from, $date_end ); 		
			
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

		$sql = DatabaseManager::prepare("SELECT count(blog_id) FROM athena_%d_PageViews WHERE blog_id = %d",  $site_id ); 		
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
		
		$sql = DatabaseManager::prepare("SELECT count(distinct(ip_long)) FROM athena_%d_PageViews WHERE blog_id = %d AND view_date > %s",  $site_id, $date_before ); 		
		$data = DatabaseManager::getResults($sql);		
	
		//error_log(print_r($data[0], true));
		
		if (isset($data[0]) && isset($data[0][0])){
			return $data[0][0];		
		}
		
		return 0;
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getUniqueViewsAllTime($site_id){

		$sql = DatabaseManager::prepare("SELECT count(distinct(ip_long)) FROM athena_%d_PageViews WHERE blog_id = %d",  $site_id ); 		
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
	//	$sql = DatabaseManager::prepare("select posts.post_title, views.page_id, views.view_date, views.ip_long, views.browser, views.browser_ver, views.os_name, views.os_ver, views.referer  from athena_%d_PageViews views inner join wp_%d_posts posts where views.blog_id = %d and views.page_id = posts.ID ORDER BY views.view_date DESC",  $blog_id, $blog_id ); 		
	//	return DatabaseManager::getResults($sql);		
	//}

	// //////////////////////////////////////////////////////////////////////////////////////
	
}
?>