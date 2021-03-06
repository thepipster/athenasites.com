<?php
/**
 * 
 * @author Mike Pritchard
 * @since January 22nd, 2009
 */
class ThemeTable {

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getTheme($theme_id){		
		$sql = DatabaseManager::prepare("SELECT * FROM apollo_Theme WHERE id = %d", $theme_id);
		return DatabaseManager::getSingleResult($sql);
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Get all the images associated with a page
	*/
	public static function getThemeIDFromTemplateName($templateName){
		
		//Logger::debug("getThemeIDFromTemplateName($templateName)");
		
		//if ($wpdb == null) Logger::fatal("ThemeTable not initialized!");
		
		return DatabaseManager::getVar(DatabaseManager::prepare("SELECT id FROM apollo_Theme WHERE theme_name = %s",  $templateName));

		//$sql = self::DatabaseManager::prepare("SELECT id FROM apollo_Theme WHERE theme_name = %s",  $templateName ); 		
		//return DatabaseManager::getResults($sql, ARRAY_A);	
			
	}
		
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Get the value of a global blog parameter
	*/
	public static function getGlobalParaValue($site_id, $theme_para_id){

		$val = DatabaseManager::getVar(DatabaseManager::prepare("SELECT para_value FROM apollo_PageParas WHERE site_id = %d AND theme_para_id = %d AND page_id = 0 ",  $site_id, $theme_para_id));
		
		// If the value isn't set, get the default (if there is one)
		if (!isset($val)){
			$val = DatabaseManager::getVar(DatabaseManager::prepare("SELECT default_value FROM apollo_ThemeParas WHERE id = %d",  $theme_para_id));			
		}
		
		return $val;
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Get the url of a global image
	*/
	public static function getGlobalImageParaValue($site_id, $theme_para_id){
	
		$image_id = DatabaseManager::getVar(DatabaseManager::prepare("SELECT para_value FROM apollo_PageParas WHERE site_id = %d AND theme_para_id = %d AND page_id = 0 ",  $site_id, $theme_para_id));
		
		// If the value isn't set, get the default (if there is one)
		if (isset($image_id)){
			return PageManager::getMediaURL($image_id);
		}
		
		return null;
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////
	
	/**
	* If the specified page has a multi-gallery, get the theme para value for it (which will be the number of galleries)
	*/
	public static function getNumberGalleriesForMultiGallery($site_id, $page_id){

		$sql = DatabaseManager::prepare("SELECT para_value FROM apollo_PageParas gp INNER JOIN apollo_ThemeParas tp WHERE gp.site_id = %d AND page_id = %d AND gp.theme_para_id = tp.id AND tp.para_type = 'multi-gallery'", $site_id, $page_id);
		$val = DatabaseManager::getVar($sql);
		if (!isset($val)){
			$val = 0;
		}
		return $val;
	}
		
	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getAllThemeParas($theme_id){
		$sql = DatabaseManager::prepare("SELECT * FROM apollo_ThemeParas WHERE (theme_id = %d OR theme_id = 0) AND is_public='1' ORDER BY admin_order",  $theme_id ); 		
		return DatabaseManager::getResults($sql);
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getGlobalThemeParas($theme_id){
		return self::getThemeParas($theme_id, 'all');
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getThemeParas($theme_id, $page_template_name){
		
		//Logger::debug("getThemeParas($theme_id, $page_template_name)");
		
		$data = null;
		
		$sql = DatabaseManager::prepare("SELECT * FROM apollo_ThemeParas WHERE page_template_name = %s AND theme_id = %d  AND is_public='1' ORDER BY admin_order",  $page_template_name, $theme_id ); 		
		$data = DatabaseManager::getResults($sql);
		
		return $data;
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////


}
?>