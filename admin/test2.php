<?php

require_once("code/php/setup.php");

Logger::echoLog();

Logger::debug("Clearing tables");

for ($i=1; $i<=5; $i++){
	DatabaseManager::submitQuery("DROP TABLE IF EXISTS athena_{$i}_Comments");
}

Logger::debug("Creating user tables");

for ($i=1; $i<=5; $i++){
	CommentsTable::createTableForSite($i);
}

?>