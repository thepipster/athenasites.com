<?php
/**
 * 
 * @author Mike Pritchard
 * @since March 24th, 2010
 */
class FolderTable {

	// ///////////////////////////////////////////////////////////////////////////////////////

	/**
	* To keep the database table from growing huge, we break this table up by site id
	*/
	public static function createTableForSite($site_id){
		
		$sql = "CREATE TABLE `athena_{$site_id}_Folders` (
		  `id` int(11) NOT NULL auto_increment,
		  `name` varchar(255) default 'Unamed Folder',
		  PRIMARY KEY  (`id`)
		) ENGINE=MyISAM AUTO_INCREMENT=68 DEFAULT CHARSET=utf8;";
						
		DatabaseManager::submitQuery($sql);
		
		$sql = "CREATE TABLE `athena_{$site_id}_Media` (
		  `id` bigint(20) NOT NULL auto_increment,
		  `folder_id` int(11) default '1',
		  `filename` varchar(255) default NULL,
		  `mime_type` varchar(20) default NULL,
		  `file_size` int(11) default NULL,
		  `created` timestamp NULL default NULL on update CURRENT_TIMESTAMP,
		  `title` text,
		  `description` text,
		  `tags` text,
		  `width` int(9) default NULL,
		  `height` int(9) default NULL,
		  `thumb_filename` varchar(255) default NULL,
		  `thumb_width` int(9) default NULL,
		  `thumb_height` int(9) default NULL,
		  PRIMARY KEY  (`id`)
		) ENGINE=MyISAM DEFAULT CHARSET=utf8;";
						
		DatabaseManager::submitQuery($sql);		
		
		// Add the reserved id's into the table
		$sql = "INSERT INTO `athena_{$site_id}_Folders` (`id`,`name`)
			VALUES
				(2,'Reserved (Last 24 hours))'),
				(3,'Reserved (Last 7 days)'),
				(4,'Reserved (last 1 day)'),
				(5,'Reserved'),
				(6,'Reserved'),
				(7,'Reserved'),
				(8,'Reserved'),
				(9,'Reserved');";

		DatabaseManager::submitQuery($sql);		
	
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Get all the images associated with a page
	*/
	public static function getFoldersForSite($site_id){
		$sql = DatabaseManager::prepare("SELECT * FROM athena_%d_Folders WHERE id > 9 ORDER BY name ASC",  $site_id ); 		
		return DatabaseManager::getResults($sql);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getImageEntriesForSite($site_id){
		$sql = DatabaseManager::prepare("SELECT media.* FROM athena_%d_Media media INNER JOIN athena_%d_Folders folders WHERE folders.id = media.folder_id",  $site_id ); 		
		return DatabaseManager::getResults($sql);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getMediaFolderID($media_id, $site_id){
		$sql = DatabaseManager::prepare("SELECT folder_id FROM athena_%d_Media WHERE id = %d", $site_id, $media_id); 		
		return DatabaseManager::getVar($sql);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Get all the images associated with a page
	*/
	public static function getMediaForSite($site_id){
		$sql = DatabaseManager::prepare("SELECT * FROM athena_%d_Media ORDER BY id ASC",  $site_id ); 		
		return DatabaseManager::getResults($sql);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getMediaForFolder($site_id, $folder_id){
		$sql = DatabaseManager::prepare("SELECT * FROM athena_%d_Media WHERE folder_id = %d ORDER BY id ASC",  $site_id, $folder_id ); 		
		return DatabaseManager::getResults($sql);		
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	public static function addMedia($folder_id, $site_id, $filename, $mime_type, $file_size, $title, $descriptions, $tags, $width, $height, $thumb_filename, $thumb_width, $thumb_height){

        // Get data in correct locale (SQL's NOW() doesn't do that)
        $target_date  = mktime(date("H"), date("i"), date("s"), date("m")  , date("d"), date("Y"));
        $date_str = date('Y-m-d H:i:s', $target_date);

		$sql = DatabaseManager::prepare("INSERT INTO athena_%d_Media (folder_id, filename, mime_type, file_size, created, title, description, tags, width, height, thumb_filename, thumb_width, thumb_height) 
					VALUES (%d, %s, %s, %d, %s, %s, %s, %s, %d, %d, %s, %d, %d)",  
						$site_id, $folder_id, $filename, $mime_type, $file_size, $date_str,  $title, $descriptions, $tags, $width, $height, $thumb_filename, $thumb_width, $thumb_height); 		
		return DatabaseManager::insert($sql);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Add media to a folder, if the media exists in another folder then move it
	*/
	public static function addMediaToFolder($folder_id, $media_id, $site_id){
	
		$sql = DatabaseManager::prepare("UPDATE athena_%d_Media SET folder_id = %d WHERE id = %d",  $site_id, $folder_id, $media_id); 		
		return DatabaseManager::update($sql);		
/*
		// Check to see if this media already has an entry (i.e. its being moved)		
		$sql = DatabaseManager::prepare("SELECT folder_id FROM athena_%d_Media WHERE id = %d",  $site_id, $media_id); 		
		$current_folder_id = DatabaseManager::getVar($sql);		
		
		if (isset($current_folder_id)){
			$sql = DatabaseManager::prepare("UPDATE athena_%d_Media SET folder_id = %d WHERE id = %d",  $site_id, $folder_id, $media_id); 		
			return DatabaseManager::update($sql);		
		}

		$sql = DatabaseManager::prepare("INSERT INTO athena_%d_Media (folder_id, id) VALUES (%d, %d)",  $site_id, $folder_id, $media_id); 		
		return DatabaseManager::insert($sql);		
*/ 		
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	public static function removeMedia($media_id, $site_id){
		$sql = DatabaseManager::prepare("DELETE FROM athena_%d_Media WHERE id = %d", $site_id, $media_id); 		
		return DatabaseManager::submitQuery($sql);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function addFolder($folder_name, $site_id){
		$sql = DatabaseManager::prepare("INSERT INTO athena_%d_Folders (name) VALUES (%s)",  $site_id, $folder_name); 		
		return DatabaseManager::insert($sql);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function renameFolder($site_id, $folder_id, $folder_name){
		$sql = DatabaseManager::prepare("UPDATE athena_%d_Folders SET name = %s WHERE id = %d",  $site_id, $folder_name, $folder_id); 		
		return DatabaseManager::submitQuery($sql);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Delete a folder and move all associated meda from the media-to-folder table
	*/
	public static function deleteFolder($site_id, $folder_id){
		$sql = DatabaseManager::prepare("DELETE FROM athena_%d_Folders WHERE id = %d",  $site_id, $folder_id); 		
		$res = DatabaseManager::submitQuery($sql);		

		$sql = DatabaseManager::prepare("UPDATE athena_%d_Media SET folder_id = 1 WHERE folder_id = %d",  $site_id, $folder_id); 		
		$res = DatabaseManager::submitQuery($sql);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////
}
?>