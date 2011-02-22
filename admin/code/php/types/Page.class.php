<?php
/**
* Class to encapsulate data on a post
*
* @since 9th February, 2011
* @author Mike Pritchard
*/
class Page {

	public $id;
	public $parentID;
	public $authorID;
	
	public $title = '';
	public $titleBrowser = '';
	public $content = '';
	public $description = '';
	
	public $status = '';
	public $dateLastEdit;
	public $dateCreated;
	public $slug = '';
	public $path = '';
	
	public $isHome = 0;
	public $isBlog = 0;
			
	/** The site base URL, e.g. 'http://charlottegeary.com/' */
	private static $base_url = '';
			
	// /////////////////////////////////////////////////////////////////////////////////

	/**
	* Class constructor. You can optionally construct using an associative array take from a DB query
	*/
	function __construct($page = ''){
		if ($page != ''){
			$this->fromArray($page);
		}
	}
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	public function get($site_id, $page_id){	
		$this->fromDB(PagesTable::getPage($site_id, $ppage_id));
	}
	
	// /////////////////////////////////////////////////////////////////////////////////

	/**
	* Populate from an associative array of data (e.g, when getting from the DB)
	*/
	public function fromArray($page){

		$this->id = $page['id'];
		$this->parentID = $page['parent_page_id'];
		$this->authorID = $page['user_id'];
		$this->content = $page['content'];
		$this->description = $page['description'];
		$this->status = $page['status'];
		$this->dateLastEdit = $page['last_edit'];
		$this->dateCreated = $page['created'];
		$this->title = $page['title'];
		$this->titleBrowser = $page['browser_title'];
		$this->slug = $page['slug'];
		$this->path = $page['path'];
		$this->isHome = $page['is_homepage'];
		$this->isBlog = $page['is_blogpage'];
		$this->pageOrder = $page['page_order'];

	}	
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	public function getLink(){	
		return self::getBaseURL() . $this->getPath() . $this->getSlug();
	}
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Get the base URL for this site
	*/ 
	public static function getBaseURL(){
	
		if (self::$base_url == ''){
			
			$domain = str_replace('www.', '', $_SERVER['HTTP_HOST']);
		    $site = SitesTable::getSiteFromDomain($domain);
			$site_id = $site['id'];
		        
	        self::$base_url = "http://" . $site['domain'] ;
			
			Logger::debug("Updating base url = " . self::$base_url);
		}
		
		return self::$base_url;
	}
	
	// /////////////////////////////////////////////////////////////////////////////////

	public function getID(){ return $this->id; }
	public function getParentID(){ return $this->parentID; }
	public function getTitle(){ return $this->title; }
	public function getTitleBrowser(){ return $this->titleBrowser; }
	public function getContent(){ return $this->content; }	
	public function getDescription(){ return $this->description; }	
	public function getStatus(){ return $this->status; }	
	public function getSlug(){ return $this->slug; }	
	public function getPath(){ return $this->path; }	
	public function getDateCreated(){ return $this->dateCreated; }	
	public function getDateLastEdit(){ return $this->dateLastEdit; }	
	public function getPageOrder(){ return $this->pageOrder; }	

	public function isHome(){ return $this->isHome; }	
	public function isBlog(){ return $this->isBlog; }	
	
    // ////////////////////////////////////////////////////////////////////
    //
    // Static methods
    //	
    // ////////////////////////////////////////////////////////////////////

	public static function encodeSlug($title){
		return StringUtils::encodeSlug($title, '.html');
	}	
		
}
?>