<?php
/**
 * Holds customer information for the CRM
 * @since October 17th, 2010
 * @author Mike Pritcard (mike@apollosites.com)
 */
class CustomerTable {

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * To keep the database table from growing huge, we break this table up by site id
     */
    public static function createTableForSite($site_id) {

        $sql = "CREATE TABLE `crm_{$site_id}_Customers` (
			  `id` int(11) NOT NULL auto_increment,
			  `email` varchar(255) default NULL,
			  `name` varchar(255) default NULL,
			  `phone` varchar(255) default NULL,
			  `created_date` datetime default NULL,
			  `last_activity` datetime default NULL,
			  `ip` bigint(20) default NULL,
			  PRIMARY KEY  (`id`)
			) ENGINE=MyISAM DEFAULT CHARSET=latin1;";

        DatabaseManager::submitQuery($sql);
    }
    
    // ///////////////////////////////////////////////////////////////////////////////////////

    public static function getCustomerIDFromEmail($site_id, $email) {
        $sql = DatabaseManager::prepare("SELECT id FROM crm_%d_Customers WHERE email = %s", $site_id, $email);
        return DatabaseManager::getVar($sql);
    }
 
    // ///////////////////////////////////////////////////////////////////////////////////////

    public static function addCustomer($site_id, $name, $email, $phone) {

		Logger::debug("addCustomer($site_id, $name, $email, $phone)");
		
		// Check to see if this customer exists
		$customer_id = CustomerTable::getCustomerIDFromEmail($site_id, $email);
		
		if (!isset($customer_id)){
	        $date_str = date('Y-m-d H:i:s', time());	
			$true_ip = PageViewsTable::getRealIPAddr();	        
	        $sql = DatabaseManager::prepare("INSERT INTO crm_%d_Customers (name, email, phone, created_date, last_activity, ip) VALUES (%s, %s, %s, '$date_str', '$date_str', %d)", $site_id, $name, $email, $phone, ip2long($true_ip));
	        Logger::debug($sql);
        	$customer_id = DatabaseManager::insert($sql);
		}
		
		return $customer_id;

    }

}

?>
