<?php
/*
Plugin Name: Apollo Sites CMS Plugin
Plugin URI: http://apollosites.com/plugins/cmsplugin
Description: Apollo Sites Content Management Plugin
Version: 0.1
Author: Mike Pritchard
Author URI: http://apollosites.com
*/

// Figure out the location of this file
global $common_code_root;
$discRoot = realpath(dirname(__FILE__)) . "/";
$common_code_root = substr($discRoot, 0, strpos($discRoot, 'wp-content')) . 'wp-content/CommonCode/';
$blog_downloads_root = substr($discRoot, 0, strpos($discRoot, 'wp-content')) . 'wp-content/blogs.dir/';

define("THUMB_WIDTH", 50);
define("AP_DIR_NAME", "Apollo");
define("AP_FILE_ROOT", substr($discRoot, 0, strpos($discRoot, AP_DIR_NAME)) . AP_DIR_NAME . "/");
define("AP_URL_ROOT", 'http://' . $_SERVER['HTTP_HOST'] . substr($_SERVER['PHP_SELF'], 0, strpos($_SERVER['PHP_SELF'], "code")) . '/wp-content/plugins/'.AP_DIR_NAME.'/'); 
if (!defined('APC_URL_ROOT')) define("APC_URL_ROOT", 'http://' . $_SERVER['HTTP_HOST'] . substr($_SERVER['PHP_SELF'], 0, strpos($_SERVER['PHP_SELF'], "code")) . '/wp-content/CommonCode/'); 


// Can't over-ride class loader when we're inside wordpress, so need to bring in classes manually!
require_once($common_code_root . 'php/utils/ApolloLogger.class.php');
require_once($common_code_root . 'php/utils/Session.class.php');
require_once($common_code_root . 'php/utils/Browser.class.php');
require_once($common_code_root . 'php/utils/ImageUtils.class.php');
require_once($common_code_root . 'php/utils/CommandHelper.class.php');
require_once($common_code_root . 'php/utils/WordPressHelper.class.php');
require_once($common_code_root . 'php/dal/GalleryTable.class.php');
require_once($common_code_root . 'php/dal/ThemeTable.class.php');
require_once($common_code_root . 'php/dal/FolderTable.class.php');
require_once($common_code_root . 'php/dal/PageParasTable.class.php');
require_once($common_code_root . 'php/dal/ApolloPageViewsTable.class.php');

require_once($common_code_root . 'php/dal/StatsRollupTables.class.php');

require_once($common_code_root . 'php/plugin_functions.php');


/*
ApolloApolloLogger::debug("AP_FILE_ROOT = " . AP_FILE_ROOT);
ApolloApolloLogger::debug("AP_URL_ROOT = " . AP_URL_ROOT);
ApolloApolloLogger::debug("APC_URL_ROOT = " . APC_URL_ROOT);
*/

$wud = wp_upload_dir();
/*    
	   [path] => /Users/mikep/Sites/zipcollective.com/wp-content/blogs.dir/3/files/2010/01
	   [url] => http://zip.local.com/test1/files/2010/01
	   [subdir] => /2010/01
	   [basedir] => /Users/mikep/Sites/zipcollective.com/wp-content/blogs.dir/3/files/
	   [baseurl] => http://zip.local.com/test1/files
	   [error] => 
*/	

// Hook for adding admin menus
add_action('admin_menu', 'addApolloSitesMenu');
add_action('admin_init', 'apolloSitesInit');
add_action('delete_attachment', 'apolloOnDeleteAttachment');
//add_action('add_attachment', 'apolloOnAddAttachment');

// /////////////////////////////////////////////////////////////////////////////

