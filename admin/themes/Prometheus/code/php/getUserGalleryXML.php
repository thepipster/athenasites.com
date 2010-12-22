<?php
ob_start();

// Figure out the location of this file
$discRoot = realpath(dirname(__FILE__)) . "/";

$codeRoot = substr($discRoot, 0, strpos($discRoot, "php")) . "php/";
$wpRoot = substr($discRoot, 0, strpos($discRoot, "wp-content"));

require_once($codeRoot . 'dal/ClientGalleryTable.class.php');
require_once($wpRoot . 'wp-blog-header.php');

// Get the page post id...
$page_id = getNumericPara('pageid');

error_log("Page ID: $page_id");

// Now get the images for this page....
$images = ClientGalleryTable::getImagesForPage($wpdb, $page_id);

ob_end_clean();


echo "<?xml version='1.0' encoding='UTF-8'?>  
<gallery>  
	<album id='gal1' title='$title' description='$description' lgpath='' tnpath=''>";
	foreach($images as $image){

		$image_id = $image['image_post_id'];
		//$meta = get_post_meta($image_id, '_wp_attachment_image_alt');

		$post = get_post($image_id);

		$image_url = $post->guid;
		$thumb_url = $image['url'];
		$caption = $post->post_excerpt;
		$title = $post->post_title;
		$description = $post->post_content;
		//$alt_text = $meta[0];

		//<img pause='2' src="image1.jpg" title="Title 1" caption="Caption 1"/>   

		echo "<img pause='2' src='$image_url' tn='$thumb_url' title='$title' caption='$caption'/>";   
	}
echo "
	</album> 
</gallery>";


function getNumericPara($paraName){
	
	$val = false;

	if(isset($_GET[$paraName]) && is_numeric($_GET[$paraName])) {
	    $val = $_GET[$paraName];
	}
	else if(isset($_POST[$paraName]) && is_numeric($_POST[$paraName])) {
	    $val = $_POST[$paraName];
	}
	return $val;	
}


?>