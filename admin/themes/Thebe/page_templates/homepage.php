<?php
/**
* @Theme: HollyPacione
* @Template: Home Page
* @Description: Home Page
*/

//$xml_url = "http://" . $_SERVER['HTTP_HOST'] ."/admin/code/php/getUserGalleryXML.php?site_id=".PageManager::$site_id."&page_id=".PageManager::$page_id."&cache=" . mt_rand();
$xml_url = "http://" . $_SERVER['HTTP_HOST'] ."/admin/code/php/getUserGalleryXML.php?p=".PageManager::$site_id.",".PageManager::$page_id."&cache=" . mt_rand();

$gallery_image_list = ClientGalleryTable::getImagesForPage(PageManager::$site_id, PageManager::$page_id);

?>
<script type="text/javascript">

	hollyGallery.preInit();		
	<?php
		if (isset($noflash) && $noflash == 1){
			echo 'hollyGallery.hasFlash = false;';
		}
	?>

</script>

		<div id='content' style='background-color:<?php if (isset($border_color)) echo "#$border_color;"; else echo "black;";?>'>	
			<?php
				foreach($gallery_image_list as $gal_mapping){
				
					$image_id = $gal_mapping['image_id'];
					$image = FolderTable::getMedia(PageManager::$site_id, $image_id);
					
					$image_url = PageManager::$media_root_url . $image['filename'];
					$thumb_url = PageManager::$media_root_url . $image['thumb_filename'];
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
		</div>

<script type="text/javascript">

	hollyGallery.init({
		swf:"<?= PageManager::$theme_url_root; ?>/flash/homeGal.swf", 
		xml:"<?= $xml_url?>",
		width: 1200,
		height: 800,
		loadingSpinner: false
		});
		
</script>