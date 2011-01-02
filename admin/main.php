<?php
require_once("code/php/setup.php");

if (!SecurityUtils::isLoggedIn()) {
    SecurityUtils::logOut();
    header("Location: index.php");
}

$user_id = SecurityUtils::getCurrentUserID();
$user_level = SecurityUtils::getCurrentUserLevel();
$user = UserTable::getUser($user_id);

// Get the site id's for this user
// If this is a super-user, then just get all the site id's
if ($user_level == 1) {
    $site_list = SitesTable::getSites();
} else {
    $site_list = SitesTable::getSitesForUser($user_id);
}

//Logger::debug("User has " . count($site_list) . " sites!");
//Logger::debug("User level = $user_level");

$site_id = CommandHelper::getPara('site_id', false, CommandHelper::$PARA_TYPE_NUMERIC);

if (isset($site_id) && $site_id > 0) {
    // Check user has access to this site!!!!
    if (!SecurityUtils::isLoggedInForSite($site_id)) {
        SecurityUtils::logOut();
        header("Location: index.php");
    }
    $current_site_id = $site_id;
} else {

    // Look at domain for site id
    $domain = str_replace('www.', '', $_SERVER['HTTP_HOST']);
    $site_id = SitesTable::getSiteIDFromDomain($domain);
    Logger::debug("Found site id = $site_id for domain $domain");

    // If the domain isn't the main domain (site_id = 1) then select from the users site list
    if ($site_id == 1) {
        $current_site_id = $site_list[0]['id'];
    } else {
        $current_site_id = $site_id;
    }
}

$domain = '';

// Get the current site domain from the site list
foreach ($site_list as $site) {
    if ($site['id'] == $current_site_id) {
        $domain = $site['domain'];
        break;
    }
}

Logger::debug("$domain has site_id = $current_site_id");

//$page = PagesTable::getPage($current_site_id, $page_id);
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>ApolloSites | Athena 1.0 </title>

    <meta name="Description" content="" />
    <meta name="Keywords" content="" />

    <!-- Favicon ///////////////////////////////////////////////////// -->

    <link rel="shortcut icon" type="image/png" href="favicon.png">

    <!--[if IE]>
    <link rel="shortcut icon" href="favicon.ico">
    <![endif]-->

    <!-- PRODUCTION INCLUDES /////////////////////////////////////////////////////////// -->


    <!-- DEV INCLUDES /////////////////////////////////////////////////////////// -->


    <!-- Load styles //////////////////////////////////////////////////////////////////// -->

    <!--
    <link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.0/themes/smoothness/jquery-ui.css" type="text/css"/>
    <link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.0/themes/redmond/jquery-ui.css" type="text/css"/>
    <link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.0/themes/cupertino/jquery-ui.css" type="text/css"/>
    <link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.2/themes/overcast/jquery-ui.css" type="text/css"/>
    -->
    <link rel="stylesheet" href="code/js/3rdparty/jquery-ui/overcast/jquery-ui-1.8.4.custom.css" type="text/css"/>


    <link rel="stylesheet" href="code/css/Athena.css" type="text/css" />
    <link rel="stylesheet" href="code/css/SideBar.css" type="text/css" />
    <link rel="stylesheet" href="code/css/FilesFrame.css" type="text/css" />
    <link rel="stylesheet" href="code/css/PagesFrame.css" type="text/css" />
    <link rel="stylesheet" href="code/css/ImageEditDialog.css" type="text/css" />
    <link rel="stylesheet" href="code/css/ImagePickerDialog.css" type="text/css" />
    <link rel="stylesheet" href="code/css/CommentDialog.css" type="text/css" />
    <link rel="stylesheet" href="code/css/ImageEditFrame.css" type="text/css" />
    <link rel="stylesheet" href="code/css/GalleryFrame.css" type="text/css" />
    <link rel="stylesheet" href="code/css/StatsFrame.css" type="text/css" />
    <link rel="stylesheet" href="code/css/Dashboard.css" type="text/css" />
    <link rel="stylesheet" href="code/css/SettingsFrame.css" type="text/css" />
    <link rel="stylesheet" href="code/css/datePicker.css" type="text/css" />

    <link rel="stylesheet" href="code/colorpicker/css/colorpicker.css" type="text/css" />
    <link rel="stylesheet" href="code/js/3rdparty/jScrollPane.css" type="text/css" />


    <!-- Javascript includes /////////////////////////////////////////////////////////// -->

    <!--
    Apollo Sites Google API Key: 
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js?key=ABQIAAAApd3TaflLK-nGV6GT_CxTqhSdm2A-7rwoGsE41YlBtCPOmvFDPxRCd_p-ugGZEcWT4iPDE9N7Rn-KXg"></script>
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.4/jquery-ui.min.js?key=ABQIAAAApd3TaflLK-nGV6GT_CxTqhSdm2A-7rwoGsE41YlBtCPOmvFDPxRCd_p-ugGZEcWT4iPDE9N7Rn-KXg"></script>
    -->
    <script src="code/js/3rdparty/jquery-1.4.2.min.js" type="text/javascript"></script>
    <script src="code/js/3rdparty/jquery-ui/jquery-ui-1.8.4.custom.min.js" type="text/javascript"></script>

            
    <script src="code/js/3rdparty/jquery.validate.min.js" type="text/javascript"></script>
    <script src="code/js/3rdparty/jquery.typing-0.2.0.min.js" type="text/javascript"></script><!-- libray to allow us to know when a user has stopped typing! See http://narf.pl/jquery-typing/ -->
    <script src="code/js/3rdparty/jquery.json-2.2.js" type="text/javascript" type="text/javascript"></script>

	<!--[if IE]><script src="code/js/3rdparty/flot/excanvas.min.js" type="text/javascript"></script><![endif]-->  
    <script src="code/js/3rdparty/flot/jquery.flot.min.js" type="text/javascript"></script>
    <script src="code/js/3rdparty/flot/jquery.flot.crosshair.js" type="text/javascript"></script>
    <script src="code/js/3rdparty/jScrollPane-1.2.3.min.js" type="text/javascript"></script>
    
    <!--
    <script type="text/javascript" src="code/js/3rdparty/jquery.progressbar/js/jquery.progressbar.min.js"></script>
    -->
    <script src="code/js/3rdparty/date.js" type="text/javascript" ></script>
    <script src="code/js/3rdparty/jquery.datePicker.js" type="text/javascript"></script>
    <script src="code/js/3rdparty/jquery.advancedClick.js" type="text/javascript"></script>
