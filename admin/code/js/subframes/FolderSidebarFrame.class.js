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
	
	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	*
	*/
	paint : function(targetDiv){
		
		var txt = "";

		txt += "<div onclick=\"FolderSidebarFrame.onSelectFolder('0')\" class='folder_filter' id='folders_select_0' title='Select to display all of your images'><img class='folder_filter_icon' src='images/system_folder_icon.png'><span class='folder_name'>Show All</span></div>";
		txt += "<div onclick=\"FolderSidebarFrame.onSelectFolder('1')\" class='folder_filter droppable_folder' id='folders_select_1' title='Select to display all unassigned files (files that have not been added to a folder'><img class='folder_filter_icon' src='images/system_folder_icon.png'><span class='folder_name'>Unassigned Files</span></div>";
		txt += "<div onclick=\"FolderSidebarFrame.onSelectFolder('4')\" class='folder_filter' id='folders_select_4' title='Select to display all files uploaded in the last hour'><img class='folder_filter_icon' src='images/system_folder_icon.png'><span class='folder_name'>Added in last hour</span></div>";
		txt += "<div onclick=\"FolderSidebarFrame.onSelectFolder('2')\" class='folder_filter' id='folders_select_2' title='Select to display all files uploaded in the last 24 hours'><img class='folder_filter_icon' src='images/system_folder_icon.png'><span class='folder_name'>Added in last 24 hours</span></div>";
		txt += "<div onclick=\"FolderSidebarFrame.onSelectFolder('3')\" class='folder_filter' id='folders_select_3' title='Select to display all files uploaded in the last 7 days'><img class='folder_filter_icon' src='images/system_folder_icon.png'><span class='folder_name'>Added in last 7 days</span></div>";						
					
		txt += "<div id='apollo_folder_list'></div>";
						
		// Right click pop-up menu....
		txt += "<ul id='folderMenu' class='rightClickMenu'>";
		txt += "	<li class='edit'><a href='#edit'>Rename</a></li>";
		txt += "	<li class='delete'><a href='#delete'>Delete</a></li>";
		txt += "	<li class='quit separator'><a href='#quit'>Cancel</a></li>";
		txt += "</ul>";

		$(targetDiv).html(txt);
		
		FolderSidebarFrame.paintFolders();		
		
		$(targetDiv).disableSelection();
		$(targetDiv).noContext();
		
	},

	// ////////////////////////////////////////////////////////////////////////////
	
	paintFolders : function(){
		
		var folderList = DataStore.m_folderList;
				
		var txt = "";
		
		// NOTE: Folder id's 0-9 are reserved for system folders, so can safely use these id's here
		
		// Hard-coded 'all' folder....		
		if (DataStore.m_currentFolderID == 0){
			$('#folders_select_0').addClass('selected');
		}
		else {
			$('#folders_select_0').removeClass('selected');
		}
		
		
		// Hard-coded 'unassigned' folder....		
		if (DataStore.m_currentFolderID == FolderSidebarFrame.ID_UNASSIGNED){
			$('#folders_select_'+FolderSidebarFrame.ID_UNASSIGNED).addClass('selected');
		}
		else {
			$('#folders_select_'+FolderSidebarFrame.ID_UNASSIGNED).removeClass('selected');
		}		

		// Hard-coded 'last 7 days' folder....		
		if (DataStore.m_currentFolderID == FolderSidebarFrame.ID_LAST_7_DAYS){
			$('#folders_select_'+FolderSidebarFrame.ID_LAST_7_DAYS).addClass('selected');
		}
		else {
			$('#folders_select_'+FolderSidebarFrame.ID_LAST_7_DAYS).removeClass('selected');
		}
		
		// Hard-coded 'last hour' folder....		
		if (DataStore.m_currentFolderID == FolderSidebarFrame.ID_LAST_1_HOUR){
			$('#folders_select_'+FolderSidebarFrame.ID_LAST_1_HOUR).addClass('selected');
		}
		else {
			$('#folders_select_'+FolderSidebarFrame.ID_LAST_1_HOUR).removeClass('selected');
		}	

		// Hard-coded 'added last 24 hours' folder....		
		if (DataStore.m_currentFolderID == FolderSidebarFrame.ID_LAST_24_HOURS){
			$('#folders_select_'+FolderSidebarFrame.ID_LAST_24_HOURS).addClass('selected');
		}
		else {
			$('#folders_select_'+FolderSidebarFrame.ID_LAST_24_HOURS).removeClass('selected');
		}		
		
		
		for (var i=0; i<folderList.length; i++){

			var folder_name = AthenaUtils.htmlEncode(folderList[i].name);
			var folder_id = folderList[i].id;
			
			//alert(folder_name + " " + folder_id);
			if (folder_id == DataStore.m_currentFolderID){
				
				//txt += "<div id='folder_"+folder_id+"' class='apollo_folder folder_with_menu' style='width:100%;' title='Right click to edit' onclick=\"FolderSidebarFrame.onSelectFolder('"+folder_id+"')\"><div class='folder_name folder_name_selected'>"+folder_name+"</div></div>";
				txt += "<div onclick=\"FolderSidebarFrame.onSelectFolder('"+folder_id+"')\" class='folder droppable_folder' id='folder_"+folder_id+"' title='' class='apollo_folder folder_with_menu'><img class='folder_filter_icon' src='images/folder_icon.png'><span class='folder_name selected'>"+folder_name+"</span></div>";
			}
			else {
//				txt += "<div id='folder_"+folder_id+"' class='apollo_folder folder_with_menu' style='width:100%;' title='Right click to edit' onclick=\"FolderSidebarFrame.onSelectFolder('"+folder_id+"')\"><div class='folder_name'>"+folder_name+"</div></div>";
				txt += "<div onclick=\"FolderSidebarFrame.onSelectFolder('"+folder_id+"')\" class='folder droppable_folder' id='folder_"+folder_id+"' title='' class='apollo_folder folder_with_menu'><img class='folder_filter_icon' src='images/folder_icon.png'><span class='folder_name'>"+folder_name+"</span></div>";
			}	
			
		}
		
		$('#apollo_folder_list').html(txt);
		/*
		$('.apollo_folder').droppable({
				drop: FolderSidebarFrame.onAddToFolder,
				over: function(ev, ui) {$(this).addClass( 'apollo_folder_droppable_hover' );},
				out: function(ev, ui) {$(this).removeClass( 'apollo_folder_droppable_hover' );}
			});			

		*/
				
		$(".folder").rightClick( function(e) {FolderSidebarFrame.onRightClickFolder(e, this);});

		$('.droppable_folder').droppable({
				drop: FolderSidebarFrame.onAddToFolder,
				over: function(ev, ui) {$(this).addClass( 'folder_name_hover' );},
				out: function(ev, ui) {$(this).removeClass( 'folder_name_hover' );}
			});	
			
		$("#apollo_folder_list").disableSelection();
				
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
		
		//alert("imgID = " + imgID + " folder id = " + folderID);
		
		if (folderID == FolderSidebarFrame.ID_UNASSIGNED || folderID > 9){		
			MediaAPI.addMediaToFolder(DataStore.m_siteID, imgID, folderID, FolderSidebarFrame.onAddedToFolder)
		}	
		
		$(this).removeClass( 'folder_name_hover' );
			
	},
	
	onAddedToFolder : function(folderID, mediaID){
			
		if (folderID == 0){
			AthenaDialog.message("Image removed from folder");			
		}
		else {
			AthenaDialog.message("Image added to folder <i>" + DataStore.getFolderName(folderID) + "</i>");			
		}	
		
		
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
		FilesFrame.repaint();
		FolderSidebarFrame.paintFolders();				
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