/**
* Initialize the plug-in here
*/
function apolloSitesInit(){

	
	wp_enqueue_script('jquery');
	wp_enqueue_script('jquery-ui-dialog');
	wp_enqueue_script('jquery-ui-core');
	wp_enqueue_script('jquery-ui-sortable');
	wp_enqueue_script('jquery-ui-draggable');
	wp_enqueue_script('jquery-ui-droppable');
		
	wp_register_script('Apollo_ColorPickerBase', '/wp-content/CommonCode/colorpicker/js/colorpicker.js');
	wp_enqueue_script('Apollo_ColorPickerBase');

	if (stripos($_SERVER['HTTP_HOST'], 'local') > 0){

		// Build the master file...
		global $common_code_root;
		require_once($common_code_root . 'php/utils/ProductionCodeBuilder.class.php');
		require_once($common_code_root . 'php/utils/JSMin.class.php');
		require_once($common_code_root . 'php/utils/CSSMin.class.php');
		ProductionCodeBuilder::buildProductionJS($common_code_root . 'js/ApolloProduction.class.js', false);
		ProductionCodeBuilder::buildApolloPluginCSS($common_code_root . 'ApolloPlugin.css', false);
		
		/*
		wp_register_script('Apollo_EditGallery', '/wp-content/plugins/'.AP_DIR_NAME.'/js/EditGallery.class.js');
		wp_register_script('Apollo_Utils', '/wp-content/CommonCode/js/ApolloUtils.class.js');
		wp_register_script('Apollo_Dialog', '/wp-content/CommonCode/js/ApolloDialog.class.js');
		wp_register_script('Apollo_ImageSelector', '/wp-content/CommonCode/js/ImageSelector.class.js');
		wp_register_script('Apollo_ImagePicker', '/wp-content/CommonCode/js/ImagePickerDialog.class.js');
		wp_register_script('Apollo_ImageEditDialog', '/wp-content/CommonCode/js/ImageEditDialog.class.js');			
		wp_register_script('Apollo_ColorPicker', '/wp-content/CommonCode/js/ColorPicker.class.js');
		wp_register_script('Apollo_ParaPicker', '/wp-content/CommonCode/js/ApolloParaPicker.class.js');
		wp_register_script('Apollo_ColorPickerBase', '/wp-content/CommonCode/colorpicker/js/colorpicker.js');
		wp_register_script('Apollo_StatViewer', '/wp-content/CommonCode/js/StatViewer.class.js');
	
		// jQuery Extensions....
		wp_register_script('Apollo_Flot', '/wp-content/CommonCode/flot/jquery.flot.min.js');
		wp_register_script('Apollo_FlotXHair', '/wp-content/CommonCode/flot/jquery.flot.crosshair.js');
		wp_register_script('Apollo_ExCanvas', '/wp-content/CommonCode/flot.pie/excanvas.min.js');
		wp_register_script('Apollo_Flot_Pie', '/wp-content/CommonCode/flot.pie/jquery.flot.pie.js');
		wp_register_script('Apollo_RightClick', '/wp-content/CommonCode/js/jquery.rightClick.js');
							
		wp_enqueue_script('Apollo_Utils');
		wp_enqueue_script('Apollo_Dialog');
		wp_enqueue_script('Apollo_ImageEditDialog');
		wp_enqueue_script('Apollo_EditGallery');
		wp_enqueue_script('Apollo_ImagePicker');
		wp_enqueue_script('Apollo_ImageSelector');
		wp_enqueue_script('Apollo_ColorPicker');
		wp_enqueue_script('Apollo_ColorPickerBase');
		wp_enqueue_script('Apollo_ParaPicker');
		wp_enqueue_script('Apollo_StatViewer');
	
		wp_enqueue_script('Apollo_ExCanvas');
		wp_enqueue_script('Apollo_Flot');
		wp_enqueue_script('Apollo_FlotXHair');
		wp_enqueue_script('Apollo_Flot_Pie');
		wp_enqueue_script('Apollo_RightClick');
		*/

	}	

	wp_register_script('Apollo_Production', '/wp-content/CommonCode/js/ApolloProduction.class.js');
	wp_enqueue_script('Apollo_Production');
	
	global $wpdb;
	//$sql = $wpdb->prepare("SELECT * FROM apollo_Sessions"); 		
	//ApolloLogger::debug(">>>>> $sql");
	Session::init($wpdb);
	WordPressHelper::setupApolloSession();
			
}

// /////////////////////////////////////////////////////////////////////////////

