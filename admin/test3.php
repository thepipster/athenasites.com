<?php

require_once("code/php/setup.php");

Logger::echoLog();

$content = DatabaseManager::getVar("SELECT content from athena_1_Posts WHERE content LIKE '%<lj-cut%'"); 

//Logger::debug($content);

$new_content = ImportHelper::convertLiveJournalBreak($content);

Logger::debug($new_content);

?>