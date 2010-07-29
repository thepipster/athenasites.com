<?php

$discRoot = realpath(dirname(__FILE__)) . "/";
$common_code_root = substr($discRoot, 0, strpos($discRoot, 'wp-content')) . 'wp-content/CommonCode/';

require_once($common_code_root . 'php/utils/ApolloLogger.class.php');
require_once($common_code_root . 'php/utils/JSMin.class.php');
require_once($common_code_root . 'php/utils/CSSMin.class.php');

$theme_root = substr($discRoot, 0, strpos($discRoot, 'wp-content')) . 'wp-content/themes/Callisto/';

ApolloLogger::catchSysErrors();
ApolloLogger::echoLog();

ProductionCodeBuilder::buildProductionJS($theme_root, $theme_root . 'js/callisto-min.js');
ProductionCodeBuilder::buildApolloPluginCSS($theme_root, $theme_root . 'callisto-min.css');
			
			
class ProductionCodeBuilder {

	private static $js_files = array(
			
			'js/jquery-1.3.1.min.js',
			'js/AC_OETags.js',
			'js/jquery.validate.min.js',
			'js/date.js',
			'js/jquery.datePicker.js',

			'js/callistoGallery.js',
			'js/callistoPage.js',
			'js/callistoMiniGallery.js',
			'js/callistoContactPage.js',
			'js/callistoBlogPage.js',
	);
	
	
			
	private static $css_apollo_plugin_files = array(
			'datePicker.css',
			'style.css',
	);
			
	// ////////////////////////////////////////////////////////////////////////////

	public static function buildApolloPluginCSS($code_root, $master_filename, $doMinify=true) {
				
		ApolloLogger::debug("Processing CSS.. [$master_filename]");
	 	 	
	 	file_put_contents($master_filename, "");
	 	 
	 	$size = 0;
	 	$no_files = count(self::$css_apollo_plugin_files);
	 	 	
		foreach(self::$css_apollo_plugin_files as $script) {
	 		
	 		$script_filename = $code_root . $script;
	 		
	 		$size += filesize($script_filename);
	 		
	 		if ($doMinify){
	 			$min_script = CSSMin::process(file_get_contents($script_filename));
	 		}
	 		else {
	 			$min_script = file_get_contents($script_filename) . "\n";
	 		}

			//$base_dir = dirname($script);
			//ApolloLogger::debug("BaseDir: $base_dir");
	
			file_put_contents($master_filename, $min_script, FILE_APPEND);
									
	 	}
	
		$new_size = filesize($master_filename);
	 	
	 	$size = round($size / 1024);
	 	$new_size = round($new_size / 1024);
	 	$pc = 100 * $new_size / $size;
	 	
	 	ApolloLogger::info("Merged $no_files files with a total size of $size kb to 1 file of size $new_size kb (".number_format($pc,2)."% compression)");
	
	}
	
	
	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Take all of the individual JS classes/files used and builds them into one
	 * big JS file, minifying each in turn
	 * 
	 * @return 
	 */
	public static function buildProductionJS($code_root, $master_filename, $doMinify=true) {
				
		ApolloLogger::debug("Processing JS.. [$master_filename]");
	 	 	
	 	file_put_contents($master_filename, "");
	 	 
	 	$size = 0;
	 	$no_files = count(self::$js_files);
	 	 	
		foreach(self::$js_files as $script) {
	 		
	 		$script_filename = $code_root . $script;
	 		
	 		//ApolloLogger::debug('Opening ' . $script_filename . '...');
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
	 	
	 	ApolloLogger::info("Merged $no_files files with a total size of $size kb to 1 file of size $new_size kb (".number_format($pc,2)."% compression)");
	/*
		file_put_contents(JSMin::minify(file_get_contents($master_filename)));
	
		$final_size = round(filesize($master_filename) / 1024);
	
	 	ApolloLogger::info("Final minify step changed size from $new_size kb to $final_size kb");
	*/	
	
	}
	
}

			
?>