/**
* Entry point
*/
function addApolloSitesMenu() {

//		add_meta_box( 'apollo_custom_field_id', '<div class="apollo_logo_small"></div>', 'apolloCustomFieldBox', 'page', 'normal', 'high' );

	// add_menu_page( $page_title, $menu_title, $access_level, $file, $function = '', $icon_url = '', $position = NULL 
    add_menu_page('Apollo Control', 'Apollo Sites', 7, 'apollo_control', 'apolloManager', APC_URL_ROOT . 'images/favicon.png', 4);

    // Add a submenu to the custom top-level menu:
    // add_submenu_page(parent, page_title, menu_title, capability required, file/handle, [function]); 
    add_submenu_page('apollo_control', 'Global Settings', 'Global Settings', 7, 'apollo_control', 'onGlobalSettings');

    add_submenu_page('apollo_control', 'Stats', 'Stats', 7, 'stats', 'onStats');

    add_submenu_page('apollo_control', 'Organize Media', 'Organize Media', 7, 'org_media', 'onOrganizeMedia');

    // Add a second submenu to the custom top-level menu:
    // add_submenu_page(parent, page_title, menu_title, capability required, file/handle, [function]); 
    add_submenu_page('apollo_control', 'Edit Gallery', 'Edit Gallery', 7, 'edit_galleries', 'onEditGallery');

}

// /////////////////////////////////////////////////////////////////////////////

/**
* Called when the user deletes media, we need to remove;
* Any gallery entries that use this attachment
* Any images that are associated with any pages
* Any global favicons or images 
*/
function apolloOnDeleteAttachment($postid){

	global $wpdb;
			
	//error_log("Deleted file: $postid");
	
	// Remove from the gallery table
	$wpdb->query($wpdb->prepare("DELETE FROM apollo_GalleryTable WHERE image_post_id = %d",  $postid));

	// Remove from the PageParas any images with this post id
	$wpdb->query($wpdb->prepare("DELETE pp FROM apollo_PageParas pp INNER JOIN apollo_ThemeParas tp WHERE pp.para_value = %d AND tp.para_type = 'image'",  $postid));

	// Remove from the GlobalParas any favicons with this post id
	$wpdb->query($wpdb->prepare("DELETE gp FROM apollo_GlobalParas gp INNER JOIN apollo_ThemeParas tp WHERE gp.para_value = %d AND tp.para_type = 'favicon'",  $postid));

	// Remove from the GlobalParas any images with this post id
	$wpdb->query($wpdb->prepare("DELETE gp FROM apollo_GlobalParas gp INNER JOIN apollo_ThemeParas tp WHERE gp.para_value = %d AND tp.para_type = 'image'",  $postid));
	
}
        
// /////////////////////////////////////////////////////////////////////////////

function apolloManager() { 
}

// /////////////////////////////////////////////////////////////////////////////

