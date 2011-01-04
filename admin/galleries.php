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
    <title>ApolloSites Admin 1.0 | Galleries</title>

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

	<?php
	
	
		if (strpos("_" . $_SERVER['HTTP_HOST'], "apollo.local") > 0){
		
			$base_dir = FILE_ROOT . "admin";
			
			$js_list = array(
			
				// Settings...
				"$base_dir/code/js/defines.js",
				
				// Utils...
				"$base_dir/code/js/utils/Logger.class.js",
				"$base_dir/code/js/utils/AthenaDialog.class.js",
				"$base_dir/code/js/utils/AthenaUtils.class.js",
				
				// Core....
				"$base_dir/code/js/ssCommon.class.js",
				"$base_dir/code/js/DataStore.class.js",
				
				// Remote API's...
				"$base_dir/code/js/remoteapi/MediaAPI.class.js",
				"$base_dir/code/js/remoteapi/GalleryAPI.class.js",
				
				// Dialogs...
				"$base_dir/code/js/dialogs/AccountDialog.class.js",
				
				// Sub-Frames....
				"$base_dir/code/js/subframes/FolderSidebarFrame.class.js",
				"$base_dir/code/js/subframes/TagsSidebarFrame.class.js",	
				"$base_dir/code/js/subframes/GalleriesSidebarFrame.class.js",
				
				// Frames....
				"$base_dir/code/js/frames/GalleriesFrame.class.js"
			);
	
			$css_list = array(
				"$base_dir/code/css/Athena.css",
				"$base_dir/code/css/SideBar.css",
				"$base_dir/code/css/GalleryFrame.css"			
			);
			
			ProductionBuilder::buildProductionJS($js_list, "$base_dir/code/js/prod_galleries.js", true);
			ProductionBuilder::buildProductionCSS($css_list, "$base_dir/code/css/prod_galleries.css", true);
			
		}	

	?>
	
    <script src="code/js/prod_galleries.js?ver=1.0" type="text/javascript"></script>

    <link rel="stylesheet" href="code/css/prod_galleries.css?ver=1.0" type="text/css"/>

<?php
/*
    <!-- DEV INCLUDES /////////////////////////////////////////////////////////// -->
    
    <link rel="stylesheet" href="code/js/3rdparty/jquery-ui/overcast/jquery-ui-1.8.4.custom.css" type="text/css"/>

    <link rel="stylesheet" href="code/css/Athena.css" type="text/css" />
    <link rel="stylesheet" href="code/css/SideBar.css" type="text/css" />
    <link rel="stylesheet" href="code/css/GalleryFrame.css" type="text/css" />

    <!-- Javascript includes /////////////////////////////////////////////////////////// -->

    <script src="code/js/3rdparty/jquery-1.4.2.min.js" type="text/javascript"></script>
    <script src="code/js/3rdparty/jquery-ui/jquery-ui-1.8.4.custom.min.js" type="text/javascript"></script>

    <script src="code/js/3rdparty/jquery.json-2.2.js" type="text/javascript" type="text/javascript"></script>
    
    <!-- Utils -->
    <script src="code/js/defines.js" type="text/javascript"></script>
    <script src="code/js/utils/Logger.class.js" type="text/javascript"></script>
    <script src="code/js/utils/AthenaDialog.class.js" type="text/javascript"></script>

    <!-- Core -->
    <script src="code/js/ssCommon.class.js" type="text/javascript"></script>
    <script src="code/js/utils/AthenaUtils.class.js" type="text/javascript"></script>
    <script src="code/js/DataStore.class.js" type="text/javascript"></script>

    <!-- Remote APIs -->
    <script src="code/js/remoteapi/MediaAPI.class.js" type="text/javascript"></script>
    <script src="code/js/remoteapi/GalleryAPI.class.js" type="text/javascript"></script>

    <!-- Dialog Displays -->
    <script src="code/js/dialogs/AccountDialog.class.js" type="text/javascript"></script>

    <!-- Sub-Frame Displays -->
    <script src="code/js/subframes/FolderSidebarFrame.class.js" type="text/javascript"></script>
    <script src="code/js/subframes/TagsSidebarFrame.class.js" type="text/javascript"></script>
    <script src="code/js/subframes/GalleriesSidebarFrame.class.js" type="text/javascript"></script>

    <!-- Frame Displays -->
    <script src="code/js/frames/GalleriesFrame.class.js" type="text/javascript"></script>
*/
?> 
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
	        
	        <div id='dashboard_menu' class='menu_item' onclick='ssMain.onShowDashboard()'>Dashboard</div>
	        <div id='posts_menu' class='menu_item' onclick='ssMain.onShowPosts()'>Blog</div>
	        <div id='pages_menu' class='menu_item' onclick='ssMain.onShowPages()'>Pages</div>
	        <div id='files_menu' class='menu_item' onclick='ssMain.onShowFiles()'>Files</div>
	        <div id='gallery_menu' class='menu_item' onclick='ssMain.onShowGalleries()'>Galleries</div>
	        <!--
	        <div id='stats_menu' class='menu_item' onclick='ssMain.onShowStats()'>Stats</div>
	        -->
	        <div id='settings_menu' class='menu_item' onclick='ssMain.onShowSettings()'>Settings</div>
	
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
		
	        <!-- Dashboard Page Content ///////////////////////////////////////////////////////////// -->
			
			<?php echo file_get_contents("code/html/DashboardFrame.html") ?>
			
			<!-- Pages/Posts Content /////////////////////////////////////////////////////////////////// -->
		
			<?php echo file_get_contents("code/html/PagesFrame.html") ?>
		
	        <!-- Files Page Content ///////////////////////////////////////////////////////////// -->
	
			<?php echo file_get_contents("code/html/FilesFrame.html") ?>
	
			<!-- Edit Images/Files Page Content ///////////////////////////////////////////////////////////// -->
	
			<?php echo file_get_contents("code/html/EditFilesFrame.html") ?>
	
	        <!-- Galleries Page Content ///////////////////////////////////////////////////////////// -->
	
			<?php echo file_get_contents("code/html/GalleriesFrame.html") ?>
	
	        <!-- Stats Page Content ///////////////////////////////////////////////////////////// -->
	
			<?php echo file_get_contents("code/html/StatsFrame.html") ?>
	
	        <!-- Settings Frame ///////////////////////////////////////////////////////////// -->
	
			<?php echo file_get_contents("code/html/SettingsFrame.html") ?>
	        
	        <!-- Account Frame ///////////////////////////////////////////////////////////// -->
	
			<?php echo file_get_contents("code/html/AccountFrame.html") ?>

		</div>	
	
	</div> <!-- Content -->
</div> <!-- ContentWrapper -->

</body>
</html>

<!-- Javascript code /////////////////////////////////////////////////////////////// -->

<script type="text/javascript">

    defines.session_id = '<?php echo session_id(); ?>';
    defines.domain = '<?php echo $domain; ?>';
	
    $(document).ready(function(){ssMain.init(<?= $site_id ?>);});

</script>