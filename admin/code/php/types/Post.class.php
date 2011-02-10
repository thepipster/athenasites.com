<?php
/**
* Class to encapsulate data on a post
*
* @since 9th February, 2011
* @author Mike Pritchard
*/
class Post {

	public $id;
	public $authorID;
	
	public $title = '';
	public $content = '';
	public $excerpt = '';
	
	public $status = '';
	public $dateLastEdit;
	public $dateCreated;
	public $slug = '';
	public $path = '';
	public $source;
	public $sourceID;
	public $canComment = 0;
	
	public $postLink;
	
	/** The blog URL, <path>/<blog slug> e.g. '/info-pages/blog/' */
	public static $blog_url = '';
	
	/** The blog base URL (slug), e.g. 'blog/' */
	public static $blog_base_url = '';
	
	// /////////////////////////////////////////////////////////////////////////////////

	/**
	* Class constructor. You can optionally construct using an associative array take from a DB query
	*/
	function __construct($post = ''){
		if ($post != ''){
			$this->fromArray($post);
		}
	}
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	public function get($site_id, $post_id){	
		$this->fromDB(PostsTable::getPost($site_id, $post_id));
	}
	
	// /////////////////////////////////////////////////////////////////////////////////

	/**
	* Populate from an associative array of data (e.g, when getting from the DB)
	*/
	public function fromArray($post){

		$this->id = $post['id'];
		$this->authorID = $post['user_id'];
		$this->content = $post['content'];
		$this->excerpt = $post['excerpt'];
		$this->status = $post['status'];
		$this->dateLastEdit = $post['last_edit'];
		$this->dateCreated = $post['created'];
		$this->title = $post['title'];
		$this->slug = $post['slug'];
		$this->path = $post['path'];
		$this->source = $post['source'];
		$this->sourceID = $post['source_id'];
		$this->canComment = $post['canComment'];

		//$this->postLink = "http://" . $_SERVER['HTTP_HOST'] . "/". self::$blog_base_url . $post['path'] . $post['slug'];

	}	
	/*
	public static function getSlug(){
	
        // Strip any new lines, just in case
        $tags = array("\\n", "\\r");
        $replace = '';
        $safe_slug = str_ireplace($tags, $replace, $slug);

        // Replace space with dashes
        $tags = array(" ");
        $replace = '-';
        $safe_slug = str_ireplace($tags, $replace, $safe_slug);

        // Strip any special characters
        $tags = array('!', '*', "'", "(", ")", ";", ":", "@", "&", "=", "+", "$", ",", "/", "?", "%", "#", "[", "]");
        //$entities = array('%21', '%2A', '%27', '%28', '%29', '%3B', '%3A', '%40', '%26', '%3D', '%2B', '%24', '%2C', '%2F', '%3F', '%25', '%23', '%5B', '%5D');
        $replace = '';
        $safe_slug = str_replace($tags, $replace, $safe_slug);

        // Encode anyting thats left
        $safe_slug = urlencode($safe_slug);

        // Add html extension
        if ($extension != '') {
            $safe_slug = $safe_slug . $extension;
        }

        $safe_slug = strtolower($safe_slug);

        return $safe_slug;

	}
	*/
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	function getPermalink(){
		/*
		if (self::$blog_url == ''){
			global $site_id;
			Logger::debug("Blog base url not set! Site id = " . $site_id);
	        $blogPage = PagesTable::getBlogpage($site_id);
        	self::$blog_url = $blogPage['path'] . $blogPage['slug'];
	        self::$blog_base_url = $blogPage['slug'];			
		}
		*/
		return "http://" . $_SERVER['HTTP_HOST'] . "/". PageManager::$blog_base_url . $this->getPath() . $this->getSlug();
	}
	
	
	// /////////////////////////////////////////////////////////////////////////////////

