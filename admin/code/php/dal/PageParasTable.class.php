<?php

/**
 * 
 * @author Mike Pritchard
 * @since March 18th, 2010
 */
class PageParasTable {

    /**
     * To keep the database table from growing huge, we break this table up by site id
     */
     /*
    public static function createTableForSite($site_id) {

        $sql = "CREATE TABLE `athena_{$site_id}_PageParas` (
		  `id` bigint(20) NOT NULL auto_increment,
		  `page_id` bigint(20) default NULL,
		  `theme_para_id` int(11) default NULL,
		  `para_value` varchar(255) default NULL,
		  PRIMARY KEY  (`id`)
		) ENGINE=MyISAM DEFAULT CHARSET=latin1;";

        DatabaseManager::submitQuery($sql);
    }
*/
    // //////////////////////////////////////////////////////////////////////////////////////

    /**
     * Get all a specific parameter value
     */
    public static function getParaValue($page_id, $theme_para_id, $site_id) {
        $sql = DatabaseManager::prepare("SELECT para_value FROM apollo_PageParas WHERE site_id = %d AND page_id = %d AND theme_para_id = %d", $site_id, $page_id, $theme_para_id);
        return DatabaseManager::getVar($sql);
    }

    public static function getAllParas($site_id) {
        $sql = DatabaseManager::prepare("SELECT * FROM apollo_PageParas WHERE site_id = %d", $site_id);
        return DatabaseManager::getResults($sql);
    }

    // //////////////////////////////////////////////////////////////////////////////////////

    /**
     * Sets a para value, determines internally if thats an update or insert
     */
    public static function setParaValue($site_id, $page_id, $theme_para_id, $new_value) {

        //error_log("setParaValue($blog_id, $page_id, $theme_para_id, $new_value)");

        $current_value = self::getParaValue($page_id, $theme_para_id, $site_id);
        //Logger::debug("Current value = $current_value");

        if (isset($current_value)) {
            return self::updateParaValue($site_id, $page_id, $theme_para_id, $new_value);
        } else {
            return self::createParaValue($site_id, $page_id, $theme_para_id, $new_value);
        }
    }

    // //////////////////////////////////////////////////////////////////////////////////////

    public static function updateParaValue($site_id, $page_id, $theme_para_id, $new_value) {
        $sql = DatabaseManager::prepare("UPDATE apollo_PageParas SET para_value = %s WHERE site_id = %d AND page_id = %d AND theme_para_id = %d", $site_id, $new_value, $page_id, $theme_para_id);
        return DatabaseManager::update($sql);
    }

    // //////////////////////////////////////////////////////////////////////////////////////

    public static function createParaValue($site_id, $page_id, $theme_para_id, $new_value) {
        $sql = DatabaseManager::prepare("INSERT INTO apollo_PageParas (para_value, page_id, theme_para_id) VALUES (%s, %d, %d) WHERE site_id = %d", $new_value, $page_id, $theme_para_id, $site_id);
        return DatabaseManager::insert($sql);
    }

}

?>