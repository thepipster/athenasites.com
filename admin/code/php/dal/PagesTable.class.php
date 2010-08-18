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
		  `title` varchar(255) default NULL,
		  `slug` varchar(255) default NULL,
		  `path` varchar(255) default NULL,
		  `created` datetime default NULL,
		  `template` varchar(255) default NULL,
		  `is_homepage` tinyint(1) default '0',
		  `is_blogpage` tinyint(1) default '0',
		  `page_order` tinyint(3) default '0',
		  PRIMARY KEY  (`id`)
		) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;";
						
		DatabaseManager::submitQuery($sql);

	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Create a new site
     */
	public static function create($user_id, $site_id, $parent_page_id, $content, $status, $title, $template_name, $slug, $path, $order, $ishome){	
		
        // Get data in correct locale (SQL's NOW() doesn't do that)
        $target_date  = mktime(date("H"), date("i"), date("s"), date("m")  , date("d"), date("Y"));
        $date_str = date('Y-m-d H:i:s', $target_date);
		
		$sql = DatabaseManager::prepare("INSERT INTO athena_%d_Pages (user_id, content, status, parent_page_id, title, last_edit, created, template, slug, path, page_order, is_homepage) VALUES (%d, %s, %s, %d, %s, '$date_str', '$date_str', %s, %s, %s, %d, %d)", 
			$site_id, $user_id, $content, $status, $parent_page_id, $title, $template_name, $slug, $path, $order, $ishome);
			
		return DatabaseManager::insert($sql);
    }

	// ///////////////////////////////////////////////////////////////////////////////////////

	public static function delete($site_id, $page_id){
	
		// Update any pages with this as the parent page id
		$sql = DatabaseManager::prepare("UPDATE athena_%d_Pages SET parent_page_id = 0 WHERE parent_page_id = %d", $site_id, $page_id);			
		DatabaseManager::update($sql);

		// Delete the page	
		$sql = DatabaseManager::prepare("DELETE FROM athena_%d_Pages WHERE id = %d", $site_id, $page_id);			
		return DatabaseManager::submitQuery($sql);
		
	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////

    public static function update($page_id, $user_id, $site_id, $parent_page_id, $content, $status, $title, $template_name, $slug, $path, $order, $ishome){

        $target_date  = mktime(date("H"), date("i"), date("s"), date("m")  , date("d"), date("Y"));
        $date_str = date('Y-m-d H:i:s', $target_date);

		$sql = DatabaseManager::prepare("UPDATE athena_%d_Pages SET parent_page_id=%d, content=%s, title=%s, slug=%s, status=%s, path=%s, user_id=%d, page_order=%d, is_homepage=%d, template=%s, last_edit='$date_str' WHERE id = %d", 
			$site_id, $parent_page_id, $content, $title, $slug, $status, $path, $user_id, $order, $ishome, $template_name, $page_id);
		return DatabaseManager::update($sql);
    }

	// /////////////////////////////////////////////////////////////////////////////////

    public static function updatePath($page_id, $site_id, $path){
		$sql = DatabaseManager::prepare("UPDATE athena_%d_Pages SET path=%s WHERE id = %d", $site_id, $path, $page_id);
		return DatabaseManager::update($sql);
    }

	// /////////////////////////////////////////////////////////////////////////////////
    
	public static function getChildPages($site_id, $parent_page_id){
		$sql = DatabaseManager::prepare("SELECT * FROM athena_%d_Pages WHERE parent_page_id=%d", $site_id, $parent_page_id);			
		return DatabaseManager::getResults($sql);				
	}

	// /////////////////////////////////////////////////////////////////////////////////

	public static function getPages($site_id){
		$sql = DatabaseManager::prepare("SELECT * FROM athena_%d_Pages ORDER BY page_order", $site_id);			
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

	public static function getHomepage($site_id){
		//Logger::debug("getPage(site_id = $site_id, page_id = $page_id");	
		$sql = DatabaseManager::prepare("SELECT * FROM athena_%d_Pages WHERE is_homepage = 1", $site_id);		
		$data = DatabaseManager::getResults($sql);				
		if (isset($data[0])){
			return $data[0];
		}
		return null;
	}

	// /////////////////////////////////////////////////////////////////////////////////

	public static function getPageFromSlug($site_id, $page_slug){
		//Logger::debug("getPageFromSlug(site_id = $site_id, page_slug = $page_slug");	
		$sql = DatabaseManager::prepare("SELECT * FROM athena_%d_Pages WHERE slug = %s", $site_id, $page_slug);		
		$data = DatabaseManager::getSingleResult($sql);				
		if (isset($data)){
			return $data;
		}
		return null;
	}
	
	// /////////////////////////////////////////////////////////////////////////////////
}
?>
