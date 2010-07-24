<?php
/**
* Process ajax requests sent from the SimpleScrum JS front end
*
* Author: Mike Pritchard
* Date: 15th November, 2008
*/

require_once("setup.php");

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
		getStats(); 
		break;			

	case "checkValid":
		checkValid(); 
		break;			
		
	// Check username and password	
	case "checkUser":
		$email = CommandHelper::getPara('e54232', true, CommandHelper::$PARA_TYPE_STRING);
		$pass = CommandHelper::getPara('p54232', true, CommandHelper::$PARA_TYPE_STRING);
		checkUser($email, $pass); 
		break;			

	// Create username and password	
	/*
	case "createUser":
		$email = CommandHelper::getPara('e54232', true, CommandHelper::$PARA_TYPE_STRING);
		$pass = CommandHelper::getPara('p54232', true, CommandHelper::$PARA_TYPE_STRING);
		$firstname = CommandHelper::getPara('fn', true, CommandHelper::$PARA_TYPE_STRING);
		$lastname = CommandHelper::getPara('ln', true, CommandHelper::$PARA_TYPE_STRING);
		$company = CommandHelper::getPara('cm', true, CommandHelper::$PARA_TYPE_STRING);
		createUser($email, $pass, $firstname, $lastname, $company); 
		break;	
	*/		

    // Get all the data
	case "loadAll":
		loadAll();
		break;


	default :
		CommandHelper::sendErrorMessage("Undefined command '$cmd'");
		
}

// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////

function getStats(){
	
//	$query = "SELECT COUNT(id) AS no FROM athena_Sites UNION SELECT COUNT(id) FROM athena_Users UNION SELECT COUNT(id) FROM athena_Pages UNION SELECT COUNT(id) FROM athena_Posts";					

	$no_users = DatabaseManager::getVar("SELECT COUNT(id) AS no FROM athena_Sites");					
	$no_sites = DatabaseManager::getVar("SELECT COUNT(id) AS no FROM athena_Sites");					
	$no_pages = DatabaseManager::getVar("SELECT COUNT(id) AS no FROM athena_Sites");					
	$no_posts = DatabaseManager::getVar("SELECT COUNT(id) AS no FROM athena_Sites");					
	
	$msg = '{"result":"true", "us": "'.$no_users.'", "si": "'.$no_sites.'", "pg": "'.$no_pages.'", "po": "'.$no_posts.'"}';
		
	CommandHelper::sendTextMessage($msg);	
	
}

// ///////////////////////////////////////////////////////////////////////////////////////

function loadAll(){

}

// //// ///////////////////////////////////////////////////////////////////////////////////////

/**
* Called after a user has logged in, to check if the the session is valid
*/
function logOut(){
	Session::clear("username"); // Clear the username in the session
	Session::clear("userid"); // Clear the userid in the session
}

// ///////////////////////////////////////////////////////////////////////////////////////

/**
* Called after a user has logged in, to check if the the session is valid
*/
function checkValid(){

	$username = Session::get("username");
	$user_id = Session::get("userid");
	
	if (!$username || !$user_id){
		$msg = '{"result":"false", "msg": "Invalid session"}';
	}
	else {
		$msg = '{"result":"true", "msg": "Valid session"}';
	}	
	
	CommandHelper::sendTextMessage($msg);	
				
}

// ///////////////////////////////////////////////////////////////////////////////////////

function checkUser($email, $sha1_pass){

	Logger::debug("checkUser($email, $sha1_pass)");
	
	$sql = DatabaseManager::prepare("SELECT id FROM athena_Users WHERE email = %s AND password_hash = %s", $email, $sha1_pass);
	$id = DatabaseManager::getVar($sql);

    $target_date  = mktime(date("H"), date("i"), date("s"), date("m")  , date("d"), date("Y"));
    $date_str = date('Y-m-d H:i:s', $target_date);
	
	// If no results, then the table is empty...		
	if(!$id) {
		Session::clear("username"); // Clear the username in the session
		Session::clear("userid"); // Clear the userid in the session
		$msg = '{"result":"false", "msg": "Bad Username/password"}';
	}
	else {
	
		$sql = DatabaseManager::prepare("UPDATE athena_Users SET last_login = %s WHERE id = %d", $date_str, $id);
		DatabaseManager::submitQuery($sql);
		Session::set("username", $email); // Store username in session, used for validation
		Session::set("userid", $id); // Store username in session, used for validation
		$msg = '{"result":"true", "msg": "OK!"}';
	}	

	CommandHelper::sendTextMessage($msg);	
	
}

?>