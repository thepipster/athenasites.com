<?php
require_once("code/php/setup.php");

if (!SecurityUtils::isLoggedIn()) {
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
        header("Location: index.html");
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

        <link rel="icon" type="image/png" href="favicon.png">

        <!--[if IE]>
        <link rel="shortcut icon" href="favicon.ico">
        <![endif]-->

        <!-- Load styles //////////////////////////////////////////////////////////////////// -->
        <!--
        <link rel="stylesheet" href="css/SimpleScrum.css" type="text/css" />
        -->

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
        <!--<link rel="stylesheet" href="code/css/PostsFrame.css" type="text/css" /> Merged posts and pages, so no need of this style sheet -->
        <link rel="stylesheet" href="code/css/ImageEditDialog.css" type="text/css" />
        <link rel="stylesheet" href="code/css/ImagePickerDialog.css" type="text/css" />
        <link rel="stylesheet" href="code/css/CommentDialog.css" type="text/css" />
        <link rel="stylesheet" href="code/css/ImageEditFrame.css" type="text/css" />
        <link rel="stylesheet" href="code/css/GalleryFrame.css" type="text/css" />
        <link rel="stylesheet" href="code/css/StatsFrame.css" type="text/css" />
        <link rel="stylesheet" href="code/css/Dashboard.css" type="text/css" />
        <link rel="stylesheet" href="code/css/datePicker.css" type="text/css" />

        <link rel="stylesheet" href="code/colorpicker/css/colorpicker.css" type="text/css" />
        <link rel="stylesheet" href="code/js/3rdparty/jScrollPane.css" type="text/css" />


        <!-- Javascript includes /////////////////////////////////////////////////////////// -->

        <!-- PRODUCTION INCLUDES /////////////////////////////////////////////////////////// -->

        <!-- DEV INCLUDES /////////////////////////////////////////////////////////// -->


        <!-- jQuery and plugins -->

        <!--
        Apollo Sites Google API Key: 
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js?key=ABQIAAAApd3TaflLK-nGV6GT_CxTqhSdm2A-7rwoGsE41YlBtCPOmvFDPxRCd_p-ugGZEcWT4iPDE9N7Rn-KXg"></script>
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.4/jquery-ui.min.js?key=ABQIAAAApd3TaflLK-nGV6GT_CxTqhSdm2A-7rwoGsE41YlBtCPOmvFDPxRCd_p-ugGZEcWT4iPDE9N7Rn-KXg"></script>
        -->
        <script type="text/javascript" src="code/js/3rdparty/jquery-1.4.2.min.js"></script>
        <script type="text/javascript" src="code/js/3rdparty/jquery-ui/jquery-ui-1.8.4.custom.min.js"></script>

                
        <script type="text/javascript" src="code/js/3rdparty/jquery.validate.min.js"></script>
        <!--<script type="text/javascript" src="code/js/3rdparty/jquery.json-1.3.min.js"></script>-->
        <script type="text/javascript" src="code/js/3rdparty/jquery.json-2.2.js"></script>

        <script type="text/javascript" src="code/js/3rdparty/flot/jquery.flot.min.js"></script>
        <script type="text/javascript" src="code/js/3rdparty/flot/jquery.flot.crosshair.js"></script>
        <script type="text/javascript" src="code/js/3rdparty/jScrollPane-1.2.3.min.js"></script>
        <!--
        <script type="text/javascript" src="code/js/3rdparty/jquery.progressbar/js/jquery.progressbar.min.js"></script>
        -->
        <script type="text/javascript" src="code/js/3rdparty/date.js"></script>
        <script type="text/javascript" src="code/js/3rdparty/jquery.datePicker.js"></script>
        <script type="text/javascript" src="code/js/3rdparty/jquery.advancedClick.js"></script>

        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js?key=ABQIAAAApd3TaflLK-nGV6GT_CxTqhSdm2A-7rwoGsE41YlBtCPOmvFDPxRCd_p-ugGZEcWT4iPDE9N7Rn-KXg"></script>
<!--
        <script type="text/javascript" src="code/js/3rdparty/swfobject.js"></script>
-->
        <script type="text/javascript" src="code/js/3rdparty/SWFUpload/swfupload.js"></script>
        <script type="text/javascript" src="code/js/3rdparty/SWFUpload/plugins/swfupload.queue.js"></script>

        <script src="code/js/3rdparty/date.format.js" type="text/javascript"></script>

        <!-- CKEditor -->
        <!--
        <script type="text/javascript" src="code/ckeditor/ckeditor.js"></script>
        <script type="text/javascript" src="code/3rdparty/ckeditor/ckeditor_source.js"></script>
        -->
        <!--
                <script type="text/javascript" src="code/3rdparty/openwysiwyg/scripts/wysiwyg.js"></script>
                <script type="text/javascript" src="code/3rdparty/openwysiwyg/scripts/wysiwyg-settings.js"></script>
        -->
        <script type="text/javascript" src="code/3rdparty/InnovaStudio/scripts/innovaeditor.js"></script>

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
        <script src="code/colorpicker/js/colorpicker.js" type="text/javascript"></script>

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
    <div id='apollo_loading_dialog'></div>

    <div id='Content' align='center'>

        <table id="mainContentTable" border="0" cellspacing="0" cellpadding="0" width='100%' height='100%' style='width:100%; height:100%'>

            <tr valign="top" style='width:100%;height:100%'>

                <td width="180px" style='width:180px'>
                    <div id='SideBar' align="left"></div><!-- SideBar -->
                </td>

                <td>

                    <div id='menu_container'>
                        
                        <div id='dashboard_menu' class='menu_item' onclick='ssMain.onShowDashboard()'>Dashboard</div>
                        <div id='posts_menu' class='menu_item' onclick='ssMain.onShowPosts()'>Blog</div>
                        <div id='pages_menu' class='menu_item' onclick='ssMain.onShowPages()'>Pages</div>
                        <div id='files_menu' class='menu_item' onclick='ssMain.onShowFiles()'>Files</div>
                        <div id='gallery_menu' class='menu_item' onclick='ssMain.onShowGalleries()'>Galleries</div>
                        <div id='stats_menu' class='menu_item' onclick='ssMain.onShowStats()'>Stats</div>

                        <?php
                        if ($user['service_client_gallery'] == 1) {
                        ?>
                            <div id='' class='menu_item client_gallery_title' onclick=''>Client Gallery</div>
                            <div id='' class='menu_item' onclick=''>eStore</div>
                        <?php } ?>

                        <div class='menu_link' onclick='ssMain.onLogout()'>Logout</div>
                        <div id='account_menu' class='menu_link' onclick='AccountDialog.show()'>Account</div>

                        <?php
                        if (count($site_list) > 1) {
                            echo '<select class="menu_site_selector" onchange=\'ssMain.onSelectSite($(this).val())\'>';
                            foreach ($site_list as $site) {

                                $selected = '';
                                if ($site['id'] == $current_site_id) {
                                    $selected = 'selected';
                                }

                                echo "<option $selected value='" . $site['id'] . "'>" . $site['domain'] . "</option>";
                            }
                            echo '</select>';
                        }
                        ?>
                        
                        <div class='user_message'></div>
                        
                    </div><!-- menu_container -->

                    <div id='MainContent'>

                        <!-- Dashboard Page Content ///////////////////////////////////////////////////////////// -->

                        <div id='DashboardFrame' class='ViewFrame'>


                            <table border='0' cellpadding='0' cellspacing='0' style='width:100%; height:100%;'>

                                <tr valign='top' width='100%'>

                                    <td width="50%" height="70%" style='height:100%; padding:5px;'>

                                        <div class='subframebox' style='height:100%; width:100%;'>

                                            <span class='title'>Snap Shot
                                                <!--<a href='#' id="showCommentsAll" class="subFrameCommand" onclick="DashboardFrame.showComments('All')">All</a>-->
                                                <a href='#' id="showTraffic" class="subFrameCommand selected" onclick="DashboardFrame.showTraffic()">Traffic</a>
                                                <a href='#' id="showFollowers" class="subFrameCommand" onclick="DashboardFrame.showFollowers()">Top Commenters</a>
                                            </span>

                                            <div id='apollo_site_stats_summary' class='frameContents' style='display:none' align='center'>

                                                <table class="statsTable" border="0" cellspacing="2" cellpadding="3">

                                                    <tr align="left" class="odd">
                                                        <td>Disc Usage</td>
                                                        <td valign="middle">
                                                            <div id="disc_usage" style='width:15%; float:left'></div>
                                                            <div id="disc_usage_bar" style='width:83%; float:left'></div>
                                                        </td>
                                                    </tr>

                                                    <tr align="left" class="even">
                                                        <td width='90px'>Blog Posts</td>
                                                        <td >
                                                            <span class="status_public"><span id="no_posts_published"></span> published </span>,
                                                            <span class="status_draft"><span id="no_posts_draft"></span> draft</span>,
                                                            <span class="status_private"><span id="no_posts_private"></span> private </span>
                                                        </td>
                                                    </tr>

                                                    <tr align="left" class="odd">
                                                        <td>Comments</td>
                                                        <td>
                                                            <span class="status_public"><span id="no_comments_approved"></span> approved </span>,
                                                            <span class="status_draft"><span id="no_comments_pending"></span> pending approval</span>,
                                                            <span class="status_spam"><span id="no_comments_spam"></span> spam </span>
                                                        </td>
                                                    </tr>

                                                    <tr align="left" class="even">
                                                        <td>Misc</td>
                                                        <td>You have <span id="no_catgeories"></span> categories, <span id="no_tags"></span> tags and <span id="no_followers"></span> commenters</td>
                                                    </tr>


                                                </table>

                                                <div align="center">

                                                    <div class="apolloStatsGraphWrapper" style='height:200px; width:90%; margin-top:10px'>
                                                        <div id="apollo_stats_graph_small" class="" style='height:100%; width:100%;'></div>
                                                    </div>
                                                    <p>Site traffic for last 30 days</p>                                                   

                                                    <div class="apolloStatsGraphWrapper" style='height:200px; width:90%; margin-top:10px'>
                                                        <div id="apollo_crawler_graph_small" class="" style='height:100%; width:100%;'></div>
                                                    </div>
                                                    <p>Search engine activity for last 30 days</p>                                                   

                                                </div>

                                            </div><!-- apollo_site_sumary -->

                                            <div id='apollo_followers_summary_wrapper' class='frameContents'>
                                                <div id='apollo_followers_summary' align="center" style="height:100%; width:100%;">
                                                    <p>I'm sorry, you don't have any commentators yet</p3>
                                                </div>
                                            </div>

                                        </div><!-- subframebox -->

                                    </td>

                                    <td width="50%" height="100%" style='height:100%; padding:5px;' rowspan="2">
                                        <div class='subframebox' id="apollo_site_comments_wrapper">
                                            <span class='title'>Recent Comments
                                                <!--<a href='#' id="showCommentsAll" class="subFrameCommand" onclick="DashboardFrame.showComments('All')">All</a>-->
                                                <a href='#' id="showCommentsPending" class="subFrameCommand selected" onclick="DashboardFrame.showComments('Pending')">Unapproved</a>
                                                <a href='#' id="showCommentsApproved" class="subFrameCommand" onclick="DashboardFrame.showComments('Approved')">Approved</a>
                                                <a href='#' id="showCommentsTrash" class="subFrameCommand" onclick="DashboardFrame.showComments('Trash')" title="Comments marked as trash will be automatically removed after 30 days">Trash</a>
                                                <a href='#' id="showCommentsSpam" class="subFrameCommand" onclick="DashboardFrame.showComments('Spam')" title="Comments marked as spam will be automatically removed after 30 days">Spam</a>
                                            </span>
                                            <div id='apollo_site_comments' style="height:100%; width:100%; overflow:auto;"></div>
                                        </div>
                                    </td>



                            </table>

                        </div> <!-- DashboardFrame -->

                        <!-- Files Page Content ///////////////////////////////////////////////////////////// -->

                        <div id='FilesFrame' class='ViewFrame'>

                            <div id='FilesFrameContent' align='left'>

                                <table border='0' cellpadding='0' cellspacing='0' style='width:100%; height:100%;'>

                                    <tr valign='top'>

                                        <td class='frameContents'>
                                            <span class='frameTitle'>Images                                            
												<span class='more_link' id='prev_images_link' onclick='FilesFrame.showPrevImages()' title=''>&laquo; prev</span>
												<span class='more_link' id='next_images_link' onclick='FilesFrame.showNextImages()' title=''>next &raquo;</span>
                                            </span>
                                            
                                            <div id='apollo_folder_contents'></div>
                                        </td>

                                        <!-- Edit images frame........... -->

                                        <td id='imageEditContent' style='height:100%; padding:5px'>
                                            <div class='subframebox' style='height:100%; width:500px;'>
                                                <span class='title'>Edit Image</span>
                                                <div id='imageInfoContent'>
                                                </div>
                                            </div>
                                        </td>

                                        <!-- File uploader frame........... -->

                                        <td id='flashUploderContent' style='height:100%; padding:5px'>
                                            <div class='subframebox' >
                                                <span class='title'>Upload Files</span>
                                                <div class='uploadControls'>
                                                    <span id='flashUploadButton'></span>
                                                    <button id='flashUploadCancelButton' onclick='swfu.cancelQueue();' disabled='disabled'>Cancel</button>
                                                </div>
                                                <div class='uploadProgress' id='flashUploaderProgress'>
                                                </div>
                                            </div>
                                        </td>

                                    </tr>

                                </table>

                            </div>
                        </div> <!-- FilesFrame -->

                        <!-- Edit Images/Files Page Content ///////////////////////////////////////////////////////////// -->

                        <div id='EditFilesFrame' class='ViewFrame'>                                                
                        </div>

                        <!-- Pages/Posts Content /////////////////////////////////////////////////////////////////// -->

                        <div id='PagesFrame' class='ViewFrame'>

                            <div id='PagesFrameImagePicker'></div>
                            <div id='PagesFrameColorPicker'></div>

                            <table border='0' cellpadding='0' cellspacing='0' style='width:100%; height:100%;'>

                                <tr valign='top'>

                                    <td height='30px'>
                                        <div class='frameControlsBar'>
                                            <span class='label'>Title:</span>
                                            <input id='pageTitle' type='text' value='' class='apolloDataInput'/>
                                            <!--
                                            <button class='basic_button' style='' onclick="ImagePickerDialog.show('#PagesFrameImagePicker', PagesFrame.onImageSelected);">Insert Image</button>
                                            -->
                                            <a id='pageLink' href='' style='font-size:10px'>View Page</a>
                                        </div>
                                    </td>

                                    <td rowspan='2' width='250px' style='height:100%; padding:5px'>

                                        <!-- Post settings sub-frame ////////////////////////////////////////////// -->

                                        <div class='subframebox' id="postSettings" style="height:100%;width:255px;display:none">

                                            <span class='title'>Post Settings</span>

                                            <fieldset>
                                                <legend></legend>
                                                <!--
                                                <div class='postInfoLine'>
                                                                        <span class='postLabel'>Slug:</span>
                                                                        <span class='postData' id='postSlug'></span>
                                                </div>
                                                -->

                                                <div class='pageInfoLine'>
                                                    <span class='pageLabel'>Status:</span>
                                                    <span class='pageData' class='apolloDataInput'>
                                                        <select id='postStatusSelector' class='apolloDataInput'>
                                                            <option value='Published' class=''>Published</option>
                                                            <option value='Draft' class=''>Draft</option>
                                                            <option value='Private' class=''>Private</option>
                                                        </select>
                                                    </span>
                                                </div>

                                                <div class='pageInfoLine'>
                                                    <span class='pageLabel'>Last Edit:</span>
                                                    <span class='pageData' id='postLastEdit'></span>
                                                </div>

                                                <div class='pageInfoLine'>
                                                    <span class='pageLabel'>Created:</span>
                                                    <span class='pageData' id='postCreated'></span>
                                                </div>

                                                <div class='pageInfoLine'>
                                                    <span class='pageLabel'>Allow Comments:</span>
                                                    <span class='pageData'>
                                                        <select id='postCanCommentSelector' class='apolloDataInput'>
                                                            <option value='1' selected>Yes</option>
                                                            <option value='0'>No</option>
                                                        </select>
                                                    </span>
                                                </div>

                                                <div class='pageInfoLine'>
                                                    <span class='pageLabel'>Import:</span>
                                                    <a href='#' onclick="PostsFrame.paintTools()">Import Posts</a>
                                                </div>

                                                <div class='pageInfoLine'>
                                                    <span class='pageLabel'>Comments:</span>
                                                    <!-- <button class='basic_button' onclick="PostsFrame.paintTools()">Import Posts</button> -->
                                                    <a href='#' onclick="CommentsEditDialog.show()">Edit Comments</a>
                                                </div>


                                                <div class='pageInfoLine'>
                                                    <span class='pageLabel'>Controls:</span>
                                                    <!--<button class='save_button' onclick="PostsFrame.onSavePost()">Save</button>-->
                                                    <button class='delete_button' onclick="PostsFrame.onDeletePost()">Delete Post</button>
                                                </div>


                                            </fieldset>

                                            <fieldset>
                                                <legend></legend>

                                                <p><strong>Tags</strong><span class='subFrameCommand' onclick='PostsFrame.viewTags()' title='View and edit your tags'>&nbsp;(view all)</span></p>
                                                <div class='pageInfoLine'>
                                                    <span class='pageData' id='postTags'><input id='postTag' type='text' value=''/></span>
                                                    <span class='pageLabel'><button class='basic_button' onclick='PostsFrame.addTag();'>Add</button></span>
                                                </div>
                                                <div id='apollo_post_tags'></div>

                                                <p><strong>Categories</strong>
                                                    <span class='subFrameCommand' onclick='PostsFrame.viewCategories()' title='View and edit your categories'>&nbsp;(view all)</span></p>
                                                <div class='pageInfoLine'>
                                                    <span class='pageData' id='postCategories'><input id='postCategory' type='text' value=''/></span>
                                                    <span class='pageLabel'><button class='basic_button' onclick='PostsFrame.addCategory()';>Add</button></span>
                                                </div>
                                                <div id='apollo_post_categories'></div>

                                            </fieldset>

                                        </div>

                                        <!-- Page settings sub-frame ////////////////////////////////////////////// -->

                                        <div class='subframebox' id="pageSettings" style="height:100%;width:255px;display:none">

                                            <span class='title'>Page Settings</span>

                                            <fieldset>
                                                <legend></legend>

                                                <!--
                                                <div class='pageInfoLine'>
                                                    <span class='pageLabel'>Title:</span>
                                                    <span class='pageData'><input id='pageTitle' type=text value=''/></span>
                                                </div>

                                                <div class='pageInfoLine'>
                                                    <span class='pageLabel'>Slug:</span>
                                                    <span class='pageData' id='pageSlug'></span>
                                                </div>
                                                -->

                                                <div class='pageInfoLine'>
                                                    <span class='pageLabel'>Status:</span>
                                                    <span class='pageData'>

                                                        <select id='pageStatusSelector' class='apolloDataInput'>
                                                            <option value='Published'>Published</option>
                                                            <option value='Draft'>Draft</option>
                                                            <option value='Private'>Private</option>
                                                        </select>
                                                    </span>
                                                </div>

                                                <div class='pageInfoLine'>
                                                    <span class='pageLabel'>Browser Title:</span>
                                                    <span class='pageData'><input id='pageBrowserTitle' title='If set, this will be used as the title in the browser. If its not set, we use the title. This allows you to have a different title in the browser window than the title used in your menu.' type='text' value='' class='apolloDataInput'/></span>
                                                </div>

                                                <div class='pageInfoLine'>
                                                    <span class='pageLabel'>Description:</span>
                                                    <span class='pageData'><input id='pageDesc' title='Enter a description of this page so we can feed that to search engines!' type='text' value='' class='apolloDataInput'/></span>
                                                </div>

                                                <div class='pageInfoLine'>
                                                    <span class='pageLabel'>Last Edit:</span>
                                                    <span class='pageData' id='pageLastEdit'></span>
                                                </div>

                                                <div class='pageInfoLine'>
                                                    <span class='pageLabel'>Created:</span>
                                                    <span class='pageData' id='pageCreated'></span>
                                                </div>

                                                <div class='pageInfoLine'>
                                                    <span class='pageLabel'>Global:</span>
                                                    <a href='#' onclick="PagesFrame.editGlobalSettings()" title="Edit your global page settings">Edit Settings</a>
                                                </div>

                                                <div class='pageInfoLine'>
                                                    <span class='pageLabel'>Parent Page:</span>
                                                    <span class='pageData' id='parentPageContents'></span>
                                                </div>

                                                <div class='pageInfoLine'>
                                                    <span class='pageLabel'>Template:</span>
                                                    <span class='pageData' id="pageTemplateWrapper">
                                                        <select id='pageTemplate' onchange="PagesFrame.paintThemeParas()" class='apolloDataInput'>
                                                            <option value=''>(none)</option>
                                                        </select>
                                                    </span>
                                                </div>

                                                <div class='pageInfoLine'>
                                                    <span class='pageLabel'>Menu Order:</span>
                                                    <!--<span class='pageData'><input id='pageOrder' type=text size=5 value=''/></span>-->
                                                    <span class='pageData'>
                                                        <select id='pageOrder' class='apolloDataInput'>
                                                            <option value='1' selected>1</option>
                                                            <option value='2'>2</option>
                                                            <option value='3'>3</option>
                                                            <option value='4'>4</option>
                                                            <option value='5'>5</option>
                                                            <option value='6'>6</option>
                                                            <option value='7'>7</option>
                                                            <option value='8'>8</option>
                                                            <option value='9'>9</option>
                                                            <option value='10'>10</option>
                                                            <option value='11'>11</option>
                                                            <option value='12'>12</option>
                                                            <option value='13'>13</option>
                                                            <option value='14'>14</option>
                                                            <option value='15'>15</option>
                                                            <option value='16'>16</option>
                                                            <option value='17'>17</option>
                                                            <option value='18'>18</option>
                                                            <option value='19'>19</option>
                                                            <option value='20'>20</option>
                                                            <option value='21'>21</option>
                                                            <option value='22'>22</option>
                                                            <option value='23'>23</option>
                                                            <option value='24'>24</option>
                                                            <option value='25'>25</option>
                                                            <option value='26'>26</option>
                                                            <option value='27'>27</option>
                                                            <option value='28'>28</option>
                                                            <option value='29'>29</option>
                                                            <option value='30'>30</option>
                                                        </select>
                                                    </span>
                                                </div>


                                                <div class='pageInfoLine'>
                                                    <span class='pageLabel'>Controls:</span>
                                                    <!--<button class='save_button' onclick="PagesFrame.onSavePage()">Save</button>-->
                                                    <button class='delete_button' onclick="PagesFrame.onDeletePage()">Delete Page</button>
                                                </div>


                                            </fieldset>

                                            <fieldset>
                                                <legend></legend>
                                                <div id='apollo_page_theme_paras'></div>
                                            </fieldset>

                                        </div>

                                    </td>

                                </tr>

                                <tr valign='top'>
                                    <td>
                                        <div style='margin-top:5px; margin-left:5px;'>
                                            <textarea id='pageContentEditor' class="apolloContentEditor" name='pageContentEditor' style='width:100%; height:100%;'></textarea>
                                        </div>
                                    </td>
                                </tr>

                            </table>
                        </div><!-- PagesFrame -->

                        <!-- Galleries Page Content ///////////////////////////////////////////////////////////// -->

                        <div id='GalleriesFrame' class='ViewFrame'>

                            <div id='GalleryFrameContent' align='left'>

                                <table border='0' cellpadding='0' cellspacing='0' style='width:100%; height:100%;'>

                                    <tr valign='top' height='250px' width='100%' id='galleryRow'>

                                        <td class='frameContents frame_controls_bar'>
                                            <span class='frameTitle' id='galleryTitle'>Gallery Contents</span>
                                            <div id="apollo_gallery_contents_wrapper">
                                                <div align='left' id='apollo_gallery_contents'></div>
                                            </div>
                                            
                                            <div align="center">
	                                            <div class='remove_image_box' id='delete_slot' align='center'>Drag images here to remove from this gallery</div>
                                            </div>
                                            
                                        </td>

                                        <!-- Gallery settings frame (for multi-gal)........... -->

                                        <td rowspan='2' width='250px' id='gallerySettings' style='height:100%; padding:5px; display:none'>
                                            <div class='subframebox' style='height:100%; width:100%;'>
                                                <span class='title'>Gallery Settings</span>
                                                <div id='gallerySettingsContent'>
                                                </div>
                                            </div>
                                        </td>

                                    </tr>

                                    <tr valign='top' width='100%'>

                                        <td class='frameContents' id='apollo_image_contents_wrapper'>
                                            <span class='frameTitle'>Images                                            
												<span class='more_link' id='prev_images_link' onclick='GalleriesFrame.showPrevImages()' title=''>&laquo; prev</span>
												<span class='more_link' id='next_images_link' onclick='GalleriesFrame.showNextImages()' title=''>next &raquo;</span>
                                            </span>
                                            <div id='apollo_image_contents'></div>
                                        </td>

                                    </tr>

                                </table>

                            </div>

                        </div> <!-- GalleriesFrame -->

                        <!-- Stats Page Content ///////////////////////////////////////////////////////////// -->

                        <div id='StatsFrame' class='ViewFrame'>
                            <div class="frameContents">
                                <h3>This awesome feature will be here soon, wish we could have it now - but we're working on is as fast as we can!</h3>
                                <p>This page will allow you to look at your total stats, and also allow you to drill down and look at stats for each page.</p>
                            </div>
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
	
    $(document).ready(function(){ssMain.init(<?= $current_site_id ?>);});

</script>