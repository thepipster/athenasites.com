<?php


require_once("code/php/setup.php");

Logger::echoLog();

$email = "mike@apollosites.com";
$pass = "pants";
$user_group = 1;
$name = "Mike Pritchard";
$password_hash = SecurityUtils::generatePassHash($pass);

UserTable::create($email, $name, $password_hash, $user_group)

?>