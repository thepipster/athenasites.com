/**
* Javascript class that allows a user to pick an image from their wordpress media library
* The image data is assumed to be in the class ImagePickerData see the fucntion 
* echoImagePickerJSImageData in plugin_functions.php
*
* @since 24th March, 2010
*/
var GalleriesSidebarFrame = {
	
	m_targetDiv : '',
	
	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	*
	*/
	paint : function(targetDiv){
		
		GalleriesSidebarFrame.m_targetDiv = targetDiv;
		
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
		
		GalleriesSidebarFrame.paintPages();		
		
		$(targetDiv).disableSelection();
		$(targetDiv).noContext();
		
	},

	// ////////////////////////////////////////////////////////////////////////////

	repaint : function(){
		GalleriesSidebarFrame.paint(GalleriesSidebarFrame.m_targetDiv);
	},
	
	// ////////////////////////////////////////////////////////////////////////////
	
	paintPages : function(){
		
		var pageList = DataStore.m_pageList;
				
		var txt = "";		
		
		var noGalPages = 0;
		
		// Get number of pages with galleries
		for (var i=0; i<pageList.length; i++){
			var hasGallery = false;
			if (hasGallery){
				noGalPages++;
			}
		}
		
		if (noGalPages == 0){
			txt += "<div style='padding-left:10px; color:#444444'>(you have no pages using a gallery template yet)</div>";
		}
		else {
			for (var i=0; i<pageList.length; i++){
				var hasGallery = false;
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

	getPageHtml : function(page_id, page_title, page_status, page_depth){

		var txt = '';
		
		var status = "";
		if (page_status == 'Draft'){
			icon = "images/webpage_draft.png";
		}
		else if (page_status == 'Private'){
			icon = "images/webpage_private.png";
		}
		else if (page_status == 'Published'){
			icon = "images/webpage_published.png";
		}
				
		if (page_id == DataStore.m_currentPageID){			
			txt += "<div onclick=\"GalleriesSidebarFrame.onSelectPage('"+page_id+"')\" class='page page_depth_"+page_depth+"' id='page_"+page_id+"' title=''><img class='page_icon' src='"+icon+"'><span class='page_name selected'>"+page_title+"</span></div>";
		}
		else {
			txt += "<div onclick=\"GalleriesSidebarFrame.onSelectPage('"+page_id+"')\" class='page page_depth_"+page_depth+"' id='page_"+page_id+"' title=''><img class='page_icon' src='"+icon+"'><span class='page_name'>"+page_title+"</span></div>";
		}
				
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