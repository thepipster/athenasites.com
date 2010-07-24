/**
* Javascript class that allows a user to edit information about an image
*/
var ImageEditDialog = {

	image_post_id : 0,
	image_index : 0, // Image's index in the ImagePickerData image list array
	
	// ////////////////////////////////////////////////////////////////////////////

	show : function(targetDiv, post_id){

		var paras = {cmd: 17, image_post_id: post_id};
												
		jQuery.ajax({
			url: ImagePickerData.commandURL,
			dataType: "json",
			data: paras,
			success: function(ret){ImageEditDialog.onGotData(ret, targetDiv, post_id);}
		});
		
		/*
		var dHeight = jQuery(window).height()/2;
		var dWidth = jQuery(window).width()/2;
		
		var txt = "";
		
		txt += "<div id='ApolloImageEditDialog' align='center'>";
		
		txt += "<img class='imageDisplay' src='' width='100px' height='100px'/>";
		
		txt += "<table width='100%' height='100%' cellspacing='3px'>";		

		txt += "   <tr>";
		txt += "      <td class='titleField'>Title</td>";
		txt += "      <td class='dataField'><input id='apollo_image_title' type=text value=''/></td>";
		txt += "   </tr>";

		txt += "   <tr>";
		txt += "      <td class='titleField'>Added</td>";
		txt += "      <td class='dataField'></td>";
		txt += "   </tr>";

		txt += "   <tr>";
		txt += "      <td class='titleField'>Size</td>";
		txt += "      <td class='dataField'></td>";
		txt += "   </tr>";

		txt += "   <tr>";
		txt += "      <td class='titleField'>Caption</td>";
		txt += "      <td class='dataField'><input id='apollo_image_caption' width='100%' type=text value=''/></td>";
		txt += "   </tr>";

		txt += "   <tr>";
		txt += "      <td class='titleField'>Description</td>";
		txt += "      <td class='dataField'><textarea id='apollo_image_desc' width='100%'></textarea></td>";
		txt += "   </tr>";


		txt += "</table>";
		txt += "</div>";		
					
		jQuery(targetDiv).html(txt);
		
		jQuery(targetDiv).dialog( 'destroy' );
	
		jQuery(targetDiv).dialog({
				modal: true, 
				width:dWidth, 
				height:dHeight, 
				title: '',
				buttons: {
					Save: function() {						
						ImageEditDialog.onSave(image_post_id); jQuery(this).dialog('close');
					},
					Cancel: function() {
						jQuery(this).dialog('close');
					}
			} });
		*/		
		
	},
	
	// ////////////////////////////////////////////////////////////////////////////
		
	onGotData : function(ret, targetDiv, image_post_id){
			
		ImagePickerDialog.image_post_id = image_post_id;
	
		if (ret.result != 'ok') {
			ApolloDialog.error('Error, could not load data!');
			return;
		}
				
		// Get the image data...
				
		var imageList = ImagePickerData.imageList;
		var imageFound = false;
		
		for (var i=0; i<imageList.length; i++){
			
			if (imageList[i].post_id == image_post_id){
			
				var thumb_url = imageList[i].thumb_url;
				var post_id = imageList[i].post_id;
				var img_width = imageList[i].width;
				var img_height = imageList[i].height;
				var image_folder_id = imageList[i].folder_id;
				var added_date = imageList[i].date_added;	// UTC

				var img_title = ApolloUtils.htmlEncode(ret.title);
				var caption = ApolloUtils.htmlEncode(ret.caption);
				var desc = ApolloUtils.htmlEncode(ret.desc);
				var alt_text = ApolloUtils.htmlEncode(ret.alt_text);
				var image_url = ret.image_url;
								
				imageFound = true;
				break;
			}
		}
		
		if (!imageFound) {
			ApolloDialog.error('Error, could not find image!');
			return;
		}
						
		var dHeight = img_height/2 + 250;
		var dWidth = img_width/2 + 50;
		
		if (dWidth < 500) dWidth = 500;
		if (dHeight < 600) dWidth = 600;
		
		var txt = "";
		
		txt += "<div id='ApolloImageEditDialog' align='center'>";
		
		txt += "<img class='imageDisplay' src='"+image_url+"' width='"+Math.round(img_width/2)+"px' height='"+Math.round(img_height/2)+"'/>";
		
		txt += "<table width='100%' height='100%' cellspacing='3px'>";		

		txt += "   <tr>";
		txt += "      <td class='titleField'>Title</td>";
		txt += "      <td class='dataField'><input id='apollo_image_title' type=text value='"+img_title+"'/></td>";
		txt += "   </tr>";
/*
		txt += "   <tr>";
		txt += "      <td class='titleField'>Added</td>";
		txt += "      <td class='dataField'>"+added_date+" (GMT)</td>";
		txt += "   </tr>";

		txt += "   <tr>";
		txt += "      <td class='titleField'>Size</td>";
		txt += "      <td class='dataField'>"+img_width+"px by "+img_height+"px</td>";
		txt += "   </tr>";
*/
		txt += "   <tr>";
		txt += "      <td class='titleField'>Caption</td>";
		txt += "      <td class='dataField'><input id='apollo_image_caption' width='100%' type=text value='"+caption+"'/></td>";
		txt += "   </tr>";

		txt += "   <tr>";
		txt += "      <td class='titleField'>Description</td>";
		txt += "      <td class='dataField'><input id='apollo_image_desc' width='100%' type=text value='"+desc+"'/></td>";
		txt += "   </tr>";
		
		txt += "   <tr>";
		txt += "      <td class='titleField'>Alt Text</td>";
//		txt += "      <td class='dataField'><textarea id='apollo_image_alt' width='100%'>"+alt_text+"</textarea></td>";
		txt += "      <td class='dataField'><input id='apollo_image_alt' width='100%' type=text value='"+alt_text+"'/></td>";
		txt += "   </tr>";


		txt += "</table>";
		txt += "</div>";
			
		//var dialogTitle = img_title + "&nbsp;(" + img_width+"px by "+img_height+"px)";
		var dialogTitle = img_title;
																										
		jQuery(targetDiv).dialog( 'destroy' );

		jQuery(targetDiv).html(txt);
		
		//jQuery(targetDiv).dialog( { width: dWidth, height:dHeight } );

		jQuery(targetDiv).dialog({
				modal: true, 
				width:dWidth, 
				height:dHeight, 
				title: dialogTitle,
				buttons: {
					Save: function() {
						ImageEditDialog.onSave(image_post_id); jQuery(this).dialog('close');
					},
					Cancel: function() {
						jQuery(this).dialog('close');
					}
			} });
		

	},

	// ////////////////////////////////////////////////////////////////////////////

	onSave : function(post_id){
	
		var newTitle = jQuery('#apollo_image_title').val();
		var newCaption = jQuery('#apollo_image_caption').val();
		var newDesc = jQuery('#apollo_image_desc').val();
		var newAlt = jQuery('#apollo_image_alt').val();

		var paras = {cmd: 15, image_post_id: post_id, caption: newCaption, description: newDesc, title: newTitle, alt_text: newAlt };
												
		jQuery.ajax({
			url: ImagePickerData.commandURL,
			dataType: "json",
			data: paras,
			success: function(ret){ImageEditDialog.onSaved(ret, post_id, newTitle, newCaption, newDesc);}
		});	
						
	},
	
	onSaved : function(ret, image_post_id, newTitle, newCaption, newDesc){
			
		// Update
		
		for (var i=0; i<ImagePickerData.imageList.length; i++){
			
			if (ImagePickerData.imageList[i].post_id == image_post_id){
				ImagePickerData.imageList[i].caption = newCaption;
				ImagePickerData.imageList[i].title = newTitle;
				ImagePickerData.imageList[i].desc = newDesc;
				break;
			}
		}		
	}

	// ////////////////////////////////////////////////////////////////////////////
}

