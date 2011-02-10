<?php

require_once("../setup.php");

Logger::echoLog();

$site_id = 4;

$post_list = PostsTable::getPosts($site_id);

foreach($post_list as $post){

	$postObj = new Post($post);
	
    Logger::debug("Processing post " . $postObj->getID() . " slug = " . $postObj->getSlug());

	$newSlug = Post::encodeSlug($postObj->getTitle());
	
	PostsTable::updateSlug($postObj->getID(), $site_id, $newSlug);           
    PostsTable::updatePath($postObj->getID(), $site_id, Post::generatePath($postObj->getDateCreated()));

    Logger::debug("       new slug = " . $newSlug);
}
?>
