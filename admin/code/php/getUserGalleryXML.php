<?php
ob_start();

// Load defines and class auto-loader....
include_once(realpath(dirname(__FILE__)) . '/setup.php');


// Get the page post id...
$paras = $_GET['p']; // WP is cutting off the 2nd para somehow, so merge them
//$site_id = getNumericPara('bid');


$page_id = CommandHelper::getPara('page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
$site_id = CommandHelper::getPara('site_id', true, CommandHelper::$PARA_TYPE_NUMERIC);


// Now get the images for this page....
$images = ClientGalleryTable::getImagesForPage($site_id, $page_id);

//error_log(print_r($images, true));

ob_end_clean();


echo "<?xml version='1.0' encoding='UTF-8'?>  
<gallery>  
	<album id='gal1' title='$title' description='$description' lgpath='' tnpath=''>\n";
	foreach($images as $image){

		$image_id = $image['image_post_id'];
		//$meta = get_post_meta($image_id, '_wp_attachment_image_alt');

		//$post = get_post($image_id);
		$post = ClientGalleryTable::getImagePostData($site_id, $image_id);

		//$image_url = $post->guid;
		//$thumb_url = $image['url'];
		//$caption = $post->post_excerpt;
		//$title = $post->post_title;
		//$description = $post->post_content;

		//$image_url = $post['guid'];
		$image_url = WordPressHelper::getRealImageURL($image_id, $site_id);
		
		//$thumb_url = $image['url'];
		//$thumb_url = wp_get_attachment_thumb_url($image_id);		
		$thumb_url = WordPressHelper::getRealThumbURL($image_id, $site_id);
		
		if (!isset($thumb_url) || $thumb_url == ''){
			WordPressHelper::regenerateThumbnail($image_id, $blog_id, $blog_downloads_root);	
		}
		$caption = htmlentities($post['post_excerpt'], ENT_COMPAT);
		$title = htmlentities($post['post_title'], ENT_COMPAT);
		$description = htmlentities($post['post_content'], ENT_COMPAT);
		
		//error_log(print_r($post, true));

		//<img pause='2' src="image1.jpg" title="Title 1" caption="Caption 1"/>   

		echo "<img pause='2' src='$image_url' tn='$thumb_url' title=\"$title\" caption=\"$caption\"/>\n";   
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