function onStats(){

	// TBD: STILL TESTING SO LIMIT TO SITE ADMIN ONLY!
	//if (!is_site_admin()) return;
	
	global $blog_id, $blog_downloads_root;

	// Import style sheets....	
	echo '<link type="text/css" href="'.AP_URL_ROOT.'editgal.css" rel="stylesheet"  />';
	
	echo '<div id="apollo_stats_view" id="ApolloContentWrapper"  class="wrap" style="position:relative;">';	
/*
	echo '<h2>Blog Statistics</h2>';

	$stats = get_sitestats();

	$mb = 1048576;
	$gb = 1073741824;
	
	$blog = ApolloPageViewsTable::getBlog($blog_id);

	$siteid 			= $blog['site_id'];
	$domain 			= $blog['domain'];
	$date_registered 	= date("m/d/Y", strtotime($blog['registered']));
	$date_last_update 	= date("m/d/Y H:i", strtotime($blog['last_updated']));		
	$path 				= substr($blog['path'], 0, strlen($blog['path'])-1);		
	$noPages 			= ApolloPageViewsTable::getNoPages($blog_id);
	$noPosts 			= ApolloPageViewsTable::getNoPosts($blog_id);
	$blog_details 		= get_blog_details($blog_id, true);		    	
	$media_dir 			= $blog_downloads_root . $blog_id;
	$disc_usage			= file_exists($media_dir) ? du($media_dir) : 0;
	$max_hd_space 		= get_site_option('blog_upload_space', false, false);	 
	$viewsAllTime 		= ApolloPageViewsTable::getViewsAllTime($blog_id);			
	$disc_usage_pc 		= 100 * $disc_usage / $max_hd_space;
	$disc_free 			= $max_hd_space - $disc_usge;
	
	//error_log("Disc Used: $disc_usge");
	//error_log("Total: $max_hd_space");
	//error_log("PC: $disc_usage_pc");
	
	echo '<p>';

	if ($disc_usage_pc < 40){
		$color = 'style="color:green"';	
	}
	else if ($disc_usage_pc < 80){
		$color = 'style="color:orange"';	
	}
	else if ($disc_usage_pc < 90){
		$color = 'style="color:red"';	
	}
	else {
		$color = 'style="color:red;font-weight: bold;"';	
	}
	
//	echo 'Disc usage: <span '.$color.'>' . $disc_usage_pc . ' % </span> (Used '.number_format($disc_free, 0).'MB of ' . $max_hd_space . ' MB)<br/>';
	echo '<span class="stat_field">Disc usage:</span><span class="stat_value" '.$color.'>' . $disc_usage_pc . ' %  ('.number_format($disc_usage, 2).'MB)</span><br/>';
	//echo 'Total disc space: ' . $max_hd_space . ' MB <br/>';
	//echo 'Free disc space: ' . number_format($disc_free, 0) . ' MB <br/>';
	echo '<span class="stat_field">Number pages:</span><span class="stat_value"> ' . $noPages . ' </span><br/>';
	echo '<span class="stat_field">Number posts:</span><span class="stat_value"> ' . $noPosts . ' </span><br/>';
	echo '<span class="stat_field">Last Update:</span><span class="stat_value"> ' . $date_last_update . ' </span><br/>';
	echo '<span class="stat_field">Registered:</span><span class="stat_value"> ' . $date_registered . ' </span><br/>';
	echo '</p>';
*/

	//echo '<p>PHP Memory Usage: ' . number_format(memory_get_usage()/$mb, 0) . ' MB</p>';
	
	
	// Get detailed stats for all blogs....
	//$views = ApolloPageViewsTable::getAllViews($blog_id);
	$views = StatsRollupTables::getPageViewsRollup($blog_id, 30);
	
	echo '<h2>Your stats for the last 30 days</h2>';
		
	echoPageViewsData();
	
	echo '<br/>';
	
	echo '<h2>Traffic by Page</h2>';

	echo '<table class="widefat">';
	echo '<thead>';
	echo '   <tr>';
	echo '      <th>Date</th>';
	echo '      <th>Page</th>';
	echo '      <th>Unique Visitors</th>';
	echo '      <th>Page Views</th>';
	echo '      <th>Search Queries</th>';
	echo '   </tr>';
	echo '</thead>';

	$ct = 0;
	
	foreach ($views as $view){

		$ct++;
		// class="alternate"
		
		if ($ct % 2 == 0){
			echo '<tr class="alternate">';
		}
		else {
			echo '<tr>';
		}

		echo '<td>'.date("m/d/Y", strtotime($view['rollup_date'])).'</td>';	
		echo '<td>'.$view['page_title'].'</td>';	
		echo '<td>'.$view['unique_visitors'].' ' . $view['browser_ver'] .'</td>';	
		echo '<td>'.$view['page_views'].' ' . $view['os_ver'] .'</td>';	
		echo '<td>'.$view['keywords'].'</td>';	
		
		echo '</tr>';

	}
	
	echo '</table>';
	
    echo "<br/>";
	
    echo "</div>"; // wrap
    

}

// //////////////////////////////////////////////////////////////////////////////////////////////////////

