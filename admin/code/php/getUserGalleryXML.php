<?php
//ob_start();

// Load defines and class auto-loader....
include_once(realpath(dirname(__FILE__)) . '/setup.php');

Logger::dump($_GET);

// Get the page post id...
//$page_id = CommandHelper::getPara('page_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
//$site_id = CommandHelper::getPara('site_id', true, CommandHelper::$PARA_TYPE_NUMERIC);

//$paras = $_GET['p']; // WP is cutting off the 2nd para somehow, so merge them
$paras = CommandHelper::getPara('p', true, CommandHelper::$PARA_TYPE_STRING);
//$blogid = getNumericPara('bid');

$bits = explode(",", $paras);
$page_id = $bits[1];
$site_id = $bits[0];


Logger::debug(">>> Site ID = $site_id, Page ID = $page_id");

// Now get the images for this page....
$gal_images = ClientGalleryTable::getImagesForPage($site_id, $page_id);

//error_log(print_r($images, true));

$media_root_url = 'http://' . $_SERVER['HTTP_HOST'] . "/user_files/".$site_id."/";

//ob_end_clean();

$title = 'Test gal';
$description = 'Test gal';

echo "<?xml version='1.0' encoding='UTF-8'?>  
<gallery>  
	<album id='gal1' title='$title' description='$description' lgpath='' tnpath=''>\n";
	foreach($gal_images as $gal_image){

		$image_id = $gal_image['image_id'];

		$image = FolderTable::getMedia($site_id, $image_id);
		
		$image_url = $media_root_url . $image['filename'];
		$thumb_url = $media_root_url . $image['thumb_filename'];
		$title =  $image['title'];
		$description = $image['description'];										
		$tags = $image['tags'];
		
		//error_log(print_r($post, true));

		//<img pause='2' src="image1.jpg" title="Title 1" caption="Caption 1"/>   

		echo "<img pause=\"2\" src=\"$image_url\" tn=\"$thumb_url\" title=\"$title\" caption=\"$description\"/>\n";   
	}
echo "</album> 
</gallery>";
?>