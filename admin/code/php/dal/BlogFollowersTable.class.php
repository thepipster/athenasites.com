<?php
/**
 *
 * @since August 78h, 2010
 * @author Mike Pritcard (mike@apollosites.com)
 */
class BlogFollowersTable {

	// ///////////////////////////////////////////////////////////////////////////////////////

	/**
	* To keep the database table from growing huge, we break this table up by site id
	*/
	/*
	public static function createTableForSite($site_id){
		
		$sql = "CREATE TABLE `athena_{$site_id}_BlogFollowers` (
		  `id` int(11) NOT NULL auto_increment,
		  `isFollowing` tinyint(1) default 0,
		  `name` varchar(255) default NULL,
		  `email` varchar(255) default NULL,
		  PRIMARY KEY  (`id`)
		) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;";
		
		DatabaseManager::submitQuery($sql);
		
	}
	*/
	
	// ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Create a new site
     */
	public static function create($site_id, $name, $email, $isFollowing){	
		
        // Get data in correct locale (SQL's NOW() doesn't do that)
        $target_date  = mktime(date("H"), date("i"), date("s"), date("m")  , date("d"), date("Y"));
        $date_str = date('Y-m-d H:i:s', $target_date);
		
		$sql = DatabaseManager::prepare("INSERT INTO athena_%d_BlogFollowers (name, email, isFollowing, last_edit, created) VALUES (%s, %s, %d, '$date_str', '$date_str')", $site_id, $name, $email, $isFollowing);			
		return DatabaseManager::insert($sql);
    }

	// ///////////////////////////////////////////////////////////////////////////////////////

	public static function getFollowers($site_id){
		$sql = DatabaseManager::prepare("SELECT * FROM athena_%d_BlogFollowers", $site_id);			
		return DatabaseManager::getResults($sql);				
	}

	// /////////////////////////////////////////////////////////////////////////////////

	public static function getFollower($site_id, $follower_id){
		$sql = DatabaseManager::prepare("SELECT * FROM athena_%d_BlogFollowers WHERE id = %d", $site_id, $follower_id);			
		return DatabaseManager::getResults($sql);				
	}
	
	// /////////////////////////////////////////////////////////////////////////////////
}
?>
