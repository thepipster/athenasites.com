<?php

require_once("code/php/setup.php");

if(!SecurityUtils::isLoggedIn()){
//	header("Location: http://".$_SERVER['HTTP_HOST']."/admin/index.html");
	header("Location: index.html");
} 

$user_id = SecurityUtils::getCurrentUserID();
$user_level = SecurityUtils::getCurrentUserLevel();

// Get the site id's for this user

// If this is a super-user, then just get all the site id's
if ($user_level == 1){	
	$site_list = SitesTable::getSites();
}
else {
	$site_list = SitesTable::getSitesForUser($user_id);
}

//Logger::debug("User has " . count($site_list) . " sites!");
//Logger::debug("User level = $user_level");

$current_site_id = $site_list[0]['id'];

?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<title>ApolloSites | Athena 0.1 </title>

<meta name="Description" content="" />
<meta name="Keywords" content="" />

<!-- Favicon ///////////////////////////////////////////////////// -->

<link rel="icon" type="image/png" href="favicon.png">

<!--[if IE]>
<link rel="shortcut icon" href="favicon.ico">
<![endif]-->
	
<!-- Load styles //////////////////////////////////////////////////////////////////// -->
<!--
<link rel="stylesheet" href="css/SimpleScrum.css" type="text/css" /> 
-->

<!-- Load styles //////////////////////////////////////////////////////////////////// -->

<link type="text/css" href="code/js/3rdparty/jquery_ui/themes/base/ui.all.css" rel="stylesheet" />

<link rel="stylesheet" href="code/css/Athena.css" type="text/css" /> 
<link rel="stylesheet" href="code/css/SideBar.css" type="text/css" />

<link rel="stylesheet" href="code/css/FilesFrame.css" type="text/css" />
<link rel="stylesheet" href="code/css/ImageEditDialog.css" type="text/css" />

<link rel="stylesheet" href="code/css/datePicker.css" type="text/css" />

<!-- Javascript includes /////////////////////////////////////////////////////////// -->

<!-- PRODUCTION INCLUDES /////////////////////////////////////////////////////////// -->

<!-- DEV INCLUDES /////////////////////////////////////////////////////////// -->


<!-- jQuery and plugins -->
<script type="text/javascript" src="code/js/3rdparty/jquery-1.4.2.min.js"></script>
<script type="text/javascript" src="code/js/3rdparty/jquery.validate.min.js"></script>
<script type="text/javascript" src="code/js/3rdparty/jquery.json-1.3.min.js"></script>
<script type="text/javascript" src="code/js/3rdparty/flot/jquery.flot.min.js"></script>
<script type="text/javascript" src="code/js/3rdparty/flot/jquery.flot.crosshair.js"></script>

<script type="text/javascript" src="code/js/3rdparty/date.js"></script>
<script type="text/javascript" src="code/js/3rdparty/jquery.datePicker.js"></script>

<script type="text/javascript" src="code/js/3rdparty/jquery.advancedClick.js"></script>

<script type="text/javascript" src="code/js/3rdparty/jquery_ui/ui/ui.core.js"></script>
<script type="text/javascript" src="code/js/3rdparty/jquery_ui/ui/ui.draggable.js"></script>
<script type="text/javascript" src="code/js/3rdparty/jquery_ui/ui/ui.droppable.js"></script>
<script type="text/javascript" src="code/js/3rdparty/jquery_ui/ui/ui.sortable.js"></script>
<script type="text/javascript" src="code/js/3rdparty/jquery_ui/ui/ui.resizable.js"></script>
<script type="text/javascript" src="code/js/3rdparty/jquery_ui/ui/ui.dialog.js"></script>

<script type="text/javascript" src="code/js/3rdparty/swfobject.js"></script>

<script type="text/javascript" src="code/js/3rdparty/SWFUpload/swfupload.js"></script>
<script type="text/javascript" src="code/js/3rdparty/SWFUpload/plugins/swfupload.queue.js"></script>

<!-- Utils -->
<script src="code/js/defines.js" type="text/javascript"></script>
<script src="code/js/utils/Message.class.js" type="text/javascript"></script>
<script src="code/js/utils/AthenaDialog.class.js" type="text/javascript"></script>
<script src="code/js/flashuploader/FileProgress.class.js" type="text/javascript"></script>
<!--
<script src="code/js/flashuploader/flashUploaderHandler.js" type="text/javascript"></script>
-->
<script src="code/js/flashuploader/FlashUploader.class.js" type="text/javascript"></script>

