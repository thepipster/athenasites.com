<?php
/*
Plugin Name: Apollo Custom Field
Description: Easily pick images from your media library, and other relevant data to associate with a page/post
Version: 0.1
Author: Mike Pritchard
Author URI: http://apollosites.com/
Plugin URI: http://apollosites.com/plugins/custom_field
Text Domain: custom-field-images
Domain Path: /lang

Copyright (C) 2009-2010 Apollo Sites

NOTE: See http://codex.wordpress.org/Function_Reference/add_meta_box 
for an example of how to create a custom meta box

*/

// Update page views table
$discRoot = realpath(dirname(__FILE__)) . "/";
$common_code_root = substr($discRoot, 0, strpos($discRoot, 'wp-content')) . 'wp-content/CommonCode/';
$blog_downloads_root = substr($discRoot, 0, strpos($discRoot, 'wp-content')) . 'wp-content/blogs.dir/';

define("ACF_DIR_NAME", "ApolloCustomField");
define("ACF_URL_ROOT", 'http://' . $_SERVER['HTTP_HOST'] . substr($_SERVER['PHP_SELF'], 0, strpos($_SERVER['PHP_SELF'], "code")) . '/wp-content/plugins/'.ACF_DIR_NAME.'/'); 
define("ACF_FILE_ROOT", substr($discRoot, 0, strpos($discRoot, ACF_DIR_NAME)) . ACF_DIR_NAME . "/");
if (!defined('APC_URL_ROOT')) define("APC_URL_ROOT", 'http://' . $_SERVER['HTTP_HOST'] . substr($_SERVER['PHP_SELF'], 0, strpos($_SERVER['PHP_SELF'], "code")) . '/wp-content/CommonCode/'); 

// Load setup file
require_once($common_code_root . 'php/utils/Session.class.php');
require_once($common_code_root . 'php/utils/ApolloLogger.class.php');
require_once($common_code_root . 'php/utils/Browser.class.php');
require_once($common_code_root . 'php/utils/ImageUtils.class.php');
require_once($common_code_root . 'php/utils/CommandHelper.class.php');
require_once($common_code_root . 'php/utils/WordPressHelper.class.php');
require_once($common_code_root . 'php/dal/GalleryTable.class.php');
require_once($common_code_root . 'php/dal/ThemeTable.class.php');
require_once($common_code_root . 'php/plugin_functions.php');

// Use the admin_menu action to define the custom boxes
add_action('admin_menu', 'apolloCustomFieldInit');


// Use the save_post action to do something with the data entered 
//add_action('save_post', 'apolloCustomFieldOnSave');

// //////////////////////////////////////////////////////////////////////////////////////////////////////

/**
* Create the hooks to add the custom meta field
*/
function apolloCustomFieldInit() {

	if( function_exists( 'add_meta_box' )) {
		// add_meta_box( $id, $title, $callback, $page, $context, $priority );
//		add_meta_box( 'myplugin_sectionid', __( 'My Post Section Title', 'myplugin_textdomain' ), 'myplugin_inner_custom_box', 'post', 'advanced' );
//		add_meta_box( 'apollo_custom_field_id', '<div class="apollo_logo_title">Custom Fields</div>', 'apolloCustomFieldBox', 'page', 'normal', 'high' );
		add_meta_box( 'apollo_custom_field_id', '<div class="apollo_logo_small"></div>', 'apolloCustomFieldBox', 'page', 'normal', 'high' );
	} 
}
 
