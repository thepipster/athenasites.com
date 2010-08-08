<?php
/**
 * @package WordPress
 * @subpackage Pandora Theme
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

// Get the current page id
$page_id = $wp_query->post->ID;

// Get the current parent page id
$parent_page_id = $wp_query->post->post_parent;



// DEBUG ONLY!
// TODO: REMOVE IN PRODUCTION
// Re-generate production code if on local server
/*
if (stripos($_SERVER['HTTP_HOST'], 'local') > 0){

	$theme_root = get_bloginfo("template_url");

	require_once($common_code_root . 'php/utils/ApolloLogger.class.php');
	require_once($common_code_root . 'php/utils/JSMin.class.php');
	require_once($common_code_root . 'php/utils/CSSMin.class.php');
	require_once($theme_root . 'php/ProductionCodeBuilder.class.php');
						
	ProductionCodeBuilder::buildProductionJS($theme_root, $theme_root . 'js/pandora-min.js');
	ProductionCodeBuilder::buildApolloPluginCSS($theme_root, $theme_root . 'pandora-min.css');
}
*/

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
	
<!--
	<link rel="stylesheet" href="<?php bloginfo('stylesheet_directory'); ?>/pandora-min.css" type="text/css" media="screen" />
-->
	<link rel="stylesheet" href="<?php bloginfo('stylesheet_directory'); ?>/datePicker.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="<?php bloginfo('stylesheet_directory'); ?>/style.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="<?php bloginfo('stylesheet_directory'); ?>/jscrollpane.css" type="text/css" media="screen" />

	<link rel="stylesheet" href="<?php bloginfo('stylesheet_directory'); ?>/coda-slider.css" type="text/css" media="screen" />

	
	<!-- JS Includes ///////////////////////////////////////////////////// -->
<!--
	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory'); ?>/js/pandora-min.js"></script>
-->
	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory'); ?>/js/jquery-1.3.2.min.js"></script>
	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory'); ?>/js/AC_OETags.js"></script>
	
	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory'); ?>/js/jquery.validate.min.js"></script>
	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory'); ?>/js/date.js"></script>
	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory'); ?>/js/jquery.datePicker.js"></script>

	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory'); ?>/js/jquery.easing.1.3.js"></script>
	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory'); ?>/js/jquery.coda-slider-2.0.js"></script>

<!--
	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory'); ?>/js/jScrollPane-1.2.3.min.js"></script>
-->
	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory'); ?>/js/jScrollPane.js"></script>


	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory'); ?>/js/pandoraCommon.js"></script>
	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory'); ?>/js/pandoraSliderGallery.js"></script>
	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory'); ?>/js/pandoraInfoPage.js"></script>
	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory'); ?>/js/pandoraGallery.js"></script>

<!--	
	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory'); ?>/js/pandoraPage.js"></script>
	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory'); ?>/js/pandoraMiniGallery.js"></script>
	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory'); ?>/js/pandoraContactPage.js"></script>
	<script type="text/javascript" src="<?php bloginfo('stylesheet_directory'); ?>/js/pandoraBlogPage.js"></script>
-->

<!--
	<script type="text/javascript" src="http://www.google-analytics.com/ga.js"></script>
-->
	<!-- Page Styles  //////////////////////////////////////////////////// -->

	<?php
	/*
		global $border_color;
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
		*/	
	?>
	
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

	<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />
		
	
	<?php wp_head(); ?>
</head>

<body>

<div style='width:100%; height:100%' align='center'>

<div id='content_wrapper' align='center'>

	<table class="backgroundTable" border="1" cellspacing="0" cellpadding="0" width="100%" height="100%" style="width:100%; height:100%">
		<tr height='100%'><td>
