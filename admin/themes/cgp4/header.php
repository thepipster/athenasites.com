<?php
/**
 * @Theme: CGP4
 */
 
// Do default actions
PageManager::doHeader();

global $tracker_code;
		
// Get the google tracker code (if set)	
$tracker_code = ThemeTable::getGlobalParaValue(PageManager::$site_id, 301);

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

	<link rel="icon" type="image/png" href="<?= PageManager::getFavIconURL() ?>">
	
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
	<script type="text/javascript" src="<?= PageManager::$theme_url_root; ?>/code/js/cgpCommon.class.js"></script>

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
																				
							// Construct menu.....
																				
							foreach (PageManager::$page_list as $page){
							
								//Logger::dump($page);
								
								$page_id = $page['id'];
								$parent_page_id = $page['parent_page_id'];
								$title = $page['title'];								
								$page_slug = $page['slug'];
								$is_homepage = $page['is_homepage'];
								$is_blogpage = $page['is_blogpage'];
							
								if (!$is_homepage){
								
									if ($parent_page_id == 0 && $title != 'Home'){
											
										print("<li>");
										
										if ($is_blogpage){
										
											$link = PageManager::getPageLink($page_id);
											print("    <a href='$link' onclick=''><span class='menuHead_NonAccordian'>$title</span></a>");
																																	
											if (PageManager::$is_blogpage){
											
												$catList = PostsTable::getCategories(PageManager::$site_id);

												print("<ul>");
												foreach($catList as $cat){
													$cat_slug = StringUtils::encodeSlug($cat, '');
													$link = PageManager::$blog_url . "?category=" . $cat_slug;
													echo "<li><a href='{$link}'><span class='menuItem' id='blogMenuItem_{$cat_slug}'>{$cat_slug}</span></a></li>";
												}											
												print("</ul>");	
												
												$tagList = PostsTable::getTags(PageManager::$site_id);
												
												print("<div class='spacer'></div>");
												
												foreach($tagList as $tag){
													$tag_slug = StringUtils::encodeSlug($tag, '');
													$link = PageManager::$blog_url . "?tag=" . $tag_slug;
													echo "<li><a href='{$link}'><span class='menuTagItem' id='blogMenuItem_{$tag_slug}'>{$tag_slug}</span></a></li>";
													// <li><a href='/blog/?tag=air-force-academy'><span class='menuTagItem' id='blogMenuItem_air-force-academy'>air force academy</span></a></li>
												}											
												
												
												
											}								
										}
										else {
											print("    <span class='menuHead'>$title</span>");									
										}
										
										
										// Get child pages 
										print("    <ul>");																																																		
										foreach(PageManager::$page_list as $child){
											
											if ($child['parent_page_id'] == $page_id){
		
												$child_id = $child['id'];
												$child_title = $child['title'];
	
												$child_link = PageManager::getPageLink($child['id']);
														
												//Logger::debug(">> Child Page: $child_title Link: $child_link");
																					
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
								
							}			
						?>
						
						</ul>
					
						<div style='height:130px;'></div>
						
					</div> <!-- menuContainer -->

				</td>
				
				<td height="100%" align="left" valign="top">
