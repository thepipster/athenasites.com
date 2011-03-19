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
* This class provides a way consitent and simplified way to handle user content
* from the client (browser).
*
* Requires: a slighlty modified version of Garry Whites' browser detection class (Browser.class.php) 
* for the optional init method, if you don't use this then you don't need this file.
* 
* Usage; 
*
* [Optional] Call CommandHelper::init() to setup (this determines if the browser supports gzip)
* Alternatively, just set CommandHelper::$ZIP_MESSAGE yourself.
*
* Validation examples;
*
* To validate a $POST or $GET para called 'myParaName' that is required and you expect to be numeric call;
* CommandHelper::getPara('myParaName', true, CommandHelper::$PARA_TYPE_NUMERIC);
*
* To validate a $POST or $GET para called 'myParaName' that is required and you expect to be a string call;
* CommandHelper::getPara('myParaName', true, CommandHelper::$PARA_TYPE_STRING);
*
* To validate a $POST or $GET para called 'myParaName' that is NOT required and you expect to be a json encoded object call;
* CommandHelper::getPara('myParaName', false, CommandHelper::$PARA_TYPE_JSON);
*
* @author Mike Pritchard (mike@adastrasystems.com) 
*
*/
class CommandHelper {

	public static $PARA_TYPE_NUMERIC = 0;
	public static $PARA_TYPE_STRING = 1;
	public static $PARA_TYPE_JSON = 2;
	public static $ZIP_MESSAGE = true;
	
	// ///////////////////////////////////////////////////////////////////////////////////////
	
	public static function init(){
	
		$browser = new BrowserDetect();
			 	
		// Turn off gzip for IE6 or lower, 'cos it can't handle it
		$browser_name = $browser->getBrowser();
		$browser_version = $browser->getVersion();
		
	    if ($browser_name == BrowserDetect::BROWSER_IE && $browser_version < 7){
	    	self::$ZIP_MESSAGE = false;
		}
		else {
	    	self::$ZIP_MESSAGE = true;
		}
	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Get a para from either a $_GET or $_POST. Also, check for any sql injection attacks
	*
	* @return The validated para, or null if validation failed.
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
	
		$typestr = "Unknown";
	
	    if ($val_set){
	
	        switch($type){
	            
	            case self::$PARA_TYPE_NUMERIC :
	            	$typestr = 'numeric';
	                if (is_numeric($val)){
	                	return $val;
	                }
	                break;
	
	            case self::$PARA_TYPE_STRING :
	                return mysql_real_escape_string($val);
	                break;
	
	            case self::$PARA_TYPE_JSON :
	            	$typestr = 'JSON';
	            	// Test to see if it can be decoded
	            	$test = json_decode($val);
	            	if ($test){
		                return $val;
	            	}
	                break;
	        }
	        
			if ($required){
				self::sendValidateFailMessage("Validation failed, expecting '$paraName' to be of type $typestr");
				die();
			}
	        
	    }

		// If we get here, then could not find para in $GET or $POST	        
		if ($required){
			self::sendValidateFailMessage("Parameter not set, expecting '$paraName'");
			die();
		}
				
		return false;
	}

	// ///////////////////////////////////////////////////////////////////////////////////////
	
	public static function sendAuthorizationFailMessage($msg){
		$data['result'] = 'fail';
		$data['data'] = 'Authorization failure: ' . $msg;
		error_log("Authorization failure!!!");
		self::sendMessage($data);
	}

	// ///////////////////////////////////////////////////////////////////////////////////////

	private static function sendValidateFailMessage($msg){
		$data['result'] = 'fail';
		$data['data'] = 'Validation failure: ' . $msg;
		error_log($data['data']);
		self::sendMessage($data);
	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////
		
	/**
	* Send a normal text (string) message back to the client.
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
	* Send the message back to the client, optionally gzip the message. The data is encoded
	* using json_encode, see http://php.net/manual/en/function.json-encode.php for more information
	*
	* @param data - The data to be encoded
	*/
	public static function sendMessage($data){
	
		if (self::$ZIP_MESSAGE){
			$msg = gzencode(json_encode($data));
			if (isset($msg)){
				header("Content-Encoding: gzip"); 
				header("Content-Type: text/plain"); 		
			}
			else {
				$msg = json_encode($data);
			}
		}
		else {
			$msg = json_encode($data);
		}	
		
		print($msg);
	}	
}
?>