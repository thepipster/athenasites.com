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
                
        // Setup the data store for the site
        DataStore.init(siteID);

        // Setup classes...
        SettingsFrame.init();

        // Start loading data
        DataStore.load(Settings.onDataLoaded);
        
    },

    // ////////////////////////////////////////////////////////////////////////

	/**
	* Force a refresh by reloading all the data and then repaint
	*/    
    refresh : function() {
        DataStore.load(Settings.onDataLoaded);
    },

    // ////////////////////////////////////////////////////////////////////////
    
    onDataLoaded : function(){
        SettingsFrame.repaint();
    }
	
    // ////////////////////////////////////////////////////////////////////////
}

