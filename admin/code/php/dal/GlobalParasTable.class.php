<?php
/**
 * 
 * @author Mike Pritchard
 * @since March 18th, 2010
 */
class GlobalParasTable {

	/**
	* Set a global para value
	*/
	public static function setGlobalParaValue($blog_id, $theme_para_id, $new_value){
	
		//Logger::debug("setGlobalParaValue($blog_id, $theme_para_id, $new_value)");
		
		global $wpdb;	
		
		$current_val = self::getGlobalParaValue($blog_id, $theme_para_id);
				
		if (!isset($current_val)){
			$sql = $wpdb->prepare("INSERT INTO apollo_GlobalParas (blog_id, theme_para_id, para_value) VALUES (%d, %d, %s)", $blog_id, $theme_para_id, $new_value);
		}			
		else {
			if ($current_val == $new_value){
				return 1;
			}
			$sql = $wpdb->prepare("UPDATE apollo_GlobalParas SET para_value = %s WHERE blog_id = %d AND theme_para_id = %d", $new_value, $blog_id, $theme_para_id);
		}
		
		return $wpdb->query($sql);
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getGlobalParaValue($blog_id, $theme_para_id){
		global $wpdb;		
		$sql = $wpdb->prepare("SELECT para_value FROM apollo_GlobalParas WHERE blog_id = %d AND theme_para_id = %d",  $blog_id, $theme_para_id); 		
		return $wpdb->get_var($sql);
	}

}
?>