<!-- Core -->
<script src="code/js/utils/AthenaUtils.class.js" type="text/javascript"></script>
<script src="code/js/DataStore.class.js" type="text/javascript"></script>

<!-- Remote APIs -->
<script src="code/js/remoteapi/SystemAPI.class.js" type="text/javascript"></script>
<script src="code/js/remoteapi/MediaAPI.class.js" type="text/javascript"></script>

<!-- Dialog Displays -->
<script src="code/js/dialogs/ImageEditDialog.class.js" type="text/javascript"></script>

<!-- Sub-Frame Displays -->
<script src="code/js/subframes/FolderMediaFrame.class.js" type="text/javascript"></script>
<script src="code/js/subframes/FolderSidebarFrame.class.js" type="text/javascript"></script>
<script src="code/js/subframes/ImageSelector.class.js" type="text/javascript"></script>

<!-- Frame Displays -->
<script src="code/js/frames/DashboardFrame.class.js" type="text/javascript"></script>
<script src="code/js/frames/FilesFrame.class.js" type="text/javascript"></script>
<script src="code/js/frames/GalleriesFrame.class.js" type="text/javascript"></script>
<script src="code/js/frames/PagesFrame.class.js" type="text/javascript"></script>
<script src="code/js/frames/PostsFrame.class.js" type="text/javascript"></script>
<script src="code/js/frames/SettingsFrame.class.js" type="text/javascript"></script>
<script src="code/js/frames/AccountFrame.class.js" type="text/javascript"></script>

<script src="code/js/frames/SidebarFrame.class.js" type="text/javascript"></script>

<!-- Dialog Displays -->

<!-- Inline Style ////////////////////////////////////////////////////////////////// -->

<style type="text/css">

	#menu_container {
		width: 97%;
		height: 25px;
		display: block;
		padding: 0px;
		margin: 0px;
		padding-top: 5px;
	}
	
	#menu_container .menu_item {		
		width: 100px;
		height: 20px;
		float: left;
		font-size: 14px;
		padding: 0px;
		margin: 0px;
		margin-top: 2px;
		padding-top: 3px;
		margin-right: 5px;
		background-color: #999999;
		cursor: pointer;
	}

	#menu_container .menu_item:hover {
		background-color: #f3f2f1;
	}
	
	#menu_container .menu_item.selected {
		background-color: #f3f2f1;
	}
	
	#menu_container .menu_link {		
		width: 60px;
		height: 20px;
		float: left;
		font-size: 13px;
		padding: 0px;
		margin: 0px;
		margin-top: 2px;
		padding-top: 3px;
		margin-right: 5px;
		cursor: pointer;
		float: right;
		text-align: right;
		color: #00007a;
	}	

	#menu_container .menu_link:hover {
		color: #f3f2f1;
	}

	#menu_container .menu_link.selected {
		color: white;
	}
	
	/* Hide the datepicker 'choose date' link */	
	a.dp-choose-date {
		display: none;
	}	
		
</style>

<!-- Inline Style ///////////////////////////////////////////////////////////////// -->

</head>
	
