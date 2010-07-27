<?php

class SecurityUtils {

	private static $salt_length = 12;

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
	public static function generatePassHash($plain_password, $salt=null){

	    if ($salt === null){
	        $salt = substr(md5(uniqid(rand(), true)), 0, self::$salt_length);
	    }
	    else {
	        $salt = substr($salt, 0, self::$salt_length);
	    }
	
	    return $salt . sha1($salt . $plain_password);

	}
		
	// //////////////////////////////////////////////////////////////
	
	public static function logIn($user_id, $user_group, $user_name, $user_email){
		Session::set('user_valid', true);
		Session::set('user_id', $user_id);
		Session::set('user_name', $user_name);
		Session::set('user_email', $user_email);
		Session::set('user_group', $user_group);
	}

	// //////////////////////////////////////////////////////////////

	public static function logOut(){
		Session::clear('user_id');
		Session::clear('user_group');
		Session::clear('user_email');
		Session::clear('user_name');
		Session::set('user_valid', false);
	}
	
	// //////////////////////////////////////////////////////////////

	public static function isLoggedIn(){
		return Session::get('user_valid');
	}

}



?>