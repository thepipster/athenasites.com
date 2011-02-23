<?php

$discRoot = realpath(dirname(__FILE__)) . "/";

require_once($discRoot . "/../setup.php");

$base_dir = FILE_ROOT . "admin";

if (!defined('DO_MINIFY')){
	define('DO_MINIFY', true);
}

if (!defined('BUILD_MODE')){
	define('BUILD_MODE', 'all');
}

// ////////////////////////////////////////////////////////////////////////////
//
// Common to all pages...
//
// ////////////////////////////////////////////////////////////////////////////

$js_common_list = array(
	"$base_dir/code/colorpicker/js/colorpicker.js", // This needs to be first...
	// 3rd Party...
	"$base_dir/code/js/3rdparty/jquery.advancedClick.js",				
	"$base_dir/code/js/3rdparty/jquery.typing-0.2.0.min.js",	
	"$base_dir/code/js/3rdparty/jquery.json-2.2.js",
	// Settings...
	"$base_dir/code/js/defines.js",					
	// Utils...
	"$base_dir/code/js/utils/Logger.class.js",
	"$base_dir/code/js/utils/AthenaDialog.class.js",
	"$base_dir/code/js/utils/AthenaUtils.class.js",	
	"$base_dir/code/js/utils/isoCountry.class.js",	
	// Core....
	"$base_dir/code/js/ssMain.class.js",
	"$base_dir/code/js/DataStore.class.js",	
	// Remote API's...
	"$base_dir/code/js/remoteapi/BillingAPI.class.js",
	"$base_dir/code/js/remoteapi/StatsAPI.class.js",
	"$base_dir/code/js/remoteapi/SystemAPI.class.js",
	"$base_dir/code/js/remoteapi/BlogAPI.class.js",
	"$base_dir/code/js/remoteapi/PagesAPI.class.js",
	"$base_dir/code/js/remoteapi/MediaAPI.class.js",
	"$base_dir/code/js/remoteapi/GalleryAPI.class.js",	
	// Dialogs...
	"$base_dir/code/js/dialogs/AccountDialog.class.js",	
	// Frames
	"$base_dir/code/js/frames/SidebarFrame.class.js"	
);

$css_common_list = array(
	"$base_dir/code/css/AccountDialog.css",
	"$base_dir/code/css/Athena.css",
	"$base_dir/code/css/SideBar.css"
);


// ////////////////////////////////////////////////////////////////////////////
//
// Build Dashboard page...........
//
// ////////////////////////////////////////////////////////////////////////////

if (BUILD_MODE == 'dashboard' || BUILD_MODE == 'all'){

	$js_list = array(
		// 3rd Party...
		"$base_dir/code/js/3rdparty/flot/excanvas.min.js",
		"$base_dir/code/js/3rdparty/flot/jquery.flot.min.js",
		"$base_dir/code/js/3rdparty/flot/jquery.flot.crosshair.js",
		"$base_dir/code/js/3rdparty/date.format.js",
		"$base_dir/code/js/3rdparty/date.js",
		// Utils...
		"$base_dir/code/js/utils/StatViewer.class.js",			
		// Frames....
		"$base_dir/code/js/frames/DashboardFrame.class.js",
		// Page
		"$base_dir/code/js/pages/Dashboard.class.js"
	);
	
	$css_list = array(
		"$base_dir/code/css/StatsFrame.css",			
		"$base_dir/code/css/Dashboard.css"			
	);
	
	ProductionBuilder::buildProductionJS(array_merge($js_common_list, $js_list), "$base_dir/code/js/prod_dashboard.js", DO_MINIFY);
	ProductionBuilder::buildProductionCSS(array_merge($css_common_list, $css_list), "$base_dir/code/css/prod_dashboard.css", DO_MINIFY);
}
		
// ////////////////////////////////////////////////////////////////////////////
//
// Build Posts page...........
//
// ////////////////////////////////////////////////////////////////////////////
	
