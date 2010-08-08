<?php
/**
 *
 * @since August 7th, 2010
 * @author mikep
 */
class PagesTable {

	// ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Create a new site
     */
	public static function create($user_id, $site_id, $parent_page_id, $content, $status, $title){	
		
        // Get data in correct locale (SQL's NOW() doesn't do that)
        $target_date  = mktime(date("H"), date("i"), date("s"), date("m")  , date("d"), date("Y"));
        $date_str = date('Y-m-d H:i:s', $target_date);
		
		$sql = DatabaseManager::prepare("INSERT INTO athena_Pages (user_id, site_id, content, status, parent_page_id, title, last_edit, created) VALUES (%d, %d, %s, %s, %d, %s, '$date_str', '$date_str')", $user_id, $site_id, $content, $status, $parent_page_id, $title);			
		return DatabaseManager::insert($sql);
    }

	// ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Update a site
     */
    public static function updateContent($site_id, $page_id, $content){
		$sql = DatabaseManager::prepare("UPDATE athena_Pages SET content = %s WHERE id = %d AND site_id = %d", $content, $page_id, $site_id);
		return DatabaseManager::update($sql);
    }
    
	// /////////////////////////////////////////////////////////////////////////////////

	public static function getPages($site_id){
		$sql = DatabaseManager::prepare("SELECT * FROM athena_Pages WHERE site_id = %d ", $site_id);			
		return DatabaseManager::getResults($sql);				
	}
	
	// /////////////////////////////////////////////////////////////////////////////////
}
?>
