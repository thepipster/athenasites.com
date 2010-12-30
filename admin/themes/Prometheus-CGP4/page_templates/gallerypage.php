<?php
/**
* @Theme: CGP4
* @Template: Gallery Page
* @Description: Gallery Page
*/

$noflash = $_GET['noflash'];

$xml_url = "http://" . $_SERVER['HTTP_HOST'] ."/admin/code/php/getUserGalleryXML.php?p=".PageManager::$site_id.",".PageManager::$page_id."&cache=" . mt_rand();
$gallery_image_list = ClientGalleryTable::getImagesForPage(PageManager::$site_id, PageManager::$page_id);

?>

	<div id='galleryContent' class='pageContents' style="padding:0px; padding-left:25px;background-image:url('')">
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
	document.getElementById('galleryContent').innerHTML = "";
	var txt = "";
	txt += "<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0' width='100%' height='100%' id='homeGalFlashObject' align='middle'>";
	txt += "	<param name='allowScriptAccess' value='sameDomain' /> ";
	txt += "	<param name='wmode' value='transparent' /> ";
	txt += "	<param name='movie' value='<?= PageManager::$theme_url_root; ?>flash/Gallery.swf' /> ";
	txt += "	<param name='quality' value='high' /> ";
	txt += "	<param name='bgcolor' value='#ffffff' /> ";
	txt += "	<param name='FlashVars' value='xmlFile=<?= $xml_url; ?>' /> ";
	txt += "	<embed FlashVars='xmlFile=<?= $xml_url; ?>' src='<?= PageManager::$theme_url_root; ?>flash/Gallery.swf' quality='high' bgcolor='#ffffff' wmode='transparent' width='100%' height='100%' name='homeGalFlashObject' align='middle' allowScriptAccess='sameDomain' type='application/x-shockwave-flash' pluginspage='http://www.macromedia.com/go/getflashplayer' /> ";
	txt += "</object>";
	document.getElementById('galleryContent').innerHTML = txt;
}		


var cgpGallery = {

	/** Width of flash gallery viewer */
	imgWidth : 1270,
	
	/** Height of flash gallery viewer */
	imgHeight : 810,

	/** The width of the thumb display column (not the thumbs) */
	thumbWidth : 70,
	
	/** Ratio of width to height */
	imgRatio : 0,

	/** Minimum allowed width */
	minWidth : 800,
	
	init : function(){
						
		// Optimize size for gallery
		cgpGallery.imgRatio = cgpGallery.imgHeight / cgpGallery.imgWidth;	
	
		cgpGallery.onResize();
		
		setTimeout("cgpGallery.onResize()", 200);
								
	},
	
	onResize : function(){

		if (hasFlash){
				
			$("#menuContainer").width(200);
			
			var galW = $("#container").width() - $("#menuContainer").width() - 25;		
			var galH = Math.floor(cgpGallery.imgRatio * galW);
			
			$("#container").height(galH);	
			
			$("#galleryContent").height(galH);
			$("#galleryContent").width(galW);
			
			//Logger.info("galW = " + galW + " galH = " + galH);
	
			// Gallery controls.................
					
			// Figure out thumb width, and make the controls that wide
			/*
			var r = cgpGallery.thumbWidth / cgpGallery.imgWidth;			
			var w = r * galW;
					
			if (!cgpCommon.isIE6()){
				$('.nextButton').css('width', (w/2));
				$('.prevButton').css('width', (w/2));
			}
			else {
				$('.nextButton').css('padding-right', 10);
			}
			
			$('.toggleShow').css('width', w);
			*/
		}
		
	}

}

// /////////////////////////////////////////////////////////////////////////////////

$(document).ready(cgpGallery.init);
$(window).resize(cgpGallery.onResize);

</script>