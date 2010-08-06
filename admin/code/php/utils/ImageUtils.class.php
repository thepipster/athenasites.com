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
	
	// /////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Create an image using the appropriate GD functions based on the image type
	*/
	public static function createImageFromFile($full_filename, $mime_type){
						
		if ($mime_type == "image/jpeg" )		
			$img = imagecreatefromjpeg($full_filename);
		else if ($mime_type == "image/png") 
			$img = imagecreatefrompng($full_filename);
		else if ($mime_type == "image/gif") 
			$img = imagecreatefromgif($full_filename);
		else if ($mime_type == "image/bmp") 
			$img = imagecreatefromwbmp($full_filename);
		
		return $img;
	}

	// /////////////////////////////////////////////////////////////////////////////////////////
/*
	public static function saveImageAsPNG($image_object, $filename){

		$image = imagecreatetruecolor($width, $height);

		imageSaveAlpha($image, true);
		ImageAlphaBlending($image, false);

		$transparentColor = imagecolorallocatealpha($image, $red, $green, $blue, $alpha);
		imagefill($image, 0, 0, $transparentColor);

		imagepng($image, $filename);
	}
*/			
	// /////////////////////////////////////////////////////////////////////////////////////////

	/**
	* Resizes an image.  If $resize_mode = 'crop', and no coordinates are specified, the image is cropped in the center.
	*
	* @param input_image {Input must be an image stored in a variable.  It should already be converted to an image using imagecreatefromstring, etc...}
	* @param image_type {types are image/jpeg, image/png, image/gif}
	* @param target_filename {Full file name of target image}
	* @param resize_mode {Spedicifes the mode, types are fit, crop}
	* @param crop {array} Specifies the coordinates of the crop in the order top, right, bottom, left.
	* @param crop_left {specifies the x coordinate of the top left corner of the crop}
	* @param crop_top {specifies the y coordinate of the top left corner of the crop}
	* @param crop_right {specifies the x coordinate of the bottom right corner of the crop}
	* @param crop_bottom {specifies the y coordinate of the bottom right corner of the crop}
	* @return {resized image. This will need to be converted to the appropriate image type, and stored}
	*
	*/
	public static function resizeImage($input_image, $mime_type, $resize_mode, $target_width, $target_height, $crop = NULL){

		Logger::debug("resizeImage(mime = $mime_type, resize_mode = $resize_mode, target_width = $target_width, target_height = $target_height, $crop)");
		
		// Verify $input_image

		$input_width = imagesx($input_image);
		$input_height = imagesy($input_image);
		
		$input_ratio = $input_width / $input_height;
		
		//Verify target width
		if($target_width < 1){
			Logger::error("Target width, $target_width, is invalid.  Defaulting to image width, $input_width");
			$target_width = $input_width;
		}
		//Verify target height
		if($target_height < 1){
			Logger::error("Target height, $target_height, is invalid.  Defaulting to image height, $input_height");
			$target_height = $input_height;
		}

		$target_ratio = $target_width / $target_height;
		
		//Verify crop parameters
		if($resize_mode == "crop"){
			if(is_null($crop) || !is_array($crop)){
				$crop_mode = "default";
			}elseif(count($crop) != 4){
				Logger::error("Incorrect number of crop parameters defined: ".count($crop).".");
				$crop_mode = "default";
			}elseif($crop[0] < 0 || $crop[1] > $target_width || $crop[2] > $target_height || $crop[3] < 0){
				Logger::error("Crop Parameters out of range of the image size.");
				$crop_mode = "default";
			}elseif($crop[2] - $crop[0] < 1 || $crop[1] - $crop[4] < 1){
				Logger::error("Crop Parameters would give the final image negative dimensions.");
				$crop_mode = "default";
			}else{
				$crop_mode = "custom";
			}
		}
		// Calculate the width and height of the output image
		switch($resize_mode){
			case "fit":
				$input_crop_x = 0; //no cropping
				$input_crop_y = 0; //no cropping
				if($input_ratio > $target_ratio){
					$output_width = $target_width;
					$output_height = floor($target_width / $input_ratio);
				}else{
					$output_height = $target_height;
					$output_width = ceil($target_height * $input_ratio);
				}
				$input_crop_width = $input_width;
				$input_crop_height = $input_height;
			break;
			case "crop":
				Logger::debug("Crop Requested");
				switch($crop_mode){
					case "default":
						// Crop undefined. Use default crop settings (crop the center of the image)
						$output_width = $target_width;
						$output_height = $target_height;
						$output_ratio = $target_ratio;
						if($input_ratio > $target_ratio){
							$input_crop_x = ceil(($input_width - ($output_ratio * $input_height)) / 2);
							$input_crop_y = 0;
							$input_crop_width = $input_width - $input_crop_x * 2;
							$input_crop_height = $input_height;
						}else{
							$input_crop_x = 0;
							$input_crop_y = floor(($input_height - ($input_width / $output_ratio)) / 2);
							$input_crop_width = $input_width;
							$input_crop_height = $input_height - $input_crop_y * 2;
						}

						$output_width = $target_width;
						$output_height = $target_height;
						$output_ratio = $output_width / $output_height;
						if($input_ratio > $target_ratio){
							$input_crop_x = ceil(($input_width - ($output_ratio * $input_height)) / 2);
							$input_crop_y = 0;
						}else{
							$input_crop_x = 0;
							$input_crop_y = floor(($input_height - ($input_width / output_ratio)) / 2);
						}
					break;
					case "custom":
						// Crop Defined
						$input_crop_x = $crop_left;
						$input_crop_y = $crop_top;
						$input_crop_width = $crop_right - $crop_left;
						$input_crop_height = $crop_bottom - $crop_top;
						$input_crop_ratio = $input_crop_width / $input_crop_height;
						Logger::debug("input_crop_ratio: $input_crop_ratio");
						if($input_crop_ratio > $target_ratio){
							$output_width = $target_width;
							$output_height = floor($target_width / $input_crop_ratio);
						}else{
							$output_height = $target_height;
							$output_width = ceil($target_height * $input_crop_ratio);
						}
					break;
					case "default":
						Logger::warning("Crop Mode not Defined");
					break;
				}
			break;
			default:
				Logger::warning("Resize Mode not Defined");
			break;
		}

		//Create a blank image with the new width and height
		Logger::debug("Output Height: $output_height");
		Logger::debug("Output Width: $output_width");
		$output_image = imagecreatetruecolor($output_width, $output_height);
		
		if($mime_type == 'image/png'){
			//Preserve transparency in PNGs
			imagealphablending($output_image, false);
		}elseif($mime_type == 'image/gif'){
			//Preserve transparency in GIFs
	        $trnprt_indx = imagecolortransparent($input_image);
	        if ($trnprt_indx >= 0) {
	            //its transparent
	            $trnprt_color = imagecolorsforindex($input_image, $trnprt_indx);
	            $trnprt_indx = imagecolorallocate($output_image, $trnprt_color['red'], $trnprt_color['green'], $trnprt_color['blue']);
	            imagefill($output_image, 0, 0, $trnprt_indx);
	            imagecolortransparent($output_image, $trnprt_indx);
	        }
		}

		//Copy the input image to the output image, and resize
		if (imagecopyresampled($output_image, $input_image, 0, 0, $input_crop_x, $input_crop_y, $output_width, $output_height, $input_crop_width, $input_crop_height)){
			logger::debug(", 0, 0, $input_crop_x, $input_crop_y, $output_width, $output_height, $input_crop_width, $input_crop_height)");
			return $output_image;
		}
		else{
			Logger::error("Could not create $mime_type!!! Failed at imagecopyresampled()");
		}
	}
		

}

