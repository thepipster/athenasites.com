<?php
/**
* @Theme: CGP4
* @Template: Image List Page
* @Description: A page the simply lists a bunch of images
*/

$gallery_image_list = ClientGalleryTable::getImagesForPage(PageManager::$site_id, PageManager::$page_id);

?>

<div class='pageContents'>

	<?php echo PageManager::getCurrentPageContent(); ?>
				
	<p align="left">


		<?php
			foreach($gallery_image_list as $gal_mapping){
			
				$image_id = $gal_mapping['image_id'];
				$image = MediaTable::getMedia(PageManager::$site_id, $image_id);
				
				$image_url = PageManager::$media_root_url . $image['filepath'] . $image['filename'];
				$thumb_url = PageManager::$media_root_url . $image['filepath'] . $image['thumb_filename'];
				$title =  $image['title'];
				$description = $image['description'];										
				$tags = $image['tags'];
									
				echo "<div id='noFlashImage'>";
				echo "    <img src='$image_url' title='$title' alt='$alt_text' width='100%'/>";   
				echo "    <span class='title'>$title</span>";
				echo "    <span class='caption'>$caption</span>"; 
				echo "</div>";
				echo "<br/>";
				
			}
		?>
					
	</p>

	<br />							

	<p>
		Photos by <a href="http://www.charlottegeary.com">Charlotte Geary Photography</a> in Colorado Springs, Colorado<br>
		Return to <a href="index.html">Wedding Venues</a>
	</p>
		
</div>		