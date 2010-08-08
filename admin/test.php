<?php

require_once("code/php/setup.php");

Logger::echoLog();

Logger::debug("Clearing tables");
DatabaseManager::submitQuery("TRUNCATE TABLE athena_Users");
DatabaseManager::submitQuery("TRUNCATE TABLE athena_UserToSite");
DatabaseManager::submitQuery("TRUNCATE TABLE athena_Sites");

Logger::debug("Creating user");

$email = "mike@apollosites.com";
$pass = "pants";
$user_group = 1;
$name = "Mike Pritchard";

$user_id = SecurityUtils::createUser($email, $pass, $user_group, $name);

Logger::debug("Creating sites");

$site_domain = 'athena.local';
$site_path = '';
$site_theme = 1;

SecurityUtils::createSite($user_id, $site_domain, $site_path, $site_theme);

$site_domain = 'callisto.athena.local';
$site_path = '';
$site_theme = 4;

SecurityUtils::createSite($user_id, $site_domain, $site_path, $site_theme);

$site_domain = 'pandora.athena.local';
$site_path = '';
$site_theme = 5;

SecurityUtils::createSite($user_id, $site_domain, $site_path, $site_theme);

$site_domain = 'cgp.athena.local';
$site_path = '';
$site_theme = 3;

SecurityUtils::createSite($user_id, $site_domain, $site_path, $site_theme);

$site_domain = 'holly.athena.local';
$site_path = '';
$site_theme = 2;

SecurityUtils::createSite($user_id, $site_domain, $site_path, $site_theme);

?>