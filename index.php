<?php

require_once("code/php/setup.php");

Logger::echoLog();

$domain = strtolower($_SERVER['HTTP_HOST']);
$page = substr(strtolower($_SERVER['REQUEST_URI']),1);

$domain = str_replace('www.','',$domain);

Logger::debug("Domain: $domain");
Logger::debug("Page: $page");

$site_id = SitesTable::getSiteIDFromDomain($domain);

if ($site_id){
	Logger::debug("Site ID: $site_id");
}
else {
	Logger::error("Domain does not exist!");
}


// Redirect to correct site!
//header("Location: athena.html");

?>