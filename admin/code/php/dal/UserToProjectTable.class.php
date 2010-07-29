<?php
/**
 *
 * @since October 31st, 2009
 * @author Mike Pritchard (mike@adastrasystems.com)
 */
class UserToProjectTable {

    /**
     * Create a new user to project mapping
     * @return <int> id
     */
	public static function create($user_id, $project_id, $can_write, $can_share, $is_owner){
	
		$query = "INSERT INTO UserToProject (user_id, project_id, can_write, can_share, is_owner) VALUES (?, ?, ?, ?, ?)";

		// Use PDO for this time, for an extra level of security
		DatabaseManager::prepare($query);
		DatabaseManager::bindParam(1, $user_id);
		DatabaseManager::bindParam(2, $project_id);
		DatabaseManager::bindParam(3, $can_write);
		DatabaseManager::bindParam(4, $can_share);
		DatabaseManager::bindParam(5, $is_owner);
		$id = DatabaseManager::execute(1);	
	
		return $id;		
    }
    
	// ///////////////////////////////////////////////////////////////////////////////////////
    
    public static function update($user_id, $project_id, $can_write, $can_share){

		$query = "UPDATE UserToProject SET can_write = ?, can_share = ? WHERE user_id = ? AND project_id = ?";

		// Use PDO for this time, for an extra level of security
		DatabaseManager::prepare($query);
		DatabaseManager::bindParam(1, $can_write);
		DatabaseManager::bindParam(2, $can_share);
		DatabaseManager::bindParam(3, $user_id);
		DatabaseManager::bindParam(4, $project_id);
		$id = DatabaseManager::execute(false, true);

		return $id;
    }
        
	// ///////////////////////////////////////////////////////////////////////////////////////

	public static function removeMapping($user_id, $project_id){
		$query = "DELETE FROM UserToProject WHERE user_id = ? AND project_id = ?";
		DatabaseManager::prepare($query);
		DatabaseManager::bindParam(1, $user_id);
		DatabaseManager::bindParam(2, $project_id);
		DatabaseManager::execute(1);	
	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////

	public static function checkUserProjectMapping($user_id, $project_id){
	
		$query = "SELECT id FROM UserToProject WHERE user_id = ? AND project_id = ?";			
		
		DatabaseManager::prepare($query);
		DatabaseManager::bindParam(1, $user_id);
		DatabaseManager::bindParam(2, $project_id);
		$data = DatabaseManager::execute();	
		
		if (isset($data[0])){
			return true;
		}
		
		return false;
	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////

	/**
	* Get a users linke to the given project id
	*/
	public static function getUsersForProject($project_id){
	
		$query = "SELECT u.user_id, u.email, u.first_name, u.last_name, u.company FROM User u INNER JOIN UserToProject up where up.project_id = ? and u.user_id = up.user_id";			
		
		DatabaseManager::prepare($query);
		DatabaseManager::bindParam(1, $project_id);
		$data = DatabaseManager::execute();	

		return $data;
				
	}

	// ///////////////////////////////////////////////////////////////////////////////////////

	/**
	* Get all the users associated with the given user id (based on projects that are shared)
	*/
	public static function getAssociatedUsers($user_id){
	
		$query = "SELECT up.project_id, up.is_owner, up.can_write, up.can_share, u.email, u.first_name, u.last_name, u.company, u.user_id 
					FROM User u 
					INNER JOIN UserToProject up 
					WHERE u.user_id = up.user_id 
					AND up.project_id IN (SELECT project_id FROM UserToProject up2 WHERE up2.user_id = ?)";

		DatabaseManager::prepare($query);
		DatabaseManager::bindParam(1, $user_id);
		$data = DatabaseManager::execute();	

		return $data;
				
	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////
		
}
?>
