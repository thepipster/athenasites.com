<?php
/**
 *
 * @since February 11th, 2011
 * @author Mike Pritchard (mike@apollosites.com)
 */
class Log404Table {

    /**
     * Create a new entry
     */
    public static function create($site_id, $requested_url, $ip) {

        // Get data in correct locale (SQL's NOW() doesn't do that)
        $date_str = date('Y-m-d H:i:s', time());

        if (isset($_SERVER['HTTP_REFERER'])) {
            $referer = $_SERVER['HTTP_REFERER'];
        } 
        else if (isset($_ENV['HTTP_REFERER'])) {
            $referer = $_ENV['HTTP_REFERER'];
        } 
        else {
            $referer = '';
        }
        
        $sql = DatabaseManager::prepare("INSERT INTO log_404 (site_id, requested_url, referring_url, view_date, ip_long)
			VALUES (%d, %s, %s, '$date_str', %d)", $site_id, $requested_url, $referer, ip2long($ip));
			
        return DatabaseManager::insert($sql);
    }

}
?>