<?php

class SecurityUtils {

    private static $salt_length = 12;

    /**
     * The nonce (number used once) duration (in seconds) 900 = 15 minutes, 600 = 10 minutes
     */
    private static $nonce_duration = 900; 

    // //////////////////////////////////////////////////////////////

    /**
     * Check to see if the given nonce is still valid
     * @param string $nonce
     * @param string $action An action name: ie: ‘delete-post’
     * @return <type>
     */
    public static function checkNonce($nonce, $action = ''){
    	
    	$nonce = DatabaseManager::getVar(DatabaseManager::prepare("SELECT nonce FROM log_Nonce WHERE nonce = %s AND action = %s", $nonce, $action));
    	
    	if (isset($nonce)){
    		// Clear this nonce from the DB as its been used! 
	    	$nonce = DatabaseManager::submitQuery(DatabaseManager::prepare("DELETE FROM log_Nonce WHERE nonce = %s AND action = %s", $nonce, $action));
    		return true;
    	}
    	else {
    		return false;
    	}
    	
	    /*
        $nonceCheck = substr(self::generateNonceHash( $action . $user ), self::$nonce_salt_length, 20);
		if ( $nonceCheck == trim($nonce) ){
	            return true;
		}
		return false;
		*/
    }
    
    // //////////////////////////////////////////////////////////////

    /**
     * Create a brand new nonce (number used once, i.e. a number that can be used one time only)
     * @return <type>
     */
    public static function createNonce($action){
        
		//return substr( self::generateNonceHash( $action . $user ), self::$nonce_salt_length, 20);

        $date_str = date('Y-m-d H:i:s', time());        
    	$key = self::generateUniqueKey();
    	
    	DatabaseManager::insert(DatabaseManager::prepare("INSERT INTO log_Nonce (nonce, date_created, action) VALUES (%s, %s, %s)", $key, $date_str, $action));
		return $key;    		
	}
        
    // //////////////////////////////////////////////////////////////

    /**
     * This method generates the nonce timestamp
     * @param string $action An action name: ie: ‘delete-post’
     * @param string $user A user ID (optional – makes the NONCE only work with a specific user)
     * @return <type>
     */
     /*
    private static function generateNonceHash($action='', $user=''){
		$i = ceil( time() / ( self::$nonce_duration / 2 ) );
		return md5( $i . $action . $user . $action . 'aef1f252f1a');
    }
*/
    // //////////////////////////////////////////////////////////////

    /**
     * Calling generatePassHash() with a single argument (the plain text password) will cause a random string to
     * be generated and used for the salt. The resulting string consists of the salt followed by the SHA-1 hash
     * - this is to be stored away in your database. When you're checking a user's login, the situation is slightly
     * different in that you already know the salt you'd like to use. The string stored in your database can be
     * passed to generatePassHash() as the second argument when generating the hash of a user-supplied password for
     * comparison.
     *
     * Using a salt overcomes the issue of multiple accounts with the same password revealing themselves with identical
     * hashes in your database. Although two passwords may be the same the salts will almost certainly be different,
     * so the hashes will look nothing alike.
     *
     * Dictionary attacks with pre-generated lists of hashes will be useless for the same reason - the attacker will
     * now have to recalculate their entire dictionary for every individual account they're attempting to crack.
     *
     * @see http://phpsec.org/articles/2005/password-hashing.html
     */
    public static function generatePassHash($plain_password, $salt=null) {

        if ($salt === null) {
            $salt = substr(md5(uniqid(rand(), true)), 0, self::$salt_length);
        } else {
            $salt = substr($salt, 0, self::$salt_length);
        }

        return $salt . sha1($salt . $plain_password);
    }
    
    // //////////////////////////////////////////////////////////////

	/**
	* Generate a unique alpha-numeric key
	*/
    public static function generateUniqueKey(){
		$key = sha1( ceil(time()) . '_apollo_' . mt_rand());	
		return $key;
    }
    
    // //////////////////////////////////////////////////////////////
/*

	public static function sendEmailActivation($user_id, $newEmail, $userName, $reason){

		$activation_key = self::generateUniqueKey();
	
    	$date_str = date('Y-m-d H:i:s', time());
	
		$sql = DatabaseManager::prepare("INSERT INTO apollo_EmailActivationTable (user_id, email, activation_key, created_date, reason) VALUES (%d, %s, %s, %s)", $user_id, $newEmail, $activation_key, $date_str, $reason);
		DatabaseManager::insert($sql);
	
		EmailMessaging::sendEmailActivateLink($newEmail, $userName, $activation_key);
	}

*/
    // //////////////////////////////////////////////////////////////
	
