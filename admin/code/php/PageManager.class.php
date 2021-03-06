<?php

/**
 *
 * @since 8th August, 2010
 */
class PageManager {

	/** Flag to determin if this page is valid or not (indicates a 404 error if this is false */
	public static $validPage = false;
	
    /** The site url root, e.g. http://cgp.apollosites.com/ */
    public static $url_root;
    
    /** The theme url root, e.g. http://cgp.apollosites.com/admin/themes/cgp4/ */
    public static $theme_url_root;

    /** The theme common code url root, e.g. http://cgp.apollosites.com/admin/themes/common/ */
    public static $common_url_root;
    
    /** The root url for the site's media directory,  e.g. http://cgp.apollosites.com/user_files/1/ */
    public static $media_root_url;
    
    /** The domain for the site's media directory,  e.g. cgp */
    public static $domain;
    
    /** The current page slug,  e.g. some-page-name */
    public static $page_slug;
    
    /** The current site id */
    public static $site_id = 0;
    
    /** The current user id */
    public static $user_id;
    
    /** The current page id */
    public static $page_id;
    
    /** The current parent page id */
    public static $page_parent_id;
    
    /** The current page title */
    public static $page_title;
    
    /** The current page path */
    public static $page_path;
    
    /** The browser title for the current page */
    public static $page_browser_title;
    
    /** The current page descrition, which if set is used the the html page title */
    public static $page_desc;
    
    /** The current theme id */
    public static $theme_id;
    
    /** The current theme file root */
    public static $theme_file_root;
    
    /** The current page template filename */
    public static $template_filename;
    
    /** Flag to determine if this is the home page */
    public static $is_homepage;
    
    /** Flag to determine if this is the blog page */
    public static $is_blogpage;
    
    /** Flag to determine if the current page is a blog post */
    public static $is_post = false;
    
    /** The full url, including pate e.g.  /parentpage/blog */
    public static $blog_url;

    /** The home base path, e.g.  blog - NOTE by conventionthe home page should be index.html */
    //public static $home_base_url;
    
    /** The blog base path, e.g.  blog - NOTE blogs by convention just use the page slug 'blog' rather than 'blog.html' */
    public static $blog_base_url;
    
    /** The total number of posts for this blog */
    public static $no_posts = 0;
    
    public static $current_post = null;
    
    /** Reference to the blog page, if set */
    public static $blogPage = '';
    
    public static $blog_tag = '';
    public static $blog_category = '';
    public static $blog_year = '';
    public static $blog_month = '';
    public static $blog_page_no = 1;
    
    public static $page_list;

    /** The blog mode */
    public static $blog_mode = '';

    public static $BLOGMODE_SINGLEPOST 	= 1;
    public static $BLOGMODE_ALL 	 	= 2;
    public static $BLOGMODE_CATEGORY 	= 3;
    public static $BLOGMODE_TAG 	 	= 4;
    public static $BLOGMODE_YEAR 	 	= 5;
    public static $BLOGMODE_MONTH 	 	= 6;
    
    public static $MAX_POSTS_PER_PAGE 	= 5;

	// Global theme paras (for all themes)....    
    public static $PARA_META_DESCRIPTION  	= 1;
    public static $PARA_META_KEYWORDS  		= 2;
    public static $PARA_GOOGLE_TRACKER  	= 3;
    public static $PARA_FAV_ICON  			= 4;
    
