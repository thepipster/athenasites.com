<?php

/**
 *
 * @since 8th August, 2010
 */
class PageManager {

    /** The site url root, e.g. http://cgp.apollosites.com/ */
    public static $url_root;
    
    /** The them url root, e.g. http://cgp.apollosites.com/admin/themes/cgp4/ */
    public static $theme_url_root;
    
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
    
    /** The current parent title */
    public static $page_title;
    
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
    
    /** The blog base url, e.g.  /blog.html */
    public static $blog_url;
    
    /** The blog base path, e.g.  blog */
    public static $blog_base_url;
    
    /** The total number of posts for this blog */
    public static $no_posts = 0;
    
    public static $current_post = null;
    
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
    
    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Initialize, this uses the domain to get the site id
     */
    public static function init() {

        self::$url_root = 'http://' . $_SERVER['HTTP_HOST'];

        // Get the domaing, and strip www if it has it
        self::$domain = $_SERVER['HTTP_HOST'];
        self::$domain = str_replace('www.', '', self::$domain);

        // Get the site id
        $site = SitesTable::getSiteFromDomain(self::$domain);
        self::$site_id = $site['id'];

        // Get the list of pages
        self::$page_list = PagesTable::getPages(self::$site_id);

        // Get the theme info
        self::$theme_id = $site['theme_id'];
        $theme = ThemeTable::getTheme(self::$theme_id);

        self::$media_root_url = self::$url_root . "/user_files/" . self::$site_id . "/";
        self::$theme_url_root = self::$url_root . '/admin/themes/' . $theme['theme_name'] . "/";
        self::$theme_file_root = FILE_ROOT . 'admin/themes/' . $theme['theme_name'] . "/";

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

		self::$page_slug = $page_name;
		
        //self::$user_id = SecurityUtils::getCurrentUserID();
        
        // Get blog info....
        $blogPage = PagesTable::getBlogpage(self::$site_id);
        self::$blog_url = $blogPage['path'] . $blogPage['slug'];
        self::$blog_base_url = substr(self::$blog_url, 0, (strlen(self::$blog_url) - strlen('.html')));
        self::$no_posts = PostsTable::getNoPosts(self::$site_id);

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
            $post_path = substr($page_path, (strlen(self::$blog_url) - strlen('.html')));

            // Match the page against all posts, to see if this is a request for a blog post page
            $post = PostsTable::getPostFromSlug(self::$site_id, $post_path, self::$page_slug);

            // If the post is set then we're hitting a single post. Otherwise, we see if we're hitting
            // either the blog or a regular page
            if (isset($post)) {
                self::$blog_mode = self::$BLOGMODE_SINGLEPOST;
                self::$current_post = $post;
                Logger::debug(">>> BLOG SINGLE POST MODE!");
                //$parts = explode("/", $post_path);
                //Logger::dump($parts);
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
                Logger::debug("Slug = " . self::$page_slug);
                $page = PagesTable::getPageFromSlug(self::$site_id, self::$page_slug);
                Logger::debug(">>> PAGE/BLOG!");
            }
        }

        // If we couldn't find the page, load the home page
        if (!isset($page)) {
            $page = PagesTable::getHomepage(self::$site_id);
        }

        // If page is still not set, select the first in the page list
        if (!isset($page)) {
            $page = self::$page_list[0];
        }

		Logger::dump($page);
		
        self::$is_homepage = $page['is_homepage'];
        self::$is_blogpage = $page['is_blogpage'];
        self::$page_id = $page['id'];
        self::$page_parent_id = $page['parent_page_id'];
        self::$page_title = $page['title'];
        self::$page_desc = $page['description'];
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

    public static function echoGoogleTracker($tracker_code) {

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

        if (!isset($tracker_code) || $tracker_code == '')
            return;

        echo "// Tracking";
        echo "try {";
        echo "    var pageTracker = _gat._getTracker('$tracker_code');";
        echo "    pageTracker._setDomainName('$domain');";
        echo "    pageTracker._trackPageview('$page_title');";
        echo "} catch(err) {}";
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    public static function getFavIconURL() {

        // See if the user has set a fav icon
        $fav_image_id = ThemeTable::getFavicon(PageManager::$site_id);

        if (isset($fav_image_id)) {
            $media_folder = SecurityUtils::getMediaFolder(PageManager::$site_id);
            $image = FolderTable::getMedia(self::$site_id, $fav_image_id);
            if (isset($image)) {
                return $media_root_url . $image['filename'];
            }
        }

        return self::$theme_url_root . 'favicon.png';
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    public static function getMediaURL($media_id) {

        $image = FolderTable::getMedia(PageManager::$site_id, $media_id);

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
            return FolderTable::getMedia(self::$site_id, $media_id);
        }
        return null;
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    public static function getPageTitle() {

        if (isset(self::$page_desc) && self::$page_desc != "") {
            return self::$page_desc;
        }

        return self::$page_title;
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
            	Logger::debug("Current Blog page = " . self::$blog_page_no);
            	$start_n = (self::$blog_page_no-1) * self::$MAX_POSTS_PER_PAGE;
            	$end_n = self::$blog_page_no * self::$MAX_POSTS_PER_PAGE;            	
                $temp_list = PostsTable::getNPosts(self::$site_id, $start_n, $end_n);
                break;

            case self::$BLOGMODE_CATEGORY :
                $temp_list = PostsTable::getPostsFromCategory(self::$site_id, self::$blog_category);
                break;

            case self::$BLOGMODE_TAG :
                $temp_list = PostsTable::getPostsFromTag(self::$site_id, self::$blog_tag);
                break;
                
            case self::$BLOGMODE_YEAR :
                $temp_list = PostsTable::getPostsFromYear(self::$site_id, self::$blog_year);
                break;

            case self::$BLOGMODE_MONTH :
                $temp_list = PostsTable::getPostsFromMonthAndYear(self::$site_id, self::$blog_month, self::$blog_year);
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
        $link = "http://" . $_SERVER['HTTP_HOST'] . self::$blog_base_url . $post['path'] . $post['slug'];
        return "<a href='$link' class='$cssClass'>$label ($noComments)</a>";
    }

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Return the link to this post
     * @param array $post post object
     * @return string the link
     */
    public static function getPostLink($post) {
        return "http://" . $_SERVER['HTTP_HOST'] . self::$blog_base_url . $post['path'] . $post['slug'];
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

        $content = stripslashes($post['content']);
        $content = ImportHelper::convertContent($content, $post['source']);


//		$result = preg_match("/<!--more (.*?)-->/i", $content, $match);
// <div class='apolloPageBreak'>More photos from their wedding</div>
        // Get the more text

        if (self::$blog_mode == self::$BLOGMODE_SINGLEPOST) {

            // Remove more tag
            $post_content = preg_replace("/<div class='apolloPageBreak'>(.*?)<\/div>/i", "", $content);
        } else {

            $result = preg_match("/<div class='apolloPageBreak'>(.*?)<\/div>/i", $content, $match);

            if ($result) {

                if (isset($match) && isset($match[1])) {
                    $more_text = $match[1];
                }

                $tag = "<div class='apolloPageBreak'>$more_text</div>";
                $post_link = self::getPostLink($post);
                $link_tag .= "<p><a href='$post_link' class='apolloPageBreak'>$more_text</a></p>";

                $s_pos = strpos($content, $tag);

                $post_content = substr($content, 0, $s_pos) . $link_tag;
            } else {
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
                $cat_str .= $seperator;
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
                $tag_str .= $seperator;
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