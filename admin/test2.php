<?php

require_once("code/php/setup.php");

Logger::echoLog();

Logger::debug("Clearing tables");

for ($i=1; $i<=5; $i++){
	DatabaseManager::submitQuery("DROP TABLE IF EXISTS athena_{$i}_Comments");
	DatabaseManager::submitQuery("DROP TABLE IF EXISTS athena_{$i}_Posts");
	DatabaseManager::submitQuery("DROP TABLE IF EXISTS athena_{$i}_PostTags");
	DatabaseManager::submitQuery("DROP TABLE IF EXISTS athena_{$i}_PostCategories");
	DatabaseManager::submitQuery("DROP TABLE IF EXISTS athena_{$i}_PostCategories");
	DatabaseManager::submitQuery("DROP TABLE IF EXISTS athena_{$i}_PostToTags");
	DatabaseManager::submitQuery("DROP TABLE IF EXISTS athena_{$i}_PostToCategories");
}

Logger::debug("Creating user tables");

for ($i=1; $i<=5; $i++){
	CommentsTable::createTableForSite($i);
	PostsTable::createTableForSite($i);
}

?>