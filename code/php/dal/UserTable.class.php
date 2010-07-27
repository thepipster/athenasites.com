<?php
/**
 *
 * @since Sep 5th, 2009
 * @author mikep
 */
class UserTable {

    /**
     * Create a new user
     */
	public static function create($email, $name, $sha1_pass, $user_group){
	
        // Get data in correct locale (SQL's NOW() doesn't do that)
        $target_date  = mktime(date("H"), date("i"), date("s"), date("m")  , date("d"), date("Y"));
        $date_str = date('Y-m-d H:i:s', $target_date);
        	
		$sql = DatabaseManager::prepare(
			"INSERT INTO athena_Users (email, name, password_hash, account_created, last_login, user_group) VALUES (%s, %s, %s, %s, %s, %d)", 
			$email, $name, $sha1_pass, $date_str, $date_str, $user_group);
			
		DatabaseManager::submitQuery($sql);
		
		return mysql_insert_id();
    }

	// ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Update details about an existing user
     */
    public static function update($id, $name, $sha1_pass){
		$sql = DatabaseManager::prepare("UPDATE athena_Users SET name = %s, password_hash = %s WHERE id = %d", $name, $sha1_pass, $id);
		return DatabaseManager::submitQuery($sql);
    }
    
	// ///////////////////////////////////////////////////////////////////////////////////////

	/**
	* Delete a user
	*/
	public static function delete($id){
		// TBD
	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////

	public static function checkValid($email, $sha1_pass){
		$sql = DatabaseManager::prepare("SELECT id FROM athena_Users WHERE email = %s AND password_hash = %s", $email, $sha1_pass);
		return DatabaseManager::getVar($sql);
	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Get a users id from their email
    * @param <int> user_id
	*/
	public static function getUserID($email){
		$sql = DatabaseManager::prepare("SELECT id FROM athena_Users WHERE email = %s", $email);
		return DatabaseManager::getVar($sql);
	}

	// ///////////////////////////////////////////////////////////////////////////////////////

	public static function updateLastLoginDate($id){
	    $target_date  = mktime(date("H"), date("i"), date("s"), date("m")  , date("d"), date("Y"));
	    $date_str = date('Y-m-d H:i:s', $target_date);

		$sql = DatabaseManager::prepare("UPDATE athena_Users SET last_login = %s WHERE id = %d", $date_str, $id);
		DatabaseManager::submitQuery($sql);
	}
}
?>
