<?php
/**
 * 
 * @author Mike Pritchard
 * @since January 22nd, 2010
 */
  
class ApolloPageViewsTable {
	
	// //////////////////////////////////////////////////////////////////////////////////////

	public static function logView(){
		
		if (self::isSameView()){
			return;
		}
		
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
		
		global $blog_id, $wp_query, $wpdb;

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
//			$sql = $wpdb->prepare("INSERT INTO apollo_PageViews (blog_id, page_post_id, view_date, ip_long, browser, browser_ver, os_name, os_ver, referer) VALUES (%d, %d, %s, %d, %s, %s, %s, %s, %s)", 
//					$blog_id, $wp_query->post->ID, $date_now, ip2long($_SERVER['REMOTE_ADDR']), $browser_name, $browser_ver, $os, $os_ver, $referer );
			$sql = $wpdb->prepare("INSERT INTO apollo_PageViews (blog_id, page_post_id, view_date, ip_long, browser, browser_ver, os_name, os_ver, referer, user_agent, is_bot, server_ip) VALUES (%d, %d, %s, %d, %s, %s, %s, %s, %s, %s, %d, %d)", 
					$blog_id, $wp_query->post->ID, $date_now, ip2long($true_ip), $browser_name, $browser_ver, $os, $os_ver, $referer, $user_agent, $is_bot, ip2long($server_ip) );
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
	public static function isSameView(){
	
		global $blog_id, $wp_query, $wpdb;
	
		$ip_long = ip2long($_SERVER['REMOTE_ADDR']);
		date_default_timezone_set('UTC');
		$date_before = date("Y-m-d H:i:s", mktime(date("H"), date("i"), date("s")-10, date("m"), date("d"), date("Y")));
		$date_now = date("Y-m-d H:i:s", mktime(date("H"), date("i"), date("s"), date("m"), date("d"), date("Y")));
		
		$sql = $wpdb->prepare("SELECT count(*) FROM apollo_PageViews WHERE page_post_id = %d AND blog_id = %d AND ip_long = %s AND view_date > %s",  $wp_query->post->ID, $blog_id, $ip_long, $date_before ); 		

		$data = $wpdb->get_results($sql, ARRAY_N);
		
		if (isset($data) && isset($data[0]) && isset($data[0][0])){
			if ($data[0][0] > 0) return true;
		}
		
		return false;
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getStatsForBlog($blog_id){
		$sql = $wpdb->prepare("SELECT * FROM apollo_PageViews WHERE blog_id = %d",  $blog_id ); 		
		return $wpdb->get_results($sql, ARRAY_A);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getViewsLast30Days($blog_id){		
		return self::getViewsLastNDays($blog_id, 30);
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getViewsLastNDays($blog_id, $no_days_ago){

		global $wpdb;
		
		date_default_timezone_set('UTC');
		$date_before = date("Y-m-d H:i", mktime(date("H"), date("i"), date("s"), date("m")  , date("d")-$no_days_ago, date("Y")));
	
		$sql = $wpdb->prepare("SELECT count(blog_id) FROM apollo_PageViews WHERE blog_id = %d AND view_date > %s",  $blog_id, $date_before ); 		
		$data = $wpdb->get_results($sql, ARRAY_N);		
	
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

		global $wpdb;

		$data = array($no_days);
				
		date_default_timezone_set('UTC');
				
		for ($n=0; $n<$no_days; $n++){
			
			$date_from = date("Y-m-d 00:00:00", mktime(date("H"), date("i"), date("s"), date("m") , date("d")-$n, date("Y")));
			$date_end = date("Y-m-d 23:59:59", mktime(date("H"), date("i"), date("s"), date("m") , date("d")-$n, date("Y")));
			$sql = $wpdb->prepare("SELECT count(distinct(ip_long)) FROM apollo_PageViews WHERE view_date > %s AND view_date < %s",  $date_from, $date_end ); 		
			$views = $wpdb->get_var($sql);		
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
	public static function getGlobalBinnedViewsLastNDays($no_days){

		global $wpdb;

		$data = array($no_days);
				
		date_default_timezone_set('UTC');
				
		for ($n=0; $n<$no_days; $n++){
			
			$date_from = date("Y-m-d 00:00:00", mktime(date("H"), date("i"), date("s"), date("m") , date("d")-$n, date("Y")));
			$date_end = date("Y-m-d 23:59:59", mktime(date("H"), date("i"), date("s"), date("m") , date("d")-$n, date("Y")));
			$sql = $wpdb->prepare("SELECT count(*) FROM apollo_PageViews WHERE view_date > %s AND view_date < %s",  $date_from, $date_end ); 		
			
			$views = $wpdb->get_var($sql);	
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


	public static function getBinnedUniqueViewsLastNDays($blog_id, $no_days){

		global $wpdb;

		$data = array($no_days);
				
		date_default_timezone_set('UTC');
				
		for ($n=0; $n<$no_days; $n++){
			
			$date_from = date("Y-m-d 00:00:00", mktime(date("H"), date("i"), date("s"), date("m") , date("d")-$n, date("Y")));
			$date_end = date("Y-m-d 23:59:59", mktime(date("H"), date("i"), date("s"), date("m") , date("d")-$n, date("Y")));
			$sql = $wpdb->prepare("SELECT count(distinct(ip_long)) FROM apollo_PageViews WHERE blog_id = %d AND view_date > %s AND view_date < %s",  $blog_id, $date_from, $date_end ); 		
			$views = $wpdb->get_var($sql);		
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
	
	public static function getBinnedViewsLastNDays($blog_id, $no_days){

		global $wpdb;

		$data = array($no_days);
				
		date_default_timezone_set('UTC');
				
		for ($n=0; $n<$no_days; $n++){
			
			$date_from = date("Y-m-d 00:00:00", mktime(date("H"), date("i"), date("s"), date("m") , date("d")-$n, date("Y")));
			$date_end = date("Y-m-d 23:59:59", mktime(date("H"), date("i"), date("s"), date("m") , date("d")-$n, date("Y")));
			$sql = $wpdb->prepare("SELECT count(blog_id) FROM apollo_PageViews WHERE blog_id = %d AND view_date > %s AND view_date < %s",  $blog_id, $date_from, $date_end ); 		
			
			$views = $wpdb->get_var($sql);	
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

	public static function getViewsAllTime($blog_id){

		global $wpdb;
		
		$sql = $wpdb->prepare("SELECT count(blog_id) FROM apollo_PageViews WHERE blog_id = %d",  $blog_id ); 		
		$data = $wpdb->get_results($sql, ARRAY_N);		
			
		if (isset($data[0]) && isset($data[0][0])){
			return $data[0][0];		
		}
		
		return 0;
	}
		
	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getUniqueViewsLastNDays($blog_id, $no_days_ago){

		global $wpdb;
				
		date_default_timezone_set('UTC');
		$date_before = date("Y-m-d H:i", mktime(date("H"), date("i"), date("s"), date("m")  , date("d")-$no_days_ago, date("Y")));
		
		$sql = $wpdb->prepare("SELECT count(distinct(ip_long)) FROM apollo_PageViews WHERE blog_id = %d AND view_date > %s",  $blog_id, $date_before ); 		
		$data = $wpdb->get_results($sql, ARRAY_N);		
	
		//error_log(print_r($data[0], true));
		
		if (isset($data[0]) && isset($data[0][0])){
			return $data[0][0];		
		}
		
		return 0;
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getUniqueViewsAllTime($blog_id){

		global $wpdb;
				
		$sql = $wpdb->prepare("SELECT count(distinct(ip_long)) FROM apollo_PageViews WHERE blog_id = %d",  $blog_id ); 		
		$data = $wpdb->get_results($sql, ARRAY_N);		
			
		if (isset($data[0]) && isset($data[0][0])){
			return $data[0][0];		
		}
		
		return 0;
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Return a list of all the views, and return the post_title
	*/
	public static function getAllViews($blog_id){	
		global $wpdb;							
		$sql = $wpdb->prepare("select posts.post_title, views.page_post_id, views.view_date, views.ip_long, views.browser, views.browser_ver, views.os_name, views.os_ver, views.referer  from apollo_PageViews views inner join wp_%d_posts posts where views.blog_id = %d and views.page_post_id = posts.ID ORDER BY views.view_date DESC",  $blog_id, $blog_id ); 		
		return $wpdb->get_results($sql, ARRAY_A);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////
		
	public static function getNoPages($blog_id){

		global $wpdb;
		
		$sql = $wpdb->prepare("SELECT count(ID) FROM wp_%d_posts WHERE post_type='page'",  $blog_id ); 		
		$data = $wpdb->get_results($sql, ARRAY_N);		
			
		if (isset($data[0]) && isset($data[0][0])){
			return $data[0][0];		
		}
		
		return 0;
	}	

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getBlogList(){
		global $wpdb;		
		return $wpdb->get_results("SELECT * FROM wp_blogs ORDER BY last_updated DESC", ARRAY_A);			
	}

	// //////////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Return the data on this blog in the wp_blogs table
	*/
	public static function getBlog($blog_id){
	
		global $wpdb;		
		$data = $wpdb->get_results($wpdb->prepare("SELECT * FROM wp_blogs WHERE blog_id = %d", $blog_id), ARRAY_A);			
		
		if (isset($data[0])){
			return $data[0];
		}
		
		return null;
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Get the number of blog posts
	*/
	public static function getNoPosts($blog_id){

		global $wpdb;
		
		$sql = $wpdb->prepare("SELECT count(ID) FROM wp_%d_posts WHERE post_type='post'",  $blog_id ); 		
		$data = $wpdb->get_results($sql, ARRAY_N);		
			
		if (isset($data[0]) && isset($data[0][0])){
			return $data[0][0];		
		}
		
		return 0;
	}
}
?>