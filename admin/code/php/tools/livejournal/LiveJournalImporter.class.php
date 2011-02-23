<?php
/**
* Class to abstract interface to LiveJournal API and importing comments and posts from LJ
*
* http://www.livejournal.com/doc/server/ljp.csp.xml-rpc.protocol.html
*
* @since 6th Septmeber, 2010
* @author Mike Pritchard, mike@apollosites.com
*/
class LiveJournalImporter {

	private static $username = '';
	private static $password = '';

	/** Need to give LJ our info, if we get blocked contact LJ at <webmaster@livejournal.com> */ 
	private static $useragent = "ApolloBot/1.0 (http://apollosites.com/support.html; <support@apollosites.com>; en-US)";
	
	private static $last_sync_time = "2009-06-07 00:01:00";

	private static $ljCookie = '';
	
	public static $errorCode = 0;
	public static $errorMessage = '';
	
	//private static $comment_meta = null;
	//private static $comments = null;
	private static $user_list = null;
	private static $max_comment_id = -1;
		
	// /////////////////////////////////////////////////////////////////////////////////

	public static function import($user_id, $site_id, $lj_user, $lj_pass){

		self::$password = $lj_pass;
		self::$username = $lj_user;
		
		// Get auth cookie
		self::$ljCookie = self::getCookie();

		if (self::$errorCode != 0) return;
			
		// Get the posts since the last sync
		self::getSyncItems($site_id);
		self::getEvents($user_id, $site_id);
				
		// Get the comments since the last sync		
		if (self::$errorCode != 0) return;

		self::getCommentMeta($site_id);
		self::getComments($site_id);
				
		LogImport::create($site_id, $user_id, 'Livejournal');					
	}
				
	// /////////////////////////////////////////////////////////////////////////////////

	public static function setLastSyncTime($site_id){
		self::$last_sync_time = LogImport::getLastImport($site_id, 'Livejournal');
		if (!isset(self::$last_sync_time)) self::$last_sync_time = "2011-01-01 00:00:01";
	}
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Login to LJ, doesn't seem to be needed though
	*/
	private static function login(){
		$client = new IXR_Client('www.livejournal.com', '/interface/xmlrpc', self::$useragent);

		$args = array(
			'username' => self::$username,
			'hpassword' => md5(self::$password),
			'ver' => 1
		);
		
		if (!$client->query('LJ.XMLRPC.login', $args)) {
			Logger::error('Something went wrong - '.$client->getErrorCode().' : '.$client->getErrorMessage());
			self::$errorMessage = $client->getErrorMessage();
			self::$errorCode = $client->getErrorCode();
			return;
		}		
		
		$response = $client->getResponse();
	}

	// /////////////////////////////////////////////////////////////////////////////////

