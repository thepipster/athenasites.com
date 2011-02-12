<?php

require_once("../setup.php");

Logger::echoLog();

$email_list = EmailQueueTable::getUnsent();

require_once("../Swift-4.0.6/lib/swift_required.php");

// TRANSPORT
$transport = Swift_SmtpTransport::newInstance('smtp.gmail.com', 465, 'ssl');        
$transport->setUsername('mike@apollosites.com');
$transport->setPassword('Ally.Dog');

foreach($email_list as $data){

	//Logger::dump($data);
	
	// MAILER
	$mailer = Swift_Mailer::newInstance($transport);
	
	// MESSAGE
	$message = Swift_Message::newInstance();
	$message->setSubject($data['subject']);
	
	if ($data['content_html'] != ''){
		$message->setBody($data['content_html'], 'text/html');
	}
	
	//Add alternative parts with addPart()
	if ($data['content_basic'] != ''){
		$message->addPart($data['content_basic'], 'text/plain');
	}
		
	if ($data['from_name'] != ''){
		$message->setFrom(array($data['from_email'] => $data['from_name']));
	}
	else {
		$message->setFrom($data['from_email']);
	}

	if ($data['to_name'] != ''){
		$message->setTo(array($data['to_email'] => $data['to_name']));
	}
	else {
		$message->setTo($data['to_email']);
	}
		
	//Send Message
	$result = $mailer->send($message);
	
	if ($result){
		EmailQueueTable::markSent($data['id']);
	}
	else {
		EmailQueueTable::markError($data['id']);
	}	
}

?>
