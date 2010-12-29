<?php

class ImageUtils
{

	/**
	 * Returns true if the specified file mime type is that of an image
	 *
	 * @param unknown $mime String representation of mime type (e.h. image/jpeg
	 */
	public static function isImageFromMime($mime)
	{

		if ($mime == "image/bmp") {
			return true;
		} else if ($mime == "image/jpeg") {
				return true;
			} else if ($mime == "image/png") {
				return true;
			} else if ($mime == "image/gif") {
				return true;
			}

		return false;
	}

	// /////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Get the image type from its extension
	 */
	public static function getImageTypeFromFilename($filename)
	{

		$imagename = basename(strtolower($filename));

		error_log($imagename);

		if (stripos($imagename, 'jpeg') > 0) {
			return 'jpg';
		} else if (stripos($imagename, 'jpg') > 0) {
				return 'jpg';
			} else if (stripos($imagename, 'png') > 0) {
				return 'png';
			} else if (stripos($imagename, 'gif') > 0) {
				return 'gif';
			} else if (stripos($imagename, 'ico') > 0) {
				return 'ico';
			}

		return 'unknown';
	}

	// /////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Get the image type from its extension
	 */
	public static function getImageMimeFromFilename($filename)
	{

		$imagename = basename(strtolower($filename));

		error_log($imagename);

		if (stripos($imagename, 'jpeg') > 0) {
			return 'image/jpg';
		} else if (stripos($imagename, 'jpg') > 0) {
				return 'image/jpg';
			} else if (stripos($imagename, 'png') > 0) {
				return 'image/png';
			} else if (stripos($imagename, 'gif') > 0) {
				return 'image/gif';
			} else if (stripos($imagename, 'ico') > 0) {
				return 'image/ico';
			}

		return 'unknown';
	}

