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
		  `path` varchar(255) default NULL,
		  `source` varchar(20) default NULL,
		  `source_id` int(11) default NULL,
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

	public static function delete($site_id, $post_id){
		$sql = DatabaseManager::prepare("DELETE FROM athena_%d_Posts WHERE id = %d", $site_id, $post_id);
		return DatabaseManager::submitQuery($sql);
	}

	// /////////////////////////////////////////////////////////////////////////////////

	public static function getLastPostDate($site_id){
		$sql = DatabaseManager::prepare("SELECT max(created) FROM athena_%d_Posts", $site_id);		
		return DatabaseManager::getVar($sql);				
	}
		
	// /////////////////////////////////////////////////////////////////////////////////

	public static function getPostFromDate($site_id, $datestr){
		$sql = DatabaseManager::prepare("SELECT * FROM athena_%d_Posts WHERE created = %s", $site_id, $datestr);		
		return DatabaseManager::getSingleResult($sql);				
	}

	public static function getPostIDFromDate($site_id, $datestr){
		$sql = DatabaseManager::prepare("SELECT id FROM athena_%d_Posts WHERE created = %s", $site_id, $datestr);		
		return DatabaseManager::getVar($sql);				
	}
	
	public static function getPostFromSourceID($site_id, $source_id){
		$sql = DatabaseManager::prepare("SELECT id FROM athena_%d_Posts WHERE source_id = %d", $site_id, $source_id);		
		return DatabaseManager::getVar($sql);				
	}

	// /////////////////////////////////////////////////////////////////////////////////

	public static function getPostsFromTag($site_id, $tag){
		//Logger::debug("getPostsFromTag($site_id, $tag)");
		$tag_id = self::getTagID($site_id, $tag);
		$sql = DatabaseManager::prepare("SELECT p.* FROM athena_%d_Posts p INNER JOIN athena_%d_PostToTags pt WHERE pt.tag_id = %d AND pt.post_id = p.id", $site_id, $site_id, $tag_id);		
		return DatabaseManager::getResults($sql);				
	}

	// /////////////////////////////////////////////////////////////////////////////////

	public static function getPostsFromCategory($site_id, $category){
		$cat_id = self::getCategoryID($site_id, $category);
		$sql = DatabaseManager::prepare("SELECT p.* FROM athena_%d_Posts p INNER JOIN athena_%d_PostToCategories pc WHERE pc.category_id = %d AND pc.post_id = p.id", $site_id, $site_id, $cat_id);		
		return DatabaseManager::getResults($sql);				
	}
		
	// /////////////////////////////////////////////////////////////////////////////////

	public static function getPostFromSlug($site_id, $path, $slug){
		//Logger::debug("getPageFromSlug(site_id = $site_id, page_slug = $page_slug");	
		$sql = DatabaseManager::prepare("SELECT * FROM athena_%d_Posts WHERE slug = %s AND path = %s", $site_id, $slug, $path);		
		$data = DatabaseManager::getSingleResult($sql);				
		if (isset($data)){
			return $data;
		}
		return null;
	}
	
	
	// /////////////////////////////////////////////////////////////////////////////////
    
    public static function updatePath($post_id, $site_id, $path){
		$sql = DatabaseManager::prepare("UPDATE athena_%d_Posts SET path=%s WHERE id = %d", $site_id, $path, $post_id);
		return DatabaseManager::update($sql);
    }    

    public static function updateCreatedDate($post_id, $site_id, $created_date){
		$sql = DatabaseManager::prepare("UPDATE athena_%d_Posts SET created=%s WHERE id = %d", $site_id, $created_date, $post_id);
		return DatabaseManager::update($sql);
    }    

    public static function updateSourceID($post_id, $site_id, $source_id){
		$sql = DatabaseManager::prepare("UPDATE athena_%d_Posts SET source_id=%d WHERE id = %d", $site_id, $source_id, $post_id);
		return DatabaseManager::update($sql);
    }    

    public static function updateSource($post_id, $site_id, $source){
		$sql = DatabaseManager::prepare("UPDATE athena_%d_Posts SET source=%s WHERE id = %s", $site_id, $source, $post_id);
		return DatabaseManager::update($sql);
    }    

	// /////////////////////////////////////////////////////////////////////////////////

	/**
	* Add a new category, but only if doesn't exist already.
	*/
	public static function addCategory($site_id, $category){

		// Does the category already exist
		$sql = DatabaseManager::prepare("SELECT id FROM athena_%d_PostCategories WHERE category = %s", $site_id, $category);
		$category_id = DatabaseManager::getVar($sql);
		
		if (!isset($category_id)){
			$sql = DatabaseManager::prepare("INSERT INTO athena_%d_PostCategories (category) VALUES (%s)", $site_id, $category);
			$category_id = DatabaseManager::insert($sql);
		}
		
		return $category_id;
	}	
		
	// /////////////////////////////////////////////////////////////////////////////////

	/**
	* Add a new tag, but only if doesn't exist already.
	*/ 
	public static function addTag($site_id, $tag){
	
		// Does the tag already exist
		$sql = DatabaseManager::prepare("SELECT id FROM athena_%d_PostTags WHERE tag = %s", $site_id, $tag);
		$tag_id = DatabaseManager::getVar($sql);
		
		if (!isset($tag_id)){
			$sql = DatabaseManager::prepare("INSERT INTO athena_%d_PostTags (tag) VALUES (%s)", $site_id, $tag);
			$tag_id = DatabaseManager::insert($sql);
		}

		return $tag_id;

	}
	
	// /////////////////////////////////////////////////////////////////////////////////

	/**
	* Assign a tag to a post
	*/
	public static function addTagToPost($site_id, $post_id, $tag){
	
		// Does the tag already exist
		$sql = DatabaseManager::prepare("SELECT id FROM athena_%d_PostTags WHERE tag = %s", $site_id, $tag);
		$tag_id = DatabaseManager::getVar($sql);
		
		if (!isset($tag_id)){
			$sql = DatabaseManager::prepare("INSERT INTO athena_%d_PostTags (tag) VALUES (%s)", $site_id, $tag);
			$tag_id = DatabaseManager::insert($sql);
		}

		// Does this post already have this category assigned?
		$sql = DatabaseManager::prepare("SELECT id FROM athena_%d_PostToTags WHERE tag_id=%d AND post_id=%d", $site_id, $tag_id, $post_id);
		$id = DatabaseManager::getVar($sql);

		if (isset($id)){
			//Logger::debug(">>> Tag already assigned to this post!");
			return null;
		}
		
		$sql = DatabaseManager::prepare("INSERT INTO athena_%d_PostToTags (tag_id, post_id) VALUES (%d, %d)", $site_id, $tag_id, $post_id);
		DatabaseManager::insert($sql);
		
		return $tag_id;
		
	}

	// /////////////////////////////////////////////////////////////////////////////////

	/**
	* Assign a category to a post
	*/
	public static function addCategoryToPost($site_id, $post_id, $category){

		// Does the category already exist
		$sql = DatabaseManager::prepare("SELECT id FROM athena_%d_PostCategories WHERE category = %s", $site_id, $category);
		$category_id = DatabaseManager::getVar($sql);
		
		if (!isset($category_id)){
			$sql = DatabaseManager::prepare("INSERT INTO athena_%d_PostCategories (category) VALUES (%s)", $site_id, $category);
			$category_id = DatabaseManager::insert($sql);
		}

		// Does this post already have this category assigned?
		$sql = DatabaseManager::prepare("SELECT id FROM athena_%d_PostToCategories WHERE category_id=%d AND post_id=%d", $site_id, $category_id, $post_id);
		$id = DatabaseManager::getVar($sql);

		if (isset($id)){
			//Logger::debug(">>> Category already assigned to this post!");
			return null;
		}
				
		$sql = DatabaseManager::prepare("INSERT INTO athena_%d_PostToCategories (category_id, post_id) VALUES (%d, %d)", $site_id, $category_id, $post_id);
		DatabaseManager::insert($sql);
		
		return $category_id;

	}	

	// /////////////////////////////////////////////////////////////////////////////////

	/**
	* Remove a tag from a post, and remove from the list of tags if there are no other references
	*/
	public static function removeTag($site_id, $post_id, $tag){
	
		// Delete post-tag mapping
		$tag_id = self::getTagID($site_id, $tag);
		$sql = DatabaseManager::prepare("DELETE FROM athena_%d_PostToTags WHERE tag_id = %d AND post_id = %d", $site_id, $tag_id, $post_id);
		DatabaseManager::submitQuery($sql);
		
		$freq = self::getTagFrequency($site_id, $tag);
		
		// If there are no more references to this tag, remove the tag
		if ($freq == 0){
			$sql = DatabaseManager::prepare("DELETE FROM athena_%d_PostTags WHERE id=%d", $site_id, $tag_id);
			DatabaseManager::submitQuery($sql);
		}
		
	}

	// /////////////////////////////////////////////////////////////////////////////////

	/**
	* Remove a tag from a post, and remove from the list of tags if there are no other references
	*/
	public static function removeCategory($site_id, $post_id, $cat){
	
		// Delete post-tag mapping
		$cat_id = self::getCategoryID($site_id, $cat);
		$sql = DatabaseManager::prepare("DELETE FROM athena_%d_PostToCategories WHERE category_id = %d AND post_id = %d", $site_id, $cat_id, $post_id);
		DatabaseManager::submitQuery($sql);
		
		$freq = self::getCategoryFrequency($site_id, $cat);
		//Logger::debug("Cat $cat frequency = $freq");
		
		// If there are no more references to this tag, remove the tag
		if ($freq == 0){
			$sql = DatabaseManager::prepare("DELETE FROM athena_%d_PostCategories WHERE id=%d", $site_id, $cat_id);
			DatabaseManager::submitQuery($sql);
		}
		
	}

	// /////////////////////////////////////////////////////////////////////////////////

	public static function getTagFrequency($site_id, $tag){
		$sql = DatabaseManager::prepare("SELECT count(pt.id) FROM athena_%d_PostToTags pt INNER JOIN athena_%d_PostTags t WHERE pt.tag_id = t.id AND t.tag = %s", $site_id, $site_id, $tag);
		$freq = DatabaseManager::getVar($sql);
		if (!isset($freq)){
			$freq=0;
		}
		return $freq;
	}

	// /////////////////////////////////////////////////////////////////////////////////

	public static function getCategoryFrequency($site_id, $cat){
		$sql = DatabaseManager::prepare("SELECT count(pc.id) FROM  athena_%d_PostToCategories pc INNER JOIN athena_%d_PostCategories c WHERE pc.category_id = c.id AND c.category = %s", $site_id, $site_id, $cat);
		$freq = DatabaseManager::getVar($sql);
		if (!isset($freq)){
			$freq=0;
		}
		return $freq;
	}
	
	// /////////////////////////////////////////////////////////////////////////////////

	public static function getPostTags($site_id, $post_id){
		$sql = DatabaseManager::prepare("SELECT t.tag FROM athena_%d_PostTags t INNER JOIN athena_%d_PostToTags pt WHERE pt.post_id = %d AND pt.tag_id = t.id", $site_id, $site_id, $post_id);
		return DatabaseManager::getColumn($sql);
	}

	// /////////////////////////////////////////////////////////////////////////////////

	public static function getPostCategories($site_id, $post_id){
		$sql = DatabaseManager::prepare("SELECT c.category FROM athena_%d_PostCategories c INNER JOIN athena_%d_PostToCategories pc WHERE pc.post_id = %d AND pc.category_id = c.id", $site_id, $site_id, $post_id);
		return DatabaseManager::getColumn($sql);
	}
	
	// /////////////////////////////////////////////////////////////////////////////////

	public static function getTagID($site_id, $tag){
		$sql = DatabaseManager::prepare("SELECT id FROM athena_%d_PostTags WHERE tag = %s", $site_id, $tag);			
		return DatabaseManager::getVar($sql);				
	}

	// /////////////////////////////////////////////////////////////////////////////////

	public static function getCategoryID($site_id, $cat){
		$sql = DatabaseManager::prepare("SELECT id FROM athena_%d_PostCategories WHERE category = %s", $site_id, $cat);			
		return DatabaseManager::getVar($sql);				
	}

	// /////////////////////////////////////////////////////////////////////////////////

	public static function getTags($site_id){
		$sql = DatabaseManager::prepare("SELECT tag FROM athena_%d_PostTags", $site_id);
		return DatabaseManager::getColumn($sql);
	}

	// /////////////////////////////////////////////////////////////////////////////////

	public static function getCategories($site_id){
		$sql = DatabaseManager::prepare("SELECT category FROM athena_%d_PostCategories", $site_id);
		return DatabaseManager::getColumn($sql);
	}
		    
	// /////////////////////////////////////////////////////////////////////////////////
		
	public static function getPosts($site_id){
		$sql = DatabaseManager::prepare("SELECT * FROM athena_%d_Posts ORDER BY created DESC", $site_id);			
		return DatabaseManager::getResults($sql);				
	}

	public static function getNPosts($site_id, $n){
		$sql = DatabaseManager::prepare("SELECT * FROM athena_%d_Posts ORDER BY created DESC LIMIT %d", $site_id, $n);			
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
