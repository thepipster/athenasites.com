<?php
/**
* Logging class, use for all trace commands
*
*/
class ApolloLogger {

	public static $DEBUG	 	= 0;
	public static $INFO 		= 1;
	public static $WARNING 		= 2;
	public static $ERROR	 	= 3;
	public static $FATAL	 	= 4;
	
	private static $debugLevel = 0;
	
	/** If set to true, echos log to client (as html) */
	private static $echoLog = false;

	/** If set to true, fatal errors are sent to email */				
	private static $sendEmail = true;
	private static $sendEmailLevel = 3;
				
	private static $email		= "error_log@apollosites.com";
	private static $project     = "ApolloSites";
	//private static $log_file    = "ApolloSites";
	
	// //////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Instruct the logger to echo the log as html
	 * 
	 * @access public
	 * @static
	 * @return void
	 */
	public static function echoLog(){
		self::$echoLog = true;
	}

    // //////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Tell the logger to send emails
	 * 
	 * @access public
	 * @static
	 * @param string $email Email address to send messages too
	 * @param string $subject Email subject line (optional)
	 * @return void
	 */
	public static function setSendEmail($level){
		self::$sendEmail = true;
		self::$sendEmailLevel = $level;
	}
	
    // //////////////////////////////////////////////////////////////////////////////////////