/**
* Display global settings for this blog
* 
*/
function onGlobalSettings(){

	global $blog_id;
	
	echo '<div class="wrap" id="ApolloContentWrapper"  style="position:relative;">';	

	echo '<h2>Global Settings</h2>';
	echo '<br/>';
	
	// Import style sheets....	
	echo '<link type="text/css" href="'.APC_URL_ROOT.'ApolloPlugin.css" rel="stylesheet"  />';
	echo '<link type="text/css" href="'.APC_URL_ROOT.'colorpicker/css/colorpicker.css" rel="stylesheet"  />';
/*
	echo '<link type="text/css" href="'.AP_URL_ROOT.'editgal.css" rel="stylesheet"  />';
	echo '<link type="text/css" href="'.APC_URL_ROOT.'jquery-themes/black-tie/ui.all.css" rel="stylesheet"  />';
	echo '<link type="text/css" href="'.APC_URL_ROOT.'css/ImageSelector.css" rel="stylesheet"  />';
	echo '<link type="text/css" href="'.APC_URL_ROOT.'css/ImageEditDialog.css" rel="stylesheet"  />';
	echo '<link type="text/css" href="'.APC_URL_ROOT.'css/ApolloCommon.css" rel="stylesheet"  />';
*/	

//	echo '<link type="text/css" href="http://jqueryui.com/latest/themes/base/jquery.ui.all.css" rel="stylesheet" />';
		

	$theme_id = ThemeTable::getThemeIDFromTemplateName(get_user_option('template'));
	$para_list = ThemeTable::getGlobalThemeParas($theme_id);
	
	echo '<table class="widefat">';
	echo '<thead>';
	echo '   <tr>';
	echo '      <th>Parameter</th>';
	echo '      <th colspan="2">Current Value</th>';
	echo '      <th>About</th>';
	echo '   </tr>';
	echo '</thead>';

	// Domain name
	/*
	$onclick = '';
	$domain = WordPressHelper::getDomain($blog_id);
	"http://";
	
	echo "<tr>";
	echo "<td>Domain Name</td>";
	echo "<td><input type=text value='$domain'/></td>";
	echo '<td><div class="apollo_change_button" onclick="'.$onclick.'"></div></td>';	
	echo "<td>This will change your sites domain name, to do this make sure you've set the A-Record of your domain to point to this IP address (70.32.102.87)
	, this kind of change can take 24-48 hours to take effect, so please wait until you make the change here. Don't include the '<i>http://</i>', just use 
	'<i>www.examplesite.com</i>'. See the support section of ApolloSites.com for more information. If you experience any difficulties, contact customer support.</td>";
	echo "</tr>";
	*/
	$ct = 0;
	
	foreach ($para_list as $theme_para){

		//ApolloApolloLogger::dump($para);
		
		$theme_para_id = $theme_para['id'];

		$tags = array("'", "\"");
		$replace = array("\'","\'");
		$desc_text = str_replace($tags, $replace, $theme_para['description']);
		$help_text = str_replace($tags, $replace, $theme_para['help_text']);
//		$desc_text = htmlentities($theme_para['description'], ENT_QUOTES);
//		$help_text = htmlentities($theme_para['help_text'], ENT_QUOTES);
				
		$ct++;
		// class="alternate"
		
		if ($ct % 2 == 0){
			echo '<tr class="alternate">';
		}
		else {
			echo '<tr>';
		}
	
		$current_value = ThemeTable::getGlobalParaValue($blog_id, $theme_para_id);
		if (!isset($current_value)){
			$current_value = 'default';
		}

		// Get thumnail if this is an image
		if ($theme_para['para_type'] == 'image' && $current_value != 'default'){							
			$thumb_url = wp_get_attachment_thumb_url($current_value);
			$current_value = "<img src='".$thumb_url."' width='".THUMB_WIDTH."'/>";
		}
		else if ($theme_para['para_type'] == 'favicon' && $current_value != 'default'){							
			$post = get_post($current_value);
			$thumb_url = $post->guid;
			$current_value = "<img src='".$thumb_url."' width='16'/>";
		}


			
		$onclick = '';	
		if ($theme_para['para_type'] == 'image'){							
			$onclick = 'ImagePickerDialog.show(ImagePickerDialog.MODE_IMAGE, true, '.$theme_para_id.', '.$blog_id.')';
		}
		else if ($theme_para['para_type'] == 'favicon'){							
			$onclick = 'ImagePickerDialog.show(ImagePickerDialog.MODE_FAVICON, true, '.$theme_para_id.', '.$blog_id.')';
		}
		else if ($theme_para['para_type'] == 'color'){	
			if ($current_value != 'default'){
				$col = $current_value;
				$current_value = "<div class='colorBox' style='background-color:#$col'></div>";
				$onclick = 'ColorPickerDialog.show(true, '.$theme_para_id.', '.$blog_id.', \''.$col.'\')';
			}
			else {
				$onclick = 'ColorPickerDialog.show(true, '.$theme_para_id.', '.$blog_id.', \'#0000ff\')';
			}						
		}
		else if ($theme_para['para_type'] == 'text'){	
			$onclick = "ApolloDialog.globalParaSet('text', ".$theme_para_id.", ".$blog_id.", '".$current_value."', '".$desc_text."', '".$help_text."')";			
		}    
		else if ($theme_para['para_type'] == 'email'){	
			$onclick = "ApolloDialog.globalParaSet('email', ".$theme_para_id.", ".$blog_id.", '".$current_value."', '".$desc_text."', '".$help_text."')";			
		}    
		else if ($theme_para['para_type'] == 'small-int'){	
			$onclick = "ApolloDialog.globalParaSet('small_int', ".$theme_para_id.", ".$blog_id.", '".$current_value."', '".$desc_text."', '".$help_text."')";			
		}    
		else if ($theme_para['para_type'] == 'font-size'){	
			$onclick = "ApolloDialog.globalParaSet('font-size', ".$theme_para_id.", ".$blog_id.", '".$current_value."', '".$desc_text."', '".$help_text."')";			
		}    
		else if ($theme_para['para_type'] == 'font-family'){	
			$onclick = "ApolloDialog.globalParaSet('font-family', ".$theme_para_id.", ".$blog_id.", '".$current_value."', '".$desc_text."', '".$help_text."')";			
		}    
       
		echo '<td>'.$theme_para['description'].'</td>';	
		echo '<td>'.$current_value.'</td>';	
		echo '<td><div class="apollo_change_button" onclick="'.$onclick.'"></div></td>';	
		echo '<td>'.$theme_para['help_text'].'</td>';	
		
		echo '</tr>';

	}
	
	echo '</table>';
        
    echo "</div>"; // wrap
    
    
    // Run JS....
	echoImagePickerJSImageData();

	    
}

