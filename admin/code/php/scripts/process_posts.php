<?php

require_once("../setup.php");

Logger::echoLog();

$site_id = 5;

$post_list = PostsTable::getPosts($site_id);

foreach($post_list as $post){

    $content = stripslashes($post['content']);
            
    Logger::debug("Processing post " . $post['id'] . " source = " . $post['source']);
           
    // Do a one time conversion, if required
    if ($post['source'] != 'apollo'){
        $content = ImportHelper::convertContent($content, $post['source']);
		PostsTable::updateSourceAndContent($site_id, $post['id'], $content, 'apollo');
    }

    $result = preg_match("/<div class='apolloPageBreak'>(.*?)<\/div>/i", $content, $match);

    if ($result) {

        if (isset($match) && isset($match[1])) {
            $more_text = $match[1];
        }

        $tag = "<div class='apolloPageBreak'>$more_text</div>";
        $post_link = self::getPostLink($post);
        $link_tag .= "<p><a href='$post_link' class='apolloPageBreak'>$more_text</a></p>";

        $s_pos = strpos($content, $tag);

        $excerpt = substr($content, 0, $s_pos) . $link_tag;
        
        PostsTable::updateExcerpt($site_id, $post['id'], $excerpt);
    } 
    //else {
    //	$excerpt = $content;
    //}
	
	
	//$processed_full_content = preg_replace("/<div class='apolloPageBreak'>(.*?)<\/div>/i", "", $content);
        
}
?>