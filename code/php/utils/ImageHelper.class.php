<?php

/**
* This class contains helper methods to aid in image functions
*
* @author Mike Pritchard
* @since January 27th, 2007
*/
class ImageHelper {

	public static $gd_set = false;

	public static $support_image_types = array("jpeg", "jpg", "png", "gif");
		
	// //////////////////////////////////////////////////////////////////////////////////////
		
	/**
	 * Return true of the given file name is a supported image type (WARNING! this relies on using
	 * the file extension!)
	 * @return 
	 * @param $file Object
	 */	
	public static function isImage($file){
	
		Logger::debug("isImage($file)");
	// NOTE!!!!!! Should use exif_imagetype
	
		$ext = FileHelper::getExtension($file);
	
		for ($i=0; $i<count(ImageHelper::$support_image_types); $i++){
			if ($ext == ImageHelper::$support_image_types[$i]) return TRUE;			
		}

		Logger::debug("exiting");
		
		return false;
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Send the correct header
	 * @return 
	 * @param $img Object
	 * @param $type Object
	 */
	public static function sendHeader($type){
		Logger::debug("header type: $type");	
		if ($type == "jpg" || $type == "jpeg" ){	
			//Tell the browser what kind of file is come in 
			header("Content-Type: image/jpeg"); 
		}
		else if ($type == "png") {
			//Tell the browser what kind of file is come in 
			header("Content-Type: image/png"); 
		}
		else if ($type == "gif") {
			//Tell the browser what kind of file is come in 
			header("Content-Type: image/gif"); 
		}
		else if ($type == "bmp") {
			//Tell the browser what kind of file is come in 
			header("Content-Type: image/bmp"); 
		}
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	 * ECho the image to the browser, and return the correct header type
	 * @return 
	 * @param $img Object
	 */
	public static function echoImage($img, $type){

		if ($type == "jpg" || $type == "jpeg" ){	
			//Tell the browser what kind of file is come in 
			header("Content-Type: image/jpeg"); 
			//Output the iamges
			imagejpeg($img);
		}
		else if ($type == "png") {
			//Tell the browser what kind of file is come in 
			header("Content-Type: image/png"); 
			//Output the iamges
			imagepng($img);
		}
		else if ($type == "gif") {
			//Tell the browser what kind of file is come in 
			header("Content-Type: image/gif"); 
			//Output the iamges
			imagegif($img);
		}
		else if ($type == "bmp") {
			//Tell the browser what kind of file is come in 
			header("Content-Type: image/bmp"); 
			//Output the iamges
			imagewbmp($img);
		}
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	public static function createImageFromString($image_string, $imageInfo){

		// Make sure GD is setup correctly
		if (!ImageHelper::$gd_set) {
			ini_set( 'gd.jpeg_ignore_warning', '1');
			ImageHelper::$gd_set = true;
		}
		
		ImageHelper::setMemoryForImageString($image_string, $imageInfo);
		
		$img = imagecreatefromstring($image_string);
		
		if (!$img) {
	        $img  = ImageHelper::createImageFromMessage;
			Logger::error("Could not create jpeg $full_imagename!!!!");			
		}
		
		Logger::debug("Image created ok!");
		
		return $img;
	}
	// //////////////////////////////////////////////////////////////////////////////////////

	public static function createImageFromMessage($message = "Error loading image."){
        $img  = imagecreatetruecolor(150, 30); /* Create a blank image */
        $bgc = imagecolorallocate($img, 255, 255, 255);
        $tc  = imagecolorallocate($img, 0, 0, 0);
        imagefilledrectangle($im, 0, 0, 150, 30, $bgc);
        imagestring($img, 1, 5, 5, $message, $tc);

		return $img;
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Create a jpeg by calling imagecreatefromjpeg, if we don't have the correct file permissions
	* then we set them correctly.
	*/
	public static function createImageFromFile($full_filename){
		
		// Make sure GD is setup correctly
		if (!ImageHelper::$gd_set) {
			ini_set( 'gd.jpeg_ignore_warning', '1');
			ImageHelper::$gd_set = true;
		}
		
		// Make sure there is enough memory available
		ImageHelper::setMemoryForImage($full_filename);
		
		// Get image type
		$ext = FileHelper::getExtension($full_filename);

		if ($ext == "jpg" || $ext == "jpeg" )		
			$img = imagecreatefromjpeg($full_filename);
		else if ($ext == "png") 
			$img = imagecreatefrompng($full_filename);
		else if ($ext == "gif") 
			$img = imagecreatefromgif($full_filename);
		else if ($ext == "bmp") 
			$img = imagecreatefromwbmp($full_filename);
		
		if (!$img) {
	        $img  = ImageHelper::createImageFromMessage;
			Logger::error("Could not create jpeg $full_imagename!!!!");			
		}
		
		Logger::debug("Image $full_filename created ok!");
		
		return $img;
	}
	
	/**
	* Create a jpeg by calling imagecreatefromjpeg, if we don't have the correct file permissions
	* then we set them correctly.
	*/
	/*
	public static function createJpeg($full_filename){
		
		// Make sure GD is setup correctly
		if (!ImageHelper::$gd_set) {
			ini_set( 'gd.jpeg_ignore_warning', '1');
			ImageHelper::$gd_set = true;
		}
		
		// Make sure there is enough memory available
		ImageHelper::setMemoryForImage($full_filename);
		
		$img = imagecreatefromjpeg($full_filename);
		
		if (!$img) {
			Logger::error("Could not create jpeg $full_imagename!!!!");			
		}
		
		Logger::debug("Image $full_filename created ok!");
		
		return $img;
	}
	*/		
	// //////////////////////////////////////////////////////////////////////////////////////

	private static function nextPower2($x){

		Logger::debug("Entering... x = " . $x);
		$higher = 1;
		$orig = $x;
		
		while( $x > 0 )
		{
			$x = $x >> 1;
			$higher = $higher << 1;
		}
		if($orig * 2 == $higher)
			return $orig;
		else
			return $higher;
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Calculate the amount of memory required for the speified image, and if necessary,
	 * increase the default php memory limit
	 */
	private static function setMemoryForImage($filename){
	
	    $imageInfo = getimagesize($filename);
	    $K64 = 65536;    // number of bytes in 64K
	    $TWEAKFACTOR = 2.0;  // Or whatever works for you

	    $memoryNeeded = round( ( $imageInfo[0] * $imageInfo[1]
	                                           * $imageInfo['bits']
	                                           * $imageInfo['channels'] / 8
	                             + $K64
	                           ) * $TWEAKFACTOR
	                         );
							 
		ImageHelper::setNewMemoryLimit($memoryNeeded);
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	 * calculate amount of memory needed to create an image from the given string
	 * @return 
	 * @param $img_string Object
	 */
	private static function setMemoryForImageString($img_string, $imageInfo){		
		$TWEAKFACTOR = 2.0;  // Or whatever works for you	    
	    $K64 = 65536;    // number of bytes in 64K
//	    $memoryNeeded = round( strlen($img_string) * 8 * $TWEAKFACTOR);		

	    $memoryNeeded = round( ( $imageInfo[0] * $imageInfo[1]
	                                           * $imageInfo['bits']
	                                           * $imageInfo['channels'] / 8
	                             + $K64
	                           ) * $TWEAKFACTOR
	                         );
		
		Logger::dump($imageInfo);
		ImageHelper::setNewMemoryLimit($memoryNeeded);
	}	

	// //////////////////////////////////////////////////////////////////////////////////////

	private static function setNewMemoryLimit($memoryNeeded){
		
		Logger::debug("setNewMemoryLimit($memoryNeeded)");
		
	    $MB = 1048576;  // number of bytes in 1M

		// Get the current memory limit
	    $memoryLimit = ini_get('memory_limit') * $MB;
		Logger::debug("Current memory limit = " . $memoryLimit . " MB");
		
		if (function_exists('memory_get_usage')){
			
			if (memory_get_usage() + $memoryNeeded > $memoryLimit){
				
				$delta = $memoryLimit - (memory_get_usage() + $memoryNeeded);
	
				if ($delta < 0) {
					$newLimit = ceil( ($memoryLimit - $delta) / $MB);
			        ini_set( 'memory_limit', $newLimit . 'M' );	
					Logger::debug("Memory limit changed to " . $newLimit . " MB");		
				}
				
		        return true;				
			}
			else {
				Logger::debug("Enough memory available, no need to increase memory limit");
				return true;
			}
		}
		else 
		{
			Logger::error("Can't create memory needed to create image!");
	        return false;
	    }		
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Returns the image thumbnail file name associated to an image filename, e.g.
	* img124.jpg becomes img124_thumb.jpg
	*/ 
	public static function getImageThumbFilename($filename){


		// this part gets the new thumbnail name 		
		$image_base = explode(".", $imagename);
		$image_basename = $image_base[0]; 
		$image_ext = $image_base[1]; 
		$thumbs_imagename = $image_basename."_thumb.".$image_ext;
		
		return $thumbs_imagename;
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Resizes an image that is stored in the database, and stores the result as a file
	*
	* @param src_filename Full file name of source image
	* @param target_filename Full file name of target image
	* @param mode TBD {Spedicifes the mode, types are "cropped, letterbox"}
	*
	*/
	public static function resizeDBImage($image_id, $target_filename, $target_height, $target_width, $mode){
		//
		// Check to see if the thumbnail does not already exist!
		//		

		if (!file_exists($target_filename)){		

			Logger::debug("Making image, original image = [Image ID = $image_id] Target = [$target_filename]");
			
			// Getting data from db
			$img = new ImageOriginalTable();
			$img->fromID($image_id);

			$file = new FileTable();
			$file->fromID($img->file_id, true);			
			
			Logger::debug("Creating image, file id = " . $img->file_id);

			$imageInfo[0] = $img->width;
			$imageInfo[1] = $img->height;
			$imageInfo['bits'] = $img->bit_depth;
			$imageInfo['channels'] = $img->no_channels;

			$originalImage = ImageHelper::createImageFromString($file->file_contents, $imageInfo);
			
			if (!$originalImage) Logger::fatal("Can't create jpeg!");

			$dst_mage = ImageHelper::resizeImage($originalImage, $ext, $resizeMode, $outputWidth, $outputHeight, $cropTop, $cropRight, $cropBottom, $cropLeft);

			// Output
			imagejpeg($dst_image, $target_filename);
			
		}
		else {
			Logger::warning("Thumbnail already exists! Original image = [$src_filename] Target = [$target_filename]");	
			return false;	
		}
		
		return true;
		
	}

	// //////////////////////////////////////////////////////////////////////////////////////

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

		// *** Verify $input_image

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
		}else{
			Logger::error("Could not create $mime_type!!! Failed at imagecopyresampled()");
		}
	}
		
	// //////////////////////////////////////////////////////////////////////////////////////

}
?>