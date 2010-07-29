<?php
/**
 * 
 * @author Mike Pritchard
 * @since March 20th, 2010
 */
  
class StatsRollupTables {
	
	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getPageViewsRollup($blog_id, $no_days){
		global $wpdb;

		date_default_timezone_set('UTC');
		
		$date_from = date("Y-m-d 00:00:00", mktime(date("H"), date("i"), date("s"), date("m") , date("d")-$no_days, date("Y")));

		$sql = $wpdb->prepare("SELECT * FROM apollo_RollupPageViews WHERE page_title != 'all' AND blog_id = %d AND rollup_date > %s ORDER BY rollup_date DESC, unique_visitors DESC",  $blog_id, $date_from ); 		
		return $wpdb->get_results($sql, ARRAY_A);		
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getGlobalPageViewsRollup(){
		global $wpdb;
		$sql = $wpdb->prepare("SELECT * FROM apollo_RollupPageViews ORDER BY rollup_date DESC, unique_visitors DESC",  $blog_id ); 		
		return $wpdb->get_results($sql, ARRAY_A);		
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Return an array of page_views and unique_visits for the whole blog for the last n days
	*/
	public static function getPageViewsLastNDays($blog_id, $no_days){
	
		global $wpdb;

		$data = array($no_days);
				
		date_default_timezone_set('UTC');
		
		$date_from = date("Y-m-d 00:00:00", mktime(date("H"), date("i"), date("s"), date("m") , date("d")-$no_days, date("Y")));
		$date_end = date("Y-m-d 23:59:59", mktime(date("H"), date("i"), date("s"), date("m") , date("d"), date("Y")));
			
		$sql = $wpdb->prepare("SELECT rollup_date, sum(page_views) as page_views, sum(unique_visitors) as unique_visits FROM apollo_RollupPageViews WHERE page_title='all' AND blog_id = %d AND rollup_date > %s AND rollup_date <= %s GROUP BY rollup_date",  $blog_id, $date_from, $date_end); 		
		return $wpdb->get_results($sql, ARRAY_A);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Return an array of page_views and unique_visits for the whole site for the last n days
	*/
	public static function getGlobalPageViewsLastNDays($no_days){
	
		global $wpdb;

		$data = array($no_days);
				
		date_default_timezone_set('UTC');
		
		$date_from = date("Y-m-d 00:00:00", mktime(date("H"), date("i"), date("s"), date("m") , date("d")-$no_days, date("Y")));
		$date_end = date("Y-m-d 23:59:59", mktime(date("H"), date("i"), date("s"), date("m") , date("d"), date("Y")));
			
		$sql = $wpdb->prepare("SELECT rollup_date, sum(page_views) as page_views, sum(unique_visitors) as unique_visits FROM apollo_RollupPageViews WHERE page_title='all' AND rollup_date > %s AND rollup_date <= %s GROUP BY rollup_date",  $date_from, $date_end); 		
		return $wpdb->get_results($sql, ARRAY_A);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Return an array of page_views and unique_visits for the whole blog for the last n days
	*/
	public static function getCrawlerViewsLastNDays($blog_id, $no_days){
	
		global $wpdb;

		$data = array($no_days);
				
		date_default_timezone_set('UTC');
		
		$date_from = date("Y-m-d 00:00:00", mktime(date("H"), date("i"), date("s"), date("m") , date("d")-$no_days, date("Y")));
		$date_end = date("Y-m-d 23:59:59", mktime(date("H"), date("i"), date("s"), date("m") , date("d"), date("Y")));
			
		$sql = $wpdb->prepare("SELECT rollup_date, crawler, sum(hits) as hits FROM apollo_RollupCrawler WHERE blog_id = %d AND rollup_date > %s AND rollup_date <= %s GROUP BY rollup_date, crawler",  $blog_id, $date_from, $date_end); 		
		//error_log($sql);
		return $wpdb->get_results($sql, ARRAY_A);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Return an array of page_views and unique_visits for the whole blog for the last n days
	*/
	public static function getGlobalCrawlerViewsLastNDays($no_days){
	
		global $wpdb;

		$data = array($no_days);
				
		date_default_timezone_set('UTC');
		
		$date_from = date("Y-m-d 00:00:00", mktime(date("H"), date("i"), date("s"), date("m") , date("d")-$no_days, date("Y")));
		$date_end = date("Y-m-d 23:59:59", mktime(date("H"), date("i"), date("s"), date("m") , date("d"), date("Y")));
			
		$sql = $wpdb->prepare("SELECT rollup_date, crawler, sum(hits) as hits FROM apollo_RollupCrawler WHERE rollup_date > %s AND rollup_date <= %s GROUP BY rollup_date, crawler",  $date_from, $date_end); 		
		return $wpdb->get_results($sql, ARRAY_A);		
	}


	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Return an array of page_views and unique_visits for the whole blog for the last n days
	*/
	public static function getBrowserViewsLastNDays($blog_id, $no_days){
	
		global $wpdb;

		$data = array($no_days);
				
		date_default_timezone_set('UTC');
		
		$date_from = date("Y-m-d 00:00:00", mktime(date("H"), date("i"), date("s"), date("m") , date("d")-$no_days, date("Y")));
		$date_end = date("Y-m-d 23:59:59", mktime(date("H"), date("i"), date("s"), date("m") , date("d"), date("Y")));
			
		$sql = $wpdb->prepare("SELECT rollup_date, browser, browser_ver, sum(hits) as hits FROM apollo_RollupBrowser WHERE blog_id = %d AND rollup_date > %s AND rollup_date <= %s GROUP BY browser, browser_ver",  $blog_id, $date_from, $date_end); 		
		return $wpdb->get_results($sql, ARRAY_A);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Return an array of page_views and unique_visits for the whole blog for the last n days
	*/
	public static function getGlobalBrowserViewsLastNDays($no_days){
	
		global $wpdb;

		$data = array($no_days);
				
		date_default_timezone_set('UTC');
		
		$date_from = date("Y-m-d 00:00:00", mktime(date("H"), date("i"), date("s"), date("m") , date("d")-$no_days, date("Y")));
		$date_end = date("Y-m-d 23:59:59", mktime(date("H"), date("i"), date("s"), date("m") , date("d"), date("Y")));
			
		$sql = $wpdb->prepare("SELECT rollup_date, browser, browser_ver, sum(hits) as hits FROM apollo_RollupBrowser WHERE rollup_date > %s AND rollup_date <= %s GROUP BY  browser, browser_ver",  $date_from, $date_end); 		
		return $wpdb->get_results($sql, ARRAY_A);		
	}
	

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Return an array of page_views and unique_visits for the whole blog for the last n days
	*/
	public static function getOSViewsLastNDays($blog_id, $no_days){
	
		global $wpdb;

		$data = array($no_days);
				
		date_default_timezone_set('UTC');
		
		$date_from = date("Y-m-d 00:00:00", mktime(date("H"), date("i"), date("s"), date("m") , date("d")-$no_days, date("Y")));
		$date_end = date("Y-m-d 23:59:59", mktime(date("H"), date("i"), date("s"), date("m") , date("d"), date("Y")));
			
		$sql = $wpdb->prepare("SELECT rollup_date, os_name, os_ver, sum(hits) as hits FROM apollo_RollupOS WHERE blog_id = %d AND rollup_date > %s AND rollup_date <= %s GROUP BY rollup_date, os_name, os_ver",  $blog_id, $date_from, $date_end); 		
		return $wpdb->get_results($sql, ARRAY_A);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Return an array of page_views and unique_visits for the whole blog for the last n days
	*/
	public static function getGlobalOSViewsLastNDays($no_days){
	
		global $wpdb;

		$data = array($no_days);
				
		date_default_timezone_set('UTC');
		
		$date_from = date("Y-m-d 00:00:00", mktime(date("H"), date("i"), date("s"), date("m") , date("d")-$no_days, date("Y")));
		$date_end = date("Y-m-d 23:59:59", mktime(date("H"), date("i"), date("s"), date("m") , date("d"), date("Y")));
			
		$sql = $wpdb->prepare("SELECT rollup_date, os_name, os_ver, sum(hits) as hits FROM apollo_RollupOS WHERE rollup_date > %s AND rollup_date <= %s GROUP BY rollup_date, os_name, os_ver",  $date_from, $date_end); 		
		return $wpdb->get_results($sql, ARRAY_A);		
	}	

}
?>