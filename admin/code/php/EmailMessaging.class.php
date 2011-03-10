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

		$content_html .= "<br /><a href='http://apollosites.com' id='apollo_logo'><img src='http://apollosites.com/admin/images/logo.png' height='35px'/></a>";


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
		$post = new Post();
		$post->get($site_id, $comment['post_id']);
				
		$subject = 'Approve Comment';
		
		$key = $comment['activation_key'];
				
		$approve_link = "http://apollosites.com/admin/activateComment.php?act=approve&cid=$comment_id&sid=$site_id&key=$key";
		$spam_link = "http://apollosites.com/admin/activateComment.php?act=spam&cid=$comment_id&sid=$site_id&key=$key";
		$delete_link = "http://apollosites.com/admin/activateComment.php?act=delete&cid=$comment_id&sid=$site_id&key=$key";
		
		$site = SitesTable::getSite($site_id);
		
		$admin_link = "http://" . $site['domain'] . "/admin";
				
		$comment_content = $comment['content'];
		
				
		$from_email = 'mike@apollosites.com';
		$from_name = 'Mike Pritchard | ApolloSites';

		$users = UserTable::getUsersFromSiteID($site_id);
		
		foreach($users as $user){
		
			$to_email = $user['email'];
			$to_name = $user['name'];

			if (DEV_MODE){
				$to_email = 'mike@apollosites.com';
			}
			
	        $content_html = "Hi $to_name <br /><br />";
	        
	        $content_html .= "You've received a comment from ".$follower['name']." on your post titled &ldquo;<a href='".$post->getLink()."'><i>".$post->getTitle()."</i></a>&rdquo;<br /><br />";
	        
	        $content_html .= "&ldquo;<i>$comment_content</i>&rdquo;<br />";
	        
			if ($follower['email'] != ''){
				$content_html .= "<a href='mailto:".$follower['email']."'>".$follower['email']."</a><br/>";
			}
	        
			if ($follower['url'] != ''){
				$content_html .= "<a href='http://".urldecode($follower['url'])."'>".urldecode($follower['url'])."</a><br/>";
			}
	        	        
	        $content_html .= "<br />";
	        
	        $content_html .=  "To <b style='color:green'>approve</b> this comment, click <a href='$approve_link'>this link</a>.<br />";
	        $content_html .=  "To <b style='color:red'>delete</b> this comment, click <a href='$delete_link'>this link</a>.<br />";
	        $content_html .=  "To mark this comment as <b style='color:red'>spam</b>, click <a href='$spam_link'>this link</a>.<br />";

	        $content_html .=  "<br/>You can also manage all your comments on your <a href='$admin_link'>dashboard</a>.<br />";
	
			$content_html .= "<br /><a href='http://apollosites.com' id='apollo_logo'><img src='http://apollosites.com/admin/images/logo.png' height='35px'/></a>";

			$content_basic = "";
			
			EmailQueueTable::add($site_id, $to_email, $to_name, $from_email, $from_name, "You've got a new comment", $content_html, $content_basic);
		}
		
    }
        
    // /////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Send a email activation email
	*/
    public static function sendNewAccountEmail($site_id, $user_id, $userName, $userEmail, $site_url, $plain_password) {
    
    	Logger::debug("sendNewAccountEmail(site_id=$site_id, user_id=$user_id, userName=$userName, userEmail=$userEmail, siteURL=$site_url, password=$plain_password");

		$subject = 'Welcome to ApolloSites!';
									
		$activation_key = SecurityUtils::generateUniqueKey();
    	$date_str = date('Y-m-d H:i:s', time());
    	
		$approve_link = "http://apollosites.com/admin/activateEmail.php?key=".$activation_key;
		$sql = DatabaseManager::prepare("INSERT INTO apollo_EmailActivationTable (user_id, email, activation_key, created_date, reason) VALUES (%d, %s, %s, %s, 'new_account')", $user_id, $userEmail, $activation_key, $date_str);
		DatabaseManager::insert($sql);

		$content_html = "<h3>Thank you and welcome to ApolloSites!</h3>
		
		<h3>Account Activation</h3>
		<p>
		We need to confirm your email address before we can activate your account, please click <a href='$approve_link'>this link</a> to activate your account!	<br/>
		</p>

		<h3>Administer Your Site</h3>
		
		<p>		
			We have randomly created a password for you, we encourage you to change it as soon as you get a chance! You can change your password at anytime from your admin site by clicking the 'Account' link at the top right.
			<br/><br/>
			<b>View your site:</b> <a id='sitelink' href='$site_url' target='_blank'><span class='siteLink'>$site_url</span></a><br/>
			<b>Customize your site:</b> <a id='sitelink' href='$site_url/admin' target='_blank'><span class='siteLink'>$site_url/admin</span></a><br/>
			<b>Your username:</b> <span style='color:blue'>$userEmail</span> <br/>
			<b>Your temporary password:</b> <span style='color:blue'>$plain_password</span><br/>
		</p>
		
		<h3>Support & Help</h3>
		<p>Checkout our <a href='http://apollosites.com/support/quick-start-guide.html' target='_blank'><b>quick start guide</b></a>. You can also find more help and support on our Support pages, and email us with any questions you have at support@apollosites.com</p>

        Thank you, and welcome!<br />
        <br />
        Mike Pritchard, President
        <br />
        ApolloSites, LLC
        <br />
        <a href='mailto:mike@apollosites.com'>mike@apollosites.com</a>
        ";

		$content_html .= "<br /><a href='http://apollosites.com' id='apollo_logo'><img src='http://apollosites.com/admin/images/logo.png' height='35px'/></a>";

		$from_email = 'mike@apollosites.com';
		$from_name = 'Mike Pritchard | ApolloSites';

		EmailQueueTable::add($site_id, $userEmail, $userName, $from_email, $from_name, $subject, $content_html, '');
		
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