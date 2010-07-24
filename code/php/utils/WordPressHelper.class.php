<?php
/**
* Logging class, use for all trace commands
*
*/
class WordPressHelper {

	public static $DEBUG	 	= 0;
	public static $INFO 		= 1;
	public static $WARNING 		= 2;
	public static $ERROR	 	= 3;
	public static $FATAL	 	= 4;

	private static $prev_blog_id = 1;
	
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Switch to the specified blog_id, returns old blog id
	*/
	public static function setCurrentBlog($new_blog_id){
		
		global $blog_id;
		global $wpdb;
		
		self::$prev_blog_id = $blog_id;
		switch_to_blog( $new_blog_id );
				
		// Check that it worked
		if ($wpdb->posts != "wp_{$new_blog_id}_posts"){
			Logger::fatal("Could not switch blog, check wpmu-functions.switch_to_blog and make sure the section that skips work if the blog ids are the same is commented out (around line 312)!");
		}
				
		return self::$prev_blog_id;
		/*
		global $wpdb;
		$wpdb->commentmeta = "wp_{$blog_id}_commentmeta";
		$wpdb->comments = "wp_{$blog_id}_comments";
		$wpdb->links = "wp_{$blog_id}_links";
		$wpdb->options = "wp_{$blog_id}_options";
		$wpdb->postmeta = "wp_{$blog_id}_postmeta";
		$wpdb->posts = "wp_{$blog_id}_posts";
		$wpdb->term_relationships = "wp_{$blog_id}_term_relationships";
		$wpdb->term_taxonomy = "wp_{$blog_id}_term_taxonomy";
		$wpdb->terms = "wp_{$blog_id}_terms";
		*/
	}

	//public static function resetCurrentBlog($blog_id){
	//	global $wpdb;
	//	
	//}
	
	// //////////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Force WP to generate a thumbnail. Sometimes WP doesn't correctly generate thumbnails, so check for valid urls and call this if needed
	*/ 
	public static function regenerateThumbnail($post_id, $blog_id, $blog_file_root){

		global $wpdb;

		//$fullsizepath = get_attached_file( $id );

		$sql = $wpdb->prepare("SELECT meta_value FROM wp_%d_postmeta WHERE meta_key = '_wp_attached_file' AND post_id = %d", $blog_id, $post_id); 		
		$fullsizepath = $blog_file_root . $blog_id . '/files/' . $wpdb->get_var($sql);

		Logger::debug($fullsizepath);
		
		if (!file_exists($fullsizepath)){
			Logger::error("Image does not exists for post id $post_id and blog id $blog_id");
			return;
		}

		// Where is $wpdb->posts being set?
		Logger::debug($wpdb->posts);
		
		$res = wp_update_attachment_metadata( $post_id, wp_generate_attachment_metadata( $post_id, $fullsizepath ));
		
		//update_post_meta( $post->ID, '_wp_attachment_metadata', $data)
		
	}	
	
