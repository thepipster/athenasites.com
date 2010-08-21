<?php

require_once("code/php/setup.php");

if(!SecurityUtils::isLoggedIn()){
//	header("Location: http://".$_SERVER['HTTP_HOST']."/admin/index.html");
	SecurityUtils::logOut();
	header("Location: index.html");
} 

$user_id = SecurityUtils::getCurrentUserID();
$user_level = SecurityUtils::getCurrentUserLevel();
$user = UserTable::getUser($user_id);
//Logger::dump($user);

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

$site_id = CommandHelper::getPara('site_id', false, CommandHelper::$PARA_TYPE_NUMERIC);

if (isset($site_id) && $site_id > 0){	
	// Check user has access to this site!!!!
	if (!SecurityUtils::isLoggedInForSite($site_id)){
		SecurityUtils::logOut();
		header("Location: index.html");
	}
	$current_site_id = $site_id;
}
else {

	// Look at domain for site id
	$domain = str_replace('www.','',$_SERVER['HTTP_HOST']);
	$site_id = SitesTable::getSiteIDFromDomain($domain);
	Logger::debug("Found site id = $site_id for domain $domain");
	
	// If the domain isn't the main domain (site_id = 1) then select from the users site list
	if ($site_id == 1){
		$current_site_id = $site_list[0]['id'];
	}
	else {
		$current_site_id = $site_id;
	}
		
}

$domain = '';

