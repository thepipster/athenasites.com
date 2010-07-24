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

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Class constructor
	*/
	//public function __construct(){
	//	self::init();
	//}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Class Destructor
	*/
	//function __destruct(){
	//	self::close();
	//}
		
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Initialize the session
	*/
	public static function init(){	
		session_start();
		self::$session_started_flag = true;
	}
	
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
		if (!self::$session_started_flag) self::init();
		$_SESSION[$name] = $val;
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Get a variable from the session, returns null if it doesn't exist
	* and logs a warning with the Logger
	*/
	public static function get($name){
		
		if (!self::$session_started_flag) self::init();
		
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
		
		if (!self::$session_started_flag) self::init();
				
		if(isset($_SESSION[$name])) unset($_SESSION[$name]);
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Tests whether a variable is in the session (return true if it is)
	*/
	public static function exists($name){	
		if (!self::$session_started_flag) self::init();
			
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
		
		$temp .= "<b>REQUEST (GET or POST or COOKIE) Dump</b><pre>";
		$temp .= self::var_log($_REQUEST);
		$temp .= "</pre>";

		$temp .= "<b>GET Dump</b><pre>";
		$temp .= self::var_log($_GET);
		$temp .= "</pre>";
		
		$temp .= "<b>POST Dump</b><pre>";
		$temp .= self::var_log($_POST);
		$temp .= "</pre>";
				
		return $temp;
		
	}
		
	// //////////////////////////////////////////////////////////////////////////////////////
}

	
?>
