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
        	
		$query = "INSERT INTO athena_Users (email, name, password_hash, account_created, last_login, user_group) VALUES (?, ?, ?, ?, ?, ?)";

		// Use PDO for this time, for an extra level of security
		DatabaseManager::prepare($query);
		DatabaseManager::bindParam(1, $email);
		DatabaseManager::bindParam(2, $name);
		DatabaseManager::bindParam(3, $sha1_pass);
		DatabaseManager::bindParam(4, $company);
		DatabaseManager::bindParam(5, $date_str);
		DatabaseManager::bindParam(6, $date_str);
		DatabaseManager::bindParam(7, $user_group);
		$id = DatabaseManager::execute(1);	
	
		return $id;		
    }

	// ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Update details about an existing user
     * @param <int> $user_id
     * @param <string> $firstname
     * @param <string> $lastname
     * @param <string> $sha1_pass
     * @param <string> $company
     * @return <type>
     */
    public static function update($user_id, $name, $sha1_pass){

		$query = "UPDATE athena_Users SET name = ?, password_hash = ? WHERE id = ?";

		// Use PDO for this time, for an extra level of security
		DatabaseManager::prepare($query);
		DatabaseManager::bindParam(1, $name);
		DatabaseManager::bindParam(2, $sha1_pass);
		DatabaseManager::bindParam(3, $user_id);
		$id = DatabaseManager::execute(false, true);

		return $id;
    }
    
	// ///////////////////////////////////////////////////////////////////////////////////////

	/**
	* Delete a user
	*/
	public static function delete($project_id){
		// TBD
		/*
		$query = "DELETE FROM customer WHERE id = ?";
		DatabaseManager::prepare($query);
		DatabaseManager::bindParam(1, $id);
		DatabaseManager::execute(1);	
		*/
	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Get a users id from their email
    * @param <int> user_id
	*/
	public static function getUserID($email){
	
		$query = "SELECT id FROM athena_Users WHERE email = ?";			
		
		DatabaseManager::prepare($query);
		DatabaseManager::bindParam(1, $email);
		$data = DatabaseManager::execute();	
		
		if (isset($data[0])){
			return $data[0]['user_id'];
		}
		
		return null;
				
	}

	// ///////////////////////////////////////////////////////////////////////////////////////

}
?>
