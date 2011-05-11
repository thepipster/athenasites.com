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
	case "login":
		$email = CommandHelper::getPara('em', true, CommandHelper::$PARA_TYPE_STRING);
		$pass = CommandHelper::getPara('ps', true, CommandHelper::$PARA_TYPE_STRING);
		login($email, $pass); 
		break;			

	// Check username is available	
	case "checkUser":
		$username = CommandHelper::getPara('us', true, CommandHelper::$PARA_TYPE_STRING);
		checkUser($username); 
		break;			

	case "logEulaAgreement":
		$username = CommandHelper::getPara('us', true, CommandHelper::$PARA_TYPE_STRING);
		$email = CommandHelper::getPara('em', true, CommandHelper::$PARA_TYPE_STRING);
		logEulaAgreement($username, $email); 
		break;			
		
	// Create username and password	
	case "createUser":
		$email = CommandHelper::getPara('em', true, CommandHelper::$PARA_TYPE_STRING);
		$name = CommandHelper::getPara('nm', true, CommandHelper::$PARA_TYPE_STRING);
		$username = CommandHelper::getPara('us', true, CommandHelper::$PARA_TYPE_STRING);
		$theme_id = CommandHelper::getPara('tid', true, CommandHelper::$PARA_TYPE_NUMERIC);
		$nonce = CommandHelper::getPara('nonce', true, CommandHelper::$PARA_TYPE_STRING);
		$coupon = CommandHelper::getPara('cp', false, CommandHelper::$PARA_TYPE_STRING);
		if (!isset($coupon)) $coupon = '';
		createUser($email, $name, $username, $theme_id, $nonce, $coupon); 
		break;	

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

// ///////////////////////////////////////////////////////////////////////////////////////

function createUser($email, $name, $username, $theme_id, $nonce, $coupon){
	
	Logger::debug("createUser($email, $name, $username, $theme_id, $nonce, $coupon)");
	
	$msg['cmd'] = 'createUser';
	
	if (!SecurityUtils::checkNonce($nonce, 'create-user')) {
	    Logger::error("Not authorized! NONCE failure. [createUser($email, $name, $username, $theme_id)]");
		$msg['result'] = 'fail';			
	}
	else {
				
		$theme = ThemeTable::getTheme($theme_id);
		
		$plain_password = SecurityUtils::generateRandomPassword();
		
		$user_group = 2; // 1 = Admin, 2 = Normal
		$user_id = SecurityUtils::createUser($email, $plain_password, $user_group, $name, $coupon);
				
		$site_domain = $username . ".apollosites.com";
		$site_path = '';
		
		$site_id = SecurityUtils::createSite($user_id, $site_domain, $site_path, $theme_id);
		
		//
		// Create some basic pages
		//
	
		// TODO: clone from the demo site?
		// Get the demo site for this theme
		//$site_id = $theme['demo_url'];
	
		$template_list = TemplateManager::getThemePageTemplates($theme['theme_name']);
		
		// Fake Content
		$safe_content = "
			<h2>Lorem ipsum</h2>
			
			<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin pellentesque, est ut venenatis aliquam, lorem quam porttitor ligula, eget ultrices velit dui sed quam. Praesent vehicula placerat lectus. Nulla pede. Quisque a nulla quis massa pulvinar sagittis. Pellentesque neque massa, mattis vulputate, pellentesque nec, vehicula volutpat, purus. Proin pretium dui et nulla cursus eleifend. Aenean aliquam urna eget urna. Vestibulum euismod elit. Donec eget augue sit amet neque elementum pretium. Proin posuere lacus id lacus. Duis vel justo suscipit neque ornare iaculis.</p>
	
			<p>Ut urna urna, rhoncus eget, vestibulum tempus, venenatis non, nunc. Nunc consequat quam in nulla. Praesent feugiat posuere orci. Sed ac ante. Mauris pellentesque massa vitae ante mattis bibendum. Quisque dapibus lectus eu eros. Nulla facilisi. Praesent hendrerit egestas erat. Suspendisse at velit. Quisque mollis feugiat est. Curabitur ut leo. Cras auctor semper augue. Pellentesque leo pede, tempus sed, ornare in, venenatis sed, nisl. Quisque est velit, eleifend vitae, mollis ac, adipiscing at, eros. Mauris velit. Etiam nec lorem. Vestibulum pellentesque ligula a velit. Maecenas felis metus, suscipit et, eleifend vel, accumsan vitae, magna. Phasellus ut justo vel magna congue laoreet.</p>
	
			<p>Sed vel nisl. Vivamus pretium est non mauris. Fusce condimentum. Proin molestie. Vestibulum est. Morbi at metus. Nam nisl nulla, euismod at, vehicula nec, molestie vitae, enim. Donec euismod nulla a metus. Suspendisse venenatis metus dapibus dolor. Quisque euismod libero a est. Aliquam feugiat.</p>
		";
					
		// Add a home and blog page...
					
		foreach($template_list as $template){
		
			if ($template['is_homepage'] == 1){
			    PagesTable::create($user_id, $site_id, 0, $safe_content, "Published", "Home", $template['template_file'], Page::encodeSlug("Home"), "", 1, 1, 0);
			}
			else if ($template['is_blogpage'] == 1){
			    PagesTable::create($user_id, $site_id, 0, '', "Published", "Blog", $template['template_file'], Page::encodeSlug("Blog"), "", 2, 0, 1);
			}
			
		}
		
		// Add a single hello world blog post!	
		$content = "Hello World! This is my first post";
		$title = "My first post";
	    PostsTable::create($site_id, $user_id, StringUtils::makeHtmlSafe($content), 'Published', StringUtils::makeHtmlSafe($title), 1, Post::encodeSlug($title), 'apollo');

		$msg['result'] = 'ok';			

		// Send welcome email	
		$site_url = 'http://' . $site_domain;
		EmailMessaging::sendNewAccountEmail($site_id, $user_id, $name, $email, $site_url, $plain_password);
		
	}
	
	//
	// Message that we are complete
	//				
	CommandHelper::sendMessage($msg);		
	
} 

