<?php

/**
* Class to abstract interface to LiveJournal API
* http://www.livejournal.com/doc/server/ljp.csp.xml-rpc.protocol.html
*
*/
class LiveJournalHelper {

	private static $username = 'charlottegeary';
	private static $password = 'r00bies';

//	private static $cmd_url = "www.livejournal.com/interface/xmlrpc HTTP/1.0";

	private static $user_agent = "XMLRPC Client 1.0";

	private static $last_sync_time = "2009-06-07 00:01:00";

	// /////////////////////////////////////////////////////////////////////////////////

	public static function setLastSyncTime($dateTime){
	}
	
	// /////////////////////////////////////////////////////////////////////////////////
		
	private static function login(){
	
		$discRoot = realpath(dirname(__FILE__));		
		
		echo "$discRoot/cookie.txt";
		
		$ch = curl_init(); 
		curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
		curl_setopt($ch, CURLOPT_COOKIEFILE, "$discRoot/cookie.txt"); //get cookie from file
		curl_setopt($ch, CURLOPT_COOKIEJAR, "$discRoot/cookie.txt");
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US; rv:1.9.0.5) Gecko/2008120122 Firefox/3.0.5');
		curl_setopt($ch, CURLOPT_URL, 'http://www.livejournal.com/');
		
		$page = curl_exec($ch);
		
		$formpos = strpos($page, 'action="http://www.livejournal.com/login.bml?ret=1"');
		$loginform = substr($page,
												$formpos,
												strpos($page, '</form>', $formpos) - $formpos + strlen('</form>'));
		
		$chalinp = "<input type='hidden' name='chal' class='lj_login_chal' id='login_chal' value='";
		$chalpos = strpos($loginform, $chalinp);
		if (intval($chalpos) == 0) {
			$chalinp = "<input type='hidden' name='chal' class='lj_login_chal' value='";
			$chalpos = strpos($loginform, $chalinp);
		}
		$loginchal = substr($loginform,
												$chalpos + strlen($chalinp),
												strpos($loginform, "' />", $chalpos) - $chalpos - strlen($chalinp));
		
		$user = self::$username;
		$pass = self::$password;
		$hpass = md5($pass);		
		$login_response = md5($loginchal.$pass);
		
		curl_setopt($ch, CURLOPT_URL, 'http://www.livejournal.com/login.bml?ret=1');
		curl_setopt($ch, CURLOPT_POST, 1);
		//curl_setopt($ch, CURLOPT_POSTFIELDS, 'mode=login&chal='.$loginchal.'&response='.$login_response.'&user='.$user.'&password=&_submit=Login');
		curl_setopt($ch, CURLOPT_POSTFIELDS, "mode=login&user=$user&hpassword=$hpass");
		
		$page = curl_exec($ch);
		//echo $page;
		
		// Get comment meta data........
						
		curl_setopt($ch, CURLOPT_URL, "http://www.livejournal.com/export_comments.bml?get=comment_meta&startid=0");
		curl_setopt($ch, CURLOPT_POST, 1);
		//curl_setopt($ch, CURLOPT_POSTFIELDS, "user=$user&hpassword=$hpass");
		$comments_meta = curl_exec($ch);
		
		file_put_contents("comments_meta.xml", $comments_meta);
		//	error_log(print_r($page, true));	
		
		// Get comment body......

		curl_setopt($ch, CURLOPT_URL, "http://www.livejournal.com/export_comments.bml?get=comment_body&startid=0");
		curl_setopt($ch, CURLOPT_POST, 1);
		//curl_setopt($ch, CURLOPT_POSTFIELDS, "user=$user&hpassword=$hpass");
		$comments = curl_exec($ch);
		
