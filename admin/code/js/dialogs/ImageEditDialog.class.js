/**
* Javascript class that allows a user to edit information about an image
*/
var ImageEditDialog = {

	image_id : 0,
	image_index : 0, // Image's index in the ImagePickerData image list array
	
	// ////////////////////////////////////////////////////////////////////////////

	show : function(targetDiv, image_id){

		// Get the image data...
				
		var imageList = DataStore.m_mediaList;
		
		var imageData = DataStore.getImage(image_id);

		if (!imageData) {
			AthenaDialog.error('Error, could not find image!');
			return;
		}
						
			
		var thumb_url = imageData.thumb_url;
		var img_width = imageData.width;
		var img_height = imageData.height;
		var image_folder_id = imageData.folder_id;
		var added_date = imageData.date_added;	// UTC

		var img_title = AthenaUtils.htmlEncode(imageData.title);
		var desc = AthenaUtils.htmlEncode(imageData.description);
		var alt_text = AthenaUtils.htmlEncode(imageData.tags);
		var image_url = imageData.file_url;
										
		var dHeight = img_height/2 + 250;
		var dWidth = img_width/2 + 50;
		
		if (dWidth < 500) dWidth = 500;
		if (dHeight < 600) dHeight = 600;
		
		var txt = "";
		
		txt += "<div id='ApolloImageEditDialog' align='center'>";
		
		txt += "<img class='imageDisplay' src='"+image_url+"' width='"+Math.round(img_width/2)+"px' height='"+Math.round(img_height/2)+"'/>";
		
		txt += "<table width='100%' height='100%' cellspacing='3px'>";		

		txt += "   <tr>";
		txt += "      <td class='titleField'>Title</td>";
		txt += "      <td class='dataField'><input id='apollo_image_title' type=text value='"+img_title+"'/></td>";
		txt += "   </tr>";

		txt += "   <tr>";
		txt += "      <td class='titleField'>Added</td>";
//		txt += "      <td class='dataField'>"+added_date+" (GMT)</td>";
		txt += "      <td class='dataField'><input id='' width='100%' type=text value='"+added_date+" (GMT)' disabled/></td>";
		txt += "   </tr>";

		txt += "   <tr>";
		txt += "      <td class='titleField'>Size</td>";
//		txt += "      <td class='dataField'>"+img_width+"px by "+img_height+"px</td>";
		txt += "      <td class='dataField'><input id='' width='100%' type=text value='"+img_width+"px by "+img_height+"px' disabled/></td>";
		txt += "   </tr>";


		txt += "   <tr>";
		txt += "      <td class='titleField'>Description</td>";
		txt += "      <td class='dataField'><textarea id='apollo_image_desc' width='100%'>"+desc+"</textarea></td>";
//		txt += "      <td class='dataField'><input id='apollo_image_desc' width='100%' type=text value='"+desc+"'/></td>";
		txt += "   </tr>";
		
		txt += "   <tr>";
		txt += "      <td class='titleField'>Tags</td>";
		txt += "      <td class='dataField'><input id='apollo_image_tags' width='100%' type=text value='"+alt_text+"'/></td>";
		txt += "   </tr>";


		txt += "</table>";
		txt += "</div>";
			
		//var dialogTitle = img_title + "&nbsp;(" + img_width+"px by "+img_height+"px)";
		var dialogTitle = img_title;
																										
		$(targetDiv).dialog( 'destroy' );

		$(targetDiv).html(txt);
		
		//$(targetDiv).dialog( { width: dWidth, height:dHeight } );

		$(targetDiv).dialog({
				modal: true, 
				width:dWidth, 
				height:dHeight, 
				title: dialogTitle,
				buttons: {
					Save: function() {
						ImageEditDialog.onSave(image_id); $(this).dialog('close');
					},
					Cancel: function() {
						$(this).dialog('close');
					}
			} });
		

	},

	// ////////////////////////////////////////////////////////////////////////////

	onSave : function(post_id){
	
		var newTitle = $('#apollo_image_title').val();
		var newDesc = $('#apollo_image_desc').val();
		var newTags = $('#apollo_image_tags').val();

		MediaAPI.saveMediaInfo(DataStore.m_siteID, newTitle, newDesc, newTags, ImageEditDialog.onSaved)

	},
	
	onSaved : function(ret, image_id, newTitle, newCaption, newDesc){	
		alert('BACK END TBD!!!');
			
		// Update
		/*
		for (var i=0; i<ImagePickerData.imageList.length; i++){
			
			if (ImagePickerData.imageList[i].post_id == image_id){
				ImagePickerData.imageList[i].caption = newCaption;
				ImagePickerData.imageList[i].title = newTitle;
				ImagePickerData.imageList[i].desc = newDesc;
				break;
			}
		}	
		*/	
	}

	// ////////////////////////////////////////////////////////////////////////////
}