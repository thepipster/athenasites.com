<?php

require_once("../setup.php");

Logger::echoLog();

$user_list = DatabaseManager::getResults("SELECT * FROM apollo_Users");

foreach($user_list as $user){

	$address = $user['address'] . ", " . $user['city'] . ", " . $user['state'] . ", " . $user['post_code'] . ", " . $user['iso_country_code'];
	$user_id = $user['id'];
	
	$pos = GeoLocation::addressToLocation($address);
	
	Logger::debug("User $user_id position = ".$pos['lat'].", ".$pos['lon']." from address of $address");
	
	UserTable::updateLocation($user_id, $pos['lat'], $pos['lon']);
}


?>