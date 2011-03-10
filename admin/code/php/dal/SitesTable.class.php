<?php
/**
 *
 * @since July 28th, 2010
 * @author mikep
 */
class SitesTable {

	// ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Create a new site
     */
	public static function create($site_id, $domain, $path, $theme_id){	
		$sql = DatabaseManager::prepare("INSERT INTO apollo_Sites (id, domain, path, theme_id, is_live) VALUES (%d, %s, %s, %d, 0)", $site_id, $domain, $path, $theme_id);			
		return DatabaseManager::insert($sql);
    }

	// ///////////////////////////////////////////////////////////////////////////////////////
	
	public static function getNextSiteID(){
		return DatabaseManager::getVar("SELECT max(id) FROM apollo_Sites") + 1;				
	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Add a user to a site
     */
	public static function addUserToSite($user_id, $site_id){	
		$sql = DatabaseManager::prepare("INSERT INTO apollo_UserToSite (user_id, site_id) VALUES (%d, %d)", $user_id, $site_id);			
		return DatabaseManager::insert($sql);
    }

	// ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Update a site
     */
    public static function update($id, $domain, $path, $theme_id){
		$sql = DatabaseManager::prepare("UPDATE apollo_Sites SET domain = %s, path = %s, theme_id = %d WHERE id = %d", $domain, $path, $theme_id, $id);
		return DatabaseManager::update($sql);
    }

	// /////////////////////////////////////////////////////////////////////////////////
	
	public static function getNumberSites(){return DatabaseManager::getVar("SELECT count(distinct(id)) AS no FROM apollo_Sites;");}
    
	// /////////////////////////////////////////////////////////////////////////////////

	public static function getUniqueSites(){
		$sql = DatabaseManager::prepare("SELECT * FROM apollo_Sites GROUP BY id");			
		return DatabaseManager::getResults($sql);				
	}
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	public static function getSite($id){
		$sql = DatabaseManager::prepare("SELECT * FROM apollo_Sites WHERE id = %d", $id);			
		return DatabaseManager::getSingleResult($sql);				
	}

	// /////////////////////////////////////////////////////////////////////////////////

	public static function getSites($id){
		$sql = DatabaseManager::prepare("SELECT * FROM apollo_Sites WHERE id = %d", $id);			
		return DatabaseManager::getResults($sql);				
	}

	// /////////////////////////////////////////////////////////////////////////////////

	public static function getAllSites(){
		$sql = DatabaseManager::prepare("SELECT * FROM apollo_Sites ORDER BY id");			
		return DatabaseManager::getResults($sql);				
	}

	// /////////////////////////////////////////////////////////////////////////////////
	
	public static function getDomain($site_id){
		$sql = DatabaseManager::prepare("SELECT domain FROM apollo_Sites WHERE id = %d", $site_id);	
		return DatabaseManager::getVar($sql);				
	}
	
	// /////////////////////////////////////////////////////////////////////////////////

	/**
	* Check to see if the given user has access to the given site
	*/
	public static function checkUserSiteAccess($user_id, $site_id){
		$sql = DatabaseManager::prepare("SELECT sites.id FROM apollo_Sites sites INNER JOIN apollo_UserToSite uts WHERE uts.user_id = %d AND sites.id = %d", $user_id, $site_id);			
		$data = DatabaseManager::getVar($sql);				
		if (isset($data) && $data > 0){
			return true;
		}
		return false;
	}

	// /////////////////////////////////////////////////////////////////////////////////

	public static function getSitesForUser($user_id){
		$sql = DatabaseManager::prepare("SELECT * FROM apollo_Sites sites INNER JOIN apollo_UserToSite uts WHERE uts.user_id = %d AND sites.id = uts.site_id ORDER BY sites.id", $user_id);			
		return DatabaseManager::getResults($sql);				
	}

	// /////////////////////////////////////////////////////////////////////////////////

	public static function getUserIDForSite($site_id){
		$sql = DatabaseManager::prepare("SELECT user_id FROM apollo_UserToSite WHERE site_id = %d LIMIT 1", ($site_id));			
		return DatabaseManager::getVar($sql);				
	}

	// /////////////////////////////////////////////////////////////////////////////////

	/**
	* Get the latitude/longitude for the given site based on the geo-locaton of the first site owner we find in the user table
	*/
	public static function getSiteGeoLocation($site_id){
		$sql = DatabaseManager::prepare("SELECT latitude, longitude FROM apollo_UserToSite uts INNER JOIN apollo_Users usr WHERE uts.site_id = %d AND uts.user_id = usr.id LIMIT 1", ($site_id));			
		return DatabaseManager::getSingleResult($sql);				
	}
		
	// /////////////////////////////////////////////////////////////////////////////////

	public static function getSiteIDFromDomain($domain){
		$sql = DatabaseManager::prepare("SELECT id FROM apollo_Sites WHERE domain = %s", $domain);			
		return DatabaseManager::getVar($sql);				
	}

	// /////////////////////////////////////////////////////////////////////////////////

	public static function getSiteFromDomain($domain){
		$sql = DatabaseManager::prepare("SELECT * FROM apollo_Sites WHERE domain = %s AND is_live = 1", $domain);			
		return DatabaseManager::getSingleResult($sql);				
	}
	
	// /////////////////////////////////////////////////////////////////////////////////

	public static function updateDomain($oldDomain, $newDomain){
		$sql = DatabaseManager::prepare("UPDATE apollo_Sites SET domain = %s WHERE domain = %s", $newDomain, $oldDomain);			
		Logger::debug($sql);
		return DatabaseManager::update($sql);				
	}

	public static function updateLive($domain, $is_live){
		$sql = DatabaseManager::prepare("UPDATE apollo_Sites SET is_live = %d WHERE domain = %s", $is_live, $domain);			
		return DatabaseManager::update($sql);				
	}
	
	// /////////////////////////////////////////////////////////////////////////////////
}
?>