	/**
	* Generate a random plain password, for new passwords and password resets
	*/
	public static function generateRandomPassword(){
	
		$length = 10;
		//$chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

		// remove vowels and added some specical characters
		$chars = 'bcdfghjklmnpqrstvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@.?'; 
		
		$count = mb_strlen($chars);
		
		for ($i = 0, $result = ''; $i < $length; $i++) {
		    $index = mt_rand(0, $count - 1);
		    $result .= mb_substr($chars, $index, 1);
		}
		
		return $result;
	
	}
	
    // //////////////////////////////////////////////////////////////

    public static function logIn($user_id, $user_level, $user_name, $user_email) {
        Session::set('user_valid', true);
        Session::set('user_id', $user_id);
        Session::set('user_name', $user_name);
        Session::set('user_email', $user_email);
        Session::set('user_level', $user_level);
    }

    // //////////////////////////////////////////////////////////////

    public static function logOut() {
        Session::clear('user_id');
        Session::clear('user_level');
        Session::clear('user_email');
        Session::clear('user_name');
        Session::set('user_valid', false);
    }

    // //////////////////////////////////////////////////////////////

    public static function isLoggedIn() {
        return Session::get('user_valid');
    }

    // //////////////////////////////////////////////////////////////

    public static function isSuperUser() {
		if (self::getCurrentUserLevel() == 1) {
			return true;
		}
		return false;
    }

    // //////////////////////////////////////////////////////////////

    /**
     * Check to see if the current user has access to the given site id
     */
    public static function isLoggedInForSite($site_id) {

        if (isset($site_id) && Session::get('user_valid')) {

            $user_level = SecurityUtils::getCurrentUserLevel();
            $user_id = SecurityUtils::getCurrentUserID();

            //Logger::debug(">>> User ID : $user_id");
            //Logger::debug(">>> User Level : $user_level");
            // If this is a super-user, then allow access. Otherwise check that the
            // user has access to this site
            if ($user_level == 1) {
                return true;
            } else {
                return SitesTable::checkUserSiteAccess($user_id, $site_id);
            }
        }

        return false;
    }

    // //////////////////////////////////////////////////////////////

    public static function getCurrentUserID() {
        return Session::get('user_id');
    }

    public static function getCurrentUserLevel() {
        return Session::get('user_level');
    }

    public static function getCurrentUserName() {
        return Session::get('user_name');
    }

    public static function getCurrentUserEmail() {
        return Session::get('user_email');
    }

    // //////////////////////////////////////////////////////////////

    public static function getMediaFolder($site_id) {
        return FILE_ROOT . "user_files/$site_id/";
    }

    public static function getSitesFolder($site_id) {
        return FILE_ROOT . "user_sites/$site_id/";
    }

    // //////////////////////////////////////////////////////////////

    /**
     * Create a new user, but check to see if that user exists already
     */
    public static function createUser($email, $plain_password, $user_group, $name, $coupon) {
    
        // Create entry in user table
        $password_hash = SecurityUtils::generatePassHash($plain_password);

        // Check to see if this user already exists
        $db_pass = UserTable::getPasswordFromEmail($email);
        $password_hash = SecurityUtils::generatePassHash($plain_password, $db_pass);
        $user_id = UserTable::checkValid($email, $password_hash);

        if (!isset($user_id)) {
            $user_id = UserTable::create($email, $name, $password_hash, $user_group, $coupon);
        }

        return $user_id;
    }

    // //////////////////////////////////////////////////////////////

    /**
     * Create a site, and assign a user to the site
     */
    public static function createSite($user_id, $site_domain, $site_path, $site_theme_id) {

        // Create entry in site table
        $site_id = SitesTable::getNextSiteID();        
        SitesTable::create($site_id, $site_domain, $site_path, $site_theme_id);

        Logger::debug("Created site $site_domain, id = $site_id");

        // Create entry in site table
        SitesTable::addUserToSite($user_id, $site_id);

        // Create site's tables
        //PageParasTable::createTableForSite($site_id);
        GalleryTable::createTableForSite($site_id);
        MediaTable::createTableForSite($site_id);
        PagesTable::createTableForSite($site_id);
        PostsTable::createTableForSite($site_id);
        CommentsTable::createTableForSite($site_id);
        StatsRollupTables::createTableForSite($site_id);

		// Create CRM Tables...
        ContactRequestTable::createTableForSite($site_id);
        CustomerTable::createTableForSite($site_id);

        //PageViewsTable::createTableForSite($site_id);
        //StatsRollupTables::createTableForSite($site_id);
        //BlogFollowersTable::createTableForSite($site_id);
        
        return $site_id;
    }

}

?>