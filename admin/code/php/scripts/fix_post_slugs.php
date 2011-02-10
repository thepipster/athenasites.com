<?php

require_once("../setup.php");

Logger::echoLog();

$site_id = 4;

$post_list = PostsTable::getPosts($site_id);

foreach($post_list as $post){

	$postObj = new Post($post);
	
    Logger::debug("Processing post " . $postObj->getID() . " slug = " . $postObj->getSlug());

	$newSlug = StringUtils::encodeSlug($postObj->getTitle(), '');
	
	PostsTable::updateSlug($postObj->getID(), $site_id, $newSlug);           

    Logger::debug("       new slug = " . $newSlug);
}
?>