if (BUILD_MODE == 'posts' || BUILD_MODE == 'all'){
	
	$js_list = array(
		// 3rd Party...
	//	"$base_dir/code/3rdparty/InnovaStudio/scripts/innovaeditor.js",
		"$base_dir/code/js/3rdparty/date.format.js",
		"$base_dir/code/js/3rdparty/date.js",
		"$base_dir/code/js/3rdparty/jquery.datePicker.js",
		// Dialogs...
		"$base_dir/code/js/dialogs/ImagePickerDialog.class.js",
		"$base_dir/code/js/dialogs/ColorPickerDialog.class.js",
		"$base_dir/code/js/dialogs/CommentsEditDialog.class.js",
		// Sub-Frames....
		"$base_dir/code/js/subframes/PostsSidebarFrame.class.js",
		"$base_dir/code/js/subframes/ImageSelector.class.js",	
		"$base_dir/code/js/subframes/ImageEditFrame.class.js",	
		// Frames....
		"$base_dir/code/js/frames/PostsFrame.class.js",
		// Page
		"$base_dir/code/js/pages/Posts.class.js"
	);
	
	$css_list = array(			
		"$base_dir/code/css/PagesFrame.css",
		// "$base_dir/code/css/PostsFrame.css", Merged posts and pages, so no need of this style sheet
		"$base_dir/code/colorpicker/css/colorpicker.css",
		"$base_dir/code/css/datePicker.css",
		"$base_dir/code/css/ImageEditDialog.css",
		"$base_dir/code/css/ImagePickerDialog.css",
		"$base_dir/code/css/CommentDialog.css",
		"$base_dir/code/css/ImageEditFrame.css"
	);
	
	ProductionBuilder::buildProductionJS(array_merge($js_common_list, $js_list), "$base_dir/code/js/prod_posts.js", DO_MINIFY);
	ProductionBuilder::buildProductionCSS(array_merge($css_common_list, $css_list), "$base_dir/code/css/prod_posts.css", DO_MINIFY);		

}

// ////////////////////////////////////////////////////////////////////////////
//
// Build Pages page...........
//
// ////////////////////////////////////////////////////////////////////////////

if (BUILD_MODE == 'pages' || BUILD_MODE == 'all'){

	$js_list = array(
		// 3rd Party...
	//	"$base_dir/code/3rdparty/InnovaStudio/scripts/innovaeditor.js",
		"$base_dir/code/js/3rdparty/date.format.js",
		"$base_dir/code/js/3rdparty/date.js",
		"$base_dir/code/js/3rdparty/jquery.datePicker.js",
		// Dialogs...
		"$base_dir/code/js/dialogs/ImagePickerDialog.class.js",
		"$base_dir/code/js/dialogs/ColorPickerDialog.class.js",
		"$base_dir/code/js/dialogs/CommentsEditDialog.class.js",
		// Sub-Frames....
		"$base_dir/code/js/subframes/PagesSidebarFrame.class.js",
		"$base_dir/code/js/subframes/ImageSelector.class.js",	
		"$base_dir/code/js/subframes/ImageEditFrame.class.js",	
		// Frames....
		"$base_dir/code/js/frames/PagesFrame.class.js",
		// Page
		"$base_dir/code/js/pages/Pages.class.js"
	);
	
	$css_list = array(			
		"$base_dir/code/css/PagesFrame.css",
		// "$base_dir/code/css/PostsFrame.css", Merged posts and pages, so no need of this style sheet
		"$base_dir/code/colorpicker/css/colorpicker.css",
		"$base_dir/code/css/datePicker.css",
		"$base_dir/code/css/ImageEditDialog.css",
		"$base_dir/code/css/ImagePickerDialog.css",
		"$base_dir/code/css/CommentDialog.css",
		"$base_dir/code/css/ImageEditFrame.css"
	);
	
	ProductionBuilder::buildProductionJS(array_merge($js_common_list, $js_list), "$base_dir/code/js/prod_pages.js", DO_MINIFY);
	ProductionBuilder::buildProductionCSS(array_merge($css_common_list, $css_list), "$base_dir/code/css/prod_pages.css", DO_MINIFY);
	
}
		
