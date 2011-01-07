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
        getServerStats();
        break;

    case "getSiteSummaryStats":
        getSiteSummaryStats($site_id);
        break;
        
    default :
        CommandHelper::sendTextMessage("Undefined command '$cmd'");
}

// ///////////////////////////////////////////////////////////////////////////////////////
//
// Commands
//
// ///////////////////////////////////////////////////////////////////////////////////////

function getServerStats(){

    $msg['cmd'] = 'getSummary';
    $msg['result'] = 'fail';

	// Only super-users are allowed this data!
	if (!SecurityUtils::isSuperUser()) {
	    CommandHelper::sendMessage($msg);
    	$msg['data'] = 'you are not authorized to get this data!';
	    CommandHelper::sendMessage($msg);
		return;
	}
	
	$sites_list = SitesTable::getSites();
	
	$disc_usage = 0;
	foreach($sites_list as $site){
		$site_id = $site['id'];
	    $disc_usage += (MediaTable::getDiscUsage($site_id) / (1024*1024));
	}

    // Get page views for the whole site for each day for server 0
    $server_views = array();
    
    for($i=0; $i<=2; $i++){
    
	    $page_views = StatsRollupTables::getGlobalPageViewsForServer($i, 90);
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
function getSiteSummaryStats($site_id) {

    //$disc_usage = du(SecurityUtils::getMediaFolder($site_id)) + du(SecurityUtils::getSitesFolder($site_id));
    $disc_usage = MediaTable::getDiscUsage($site_id) / (1024*1024);

    // Get page views for the whole site for each day
    $page_views = StatsRollupTables::getAllPageViewsRollup($site_id, 30);
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

    // Get the hits from search engines
    $page_views = StatsRollupTables::getCrawlerViewsLastNDays($site_id, 30);
    $crawler_views = array();

    if (isset($page_views)) {
        foreach ($page_views as $view) {
            $temp = array();
            $temp['dt'] = $view['rollup_date'];
            $temp['crw'] = $view['crawler'];
            $temp['pv'] = $view['hits'];
            $crawler_views[] = $temp;
        }
    }


    $msg['getStats'] = "getStats";
    $msg['result'] = 'ok';
    $msg['data'] = array('disc_usage' => $disc_usage . "", 'page_views' => $views, 'crawler_views' => $crawler_views);
    CommandHelper::sendMessage($msg);
}
?>