/**
* Javascript class that allows a user to pick an image from their wordpress media library
* The image data is assumed to be in the class ImagePickerData see the fucntion 
* echoImagePickerJSImageData in plugin_functions.php
*
* @since 24th March, 2010
*/
var FolderSidebarFrame = {

	ID_ALL : 0, // hard-coded folder id for all images
	ID_UNASSIGNED : 1, // hard-coded folder id for unassigned images
	ID_LAST_24_HOURS : 2, // hard-coded folder id for images uploaded in last 24 hrs
	ID_LAST_7_DAYS : 3, // hard-coded folder id for images uploaded in last 7 days
	ID_LAST_1_HOUR : 4, // hard-coded folder id for images uploaded in last 1 hrs
	
    /** Number of tags per 'page' */
    m_foldersPerPage : 25,    
    m_currentPage : 0,    
    m_numberPages : 0,
		
	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	*
	*/
	paint : function(targetDiv){
		
		var txt = "";

		// Hard code 'switch to tag view' link		
		txt += "<div onclick=\"SidebarFrame.showTags()\" class='folder droppable_folder' title='' class='apollo_folder folder_with_menu'><img class='folder_filter_icon' src='images/tag_icon_blue_24x24.png'><span class='folder_name'>Switch to tag view</span></div>";

		txt += "<div onclick=\"FolderSidebarFrame.onSelectFolder('0')\" class='folder_filter' id='folder_0' title='Select to display all of your images'><img class='folder_fav_icon' src='images/folder_favorites.png'><span class='folder_fav_name'>Show All</span></div>";
		txt += "<div onclick=\"FolderSidebarFrame.onSelectFolder('1')\" class='folder_filter droppable_folder' id='folder_1' title='Select to display all unassigned files (files that have not been added to a folder'><img class='folder_fav_icon' src='images/folder_favorites.png'><span class='folder_fav_name'>Unassigned Files</span></div>";
		//txt += "<div onclick=\"FolderSidebarFrame.onSelectFolder('4')\" class='folder_filter' id='folder_4' title='Select to display all files uploaded in the last hour'><img class='folder_fav_icon' src='images/folder_favorites.png'><span class='folder_fav_name'>Added in last hour</span></div>";
		//txt += "<div onclick=\"FolderSidebarFrame.onSelectFolder('2')\" class='folder_filter' id='folder_2' title='Select to display all files uploaded in the last 24 hours'><img class='folder_fav_icon' src='images/folder_favorites.png'><span class='folder_fav_name'>Added in last 24 hours</span></div>";
		//txt += "<div onclick=\"FolderSidebarFrame.onSelectFolder('3')\" class='folder_filter' id='folder_3' title='Select to display all files uploaded in the last 7 days'><img class='folder_fav_icon' src='images/folder_favorites'><span class='folder_fav_name'>Added in last 7 days</span></div>";						
					
		txt += "<div id='apollo_folder_list'></div>";
				
        txt += "<div id='folderPageControls' class='sidebar_page_controls'>";        
        txt += "<table border='0'>";
        txt += "    <tr>";
        txt += "        <td width='33%' align='left'><span class='more_posts_link' id='prev_posts_link' style='padding-left:15px' onclick='FolderSidebarFrame.showPrevPage()' title='Display previous page'>&laquo; prev</span></td>";
        txt += "        <td width='33%' align='center'><span class='more_posts_pages' id='folders_sideframe_page_no' style=''>1 of 2</span></td>";                
        txt += "        <td width='33%' align='right'><span class='more_posts_link' id='next_posts_link' style='padding-right:15px' onclick='FolderSidebarFrame.showNextPage()' title='Display next page'>next &raquo;</span></td>";
        txt += "    </tr>";
        txt += "</table>";        
        txt += "</div>";
        
        						
		// Right click pop-up menu....
		txt += "<ul id='folderMenu' class='rightClickMenu'>";
		txt += "	<li class='edit'><a href='#edit'>Rename</a></li>";
		txt += "	<li class='delete'><a href='#delete'>Delete</a></li>";
		txt += "	<li class='quit separator'><a href='#quit'>Cancel</a></li>";
		txt += "</ul>";

		$(targetDiv).html(txt);
		
		var h = 0;
		var offset = 110;
		var lineht = 30;
		
		switch(ssMain.view){			
		
			case ssMain.VIEW_GALLERIES : 
				h = ($(window).height()/2) - offset - 3*lineht; 				 
				break;
				
			case ssMain.VIEW_FILES : 
				h = $(window).height() - offset - 3*lineht; 
				break;
		}
		    	
		FolderSidebarFrame.m_foldersPerPage = Math.floor(h / lineht);		
        FolderSidebarFrame.m_numberPages = Math.ceil(DataStore.m_folderList.length / FolderSidebarFrame.m_foldersPerPage);
        
        if (FolderSidebarFrame.m_numberPages == 1){
        	$('#folderPageControls').hide();
        }
        
        		
		FolderSidebarFrame.paintFolders();		
        $('#apollo_folder_list').height(h);
        		
		$(targetDiv).disableSelection();
		$(targetDiv).noContext();
		
	},

	// ////////////////////////////////////////////////////////////////////////////
	
	paintFolders : function(){
		
		var folderList = DataStore.m_folderList;
				
        var start_i = FolderSidebarFrame.m_currentPage * FolderSidebarFrame.m_foldersPerPage;
        var end_i = Math.min(folderList.length, start_i+FolderSidebarFrame.m_foldersPerPage);
        $('#folders_sideframe_page_no').html((FolderSidebarFrame.m_currentPage+1) + " of " + FolderSidebarFrame.m_numberPages);
				
		var txt = "";
		
		// NOTE: Folder id's 0-9 are reserved for system folders, so can safely use these id's here		
		
		// Deal with hard-coded 'faves' folders....		
		for (var i=0; i<5; i++){
			if (DataStore.m_currentFolderID == i){
				$('#folder_'+i + " .folder_fav_name").addClass('selected');
			}
			else {
				$('#folder_'+i + " .folder_fav_name").removeClass('selected');
			}		
		}
		
		for (var i=start_i; i<end_i; i++){

			var folder_name = AthenaUtils.htmlEncode(folderList[i].name);
			var folder_id = folderList[i].id;
			
			if (folder_id == DataStore.m_currentFolderID){
				txt += "<div onclick=\"FolderSidebarFrame.onSelectFolder('"+folder_id+"')\" class='folder droppable_folder' id='folder_"+folder_id+"' title='' class='apollo_folder folder_with_menu'><img class='folder_filter_icon' src='images/folder_grey.png'><span class='folder_name selected'>"+folder_name+"</span></div>";
			}
			else {
				txt += "<div onclick=\"FolderSidebarFrame.onSelectFolder('"+folder_id+"')\" class='folder droppable_folder' id='folder_"+folder_id+"' title='' class='apollo_folder folder_with_menu'><img class='folder_filter_icon' src='images/folder_icon.png'><span class='folder_name'>"+folder_name+"</span></div>";
			}	
			
		}
		
		$('#apollo_folder_list').html(txt);

				
		$(".folder").rightClick( function(e) {FolderSidebarFrame.onRightClickFolder(e, this);});

		$('.droppable_folder').droppable({
				drop: FolderSidebarFrame.onAddToFolder,
				over: function(ev, ui) {$(this).addClass( 'folder_name_hover' );},
				out: function(ev, ui) {$(this).removeClass( 'folder_name_hover' );}
			});	
			
		$("#apollo_folder_list").disableSelection();
				
	},

    // ////////////////////////////////////////////////////////////////////////////

    showNextPage : function(){
		
        $('#prev_posts_link').show();
        	
        if (FolderSidebarFrame.m_currentPage < FolderSidebarFrame.m_numberPages-1){
            FolderSidebarFrame.m_currentPage += 1;
        }
        
        if (FolderSidebarFrame.m_currentPage == FolderSidebarFrame.m_numberPages-1){
        	$('#next_posts_link').hide();
        }
        
        FolderSidebarFrame.paintFolders();
    },

    // ////////////////////////////////////////////////////////////////////////////

    showPrevPage : function(){

        $('#next_posts_link').show();

        if (FolderSidebarFrame.m_currentPage > 0){
            FolderSidebarFrame.m_currentPage -= 1;
        }
        
        if (FolderSidebarFrame.m_currentPage == 0){
        	$('#prev_posts_link').hide();
        }
        
        FolderSidebarFrame.paintFolders();
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

		$('#folderMenu .edit').click(function(){FolderSidebarFrame.onMenuItem('rename_folder', obj)});
		$('#folderMenu .delete').click(function(){FolderSidebarFrame.onMenuItem('delete_folder', obj)});
		$('#folderMenu .quit').click(function(){FolderSidebarFrame.onMenuItem('quit', obj)});
		
	},

	// ////////////////////////////////////////////////////////////////////////////

	/**
	* Get the image list for the currently selected gallery page. Note that even for multi-drag
	* the object dropped on the folder is still the source thumbnail, and not the image that is
	* show during the drag (defined by the helper function)
	*/
	onAddToFolder : function(event, ui){

		var imgID = parseInt($(ui.draggable).attr('id').substring(4));						
		var folderID = parseInt($(this).attr('id').substring(7));	// format folder_xxx
		
		//Logger.show();
		//Logger.debug("imgID = " + imgID + " folder id = " + folderID);
		
		if (folderID == FolderSidebarFrame.ID_UNASSIGNED || folderID > 9){		
			MediaAPI.addMediaToFolder(DataStore.m_siteID, imgID, folderID, FolderSidebarFrame.onAddedToFolder)
		}	
		
		$(this).removeClass( 'folder_name_hover' );
			
	},
	
	onAddedToFolder : function(folderID, mediaID){
		
		/*	
		if (folderID == 0){
			AthenaDialog.message("Image removed from folder");			
		}
		else {
			AthenaDialog.message("Image added to folder <i>" + DataStore.getFolderName(folderID) + "</i>");			
		}	
		*/
		
		for (var i=0; i<DataStore.m_mediaList.length; i++){
			
			if (DataStore.m_mediaList[i].id == mediaID){
				DataStore.m_mediaList[i].folder_id = folderID;						
				break;
			}
		}
		
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
		var name = $('#'+divID + ' .folder_name').html();		
		var folder_id = parseInt(divID.substr(7));		
				
		// Process events related to folders...					
		if (item == 'rename_folder'){
			FolderSidebarFrame.makeFolderNameEditable(folder_id);
		}
		else if (item == 'delete_folder'){		
			AthenaDialog.confirm("Are you sure you want to delete this folder? This can not be undone.", function(){FolderSidebarFrame.deleteFolder(folder_id);});
		}
				
	},

	// ////////////////////////////////////////////////////////////////////////////

	makeFolderNameEditable : function(folder_id){
		
		var divID = '#folder_' + folder_id;
		var name = $(divID + ' .folder_name').html();
		
		$(divID).attr('onclick','');

		$(divID + ' .folder_name').html("<input id='folder_name_edit' style='width:100px' type='text' value='"+name+"' onblur='FolderSidebarFrame.paintFolders()'/>");
		
		$("#folder_name_edit").keypress(function (e) {
			if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
				FolderSidebarFrame.renameFolder(folder_id, $("#folder_name_edit").val());
			}
	    });
		
		$("#folder_name_edit").focus();
	},
		
	// ////////////////////////////////////////////////////////////////////////////
		
	onSelectFolder : function(folder_id){

		DataStore.m_currentFolderID = parseInt(folder_id);
		FolderSidebarFrame.paintFolders();				

		switch(ssMain.view){			
			case ssMain.VIEW_GALLERIES : GalleriesFrame.repaint(); break;
			case ssMain.VIEW_FILES : FilesFrame.onSelectFolder(); break;
		}
		
	},
			
	// ////////////////////////////////////////////////////////////////////////////

	deleteFolder : function(folderId){
		MediaAPI.deleteFolder(DataStore.m_siteID, folderId, FolderSidebarFrame.onFolderDeleted);
	},
	
	onFolderDeleted : function(folder_id){

		//AthenaDialog.message("Folder deleted");
		
		var temp = new Array();		
		for (var i=0; i<DataStore.m_folderList.length; i++){
		
			if (DataStore.m_folderList[i].id != folder_id){
				temp.push(DataStore.m_folderList[i]);
			}
			
		}
		DataStore.m_folderList = temp;
		
		FolderSidebarFrame.paintFolders()	
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	addFolder : function(){		
		MediaAPI.addFolder(DataStore.m_siteID, 'new folder', FolderSidebarFrame.onAddedFolder);
	},
	
	onAddedFolder : function(folderName, folderID){

		//alert("Folder ID: " + folderID + " Folder Name: " + folderName);

		var temp = new Object();
		temp.id = folderID;
		temp.name = folderName;

		DataStore.m_folderList.push(temp);

		FolderSidebarFrame.paintFolders()
					
		// Make the folder name editable so the user can give it a good name
		FolderSidebarFrame.makeFolderNameEditable(folderID);					

/*		
		DataStore.load(function(){
			
			ssMain.onDataLoaded(); 
			
			// Make the folder name editable so the user can give it a good name
			FolderSidebarFrame.makeFolderNameEditable(folderID);					
		})
*/		
		
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	getFolderName : function(folder_id){
	
		if (folder_id == FolderSidebarFrame.ID_UNASSIGNED){
			return "Unassigned";
		}
		
		for (var i=0; i<DataStore.m_folderList.length; i++){
			if (DataStore.m_folderList[i].id == folder_id){
				return DataStore.m_folderList[i].name;
			}			
		}
		
		return "? ("+folder_id+")";
	},
			
	// ////////////////////////////////////////////////////////////////////////////

	/**
	* Rename a folder
	*/
	renameFolder : function(folderId, folderName){
		MediaAPI.renameFolder(DataStore.m_siteID, folderId, folderName, FolderSidebarFrame.onFolderRenamed);
	},
	
	onFolderRenamed : function(folderId, folderName){

		for (var i=0; i<DataStore.m_folderList.length; i++){
			if (DataStore.m_folderList[i].id == folderId){
				DataStore.m_folderList[i].name = folderName;
				break;
			}
		}

		FolderSidebarFrame.paintFolders()
	}			

}