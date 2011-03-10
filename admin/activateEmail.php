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
$data = DatabaseManager::getSingleResult($sql);

if (isset($data)){

	// If succesful, remove activation code from DB and activate the email address
	$sql = DatabaseManager::prepare("DELETE FROM  apollo_EmailActivationTable WHERE id = %d", $data['id']);
	DatabaseManager::submitQuery($sql);	
	
	// Activate email
	UserTable::updateEmail($data['user_id'], $data['email']);
}

if (!isset($data)){
?>

<h2 style='color:#d22'>Activation Failure!</h2>
<img src='/admin/images/email_activation_failure.png'/>
<p>Sorry, we could not find an activation code that matched the one you gave us? This could be because the activation code is either incorrect, 
or it has expired. If you requested to change your existing email address, please try again.
</b></p>

<?php
}
else {
?>

<?php

// Respond based on activation reason
if ($data['reason'] == 'new_account'){	

	$sql = DatabaseManager::prepare("SELECT * FROM apollo_Sites sites INNER JOIN apollo_UserToSite uts WHERE uts.user_id = %d AND sites.id = uts.site_id ORDER BY sites.id ASC LIMIT 1", $data['user_id']);			
	$site = DatabaseManager::getSingleResult($sql);				

	SitesTable::updateLive($site['domain'], 1);	
	echo "<h2>Account Activation Successful!</h2>";
	echo "<img src='/admin/images/email_activation.png'/>";
	echo "<p>Congratulations, we've activated your account!</p>";
}
else {
	echo "<h2>Email Activation Successful!</h2>";
	echo "<img src='/admin/images/email_activation.png'/>";
	echo "<p>Congratulations, we've activated your email address, <b>".$data['email']."</b></p>";
}
?>

<?php
}

// Echo footer
PageManager::$page_title = 'Admin';
require_once('themes/ApolloSites/footer.php');
?>