<?php

/**
 * Class with common functions used during blog import operations
 *
 * @author Mike Pritchard (mike@apollosites.com)
 * @since 6th September, 2010
 */
class ImportHelper {

    public static function importPost($user_id, $site_id, $content, $status, $title, $created_date, $can_comment, $csv_tags, $csv_categories, $import_source, $source_id=null) {

        // Convert put date to php date
        $date_str = date('Y-m-d H:i:s', strtotime($created_date));

        if ($title == "") {
            $slug = "post";
        } else {
            $slug = StringUtils::encodeSlug($title, '');
        }

        // Check to see if this post already exists, if so then we over-write it
        $post_id = PostsTable::getPostIDFromDate($site_id, $date_str);
        if (!isset($post_id)) {
            $post_id = PostsTable::create($site_id, $user_id, StringUtils::makeHtmlSafe($content), $status, StringUtils::makeHtmlSafe($title), $can_comment, $slug, $import_source);
//      	$post_id = PostsTable::create($site_id, $user_id, $content, $status, $title, $can_comment, $slug);
        }
//        else {
//            PostsTable::update($site_id, $post_id, StringUtils::makeHtmlSafe($content), $status, StringUtils::makeHtmlSafe($title), $can_comment, $slug, $import_source);
//        }

        // Get path

        $day = date("d", strtotime($created_date));
        $month = date("n", strtotime($created_date));
        $year = date("Y", strtotime($created_date));

        $path = "/$year/$month/$day/";

        PostsTable::updatePath($post_id, $site_id, $path);
        PostsTable::updateCreatedDate($post_id, $site_id, $date_str);
        PostsTable::updateSource($post_id, $site_id, $import_source);
        if (isset($source_id)) {
            PostsTable::updateSourceID($post_id, $site_id, $source_id);
        }

        // Add tags..........

        $tag_list = explode(",", $csv_tags);

        foreach ($tag_list as $tag) {
            $tag = trim($tag);
            if ($tag != "") {
                $safetag = StringUtils::makeTextSafe($tag);
                PostsTable::addTagToPost($site_id, $post_id, $safetag);
            }
        }


        // Add categories....
        $cat_list = explode(",", $csv_categories);

        foreach ($cat_list as $cat) {
            $cat = trim($cat);
            if ($cat != "") {
                $safecat = StringUtils::makeTextSafe($cat);
                PostsTable::addCategoryToPost($site_id, $post_id, $safecat);
            }
        }
                
        // Pre-process the post to ready it for rendering...
	    $post = PostsTable::getPost($site_id, $post_id);
		ImportHelper::processPostContent($site_id, $post);
        

        return $post_id;
    }

    // /////////////////////////////////////////////////////////////////////////////////

    /**
     * Import a comment, and assign to the given post. However, if we don't know what the post id for apollo is, but we do know the import source post id (e.g. we know the live journal post id, but not our own) then
     * set $import_post_id to the source's post id.
     *
     * @param $site_id
     * @param $source_post_id - The post id for this comment given by the source (e.g. Wordpress)
     * @param $author_name
     * @param $author_email
     * @param $author_ip
     * @param $author_url
     * @param $content
     * @param $parent_comment_id
     * @param $created_date
     * @param $approved - 1 or 0
     * @param $import_source - Source of the blog
     */
    public static function importCommentUsingSourcePostID($site_id, $source_post_id, $author_name, $author_email, $author_ip, $author_url, $content, $parent_comment_id, $created_date, $approved, $import_source, $import_source_id) {

        $apollo_post_id = PostsTable::getPostFromSourceID($site_id, $source_post_id);
        if (!isset($apollo_post_id)) {
            $apollo_post_id = 0;
        }

        $comment_id = self::importComment($site_id, $apollo_post_id, $author_name, $author_email, $author_ip, $author_url, $content, $parent_comment_id,
                        $created_date, $approved, $import_source, $import_source_id);

        CommentsTable::updatePostID($comment_id, $site_id, $apollo_post_id);
        CommentsTable::updateSourcePostID($comment_id, $site_id, $source_post_id);

        return $comment_id;
    }

