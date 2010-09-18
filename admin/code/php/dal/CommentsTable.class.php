<?php

/**
 *
 * @since August 78h, 2010
 * @author Mike Pritcard (mike@apollosites.com)
 */
class CommentsTable {
    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * To keep the database table from growing huge, we break this table up by site id
     */
    public static function createTableForSite($site_id) {

        // comment: id, author, author_email, author_url, author_ip, date, date_gmt, content, approved, parent_id

        $sql = "CREATE TABLE `athena_{$site_id}_Comments` (
		  `id` int(11) NOT NULL auto_increment,
		  `post_id` int(11) NOT NULL,
		  `parent_id` int(11) NOT NULL,
		  `content` text,
		  `status` enum('Pending','Approved', 'Trash', 'Spam') default 'Pending',
		  `created` datetime default NULL,
		  `author_ip` bigint(20) default NULL,
		  `source` varchar(20) default NULL,
		  `source_id` varchar(30) default NULL,
		  `source_post_id` varchar(30) default NULL,
		  `site_follower_id` int(11) NOT NULL,
		  PRIMARY KEY  (`id`)
		) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;";

        DatabaseManager::submitQuery($sql);
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Create a new comment
     */
    public static function create($site_id, $post_id, $parent_comment_id, $content, $status, $author_ip, $author_id) {

        // Get data in correct locale (SQL's NOW() doesn't do that)
        $target_date = mktime(date("H"), date("i"), date("s"), date("m"), date("d"), date("Y"));
        $date_str = date('Y-m-d H:i:s', $target_date);

        // Is there a comment for this date/time from a different author?
        $comment_id = CommentsTable::getCommentIDFromDate($site_id, $date_str);

        // If there is a comment for this time slot, wait a random time and then try again
        if (isset($comment_id)){
            sleep(mt_rand(1,5));
            return self::create($site_id, $post_id, $parent_comment_id, $content, $status, $author_ip, $author_id);
        }

        $sql = DatabaseManager::prepare("INSERT INTO athena_%d_Comments (post_id, parent_id, content, status, created, author_ip, site_follower_id)
			VALUES (%d, %d, %s, %s, '$date_str', %d, %d)",
                        $site_id, $post_id, $parent_comment_id, $content, $status, ip2long($author_ip), $author_id);

        return DatabaseManager::insert($sql);
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Create a new comment, but force the id. If a comment with that id already exist, change its id.
     */
    public static function createForceID($site_id, $post_id, $comment_id, $parent_comment_id, $content, $status, $author_ip, $author_id) {

        // Check to see if this id is free
        $sql = DatabaseManager::prepare("SELECT id FROM athena_%d_Comments WHERE id = %d", $site_id, $comment_id);
        $temp_id = DatabaseManager::getVar($sql);
        if (isset($temp_id)) {
            $new_id = DatabaseManager::getVar(DatabaseManager::prepare("SELECT max(id) FROM athena_%d_Comments", $site_id)) + 1;
            $sql = DatabaseManager::prepare("UPDATE athena_%d_Comments SET id = %d WHERE id = %d", $site_id, $new_id, $temp_id);
            DatabaseManager::update($sql);
        }

        // Get data in correct locale (SQL's NOW() doesn't do that)
        $target_date = mktime(date("H"), date("i"), date("s"), date("m"), date("d"), date("Y"));
        $date_str = date('Y-m-d H:i:s', $target_date);

        $sql = DatabaseManager::prepare("INSERT INTO athena_%d_Comments (id, post_id, parent_id, content, status, created, author_ip, site_follower_id)
			VALUES (%d, %d, %d, %s, %s, '$date_str', %d, %d)",
                        $site_id, $comment_id, $post_id, $parent_comment_id, $content, $status, ip2long($author_ip), $author_id);

        return DatabaseManager::insert($sql);
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Update a post
     */
    public static function update($site_id, $post_id, $comment_id, $parent_comment_id, $content, $status, $author_ip, $author_id) {
        $sql = DatabaseManager::prepare("UPDATE athena_%d_Comments SET post_id = %d, parent_id = %d, content = %s, status = %s, author_ip = %d, site_follower_id = %d WHERE id = %d",
                        $site_id, $post_id, $parent_comment_id, $content, $status, ip2long($author_ip), $author_id, $comment_id);
        return DatabaseManager::update($sql);
    }

    // /////////////////////////////////////////////////////////////////////////////////

    public static function updateStatus($comment_id, $site_id, $status) {
        $sql = DatabaseManager::prepare("UPDATE athena_%d_Comments SET status=%s WHERE id = %d", $site_id, $status, $comment_id);
        return DatabaseManager::update($sql);
    }

    public static function updateCreatedDate($comment_id, $site_id, $created_date) {
        $sql = DatabaseManager::prepare("UPDATE athena_%d_Comments SET created=%s WHERE id = %d", $site_id, $created_date, $comment_id);
        return DatabaseManager::update($sql);
    }

    public static function updatePostID($comment_id, $site_id, $post_id) {
        $sql = DatabaseManager::prepare("UPDATE athena_%d_Comments SET post_id=%d WHERE id = %d", $site_id, $post_id, $comment_id);
        return DatabaseManager::update($sql);
    }

    public static function updateSourcePostID($comment_id, $site_id, $source_post_id) {
        $sql = DatabaseManager::prepare("UPDATE athena_%d_Comments SET source_post_id=%s WHERE id = %d", $site_id, $source_post_id, $comment_id);
        return DatabaseManager::update($sql);
    }

    public static function updateSourceID($comment_id, $site_id, $source_id) {
        $sql = DatabaseManager::prepare("UPDATE athena_%d_Comments SET source_id=%s WHERE id = %d", $site_id, $source_id, $comment_id);
        return DatabaseManager::update($sql);
    }

    public static function updateSource($comment_id, $site_id, $source) {
        $sql = DatabaseManager::prepare("UPDATE athena_%d_Comments SET source=%s WHERE id = %s", $site_id, strtolower($source), $comment_id);
        return DatabaseManager::update($sql);
    }

    // /////////////////////////////////////////////////////////////////////////////////

    public static function getLastCommentSourceID($site_id, $source) {
        $sql = DatabaseManager::prepare("SELECT max(source_id) FROM athena_%d_Comments WHERE source=%s", $site_id, strtolower($source));
        return DatabaseManager::getVar($sql);
    }

    public static function getCommentIDFromSourceID($site_id, $source_id, $source) {
        $sql = DatabaseManager::prepare("SELECT id FROM athena_%d_Comments WHERE source_id=%d AND source=%s", $site_id, $source_id, strtolower($source));
        return DatabaseManager::getVar($sql);
    }

    // /////////////////////////////////////////////////////////////////////////////////

    public static function getAllPendingComments($site_id){
        $sql = DatabaseManager::prepare("SELECT c.*, f.name FROM athena_%d_Comments c INNER JOIN athena_SiteFollowers f WHERE c.site_follower_id = f.id AND status = 'Pending' ORDER BY c.created DESC", $site_id);
        return DatabaseManager::getResults($sql);
    }

    // /////////////////////////////////////////////////////////////////////////////////
    
    /**
     * Get a list of the rcent comments (comments made in the last N days), but include ALL unapproved comments
     * @param int $site_id
     * @param int $site_id
     * @return array
     */
    public static function getRecentComments($site_id, $no_days){

        $date_before = date("Y-m-d 00:00:00", mktime(date("H"), date("i"), date("s"), date("m")  , date("d")-$no_days, date("Y")));
        $date_end = date("Y-m-d 23:59:59", mktime(date("H"), date("i"), date("s"), date("m") , date("d"), date("Y")));

        $sql = "SELECT c.*, f.name FROM athena_%d_Comments c
        INNER JOIN athena_SiteFollowers f
        WHERE c.site_follower_id = f.id
        AND status = 'Pending'
        UNION
        SELECT c.*, f.name FROM athena_%d_Comments c
        INNER JOIN athena_SiteFollowers f
        WHERE c.site_follower_id = f.id
        AND status != 'Pending'
        AND c.created > '%s' AND c.created <= '%s'
        ORDER BY created DESC";

        $sql = DatabaseManager::prepare($sql, $site_id, $site_id, $date_before, $date_end);
        return DatabaseManager::getResults($sql);
    }

    // /////////////////////////////////////////////////////////////////////////////////

    public static function getCommentsForPost($site_id, $post_id) {
        $sql = DatabaseManager::prepare("SELECT c.*, f.name FROM athena_%d_Comments c INNER JOIN athena_SiteFollowers f WHERE c.post_id = %d AND c.site_follower_id = f.id ORDER BY c.created DESC", $site_id, $post_id);
        return DatabaseManager::getResults($sql);
    }

    // /////////////////////////////////////////////////////////////////////////////////

    public static function getComment($site_id, $comment_id) {
        $sql = DatabaseManager::prepare("SELECT * FROM athena_%d_Comments WHERE id = %d", $site_id, $comment_id);
        return DatabaseManager::getSingleResult($sql);
    }

    // /////////////////////////////////////////////////////////////////////////////////

    public static function getCommentIDFromDate($site_id, $datestr) {
        $sql = DatabaseManager::prepare("SELECT id FROM athena_%d_Comments WHERE created = %s", $site_id, $datestr);
        return DatabaseManager::getVar($sql);
    }

    // /////////////////////////////////////////////////////////////////////////////////

    public static function getCommentIDFromDateAndFollower($site_id, $datestr, $follower_id) {
        $sql = DatabaseManager::prepare("SELECT id FROM athena_%d_Comments WHERE created = %s AND site_follower_id = %d", $site_id, $datestr, $follower_id);
        return DatabaseManager::getVar($sql);
    }

}

?>
