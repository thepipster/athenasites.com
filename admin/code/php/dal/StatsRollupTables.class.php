<?php

/**
 * 
 * @author Mike Pritchard
 * @since March 20th, 2010
 */
class StatsRollupTables {

    /**
     * To keep the database table from growing huge, we break this table up by site id
     */
    public static function createTableForSite($site_id) {

        $sql = "CREATE TABLE `stats_{$site_id}_RollupBrowser` (
		  `id` int(11) NOT NULL auto_increment,
		  `rollup_date` date default NULL,
		  `browser` varchar(30) default NULL,
		  `browser_ver` varchar(10) default NULL,
		  `hits` int(11) default NULL,
		  PRIMARY KEY  (`id`)
		) ENGINE=MyISAM DEFAULT CHARSET=utf8;";

        DatabaseManager::submitQuery($sql);
/*
        $sql = "CREATE TABLE `stats_{$site_id}_RollupCrawler` (
		  `id` int(11) NOT NULL auto_increment,
		  `rollup_date` date default NULL,
		  `crawler` varchar(25) default NULL,
		  `hits` int(11) default NULL,
		  PRIMARY KEY  (`id`)
		) ENGINE=MyISAM DEFAULT CHARSET=utf8;";

        DatabaseManager::submitQuery($sql);
*/
        $sql = "CREATE TABLE `stats_{$site_id}_RollupOS` (
		  `id` int(11) NOT NULL auto_increment,
		  `rollup_date` date default NULL,
		  `os_name` varchar(30) default NULL,
		  `os_ver` varchar(10) default NULL,
		  `hits` int(11) default NULL,
		  PRIMARY KEY  (`id`)
		) ENGINE=MyISAM DEFAULT CHARSET=utf8;";

        DatabaseManager::submitQuery($sql);

        $sql = "CREATE TABLE `stats_{$site_id}_RollupPageViews` (
		  `id` int(11) NOT NULL auto_increment,
		  `rollup_date` date default NULL,
		  `page_views` int(11) default NULL,
		  `unique_visitors` int(11) default NULL,
		  `keywords` text,
		  `page_id` int(11) default 0,
		  `post_id` int(11) default 0,
		  `page_title` varchar(125) default NULL,
		  PRIMARY KEY  (`id`)
		) ENGINE=MyISAM DEFAULT CHARSET=utf8;";

        DatabaseManager::submitQuery($sql);
    }

    // //////////////////////////////////////////////////////////////////////////////////////
    //
    // Global stats
    //
    // //////////////////////////////////////////////////////////////////////////////////////

	public static function getNoServers(){
        return DatabaseManager::getVar("SELECT max(server_no) FROM stats_RollupServer");	
	}
	
    // //////////////////////////////////////////////////////////////////////////////////////

    public static function getGlobalPageViews($no_days) {
        $date_from = date("Y-m-d 00:00:00", mktime(date("H"), date("i"), date("s"), date("m"), date("d") - $no_days, date("Y")));
        $sql = DatabaseManager::prepare("SELECT sum(page_views) as page_views, rollup_date FROM stats_RollupServer WHERE rollup_date > %s GROUP BY rollup_date DESC", $date_from);
        return DatabaseManager::getResults($sql);
    }

    public static function getGlobalPageViewsForServer($server_no, $no_days) {
        $date_from = date("Y-m-d 00:00:00", mktime(date("H"), date("i"), date("s"), date("m"), date("d") - $no_days, date("Y")));
        $sql = DatabaseManager::prepare("SELECT * FROM stats_RollupServer WHERE rollup_date > %s AND server_no = %d ORDER BY rollup_date DESC", $date_from, $server_no);
        return DatabaseManager::getResults($sql);
    }
    
    // //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Get the number of page views across all sites.
	* @param int (optional) specify the last N days to get, or omit to get ALL page views
	*/
    public static function getGlobalNumberPageViews($no_days=null) {

		if (isset($no_days)){
        	$date_from = date("Y-m-d 00:00:00", mktime(date("H"), date("i"), date("s"), date("m"), date("d") - $no_days, date("Y")));
        	$sql = DatabaseManager::prepare("SELECT sum(page_views) FROM stats_RollupServer WHERE rollup_date > %s", $date_from);
        }
        else {
        	$sql = "SELECT sum(page_views) FROM stats_RollupServer";
        }

        $no = DatabaseManager::getVar($sql);
        if (!isset($no)) {
            $no = 0;
        }
        return $no;
    }
    
    // //////////////////////////////////////////////////////////////////////////////////////
    
	/**
	* Get the number of page views across all sites.
	* @param int (optional) specify the last N days to get, or omit to get ALL page views
	*/
    public static function getGlobalNumberPageViewsForServer($server_no, $no_days=null) {

		if (isset($no_days)){
        	$date_from = date("Y-m-d 00:00:00", mktime(date("H"), date("i"), date("s"), date("m"), date("d") - $no_days, date("Y")));
        	$sql = DatabaseManager::prepare("SELECT sum(page_views) FROM stats_RollupServer WHERE rollup_date > %s AND server_no = %d", $date_from, $server_no);
        }
        else {
        	$sql = DatabaseManager::prepare("SELECT sum(page_views) FROM stats_RollupServer WHERE server_no = %d", $server_no);
        }
	
        $no = DatabaseManager::getVar($sql);
        if (!isset($no)) {
            $no = 0;
        }
        return $no;
    }    

    // //////////////////////////////////////////////////////////////////////////////////////
    //
    // Site stats
    //
    // //////////////////////////////////////////////////////////////////////////////////////

    public static function getPageViewsRollup($site_id, $no_days) {

        $date_from = date("Y-m-d 00:00:00", mktime(date("H"), date("i"), date("s"), date("m"), date("d") - $no_days, date("Y")));

        $sql = DatabaseManager::prepare("SELECT * FROM stats_%d_RollupPageViews WHERE page_title != 'all' AND rollup_date > %s ORDER BY rollup_date DESC, unique_visitors DESC", $site_id, $date_from);
        return DatabaseManager::getResults($sql);
    }

    // //////////////////////////////////////////////////////////////////////////////////////

    public static function getAllPageViewsRollup($site_id, $no_days) {

        $date_from = date("Y-m-d 00:00:00", mktime(date("H"), date("i"), date("s"), date("m"), date("d") - $no_days, date("Y")));

        $sql = DatabaseManager::prepare("SELECT * FROM stats_%d_RollupPageViews WHERE page_title = 'all' AND rollup_date > %s ORDER BY rollup_date DESC, unique_visitors DESC", $site_id, $date_from);
        return DatabaseManager::getResults($sql);
    }
    
    // //////////////////////////////////////////////////////////////////////////////////////

    /**
     * Return an array of page_views and unique_visits for the whole blog for the last n days
     */
    public static function getPageViewsLastNDays($site_id, $no_days) {

        $data = array($no_days);

        $date_from = date("Y-m-d 00:00:00", mktime(date("H"), date("i"), date("s"), date("m"), date("d") - $no_days, date("Y")));
        $date_end = date("Y-m-d 23:59:59", mktime(date("H"), date("i"), date("s"), date("m"), date("d"), date("Y")));

        $sql = DatabaseManager::prepare("SELECT rollup_date, sum(page_views) as page_views, sum(unique_visitors) as unique_visits FROM stats_%d_RollupPageViews WHERE page_title='all' AND rollup_date > %s AND rollup_date <= %s GROUP BY rollup_date", $site_id, $date_from, $date_end);
        return DatabaseManager::getResults($sql);
    }

    // //////////////////////////////////////////////////////////////////////////////////////
		    	
    /**
     * Return an array of page_views and unique_visits for the whole blog for the last n days
     */
    public static function getCrawlerViewsLastNDays($site_id, $no_days) {

        $data = array($no_days);

        $date_from = date("Y-m-d 00:00:00", mktime(date("H"), date("i"), date("s"), date("m"), date("d") - $no_days, date("Y")));
        $date_end = date("Y-m-d 23:59:59", mktime(date("H"), date("i"), date("s"), date("m"), date("d"), date("Y")));

        $sql = DatabaseManager::prepare("SELECT rollup_date, crawler, sum(hits) as hits FROM stats_%d_RollupCrawler WHERE rollup_date > %s AND rollup_date <= %s GROUP BY rollup_date, crawler", $site_id, $date_from, $date_end);
        //error_log($sql);
        return DatabaseManager::getResults($sql);
    }

    // //////////////////////////////////////////////////////////////////////////////////////

    /**
     * Return an array of page_views and unique_visits for the whole blog for the last n days
     */
    public static function getBrowserViewsLastNDays($site_id, $no_days) {

        global $wpdb;

        $data = array($no_days);

        $date_from = date("Y-m-d 00:00:00", mktime(date("H"), date("i"), date("s"), date("m"), date("d") - $no_days, date("Y")));
        $date_end = date("Y-m-d 23:59:59", mktime(date("H"), date("i"), date("s"), date("m"), date("d"), date("Y")));

        $sql = DatabaseManager::prepare("SELECT rollup_date, browser, browser_ver, sum(hits) as hits FROM stats_%d_RollupBrowser WHERE site_id = %d AND rollup_date > %s AND rollup_date <= %s GROUP BY browser, browser_ver", $site_id, $date_from, $date_end);
        return DatabaseManager::getResults($sql);
    }

    // //////////////////////////////////////////////////////////////////////////////////////

    /**
     * Return an array of page_views and unique_visits for the whole blog for the last n days
     */
    public static function getOSViewsLastNDays($site_id, $no_days) {

        $data = array($no_days);

        $date_from = date("Y-m-d 00:00:00", mktime(date("H"), date("i"), date("s"), date("m"), date("d") - $no_days, date("Y")));
        $date_end = date("Y-m-d 23:59:59", mktime(date("H"), date("i"), date("s"), date("m"), date("d"), date("Y")));

        $sql = DatabaseManager::prepare("SELECT rollup_date, os_name, os_ver, sum(hits) as hits FROM stats_%d_RollupOS WHERE rollup_date > %s AND rollup_date <= %s GROUP BY rollup_date, os_name, os_ver", $site_id, $date_from, $date_end);
        return DatabaseManager::getResults($sql);
    }

    // //////////////////////////////////////////////////////////////////////////////////////
}

?>