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
    public static function create($email, $name, $password_hash, $user_level) {

        // Get data in correct locale (SQL's NOW() doesn't do that)
        $target_date = mktime(date("H"), date("i"), date("s"), date("m"), date("d"), date("Y"));
        $date_str = date('Y-m-d H:i:s', $target_date);

        $sql = DatabaseManager::prepare(
                        "INSERT INTO apollo_Users (email, name, nice_name, password_hash, account_created, last_login, user_level) VALUES (%s, %s, %s, %s, %s, %s, %d)",
                        $email, $name, $name, $password_hash, $date_str, $date_str, $user_level);

        DatabaseManager::insert($sql);

        return mysql_insert_id();
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Update details about an existing user
     */
    public static function update($id, $name, $password_hash) {
        $sql = DatabaseManager::prepare("UPDATE apollo_Users SET name = %s, password_hash = %s WHERE id = %d", $name, $password_hash, $id);
        return DatabaseManager::update($sql);
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

	public static function updateLocation($id, $lat, $long){
        $sql = DatabaseManager::prepare("UPDATE apollo_Users SET latitude = %f, longitude = %f WHERE id = %d", $lat, $long, $id);
        return DatabaseManager::update($sql);
	}

	public static function getLocation($id){
        $sql = DatabaseManager::prepare("SELECT latitude as lat, longitude as lon apollo_Users FROM apollo_Users WHERE id = %d", $id);
        return DatabaseManager::getSingleResult($sql);
	}
	
    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Delete a user
     */
    public static function delete($id) {
        // TBD
    }

    // /////////////////////////////////////////////////////////////////////////////////

    public static function getNumberUsers() {
        return DatabaseManager::getVar("SELECT COUNT(id) AS no FROM apollo_Users");
    }

    // /////////////////////////////////////////////////////////////////////////////////

    public static function getPasswordFromEmail($email) {
        $sql = DatabaseManager::prepare("SELECT password_hash FROM apollo_Users WHERE email = %s ", $email);
        return DatabaseManager::getVar($sql);
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    public static function checkValid($email, $password_hash) {
        $sql = DatabaseManager::prepare("SELECT id FROM apollo_Users WHERE email = %s AND password_hash = %s", $email, $password_hash);
        return DatabaseManager::getVar($sql);
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    public static function getUser($id) {
        $sql = DatabaseManager::prepare("SELECT * FROM apollo_Users WHERE id = %d", $id);
        return DatabaseManager::getSingleResult($sql);
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Get the list of users for this site
     * @param int $site_id
     * @return <type>
     */
    public static function getUsersFromSiteID($site_id) {
        $sql = DatabaseManager::prepare("SELECT * FROM apollo_UserToSite uts INNER JOIN apollo_Users u
            WHERE uts.user_id = u.id AND uts.site_id = %d", $site_id);
        return DatabaseManager::getResults($sql);
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Get a users id from their email
     * @param <int> user_id
     */
    public static function getUserID($email) {
        $sql = DatabaseManager::prepare("SELECT id FROM apollo_Users WHERE email = %s", $email);
        return DatabaseManager::getVar($sql);
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    public static function updateLastLogin($id) {
        $target_date = mktime(date("H"), date("i"), date("s"), date("m"), date("d"), date("Y"));
        $date_str = date('Y-m-d H:i:s', $target_date);

        $sql = DatabaseManager::prepare("UPDATE apollo_Users SET last_login = %s WHERE id = %d", $date_str, $id);
        DatabaseManager::submitQuery($sql);
    }

}

?>
