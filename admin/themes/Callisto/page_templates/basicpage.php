<?php
/**
* @Theme: Callisto
* @Template: Basic Page
* @Description: Basic Page
*/			
$background_image = PageManager::getMediaURLFromThemePara(215); 

if (!isset($background_image) || $background_image == ""){
	$background_image = PageManager::$common_url_root . 'imgs/blank.png';
}

?>

<div id='content' class='basicPage' align="left">

	<?php echo PageManager::getCurrentPageContent(); ?>
	
</div><!-- content -->

		
<script type="text/javascript">

callistoInfoPage.init({
	width: 1350,
	height: 800,
	pageType: 'none'
});

</script>