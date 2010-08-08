<?php

require_once("admin/code/php/setup.php");

Logger::echoLog();

echo "Custom 404 page! Requsting [" . $_SERVER['REDIRECT_URL'] . "]";


//Logger::dump($_SERVER);

// Redirect to correct site!
//header("Location: index.php");


?>