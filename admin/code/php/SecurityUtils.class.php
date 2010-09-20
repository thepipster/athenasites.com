<?php

class SecurityUtils {

    private static $salt_length = 12;

    /**
     * The nonce (number used once) duration (in seconds)
     */
    private static $nonce_duration = 600; 

    // //////////////////////////////////////////////////////////////

    /**
     * Check to see if the given nonce is still valid
     * @param string $nonce
     * @param string $action An action name: ie: ‘delete-post’
     * @param string $user A user ID (optional – makes the NONCE only work with a specific user)
     * @return <type>
     */
    public static function checkNonce($nonce, $action = '', $user=''){
	// Nonce generated 0-12 hours ago
        $nonceCheck = substr(self::generateNonceHash( $action . $user ), -self::$salt_length, 10);
	if ( $nonceCheck == trim($nonce) ){
            return true;
	}
	return false;
    }
    
    // //////////////////////////////////////////////////////////////

    /**
     * Create a brand new nonce (number used once)
     * @param string $action
     * @param string $user
     * @return <type>
     */
    public static function createNonce($action = '', $user=''){
	return substr( self::generateNonceHash( $action . $user ), -self::$salt_length, 10);
    }
    
    // //////////////////////////////////////////////////////////////

    /**
     * This method generates the nonce timestamp
     * @param string $action An action name: ie: ‘delete-post’
     * @param string $user A user ID (optional – makes the NONCE only work with a specific user)
     * @return <type>
     */
    private static function generateNonceHash($action='', $user=''){
	$i = ceil( time() / ( self::$nonce_duration / 2 ) );
	return md5( $i . $action . $user . $action );
    }

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

    /**
     * Check to see if the current user has access to the given site id
     */
    public static function isLoggedInForSite($site_id) {

        if (Session::get('user_valid')) {

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
    public static function createUser($email, $plain_password, $user_group, $name) {
        // Create entry in user table
        $password_hash = SecurityUtils::generatePassHash($plain_password);

        // Check to see if this user already exists
        $db_pass = UserTable::getPasswordFromEmail($email);
        $password_hash = SecurityUtils::generatePassHash($plain_password, $db_pass);
        $user_id = UserTable::checkValid($email, $password_hash);

        if (!isset($user_id)) {
            $user_id = UserTable::create($email, $name, $password_hash, $user_group);
        }

        return $user_id;
    }

    // //////////////////////////////////////////////////////////////

    /**
     * Create a site, and assign a user to the site
     */
    public static function createSite($user_id, $site_domain, $site_path, $site_theme) {

        // Create entry in site table
        $site_id = SitesTable::create($site_domain, $site_path, $site_theme);

        Logger::debug("Created site $site_domain, id = $site_id");

        // Create entry in site table
        SitesTable::addUserToSite($user_id, $site_id);

        // Create files directory
        mkdir(self::getMediaFolder($site_id), 0777);
        mkdir(self::getSitesFolder($site_id), 0777);

        // Create site's tables
        PageParasTable::createTableForSite($site_id);
        GalleryTable::createTableForSite($site_id);
        FolderTable::createTableForSite($site_id);
        PagesTable::createTableForSite($site_id);
        PostsTable::createTableForSite($site_id);
        CommentsTable::createTableForSite($site_id);

        //PageViewsTable::createTableForSite($site_id);
        //StatsRollupTables::createTableForSite($site_id);
        //BlogFollowersTable::createTableForSite($site_id);
    }

}

?>