// //////////////////////////////////////////////////////////////////////////////////////////////////////

/**
* Allows you to organize your media into folders
*/
function onOrganizeMedia(){
	
	// Import style sheets....	
	echo '<link type="text/css" href="'.APC_URL_ROOT.'ApolloPlugin.css" rel="stylesheet"  />';
/*	
	echo '<link type="text/css" href="'.AP_URL_ROOT.'editgal.css" rel="stylesheet"  />';
	echo '<link type="text/css" href="'.APC_URL_ROOT.'css/ApolloCommon.css" rel="stylesheet"  />';
	echo '<link type="text/css" href="'.APC_URL_ROOT.'jquery_themes/base/ui.all.css" rel="stylesheet"  />';
	echo '<link type="text/css" href="'.APC_URL_ROOT.'jquery-themes/black-tie/ui.all.css" rel="stylesheet"  />';
	echo '<link type="text/css" href="'.APC_URL_ROOT.'css/ImageSelector.css" rel="stylesheet"  />';
	echo '<link type="text/css" href="'.APC_URL_ROOT.'css/ImageEditDialog.css" rel="stylesheet"  />';
*/
	echo '<div id="ApolloContentWrapper">';	

	echo "<div id='apollo_gallery_edit' >";
/*
	echo "<table width='100%' cellspacing='0px'>";

	echo "   <tr>";
	echo "      <td width='140px'>";
    echo "         <h2>Folders</h2>";
    echo "         <div class='box' style='min-width: 100px; min-height:600px' id='ApolloFolderSelector'></div>";
	echo "      </td>";
	echo "      <td style='padding-left:20px'>";
    echo "         <h2>Library Images</h2>";
    echo "         <div class='box' style='min-width: 200px; min-height:600px' id='ApolloImageSelector'></div>";
	echo "      </td>";
	echo "    </tr>";
	
	echo "</table>";
*/	
    echo "    <div id='ApolloImageSelector'></div>";

	echo "</div>";

	echoImagePickerJSImageData();
		
    // Run JS....

	echo "<script type='text/javascript'>";
	
	echo '		
	
	var OrganizeMedia = {
		
		init : function(){

			//ApolloDialog.init();		
			ImageSelector.paint(ImageSelector.MODE_ORG_MEDIA)
			
		}
				
	}		
	jQuery(document).ready(function($) {OrganizeMedia.init()})
	';
	
	echo "</script>";


	echo "</div>"; //ApolloContentWrapper
}

