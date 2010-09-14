<?php

require_once("code/php/setup.php");

Logger::echoLog();

Logger::debug("Clearing tables");
/*
DatabaseManager::submitQuery("TRUNCATE TABLE athena_Users");
DatabaseManager::submitQuery("TRUNCATE TABLE athena_UserToSite");
DatabaseManager::submitQuery("TRUNCATE TABLE athena_Sites");

for ($i=1; $i<=5; $i++){
	DatabaseManager::submitQuery("DROP TABLE IF EXISTS athena_{$i}_Folders");
	DatabaseManager::submitQuery("DROP TABLE IF EXISTS athena_{$i}_GalleryMeta");
	DatabaseManager::submitQuery("DROP TABLE IF EXISTS athena_{$i}_GalleryTable");
	DatabaseManager::submitQuery("DROP TABLE IF EXISTS athena_{$i}_GlobalParas");
	DatabaseManager::submitQuery("DROP TABLE IF EXISTS athena_{$i}_Media");
	DatabaseManager::submitQuery("DROP TABLE IF EXISTS athena_{$i}_PageParas");
	DatabaseManager::submitQuery("DROP TABLE IF EXISTS athena_{$i}_Pages");
	DatabaseManager::submitQuery("DROP TABLE IF EXISTS athena_{$i}_PageViews");
	DatabaseManager::submitQuery("DROP TABLE IF EXISTS athena_{$i}_Posts");
	DatabaseManager::submitQuery("DROP TABLE IF EXISTS athena_{$i}_Comments");
	DatabaseManager::submitQuery("DROP TABLE IF EXISTS athena_{$i}_PostTags");
	DatabaseManager::submitQuery("DROP TABLE IF EXISTS athena_{$i}_PostCategories");
	DatabaseManager::submitQuery("DROP TABLE IF EXISTS athena_{$i}_PostCategories");
	DatabaseManager::submitQuery("DROP TABLE IF EXISTS athena_{$i}_PostToTags");
	DatabaseManager::submitQuery("DROP TABLE IF EXISTS athena_{$i}_PostToCategories");
}
*/

$users = array(
	array( "email" => "mike@apollosites.com", "name" => "Mike Pritchard", "pass" => "Ally.Dog!", "user_group" => 1, "site_domain" => "athenasites.com", "site_theme" => 1 ),
	array( "email" => "mike@apollosites.com", "name" => "Mike Pritchard", "pass" => "Ally.Dog!", "user_group" => 1, "site_domain" => "pandora.athenasites.com", "site_theme" => 5 ),
	array( "email" => "mike@apollosites.com", "name" => "Mike Pritchard", "pass" => "Ally.Dog!", "user_group" => 1, "site_domain" => "callisto.athenasites.com", "site_theme" => 4 ),
	array( "email" => "charlotte@charlottegeary.com", "name" => "Mike Pritchard", "pass" => "r00bies", "user_group" => 2, "site_domain" => "cgp.athenasites.com", "site_theme" => 3 ),
	array( "email" => "hollypacionephotography@gmail.com", "name" => "Holly Pacione", "pass" => "h8lly!", "user_group" => 2, "site_domain" => "holly.athenasites.com", "site_theme" => 2 ),
	array( "email" => "mike@adastrasystems.com", "name" => "Mike Pritchard", "pass" => "Ally.Dog!", "user_group" => 2, "site_domain" => "adastra.athenasites.com", "site_theme" => 6 )
);


foreach($users as $user){
	
	Logger::debug("Creating user " . $user['name']);
	$user_id = SecurityUtils::createUser($user['email'], $user['pass'], $user['user_group'], $user['name']);
	
	Logger::debug("Creating site " . $user['site_domain']);
	$site_id = SecurityUtils::createSite($user_id, $user['site_domain'], '', $user['site_theme']);
}

?>