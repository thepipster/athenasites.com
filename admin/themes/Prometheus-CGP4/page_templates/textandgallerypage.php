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

	<table border='0' width="100%" height="100%" border="0">
		<tr>
			<td width="50%" valign="top">
				<div class='infoPageText'>
					<?php echo PageManager::getCurrentPageContent(); ?>
				</div>
			</td>
			<td valign="top" height="100%">
				<div id='miniGallery' style='width:95%; height:100%;'>
			
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
						
				</div>
			</td>
		</tr>
	</table>
		
</div><!-- infoPage -->
						
		
<script type="text/javascript">

// Major version of Flash required
var requiredMajorVersion = 8;

// Minor version of Flash required
var requiredMinorVersion = 0;

// Minor version of Flash required
var requiredRevision = 0;

var hasFlash = DetectFlashVer(requiredMajorVersion, requiredMinorVersion, requiredRevision);

if (hasFlash){
				
	// Clear the div as fast as possible			
	document.getElementById('miniGallery').innerHTML = "";

	var txt = "";

	txt += "<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0' width='100%' height='100%' id='infoGalFlashObj' align='top' salign='t'>";
	txt += "	<param name='allowScriptAccess' value='sameDomain' />";
	txt += "	<param name='movie' value='<?= PageManager::$theme_url_root; ?>flash/gal500x500.swf' /> ";
	txt += "	<param name='quality' value='high' />";
	txt += "	<param name='wmode' value='transparent' />";
	txt += "	<param name='bgcolor' value='#ffffff' />"; 
	txt += "	<param name='salign' value='t' />";
	txt += "	<param name='FlashVars' value='xmlFile=<?= PageManager::$theme_url_root; ?>/code/php/getUserGalleryXML.php?pageid=<?=$page_id ?>' /> ";
	txt += "	<embed FlashVars='xmlFile=<?= $xml_url ?>' src='<?= PageManager::$theme_url_root; ?>flash/HomeGallery.swf' quality='high' bgcolor='#ffffff' wmode='transparent' width='100%' height='100%' name='infoGalFlashObj' align='top' salign='t' allowScriptAccess='sameDomain' type='application/x-shockwave-flash' pluginspage='http://www.macromedia.com/go/getflashplayer' />";
	txt += "</object>";
	
	document.getElementById('miniGallery').innerHTML = txt;
}	

</script>						