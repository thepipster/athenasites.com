<?php

class ProductionCodeBuilder {


	private static $js_files = array(
			
			'CommonCode/js/jquery.advancedClick.js',

			//'CommonCode/js/jquery.multidrag.js',

			'CommonCode/flot/jquery.flot.min.js',
			'CommonCode/flot/jquery.flot.crosshair.js',
			'CommonCode/flot.pie/excanvas.min.js',
			'CommonCode/flot.pie/jquery.flot.pie.js',

			'CommonCode/js/ApolloUtils.class.js',
			'CommonCode/js/ApolloDialog.class.js',
			
			'CommonCode/js/ImageSelector.class.js',
			'CommonCode/js/ImagePickerDialog.class.js',
			'CommonCode/js/ImageEditDialog.class.js',
			'CommonCode/js/ColorPickerDialog.class.js',
			'CommonCode/js/ApolloParaPicker.class.js',
			'CommonCode/js/StatViewer.class.js',
			
			'plugins/Apollo/js/EditGallery.class.js'

	);
	
	
			
	private static $css_apollo_plugin_files = array(

//			'CommonCode/jquery_themes/base/ui.all.css',
//			'CommonCode/jquery-themes/black-tie/ui.all.css',

			'CommonCode/jquery-themes/base/ui.core.css',
			'CommonCode/jquery-themes/base/ui.accordion.css',
			'CommonCode/jquery-themes/base/ui.datepicker.css',
			'CommonCode/jquery-themes/base/ui.dialog.css',
			'CommonCode/jquery-themes/base/ui.resizable.css',
			'CommonCode/jquery-themes/base/ui.slider.css',
			'CommonCode/jquery-themes/base/ui.tabs.css',
			'CommonCode/jquery-themes/base/ui.theme.css',


			'CommonCode/jquery-themes/black-tie/ui.core.css',
			'CommonCode/jquery-themes/black-tie/ui.accordion.css',
			'CommonCode/jquery-themes/black-tie/ui.datepicker.css',
			'CommonCode/jquery-themes/black-tie/ui.dialog.css',
			'CommonCode/jquery-themes/black-tie/ui.resizable.css',
			'CommonCode/jquery-themes/black-tie/ui.slider.css',
			'CommonCode/jquery-themes/black-tie/ui.tabs.css',
			'CommonCode/jquery-themes/black-tie/ui.theme.css',


			'CommonCode/css/ApolloCommon.css',
			'CommonCode/css/ImageSelector.css',
			'CommonCode/css/ImageEditDialog.css',
			
			'plugins/Apollo/editgal.css'
	);
			
	// ////////////////////////////////////////////////////////////////////////////

	public static function buildApolloPluginCSS($master_filename, $doMinify=true) {
		
		$discRoot = realpath(dirname(__FILE__)) . "/";
		$common_code_root = substr($discRoot, 0, strpos($discRoot, 'wp-content')) . 'wp-content/';
		
		Logger::debug("Processing CSS.. [$master_filename]");
	 	 	
	 	file_put_contents($master_filename, "");
	 	 
	 	$size = 0;
	 	$no_files = count(self::$css_apollo_plugin_files);
	 	 	
		foreach(self::$css_apollo_plugin_files as $script) {
	 		
	 		$script_filename = $common_code_root . $script;
	 		
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
	
	
	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Take all of the individual JS classes/files used and builds them into one
	 * big JS file, minifying each in turn
	 * 
	 * @return 
	 */
	public static function buildProductionJS($master_filename, $doMinify=true) {
		
		$discRoot = realpath(dirname(__FILE__)) . "/";
		$common_code_root = substr($discRoot, 0, strpos($discRoot, 'wp-content')) . 'wp-content/';
		
		Logger::debug("Processing JS.. [$master_filename]");
	 	 	
	 	file_put_contents($master_filename, "");
	 	 
	 	$size = 0;
	 	$no_files = count(self::$js_files);
	 	 	
		foreach(self::$js_files as $script) {
	 		
	 		$script_filename = $common_code_root . $script;
	 		
	 		//Logger::debug('Opening ' . $script_filename . '...');
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
	/*
		file_put_contents(JSMin::minify(file_get_contents($master_filename)));
	
		$final_size = round(filesize($master_filename) / 1024);
	
	 	Logger::info("Final minify step changed size from $new_size kb to $final_size kb");
	*/	
	
	}
	
}

?>