<?php
/**
* Logging class, use for all trace commands
*
*/
class Logger {

	public static $DEBUG	 	= 0;
	public static $INFO 		= 1;
	public static $WARNING 		= 2;
	public static $ERROR	 	= 3;
	public static $FATAL	 	= 4;
	
	private static $debugLevel = 0;
	
	private static $echoLog = false;
	private static $emailLog = true;
							
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Class constructor
	*/
	public function __construct(){
		self::init();
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function echoLog(){
		self::$echoLog = true;
	}

    // //////////////////////////////////////////////////////////////////////////////////////

    /**
     * Let the Logger catch any system errors
     */
    public static function catchSysErrors(){
        set_error_handler("Logger::sysErrorHandler");
    }

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* 
	*/
	private static function trace($level, $msg){

		if ($level < self::$debugLevel){
			return;
		}
			   
		$bt = debug_backtrace();
		
		$class = "";
		$function = "";
		
		// get class, function called by caller of caller of caller
		if (isset($bt[2]['class'])){
			$class = $bt[2]['class'];
			$function = "." . $bt[2]['function'];
		}
				
		
		// get file, line where call to caller of caller was made
		$file = $bt[1]['file'];
		$line = $bt[1]['line'];
		
		$file_name = basename($file);
									
		// Build HTML message...
					
		$levMsg = "";			
		switch($level){
			case self::$DEBUG: 	$levMsg = "<span style='color:009900'>debug</span>"; break;
			case self::$INFO:  	$levMsg = "<span style='color:0000FF'>info</span>"; break;
			case self::$WARNING:$levMsg = "<span style='color:FF6633'>warning</span>"; break;
			case self::$ERROR: 	$levMsg = "<span style='color:FF0101'>error</span>"; break;
			case self::$FATAL: 	$levMsg = "<span style='color:FF0000'><b>fatal</b></span>"; break;
		}

		$html_msg = "[$levMsg <span style='color:#000099'>$class$function</span>] <b>$msg</b>";
		$html_msg .= "<span style='color: #444; font-style: italic;'> on line $line of $file_name</span>";
		if (isset($bt[2]['file'])){
			$fname = basename($bt[2]['file']);
			$html_msg .= "<span style='color: #889; font-style: italic;'>, called from line ".$bt[2]['line']." of $fname</span>";
		}
		$html_msg .= "<br>\n";					
					
		// Build simple message....
	
		$levMsg = "";			
		switch($level){
			case self::$DEBUG: 	$levMsg = "DEBUG"; break;
			case self::$INFO:  	$levMsg = "INFO"; break;
			case self::$WARNING:$levMsg = "WARNING"; break;
			case self::$ERROR: 	$levMsg = "ERROR"; break;
			case self::$FATAL: 	$levMsg = "FATAL"; break;
		}
				
		$msg = "[$levMsg] $class$function $msg";
		$msg .= " {on line $line of $file_name";
		if (isset($bt[2]['file'])){
			$fname = basename($bt[2]['file']);
			$msg .= ", called from line ".$bt[2]['line']." of $fname";
		}
		if (isset($bt[3]['file'])){
			$fname = basename($bt[3]['file']);
			$msg .= ", called from line ".$bt[3]['line']." of $fname";
		}
		$msg .= "}";		
					
		if (self::$echoLog){
			echo $html_msg;						
			flush();			
		}
		else {
			error_log($msg);		
		}
		
		// If set, email ERRORs or FATAL message...		
		if (self::$emailLog && ($level == self::$ERROR || $level == self::$FATAL) && !DEV_MODE){
			EmailQueueTable::add(PageManager::$site_id, "mike@apollosites.com", "Mike", "logger@apollosites.com", "Apollo Logger", "Logger", $html_msg, $msg);
		}
		
			
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

    /**
     * Use to replace system error handler, if desired. Use Logger::catchSysErrors() to
     * activate
     */
    public static function sysErrorHandler($errno, $errstr, $errfile, $errline){

        switch ($errno) {
            case E_USER_ERROR:
                $levMsg = "SYS_ERROR";
                break;

            case E_USER_WARNING:
                $levMsg = "SYS_WARNING";
                break;

            case E_USER_NOTICE:
                $levMsg = "SYS_NOTICE";
                break;

            default:
                $levMsg = "SYS_UNKNOWN";
               break;
        }

		// Build HTML message...
		
		switch($errno){
			case E_USER_NOTICE:  $levMsg = "<span style='color:0000FF'>info</span>"; break;
			case E_USER_WARNING:$levMsg = "<span style='color:FF6633'>warning</span>"; break;
			case E_USER_ERROR: 	$levMsg = "<span style='color:FF0101'>error</span>"; break;
			default: $levMsg = "<span style='color:009900'>debug</span>"; break;
		}

		$html_msg = "[$levMsg <span style='color:#000099'>#$errno</span>] <b>$errstr</b>";
		$html_msg .= "<span style='color: #444; font-style: italic;'> on line $errline of ".basename($errfile)."</span>";
		$html_msg .= "<br>\n";

		// Build basic message...

		switch($errno){
			case E_USER_NOTICE:  $levMsg = "INFO"; break;
			case E_USER_WARNING:$levMsg = "WARNING"; break;
			case E_USER_ERROR: 	$levMsg = "ERROR"; break;
			default: $levMsg = "DEBUG"; break;
		}

        $msg = "[$levMsg] No: $errno Msg: $errstr";
        $msg .= " {on line $errline of " . basename($errfile) . "}";
		
        if (self::$echoLog){
			echo $html_msg;			
			flush();
        }
        else {
            error_log($msg);
        }

		// If set, email ERRORs or FATAL message...		
		if (self::$emailLog && $errno == E_USER_ERROR && !DEV_MODE){
			EmailQueueTable::add(PageManager::$site_id, "mike@apollosites.com", "Mike", "logger@apollosites.com", "Apollo Logger", "Logger", $html_msg, $msg);
		}

        return true;
    }
    
    // //////////////////////////////////////////////////////////////////////////////////////

	public static function setLevel($newLevel) { $debugLevel = $newLevel; }

	public static function setLevelDebug() { self::$debugLevel = self::$DEBUG; }
	public static function setLevelInfo() { self::$debugLevel = self::$INFO; }
	public static function setLevelWarning() { self::$debugLevel = self::$WARNING; }
	public static function setLevelError() { self::$debugLevel = self::$ERROR; }
	public static function setLevelFatal() { self::$debugLevel = self::$FATAL; }
	
	// //////////////////////////////////////////////////////////////////////////////////////

	/** Print debug message, e.g debug(__CLASS__, 'some error message', __LINE__); */
	public static function dump($var) { self::debug("<pre>" . print_r($var, true) . "</pre>"); }
	public static function debug($msg){ self::trace(self::$DEBUG, $msg);	}
	public static function warning($msg){ self::trace(self::$WARNING, $msg);	}
	public static function warn($msg){ self::trace(self::$WARNING, $msg);	}
	public static function error($msg){ self::trace(self::$ERROR, $msg);	}
	public static function info($msg){  self::trace(self::$INFO, $msg);	}
	public static function fatal($msg){ self::trace(self::$FATAL, $msg);	die(); }

	// //////////////////////////////////////////////////////////////////////////////////////
}

	
?>