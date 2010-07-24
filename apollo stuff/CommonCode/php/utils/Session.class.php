<?php
/**
* Sesson class. This is a wrapper class that is used to provide
* a generic session interface. The undrlying mechanism can be chosen 
* at run-time (such as a database-based custom session manager, or the
* default (php) session manager)
*
*
*/
class Session {

	private static $session_started_flag = false;
		
	/** URL of MySQL server */
	private static  $databaseURL = "10.179.54.29";
	
	/** Name of MySQL database */
	private static $databaseName = "apollo_wpmu";

	/** Username of user with admin rights to database */
//	private static $username = "mike";
	private static $username = "apollo";
	
	/** Password of user with SELECT, DELETE, REPLACE, UPDATE rights to database */
//	private static $password = "mike76";
	private static $password = "z1p!c0ll8ct";
	
	/** Database connection */
	private static $connection = NULL;
	
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Initialize the session
	*/
	public static function init(){	
	
		// Pick up the WP config, if defined
		if (defined('DB_HOST')) Session::$databaseURL = DB_HOST;
		if (defined('DB_USER')) Session::$username = DB_USER;
		if (defined('DB_PASSWORD')) Session::$password = DB_PASSWORD;
		if (defined('DB_NAME')) Session::$databaseName = DB_NAME;
		
		if (!self::$session_started_flag){
		
			//ApolloLogger::debug("Setting up Sesion");
									
			self::$session_started_flag = true;
				
			session_set_save_handler(
				"Session::onSessionOpen", 
				"Session::onSessionClose",
				"Session::onSessionRead",
				"Session::onSessionWrite",
				"Session::onSessionDestroy",
				"Session::onSessionGC");
	/*
			session_set_save_handler( 
				array( &$this, "Session::onSessionOpen" ), 
				array( &$this, "Session::onSessionClose" ),
				array( &$this, "Session::onSessionRead" ),
				array( &$this, "Session::onSessionWrite"),
				array( &$this, "Session::onSessionDestroy"),
				array( &$this, "Session::onSessionGC" )
	        );
	 */       
			session_start();
		}
        		
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////
	
	private static function connect(){
	
		// Attempt to connect to MySQL engine on target server (at specified IP)....
		self::$connection = mysql_connect(self::$databaseURL, self::$username, self::$password);

		if (self::$connection != FALSE){

			// Select the relevant database.........
			if (mysql_select_db(self::$databaseName, self::$connection)) {
				ApolloLogger::debug("Connection to MySQL database '" . self::$databaseName . "' OK!");
			}
			else {
				ApolloLogger::fatal("Failed to connect to MySQL database '" . self::$databaseName . "'");
			}

		}
		else {
			ApolloLogger::fatal("Could not connect to DB!");
		}
			
	}

	
	// //////////////////////////////////////////////////////////////////////////////////////
	//
	// Session Handler callbacks
	//
	// //////////////////////////////////////////////////////////////////////////////////////
	
	/**
	* The onSessionOpen() and onSessionClose() functions are closely related. These are used to 
	* open the session data store and close it, respectively. If you are storing sessions in 
	* the filesystem, these functions open and close files (and you likely need to use a global 
	* variable for the file handler, so that the other session functions can use it).
	*/
	public static function onSessionOpen($save_path, $session_name) {
		self::connect();
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* The onSessionOpen() and onSessionClose() functions are closely related. These are used to 
	* open the session data store and close it, respectively. If you are storing sessions in 
	* the filesystem, these functions open and close files (and you likely need to use a global 
	* variable for the file handler, so that the other session functions can use it).
	*/
	public static function onSessionClose() {
		mysql_close(self::$connection);
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* The onSessionRead() function is called whenever PHP needs to read the session data. This takes 
	* place immediately after _open(), and both are a direct result of your use of session_start().
	*
	* PHP passes this function the session identifier, as the following example demonstrates:
	*/
	public static function onSessionRead($session_id){
				
		//ApolloLogger::debug("Session $session_id read");
    	$id = mysql_real_escape_string($session_id);
		
	    if ($result = mysql_query("SELECT data FROM apollo_Sessions WHERE id = '$id'", self::$connection)) {
	        if (mysql_num_rows($result)) {
	            $record = mysql_fetch_assoc($result);
	            return $record['data'];
	        }
	    }
	 
	    return '';
		
		//global $wpdb;
		//$sql = self::$wpdb->prepare("SELECT data FROM apollo_Sessions WHERE id = %s",  $session_id ); 		
		//return self::$wpdb->query($sql);		
				
	}

	// //////////////////////////////////////////////////////////////////////////////////////
	
	/**
	* The onSessionWrite() function is called whenever PHP needs to write the session data. This takes 
	* place at the very end of the script.
	*
	* PHP passes this function the session identifier and the session data. You don't need to 
	* worry with the format of the data - PHP serializes it, so that you can treat it like a string. 
	* However, PHP does not modify it beyond this, so you want to properly escape it before using 
	* it in a query:
	*/
	public static function onSessionWrite($session_id, $data){
		
		//ApolloLogger::debug("Session $session_id write ($data)");
		
	    $access = time();
 
    	$id = mysql_real_escape_string($session_id);
	    $access = mysql_real_escape_string($access);
    	$data = mysql_real_escape_string($data);
 		
		return mysql_query("REPLACE INTO apollo_Sessions VALUES ('$id', '$access', '$data')", self::$connection);
		
 		//global $wpdb;
		//$sql = self::$wpdb->prepare("REPLACE INTO apollo_Sessions VALUES  (%s, %d, %s)",  $session_id,  time(), $data ); 		
		//return self::$wpdb->query($sql);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* The onSessionDestroy($session_id) function is called whenever PHP needs to destroy all session data associated 
	* with a specific session identifier. An obvious example is when you call session__destroy().
	*
	* PHP passes the session identifier to the function:
	*/
	public static function onSessionDestroy($session_id){
		
		//ApolloLogger::debug("Session destroy");

	    $id = mysql_real_escape_string($session_id);
 
		return mysql_query("DELETE FROM apollo_Sessions WHERE id = '$id'", self::$connection);


 		//global $wpdb;
		//$sql = self::$wpdb->prepare("DELETE FROM apollo_Sessions WHERE id = %d",  $session_id); 		
		//self::$wpdb->query($sql);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////
	
	/**
	* The Session::onSessionGC() function is called every once in a while in order to clean out (delete) old 
	* records in the session data store. More specifically, the frequency in which this function 
	* is called is determined by two configuration directives, session.gc_probability and 
	* session.gc_divisor. The default values for these are 1  and 1000, respectively, which 
	* means there is a 1 in 1000 (0.1%) chance for this function to be called per session initialization.
	*
	* Because the onSessionWrite() function keeps the timestamp of the last access in the access column 
	* for each record, this can be used to determine which records to delete. PHP passes the 
	* maximum number of seconds allowed before a session is to be considered expired:
	*/
	public static function onSessionGC($max_session_lifetime){
		
		ApolloLogger::debug("Session gc - max = $max_session_lifetime");

		$old = time() - $max_session_lifetime;
	 	$old = mysql_real_escape_string($old);

		return mysql_query("DELETE FROM apollo_Sessions WHERE access < '$old'", self::$connection);

 		//global $wpdb;
		//$sql = self::$wpdb->prepare("DELETE FROM apollo_Sessions WHERE access < %d",  $old); 		
		//self::$wpdb->query($sql);				
	}

	// //////////////////////////////////////////////////////////////////////////////////////	
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Recall an existing session
	*/
	//public static function recall(){
	//}
		
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Set a variable into the session
	*/
	public static function set($name, $val){
		
		if (!self::$session_started_flag) {
			global $wpdb;
			self::init($wpdb);
		}
		
		$_SESSION[$name] = $val;
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Get a variable from the session, returns null if it doesn't exist
	* and logs a warning with the Logger
	*/
	public static function get($name){
		
		if (!self::$session_started_flag) {
			global $wpdb;
			self::init($wpdb);
		}
		
		if(isset($_SESSION[$name])) 
			return $_SESSION[$name];
		else
			ApolloLogger::warn("Session variable \"$name\" does not exist, returning null!");
		
		return null;
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Clear a variable in the session
	*/
	public static function clear($name){
		
		if (!self::$session_started_flag) {
			global $wpdb;
			self::init($wpdb);
		}
				
		if(isset($_SESSION[$name])) unset($_SESSION[$name]);
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Tests whether a variable is in the session (return true if it is)
	*/
	public static function exists($name){	
		
		if (!self::$session_started_flag) {
			global $wpdb;
			self::init($wpdb);
		}
			
		if(isset($_SESSION[$name])) return true; 			
		return false;
	}
	
	public static function exist($name){ return self::exists($name); }

	// //////////////////////////////////////////////////////////////////////////////////////

	private static function var_log(&$varInput, $var_name='', $reference='', $method = '=', $sub = false) {
	
	    static $output ;
	    static $depth ;
	
	    if ( $sub == false ) {
	        $output = '' ;
	        $depth = 0 ;
	        $reference = $var_name ;
	        $var = serialize( $varInput ) ;
	        $var = unserialize( $var ) ;
	    } else {
	        ++$depth ;
	        $var =& $varInput ;
	       
	    }
	       
	    // constants
	    $nl = "\n" ;
	    $block = 'a_big_recursion_protection_block';
	   
	    $c = $depth ;
	    $indent = '' ;
	    while( $c -- > 0 ) {
	        $indent .= '  ' ;
	    }
	
	    // if this has been parsed before
	    if ( is_array($var) && isset($var[$block])) {
	   
	        $real =& $var[ $block ] ;
	        $name =& $var[ 'name' ] ;
	        $type = gettype( $real ) ;
	        $output .= $indent.$var_name.' '.$method.'& '.($type=='array'?'Array':get_class($real)).' '.$name.$nl;
	   
	    // havent parsed this before
	    } else {
	
	        // insert recursion blocker
	        $var = Array( $block => $var, 'name' => $reference );
	        $theVar =& $var[ $block ] ;
	
	        // print it out
	        $type = gettype( $theVar ) ;
	        switch( $type ) {
	       
	            case 'array' :
	                //$output .= $indent . $var_name . ' '.$method.' Array ('.$nl;
	                $keys=array_keys($theVar);
	                foreach($keys as $name) {
	                    $value=&$theVar[$name];
	                    self::var_log($value, $name, $reference.'["'.$name.'"]', '=', true);
	                }
	                //$output .= $indent.')'.$nl;
	                break ;
	           
	            case 'object' :
	                $output .= $indent.$var_name.' = '.get_class($theVar).' {'.$nl;
	                foreach($theVar as $name=>$value) {
	                    self::var_log($value, $name, $reference.'->'.$name, '->', true);
	                }
	                $output .= $indent.'}'.$nl;
	                break ;
	           
	            case 'string' :
	                $output .= $indent . $var_name . ' '.$method.' "'.$theVar.'"'.$nl;
	                break ;
	               
	            default :
	                $output .= $indent . $var_name . ' '.$method.' ('.$type.') '.$theVar.$nl;
	                break ;
	               
	        }
	       
	        // $var=$var[$block];
	       
	    }
	   
	    -- $depth ;
	   
	    if( $sub == false )
	        return $output ;
	       
	}

	// //////////////////////////////////////////////////////////////////////////////////////
/*
	public static function logMessage($message, $level, $class, $function){
	
		if (!self::$session_started_flag){
			self::init();
		}
		
    	$message = mysql_real_escape_string($message);
	    $level = mysql_real_escape_string($level);
 		
		return mysql_query("INSERT INTO apollo_Log (message, level, class, function) VALUES  ('$message', '$level', '$class', '$function')", self::$connection);
		
	}
	*/
	// //////////////////////////////////////////////////////////////////////////////////////


	/**
	* Returns a string that represents this object, in this case a string that 
	* contains the field values - with html new line tags
	*/
	public static function toString(){
		if (!self::$session_started_flag) self::init();
		
		$temp = '';
		
		$temp .= "<br><br><b>SESSION Dump</b><pre>";
		$temp .= self::var_log($_SESSION);
		$temp .= "</pre>";
		/*
		$temp .= "<b>REQUEST (GET or POST or COOKIE) Dump</b><pre>";
		$temp .= self::var_log($_REQUEST);
		$temp .= "</pre>";

		$temp .= "<b>GET Dump</b><pre>";
		$temp .= self::var_log($_GET);
		$temp .= "</pre>";
		
		$temp .= "<b>POST Dump</b><pre>";
		$temp .= self::var_log($_POST);
		$temp .= "</pre>";
		*/		
		return $temp;
		
	}
		
	// //////////////////////////////////////////////////////////////////////////////////////
}

	
?>