	// /////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Create an image using the appropriate GD functions based on the image type
	 */
	public static function createImageFromFile($full_filename, $mime_type)
	{

		if ($mime_type == "image/jpeg")
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
	 * @param input_image {Input must be an image stored in a image object}
	 * @param image_type {types are image/jpeg, image/png, image/gif}
	 * @param target_filename {Full file name of target image}
	 * @param resize_mode {Spedicifes the mode, types are fit, crop}
	 * @return {resized image. This will need to be converted to the appropriate image type, and stored}
	 *
	 */
	 /*
	public static function resizeImage($input_image, $mime_type, $resize_mode, $target_width, $target_height)
	{

		//Logger::debug("resizeImage(mime = $mime_type, resize_mode = $resize_mode, target_width = $target_width, target_height = $target_height)");

		// Verify $input_image

		$input_width = imagesx($input_image);
		$input_height = imagesy($input_image);

		$input_ratio = $input_width / $input_height;

		//Verify target width
		if ($target_width < 1) {
			Logger::error("Target width, $target_width, is invalid.  Defaulting to image width, $input_width");
			$target_width = $input_width;
		}

		//Verify target height
		if ($target_height < 1) {
			Logger::error("Target height, $target_height, is invalid.  Defaulting to image height, $input_height");
			$target_height = $input_height;
		}

		$target_ratio = $target_width / $target_height;

		// Calculate the width and height of the output image
		switch ($resize_mode) {

		case "letterbox":
		case "fit":
			$input_crop_x = 0; //no cropping
			$input_crop_y = 0; //no cropping
			if ($input_ratio > $target_ratio) {
				$output_width = $target_width;
				$output_height = floor($target_width / $input_ratio);
			} else {
				$output_height = $target_height;
				$output_width = ceil($target_height * $input_ratio);
			}
			$input_crop_width = $input_width;
			$input_crop_height = $input_height;

			break;

		case "crop":

			// Crop undefined. Use default crop settings (crop the center of the image)
			$output_width = $target_width;
			$output_height = $target_height;
			$output_ratio = $target_ratio;

			if ($input_ratio > $target_ratio) {
				$input_crop_x = ceil(($input_width - ($output_ratio * $input_height)) / 2);
				$input_crop_y = 0;
				$input_crop_width = $input_width - $input_crop_x * 2;
				$input_crop_height = $input_height;
			} else {
				$input_crop_x = 0;
				$input_crop_y = floor(($input_height - ($input_width / $output_ratio)) / 2);
				$input_crop_width = $input_width;
				$input_crop_height = $input_height - $input_crop_y * 2;
			}

			$output_width = $target_width;
			$output_height = $target_height;
			$output_ratio = $output_width / $output_height;
			if ($input_ratio > $target_ratio) {
				$input_crop_x = ceil(($input_width - ($output_ratio * $input_height)) / 2);
				$input_crop_y = 0;
			} else {
				$input_crop_x = 0;
				$input_crop_y = floor(($input_height - ($input_width / $output_ratio)) / 2);
			}

			break;

		default:
			Logger::warning("Resize Mode not Defined");
			break;
		}

		//Create a blank image with the new width and height
		if ($resize_mode == 'letterbox') {
			$output_image = imagecreatetruecolor($target_width, $target_height);

			$x_offset = ($target_width - $output_width) / 2;
			$y_offset = ($target_height - $output_height) / 2;

			if ($y_offset < 0)
				$y_offset = 0;
			if ($x_offset < 0)
				$x_offset = 0;

			imagesavealpha($output_image, true);
			imagefill($output_image, 0, 0, imagecolorallocatealpha($output_image, 0, 0, 0, 127));
		}
		else {
			$output_image = imagecreatetruecolor($output_width, $output_height);
			$y_offset = 0;
			$x_offset = 0;
		}

		Logger::debug(">>>>>> Mime type: $mime_type");

		if ($mime_type == 'image/png') {
			//Preserve transparency in PNGs
			imagealphablending($output_image, false);
		}
		elseif ($mime_type == 'image/gif') {
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

		// Copy the input image to the output image, and resize
		if (imagecopyresampled($output_image, $input_image, $x_offset, $y_offset, $input_crop_x, $input_crop_y, $output_width, $output_height, $input_crop_width, $input_crop_height)) {
			return $output_image;
		} else {
			Logger::error("Could not create $mime_type!!! Failed at imagecopyresampled()");
		}
	}
*/

	/**
	 * Resizes an image.  The function supports gif, png, and jpeg, and preserves the transparency of gif and png images. 
	 * @see http://mediumexposure.com/smart-image-resizing-while-preserving-transparency-php-and-gd-library/
	 *
	 * @param file the image file name to resize
	 * @param width desired width, if you pass width as 0 (zero) this function will disregard width, and use height as constraint. Same vice versa.
	 * @param height desired width, if you pass width as 0 (zero) this function will disregard width, and use height as constraint. Same vice versa.
	 * @param proportional If proportional is set to true – the image will resize to constraints proportionally, once again, with possibility to have either width or height set to zero. 
	 * If one of the dimensions is set to zero, and proportional set to “false” – then the image will be forced to stretch or shrink the other dimension, and disregard the zeroed dimension (leave it the same).
	 * @param $output ('file', 'browser', 'file', or 'return'). Default value is file, which overwrites the source file with the resized image. 'browser' outputs the image through http with the correct MIME type.
	 * 'return' will output a GD library Image object
	 * @param $delete_original If set, will delete the source image file
	 * @param $use_linux_commands The function can use either linux “rm” command, or php @unlink. Most probably you don’t need to ever use that flag, but on some setups – @unlink won’t work due to user access restrictions. 
	 * @return {resized image. This will need to be converted to the appropriate image type, and stored}
	 *
	 */
	public static function resizeImage( $file, $width = 0, $height = 0, $proportional = false, $output = 'file', $delete_original = true, $use_linux_commands = false )
	{
		if ( $height <= 0 && $width <= 0 ) {
			return false;
		}

		$info = getimagesize($file);
		$image = '';

		$final_width = 0;
		$final_height = 0;
		list($width_old, $height_old) = $info;

		if ($proportional) {
			if ($width == 0) $factor = $height/$height_old;
			elseif ($height == 0) $factor = $width/$width_old;
			else $factor = min( $width / $width_old, $height / $height_old);

			$final_width = round($width_old * $factor);
			$final_height = round($height_old * $factor);

		}
		else {
			$final_width = ( $width <= 0 ) ? $width_old : $width;
			$final_height = ( $height <= 0 ) ? $height_old : $height;
		}

		switch ( $info[2] ) {
		case IMAGETYPE_GIF:
			$image = imagecreatefromgif($file);
			break;
		case IMAGETYPE_JPEG:
			$image = imagecreatefromjpeg($file);
			break;
		case IMAGETYPE_PNG:
			$image = imagecreatefrompng($file);
			break;
		default:
			return false;
		}

		$image_resized = imagecreatetruecolor( $final_width, $final_height );

		if ( ($info[2] == IMAGETYPE_GIF) || ($info[2] == IMAGETYPE_PNG) ) {
			$trnprt_indx = imagecolortransparent($image);

			// If we have a specific transparent color
			if ($trnprt_indx >= 0) {

				// Get the original image's transparent color's RGB values
				$trnprt_color    = imagecolorsforindex($image, $trnprt_indx);

				// Allocate the same color in the new image resource
				$trnprt_indx    = imagecolorallocate($image_resized, $trnprt_color['red'], $trnprt_color['green'], $trnprt_color['blue']);

				// Completely fill the background of the new image with allocated color.
				imagefill($image_resized, 0, 0, $trnprt_indx);

				// Set the background color for new image to transparent
				imagecolortransparent($image_resized, $trnprt_indx);


			}
			// Always make a transparent background color for PNGs that don't have one allocated already
			elseif ($info[2] == IMAGETYPE_PNG) {

				// Turn off transparency blending (temporarily)
				imagealphablending($image_resized, false);

				// Create a new transparent color for image
				$color = imagecolorallocatealpha($image_resized, 0, 0, 0, 127);

				// Completely fill the background of the new image with allocated color.
				imagefill($image_resized, 0, 0, $color);

				// Restore transparency blending
				imagesavealpha($image_resized, true);
			}
		}

		imagecopyresampled($image_resized, $image, 0, 0, 0, 0, $final_width, $final_height, $width_old, $height_old);

		if ( $delete_original ) {
			if ( $use_linux_commands )
				exec('rm '.$file);
			else
				@unlink($file);
		}

		switch ( strtolower($output) ) {
		case 'browser':
			$mime = image_type_to_mime_type($info[2]);
			header("Content-type: $mime");
			$output = NULL;
			break;
		case 'file':
			$output = $file;
			break;
		case 'return':
			return $image_resized;
			break;
		default:
			break;
		}

		switch ( $info[2] ) {
		case IMAGETYPE_GIF:
			imagegif($image_resized, $output);
			break;
		case IMAGETYPE_JPEG:
			imagejpeg($image_resized, $output);
			break;
		case IMAGETYPE_PNG:
			imagepng($image_resized, $output);
			break;
		default:
			return false;
		}

		return true;
	}
}
