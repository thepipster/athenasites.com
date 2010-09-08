<?php
/**
* Class with common functions used during blog import operations
*
* @author Mike Pritchard (mike@apollosites.com)
* @since 6th September, 2010
*/
class ImportHelper {

	public static function importPost($user_id, $site_id, $content, $status, $title, $created_date, $can_comment, $csv_tags, $csv_categories, $import_source){
		
		// Convert put date to php date
	    $date_str = date('Y-m-d H:i:s', strtotime($created_date));
	
		// Convert content based on source
		switch( strtolower($import_source) ){
			case 'wordpress': $content = self::convertWordpressBreak($content); break;
			case 'livejournal': $content = self::convertLiveJournalBreak($content); break;
		}
		
		if ($title == ""){
			$slug = "post";
		}
		else {
			$slug = StringUtils::encodeSlug($title);
		}
		
		// Check to see if this post already exists, if so then we over-write it
		$post_id = PostsTable::getPostIDFromDate($site_id, $date_str);
		if (isset($post_id)){
			PostsTable::update($site_id, $post_id, StringUtils::makeHtmlSafe($content), $status, StringUtils::makeHtmlSafe($title), $can_comment, $slug);
		}
		else {
			$post_id = PostsTable::create($site_id, $user_id, StringUtils::makeHtmlSafe($content), $status, StringUtils::makeHtmlSafe($title), $can_comment, $slug);
		}
		
		// Get path
			
		$day = date("d", strtotime($created_date));
		$month = date("n",strtotime($created_date));
		$year = date("Y", strtotime($created_date));
			
		$path = "/$year/$month/$day/";
		
		PostsTable::updatePath($post_id, $site_id, $path);
		PostsTable::updateCreatedDate($post_id, $site_id, $date_str);
		PostsTable::updateSource($post_id, $site_id, $import_source);
		
		// Add tags..........
		
		$tag_list = explode(",", $csv_tags);
		
		foreach($tag_list as $tag){
			$tag = trim($tag);
			if ($tag != ""){
				$safetag = StringUtils::makeTextSafe($tag);	
				PostsTable::addTagToPost($site_id, $post_id, $safetag);
			}
		}
	
		
		// Add categories....
		$cat_list = explode(",", $csv_categories);
		
		foreach($cat_list as $cat){
			$cat = trim($cat);
			if ($cat != ""){
				$safecat = StringUtils::makeTextSafe($cat);			
				PostsTable::addCategoryToPost($site_id, $post_id, $safecat);
			}
		}

		return $post_id;
	
	}
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Import a comment, and assign to the given post. However, if we don't know what the post id for apollo is, but we do know the import source post id (e.g. we know the live journal post id, but not our own) then
	* set $import_post_id to the source's post id.
	*
	* @param $site_id
	* @param $post_id
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
	* @param $import_post_id - (optional) The post id from the source, e.g. if importing from wordpress, this is the post id used by wordpress. This is used to match comments to their correct post
	*/
	public static function importComment($site_id, $post_id, $author_name, $author_email, $author_ip, $author_url, $content, $parent_comment_id, 
													$created_date, $approved, $import_source, $import_source_id=null, $import_post_id=null){

		// Convert put date to php date
	    $date_str = date('Y-m-d H:i:s', strtotime($created_date));
	
		// Create/Update the blog follower....
		if ($author_email != ''){
			$follower_id = SiteFollowersTable::getFollowerIDFromEmail($author_email);		
		}
		else if ($author_url != ''){
			// If they have no email, search by url
			$follower_id = SiteFollowersTable::getFollowerIDFromURL($author_url);
		}	
		else {
			// If they have no email or URL, search by name - which is not ideal as name may not be unique
			$follower_id = SiteFollowersTable::getFollowerIDFromName($author_name);
		}	
		
		CommentsTable::updateSource($post_id, $site_id, $import_source);
		if (isset($import_source_id)){
			CommentsTable::updateSourceID($post_id, $site_id, $import_source_id);
		}
		
		if (!isset($follower_id)){
			$follower_id = SiteFollowersTable::addFollower($author_name, $author_email, $author_ip, $author_url);
			SiteFollowersTable::updateCreatedDate($follower_id, $date_str); // Force the imported comment date as the create date for this follower
		}
		else {
			SiteFollowersTable::updateFollower($follower_id, $author_ip, $author_url);
			SiteFollowersTable::updateLastActivityDate($follower_id, $date_str); // Force the imported comment date as the last activity date for this follower
		}
		
		// Add follower to site
		SiteFollowersTable::addFollowerToSite($follower_id, $site_id);
			
		// Create the comment
		$status = 'Pending';
		if ($approved == 1){ $status = 'Approved';}
			
		// Check to see if this comment already exists, if so then we over-write it
		$temp_id = CommentsTable::getCommentIDFromDate($site_id, $date_str);
		if (isset($temp_id)){
			CommentsTable::update($site_id, $post_id, $temp_id, $parent_comment_id, $content, $status, $author_ip, $follower_id);
		}
		else {
			$comment_id = CommentsTable::createForceID($site_id, $post_id, $comment_id, $parent_comment_id, $content, $status, $author_ip, $follower_id);
		}	

		
		if ($import_post_id != null){
			$post_id = PostsTable::getPostFromSourceID($site_id, $import_post_id);
			CommentsTable::updatePostID($comment_id, $site_id, $post_id);
		}
			
		CommentsTable::updateCreatedDate($comment_id, $site_id, $date_str);
		
		return $comment_id;
	}	
	
	// /////////////////////////////////////////////////////////////////////////////////

	/**
	* Replace the WP more tag with the apollo one
	*/
	public static function convertWordpressBreak($content){
		
		// <!--more-->
		// <!--more But wait, there's more! -->
		
		$more_text = "More...";
		
		$result = preg_match("/<!--more (.*?)-->/i", $content, $match);
		if ($result){
			if (isset($match) && isset($match[1])){
				$more_text = $match[1];
			}
			//Logger::dump($match);
		}

		$apollo_break = "<div class='apolloPageBreak'>$more_text</div>";

		// Replace WP tag
		$content = preg_replace("/<!--more (.*?)-->/i", $apollo_break, $content);
				
		return $content;
		
	}	

	// /////////////////////////////////////////////////////////////////////////////////

	/**
	* Remove any custom tags and convert into the Apollo equivalent
	* 		
	*	    First part of the blog post goes here.  This part will appear before you click the link to read more.
	*		
	*		<lj-cut text="Click here to read more">
	*		Everything after that tag will appear when you click the link.  A new page opens with the full post.
	*		
	*		</lj-cut>
	*		The end lj-cut tag is optional.  You use it if you want to show more text on the main page.	
	*
	*/
	public static function convertLiveJournalBreak($content){
		
		$more_text = "More...";
		
		$result = preg_match("/<lj-cut text=(.*?)>/i", $content, $match);
		if ($result){
			if (isset($match) && isset($match[1])){
				$more_text = $match[1];
			}
		}

		$apollo_break = "<div class='apolloPageBreak'>$more_text</div>";

		// Replace LJ tag
		$content = preg_replace("/<lj-cut text=(.*?)>/i", $apollo_break, $content);
		
		// Remove any end tag...
		$content = preg_replace("/<\/lj-cut>/i", "", $content);
		
		return $content;
	}
				

}
?>