    /**
     * Let the Logger catch any system errors
     */
    public static function catchSysErrors(){
        set_error_handler("ApolloLogger::sysErrorHandler");
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
														
		if (self::$echoLog){

			switch($level){
				case self::$DEBUG: 	$levMsg = "<span style='color:009900'>debug</span>"; break;
				case self::$INFO:  	$levMsg = "<span style='color:0000FF'>info</span>"; break;
				case self::$WARNING:$levMsg = "<span style='color:FF6633'>warning</span>"; break;
				case self::$ERROR: 	$levMsg = "<span style='color:FF0101'>error</span>"; break;
				case self::$FATAL: 	$levMsg = "<span style='color:FF0000'><b>fatal</b></span>"; break;
			}

			$logmsg = "[$levMsg <span style='color:#000099'>$class$function</span>] <b>$msg</b>";
			$logmsg .= "<span style='color: #444; font-style: italic;'> on line $line of $file_name</span>";
			if (isset($bt[2]['file'])){
				$fname = basename($bt[2]['file']);
				$logmsg .= "<span style='color: #889; font-style: italic;'>, called from line ".$bt[2]['line']." of $fname</span>";
			}
			$logmsg .= "<br>\n";

			echo $logmsg;
			
			flush();
			
		}
		else {

			// Get IP address....
	
			// Translate level into text...					
			$levMsg = "????";
			switch($level){
				case self::$DEBUG: 	$levMsg = "DEBUG"; break;
				case self::$INFO:  	$levMsg = "INFO"; break;
				case self::$WARNING:$levMsg = "WARNING"; break;
				case self::$ERROR: 	$levMsg = "ERROR"; break;
				case self::$FATAL: 	$levMsg = "FATAL"; break;
			}
					
			$logmsg = "[$levMsg] $class$function $msg";
			$logmsg .= " {on line $line of $file_name";
			if (isset($bt[2]['file'])){
				$fname = basename($bt[2]['file']);
				$logmsg .= ", called from line ".$bt[2]['line']." of $fname";
			}
			if (isset($bt[3]['file'])){
				$fname = basename($bt[3]['file']);
				$logmsg .= ", called from line ".$bt[3]['line']." of $fname";
			}
			$logmsg .= "}";
			
			error_log($logmsg);		
			
			/*
			$level = 'debug';
			
			switch($level){
				case self::$DEBUG: 	$level = "debug"; break;
				case self::$INFO:  	$level = "info"; break;
				case self::$WARNING:$level = "warn"; break;
				case self::$ERROR: 	$level = "error"; break;
				case self::$FATAL: 	$level = "fatal"; break;
			}
					
			//$logmsg = "[$levMsg] $class$function $msg";
			$logmsg = "$msg {on line $line of $file_name";
			if (isset($bt[2]['file'])){
				$fname = basename($bt[2]['file']);
				$logmsg .= ", called from line ".$bt[2]['line']." of $fname";
			}
			if (isset($bt[3]['file'])){
				$fname = basename($bt[3]['file']);
				$logmsg .= ", called from line ".$bt[3]['line']." of $fname";
			}
			$logmsg .= "}";
						
			Session::logMessage($message, $level, $class, $function);
			*/
		}
					
					
		if (self::$sendEmail){

			switch($level){
				case self::$DEBUG: 	$levMsg = "DEBUG"; break;
				case self::$INFO:  	$levMsg = "INFO"; break;
				case self::$WARNING:$levMsg = "WARNING"; break;
				case self::$ERROR: 	$levMsg = "ERROR"; break;
				case self::$FATAL: 	$levMsg = "FATAL"; break;
			}

			$logmsg = "[$levMsg] $class$function $msg";
			$logmsg .= " {on line $line of $file_name";
			if (isset($bt[2]['file'])){
				$fname = basename($bt[2]['file']);
				$logmsg .= ", called from line ".$bt[2]['line']." of $fname";
			}
			if (isset($bt[3]['file'])){
				$fname = basename($bt[3]['file']);
				$logmsg .= ", called from line ".$bt[3]['line']." of $fname";
			}
			$logmsg .= "}";
			
			self::doSendEmail($logmsg, $level);
		}
					
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	private static function doSendEmail($msg, $level){
			
//    	if ($level == self::$ERROR || $level == self::$FATAL){
    	if ($level >= self::$sendEmailLevel){
    		$headers = 'From: ' . self::$email;
    		$message = $msg . "\n\nPOST VARIABLES \n\n" . print_r($_POST, true) . "\nGET VARIABLES\n\n" . print_r($_GET, true) . "\n";
    		mail(self::$email, self::$project . "[" . $_SERVER['HTTP_HOST'] . "]", $message, $headers);
    	}
   	}
   	
	// //////////////////////////////////////////////////////////////////////////////////////

    /**
     * Use to replace system error handler, if desired. Use ApolloLogger::catchSysErrors() to
     * activate
     */
    public static function sysErrorHandler($errno, $errstr, $errfile, $errline){

        switch ($errno) {
            case E_USER_ERROR:
                $levMsg = "SYS_ERROR";
                $level = self::$ERROR;
                break;

            case E_USER_WARNING:
                $levMsg = "SYS_WARNING";
                $level = self::$WARNING;
                break;

            case E_USER_NOTICE:
                $levMsg = "SYS_NOTICE";
                $level = self::$INFO;
                break;

            default:
               $levMsg = "SYS_UNKNOWN";
               //$level = self::$DEBUG;
               $level = -1; // Don't log these, too many
               break;
        }


        if (self::$echoLog){
            
			switch($errno){
				case E_USER_NOTICE:  $levMsg = "<span style='color:0000FF'>info</span>"; break;
				case E_USER_WARNING:$levMsg = "<span style='color:FF6633'>warning</span>"; break;
				case E_USER_ERROR: 	$levMsg = "<span style='color:FF0101'>error</span>"; break;
				default: $levMsg = "<span style='color:009900'>debug</span>"; break;
			}

			$msg = "[$levMsg <span style='color:#000099'>#$errno</span>] <b>$errstr</b>";
			$msg .= "<span style='color: #444; font-style: italic;'> on line $errline of ".basename($errfile)."</span>";
			$msg .= "<br>\n";

			echo $msg;

			flush();

        }
        else {

			if ($level >= self::$debugLevel){
	            $msg = "[$levMsg] No: $errno Msg: $errstr";
	            $msg .= " {on line $errline of ".basename($errfile)."}";
	
	            error_log($msg);
			}
        }

        /* Don't execute PHP internal error handler */
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