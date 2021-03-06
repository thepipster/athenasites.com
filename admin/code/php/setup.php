<?php
/**
* This file includes the configuration settings and sets up the class loader so that 
* subsequent classes are included as required.
*
* @author Mike Pritchard (mike@adastrasystems.com)
* @since March 14th, 2009
*/

// Set cookie options
//setcookie ("ApolloCookie", "", time()+3600, "/", ".athena.local");
setcookie ("ApolloCookie", "", time()+3600, "/", getRealIPAddr());

// Figure out the location of this file
$discRoot = realpath(dirname(__FILE__)) . "/";

$file_root = substr($discRoot, 0, strpos($discRoot, "admin"));
$code_root = substr($discRoot, 0, strpos($discRoot, "admin")) . "admin/code/php/";
$url_root = 'http://' . $_SERVER['HTTP_HOST'] . substr($_SERVER['SCRIPT_NAME'], 0, strpos($_SERVER['SCRIPT_NAME'], "admin"));

define("FILE_ROOT", $file_root); // The root for the code tree 
define("CODE_ROOT", $code_root); // The root for the code tree 

define("AKISMET_API_KEY", "07d55b1f2e1b");
define("AKISMET_USER", "apollosites");
define("AKISMET_PASS", "k9G18ReR");

// Register autloader, but place nice with other autoloaders
//spl_autoload_register(array('Apollo', 'apollo_autoloader'));
spl_autoload_register('apollo_autoloader');
    
// Server-specific passwords kept in sticky file
// see setup.php.sticky_example
require_once($code_root . "setup.php.sticky");

DatabaseManager::connect();

Logger::catchSysErrors();
Logger::setLevelDebug();

define("THUMB_WIDTH", 50);
define("THUMB_HEIGHT", 50);

//Logger::debug("Database user: " . database_user);
//Logger::debug("Database host: " . database_host);

// Load session
Session::init();

// Set default time zone
//date_default_timezone_set('UTC');
date_default_timezone_set('America/New_York'); // EST

// Any shutdown events....
register_shutdown_function("onShutdown");

// /////////////////////////////////////////////////////////////////////////	

function getRealIPAddr() {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {   //check ip from share internet
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } 
    elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {   //to check ip is pass from proxy
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } 
    else {
        $ip = $_SERVER['REMOTE_ADDR'];
    }
    return $ip;
}
    
// /////////////////////////////////////////////////////////////////////////	

/**
 * Tidy up!
 */
function onShutdown(){
    // Close the session file
    session_write_close();
    // Close the database connection
    DatabaseManager::close();
}

// /////////////////////////////////////////////////////////////////////////	

/**
 * autoload classes (no need to include them one by one)
 *
 * @uses classFolder()
 * @param $className string
 */
function apollo_autoloader($className) {
	
//	 error_log("Looking for $className");
	
    $folder = classFolder($className);

    if($folder)
        require_once($folder.$className.".class.php");
}

// /////////////////////////////////////////////////////////////////////////	

/**
 * search for folders and subfolders with classes
 *
 * @param $className string
 * @param $sub string[optional]
 * @return string
 */
 function classFolder($className, $sub = '') {
		   
    if(file_exists(CODE_ROOT.$sub.$className.'.class.php')) {
//    	error_log(".. " . CODE_ROOT.$sub.$className.".class.php FOUND!!");
        return CODE_ROOT.$sub;
    }
    else {
//    	error_log(".. " . CODE_ROOT.$sub.$className.".class.php not found");
    }

    $curDir = dir(CODE_ROOT.$sub);
	
    while(false !== ($folder = $curDir->read())) {
	    if(($folder != '.') && ($folder != '..') && ($folder != '.svn')) {
		    if(is_dir(CODE_ROOT.$sub.$folder)) {
		    	//error_log(".. looking in " . CODE_ROOT.$sub.$folder);
                $subFolder = classFolder($className, $sub.$folder.'/');
               
                if($subFolder) {
                    return $subFolder;
                }
            }
        }
    }
	
    $curDir->close();
	
    return false;
}


?>