// ////////////////////////////////////////////////////////////////////////////
//
// Build Files page...........
//
// ////////////////////////////////////////////////////////////////////////////

if (BUILD_MODE == 'files' || BUILD_MODE == 'all'){
	
	$js_list = array(
		// 3rd Party...
		"$base_dir/code/js/3rdparty/date.format.js",
		"$base_dir/code/js/3rdparty/date.js",
		"$base_dir/code/js/3rdparty/jquery.datePicker.js",
		"$base_dir/code/js/3rdparty/swfobject.js",
		"$base_dir/code/js/3rdparty/SWFUpload/swfupload.js",
		"$base_dir/code/js/3rdparty/SWFUpload/plugins/swfupload.queue.js",
		"$base_dir/code/js/flashuploader/FileProgress.class.js",
		"$base_dir/code/js/flashuploader/FlashUploader.class.js",
		 // Dialogs...
		"$base_dir/code/js/dialogs/ImagePickerDialog.class.js",
		"$base_dir/code/js/dialogs/ColorPickerDialog.class.js",
		"$base_dir/code/js/dialogs/CommentsEditDialog.class.js",
		// Sub-Frames....
		"$base_dir/code/js/subframes/FolderSidebarFrame.class.js",
		"$base_dir/code/js/subframes/TagsSidebarFrame.class.js",	
		"$base_dir/code/js/subframes/ImageSelector.class.js",	
		"$base_dir/code/js/subframes/ImageEditFrame.class.js",
		// Frames....
		"$base_dir/code/js/frames/FilesFrame.class.js",
		// Page
		"$base_dir/code/js/pages/Files.class.js"
	);
	
	$css_list = array(			
		"$base_dir/code/css/FilesFrame.css",
		"$base_dir/code/css/ImageEditDialog.css",
		"$base_dir/code/css/ImageEditFrame.css"
	);
	
	ProductionBuilder::buildProductionJS(array_merge($js_common_list, $js_list), "$base_dir/code/js/prod_files.js", DO_MINIFY);
	ProductionBuilder::buildProductionCSS(array_merge($css_common_list, $css_list), "$base_dir/code/css/prod_files.css", DO_MINIFY);
		
}
			
// ////////////////////////////////////////////////////////////////////////////
//
// Build Galleries page...........
//
// ////////////////////////////////////////////////////////////////////////////
		
if (BUILD_MODE == 'galleries' || BUILD_MODE == 'all'){
			
	$js_list = array(
		// Sub-Frames....
		"$base_dir/code/js/subframes/FolderSidebarFrame.class.js",
		"$base_dir/code/js/subframes/TagsSidebarFrame.class.js",	
		"$base_dir/code/js/subframes/GalleriesSidebarFrame.class.js",	
		// Frames....
		"$base_dir/code/js/frames/GalleriesFrame.class.js",
		// Page
		"$base_dir/code/js/pages/Galleries.class.js"		
	);
	
	$css_list = array(
		"$base_dir/code/css/GalleryFrame.css"			
	);
	
	ProductionBuilder::buildProductionJS(array_merge($js_common_list, $js_list), "$base_dir/code/js/prod_galleries.js", DO_MINIFY);
	ProductionBuilder::buildProductionCSS(array_merge($css_common_list, $css_list), "$base_dir/code/css/prod_galleries.css", DO_MINIFY);
	
}

// ////////////////////////////////////////////////////////////////////////////
//
// Build Stats page...........
//
// ////////////////////////////////////////////////////////////////////////////
	
if (BUILD_MODE == 'stats' || BUILD_MODE == 'all'){
		
	$js_list = array(
		// 3rd Party...
		"$base_dir/code/js/3rdparty/flot/excanvas.min.js",
		"$base_dir/code/js/3rdparty/flot/jquery.flot.min.js",
		"$base_dir/code/js/3rdparty/flot/jquery.flot.crosshair.js",
		// Sub-Frames....
		"$base_dir/code/js/subframes/StatsSidebarFrame.class.js",
		// Utils...
		"$base_dir/code/js/data/StatsStore.class.js",			
		"$base_dir/code/js/utils/StatViewer.class.js",			
		// Frames....
		"$base_dir/code/js/frames/StatsFrame.class.js",
		// Page
		"$base_dir/code/js/pages/Stats.class.js"
	);
	
	$css_list = array(
		"$base_dir/code/css/PagesFrame.css",
		"$base_dir/code/css/StatsFrame.css"
	);
	
	ProductionBuilder::buildProductionJS(array_merge($js_common_list, $js_list), "$base_dir/code/js/prod_stats.js", DO_MINIFY);
	ProductionBuilder::buildProductionCSS(array_merge($css_common_list, $css_list), "$base_dir/code/css/prod_stats.css", DO_MINIFY);

}

