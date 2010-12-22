<?php
/**
* @Theme: CGP4
* @Template: Text & Image Page
* @Description: Text & Image Page
*/	

$image = PageManager::getMediaFromThemePara(304); 

if (!isset($image) || $image == ""){
	$image_url = PageManager::$common_url_root . 'imgs/blank.png';
	$image_title = "";
	$image_alt = "";
}
else {
	$image_url = PageManager::$media_root_url . $image['filepath'] . $image['filename'];
	//$thumb_url = PageManager::$media_root_url . $image['filepath'] . $image['thumb_filename'];
	$image_title =  $image['title'];
	//$description = $image['description'];										
	$image_alt = $image['tags'];
}

?>

<!-- INFO PAGE /////////////////////////// -->

<div class='pageContents'>

	<table width="100%" height="100%" border="0">
		<tr>
			<td width="50%" valign="top">
				<div class='infoPageText'>
					<?php echo PageManager::getCurrentPageContent(); ?>
				</div>
			</td>
			<td valign="top">
				<?php echo "<img src='$image_url' title='$image_title' alt='$image_alt' width='95%'/>"; ?>						
			</td>
		</tr>
	</table>

</div><!-- infoPage -->