    // /////////////////////////////////////////////////////////////////////////////////

    /**
     * Import a comment, and assign to the given post.
     *
     * @param $site_id
     * @param $apollo_post_id - The (apollo) post id for this comment
     * @param $author_name
     * @param $author_email
     * @param $author_ip
     * @param $author_url
     * @param $content
     * @param $parent_comment_id
     * @param $created_date
     * @param $approved - 1 or 0
     * @param $import_source - Source of the blog
     * @param $import_source_id - (optional) Source id for the comment (e.g. this would be the comment id given by wordpress etc)
     */
    public static function importComment($site_id, $apollo_post_id, $author_name, $author_email, $author_ip, $author_url, $content, $parent_comment_id, $created_date, $approved, $import_source, $import_source_id=null) {

        // Convert put date to php date
        $date_str = date('Y-m-d H:i:s', strtotime($created_date));

        // Create/Update the blog follower....
        if ($author_email != '') {
            $follower_id = SiteFollowersTable::getFollowerIDFromEmail($author_email);
        } else if ($author_url != '') {
            // If they have no email, search by url
            $follower_id = SiteFollowersTable::getFollowerIDFromURL($author_url);
        } else {
            // If they have no email or URL, search by name - which is not ideal as name may not be unique
            $follower_id = SiteFollowersTable::getFollowerIDFromName($author_name);
        }

        if (!isset($follower_id)) {
            $follower_id = SiteFollowersTable::addFollower($author_name, $author_email, $author_ip, $author_url);
            SiteFollowersTable::updateCreatedDate($follower_id, $date_str); // Force the imported comment date as the create date for this follower
        } else {
            SiteFollowersTable::updateFollower($follower_id, $author_ip, $author_url);
            SiteFollowersTable::updateLastActivityDate($follower_id, $date_str); // Force the imported comment date as the last activity date for this follower
        }

        // Add follower to site
        SiteFollowersTable::addFollowerToSite($follower_id, $site_id);

		//Logger::debug(">>> Approved = $approved");
		
        // Create the comment
        //$status = 'Pending';
        //if ($approved == 1) {
        //    $status = 'Approved';
        //}
        $status = $approved;

        // Check to see if this comment already exists, if so then we over-write it
        //$comment_id = CommentsTable::getCommentIDFromDateAndFollower($site_id, $date_str, $follower_id);
        $comment_id = CommentsTable::getCommentIDFromDate($site_id, $date_str);
        
        if (!isset($comment_id)) {
            //$comment_id = CommentsTable::createForceID($site_id, $apollo_post_id, $comment_id, $parent_comment_id, $content, $status, $author_ip, $follower_id);
            $comment_id = CommentsTable::create($site_id, $apollo_post_id, $parent_comment_id, $content, $status, $author_ip, $follower_id);
        }
//		else {
//			Logger::debug("This comment already exists");
//			CommentsTable::update($site_id, $apollo_post_id, $comment_id, $parent_comment_id, $content, $status, $author_ip, $follower_id);
//		}

        CommentsTable::updateCreatedDate($comment_id, $site_id, $date_str);
        CommentsTable::updateSource($comment_id, $site_id, $import_source);
        if (isset($import_source_id)) {
            CommentsTable::updateSourceID($comment_id, $site_id, $import_source_id);
        }
        
        return $comment_id;
    }

    // /////////////////////////////////////////////////////////////////////////////////

