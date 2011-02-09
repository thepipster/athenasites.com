<?php
/**
* *******************************************************************
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
* 
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* 
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
* 
* *******************************************************************
*
* Sesson class. This is a wrapper class that is used to provide
* a generic session interface. The undrlying mechanism can be chosen 
* at run-time (such as a database-based custom session manager, or the
* default (php) session manager).
*
* If using a database to store the sessions, then you need to have a table
* with the following fields;
*
* id varchar(32) {primary key}
* access int (10)
* data text
*
* @author Mike Pritchard (mike@adastrasystems.com)
* @since July 6th, 2006
*/
class Session {

	private static $session_started_flag = false;
			
	private static $table_name = "lza_Sessions";
	
	/** 
	* Flag to determine if we should use the database to store sessions. This must be set *before* the init 
	* method, or any method, is called!
	*/
	private static $use_db = false;
		
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Initialize the session
	* @param $use_db Flag to determine if we should use the database to store sessions.
	*/
	public static function init($use_db=false){	
	
		self::$use_db = $use_db;
		
		if (!self::$session_started_flag){
		
			//Logger::debug("Setting up Sesion");
									
			self::$session_started_flag = true;
				
			if ($use_db){	
				session_set_save_handler(
					"Session::onSessionOpen", 
					"Session::onSessionClose",
					"Session::onSessionRead",
					"Session::onSessionWrite",
					"Session::onSessionDestroy",
					"Session::onSessionGC");
   			}
   			
			session_start();
		}
        		
	}
	
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
			Logger::warn("Session variable \"$name\" does not exist, returning null!");
		
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
	//
	// Low-level methods to perform actual session management
	//
	// //////////////////////////////////////////////////////////////////////////////////////
	
	private static function connect(){	
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
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* The onSessionRead() function is called whenever PHP needs to read the session data. This takes 
	* place immediately after _open(), and both are a direct result of your use of session_start().
	*
	* PHP passes this function the session identifier, as the following example demonstrates:
	*/
	public static function onSessionRead($session_id){
				
		//Logger::debug("Session $session_id read");
    	$id = mysql_real_escape_string($session_id);
		
	    if ($result = DatabaseManager::submitQuery("SELECT data FROM " . self::$table_name . " WHERE id = '$id'")) {
	        if (mysql_num_rows($result)) {
	            $record = mysql_fetch_assoc($result);
	            return $record['data'];
	        }
	    }
	 
	    return '';
		
		//global $wpdb;
		//$sql = self::$wpdb->prepare("SELECT data FROM " . self::$table_name . " WHERE id = %s",  $session_id ); 		
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
		
		//Logger::debug("Session $session_id write ($data)");
		
	    $access = time();
 
    	$id = mysql_real_escape_string($session_id);
	    $access = mysql_real_escape_string($access);
    	$data = mysql_real_escape_string($data);
 		
		return DatabaseManager::submitQuery("REPLACE INTO " . self::$table_name . " VALUES ('$id', '$access', '$data')");
		
 		//global $wpdb;
		//$sql = self::$wpdb->prepare("REPLACE INTO " . self::$table_name . " VALUES  (%s, %d, %s)",  $session_id,  time(), $data ); 		
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
		
		//Logger::debug("Session destroy");

	    $id = mysql_real_escape_string($session_id);
 
		return DatabaseManager::submitQuery("DELETE FROM " . self::$table_name . " WHERE id = '$id'");


 		//global $wpdb;
		//$sql = self::$wpdb->prepare("DELETE FROM " . self::$table_name . " WHERE id = %d",  $session_id); 		
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
		
		Logger::debug("Session gc - max = $max_session_lifetime");

		$old = time() - $max_session_lifetime;
	 	$old = mysql_real_escape_string($old);

		return DatabaseManager::submitQuery("DELETE FROM " . self::$table_name . " WHERE access < '$old'");

 		//global $wpdb;
		//$sql = self::$wpdb->prepare("DELETE FROM " . self::$table_name . " WHERE access < %d",  $old); 		
		//self::$wpdb->query($sql);				
	}

	// //////////////////////////////////////////////////////////////////////////////////////	
	// 
	// Logging functions (for debug use only)
	//
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