	/**
	* Get the LJ session id 
	*/
	private static function getCookie(){
		
		$client = new IXR_Client('www.livejournal.com', '/interface/xmlrpc', self::$useragent);

		$args = array(
			'username' => self::$username,
			'hpassword' => md5(self::$password),
			'ver' => 1,
			'ipfixed' => 1,
			'expiration' => 'short'
		);
				
		if (!$client->query('LJ.XMLRPC.sessiongenerate', $args)) {
			Logger::error('Something went wrong - '.$client->getErrorCode().' : '.$client->getErrorMessage());
			self::$errorMessage = $client->getErrorMessage();
			self::$errorCode = $client->getErrorCode();
			return;
		}
		
		$response = $client->getResponse();
		$cookie = "ljsession=".$response['ljsession'];
		
		return $cookie;	
	}
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Download and parse the comment meta from LJ. Comments are returned as XML in the following form;
	* 
	* <?xml version="1.0" encoding='utf-8'?>
	* <livejournal>
	*     <maxid>16832</maxid>
	*     <nextid>10000</nextid>
	*     <comments>
	*         <comment id='6712' posterid='37147' />
	*         <comment id='8563' />
	*     </comments>
	*     <usermaps>
	*         <usermap id='3927943' user='webber0075' />
	*         <usermap id='3157975' user='p0isonedheart' />
	*     </usermaps>
	* </livejournal>
	*/
	private static function getCommentMeta($site_id){

		$next_id = CommentsTable::getLastCommentSourceID($site_id, 'LiveJournal');
		if (!isset($next_id)) $next_id = 0;
		
		$numitems = 10000;			
		$isMore = true;

		$comment_meta = array();
		self::$user_list = array();
		
		Logger::debug(">>> Getting comment meta with next_id = $next_id");
		
		// Loop until we have all the comments			
	    while ($isMore) {
	        
	        $content = self::doFetchComments('comment_meta', $next_id, $numitems);
	        	        
	        // now we want to XML parse this
			//$root = new SimpleXMLElement($content);		        
			
			$doc = new DOMDocument();
			$doc->loadXML($content);

			$node = $doc->getElementsByTagName('maxid')->item(0);
			$max_id = $node->textContent;

			$node = $doc->getElementsByTagName('nextid')->item(0);
			$next_id = $node->textContent;
			
			if (isset($next_id) && ($next_id < $max_id)) {
				$isMore = true;
			}
			else {
				$isMore = false;
			}
						
			Logger::debug("Max ID = $max_id");
			Logger::debug("Next ID = $next_id");

			//$comment_meta_list = $doc->getElementsByTagName("nextid");
			
			$comment_meta_list = $doc->getElementsByTagName("comment");
			foreach($comment_meta_list as $comment_meta){
				
				$id = $comment_meta->getAttribute('id');
				$poster_id = 0;
				
				if ($comment_meta->hasAttribute('posterid')){
					$poster_id = $comment_meta->getAttribute('posterid');
				}
				
				// Store the max comment id
				if ($id > self::$max_comment_id) self::$max_comment_id = $id;
				
				// Store the comment meta data
				//self::$comment_meta[] = array('id' => $id, 'poster_id' => $poster_id);
			}

			$user_list = $doc->getElementsByTagName("usermap");

			foreach($user_list as $user){				
				
				$user_id = $user->getAttribute('id');
				$username = $user->getAttribute('user');				
				
				// Store the user data
				//self::$user_list[] = array('id' => $id, 'username' => $username);
				self::$user_list[$user_id] = $username;
			}
			
	    }

		Logger::debug("Finished fetching comment meta!!");
		
	}
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Fetch comments from LJ, which returns them as an XML string in the following form;
	*
	* <?xml version="1.0" encoding='utf-8'?>
	* <livejournal>
	* 	* 	<comments>
	* 		<comment id='5' jitemid='32' posterid='283231'>
	* 			<body>I hope you and everyone else feels better soon. :(</body>
	* 			<date>2005-05-20T00:06:36Z</date>
	* 		</comment>
	* 		<comment id='6' jitemid='32' posterid='1390541'>
	* 			<body>Hugs to you and the family, hopefully everyone will feel better soon.</body>
	* 			<date>2005-05-20T00:37:23Z</date>
	* 		</comment>
	* 		<comment id='8' jitemid='32' posterid='97772'>
	* 			<body>*hugs*
	* 		
	* 			Hope everyone is on the mend and you get a good nights sleep tonight.</body>
	* 			<date>2005-05-20T01:10:33Z</date>
	* 		</comment>
	* 	</comments>
	* </livejournal>
	*/
	private static function getComments($site_id){

		$next_id = CommentsTable::getLastCommentSourceID($site_id, 'LiveJournal');
		if (!isset($next_id)) $next_id = 0;
		
		$numitems = 1000;			
		$isMore = true;

		// Loop until we have all the comments			
	    while ($isMore) {
	        
	        Logger::debug("Getting $numitems items from id = $next_id. Max id = " . self::$max_comment_id);
	        
	        $content = self::doFetchComments('comment_body', $next_id, $numitems);

			$doc = new DOMDocument();
			$doc->loadXML($content);
	        
			$comment_list = $doc->getElementsByTagName("comment");
			$comments = array();
			
			foreach($comment_list as $comment){
				
				$id = $comment->getAttribute('id');
				$post_id = $comment->getAttribute('jitemid');
				$poster_id = 0;
				$parent_id = 0;
								
				foreach($comment->childNodes as $child){
					if ($child->nodeName == 'body') $body = $child->textContent;
					if ($child->nodeName == 'date') $lj_date = $child->textContent;
				}								
				$date_str = date('Y-m-d H:i:s', strtotime($lj_date));
				
				if ($comment->hasAttribute('posterid')){
					$poster_id = $comment->getAttribute('posterid');
				}
				
				if ($comment->hasAttribute('parentid')){
					$parent_id = $comment->getAttribute('parentid');
				}
								
		        				
				$comments[] = array('id' => $id, 'poster_id' => $poster_id, 'content' => $body, 'pub_date' => $date_str, 'post_id' => $post_id, 'parent_id' => $parent_id);
			}

	        if ($next_id >= self::$max_comment_id){
		        $isMore = false;
	        }

	        $next_id += $numitems;
	        
	        // Import into apollo.....
	        
			foreach($comments as $comment){
	
				$author_name 		= self::getPosterName($comment['poster_id']);
				$author_email 		= "";
				$author_ip 			= "";
				$author_url 		= "";
				$content 			= urldecode($comment['content']);
				$import_source_id	= $comment['id'];
				$parent_comment_id 	= $comment['parent_id'];
				$created_date 		= $comment['pub_date'];
				$approved 			= 1;
				$post_id			= $comment['post_id'];
						
				$comment_id = ImportHelper::importCommentUsingSourcePostID($site_id, $post_id, $author_name, $author_email, $author_ip, $author_url, $content, $parent_comment_id, 
						$created_date, $approved, 'LiveJournal', $import_source_id);
				
			}	        
			
	    }

		Logger::debug("Finished fetching comments!!");
		
	}
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Returns a list of all the items that have been created or updated for a user. 
	*/
	private static function getSyncItems($site_id){
		
		self::setLastSyncTime($site_id);

		$client = new IXR_Client('www.livejournal.com', '/interface/xmlrpc', self::$useragent);

		$args = array(
			'username' => self::$username,
			'hpassword' => md5(self::$password),
			'ver' => 1,
			'lastsync' => self::$last_sync_time
		);
		
		if (!$client->query('LJ.XMLRPC.syncitems', $args)) {
			Logger::error('Something went wrong - '.$client->getErrorCode().' : '.$client->getErrorMessage());
			self::$errorMessage = $client->getErrorMessage();
			self::$errorCode = $client->getErrorCode();
			return;
		}
		
		$response = $client->getResponse();
		
		//echo "<pre>".print_r($response, true)."</pre>";
		return $response;
		
	}
	
	// /////////////////////////////////////////////////////////////////////////////////
			
	/**
	* Returns a list of all the items that have been created or updated for a user. 
	*/
	private static function getEvents($user_id, $site_id){

		$isMore = true;
		
		while ($isMore){

			self::setLastSyncTime($site_id);
			
			Logger::debug("Getting events since : " . self::$last_sync_time);
			
			$client = new IXR_Client('www.livejournal.com', '/interface/xmlrpc', self::$useragent);
			
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
			
			if (!$client->query('LJ.XMLRPC.getevents', $args)) {
				Logger::error('Something went wrong - '.$client->getErrorCode().' : '.$client->getErrorMessage());
				$isMore = false;
				self::$errorMessage = $client->getErrorMessage();
				self::$errorCode = $client->getErrorCode();
				return;
			}
			
			$response = $client->getResponse();
			
			$skip = $response['skip'];
			Logger::debug("Skip = $skip");
			
			foreach($response['events'] as $event){
				self::decodeEvent($user_id, $site_id, $event);
			}
			
		}
		
	}
	
	// /////////////////////////////////////////////////////////////////////////////////
		
	private static function doFetchComments($mode, $startid, $numitems){
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, "http://www.livejournal.com/export_comments.bml?get=$mode&startid=$startid&numitems=$numitems");
		curl_setopt($ch, CURLOPT_USERAGENT, self::$useragent);
		curl_setopt($ch, CURLOPT_COOKIE, self::$ljCookie);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
		$data = curl_exec($ch);		
		curl_close($ch);
		return $data;
	}
	
