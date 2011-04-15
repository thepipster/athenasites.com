<?php
/**
* Class to encapsulate data on a site
*
* @since 25th February, 2011
* @author Mike Pritchard
*/
class Site {

	public $id;
	public $domain;
	public $themeID;	
	public $isLive;

	/** Store site id for convenience */
	private static $currentSiteID = '';
	private static $currentDomain = '';

	// /////////////////////////////////////////////////////////////////////////////////

	/**
	* Class constructor. You can optionally construct using an associative array take from a DB query
	*/

	function __construct($site = ''){
		if ($site != ''){
			$this->fromArray($site);
		}
	}
/*
	function __construct($site = ''){
		if ($site != ''){
			$this->fromArray($site);
		}
	}
*/	
	// /////////////////////////////////////////////////////////////////////////////////
	
	public function get($site_id){	
		$this->fromArray(SitesTable::getSite($site_id));
	}
	
	// /////////////////////////////////////////////////////////////////////////////////

	/**
	* Populate from an associative array of data (e.g, when getting from the DB)
	*/
	public function fromArray($site){
		$this->id = $site['id'];
		$this->domain = $page['domain'];
		$this->themeID = $page['theme_id'];
		$this->isLive = $page['is_live'];
	}	
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Derive the site id from the domain
	*/
	public static function getSiteID(){
	
		if (self::$currentSiteID == '' || self::$currentSiteID == 0){

			$domain = str_replace('www.', '', $_SERVER['HTTP_HOST']);
			
			// Get the site id, this could be the non-live site (xxxx.apollosites.com) so get id first
		    $site_id = SitesTable::getSiteIDFromDomain($domain);		    
		    
		    // Now get the live domain name
		    $site = SitesTable::getSite($site_id);
			
			self::$currentSiteID = $site['id'];
			self::$currentDomain = $site['domain'];
		}
		
		return self::$currentSiteID;
	}	
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Get the base URL for this site
	*/ 
	public static function getBaseURL(){
	
		if (self::$currentSiteID == ''){
			self::getSiteID();
		}
		
		return "http://" . self::$currentDomain;
	}
	
	// /////////////////////////////////////////////////////////////////////////////////

	public static function getDomain(){
		return  self::$currentDomain;
	}	
		
}
?>