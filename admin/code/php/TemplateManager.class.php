<?php
/**
* Class to handle a themes page template
*
* @since 9th August, 2010
*/
class TemplateManager {

	// ///////////////////////////////////////////////////////////////////////////////////////

	public static function getThemePageTemplates($theme_name){	

		$template_dir = FILE_ROOT . "admin/themes/" . $theme_name . "/page_templates/";
		$template_url = Site::getBaseURL() . "/admin/themes/" . $theme_name . "/page_templates/";
		
		$template_list = array();
		
		/**
		* @Theme: ApolloSites
		* @Template: Home Page
		* @Description: Home Page
		*/		
		
		if ($handle = opendir($template_dir)) {
		
		    while (false !== ($file = readdir($handle))) {
		        		        		        
		        if ($file != "." && $file != "..") {
		        	
					$path_parts = pathinfo($file);

					if ($path_parts['extension'] == 'php'){
					
			        	$temp = array();
			        	$temp['template_file'] = $file;
			        	
			        	if (file_exists($file . '.png')){
				        	$temp['thumbnail'] = $template_url . $file . '.png';
			        	}
			        	else {
			        		$temp['thumbnail'] = 'http://apollosites.com/admin/images/blank.gif';
			        	}
			        	
			        	// @Theme: ApolloSites
			        	// @Template: Home Page
			        	// @Description: Home Page
	
						$content = file_get_contents($template_dir . "/" . $file);
						
						$temp['template_name'] = self::getTemplatePara('@Template:', $content);
						$temp['template_description'] = self::getTemplatePara('@Description:', $content);
			        	//$temp['thumbnail'] = self::getTemplatePara('@Thumbnail:', $content);
						$temp['is_homepage'] = self::getTemplatePara('@isHome:', $content);
						$temp['is_blogpage'] = self::getTemplatePara('@isBlog:', $content);
						
						if ($temp['is_homepage'] == '') $temp['is_homepage'] = 0;
						if ($temp['is_blogpage'] == '') $temp['is_blogpage'] = 0;
						
						$template_list[] = $temp;
			        	//$contents = file_get_contents($template_dir . "/" . $file);
		        	
		        	}
		        }
		    }
		    
		    closedir($handle);
		}
				
		return $template_list;
	}
		
	// ///////////////////////////////////////////////////////////////////////////////////////

	private static function getTemplatePara($para_name, $content){

		$name_pos = strpos($content, $para_name);		
		
		if ($name_pos > 0){
			
			$pos = $name_pos + strlen($para_name);
			
			// Get end of line pos
			$eol_pos = strpos($content, "\n", $pos);

			//Logger::debug(">>>>>>> " . $pos . " pos = " . $eol_pos);
			//Logger::debug(substr($content, $pos, ($eol_pos-$pos)));
			
			return trim(substr($content, $pos, ($eol_pos-$pos))); 
		}
		return false;
	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////

}
?>