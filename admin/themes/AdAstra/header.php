<?php
/**
 * @Theme: AdAstra
 */
 
// Do default actions
PageManager::doHeader();

global $tracker_code;
		
// Get the google tracker code (if set)	
//$tracker_code = ThemeTable::getGlobalParaValue(PageManager::$site_id, 301);


?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" <?= PageManager::getLanguageAttributes(); ?>>

<head profile="http://gmpg.org/xfn/11">

	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

	<title><?= PageManager::getPageTitle() ?></title>
	
	<!-- Favicon ///////////////////////////////////////////////////// -->

	<link rel="icon" type="image/png" href="<?= PageManager::getFavIconURL() ?>">

	<!-- Style sheets ///////////////////////////////////////////////////// -->

	<link rel="stylesheet" href="<?= PageManager::$theme_url_root; ?>/main.css" type="text/css" media="screen" />

	<!-- Page Styles  ..///////////////////////////////////////////////////////// -->

	<style type="text/css">

		/* ie6 png fix */		
		div { behavior: url("<?= PageManager::$theme_url_root; ?>/iepngfix.htc") }
						
	</style>

	<!-- JS Includes /////////////////////////////////////////////////////////// -->

	<script type="text/javascript" src="<?= PageManager::$theme_url_root; ?>/js/jquery-1.3.1.min.js"></script>
	<script type="text/javascript" src="http://www.google-analytics.com/ga.js"></script>

<!--	
	<script type="text/javascript" src="jquery-1.3.1.min.js/js/syntaxhighlighter/shCore.js"></script>

	<script type="text/javascript" src="code/js/jquery_plugins/jquery.dimensions.min.js"></script>
	<script type="text/javascript" src="code/js/jquery_plugins/jquery.accordion.js"></script>
	<script type="text/javascript" src="code/js/jquery_plugins/jquery.corners.min.js"></script>

	<script type="text/javascript" src="code/js/jquery_plugins/jquery.flash.js"></script>
-->

	<!-- Pingback ////////////////////////////////////////////////////////////// -->

	<link rel="pingback" href="<?= PageManager::getPingBackURL();?>" />
	
</head>

<body>

<div align='center' style='width:100%; height:100%'>
    
    <div id='contents'>
    
        <div id='header_contents'>
            <div id='header_image'></div>
            
				<div id='header_bar'>

					<?php 
						foreach (PageManager::$page_list as $page){
						
							//Logger::dump($page);
						
							$id = $page['id'];
							$parent_page_id = $page['parent_page_id'];
							$title = $page['title'];								
							$page_slug = $page['slug'];
							$is_homepage = $page['is_homepage'];
							$is_blogpage = $page['is_blogpage'];
							$link = PageManager::getPageLink($id);
							
							if ($title == 'Home' && $_SERVER["REQUEST_URI"] == "/"){
								print("<a href='$link'><h1 id='$id' class='menu_selected_item'>$title</h1></a> \n");
							}							
							else if (strpos($_SERVER["REQUEST_URI"], $page_slug)){
								print("<a href='$link'><h1 id='$id' class='menu_selected_item'>$title</h1></a> \n");
							}
							else {
								print("<a href='$link'><h1 id='$id' class='menu_item'>$title</h1></a> \n");
							}
						}			
					?>
					<!--
					<a href="loadPage.php?page=marine_salvage" onclick="AdAstra.Main.gotoPage('marine_salvage'); return false"><h1 id='menu_marine_salvage' class='menu_item'>Marine Survey & Salvage</h1></a>
					-->
					
					
					<a href="mailto:info@adastrasystems.com?subject=Contact"><h1 class='menu_item'>Contact</h1></a>
					
				</div>
        </div>