// ///////////////////////////////////////////////////////////////////////////////////////

function logEulaAgreement($username, $email){

    $date_str = date('Y-m-d H:i:s', time());

	$sql = DatabaseManager::prepare("INSERT INTO log_EulaAgreement (username, email, agree_time) VALUES (%s, %s, %s)", $username, $email, $date_str);
	$id = DatabaseManager::insert($sql);

	$msg['cmd'] = 'logEulaAgreement';
	if (isset($id)){
		$msg['result'] = 'ok';			
	}
	else {
		$msg['result'] = 'fail';			
	}
					
	CommandHelper::sendMessage($msg);		
	
}

// ///////////////////////////////////////////////////////////////////////////////////////

/**
* Called after a user has logged in, to check if the the session is valid
*/
function logOut(){
	// Clear user session
	SecurityUtils::logOut();
}


// ///////////////////////////////////////////////////////////////////////////////////////

/**
* Check to see if the given user exists
*/
function checkUser($username){

	$msg['cmd'] = 'checkUser';
	$msg['result'] = 'ok';			
	$msg['data'] = 'false';

	if (DEV_MODE){
		$sql = DatabaseManager::prepare("SELECT id FROM apollo_Sites WHERE domain = %s", ($username . '.apollo.local'));
	}
	else {
		$sql = DatabaseManager::prepare("SELECT id FROM apollo_Sites WHERE domain = %s", ($username . '.apollosites.com'));
	}			
	$id = DatabaseManager::getVar($sql);
	
	if ($id){
		$msg['data'] = 'true';		
	}
	else {
		$msg['data'] = 'false';
	}
						
	CommandHelper::sendMessage($msg);		
	
}

// ///////////////////////////////////////////////////////////////////////////////////////

/**
* Check a users credentials, log them in if they are correct
*/
function login($email, $plain_password){


	$msg['cmd'] = 'login';
	$msg['result'] = 'ok';			
	$msg['data'] = 'false';
			
	$db_pass = UserTable::getPasswordFromEmail($email);			
	$password_hash = SecurityUtils::generatePassHash($plain_password, $db_pass);
			
	$user_id = UserTable::checkValid($email, $password_hash);
			
	//Logger::debug("DB Password: $db_pass");
	//Logger::debug("Email: $email Pass (hash): $password_hash Pass (plain): $plain_password");
				
	if ($user_id){
		Logger::debug("Logged in!");
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