/**
* Javascript class that allows a user to pick an image from their wordpress media library
* The image data is assumed to be in the class ImagePickerData see the fucntion 
* echoImagePickerJSImageData in plugin_functions.php
*
* @since 24th March, 2010
*/
var PagesSidebarFrame = {
	
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
		
        PagesSidebarFrame.m_targetDiv = targetDiv;
		
        var txt = "";

        txt += "<div id='apollo_page_list'></div>";
		
        txt += "<div id='pagesSidebarControls' class='sidebar_page_controls'>";        
        txt += "<table border='0'>";
        txt += "    <tr>";
        txt += "        <td width='33%' align='left'><span class='more_posts_link' id='prev_pages_link' style='padding-left:15px' onclick='PagesSidebarFrame.showPrevPage()' title='Display previous page'>&laquo; prev</span></td>";
        txt += "        <td width='33%' align='center'><span class='more_posts_pages' id='pages_sideframe_page_no' style=''>1 of 2</span></td>";                
        txt += "        <td width='33%' align='right'><span class='more_posts_link' id='next_pages_link' style='padding-right:15px' onclick='PagesSidebarFrame.showNextPage()' title='Display next page'>next &raquo;</span></td>";
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

		var pos = $(targetDiv).position();

		var offset = pos.top;
		var lineht = 25;				
		var h = $('.ViewFrame').height() - offset - $('#pagesSidebarControls').height(); 
				    		    	    		
		PagesSidebarFrame.m_tagsPerPage = Math.floor(h / lineht);		
        PagesSidebarFrame.m_numberPages = Math.ceil( DataStore.m_pageList.length / PagesSidebarFrame.m_tagsPerPage);
                        
        if (PagesSidebarFrame.m_numberPages == 1){
        	$('#pagesSidebarControls').hide();
        }
                                
        $(targetDiv).html(txt);
		
        PagesSidebarFrame.paintPages();
		
        $('#apollo_page_list').height(h);
        
        $(targetDiv).disableSelection();
        $(targetDiv).noContext();
		
    },

    // ////////////////////////////////////////////////////////////////////////////

    repaint : function(){
        PagesSidebarFrame.paint(PagesSidebarFrame.m_targetDiv);
    },
	
    // ////////////////////////////////////////////////////////////////////////////
	
	m_pageNodes : '',
	
    paintPages : function(){
		
        var pageList = DataStore.m_pageList;
		
        var start_i = PagesSidebarFrame.m_currentPage * PagesSidebarFrame.m_tagsPerPage;
        var end_i = Math.min(pageList.length, start_i+PagesSidebarFrame.m_tagsPerPage);
        $('#pages_sideframe_page_no').html((PagesSidebarFrame.m_currentPage+1) + " of " + PagesSidebarFrame.m_numberPages);
							
		var pageNodes = new Array();
			
        for (var i=0; i<pageList.length; i++){
									
            if (PagesSidebarFrame.m_tagsPerPage && pageList[i].parent_page_id == 0){

	            pageNodes.push(PagesSidebarFrame.getPageHtml(pageList[i].id, pageList[i].title, pageList[i].status, 0));
				
                // Paint children...
				
                for (var k=0; k<pageList.length; k++){

                    if (pageList[k].parent_page_id == pageList[i].id){
						
                        pageNodes.push(PagesSidebarFrame.getPageHtml(pageList[k].id, pageList[k].title, pageList[k].status, 1));
						
                        // Paint grand-children....
                        for (var m=0; m<pageList.length; m++){

                            if (pageList[m].parent_page_id == pageList[k].id){
                                pageNodes.push(PagesSidebarFrame.getPageHtml(pageList[m].id, pageList[m].title, pageList[m].status, 2));
                            }
                            
                        }
                    }
					
                }

            }
							
        }
		
		PagesSidebarFrame.m_pageNodes = pageNodes;
		
        var txt = "";
        for (var i=start_i; i<end_i; i++){
        	txt += pageNodes[i];
        }
		
        $('#apollo_page_list').html(txt);
		
        //$(".folder").rightClick( function(e) {PagesSidebarFrame.onRightClickFolder(e, this);});

        $("#apollo_page_list").disableSelection();					
    },

    // ////////////////////////////////////////////////////////////////////////////

    showNextPage : function(){
		
        $('#prev_pages_link').show();
        	
        if (PagesSidebarFrame.m_currentPage < PagesSidebarFrame.m_numberPages-1){
            PagesSidebarFrame.m_currentPage += 1;
        }
        
        if (PagesSidebarFrame.m_currentPage == PagesSidebarFrame.m_numberPages-1){
        	$('#next_pages_link').hide();
        }
        
        PagesSidebarFrame.paintPages();
    },

    // ////////////////////////////////////////////////////////////////////////////

    showPrevPage : function(){

        $('#next_pages_link').show();

        if (PagesSidebarFrame.m_currentPage > 0){
            PagesSidebarFrame.m_currentPage -= 1;
        }
        
        if (PagesSidebarFrame.m_currentPage == 0){
        	$('#prev_pages_link').hide();
        }
        
        PagesSidebarFrame.paintPages();
    },
    
    // ////////////////////////////////////////////////////////////////////////////

    getPageHtml : function(page_id, page_title, page_status, page_depth){

        var txt = '';

        var status_class = "";

        if (page_status == 'Draft'){
            status_class = 'status_draft';
        }
        else if (page_status == 'Private'){
            status_class = 'status_private';
        }
        else if (page_status == 'Published'){
            status_class = 'status_public';
        }

        var selected = '';
        if (page_id == DataStore.m_currentPageID){
            selected = 'selected';
        }

        txt += "<div onclick=\"PagesSidebarFrame.onSelectPage('"+page_id+"')\" class='page page_depth_"+page_depth+"' id='page_"+page_id+"' title=''>";
        txt += "    <img class='page_icon' src='images/web_page2.png'>";
        txt += "    <span class='page_name "+status_class+" "+selected+"'>"+page_title+"</span>";
        txt += "</div>";

        return txt;
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    addPage : function(){
        var title = 'New page ' + (DataStore.m_pageList.length+1);
        var pageSlug = AthenaUtils.encodeSlug(title);
        var order = 0;
        var isHome = 0;
        MediaAPI.addPage(DataStore.m_siteID, title, '', 'Draft', 0, 0, pageSlug, order, isHome, PagesSidebarFrame.onPageAdded);
    },
	
    onPageAdded : function(pageObj){
        
        DataStore.addPage(pageObj);        		
        
        // Make sure this new page is visible on the side bar                
        PagesSidebarFrame.m_currentPage = PagesSidebarFrame.m_numberPages-1;

        PagesSidebarFrame.onSelectPage(pageObj.id);
		
    },
	
    // ////////////////////////////////////////////////////////////////////////////
	
    /**
	* Encode the page slug based on the title
	*/
    encodeSlug : function(title){
	
        var slug = title.replace(/ /g, ""); // Remove spaces
        slug = slug.replace(/'/g, ""); // Remove single quotes
        slug = slug.replace(/\"/g, ""); // Remove double quotes

        slug = escape(slug);
        slug = slug.replace(/\//g,"%2F");
        slug = slug.replace(/\?/g,"%3F");
        slug = slug.replace(/=/g,"%3D");
        slug = slug.replace(/&/g,"%26");
        slug = slug.replace(/@/g,"%40");
		
        return slug;
    },
		
    // ////////////////////////////////////////////////////////////////////////////

    onRightClickFolder : function(e, obj){

        e.stopPropagation();
		
        //var x = e.pageX - $('#adminmenu').width() - 30;
        //var y = e.pageY - $('#wphead').height() - $('#update-nag').height();
        var x = e.pageX;
        var y = e.pageY;

        $('#folderMenu').css('top',y);
        $('#folderMenu').css('left',x);
        $('#folderMenu').show();

        $('#folderMenu .edit').unbind('click');
        $('#folderMenu .delete').unbind('click');
        $('#folderMenu .quit').unbind('click');

        $('#folderMenu .edit').click(function(){
            PagesSidebarFrame.onMenuItem('rename_folder', obj)
            });
        $('#folderMenu .delete').click(function(){
            PagesSidebarFrame.onMenuItem('delete_folder', obj)
            });
        $('#folderMenu .quit').click(function(){
            PagesSidebarFrame.onMenuItem('quit', obj)
            });
		
    },

    // ////////////////////////////////////////////////////////////////////////////
	
    /**
	* Respond to the user selecting a menu item
	*/
    onMenuItem : function(item, selectedElement){
    /*
		$('#imageMenu').hide();
		$('#folderMenu').hide();
		
		var divID = $(selectedElement).attr('id');		
		var name = $('#'+divID + ' .folder_name').html();		
		var folder_id = parseInt(divID.substr(7));		
				
		// Process events related to folders...					
		if (item == 'rename_folder'){
			PagesSidebarFrame.makeFolderNameEditable(folder_id);
		}
		else if (item == 'delete_folder'){		
			AthenaDialog.confirm("Are you sure you want to delete this folder? This can not be undone.", function(){PagesSidebarFrame.deleteFolder(folder_id);});
		}
		*/		
    },

    // ////////////////////////////////////////////////////////////////////////////
		
    onSelectPage : function(page_id){
    	// Store the current content first!
		PagesFrame.onChange();		
        DataStore.m_currentPageID = parseInt(page_id);
        PagesFrame.repaint();
        PagesSidebarFrame.repaint();
    }
			
// ////////////////////////////////////////////////////////////////////////////

}