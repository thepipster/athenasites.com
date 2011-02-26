<?php
/**
* Class to encapsulate data on a site follower
*
* @since 25th February, 2011
* @author Mike Pritchard
*/
class Follower {

	public $id;
	public $name;
	public $email;	
	public $created = '';
	public $lastActivity = '';	
	public $ip;
	public $url;
	public $isSpammer = false;
	
	// /////////////////////////////////////////////////////////////////////////////////

	/**
	* Class constructor. You can optionally construct using an associative array take from a DB query
	*/
	function __construct($follower = ''){
		if ($follower != ''){
			$this->fromArray($follower);
		}
	}
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	public function get($follower_id){	
		$this->fromArray(SiteFollowersTable::getFollower($follower_id));
	}
	
	// /////////////////////////////////////////////////////////////////////////////////

	/**
	* Populate from an associative array of data (e.g, when getting from the DB)
	*/
	public function fromArray($page){

		$this->id = $page['id'];
		$this->name = $page['name'];
		$this->email = $page['email'];
		$this->created = $page['created'];
		$this->lastActivity = $page['last_activity'];
		$this->ip = long2ip($page['ip_long']);
		$this->url = $page['url'];
		$this->isSpammer = $page['is_spammer'];
	}	
	
	// /////////////////////////////////////////////////////////////////////////////////

	public function getID(){ return $this->id; }
	public function getName(){ return $this->name; }
	public function getEmail(){ return $this->email; }
	public function getDateCreated(){ return $this->created; }
	public function getDateLastActivity(){ return $this->lastActivity; }
	public function getIP(){ return $this->ip; }
	public function getURL(){ return $this->url; }
	public function getIsSpammer(){ return $this->isSpammer; }
	
}
?>