		file_put_contents("comments.xml", $comments);
		
		
		curl_close($ch);
			
	}
	
	private static function getCommentMeta(){
	
	}
	
	// /////////////////////////////////////////////////////////////////////////////////

	public static function getComments(){

		self::login();
	/*
		$client = new IXR_Client('www.livejournal.com', '/interface/xmlrpc');

		$args = array(
			'username' => self::$username,
			'hpassword' => md5(self::$password),
			'ver' => 1,
			'expiration' => 'long',
			'ipfixed' => 1
		);
		
		if (!$client->query('LJ.XMLRPC.sessiongenerate', $args)) {
			error_log('Something went wrong - '.$client->getErrorCode().' : '.$client->getErrorMessage());
			die();
		}
		
		$response = $client->getResponse();
		
		echo "<pre>".print_r($response, true)."</pre>";
		
		// [ljsession] => v1:u6858651:s618:asP3ZsvEX6D//Thanks+for+signing+in+/+LiveJournal+loves+you+a+lot+/+Here+have+a+cookie
		// .livejournal.com	TRUE	/	FALSE	1249784575	ljuniq	oj5jaSIZ7Fq03oF:1244600575:pgstats0:m0

		$discRoot = realpath(dirname(__FILE__));		
		$cookieStr = $response['ljsession'];
		$cookieFile = "$discRoot/cookie.txt";
		file_put_contents($cookieFile, $cookieStr);		

		*/
		/*
		$discRoot = realpath(dirname(__FILE__));		
		$cookieFile = "$discRoot/cookie.txt";

		//return $response;
		$user = self::$username;
		$pass = md5(self::$password);		
		

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, ' http://www.livejournal.com/interface/flat');
		curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US; rv:1.9.0.5) Gecko/2008120122 Firefox/3.0.5');
		curl_setopt($ch, CURLOPT_COOKIEFILE, $cookieFile); //get cookie from file
		curl_setopt($ch, CURLOPT_COOKIEJAR, $cookieFile);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
		curl_setopt($ch, CURLOPT_POST, 1);
		//curl_setopt($ch, CURLOPT_HTTPHEADER, Array("Content-Type:application/x-www-form-urlencoded", "Content-length", "34"));
//		curl_setopt($ch, CURLOPT_POSTFIELDS, "mode=login&user=$user&hpassword=$pass");
		curl_setopt($ch, CURLOPT_POSTFIELDS, "mode=login&user=$user&hpassword=$pass");
		
		$result = curl_exec($ch);
		var_dump($result);

		//curl_setopt($ch, CURLOPT_URL, 'http://www.livejournal.com/export_comments.bml?get=comment_meta&startid=0');
		//$page = curl_exec($ch);
		//echo $page;
		*/
	/*
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, 'http://www.livejournal.com/export_comments.bml');
		curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US; rv:1.9.0.5) Gecko/2008120122 Firefox/3.0.5');
		curl_setopt($ch, CURLOPT_COOKIEFILE, $cookieFile); //get cookie from file
		curl_setopt($ch, CURLOPT_COOKIEJAR, $cookieFile);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, "get=comment_meta&startid=0");
		
		$xmlData = curl_exec($ch);
		curl_close($ch);
		
		echo $xmlData;	
	*/
		
	}
	
	// /////////////////////////////////////////////////////////////////////////////////

	public static function test(){

	}

	// /////////////////////////////////////////////////////////////////////////////////
	
	
	/**
	* Returns a list of all the items that have been created or updated for a user. 
	*/
	public static function getSyncItems(){

		
		$client = new IXR_Client('www.livejournal.com', '/interface/xmlrpc');

		$args = array(
			'username' => self::$username,
			'hpassword' => md5(self::$password),
			'ver' => 1,
			'lastsync' => self::$last_sync_time
		);
		
		if (!$client->query('LJ.XMLRPC.syncitems', $args)) {
			error_log('Something went wrong - '.$client->getErrorCode().' : '.$client->getErrorMessage());
			die();
		}
		
		$response = $client->getResponse();
		
		//echo "<pre>".print_r($response, true)."</pre>";
		return $response;
		
	}
	
	// /////////////////////////////////////////////////////////////////////////////////
			
	/**
	* Returns a list of all the items that have been created or updated for a user. 
	*/
	public static function getEvents(){
		
		$client = new IXR_Client('www.livejournal.com', '/interface/xmlrpc');

		$args = array(
			'username' => self::$username,
			'hpassword' => md5(self::$password),
			'ver' => 1,
			'truncate' => 0,
			'selecttype' => 'syncitems',
			'lastsync' => self::$last_sync_time,
			'noprops' => false,
			'lineendings' => 'unix'
		);


/*
		$args = array(
			'username' => self::$username,
			'hpassword' => md5(self::$password),
			'ver' => 1,
			'truncate' => 0,
			'selecttype' => 'lastn',
			'howmany' => 10,
			'noprops' => false,
			'lineendings' => 'unix'
		);
*/		
		if (!$client->query('LJ.XMLRPC.getevents', $args)) {
			error_log('Something went wrong - '.$client->getErrorCode().' : '.$client->getErrorMessage());
			die();
		}
		
		$response = $client->getResponse();
		
		//echo "<pre>".print_r($response, true)."</pre>";
		return $response;

	}

}
?>