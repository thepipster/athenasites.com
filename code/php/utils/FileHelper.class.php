<?php

/**
* File IO helper class
*
* @author Mike Pritchard
* @since January 27th, 2007
*/
class FileHelper {

	// //////////////////////////////////////////////////////////////////////////////////////

	/** 
	* A function to copy files from one directory to another one, including subdirectories and
	* nonexisting or newer files. Function returns number of files copied.
	* This function is PHP implementation of Windows xcopy  A:\dir1\* B:\dir2 /D /E /F /H /R /Y
	* Syntaxis: [$number =] dircopy($sourcedirectory, $destinationdirectory [, $verbose]);
	* Example: $num = dircopy('A:\dir1', 'B:\dir2', 1);
	*/
	function DirCopy($srcdir, $dstdir, $verbose = false) {
		$num = 0;

		if ($verbose)
			Logger::debug("Dest = $dstdir Src = $srcdir");
			 
		if(!is_dir($dstdir)){ 
			Logger::debug("Making dir $dstdir");
			mkdir($dstdir);
		}

		if($curdir = opendir($srcdir)) {
			while($file = readdir($curdir)) {

				if($file != '.' && $file != '..') {

					$srcfile = $srcdir . '\\' . $file;
					$dstfile = $dstdir . '\\' . $file;

					if(is_file($srcfile)) {
						if(is_file($dstfile)) 
							$ow = filemtime($srcfile) - filemtime($dstfile); 
						else 
							$ow = 1;
							
						if($ow > 0) {
							if($verbose) Logger::debug("Copying '$srcfile' to '$dstfile'...");
							if(copy($srcfile, $dstfile)) {
								touch($dstfile, filemtime($srcfile)); 
								$num++;
								if($verbose) Logger::debug("OK!");
							}
							else 
								Logger::debug("Error: File '$srcfile' could not be copied!");
						}                 
					}
					else if(is_dir($srcfile)) {
						$num += dircopy($srcfile, $dstfile, $verbose);
					}
				}
			}
			closedir($curdir);
		}
		return $num;
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Create directory through FTP connection (which allows the owner of the dir
	* to be set as the ftp account used)
	*/
	function ftpMkdir($user_id, $path, $newDir) {
	
		$user = new UserTable();
		$user->fromUserID($user_id);

	    $conn_id = ftp_connect($user->ftp_url); // connection
	
	    // login to ftp server
	    $result = ftp_login($conn_id, $user->ftp_username, $user->ftp_password);
	
	    // check if connection was made
	    if ((!$conn_id) || (!$result)) {
	        return false;
	        Logger::fatal("Could not connect to ftp server!");
	    } 
		else {
	        if (!ftp_chdir($conn_id, $path)) { // go to destination dir
	            $r = false;
	        } 
			else if (!ftp_mkdir($conn_id, $newDir)) { // create directory
	            $r = false;
	        } 
			else if (!ftp_site($conn_id, "CHMOD 0777 $newDir")) { // change attributes
	            $r = false;
	        } 
			else {
	            $r = $newDir;
	        }
	    }
	   
	    ftp_close($conn_id); // close connection
	   
	    return $r;
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Set a file's permissions to 0777 using ftp
	*/
	public static function setDirPermissions($user_id, $dir, $permission){
		
		Logger::debug("User id = $user_id, dir = $dir, permission = $permission");
		
		$user = new UserTable();
		$user->fromUserID($user_id);
		
		// set up basic ftp connection - used to set file/dir permissions....
		$conn_id = ftp_connect($user->ftp_url);

		// login with username and password
		$login_result = ftp_login($conn_id, $user->ftp_username, $user->ftp_password);

		// Set permissions for directory
		$chmod_cmd= "CHMOD 0777 ".$dir;
		$chmod = ftp_site($conn_id, $chmod_cmd);
	
		// close the connection
		ftp_close($conn_id);		
		
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Set a file's permissions to 0777 using ftp
	*/
	public static function setReadWriteAccess($user_id, $dir, $filename){
		
		Logger::debug("User id = $user_id, dir = $dir, file = $filename");
		
		$fullPath = $dir . "/$filename";
		
		$user = new UserTable();
		$user->fromUserID($user_id);
		
		// set up basic ftp connection - used to set file/dir permissions....
		$conn_id = ftp_connect($user->ftp_url);

		// login with username and password
		$login_result = ftp_login($conn_id, $user->ftp_username, $user->ftp_password);

		// Set permissions for directory
		$chmod_cmd= "CHMOD 0777 ".$dir;
		$chmod = ftp_site($conn_id, $chmod_cmd);
	
		// Set permissions for file
		$chmod_cmd= "CHMOD 0777 ".$fullPath;
		$chmod = ftp_site($conn_id, $chmod_cmd);

		// close the connection
		ftp_close($conn_id);		
	}	

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Delete a file
	*/
	public static function deleteFile($dir, $filename){
		$fullPath = $dir . "/$filename";
		print " Fullpath = $fullPath <br>";
		// set up basic ftp connection - used to set file/dir permissions....
		$ftp_server = $this->siteIP;
		$conn_id = ftp_connect($ftp_server);

		// login with username and password
		$login_result = ftp_login($conn_id, $this->username, $this->password);

		$chmod_cmd= "CHMOD 0777 ".$dir;
		$chmod = ftp_site($conn_id, $chmod_cmd);

		$chmod_cmd= "CHMOD 0777 ".$fullPath;
		$chmod = ftp_site($conn_id, $chmod_cmd);

		$cd_cmd= "cd ".$dir;
		print "Cmd = $cd_cmd <br>";
		ftp_site($conn_id, $cd_cmd);
		
		$del_cmd= "rm ".$filename;
		print "Cmd = $del_cmd <br>";
		ftp_site($conn_id, $del_cmd);		
		
		// Reset Permisions...
		$chmod_cmd="CHMOD 0775 ".$dir;
		$chmod=ftp_site($conn_id, $chmod_cmd);
		
		// close the connection
		ftp_close($conn_id);					
	}	

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Return a list of files from the given directory
	*/ 
	public static function getImageList($directory){
	
		$noFiles = 0;
		
		if (is_dir($directory)) {	
			if ($dh = opendir($directory)) {	
			
				while (($file = readdir($dh)) !== false) {	
					
					if (ImageHelper::isImage($file)){
						$imageList[ $noFiles ] = $file;
						$noFiles++;
					}
				}
			}	

			closedir($dh);		
		}	
		
		return $imageList;
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Check to see if a thumbnail exists for the given image filename (by searching for 
	* any combination of the image name and the word thumb). If so, return the thumbnail
	* filename, if not, return null.
	*/
	public static function thumbExists($directory, $imageFilename){
		
		$fileBaseName = basename($imageFilename);
		
		if (is_dir($directory)) {	
			if ($dh = opendir($directory)) {				
				while (($file = readdir($dh)) !== false) {	
					if ( strstr($file, $fileBaseName) && strstr($file, 'thumb') ){						
						//Logger::debug("Found thumb, file = $file");
						if (ImageHelper::isImage($file)){
							return $file;
						}
					}					
				}
			}	

			closedir($dh);		
		}	
		
		return null;
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Return a list of files from the given directory, but ignore any that have the
	* word thumb in the filename
	*/ 
	public static function getImageListWithoutThumbs($directory){
	
		$noFiles = 0;
		
		if (is_dir($directory)) {	
			if ($dh = opendir($directory)) {				
				while (($file = readdir($dh)) !== false) {	
					if ( !strstr($file, 'thumb') ){
						if (ImageHelper::isImage($file)){
							$imageList[ $noFiles ] = $file;
							$noFiles++;
						}
					}					
				}
			}	

			closedir($dh);		
		}	
		
		return $imageList;
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Return a list of thumbnails from the given directory, it assumes that they have
	* a _thumbs in the file name, such as img45_thumb.jpg
	*/ 
	public static function getIhumbList($directory){
	
		$noFiles = 0;
		
		if (is_dir($directory)) {	
			if ($dh = opendir($directory)) {				
				while (($file = readdir($dh)) !== false) {
					if ( strstr($file, 'thumb') ){
						if (ImageHelper::isImage($file)){
							$imageList[ $noFiles ] = $file;
							$noFiles++;
						}
					}					
				}
			}	

			closedir($dh);		
		}	
		
		return $imageList;
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Returns true if the input string is a directory
	*/
	public static function enhanced_is_dir($file, $basedir){
		if(is_dir($file))
			return TRUE;
		else {
			if ($dh = @opendir($basedir. "/" . $file)) {
				closedir($dh);
				return TRUE;
			}
		}
		return FALSE;
	}


	// //////////////////////////////////////////////////////////////////////////////////////
	
	public static function getExtension($fileName){
		$ext = substr($fileName, strrpos($fileName, '.') + 1);	
		return strtolower($ext);
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Returns the base name of a file, e.g. 'c:\dir\file.jpg' yields 'file'
	*/
	public static function getBasename($fileName){
		return basename($fileName, ".".self::getExtension($fileName));
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Move one directory back, and return the result
	* e.g. /home/mike/stuff would be /home/mike
	*/	
	public static function moveBackPath($dir){

		// Explode into an array of tokens, where the seperator was "/"
		$pieces = explode("/", $dir);

		// Removes the last element of an array
		array_pop($pieces);

		// Put the tokens back together, and return.....
		return implode("/", $pieces);
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Find the latest file from the given directory
	 * @return 
	 * @param $dirName String
	 * @param $doRecursive Boolean If set to true, recurse through sub directories
	 */
	public static function getLatestFile($dirName, $doRecursive) {
	    $d = dir($dirName);
	    $lastModified = 0;
		$lastModifiedFname = '';
		
	    while($entry = $d->read()) {
	    	//Logger::debug($entry);
	        if ($entry != "." && $entry != "..") {
	        	Logger::debug(substr($entry, 0, 3) . "   " . $entry);
	        	if (substr($entry, 0, 3) == "php"){
		            if (!is_dir($dirName."/".$entry)) {
		                $currentModified = filemtime($dirName."/".$entry);
		            } 
					else if ($doRecursive && is_dir($dirName."/".$entry)) {
		                $currentModified = mostRecentModifiedFileTime($dirName."/".$entry,true);
		            }
		            if ($currentModified > $lastModified){
		                $lastModified = $currentModified;
						$lastModifiedFname = $entry;
		            }
				}
	        }
	    }
	    $d->close();
	    return $lastModifiedFname;
	}	
}
?>