// ////////////////////////////////////////////////////////////////////////////
//
// Build Settings page...........
//
// ////////////////////////////////////////////////////////////////////////////
	
if (BUILD_MODE == 'settings' || BUILD_MODE == 'all'){
		
	$js_list = array(
		// 3rd Party...
		"$base_dir/code/js/3rdparty/swfobject.js",
		// Dialogs...
		"$base_dir/code/js/dialogs/AccountDialog.class.js",
		"$base_dir/code/js/dialogs/ImagePickerDialog.class.js",
		"$base_dir/code/js/dialogs/ColorPickerDialog.class.js",	
		"$base_dir/code/js/dialogs/WordpressImporter.class.js",
		"$base_dir/code/js/dialogs/LiveJournalImporter.class.js",
		"$base_dir/code/js/dialogs/BloggerImporter.class.js",
		// Sub-Frames....
		"$base_dir/code/js/subframes/ImageSelector.class.js",		
		// Frames....
		"$base_dir/code/js/frames/SettingsFrame.class.js",
		// Page
		"$base_dir/code/js/pages/Settings.class.js"
	);
	
	$css_list = array(
		"$base_dir/code/css/ImagePickerDialog.css",
		"$base_dir/code/css/ImageEditFrame.css",
		"$base_dir/code/css/SettingsFrame.css"			
	);
	
	ProductionBuilder::buildProductionJS(array_merge($js_common_list, $js_list), "$base_dir/code/js/prod_settings.js", DO_MINIFY);
	ProductionBuilder::buildProductionCSS(array_merge($css_common_list, $css_list), "$base_dir/code/css/prod_settings.css", DO_MINIFY);

}

// ////////////////////////////////////////////////////////////////////////////
//
// Build ALL!!!...........
//
// ////////////////////////////////////////////////////////////////////////////

