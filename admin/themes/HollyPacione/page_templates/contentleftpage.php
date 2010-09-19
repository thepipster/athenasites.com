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

Logger::debug("Background image = $background_image");

$styleStr = "";
if ($width > $height){ 
	$styleStr = "width:{$width}px"; 
}
?>

		<div id="content" style="border:none; <?=$styleStr?>">
						
		<table border="0" cellpadding="0" cellspacing="0" id='contentTable' width="100%" height="100%" style="width:100%; height:100%;background-image: url('<?=$background_image?>')">
			
			<tr valign="top" height="100%">
			
				<td width="45%" height="100%" class='leftCol'>
						left col
						<?php //echo PageManager::getCurrentPageContent(); ?>
				</td>
				
				<td width="55%" height="100%"> 
					<!-- Empty -->
					right col
				</td>
				
			</tr>
			
		</table>
<!--
		<img class='backgroundImage2' src='<?=$background_image?>'/>
-->
		</div><!-- content -->

		
<script type="text/javascript">
/*
hollyInfoPage.init({
	width: 1350,
	height: 800,
	pageType: 'left'
});
*/
// Reposition and resize background image
/*
var pos = $('#contentTable').position();
//var bw = $('#content').css('border-width');
var bw = 4;

var contW = $('#contentTable').width();
var contH = $('#contentTable').height();

var imgW = $('.backgroundImage2').width();
var imgH = $('.backgroundImage2').height();

//alert($('#contentTable').width() + ", " + $('#contentTable').innerWidth());

$('.backgroundImage2').css('top', pos.top);
$('.backgroundImage2').css('left', pos.left);

$('.backgroundImage2').width(contW);
//$('.backgroundImage2').height(contH);

$('.backgroundImage2').show();
*/				
</script>