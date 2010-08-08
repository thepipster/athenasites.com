<?php
/**
 *
 * @since August 78h, 2010
 * @author Mike Pritcard (mike@apollosites.com)
 */
class CommentsTable {

	// ///////////////////////////////////////////////////////////////////////////////////////

	/**
	* To keep the database table from growing huge, we break this table up by site id
	*/
	public static function createTableForSite($site_id){
		
		$sql = "CREATE TABLE `athena_{$site_id}_Comments` (
		  `id` int(11) NOT NULL auto_increment,
		  `content` text,
		  `status` enum('Pending','Published', 'Trash', 'Spam', 'PossibleSpam') default 'Pending',
		  `last_edit` datetime default NULL,
		  `created` datetime default NULL,
		  `blog_follower_id` int(11) NOT NULL,
		  PRIMARY KEY  (`id`)
		) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;";
		
		DatabaseManager::submitQuery($sql);
		
	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Create a new site
     */
	public static function create($site_id, $user_id, $content, $status, $title){	
		
        // Get data in correct locale (SQL's NOW() doesn't do that)
        $target_date  = mktime(date("H"), date("i"), date("s"), date("m")  , date("d"), date("Y"));
        $date_str = date('Y-m-d H:i:s', $target_date);
		
		$sql = DatabaseManager::prepare("INSERT INTO athena_%_Comments (user_id, content, status, title, last_edit, created) VALUES (%d, %s, %s, %s, '$date_str', '$date_str')", $site_id, $user_id, $content, $status, $title);			
		return DatabaseManager::insert($sql);
    }

	// ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Update a post
     */
    public static function update($site_id, $post_id, $content, $status, $title){
		$sql = DatabaseManager::prepare("UPDATE athena_%_Comments SET content = %s, status = %s, title = %s WHERE id = %d", $site_id, $content, $status, $title, $page_id);
		return DatabaseManager::update($sql);
    }
    
	// /////////////////////////////////////////////////////////////////////////////////

	public static function getPosts($site_id){
		$sql = DatabaseManager::prepare("SELECT * FROM athena_%_Comments", $site_id);			
		return DatabaseManager::getResults($sql);				
	}

	// /////////////////////////////////////////////////////////////////////////////////

	public static function getPost($site_id, $post_id){
		$sql = DatabaseManager::prepare("SELECT * FROM athena_%_Comments WHERE id = %d", $site_id, $post_id);			
		return DatabaseManager::getResults($sql);				
	}
	
	// /////////////////////////////////////////////////////////////////////////////////
}
?>
