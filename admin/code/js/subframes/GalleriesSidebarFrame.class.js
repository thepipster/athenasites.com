/**
* Javascript class that allows a user to pick an image from their wordpress media library
* The image data is assumed to be in the class ImagePickerData see the fucntion 
* echoImagePickerJSImageData in plugin_functions.php
*
* @since 24th March, 2010
*/
var GalleriesSidebarFrame = {
	
	m_targetDiv : '',
	
    /** Number of tags per 'page' */
    m_tagsPerPage : 25,    
    m_currentPage : 0,    
    m_numberPages : 0,
	
	m_pageList : '',
	
	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	*
	*/
	paint : function(targetDiv){
		
		GalleriesSidebarFrame.m_targetDiv = targetDiv;
		
		var txt = "";

		txt += "<div id='apollo_page_list'></div>";
		
        txt += "<div id='pagesSidebarControls' class='sidebar_page_controls'>";        
        txt += "<table border='0'>";
        txt += "    <tr>";
        txt += "        <td width='33%' align='left'><span class='more_posts_link' id='prev_posts_link' style='padding-left:15px' onclick='GalleriesSidebarFrame.showPrevPage()' title='Display previous page'>&laquo; prev</span></td>";
        txt += "        <td width='33%' align='center'><span class='more_posts_pages' id='page_no' style=''>1 of 2</span></td>";                
        txt += "        <td width='33%' align='right'><span class='more_posts_link' id='next_posts_link' style='padding-right:15px' onclick='GalleriesSidebarFrame.showNextPage()' title='Display next page'>next &raquo;</span></td>";
        txt += "    </tr>";
        txt += "</table>";        
        txt += "</div>";
		
		/*
		// Right click pop-up menu....
		txt += "<ul id='pagesMenu' class='rightClickMenu'>";
		txt += "	<li class='edit'><a href='#edit'>Rename</a></li>";
		txt += "	<li class='duplicate'><a href='#edit'>Duplicate</a></li>";
		txt += "	<li class='delete'><a href='#delete'>Delete</a></li>";
		txt += "	<li class='quit separator'><a href='#quit'>Cancel</a></li>";
		txt += "</ul>";
		*/
		
		GalleriesSidebarFrame.m_pageList = GalleriesSidebarFrame.getPagesWithGalleries();
		
		var offset = 110;
		var h = ($(window).height() - offset)/2;				 
				    		    	    		
		GalleriesSidebarFrame.m_tagsPerPage = Math.floor(h / 25);		
        GalleriesSidebarFrame.m_numberPages = Math.ceil(GalleriesSidebarFrame.m_pageList.length / GalleriesSidebarFrame.m_tagsPerPage);
                        
        if (GalleriesSidebarFrame.m_numberPages == 1){
        	$('#pagesSidebarControls').hide();
        }
                                
		
		$(targetDiv).html(txt);
		
		GalleriesSidebarFrame.paintPages();		

        $('#apollo_page_list').height(h);
		
		$(targetDiv).disableSelection();
		$(targetDiv).noContext();
		
	},

	// ////////////////////////////////////////////////////////////////////////////

	repaint : function(){
		GalleriesSidebarFrame.paint(GalleriesSidebarFrame.m_targetDiv);
	},

	// ////////////////////////////////////////////////////////////////////////////

	getPagesWithGalleries : function(){

		var pageList = new Array();
		
		for (var i=0; i<DataStore.m_pageList.length; i++){
			
			var hasGallery = DataStore.isGalleryPage(DataStore.m_pageList[i].id);
			
			if (hasGallery){
				pageList.push(DataStore.m_pageList[i]);
			}
		}
		
		return pageList;
	},
		
	// ////////////////////////////////////////////////////////////////////////////
	
	paintPages : function(){
		
		var pageList = GalleriesSidebarFrame.m_pageList;
				
        var start_i = GalleriesSidebarFrame.m_currentPage * GalleriesSidebarFrame.m_tagsPerPage;
        var end_i = Math.min(pageList.length, start_i+GalleriesSidebarFrame.m_tagsPerPage);
        $('#page_no').html((GalleriesSidebarFrame.m_currentPage+1) + " of " + GalleriesSidebarFrame.m_numberPages);
				
		var txt = "";		
				
		if (pageList.length == 0){
			txt += "<div style='padding-left:10px;color:#444444;'>You have no pages using a gallery template yet</div>";
		}
		else {
			for (var i=start_i; i<end_i; i++){
				
				var hasGallery = DataStore.isGalleryPage(pageList[i].id);
				
				if (hasGallery){
					txt += GalleriesSidebarFrame.getPageHtml(pageList[i].id, pageList[i].title, pageList[i].status, 0);
				}
			}
		}
											
		$('#apollo_page_list').html(txt);
		
		//$(".folder").rightClick( function(e) {GalleriesSidebarFrame.onRightClickFolder(e, this);});

		$("#apollo_page_list").disableSelection();
				
	},

    // ////////////////////////////////////////////////////////////////////////////

    showNextPage : function(){
		
        $('#prev_posts_link').show();
        	
        if (GalleriesSidebarFrame.m_currentPage < GalleriesSidebarFrame.m_numberPages-1){
            GalleriesSidebarFrame.m_currentPage += 1;
        }
        
        if (GalleriesSidebarFrame.m_currentPage == GalleriesSidebarFrame.m_numberPages-1){
        	$('#next_posts_link').hide();
        }
        
        GalleriesSidebarFrame.paintPages();
    },

    // ////////////////////////////////////////////////////////////////////////////

    showPrevPage : function(){

        $('#next_posts_link').show();

        if (GalleriesSidebarFrame.m_currentPage > 0){
            GalleriesSidebarFrame.m_currentPage -= 1;
        }
        
        if (GalleriesSidebarFrame.m_currentPage == 0){
        	$('#prev_posts_link').hide();
        }
        
        GalleriesSidebarFrame.paintPages();
    },
    
	// ////////////////////////////////////////////////////////////////////////////

	getPageHtml : function(page_id, page_title, page_status, page_depth){

		var txt = '';
        var icon = "images/post.png";
		
        var status_class = "";
        var icon = "images/post.png";

        if (page_status == 'Draft'){
            status_class = 'status_draft';
            //icon = "images/webpage_draft.png";
        }
        else if (page_status == 'Private'){
            //icon = "images/webpage_private.png";
            status_class = 'status_private';
        }
        else if (page_status == 'Published'){
            //icon = "images/webpage_published.png";
            status_class = 'status_public';
        }
				
        var selected = '';
        if (page_id == DataStore.m_currentPageID){
            selected = 'selected';
        }
        
		page_depth = 0;
		
		
        txt += "<div onclick=\"GalleriesSidebarFrame.onSelectPage('"+page_id+"')\" class='page page_depth_"+page_depth+"' id='page_"+page_id+"' title=''>";
        txt += "    <img class='page_icon' src='images/web_page2.png'>";
        txt += "    <span class='page_name "+status_class+" "+selected+"'>"+page_title+"</span>";
        txt += "</div>";

/*		
        txt += "<div onclick=\"GalleriesSidebarFrame.onSelectPage('"+page_id+"')\" class='page page_depth_"+page_depth+"' id='page_"+page_id+"' title=''>";
        //txt += "    <img class='node_icon' src='"+nodeIcon+"'>";
        txt += "    <img class='page_icon' src='"+icon+"'>";
        txt += "    <span class='page_name "+status_class+" "+selected+"'>"+page_title+"</span>";
        txt += "</div>";
  */      				
		return txt;
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	onSelectPage : function(page_id){
		DataStore.m_currentPageID = parseInt(page_id);
		GalleriesFrame.repaint();
		GalleriesSidebarFrame.paintPages();				
	}
			
	// ////////////////////////////////////////////////////////////////////////////

}