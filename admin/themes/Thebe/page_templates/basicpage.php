<?php
/**
* @Theme: Thebeh
* @Template: Basic Page
* @Description: Basic Page
*/			

$pre_gallery_page_id = Session::get('pre_gallery_page_id');

if (isset($pre_gallery_page_id)){
	$xml_url = "http://" . $_SERVER['HTTP_HOST'] ."/admin/code/php/getUserGalleryXML.php?p=".PageManager::$site_id.",".$pre_gallery_page_id."&cache=" . mt_rand();
}

?>

<script type="text/javascript">

	<?php if (isset($pre_gallery_page_id)){ ?>
		thebeGallery.preInit();				
	<?php } ?>

</script>

<div id='content'>
</div><!-- content -->

<div id='popupPage'>
	
	<div align="center" class='popupContent'>
	
		<h2><?php echo PageManager::getPageTitle(); ?></h2>
		
		<span class='divider'></span>
						
		<div class='popupText vertical-only' align="left">
			<?php echo PageManager::getCurrentPageContent(); ?>
		</div>
		
	</div>
	
</div>

<script type="text/javascript">

	$('.popupContent').jScrollPane();

	<?php if (isset($pre_gallery_page_id)){ ?>

	thebeGallery.init({
		swf:"<?= PageManager::$theme_url_root; ?>/flash/fullScreenGal.swf", 
		xml:"<?= $xml_url?>",
		loadingSpinner: false
		});
		
	<?php } ?>
		
</script>