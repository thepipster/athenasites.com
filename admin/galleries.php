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

    <link rel="stylesheet" href="code/js/3rdparty/jquery-ui/overcast/jquery-ui-1.8.4.custom.css" type="text/css"/>


    <link rel="stylesheet" href="code/css/Athena2.css" type="text/css" />
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
    <script src="code/js/ssMain.class.js" type="text/javascript"></script>
    <script src="code/js/utils/AthenaUtils.class.js" type="text/javascript"></script>
    <script src="code/js/DataStore.class.js" type="text/javascript"></script>

    <!-- Remote APIs -->
    <script src="code/js/remoteapi/SystemAPI.class.js" type="text/javascript"></script>
    <script src="code/js/remoteapi/MediaAPI.class.js" type="text/javascript"></script>
    <script src="code/js/remoteapi/GalleryAPI.class.js" type="text/javascript"></script>
    <script src="code/js/remoteapi/BlogAPI.class.js" type="text/javascript"></script>

    <!-- Dialog Displays -->
    <script src="code/js/dialogs/AccountDialog.class.js" type="text/javascript"></script>

    <!-- Sub-Frame Displays -->
    <script src="code/js/subframes/FolderSidebarFrame.class.js" type="text/javascript"></script>
    <script src="code/js/subframes/TagsSidebarFrame.class.js" type="text/javascript"></script>
    <script src="code/js/subframes/GalleriesSidebarFrame.class.js" type="text/javascript"></script>

    <!-- Frame Displays -->
    <script src="code/js/frames/GalleriesFrame.class.js" type="text/javascript"></script>

    <!-- Inline Style ////////////////////////////////////////////////////////////////// -->

    <style type="text/css">

        /* Hide the datepicker 'choose date' link */
        a.dp-choose-date {
            display: none;
        }

    </style>

    <!-- Inline Style ///////////////////////////////////////////////////////////////// -->

</head>

<body>

	<!-- dialogs -->
    <div id='debug_txt'></div>
    <div id='apollo_loading_display' class='transparent_50' align="center"></div>
	<div id='apollo_dialog'></div>
    <div id='apollo_loading_dialog'></div>

	<!-- logo -->
	<img class='apollo_logo' src='images/logo.png' height='35px' style='padding-top:5px; padding-left:5px;'/>

    <div id='Content' align='center'>

		<!-- menu_container -->
		<div id='menu_container'>
		    
		    <a id='dashboard_menu' class='menu_item' href='#'>Dashboard</a>
		    <a id='posts_menu' class='menu_item' href='#'>Blog</a>
		    <a id='pages_menu' class='menu_item' href='#'>Pages</a>
		    <a id='files_menu' class='menu_item' href='#'>Files</a>
		    <a id='gallery_menu' class='menu_item selected' href='#'>Galleries</a>
		    <a id='stats_menu' class='menu_item' href='#'>Stats</a>
		    <a id='settings_menu' class='menu_item' href='#'>Settings</a>
		
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
                                
		<!-- Galleries Page Content ///////////////////////////////////////////////////////////// -->

		<?php echo file_get_contents("code/html/GalleriesFrame.html") ?>

	</div><!-- Content -->

</body>
</html>

<!-- Javascript code /////////////////////////////////////////////////////////////// -->

<script type="text/javascript">

    defines.session_id = '<?php echo session_id(); ?>';
    defines.domain = '<?php echo $domain; ?>';
	
    //$(document).ready(function(){ssMain.init(<?= $current_site_id ?>);});

</script>