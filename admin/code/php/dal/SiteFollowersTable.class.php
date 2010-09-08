<?php
/**
 *
 * @since August 78h, 2010
 * @author Mike Pritcard (mike@apollosites.com)
 */
class SiteFollowersTable {
	
	// ///////////////////////////////////////////////////////////////////////////////////////

	public static function getFollower($id){
		$sql = DatabaseManager::prepare("SELECT * FROM athena_SiteFollowers WHERE id = %d", $id);			
		return DatabaseManager::getSingleResult($sql);		
	}
		
	// ///////////////////////////////////////////////////////////////////////////////////////

	public static function getFollowers($site_id){
		$sql = DatabaseManager::prepare("SELECT * FROM athena_SiteFollowers WHERE site_id = %d ", $site_id);			
		return DatabaseManager::getResults($sql);				
	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////
	
	public static function getFollowerIDFromEmail($email){
		$sql = DatabaseManager::prepare("SELECT id FROM athena_SiteFollowers WHERE email = %s", $email);			
		return DatabaseManager::getVar($sql);		
	}

	public static function getFollowerIDFromName($name){
		$sql = DatabaseManager::prepare("SELECT id FROM athena_SiteFollowers WHERE name = %s", $name);			
		return DatabaseManager::getVar($sql);		
	}

	public static function getFollowerIDFromURL($url){
		$sql = DatabaseManager::prepare("SELECT id FROM athena_SiteFollowers WHERE url = %s", $url);			
		return DatabaseManager::getVar($sql);		
	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////

	public static function getFollowerFromEmail($email){
		$sql = DatabaseManager::prepare("SELECT * FROM athena_SiteFollowers WHERE email = %s", $email);			
		return DatabaseManager::getSingleResult($sql);		
	}


	// ///////////////////////////////////////////////////////////////////////////////////////

	public static function addFollowerToSite($follower_id, $site_id){		

		$sql = DatabaseManager::prepare("DELETE FROM athena_FollowerToSite WHERE follower_id = %d AND site_id = %d", $follower_id, $site_id);			
		DatabaseManager::submitQuery($sql);
	
		$sql = DatabaseManager::prepare("INSERT INTO athena_FollowerToSite (follower_id, site_id) VALUES (%d, %d)", $follower_id, $site_id);			
		return DatabaseManager::insert($sql);
	}

	// ///////////////////////////////////////////////////////////////////////////////////////
	
	public static function addFollower($name, $email, $ip, $author_url){		
	
        // Get data in correct locale (SQL's NOW() doesn't do that)
        $target_date  = mktime(date("H"), date("i"), date("s"), date("m")  , date("d"), date("Y"));
        $date_str = date('Y-m-d H:i:s', $target_date);

		$sql = DatabaseManager::prepare("INSERT INTO athena_SiteFollowers (name, email, ip_long, created, last_activity, url) VALUES (%s, %s, %d, '$date_str', '$date_str', %s)", $name, $email, ip2long($ip), $author_url);			
		return DatabaseManager::insert($sql);
	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////
	
	public static function updateFollower($follower_id, $ip, $author_url){		
	
        // Get data in correct locale (SQL's NOW() doesn't do that)
        $target_date  = mktime(date("H"), date("i"), date("s"), date("m")  , date("d"), date("Y"));
        $date_str = date('Y-m-d H:i:s', $target_date);

		if ($author_url != ''){
			$sql = DatabaseManager::prepare("UPDATE athena_SiteFollowers SET ip_long = %d, last_activity = %s, url = %s WHERE id = %d", ip2long($ip), $date_str, $follower_id, $author_url);			
		}
		else {
			$sql = DatabaseManager::prepare("UPDATE athena_SiteFollowers SET ip_long = %d, last_activity = %s WHERE id = %d", ip2long($ip), $date_str, $follower_id);			
		}
		return DatabaseManager::insert($sql);
	}

	// ///////////////////////////////////////////////////////////////////////////////////////

    public static function updateCreatedDate($follower_id, $created_date){
		$sql = DatabaseManager::prepare("UPDATE athena_SiteFollowers SET created=%s WHERE id = %d", $created_date, $follower_id);
		return DatabaseManager::update($sql);
    }   

    public static function updateLastActivityDate($follower_id, $created_date){
		$sql = DatabaseManager::prepare("UPDATE athena_SiteFollowers SET last_activity = %s WHERE id = %d", $created_date, $follower_id);
		return DatabaseManager::update($sql);
    }   
}
?>