	// //////////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Extract the meta data for a given post
	*/ 
	public static function getPostMeta($post_id, $blog_id){	
		global $wpdb;								
		$sql = $wpdb->prepare("SELECT meta_value FROM wp_%d_postmeta WHERE post_id = %d AND meta_key = '_wp_attachment_metadata'", $blog_id, $post_id); 		
		$serialized_meta = $wpdb->get_var($sql);			
		$meta = unserialize($serialized_meta);	
		//Logger::dump($meta);		
		return $meta;
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Get a list of all the pages that are using the given template
	*/
	public static function getPagesListForTemplate($blog_id, $template_name){
		global $wpdb;						
		$sql = $wpdb->prepare("SELECT * FROM wp_%d_posts posts INNER JOIN wp_%d_postmeta meta WHERE posts.id = meta.post_id AND meta.meta_key = '_wp_page_template' AND meta.meta_value = %s", $blog_id, $blog_id, $template_name); 		
		return $wpdb->get_results($sql, ARRAY_A);
	}

	// //////////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Get the user ID for the given username
	*/
	public static function getUserIDFromUsername($username){
		global $wpdb;		
		$sql = $wpdb->prepare("SELECT ID FROM wp_users WHERE user_login = %s", $username);
		return $wpdb->get_var($sql);
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getUserLevel($blog_id, $user_id){
		global $wpdb;		
		$sql = $wpdb->prepare("SELECT meta_value FROM wp_user_meta WHERE meta_key = 'wp_%d_user_level' AND user_id = %d", $$blog_id, $user_id);
		return $wpdb->get_var($sql);
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////
	
	public static function setUserLevel($blog_id, $user_id, $level){

		global $wpdb;		
		$current_level = WordPressHelper::getUserLevel($blog_id, $user_id);
		
		if (!isset($current_level) || !$current_level){
			$sql = $wpdb->prepare("INSERT INTO wp_usermeta (meta_key, meta_value, user_id) VALUES ('wp_%d_user_level', %d, %d)", $blog_id, $level, $user_id);
		}
		else {
			$sql = $wpdb->prepare("UPDATE wp_usermeta SET meta_value = %d WHERE meta_key = 'wp_%d_user_level' AND user_id = %d", $level, $blog_id, $user_id);
		}

		return $wpdb->query($sql);
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Update a users password with the given plain string password (the password will be stored as
	* a hash in the DB.
	*/	
	public static function updateUserPassword($user_id, $plain_pass){
		global $wpdb;		
		$sql = $wpdb->prepare("UPDATE wp_users SET user_pass = %s WHERE ID = %d", wp_hash_password($plain_pass), $user_id);
		return $wpdb->query($sql);
	}
		
	// //////////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Return the real thumbnail url for the given image post (that is, not using file.php to serve static images)
	*/
	public static function getRealThumbURL($post_id, $blog_id){
		$meta = self::getPostMeta($post_id, $blog_id);
		$full_url = $meta['file'];
		$basedir = dirname($full_url);
		if ($basedir == '.') $basedir = '';
		return 'http://' . $_SERVER['HTTP_HOST'] . "/wp-content/blogs.dir/" . $blog_id . "/files/" . $basedir . "/" . $meta['sizes']['thumbnail']['file'];
	}

	/**
	* Get the thumbnail basename
	*/
	public static function getRealThumbBasename($post_id, $blog_id){
		$meta = self::getPostMeta($post_id, $blog_id);
		$full_url = $meta['file'];
		$basedir = dirname($full_url);
		if ($basedir == '.') $basedir = '';
		return "/wp-content/blogs.dir/" . $blog_id . "/files/" . $basedir . "/" . $meta['sizes']['thumbnail']['file'];
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Return the real thumbnail url for the given image post (that is, not using file.php to serve static images)
	*/
	public static function getRealImageURL($post_id, $blog_id){
		global $wpdb;				
		$sql = $wpdb->prepare("SELECT meta_value FROM wp_%d_postmeta WHERE post_id = %d AND meta_key = '_wp_attached_file'", $blog_id, $post_id); 		
		$file = $wpdb->get_var($sql);
		return 'http://' . $_SERVER['HTTP_HOST'] . "/wp-content/blogs.dir/" . $blog_id . "/files/" . $basedir . "/" . $file;
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getImageURL($post_id, $blog_id){
		global $wpdb;				
		$sql = $wpdb->prepare("SELECT guid FROM wp_%d_posts WHERE ID = %d", $blog_id, $post_id); 		
		return $wpdb->get_var($sql);		
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	public static function setupApolloSession(){
		get_currentuserinfo();
		global $current_user, $blog_id;
		Session::set('apollo_user_logged_in',true);
		Session::set('apollo_user_id', $current_user->ID);
		Session::set('apollo_user_level', $current_user->user_level);
		Session::set('apollo_user_display_name', $current_user->display_name);
		Session::set('apollo_blog_id', $blog_id);
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function clearApolloSession(){
		Session::clear('apollo_user_logged_in');
		Session::clear('apollo_user_id');
		Session::clear('apollo_user_level');
		Session::clear('apollo_user_display_name');
		Session::clear('apollo_blog_id');
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	public static function uploadImage(){
		 // $attach_id = wp_insert_attachment( $attachment, $filename, 37 );
		 // $attach_data = wp_generate_attachment_metadata( $attach_id, $filename );
		//  wp_update_attachment_metadata( $attach_id,  $attach_data );
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getDomain($blog_id){
		global $wpdb;				
		$sql = $wpdb->prepare("SELECT option_value FROM wp_%d_options WHERE option_name = 'siteurl'", $blog_id ); 		
		return $wpdb->get_var($sql);		
	}

	// //////////////////////////////////////////////////////////////////////////////////////
/*	
	public static signupUSer(){
		//wpmu_signup_blog($domain, $path, $title, $user, $user_email, $meta);
	}
*/	

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getUsernameForBlog($blog_id){
		global $wpdb;		
		$sql = $wpdb->prepare("SELECT u.user_nicename FROM wp_usermeta m INNER JOIN wp_users u WHERE m.meta_key  = 'primary_blog' AND m.meta_value = %d AND u.id = m.user_id", $blog_id);
		return $wpdb->get_var($sql);
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getUserIDForBlog($blog_id){
		global $wpdb;		
		$sql = $wpdb->prepare("SELECT u.user_id FROM wp_usermeta m INNER JOIN wp_users u WHERE m.meta_key  = 'primary_blog' AND m.meta_value = 3 AND u.id = m.user_id", $blog_id);
		return $wpdb->get_var($sql);
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Reset a blog's domain back to its default
	*/
	public static function resetDomain($blog_id, $site_id){

		global $wpdb;		
		
		// Don't allow reset of a default site
		if ($site_id == 1) return;

		// Figure out the default domain name
		$username = self::getUsernameForBlog($blog_id);
		
		$sql = $wpdb->prepare("SELECT domain FROM wp_blogs WHERE blog_id = 1"); 		
		$default_domain = $wpdb->get_var($sql);

		$new_domain = $username . '.' . $default_domain;		
		self::setDomain($blog_id, $new_domain, 1, true);
				
		$sql = $wpdb->prepare("DELETE FROM wp_site WHERE id = %d", $site_id); 		
		$res = $wpdb->query($sql);		

		$sql = $wpdb->prepare("DELETE FROM wp_sitemeta WHERE site_id = %d", $site_id); 		
		$res = $wpdb->query($sql);		
				
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Change the sites domain name, and make all changes to data int the database
	* @param $blog_id
	* @param $new_domain of the form 'http://www.somesite.com, make sure to include the http://
	*/
	public static function setDomain($blog_id, $new_domain, $current_site_id=1, $is_update=false){

		Logger::debug(">>>>> setDomain($blog_id, $new_domain, $current_site_id, $is_update)" );

		global $wpdb;				

		$site_id = $current_site_id;
				
		$old_domain = self::getDomain($blog_id);
		
		$sql = "UPDATE wp_{$blog_id}_options SET option_value = 'http://{$new_domain}/' WHERE option_value LIKE '%{$old_domain}%'"; 		
		$res = $wpdb->query($sql);		

		// TODO: Check this works and make more robust!
		//$stripped_new_domain = substr($new_domain, 5); // Remove the http://
		$stripped_new_domain = $new_domain;
		
		// TODO: Make sure there isn't already an entry in the site table for this domain, as they could do this multiple times
		if ($is_update){
			$sql = $wpdb->prepare("UPDATE wp_site SET domain = %s, path = '/' WHERE id = %d", $stripped_new_domain, $site_id ); 	
			$wpdb->query($sql);	
			Logger::debug("Update: Site ID = $site_id");
		}
		else {
			$sql = $wpdb->prepare("INSERT INTO wp_site (id, domain, path) VALUES ('', %s, '/')", $stripped_new_domain ); 		
			$res = $wpdb->query($sql);	
			$site_id = $wpdb->insert_id;
			Logger::debug("Insert: Site ID = $site_id");
		}
		
		$sql = $wpdb->prepare("UPDATE wp_blogs SET domain = %s, site_id = %d WHERE blog_id = %d", $stripped_new_domain, $site_id, $blog_id ); 		
		$res = $wpdb->query($sql);		

		// TODO: Make sure blog id is the same as user id
		$sql = $wpdb->prepare("UPDATE wp_usermeta SET meta_value = %s WHERE meta_key = 'source_domain' AND user_id = %d", $stripped_new_domain, $blog_id ); 		
		$res = $wpdb->query($sql);		

		// Update all the links for posts
		$sql = $wpdb->prepare("UPDATE wp_%d_posts SET guid = REPLACE (guid, %s, %s)", $blog_id, $old_domain, ($new_domain.'/') ); 		
		$res = $wpdb->query($sql);		

		// Update wp_sitemeta table
		
		$sql = $wpdb->prepare("DELETE FROM wp_sitemeta WHERE meta_key = 'registration' AND site_id = %d;", $site_id); 
		$res = $wpdb->query($sql);		
				
		$sql = $wpdb->prepare("INSERT INTO wp_sitemeta (meta_key, meta_value, site_id) VALUES ('registration','none',%d)", $site_id); 
		$res = $wpdb->query($sql);		

		//$sql = $wpdb->prepare("INSERT INTO wp_sitemeta SET site_name = '' WHERE site_id = %d", $site_id); 		
		//$res = $wpdb->query($sql);		
	
		$upload_file_types = $wpdb->get_var($wpdb->prepare("SELECT meta_value FROM wp_sitemeta WHERE site_id = 1 AND meta_key = 'upload_filetypes'"));		
		$wpdb->query($wpdb->prepare("REPLACE INTO wp_sitemeta (meta_value, meta_key, site_id)  VALUES (%s,'upload_filetypes', %d)", $upload_file_types, $site_id));

		$blog_upload_space = $wpdb->get_var($wpdb->prepare("SELECT meta_value FROM wp_sitemeta WHERE site_id = 1 AND meta_key = 'blog_upload_space'"));		
		$wpdb->query($wpdb->prepare("REPLACE INTO wp_sitemeta (meta_value, meta_key, site_id)  VALUES (%s,'blog_upload_space', %d)", $blog_upload_space, $site_id));

		$fileupload_maxk = $wpdb->get_var($wpdb->prepare("SELECT meta_value FROM wp_sitemeta WHERE site_id = 1 AND meta_key = 'fileupload_maxk'"));		
		$wpdb->query($wpdb->prepare("REPLACE INTO wp_sitemeta (meta_value, meta_key, site_id)  VALUES (%s,'fileupload_maxk', %d)", $fileupload_maxk, $site_id));		
						
	/*
Update all old domains in wp_x_options  table (Site URL, File URL, home - make sure you keep the trailing slash).

UPDATE wp_x_options SET option_value = 'http://newdomain.com' WHERE option_value LIKE '%olddomain.com%'

Update the domain value in wp_site table, add an entry for this site and note the site id (id) as we'll use it in the next step.

INSERT INTO wp_site (id, domain, path) VALUES ('','newdomain.com', '/')

Update the domain value in wp_blogs table, update the domain and site id.

UPDATE wp_blogs SET domain = 'newdomain.com', site_id = 'siteid' WHERE blog_id = X

Update the domain value in wp_site table.

UPDATE wp_site SET source_domain = 'newdomain.com' WHERE user_id = $user_id

Also need to update all file references in posts;

UPDATE wp_x_posts SET guid = REPLACE (guid, 'http://exampleoldsiteurl.com', 'http://examplenewsiteurl.com');

A good reference is http://bui4ever.com/web/wordpress_mu_with_domain_mapping/
And http://codex.wordpress.org/Changing_The_Site_URL
	
	*/
	
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function getRandomParagraph(){
		$test = mt_rand(0,4);
		switch($test){
			case 0: return "<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin pellentesque, est ut venenatis aliquam, lorem quam porttitor ligula, eget ultrices velit dui sed quam. Praesent vehicula placerat lectus. Nulla pede. Quisque a nulla quis massa pulvinar sagittis. Pellentesque neque massa, mattis vulputate, pellentesque nec, vehicula volutpat, purus. Proin pretium dui et nulla cursus eleifend. Aenean aliquam urna eget urna. Vestibulum euismod elit. Donec eget augue sit amet neque elementum pretium. Proin posuere lacus id lacus. Duis vel justo suscipit neque ornare iaculis.</p>";
			case 1: return "<p>Ut urna urna, rhoncus eget, vestibulum tempus, venenatis non, nunc. Nunc consequat quam in nulla. Praesent feugiat posuere orci. Sed ac ante. Mauris pellentesque massa vitae ante mattis bibendum. Quisque dapibus lectus eu eros. Nulla facilisi. Praesent hendrerit egestas erat. Suspendisse at velit. Quisque mollis feugiat est. Curabitur ut leo. Cras auctor semper augue. Pellentesque leo pede, tempus sed, ornare in, venenatis sed, nisl. Quisque est velit, eleifend vitae, mollis ac, adipiscing at, eros. Mauris velit. Etiam nec lorem. Vestibulum pellentesque ligula a velit. Maecenas felis metus, suscipit et, eleifend vel, accumsan vitae, magna. Phasellus ut justo vel magna congue laoreet.</p>";
			case 2: return "<p>Sed vel nisl. Vivamus pretium est non mauris. Fusce condimentum. Proin molestie. Vestibulum est. Morbi at metus. Nam nisl nulla, euismod at, vehicula nec, molestie vitae, enim. Donec euismod nulla a metus. Suspendisse venenatis metus dapibus dolor. Quisque euismod libero a est. Aliquam feugiat.</p>";
			case 3: return "<p>Nam elementum urna vel libero. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque quis sem nec tellus fermentum porttitor. Nulla facilisi. Nam hendrerit dolor sed leo. In tellus risus, feugiat eu, volutpat eu, pharetra eu, ante. Fusce auctor. Fusce sapien. Cras aliquam pretium quam.</p>";
			case 4: return "<p>Nullam egestas. Quisque cursus. Nam sem. Integer urna tortor, convallis eu, sagittis non, consectetuer ut, lorem. Praesent velit. Nam porttitor dui quis erat. Vestibulum ultricies, arcu nec blandit dignissim, quam velit convallis massa, vitae egestas sapien felis eu nulla. Mauris eget arcu convallis nunc mattis venenatis. Ut fermentum quam porttitor velit. Phasellus accumsan. Fusce ante. Integer ullamcorper. Nunc et lacus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aliquam urna. Nunc posuere mattis velit. Nulla dolor lacus, pellentesque at, vehicula eget, tempus at, dui. Vivamus eleifend.</p>";
		}
		return "";
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function createRandomPage($blog_id, $user_id, $page_name, $page_template_name, $page_order, $parent_post_id=0){

		$page_slug = htmlentities($page_name, ENT_QUOTES);
		
		$content = "";
		$content .= "<h2>$page_name</h2><br/>";
		$content .= self::getRandomParagraph() . "<br/>";
		$content .= self::getRandomParagraph() . "<br/>";
		$content .= self::getRandomParagraph() . "<br/>";
		
		// Create post object
		$my_post = array();
		$my_post['post_title'] = $page_name; // Page title
		$my_post['post_author'] = $user_id;
		$my_post['post_name'] = $page_slug; // Page slug (I think)
		$my_post['post_content'] = $content; // Page content
		$my_post['post_status'] = 'publish';
		$my_post['post_author'] = 'page';
		$my_post['menu_order'] = $order;
		$my_post['post_parent'] = $parent_post_id; // 0 is a top level page
		//$my_post['gui'] = 'http://zip.local.com/cgp/?page_id=4'; // Not sure if this needs to be specified
		
		$old_blog_id = self::setCurrentBlog($blog_id);
		
		// Insert the post into the database
		$post_id = wp_insert_post( $my_post );// See more here
		
		update_post_meta($post_id, '_wp_page_template', $page_template_name); // See more here
		
		// Switch back to the previous blog id
		self::setCurrentBlog($old_blog_id);
	}
}

	
?>