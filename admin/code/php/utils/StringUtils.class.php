<?php

class StringUtils {

    // ////////////////////////////////////////////////////////////////////

	public static function stripQuotes($content, $replace = "'"){
        $tags = array("\"");
        return str_ireplace($tags, $replace, $content);
	}
	
    // ////////////////////////////////////////////////////////////////////

	/**
	* Remove 'http://' and www from domains
	*/
	public static function sanitizeDomain($domain){
	
		Logger::debug($domain);
		
		$new_domain = $domain;
		
		// Remove 'http://' if it is included
		if (stripos($new_domain, 'http://') !== false){
			$new_domain = substr($new_domain, strlen('http://'));	
		}

		// Remove 'https://' if it is included
		if (stripos($new_domain, 'https://') !== false){
			$new_domain = substr($new_domain, strlen('https://'));	
		}
	
		// Remove any www		
		if (stripos($new_domain, 'www.') !== false){
			$new_domain = substr($new_domain, strlen('www.'));	
		}

		Logger::debug($new_domain);
		
		return $new_domain;
	}
	
    // ////////////////////////////////////////////////////////////////////

    /**
     * Make basic text safe, strip out anything that isn't (e.g. for tags and categories)
     */
    public static function makeTextSafe($content) {

        $tags = array("\\n", "\\r", "\\'", "\"");
        $replace = '';
        $safe_content = str_ireplace($tags, $replace, $content);
        $safe_content = stripslashes(stripslashes($safe_content));

        // Remove all remaining slashes
        $tags = array("\\");
        $safe_content = str_ireplace($tags, $replace, $safe_content);

        // Remove all remaining quotes
        $tags = array("\'", "\"");
        $safe_content = str_ireplace($tags, $replace, $safe_content);

        //Logger::debug(">>> content = $content");
        //Logger::debug(">>> safe content = $safe_content");

        return utf8_encode($safe_content);
    }

    // ////////////////////////////////////////////////////////////////////

    /**
     * Make content that is supposed to be HTML safe (for posts and pages for example)
     */
    public static function makeHtmlSafe($content) {

		// HTML Purifier 
		require_once("../../3rdparty/htmlpurifier-4.2.0-standalone/HTMLPurifier.standalone.php");

        $tags = array("\\r\\n");
        $replace = '';
        $safe_content = str_ireplace($tags, $replace, $content);

        $tags = array("\\n", "\\r");
        //$replace = '<br/>';
        $safe_content = str_ireplace($tags, $replace, $safe_content);

        $safe_content = stripslashes($safe_content);

		// Use HTML Purifier for a final check to strip nasty stuff out....		
	    //$pureConfig = HTMLPurifier_Config::createDefault();
	    //$pureConfig->set('HTML.Doctype', 'XHTML 1.0 Strict');
	    //$pureConfig->set('Core.DefinitionCache', null); // Disabled because it'll write files for caching
	    
		$config = HTMLPurifier_Config::createDefault();
		$config->set('Core.Encoding', 'ISO-8859-1'); // replace with your encoding
	    $config->set('Cache.DefinitionImpl', null);
		$config->set('HTML.Doctype', 'HTML 4.01 Transitional'); // replace with your doctype

		$purifier = new HTMLPurifier($config);
		
	    $clean_html = $purifier->purify($safe_content);
	    
	    return utf8_encode($clean_html);
    }

    // ////////////////////////////////////////////////////////////////////

	public static function decodeSlug($slug){
        // Replace dashes with spaces
        $tags = array("-");
        $replace = " ";
        return str_ireplace($tags, $replace, $slug);		
	}
	
    // ////////////////////////////////////////////////////////////////////

    public static function encodeSlug($slug, $extenstion='.html') {

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

        // Add html extension
        if ($extenstion != '') {
            $safe_slug = $safe_slug . $extenstion;
        }

        $safe_slug = strtolower($safe_slug);

        return $safe_slug;
    }

}

?>