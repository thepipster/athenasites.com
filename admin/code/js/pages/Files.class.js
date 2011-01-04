/* 
 * Files Page functionality
 *
 * @author Mike Pritchard (mike@apollosites.com)
 * @since 3rd January, 2011
 */
var Files = {

    // ////////////////////////////////////////////////////////////////////////

    init : function(siteID){
                
        $('#FilesFrame').show();
                
        // Initialize the remote API's
        BlogAPI.init();
        MediaAPI.init();
        GalleryAPI.init();        

        // Setup the data store for the site
        DataStore.init(siteID);

        // Setup classes...
        FilesFrame.init();

        // Start loading data
        DataStore.load(Files.onDataLoaded);
        
    },

    // ////////////////////////////////////////////////////////////////////////

    onDataLoaded : function(){    
        FilesFrame.repaint();
        SidebarFrame.repaint();
    }    
}