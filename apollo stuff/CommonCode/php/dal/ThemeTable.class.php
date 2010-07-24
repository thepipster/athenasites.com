<?php
/**
 * 
 * @author Mike Pritchard
 * @since January 22nd, 2009
 */
class ThemeTable {


	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Get all the images associated with a page
	*/
	public static function getThemeIDFromTemplateName($templateName){
		
		//ApolloLogger::debug("getThemeIDFromTemplateName($templateName)");
		
		global $wpdb;
		
		//if ($wpdb == null) ApolloLogger::fatal("ThemeTable not initialized!");
		
		return $wpdb->get_var($wpdb->prepare("SELECT id FROM apollo_Theme WHERE theme_name = %s",  $templateName));

		//$sql = self::$wpdb->prepare("SELECT id FROM apollo_Theme WHERE theme_name = %s",  $templateName ); 		
		//return $wpdb->get_results($sql, ARRAY_A);	
			
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Get the favicon for the specified blog. If the user hasn't set one, this will return null
	*/
	public static function getFavicon($blog_id){		
		//get_user_option('template');		
		global $wpdb;
		$sql = $wpdb->prepare("SELECT para_value FROM apollo_GlobalParas gp INNER JOIN apollo_ThemeParas tp WHERE blog_id = %d AND gp.theme_para_id = tp.id AND tp.para_type = 'favicon'", $blog_id);
		return $wpdb->get_var($sql);
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Get the value of a global blog parameter
	*/
	public static function getGlobalParaValue($blog_id, $theme_para_id){
	
		global $wpdb;
		$val = $wpdb->get_var($wpdb->prepare("SELECT para_value FROM apollo_GlobalParas WHERE blog_id = %d AND theme_para_id = %d",  $blog_id, $theme_para_id));
		
		// If the value isn't set, get the default (if there is one)
		if (!isset($val)){
			$val = $wpdb->get_var($wpdb->prepare("SELECT default_value FROM apollo_ThemeParas WHERE id = %d",  $theme_para_id));			
		}
		
		return $val;
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Get the url of a global image
	*/
	public static function getGlobalImageParaValue($blog_id, $theme_para_id){
	
		global $wpdb;
		$post_id = $wpdb->get_var($wpdb->prepare("SELECT para_value FROM apollo_GlobalParas WHERE blog_id = %d AND theme_para_id = %d",  $blog_id, $theme_para_id));
		
		// If the value isn't set, get the default (if there is one)
		if (isset($post_id)){
			$post = get_post($post_id);	
			$url = $post->guid;	
		}
		else {
			$url = null;
		}
		
		return $url;
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////
	
	/**
	* If the specified page has a multi-gallery, get the theme para value for it (which will be the number of galleries)
	*/
	public static function getNumberGalleriesForMultiGallery($page_post_id){
		global $wpdb;
		$sql = $wpdb->prepare("SELECT para_value FROM apollo_PageParas gp INNER JOIN apollo_ThemeParas tp WHERE page_post_id = %d AND gp.theme_para_id = tp.id AND tp.para_type = 'multi-gallery'", $page_post_id);
		$val = $wpdb->get_var($sql);
		if (!isset($val)){
			$val = 0;
		}
		return $val;
	}
		
	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getGlobalThemeParas($theme_id){
		return self::getThemeParas($theme_id, 'all');
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getThemeParas($theme_id, $page_template_name){
		
		//ApolloLogger::debug("getThemeParas($theme_id, $page_template_name)");
		
		global $wpdb;
		$data = null;
		
		$sql = $wpdb->prepare("SELECT * FROM apollo_ThemeParas WHERE page_template_name = %s AND theme_id = %d  AND is_public='1' ORDER BY admin_order",  $page_template_name, $theme_id ); 		
		$data = $wpdb->get_results($sql, ARRAY_A);
		
		return $data;
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////


}
?>