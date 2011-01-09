<?php
/**
 * Class to help sending various email messages 
 *
 * @since 8th January, 2011
 * @author Mike Pritchard (mike@apollosites.com)
 */
class EmailMessaging {

    // /////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Send a email activation email
	*/
    public static function sendEmailActivateLink($target_email, $user_name, $activation_key) {

        require_once("Swift-4.0.6/lib/swift_required.php");

        // TRANSPORT
        $transport = Swift_SmtpTransport::newInstance('smtp.gmail.com', 465, 'ssl');        
        $transport->setUsername('mike@apollosites.com');
        $transport->setPassword('Ally.Dog');

        // MAILER
        $mailer = Swift_Mailer::newInstance($transport);

        // MESSAGE
        $message = Swift_Message::newInstance();
        $message->setSubject('Email Activation');

		$link = "http://apollosites.com/admin/activateEmail.php?key=".$activation_key;
		
        $message->setBody("Hi $user_name <br />
            <br />
            You requested that we associate the email address <b>$target_email</b> with your ApolloSites account.<br />
            <br />
            To confirm, please click <a href='$link'>this</a> link to activate this email address.<br />
            <br />
            If you think this is a mistake, please ignore this email and no changes will be made to your account.</br><br />
            <br />
            Thank you!<br />
            <br />
            Mike Pritchard, President
            <br />
            ApolloSites, LLC
            <br />
            <a href='mailto:mike@apollosites.com'>mike@apollosites.com</a>
        ", 'text/html');

       //Add alternative parts with addPart()
        $message->addPart("Hi $user_name
            
            You requested that we associate the email address $target_email with your ApolloSites account.
            
            To confirm, please goto '$link' in your browser to activate this email address.
            
            If you think this is a mistake, please ignore this email and no changes will be made to your account.
            
            Thank you!
            
            Mike Pritchard, President
            
            ApolloSites, LLC
            mike@apollosites.com", 'text/plain');


        $message->setFrom(array('mike@apollosites.com' => 'Mike Pritchard | ApolloSites'));
        $message->setTo(array($target_email => $user_name));

        //Send Message
        $result = $mailer->send($message);
        
	    return $result;

    }
    
    // /////////////////////////////////////////////////////////////////////////////////
}

?>