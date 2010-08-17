<?php
/**
* @Theme: HollyPacione
* @Template: Blog Page
* @Description: Blog Page
*/			
$background_image = PageParasTable::getMediaURLFromThemePara(215); 
?>

		<div id='content'><div id='scroller'>

			<div class='backgroundImage'>
				<img src="<?=$background_image?>" width='100%' height='100%'/>
			</div>
			
			<div class="singleCol" align="left">
				<div class='contentText'>
					<?php echo PageManager::getBlogContent(); ?>
				</div>
			</div>
			
		</div></div><!-- content -->

		
<script type="text/javascript">

hollyInfoPage.init({
	width: 1350,
	height: 800,
	pageType: 'none'
});

</script>