// //////////////////////////////////////////////////////////////////////////////////////////////////////

function onEditGallery() {
	
	echo '<div class="wrap" id="ApolloContentWrapper" style="position:relative;">';	
	
	// Import style sheets....	
	echo '<link type="text/css" href="'.APC_URL_ROOT.'ApolloPlugin.css" rel="stylesheet"  />';

	global $blog_id;
//	ApolloLogger::debug(">>>> Blog ID: $blog_id");
	
	
	// Get the user's current theme id in the apollo database
	$theme_id = ThemeTable::getThemeIDFromTemplateName(get_user_option('template'));
	
	// Get a list of the gallery pages that the user has

	$galleryPages = array();
	$args = array('sort_order' => 'desc', 'sort_column' => 'menu_order');
	$pages = get_pages($args);

	// Get the gallery page data....
				
	$no_gallery_pages = 0;
	$gallery_pages = array();
	
	foreach($pages as $page){

		$page_id = $page->ID;
		$title = $page->post_title;

		$meta = get_post_meta($page_id, '_wp_page_template');
		$theme_data_list = ThemeTable::getThemeParas($theme_id, $meta[0]);

		// Get all the theme paras for this page
		
		//error_log("Page ID: $page_id Page title: $title Type: " .$theme_data_list[0]['para_type'] . " Meta: " . $meta[0]);
		
		if (isset($theme_data_list)){
			foreach($theme_data_list as $theme_data){
				if ($theme_data['para_type'] == 'gallery' || $theme_data['para_type'] == 'multi-gallery' ){
					
					$temp = array();
					$temp['page_id'] = $page_id;
					$temp['title'] = $title;
					$temp['description'] = $theme_data['description'];
					$temp['theme_para_id'] = $theme_data['id'];

					//error_log("Page ID: $page_id Page title: $title Theme para ID: " . $temp['theme_para_id'] );
					
					if ($theme_data['para_type'] == 'multi-gallery'){
						$temp['multi_gal'] = true;
					}
					else {
						$temp['multi_gal'] = false;
					}
					
					$gallery_pages[] = $temp;
				}
			}
		}
	}

	$no_galleries = count($gallery_pages);
			
	if ($no_galleries == 0){
		echo '<h2>Edit Galleries</h2>';
		echo '<p>You do not have any pages yet that support galleries.</p>';
		echo '</div>';	
		return;
	}
	
	// Load html framework....
	$current_page_id = -1;
	
	echo "<div id='apollo_gallery_edit'>";
	
    echo "   <h2>";
    echo "      <table>";
    echo "         <tr>";
        
    echo "            <td><span class='box_title'>Gallery</span></td>";
    echo "            <td style='padding-left:10px' >";
    echo "               <select id='apollo_edit_gallery_select' onChange='EditGallery.selectGallery(this.value)'>";
	
	for($i=0; $i<$no_galleries; $i++){
	
		$desc = $gallery_pages[$i]['description'];
		$title = $gallery_pages[$i]['title'];
		$page_id = $gallery_pages[$i]['page_id'];
		$multi_gal = $gallery_pages[$i]['multi_gal'];
		$theme_para_id = $gallery_pages[$i]['theme_para_id'];

	    if ($multi_gal){
		    $title .= " (muti-gallery)";
	    }

	    if ($i == 0){
	    	$current_page_id = $page_id;
		    echo "            <option value='".$theme_para_id."_".$page_id."' title='$desc' selected>$title</option>";
	    }
	    else {
		    echo "            <option value='".$theme_para_id."_".$page_id."' title='$desc'>$title</option>";
	    }
	}
	
	//ApolloLogger::dump($gallery_pages);

    echo "               </select>";
    echo "            </td>";
    echo "            <td style='padding-left:10px' >";
    echo "    		     <div class='apollo_add_slot_button' onClick='EditGallery.addSlot()'></div>";
    echo "            </td>";
    echo "            <td style='padding-left:10px' >";
    echo "    		     <div class='apollo_add_subgallery_button' style='display:none' onClick='EditGallery.addSubGallery()'></div>";
    echo "            </td>";

    echo "         </tr>";

    echo "      </table>";

    echo "   </h2>";
    
	echo "    <div id='apollo_gallery'></div>";
    echo "    <div id='ApolloImageSelector'></div>";

	echo "</div> <!-- apollo_gallery_edit -->\n";


	//
	// Pass gallery data to the JS...........
	//
	
	$gallery_data_str = '';
	for($i=0; $i<$no_galleries; $i++){
	
		if ($i != 0){ 
			$gallery_data_str .= ','; 
		};
		
		$desc = $gallery_pages[$i]['description'];
		$title = $gallery_pages[$i]['title'];
		$page_id = $gallery_pages[$i]['page_id'];
		$multi_gal = $gallery_pages[$i]['multi_gal'];
				
    	$theme_para_id = $gallery_pages[$i]['theme_para_id'];
		
		if ($multi_gal){

			$no_subgalleries = ThemeTable::getNumberGalleriesForMultiGallery($page_id);

			if (!isset($no_subgalleries) || $no_subgalleries == 0){
				// Need at least one sub-galery by default, so lets create one now
				GalleryTable::setGalleryTitle($page_id, $theme_para_id, 1, '', $blog_id);			
				PageParasTable::createParaValue($blog_id, $page_id, $theme_para_id, 1);
				$no_subgalleries = 1;
			}
			
		}
		else {
			$no_subgalleries = 1;
		}


		
	    if (!$multi_gal){
		    $gallery_data_str .= "{page_post_id: $page_id, is_multi: 0, no_galleries: 1, theme_para_id: $theme_para_id }";
	    }
	    else {
	    	
	    	$gallery_meta_list = GalleryTable::getMeta($page_id, $theme_para_id, $blog_id);

			$meta_str = '';
			$ct = 0;

			
			foreach($gallery_meta_list as $gallery_meta){
				
				if ($ct != 0){
					$meta_str .= ', ';
				}
				$ct++;
	
	    		$desc = $gallery_meta['description'];
	    		$title = $gallery_meta['title'];
	    		$gallery_number = $gallery_meta['gallery_number'];
	    		$thumb_url = wp_get_attachment_thumb_url($gallery_meta['image_post_id']);
	    		
	    		$meta_str .= "{description: '$desc', title: '$title', thumb_url: '$thumb_url', gallery_number: $gallery_number}";	    
								
		    }
						
	    	
		    //$gallery_data_str .= "{description: '$desc', title: '$title', page_post_id: $page_id, is_multi: $multi_gal, no_galleries: $no_subgalleries, theme_para_id: $theme_para_id}";
		    $gallery_data_str .= "{page_post_id: $page_id, is_multi: $multi_gal, no_galleries: $no_subgalleries, theme_para_id: $theme_para_id, meta: Array($meta_str)}";
	    }

	}
		
	echoImagePickerJSImageData();
		
    // Run JS....

	echo "<script type='text/javascript'>";
	
	echo '	
	
	// Disable text selection for the box class_exists
	/*
	jQuery(function(){
		jQuery.extend(jQuery.fn.disableTextSelect = function() {
			return this.each(function(){
				if(jQuery.browser.mozilla){//Firefox
					jQuery(this).css("MozUserSelect","none");
				}else if(jQuery.browser.msie){//IE
					jQuery(this).bind("selectstart",function(){return false;});
				}else{//Opera, etc.
					jQuery(this).mousedown(function(){return false;});
				}
			});
		});
		jQuery(".box").disableTextSelect();//No text selection on elements with a class of "box"
	});
	*/
	
	
	var EditGalleryData = {
	
		commandURL : "'.APC_URL_ROOT.'php/CommsManager.php",
		
		galleryData : Array('.$gallery_data_str.'),
	
		init : function(){
		
			//ApolloDialog.init();		
			ImageSelector.paint(ImageSelector.MODE_EDIT_GALLERY);
			EditGallery.init();
			
		}
				
	}
		
	jQuery(document).ready(function($) {EditGalleryData.init()});
	
	';
	
	echo "</script>";
	
	echo "</div>";
}

// //////////////////////////////////////////////////////////////////////////////////////////////////////

?>