	public function getID(){ return $this->id; }
	public function getTitle(){ return $this->title; }
	public function getContent(){ return $this->content; }	
	public function getExcerpt(){ return $this->excerpt; }	
	public function getStatus(){ return $this->status; }	
	public function getSlug(){ return $this->slug; }	
	public function getPath(){ return $this->path; }	
	public function getSource(){ return $this->source; }	
	public function getSourceID(){ return $this->sourceID; }	
	public function getDateCreated(){ return $this->dateCreated; }	
	public function getDateLastEdit(){ return $this->dateLastEdit; }	
	
	public function getDescription(){ 
		if ($this->excerpt == '') {
			return $this->content;
		}
		else {
			return $this->excerpt;
		}
	}

    // ////////////////////////////////////////////////////////////////////

	public static function generatePath($created){
	
	    $day = date("d", strtotime($created));
	    $month = date("m", strtotime($created));
	    $year = date("Y", strtotime($created));

	    $path = "/$year/$month/$day/";
	    
	    return $path;
	    
	}
	
    // ////////////////////////////////////////////////////////////////////

	public static function encodeSlug($title){
		return StringUtils::encodeSlug($title, '');
	}	
	
    // ////////////////////////////////////////////////////////////////////

	public static function decodeTag($slug){
        // Replace dashes with spaces
        $tags = array("-");
        $replace = " ";
        return str_ireplace($tags, $replace, $slug);		
	}
	
    // ////////////////////////////////////////////////////////////////////

    public static function encodeTag($slug) {

        // Strip any new lines, just in case
        $tags = array("\\n", "\\r");
        $replace = '';
        $safe_slug = str_ireplace($tags, $replace, $slug);

        // Replace space with dashes
        $tags = array(" ");
        $replace = '-';
        $safe_slug = str_ireplace($tags, $replace, $safe_slug);

        // Strip any special characters
        $tags = array('!', '*', "'", "(", ")", ";", ":", "@", "&", "=", "+", "$", ".", ",", "/", "?", "%", "#", "[", "]");
        //$entities = array('%21', '%2A', '%27', '%28', '%29', '%3B', '%3A', '%40', '%26', '%3D', '%2B', '%24', '%2C', '%2F', '%3F', '%25', '%23', '%5B', '%5D');
        $replace = '';
        $safe_slug = str_ireplace($tags, $replace, $safe_slug);

        // Encode anyting thats left
        $safe_slug = urlencode($safe_slug);

        return $safe_slug;
    }
    		
	// /////////////////////////////////////////////////////////////////////////////////
	//
	// Methods to get links to add this post to various social networks
	//
	// /////////////////////////////////////////////////////////////////////////////////	

	function like_facebook()
	{	
		return '<script src="http://connect.facebook.net/en_US/all.js#xfbml=1"></script><fb:like show_faces="true" width="450"></fb:like>';
	}
	
	function add_to_twitter(){
	
		$link = $this->getPermalink();
		
		return "<a href='http://twitter.com/home/?status=Currently reading:$link' target='_blank' title='Twitter'>
					<img alt='Twitter' border='0' height='16' src='/admin/images/SocialNetworksFavIcons/twitter.png' width='16'/>
				</a> 
				<a href='http://twitter.com/home/?status=Currently reading:$link' target='_blank' title='Twitter'>Twitter</a>";
	}
	
	function search_technorati() {
	
		$link = $this->getPermalink();
		
		return "<a href='http://technorati.com/cosmos/search.html?url=$link' target='_blank' title='Technorati'>
					<img alt='Technorati' border='0' height='16' src='/admin/images/SocialNetworksFavIcons/technorati.png' width='14'/>
				</a>							
				<a href='http://technorati.com/cosmos/search.html?url=$link' target='_blank' title='Technorati'>Technorati</a>";				
	}
	
	function add_to_delicious()
	{

		$link = $this->getPermalink();
		$title = $this->getTitle();
	
		return "<a href='http://del.icio.us/post?url=$link&title=$title' target='_blank' title='Del.icio.us'>
					<img alt='Del.icio.us' border='0' height='16' src='/admin/images/SocialNetworksFavIcons/delicious.png' width='16'/>
				</a> 
				<a href='http://del.icio.us/post?url=$link&title=$title' target='_blank' title='Del.icio.us'>Del.icio.us</a>";
	}
	
