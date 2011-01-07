/**
*
* @author Mike Pritchard (mike@apollosites.com)
* @since 3rd January, 2011
*/
var ssMain = {

    VIEW_DASHBOARD 	: 1,
    VIEW_PAGES 		: 3,
    VIEW_FILES 		: 2,
    VIEW_POSTS 		: 4,
    VIEW_GALLERIES 	: 5,
    VIEW_STATS 		: 6,
    VIEW_SETTINGS 	: 7,

    view : 1,
    
    // ////////////////////////////////////////////////////////////////////////

    init : function(siteID, view){

		ssMain.view = view;
		
        // Setup the JS logger
        Logger.init('#debug_txt');
        //Logger.showOnError();

        // Initialize the remote API's
        SystemAPI.init();
        BlogAPI.init();
        MediaAPI.init();
        GalleryAPI.init();

        // Start auto-save timer....
        setInterval ( "DataStore.save()", 5000 );

        // Save when browser quits
        $(window).unload(ssMain.onDataChange);

		// Force resize, and setup resize event
		setTimeout("ssMain.onResize()", 100);
        $(window).resize(ssMain.onResize());
        
		// Change listeners
		$('.apolloDataInput').typing({ stop: ssMain.onDataChange, delay: 400});
		$('.apolloDataInput').change(ssMain.onDataChange);        
	},

    // ////////////////////////////////////////////////////////////////////////

	/**
	* Pipe refresh requests depending on the current page
	*/
	refresh : function(){

        switch(ssMain.view){
            case ssMain.VIEW_PAGES : Pages.refresh(); break;
            case ssMain.VIEW_POSTS : Posts.refresh(); break;
            case ssMain.VIEW_FILES: Files.refresh(); break;
            case ssMain.VIEW_DASHBOARD: Dashboard.refresh(); break;
            case ssMain.VIEW_GALLERIES: Galleries.refresh(); break;
            case ssMain.VIEW_SETTINGS: Settings.refresh(); break;
             /* case ssMain.VIEW_STATS: Pages.refresh(); break; */
        }	
        
		DataStore.load(ssMain.onDataLoaded);
	},
		
    // ////////////////////////////////////////////////////////////////////////

    onResize : function(){
     	$('#MainContents').height($(window).height()-$('#menu_container').height()-20);
    },

    // ////////////////////////////////////////////////////////////////////////

    onLogout : function(){
        AthenaDialog.confirm("Are you sure you want to log out?", ssMain.startLogout);
    },

    startLogout : function(){
        SystemAPI.logOut(ssMain.doLogout);
    },

    doLogout : function(){
        window.location = "index.php";
    },
		
    // ////////////////////////////////////////////////////////////////////////

	/**
	* Listen for changes in data input fields (that have the class 'apolloDataInput'), and pipe to the correct frame
	*/	
	onDataChange : function(){
        switch(ssMain.view){
            case ssMain.VIEW_PAGES : PagesFrame.onChange(); break;
            case ssMain.VIEW_POSTS : PostsFrame.onChange(); break;
            case ssMain.VIEW_FILES: FilesFrame.onImageEditorChange(); break;
            case ssMain.VIEW_DASHBOARD:
            case ssMain.VIEW_GALLERIES:
            case ssMain.VIEW_STATS: break;
        }	
        DataStore.save();	
	}		
}