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
		  `created` datetime default NULL,
		  `template` varchar(255) default NULL,
		  PRIMARY KEY  (`id`)
		) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;";
						
		DatabaseManager::submitQuery($sql);

	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Create a new site
     */
	public static function create($user_id, $site_id, $parent_page_id, $content, $status, $title, $template_name){	
		
        // Get data in correct locale (SQL's NOW() doesn't do that)
        $target_date  = mktime(date("H"), date("i"), date("s"), date("m")  , date("d"), date("Y"));
        $date_str = date('Y-m-d H:i:s', $target_date);
		
		$sql = DatabaseManager::prepare("INSERT INTO athena_{$site_id}_Pages (user_id, content, status, parent_page_id, title, last_edit, created, template) VALUES (%d, %s, %s, %d, %s, '$date_str', '$date_str', %s)", $site_id, $user_id, $content, $status, $parent_page_id, $title, $template_name);			
		return DatabaseManager::insert($sql);
    }

	// ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Update a site
     */
    public static function updateContent($site_id, $page_id, $content){
		$sql = DatabaseManager::prepare("UPDATE athena_{$site_id}_Pages SET content = %s WHERE id = %d", $site_id, $content, $page_id);
		return DatabaseManager::update($sql);
    }
    
	// /////////////////////////////////////////////////////////////////////////////////

	public static function getPages($site_id){
		$sql = DatabaseManager::prepare("SELECT * FROM athena_{$site_id}_Pages", $site_id);			
		return DatabaseManager::getResults($sql);				
	}

	// /////////////////////////////////////////////////////////////////////////////////

	public static function getPage($site_id, $page_id){
		$sql = DatabaseManager::prepare("SELECT * FROM athena_{$site_id}_Pages WHERE id = %d", $site_id, $page_id);			
		return DatabaseManager::getResults($sql);				
	}
	
	// /////////////////////////////////////////////////////////////////////////////////
}
?>
