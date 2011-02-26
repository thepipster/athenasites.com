<?php
/**
* Class to encapsulate data on a comment
*
* @since 25th February, 2011
* @author Mike Pritchard
*/
class Comment {

	public $id;
	public $postID;
	public $parentID;	
	public $content = '';
	public $status = '';	
	public $dateCreated;
	
	public $followerID = '';
			
	// /////////////////////////////////////////////////////////////////////////////////

	/**
	* Class constructor. You can optionally construct using an associative array take from a DB query
	*/
	function __construct($comment = ''){
		if ($comment != ''){
			$this->fromArray($comment);
		}
	}
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	public function get($comment_id){	
		$this->fromArray(CommentsTable::getComment(Site::getSiteID, $comment_id));
	}
	
	// /////////////////////////////////////////////////////////////////////////////////

	/**
	* Populate from an associative array of data (e.g, when getting from the DB)
	*/
	public function fromArray($page){

		$this->id = $page['id'];
		$this->postID = $page['post_id'];
		$this->parentID = $page['parent_id'];
		$this->content = $page['content'];
		$this->status = $page['status'];
		$this->dateCreated = $page['created'];
		$this->followerID = $page['site_follower_id'];

	}	
	
	// /////////////////////////////////////////////////////////////////////////////////

	public function getID(){ return $this->id; }
	public function getPostID(){ return $this->postId; }
	public function getParentID(){ return $this->parentID; }
	public function getContent(){ return $this->content; }
	public function getStatus(){ return $this->status; }
	public function getDateCreated(){ return $this->dateCreated; }
	public function getFollowerID(){ return $this->followerID; }
	
	/**
	* Get the 'site follower' that created this comment and return as a Follower object
	*/
	public function getFollower(){
		$followerObj = new Follower();
		$followerObj->get($this->followerID);
		return $followerObj;
	}
	
	// /////////////////////////////////////////////////////////////////////////////////
	
}
?>