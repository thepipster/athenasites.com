<?php

class FeedGenerator {

	/**
	* Create a blog rss2 feed
	* @param $site_id
	* @param $title The blog title
	* @param $description The site's description
	* @param $url The blog URL
	*/
	public static function blogRSS2($site_id, $title, $description, $url){
	
		$TestFeed = new FeedWriter(RSS2);
	
		//Setting the channel elements
		//Use wrapper functions for common channel elements
		$TestFeed->setTitle($title);
		//$TestFeed->setLink($url.'/feed/rss2');
		$TestFeed->setLink($url);
		$TestFeed->setDescription($description);
		
		//Image title and link must match with the 'title' and 'link' channel elements for RSS 2.0
		//$TestFeed->setImage('Testing the RSS writer class','http://www.ajaxray.com/projects/rss','http://www.rightbrainsolution.com/images/logo.gif');
		
		$TestFeed->setChannelElement('language', 'en-us');
		$TestFeed->setChannelElement('pubDate', date(DATE_RSS, time()));
			
		$user = UserTable::getUserFromSiteID($site_id);
			
		// Get the most recent 20 posts
		$posts = PostsTable::getRecentPosts($site_id, 20);
		
		foreach($posts as $post){
		
			$postObj = new Post($post);
		
			//Create an empty FeedItem
			$newItem = $TestFeed->createNewItem();
			
			//Add elements to the feed item
			//Use wrapper functions to add common feed elements
			$newItem->setTitle($postObj->getTitle());
			$newItem->setLink($postObj->getLink());
			
			//The parameter is a timestamp for setDate() function
			$newItem->setDate( strtotime($postObj->getDateCreated()) );
			$newItem->setDescription($postObj->getContent());
			
			//$newItem->setEncloser('http://www.attrtest.com', '1283629', 'audio/mpeg');
			//Use core addElement() function for other supported optional elements
			
			//$newItem->addElement('author', $user['email'] . ' ('.$user['name'].')');
			$newItem->addElement('author', $user['name']);
			
			//Attributes have to passed as array in 3rd parameter
			$newItem->addElement('guid', $postObj->getLink(), array('isPermaLink'=>'true'));
			
			//Now add the feed item
			$TestFeed->addItem($newItem);
			  			
		}
					
		//OK. Everything is done. Now genarate the feed.
		$TestFeed->genarateFeed();
							
	}
	
	
	

	/**
	* Create a blog atom feed
	* @param $site_id
	* @param $title The blog title
	* @param $description The site's description
	* @param $url The blog URL
	*/
	public static function blogAtom($site_id, $title, $description, $url){
	
		$TestFeed = new FeedWriter(ATOM);
	
		//Setting the channel elements
		//Use wrapper functions for common channel elements
		$TestFeed->setTitle($title);
		//$TestFeed->setLink($url.'/feed/rss2');
		$TestFeed->setLink($url);
		$TestFeed->setDescription($description);
		
		//Image title and link must match with the 'title' and 'link' channel elements for RSS 2.0
		//$TestFeed->setImage('Testing the RSS writer class','http://www.ajaxray.com/projects/rss','http://www.rightbrainsolution.com/images/logo.gif');
		
		//Use core setChannelElement() function for other optional channels
		$TestFeed->setChannelElement('language', 'en-us');			
		$TestFeed->setChannelElement('updated', date(DATE_ATOM , time()));
		
		$user = UserTable::getUserFromSiteID($site_id);
		
		$TestFeed->setChannelElement('author', array('name'=>$user['name']));
			
		// Get the most recent 20 posts
		$posts = PostsTable::getRecentPosts($site_id, 20);
		
		foreach($posts as $post){
		
			$postObj = new Post($post);
		
			//Create an empty FeedItem
			$newItem = $TestFeed->createNewItem();
			
			//Add elements to the feed item
			//Use wrapper functions to add common feed elements
			$newItem->setTitle($postObj->getTitle());
			$newItem->setLink($postObj->getLink());
			
			//The parameter is a timestamp for setDate() function
			$newItem->setDate( strtotime($postObj->getDateCreated()) );
			$newItem->setDescription($postObj->getContent());
			
			//$newItem->setEncloser('http://www.attrtest.com', '1283629', 'audio/mpeg');
			//Use core addElement() function for other supported optional elements
			
			//$newItem->addElement('author', 'admin@ajaxray.com (Anis uddin Ahmad)');
			
			//Attributes have to passed as array in 3rd parameter
			$newItem->addElement('guid', $postObj->getLink(), array('isPermaLink'=>'true'));
			
			//Now add the feed item
			$TestFeed->addItem($newItem);
			  			
		}
					
		//OK. Everything is done. Now genarate the feed.
		$TestFeed->genarateFeed();
							
	}
}
?>