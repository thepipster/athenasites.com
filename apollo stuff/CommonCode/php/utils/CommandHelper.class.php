<?php
class CommandHelper {

	public static $PARA_TYPE_NUMERIC = 0;
	public static $PARA_TYPE_STRING = 1;
	public static $PARA_TYPE_JSON = 2;
	public static $ZIP_MESSAGE = true;
	
	// ///////////////////////////////////////////////////////////////////////////////////////
	
	public static function init(){
		// Turn off gzip for IE6 or lower, 'cos it can't handle it
	    $br = new Browser;
	
	    if ($br->Name == "MSIE" && $br->Version <= 6.0){
	    	self::$ZIP_MESSAGE = false;
		}
		else {
	    	self::$ZIP_MESSAGE = true;
		}
	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Get a para from either a $_GET or $_POST. Also, check for any sql injection attacks
	* @para paraName
	* @para required if true, this will return an error message and kill the php session
	*/
	public static function getPara($paraName, $required=false, $type=0){
	
	    $val = false;
	    $val_set = false;
			
		if(isset($_POST[$paraName])) {
	        $val = $_POST[$paraName];
	        $val_set = true;
	    }
		if(isset($_GET[$paraName])) {
	        $val = $_GET[$paraName];
	        $val_set = true;
	    }
	
	    if ($val_set){
	
	        switch($type){
	            
	            case self::$PARA_TYPE_NUMERIC :
	                if (!is_numeric($val)){
	                	ApolloLogger::error("Expecting numeric ($type) value for '$paraName', possible SQL injection!");
	                    $msg = CommandHelper::getErrorMessage("Expecting numeric ($type) value for '$paraName', possible SQL injection!");
	                    self::sendMessage($msg);
	                    die();
	                }
	                break;
	
	            case self::$PARA_TYPE_STRING :
	                $val = mysql_real_escape_string($val);
	                break;
	
	            case self::$PARA_TYPE_JSON :
	                // Nothing to do, let through as it'll be parsed into json which will make it safe
	                break;
	        }
	
	        return $val;
	    }
	
	
		if ($required){
			self::sendErrorMessage("Parameter not set, expecting '$paraName'");
			die();
		}
		
		return false;
	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////
	
	public static function getErrorMessage($msg){
		return '{"msg":999,"error": "'.$msg.'"}';
	}
	
	public static function sendErrorMessage($msg){
		self::sendTextMessage(self::getErrorMessage($msg));
	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Send a normal text (string) message back to the client
	*/
	public static function sendTextMessage($msg){
	
		if (self::$ZIP_MESSAGE){
			$msg = gzencode($msg);
			header("Content-Encoding: gzip"); 
			header("Content-Type: text/plain"); 		
		}
		
		print($msg);
	}

	// ///////////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Send the message back to the client, optionally gzip the message
	*/
	public static function sendMessage($data){
	
		if (self::$ZIP_MESSAGE){
			$msg = gzencode(json_encode($data));
			header("Content-Encoding: gzip"); 
			header("Content-Type: text/plain"); 		
		}
		else {
			$msg = json_encode($data);
		}	
		
		print($msg);
	}	
}
?>