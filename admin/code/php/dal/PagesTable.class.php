<?php
/**
 *
 * @since August 7th, 2010
 * @author mikep
 */
class PagesTable {

	/**
	* To keep the database table from growing huge, we break this table up by site id
	*/
	public static function createTableForSite($site_id){
		
		$sql = "CREATE TABLE `athena_{$site_id}_Pages` (
		  `id` int(11) NOT NULL auto_increment,
		  `user_id` int(11) default NULL,
		  `content` text,
		  `status` enum('Published','Draft','Private','Revision') default 'Draft',
		  `last_edit` datetime default NULL,
		  `parent_page_id` int(11) default '0',
		  `title` varchar(60) default NULL,
		  `browser_title` varchar(120) default NULL,
		  `description` varchar(255) default NULL,
		  `slug` varchar(255) default NULL,
		  `path` varchar(255) default NULL,
		  `created` datetime default NULL,
		  `template` varchar(255) default NULL,
		  `is_homepage` tinyint(1) default '0',
		  `is_blogpage` tinyint(1) default '0',
		  `page_order` tinyint(3) default '0',
		  `source` varchar(20) default NULL,
		  `source_id` varchar(30) default NULL,
		  PRIMARY KEY  (`id`)
		) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;";
						
		DatabaseManager::submitQuery($sql);

	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Create a new site
     */
	public static function create($user_id, $site_id, $parent_page_id, $content, $status, $title, $template_name, $slug, $path, $order, $ishome, $isblog){	
		
        // Get data in correct locale (SQL's NOW() doesn't do that)
        $target_date  = mktime(date("H"), date("i"), date("s"), date("m")  , date("d"), date("Y"));
        $date_str = date('Y-m-d H:i:s', $target_date);
		
		/*
		$is_blogpage = 0;
		if (strpos(strtolower("  " . $template_name), 'blog') > 0){
			$is_blogpage = 1;			
		}
		*/
		
		$sql = DatabaseManager::prepare("INSERT INTO athena_%d_Pages (user_id, content, status, parent_page_id, title, last_edit, created, template, slug, path, page_order, is_homepage, is_blogpage) VALUES (%d, %s, %s, %d, %s, '$date_str', '$date_str', %s, %s, %s, %d, %d, %d)", 
			$site_id, $user_id, $content, $status, $parent_page_id, $title, $template_name, $slug, $path, $order, $ishome, $isblog);
					
		return DatabaseManager::insert($sql);
    }

	// ///////////////////////////////////////////////////////////////////////////////////////

