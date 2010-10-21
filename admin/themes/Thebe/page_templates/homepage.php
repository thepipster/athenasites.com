<?php
/**
* @Theme: Thebe
* @Template: Home Page
* @Description: Home Page
*/

//$xml_url = "http://" . $_SERVER['HTTP_HOST'] ."/admin/code/php/getUserGalleryXML.php?site_id=".PageManager::$site_id."&page_id=".PageManager::$page_id."&cache=" . mt_rand();
$xml_url = "http://" . $_SERVER['HTTP_HOST'] ."/admin/code/php/getUserGalleryXML.php?p=".PageManager::$site_id.",".PageManager::$page_id."&cache=" . mt_rand();

$gallery_image_list = ClientGalleryTable::getImagesForPage(PageManager::$site_id, PageManager::$page_id);

Session::set('pre_gallery_page_id', PageManager::$page_id);


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

	thebeGallery.preInit();		

</script>

		<div id='content'>	
			<noscript>
			<?php
				foreach($gallery_image_list as $gal_mapping){
				
					$image_id = $gal_mapping['image_id'];
					$image = FolderTable::getMedia(PageManager::$site_id, $image_id);
					
					$image_url = PageManager::$media_root_url . $image['filepath'] . $image['filename'];
					$thumb_url = PageManager::$media_root_url . $image['filepath'] . $image['thumb_filename'];
					$title =  $image['title'];
					$description = $image['description'];										
					$tags = $image['tags'];					
					
					echo "<div id='noFlashImage'>";
					echo "    <img src='$image_url' title='$title' alt='$description, $tags' width='100%'/>";   
					echo "    <span class='title'>$title</span>";
					echo "    <span class='caption'>$description</span>"; 
					echo "</div>";
					echo "<br/>";
					
				}
			?>
			</noscript>
		</div>
		
<script type="text/javascript">

	$(window).ready(function() {
		thebeGallery.init({
			swf:"<?= PageManager::$theme_url_root; ?>/flash/fullScreenGal.swf", 
			xml:"<?= $xml_url?>",
			images: <?= $gal_images_string ?>
			});
	});
		
</script>