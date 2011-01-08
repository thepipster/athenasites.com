<?php

/**
 * Process ajax requests sent from the Athena front end
 *
 * Author: Mike Pritchard
 * Date: 5th August, 2010
 */
require_once("../setup.php");

$cmd = CommandHelper::getPara('cmd', true, CommandHelper::$PARA_TYPE_STRING);

// Grab global parameters that all commands must have
$site_id = CommandHelper::getPara('site_id', true, CommandHelper::$PARA_TYPE_STRING);

Logger::debug("Command = " . $cmd);

// Get the command type, and process
switch ($cmd) {

    case "getServerStats":
		$no_days = CommandHelper::getPara('days', true, CommandHelper::$PARA_TYPE_NUMERIC);
        getServerStats($no_days);
        break;

    case "getPageStatsList":
		$no_days = CommandHelper::getPara('days', true, CommandHelper::$PARA_TYPE_NUMERIC);
        getPageStatsList($site_id, $no_days);
        break;

    case "getPageStats":
		$page_id = CommandHelper::getPara('page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$post_id = CommandHelper::getPara('post_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$no_days = CommandHelper::getPara('days', true, CommandHelper::$PARA_TYPE_NUMERIC);
        getPageStats($site_id, $page_id, $post_id, $no_days);
        break;

    case "getSiteSummaryStats":
		$no_days = CommandHelper::getPara('days', true, CommandHelper::$PARA_TYPE_NUMERIC);
        getSiteSummaryStats($site_id, $no_days);
        break;
        
    default :
        CommandHelper::sendTextMessage("Undefined command '$cmd'");
}

// ///////////////////////////////////////////////////////////////////////////////////////
//
// Commands
//
// ///////////////////////////////////////////////////////////////////////////////////////

/**
* Get a list of all the pages and posts, together with their total page views over
* the time period given
*/
function getPageStatsList($site_id, $no_days){

    $date_from = date("Y-m-d 00:00:00", mktime(date("H"), date("i"), date("s"), date("m"), date("d") - $no_days, date("Y")));
	$sql = DatabaseManager::prepare("SELECT page_title, post_id, page_id, sum(page_views) as page_views FROM stats_%d_RollupPageViews WHERE rollup_date > %s AND page_title != 'all' GROUP BY page_id, post_id ORDER BY page_views DESC", $site_id, $date_from);
	$page_list = DatabaseManager::getResults($sql);
	
    $msg['cmd'] = "getPageStatsList";
    $msg['result'] = 'ok';
    $msg['data'] = array('pages' => $page_list);
    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

function getServerStats($no_days){

    $msg['cmd'] = 'getServerStats';
    $msg['result'] = 'fail';

	// Only super-users are allowed this data!
	if (!SecurityUtils::isSuperUser()) {
	    CommandHelper::sendMessage($msg);
    	$msg['data'] = 'you are not authorized to get this data!';
    	Logger::error('Unauthorized access to stats page');
	    CommandHelper::sendMessage($msg);
		return;
	}
	
	$sites_list = SitesTable::getUniqueSites();
	
	$disc_usage = 0;
	foreach($sites_list as $site){
		$site_id = $site['id'];
	    $disc_usage += (MediaTable::getDiscUsage($site_id) / (1024*1024));
	}

    // Get page views for the whole site for each day for server 0

    $server_views = array();

	// Get the combined stats
	$page_views = StatsRollupTables::getGlobalPageViews($no_days);
	
    $views = array();

    if (isset($page_views)) {
        foreach ($page_views as $view) {
            $temp = array();
            $temp['dt'] = $view['rollup_date'];
            $temp['pv'] = $view['page_views'];
            $views[] = $temp;                
        }
    }
    
    $server_views[] = $views;
    
    // Get page views for the whole site for each day for server 0
 	$no_servers = StatsRollupTables::getNoServers();
 	
    for($i=0; $i<=$no_servers; $i++){
    
	    $page_views = StatsRollupTables::getGlobalPageViewsForServer($i, $no_days);
	    $views = array();
	
	    if (isset($page_views)) {
	        foreach ($page_views as $view) {
                $temp = array();
                $temp['dt'] = $view['rollup_date'];
                $temp['pv'] = $view['page_views'];
                $views[] = $temp;                
	        }
	    }
	    
	    $server_views[] = $views;
    }
    	
    $msg['getStats'] = "getStats";
    $msg['result'] = 'ok';
    $msg['data'] = array('disc_usage' => $disc_usage . "", 'server_page_views' => $server_views);
        
    CommandHelper::sendMessage($msg);
}


// ///////////////////////////////////////////////////////////////////////////////////////

/**
 * Get the stats summary for the given site
 * @param int $site_id
 */
function getSiteSummaryStats($site_id, $no_days) {

    //$disc_usage = du(SecurityUtils::getMediaFolder($site_id)) + du(SecurityUtils::getSitesFolder($site_id));
    $disc_usage = MediaTable::getDiscUsage($site_id) / (1024*1024);

    // Get page views for the whole site for each day
    $page_views = StatsRollupTables::getAllPageViewsRollup($site_id, $no_days);
    $views = array();

    if (isset($page_views)) {
        foreach ($page_views as $view) {
            if ($view['page_title'] == 'all') {
                $temp = array();
                $temp['dt'] = $view['rollup_date'];
                $temp['uv'] = $view['unique_visitors'];
                $temp['pv'] = $view['page_views'];
                $views[] = $temp;
            }
        }
    }

    $msg['cmd'] = "getSiteSummaryStats";
    $msg['result'] = 'ok';
    $msg['data'] = array('disc_usage' => $disc_usage . "", 'page_views' => $views);
    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

/**
* Get stats for the specified page/blog
*/ 
function getPageStats($site_id, $page_id, $post_id, $no_days){

    $date_from = date("Y-m-d 00:00:00", mktime(date("H"), date("i"), date("s"), date("m"), date("d") - $no_days, date("Y")));
    $no_days = floor(TimeUtils::getElapsedDays($date_from));
    
    $views = array($no_days);
    for($i=1; $i<=$no_days; $i++){
    	$date = date("Y-m-d", mktime(date("H"), date("i"), date("s"), date("m"), date("d") - $i, date("Y")));
    	$views[$i] = array("dt" => $date, "uv" => 0, "pv" => 0);
    }
    
	if (isset($post_id) && $post_id > 0){
        $sql = DatabaseManager::prepare("SELECT * FROM stats_%d_RollupPageViews WHERE post_id = %d AND rollup_date > %s ORDER BY rollup_date DESC, unique_visitors DESC", $site_id, $post_id, $date_from);
	}
	else {
        $sql = DatabaseManager::prepare("SELECT * FROM stats_%d_RollupPageViews WHERE page_id = %d AND rollup_date > %s ORDER BY rollup_date DESC, unique_visitors DESC", $site_id, $page_id, $date_from);
	}
	
    $page_views = DatabaseManager::getResults($sql);
	
    if (isset($page_views)) {

		$uv_list = array();
		$pv_list = array();
		
	    foreach ($page_views as $view) {
	    	$uv_list[$view['rollup_date']] = $view['unique_visitors'];
	    	$pv_list[$view['rollup_date']] = $view['page_views'];
		}

		for($i=0; $i<$no_days; $i++){
	    	$date = date("Y-m-d", mktime(date("H"), date("i"), date("s"), date("m"), date("d") - $i, date("Y")));
	    	Logger::debug($date);
	    	if (isset($uv_list[$date])){
	    		$views[$i]['uv'] = $uv_list[$date];
	    	}
	    	if (isset($pv_list[$date])){
	    		$views[$i]['pv'] = $pv_list[$date];
	    	}
		}
						
    }
    
    Logger::dump($views);
    
    $msg['cmd'] = "getPageStats";
    $msg['result'] = 'ok';
    $msg['data'] = array('page_views' => $views);
    CommandHelper::sendMessage($msg);
}

?>