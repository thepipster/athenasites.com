<?php
/**
* @Theme: CGP4
* @Template: Text & Image Page
* @Description: Text & Image Page
*/	

$image = PageManager::getMediaFromThemePara(304); 

if (!isset($image) || $image == ""){
	$image_url = PageManager::$common_url_root . 'imgs/blank.png';
	$image_title = "";
	$image_alt = "";
}
else {
	$image_url = PageManager::$media_root_url . $image['filepath'] . $image['filename'];
	//$thumb_url = PageManager::$media_root_url . $image['filepath'] . $image['thumb_filename'];
	$image_title =  $image['title'];
	//$description = $image['description'];										
	$image_alt = $image['tags'];
}

$img_width = $image['width'];
$img_height = $image['height'];

if ($img_width > 500) $img_width = 500;
if ($img_height > 500) $img_height = 500;

?>

<!-- INFO PAGE /////////////////////////// -->

<div class='pageContents'>

	<div id='miniGallerWrapper' style="background-color:transparent; float:right; width:<?=$img_width?>px; height:<?=$img_height?>px; padding-right:35px; padding-left: 35px; padding-bottom:25px; padding-top: 0px; ">
		<div id='miniGallery'>
			<?php echo "<img src='$image_url' title='$image_title' alt='$image_alt' width='95%'/>"; ?>
		</div>
	</div>
	
	<?php echo PageManager::getCurrentPageContent(); ?>
		
</div><!-- infoPage -->