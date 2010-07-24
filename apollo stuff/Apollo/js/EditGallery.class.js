var EditGallery = {

	/** Gallery page post id */
	m_galleryPageID : 0,
	
	m_slots : 0,
	
	m_minNumberSlots : 20,

	m_maxNoSlots : 60,
	
	/** Matches the thumbnail width in the php code */	
	thumbWidth : 50,
	
	m_galleryDescriptions : '',
		
	m_themeParaID : -1,
	
	// ////////////////////////////////////////////////////////////////////////////
	
	init : function(){

		// Find out what gallery is currently selected
		EditGallery.selectGallery(jQuery('#apollo_edit_gallery_select').val());
			
		jQuery('#ApolloImageSelector').droppable({
		   drop: EditGallery.onRemove
		});		
											
	},

	// ////////////////////////////////////////////////////////////////////////////

	selectGallery : function(fieldVal){

		// Number in format xx_yy where xx is the theme para id, and yy is the page_id
		var sepIndx = fieldVal.indexOf('_');
				
		EditGallery.m_themeParaID = parseInt(fieldVal.substring(0,sepIndx));
		EditGallery.m_galleryPageID = parseInt(fieldVal.substring(sepIndx+1));

		EditGallery.getImageList();
				
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	/**
	* Add another (empty) slot to the gallery
	*/
	
	addSlot : function(){
					
		// Add an empty slot at the end
		var img = new Array();
		img.url = '';
		img.image_id = 0;
		
		// Add to all galleries
		for (var gal_no=0; gal_no<EditGallery.m_slots.length; gal_no++){
		
			if (EditGallery.m_slots[gal_no].length >= EditGallery.m_maxNoSlots){
				if (EditGallery.m_slots.length == 0){
					alert("Sorry, you can't add any more slots to this gallery!");
				}
			}
			else {
				EditGallery.m_slots[gal_no].push(img);
			}
		}
				
		EditGallery.repaintGallery();
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	/**
	* Respond to user request to add another gallery
	*/
	addSubGallery : function(){
	
		var galData = -1;
		for (var i=0; i<EditGalleryData.galleryData.length; i++){
			if (EditGalleryData.galleryData[i].page_post_id == EditGallery.m_galleryPageID){
				galData = EditGalleryData.galleryData[i];
				EditGallery.galeryDataIndex = i;
				break;
			}
		}
		
		if (galData == -1) {
			alert('Error!');
		}
			
		var no_gals = galData.no_galleries;
		
		if (no_gals >= 99){
			alert("I'm sorry, but you've already reached your maximum number of sub-galleries!");
			return;
		}
		
		var paras = {cmd: 7, page_id: EditGallery.m_galleryPageID, theme_para_id: galData.theme_para_id};
				
		jQuery.ajax({
			url: EditGalleryData.commandURL,
			dataType: "json",
			data: paras,
			success: function(ret){EditGallery.onSubGalleryAdded(ret);}
		});	

				
	},
	
	onSubGalleryAdded : function(msg){
	
		//eval("var msg = ("+ret+")");
								
		if (msg.result = "ok"){
			//EditGallery.m_themeParaID = msg.data.theme_para_id;
			/*
			var page_id = msg.data.page_post_id;
			
			// Find this gallery in the EditGalleryData data, and update the sub-gallery count
			for (var i=0; i<EditGalleryData.galleryData.length; i++){
				if (EditGalleryData.galleryData[i].page_post_id == page_id){
					EditGalleryData.galleryData[i].no_galleries++;
					break;
				}
			}
	
			EditGallery.getImageList();	
			*/
			// Force page refresh
			window.location = window.location;	
		}
		else {
			ApolloDialog.error("Sorry, you can not add any more sub-galleries!");
		}
			
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	deleteGallery : function(themeParaID, galleryNo){
		ApolloDialog.confirm("Are you sure you want to delete this sub-gallery? This can not be undone!", function(){EditGallery.doDeleteGallery(themeParaID, galleryNo)});			
	},


	doDeleteGallery : function(themeParaID, galleryNo){

		paras = {cmd: 18, page_id: EditGallery.m_galleryPageID, theme_para_id: themeParaID, gallery_no: galleryNo};
		
		jQuery.ajax({
			url: EditGalleryData.commandURL,
			dataType: "json",
			data: paras,
			success: function(ret){
				if (ret.result == 'ok'){
					window.location.href=window.location.href;
				}
				else {
					ApolloDialog.error("Sorry, you can not delete this sub-gallery!");
				}
			} // Force a page reload
		});	
			
	},
			
	// ////////////////////////////////////////////////////////////////////////////

	setGalleryTitle : function(themeParaID, galleryNo){
	
		paras = {cmd: 9, page_id: EditGallery.m_galleryPageID, theme_para_id: themeParaID, gallery_no: galleryNo, title: jQuery('#galname_'+galleryNo).val()};
		
		jQuery.ajax({
			url: EditGalleryData.commandURL,
			dataType: "json",
			data: paras
//			success: function(ret){window.location.href=window.location.href;} // Force a page reload
//			success: function(ret){alert(ret)} // Force a page reload
		});	
		
	},

	// ////////////////////////////////////////////////////////////////////////////

	setGalleryImagePostID : function(themeParaID, galleryNo){
		ImagePickerDialog.show(ImagePickerDialog.MODE_GALLERY_THUMB, false, themeParaID, EditGallery.m_galleryPageID, galleryNo);
	},
				
	// ////////////////////////////////////////////////////////////////////////////

	clear : function(){
		jQuery('#apollo_gallery').html("");
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	galeryDataIndex : -1,

	repaintGallery : function(){
		
		jQuery(".gallery_thumb").draggable('destroy');
		jQuery(".thumb").draggable('destroy');
		jQuery(".gallery_slot").droppable('destroy');
		
		var galData = -1;
		
		for (var i=0; i<EditGalleryData.galleryData.length; i++){
			if (EditGalleryData.galleryData[i].page_post_id == EditGallery.m_galleryPageID){
				galData = EditGalleryData.galleryData[i];
				EditGallery.galeryDataIndex = i;
				break;
			}
		}
		
		// Is this a multi-gallery?
		//alert(galData.page_post_id);
		
		// Clear draggables
		jQuery(".gallery_thumb").draggable('destroy');
		jQuery(".thumb").draggable('destroy');
		

		if (galData.is_multi){
			jQuery('.apollo_add_subgallery_button').show();
		}
		else {
			jQuery('.apollo_add_subgallery_button').hide();
		}

		
		EditGallery.doRepaintGallery(galData);
				
		
		// Setup draggables....
				
		jQuery(".gallery_thumb").draggable({revert: 'invalid', zIndex: 300});
		jQuery(".thumb").draggable({revert: true, zIndex: 300});		
		
		jQuery('.gallery_slot').droppable({
		   drop: EditGallery.onDrop
		});							
		
		jQuery("#apollo_gallery").disableSelection();
		
	},
		
	// ////////////////////////////////////////////////////////////////////////////

	/**
	* Paint the view for a standard gallery
	*/
	doRepaintGallery : function(galData){	
				
		var no_galleries = 1;
		
		if (galData.is_multi){
			no_galleries = galData.no_galleries;
		}
						
		var txt = "";
		
		for (var gal_no=0; gal_no < no_galleries; gal_no++){

			var gal_nostr = '' + gal_no;			
			if (gal_nostr.length < 2) gal_nostr = '00'+gal_no; // Make sure this is a 3 digit no
			if (gal_nostr.length < 3) gal_nostr = '0'+gal_no; // Make sure this is a 3 digit no

			//alert("gal_no = " + gal_no + " gal_nostr = " + gal_nostr + " length = " + gal_nostr.length);
			
			txt += "<div class='box'>";
			
			if (galData.is_multi){
				
				//var title = galData[gal_no].title;
				//var desc = galData[gal_no].description;
				var title = galData.meta[gal_no].title;
				var thumb_url = galData.meta[gal_no].thumb_url;

				txt += "<div class='multicontrols'>";
				txt += "   <table><tr valign='middle'>";
				txt += "      <td style='padding-right:5px'>";
				if (thumb_url != ''){
					txt += "         <img class='gallery_meta_thumb' src='"+thumb_url+"' width='30px'/>";
				}
				txt += "      </td>";
				txt += "      <td>";
				txt += "         Title: ";
				txt += "         <input id='galname_"+gal_no+"' type='text' value='"+title+"'/>";
				txt += "      </td>";
				txt += "      <td>";
				txt += "         <div class='apollo_update_button' onclick=\"EditGallery.setGalleryTitle('"+galData.theme_para_id+"', '"+gal_no+"')\"></div>";
				txt += "      </td>";
				txt += "      <td style='padding-left:10px'>";
				txt += "         <div class='apollo_thumbnail_button' onclick=\"EditGallery.setGalleryImagePostID('"+galData.theme_para_id+"', '"+gal_no+"')\"></div>";
				txt += "      </td>";
				txt += "      <td style='padding-left:10px'>";
				txt += "         <div class='apollo_delete_gallery_button' onclick=\"EditGallery.deleteGallery('"+galData.theme_para_id+"', '"+gal_no+"')\"></div>";
				txt += "      </td>";								
				txt += "   </tr></table>";
				txt += "</div>";

			}
						
			for (var i=0; i<EditGallery.m_slots[gal_no].length; i++){
							
				txt += "<div class='gallery_slot' id='slot_"+gal_nostr+"_"+i+"' align='center'><table><tr><td>";
				
//				alert('['+gal_no+'] ' + EditGallery.m_slots[gal_no][i].gallery_number + ' ' + gal_no);
				
				if (EditGallery.m_slots[gal_no][i].url == ''){
					txt += "<div class='gallery_slot_text' align='center'>"+(i+1)+"</div>";
				}
				else {
					var img_id = EditGallery.m_slots[gal_no][i].image_id;
					var url = EditGallery.m_slots[gal_no][i].url;				
					var style = "style='background-image: url("+url+")'; margin:0; padding:0;";
						
					txt += "<img src='"+url+"' id='galimg_"+gal_nostr+"_"+img_id+"' slot='"+i+"' class='gallery_slot_image gallery_thumb' width='100%' />";
					
				}
				
				txt += "</td></tr></table></div>";
			}	
			
			txt += "</div>";
			
			if (galData.is_multi){
				txt += "<br/>";
			}
		
		}
			
		jQuery('#apollo_gallery').html(txt);
		

		
	},
	
	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	* Get the image list for the currently selected gallery page
	*/
	getImageList : function(){
	
		//alert('Getting image list for page ' + EditGallery.m_galleryPageID + ' from ' + EditGalleryData.commandURL);
		
		var paras = {cmd: 1, page_id: EditGallery.m_galleryPageID, theme_para_id: EditGallery.m_themeParaID};
				
		jQuery.ajax({
			url: EditGalleryData.commandURL,
			dataType: "json",
			data: paras,
			success: function(ret){EditGallery.onGotImageList(ret);}
		});	
			
	},
	
	// ////////////////////////////////////////////////////////////////////////////
	
	onGotImageList : function(msg){
	
		//eval("var msg = ("+ret+")");
				
		//alert(msg.result);
				
		if (msg.result = "ok"){
		
			var number_galleries = msg.number_galleries; // Number of sub galleries, should be 1 except for mult-galleries
						
			EditGallery.m_slots = new Array(number_galleries);
												
			for(var gal_no=0; gal_no<number_galleries; gal_no++){

				var max_slot_no = 0;
				var data = msg.data[gal_no];
				
				if (data == undefined){
					data = new Array();
				}
											
				// Get the max slot no
				for (var i=0; i<data.length; i++){
					var slot_no = parseInt(data[i].slot_number) + 1;
					if (slot_no > max_slot_no) {
						max_slot_no = slot_no;
					}
				}			
	
				if (max_slot_no < EditGallery.m_minNumberSlots){
					max_slot_no = EditGallery.m_minNumberSlots;
				}
	
				// Clear out all the slots
				EditGallery.m_slots[gal_no] = new Array(max_slot_no);
					
				for (var i=0; i<max_slot_no; i++){
				
					var img = new Array();
					img.url = '';
					img.image_id = 0;
					img.gallery_no = 0;
					img.theme_para_id = 0;
																
					EditGallery.m_slots[gal_no][i] = img;				
				}
							
				
				// Load up new data...	
				for (var i=0; i<data.length; i++){
					
					var slot_no = data[i].slot_number;
					
					EditGallery.m_slots[gal_no][slot_no].url = data[i].url;
					EditGallery.m_slots[gal_no][slot_no].image_id = data[i].image_post_id;
					EditGallery.m_slots[gal_no][slot_no].theme_para_id = data[i].theme_para_id;
					
					//alert("[" + data[i].image_post_id + "] " + data[i].url);
					
				}
			
			}
																		
			EditGallery.repaintGallery();
			
		}
		else {
			ApolloDialog.error("Error getting images, please refresh the page to try again. If this problem persists, contact ApolloSites support. We apologize for any inconvenience");
		}
			
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	onMoveImage : function(imageID, old_slot, new_slot, oldGalleryNo, newGalleryNo) {
		
		//alert('moving image: imageID = ' + imageID + ' slot = ' + slot + ' url = ' + imgURL);
		
		var paras = {cmd: 3, image_id: imageID, old_slot_no: old_slot, new_slot_no: new_slot, page_id: EditGallery.m_galleryPageID, old_gallery_no: oldGalleryNo, new_gallery_no: newGalleryNo, theme_para_id: EditGallery.m_themeParaID};
		
		ApolloDialog.showLoading("Moving image");
				
		jQuery.ajax({
			url: EditGalleryData.commandURL,
			dataType: "json",
			data: paras,
			success: function(ret){EditGallery.onImageMoved(ret);}
		});
	
	},
	
	onImageMoved : function(ret){
		
		//eval("var msg = ("+ret+")");
		ApolloDialog.hideLoading();
				
		if (ret.result != "ok"){
			ApolloDialog.error('Error moving image');
		}
		else {
			EditGallery.onGotImageList(ret);
		}
				
	},
		
	// ////////////////////////////////////////////////////////////////////////////
	
	onAddImage : function(imageID, slot, imgURL, galleryNo){
		
		//alert('adding image: pageID = ' + EditGallery.m_galleryPageID + ' imageID = ' + imageID + ' slot = ' + slot + ' gallery = ' + galleryNo + ' url = ' + imgURL);
		
		var paras = {cmd: 2, page_id: EditGallery.m_galleryPageID, image_id: imageID, slot_no: slot, gallery_no: galleryNo, theme_para_id: EditGallery.m_themeParaID};
			
		ApolloDialog.showLoading("Adding image");
				
		jQuery.ajax({
			url: EditGalleryData.commandURL,
			dataType: "json",
			data: paras,
			success: function(ret){EditGallery.onImageAdded(ret);}
		});	
		
	},

	onImageAdded : function(ret){
		
		//eval("var msg = ("+ret+")");
		ApolloDialog.hideLoading();
				
		if (ret.result != "ok"){
			ApolloDialog.error('Error adding image');
		}
		else {
			EditGallery.onGotImageList(ret);
		}
		
	},
	
	// ////////////////////////////////////////////////////////////////////////////
	
	onRemoveImage : function(imageID, galleryNo, slot){

		var paras = {cmd: 4, page_id: EditGallery.m_galleryPageID, slot_no: slot, image_id: imageID, gallery_no: galleryNo, theme_para_id: EditGallery.m_themeParaID};
				
		jQuery.ajax({
			url: EditGalleryData.commandURL,
			dataType: "json",
			data: paras,
			success: function(ret){EditGallery.onImageRemoved(ret);}
		});	
		
	},
	
	onImageRemoved : function(ret){
		
		//eval("var msg = ("+ret+")");
				
		if (ret.result != "ok"){
			ApolloDialog.error('Error removing image');
		}

		// Force a repaint!
		EditGallery.repaintGallery();
		
	},
		
	// ////////////////////////////////////////////////////////////////////////////
		
	/**
	* Handle an image being dropped on the gallery, or moved withing the gallery
	*/	
	onDrop : function(event, ui){
	
		//alert('EditGallery.onDrop()');
		
		var slot_id = 0;
		var img_id = -1;
		var url = '';
		var image_moved = true;
		var gal_no = -1;
		var prev_slot_id = -1;
		var dropped_gal_no = -1;
						
		if (jQuery(ui.draggable).attr('id').substring(0,3) == 'gal'){

			// This is an existing image being moved!	
			
			// Format: 'galimg_xxx_yy' where xxx is gallery id, and yy is image_id			 
			gal_no = parseInt(jQuery(ui.draggable).attr('id').substring(7,10));						
			img_id = parseInt(jQuery(ui.draggable).attr('id').substring(11));						
			slot_id = parseInt(jQuery(this).attr('id').substring(9));	// format slot_000_4
			dropped_gal_no = parseInt(jQuery(this).attr('id').substring(5,8));	// format slot_000_4

			var gal_nostr = '' + gal_no;			
			if (gal_nostr.length < 2) gal_nostr = '00'+gal_no; // Make sure this is a 3 digit no
			if (gal_nostr.length < 3) gal_nostr = '0'+gal_no; // Make sure this is a 3 digit no

			url = jQuery('#galimg_'+gal_nostr+"_"+img_id).attr('src');
						
			//alert('moving image: imageID = ' + img_id + ' slot = ' + slot_id + ' gallery no = ' + gal_no + ' url = ' + url);
			
			// As this image was moved, clear the slot it came from					
			var prev_slot_id = jQuery(ui.draggable).attr('slot');	

			if (prev_slot_id != -1){	
				EditGallery.m_slots[gal_no][prev_slot_id].url = '';
				EditGallery.m_slots[gal_no][prev_slot_id].image_id = 0;
			}
			else {
				alert('Error: Previous slot is undefined!');
			}
						
		}
		else {
			
			// This is a new image being added
			image_moved = false;
			
			// Format: 'slot_xxx_yy' where xxx is gallery id, and yy is image_id			 
			
			img_id = parseInt(jQuery(ui.draggable).attr('id').substring(4));			
			
			slot_id = parseInt(jQuery(this).attr('id').substring(9));			
	        gal_no = parseInt(jQuery(this).attr('id').substring(5,8));	
			dropped_gal_no = gal_no;
			
			//alert(jQuery(this).attr('id') + " --- " + jQuery(this).attr('id').substring(5,8));
			
			url = jQuery('#img_'+img_id).attr('src');
							
			//alert('adding image: imageID = ' + img_id + ' slot = ' + slot_id + ' gallery no = ' + gal_no + ' url = ' + url);
						
			//<img id='img_jQuerypost_id' src='jQuerythumb_url' class='thumb' width='".THUMB_WIDTH."'/>
			//var txt = "<img src='"+url+"' id='galimg_"+img_id+"' slot='"+slot_id+"' class='thumb gallery_thumb' width='"+EditGallery.thumbWidth+"' />";		

		}

		if (img_id == -1){
			alert('bad image id');
			return;
		}

		
		//
		// Check to see if the new slot is empty, if it isn't then shift everything by 1 		
		//
		
		if (EditGallery.m_slots[dropped_gal_no][slot_id].url != ''){

			tempSlots = new Array();
		
			for (var i=0; i<slot_id; i++){
				tempSlots.push(EditGallery.m_slots[dropped_gal_no][i]);
			}
		
			var img = new Array();
			img.url = url;
			img.image_id = img_id;
						
			tempSlots.push(img);
			
			var skipped = false;
			
			for (var j=slot_id; j<EditGallery.m_slots[dropped_gal_no].length; j++){									
				
				// Check if the next slot is open, if so we stop incrementing everything
				
				if (EditGallery.m_slots[dropped_gal_no][j].url == ''){
					if (!skipped){
						skipped = true;
					}
					else {
						if (tempSlots.length < EditGallery.m_maxNoSlots){
							tempSlots.push(EditGallery.m_slots[dropped_gal_no][j]);
						}
					}
				}					
				else {
					if (tempSlots.length < EditGallery.m_maxNoSlots){
						tempSlots.push(EditGallery.m_slots[dropped_gal_no][j]);
					}
				}
				
			}				
			
			EditGallery.m_slots[dropped_gal_no] = tempSlots;
		}
		else {
			// Add to slot array
			EditGallery.m_slots[dropped_gal_no][slot_id].url = url;
			EditGallery.m_slots[dropped_gal_no][slot_id].image_id = img_id;
		}	
			
			
		// Update the database...
		if (image_moved){
			// onMoveImage : function(old_slot, new_slot, galleryNo)
			EditGallery.onMoveImage(img_id, prev_slot_id, slot_id, gal_no, dropped_gal_no);
		}
		else {
			EditGallery.onAddImage(img_id, slot_id, url, gal_no);
		}
			
		// Repaint gallery view		
		//EditGallery.clear();
		EditGallery.repaintGallery();
		
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	/**
	* Handle a image being dragged out of the gallery and back into the library (i.e.
	* removed from the gallery)
	*/
	onRemove : function(event, ui){
	
		if (jQuery(ui.draggable).attr('id').substring(0,3) == 'gal'){

			// This is an existing image being moved!	
			//var img_id = parseInt(jQuery(ui.draggable).attr('id').substring(7));						
			var slot_id = parseInt(jQuery(ui.draggable).attr('slot'));			

			// Format: 'galimg_xxx_yy' where xxx is gallery id, and yy is image_id			 
			// This is an existing image being moved!	
			var gal_no = parseInt(jQuery(ui.draggable).attr('id').substring(7,10));						
			var img_id = parseInt(jQuery(ui.draggable).attr('id').substring(11));						
			//var slot_id = parseInt(jQuery(this).attr('id').substring(9));
			
			//alert("Removing Image: slot = " + slot_id + " image id = " + img_id + " gallery no = " + gal_no);
			
			// Clear the slot
			if (slot_id != undefined){
				EditGallery.m_slots[gal_no][slot_id].url = '';
				EditGallery.m_slots[gal_no][slot_id].image_id = 0;
				EditGallery.m_slots[gal_no][slot_id].theme_para_id = 0;
			}
				
			EditGallery.onRemoveImage(img_id, gal_no, slot_id, EditGallery.m_themeParaID);			

			// Repaint gallery view		
			EditGallery.repaintGallery();
		}			
		
	}		
}

