<?php
/**
 * 
 * @author Mike Pritchard
 * @since January 22nd, 2009
 */
class ClientGalleryTable {

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Get all the images associated with a page
	*/
	public static function getImagesForPage($wpdb, $page_post_id){
		$sql = $wpdb->prepare("SELECT * FROM apollo_GalleryTable WHERE page_post_id = %d ORDER BY slot_number ASC",  $page_post_id ); 		
		return $wpdb->get_results($sql, ARRAY_A);		
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

    /**
     * Get a speific mapping
     * @param <type> $id
     * @return <type>
     */
	public static function getFromID($id){	
		$sql = $wpdb->prepare('SELECT * FROM apollo_GalleryTable WHERE id = %d',  $id ); 		
		return $wpdb->get_results($sql, ARRAY_A);		
	}

}
?>