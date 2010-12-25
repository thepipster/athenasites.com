<?php
/**
 * @package WordPress
 * @subpackage Callisto Theme
 */

// Figure out the location of this file
$discRoot = realpath(dirname(__FILE__)) . "/";
$common_code_root = substr($discRoot, 0, strpos($discRoot, 'wp-content')) . 'wp-content/CommonCode/';

require_once($common_code_root . 'php/dal/ThemeTable.class.php');

// Get the current page id
$page_id = $wp_query->post->ID;

// Get the current parent page id
$parent_page_id = $wp_query->post->post_parent;

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" <?= PageManager::getLanguageAttributes(); ?>>

<head profile="http://gmpg.org/xfn/11">

	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

	<title><?= PageManager::getPageTitle() ?></title>
	
	<!-- Favicon ///////////////////////////////////////////////////// -->

	<?php
	if (!isset($fav_url)){
	?>
		<link rel="shortcut icon" type="image/ico" href="<?= PageManager::$theme_url_root; ?>/favicon.ico"> 
	<?php
	}
	else {
	?>
		<link rel="shortcut icon" type="image/ico" href="<?=$fav_url?>"> 
	<?php
	}
	?>
	
	<!-- Style sheets ///////////////////////////////////////////////////// -->

	<link rel="stylesheet" href="<?= PageManager::$theme_url_root; ?>/callisto-min.css" type="text/css" media="screen" />
	
	<!-- JS Includes ///////////////////////////////////////////////////// -->

	<script type="text/javascript" src="<?= PageManager::$theme_url_root; ?>/js/callisto-min.js"></script>

<!--
	<script type="text/javascript" src="http://www.google-analytics.com/ga.js"></script>
-->
	<!-- Page Styles  //////////////////////////////////////////////////// -->

	<?php
		global $border_color;
/*
400, logo url
401, fav icon
402, background color
403, foreground color
404, menu text color
405, footer text
406, google tracking code
407, 
408, gallerypage.php (gallery)
409, menu selected color
410, border color
411, border width (small_text)
*/		
		global $background_col, $logo_url, $foreground_color, $nav_text_color, $nav_selected_text_color, $border_color, $border_width, $copyright_notice, $google_tracking_code;
		
		// Over-ride any default styles with user content	
		$background_col = ThemeTable::getGlobalParaValue($blog_id, 402);
		$logo_url = ThemeTable::getGlobalImageParaValue($blog_id, 400);
		$foreground_color = ThemeTable::getGlobalParaValue($blog_id, 403);
		$nav_text_color = ThemeTable::getGlobalParaValue($blog_id, 404);
		$copyright_notice = ThemeTable::getGlobalParaValue($blog_id, 405);
		$google_tracking_code = ThemeTable::getGlobalParaValue($blog_id, 406);
		$nav_selected_text_color = ThemeTable::getGlobalParaValue($blog_id, 409);
		$border_color = ThemeTable::getGlobalParaValue($blog_id, 410);
		$border_width = ThemeTable::getGlobalParaValue($blog_id, 411);		
	?>
	
	<style type="text/css">

		/* ie6 png fix */		
		div { behavior: url("<?= PageManager::$theme_url_root; ?>/iepngfix.htc") }

		<?php
			if (isset($background_col)){
				echo "html { background-color: #".$background_col."; }\n";
			}

			if (isset($foreground_color)){
				echo "html { color: #".$foreground_color."; }\n";
			}

			if (isset($logo_url)){				
				//echo "#nav_container { background-image: url('".$logo_url."'); }\n";
			}
			
			if (isset($nav_text_color)){				
				echo "#nav a { color: #".$nav_text_color."; }\n";
			}

			if (isset($nav_selected_text_color)){				
				echo "#nav .level1:hover { color: #".$nav_text_color.";}\n";
			}

			if (isset($border_color)){				
				echo "#nav li:hover {border-color: #".$border_color."; }\n";
				echo "#content {border-color: #".$border_color."; }\n";
				echo "#content .rightCol {border-color: #".$border_color."; }\n";
				echo "#content .leftCol {border-color: #".$border_color."; }\n";
				echo "#content .galback {background-color: #".$border_color."; }\n";
			}
			
			if (isset($border_width)){				
				echo "#nav li:hover {border-width: ".$border_width."px; }\n";
				echo "#content {border-width: ".$border_width."px; }\n";
				echo "#content .rightCol {border-width: ".$border_width."px; }\n";
				echo "#content .leftCol {border-width: ".$border_width."px; }\n";
			}			
					
		?>
						
	</style>

	<!-- Pingback ////////////////////////////////////////////////////////////// -->

	<link rel="pingback" href="<?= PageManager::getPingBackURL();?>" />
		
	
	<?php wp_head(); ?>
</head>

<body>


	<div id='wrapper' align='center' style='margin-top:20px'>
	
		<div id='nav_container'>
					
			<a href='<?= bloginfo('url'); ?>'><img id='logo' src='<?=$logo_url?>'/></a>
			
			<div class='nav_bar' align="right">		
								
				<ul id="nav">
								
					<?php 
						$args = array('sort_order' => 'asc', 'sort_column' => 'menu_order');
						$pages = get_pages($args);
							
						//error_log("Page ID: $page_id Parent Page ID: $parent_page_id");
												
						foreach ($pages as $page){
						
							if ($page->post_parent == 0){
								//error_log(print_r($page, true));
								
								$id = $page->ID;
								$title = $page->post_title;
								$link = get_page_link($page->ID);							
								
								// Blog show as page id=1, even if its not. Probably because the blog
								// is set as the home page
								if (strpos($_SERVER["REQUEST_URI"], $page->post_name)){
									$page_id = $id;
								}
								
								//error_log("[$id] $title ");
								
								if ($page_id == $id || $parent_page_id == $id){
									print("<span class='nav_spacer'></span><li onmouseover=\"hpNav.mouseOver(1, $id, $id)\" onmouseout=\"hpNav.mouseOut(1, $id, $id)\" ><a id='$id' class='level1 selected' href='$link'>$title</a>");								
								}
								else {
									print("<span class='nav_spacer'></span><li onmouseover=\"hpNav.mouseOver(1, $id, $id)\" onmouseout=\"hpNav.mouseOut(1, $id, $id)\" ><a id='$id' class='level1' href='$link'>$title</a>");								
								}
								print("    <ul>");
								
								// Get child pages 
								foreach($pages as $child){
									
									if ($child->post_parent == $id){

										$child_id = $child->ID;
										$child_title = $child->post_title;
										$child_link = get_page_link($child->ID);									
										print("        <li onmouseover=\"hpNav.mouseOver(2, $id, $child_id)\" onmouseout=\"hpNav.mouseOut(2, $id, $child_id)\" id='$child_id' ><a id='$child_id' class='level2' href='$child_link'>$child_title</a>");
										
										// Paint sub-children
										print("        <ul>");
										foreach($pages as $sub_child){
											
											if ($sub_child->post_parent == $child_id){
		
												$subchild_id = $sub_child->ID;
												$subchild_title = $sub_child->post_title;
												$subchild_link = get_page_link($sub_child->ID);									
												print("            <li onmouseover=\"hpNav.mouseOver(3, $id, $subchild_id)\" onmouseout=\"hpNav.mouseOut(3, $id, $subchild_id)\" id='$subchild_id' ><a class='level3' href='$subchild_link'>$subchild_title</a>");																								
											}
										}
										print("        </ul>");
										
									}
								}
								
								
								print("    </ul>");
								
								print("</li>");
							}
							
						}			
					?>
				
				</ul>
					
			</div><!-- nav_bar -->
			
		</div>