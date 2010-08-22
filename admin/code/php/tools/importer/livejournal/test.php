<?php

require("class-IXR.php");
require("LiveJournalHelper.class.php");

//$syncItems = LiveJournalHelper::getSyncItems();
//echo "<pre>" . print_r($syncItems, true) . "</pre>";

$comments = LiveJournalHelper::getComments();

//$eventList = LiveJournalHelper::getEvents();
//echo "<pre>" . print_r($eventList, true) . "</pre>";
?>