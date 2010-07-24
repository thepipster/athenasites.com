<?php
/**
 * 
 * @author Mike Pritchard
 * @since March 18th, 2010
 */
class PageParasTable {

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Get all a specific parameter value
	*/
	public static function getParaValue($page_post_id, $theme_para_id, $blog_id){			
		global $wpdb;		
		$sql = $wpdb->prepare("SELECT para_value FROM apollo_PageParas WHERE page_post_id = %d AND theme_para_id = %d AND blog_id = %d",  $page_post_id, $theme_para_id, $blog_id ); 		
		return $wpdb->get_var($sql);
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Sets a para value, determines internally if thats an update or insert
	*/
	public static function setParaValue($blog_id, $page_post_id, $theme_para_id, $new_value){
		
		//error_log("setParaValue($blog_id, $page_post_id, $theme_para_id, $new_value)");
		
		$current_value = self::getParaValue($page_post_id, $theme_para_id, $blog_id);		
		//Logger::debug("Current value = $current_value");
		
		if (isset($current_value)){
			return self::updateParaValue($blog_id, $page_post_id, $theme_para_id, $new_value);
		}
		else {
			return self::createParaValue($blog_id, $page_post_id, $theme_para_id, $new_value);
		}
	}
		
	// //////////////////////////////////////////////////////////////////////////////////////

	public static function updateParaValue($blog_id, $page_post_id, $theme_para_id, $new_value){	
		global $wpdb;				
		$sql = $wpdb->prepare("UPDATE apollo_PageParas SET para_value = %s WHERE page_post_id = %d AND theme_para_id = %d AND blog_id = %d",  $new_value, $page_post_id, $theme_para_id, $blog_id ); 		
		return $wpdb->query($sql);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function createParaValue($blog_id, $page_post_id, $theme_para_id, $new_value){	
		global $wpdb;				
		$sql = $wpdb->prepare("INSERT INTO apollo_PageParas (para_value, page_post_id, theme_para_id, blog_id) VALUES (%s, %d, %d, %d)",  $new_value, $page_post_id, $theme_para_id, $blog_id); 		
		return $wpdb->query($sql);		
	}


}
?>