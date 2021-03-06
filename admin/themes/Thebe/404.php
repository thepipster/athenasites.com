<?php
/**
 * @package WordPress
 * @subpackage Default_Theme
 */

$pre_gallery_page_id = PagesTable::getHomepageID(PageManager::$site_id);
$gallery_image_list = ClientGalleryTable::getImagesForPage(PageManager::$site_id, $pre_gallery_page_id);
$xml_url = "http://" . $_SERVER['HTTP_HOST'] ."/admin/code/php/getUserGalleryXML.php?p=".PageManager::$site_id.",".$pre_gallery_page_id."&cache=" . mt_rand();


// Get a string representation of a Javascript array to feed to JS xFader (if needed)
$gal_images_string = "[";
$ct = 0;
foreach($gallery_image_list as $gal_mapping){

	if ($ct != 0){
		$gal_images_string .= ", ";
	}

	$image_id = $gal_mapping['image_id'];
	$image = MediaTable::getMedia(PageManager::$site_id, $image_id);	
	
	$image_url = "'" . PageManager::$media_root_url . $image['filepath'] . $image['filename'] . "'";

	$gal_images_string .= $image_url;
	
	$ct++;
}
$gal_images_string .= "]";

Logger::debug("404 PAGE!!!");

?>

<script type="text/javascript">

	<?php if (isset($pre_gallery_page_id)){ ?>
		thebeGallery.preInit();				
	<?php } ?>

</script>


<div  id='popupPage' class='curvedOuterWrapper'>
	<div class='curvedWrapper'>
		<div class="curved" align="center" >
		
			<div class='scrollWrapper' align="left">
			
				<div class='popupContent' align="center">
					<h2>Error 404 - Page Not Found</h2>
					
					<span class='divider'></span>
									
					<div class='popupText' align="center">
	                    <p>Sorry, the page you were looking for can't be found on this server</p>
					</div>
				</div>
				
			</div>			
			
		</div>
	</div>
</div>

<div id='content'>
</div><!-- content -->


<script type="text/javascript">

	$(window).ready(function() {
	
		<?php if (isset($pre_gallery_page_id)){ ?>
	
		thebeGallery.init({
			swf:"<?= PageManager::$theme_url_root; ?>/flash/fullScreenGal.swf", 
			xml:"<?= $xml_url?>",
			images: <?= $gal_images_string ?>
			});

			
		<?php } ?>
	
		$('.scrollWrapper').jScrollPane();
		// Chrome was stuborn, so wait and try later...
		setTimeout("$('.scrollWrapper').jScrollPane()", 200)
	});
		
</script>