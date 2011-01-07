/**
* Store all current data related to statistics
*
* @since 6th January, 2011
* @author (mike@apollosites.com)
*/
var StatsStore = {

    m_currentPageID : 0, 
    
    m_currentPostID : 0, 
    
    m_siteID : 0,
    
    /** List of pages & posts with their summary stats */
    m_pageSummaryList : '',

    // //////////////////////////////////////////////////////////////////////////////////

    init : function(siteID){
        StatsStore.m_siteID = siteID;
    },

    // //////////////////////////////////////////////////////////////////////////////////

    loadPages : function(noDays, callback){
    	StatsAPI.getPageStatsList(StatsStore.m_siteID, noDays, function(pages){StatsStore.onGotPages(pages, callback)});
    },

    // //////////////////////////////////////////////////////////////////////////////////
    
	onGotPages : function(pages, callback){
           
        
        if (!pages || pages == undefined){
	        StatsStore.m_pageSummaryList = new Array();
            return;
        }

        StatsStore.m_pageSummaryList = new Array(pages.length);

        for(var i=0; i<pages.length; i++){

            var temp = new Object();
            temp.title = pages[i].page_title;
            temp.post_id = pages[i].post_id;
            temp.page_id = pages[i].page_id;
            temp.page_views = pages[i].page_views;

            StatsStore.m_pageSummaryList[i] = temp;

        }
    
    	if (callback != undefined){
    		callback();
    	}
	}

}