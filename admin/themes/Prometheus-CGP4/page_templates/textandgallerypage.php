<?php
/**
* @Theme: CGP4
* @Template: Text & Gallery Page
* @Description: Text & Gallery Page
*/	

$xml_url = "http://" . $_SERVER['HTTP_HOST'] ."/admin/code/php/getUserGalleryXML.php?p=".PageManager::$site_id.",".PageManager::$page_id."&cache=" . mt_rand();
$gallery_image_list = ClientGalleryTable::getImagesForPage(PageManager::$site_id, PageManager::$page_id);

?>

<!-- INFO PAGE /////////////////////////// -->

<div class='pageContents'>

	<div id='miniGallerWrapper' style="background-color:transparent; float:right; width:500px; height:500px; padding-right:35px; padding-left: 35px; padding-bottom:25px; padding-top: 0px; ">
		<div id='miniGallery'>
			<noscript>
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
			</noscript>
		</div>
	</div>
	
	<?php echo PageManager::getCurrentPageContent(); ?>



<!--

	<table width="100%" height="100%" border="0" style='width:100%; height:100%;'>
		<tr height="100%">
			<td width="50%" height="100%" valign="top">
				<div class='infoPageText'>
					<?php echo PageManager::getCurrentPageContent(); ?>
				</div>
			</td>
			<td valign="top" height="100%" style='height: 100%;'>
				<div id='miniGallery' style="width:95%; height: 100%; background-color:transparent">

				</div>
			</td>
		</tr>
	</table>
-->
		
</div><!-- infoPage -->
						
		
<script type="text/javascript">

$('#miniGallery').html('');

var imgList = new Array();
var altTxtList = new Array();

<?php

if (isset($gallery_image_list) && count($gallery_image_list) > 0){

	foreach($gallery_image_list as $gal_mapping){
	
		$image_id = $gal_mapping['image_id'];
		$image = MediaTable::getMedia(PageManager::$site_id, $image_id);
		
		$image_url = PageManager::$media_root_url . $image['filepath'] . $image['filename'];
		//$thumb_url = PageManager::$media_root_url . $image['filepath'] . $image['thumb_filename'];
		//$title =  $image['title'];
		//$description = $image['description'];										
		$alt_text = $image['tags'];
		
		echo "imgList.push(\"$image_url\");";	
		echo "altTxtList.push(\"$alt_text\");";	
										
	}
}
?>

//apolloXfader.start('#miniGallery', {images:imgList, altText: altTxtList});

$(document).ready(function(){
	apolloXfader.start('#miniGallery', {images:imgList, altText: altTxtList});
});

</script>						