	function add_to_stumble_upon(){
	
		$link = $this->getPermalink();
		$title = $this->getTitle();

		return "<a href='http://www.stumbleupon.com/submit?url=$link&title=$title' target='_blank' title='StumbleUpon'>
					<img alt='StumbleUpon' border='0' height='16' src='/admin/images/SocialNetworksFavIcons/stumble_upon.png' width='16'/>
				</a> 
				<a href='http://www.stumbleupon.com/submit?url=$link&title=$title' target='_blank' title='StumbleUpon'>StumbleUpon</a>";
	}
	
	function add_to_facebook(){

		$link = $this->getPermalink();

		return "<a href='http://www.facebook.com/share.php?u=$link' target='_blank' title='Facebook'>
					<img alt='Facebook' border='0' height='16' src='/admin/images/SocialNetworksFavIcons/facebook.png' width='14'/>
				</a> 
				<a href='http://www.facebook.com/share.php?u=$link' target='_blank' title='Facebook'>Facebook</a>";
	}
	
	function add_to_digg(){
	
		$link = $this->getPermalink();
		$title = $this->getTitle();
	
		return "<a href='http://www.digg.com/submit?url=$link&title=$title&phase=2' target='_blank' title='Digg'>
					<img alt='Digg' border='0' height='14' src='/admin/images/SocialNetworksFavIcons/digg.png' width='16'/>
				</a> 							
				<a href='http://www.digg.com/submit?url=$link&title=$title&phase=2' target='_blank' title='Digg'>Digg</a>";
	}
	
	
	/**
	 * Creates the add_to_* methods' return data
	 *
	 * @access private
	 * @param string $item_url String to prefix to the item permalink
	 * @param string $title_url String to prefix to the item title
	 * (and suffix to the item permalink)
	 * @return mixed URL if feed exists, false otherwise
	 */
	 /*
	private function add_to_service($item_url, $title_url = null, $summary_url = null)
	{
		if ($this->getPermalink() !== null)
		{
			$return = $item_url . rawurlencode($this->getPermalink());
			if ($title_url !== null && $this->getTitle() !== null)
			{
				$return .= $title_url . rawurlencode($this->getTitle());
			}
			if ($summary_url !== null && $this->getDescription() !== null)
			{
				$return .= $summary_url . rawurlencode($this->getDescription());
			}
			return StringUtils::makeHtmlSafe($return);
		}
		else
		{
			return null;
		}
	}
		
	function add_to_blinklist()
	{
		return $this->add_to_service('http://www.blinklist.com/index.php?Action=Blink/addblink.php&Description=&Url=', '&Title=');
	}

	function add_to_blogmarks()
	{
		return $this->add_to_service('http://blogmarks.net/my/new.php?mini=1&simple=1&url=', '&title=');
	}

	function add_to_furl()
	{
		return $this->add_to_service('http://www.furl.net/storeIt.jsp?u=', '&t=');
	}

	function add_to_magnolia()
	{
		return $this->add_to_service('http://ma.gnolia.com/bookmarklet/add?url=', '&title=');
	}

	function add_to_myweb20()
	{
		return $this->add_to_service('http://myweb2.search.yahoo.com/myresults/bookmarklet?u=', '&t=');
	}

	function add_to_newsvine()
	{
		return $this->add_to_service('http://www.newsvine.com/_wine/save?u=', '&h=');
	}

	function add_to_reddit()
	{
		return $this->add_to_service('http://reddit.com/submit?url=', '&title=');
	}

	function add_to_segnalo()
	{
		return $this->add_to_service('http://segnalo.com/post.html.php?url=', '&title=');
	}

	function add_to_simpy()
	{
		return $this->add_to_service('http://www.simpy.com/simpy/LinkAdd.do?href=', '&title=');
	}

	function add_to_spurl()
	{
		return $this->add_to_service('http://www.spurl.net/spurl.php?v=3&url=', '&title=');
	}

	function add_to_wists()
	{
		return $this->add_to_service('http://wists.com/r.php?c=&r=', '&title=');
	}
*/
	
}
?>