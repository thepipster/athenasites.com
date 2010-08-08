/**
* Javascript class that allows a user to pick an image from their wordpress media library
* The image data is assumed to be in the class ImagePickerData see the fucntion 
* echoImagePickerJSImageData in plugin_functions.php
*
* @since 24th March, 2010
*/
var PagesSidebarFrame = {
	
	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	*
	*/
	paint : function(targetDiv){
		
		var txt = "";

		txt += "<div id='apollo_page_list'></div>";
						/*
		// Right click pop-up menu....
		txt += "<ul id='pagesMenu' class='rightClickMenu'>";
		txt += "	<li class='edit'><a href='#edit'>Rename</a></li>";
		txt += "	<li class='duplicate'><a href='#edit'>Duplicate</a></li>";
		txt += "	<li class='delete'><a href='#delete'>Delete</a></li>";
		txt += "	<li class='quit separator'><a href='#quit'>Cancel</a></li>";
		txt += "</ul>";
*/
		$(targetDiv).html(txt);
		
		PagesSidebarFrame.paintPages();		
		
		$(targetDiv).disableSelection();
		$(targetDiv).noContext();
		
	},

	// ////////////////////////////////////////////////////////////////////////////
	
	paintPages : function(){
		
		var pageList = DataStore.m_pageList;
				
		var txt = "";		
		
		for (var i=0; i<pageList.length; i++){
			
			if (pageList[i].title != undefined || pageList[i].title != ''){
				var page_title = AthenaUtils.htmlEncode(pageList[i].title);
			}
			else {
				var page_title = 'unnamed';
			}
			
			var page_id = pageList[i].id;
			
			//alert(folder_name + " " + folder_id);
			
			if (page_id == DataStore.m_currentPageID){			
				txt += "<div class='page' id='page_"+page_id+"' title=''><img class='page_icon' src='images/web_page.png'><span class='page_name selected' onclick=\"PagesSidebarFrame.onSelectPage('"+page_id+"')\">"+page_title+"</span></div>";
			}
			else {
				txt += "<div class='page' id='page_"+page_id+"' title=''><img class='page_icon' src='images/web_page.png'><span class='page_name' onclick=\"PagesSidebarFrame.onSelectPage('"+page_id+"')\">"+page_title+"</span></div>";
			}

			
		}
		
		$('#apollo_page_list').html(txt);
		
		//$(".folder").rightClick( function(e) {PagesSidebarFrame.onRightClickFolder(e, this);});

		$("#apollo_page_list").disableSelection();
				
	},

	// ////////////////////////////////////////////////////////////////////////////

	addPage : function(){
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

		$('#folderMenu .edit').click(function(){PagesSidebarFrame.onMenuItem('rename_folder', obj)});
		$('#folderMenu .delete').click(function(){PagesSidebarFrame.onMenuItem('delete_folder', obj)});
		$('#folderMenu .quit').click(function(){PagesSidebarFrame.onMenuItem('quit', obj)});
		
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
		DataStore.m_currentPageID = parseInt(page_id);
		PagesFrame.repaint();
		PagesSidebarFrame.paintPages();				
	}
			
	// ////////////////////////////////////////////////////////////////////////////

}