	private static $GOOGLE_API_KEY = 'ABQIAAAApd3TaflLK-nGV6GT_CxTqhSdm2A-7rwoGsE41YlBtCPOmvFDPxRCd_p-ugGZEcWT4iPDE9N7Rn-KXg';
    private static $GOOGLE_AD_SENSE_KEY = 'pub-9166352829000298';
    
    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Initialize, this uses the domain to get the site id
     */
    public static function init($force_site_id = 0) {
	
	    // Get the site id
		if ($force_site_id == 0){
		
	        self::$url_root = 'http://' . $_SERVER['HTTP_HOST'];
	        
	        // Get the domain, and strip www if it has it
	        self::$domain = $_SERVER['HTTP_HOST'];
	        self::$domain = str_replace('www.', '', self::$domain);

	        $site = SitesTable::getSiteFromDomain(self::$domain);
		}
		else {	        
	        $site = SitesTable::getSite($force_site_id);
		}
        
        if (!isset($site)){
        	return;
        }
        
        //Logger::debug(">>>>> Site id = " . $site['id']);
        
        self::$site_id = $site['id'];
        // Get the list of pages
        self::$page_list = PagesTable::getPages(self::$site_id);

        // Get the theme info
        self::$theme_id = $site['theme_id'];
        $theme = ThemeTable::getTheme(self::$theme_id);

        // Get blog info....
        $blogPage = PagesTable::getBlogpage(self::$site_id);

		self::$blogPage = $blogPage;
        self::$blog_url = $blogPage['path'] . $blogPage['slug'];
        self::$blog_base_url = $blogPage['slug'];
        self::$no_posts = PostsTable::getNoPosts(self::$site_id);

        // Get home page info....
        //$homePage = PagesTable::getHomepage(self::$site_id);
		//self::$home_base_url = $homePage['slug'];
		//Logger::dump($homePage);
		
        self::$media_root_url = "http://files.apollosites.com/" . self::$site_id . "/";
        self::$theme_url_root = self::$url_root . '/admin/themes/' . $theme['theme_name'] . "/";
        self::$common_url_root = self::$url_root . "/admin/themes/common/";
        self::$theme_file_root = FILE_ROOT . 'admin/themes/' . $theme['theme_name'] . "/";

	/*
      	Logger::debug("\n".
              "Request URI: " . $_SERVER['REQUEST_URI'] . "\n" .
              "Host: " . $_SERVER['HTTP_HOST'] . "\n" .
              "Site ID: " . self::$site_id . "\n" .
              "Blog base path: " . self::$blog_base_url . "\n" .
              "Blog URL: " . self::$blog_url . "\n" .
              "Theme URL root: " . self::$theme_url_root . "\n" .
              "Theme file root: " . self::$theme_file_root . "\n" .
              "Medi Root URL: " . self::$media_root_url . "\n\n"
              );
     */    
    }
    
    
    // ///////////////////////////////////////////////////////////////////////////////////////
    
