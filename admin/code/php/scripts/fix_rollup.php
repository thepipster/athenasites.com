<?php

require_once("../setup.php");

Logger::echoLog();

// Get a list of all the sites
$site_list = SitesTable::getUniqueSites();

foreach ($site_list AS $site) {

    $site_id = $site['id'];
    
    Logger::debug("Processing site $site_id");
    
 	$stats = DatabaseManager::getResults("SELECT * FROM stats_{$site_id}_RollupPageViews");
 	
 	foreach($stats as $stat){

		$post_id = $stat['post_id'];
		$id = $stat['id'];
		
		if (isset($post_id) && $post_id > 0){
			$page_title = DatabaseManager::getVar("SELECT title FROM athena_{$site_id}_Posts WHERE id = $post_id");					
			$sql = DatabaseManager::prepare("UPDATE stats_%d_RollupPageViews SET page_title = %s WHERE id = %d", $site_id, $page_title, $id);
			DatabaseManager::update($sql);
		}

 	}
}			
	
?>
