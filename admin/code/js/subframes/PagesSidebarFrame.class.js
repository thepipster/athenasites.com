/**
* Javascript class that allows a user to pick an image from their wordpress media library
* The image data is assumed to be in the class ImagePickerData see the fucntion 
* echoImagePickerJSImageData in plugin_functions.php
*
* @since 24th March, 2010
*/
var PagesSidebarFrame = {
	
	m_targetDiv : '',
	
	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	*
	*/
	paint : function(targetDiv){
		
		PagesSidebarFrame.m_targetDiv = targetDiv;
		
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

	repaint : function(){
		PagesSidebarFrame.paint(PagesSidebarFrame.m_targetDiv);
	},
	
	// ////////////////////////////////////////////////////////////////////////////
	
	paintPages : function(){
		
		var pageList = DataStore.m_pageList;
				
		var txt = "";		
		
		if (ssMain.view == ssMain.VIEW_GALLERIES){
		
			for (var i=0; i<pageList.length; i++){
				var hasGallery = false;
				if (hasGallery){
					txt += PagesSidebarFrame.getPageHtml(pageList[i].id, pageList[i].title, 0);
				}
			}
			
		}
		else {
		
			for (var i=0; i<pageList.length; i++){
							
				if (pageList[i].parent_page_id == 0){
	
					txt += PagesSidebarFrame.getPageHtml(pageList[i].id, pageList[i].title, 0);
					
					// Paint children...
					
					for (var k=0; k<pageList.length; k++){
	
						if (pageList[k].parent_page_id == pageList[i].id){
							
							txt += PagesSidebarFrame.getPageHtml(pageList[k].id, pageList[k].title, 1);
							
							// Paint grand-children....						
							for (var m=0; m<pageList.length; m++){
	
								if (pageList[m].parent_page_id == pageList[k].id){
									txt += PagesSidebarFrame.getPageHtml(pageList[m].id, pageList[m].title, 2);
								}					
							}
						}					
						
					}
	
				}
				
		}

			
		}
		
		$('#apollo_page_list').html(txt);
		
		//$(".folder").rightClick( function(e) {PagesSidebarFrame.onRightClickFolder(e, this);});

		$("#apollo_page_list").disableSelection();
				
	},

	// ////////////////////////////////////////////////////////////////////////////

	getPageHtml : function(page_id, page_title, page_depth){

		var txt = '';
				
		if (page_id == DataStore.m_currentPageID){			
			txt += "<div onclick=\"PagesSidebarFrame.onSelectPage('"+page_id+"')\" class='page page_depth_"+page_depth+"' id='page_"+page_id+"' title=''><img class='page_icon' src='images/web_page.png'><span class='page_name selected'>"+page_title+"</span></div>";
		}
		else {
			txt += "<div onclick=\"PagesSidebarFrame.onSelectPage('"+page_id+"')\" class='page page_depth_"+page_depth+"' id='page_"+page_id+"' title=''><img class='page_icon' src='images/web_page.png'><span class='page_name'>"+page_title+"</span></div>";
		}
		
		return txt;
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	addPage : function(){
		var title = 'New page ' + (DataStore.m_pageList.length+1);
		var pageSlug = PagesSidebarFrame.encodeSlug(title) + '.html';
		var order = 0;
		var isHome = 0;
		MediaAPI.addPage(DataStore.m_siteID, title, '', 'Draft', 0, 0, pageSlug, order, isHome, PagesSidebarFrame.onPageAdded);
	},
	
	onPageAdded : function(pageObj){

		DataStore.addPage(pageObj);

		PagesSidebarFrame.onSelectPage(pageObj.id);
	},
	
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