/* 
 * Stats Page functionality
 *
 * @author Mike Pritchard (mike@apollosites.com)
 * @since 3rd January, 2011
 */
var Stats = {

    // ////////////////////////////////////////////////////////////////////////

    init : function(siteID){
                
        $('#StatsFrame').show();
                
        // Setup the data store for the site
        StatsStore.init(siteID);

        // Setup classes...
        StatsFrame.init();

        // Start loading data
        StatsStore.loadPages(90, Stats.onDataLoaded);
    },

    // ////////////////////////////////////////////////////////////////////////
	
	onDataLoaded : function(){
        Stats.refresh();
	},
	
    // ////////////////////////////////////////////////////////////////////////

	/**
	* Force a refresh by reloading all the data and then repaint
	*/    
    refresh : function() {
        SidebarFrame.repaint();
        StatsFrame.repaint();
    }

}

