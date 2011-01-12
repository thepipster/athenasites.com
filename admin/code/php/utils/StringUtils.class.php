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

        Logger::debug(">>> content = $content");
        Logger::debug(">>> safe content = $safe_content");

        return $safe_content;
    }

    // ////////////////////////////////////////////////////////////////////

    /**
     * Make content that is supposed to be HTML safe (for posts and pages for example)
     */
    public static function makeHtmlSafe($content) {

        $tags = array("\\r\\n");
        $replace = '<br/>';
        $safe_content = str_ireplace($tags, $replace, $content);

        $tags = array("\\n", "\\r");
        $replace = '<br/>';
        $safe_content = str_ireplace($tags, $replace, $safe_content);

        $safe_content = stripslashes($safe_content);


        //$safe_content = htmlspecialchars($safe_content, ENT_QUOTES);
        //$safe_content = nl2br($content);
        //Logger::debug(">>> content = $content");
        //Logger::debug(">>> safe content = $safe_content");

        return $safe_content;
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
        $tags = array('!', '*', "'", "(", ")", ";", ":", "@", "&", "=", "+", "$", ",", "/", "?", "%", "#", "[", "]");
        //$entities = array('%21', '%2A', '%27', '%28', '%29', '%3B', '%3A', '%40', '%26', '%3D', '%2B', '%24', '%2C', '%2F', '%3F', '%25', '%23', '%5B', '%5D');
        $replace = '';
        $safe_slug = str_replace($tags, $replace, $safe_slug);

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