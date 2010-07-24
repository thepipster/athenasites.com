<?php
/**
 * 
 * @author Mike Pritchard
 * @since March 24th, 2010
 */
class FolderTable {

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Get all the images associated with a page
	*/
	public static function getFoldersForBlog($blog_id){
		global $wpdb;
		$sql = $wpdb->prepare("SELECT * FROM apollo_Folders WHERE blog_id = %d ORDER BY name ASC",  $blog_id ); 		
		return $wpdb->get_results($sql, ARRAY_A);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getImageEntriesForBlog($blog_id){
		global $wpdb;
		$sql = $wpdb->prepare("SELECT media.* FROM apollo_MediaToFolder media INNER JOIN apollo_Folders folders WHERE folders.id = media.folder_id AND folders.blog_id = %d",  $blog_id ); 		
		return $wpdb->get_results($sql, ARRAY_A);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getMediaFolderID($media_post_id, $blog_id){
		global $wpdb;
		$sql = $wpdb->prepare("SELECT folder_id FROM apollo_MediaToFolder WHERE media_post_id = %d AND blog_id = %d",  $media_post_id, $blog_id ); 		
		return $wpdb->get_var($sql);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Add media to a folder, if the media exists in another folder then move it
	*/
	public static function addMediaToFolder($folder_id, $media_post_id, $blog_id){
	
		//Logger::debug("addMediaToFolder($folder_id, $media_post_id)");

		global $wpdb;

		// Check to see if this media already has an entry (i.e. its being moved)		
		$sql = $wpdb->prepare("SELECT folder_id FROM apollo_MediaToFolder WHERE media_post_id = %d AND blog_id = %d",  $media_post_id, $blog_id); 		
		$current_folder_id = $wpdb->get_var($sql);		
		
		if (isset($current_folder_id)){
			$sql = $wpdb->prepare("UPDATE apollo_MediaToFolder SET folder_id = %d WHERE media_post_id = %d AND blog_id = %d",  $folder_id, $media_post_id, $blog_id); 		
			return $wpdb->query($sql);		
		}

		$sql = $wpdb->prepare("INSERT INTO apollo_MediaToFolder (folder_id, media_post_id, blog_id) VALUES (%d, %d, %d)",  $folder_id, $media_post_id, $blog_id); 		
		return $wpdb->query($sql);		
		
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	public static function removeMedia($media_post_id, $blog_id){
		global $wpdb;
		$sql = $wpdb->prepare("DELETE FROM apollo_MediaToFolder WHERE media_post_id = %d AND blog_id = %d", $media_post_id, $blog_id); 		
		return $wpdb->query($sql);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function addFolder($folder_name, $blog_id){
		global $wpdb;
		$sql = $wpdb->prepare("INSERT INTO apollo_Folders (name, blog_id) VALUES (%s, %d)",  $folder_name, $blog_id); 		
		$wpdb->query($sql);		
		return $wpdb->insert_id;
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function renameFolder($folder_id, $folder_name){
		global $wpdb;
		$sql = $wpdb->prepare("UPDATE apollo_Folders SET name = %s WHERE id = %d",  $folder_name, $folder_id); 		
		return $wpdb->query($sql);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Delete a folder and all associated meda from the media-to-folder table
	*/
	public static function deleteFolder($folder_id){
		global $wpdb;

		$sql = $wpdb->prepare("DELETE FROM apollo_Folders WHERE id = %d",  $folder_id); 		
		$res = $wpdb->query($sql);		

		$sql = $wpdb->prepare("DELETE FROM apollo_MediaToFolder WHERE folder_id = %d",  $folder_id); 		
		$res = $wpdb->query($sql);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////
}
?>