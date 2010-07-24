<?php
/**
 * 
 * @author Mike Pritchard
 * @since January 22nd, 2009
 */
class GalleryTable {

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Get all the images associated with a page
	*/
	public static function getImages($page_post_id, $theme_para_id, $blog_id){
	
		global $wpdb;		
		
		$sql = $wpdb->prepare("SELECT * FROM apollo_GalleryTable WHERE page_post_id = %d AND theme_para_id = %d AND blog_id = %d ORDER BY slot_number ASC",  $page_post_id, $theme_para_id, $blog_id ); 
		return $wpdb->get_results($sql, ARRAY_A);

	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Get the id of an image assigned to the given slot
	*/
	public static function getImageIDInSlot($page_post_id, $slot_no, $theme_para_id, $gallery_number, $blog_id){
	
		global $wpdb;		
		
		$sql = $wpdb->prepare("SELECT image_post_id FROM apollo_GalleryTable WHERE page_post_id = %d AND theme_para_id = %d AND blog_id = %d AND slot_number = %d",  $page_post_id, $theme_para_id, $blog_id, $slot_no); 		
		return $wpdb->get_var($sql);
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

    /**
     * Get a speific mapping
     * @param <type> $id
     * @return <type>
     */
	public static function getFromID($id){
	
		global $wpdb;		
		
		$sql = $wpdb->prepare("SELECT * FROM apollo_GalleryTable WHERE id = %d",  $id ); 		
		$data = $wpdb->get_results($sql, ARRAY_A);
		return $data[0];
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Create a new entry that maps an image to a gallery. We're using wordpress media
	* database, so in effect we map the image's post id to the gallery page's post id
	*/
	public static function create($image_post_id, $page_post_id, $slot_no, $theme_para_id, $gallery_number, $blog_id){

		global $wpdb;		
		
		$sql = $wpdb->prepare("INSERT INTO apollo_GalleryTable (image_post_id, page_post_id, slot_number, theme_para_id, gallery_number, blog_id) VALUES (%d, %d, %s, %d, %d, %d, %d)",  $image_post_id, $page_post_id, $slot_no, $theme_para_id, $gallery_number, $blog_id);
		//error_log($sql);
		return $wpdb->query($sql);		
			
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function addImageToSlot($image_post_id, $page_post_id, $slot_no, $theme_para_id, $gallery_number, $blog_id){

		global $wpdb;		

		// Is this slot occupied?
		$sql = $wpdb->prepare("SELECT image_post_id FROM apollo_GalleryTable WHERE slot_number = %d AND blog_id = %d AND theme_para_id = %d AND gallery_number = %d AND page_post_id = %d",  $slot_no, $blog_id, $theme_para_id, $gallery_number, $page_post_id);
		$current_image_id = $wpdb->get_var($sql);		
		$ret = false;
		
		//ApolloLogger::debug("Current image id: $current_image_id");
		
		if (isset($current_image_id)){
			
			// Move all the images above this slot
			$sql = $wpdb->prepare("UPDATE apollo_GalleryTable SET slot_number = slot_number+1 WHERE slot_number >= %d AND blog_id = %d AND theme_para_id = %d AND gallery_number = %d AND page_post_id = %d",  $slot_no, $blog_id, $theme_para_id, $gallery_number, $page_post_id);
			$wpdb->query($sql);		

			$sql = $wpdb->prepare("INSERT INTO apollo_GalleryTable (image_post_id, page_post_id, slot_number, theme_para_id, gallery_number, blog_id) VALUES (%d, %d, %d, %d, %d, %d)",  $image_post_id, $page_post_id, $slot_no, $theme_para_id, $gallery_number, $blog_id);
			$ret = $wpdb->query($sql);		
		}
		else {
			$sql = $wpdb->prepare("INSERT INTO apollo_GalleryTable (image_post_id, page_post_id, slot_number, theme_para_id, gallery_number, blog_id) VALUES (%d, %d, %d, %d, %d, %d)",  $image_post_id, $page_post_id, $slot_no, $theme_para_id, $gallery_number, $blog_id);
			$ret = $wpdb->query($sql);		
		}

		return $ret;				
			
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	public static function moveSlot($image_post_id, $old_slot_no, $new_slot_no, $page_post_id, $theme_para_id, $old_gallery_number, $new_gallery_number, $blog_id){		
	
		ApolloLogger::debug("moveSlot($old_slot_no, $new_slot_no, $page_post_id, $theme_para_id, $old_gallery_number, $new_gallery_number, $blog_id)");
	
		// get image post id
		$check_image_post_id = self::getImageIDInSlot($page_post_id, $old_slot_no, $theme_para_id, $old_gallery_number, $blog_id);
		
		ApolloLogger::debug(">>> $image_post_id -- $check_image_post_id");
		
		if (!isset($check_image_post_id) || $check_image_post_id != $image_post_id){
			ApolloLogger::error("No image found in slot $old_slot_no for gallery $old_gallery_number, blog $blog_id, page_id $page_post_id");
		}
		
		// clear the old slot
		self::clearSlot($old_slot_no, $page_post_id, $theme_para_id, $old_gallery_number, $blog_id);	
		
		// add image back in
		return self::addImageToSlot($image_post_id, $page_post_id, $new_slot_no, $theme_para_id, $new_gallery_number, $blog_id);
						
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function clearSlot($slot_no, $page_post_id, $theme_para_id, $gallery_number, $blog_id){				
		//ApolloLogger::debug("clearSlot(slot_no=$slot_no, page_post_id=$page_post_id, theme_para_id=$theme_para_id, gallery_number=$gallery_number, blog_id=$blog_id)");
		global $wpdb;		
		$sql = $wpdb->prepare("DELETE FROM apollo_GalleryTable WHERE slot_number = %d AND page_post_id = %d AND theme_para_id = %d AND gallery_number = %d AND blog_id = %d",  $slot_no, $page_post_id, $theme_para_id, $gallery_number, $blog_id);
		return $wpdb->query($sql);		
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	public static function removeImage($image_post_id, $page_post_id, $slot_no, $theme_para_id, $gallery_number, $blog_id){				

		global $wpdb;		
		
		return $wpdb->query($wpdb->prepare("DELETE FROM apollo_GalleryTable WHERE slot_number = %d AND image_post_id = %d AND page_post_id = %d AND theme_para_id = %d AND gallery_number = %d AND blog_id = %d",  $slot_no, $image_post_id, $page_post_id, $theme_para_id, $gallery_number, $blog_id));		
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	public static function delete($id){				

		global $wpdb;		
		
		return $wpdb->query($wpdb->prepare("DELETE FROM apollo_GalleryTable WHERE id = %d",  $id));
	}

	// //////////////////////////////////////////////////////////////////////////////////////
	//
	// Gallery Meta Data
	//
	// //////////////////////////////////////////////////////////////////////////////////////

    /**
     * Get all the meta data for a gallery (such as title, associated image etc)
     * @param <type> $page_post_id
     * @return <type>
     */
	public static function getMeta($page_post_id, $theme_para_id, $blog_id){
	
		global $wpdb;		
		
		$sql = $wpdb->prepare("SELECT * FROM apollo_GalleryMeta WHERE page_post_id = %d AND theme_para_id = %d AND blog_id = %d ORDER BY gallery_number ASC", $page_post_id, $theme_para_id, $blog_id); 		
		return $wpdb->get_results($sql, ARRAY_A);
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Delete a sub-gallery for a multi-gallery theme para, and update all the other sub-gallery numbers so that they stay consitent
	*/
	public static function deleteSubGallery($page_post_id, $theme_para_id, $gallery_number, $blog_id){	

		global $wpdb;				
		$sql = $wpdb->prepare("DELETE FROM apollo_GalleryMeta WHERE page_post_id = %d AND theme_para_id = %d AND gallery_number = %d AND blog_id = %d", $page_post_id, $theme_para_id, $gallery_number, $blog_id); 		
		$wpdb->query($sql);
		
		// Update the gallery number for all the sub-galleries
		$sql = $wpdb->prepare("UPDATE apollo_GalleryMeta SET gallery_number = gallery_number - 1 WHERE page_post_id = %d AND theme_para_id = %d AND gallery_number > %d AND blog_id = %d", $page_post_id, $theme_para_id, $gallery_number, $blog_id); 		
		$wpdb->query($sql);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////
	
	public static function getGalleryMeta($page_post_id, $theme_para_id, $gallery_number, $blog_id){
	
		global $wpdb;		
		
		$sql = $wpdb->prepare("SELECT * FROM apollo_GalleryMeta WHERE page_post_id = %d AND theme_para_id = %d AND gallery_number = %d AND blog_id = %d", $page_post_id, $theme_para_id, $gallery_number, $blog_id); 		
		return $wpdb->get_results($sql, ARRAY_A);
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function setGalleryTitle($page_post_id, $theme_para_id, $gallery_number, $title, $blog_id){

		global $wpdb;		
		
		$meta = self::getGalleryMeta($page_post_id, $theme_para_id, $gallery_number, $blog_id);
				
		if (!isset($meta)){
			$sql = $wpdb->prepare("INSERT INTO apollo_GalleryMeta (page_post_id, theme_para_id, gallery_number, title, blog_id) VALUES (%d, %d, %d, %s, %d)",  $page_post_id, $theme_para_id, $gallery_number, $title, $blog_id);
		}
		else {
			$sql = $wpdb->prepare("UPDATE apollo_GalleryMeta SET title = %s WHERE page_post_id = %d AND theme_para_id = %d AND gallery_number = %d AND blog_id = %d", $title, $page_post_id, $theme_para_id, $gallery_number, $blog_id);
		}

		//ApolloLogger::debug($sql);
				
		return $wpdb->query($sql);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getGalleryTitle($page_post_id, $theme_para_id, $gallery_number, $blog_id){
		global $wpdb;				
		$sql = $wpdb->prepare("SELECT title FROM apollo_GalleryMeta WHERE page_post_id = %d AND theme_para_id = %d AND gallery_number = %d AND blog_id = %d", $page_post_id, $theme_para_id, $gallery_number, $blog_id); 		
		return $wpdb->get_var($sql);
	}

	// //////////////////////////////////////////////////////////////////////////////////////
	
	public static function setGalleryThumbnail($page_post_id, $theme_para_id, $gallery_number, $image_post_id, $blog_id){

		global $wpdb;		
		
		$meta = self::getGalleryMeta($page_post_id, $theme_para_id, $gallery_number, $blog_id);
		
		if (!isset($meta)){
			$sql = $wpdb->prepare("INSERT INTO apollo_GalleryMeta (page_post_id, theme_para_id, gallery_number, image_post_id, blog_id) VALUES (%d, %d, %d, %d, %d)",  $page_post_id, $theme_para_id, $gallery_number, $image_post_id, $blog_id);
		}
		else {
			$sql = $wpdb->prepare("UPDATE apollo_GalleryMeta SET image_post_id = %d WHERE page_post_id = %d AND theme_para_id = %d AND gallery_number = %d AND blog_id = %d", $image_post_id, $page_post_id, $theme_para_id, $gallery_number, $blog_id);
		}
		
		return $wpdb->query($sql);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getGalleryThumbnail($page_post_id, $theme_para_id, $gallery_number, $blog_id){
		global $wpdb;				
		$sql = $wpdb->prepare("SELECT image_post_id FROM apollo_GalleryMeta WHERE page_post_id = %d AND theme_para_id = %d AND gallery_number = %d AND blog_id = %d", $page_post_id, $theme_para_id, $gallery_number, $blog_id); 		
		return $wpdb->get_var($sql);
	}

}
?>