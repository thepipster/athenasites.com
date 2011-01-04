/* 
 * Settings Page functionality
 *
 * @author Mike Pritchard (mike@apollosites.com)
 * @since 3rd January, 2011
 */
var Settings = {

    // ////////////////////////////////////////////////////////////////////////

    init : function(siteID){
                
        $('#SettingsFrame').show();
                
        // Initialize the remote API's
        BlogAPI.init();
        MediaAPI.init();
        GalleryAPI.init();

        // Setup the data store for the site
        DataStore.init(siteID);

        // Setup classes...
        SettingsFrame.init();

        // Start loading data
        DataStore.load(Settings.onDataLoaded);
        
    },

    // ////////////////////////////////////////////////////////////////////////

    onDataLoaded : function(){
        SettingsFrame.repaint();
    }
	
    // ////////////////////////////////////////////////////////////////////////
}

