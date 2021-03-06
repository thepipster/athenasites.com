<?php
/**
 *
 * @since February 11th, 2011
 * @author Mike Pritchard (mike@apollosites.com)
 */
class EmailQueueTable {

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Create a new entry
     */
    public static function add($site_id, $to_email, $to_name, $from_email, $from_name, $subject, $content_html, $content_basic='') {

        // Get data in correct locale (SQL's NOW() doesn't do that)
        $date_str = date('Y-m-d H:i:s', time());

        $sql = DatabaseManager::prepare("INSERT INTO log_Email (site_id, to_email, to_name, from_email, from_name, date_created, status, subject, content_html, content_basic)
			VALUES (%d, %s, %s, %s, %s, '$date_str', 'pending', %s, %s, %s)", $site_id, $to_email, $to_name, $from_email, $from_name, $subject, $content_html, $content_basic);
			
        $id = DatabaseManager::insert($sql);
        
        // TODO: Move to crontab, but for now just try to send email
		EmailMessaging::sendMessagesFromQueue();
        
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

	public static function markSent($id){	
        $date_str = date('Y-m-d H:i:s', time());
        $sql = DatabaseManager::prepare("UPDATE log_Email SET status = 'sent', date_sent = '$date_str' WHERE id = %d", $id);			
        return DatabaseManager::update($sql);
	}
	
    // ///////////////////////////////////////////////////////////////////////////////////////

	public static function markError($id){	
        $sql = DatabaseManager::prepare("UPDATE log_Email SET status = 'error' WHERE id = %d", $id);			
        return DatabaseManager::update($sql);
	}
	
    // ///////////////////////////////////////////////////////////////////////////////////////

	public static function getUnsent(){
        return DatabaseManager::getResults("SELECT * FROM log_Email WHERE status != 'sent'");
	}
}
?>