/* 
 * Dashboard Page functionality
 *
 * @author Mike Pritchard (mike@apollosites.com)
 * @since 3rd January, 2011
 */
var Dashboard = {

    // ////////////////////////////////////////////////////////////////////////

    init : function(siteID){
                
        $('#DashboardFrame').show();
                
        // Setup the data store for the site
        DataStore.init(siteID);

        // Setup classes...
        DashboardFrame.init();

        // Start loading data
        DataStore.load(Dashboard.onDataLoaded);
        
    },

    // ////////////////////////////////////////////////////////////////////////

    onDataLoaded : function(){
        DashboardFrame.repaint();
    }
	
    // ////////////////////////////////////////////////////////////////////////
}

