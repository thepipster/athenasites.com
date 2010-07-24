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
	public static function getImagesForPage($blog_id, $page_post_id){
		global $wpdb;
		$sql = $wpdb->prepare("SELECT * FROM apollo_GalleryTable WHERE page_post_id = %d AND blog_id = %d ORDER BY slot_number ASC",  $page_post_id, $blog_id); 		
		return $wpdb->get_results($sql, ARRAY_A);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getImagePostData($blog_id, $image_post_id){
		global $wpdb;
		
		$sql = $wpdb->prepare("SELECT guid, post_excerpt, post_title, post_content FROM wp_%d_posts WHERE ID=%d",  $blog_id, $image_post_id ); 			
		$data = $wpdb->get_results($sql, ARRAY_A);		
		
		if (isset($data) && isset($data[0])){
			return $data[0];
		}
		return null;
	}
		 	
	// //////////////////////////////////////////////////////////////////////////////////////

    /**
     * Get a speific mapping
     * @param <type> $id
     * @return <type>
     */
	public static function getFromID($id){	
		global $wpdb;
		$sql = $wpdb->prepare('SELECT * FROM apollo_GalleryTable WHERE id = %d',  $id ); 		
		return $wpdb->get_results($sql, ARRAY_A);		
	}

}
?>