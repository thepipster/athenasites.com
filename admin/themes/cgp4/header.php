<?php
/**
 * @package WordPress
 * @subpackage CGP3_Theme
 */
 
//require_once("../../admin/code/php/setup.php");

// Do default actions
PageManager::doHeader();

/*
// Get the pages top level parent page title
$parent_title = getTopParentPageTitle($wp_query->post);

error_log("Parent title: " . $parent_title);

function getTopParentPageTitle($post){

	// If this page id != 0
	// then keep going up until you find that page that has page id of 0
	error_log("Title: " . $post->post_title . " Parent ID: " . $post->post_parent);
	
	if ($post->post_parent != 0){
		return getTopParentPageTitle(get_post($post->post_parent));
	}
	else {
		return $post->post_title;
	}
		
}
*/

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" <?= PageManager::getLanguageAttributes(); ?>>

<head profile="http://gmpg.org/xfn/11">

	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

	<title><?= PageManager::$page_title ?></title>
	
	<!-- Favicon ///////////////////////////////////////////////////// -->

	<link rel="icon" type="image/png" href="<?= PageManager::getFavIcon() ?>">
	
	<!-- Style sheets ///////////////////////////////////////////////////// -->

	<link rel="stylesheet" href="<?= PageManager::$theme_url_root; ?>/style.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="<?= PageManager::$theme_url_root; ?>/code/css/main.css" type="text/css" id="" media="print, projection, screen" />
	<link rel="stylesheet" href="<?= PageManager::$theme_url_root; ?>/code/css/blog.css" type="text/css" id="" media="print, projection, screen" />
	<link rel="stylesheet" href="<?= PageManager::$theme_url_root; ?>/code/css/contact.css" type="text/css" id="" media="print, projection, screen" />
	<link rel="stylesheet" href="<?= PageManager::$theme_url_root; ?>/code/css/datePicker.css" type="text/css" id="" media="print, projection, screen" />
	
	<!-- JS Includes ///////////////////////////////////////////////////// -->

	<script type="text/javascript" src="<?= PageManager::$theme_url_root; ?>/code/js/3rdparty/AC_OETags.js"></script>
	
	<script type="text/javascript" src="http://www.google-analytics.com/ga.js"></script>

	<script type="text/javascript" src="<?= PageManager::$theme_url_root; ?>/code/js/3rdparty/jquery-1.3.1.min.js"></script>
	<script type="text/javascript" src="<?= PageManager::$theme_url_root; ?>/code/js/3rdparty/jquery_plugins/jquery.dimensions.min.js"></script>
	<script type="text/javascript" src="<?= PageManager::$theme_url_root; ?>/code/js/3rdparty/jquery_plugins/jquery.accordion.js"></script>
	<script type="text/javascript" src="<?= PageManager::$theme_url_root; ?>/code/js/3rdparty/jquery_plugins/jquery.corners.min.js"></script>
	<script type="text/javascript" src="<?= PageManager::$theme_url_root; ?>/code/js/3rdparty/jquery_plugins/date.js"></script>
	<script type="text/javascript" src="<?= PageManager::$theme_url_root; ?>/code/js/3rdparty/jquery_plugins/jquery.datePicker.min-2.1.2.js"></script>

	<script type="text/javascript" src="<?= PageManager::$theme_url_root; ?>/code/js/Logger-min.class.js"></script>

	<!-- Page Styles  //////////////////////////////////////////////////// -->

	<style type="text/css">

		/* ie6 png fix */		
		div { behavior: url("<?= PageManager::$theme_url_root; ?>/iepngfix.htc") }
						
	</style>

	<!-- Pingback ////////////////////////////////////////////////////////////// -->

	<link rel="pingback" href="<?= PageManager::getPingBackURL();?>" />
	
</head>

<body>


<div style='height:100%; width:100%' align='center'>
	
	<a href="/"><div id='logo'></div></a>

	<div id='container'>
		
		<table width="100%" height="100%" cellpadding="0" cellspacing="0" border="0">
			
			<tr>
				<td width='200px' height="100%" valign="top" class='treeMenuLogo'>
				
					<div id='menuContainer' align="right">
													
						<ul id='navigation'>
										
						<?php 
						
							$pages = PagesTable::getPages(PageManager::$site_id);
														
							// Construct menu.....
																				
							foreach ($pages as $page){
							
								//Logger::dump($page);
								
								$page_id = $page['id'];
								$parent_page_id = $page['parent_page_id'];
								$title = $page['title'];								
								$page_slug = $page['slug'];
							
								if ($parent_page_id == 0 && $title != 'Home'){
																		
									$link = PageManager::getPageLink($page_id, $parent_page_id, $page_slug, $pages);
									
									//Logger::debug("Page: $title Link: $link");
									
									print("<li>");
									print("    <span class='menuHead'>$title</span>");									
									print("    <ul>");
																																							
									
									// Get child pages 
									foreach($pages as $child){
										
										if ($child['parent_page_id'] == $page_id){
	
											$child_id = $child['id'];
											$child_title = $child['title'];

											$child_link = PageManager::getPageLink($child['id'], $child['parent_page_id'], $child['slug'], $pages);
													
											Logger::debug(">> Child Page: $child_title Link: $child_link");
																				
											if ($child['id'] == $page_id){
												print("<li><a href='$child_link' onclick=''><span class='menuItem' id='$child_id'><b>$child_title</b></span></a></li>");
											}
											else {											
												print("<li><a href='$child_link' onclick=''><span class='menuItem' id='$child_id'>$child_title</span></a></li>");
											}											
										}
									}
																		
									print("    </ul>");									
									print("</li>");
									
									print("<div class='spacer'></div>");
									
								}
								
							}			
						?>
						
						</ul>
					
						<div style='height:130px;'></div>
						
					</div> <!-- menuContainer -->

				</td>
				
				<td height="100%" align="left" valign="top">
