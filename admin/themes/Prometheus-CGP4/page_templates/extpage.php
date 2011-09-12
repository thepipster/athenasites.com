<?php
/**
* @Theme: CGP4
* @Template: Leah Alex Slideshow Page
* @Description: Special page for Leah Alex slideshow
*/

$gallery_image_list = ClientGalleryTable::getImagesForPage(PageManager::$site_id, PageManager::$page_id);

?>

<style type="text/css">
body {
	background-color:#FFFFFF; 	/* page background */
	color:#033345; 				/* page text color*/
	font-family:Arial, Helvetica, Sans;
	font-size:12px;
	margin:0;
}
#showit {
	width:900px;		/* swf width */
	height:600px;		/* swf height */
	position:relative;
	margin:0 auto;
}
#showit h1 {
	font-family:"Times New Roman", Times, serif;
	font-size:28px;
	font-weight:bold;
	font-style:italic;
	margin:5px 0 0 0;
	text-align:center;
	color:#033345;			/* title color */
}
#showit h2 {
	font-family:"Times New Roman", Times, serif;
	font-size:18px;
	font-weight:normal;
	font-style:italic;
	margin:5px;
	text-align:center;
	color:#033345;			/* subtitle color */
}

.showit_error {
	margin:20px;
	border:2px solid #990000;
	padding:20px;
	color:#990000;
	background-color:#cc7f7f;
	font-size:12px;
	text-align:center;
}
.showit_error a:link, .showit_error a:visited {
	color:#FFFFFF;
	text-decoration:underline;
}
.showit_error a:hover, .showit_error a:active {
	color:#FFFFFF;
	text-decoration:none;
	background-color:#990000;
}
</style>
<script type="text/javascript" src="<?= PageManager::$theme_url_root; ?>/LeahAlex/showit.js"></script>
<script type="text/javascript">
	showit_flash_version="8";
	$(document).ready(function() {
		showitplayer('910','790','yes'); // (width,height,showit_big)
	});
</script>

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