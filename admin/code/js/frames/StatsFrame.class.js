/**
*
* 
* @since 27th July, 2010
*/
var StatsFrame = {

	noDays : 120,
	
    // ////////////////////////////////////////////////////////////////////////////

	init : function(){
	},
	
    // ////////////////////////////////////////////////////////////////////////////

	repaint : function(){
		if (StatsStore.m_currentPageID == 0){
	        StatsAPI.getSiteSummaryStats(StatsStore.m_siteID, StatsFrame.noDays, StatsFrame.gotStats);
		}
		else {
			//alert(StatsStore.m_currentPageID + ", " + StatsStore.m_currentPostID);
	        StatsAPI.getPageStats(StatsStore.m_siteID, StatsFrame.noDays, StatsStore.m_currentPageID, StatsStore.m_currentPostID, StatsFrame.gotPageStats);	
		}
    },
    
    // ////////////////////////////////////////////////////////////////////////////

    gotStats : function(disc_usage, page_views, crawler_views){
        //StatViewer.paintCrawlerGraph("#apollo_crawler_graph_small", StatsFrame.m_crawlerViews);
        StatViewer.paintStatGraph("#apollo_stats_graph", page_views);        
        $('#apollo_stats_graph_title').html("Site overall traffic for last " + StatsFrame.noDays + " days");      
    },

    // ////////////////////////////////////////////////////////////////////////////

    gotPageStats : function(page_views){
        StatViewer.paintStatGraph("#apollo_stats_graph", page_views);  
        $('#apollo_stats_graph_title').html("Page traffic for last " + StatsFrame.noDays + " days");      
    }
	
}