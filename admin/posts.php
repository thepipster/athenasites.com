<?php
require_once("code/php/setup.php");

$domain = str_replace('www.', '', $_SERVER['HTTP_HOST']);
$site_id = SitesTable::getSiteIDFromDomain($domain);
$user = UserTable::getUser(SecurityUtils::getCurrentUserID());

if (!SecurityUtils::isLoggedInForSite($site_id)) {
    SecurityUtils::logOut();
    header("Location: index.php");
}
    
Logger::debug("$domain has site_id = $site_id");

?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>ApolloSites Admin 1.0 | Posts</title>

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

    <!-- Color Picker -->
    <script src="code/colorpicker/js/colorpicker.js" type="text/javascript"></script>
	<link rel="stylesheet" href="code/colorpicker/css/colorpicker.css" type="text/css" />

    <!-- InnovaStudio -->
    <script src="code/3rdparty/InnovaStudio/scripts/innovaeditor.js" type="text/javascript"></script>

	<?php	
		if (DEV_MODE) {
			define('BUILD_MODE', 'posts');
			require_once("code/php/scripts/build_production.php");	
		}
	?>	

	<script src='code/js/prod_posts.js?ver=1.0' type='text/javascript'></script>
	<link rel='stylesheet' href='code/css/prod_posts.css?ver=1.0' type='text/css'/>

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

<div id='apollo_account_dialog'></div>
<div id='apollo_dialog'></div>
<div id='apollo_loading_dialog'></div>
<div id='apollo_loading_display' class='transparent_50' align="center"></div>

<div id='apollo_image_picker'></div>
<div id='apollo_color_picker'></div>

<!-- Logo -->
<a href="http://apollosites.com" id='apollo_logo'><img src='images/logo.png' height='35px'/></a>

<!-- SideBar -->
<div id='SideBar' align="left"></div>

<!-- Content -->

<div id='ContentWrapper'>
	<div id='Content'>
	
	    <div id='menu_container'>
	        
	        <a class='menu_item' href='/admin/dashboard.php'>Dashboard</a>
	        <a class='menu_item selected' href='#'>Blog</a>
	        <a class='menu_item' href='/admin/pages.php'>Pages</a>
	        <a class='menu_item' href='/admin/files.php'>Files</a>
	        <a class='menu_item' href='/admin/galleries.php''>Galleries</a>
	        <a class='menu_item' href='/admin/stats.php'>Stats</a>
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
	
			<?php echo file_get_contents("code/html/PostsFrame.html") ?>

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
    	ssMain.init(<?= $site_id ?>, ssMain.VIEW_POSTS);
    	Posts.init(<?= $site_id ?>);
    });

</script>