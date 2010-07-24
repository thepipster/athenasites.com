<?php

class ImageUtils {

	/**
	* Returns true if the specified file mime type is that of an image
	* @param $mime String representation of mime type (e.h. image/jpeg
	*/ 
	public static function isImageFromMime($mime){
	
		if ($mime == "image/bmp"){
			return true;
		}
		else if ($mime == "image/jpeg"){
			return true;
		}
		else if ($mime == "image/png"){
			return true;
		}
		else if ($mime == "image/gif"){
			return true;
		}
		
		return false;
	}
	
	// /////////////////////////////////////////////////////////////////////////////////////////

	/**
	* Get the image type from its extension
	*/
	public static function getImageTypeFromFilename($filename){
		
		error_log("getImageTypeFromFilename($filename)");
		
		$imagename = basename(strtolower($filename));
		
		error_log($imagename);
		
		if (stripos($imagename, 'jpeg') > 0){
			return 'jpg';
		}
		else if (stripos($imagename, 'jpg') > 0){
			return 'jpg';
		}
		else if (stripos($imagename, 'png') > 0){
			return 'png';
		}
		else if (stripos($imagename, 'gif') > 0){
			return 'gif';
		}
		else if (stripos($imagename, 'ico') > 0){
			return 'ico';
		}
		
		return 'unknown';
	}
	
}