<body>

	<!-- Debug box //////////////////////////////////////////////////////////////////////////// -->
	
	<div id='debug_txt'>
	</div>

	<!-- Main  //////////////////////////////////////////////////////////////////////////////// -->

	<div id='sync_spinner'></div>	
	
	<div id='Content' align='center'>
	
		<div id='SideBar' align="left">
		</div>
		
		<div id='MainContent'>

			<div id='menu_container'>
				<div id='dashboard_menu' class='menu_item' onclick='ssMain.onShowDashboard()'>Dashboard</div>				
				<div id='pages_menu' class='menu_item' onclick='ssMain.onShowPages()'>Pages</div>				
				<div id='files_menu' class='menu_item' onclick='ssMain.onShowFiles()'>Files</div>
				<div id='posts_menu' class='menu_item' onclick='ssMain.onShowPosts()'>Posts</div>
				<div id='gallery_menu' class='menu_item' onclick='ssMain.onShowGalleries()'>Galleries</div>
				<div id='stats_menu' class='menu_item' onclick='ssMain.onShowStats()'>Stats</div>				
				<div id='settings_menu' class='menu_item' onclick='ssMain.onShowSettings()'>Settings</div>
								
				<div class='menu_link' onclick='ssMain.onLogout()'>Logout</div>
				<div id='account_menu' class='menu_link' onclick='ssMain.onShowAccount()'>Account</div>
				
				<?php
				if (count($site_list) > 1){
					echo '<select style=\'float:right; margin-right:20px; margin-top:3px;\' onchange=\'ssMain.onSelectSite($(this).val())\'>';
					foreach($site_list as $site){
						
						$selected = '';
						if ($site['id'] == $current_site_id){
							$selected = 'selected';
						}
						
						echo "<option $selected value='".$site['id']."'>".$site['domain']."</option>";
					}
					echo '</select>';
				}
				?>				
			</div>

			<!-- Dashboard Page Content ///////////////////////////////////////////////////////////// -->
			
			<div id='DashboardFrame' class='ViewFrame'>
				DASHBOARD
			</div> <!-- content -->

			<!-- Files Page Content ///////////////////////////////////////////////////////////// -->
			
			<div id='FilesFrame' class='ViewFrame'>
				FILES
			</div> <!-- content -->

			<!-- Pages Page Content ///////////////////////////////////////////////////////////// -->
			
			<div id='PagesFrame' class='ViewFrame'>
				PAGES
			</div> <!-- content -->

			<!-- Posts Page Content ///////////////////////////////////////////////////////////// -->
			
			<div id='PostsFrame' class='ViewFrame'>
				POSTS
			</div> <!-- content -->

			<!-- Galleries Page Content ///////////////////////////////////////////////////////////// -->
			
			<div id='GalleriesFrame' class='ViewFrame'>
				GALLERIES
			</div> <!-- content -->	

			<!-- Stats Page Content ///////////////////////////////////////////////////////////// -->
			
			<div id='StatsFrame' class='ViewFrame'>
				STATS
			</div> <!-- content -->	

			<!-- Settings Frame ///////////////////////////////////////////////////////////// -->
		
			<div id='SettingsFrame' style='display:none' class='ViewFrame' align="center">
				SETTINGS
			</div> <!-- content -->	
				
			<!-- Account Frame ///////////////////////////////////////////////////////////// -->
		
			<div id='AccountFrame' style='display:none' class='ViewFrame' align="center">
				Account
			</div> <!-- content -->					

		</div> <!-- MainContent -->
				
	</div>
 
</body>
</html>

<!-- Javascript code /////////////////////////////////////////////////////////////// -->

<script type="text/javascript">

defines.session_id = '<?php echo session_id(); ?>';

