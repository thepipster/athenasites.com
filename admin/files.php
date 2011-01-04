<?php
require_once("code/php/setup.php");

$domain = str_replace('www.', '', $_SERVER['HTTP_HOST']);
$site_id = SitesTable::getSiteIDFromDomain($domain);
$user = UserTable::getUser(SecurityUtils::getCurrentUserLevel());

if (!SecurityUtils::isLoggedInForSite($site_id)) {
    SecurityUtils::logOut();
    header("Location: index.php");
}
    
Logger::debug("$domain has site_id = $site_id");

?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>ApolloSites Admin 1.0 | Pages</title>

    <meta name="Description" content="" />
    <meta name="Keywords" content="" />

    <!-- Favicon ///////////////////////////////////////////////////// -->

    <link rel="shortcut icon" type="image/png" href="favicon.png">

    <!--[if IE]>
    <link rel="shortcut icon" href="favicon.ico">
    <![endif]-->

    <!-- PRODUCTION INCLUDES /////////////////////////////////////////////////////////// -->

    <link rel="stylesheet" href="code/js/3rdparty/jquery-ui/overcast/jquery-ui-1.8.4.custom.css" type="text/css"/>

    <script src="code/js/3rdparty/jquery-1.4.2.min.js" type="text/javascript"></script>
    <script src="code/js/3rdparty/jquery-ui/jquery-ui-1.8.4.custom.min.js" type="text/javascript"></script>

        <!-- InnovaStudio -->
        <script src="code/3rdparty/InnovaStudio/scripts/innovaeditor.js" type="text/javascript"></script>

	<?php
	
	
		if (DEV_MODE){
		
			$base_dir = FILE_ROOT . "admin";
			
			$js_list = array(
			
				// 3rd Party...
				"$base_dir/code/js/3rdparty/jquery.advancedClick.js",				
				"$base_dir/code/colorpicker/js/colorpicker.js",
				"$base_dir/code/js/3rdparty/date.format.js",
				"$base_dir/code/js/3rdparty/date.js",
				"$base_dir/code/js/3rdparty/jquery.datePicker.js",
				"$base_dir/code/js/3rdparty/jquery.typing-0.2.0.min.js",

				"$base_dir/code/js/3rdparty/swfobject.js",
				"$base_dir/code/js/3rdparty/SWFUpload/swfupload.js",
				"$base_dir/code/js/3rdparty/SWFUpload/plugins/swfupload.queue.js",
				"$base_dir/code/js/flashuploader/FileProgress.class.js",
				"$base_dir/code/js/flashuploader/FlashUploader.class.js",

				// Settings...
				"$base_dir/code/js/defines.js",
								
				// Utils...
				"$base_dir/code/js/utils/Logger.class.js",
				"$base_dir/code/js/utils/AthenaDialog.class.js",
				"$base_dir/code/js/utils/AthenaUtils.class.js",
								
				// Core....
				"$base_dir/code/js/ssMain.class.js",
				"$base_dir/code/js/DataStore.class.js",
				"$base_dir/code/js/pages/Files.class.js",
				
				// Remote API's...
				"$base_dir/code/js/remoteapi/SystemAPI.class.js",
				"$base_dir/code/js/remoteapi/BlogAPI.class.js",
				"$base_dir/code/js/remoteapi/MediaAPI.class.js",
				"$base_dir/code/js/remoteapi/GalleryAPI.class.js",
				
				// Dialogs...
				"$base_dir/code/js/dialogs/AccountDialog.class.js",
				"$base_dir/code/js/dialogs/ImagePickerDialog.class.js",
				"$base_dir/code/js/dialogs/ColorPickerDialog.class.js",
				"$base_dir/code/js/dialogs/CommentsEditDialog.class.js",

				// Sub-Frames....
				"$base_dir/code/js/subframes/FolderSidebarFrame.class.js",
				"$base_dir/code/js/subframes/TagsSidebarFrame.class.js",	
				"$base_dir/code/js/subframes/ImageSelector.class.js",	
				"$base_dir/code/js/subframes/ImageEditFrame.class.js",
				
				// Frames....
				"$base_dir/code/js/frames/SidebarFrame.class.js",
				"$base_dir/code/js/frames/FilesFrame.class.js"
			);
		
			$css_list = array(			
				"$base_dir/code/css/Athena.css",
				"$base_dir/code/css/SideBar.css",
				"$base_dir/code/css/FilesFrame.css",
				"$base_dir/code/css/ImageEditDialog.css",
				"$base_dir/code/css/ImageEditFrame.css"
			);
			
			ProductionBuilder::buildProductionJS($js_list, "$base_dir/code/js/prod_files.js", DO_MINIFY);
			ProductionBuilder::buildProductionCSS($css_list, "$base_dir/code/css/prod_files.css", DO_MINIFY);
			
		}	

	?>
	
    <script src="code/js/prod_files.js?ver=1.0" type="text/javascript"></script>

    <link rel="stylesheet" href="code/css/prod_files.css?ver=1.0" type="text/css"/>

    <!-- Inline Style ////////////////////////////////////////////////////////////////// -->

    <style type="text/css">

        /* Hide the datepicker 'choose date' link */
        a.dp-choose-date {
            display: none;
        }

    </style>

</head>

<body>

<!-- Dialogs -->

<div id='debug_txt'></div>
<div id='apollo_dialog'></div>
<div id='apollo_loading_dialog'></div>
<div id='apollo_loading_display' class='transparent_50' align="center"></div>

<!-- Logo -->

<img id='apollo_logo' src='images/logo.png' height='35px'/>

<!-- SideBar -->
<div id='SideBar' align="left"></div>

<!-- Content -->

<div id='ContentWrapper'>
	<div id='Content'>
	
	    <div id='menu_container'>
	        
	        <a class='menu_item' href='/admin/dashboard.php'>Dashboard</a>
	        <a class='menu_item' href='/admin/posts.php'>Blog</a>
	        <a class='menu_item' href='/admin/pages.php'>Pages</a>
	        <a class='menu_item selected' href='#'>Files</a>
	        <a class='menu_item' href='/admin/galleries.php''>Galleries</a>
	        <!--
	        <a class='menu_item' href='/admin/stats.php'>Stats</a>
	        -->
	        <a class='menu_item' href='/admin/settings.php'>Settings</a>
	
	        <?php
	        if ($user['service_client_gallery'] == 1) {
	            echo "<div id='' class='menu_item client_gallery_title' onclick=''>Client Gallery</div>";
	            echo "<div id='' class='menu_item' onclick=''>eStore</div>";
	        } 
	        ?>
	
	        <div class='menu_link' onclick='ssMain.onLogout()'>Logout</div>
	        <div id='account_menu' class='menu_link' onclick='AccountDialog.show()'>Account</div>
	        
	        <div class='user_message'></div>
	        
	    </div><!-- menu_container -->
					
		<div id='MainContents'>
	
			<?php echo file_get_contents("code/html/FilesFrame.html") ?>

		</div>	
	
	</div> <!-- Content -->
</div> <!-- ContentWrapper -->

</body>
</html>

<!-- Javascript code /////////////////////////////////////////////////////////////// -->

<script type="text/javascript">

    defines.session_id = '<?php echo session_id(); ?>';
    defines.domain = '<?php echo $domain; ?>';
	
    $(document).ready(function(){
    	ssMain.init(<?= $site_id ?>, ssMain.VIEW_FILES);
    	Files.init(<?= $site_id ?>);
    });

</script>