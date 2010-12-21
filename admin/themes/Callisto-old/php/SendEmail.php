<?php

error_log("Entering sendmail");
		
	
// Figure out the location of this file
$discRoot = realpath(dirname(__FILE__)) . "/";

$codeRoot = substr($discRoot, 0, strpos($discRoot, "php")) . "php/";
$wpRoot = substr($discRoot, 0, strpos($discRoot, "wp-content"));

require_once($wpRoot . 'wp-blog-header.php');

// Get the users email.....
$page_id = $wpdb->escape(getPara('page_id'));
$nonce = getPara('nonce');

error_log($nonce);

// Verify this request came from a real page
if ( !wp_verify_nonce( $nonce, 'contact_page' )) {
	error_log("Not authorized!");
	echo "NA";
	die();
}


$sql = $wpdb->prepare("SELECT pp.*, tp.para_type FROM apollo_PageParas pp INNER JOIN apollo_ThemeParas tp WHERE pp.page_post_id = %d AND pp.theme_para_id = tp.id",  $page_id ); 		
$data_list = $wpdb->get_results($sql, ARRAY_A);

$target_email = '';

foreach($data_list as $data){
	if ($data['para_type'] == 'email'){
		$target_email = $data['para_value'];				
	}
}


$name = getPara('name');
$client_email = getPara('email');
$phone = getPara('phone');
$location = getPara('location');
$datatime = getPara('datetime');
$comments = getPara('comments');

if ($client_email){
		
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
	$message .= "Comments: $comments\n";
	    	
	error_log("mail($target_email, $subject, $message, $headers)");    	
	
	

	if (mail($target_email, $subject, $message, $headers)){
		error_log("Email sent OK!");
		echo "TRUE";
	}
	else {
		error_log("Error sending email");
		echo "FALSE";
	}
	
/*	
	if ($email != ''){
//		$res = mail($target_email, $subject, $message, $headers);	
//		$res = mail($target_email, $subject, $message);	
		$res = mail('mikep76@gmail.com', 'test mail', 'test');	
	}    
	
	if ($res){
		error_log("Mail sent to $target_email!");
		echo "TRUE";
	}
	else {
		error_log("Error sending mail to $target_email!");
		echo "FALSE";
	}
	*/
	// Integrate with akismet
	// http://linuslin.com/2007/08/23/how-to-make-anti-spam-contact-form-with-akismet/		
}

function getPara($paraName){
	
	$val = false;

	if(isset($_GET[$paraName])) {
	    $val = $_GET[$paraName];
	}
	else if(isset($_POST[$paraName])) {
	    $val = $_POST[$paraName];
	}
	return $val;	
}


?>