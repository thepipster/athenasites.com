<?php
/**
* @Theme: Thebeh
* @Template: Basic Page
* @Description: Basic Page
*/			

$pre_gallery_page_id = Session::get('pre_gallery_page_id');

if (!isset($pre_gallery_page_id) || $pre_gallery_page_id == 0){
	$pre_gallery_page_id = PagesTable::getHomepageID(PageManager::$site_id);
}

$xml_url = "http://" . $_SERVER['HTTP_HOST'] ."/admin/code/php/getUserGalleryXML.php?p=".PageManager::$site_id.",".$pre_gallery_page_id."&cache=" . mt_rand();


// Get a string representation of a Javascript array to feed to JS xFader (if needed)
$gal_images_string = "[";
$ct = 0;
foreach($gallery_image_list as $gal_mapping){

	if ($ct != 0){
		$gal_images_string .= ", ";
	}

	$image_id = $gal_mapping['image_id'];
	$image = FolderTable::getMedia(PageManager::$site_id, $image_id);	
	
	$image_url = "'" . PageManager::$media_root_url . $image['filepath'] . $image['filename'] . "'";

	$gal_images_string .= $image_url;
	
	$ct++;
}
$gal_images_string .= "]";

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
					<h2><?php echo PageManager::getPageTitle(); ?></h2>
					
					<span class='divider'></span>
									
					<div class='popupText' align="left">
						<?php echo PageManager::getCurrentPageContent(); ?>
					</div>
				</div>
				
			</div>			
			
		</div>
	</div>
</div>

<div id='content'>
</div><!-- content -->


<!--
<div id="popupPageWrapper">

<div id='popupPage'>
	
	<div align="left" class='popupContent'>
	
		<div align="center" style='padding-top:20px'>
		<h2><?php echo PageManager::getPageTitle(); ?></h2>
		
		<span class='divider'></span>
						
		<div class='popupText' align="left">
			<?php echo PageManager::getCurrentPageContent(); ?>
		</div>
		</div>
		
	</div>
	
</div>
</div>
-->

<script type="text/javascript">

/*				
	// moved to footer
	$(window).resize(function() {
		
		if (!$.browser.msie){
			$('.scrollWrapper').jScrollPane();
		}
		
	});
*/
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