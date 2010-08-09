<?php
/**
 * 
 * @author Mike Pritchard
 * @since March 18th, 2010
 */
class GlobalParasTable {

	/**
	* To keep the database table from growing huge, we break this table up by site id
	*/
	public static function createTableForSite($site_id){
		
		$sql = "CREATE TABLE `athena_{$site_id}_GlobalParas` (
		  `id` bigint(20) NOT NULL auto_increment,
		  `para_value` varchar(255) default NULL,
		  `theme_para_id` bigint(20) default NULL,
		  PRIMARY KEY  (`id`)
		) ENGINE=MyISAM DEFAULT CHARSET=utf8;";
						
		DatabaseManager::submitQuery($sql);

	}
	
	// //////////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Set a global para value
	*/
	public static function setGlobalParaValue($site_id, $theme_para_id, $new_value){
	
		//Logger::debug("setGlobalParaValue($blog_id, $theme_para_id, $new_value)");
		
		$current_val = self::getGlobalParaValue($blog_id, $theme_para_id);
				
		if (!isset($current_val)){
			$sql = DatabaseManager::prepare("INSERT INTO athena_%d_GlobalParas (theme_para_id, para_value) VALUES (%d, %s)", $site_id, $theme_para_id, $new_value);
		}			
		else {
			if ($current_val == $new_value){
				return 1;
			}
			$sql = DatabaseManager::prepare("UPDATE athena_%d_GlobalParas SET para_value = %s WHERE theme_para_id = %d", $site_id, $new_value, $theme_para_id);
		}
		
		return DatabaseManager::submitQuery($sql);
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getGlobalParaValue($site_id, $theme_para_id){
		$sql = DatabaseManager::prepare("SELECT para_value FROM athena_%d_GlobalParas WHERE blog_id = %d AND theme_para_id = %d",  $site_id, $theme_para_id); 		
		return DatabaseManager::getVar($sql);
	}

}
?>