	// /////////////////////////////////////////////////////////////////////////////////

	/**
	* Decode the event information returned from LiveJournal and import into Apollo
	*/
	private static function decodeEvent($user_id, $site_id, $event){
				
		$title = "";
		$csv_tags = "";
				
		$item_id = $event['itemid'];
		$url = $event['url'];
		$item_id = $event['anum'];
		$timestamp = $event['event_timestamp'];
		$content = $event['event'];
		$created_date = $event['eventtime'];		
		$csv_categories = '';
		$status = 'Published';
		$can_comment = 1;

		if (isset($event['subject'])) $title = $event['subject'];
		if (isset($event['props']['taglist'])) $csv_tags = $event['props']['taglist'];

		
		// importPost($user_id, $site_id, $content, $status, $title, $created_date, $can_comment, $csv_tags, $csv_categories, $import_source)
		$post_id = ImportHelper::importPost($user_id, $site_id, $content, $status, $title, $created_date, $can_comment, $csv_tags, $csv_categories, 'LiveJournal', $item_id);
	}
	
	// /////////////////////////////////////////////////////////////////////////////////

	private static function getPosterName($poster_id){
		
		$name = "";
/*
		if (isset($poster_id) && $poster_id > 0){
			if (array_key_exists($poster_id, self::$user_list)){
				$name = self::$user_list[$poster_id];
			}
			else {
				Logger::dump(self::$user_list);
				Logger::error("Could not find user with id = $poster_id");
				die();
			}
		}		
		*/
		
		if (!isset($poster_id) || $poster_id == 0){
			return "";
		}
		/*
		foreach(self::$user_list as $user){
			if ($user['id'] == $poster_id){
				return $user['username'];
			}
		}
		
		Logger::dump(self::$user_list);
		Logger::debug(">>>> Poster ID $poster_id");
		die();
		*/
		$name = "";
		
		if (array_key_exists($poster_id, self::$user_list)){
			$name = self::$user_list[$poster_id];
		}
					
		return $name;
	}
	
}
?>