// //////////////////////////////////////////////////////////////////////////////////////////////////////
 
   
/**
* Prints the inner fields for the custom post/page section 
*/
function apolloCustomFieldBox() {

	$echo_image_data = false;
	
	// Import style sheets....	
	echo '<link type="text/css" href="'.APC_URL_ROOT.'ApolloPlugin.css" rel="stylesheet"  />';
	echo '<link type="text/css" href="'.APC_URL_ROOT.'colorpicker/css/colorpicker.css" rel="stylesheet"  />';
	/*
	echo '<link type="text/css" href="'.ACF_URL_ROOT.'acf_style.css" rel="stylesheet"  />';
	echo '<link type="text/css" href="'.APC_URL_ROOT.'jquery-themes/black-tie/ui.all.css" rel="stylesheet"  />';
	echo '<link type="text/css" href="'.APC_URL_ROOT.'colorpicker/css/colorpicker.css" rel="stylesheet"  />';
	echo '<link type="text/css" href="'.APC_URL_ROOT.'css/ImageSelector.css" rel="stylesheet"  />';
	echo '<link type="text/css" href="'.APC_URL_ROOT.'css/ApolloCommon.css" rel="stylesheet"  />';
*/
	// Get the current page id
	//$page_id = $wp_query->post->ID;
	
	if (isset($_REQUEST['post'])){
		
		$page_id = $_REQUEST['post'];
		$meta = get_post_meta($page_id, '_wp_page_template');
		$theme_id = ThemeTable::getThemeIDFromTemplateName(get_user_option('template'));
		$theme_data_list = ThemeTable::getThemeParas($theme_id, $meta[0]);
		global $blog_id;		
				
	//	echo '<div class="wrap" style="position:relative;">';	
	    echo "<div id='apollo_custom_fields' id='ApolloContentWrapper' class='wrapper' align='left'>";


		if (count($theme_data_list) == 0){
			echo "   <p>No custom fields required for this page</p>";
	        echo "</div> <!-- apollo_custom_fields -->";		
			//echo "</div>";
			return;
		}
		
				
		echo '<table class="widefat">';
		echo '<thead>';
		echo '   <tr>';
		echo '      <th>Parameter</th>';
		echo '      <th colspan="2">Current Value</th>';
		echo '      <th>About</th>';
		echo '   </tr>';
		echo '</thead>';
		echo '<tbody>';
		
		$ct = 0;
						
		foreach($theme_data_list as $theme_para){
		
			$theme_para_id = $theme_para['id'];
			
			$para_value = PageParasTable::getParaValue($page_id, $theme_para_id, $blog_id);
			
			$tags = array("'", "\"");
			$replace = array("\'","\'");
			$desc_text = str_replace($tags, $replace, $theme_para['description']);
			$help_text = str_replace($tags, $replace, $theme_para['help_text']);
			
			$para_display_value = $para_value;

			//error_log("Theme Para ID: $theme_para_id Page ID = $page_id Val = $para_value");
			
			if(!isset($para_value)){
				$para_value = 'default';
				$para_display_value = 'default';
			}
			

			if ($ct % 2 == 0){
				echo '<tr class="alternate" valign="middle">';
			}
			else {
				echo '<tr valign="middle">';
			}
			$ct++;
			
			
			if ($theme_para['para_type'] == 'gallery'){
				echo '<td class="acf_cell">Gallery</td>';	
				echo '<td class="acf_cell"></td>';	
				echo '<td class="acf_cell" colspan="2">';	
				echo __("This page has a gallery associated with it, to add images to the gallery go to ApolloSites->EditGallery and look for this page in the dropdown menu.");
				echo '</td>';	
			}
			else {
												
				$onclick = '';	
				if ($theme_para['para_type'] == 'image'){	
					$echo_image_data = true;						
					$onclick = 'ImagePickerDialog.show(ImagePickerDialog.MODE_IMAGE, false, '.$theme_para_id.', '.$page_id.')';
					if ($para_value != 'default'){							
						$thumb_url = wp_get_attachment_thumb_url($para_value);
						$para_display_value = "<img src='".$thumb_url."' width='50'/>";
					}
				}
				else if ($theme_para['para_type'] == 'color'){	
					if ($para_value != 'default'){
						$col = $para_value;
						$para_display_value = "<div class='colorBox' style='background-color:#$para_value'></div>";
						$onclick = 'ColorPickerDialog.show(false, '.$theme_para_id.', '.$page_id.', \''.$para_value.'\')';
					}
					else {
						$onclick = 'ColorPickerDialog.show(false, '.$theme_para_id.', '.$page_id.', \'#0000ff\')';
					}						
				}
				else if ($theme_para['para_type'] == 'email'){	
					if ($para_value == 'default'){
						$para_display_value = "<input id='acf_email' type='text' value=''>";
					}
					else {
						$para_display_value = "<input id='acf_email' type='text' value='$para_value'>";
					}					
					$onclick = 'ApolloParaPicker.onSetPageEmail(\'#acf_email\', '.$theme_para_id.', '.$page_id.')';
				}							
				else if ($theme_para['para_type'] == 'spam-filter'){	
					$onclick = 'ColorPickerDialog.show(false, '.$theme_para_id.', '.$page_id.', \'#0000ff\')';				
				}			
							
				echo '<td class="acf_cell">'.$theme_para['description'].'</td>';	
				echo '<td class="acf_cell">'.$para_display_value.'</td>';	
				echo '<td class="acf_cell"><div class="apollo_change_button" onclick="'.$onclick.'"></div></td>';	
				//echo '<td class="acf_cell_middle"><span class="button" onclick="'.$onclick.'">Change</span></td>';	
				echo '<td class="acf_cell">'.$theme_para['help_text'].'</td>';	
									
			}					
			
			echo '</tr>';	
			
		}
			
						
		echo '</tbody>';
		echo '</table>';


        
        echo "</div> <!-- apollo_custom_fields -->";		
		//echo "</div>";
	
	}
	else {
		ApolloLogger::error("Post id is not set!");
		//ApolloLogger::dump($_REQUEST);
	}

	if ($echo_image_data){		
		echoImagePickerJSImageData();				
	}
}