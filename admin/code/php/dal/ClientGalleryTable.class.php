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
		$sql = DatabaseManager::prepare("SELECT * FROM athena_%d_GalleryTable WHERE page_id = %d ORDER BY slot_number ASC",  $site_id, $page_id); 		
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