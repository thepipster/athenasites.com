/**
* Javascript class that allows a user to pick an image from their wordpress media library
* The image data is assumed to be in the class ImagePickerData see the fucntion 
* echoImagePickerJSImageData in plugin_functions.php
*
* @since 24th March, 2010
*/
var StatsSidebarFrame = {
	
    m_targetDiv : '',
	
    /** Number of tags per 'page' */
    m_tagsPerPage : 25,    
    m_currentPage : 0,    
    m_numberPages : 0,
	
    // ////////////////////////////////////////////////////////////////////////////
	
    /**
	*
	*/
    paint : function(targetDiv){
		
        StatsSidebarFrame.m_targetDiv = targetDiv;
		
        var txt = "";

        txt += "<div id='apollo_stats_page_list'></div>";
		
        txt += "<div id='pagesSidebarControls' class='sidebar_page_controls'>";        
        txt += "<table border='0'>";
        txt += "    <tr>";
        txt += "        <td width='33%' align='left'><span class='more_posts_link' id='prev_pages_link' style='padding-left:15px' onclick='StatsSidebarFrame.showPrevPage()' title='Display previous page'>&laquo; prev</span></td>";
        txt += "        <td width='33%' align='center'><span class='more_posts_pages' id='pages_sideframe_page_no' style=''>1 of 2</span></td>";                
        txt += "        <td width='33%' align='right'><span class='more_posts_link' id='next_pages_link' style='padding-right:15px' onclick='StatsSidebarFrame.showNextPage()' title='Display next page'>next &raquo;</span></td>";
        txt += "    </tr>";
        txt += "</table>";        
        txt += "</div>";
        		
		var pos = $(targetDiv).position();

		var offset = pos.top;
		var lineht = 25;				
		var h = $('.ViewFrame').height() - offset - $('#pagesSidebarControls').height(); 
				    		    	    		
		StatsSidebarFrame.m_tagsPerPage = Math.floor(h / lineht);		
        StatsSidebarFrame.m_numberPages = Math.ceil( StatsStore.m_pageSummaryList.length / StatsSidebarFrame.m_tagsPerPage);
                                                                                
        $(targetDiv).html(txt);
		
        StatsSidebarFrame.paintPages();
		
        $('#apollo_stats_page_list').height(h);
        
        $(targetDiv).disableSelection();
        $(targetDiv).noContext();
		
    },

    // ////////////////////////////////////////////////////////////////////////////

    repaint : function(){
        StatsSidebarFrame.paint(StatsSidebarFrame.m_targetDiv);
    },
	
    // ////////////////////////////////////////////////////////////////////////////
	
	m_pageNodes : '',
	
    paintPages : function(){
		
        var pageList = StatsStore.m_pageSummaryList;
								
        var txt = "";
				
        var start_i = StatsSidebarFrame.m_currentPage * StatsSidebarFrame.m_tagsPerPage;
        var end_i = Math.min(pageList.length, start_i+StatsSidebarFrame.m_tagsPerPage);
        $('#page_no').html((StatsSidebarFrame.m_currentPage+1) + " of " + StatsSidebarFrame.m_numberPages);
                
        if (StatsSidebarFrame.m_numberPages == 1){
        	$('#pagesSidebarControls').hide();
        }
                
        for (var i=start_i; i< end_i; i++){
            txt += StatsSidebarFrame.getPageHtml(pageList[i].post_id, pageList[i].page_id, pageList[i].title, pageList[i].page_views);
        }
		
        if (StatsSidebarFrame.m_currentPage < StatsSidebarFrame.m_numberPages-1){
            $('#prev_posts_link').show();
        }
        else {
            $('#prev_posts_link').hide();
        }

        if (StatsSidebarFrame.m_currentPage > 0){
            $('#next_posts_link').show();
        }
        else {
            $('#next_posts_link').hide();
        }
                
        $('#apollo_stats_page_list').html(txt);
        $("#apollo_stats_page_list").disableSelection();
					
    },

    // ////////////////////////////////////////////////////////////////////////////

    showNextPage : function(){
		
        $('#prev_pages_link').show();
        	
        if (StatsSidebarFrame.m_currentPage < StatsSidebarFrame.m_numberPages-1){
            StatsSidebarFrame.m_currentPage += 1;
        }
        
        if (StatsSidebarFrame.m_currentPage == StatsSidebarFrame.m_numberPages-1){
        	$('#next_pages_link').hide();
        }
        
        StatsSidebarFrame.paintPages();
    },

    // ////////////////////////////////////////////////////////////////////////////

    showPrevPage : function(){

        $('#next_pages_link').show();

        if (StatsSidebarFrame.m_currentPage > 0){
            StatsSidebarFrame.m_currentPage -= 1;
        }
        
        if (StatsSidebarFrame.m_currentPage == 0){
        	$('#prev_pages_link').hide();
        }
        
        StatsSidebarFrame.paintPages();
    },
    
    // ////////////////////////////////////////////////////////////////////////////

    getPageHtml : function(post_id, page_id, page_title, page_views){

        var txt = '';
        var selected = '';
        
        if (page_id == StatsStore.m_currentPageID && post_id == StatsStore.m_currentPostID){
            selected = 'selected';
        }

		if (post_id > 0){
			var icon = "images/post.png";
		}
		else {
			var icon = "images/web_page2.png";
		}
		
        txt += "<div onclick=\"StatsSidebarFrame.onSelectPage('"+page_id+"','"+post_id+"')\" class='page page_depth_0' id='page_"+page_id+"' title=''>";
        txt += "    <img class='page_icon' src='"+icon+"'>";
        txt += "    <span class='page_name "+selected+"'>"+page_title+"</span>";
//        txt += "    <span class='page_name "+selected+"'>"+page_title+"&nbsp;"+page_views+"</span>";
        txt += "</div>";
		
        return txt;
    },
		
    // ////////////////////////////////////////////////////////////////////////////
		
    onSelectPage : function(page_id, post_id){
        StatsStore.m_currentPageID = parseInt(page_id);
        StatsStore.m_currentPostID = parseInt(post_id);
        StatsFrame.repaint();
        StatsSidebarFrame.repaint();
    }
			
// ////////////////////////////////////////////////////////////////////////////

}