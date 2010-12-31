/**
*
* @author Mike Pritchard (mike@apollosites.com)
* @since 30th December, 2010
*/
var TagsSidebarFrame = {

	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	*
	*/
	paint : function(targetDiv){
		
		var txt = "";
					
		txt += "<div id='apollo_tag_list'></div>";
						
		// Right click pop-up menu....
		txt += "<ul id='folderMenu' class='rightClickMenu'>";
		txt += "	<li class='edit'><a href='#edit'>Rename</a></li>";
		txt += "	<li class='delete'><a href='#delete'>Delete</a></li>";
		txt += "	<li class='quit separator'><a href='#quit'>Cancel</a></li>";
		txt += "</ul>";

		$(targetDiv).html(txt);
		
		TagsSidebarFrame.paintTags();		
		
		$(targetDiv).disableSelection();
		$(targetDiv).noContext();
		
	},

	// ////////////////////////////////////////////////////////////////////////////
	
	paintTags : function(){
		
		var tagList = DataStore.m_mediaTags;
				
		var txt = "";
							
		for (var i=0; i<tagList.length; i++){

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

	onRightClickTag : function(e, obj){

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

		$('#folderMenu .edit').click(function(){TagsSidebarFrame.onMenuItem('rename_tag', obj)});
		$('#folderMenu .delete').click(function(){TagsSidebarFrame.onMenuItem('delete_tag', obj)});
		$('#folderMenu .quit').click(function(){TagsSidebarFrame.onMenuItem('quit', obj)});
		
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
		alert(tag);
		
		//Logger.show();
		//Logger.debug("imgID = " + imgID + " folder id = " + folderID);
		
		/*
		if (folderID == TagsSidebarFrame.ID_UNASSIGNED || folderID > 9){		
			MediaAPI.addMediaToFolder(DataStore.m_siteID, imgID, folderID, TagsSidebarFrame.onAddedToFolder)
		}	
		
		$(this).removeClass( 'tag_name_hover' );
		*/	
	},
	
	onAddedToTag : function(folderID, mediaID){
		/*
		for (var i=0; i<DataStore.m_mediaList.length; i++){
			
			if (DataStore.m_mediaList[i].id == mediaID){
				DataStore.m_mediaList[i].folder_id = folderID;						
				break;
			}
		}
		*/
		FilesFrame.repaint();			
	},

	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	* Respond to the user selecting a menu item
	*/
	onMenuItem : function(item, selectedElement){
				
		$('#imageMenu').hide();
		$('#folderMenu').hide();
		
		var divID = $(selectedElement).attr('id');		
		var tag = $(this).attr('id').substring(4);	// format tag_xxx
		alert(tag);
				
		// Process events related to folders...					
		if (item == 'rename_tag'){
			TagsSidebarFrame.makeTagNameEditable(tag);
		}
		else if (item == 'delete_tag'){		
			AthenaDialog.confirm("Are you sure you want to delete this media tag? This can not be undone.", function(){TagsSidebarFrame.deleteTag(tag);});
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
				TagsSidebarFrame.renameTag(folder_id, $("#tag_name_edit").val());
			}
	    });
		
		$("#tag_name_edit").focus();
	},
		
	// ////////////////////////////////////////////////////////////////////////////
		
	onSelectTag : function(tag){

		DataStore.m_currentTag = parseInt(tag);
		TagsSidebarFrame.paintTags();				

		switch(ssMain.view){			
			case ssMain.VIEW_GALLERIES : GalleriesFrame.repaint(); break;
			case ssMain.VIEW_FILES : FilesFrame.onSelectFolder(); break;
		}
		
	},
			
	// ////////////////////////////////////////////////////////////////////////////

	deleteTag : function(tag){
		//MediaAPI.deleteTag(DataStore.m_siteID, folderId, TagsSidebarFrame.onFolderDeleted);
	},
	
	onTagDeleted : function(tag){
/*
		//AthenaDialog.message("Folder deleted");
		
		var temp = new Array();		
		for (var i=0; i<DataStore.m_folderList.length; i++){
		
			if (DataStore.m_folderList[i].id != folder_id){
				temp.push(DataStore.m_folderList[i]);
			}
			
		}
		DataStore.m_folderList = temp;
		
		TagsSidebarFrame.paintFolders()	
*/
	},
					
	// ////////////////////////////////////////////////////////////////////////////

	/**
	* Rename a folder
	*/
	renameTag : function(tag){
		//MediaAPI.renameFolder(DataStore.m_siteID, folderId, folderName, TagsSidebarFrame.onFolderRenamed);
	},
	
	onTagRenamed : function(folderId, folderName){
		/*
		for (var i=0; i<DataStore.m_folderList.length; i++){
			if (DataStore.m_folderList[i].id == folderId){
				DataStore.m_folderList[i].name = folderName;
				break;
			}
		}

		TagsSidebarFrame.paintTags()
		*/
	}			

}