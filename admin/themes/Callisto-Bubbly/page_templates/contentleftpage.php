<?php

/**
* @Theme: Callisto
* @Template: Content Left Page
* @Description: A page with a background image and page content to the left
*/
$image = PageManager::getMediaFromThemePara(203); 

if (isset($image)){
	$background_image = PageManager::getMediaURL($image['id']);
	$width = $image['width'];
	$height = $image['height'];
}
else {
	$background_image = PageManager::$common_url_root . 'imgs/blank.png';
	$width = 1350;
	$height = 800;
}

Logger::debug("Background image = $background_image");

$styleStr = "";

if ($width < $height){ 
	$styleStr = "background-position: right center"; 
}
?>

	<div id="content" style="border:none; <?=$styleStr?>">
						
		<table border="0" cellpadding="0" cellspacing="0" id='contentTable' width="100%" height="100%" style="width:100%; height:100%; background-image: url('<?=$background_image?>'); <?=$styleStr ?>">
			
			<tr valign="top" height="100%" width="100%">
			
				<td width="55%" height="100%" class='leftCol' align="left">
                	<?php echo PageManager::getCurrentPageContent(); ?>
				</td>
				
				<td width="45%" height="100%" >
					<!-- Empty -->
				</td>
				
			</tr>
			
		</table>

	</div><!-- content -->

		
<script type="text/javascript">

callistoInfoPage.init({
	width: <?= $width ?>,
	height: <?= $height ?>,
	pageType: 'left'
});

</script>