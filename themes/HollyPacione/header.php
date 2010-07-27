<?php
/**
 * @package WordPress
 * @subpackage Holly Pacione Theme
 */

// Figure out the location of this file
$discRoot = realpath(dirname(__FILE__)) . "/";
$common_code_root = substr($discRoot, 0, strpos($discRoot, 'wp-content')) . 'wp-content/CommonCode/';

require_once($common_code_root . 'php/dal/ThemeTable.class.php');

// Get fav icon
global $blog_id;
$fav_post_id = ThemeTable::getFavicon($blog_id);
if (isset($fav_post_id)){
	$post = get_post($fav_post_id);
	$fav_url = $post->guid;
}

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" <?php language_attributes(); ?>>

<head profile="http://gmpg.org/xfn/11">

	<meta http-equiv="Content-Type" content="<?php bloginfo('html_type'); ?>; charset=<?php bloginfo('charset'); ?>" />

	<title><?php wp_title('&laquo;', true, 'right'); ?> <?php bloginfo('name'); ?></title>
	
	<!-- Favicon ///////////////////////////////////////////////////// -->

	<?php
	if (!isset($fav_url)){
	?>
		<link rel="shortcut icon" type="image/ico" href="<?php bloginfo('stylesheet_directory'); ?>/favicon.ico"> 
	<?php
	}
	else {
	?>
		<link rel="shortcut icon" type="image/ico" href="<?=$fav_url?>"> 
	<?php
	}
	?>
	
	<!-- Style sheets ///////////////////////////////////////////////////// -->

	<link rel="stylesheet" href="<?php bloginfo('stylesheet_url'); ?>" type="text/css" media="screen" />
	<link rel="stylesheet" href="<?php bloginfo('stylesheet_directory'); ?>/datePicker.css" type="text/css" id="" media="print, projection, screen" />
	
	<!-- JS Includes ///////////////////////////////////////////////////// -->

	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory'); ?>/js/jquery-1.3.1.min.js"></script>
	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory'); ?>/js/AC_OETags.js"></script>
	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory'); ?>/js/jquery.validate.min.js"></script>
	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory'); ?>/js/date.js"></script>
	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory'); ?>/js/jquery.datePicker.js"></script>
	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory'); ?>/js/hollyGallery.js"></script>
	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory'); ?>/js/hollyInfoPage.js"></script>

<!--
	<script type="text/javascript" src="http://www.google-analytics.com/ga.js"></script>
-->
	<!-- Page Styles  //////////////////////////////////////////////////// -->

	<?php
		global $border_color;
		
		// Over-ride any default styles with user content	
		$background_col = ThemeTable::getGlobalParaValue($blog_id, 211);
		$logo_url = ThemeTable::getGlobalImageParaValue($blog_id, 207);
		$foreground_color = ThemeTable::getGlobalParaValue($blog_id, 212);
		$nav_text_color = ThemeTable::getGlobalParaValue($blog_id, 217);
		$border_color = ThemeTable::getGlobalParaValue($blog_id, 218);

		$blog_post_title_color = ThemeTable::getGlobalParaValue($blog_id, 219);
		$blog_image_border_width = ThemeTable::getGlobalParaValue($blog_id, 220);
		$blog_image_border_color = ThemeTable::getGlobalParaValue($blog_id, 221);

	?>

	<script type="text/javascript">
		// Make the border color choice known to JS
		border_color = '<?php if (isset($border_color)) { echo '#'.$border_color; } else { echo 'black'; }?>';
	</script>
	
	<style type="text/css">

		/* ie6 png fix */		
		div { behavior: url("<?php bloginfo('stylesheet_directory'); ?>/iepngfix.htc") }

		<?php
			if (isset($background_col)){
				echo "html { background-color: #".$background_col."; }\n";
			}

			if (isset($foreground_color)){
				echo "html { color: #".$foreground_color."; }\n";
			}

			if (isset($logo_url)){				
				echo "#nav_container { background-image: url('".$logo_url."'); }\n";
			}
			
			if (isset($nav_text_color)){				
				echo "#nav a { color: #".$nav_text_color."; }\n";
			}

			if (isset($border_color)){				
				echo "#nav li:hover {border-color: #".$border_color."; }\n";
				echo "#content {border-color: #".$border_color."; }\n";
				echo "#content .rightCol {border-color: #".$border_color."; }\n";
				echo "#content .leftCol {border-color: #".$border_color."; }\n";
			}

			if (isset($blog_post_title_color)){				
				echo "#content .blogPostTitle {color: #".$blog_post_title_color." !important; }\n";
			}

			if (isset($blog_image_border_width)){				
				echo "#content .blogImage {border-width: ".$blog_image_border_width."px; }\n";
			}

			if (isset($blog_image_border_color)){				
				echo "#content .blogImage {border-color: #".$blog_image_border_color." !important; }\n";
				/*
				echo "#content .blogImage a {border-color: #".$blog_image_border_color." !important; }\n";
				echo "#content .blogImage a:hover {border-color: #".$blog_image_border_color." !important; }\n";
				echo "#content .blogImage a:link {border-color: #".$blog_image_border_color." !important; }\n";
				echo "#content .blogImage a:visited {border-color: #".$blog_image_border_color." !important; }\n";
				echo "#content .blogImage a:active {border-color: #".$blog_image_border_color." !important; }\n";
				*/
			}
					
		?>
						
	</style>

	<!-- Pingback ////////////////////////////////////////////////////////////// -->

	<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />
		
	
	<?php wp_head(); ?>
</head>

<body onload='apolloPreloader()'>


	<div id='wrapper' align='center' style='padding-top:20px'>
	
		<div id='nav_container'>
		
			<div class='nav_bar' align="left">							
				<ul id="nav">
				
				
					<?php 
						$args = array('sort_order' => 'asc', 'sort_column' => 'menu_order');
						$pages = get_pages($args);
												
						foreach ($pages as $page){
						
							if ($page->post_parent == 0){
								//error_log(print_r($page, true));
								
								$id = $page->ID;
								$title = $page->post_title;
								$link = get_page_link($page->ID);							
								
								print("<li onmouseover=\"hpNav.mouseOver(1, $id, $id)\" onmouseout=\"hpNav.mouseOut(1, $id, $id)\" ><a id='$id' class='level1' href='$link'>$title</a>");								
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