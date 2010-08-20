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
	public static $is_homepage;
	public static $is_blogpage;
	public static $blog_url;
	public static $blog_base_url;
	public static $blog_mode = '';
	public static $is_post = false;
	public static $current_post = null;
	public static $blog_tag = '';
	public static $blog_category = '';

	public static $page_list;

	public static $BLOGMODE_SINGLEPOST 	= 1;
	public static $BLOGMODE_ALL 		= 2;
	public static $BLOGMODE_CATEGORY 	= 3;
	public static $BLOGMODE_TAG 		= 4;
	
	public static $MAX_POSTS_PER_PAGE   = 1;
	
	// ///////////////////////////////////////////////////////////////////////////////////////

	public static function init($page_name, $page_path, $tag, $category){

		Logger::debug(">>>>>>>>>>");

		self::$url_root = 'http://' . $_SERVER['HTTP_HOST'];
		
		self::$domain = $_SERVER['HTTP_HOST'];		
		//self::$page_slug = $_SERVER['REQUEST_URI'];
		self::$page_slug = $page_name;
						
		// Strip www..
		self::$domain = str_replace('www.','',self::$domain);
				
		$site = SitesTable::getSiteFromDomain(self::$domain);		
		self::$site_id = $site['id'];

		// Get the list of pages
		self::$page_list = PagesTable::getPages(self::$site_id);

		//self::$user_id = SecurityUtils::getCurrentUserID();

		// Get blog info....				
		$blogPage = PagesTable::getBlogpage(self::$site_id);
		self::$blog_url = $blogPage['path'] . $blogPage['slug'];
		self::$blog_base_url = substr(self::$blog_url, 0, (strlen(self::$blog_url) - strlen('.html')));

		if (isset($tag) && $tag != ''){
			self::$blog_mode = self::$BLOGMODE_TAG;
			self::$blog_tag = $tag;
			$page = $blogPage;
			Logger::debug(">>> BLOG TAG MODE!");
		}
		else if (isset($category) && $category != ''){
			self::$blog_mode = self::$BLOGMODE_CATEGORY;
			self::$blog_category = $category;
			$page = $blogPage;
			Logger::debug(">>> BLOG CATEGORY MODE!");
		}
		else {
			$post_path = self::$blog_url . $page_path."/";
	
			// Remove the blog url from the path, e.g.
			// /blog/2010/8/19/danielle-and-jeff-wild-basin-lodge-wedding.html
			// becomes
			// /2010/8/19/danielle-and-jeff-wild-basin-lodge-wedding.html
			$post_path = substr($page_path, (strlen(self::$blog_url) - strlen('.html')));
			
			// Match the page against all posts, to see if this is a request for a blog post page
			$post = PostsTable::getPostFromSlug(self::$site_id, $post_path, self::$page_slug);
						
			// If the post is set then we're hitting a single post. Otherwise, we see if we're hitting
			// either the blog or a regular page			
			if (isset($post)){
				self::$blog_mode = self::$BLOGMODE_SINGLEPOST;
				self::$current_post = $post;
				Logger::debug(">>> BLOG SINGLE POST MODE!");
				$parts = explode("/", $post_path);
				Logger::dump($parts);
				/*
				$parts = explode("/", $post_path);
				$year = $parts[1];
				$month = $parts[2];
				$day = $parts[3];
				*/
				$page = $blogPage;
			}
			else {
				// Get the current page id
				self::$blog_mode = self::$BLOGMODE_ALL;
				$page = PagesTable::getPageFromSlug(self::$site_id, self::$page_slug);
				Logger::debug(">>> PAGE/BLOG!");
			}		
							
		}
			
		// If we couldn't find the page, load the home page						
		if (!isset($page)){
			$page = PagesTable::getHomepage(self::$site_id);
		}

		// If page is still not set, select the first in the page list
		if (!isset($page)){
			$page = self::$page_list[0];
		}
		
		
		self::$is_homepage 		= $page['is_homepage'];
		self::$is_blogpage 		= $page['is_blogpage'];
		self::$page_id 			= $page['id'];
		self::$page_parent_id 	= $page['parent_page_id'];
		self::$page_title 		= $page['title'];
		self::$media_root_url 	= self::$url_root . "/user_files/".self::$site_id."/";
		self::$template_filename= $page['template'];
		
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
		Logger::debug("Blog base path: " . self::$blog_base_url);
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
		//Logger::debug("TBD");
		// TBD
	}
		
	// ///////////////////////////////////////////////////////////////////////////////////////

	public static function getLanguageAttributes(){
		//Logger::debug("TBD");
		// TBD
	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////
	//
	// Blog functions
	//
	// ///////////////////////////////////////////////////////////////////////////////////////
	
	public static function getPosts(){

		$temp_list = array();
		
		switch(self::$blog_mode){

			case self::$BLOGMODE_SINGLEPOST :
				$temp_list[] = self::$current_post;
				break;		

			case self::$BLOGMODE_ALL :
				$temp_list = PostsTable::getPosts(self::$site_id);
				break;		

			case self::$BLOGMODE_CATEGORY :
				$temp_list = PostsTable::getPostsFromCategory(self::$site_id, self::$blog_category);
				break;		

			case self::$BLOGMODE_TAG :
				$temp_list = PostsTable::getPostsFromTag(self::$site_id, self::$blog_tag);
				break;		
				
		}
				
		$post_list = array();
		
		foreach($temp_list as $post){
			$post['last_edit'] = date("m/d/Y H:i", strtotime($post['last_edit'])); // Convert to JS compatible date
			$post['created'] = date("m/d/Y H:i", strtotime($post['created'])); // Convert to JS compatible date
			$post['tags'] = PostsTable::getPostTags(self::$site_id, $post['id']);
			$post['categories'] = PostsTable::getPostCategories(self::$site_id, $post['id']);
			$post_list[] = $post;
		}
		
		return $post_list;
	}

		
	// ///////////////////////////////////////////////////////////////////////////////////////
	
	public static function getPostLink($post){
		return "http://" . $_SERVER['HTTP_HOST'] . self::$blog_base_url . $post['path'] . $post['slug'];
	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////

	public static function getPostDate($post){
		//August 19, 2010
		return date("F j, Y", strtotime($post['created']));
	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////
	
	public static function getBlogContent($post){
		
		$content = stripslashes($post['content']);
				
		$s_pos = strpos($content, '<div class="apolloPageBreak"');
		$i_pos = strpos($content, ">", $s_pos);
		$e_pos = strpos($content, "</div>", $i_pos);
		
			
		if (self::$blog_mode == self::$BLOGMODE_SINGLEPOST){
			$temp = $content;
			$content = substr($temp, 0, $s_pos);
			$content .= substr($temp, $e_pos+6);
		}
		else {
			
			$more_text = substr($content, $i_pos+1, ($e_pos-$i_pos-1));
			//Logger::debug(">>> Pos $i_pos - $e_pos");
			//Logger::debug(">>> More content = " . $more_text);
			
			$content = substr($content, 0, $s_pos);
			
			$post_link = self::getPostLink($post);
			
			// Add the more link back in
			$content .= "<p><a href='$post_link' class='apolloPageBreak'>$more_text</a></p>";
		}
		
		return $content;
	}

	// ///////////////////////////////////////////////////////////////////////////////////////

	/**
	* Get a list of categories for this post, which are links seperated by the specified
	* seperator (default = ',')
	*/ 
	public static function getAllCategories($seperator=","){
		$cats = PostsTable::getCategories(self::$site_id);
		$cat_str = '';
		for($i=0; $i<count($cats); $i++){
			if ($i != 0){ $cat_str .= $seperator;}
			$link = self::$blog_url . "?category=" . StringUtils::encodeSlug($cats[$i], '');
			$cat_str .= "<a href='$link'>".$cats[$i]."</a>";
		}
		return $cat_str;
	}


	/**
	* Get a list of categories for this post, which are links seperated by the specified
	* seperator (default = ',')
	*/ 
	public static function getCategories($post, $seperator=","){
		$cats = $post['categories'];
		$cat_str = '';
		for($i=0; $i<count($cats); $i++){
			if ($i != 0){ $cat_str .= $seperator;}
			$link = self::$blog_url . "?category=" . StringUtils::encodeSlug($cats[$i], '');
			$cat_str .= "<a href='$link'>".$cats[$i]."</a>";
		}
		return $cat_str;
	}

	// ///////////////////////////////////////////////////////////////////////////////////////

	public static function getTags($post, $seperator=","){		
		
		$tags = $post['tags'];
		
		$tag_str = '';
		for($i=0; $i<count($tags); $i++){		
			if ($i != 0){ $tag_str .= $seperator;}
			$link = self::$blog_url . "?tag=" . StringUtils::encodeSlug($tags[$i], '');
			$tag_str .= "<a href='$link'>".$tags[$i]."</a>";
		}
		return $tag_str;
	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////
	
	public static function getOlderPostsLink($text){
		if (self::$blog_mode == self::$BLOGMODE_ALL){
			$link = '';
			return "<a href='$link'>$text</a>";
		}
		return "";
	}

	public static function getNewerPostsLink($text){
		if (self::$blog_mode == self::$BLOGMODE_ALL){
			$link = '';
			return "<a href='$link'>$text</a>";
		}
		return "";
	}
}

?>