// Get the current site domain from the site list
foreach($site_list as $site){
	if ($site['id'] == $current_site_id){
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

<link rel="stylesheet" href="code/js/3rdparty/jquery-ui/overcast/jquery-ui-1.8.4.custom.css" type="text/css"/>

<link rel="stylesheet" href="code/css/Athena.css" type="text/css" /> 
<link rel="stylesheet" href="code/css/SideBar.css" type="text/css" />
<link rel="stylesheet" href="code/css/FilesFrame.css" type="text/css" />
<link rel="stylesheet" href="code/css/PagesFrame.css" type="text/css" />
<link rel="stylesheet" href="code/css/PostsFrame.css" type="text/css" />
<link rel="stylesheet" href="code/css/ImageEditDialog.css" type="text/css" />
<link rel="stylesheet" href="code/css/ImagePickerDialog.css" type="text/css" />
<link rel="stylesheet" href="code/css/ImageEditFrame.css" type="text/css" />
<link rel="stylesheet" href="code/css/GalleryFrame.css" type="text/css" />
<link rel="stylesheet" href="code/css/datePicker.css" type="text/css" />

<link rel="stylesheet" href="code/colorpicker/css/colorpicker.css" type="text/css" />

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

<script type="text/javascript" src="code/js/3rdparty/jquery-ui/jquery-ui-1.8.4.custom.min.js"></script>

<script type="text/javascript" src="code/js/3rdparty/swfobject.js"></script>

<script type="text/javascript" src="code/js/3rdparty/SWFUpload/swfupload.js"></script>
<script type="text/javascript" src="code/js/3rdparty/SWFUpload/plugins/swfupload.queue.js"></script>

<!-- CKEditor -->
<!--
<script type="text/javascript" src="code/ckeditor/ckeditor.js"></script>
-->
<script type="text/javascript" src="code/ckeditor/ckeditor_source.js"></script>

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
<script src="code/js/remoteapi/GalleryAPI.class.js" type="text/javascript"></script>

<!-- Dialog Displays -->
<script src="code/js/dialogs/ImageEditDialog.class.js" type="text/javascript"></script>
<script src="code/js/dialogs/ImagePickerDialog.class.js" type="text/javascript"></script>
<script src="code/colorpicker/js/colorpicker.js" type="text/javascript"></script>
<script src="code/js/dialogs/ColorPickerDialog.class.js" type="text/javascript"></script>


<!-- Sub-Frame Displays -->
<script src="code/js/subframes/FolderSidebarFrame.class.js" type="text/javascript"></script>
<script src="code/js/subframes/PagesSidebarFrame.class.js" type="text/javascript"></script>
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
<script src="code/js/frames/SettingsFrame.class.js" type="text/javascript"></script>
<script src="code/js/frames/AccountFrame.class.js" type="text/javascript"></script>
<script src="code/js/frames/EditImageFrame.class.js" type="text/javascript"></script>
<script src="code/js/frames/SidebarFrame.class.js" type="text/javascript"></script>


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

<!-- Inline Style ///////////////////////////////////////////////////////////////// -->

</head>
	
<body>

<!-- Debug box //////////////////////////////////////////////////////////////////////////// -->

<div id='debug_txt'></div>

<!-- Main  //////////////////////////////////////////////////////////////////////////////// -->

<img class='apollo_logo' src='images/logo.png' height='35px' style='padding-top:5px; padding-left:5px;'/>

<div id='apollo_loading_display' class='transparent_50' align="center"></div>	

<div id='apollo_dialog'></div>	

<div id='Content' align='center'>

	<table border="0" width='100%' height='100%' style='width:100%; height:100%'>
	
		<tr valign="top" style='width:100%; height:100%'>
		
			<td width="180px">
				<div id='SideBar' align="left">
				</div>
			</td>
			
			<td>
			
				<div id='MainContent'>
		
					<div id='menu_container'>
					<!--
						<div id='settings_menu' class='menu_item' onclick='ssMain.onShowSettings()'>Settings</div>
					-->
						<div id='dashboard_menu' class='menu_item' onclick='ssMain.onShowDashboard()'>Dashboard</div>				
						<div id='pages_menu' class='menu_item' onclick='ssMain.onShowPages()'>Pages</div>				
						<div id='files_menu' class='menu_item' onclick='ssMain.onShowFiles()'>Files</div>
						<div id='gallery_menu' class='menu_item' onclick='ssMain.onShowGalleries()'>Galleries</div>
						<div id='posts_menu' class='menu_item' onclick='ssMain.onShowPosts()'>Posts</div>
						<div id='stats_menu' class='menu_item' onclick='ssMain.onShowStats()'>Stats</div>
										
						<?php if ($user['service_client_gallery'] == 1){ ?>
						<div id='' class='menu_item client_gallery_title' onclick=''>Client Gallery</div>				
						<div id='' class='menu_item' onclick=''>eStore</div>				
						<?php } ?>
										
						<div class='menu_link' onclick='ssMain.onLogout()'>Logout</div>
						<div id='account_menu' class='menu_link' onclick='ssMain.onShowAccount()'>Account</div>
						
						<?php
						if (count($site_list) > 1){
							echo '<select class="menu_site_selector" onchange=\'ssMain.onSelectSite($(this).val())\'>';
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
					
					<!-- Settings Frame ///////////////////////////////////////////////////////////// -->
				
					<div id='SettingsFrame' class='ViewFrame'>
						SETTINGS
					</div> <!-- content -->						
		
					<!-- Dashboard Page Content ///////////////////////////////////////////////////////////// -->
					
					<div id='DashboardFrame' class='ViewFrame'>
						DASHBOARD
					</div> <!-- content -->
		
					<!-- Files Page Content ///////////////////////////////////////////////////////////// -->
					
					<div id='FilesFrame' class='ViewFrame'>
					</div> <!-- content -->

					<!-- Edit Images/Files Page Content ///////////////////////////////////////////////////////////// -->
					
					<div id='EditFilesFrame' class='ViewFrame'>
					</div> <!-- content -->
		
					<!-- Pages Page Content ///////////////////////////////////////////////////////////// -->
					
					<div id='PagesFrame' class='ViewFrame'>
					</div> <!-- content -->
		
					<!-- Posts Page Content ///////////////////////////////////////////////////////////// -->
					
					<div id='PostsFrame' class='ViewFrame'>
					</div> <!-- content -->
		
					<!-- Galleries Page Content ///////////////////////////////////////////////////////////// -->
					
					<div id='GalleriesFrame' class='ViewFrame'>
					</div> <!-- content -->	
		
					<!-- Stats Page Content ///////////////////////////////////////////////////////////// -->
					
					<div id='StatsFrame' class='ViewFrame'>
						STATS
					</div> <!-- content -->	
								
					<!-- Account Frame ///////////////////////////////////////////////////////////// -->
				
					<div id='AccountFrame' class='ViewFrame'>
						Account
					</div> <!-- content -->					
		
				</div> <!-- MainContent -->
			
			
			</td>
		</tr>
	</table>
			
</div>
 
</body>
</html>

<!-- Javascript code /////////////////////////////////////////////////////////////// -->

<script type="text/javascript">

defines.session_id = '<?php echo session_id(); ?>';
defines.domain = '<?php echo $domain; ?>';

var ssMain = {

	VIEW_DASHBOARD : 1,
	VIEW_PAGES : 3,
	VIEW_FILES : 2,
	VIEW_POSTS : 4,
	VIEW_GALLERIES : 5,
	VIEW_STATS : 6,
	VIEW_SETTINGS : 7,
	VIEW_ACCOUNT : 8,
	VIEW_EDITFILES : 9,
	
	view : 1,
		
	pageTracker : '',
	
		
	// ////////////////////////////////////////////////////////////////////////

	init : function(){			

		// Initialize the remote API's
		SystemAPI.init();
		MediaAPI.init();
		GalleryAPI.init();

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
        EditImageFrame.init();	
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
		//ssMain.init();
		//ssMain.isResizing = false;
		window.location = "main.php?site_id=" + DataStore.m_siteID;	
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
	
		if (DataStore.m_currentFolderID > 0){
			FolderSidebarFrame.onSelectFolder(DataStore.m_currentFolderID);
		}
		else {
			if (DataStore.m_currentFolderID == -1 && DataStore.m_folderList.length > 0){
				FolderSidebarFrame.onSelectFolder(DataStore.m_folderList[0].id);
			}
			else {
				FolderSidebarFrame.onSelectFolder(1); // unassigned folders
			}
		}
		
		ssMain.repaint();		
	},

	// ////////////////////////////////////////////////////////////////////////

	onSelectSite : function(site_id){

		window.location = "main.php?site_id=" + site_id;	
		
/*
		// Reset frames
		DashboardFrame.init();
        FilesFrame.init();
        GalleriesFrame.init();
        PagesFrame.init();
        PostsFrame.init();
        SettingsFrame.init();	
        EditImageFrame.init();	
		
		DataStore.m_siteID = site_id;
		SidebarFrame.m_mode = ''; // Clear the mode to force the side bar to refresh
		DataStore.clear();
		DataStore.load(ssMain.onDataLoaded);
*/
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
	onShowEditImages : function(){ ssMain.view = ssMain.VIEW_EDITFILES; ssMain.repaint(); },
	
	
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
			case ssMain.VIEW_EDITFILES : $('#EditFilesFrame').show(); $('#edit_files_menu').addClass('selected'); EditImageFrame.repaint(); break;
		}
		
		//window.location.hash = ssMain.view;

		SidebarFrame.repaint();
	}
}

$(document).ready(function(){ssMain.init();});


</script>