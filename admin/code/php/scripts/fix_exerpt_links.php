<?php

require_once("../setup.php");

Logger::echoLog();

$site_id = 4;

$blogPage = PagesTable::getBlogpage($site_id);


$post_list = PostsTable::getPosts($site_id);

foreach($post_list as $post){

    $content = stripslashes($post['excerpt']);
                
    //Logger::debug("Processing post " . $post['id'] . " source = " . $post['source']);
           
    // <a href='/blog/2010/12/14/selecting-photos-for-your-wedding-album' class="apolloPageBreak">More information and example pictures</a>       
//    $result = preg_match("/<a href='(.*?)' class='apolloPageBreak'>(.*?)<\/a>/i", $content, $match);
    $result = preg_match("/<a href=(.*?) class=\"apolloPageBreak\">(.*?)<\/a>/i", $content, $match);

    if ($result) {
    	
    	//Logger::dump($match);
    	$original_tag = "<a href=".$match[1]." class=\"apolloPageBreak\">".$match[2]."</a>";    	
        $s_pos = strpos($content, $original_tag);
        $e_pos = strpos($content, "</a>", $s_pos) + 4;
        
        //Logger::debug("Position = $s_pos to $e_pos Tag = $original_tag");
    	
    	if ($s_pos > 0 && $e_pos > 0){
    	
	    	$link = "/" . $blogPage['slug'] . Post::generatePath($post['created']) . Post::encodeSlug($post['title']);    	    	
	    	$new_link = "<a href=\"$link\" class=\"apolloPageBreak\">".$match[2]."</a>";
	    	
	    	Logger::debug("New link = $new_link");
	    	
	    	$new_content = substr($content, 0, $s_pos) . $new_link . substr($content, $e_pos);
	    	
	    	PostsTable::updateExcerpt($site_id, $post['id'], $new_content);
    	}

    } 
	//$processed_full_content = preg_replace("/<div class='apolloPageBreak'>(.*?)<\/div>/i", "", $content);
        
}
?>
