<?php
/**
* Process ajax requests sent from the Athena front end
*
* Author: Mike Pritchard
* Date: 27th July, 2010
*/
require_once("../setup.php");

Logger::debug(">>>> ");

$cmd = CommandHelper::getPara('cmd', true, CommandHelper::$PARA_TYPE_STRING);

Logger::debug("Command = " . $cmd);

/*
Commands;

1 : Check for a valid user
2 : Check user credentials
3 : Create user
4 : Create task
5 : Create project
6 : Create sprint

*/

// Get the command type, and process
switch($cmd){

	case "logOut":
		logOut(); 
		break;			

	case "getStats":
		getSystemStats(); 
		break;			
		
	// Check username and password	
	case "checkUser":
		$email = CommandHelper::getPara('em', true, CommandHelper::$PARA_TYPE_STRING);
		$pass = CommandHelper::getPara('ps', true, CommandHelper::$PARA_TYPE_STRING);
		login($email, $pass); 
		break;			

	// Create username and password	
	/*
	case "createUser":
		$email = CommandHelper::getPara('em', true, CommandHelper::$PARA_TYPE_STRING);
		$pass = CommandHelper::getPara('ps', true, CommandHelper::$PARA_TYPE_STRING);
		$name = CommandHelper::getPara('nm', true, CommandHelper::$PARA_TYPE_STRING);
		createUser($email, $pass, $name); 
		break;	
	*/

	default :
		CommandHelper::sendErrorMessage("Undefined command '$cmd'");
		
}

// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////

function getSystemStats(){
	
//	$query = "SELECT COUNT(id) AS no FROM apollo_Sites UNION SELECT COUNT(id) FROM apollo_Users UNION SELECT COUNT(id) FROM athena_Pages UNION SELECT COUNT(id) FROM athena_Posts";					

	$data = array(4);
	
	$data['no_users'] = UserTable::getNumberUsers();					
	$data['no_sites'] = SitesTable::getNumberSites();					
	$data['no_pageviews'] = StatsRollupTables::getGlobalNumberPageViews();					
	
	
	$msg['cmd'] = 'getStats';
	$msg['result'] = 'ok';			
	$msg['data'] = $data;
				
	CommandHelper::sendMessage($msg);		
	
}

// //// ///////////////////////////////////////////////////////////////////////////////////////

/**
* Called after a user has logged in, to check if the the session is valid
*/
function logOut(){
	// Clear user session
	SecurityUtils::logOut();
}


// ///////////////////////////////////////////////////////////////////////////////////////

/**
* Check a users credentials, log them in if they are correct
*/
function login($email, $plain_password){


	$msg['cmd'] = 'checkUser';
	$msg['result'] = 'ok';			
	$msg['data'] = 'false';
			
	$db_pass = UserTable::getPasswordFromEmail($email);			
	$password_hash = SecurityUtils::generatePassHash($plain_password, $db_pass);
			
	$user_id = UserTable::checkValid($email, $password_hash);
			
	//Logger::debug("Email: $email Pass: $plain_password");
				
	if ($user_id){
		$msg['data'] = 'true';		
		// Setup user session
		$user = UserTable::getUser($user_id);
		SecurityUtils::logIn($user_id, $user['user_level'], $user['name'], $user['email']);
		// Update the last login
		UserTable::updateLastLogin($user_id);
	}
	else {
		// Clear user session
		SecurityUtils::logOut();
	}
						
	CommandHelper::sendMessage($msg);		
	
}

?>