	public static function createRevision($site_id, $page_id){
	
		// How many revisions do we have for this post?
		$no_revs = DatabaseManager::getVar(DatabaseManager::prepare("SELECT count(id) FROM athena_%d_Pages WHERE source_id = %d AND status = 'Revision'", $site_id, $page_id));

		if ($no_revs >= 2){
			// Delete the oldest revisions
			DatabaseManager::submitQuery(DatabaseManager::prepare("DELETE FROM athena_%d_Pages WHERE source_id = %d AND status = 'Revision' AND id = 
			(SELECT id FROM athena_%d_Pages WHERE source_id = %d AND status = 'Revision' ORDER BY created LIMIT 1) ", $site_id, $post_id));
		}
			
        // Get data in correct locale (SQL's NOW() doesn't do that)
        $date_str = date('Y-m-d H:i:s', time());
		
		$page = self::getPage($site_id, $page_id);

        $sql = DatabaseManager::prepare("INSERT INTO athena_%d_Pages (
        	user_id, 
        	content, 
        	status, 
        	last_edit, 
        	parent_page_id, 
        	title, 
        	browser_title, 
        	description, 
        	slug, 
        	path,
        	created, 
        	template, 
        	is_homepage, 
        	is_blogpage, 
        	page_order, 
        	source,
        	source_id)
			VALUES (%d, %s, %s, %s, %d, %s, %s, %s, %s, %s, %s, %s, %d, %d, %d, %s, %d)", 
				$site_id, 
				$page['user_id'],				 
				$page['content'],				 
				'Revision',				 
				$date_str,				 
				$page['parent_page_id'],				 
				$page['title'],				 
				$page['browser_title'],				 
				$page['description'],				 
				$page['slug'],				 
				$page['path'],				 
				$page['created'],				 
				$page['template'],				 
				$page['is_homepage'],				 
				$page['is_blogpage'],				 
				$page['page_order'],				 
				'Revision',				 
				$page_id);				 
		
        return DatabaseManager::insert($sql);	
	
	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////

	public static function delete($site_id, $page_id){
	
		// Update any pages with this as the parent page id
		$sql = DatabaseManager::prepare("UPDATE athena_%d_Pages SET parent_page_id = 0 WHERE parent_page_id = %d", $site_id, $page_id);			
		DatabaseManager::update($sql);

		// Delete all revisions
		$sql = DatabaseManager::prepare("DELETE FROM athena_%d_Pages WHERE source_id = %d AND status = 'Revision'", $site_id, $page_id);			
		DatabaseManager::submitQuery($sql);

		// Delete the page	
		$sql = DatabaseManager::prepare("DELETE FROM athena_%d_Pages WHERE id = %d", $site_id, $page_id);			
		return DatabaseManager::submitQuery($sql);
		
		
	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////

    public static function update($page_id, $user_id, $site_id, $parent_page_id, $content, $status, $title, $template_name, $slug, $path, $order, $description, $browser_title){

        $target_date  = mktime(date("H"), date("i"), date("s"), date("m")  , date("d"), date("Y"));
        $date_str = date('Y-m-d H:i:s', $target_date);
/*
		$is_blogpage = 0;
		if (strpos(strtolower("  " . $template_name), 'blog') > 0){
			$is_blogpage = 1;			
			$slug = "blog";
		}

		$ishome = 0;
		if (strpos(strtolower("  " . $template_name), 'home') > 0){
			$ishome = 1;
			$slug = "index.html";
		}
*/
		$sql = DatabaseManager::prepare("UPDATE athena_%d_Pages SET parent_page_id=%d, content=%s, title=%s, slug=%s, status=%s, path=%s, user_id=%d, page_order=%d, template=%s, last_edit='$date_str', description = %s, browser_title = %s WHERE id = %d", 
			$site_id, $parent_page_id, $content, $title, $slug, $status, $path, $user_id, $order, $template_name, $description, $browser_title, $page_id);
		return DatabaseManager::update($sql);
    }

	// /////////////////////////////////////////////////////////////////////////////////

    public static function updatePath($page_id, $site_id, $path){
		$sql = DatabaseManager::prepare("UPDATE athena_%d_Pages SET path=%s WHERE id = %d", $site_id, $path, $page_id);
		return DatabaseManager::update($sql);
    }

	// /////////////////////////////////////////////////////////////////////////////////
    
	public static function getChildPages($site_id, $parent_page_id){
		$sql = DatabaseManager::prepare("SELECT * FROM athena_%d_Pages WHERE parent_page_id=%d AND status != 'Revision'", $site_id, $parent_page_id);			
		return DatabaseManager::getResults($sql);				
	}

	// /////////////////////////////////////////////////////////////////////////////////

	public static function getPageSummaries($site_id){
		$sql = DatabaseManager::prepare("SELECT id, user_id, title, status FROM athena_%d_Pages WHERE status != 'Revision' ORDER BY created DESC", $site_id);			
		return DatabaseManager::getResults($sql);				
	}

	// /////////////////////////////////////////////////////////////////////////////////

	public static function getPages($site_id){
		$sql = DatabaseManager::prepare("SELECT * FROM athena_%d_Pages WHERE status != 'Revision' ORDER BY page_order", $site_id);			
		return DatabaseManager::getResults($sql);				
	}

	// /////////////////////////////////////////////////////////////////////////////////

	public static function getPage($site_id, $page_id){
		//Logger::debug("getPage(site_id = $site_id, page_id = $page_id");	
		$sql = DatabaseManager::prepare("SELECT * FROM athena_%d_Pages WHERE id = %d", $site_id, $page_id);		
		$data = DatabaseManager::getResults($sql);				
		if (isset($data[0])){
			return $data[0];
		}
		return null;
	}
	
	// /////////////////////////////////////////////////////////////////////////////////

	public static function getIsHome($site_id, $page_id){
		$sql = DatabaseManager::prepare("SELECT is_homepage FROM athena_%d_Pages WHERE id = %d", $site_id, $page_id);		
		return DatabaseManager::getVar($sql);				
	}

	// /////////////////////////////////////////////////////////////////////////////////

	public static function getHomepage($site_id){
		//Logger::debug("getPage(site_id = $site_id, page_id = $page_id");	
		$sql = DatabaseManager::prepare("SELECT * FROM athena_%d_Pages WHERE is_homepage = 1 AND status != 'Revision'", $site_id);		
		$data = DatabaseManager::getResults($sql);				
		if (isset($data[0])){
			return $data[0];
		}
		return null;
	}

	public static function getHomepageID($site_id){
		//Logger::debug("getPage(site_id = $site_id, page_id = $page_id");	
		$sql = DatabaseManager::prepare("SELECT id FROM athena_%d_Pages WHERE is_homepage = 1 AND status != 'Revision'", $site_id);		
		return DatabaseManager::getVar($sql);				
	}

	// /////////////////////////////////////////////////////////////////////////////////

	public static function getBlogpage($site_id){
		//Logger::debug("getPage(site_id = $site_id, page_id = $page_id");	
		$sql = DatabaseManager::prepare("SELECT * FROM athena_%d_Pages WHERE is_blogpage = 1 AND status != 'Revision'", $site_id);		
		return DatabaseManager::getSingleResult($sql);				
	}
	
	public static function getBlogpageSlug($site_id){
		//Logger::debug("getPage(site_id = $site_id, page_id = $page_id");	
		$sql = DatabaseManager::prepare("SELECT slug FROM athena_%d_Pages WHERE is_blogpage = 1 AND status != 'Revision'", $site_id);		
		return DatabaseManager::getVar($sql);				
	}
	
	
	// /////////////////////////////////////////////////////////////////////////////////

	public static function getPageFromSlug($site_id, $page_slug){
		//Logger::debug("getPageFromSlug(site_id = $site_id, page_slug = $page_slug");	
		$sql = DatabaseManager::prepare("SELECT * FROM athena_%d_Pages WHERE slug = %s AND status != 'Revision'", $site_id, $page_slug);		
		$data = DatabaseManager::getSingleResult($sql);				
		if (isset($data)){
			return $data;
		}
		return null;
	}
	
	// /////////////////////////////////////////////////////////////////////////////////
}
?>
