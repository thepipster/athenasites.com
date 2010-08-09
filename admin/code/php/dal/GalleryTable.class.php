<?php
/**
 * 
 * @author Mike Pritchard
 * @since January 22nd, 2009
 */
class GalleryTable {

	/**
	* To keep the database table from growing huge, we break this table up by site id
	*/
	public static function createTableForSite($site_id){
		
		$sql = "CREATE TABLE `athena_{$site_id}_GalleryTable` (
		  `id` bigint(20) NOT NULL auto_increment,
		  `image_id` bigint(20) default NULL,
		  `page_id` bigint(20) default NULL,
		  `slot_number` tinyint(3) default NULL,
		  `gallery_number` tinyint(2) default '0',
		  `theme_para_id` int(11) default NULL,
		  PRIMARY KEY  (`id`)
		) ENGINE=MyISAM DEFAULT CHARSET=latin1;";
						
		DatabaseManager::submitQuery($sql);

		$sql = "CREATE TABLE `athena_{$site_id}_GalleryMeta` (
		  `id` int(11) NOT NULL auto_increment,
		  `page_id` bigint(20) default NULL,
		  `gallery_number` tinyint(2) default '0',
		  `title` varchar(255) default NULL,
		  `description` varchar(255) default NULL,
		  `image_id` bigint(20) default NULL,
		  `theme_para_id` bigint(20) default NULL,
		  PRIMARY KEY  (`id`)
		) ENGINE=MyISAM DEFAULT CHARSET=utf8;";

		DatabaseManager::submitQuery($sql);

	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Get all the images associated with a page
	*/
	public static function getImages($page_id, $theme_para_id, $site_id){	
		$sql = DatabaseManager::prepare("SELECT * FROM athena_%d_GalleryTable WHERE page_id = %d AND theme_para_id = %d ORDER BY slot_number ASC",  $site_id, $page_id, $theme_para_id ); 
		return DatabaseManager::getResults($sql);
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Get the id of an image assigned to the given slot
	*/
	public static function getImageIDInSlot($page_id, $slot_no, $theme_para_id, $gallery_number, $site_id){	
		$sql = DatabaseManager::prepare("SELECT image_id FROM athena_%d_GalleryTable WHERE page_id = %d AND theme_para_id = %d AND slot_number = %d",  $site_id, $page_id, $theme_para_id, $slot_no); 		
		return DatabaseManager::getVar($sql);
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

    /**
     * Get a speific mapping
     * @param <type> $id
     * @return <type>
     */
	public static function getFromID($site_id, $id){	
		$sql = DatabaseManager::prepare("SELECT * FROM athena_%d_GalleryTable WHERE id = %d",  $site_id, $id ); 		
		$data = DatabaseManager::getResults($sql);
		return $data[0];
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Create a new entry that maps an image to a gallery. We're using wordpress media
	* database, so in effect we map the image's post id to the gallery page's post id
	*/
	public static function create($image_id, $page_id, $slot_no, $theme_para_id, $gallery_number, $site_id){
		$sql = DatabaseManager::prepare("INSERT INTO athena_%d_GalleryTable (image_id, page_id, slot_number, theme_para_id, gallery_number) VALUES (%d, %d, %s, %d, %d, %d)",  $site_id, $image_id, $page_id, $slot_no, $theme_para_id, $gallery_number);
		return DatabaseManager::insert($sql);					
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function addImageToSlot($image_id, $page_id, $slot_no, $theme_para_id, $gallery_number, $site_id){

		// Is this slot occupied?
		$sql = DatabaseManager::prepare("SELECT image_id FROM athena_%d_GalleryTable WHERE slot_number = %d AND theme_para_id = %d AND gallery_number = %d AND page_id = %d",  $site_id, $slot_no, $theme_para_id, $gallery_number, $page_id);
		$current_image_id = DatabaseManager::getVar($sql);		
		$ret = false;
		
		//Logger::debug("Current image id: $current_image_id");
		
		if (isset($current_image_id)){
			
			// Move all the images above this slot
			$sql = DatabaseManager::prepare("UPDATE athena_%d_GalleryTable SET slot_number = slot_number+1 WHERE slot_number >= %d AND theme_para_id = %d AND gallery_number = %d AND page_id = %d",  $site_id, $slot_no, $theme_para_id, $gallery_number, $page_id);
			DatabaseManager::update($sql);		

			$sql = DatabaseManager::prepare("INSERT INTO athena_%d_GalleryTable (image_id, page_id, slot_number, theme_para_id, gallery_number) VALUES (%d, %d, %d, %d, %d)",  $site_id, $image_id, $page_id, $slot_no, $theme_para_id, $gallery_number);
			$ret = DatabaseManager::insert($sql);		
		}
		else {
			$sql = DatabaseManager::prepare("INSERT INTO athena_%d_GalleryTable (image_id, page_id, slot_number, theme_para_id, gallery_number) VALUES (%d, %d, %d, %d, %d)",  $site_id, $image_id, $page_id, $slot_no, $theme_para_id, $gallery_number);
			$ret = DatabaseManager::insert($sql);		
		}

		return $ret;				
			
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	public static function moveSlot($image_id, $old_slot_no, $new_slot_no, $page_id, $theme_para_id, $old_gallery_number, $new_gallery_number, $site_id){		
	
		//Logger::debug("moveSlot($old_slot_no, $new_slot_no, $page_id, $theme_para_id, $old_gallery_number, $new_gallery_number, $site_id)");
	
		// get image post id
		$check_image_id = self::getImageIDInSlot($page_id, $old_slot_no, $theme_para_id, $old_gallery_number, $site_id);
		
		Logger::debug(">>> $image_id -- $check_image_id");
		
		if (!isset($check_image_id) || $check_image_id != $image_id){
			Logger::error("No image found in slot $old_slot_no for gallery $old_gallery_number, site $site_id, page_id $page_id");
		}
		
		// clear the old slot
		self::clearSlot($old_slot_no, $page_id, $theme_para_id, $old_gallery_number, $site_id);	
		
		// add image back in
		return self::addImageToSlot($image_id, $page_id, $new_slot_no, $theme_para_id, $new_gallery_number, $site_id);
						
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function clearSlot($slot_no, $page_id, $theme_para_id, $gallery_number, $site_id){				
		//Logger::debug("clearSlot(slot_no=$slot_no, page_id=$page_id, theme_para_id=$theme_para_id, gallery_number=$gallery_number, blog_id=$blog_id)");
		$sql = DatabaseManager::prepare("DELETE FROM athena_%d_GalleryTable WHERE slot_number = %d AND page_id = %d AND theme_para_id = %d AND gallery_number = %d",  $site_id, $slot_no, $page_id, $theme_para_id, $gallery_number);
		return DatabaseManager::submitQuery($sql);		
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	public static function removeImage($image_id, $page_id, $slot_no, $theme_para_id, $gallery_number, $site_id){				
		return DatabaseManager::submitQuery(DatabaseManager::prepare("DELETE FROM athena_%d_GalleryTable WHERE slot_number = %d AND image_id = %d AND page_id = %d AND theme_para_id = %d AND gallery_number = %d",  $site_id, $slot_no, $image_id, $page_id, $theme_para_id, $gallery_number));		
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	public static function delete($site_id, $id){				
		return DatabaseManager::submitQuery(DatabaseManager::prepare("DELETE FROM athena_%d_GalleryTable WHERE id = %d",  $site_id, $id));
	}

	// //////////////////////////////////////////////////////////////////////////////////////
	//
	// Gallery Meta Data
	//
	// //////////////////////////////////////////////////////////////////////////////////////

    /**
     * Get all the meta data for a gallery (such as title, associated image etc)
     * @param <type> $page_id
     * @return <type>
     */
	public static function getMeta($page_id, $theme_para_id, $site_id){
		$sql = DatabaseManager::prepare("SELECT * FROM athena_%d_GalleryMeta WHERE page_id = %d AND theme_para_id = %d ORDER BY gallery_number ASC", $site_id, $page_id, $theme_para_id); 		
		return DatabaseManager::getResults($sql);
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Delete a sub-gallery for a multi-gallery theme para, and update all the other sub-gallery numbers so that they stay consitent
	*/
	public static function deleteSubGallery($page_id, $theme_para_id, $gallery_number, $site_id){	

		$sql = DatabaseManager::prepare("DELETE FROM athena_%d_GalleryMeta WHERE page_id = %d AND theme_para_id = %d AND gallery_number = %d", $site_id, $page_id, $theme_para_id, $gallery_number); 		
		DatabaseManager::submitQuery($sql);
		
		// Update the gallery number for all the sub-galleries
		$sql = DatabaseManager::prepare("UPDATE athena_%d_GalleryMeta SET gallery_number = gallery_number - 1 WHERE page_id = %d AND theme_para_id = %d AND gallery_number > %d", $site_id, $page_id, $theme_para_id, $gallery_number); 		
		DatabaseManager::submitQuery($sql);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////
	
	public static function getGalleryMeta($page_id, $theme_para_id, $gallery_number, $site_id){	
		$sql = DatabaseManager::prepare("SELECT * FROM athena_%d_GalleryMeta WHERE page_id = %d AND theme_para_id = %d AND gallery_number = %d", $site_id, $page_id, $theme_para_id, $gallery_number); 		
		return DatabaseManager::getResults($sql, ARRAY_A);
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function setGalleryTitle($page_id, $theme_para_id, $gallery_number, $title, $site_id){

		global $wpdb;		
		
		$meta = self::getGalleryMeta($page_id, $theme_para_id, $gallery_number, $site_id);
				
		if (!isset($meta)){
			$sql = DatabaseManager::prepare("INSERT INTO athena_%d_GalleryMeta (page_id, theme_para_id, gallery_number, title) VALUES (%d, %d, %d, %s)",  $site_id, $page_id, $theme_para_id, $gallery_number, $title);
			return DatabaseManager::insert($sql);		
		}
		else {
			$sql = DatabaseManager::prepare("UPDATE athena_%d_GalleryMeta SET title = %s WHERE page_id = %d AND theme_para_id = %d AND gallery_number = %d", $site_id, $title, $page_id, $theme_para_id, $gallery_number);
			return DatabaseManager::update($sql);		
		}

	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getGalleryTitle($page_id, $theme_para_id, $gallery_number, $blog_id){
		$sql = DatabaseManager::prepare("SELECT title FROM athena_%d_GalleryMeta WHERE page_id = %d AND theme_para_id = %d AND gallery_number = %d AND blog_id = %d", $page_id, $theme_para_id, $gallery_number, $blog_id); 		
		return DatabaseManager::getVar($sql);
	}

	// //////////////////////////////////////////////////////////////////////////////////////
	
	public static function setGalleryThumbnail($page_id, $theme_para_id, $gallery_number, $image_id, $blog_id){
		
		$meta = self::getGalleryMeta($page_id, $theme_para_id, $gallery_number, $blog_id);
		
		if (!isset($meta)){
			$sql = DatabaseManager::prepare("INSERT INTO athena_%d_GalleryMeta (page_id, theme_para_id, gallery_number, image_id, blog_id) VALUES (%d, %d, %d, %d, %d)",  $page_id, $theme_para_id, $gallery_number, $image_id, $blog_id);
			return DatabaseManager::insert($sql);		
		}
		else {
			$sql = DatabaseManager::prepare("UPDATE athena_%d_GalleryMeta SET image_id = %d WHERE page_id = %d AND theme_para_id = %d AND gallery_number = %d AND blog_id = %d", $image_id, $page_id, $theme_para_id, $gallery_number, $blog_id);
			return DatabaseManager::update($sql);		
		}
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getGalleryThumbnail($page_id, $theme_para_id, $gallery_number, $blog_id){
		$sql = DatabaseManager::prepare("SELECT image_id FROM athena_%d_GalleryMeta WHERE page_id = %d AND theme_para_id = %d AND gallery_number = %d AND blog_id = %d", $page_id, $theme_para_id, $gallery_number, $blog_id); 		
		return DatabaseManager::getVar($sql);
	}

}
?>