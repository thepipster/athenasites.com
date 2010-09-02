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
		
		// comment: id, author, author_email, author_url, author_ip, date, date_gmt, content, approved, parent_id
		
		$sql = "CREATE TABLE `athena_{$site_id}_Comments` (
		  `id` int(11) NOT NULL auto_increment,
		  `post_id` int(11) NOT NULL,
		  `parent_id` int(11) NOT NULL,
		  `content` text,
		  `status` enum('Pending','Approved', 'Trash', 'Spam', 'PossibleSpam') default 'Pending',
		  `created` datetime default NULL,
		  `author_ip` bigint(20) default NULL,
		  `site_follower_id` int(11) NOT NULL,
		  PRIMARY KEY  (`id`)
		) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;";
		
		DatabaseManager::submitQuery($sql);
		
	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Create a new comment
     */
	public static function create($site_id, $post_id, $parent_comment_id, $content, $status, $author_ip, $author_id){	
						
        // Get data in correct locale (SQL's NOW() doesn't do that)
        $target_date  = mktime(date("H"), date("i"), date("s"), date("m")  , date("d"), date("Y"));
        $date_str = date('Y-m-d H:i:s', $target_date);
		
		$sql = DatabaseManager::prepare("INSERT INTO athena_%d_Comments (post_id, parent_id, content, status, created, author_ip, site_follower_id) 
			VALUES (%d, %d, %s, %s, '$date_str', %d, %d)", 
			$site_id, $post_id, $parent_comment_id, $content, $status, ip2long($author_ip), $author_id);	
					
		return DatabaseManager::insert($sql);
    }

	// ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Create a new comment, but force the id. If a comment with that id already exist, change its id.
     */
	public static function createForceID($site_id, $post_id, $comment_id, $parent_comment_id, $content, $status, $author_ip, $author_id){	
						
		// Check to see if this id is free
		$sql = DatabaseManager::prepare("SELECT id FROM athena_%d_Comments WHERE id = %d", $site_id, $comment_id);			
		$temp_id = DatabaseManager::getVar($sql);	
		if (isset($temp_id)){
			$new_id = DatabaseManager::getVar(DatabaseManager::prepare("SELECT max(id) FROM athena_%d_Comments", $site_id)) + 1;	
			$sql = DatabaseManager::prepare("UPDATE athena_%d_Comments SET id = %d WHERE id = %d", $site_id, $new_id, $temp_id);			
			DatabaseManager::update($sql);	
		}			
						
        // Get data in correct locale (SQL's NOW() doesn't do that)
        $target_date  = mktime(date("H"), date("i"), date("s"), date("m")  , date("d"), date("Y"));
        $date_str = date('Y-m-d H:i:s', $target_date);
		
		$sql = DatabaseManager::prepare("INSERT INTO athena_%d_Comments (id, post_id, parent_id, content, status, created, author_ip, site_follower_id) 
			VALUES (%d, %d, %d, %s, %s, '$date_str', %d, %d)", 
			$site_id, $comment_id, $post_id, $parent_comment_id, $content, $status, ip2long($author_ip), $author_id);	
					
		return DatabaseManager::insert($sql);
    }

	// ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Update a post
     */
    public static function update($site_id, $post_id, $comment_id, $parent_comment_id, $content, $status, $author_ip, $author_id){
		$sql = DatabaseManager::prepare("UPDATE athena_%d_Comments SET post_id = %d, parent_id = %d, content = %s, status = %s, author_ip = %d, site_follower_id = %d WHERE id = %d",
			$site_id, $post_id, $parent_comment_id, $content, $status, ip2long($author_ip), $author_id, $comment_id);
		return DatabaseManager::update($sql);
    }
    
	// /////////////////////////////////////////////////////////////////////////////////

    public static function updateCreatedDate($comment_id, $site_id, $created_date){
		$sql = DatabaseManager::prepare("UPDATE athena_%d_Comments SET created=%s WHERE id = %d", $site_id, $created_date, $comment_id);
		return DatabaseManager::update($sql);
    }    
    
	// /////////////////////////////////////////////////////////////////////////////////

	public static function getPosts($site_id){
		$sql = DatabaseManager::prepare("SELECT * FROM athena_%d_Comments", $site_id);			
		return DatabaseManager::getResults($sql);				
	}

	// /////////////////////////////////////////////////////////////////////////////////

	public static function getComment($site_id, $comment_id){
		$sql = DatabaseManager::prepare("SELECT * FROM athena_%d_Comments WHERE id = %d", $site_id, $comment_id);			
		return DatabaseManager::getResults($sql);				
	}
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	public static function getCommentIDFromDate($site_id, $datestr){
		$sql = DatabaseManager::prepare("SELECT id FROM athena_%d_Comments WHERE created = %s", $site_id, $datestr);		
		return DatabaseManager::getVar($sql);				
	}
	
}
?>
