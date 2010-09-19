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
	public static function create($email, $name, $password_hash, $user_level){
	
        // Get data in correct locale (SQL's NOW() doesn't do that)
        $target_date  = mktime(date("H"), date("i"), date("s"), date("m")  , date("d"), date("Y"));
        $date_str = date('Y-m-d H:i:s', $target_date);
        	
		$sql = DatabaseManager::prepare(
			"INSERT INTO athena_Users (email, name, nice_name, password_hash, account_created, last_login, user_level) VALUES (%s, %s, %s, %s, %s, %s, %d)",
			$email, $name, $name, $password_hash, $date_str, $date_str, $user_level);
			
		DatabaseManager::submitQuery($sql);
		
		return mysql_insert_id();
    }

	// ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Update details about an existing user
     */
    public static function update($id, $name, $password_hash){
		$sql = DatabaseManager::prepare("UPDATE athena_Users SET name = %s, password_hash = %s WHERE id = %d", $name, $password_hash, $id);
		return DatabaseManager::submitQuery($sql);
    }
    
	// ///////////////////////////////////////////////////////////////////////////////////////

	/**
	* Delete a user
	*/
	public static function delete($id){
		// TBD
	}
	
	// /////////////////////////////////////////////////////////////////////////////////

	public static function getNumberUsers(){return DatabaseManager::getVar("SELECT COUNT(id) AS no FROM athena_Users");}
	
	// /////////////////////////////////////////////////////////////////////////////////

	public static function getPasswordFromEmail($email){
		$sql = DatabaseManager::prepare("SELECT password_hash FROM athena_Users WHERE email = %s ", $email);			
		return DatabaseManager::getVar($sql);				
	}
		
	// ///////////////////////////////////////////////////////////////////////////////////////

	public static function checkValid($email, $password_hash){
		$sql = DatabaseManager::prepare("SELECT id FROM athena_Users WHERE email = %s AND password_hash = %s", $email, $password_hash);
		return DatabaseManager::getVar($sql);
	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////
	
	public static function getUser($id){
		$sql = DatabaseManager::prepare("SELECT * FROM athena_Users WHERE id = %d", $id);
		$data = DatabaseManager::getResults($sql);
		if (isset($data[0])){
			return $data[0];
		}
		return null;
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

	public static function updateLastLogin($id){
	    $target_date  = mktime(date("H"), date("i"), date("s"), date("m")  , date("d"), date("Y"));
	    $date_str = date('Y-m-d H:i:s', $target_date);

		$sql = DatabaseManager::prepare("UPDATE athena_Users SET last_login = %s WHERE id = %d", $date_str, $id);
		DatabaseManager::submitQuery($sql);
	}
}
?>
