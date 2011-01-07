/**
* Allows access to the remote (Ajax) Athena Blog API
* 
* @author Mike Pritchard (mike@apollosites.com)
* @since 11th September, 2010
*/
var StatsAPI = {
	
    /** Command url */
    m_url : '/admin/code/php/remoteapi/StatsAPI.php',
							
    // ////////////////////////////////////////////////////////////////////////
	
    /**
    * Initialize the API
    */
    init : function(){
//        StatsAPI.m_url = defines.root_url + StatsAPI.m_url;
    },

    // ////////////////////////////////////////////////////////////////////////

    /**
    * Get the server stats (for s-users only)
    */
    getServerStats : function(noDays, callback){

        AthenaDialog.showLoading("Loading stats");

        var paras = { cmd : 'getServerStats', days: noDays, site_id: 1};

        $.ajax({
            url: StatsAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){
			       AthenaDialog.clearLoading();
			
					if (!ret || ret == undefined){
			            callback(0);
			            return;
					}
					
			        if (ret.result == 'ok'){
			            callback(ret.data.disc_usage, ret.data.server_page_views);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
               	}
        });

    },
    
    // ////////////////////////////////////////////////////////////////////////
		
    /**
    * Get the stat summary for this site
    */
    getSiteSummaryStats : function(siteID, callback){

        AthenaDialog.showLoading("Loading stats");

        var paras = {
            cmd : 'getSiteSummaryStats',
            site_id: siteID
        };

        $.ajax({
            url: StatsAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){
			       AthenaDialog.clearLoading();
			
					if (!ret || ret == undefined){
			            callback(0);
			            return;
					}
					
			        if (ret.result == 'ok'){
			            callback(ret.data.disc_usage, ret.data.page_views, ret.data.crawler_views);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
               	}
        });

    }
}