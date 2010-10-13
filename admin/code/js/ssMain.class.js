/* 
 * Main class for the main page
 *
 * @author Mike Pritchard (mike@apollosites.com)
 */
var ssMain = {

    VIEW_DASHBOARD : 1,
    VIEW_PAGES : 3,
    VIEW_FILES : 2,
    VIEW_POSTS : 4,
    VIEW_GALLERIES : 5,
    VIEW_STATS : 6,
    VIEW_EDITFILES : 9,

    view : 1,

    pageTracker : '',

    // ////////////////////////////////////////////////////////////////////////

    init : function(currentSiteID){
                
        // Set the sizes correctly...
        ssMain.onResizeComplete();

        // Paint the custom wyswig editors
        ssMain.paintOpenWYSIWYG();

        // Initialize the remote API's
        SystemAPI.init();
        MediaAPI.init();
        GalleryAPI.init();
        BlogAPI.init();

        // Setup the JS logger
        Logger.init('#debug_txt');
        Logger.showOnError();

        // Setup the data store for the site
        DataStore.m_siteID = currentSiteID;;
        DataStore.init();

        // Start auto-save timer....
        setInterval ( "ssMain.onAutoSave()", 5000 );

        // Save when browser quits
        $(window).unload( function () {DataStore.save();} );

        $(window).resize( function(){ssMain.onResize()});

        // Setup date picker...
        Date.firstDayOfWeek = 0;
        Date.format = 'yyyy-mm-dd';
        // Date.format = 'mm/dd/yyyy';

        //$('.datepicker').datePicker({clickInput:true, startDate:'1996-01-01'});

        // Start loading data
        DataStore.load(ssMain.onDataLoaded);

        // Setup classes...
        DashboardFrame.init();
        FilesFrame.init();
        GalleriesFrame.init();
        PagesFrame.init();
        PostsFrame.init();
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

        $('.ViewFrame').height($(window).height()- $('#menu_container').height()-30);
        $('.subframebox').height( $('.ViewFrame').height() - 30);

//        var h = $(window).height() - $('#menu_container').height()-35;
//        var w = $(window).width() - $('#SideBar').width() - 20;
//        //var ht = $('#mainContentTable').height() - 40;
//
//        $('.ViewFrame').height(h);
//        $('.ViewFrame').width(w);
        
        //ssMain.init();
        //ssMain.isResizing = false;
        //window.location = "main.php?site_id=" + DataStore.m_siteID;
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
        
        //var tm = new Date();
        //$("#saveButton").attr('value', 'Saved ' + tm.getHours() + ":" + tm.getMinutes() + "." + tm.getSeconds());

        // Do the save
        DataStore.save();
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
    },

    // ////////////////////////////////////////////////////////////////////////

    onShowDashboard : function(){ssMain.savePageContent(); ssMain.view = ssMain.VIEW_DASHBOARD;ssMain.repaint();},
    onShowPages : function(){ssMain.savePageContent(); ssMain.view = ssMain.VIEW_PAGES;ssMain.repaint();},
    onShowFiles : function(){ssMain.savePageContent(); ssMain.view = ssMain.VIEW_FILES;ssMain.repaint();},
    onShowPosts : function(){ssMain.savePageContent(); ssMain.view = ssMain.VIEW_POSTS;ssMain.repaint();},
    onShowGalleries : function(){ssMain.savePageContent(); ssMain.view = ssMain.VIEW_GALLERIES;ssMain.repaint();},
    onShowStats : function(){ssMain.savePageContent(); ssMain.view = ssMain.VIEW_STATS;ssMain.repaint();},
    onShowEditImages : function(){ssMain.savePageContent(); ssMain.view = ssMain.VIEW_EDITFILES;ssMain.repaint();},

    // ////////////////////////////////////////////////////////////////////////

	/**
	* Make sure we grab any content and update the local data store before we allow a page change
	*/
	savePageContent : function(){

        switch(ssMain.view){

            case ssMain.VIEW_PAGES : PagesFrame.onChange();break;
            case ssMain.VIEW_POSTS : PostsFrame.onChange();break;
            case ssMain.VIEW_DASHBOARD:
            case ssMain.VIEW_FILES:
            case ssMain.VIEW_GALLERIES:
            case ssMain.VIEW_STATS:
            case ssMain.VIEW_EDITFILES: break;
        }

	},
	
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

            case ssMain.VIEW_PAGES :$('#PagesFrame').show();$('#pages_menu').addClass('selected');PagesFrame.repaint();break;
            case ssMain.VIEW_POSTS :$('#PagesFrame').show();$('#posts_menu').addClass('selected');PostsFrame.repaint();break;

            case ssMain.VIEW_DASHBOARD:$('#DashboardFrame').show();$('#dashboard_menu').addClass('selected');DashboardFrame.repaint();break;
            case ssMain.VIEW_FILES:$('#FilesFrame').show();$('#files_menu').addClass('selected');FilesFrame.repaint();break;
            case ssMain.VIEW_GALLERIES:$('#GalleriesFrame').show();$('#gallery_menu').addClass('selected');GalleriesFrame.repaint();break;
            case ssMain.VIEW_STATS:$('#StatsFrame').show();$('#stats_menu').addClass('selected');StatsFrame.repaint();break;
            case ssMain.VIEW_EDITFILES:$('#EditFilesFrame').show();$('#edit_files_menu').addClass('selected');EditImageFrame.repaint();break;
        }

        //window.location.hash = ssMain.view;

        SidebarFrame.repaint();
    },

    // ////////////////////////////////////////////////////////////////////////

    paintOpenWYSIWYG : function(){

		// Paint the InnovaStudio editor...
		
        var ht = $('.ViewFrame').height() - 40;

        var groupsObj = [
            ["grpPage", "Page & View", ["FullScreen", "XHTMLSource", "Search", "BRK", "Undo", "Redo", "SpellCheck", "RemoveFormat"]],
            ["grpFont", "Font",
                ["FontName", "FontSize", "Strikethrough", "Superscript", "Subscript", "BRK",
                    "Bold", "Italic", "Underline", "ForeColor", "BackColor"
                ]
            ],
            ["grpStyles", "Styles", ["Table", "Guidelines", "BRK",  "StyleAndFormatting", "Styles"]], //"Absolute"
            ["grpPara", "Paragraph",
                ["Paragraph", "Indent", "Outdent", "LTR", "RTL", "BRK", "JustifyLeft",
                    "JustifyCenter", "JustifyRight","JustifyFull", "Numbering", "Bullets"
                ]
            ],
            ["grpObjects", "Objects", ["Image", "InsertInternalImage", "Flash", "Media", "BRK", "Hyperlink", "Characters", "Line",  "ApolloPageBreak"]]
        ];

        oUtil.initializeEditor("apolloContentEditor", {
            width:"100%",
            height:ht+"px",
//            height:"100%",
            btnSpellCheck:true,
            useTagSelector:false,
            toolbarMode: 2,
            mode:"XHTML",
            useBR:true, // Force to use <br> for line breaks by default
            arrCustomButtons: [
                ["InsertInternalImage","ImagePickerDialog.show('#PagesFrameImagePicker', ssMain.onInsertImage)","Insert an image from your media library", "btnInternalImage.gif"],
                ["ApolloPageBreak","ssMain.onInsertPageBreak()","Insert a more link into your blog post", "btnApolloPageBreak.png"]],
            //features:featuresObj,
            //css: DataStore.m_theme.cms_blog_css
            groups: groupsObj
        });

    },

    // ////////////////////////////////////////////////////////////////////////

    onInsertImage : function(imageID){
        var img = DataStore.getImage(imageID);
        var txt = "<img src='"+img.file_url+"' alt='"+img.description+"' width='"+img.width+"px' height='"+img.height+"px'/>";
        oUtil.obj.insertHTML(txt);
    },

    // ////////////////////////////////////////////////////////////////////////

    /**
     * Insert a custom apollo page break
     */
    onInsertPageBreak : function(){

        // Has the user already got a apollo page break in this page?
        var content = oUtil.obj.getXHTMLBody();
        var myRegExp = /apolloPageBreak/;
        var pos = content.search(myRegExp);

        if (pos > 0){
            AthenaDialog.alert("Sorry, you already have a break in this post and you can only have one, you'll need to delete the old one before you can add one here!", "Can't add more than 1 break");
            return;
        }

        var txt = "<div class='apolloPageBreak'>More...</div> ";
        oUtil.obj.insertHTML(txt);
    }

}

