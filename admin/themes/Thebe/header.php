<?php

PageManager::doHeader();

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" <?= PageManager::getLanguageAttributes(); ?>>

<head profile="http://gmpg.org/xfn/11">

	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

	<title><?= PageManager::getPageTitle() ?></title>
	
	<!-- Meta data //////////////////////////////////////////////////////// --> 	
	
	<?php PageManager::doSiteMetaTags(); ?>
		
	<!-- Favicon ///////////////////////////////////////////////////// -->

	<link rel="shortcut icon" type="image/png" href="<?= PageManager::getFavIconURL() ?>">
	
	<!-- Style sheets ///////////////////////////////////////////////////// -->
<!--
	<link rel="stylesheet" href="<?= PageManager::$common_url_root; ?>reset-min.css" type="text/css" media="screen" />
-->
	<link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/2.8.1/build/reset/reset-min.css">
	<link rel="stylesheet" href="<?= PageManager::$theme_url_root; ?>style.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="<?= PageManager::$theme_url_root; ?>datePicker.css" type="text/css" id="" media="print, projection, screen" />
	
	<!-- styles needed by jScrollPane -->
	<link rel="stylesheet" href="<?= PageManager::$theme_url_root; ?>/jscrollpane.css" type="text/css" id="" media="print, projection, screen" />
	
	<!-- JS Includes ///////////////////////////////////////////////////// -->

    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js?key=ABQIAAAApd3TaflLK-nGV6GT_CxTqhSdm2A-7rwoGsE41YlBtCPOmvFDPxRCd_p-ugGZEcWT4iPDE9N7Rn-KXg"></script>
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.4/jquery-ui.min.js?key=ABQIAAAApd3TaflLK-nGV6GT_CxTqhSdm2A-7rwoGsE41YlBtCPOmvFDPxRCd_p-ugGZEcWT4iPDE9N7Rn-KXg"></script>
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js?key=ABQIAAAApd3TaflLK-nGV6GT_CxTqhSdm2A-7rwoGsE41YlBtCPOmvFDPxRCd_p-ugGZEcWT4iPDE9N7Rn-KXg"></script>

	<script type="text/javascript" src="<?= PageManager::$common_url_root; ?>js/3rdparty/jquery.jscrollpane.min.js"></script>
	<script type="text/javascript" src="<?= PageManager::$common_url_root; ?>js/3rdparty/jquery.mousewheel.js"></script>	 
	<script type="text/javascript" src="<?= PageManager::$common_url_root; ?>js/3rdparty/jquery-glowing.js"></script>
	<script type="text/javascript" src="<?= PageManager::$common_url_root; ?>js/3rdparty/AC_OETags.js"></script>
	<script type="text/javascript" src="<?= PageManager::$common_url_root; ?>js/3rdparty/jquery.validate.min.js"></script>
	<script type="text/javascript" src="<?= PageManager::$common_url_root; ?>js/3rdparty/date.js"></script>
	<script type="text/javascript" src="<?= PageManager::$common_url_root; ?>js/3rdparty/jquery.datePicker.js"></script>
	<script type="text/javascript" src="<?= PageManager::$common_url_root; ?>js/3rdparty/date.format.js"></script>
	
	<script type="text/javascript" src="<?= PageManager::$common_url_root; ?>js/apolloFullScreenXfader.class.js"></script>
	<script type="text/javascript" src="<?= PageManager::$common_url_root; ?>js/apolloContactRequest.class.js"></script>

	<script type="text/javascript" src="<?= PageManager::$theme_url_root; ?>js/thebeGallery.class.js"></script>
<!--
	<script type="text/javascript" src="<?= PageManager::$theme_url_root; ?>js/thebeBlog.class.js"></script>
	<script type="text/javascript" src="http://www.google-analytics.com/ga.js"></script>
