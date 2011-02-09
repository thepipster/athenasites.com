<?php
/**
 * 
 * @author Mike Pritchard
 * @since January 22nd, 2010
 */
class ClientGalleryTable {

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Get all the images associated with a page
	*/
	public static function getImagesForPage($site_id, $page_id){
		//Logger::debug("getImagesForPage($site_id, $page_id)");
		$sql = DatabaseManager::prepare("SELECT * FROM athena_%d_GalleryTable gt
			INNER JOIN athena_%d_Pages pg
			INNER JOIN apollo_ThemeParas tp
			WHERE gt.theme_para_id = tp.id
			AND pg.template = tp.page_template_name
			AND pg.id = gt.page_id
			AND gt.page_id = %d 
			ORDER BY gt.slot_number ASC", $site_id, $site_id, $page_id); 	
			
		return DatabaseManager::getResults($sql);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////

    /**
     * Get a speific mapping
     * @param <type> $id
     * @return <type>
     */
	public static function getFromID($site_id, $id){	
		$sql = DatabaseManager::prepare('SELECT * FROM athena_%d_GalleryTable WHERE id = %d',  $site_id, $id ); 		
		return DatabaseManager::getSingleResult($sql);		
	}

}
?>