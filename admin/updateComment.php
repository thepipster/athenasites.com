<?php

require_once("code/php/setup.php");

PageManager::init(1);
PageManager::$page_title = 'ApolloSites | Admin';

// Echo header
require_once('themes/ApolloSites/header.php');

$action = CommandHelper::getPara('act', false, CommandHelper::$PARA_TYPE_STRING);
$comment_id = CommandHelper::getPara('cid', false, CommandHelper::$PARA_TYPE_NUMERIC);
$site_id = CommandHelper::getPara('sid', false, CommandHelper::$PARA_TYPE_NUMERIC);
$key = CommandHelper::getPara('key', false, CommandHelper::$PARA_TYPE_STRING);

$sql = DatabaseManager::prepare("SELECT * FROM apollo_{$site_id}_Comments WHERE activation_key = %s AND id = %d", $key, $comment_id);
Logger::debug($sql);

$data = DatabaseManager::getSingleResult($sql);

$action_text = "approved";

if (isset($data)){
?>

	<h2>Comment has successfully been updated!</h2>
	<img src='/admin/images/email_activation.png'/>
	<p>Congratulations, <?= $action_text ?> this comment</b></p>

<?
}
else {
?>
	<h2 style='color:#d22'>Sorry, we could not find this comment</h2>
	<img src='/admin/images/email_activation_failure.png'/>
	<p>Sorry, we could not find an activation code that matched the one you gave us? This could be because the activation code is either incorrect, 
	or it has expired. Please contact support at support@apollosites.com for help.
	</b></p>

<?php
}

// Echo footer
PageManager::$page_title = 'Admin';
require_once('themes/ApolloSites/footer.php');
?>