var ssMain = {

	VIEW_DASHBOARD : 1,
	VIEW_PAGES : 3,
	VIEW_FILES : 2,
	VIEW_POSTS : 4,
	VIEW_GALLERIES : 5,
	VIEW_STATS : 6,
	VIEW_SETTINGS : 7,
	VIEW_ACCOUNT : 8,
	
	view : 2,
		
	pageTracker : '',
	
		
	// ////////////////////////////////////////////////////////////////////////

	init : function(){			

		// Initialize the remote API's
		SystemAPI.init();
		MediaAPI.init();

		// Setup the JS logger
		Message.init('#debug_txt');
		Message.showOnError();
		
		// Setup the data store for the site
		DataStore.m_siteID = <?=$current_site_id?>;
		DataStore.init();
				
		// Start auto-save timer....
        //setInterval ( "ssMain.onAutoSave()", 5000 );
	
		// Save when browser quits
		$(window).unload( function () { DataStore.save(); } );
	
		$(window).resize( function(){ ssMain.onResize() });

		// Setup date picker...
		Date.firstDayOfWeek = 0;
		Date.format = 'yyyy-mm-dd';
//		Date.format = 'mm/dd/yyyy';

		//$('.datepicker').datePicker({clickInput:true, startDate:'1996-01-01'});
						
		// Start loading data
		DataStore.load(ssMain.onDataLoaded);
        
		// Setup classes...
		DashboardFrame.init();
        FilesFrame.init();
        GalleriesFrame.init();
        PagesFrame.init();
        PostsFrame.init();
        SettingsFrame.init();		
	},

	// ////////////////////////////////////////////////////////////////////////

	/**
	* Refresh after data has changed on the server
	*/
	refresh : function(){
		DataStore.load(ssMain.onDataLoaded);
	},
	
	// ////////////////////////////////////////////////////////////////////////

	onDataLoaded : function(){
		ssMain.repaint();
	},
	
	// ////////////////////////////////////////////////////////////////////////

	isResizing : false,
	
	onResizeComplete : function(){
		ssMain.init();
		ssMain.isResizing = false;
	},
	
	onResize : function(){
		if (!ssMain.isResizing){
			ssMain.isResizing = true;
			setTimeout("ssMain.onResizeComplete()", 1000);
		}		
	},
	
	// ////////////////////////////////////////////////////////////////////////

    onAutoSave : function(){

        // Show that autosave is happening!
        var tm = new Date();

        $("#saveButton").attr('value', 'Saved ' + tm.getHours() + ":" + tm.getMinutes() + "." + tm.getSeconds());

        // Do the save
        //DataStore.save();
    },

	// ////////////////////////////////////////////////////////////////////////

	onLogout : function(){
		AthenaDialog.confirm("Are you sure you want to log out?", ssMain.startLogout);
	},
	
	startLogout : function(){	
		SystemAPI.logOut(ssMain.doLogout);		
	},
	
	doLogout : function(){
		window.location = "index.html";
	},

	// ////////////////////////////////////////////////////////////////////////
	
	onDataLoaded : function(){	
		ssMain.repaint();		
	},

	onSelectSite : function(site_id){
		DataStore.site_id = site_id;
		ssMain.repaint();		
	},
	
	// ////////////////////////////////////////////////////////////////////////
	
	onShowDashboard : function(){ ssMain.view = ssMain.VIEW_DASHBOARD; ssMain.repaint(); },
	onShowPages : function(){ ssMain.view = ssMain.VIEW_PAGES; ssMain.repaint(); },
	onShowFiles : function(){ ssMain.view = ssMain.VIEW_FILES; ssMain.repaint(); },
	onShowPosts : function(){ ssMain.view = ssMain.VIEW_POSTS; ssMain.repaint(); },
	onShowGalleries : function(){ ssMain.view = ssMain.VIEW_GALLERIES; ssMain.repaint(); },
	onShowSettings : function(){ ssMain.view = ssMain.VIEW_SETTINGS; ssMain.repaint(); },
	onShowStats : function(){ ssMain.view = ssMain.VIEW_STATS; ssMain.repaint(); },
	onShowAccount : function(){ ssMain.view = ssMain.VIEW_ACCOUNT; ssMain.repaint(); },
	
	// ////////////////////////////////////////////////////////////////////////
						
	repaint : function(){

        // Do the save
        DataStore.save();

		// Hide all the frames
		$('.ViewFrame').hide();

		// Update menu
		$('.menu_item').removeClass('selected');
		$('.menu_link').removeClass('selected');

		switch(ssMain.view){
			case ssMain.VIEW_DASHBOARD : $('#DashboardFrame').show(); $('#dashboard_menu').addClass('selected'); DashboardFrame.repaint(); break;
			case ssMain.VIEW_PAGES : $('#PagesFrame').show(); $('#pages_menu').addClass('selected'); PagesFrame.repaint(); break;
			case ssMain.VIEW_FILES : $('#FilesFrame').show(); $('#files_menu').addClass('selected'); FilesFrame.repaint(); break;
			case ssMain.VIEW_POSTS : $('#PostsFrame').show(); $('#posts_menu').addClass('selected'); PostsFrame.repaint(); break;
			case ssMain.VIEW_GALLERIES : $('#GalleriesFrame').show(); $('#gallery_menu').addClass('selected'); GalleriesFrame.repaint(); break;
			case ssMain.VIEW_SETTINGS : $('#SettingsFrame').show(); $('#settings_menu').addClass('selected'); SettingsFrame.repaint(); break;
			case ssMain.VIEW_STATS : $('#StatsFrame').show(); $('#stats_menu').addClass('selected'); SettingsFrame.repaint(); break;
			case ssMain.VIEW_ACCOUNT : $('#AccountFrame').show(); $('#account_menu').addClass('selected'); AccountFrame.repaint(); break;
		}
		
		SidebarFrame.repaint();
	}
}

$(document).ready(function(){ssMain.init();});


</script>