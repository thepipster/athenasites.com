<?php
/**
*
* @since 8th August, 2010
*/
class PageManager {

	public static $url_root;
	public static $theme_url_root;
	public static $domain;
	public static $page_slug;
	public static $site_id;
	public static $user_id;
	public static $page_id;
	public static $page_parent_id;
	public static $page_title;
	public static $theme_id;
	public static $theme_file_root;

	public static $page_list;

	// ///////////////////////////////////////////////////////////////////////////////////////

	public static function init(){

		self::$url_root = 'http://' . $_SERVER['HTTP_HOST'];
		
		self::$domain = $_SERVER['HTTP_HOST'];
		self::$page_slug = basename($_SERVER['REQUEST_URI']);
		
		// Strip www..
		self::$domain = str_replace('www.','',self::$domain);
		
		$site = SitesTable::getSiteFromDomain(self::$domain);
		$site = $site[0];
		
		self::$site_id = $site['id'];
		//self::$user_id = SecurityUtils::getCurrentUserID();
		
		// Get the list of pages
		self::$page_list = PagesTable::getPages(self::$site_id);
		
		// Get the current page id
		$page = PagesTable::getPageFromSlug(self::$site_id, self::$page_slug);
		
		Logger::debug(">>>> " . self::$page_slug);
		
		if (!isset($page[0])){
			//$page = PagesTable::getHomepage(self::$site_id);
		}
		
		self::$page_id = $page[0]['id'];
		self::$page_parent_id = $page[0]['parent_page_id'];
		self::$page_title = $page[0]['title'];

		// Get the theme info	
		$theme_id = $site['theme_id'];
		$theme = ThemeTable::getTheme($theme_id);
		
		self::$theme_url_root = self::$url_root . '/admin/themes/' . $theme[0]['theme_name'] ."/";
		self::$theme_file_root = FILE_ROOT . '/admin/themes/' . $theme[0]['theme_name'] ."/";
	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////

	/**
	* Do any default actions in the header
	*/
	public static function doHeader(){	
	}
		
	// ///////////////////////////////////////////////////////////////////////////////////////

	public static function getFavIcon(){
		ThemeTable::getFavicon(self::$site_id);
	}

	// ///////////////////////////////////////////////////////////////////////////////////////

	public static function getPageLink($page_id){
	
		foreach(self::$page_list as $page){
	
			if ($page['id'] == $page_id){
			
				if ($page['parent_page_id'] == 0){
					return self::$url_root . "/" . $page['slug'];
				}
				else {
					
					foreach(self::$page_list as $child){
					
						if ($child['id'] == $page['parent_page_id']){
							
							// Strip the extension from the slug, and use as the category name
							// so the final url would be <url>/<cat>/<childpage>
							$cat = substr($child['slug'], 0, strrpos($child['slug'], '.'));
							
							return self::$url_root . "/" . $cat . "/" . $child['slug'];
							
						}
					}
				}
				
			}

		}			
	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////

	/**
	* Do any default actions in the footer
	*/
	public static function doFooter(){	
	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////
		
	public static function getPingBackURL(){
		Logger::debug("TBD");
		// TBD
	}
		
	// ///////////////////////////////////////////////////////////////////////////////////////

	public static function getLanguageAttributes(){
		Logger::debug("TBD");
		// TBD
	}
}

?>