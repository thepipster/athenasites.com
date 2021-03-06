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
    <title>ApolloSites Admin 1.0 | Settings</title>

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

	<?php	
		if (DEV_MODE) {
			define('BUILD_MODE', 'settings');
			require_once("code/php/scripts/build_production.php");	
		}
	?>	
	
	<script src='code/js/prod_settings.js?ver=1.0' type='text/javascript'></script>
	<link rel='stylesheet' href='code/css/prod_settings.css?ver=1.0' type='text/css'/>
	
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
<div id='apollo_account_dialog'></div>
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
	        <a class='menu_item' href='/admin/posts.php'>Blog</a>
	        <a class='menu_item' href='/admin/pages.php'>Pages</a>
	        <a class='menu_item' href='/admin/files.php'>Files</a>
	        <a class='menu_item' href='/admin/galleries.php'>Galleries</a>
	        <a class='menu_item' href='/admin/stats.php'>Stats</a>
	        <a class='menu_item selected' href='#'>Settings</a>
	
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
	
			<table id='SettingsFrame' class='ViewFrame' border='0' cellpadding='0' cellspacing='0' style='width:100%; height:100%;'>
			
			    <tr valign='top' width='100%'>
			
			        <td width="50%" height="70%" style='height:100%; padding:5px;'>
			
			            <div class="frameContents">
			        	
			            	<p><strong>Tools</strong></p>            	                                   	                                       
			            	<button class='basic_button' style='' onclick="SettingsFrame.onPaintPostImporter()">Import Posts</button>
					        <?php if ($user['service_lj_import'] == 1) { ?>
							<button class='basic_button' onclick='LiveJournalImporter.show()'>LiveJournal</button>
							<?php } ?>
			            	<div align='left' id='apollo_site_settings_custom_paras_1'></div>
			        	
			        	</div>
			        	
			        </td>
			
			        <td width="50%" height="100%" style='height:100%; padding:5px;'>
			            <div class="frameContents">
			            	<div align='left' id='apollo_site_settings_custom_paras_2'></div>
			            </div>
			        </td>
			
				</tr>
				
			</table><!-- SettingsFrame -->			
			
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
    	ssMain.init(<?= $site_id ?>, ssMain.VIEW_SETTINGS);
    	Settings.init(<?= $site_id ?>);
    });

</script>