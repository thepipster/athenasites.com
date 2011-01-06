<?php
/**
* @Theme: CGP4
* @Template: Text & Gallery Page
* @Description: Text & Gallery Page
*/	

$xml_url = "http://" . $_SERVER['HTTP_HOST'] ."/admin/code/php/getUserGalleryXML.php?p=".PageManager::$site_id.",".PageManager::$page_id."&cache=" . mt_rand();
$gallery_image_list = ClientGalleryTable::getImagesForPage(PageManager::$site_id, PageManager::$page_id);

$image_list = array();
foreach($gallery_image_list as $gal_mapping){

	$image_id = $gal_mapping['image_id'];
	$image = MediaTable::getMedia(PageManager::$site_id, $image_id);
		
	$image_list[] = array(
		'id' => $image_id,
		'image_url' => PageManager::$media_root_url . $image['filepath'] . $image['filename'],
		'thumb_url' => PageManager::$media_root_url . $image['filepath'] . $image['thumb_filename'],
		'title' => $image['title'],
		'description' => $image['description'],
		'alt_text' => $image['tags'],
		'width' => $image['width'],
		'height' => $image['height']
	);
		
}

// Get max image height and width
$max_height = 0;
$max_width = 0;

foreach($image_list as $image){
	if ($image['height'] > $max_height) $max_height = $image['height'];
	if ($image['width'] > $max_width) $max_width = $image['width'];
}

if ($max_width > 500) $max_width = 500;
if ($max_height > 500) $max_height = 500;


?>

<!-- INFO PAGE /////////////////////////// -->

<div class='pageContents'>

	<div id='miniGallerWrapper' style="background-color:transparent; float:right; width:<?=$max_width?>px; height:<?=$max_height?>px; padding-right:35px; padding-left: 35px; padding-bottom:25px; padding-top: 0px; ">
		<div id='miniGallery'>
			<noscript>
			<?php
				foreach($image_list as $image){
				
					$image_url = $image['image_url'];
					$alt_text = $image['alt_text'];
					$title = $image['title'];
					$caption = $image['description'];
										
					echo "<div id='noFlashImage'>";
					echo "    <img src='$image_url' title='$title' alt='$alt_text' width='100%'/>";   
					echo "    <span class='title'>$title</span>";
					echo "    <span class='caption'>$caption</span>"; 
					echo "</div>";
					echo "<br/>\n";
					
				}
			?>
			</noscript>
		</div>
	</div>
	
	<?php echo PageManager::getCurrentPageContent(); ?>
		
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