<?php
/**
*
* This script is used to perform any cleanup tasks of the DB such as;
*     > Delete processed page views
*     > Delete sent emails from email queue
*/

require_once("../setup.php");

Logger::echoLog();

//
// Delete stats views..................
// 

$last_date = DatabaseManager::getVar("SELECT max(rollup_date) FROM stats_8_RollupPageViews");

// If the rollup table it empty, need to start at the earliest date in the page views table
if (!isset($last_date)) {
    $last_datetime = DatabaseManager::getVar("SELECT min(view_date) FROM stats_PageViews");
    $epoch = strtotime($last_datetime);
    $last_date = date("Y-m-d 00:00:00", $epoch);
    $no_days = ceil(TimeUtils::getElapsedDays($last_date));
} else {
    $no_days = floor(TimeUtils::getElapsedDays($last_date));
}

Logger::debug("Last Date: $last_date, which was $no_days days ago");

$query = "INSERT INTO stats_PageViewsOld (SELECT * FROM stats_PageViews WHERE view_date < '$last_date')";
DatabaseManager::submitQuery($query);

$query = "DELETE FROM stats_PageViews WHERE view_date < '$last_date'";
DatabaseManager::submitQuery($query);


// Open connection to storage database and move old data over to it
//$con = mysql_connect(database_host, database_user, database_pass);
//mysql_select_db('athenasites_store', $con);
//mysql_close($con);

?>