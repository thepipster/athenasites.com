<?php
/**
 * Deals with any actions regarding media.
 *
 * @author Mike Pritchard
 * @since March 24th, 2010
 */
class MediaTable {

    /**
     * To keep the database table from growing huge, we break this table up by site id
     */
    public static function createTableForSite($site_id) {

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
		  `filepath` varchar(12) default NULL,
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
        
        // Create media tags table...
        
        $sql = "CREATE TABLE `athena_{$site_id}_MediaTags` (
		  `id` int(11) NOT NULL auto_increment,
		  `tag` varchar(255),
		  PRIMARY KEY  (`id`)
		) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;";      
		
        DatabaseManager::submitQuery($sql);

        $sql = "CREATE TABLE `athena_{$site_id}_MediaToTags` (
		  `id` int(11) NOT NULL auto_increment,
		  `media_id` int(11),
		  `tag_id` int(11),
		  PRIMARY KEY  (`id`)
		) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;";		  

        DatabaseManager::submitQuery($sql);
    }

    // //////////////////////////////////////////////////////////////////////////////////////
    
    /**
     * Get all the images associated with a page
     */
    public static function getFoldersForSite($site_id) {
        $sql = DatabaseManager::prepare("SELECT * FROM athena_%d_Folders WHERE id > 9 ORDER BY name ASC", $site_id);
        return DatabaseManager::getResults($sql);
    }

    // //////////////////////////////////////////////////////////////////////////////////////

    public static function getImageEntriesForSite($site_id) {
        $sql = DatabaseManager::prepare("SELECT media.* FROM athena_%d_Media media INNER JOIN athena_%d_Folders folders WHERE folders.id = media.folder_id", $site_id);
        return DatabaseManager::getResults($sql);
    }

    // //////////////////////////////////////////////////////////////////////////////////////

    public static function getMediaFolderID($media_id, $site_id) {
        $sql = DatabaseManager::prepare("SELECT folder_id FROM athena_%d_Media WHERE id = %d", $site_id, $media_id);
        return DatabaseManager::getVar($sql);
    }

    // //////////////////////////////////////////////////////////////////////////////////////

    /**
     * Get all the images associated with a page
     */
    public static function getMediaForSite($site_id) {
        $sql = DatabaseManager::prepare("SELECT * FROM athena_%d_Media ORDER BY id ASC", $site_id);
        return DatabaseManager::getResults($sql);
    }

    // //////////////////////////////////////////////////////////////////////////////////////

    public static function getMediaForFolder($site_id, $folder_id) {
        $sql = DatabaseManager::prepare("SELECT * FROM athena_%d_Media WHERE folder_id = %d ORDER BY id ASC", $site_id, $folder_id);
        return DatabaseManager::getResults($sql);
    }

    // //////////////////////////////////////////////////////////////////////////////////////

    public static function getDiscUsage($site_id) {
        $sql = DatabaseManager::prepare("SELECT sum(file_size) FROM athena_%d_Media", $site_id);
        return DatabaseManager::getVar($sql);
    }

    // //////////////////////////////////////////////////////////////////////////////////////

    public static function getMedia($site_id, $media_id) {
        //Logger::debug(">>>> getMedia($site_id, $media_id");
        $sql = DatabaseManager::prepare("SELECT * FROM athena_%d_Media WHERE id = %d", $site_id, $media_id);
        return DatabaseManager::getSingleResult($sql);
    }

    // //////////////////////////////////////////////////////////////////////////////////////

    public static function addMedia($folder_id, $site_id, $filename, $mime_type, $file_size, $filepath, $title, $descriptions, $tags, $width, $height, $thumb_filename, $thumb_width, $thumb_height) {

        //Logger::debug("addMedia($folder_id, $site_id, $filename, $mime_type, $file_size, $filepath, $title, $descriptions, $tags, $width, $height, $thumb_filename, $thumb_width, $thumb_height)");
        
        // Get data in correct locale (SQL's NOW() doesn't do that)
        $target_date = mktime(date("H"), date("i"), date("s"), date("m"), date("d"), date("Y"));
        $date_str = date('Y-m-d H:i:s', $target_date);

        $sql = DatabaseManager::prepare("INSERT INTO athena_%d_Media (folder_id, filename, mime_type, file_size, created, title, description, tags, width, height, thumb_filename, thumb_width, thumb_height, filepath)
					VALUES (%d, %s, %s, %d, %s, %s, %s, %s, %d, %d, %s, %d, %d, %s)",
                        $site_id, $folder_id, $filename, $mime_type, $file_size, $date_str, $title, $descriptions, $tags, $width, $height, $thumb_filename, $thumb_width, $thumb_height, $filepath);
        return DatabaseManager::insert($sql);
    }

    // //////////////////////////////////////////////////////////////////////////////////////

    /**
     * Add media to a folder, if the media exists in another folder then move it
     */
    public static function addMediaToFolder($folder_id, $media_id, $site_id) {

        $sql = DatabaseManager::prepare("UPDATE athena_%d_Media SET folder_id = %d WHERE id = %d", $site_id, $folder_id, $media_id);
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

    /**
     * Update a media (file) with the given paras
     * @param int $site_id the site id
     * @param int $media_id the file/media id
     * @param string $title title of this file
     * @param string $description description of this file
     * @param string $tags csv list of tags for this file
     * @return int result of the update
     */
    public static function updateMedia($site_id, $media_id, $title, $description, $tags){
        $sql = DatabaseManager::prepare("UPDATE athena_%d_Media SET title = %s, description = %s, tags = %s WHERE id = %d", $site_id, $title, $description, $tags, $media_id);
        return DatabaseManager::update($sql);
    }
    
    // //////////////////////////////////////////////////////////////////////////////////////

    /**
     * Remove a media/file from the database. Note, this does not phyiscally delete the file!
     * @param int $media_id
     * @param int $site_id
     * @return <type>
     */
    public static function removeMedia($media_id, $site_id) {
        $sql = DatabaseManager::prepare("DELETE FROM athena_%d_Media WHERE id = %d", $site_id, $media_id);
        return DatabaseManager::submitQuery($sql);
    }

    // //////////////////////////////////////////////////////////////////////////////////////

    public static function addFolder($folder_name, $site_id) {
        $sql = DatabaseManager::prepare("INSERT INTO athena_%d_Folders (name) VALUES (%s)", $site_id, $folder_name);
        return DatabaseManager::insert($sql);
    }

    // //////////////////////////////////////////////////////////////////////////////////////

    public static function renameFolder($site_id, $folder_id, $folder_name) {
        $sql = DatabaseManager::prepare("UPDATE athena_%d_Folders SET name = %s WHERE id = %d", $site_id, $folder_name, $folder_id);
        return DatabaseManager::submitQuery($sql);
    }

    // //////////////////////////////////////////////////////////////////////////////////////

    /**
     * Delete a folder and move all associated meda from the media-to-folder table
     */
    public static function deleteFolder($site_id, $folder_id) {
        $sql = DatabaseManager::prepare("DELETE FROM athena_%d_Folders WHERE id = %d", $site_id, $folder_id);
        $res = DatabaseManager::submitQuery($sql);

        $sql = DatabaseManager::prepare("UPDATE athena_%d_Media SET folder_id = 1 WHERE folder_id = %d", $site_id, $folder_id);
        $res = DatabaseManager::submitQuery($sql);
    }

    // //////////////////////////////////////////////////////////////////////////////////////
    //
    // Media Tags
    //
    // /////////////////////////////////////////////////////////////////////////////////

    /**
     * Add a new tag, but only if doesn't exist already.
     */
    public static function addTag($site_id, $tag) {

        // Does the tag already exist
        $sql = DatabaseManager::prepare("SELECT id FROM athena_%d_MediaTags WHERE tag = %s", $site_id, $tag);
        $tag_id = DatabaseManager::getVar($sql);

        if (!isset($tag_id)) {
            $sql = DatabaseManager::prepare("INSERT INTO athena_%d_MediaTags (tag) VALUES (%s)", $site_id, $tag);
            $tag_id = DatabaseManager::insert($sql);
        }

        return $tag_id;
    }

    // /////////////////////////////////////////////////////////////////////////////////

    /**
     * Assign a tag to a media file
     */
    public static function addTagToMedia($site_id, $media_id, $tag) {

		// Add the tag (if it doesn't exist) and get the tag_id
		$tag_id = self::addTag($site_id, $tag);
		
        // Does this media already have this category assigned?
        $sql = DatabaseManager::prepare("SELECT id FROM athena_%d_MediaToTags WHERE tag_id=%d AND media_id=%d", $site_id, $tag_id, $media_id);
        $id = DatabaseManager::getVar($sql);

        if (isset($id)) {
            //Logger::debug(">>> Tag already assigned to this post!");
            return null;
        }

        $sql = DatabaseManager::prepare("INSERT INTO athena_%d_MediaToTags (tag_id, media_id) VALUES (%d, %d)", $site_id, $tag_id, $media_id);
        DatabaseManager::insert($sql);

        return $tag_id;
    }    
    
    // /////////////////////////////////////////////////////////////////////////////////

    /**
     * Remove a tag from a media file, and remove from the list of tags if there are no other references
     */
    public static function removeTag($site_id, $media_id, $tag) {

        // Delete media-tag mapping
        $tag_id = self::getTagID($site_id, $tag);
        $sql = DatabaseManager::prepare("DELETE FROM athena_%d_MediaToTags WHERE tag_id = %d AND media_id = %d", $site_id, $tag_id, $media_id);
        DatabaseManager::submitQuery($sql);

        $freq = self::getTagFrequency($site_id, $tag);

        // If there are no more references to this tag, remove the tag
        if ($freq == 0) {
            $sql = DatabaseManager::prepare("DELETE FROM athena_%d_MediaTags WHERE id=%d", $site_id, $tag_id);
            DatabaseManager::submitQuery($sql);
        }
    }    
    
    // /////////////////////////////////////////////////////////////////////////////////
    
    public static function getTags($site_id) {
        $sql = DatabaseManager::prepare("SELECT tag FROM athena_%d_MediaTags ORDER BY tag", $site_id);
        return DatabaseManager::getColumn($sql);
    }

    public static function getTagsForMedia($site_id, $media_id) {
        $sql = DatabaseManager::prepare("SELECT t.tag FROM athena_%d_MediaTags t INNER JOIN athena_%d_MediaToTags pt WHERE pt.media_id = %d AND pt.tag_id = t.id", $site_id, $site_id, $media_id);
        return DatabaseManager::getColumn($sql);
    }
    
    // /////////////////////////////////////////////////////////////////////////////////

    public static function getTagID($site_id, $tag) {
        $sql = DatabaseManager::prepare("SELECT id FROM athena_%d_MediaTags WHERE tag = %s", $site_id, $tag);
        return DatabaseManager::getVar($sql);
    }
    
    // /////////////////////////////////////////////////////////////////////////////////

    public static function getTagFrequency($site_id, $tag) {
        $sql = DatabaseManager::prepare("SELECT count(pt.id) FROM athena_%d_MediaToTags pt INNER JOIN athena_%d_MediaTags t WHERE pt.tag_id = t.id AND t.tag = %s", $site_id, $site_id, $tag);
        $freq = DatabaseManager::getVar($sql);
        if (!isset($freq)) {
            $freq = 0;
        }
        return $freq;
    }
    
    // /////////////////////////////////////////////////////////////////////////////////

    /**
     * Remove a tag from all posts, and delete from the tag list
     * @param int $site_id
     * @param string $tag
     */
    public static function globalRemoveTag($site_id, $tag) {

        // Delete from post-tag mapping
        $tag_id = self::getTagID($site_id, $tag);
        $sql = DatabaseManager::prepare("DELETE FROM athena_%d_MediaToTags WHERE tag_id = %d", $site_id, $tag_id);
        DatabaseManager::submitQuery($sql);

        // Remove from tag list
        $sql = DatabaseManager::prepare("DELETE FROM athena_%d_MediaTags WHERE id=%d", $site_id, $tag_id);
        DatabaseManager::submitQuery($sql);
    }    
}

?>