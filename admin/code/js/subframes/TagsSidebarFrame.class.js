/**
*
* @author Mike Pritchard (mike@apollosites.com)
* @since 30th December, 2010
*/
var TagsSidebarFrame = {

    /** Number of tags per 'page' */
    m_tagsPerPage : 25,    
    m_currentPage : 0,    
    m_numberPages : 0,

	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	*
	*/
	paint : function(targetDiv){
		
		var txt = "";

		txt += "<div id='apollo_tag_list'></div>";
															
        txt += "<div class='sidebar_page_controls'>";        
        txt += "<table border='0'>";
        txt += "    <tr>";
        txt += "        <td width='33%' align='left'><span class='more_posts_link' id='prev_posts_link' style='padding-left:15px' onclick='TagsSidebarFrame.showPrevPage()' title='Display previous page'>&laquo; prev</span></td>";
        txt += "        <td width='33%' align='center'><span class='more_posts_link' id='page_no' style=''>Page 1 of 2</span></td>";                
        txt += "        <td width='33%' align='right'><span class='more_posts_link' id='next_posts_link' style='padding-right:15px' onclick='TagsSidebarFrame.showNextPage()' title='Display next page'>next &raquo;</span></td>";
        txt += "    </tr>";
        txt += "</table>";        
        txt += "</div>";
						
						
		// Right click pop-up menu....
		txt += "<ul id='tagMenu' class='rightClickMenu'>";
		txt += "	<li class='edit'><a href='#edit'>Rename</a></li>";
		txt += "	<li class='delete'><a href='#delete'>Delete</a></li>";
		txt += "	<li class='quit separator'><a href='#quit'>Cancel</a></li>";
		txt += "</ul>";

		$(targetDiv).html(txt);
		
		var h = 0;
		var offset = 120;
		
		switch(ssMain.view){			
		
			case ssMain.VIEW_GALLERIES : 
				h = ($(window).height()/2) - offset;				 
				break;
				
			case ssMain.VIEW_FILES : 
				h = $(window).height() - offset; 
				break;
		}
		    		    	    		
		TagsSidebarFrame.m_tagsPerPage = Math.floor(h / 24);		
        TagsSidebarFrame.m_numberPages = Math.ceil(DataStore.m_mediaTags.length / TagsSidebarFrame.m_tagsPerPage);
        
        $('#apollo_tag_list').height(h);
		
		TagsSidebarFrame.paintTags();		
		
		$(targetDiv).disableSelection();
		$(targetDiv).noContext();
		
	},

	// ////////////////////////////////////////////////////////////////////////////
	
	paintTags : function(){
				
		var tagList = DataStore.m_mediaTags;
						
		if (tagList == undefined || tagList == null){
			$("#apollo_tag_list").html("");
		}
		
        var start_i = TagsSidebarFrame.m_currentPage * TagsSidebarFrame.m_tagsPerPage;
        var end_i = Math.min(tagList.length, start_i+TagsSidebarFrame.m_tagsPerPage);
        $('#page_no').html("Page " + (TagsSidebarFrame.m_currentPage+1) + " of " + TagsSidebarFrame.m_numberPages);
		
		var txt = "";

		// Hard code a 'switch to folder view' item							
		txt += "<div onclick=\"SidebarFrame.showFolders()\" class='tag' title='' class='apollo_tag tag_with_menu'><img class='tag_icon' src='images/folder_icon_20x20.png'><span class='switch_to_folder_view_name'>Switch to folder view</span></div>";
							
		for (var i=start_i; i<end_i; i++){

			var tag = tagList[i];
						
			if (tag == DataStore.m_currentTag){
				txt += "<div onclick=\"TagsSidebarFrame.onSelectTag('"+tag+"')\" class='tag droppable_tag' id='tag_"+tag+"' title='' class='apollo_tag tag_with_menu'><img class='tag_icon' src='images/tag_icon_blue.png'><span class='tag_name selected'>"+tag+"</span></div>";
			}
			else {
				txt += "<div onclick=\"TagsSidebarFrame.onSelectTag('"+tag+"')\" class='tag droppable_tag' id='tag_"+tag+"' title='' class='apollo_tag tag_with_menu'><img class='tag_icon' src='images/tag_icon_blue.png'><span class='tag_name'>"+tag+"</span></div>";
			}	
			
		}
		
		$('#apollo_tag_list').html(txt);

		$(".tag").rightClick( function(e) {TagsSidebarFrame.onRightClickTag(e, this);});

		$('.droppable_tag').droppable({
				drop: TagsSidebarFrame.onAddToTag,
				over: function(ev, ui) {$(this).addClass( 'tag_name_hover' );},
				out: function(ev, ui) {$(this).removeClass( 'tag_name_hover' );}
			});	
			
		$("#apollo_tag_list").disableSelection();
				
	},

    // ////////////////////////////////////////////////////////////////////////////

    showNextPage : function(){
		
        $('#prev_posts_link').show();
        	
        if (TagsSidebarFrame.m_currentPage < TagsSidebarFrame.m_numberPages-1){
            TagsSidebarFrame.m_currentPage += 1;
        }
        
        if (TagsSidebarFrame.m_currentPage == TagsSidebarFrame.m_numberPages-1){
        	$('#next_posts_link').hide();
        }
        
        TagsSidebarFrame.paintTags();
    },

    // ////////////////////////////////////////////////////////////////////////////

    showPrevPage : function(){

        $('#next_posts_link').show();

        if (TagsSidebarFrame.m_currentPage > 0){
            TagsSidebarFrame.m_currentPage -= 1;
        }
        
        if (TagsSidebarFrame.m_currentPage == 0){
        	$('#prev_posts_link').hide();
        }
        
        TagsSidebarFrame.paintTags();
    },
    
	// ////////////////////////////////////////////////////////////////////////////

	onRightClickTag : function(e, obj){

		e.stopPropagation();
		
		//var x = e.pageX - $('#adminmenu').width() - 30;
		//var y = e.pageY - $('#wphead').height() - $('#update-nag').height();		
		var x = e.pageX;
		var y = e.pageY;		

		$('#tagMenu').css('top',y);
		$('#tagMenu').css('left',x);
		$('#tagMenu').show();

		$('#tagMenu .edit').unbind('click');
		$('#tagMenu .delete').unbind('click');
		$('#tagMenu .quit').unbind('click');

		$('#tagMenu .edit').click(function(){TagsSidebarFrame.onMenuItem('rename_tag', obj)});
		$('#tagMenu .delete').click(function(){TagsSidebarFrame.onMenuItem('delete_tag', obj)});
		$('#tagMenu .quit').click(function(){TagsSidebarFrame.onMenuItem('quit', obj)});
		
	},

	// ////////////////////////////////////////////////////////////////////////////

	/**
	* Get the image list for the currently selected gallery page. Note that even for multi-drag
	* the object dropped on the folder is still the source thumbnail, and not the image that is
	* show during the drag (defined by the helper function)
	*/
	onAddToTag : function(event, ui){
		
		var imgID = parseInt($(ui.draggable).attr('id').substring(4));						
		var tag = $(this).attr('id').substring(4);	// format tag_xxx

        MediaAPI.addMediaCSVTags(DataStore.m_siteID, imgID, tag, TagsSidebarFrame.onAddedToTag);
		
	},
			
	onAddedToTag : function(mediaObj, tags){
        DataStore.updateMedia(mediaObj);				
        DataStore.m_mediaTags = tags;
		TagsSidebarFrame.onSelectTag(DataStore.m_currentTag);
	},

	// ////////////////////////////////////////////////////////////////////////////
		
	/**
	* Respond to the user selecting a menu item
	*/
	onMenuItem : function(item, selectedElement){
				
		$('#tagMenu').hide();
		
		var divID = $(selectedElement).attr('id');		
		var name = $('#'+divID + ' .tag_name').html();		
		var tag = divID.substr(4);
				
		// Process events related to folders...					
		if (item == 'rename_tag'){
			TagsSidebarFrame.makeTagNameEditable(tag);
		}
		else if (item == 'delete_tag'){		
			AthenaDialog.confirm("Are you sure you want to delete this tag? This will not delete any of your images, just this tag", function(){TagsSidebarFrame.deleteTag(tag);});
		}
				
	},	

	// ////////////////////////////////////////////////////////////////////////////

	makeTagNameEditable : function(tag){
		
		var divID = '#tag_' + tag;
		var name = $(divID + ' .tag_name').html();
		
		$(divID).attr('onclick','');

		$(divID + ' .tag_name').html("<input id='tag_name_edit' style='width:100px' type='text' value='"+name+"' onblur='TagsSidebarFrame.paintTags()'/>");
		
		$("#tag_name_edit").keypress(function (e) {
			if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
				TagsSidebarFrame.renameTag(tag, $("#tag_name_edit").val());
			}
	    });
		
		$("#tag_name_edit").focus();
	},
		
	// ////////////////////////////////////////////////////////////////////////////
		
	onSelectTag : function(tag){
		
		DataStore.m_currentTag = tag;
		TagsSidebarFrame.paintTags();				

		switch(ssMain.view){			
			case ssMain.VIEW_GALLERIES : GalleriesFrame.repaint(); break;
			case ssMain.VIEW_FILES : FilesFrame.onSelectFolder(); break;
		}
		
	},
			
	// ////////////////////////////////////////////////////////////////////////////

	deleteTag : function(tag){
		MediaAPI.deleteMediaTag(DataStore.m_siteID, tag, TagsSidebarFrame.onTagDeleted)
	},
	
	onTagDeleted : function(newTagList){
        
        DataStore.m_mediaTags = newTagList;
        
        if (DataStore.m_mediaTag != undefined && DataStore.m_mediaTag != null && DataStore.m_mediaTag.length > 0){
        	DataStore.m_currentTag = DataStore.m_mediaTags[0];
			TagsSidebarFrame.onSelectTag(DataStore.m_currentTag);
        }
        else {
			TagsSidebarFrame.onSelectTag('');
        }
        		
	},
					
	// ////////////////////////////////////////////////////////////////////////////

	/**
	* Rename a folder
	*/
	renameTag : function(oldTagName, newTagName){
	
		// Check to see if this new name is not in use
		for (var i=0; i<DataStore.m_mediaTags.length; i++){
			if (DataStore.m_mediaTags[i] == newTagName){
				AthenaDialog.alert("Sorry, you already have a tag with that name!");
				return;
			}
		}
		
		TagsSidebarFrame.m_newTag = newTagName;
		MediaAPI.renameMediaTag(DataStore.m_siteID, oldTagName, newTagName, TagsSidebarFrame.onTagRenamed);
	},
	
	onTagRenamed : function(tags){
        DataStore.m_mediaTags = tags;
		TagsSidebarFrame.onSelectTag(TagsSidebarFrame.m_newTag);
	}			

}