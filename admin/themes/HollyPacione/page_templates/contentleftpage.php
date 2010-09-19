<?php

/**
* @Theme: HollyPacione
* @Template: Content Left Page
* @Description: Content Left Page
*/

$image = PageManager::getMediaFromThemePara(203); 

if (isset($image)){
	$background_image = PageManager::getMediaURL($image['id']);
	$width = $image['width'];
	$height = $image['height'];
}
else {
	$background_image = '';
	$width = 0;
	$height = 0;
}
?>

		<div id='content' <?php if ($width > $height){ echo "style='width:{$width}px"; } ?>><div id='scroller'>

			<div class='backgroundImage'>
			<?php
				if ($width > $height){
					echo "<img id='back_image' src='$background_image' width='100%'/>";
				}
				else {
					echo "<img id='back_image' style='float:right' src='$background_image' height='100%'/>";
				}
			?>
			</div>
			
			<div class='leftCol' align="left">
				<div class='contentText'>
					<?php echo PageManager::getCurrentPageContent(); ?>
				</div>
			</div>
			
		</div></div><!-- content -->

		
<script type="text/javascript">

hollyInfoPage.init({
	width: 1350,
	height: 800,
	pageType: 'left'
});
				
</script>