<!--
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js?key=ABQIAAAApd3TaflLK-nGV6GT_CxTqhSdm2A-7rwoGsE41YlBtCPOmvFDPxRCd_p-ugGZEcWT4iPDE9N7Rn-KXg"></script>
-->
    <script src="code/js/3rdparty/swfobject.js" type="text/javascript"></script>
    <script src="code/js/3rdparty/SWFUpload/swfupload.js" type="text/javascript"></script>
    <script src="code/js/3rdparty/SWFUpload/plugins/swfupload.queue.js" type="text/javascript"></script>
    <script src="code/js/3rdparty/date.format.js" type="text/javascript"></script>

    <!-- InnovaStudio -->
    <script src="code/3rdparty/InnovaStudio/scripts/innovaeditor.js" type="text/javascript"></script>

    <!-- Color Picker -->
    <script src="code/colorpicker/js/colorpicker.js" type="text/javascript"></script>

    <!-- Utils -->
    <script src="code/js/defines.js" type="text/javascript"></script>
    <script src="code/js/utils/Logger.class.js" type="text/javascript"></script>
    <script src="code/js/utils/AthenaDialog.class.js" type="text/javascript"></script>
    <script src="code/js/utils/StatViewer.class.js" type="text/javascript"></script>
    <script src="code/js/flashuploader/FileProgress.class.js" type="text/javascript"></script>
    <script src="code/js/flashuploader/FlashUploader.class.js" type="text/javascript"></script>

    <!-- Core -->
    <script src="code/js/ssMain.class.js" type="text/javascript"></script>
    <script src="code/js/utils/AthenaUtils.class.js" type="text/javascript"></script>
    <script src="code/js/DataStore.class.js" type="text/javascript"></script>

    <!-- Remote APIs -->
    <script src="code/js/remoteapi/SystemAPI.class.js" type="text/javascript"></script>
    <script src="code/js/remoteapi/MediaAPI.class.js" type="text/javascript"></script>
    <script src="code/js/remoteapi/GalleryAPI.class.js" type="text/javascript"></script>
    <script src="code/js/remoteapi/BlogAPI.class.js" type="text/javascript"></script>

    <!-- Dialog Displays -->
    <script src="code/js/dialogs/ImageEditDialog.class.js" type="text/javascript"></script>
    <script src="code/js/dialogs/ImagePickerDialog.class.js" type="text/javascript"></script>
    <script src="code/js/dialogs/ColorPickerDialog.class.js" type="text/javascript"></script>
    <script src="code/js/dialogs/WordpressImporter.class.js" type="text/javascript"></script>
    <script src="code/js/dialogs/LiveJournalImporter.class.js" type="text/javascript"></script>
    <script src="code/js/dialogs/BloggerImporter.class.js" type="text/javascript"></script>
    <script src="code/js/dialogs/CommentsEditDialog.class.js" type="text/javascript"></script>
    <script src="code/js/dialogs/AccountDialog.class.js" type="text/javascript"></script>

    <!-- Sub-Frame Displays -->
    <script src="code/js/subframes/FolderSidebarFrame.class.js" type="text/javascript"></script>
    <script src="code/js/subframes/TagsSidebarFrame.class.js" type="text/javascript"></script>
    <script src="code/js/subframes/PagesSidebarFrame.class.js" type="text/javascript"></script>
    <script src="code/js/subframes/StatsSidebarFrame.class.js" type="text/javascript"></script>
    <script src="code/js/subframes/ImageSelector.class.js" type="text/javascript"></script>
    <script src="code/js/subframes/ImageEditFrame.class.js" type="text/javascript"></script>
    <script src="code/js/subframes/PostsSidebarFrame.class.js" type="text/javascript"></script>
    <script src="code/js/subframes/GalleriesSidebarFrame.class.js" type="text/javascript"></script>

    <!-- Frame Displays -->
    <script src="code/js/frames/DashboardFrame.class.js" type="text/javascript"></script>
    <script src="code/js/frames/FilesFrame.class.js" type="text/javascript"></script>
    <script src="code/js/frames/GalleriesFrame.class.js" type="text/javascript"></script>
    <script src="code/js/frames/PagesFrame.class.js" type="text/javascript"></script>
    <script src="code/js/frames/PostsFrame.class.js" type="text/javascript"></script>
    <script src="code/js/frames/StatsFrame.class.js" type="text/javascript"></script>
    <script src="code/js/frames/SidebarFrame.class.js" type="text/javascript"></script>
    <script src="code/js/frames/SettingsFrame.class.js" type="text/javascript"></script>

    <!-- Old
    <script src="code/js/subframes/UploadMediaFrame.class.js" type="text/javascript"></script>
    -->

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
	
    $(document).ready(function(){ssMain.init(<?= $current_site_id ?>);});

</script>