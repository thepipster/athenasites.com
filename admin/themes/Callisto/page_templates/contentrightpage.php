<?php
/**
* @Theme: HollyPacione
* @Template: Content Right Page
* @Description: Content Right Page
* @Data: Text
*/

$image = PageManager::getMediaFromThemePara(204); 

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

$styleStr = "";
if ($width > $height){ 
	$styleStr = "width:{$width}px"; 
}
?>

	<div id="content" style="border:none; <?=$styleStr?>">
		
		<table border="0" cellpadding="0" cellspacing="0" id='contentTable' width="100%" height="100%" style="width:100%; height:100%; background-image: url('<?=$background_image?>')">
			
			<tr valign="top" align='left' height="100%">

				<td width="45%" height="100%"> 
					<!-- Empty -->
				</td>
							
				<td width="55%" height="100%" class='rightCol'>
                	<?php echo PageManager::getCurrentPageContent(); ?>
				</td>
				
			</tr>
			
		</table>
		
	</div>

		
<script type="text/javascript">

hollyInfoPage.init({
	width: <?= $width ?>,
	height: <?= $height ?>,
	pageType: 'right'
});

</script>