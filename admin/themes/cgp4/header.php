<?php
/**
 * @package WordPress
 * @subpackage CGP3_Theme
 */
$url_root = 'http://' . $_SERVER['HTTP_HOST']; 

// Get the current page id
$page_id = $wp_query->post->ID;
$page_parent_id = $wp_query->post->post_parent;
$page_title = $wp_query->post->post_title;

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
<html xmlns="http://www.w3.org/1999/xhtml" <?php language_attributes(); ?>>

<head profile="http://gmpg.org/xfn/11">

	<meta http-equiv="Content-Type" content="<?php bloginfo('html_type'); ?>; charset=<?php bloginfo('charset'); ?>" />

	<title><?php wp_title('&laquo;', true, 'right'); ?> <?php bloginfo('name'); ?></title>
	
	<!-- Favicon ///////////////////////////////////////////////////// -->

	<link rel="icon" type="image/png" href="favicon.png">

	<!--[if IE]>
	<link rel="shortcut icon" href="code/imgs/favicon.ico">
	<![endif]-->
	
	<!-- Style sheets ///////////////////////////////////////////////////// -->

	<link rel="stylesheet" href="<?php bloginfo('stylesheet_url'); ?>" type="text/css" media="screen" />
	<link rel="stylesheet" href="<?php bloginfo('stylesheet_directory'); ?>/code/css/main.css" type="text/css" id="" media="print, projection, screen" />
	<link rel="stylesheet" href="<?php bloginfo('stylesheet_directory'); ?>/code/css/blog.css" type="text/css" id="" media="print, projection, screen" />
	<link rel="stylesheet" href="<?php bloginfo('stylesheet_directory'); ?>/code/css/contact.css" type="text/css" id="" media="print, projection, screen" />
	<link rel="stylesheet" href="<?php bloginfo('stylesheet_directory'); ?>/code/css/datePicker.css" type="text/css" id="" media="print, projection, screen" />
	
	<!-- JS Includes ///////////////////////////////////////////////////// -->

	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory'); ?>/code/js/3rdparty/AC_OETags.js"></script>
	
	<script type="text/javascript" src="http://www.google-analytics.com/ga.js"></script>

	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory'); ?>/code/js/3rdparty/jquery-1.3.1.min.js"></script>
	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory'); ?>/code/js/3rdparty/jquery_plugins/jquery.dimensions.min.js"></script>
	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory'); ?>/code/js/3rdparty/jquery_plugins/jquery.accordion.js"></script>
	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory'); ?>/code/js/3rdparty/jquery_plugins/jquery.corners.min.js"></script>
	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory'); ?>/code/js/3rdparty/jquery_plugins/date.js"></script>
	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory'); ?>/code/js/3rdparty/jquery_plugins/jquery.datePicker.min-2.1.2.js"></script>

	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory'); ?>/code/js/Logger-min.class.js"></script>

	<!-- Page Styles  //////////////////////////////////////////////////// -->

	<style type="text/css">

		/* ie6 png fix */		
		div { behavior: url("<?php bloginfo('stylesheet_directory'); ?>/iepngfix.htc") }
						
	</style>

	<!-- Pingback ////////////////////////////////////////////////////////////// -->

	<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />
	
	<?php wp_head(); ?>
</head>

<body>


<div style='height:100%; width:100%' align='center'>
	
	<a href="<?=$url_root?>/index.php"><div id='logo'></div></a>

	<div id='container'>
		
		<table width="100%" height="100%" cellpadding="0" cellspacing="0" border="0">
			
			<tr>
				<td width='200px' height="100%" valign="top" class='treeMenuLogo'>
				
					<div id='menuContainer' align="right">
													
						<ul id='navigation'>
										
						<?php 
							$args = array('sort_order' => 'asc', 'sort_column' => 'menu_order');
							$pages = get_pages($args);


							// Construct menu.....
																				
							foreach ($pages as $page){
							
								if ($page->post_parent == 0 && $page->post_title != 'Home'){
									
									
									$id = $page->ID;
									$title = $page->post_title;
									$link = get_page_link($page->ID);
									
									
									print("<li>");
									print("    <span class='menuHead'>$title</span>");									
									print("    <ul>");
																																							
									
									// Get child pages 
									foreach($pages as $child){
										
										if ($child->post_parent == $id){
	
											$child_id = $child->ID;
											$child_title = $child->post_title;
											$child_link = get_page_link($child->ID);									
											if ($child->ID == $page_id){
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