/*
$js_all_list = array(


	//"code/js/3rdparty/jquery-1.4.2.min.js",
	//"code/js/3rdparty/jquery-ui/jquery-ui-1.8.4.custom.min.js",
    // Color Picker -->
	"$base_dir/code/colorpicker/js/colorpicker.js",


	"$base_dir/code/js/3rdparty/jquery.validate.min.js",
	"$base_dir/code/js/3rdparty/jquery.typing-0.2.0.min.js",
	"$base_dir/code/js/3rdparty/jquery.json-2.2.js",
	"$base_dir/code/js/3rdparty/flot/excanvas.min.js",
	"$base_dir/code/js/3rdparty/flot/jquery.flot.min.js",
	"$base_dir/code/js/3rdparty/flot/jquery.flot.crosshair.js",
	"$base_dir/code/js/3rdparty/jScrollPane-1.2.3.min.js",
	
	"$base_dir/code/js/3rdparty/date.js",
	"$base_dir/code/js/3rdparty/jquery.datePicker.js",
	"$base_dir/code/js/3rdparty/jquery.advancedClick.js",

	"$base_dir/code/js/3rdparty/swfobject.js",
	"$base_dir/code/js/3rdparty/SWFUpload/swfupload.js",
	"$base_dir/code/js/3rdparty/SWFUpload/plugins/swfupload.queue.js",
	"$base_dir/code/js/3rdparty/date.format.js",

    // InnovaStudio -->
	//"code/3rdparty/InnovaStudio/scripts/innovaeditor.js",


    // Utils -->
	"$base_dir/code/js/defines.js",
	"$base_dir/code/js/utils/Logger.class.js",
	"$base_dir/code/js/utils/AthenaDialog.class.js",
	"$base_dir/code/js/utils/StatViewer.class.js",
	"$base_dir/code/js/flashuploader/FileProgress.class.js",
	"$base_dir/code/js/flashuploader/FlashUploader.class.js",

    // Core -->
	"$base_dir/code/js/ssMain.class.js",
	"$base_dir/code/js/utils/AthenaUtils.class.js",
	"$base_dir/code/js/DataStore.class.js",

    // Remote APIs -->
	"$base_dir/code/js/remoteapi/SystemAPI.class.js",
	"$base_dir/code/js/remoteapi/MediaAPI.class.js",
	"$base_dir/code/js/remoteapi/GalleryAPI.class.js",
	"$base_dir/code/js/remoteapi/BlogAPI.class.js",

    // Dialog Displays -->
	"$base_dir/code/js/dialogs/ImageEditDialog.class.js",
	"$base_dir/code/js/dialogs/ImagePickerDialog.class.js",
	"$base_dir/code/js/dialogs/ColorPickerDialog.class.js",
	"$base_dir/code/js/dialogs/WordpressImporter.class.js",
	"$base_dir/code/js/dialogs/LiveJournalImporter.class.js",
	"$base_dir/code/js/dialogs/BloggerImporter.class.js",
	"$base_dir/code/js/dialogs/CommentsEditDialog.class.js",
	"$base_dir/code/js/dialogs/AccountDialog.class.js",

    // Sub-Frame Displays -->
	"$base_dir/code/js/subframes/FolderSidebarFrame.class.js",
	"$base_dir/code/js/subframes/TagsSidebarFrame.class.js",
	"$base_dir/code/js/subframes/PagesSidebarFrame.class.js",
	"$base_dir/code/js/subframes/StatsSidebarFrame.class.js",
	"$base_dir/code/js/subframes/ImageSelector.class.js",
	"$base_dir/code/js/subframes/ImageEditFrame.class.js",
	"$base_dir/code/js/subframes/PostsSidebarFrame.class.js",
	"$base_dir/code/js/subframes/GalleriesSidebarFrame.class.js",

    // Frame Displays
	"$base_dir/code/js/frames/DashboardFrame.class.js",
	"$base_dir/code/js/frames/FilesFrame.class.js",
	"$base_dir/code/js/frames/GalleriesFrame.class.js",
	"$base_dir/code/js/frames/PagesFrame.class.js",
	"$base_dir/code/js/frames/PostsFrame.class.js",
	"$base_dir/code/js/frames/StatsFrame.class.js",
	"$base_dir/code/js/frames/SidebarFrame.class.js",
	"$base_dir/code/js/frames/SettingsFrame.class.js"
	
);


$css_all_list = array(
	"$base_dir/code/js/3rdparty/jquery-ui/overcast/jquery-ui-1.8.4.custom.css",
	"$base_dir/code/css/Athena.css",
	"$base_dir/code/css/SideBar.css",
	"$base_dir/code/css/FilesFrame.css",
	"$base_dir/code/css/PagesFrame.css",
	"$base_dir/code/css/ImageEditDialog.css",
	"$base_dir/code/css/ImagePickerDialog.css",
	"$base_dir/code/css/CommentDialog.css",
	"$base_dir/code/css/ImageEditFrame.css",
	"$base_dir/code/css/GalleryFrame.css",
	"$base_dir/code/css/StatsFrame.css",
	"$base_dir/code/css/Dashboard.css",
	"$base_dir/code/css/SettingsFrame.css",
	"$base_dir/code/css/datePicker.css",
	"$base_dir/code/colorpicker/css/colorpicker.css",
	"$base_dir/code/js/3rdparty/jScrollPane.css"	
);


// ProductionBuilder::buildProductionJS($js_all_list, "$base_dir/code/js/prod_apollo.js", DO_MINIFY);
// ProductionBuilder::buildProductionCSS($css_all_list, "$base_dir/code/css/prod_apollo.js.css", DO_MINIFY);
*/
?>