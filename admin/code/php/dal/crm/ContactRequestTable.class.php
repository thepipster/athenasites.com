<?php
/**
 * Table to capture contact requests for use with CRM
 *
 * @since October 17th, 2010
 * @author Mike Pritcard (mike@apollosites.com)
 */
class ContactRequestTable {

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * To keep the database table from growing huge, we break this table up by site id
     */
    public static function createTableForSite($site_id) {

        // comment: id, author, author_email, author_url, author_ip, date, date_gmt, content, approved, parent_id

        $sql = "CREATE TABLE `crm_{$site_id}_ContactRequest` (
			  `id` int(11) NOT NULL auto_increment,
			  `customer_id` int(11) NOT NULL,
			  `name` varchar(255) default NULL,
			  `email` varchar(255) default NULL,
			  `phone` varchar(255) default NULL,
			  `location` text,
			  `requested_date` date default NULL,
			  `request_time` datetime default NULL,
			  `comments` text,
			  `requestor_ip` bigint(20) default NULL,
			  PRIMARY KEY  (`id`)
			) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;";

        DatabaseManager::submitQuery($sql);
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Create a new comment
     */
    public static function create($site_id, $email, $name, $phone, $location, $request_date, $comments) {
    
    	//Logger::debug("create($site_id, $email, $name, $phone, $location, $request_date, $comments)");

        // Get data in correct locale (SQL's NOW() doesn't do that)
        $date_str = date('Y-m-d H:i:s', time());

		$true_ip = PageViewsTable::getRealIPAddr();
		
		// Create an entry in the customer table
		$customer_id = CustomerTable::addCustomer($site_id, $name, $email, $phone);
		
		$request_date_str = date('Y-m-d H:i:s', strtotime($request_date));
		
        $sql = DatabaseManager::prepare("INSERT INTO crm_%d_ContactRequest (customer_id, email, name, phone, location, requested_date, request_time, comments, requestor_ip)
										VALUES (%d, %s, %s, %s, %s, %s, '$date_str', %s, %d)",
                        				$site_id, $customer_id, $email, $name, $phone, $location, $request_date_str, $comments, ip2long($true_ip));

        return DatabaseManager::insert($sql);
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

}

?>
