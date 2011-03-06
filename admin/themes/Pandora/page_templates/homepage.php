<?php
/**
* @Theme: Pandora
* @Template: Home Page
* @Description: Home Page
* @isHome: 1
*/

global $blog_id;
$page_id = $wp_query->post->ID;

$xml_url = "http://" . $_SERVER['HTTP_HOST'] ."/wp-content/CommonCode/php/getUserGalleryXML.php?p=".$blog_id.",".$page_id."&cache=01101976";


get_header(); 
?>

<script type="text/javascript">

	pandoraGallery.preInit();		
	<?php
		if (isset($noflash) && $noflash == 1){
			echo 'pandoraInfoPage.hasFlash = false;';
		}
	?>

</script>

		<div id='content'>
		<!--
			<img id='backImg' src="<?= PageManager::$theme_url_root; ?>/res/test_images/intro_02.jpg" height='100%' />
		-->
		</div>

<script type="text/javascript">


	pandoraGallery.init({
		swf:"<?= PageManager::$theme_url_root; ?>/flash/homeGal.swf", 
		xml:"<?= $xml_url?>",
		targetDiv:"content"
		});

/*
var pandoraHome = {

	imageList : -1,
	currentImage : 0,
	
	// ////////////////////////////////////////////////////////////////////

	init : function(){
				
		// Load all the images
		pandoraHome.imageList = new Array();
	
		pandoraHome.imageList[0] = new Image(); 
		pandoraHome.imageList[0].src = "<?= PageManager::$theme_url_root; ?>/res/test_images/intro_02.jpg";
		//pandoraHome.imageList[0].onLoad = pandoraHome.onResize();
		
		// Set resize listener
		// TODO: Should append listener to any existing
		//$(window).resize(pandoraHome.onResize);

		$('#backImg').attr("height", "100%");
		$('#backImg').attr("width", "100%");
		
		pandoraCommon.addOnLoadFunction("pandoraHome.onResize()");			
	},
	
	// ////////////////////////////////////////////////////////////////////

	onResize : function(){
		
		var cW = $(document).width();
		var cH = $(document).height() - $('#footerNav').height();
		var img = pandoraHome.imageList[pandoraHome.currentImage];

		alert("Image Height:" + img.height + " Content height: " + cH);
		
		// If the image is too high
		if (img.height > cH){
		
			var ratio = img.width / img.height;			
			var scale = cH / img.height;
			alert(scale);
			$('#backImg').height(cH);
			$('#backImg').width(scale * img.width);
			
		}
		
		// If image is too wide...
		if (img.width > cW){
			$('#backImg').width(cW);
		}		
		
	}
	
}
*/
//pandoraHome.init();


</script>

<?php get_footer(); ?>