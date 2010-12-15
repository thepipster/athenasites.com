<?php

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
if (!SecurityUtils::checkNonce($nonce, 'email-link')) {
    Logger::error("Not authorized!");
    echo "NA";
    die();
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



// Construct email
$headers = "From: " . $client_email;
$headers = "From: $client_email\r\nX-Mailer: php";
//$replyto = $client_email;

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

foreach($user_list as $user){

    $target_email = $user['email'];
   
    Logger::debug("Target email: $target_email");

    //Logger::debug("mail($target_email, $subject, $message, $headers)");

    if (mail($target_email, $subject, $message, $headers)) {
        Logger::debug("Email sent OK!");
        // Log the request with the CRM!
        ContactRequestTable::create($site_id, $client_email, $name, $phone, $location, $datetime, $comments);      
        echo "TRUE";
    } else {
        Logger::error("Error sending email");
        echo "FALSE";
    }

}


?>