	/**
	* This processes a post for faster rendering by extracting an excerpt
	*/
	public static function processPostContent($site_id, $post){

	    $content = $post['content'];
	    $blogpage = PagesTable::getBlogpage($site_id);
	            
	    // Do a one time conversion, if required
	    if ($post['source'] != 'apollo'){
	        $content = ImportHelper::convertContent($content, $post['source']);
			PostsTable::updateSourceAndContent($site_id, $post['id'], $content, 'apollo');
	    }
			
		// Look for the more tag, of the form: <div class="apolloPageBreak">More...</div>
		$singleQuotes = false;
		$result = preg_match("/<div class=\"apolloPageBreak\">(.*?)<\/div>/i", $content, $match);
	
		if (!$result){
			// Try buy using single quotes
			$singleQuotes = true;
	    	$result = preg_match("/<div class='apolloPageBreak'>(.*?)<\/div>/i", $content, $match);
		}
		
		Logger::debug("Match result = $result");
		
	    if ($result) {
	
	        if (isset($match) && isset($match[1])) {
	            $more_text = $match[1];
	        }
	
			if ($singleQuotes){
		        $tag = "<div class='apolloPageBreak'>$more_text</div>";
			}
			else {
		        $tag = "<div class=\"apolloPageBreak\">$more_text</div>";
			}
	        
	        if (isset($blogpage)){
		        $post_link = $blogpage['path'] . $blogpage['slug'] . $post['path'] . $post['slug'];
	        }
	        else {
		        $post_link = $post['path'] . $post['slug'];
	        }
	        
	        $link_tag = "<p><a href='$post_link' class=\"apolloPageBreak\">$more_text</a></p>";
	
	        $s_pos = strpos($content, $tag);
	
	        $excerpt = substr($content, 0, $s_pos) . $link_tag;
	        
	        PostsTable::updateExcerpt($site_id, $post['id'], $excerpt);
	    } 
	    //else {
	    //	$excerpt = $content;
	    //}
		
		
		//$processed_full_content = preg_replace("/<div class='apolloPageBreak'>(.*?)<\/div>/i", "", $content);
	        
	}

    // /////////////////////////////////////////////////////////////////////////////////

    /**
     * Convert content, based on source (e.g. remove LiveJournal tags and page breaks and replace
     * with Apollo equivalents)
     */
    public static function convertContent($content, $import_source) {

        switch (strtolower($import_source)) {
            case 'wordpress': $content = self::convertWordpressContent($content);
                break;
            case 'livejournal': $content = self::convertLiveJournalContent($content);
                break;
        }

        return $content;
    }

    // /////////////////////////////////////////////////////////////////////////////////

    /**
     * Replace the WP more tag with the apollo one
     */
    private static function convertWordpressContent($content) {

        Logger::debug("Converting WP content");

        // <!--more-->
        // <!--more But wait, there's more! -->

        $more_text = "More...";

        $result = preg_match("/<!--more (.*?)-->/i", $content, $match);
        if ($result) {
            if (isset($match) && isset($match[1])) {
                $more_text = $match[1];
            }
            //Logger::dump($match);
        }

        //$apollo_break = "<div class='apolloPageBreak' style='border: 1px solid blue;'>$more_text</div>";
        $apollo_break = "<div class='apolloPageBreak'>$more_text</div>";

        // Replace WP tag
        $content = preg_replace("/<!--more (.*?)-->/i", $apollo_break, $content);

        return $content;
    }

    // /////////////////////////////////////////////////////////////////////////////////

    /**
     * Remove any custom tags and convert into the Apollo equivalent
     *
     * 	    First part of the blog post goes here.  This part will appear before you click the link to read more.
     *
     * 		<lj-cut text="Click here to read more">
     * 		Everything after that tag will appear when you click the link.  A new page opens with the full post.
     *
     * 		</lj-cut>
     * 		The end lj-cut tag is optional.  You use it if you want to show more text on the main page.
     *
     */
    private static function convertLiveJournalContent($content) {

        $more_text = "More...";

        $result = preg_match("/<lj-cut text=(.*?)>/i", $content, $match);
        if ($result) {
            if (isset($match) && isset($match[1])) {
                $more_text = $match[1];
            }
        }

        //$apollo_break = "<div class='apolloPageBreak' style='border: 1px solid blue;'>$more_text</div>";
        $apollo_break = "<div class='apolloPageBreak'>$more_text</div>";

        // Replace LJ tag
        $content = preg_replace("/<lj-cut text=(.*?)>/i", $apollo_break, $content);

        // Remove any end tag...
        $content = preg_replace("/<\/lj-cut>/i", "", $content);

        return $content;
    }

}

?>