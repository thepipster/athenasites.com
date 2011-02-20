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

		$subject = 'Email Activation';
				
		$link = "http://apollosites.com/admin/activateEmail.php?key=".$activation_key;
		
        $content_html = "Hi $user_name <br />
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
        ";

        $content_basic = "Hi $user_name
            
            You requested that we associate the email address $target_email with your ApolloSites account.
            
            To confirm, please goto '$link' in your browser to activate this email address.
            
            If you think this is a mistake, please ignore this email and no changes will be made to your account.
            
            Thank you!
            
            Mike Pritchard, President
            
            ApolloSites, LLC
            mike@apollosites.com";


		$from_email = 'mike@apollosites.com';
		$from_name = 'Mike Pritchard | ApolloSites';

		$to_email = $target_email;
		$to_name = $user_name;
				
//		EmailQueueTable::add($site_id, $to_email, $to_name, $from_email, $from_name, $subject, $content_html, $content_basic='');
		EmailQueueTable::add(PageManager::$site_id, $to_email, $to_name, $from_email, $from_name, $subject, $content_html, $content_basic);
		
    }
    
    // /////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Send a email activation email
	*/
    public static function sendGotCommentEmail($site_id, $comment_id) {

		$comment = CommentsTable::getComment($site_id, $comment_id);
		$follower = SiteFollowersTable::getFollower($comment['site_follower_id']);
		
		$subject = 'Approve Comment';
		
		$key = '';
				
		$approve_link = "http://apollosites.com/admin/updateComment.php?act=approve&cid=$comment_id&sid=$site_id&key=$key";
		$spam_link = "http://apollosites.com/admin/updateComment.php?act=spam&cid=$comment_id&sid=$site_id&key=$key";
		$delete_link = "http://apollosites.com/admin/updateComment.php?act=delete&cid=$comment_id&sid=$site_id&key=$key";
		
		if ($follower['name'] != '' && $follower['email'] != ''){
			$follower_name = $follower['name'] . " (" . $follower['email'] . ")";
		}
		else if ($follower['name'] == '' && $follower['email'] != ''){
			$follower_name = $follower['email'];
		}
		else {
			$follower_name = 'unknown';
		}
		
		if ($follower['url'] != ''){
			$follower_name .= "&nbsp;&nbsp;" . urldecode($follower['url']);
		}
		
		$comment_content = $comment['content'];
				
        $content_html = "Hi $user_name <br />
            <br />
            You received a comment from $follower_name.<br />
            <br />
            &ldquo;<i>$comment_content</i>&rdquo;<br />
            <br />
            To <b style='color:green'>approve</b> this comment, click <a href='$approve_link'>this link</a>.<br />
            To <b style='color:red'>delete</b> this comment, click <a href='$delete_link'>this link</a>.<br />
            To mark this comment as <b style='color:red'>spam</b>, click <a href='$spam_link'>this link</a>.<br />
            <br />
            Thank you!<br />
            <br />
            Mike Pritchard, President
            <br />
            ApolloSites, LLC
            <br />
            <a href='mailto:mike@apollosites.com'>mike@apollosites.com</a>
        ";

		$content_basic = "";


		$from_email = 'mike@apollosites.com';
		$from_name = 'Mike Pritchard | ApolloSites';

		$users = UserTable::getUsersFromSiteID($site_id);
		
		foreach($users as $user){
			//$to_email = $user['email'];
			$to_email = 'mikep76@gmail.com';
			$to_name = $user['name'];
			EmailQueueTable::add($site_id, $to_email, $to_name, $from_email, $from_name, "You've got a new comment", $content_html, $content_basic);
		}
		
    }
        
    // /////////////////////////////////////////////////////////////////////////////////
    
    /**
    * Send any pending messages in the message queue...
    */
    public static function sendMessagesFromQueue() {
		    
		$email_list = EmailQueueTable::getUnsent();
		
		require_once(CODE_ROOT . "Swift-4.0.6/lib/swift_required.php");
		
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
		    
    }
}

?>