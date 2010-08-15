/**
*
* 
* @since 27th July, 2010
*/
var GalleriesFrame = {

	m_themeParaID :0,
	
	// ////////////////////////////////////////////////////////////////////////////

	init : function(){

	},
	
	// ////////////////////////////////////////////////////////////////////////////
	
	repaint : function(){
			
		GalleriesFrame.m_themeParaID = GalleriesFrame.getThemeParaForGalleryPage();

		var txt = "";
			
		txt += "<div id='GalleryFrameContent' align='left'>";

		txt += "<table border='0' cellpadding='0' cellspacing='0' style='width:100%; height:100%;'>";

		txt += "<tr valign='top' height='40%' width='100%'>";
		
		txt += "	<td class='frameContents'>";
		txt += "        <span class='frameTitle'>Gallery Contents</span>";
		txt += "        <div align='left' id='apollo_gallery_contents'></div>";
		txt += "	</td>";
							
		// Gallery settings frame (for multi-gal)...........
							
		txt += "	<td rowspan='2' width='250px' id='gallerySettings' style='height:100%; padding:5px; display:none'>";																
		txt += "		<div class='subframebox' style='height:100%; width:100%;'>";								
		txt += "			<span class='title'>Gallery Settings</span>";																		
		txt += "			<div id='gallerySettingsContent'>";
		txt += "			</div>";					
		txt += "		</div>";														
		txt += "	</td>";

		txt += "</tr>";

		txt += "<tr valign='top' height='60%' width='100%'>";
		
		txt += "	<td class='frameContents'>";
		txt += "        <span class='frameTitle'>Images</span>";
		txt += "        <div id='apollo_image_contents'></div>";
		txt += "	</td>";
		
		txt += "</tr>";

		txt += "</table>";
	
		txt += "</div>"					
							
		$('#GalleriesFrame').html(txt);

		GalleriesFrame.paintGallerySlots();	
		FilesFrame.paintImages('#apollo_image_contents');
				
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	showMultiGalSettings : function(){	
		$('#gallerySettings').show();
	},
		
	// ////////////////////////////////////////////////////////////////////////////

	getThemeParaForGalleryPage : function(){	

		var page = DataStore.getCurrentPage();
				
		for(var i=0; i<DataStore.m_themeParaList.length; i++){
			if (DataStore.m_themeParaList[i].page_template_name == page.template){

				if (DataStore.m_themeParaList[i].para_type == 'gallery'){
					return DataStore.m_themeParaList[i].id;
				}				
				else if (DataStore.m_themeParaList[i].para_type == 'multi-gallery'){
					GalleriesFrame.showMultiGalSettings();
					return DataStore.m_themeParaList[i].id;
				}				
				
			}
		}
		return 0;		
	},
		
	// ////////////////////////////////////////////////////////////////////////////
	
	paintGallerySlots : function(){
	
		$(".gallery_thumb").draggable('destroy');		
	
		var txt = "";

		var noSlots = 23;		
		for (var i=0; i<DataStore.m_galleryImageList.length; i++){
			if (DataStore.m_galleryImageList[i].theme_para_id == GalleriesFrame.m_themeParaID &&
					 DataStore.m_galleryImageList[i].slot_number > noSlots){
				noSlots = DataStore.m_galleryImageList[i].slot_number;
			}
		}
		noSlots++;
		
		for (var i=0; i<noSlots; i++){
			//txt += "<div class='gallery_slot' id='slot_"+i+"' align='center'><table><tr valigin='center'><td>";
			//txt += "<div class='gallery_slot_text' align='center'>"+(i+1)+"</div>";
			//txt += "</td></tr></table></div>";
			txt += "<div class='gallery_slot' id='slot_"+i+"' align='center'>";
			txt += "    <div class='gallery_slot_text' align='center'>"+(i+1)+"</div>";
			txt += "</div>";
		}

		// Add special delete slot
		txt += "<div class='gallery_slot' id='delete_slot' align='center'>";
		txt += "    <div class='delete_slot_text' align='center'>remove</div>";
		txt += "</div>";
					
		$('#apollo_gallery_contents').html(txt);
																	
		$('.gallery_slot').droppable({
				drop: GalleriesFrame.onDrop,
				over: function(ev, ui) {$(this).addClass( 'gallery_slot_hover' );},
				out: function(ev, ui) {$(this).removeClass( 'gallery_slot_hover' );}
			});	
										
						
		for (var i=0; i<DataStore.m_galleryImageList.length; i++){
			if ((DataStore.m_galleryImageList[i].page_id == DataStore.m_currentPageID) && 
					(DataStore.m_galleryImageList[i].theme_para_id == GalleriesFrame.m_themeParaID) &&
						(DataStore.m_galleryImageList[i].gallery_number == DataStore.m_currentGalleryNo)){
						
				var img_id = DataStore.m_galleryImageList[i].image_id;
				var image = DataStore.getImage(img_id);				
				var url = image.thumb_url;		
				var slot_no = DataStore.m_galleryImageList[i].slot_number;
												
				$("#slot_"+slot_no).html("<img class='gallery_slot_image gallery_thumb' slot='"+slot_no+"' id='galimg_"+img_id+"' src='"+url+"'/>");
				
			}
		}

		// Make the images draggable
		$(".gallery_thumb").draggable({revert: true, zIndex: 300});	
				
	},
		
	// ////////////////////////////////////////////////////////////////////////////
		
	/**
	* Handle an image being dropped on the gallery, or moved withing the gallery
	*/	
	onDrop : function(event, ui){
	
		//alert('GalleriesFrame.onDrop()');
		
		var slot_id = 0;
		var img_id = -1;
		var url = '';
		var image_moved = true;
		var prev_slot_id = -1;
				
			
		if ($(this).attr('id') == 'delete_slot'){
			img_id = parseInt($(ui.draggable).attr('id').substring(7));
			prev_slot_id = $(ui.draggable).attr('slot');
			//slot_id = parseInt($(this).attr('id').substring(5));			
			GalleryAPI.onRemoveImage(	DataStore.m_siteID, 
										DataStore.m_currentPageID, 
										img_id, 
										DataStore.m_currentGalleryNo, 
										prev_slot_id, 
										GalleriesFrame.m_themeParaID, 
										GalleriesFrame.onImageRemoved);
			
		}										
		else if ($(ui.draggable).attr('id').substring(0,3) == 'gal'){
			
			// This is an existing image being moved!				
			img_id = parseInt($(ui.draggable).attr('id').substring(7));
			slot_id = parseInt($(this).attr('id').substring(5));			
			url = $('#galimg_'+img_id).attr('src');						
			prev_slot_id = $(ui.draggable).attr('slot');
			
			GalleryAPI.onMoveImage( DataStore.m_siteID, 
									DataStore.m_currentPageID, 
									img_id, 
									prev_slot_id,
									slot_id, 
									DataStore.m_currentGalleryNo, 
									DataStore.m_currentGalleryNo, 
									GalleriesFrame.m_themeParaID, 
									GalleriesFrame.onImageMoved);
				
		}
		else {			
			// This is a new image being added
			image_moved = false;			
			img_id = parseInt($(ui.draggable).attr('id').substring(4));			
			slot_id = parseInt($(this).attr('id').substring(5));			
			url = $('#img_'+img_id).attr('src');
			
			GalleryAPI.onAddImage(	DataStore.m_siteID, 
									DataStore.m_currentPageID, 
									img_id, 
									slot_id,
									DataStore.m_currentGalleryNo, 
									GalleriesFrame.m_themeParaID, 
									GalleriesFrame.onImageAdded);
			
		}
/*
		if (img_id == -1){
			alert('bad image id');
			return;
		}
*/								
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	onImageMoved : function(gallery_images, gallery_meta){
		// Add the new image to the data store
		DataStore.onGotGalleryData(gallery_images, gallery_meta);
		GalleriesFrame.paintGallerySlots();
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	onImageAdded : function(gallery_images, gallery_meta){
		// Add the new image to the data store
		DataStore.onGotGalleryData(gallery_images, gallery_meta);
		GalleriesFrame.paintGallerySlots();
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	onImageRemoved : function(slot_number){
		//alert('image removed from slot ' + slot_number);
		DataStore.removeGalleryImage(slot_number);
		GalleriesFrame.paintGallerySlots();
		// Add the new image to the data store
		//DataStore.onGotGalleryData(gallery_images, gallery_meta);
	}	
}