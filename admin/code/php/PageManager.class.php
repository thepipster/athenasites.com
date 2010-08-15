<?php
/**
*
* @since 8th August, 2010
*/
class PageManager {

	public static $url_root;
	public static $theme_url_root;
	public static $media_root_url;
	public static $domain;
	public static $page_slug;
	public static $site_id;
	public static $user_id;
	public static $page_id;
	public static $page_parent_id;
	public static $page_title;
	public static $theme_id;
	public static $theme_file_root;
	public static $template_filename;

	public static $page_list;

	// ///////////////////////////////////////////////////////////////////////////////////////

	public static function init($page_name){

		self::$url_root = 'http://' . $_SERVER['HTTP_HOST'];
		
		self::$domain = $_SERVER['HTTP_HOST'];		
		//self::$page_slug = $_SERVER['REQUEST_URI'];
		self::$page_slug = $page_name;
				
		// Strip www..
		self::$domain = str_replace('www.','',self::$domain);
		
		$site = SitesTable::getSiteFromDomain(self::$domain);
		
		self::$site_id = $site['id'];
		//self::$user_id = SecurityUtils::getCurrentUserID();
		
		// Get the list of pages
		self::$page_list = PagesTable::getPages(self::$site_id);
		
		// Get the current page id
		$page = PagesTable::getPageFromSlug(self::$site_id, self::$page_slug);
				
		if (!isset($page)){
			$page = PagesTable::getHomepage(self::$site_id);
		}

		// If page is still not set, select the first in the page list
		if (!isset($page)){
			$page = self::$page_list[0];
		}
		
		//Logger::dump($page);
		
		//Logger::debug(">>>> " . self::$page_slug);
		
		self::$page_id = $page['id'];
		self::$page_parent_id = $page['parent_page_id'];
		self::$page_title = $page['title'];
		self::$media_root_url = self::$url_root . "/user_files/".self::$site_id."/";
		self::$template_filename = $page['template'];
		
		// Get the theme info	
		$theme_id = $site['theme_id'];
		$theme = ThemeTable::getTheme($theme_id);
		
		self::$theme_url_root = self::$url_root . '/admin/themes/' . $theme['theme_name'] ."/";
		self::$theme_file_root = FILE_ROOT . 'admin/themes/' . $theme['theme_name'] ."/";
		/*
		Logger::debug(">>>>>>>>>>");
		Logger::debug("Request URI: " . $_SERVER['REQUEST_URI']);
		Logger::debug("Host: " . $_SERVER['HTTP_HOST']);
		Logger::debug("Domain: " . self::$domain);
		Logger::debug("Page Slug: " . self::$page_slug);
		Logger::debug("Theme URL root: " . self::$theme_url_root);
		Logger::debug("Theme file root: " . self::$theme_file_root);
		Logger::debug("Templeta File: " . self::$template_filename);
		Logger::debug("Medi Root URL: " . self::$media_root_url);
		*/
	}
	
	
	// ///////////////////////////////////////////////////////////////////////////////////////

	/**
	* Do any default actions in the header
	*/
	public static function doHeader(){	
	}
		
	// ///////////////////////////////////////////////////////////////////////////////////////

	public static function getCurrentPageContent(){return self::getPageContent(self::$page_id);}

	public static function getPageContent($page_id){
		foreach(self::$page_list as $page){	
			if ($page['id'] == $page_id){
				return $page['content'];				
			}
		}			
	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////

	public static function getBlogContent(){
		echo "TBD";
	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////

	public static function echoGoogleTracker($tracker_code){
	
		$domain = PageManager::$domain;
		$page_title = PageManager::$page_title;
		
		/*
		echo "<!-- Global tracking -->";
		echo "<!--";
		echo "<script type='text/javascript'>";
		echo "var gaJsHost = (('https:' == document.location.protocol) ? 'https://ssl.' : 'http://www.');";
		echo "document.write(unescape('%3Cscript src='\" + gaJsHost + \"google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E'));";
		echo "</script>";
		echo "<script type='text/javascript'>";
		echo "try {";
		echo "var pageTracker = _gat._getTracker('$tracker_code');";
		echo "pageTracker._setDomainName('$domain');";
		echo "pageTracker._trackPageview('$page_title');";
		echo "} catch(err) {}</script>";
		echo "-->";	
		*/
		
		if (!isset($tracker_code) || $tracker_code == '') return;
		
		echo "// Tracking";
		echo "try {";
		echo "    var pageTracker = _gat._getTracker('$tracker_code');";
		echo "    pageTracker._setDomainName('$domain');";
		echo "    pageTracker._trackPageview('$page_title');";
		echo "} catch(err) {}";
	
	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////

	public static function getFavIconURL(){
				
		// See if the user has set a fav icon
		$fav_image_id = ThemeTable::getFavicon(PageManager::$site_id);
		
		if (isset($fav_image_id)){
			$media_folder = SecurityUtils::getMediaFolder(PageManager::$site_id);
			$image = FolderTable::getMedia(self::$site_id, $fav_image_id);
			if (isset($image)){
				return $media_root_url . $image['filename'];
			}
		}
		
		return self::$theme_url_root . 'favicon.png';
	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////
	
	public static function getMediaURL($media_id){
				
		$image = FolderTable::getMedia(PageManager::$site_id, $media_id);
		
		if (isset($image)){
			return self::$media_root_url . $image['filename'];
		}
		
		return '';
	}	

	public static function getMediaURLFromThemePara($theme_para_id){				
		$media_id = PageParasTable::getParaValue(self::$page_id, $theme_para_id, self::$site_id);
		if (isset($media_id)){
			return self::getMediaURL($media_id);
		}
		return "";
	}	

	public static function getMediaFromThemePara($theme_para_id){				
		$media_id = PageParasTable::getParaValue(self::$page_id, $theme_para_id, self::$site_id);
		if (isset($media_id)){
			return FolderTable::getMedia(self::$site_id, $media_id);
		}
		return null;
	}	
	
	// ///////////////////////////////////////////////////////////////////////////////////////

	public static function getPageLink($page_id){
	
		foreach(self::$page_list as $page){
	
			if ($page['id'] == $page_id){
				return $page['path'] . $page['slug'];				
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