<?php

$DEBUG = 0;

// Figure out the location of this file
$discRoot = realpath(dirname(__FILE__)) . "/";
$codeRoot = substr($discRoot, 0, strpos($discRoot, "themes")) . '/code/php/';
$themeRoot = substr($discRoot, 0, strpos($discRoot, "php"));

require_once($codeRoot . 'setup.php');

// Get the users email.....

$page_id = CommandHelper::getPara('page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
$site_id = CommandHelper::getPara('site_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
$nonce = CommandHelper::getPara('nonce', true, CommandHelper::$PARA_TYPE_STRING);

// Verify this request came from a real page
if ($DEBUG == 0){
	if (!SecurityUtils::checkNonce($nonce, 'email-link')) {
	    Logger::error("Not authorized!");
	    echo "NA";
	    die();
	}
}

// Get the form paras....
$name = CommandHelper::getPara('name', false, CommandHelper::$PARA_TYPE_STRING);
$client_email = CommandHelper::getPara('email', false, CommandHelper::$PARA_TYPE_STRING);
$phone = CommandHelper::getPara('phone', false, CommandHelper::$PARA_TYPE_STRING);
$location = CommandHelper::getPara('location', false, CommandHelper::$PARA_TYPE_STRING);
$datetime = CommandHelper::getPara('datetime', false, CommandHelper::$PARA_TYPE_STRING);
$comments = CommandHelper::getPara('comments', false, CommandHelper::$PARA_TYPE_STRING);

// Check to see if the content is spam!
$blogURL = PageManager::getPageLink($page_id);

$author_ip = PageViewsTable::getRealIPAddr();
$author_url = '';

if ($DEBUG == 0){

	$akismet = new Akismet($blogURL , AKISMET_API_KEY);
	$akismet->setCommentAuthor($name);
	$akismet->setCommentAuthorEmail($client_email);
	$akismet->setCommentAuthorURL($author_url);
	$akismet->setCommentContent($comments);
	
	// Check from akismet..
	if($akismet->isCommentSpam()){
	    Logger::error("Caught some spam!");
	    echo "SPAM";
	    die();
	}

	//
	// Check to see if this is possible spam or not?
	//
	
	// Innocent until proven guilty...
	$status = 'Pending';
	$isSpam = false;
	
	// Check from akismet..
	if($akismet->isCommentSpam()){
	    $status = 'Spam';
	    $isSpam = true;
	}

}


$subject = "Customer Request";

$message = "Message from contact form;\n";
$message .= "\n";
$message .= "Phone: $phone\n";
$message .= "\n";
$message .= "Location: $location\n";
$message .= "\n";
$message .= "Date: $datetime\n";
$message .= "\n";

$comments = stripslashes($comments);
$message .= "Comments: ". $comments . "\n";


// Get the owner id(s)for this site
$user_list = UserTable::getUsersFromSiteID($site_id);

// Send email (Email includes breaks Apollo setup, so do last)
foreach($user_list as $user){


	$message_html = "Hi " . $user['name'] . "<br/><br/>";
	$message_html = "You have received an inquiry from $name, using your website's contact form;<br/>";
	$message_html .= "<br/>";
	
	if (isset($phone) && $phone != ''){
		$message_html .= "Their phone number is: <b>$phone</b><br/>";
	}
	if (isset($location) && $location != ''){
		$message_html .= "They are interested in the following location: <b>$location</b><br/>";
	}
	if (isset($datetime) && $datetime != ''){
		$message_html .= "And they are interested in the following date: <b>$datetime</b><br/>";
	}
	if (isset($comments) && $comments != ''){
		$message_html .= "They also add the following comment: <br/><b>" . stripslashes($comments) . "</b><br/><br/>";
	}
	
	//$message_html .= "This request has been logged in our CRM, so you can access this message later.<br/><br/>";
	$message_html .= "Good luck with this lead!<br/><br/>";
	$message_html .= "<a href='http://apollosites.com' id='apollo_logo'><img src='http://apollosites.com/admin/images/logo.png' height='35px'/></a>";

    $target_email = $user['email'];
 
	EmailQueueTable::add($site_id, 'mikep76@gmail.com', $user['name'], $client_email, $name, $subject, $message_html, $message);
/*
 	if ($DEBUG == 0){
		EmailQueueTable::add($site_id, $user['email'], $user['name'], $client_email, $name, $subject, $message, $message);
 	}
 	else {
		EmailQueueTable::add($site_id, 'mikep76@gmail.com', $user['name'], $client_email, $name, $subject, $message_html, $message);
 	}
*/
    echo "TRUE";
    
    // Log the request with the CRM!
    ContactRequestTable::create($site_id, $client_email, $name, $phone, $location, $datetime, $comments);      

}


?>