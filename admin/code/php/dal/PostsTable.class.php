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
		  `canComment` tinyint(1) default '1',
		  PRIMARY KEY  (`id`)
		) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;";
		
		DatabaseManager::submitQuery($sql);

		$sql = "CREATE TABLE `athena_{$site_id}_PostTags` (
		  `id` int(11) NOT NULL auto_increment,
		  `tag` varchar(255),
		  PRIMARY KEY  (`id`)
		) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;";

		DatabaseManager::submitQuery($sql);

		$sql = "CREATE TABLE `athena_{$site_id}_PostToTags` (
		  `id` int(11) NOT NULL auto_increment,
		  `post_id` int(11),
		  `tag_id` int(11),
		  PRIMARY KEY  (`id`)
		) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;";

		DatabaseManager::submitQuery($sql);

		$sql = "CREATE TABLE `athena_{$site_id}_PostCategories` (
		  `id` int(11) NOT NULL auto_increment,
		  `category` varchar(255),
		  PRIMARY KEY  (`id`)
		) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;";

		DatabaseManager::submitQuery($sql);

		$sql = "CREATE TABLE `athena_{$site_id}_PostToCategories` (
		  `id` int(11) NOT NULL auto_increment,
		  `post_id` int(11),
		  `category_id` int(11),
		  PRIMARY KEY  (`id`)
		) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;";

		DatabaseManager::submitQuery($sql);
		
	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Create a new site
     */
	public static function create($site_id, $user_id, $content, $status, $title, $canComment, $slug){	
		
        // Get data in correct locale (SQL's NOW() doesn't do that)
        $target_date  = mktime(date("H"), date("i"), date("s"), date("m")  , date("d"), date("Y"));
        $date_str = date('Y-m-d H:i:s', $target_date);
		
		$sql = DatabaseManager::prepare("INSERT INTO athena_%d_Posts (user_id, content, status, title, last_edit, created, canComment, slug) 
			VALUES (%d, %s, %s, %s, '$date_str', '$date_str', %d, %s)", $site_id, $user_id, $content, $status, $title, $canComment, $slug);			
		return DatabaseManager::insert($sql);
    }

	// ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Update a post
     */
    public static function update($site_id, $post_id, $content, $status, $title, $canComment, $slug){

        // Get data in correct locale (SQL's NOW() doesn't do that)
        $target_date  = mktime(date("H"), date("i"), date("s"), date("m")  , date("d"), date("Y"));
        $date_str = date('Y-m-d H:i:s', $target_date);

		$sql = DatabaseManager::prepare("UPDATE athena_%d_Posts SET content = %s, status = %s, title = %s, canComment = %s, slug = %s, last_edit='$date_str' WHERE id = %d", 
			$site_id, $content, $status, $title, $canComment, $slug, $post_id);
		return DatabaseManager::update($sql);
    }

	// /////////////////////////////////////////////////////////////////////////////////

	/**
	* Add a new post tag
	*/
	public static function addTag($site_id, $post_id, $tag){
	
		// Does the tag already exist
		$sql = DatabaseManager::prepare("SELECT id FROM athena_%d_PostTags WHERE tag = %s", $site_id, $tag);
		$tag_id = DatabaseManager::getVar($sql);
		
		if (!isset($tag_id)){
			$sql = DatabaseManager::prepare("INSERT INTO athena_%d_PostTags (tag) VALUES (%s)", $site_id, $tag);
			$tag_id = DatabaseManager::insert($sql);
		}

		$sql = DatabaseManager::prepare("DELETE FROM athena_%d_PostToTags WHERE tag_id=%d AND post_id=%d", $site_id, $tag_id, $post_id);
		DatabaseManager::submitQuery($sql);
		
		$sql = DatabaseManager::prepare("INSERT INTO athena_%d_PostToTags (tag_id, post_id) VALUES (%d, %d)", $site_id, $tag_id, $post_id);
		DatabaseManager::insert($sql);
		
		return $tag_id;
		
	}

	// /////////////////////////////////////////////////////////////////////////////////

	public static function addCategory($site_id, $post_id, $category){

		// Does the category already exist
		$sql = DatabaseManager::prepare("SELECT id FROM athena_%d_PostCategories WHERE category = %s", $site_id, $category);
		$category_id = DatabaseManager::getVar($sql);
		
		if (!isset($tag_id)){
			$sql = DatabaseManager::prepare("INSERT INTO athena_%d_PostCategories (category) VALUES (%s)", $site_id, $category);
			$category_id = DatabaseManager::insert($sql);
		}

		$sql = DatabaseManager::prepare("DELETE FROM athena_%d_PostToCategories WHERE category_id=%d AND post_id=%d", $site_id, $category_id, $post_id);
		DatabaseManager::submitQuery($sql);
		
		$sql = DatabaseManager::prepare("INSERT INTO athena_%d_PostToCategories (category_id, post_id) VALUES (%d, %d)", $site_id, $category_id, $post_id);
		DatabaseManager::insert($sql);
		
		return $category_id;

	}	

	// /////////////////////////////////////////////////////////////////////////////////

	public static function getPostTags($site_id, $post_id){
//		$sql = DatabaseManager::prepare("SELECT * FROM athena_%d_PostToTags", $site_id);			
//		return DatabaseManager::getResults($sql);				
	}

	public static function getPostCategories($site_id, $post_id){
	}
	
	public static function getTags($site_id){
	}

	public static function getCategories($site_id){
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