    /**
     * Load the data for this site
     * @param string $page_name The page name, e.g. my-page.html
     * @param string $page_path The page path, e.g. /parent/sub-parent/
     * @param string $tag Any tags from the query string (if ?tag=<tagname> was set)
     * @param string $category Any categories from the query string (if ?category=<catname> was set)
     * @param string $blog_month Any month set in query string ?year=xxxxx&month=xxxxxx - displays all blog posts for this year and month
     * @param string $blog_year Any year set in the query string ?year=xxxxx - displays all blog posts for this year
     * @param string $blog_page_no ?page=xxxxx - Any page set in the query string, displays a specific blog page, used for older/newer link
     */
    public static function load($page_name, $page_path, $tag = '', $category = '', $blog_month = '', $blog_year = '', $blog_page_no = '') {

		Logger::debug(">>>>>>>>>>>> PageManager - Loading.... <<<<<<<<<<<<<<<<<<<<");
		Logger::debug("load(page_name=$page_name, page_path=$page_path, tag=$tag, category=$category, blog_month=$blog_month, blog_year=$blog_year, blog_page_no=$blog_page_no)");
				
        // If we don't have the site id yet, get it
        if (self::$site_id == 0){
            self::init();
        }

		self::$page_path = $page_path;
		self::$page_slug = $page_name;
		
        //self::$user_id = SecurityUtils::getCurrentUserID();
        
        // Get blog info....
        $blogPage = self::$blogPage;
        
        // Store the requested blog page, if set (this is for older/previous links
        if ($blog_page_no != ''){
            self::$blog_page_no = $blog_page_no;
        }
        else {
            self::$blog_page_no = 1;
        }

        if ($tag != '') {
            self::$blog_mode = self::$BLOGMODE_TAG;
            self::$blog_tag = $tag;
            $page = $blogPage;
            Logger::debug(">>> BLOG TAG MODE!");
        } 
        else if ($category != '') {
            self::$blog_mode = self::$BLOGMODE_CATEGORY;
            self::$blog_category = $category;
            $page = $blogPage;
            Logger::debug(">>> BLOG CATEGORY MODE!");
        } 
        else if ($blog_year != '' && $blog_month != '') {
            self::$blog_mode = self::$BLOGMODE_MONTH;
            self::$blog_year = $blog_year;
            self::$blog_month = $blog_month;
            $page = $blogPage;
            Logger::debug(">>> BLOG YEAR & MONTH MODE!");
        } 
        else if ($blog_year != '') {
            self::$blog_mode = self::$BLOGMODE_YEAR;
            self::$blog_year = $blog_year;
            $page = $blogPage;
            Logger::debug(">>> BLOG YEAR MODE!");
        } 
        else {
        
            $post_path = self::$blog_url . $page_path . "/";

            // Remove the blog url from the path, e.g.
            // /blog/2010/8/19/danielle-and-jeff-wild-basin-lodge-wedding.html
            // becomes
            // /2010/8/19/danielle-and-jeff-wild-basin-lodge-wedding.html
            //$post_path = substr($page_path, (strlen(self::$blog_url) - strlen('.html')));
            $post_path = substr($page_path, (strlen(self::$blog_url)));

            // Match the page against all posts, to see if this is a request for a blog post page
            $post = PostsTable::getPostFromSlug(self::$site_id, $post_path, self::$page_slug);
			
            // If the post is set then we're hitting a single post. Otherwise, we see if we're hitting
            // either the blog or a regular page
            if (isset($post)) {
                self::$blog_mode = self::$BLOGMODE_SINGLEPOST;
                self::$current_post = $post;
                Logger::debug(">>> BLOG SINGLE POST MODE!");
                $page = $blogPage;
            }
            else {
                // Get the current page id
                self::$blog_mode = self::$BLOGMODE_ALL;
                $page = PagesTable::getPageFromSlug(self::$site_id, self::$page_slug);

/*
				// If we've found no page, and no blog post try looking up from post title
				// with the assumption that its a blog post with a bad link
	            if (!isset($page)){
	            	$decoded_slug = Post::decodeTag($page_name);
	            	Logger::warn(">>>>>> Broken link: Could not find blog page for site " . self::$site_id . ". Path = $post_path Slug = " . self::$page_slug . "! Title = " . $decoded_slug);
	            	$post = PostsTable::getPostFromTitle(self::$site_id, $decoded_slug);
	            	
	            	if (isset($post)){
	            		// Broken path? Fix it here...
	            		//$fixed_path = Post::generatePath($post['created']);
	            		//Logger::debug("<<<<<  >>>>> Post " . $post['id'] . " has bad path Fixing path from $post_path to $fixed_path");
	            		//PostsTable::updatePath($post['id'], self::$site_id, $post_path);
		                self::$blog_mode = self::$BLOGMODE_SINGLEPOST;
		                self::$current_post = $post;
		                Logger::debug(">>> BLOG SINGLE POST MODE!");
		                $page = $blogPage;
	            	}
	            }
	            else {
	                Logger::debug(">>> PAGE/BLOG!");
	            }
  */              
            }
            
        }

        // If we couldn't find the page, load the home page
        if (!isset($page) && $page_name == "") {
        	Logger::debug("Loading home page!");
            $page = PagesTable::getHomepage(self::$site_id);
        }

        // If page is still not set, hit the 404 page!
        if (!isset($page)) {
            //$page = self::$page_list[0];
            self::$validPage = false;
        }
        else {
            self::$validPage = true;
        }
		
        self::$is_homepage = $page['is_homepage'];
        self::$is_blogpage = $page['is_blogpage'];
        self::$page_id = $page['id'];
        self::$page_parent_id = $page['parent_page_id'];
        self::$page_title = $page['title'];
        self::$page_desc = $page['description'];
        self::$page_browser_title = $page['browser_title'];
        self::$template_filename = $page['template'];


    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Do any default actions in the header
     */
    public static function doHeader() {

    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    public static function getCurrentPageContent() {
        return self::getPageContent(self::$page_id);
    }

    public static function getPageContent($page_id) {
        foreach (self::$page_list as $page) {
            if ($page['id'] == $page_id) {
                return $page['content'];
            }
        }
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    public static function getFavIconURL() {

        // See if the user has set a fav icon
        $fav_image_id = ThemeTable::getGlobalParaValue(self::$site_id, self::$PARA_FAV_ICON);

        if (isset($fav_image_id)) {
            $media_folder = SecurityUtils::getMediaFolder(self::$site_id);
            $image = MediaTable::getMedia(self::$site_id, $fav_image_id);
            if (isset($image)) {
                return self::$media_root_url .  $image['filepath'] . $image['filename'];
            }
        }

        return self::$theme_url_root . 'favicon.png';
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    public static function getMediaURL($media_id) {

        $image = MediaTable::getMedia(PageManager::$site_id, $media_id);

        if (isset($image)) {
            return self::$media_root_url . $image['filepath'] . $image['filename'];
        }

        return '';
    }

    public static function getMediaURLFromThemePara($theme_para_id) {
        $media_id = PageParasTable::getParaValue(self::$page_id, $theme_para_id, self::$site_id);
        if (isset($media_id)) {
            return self::getMediaURL($media_id);
        }
        return "";
    }

    public static function getMediaFromThemePara($theme_para_id) {
        $media_id = PageParasTable::getParaValue(self::$page_id, $theme_para_id, self::$site_id);
        if (isset($media_id)) {
            return MediaTable::getMedia(self::$site_id, $media_id);
        }
        return null;
    }

    public static function getGlobalMediaFromThemePara($theme_para_id) {
        $media_id = PageParasTable::getParaValue(0, $theme_para_id, self::$site_id);
        if (isset($media_id)) {
            return MediaTable::getMedia(self::$site_id, $media_id);
        }
        return null;
    }
    
    // ///////////////////////////////////////////////////////////////////////////////////////

    public static function getPageTitle() {

        if (isset(self::$page_browser_title) && self::$page_browser_title != "") {
            $title = self::$page_browser_title;
        }
        else {
            $title = self::$page_title;
        }

	    if (PageManager::$blog_mode == PageManager::$BLOGMODE_SINGLEPOST){	
			$title .= " | " . self::$current_post['title'];
		}

        return $title;
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    public static function getPageLink($page_id) {

        foreach (self::$page_list as $page) {

            if ($page['id'] == $page_id) {
                return $page['path'] . $page['slug'];
            }
        }
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Do any default actions in the footer
     */
    public static function doFooter() {

        $domain = self::$domain;
        $page_title = self::$page_title;
        $site_id = self::$site_id;
        $page_id = self::$page_id;
        
        //$page_path = self::$page_path;
        //$slug = self::$slug;

/*
   	// Log the page view if this is a real page
    if (PageManager::$blog_mode == PageManager::$BLOGMODE_SINGLEPOST){
	    PageViewsTable::logView(PageManager::$site_id, PageManager::$page_id, $post_id, $page, $path, $query_string);
    }
    else {
	    PageViewsTable::logView(PageManager::$site_id, PageManager::$page_id, 0, $page, $path, $query_string);
	}
*/	        

		// Hit the Apollo tracker..
	    if (PageManager::$blog_mode == PageManager::$BLOGMODE_SINGLEPOST){	    	
	    	$post_id = self::$current_post['id'];	    	
			echo "<script type='text/javascript'>\n
					$.get('/admin/tracker.php?pid=$page_id&bid=$post_id&req='+location.pathname+'&ref='+document.referrer);\n
				</script>\n";
				
		}
		else {
			echo "<script type='text/javascript'>\n
					$.get('/admin/tracker.php?pid=$page_id&bid=&req='+location.pathname+'&ref='+document.referrer);\n
				</script>\n";
		}
			
		// Get the google tracker code (if set)	
		$tracker_code = ThemeTable::getGlobalParaValue(self::$site_id, self::$PARA_GOOGLE_TRACKER);

        if (isset($tracker_code) && $tracker_code != ''){        
			echo "
			<script type='text/javascript'>
			
			  var _gaq = _gaq || [];
			  _gaq.push(['_setAccount', '$tracker_code']);
			  _gaq.push(['_trackPageview', '$page_title']);
			
			  (function() {
			    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
			    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
			    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
			  })();
			
			</script>";
		}
		
		// ApolloSites tracker: UA-21458669-1
		// Ad Astra Systems tracker for apollo: UA-20462178-1
		
	    if (PageManager::$blog_mode == PageManager::$BLOGMODE_SINGLEPOST){	
	    	$post_id = self::$current_post['id'];    	
			$global_tracker_id = "Post $site_id-$post_id";
	    }
		else {
			if (!isset($page_id)) $page_id = 'E404';
			$global_tracker_id = "Page $site_id-$page_id";
		}		
		
		echo "
		<script type='text/javascript'>
		
		  var _gaq = _gaq || [];
		  
		  _gaq.push(['_setAccount', 'UA-21458669-1']);
		  _gaq.push(['_setDomainName', 'none']);
		  _gaq.push(['_trackPageview', '$global_tracker_id']);
		  _gaq.push(['_setAllowHash', false]);
				
		  (function() {
		    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		  })();			
		  
		</script>";		
		
 
    }
	
	/**
	* Echo a Google Custom Search search result page
	* @param $resultsDiv This is the div where the results will be rendered
	* @param $query optional, if set this will exectute a search query from this term and load the results
	*/
	public static function echoSERP($resultsDiv, $query=''){

		echo "<script src='https://www.google.com/jsapi?".self::$GOOGLE_API_KEY."'></script>";
	
		echo "<script type='text/javascript'>
						
			google.load('search', '1');
			//google.load('search', '1', {style: google.loader.themes.BUBBLEGUM});

			
	        google.setOnLoadCallback(
	        
	        	function(){
					//new google.search.CustomSearchControl().draw('results');
					// Create a custom search element
					var customSearchControl = new google.search.CustomSearchControl();
					
					customSearchControl.draw('$resultsDiv');
		";
					
			if ($query != ""){
				echo "customSearchControl.execute(\"$query\");"; 
			}					
		
		echo "			
					customSearchControl.enableAds('".self::$GOOGLE_AD_SENSE_KEY."')
					         				
	        	}, true);
				 		
		</script>";
	}
		
    // ///////////////////////////////////////////////////////////////////////////////////////

	public static function doSiteMetaTags(){

		$meta_desc = StringUtils::stripQuotes(ThemeTable::getGlobalParaValue(self::$site_id, self::$PARA_META_DESCRIPTION));
		$meta_keywords = StringUtils::stripQuotes(ThemeTable::getGlobalParaValue(self::$site_id, self::$PARA_META_KEYWORDS));
		
		$user_id = SitesTable::getUserIDForSite(self::$site_id);
		$user = UserTable::getUser($user_id);
		
		//$pos = SitesTable::getSiteGeoLocation(self::$site_id);
			
		$lat = $user['latitude'];
		$lon = $user['longitude'];
		$state = $user['state'];
		$city = $user['city'];
		$zip = $user['post_code'];
		$country = $user['iso_country_code'];
				
		echo "    <meta http-equiv='Content-Type' content='text/html; charset=ISO-8859-1' />\n";
		echo "    <meta name='Description' content=\"$meta_desc\" />\n";
		echo "    <meta name='Keywords' content=\"$meta_keywords\" />\n";
		echo "    <meta name='robots' content='index, follow' />\n";

		echo "    <meta name='geo.position' content='$lat; $lon' />\n";
		echo "    <meta name='geo.country' content='$country' />\n";
		echo "    <meta name='geo.region' content='$country-$state' />\n";
		echo "    <meta name='geo.placename' content='$city, $state $zip, $country' />\n";
		
		//echo "    <meta property='og:title' content=\"$meta_desc\" />";
		//echo "    <meta property='og:site_name' content='Ryan Brenizer -- New York City Wedding Photographer' />";
		//echo "    <meta property='og:url' content='http://www.ryanbrenizer.com/blog/2011/02/coming-soon-ginger-and-donald/' />";
		//echo "    <meta property='og:type' content='article' />";
		
		/*
App ID:	198788660131189
App Secret:	108d6edf24da8f33eb16cec440c198bc		
		*/
		echo "    <meta property='fb:app_id' content='198788660131189' />";
				
/*		
		echo "<meta name='ICBM' content='38.8333, -104.8167' />\n";
		echo "<meta name='DC.title' content='DC wedding photographer' />\n";
		echo "<meta name='tgn.id' content='7013637' />\n";
		echo "<meta name='tgn.name' content='Arlington' />\n";
		echo "<meta name='tgn.nation' content='United States' />\n";
		*/
	}
	
    // ///////////////////////////////////////////////////////////////////////////////////////

    public static function getPingBackURL() {
        //Logger::debug("TODO");
        // TODO
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    public static function getLanguageAttributes() {
        //Logger::debug("TODO");
        // TODO
    }

    // ///////////////////////////////////////////////////////////////////////////////////////
    //
    // Blog functions
    //
    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Return the html for the side bar for the current blog, based on the blog preferences
     */
    public static function getSidebar() {
        // TODO
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Get the posts for the current page. Depending upon the current mode, this will return a single post
     * or several posts.
     *
     * The mode is set automatically based on the currently requested page (such as a list of posts for a category,
     * the enitre blog etc.)
     * 
     * @return array list of posts
     */
    public static function getPosts() {

        $temp_list = array();

        switch (self::$blog_mode) {

            case self::$BLOGMODE_SINGLEPOST :
                $temp_list[] = self::$current_post;
                break;

            case self::$BLOGMODE_ALL :
            	$start_n = (self::$blog_page_no-1) * self::$MAX_POSTS_PER_PAGE;
            	$end_n = self::$blog_page_no * self::$MAX_POSTS_PER_PAGE;        
                $temp_list = PostsTable::getNPublishedPosts(self::$site_id, $start_n, $end_n);
                break;

            case self::$BLOGMODE_CATEGORY :
                $temp_list = PostsTable::getPublishedPostsFromCategory(self::$site_id, StringUtils::decodeSlug(self::$blog_category));
                break;

            case self::$BLOGMODE_TAG :
                $temp_list = PostsTable::getPublishedPostsFromTag(self::$site_id, StringUtils::decodeSlug(self::$blog_tag));
                break;
                
            case self::$BLOGMODE_YEAR :
                $temp_list = PostsTable::getPublishedPostsFromYear(self::$site_id, self::$blog_year);
                break;

            case self::$BLOGMODE_MONTH :
                $temp_list = PostsTable::getPublishedPostsFromMonthAndYear(self::$site_id, self::$blog_month, self::$blog_year);
                break;
                
        }

        $post_list = array();

        foreach ($temp_list as $post) {
            $post['last_edit'] = date("m/d/Y H:i", strtotime($post['last_edit'])); // Convert to JS compatible date
            $post['created'] = date("m/d/Y H:i", strtotime($post['created'])); // Convert to JS compatible date
            $post['tags'] = PostsTable::getPostTags(self::$site_id, $post['id']);
            $post['categories'] = PostsTable::getPostCategories(self::$site_id, $post['id']);
            
            $user = UserTable::getUser($post['user_id']);
            $post['author'] = $user['name'];
            $post_list[] = $post;
        }

        return $post_list;
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Return the link to comment on this post
     * @param array $post post object
     * @param string $label (optional) specify the text label to use, default is 'Comments' 
     * @param string $cssClass (optional) specify the css class to use for the link (default is 'commentLink')
     * @return string the link to the post, but as a comment link
     */
    public static function getCommentsLink($post, $label='Comments', $cssClass="commentLink"){
        $noComments = CommentsTable::getNoCommentsForPost(self::$site_id, $post['id']);
        $link = "http://" . $_SERVER['HTTP_HOST'] . "/" . self::$blog_base_url . $post['path'] . $post['slug'];
        return "<a href='$link' class='$cssClass'>$label ($noComments)</a>";
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Return the link to this post
     * @param array $post post object
     * @return string the link
     */
    public static function getPostLink($post) {
        return "http://" . $_SERVER['HTTP_HOST'] . "/". self::$blog_base_url . $post['path'] . $post['slug'];
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Return the formatted date for the give post
     * @param array $post the post object
     * @return string the date
     */
    public static function getPostDate($post) {
        //August 19, 2010
        return date("F j, Y", strtotime($post['created']));
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Get the content of the given post, the class is used to translate the content of the post to
     * text that can be rendered, by doing things such as replacing the custom apollo page break
     * with the actual content
     * @param array $post the post object
     * @return string the translated content
     */
    public static function getBlogContent($post) {

        //$content = stripslashes($post['content']);
        $content = $post['content'];
                                                
        if (self::$blog_mode == self::$BLOGMODE_SINGLEPOST) {
            // Remove more tag
            $post_content = preg_replace("/<div class='apolloPageBreak'>(.*?)<\/div>/i", "", $content);
            $post_content = preg_replace("/<div class=\"apolloPageBreak\">(.*?)<\/div>/i", "", $content);
        } 
        else {

			if (isset($post['excerpt']) && $post['excerpt'] != ""){
				$post_content = $post['excerpt'];
			}
			else {
				$post_content = $content;
			}
			
        }

        return $post_content;
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Get a list of hyperlinked categories for the entir blog
     * @param string $seperator (optional) seperator to use, default ','
     * @return string
     */
    public static function getAllCategories($seperator=",") {
        $cats = PostsTable::getCategories(self::$site_id);
        $cat_str = '';
        for ($i = 0; $i < count($cats); $i++) {
            if ($i != 0) {
                $cat_str .= $seperator;
            }
            $link = self::$blog_url . "?category=" . StringUtils::encodeSlug($cats[$i], '');
            $cat_str .= "<a href='$link'>" . $cats[$i] . "</a>";
        }
        return $cat_str;
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Return a list of hyperlinked categories for the give post
     * @param array $post
     * @param string $seperator (optional) seperator to use, default ','
     * @return string
     */
    public static function getCategories($post, $seperator=",") {
        $cats = $post['categories'];
        $cat_str = '';
        for ($i = 0; $i < count($cats); $i++) {
            if ($i != 0) {
                $cat_str .= $seperator . "&nbsp;";
            }
            $link = self::$blog_url . "?category=" . StringUtils::encodeSlug($cats[$i], '');
            $cat_str .= "<a href='$link'>" . $cats[$i] . "</a>";
        }
        return $cat_str;
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Return a list of hyperlinked tags for the give post
     * @param array $post
     * @param string $seperator (optional) seperator to use, default ','
     * @return string
     */
    public static function getTags($post, $seperator=",") {

        $tags = $post['tags'];

        $tag_str = '';
        for ($i = 0; $i < count($tags); $i++) {
            if ($i != 0) {
                $tag_str .= $seperator . "&nbsp;";
            }
            $link = self::$blog_url . "?tag=" . StringUtils::encodeSlug($tags[$i], '');
            $tag_str .= "<a href='$link'>" . $tags[$i] . "</a>";
        }
        return $tag_str;
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Get the link to display older posts
     * @param strin $text the test to user for the link
     * @return string the link
     */
    public static function getOlderPostsLink($text) {
    	
    	$no_pages = ceil(self::$no_posts / self::$MAX_POSTS_PER_PAGE);
    	$prev_page = self::$blog_page_no+1;
    	
    	if ($prev_page <= $no_pages){
	        if (self::$blog_mode == self::$BLOGMODE_ALL) {
	            $link = self::$blog_url . "?page_no=" . $prev_page;
	            return "<a href='$link'>$text</a>";
	        }
    	}
    	
        return "";
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Get the link to display newer posts
     * @param strin $text the test to user for the link
     * @return string the link
     */
    public static function getNewerPostsLink($text) {
    
    	$next_page = self::$blog_page_no-1;
    
    	if ($next_page > 1){
	        if (self::$blog_mode == self::$BLOGMODE_ALL) {
	            $link = self::$blog_url . "?page_no=" . $next_page;
	            return "<a href='$link'>$text</a>";
	        }
    	}
    	else if ($next_page == 1){
            $link = self::$blog_url;
            return "<a href='$link'>$text</a>";
    	}
    	
        return "";
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Dump the page info to the logger, for debug!
     */
    public static function dump(){

      Logger::debug("\n".
              "Request URI: " . $_SERVER['REQUEST_URI'] . "\n" .
              "Host: " . $_SERVER['HTTP_HOST'] . "\n" .
              "Site ID: " . self::$site_id . "\n" .
              "Page ID: " . self::$page_id . "\n" .
              "Page Parent ID: " . self::$page_parent_id . "\n" .
              "User ID: " . self::$user_id . "\n" .
              "URL Root: " . self::$url_root . "\n" .
              "Page Slug: " . self::$page_slug . "\n" .
              "Blog base path: " . self::$blog_base_url . "\n" .
              "Blog URL: " . self::$blog_url . "\n" .
              "Theme URL root: " . self::$theme_url_root . "\n" .
              "Theme file root: " . self::$theme_file_root . "\n" .
              "Templeta File: " . self::$template_filename . "\n" .
              "Medi Root URL: " . self::$media_root_url . "\n\n"
              );

    }
}

?>