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
	public static function getFoldersForSite($site_id){
		$sql = DatabaseManager::prepare("SELECT * FROM athena_Folders WHERE site_id = %d ORDER BY name ASC",  $site_id ); 		
		return DatabaseManager::getResults($sql);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getImageEntriesForSite($site_id){
		$sql = DatabaseManager::prepare("SELECT media.* FROM athena_Media media INNER JOIN athena_Folders folders WHERE folders.id = media.folder_id AND folders.site_id = %d",  $site_id ); 		
		return DatabaseManager::getResults($sql);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getMediaFolderID($media_id, $site_id){
		$sql = DatabaseManager::prepare("SELECT folder_id FROM athena_Media WHERE id = %d AND site_id = %d",  $media_id, $site_id ); 		
		return DatabaseManager::getVar($sql);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Get all the images associated with a page
	*/
	public static function getMediaForSite($site_id){
		$sql = DatabaseManager::prepare("SELECT * FROM athena_Media WHERE site_id = %d ORDER BY id ASC",  $site_id ); 		
		return DatabaseManager::getResults($sql);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getMediaForFolder($site_id, $folder_id){
		$sql = DatabaseManager::prepare("SELECT * FROM athena_Media WHERE site_id = %d AND folder_id = %d ORDER BY id ASC",  $site_id, $folder_id ); 		
		return DatabaseManager::getResults($sql);		
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	public static function addMedia($folder_id, $site_id, $filename, $mime_type, $file_size, $title, $descriptions, $tags, $width, $height, $thumb_filename, $thumb_width, $thumb_height){

        // Get data in correct locale (SQL's NOW() doesn't do that)
        $target_date  = mktime(date("H"), date("i"), date("s"), date("m")  , date("d"), date("Y"));
        $date_str = date('Y-m-d H:i:s', $target_date);

		$sql = DatabaseManager::prepare("INSERT INTO athena_Media (folder_id, site_id, filename, mime_type, file_size, created, title, description, tags, width, height, thumb_filename, thumb_width, thumb_height) 
					VALUES (%d, %d, %s, %s, %d, %s, %s, %s, %s, %d, %d, %s, %d, %d)",  
						$folder_id, $site_id, $filename, $mime_type, $file_size, $date_str,  $title, $descriptions, $tags, $width, $height, $thumb_filename, $thumb_width, $thumb_height); 		
		return DatabaseManager::insert($sql);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Add media to a folder, if the media exists in another folder then move it
	*/
	public static function addMediaToFolder($folder_id, $media_id, $site_id){
	
		// Check to see if this media already has an entry (i.e. its being moved)		
		$sql = DatabaseManager::prepare("SELECT folder_id FROM athena_Media WHERE id = %d AND site_id = %d",  $media_id, $site_id); 		
		$current_folder_id = DatabaseManager::getVar($sql);		
		
		if (isset($current_folder_id)){
			$sql = DatabaseManager::prepare("UPDATE athena_Media SET folder_id = %d WHERE id = %d AND site_id = %d",  $folder_id, $media_id, $site_id); 		
			return DatabaseManager::update($sql);		
		}

		$sql = DatabaseManager::prepare("INSERT INTO athena_Media (folder_id, id, site_id) VALUES (%d, %d, %d)",  $folder_id, $media_id, $site_id); 		
		return DatabaseManager::insert($sql);				
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	public static function removeMedia($media_id, $site_id){
		$sql = DatabaseManager::prepare("DELETE FROM athena_Media WHERE id = %d AND site_id = %d", $media_id, $site_id); 		
		return DatabaseManager::submitQuery($sql);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function addFolder($folder_name, $site_id){
		$sql = DatabaseManager::prepare("INSERT INTO athena_Folders (name, site_id) VALUES (%s, %d)",  $folder_name, $site_id); 		
		return DatabaseManager::insert($sql);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function renameFolder($folder_id, $folder_name){
		$sql = DatabaseManager::prepare("UPDATE athena_Folders SET name = %s WHERE id = %d",  $folder_name, $folder_id); 		
		return DatabaseManager::submitQuery($sql);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Delete a folder and all associated meda from the media-to-folder table
	*/
	public static function deleteFolder($folder_id){
		$sql = DatabaseManager::prepare("DELETE FROM athena_Folders WHERE id = %d",  $folder_id); 		
		$res = DatabaseManager::submitQuery($sql);		

		$sql = DatabaseManager::prepare("DELETE FROM athena_Media WHERE folder_id = %d",  $folder_id); 		
		$res = DatabaseManager::submitQuery($sql);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////
}
?>