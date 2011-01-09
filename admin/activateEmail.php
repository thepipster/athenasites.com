<?php

require_once("code/php/setup.php");

PageManager::init(1);
PageManager::$page_title = 'ApolloSites | Admin';

// Echo header
require_once('themes/ApolloSites/header.php');

$key = CommandHelper::getPara('key', false, CommandHelper::$PARA_TYPE_STRING);

// SELECT *, TIME_TO_SEC(TIMEDIFF(now(), created_date)) as seconds FROM apollo_EmailActivationTable WHERE activation_key = 'cdc6f16262' AND TIME_TO_SEC(TIMEDIFF(now(), created_date)) < 6240

$valid_time_secs = 3600 * 12; // 12 hours

$sql = DatabaseManager::prepare("SELECT * FROM apollo_EmailActivationTable WHERE activation_key = %s AND TIME_TO_SEC(TIMEDIFF(now(), created_date)) < %d", $key, $valid_time_secs);
Logger::debug($sql);

$data = DatabaseManager::getSingleResult($sql);
$site = SitesTable::getSite($data['user_id']);

if (isset($data)){

	// If succesful, remove activation code from DB and activate the email address
	$sql = DatabaseManager::prepare("DELETE FROM  apollo_EmailActivationTable WHERE id = %d", $data['id']);
	DatabaseManager::submitQuery($sql);	
	
	// Activate email
	UserTable::updateEmail($data['user_id'], $data['email']);
}

if (!isset($data)){
?>

<h2 style='color:#d22'>Email Activation Failure!</h2>
<img src='/admin/images/email_activation_failure.png'/>
<p>Sorry, we could not find an activation code that matched the one you gave us? This could be because the activation code is either incorrect, 
or it has expired. If you requested to change your existing email address, please try again.
</b></p>

<?php
}
else {
?>

<h2>Email Activation Successful!</h2>
<img src='/admin/images/email_activation.png'/>
<p>Congratulations, we've activated your email address, <b><?=$data['email']?></b>, for your site <b>http://<?= $site['domain'] ?></b></p>

<?php
}

// Echo footer
PageManager::$page_title = 'Admin';
require_once('themes/ApolloSites/footer.php');
?>