-->
	<!-- Page Styles  //////////////////////////////////////////////////// -->


	<?php
				
		// Over-ride any default styles with user content	
		$background_col = ThemeTable::getGlobalParaValue(PageManager::$site_id, 710);
		
		$text_color = ThemeTable::getGlobalParaValue(PageManager::$site_id, 711);
		$text_title_color = ThemeTable::getGlobalParaValue(PageManager::$site_id, 712);
		
		$nav_bar_text_hover_color = ThemeTable::getGlobalParaValue(PageManager::$site_id, 709);
		$nav_bar_text_color = ThemeTable::getGlobalParaValue(PageManager::$site_id, 708);
		
		$nav_bar_border_color = ThemeTable::getGlobalParaValue(PageManager::$site_id, 706);
		$nav_bar_color = ThemeTable::getGlobalParaValue(PageManager::$site_id, 705);
		$nav_bar_border_width = ThemeTable::getGlobalParaValue(PageManager::$site_id, 707);
		
	?>
	
	<style type="text/css">

		<?php if(isset($background_col)) echo "html, body {background-color: #{$background_col};}" ?>	
		
		<?php 
			if(isset($text_color)) {			
				echo "html, body {color: #{$text_color};}";
				echo "#blogPage {color: #{$text_color};}";
				echo "#popupPage .popupContent .popupText {color: #{$text_color};}";
			}
		?>
			
		<?php 
			if(isset($text_title_color)) {			
				echo "h1, h2, h3 {color: #{$text_title_color} !important;}";
				echo "#blogPage .postTitle {color: #{$text_title_color} !important;}";								
				echo "#blogPage .postTitle a {color: #{$text_title_color} !important;}";								
			}
		?>
				
		<?php 
			if(isset($nav_bar_text_color)) {			
				echo "#menuRibbon .menuItem {color: #{$nav_bar_text_color};}";
				echo "#menuRibbon .control {color: #{$nav_bar_text_color};}";
			}
		?>
											
		<?php if(isset($nav_bar_text_color)) echo "#menuRibbon .menuItem {color: #{$nav_bar_text_color};}" ?>	
		<?php if(isset($nav_bar_text_hover_color)) echo "#menuRibbon .menuItem:hover {color: #{$nav_bar_text_hover_color};}" ?>	
		<?php if(isset($nav_bar_text_hover_color)) echo "#menuRibbon .menuItemSelected {color: #{$nav_bar_text_hover_color};}" ?>	
		
		<?php if(isset($nav_bar_color)) echo "#menuRibbonWrapper {background-color: #{$nav_bar_color};}" ?>	
		<?php if(isset($nav_bar_border_color)) echo "#menuRibbonWrapper {border-color: #{$nav_bar_border_color};}" ?>	
		<?php if(isset($nav_bar_border_width)) echo "#menuRibbonWrapper {border-width: {$nav_bar_border_width}px;}" ?>	
			
		.curvedOuterWrapper {
			width: 100%;
			height: 100%;
			position: fixed;
			bottom: 200px;
			left: 25%;
			width: 50%;
			height: 70%;
		}
		
		.curvedWrapper {
			position: relative;
			padding: 0;
			margin: 0;
			width: 100%;
			height: 100%;
			/*top: 10%;
			left: 25%;	
			*/
			z-index: inherit;
		}
		
		.curved {
			width: 100%;
			height: 100%;
			background-color: transparent;
			background-image: url("<?= PageManager::$common_url_root; ?>/imgs/white80.png"); 
			background-repeat: repeat;
			color: black;
			
			-moz-border-radius: 25px;
			-webkit-border-radius: 25px;
			-khtml-border-radius: 25px;			
			border-radius: 25px;
			
			z-index: 2005;
			padding: 25px;
			
			/*
			behavior:url("<?= PageManager::$theme_url_root; ?>border-radius.htc");
			*/
		}
		
	</style>

						
	<!-- Pingback ////////////////////////////////////////////////////////////// -->

	<link rel="pingback" href="<?= PageManager::getPingBackURL();?>" />
	
</head>

<body>

	
<div id='popupWrapper'></div>
