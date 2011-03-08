<?php
/**
* @Theme: HollyPacione
* @Template: Basic Page
* @Description: A basic page which allows you to place any content you want into it.
*/			
$background_image = PageManager::getMediaURLFromThemePara(215); 

if (!isset($background_image) || $background_image == ""){
	$background_image = PageManager::$common_url_root . 'imgs/blank.png';
}

?>

		<div id='content'>
		<div id='scroller'>

			<div class='backgroundImage'>
				<img src="<?=$background_image?>" width='100%' height='100%'/>
			</div>
			
			<div class="singleCol" align="left">
				<div class='contentText'>
					<?php echo PageManager::getCurrentPageContent(); ?>
				</div>
			</div>
			
		</div>
		</div><!-- content -->

		
<script type="text/javascript">

hollyInfoPage.init({
	width: 1350,
	height: 800,
	pageType: 'none'
});

</script>