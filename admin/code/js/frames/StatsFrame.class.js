/**
*
* 
* @since 27th July, 2010
*/
var StatsFrame = {

    // ////////////////////////////////////////////////////////////////////////////

	init : function(){
	},
	
    // ////////////////////////////////////////////////////////////////////////////

	repaint : function(){
		if (StatsStore.m_currentStatsPageID == 0){
	        StatsAPI.getSiteSummaryStats(StatsStore.m_siteID, 90, StatsFrame.gotStats);
		}
		else {
			//alert(StatsStore.m_currentPageID + ", " + StatsStore.m_currentPostID);
	        StatsAPI.getPageStats(StatsStore.m_siteID, 90, StatsStore.m_currentPageID, StatsStore.m_currentPostID, StatsFrame.gotPageStats);	
		}
    },
    
    // ////////////////////////////////////////////////////////////////////////////

    gotStats : function(disc_usage, page_views, crawler_views){
        //StatViewer.paintCrawlerGraph("#apollo_crawler_graph_small", StatsFrame.m_crawlerViews);
        StatViewer.paintStatGraph("#apollo_stats_graph", page_views);        
    },

    // ////////////////////////////////////////////////////////////////////////////

    gotPageStats : function(page_views){
        StatViewer.paintStatGraph("#apollo_stats_graph", page_views);        
    }
	
}