<?php

$discRoot = realpath(dirname(__FILE__)) . "/";

require_once($discRoot . "/../setup.php");

Logger::echoLog();

if (!DEV_MODE){
	Logger::fatal("Uh.. you're not authorized!");
	die();
}

$user_id = 11;
$site_id = 9;

DatabaseManager::submitQuery("DELETE FROM apollo_Users WHERE id = $user_id");
DatabaseManager::submitQuery("DELETE FROM apollo_UserToSite WHERE site_id = $site_id");
DatabaseManager::submitQuery("DELETE FROM apollo_Sites WHERE id = $site_id");

DatabaseManager::submitQuery("DROP TABLE athena_{$site_id}_Comments");
DatabaseManager::submitQuery("DROP TABLE athena_{$site_id}_Folders");
DatabaseManager::submitQuery("DROP TABLE athena_{$site_id}_GalleryMeta");
DatabaseManager::submitQuery("DROP TABLE athena_{$site_id}_GalleryTable");
DatabaseManager::submitQuery("DROP TABLE athena_{$site_id}_Media");
DatabaseManager::submitQuery("DROP TABLE athena_{$site_id}_MediaTags");
DatabaseManager::submitQuery("DROP TABLE athena_{$site_id}_MediaToTags");
DatabaseManager::submitQuery("DROP TABLE athena_{$site_id}_Pages");
DatabaseManager::submitQuery("DROP TABLE athena_{$site_id}_PostCategories");
DatabaseManager::submitQuery("DROP TABLE athena_{$site_id}_Posts");
DatabaseManager::submitQuery("DROP TABLE athena_{$site_id}_PostTags");
DatabaseManager::submitQuery("DROP TABLE athena_{$site_id}_PostToCategories");
DatabaseManager::submitQuery("DROP TABLE athena_{$site_id}_PostToTags");

DatabaseManager::submitQuery("DROP TABLE crm_{$site_id}_ContactRequest");
DatabaseManager::submitQuery("DROP TABLE crm_{$site_id}_Customers");

DatabaseManager::submitQuery("DROP TABLE stats_{$site_id}_RollupBrowser");
DatabaseManager::submitQuery("DROP TABLE stats_{$site_id}_RollupOS");
DatabaseManager::submitQuery("DROP TABLE stats_{$site_id}_RollupPageViews");

Logger::debug("Done!");
?>