<?php
/**
 *
 * @since February 11th, 2011
 * @author Mike Pritchard (mike@apollosites.com)
 */
class LogImport {

    /**
     * Create a new entry
     */
    public static function create($site_id, $user_id, $source) {

        // Get data in correct locale (SQL's NOW() doesn't do that)
        $date_str = date('Y-m-d H:i:s', time());
        
        // LJ needs date format yyyy-mm-dd hh:mm:ss

        $sql = DatabaseManager::prepare("INSERT INTO log_Import (site_id, user_id, source, import_time)
			VALUES (%d, %d, %s, '$date_str')", $site_id, $user_id, $source);
			
        return DatabaseManager::insert($sql);
    }
    
    public static function getLastImport($site_id, $source) {
    
        $sql = DatabaseManager::prepare("SELECT max(import_time) FROM log_Import WHERE site_id = %d AND source = %s", $site_id, $source);

        return DatabaseManager::getVar($sql);
    }    

}
?>