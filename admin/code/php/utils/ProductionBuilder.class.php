<?php

class ProductionBuilder {

	/**
	 * Take all of the individual JS classes/files used and builds them into one
	 * big JS file, minifying each in turn
	 * 
	 * @param array $js_files Array of Javascript include (full) paths to use to build the production file
	 * @param string $master_filename The filename of the production javascript file
	 * @param boolean $doMinify flag to determine if we minify the code or just concatanate
	 * @return 
	 */
	public static function buildProductionJS($js_files, $master_filename, $doMinify=true) {
		
		$doMinify = false;
		
		Logger::debug("Processing JS.. [$master_filename]");
	 	 	
	 	file_put_contents($master_filename, "");
	 	 
	 	$size = 0;
	 	$no_files = count($js_files);
	 	 	
		foreach($js_files as $script_filename) {
	 		
	 		// Logger::debug('Opening ' . $script_filename . '...');
	 		$size += filesize($script_filename);
	 		
	 		if ($doMinify){
				$min_script = JSMin::minify(file_get_contents($script_filename)) . "\n";
	 		}
	 		else {
	 			$min_script = file_get_contents($script_filename) . "\n";
	 		}
	
			file_put_contents($master_filename, $min_script, FILE_APPEND);
									
	 	}
	
		$new_size = filesize($master_filename);
	 	
	 	$size = round($size / 1024);
	 	$new_size = round($new_size / 1024);
	 	$pc = 100 * $new_size / $size;
	 	
	 	Logger::info("Merged $no_files files with a total size of $size kb to 1 file of size $new_size kb (".number_format($pc,2)."% compression)");	
	 	
	}
	
	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Take all of the individual CSS files used and builds them into one
	 * big CSS file, minifying each in turn
	 * 
	 * @param array $css_files Array of CSS include (full) paths to use to build the production file
	 * @param string $master_filename The filename of the production ccss file
	 * @param boolean $doMinify flag to determine if we minify the code or just concatanate
	 * @return 
	 */	
	public static function buildProductionCSS($css_files, $master_filename, $doMinify=true) {
		
		$doMinify = false;
		
		Logger::debug("Processing CSS.. [$master_filename]");
	 	 	
	 	file_put_contents($master_filename, "");
	 	 
	 	$size = 0;
	 	$no_files = count($css_files);
	 	 	
		foreach($css_files as $script_filename) {
	 			 		
	 		$size += filesize($script_filename);
	 		
	 		if ($doMinify){
	 			$min_script = CSSMin::process(file_get_contents($script_filename));
	 		}
	 		else {
	 			$min_script = file_get_contents($script_filename) . "\n";
	 		}

			//$base_dir = dirname($script);
			//Logger::debug("BaseDir: $base_dir");
	
			file_put_contents($master_filename, $min_script, FILE_APPEND);
									
	 	}
	
		$new_size = filesize($master_filename);
	 	
	 	$size = round($size / 1024);
	 	$new_size = round($new_size / 1024);
	 	$pc = 100 * $new_size / $size;
	 	
	 	Logger::info("Merged $no_files files with a total size of $size kb to 1 file of size $new_size kb (".number_format($pc,2)."% compression)");
	
	}	
}

?>