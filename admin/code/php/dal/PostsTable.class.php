<?php
/**
 *
 * @since August 78h, 2010
 * @author Mike Pritcard (mike@apollosites.com)
 */
class PostsTable {

	// ///////////////////////////////////////////////////////////////////////////////////////

	/**
	* To keep the database table from growing huge, we break this table up by site id
	*/
	public static function createTableForSite($site_id){
		
		$sql = "CREATE TABLE `athena_{$site_id}_Posts` (
		  `id` int(11) NOT NULL auto_increment,
		  `user_id` int(11) default NULL,
		  `content` text,
		  `status` enum('Published','Draft','Private','Revision') default 'Draft',
		  `last_edit` datetime default NULL,
		  `created` datetime default NULL,
		  `title` varchar(255) default NULL,
		  `slug` varchar(255) default NULL,
		  `tags` varchar(255) default NULL,
		  `categories` varchar(255) default NULL,
		  `canComment` tinyint(1) default '1',
		  PRIMARY KEY  (`id`)
		) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;";
		
		DatabaseManager::submitQuery($sql);
		
	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Create a new site
     */
	public static function create($site_id, $user_id, $content, $status, $title, $canComment, $slug, $tags, $categories){	
		
        // Get data in correct locale (SQL's NOW() doesn't do that)
        $target_date  = mktime(date("H"), date("i"), date("s"), date("m")  , date("d"), date("Y"));
        $date_str = date('Y-m-d H:i:s', $target_date);
		
		$sql = DatabaseManager::prepare("INSERT INTO athena_%d_Posts (user_id, content, status, title, last_edit, created, canComment, slug, tags, categories) 
			VALUES (%d, %s, %s, %s, '$date_str', '$date_str', %d, %s, %s, %s)", $site_id, $user_id, $content, $status, $title, $canComment, $slug, $tags, $categories);			
		return DatabaseManager::insert($sql);
    }

	// ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Update a post
     */
    public static function update($site_id, $post_id, $content, $status, $title, $canComment, $slug, $tags, $categories){

        // Get data in correct locale (SQL's NOW() doesn't do that)
        $target_date  = mktime(date("H"), date("i"), date("s"), date("m")  , date("d"), date("Y"));
        $date_str = date('Y-m-d H:i:s', $target_date);

		$sql = DatabaseManager::prepare("UPDATE athena_%d_Posts SET content = %s, status = %s, title = %s, canComment = %s, slug = %s, last_edit='$date_str', tags=%s, categories=%s WHERE id = %d", 
			$site_id, $content, $status, $title, $canComment, $slug, $tags, $categories, $post_id);
		return DatabaseManager::update($sql);
    }
    
	// /////////////////////////////////////////////////////////////////////////////////

	public static function getPosts($site_id){
		$sql = DatabaseManager::prepare("SELECT * FROM athena_%d_Posts ORDER BY created DESC", $site_id);			
		return DatabaseManager::getResults($sql);				
	}

	// /////////////////////////////////////////////////////////////////////////////////

	public static function getPost($site_id, $post_id){
		$sql = DatabaseManager::prepare("SELECT * FROM athena_%d_Posts WHERE id = %d", $site_id, $post_id);			
		return DatabaseManager::getSingleResult($sql);				
	}
	
	// /////////////////////////////////////////////////////////////////////////////////
}
?>
