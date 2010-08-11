<?php
/**
 * @package WordPress
 * @subpackage AdAstra_Theme
 */
 
PageManager::doHeader();

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" <?= PageManager::getLanguageAttributes(); ?>>

<head profile="http://gmpg.org/xfn/11">

	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

	<title><?= PageManager::$page_title ?></title>
	
	<!-- Favicon ///////////////////////////////////////////////////// -->

	<link rel="icon" type="image/png" href="<?= PageManager::$theme_url_root; ?>/favicon.png">

	<!--[if IE]>
	<link rel="shortcut icon" href="<?= PageManager::$theme_url_root; ?>/favicon.ico">
	<![endif]-->

	<!-- Style sheets //////////////////////////////////////////////////////////// -->

	<link rel="stylesheet" href="<?= PageManager::$theme_url_root; ?>/style.css" type="text/css" media="screen" />

	<link rel="stylesheet" href="<?= PageManager::$theme_url_root; ?>/css/coda-slider-2.0.css" type="text/css" media="screen" />

	<!-- Page Styles  ..///////////////////////////////////////////////////////// -->

	<style type="text/css">

		/* ie6 png fix */		
		div { behavior: url("<?= PageManager::$theme_url_root; ?>/iepngfix.htc") }
						
		<?php
			if (strpos(strtolower($_SERVER["REQUEST_URI"]), "blog")){
		?>
			#site_wrapper {
				background-image: url('<?= PageManager::$theme_url_root; ?>/images/top_left_background.png');
				background-repeat: no-repeat;
				height: 100%;				
				background-color: #ffffff;
			}
			
			#copy_footer { margin-top: -20px;}

		<?php				
			}
		?>				
		
	</style>

	<!-- JS Includes /////////////////////////////////////////////////////////// -->

	<script type="text/javascript" src="<?= PageManager::$theme_url_root; ?>/js/jquery-1.4.2.min.js"></script>
	<script type="text/javascript" src="<?= PageManager::$theme_url_root; ?>/js/jquery.easing.1.3.js"></script>
	<script type="text/javascript" src="<?= PageManager::$theme_url_root; ?>/js/jquery.coda-slider-2.0.js"></script>

	<script type="text/javascript" src="<?= PageManager::$theme_url_root; ?>/js/AC_OETags.js"></script>
	<script type="text/javascript" src="<?= PageManager::$theme_url_root; ?>/js/apolloMiniGallery.js"></script>
	<!--
	<script type="text/javascript" src="<?= PageManager::$theme_url_root; ?>/js/jquery_ui/ui/ui.core.js"></script>

		<link rel="stylesheet" href="http://jquery-ui.googlecode.com/svn/tags/latest/themes/base/jquery-ui.css" type="text/css" media="all" />
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js" type="text/javascript"></script>
		<script src="http://jquery-ui.googlecode.com/svn/tags/latest/ui/minified/jquery-ui.min.js" type="text/javascript"></script>
	-->


	<script type="text/javascript" src="<?= PageManager::$theme_url_root; ?>/js/reflection-jquery/js/reflection.js"></script>

	<script language="JavaScript">
	
	function preloader() {
	
	     // create object
	     imageObj = new Image();	
	
	     // set image list
	     images = new Array();
	     images[0]="background.png"
	     images[1]="logo.png"
	     images[2]="nav_hover.png"
	     images[3]="take_tour_button_hover.png"
	     images[4]="take_tour_button.png"
	     images[5]="view_themes_button_hover.png"
	     images[6]="view_themes_button.png"
	
	     //images[7]="temp/home_page_image.png"
	
	     // start preloading
	     for(i=0; i<=images.length; i++) {
	          imageObj.src='<?= PageManager::$theme_url_root; ?>/images/'+images[i];
	     }
	} 
		
	</script>

	<!-- Pingback ////////////////////////////////////////////////////////////// -->

	<link rel="pingback" href="<?= PageManager::getPingBackURL();?>" />

</head>

<body onload="preloader()">

<div align='center' style='width:100%; height:100%'>
    
    <div id='site_wrapper'>
    <div id='nav_bar'>
    	
    	<a href='<?=$url_root?>' id='logo'><img src="<?= PageManager::$theme_url_root; ?>/images/logo.png" width="256px" height="60px" alt="Apollo Sites, SEO Enhanced wordpress themes for photographers"></a>
    	
    	<div id='nav_menu' align="right">
			<?php 

				foreach (PageManager::$page_list as $page){
				
					$page_id = $page['id'];
					$parent_page_id = $page['parent_page_id'];
					$title = $page['title'];								
					$page_slug = $page['slug'];

					if ($parent_page_id == 0){

						$link = PageManager::getPageLink($page_id);
						
						//if ($title == 'home' || $title == 'Home'){
							//print("<a href='$link'><h1 id='$id' class='menu_selected_item'>$title</span></a> \n");
							// do nothing, hide the home page!
						//}
						if (($title == 'home' || $title == 'Home') && $_SERVER["REQUEST_URI"] == '/'){
							print("<a href='$link'><div id='$page_id' class='menu_item menu_selected_item' align='center'><div class='menu_text'>$title</div></div></a> \n");
						}	
						else if (strpos($_SERVER["REQUEST_URI"], $page_slug)){
							print("<a href='$link'><div id='$page_id' class='menu_item menu_selected_item' align='center'><div class='menu_text'>$title</div></div></a> \n");
						}
						else {
							print("<a href='$link'><div id='$page_id' class='menu_item' align='center'><div class='menu_text'>$title</div></div></a> \n");
						}
					}
				}			
			?>    	
    	</div> <!-- nav -->
    	
    </div><!-- nav_bar -->
    
    <div id='contents'>