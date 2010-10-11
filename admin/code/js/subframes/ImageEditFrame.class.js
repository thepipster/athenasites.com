/**
* Javascript class that allows a user to edit information about an image
*/
var ImageEditFrame = {

    image_id : 0,
    image_index : 0, // Image's index in the ImagePickerData image list array
	
    // ////////////////////////////////////////////////////////////////////////////

    paint : function(targetDiv, image_id){

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
						
        var txt = "";
		
        //		txt += "<div id='ApolloImageEditDialog' align='center'>";
        txt += "<div id='ApolloImageEditFrame' align='center'>";
        /*
		if (img_width > img_height){
			txt += "<img class='imageDisplay' src='"+image_url+"' width='98%' style='max-height: 400px'/>";
		}
		else {
			txt += "<img class='imageDisplay' src='"+image_url+"' style='max-height: 400px'/>";
		}
		*/
        var max_img_width = $(targetDiv).innerWidth() - 20;
        var max_img_height = 400;
								
        txt += "<table width='100%' height='100%' cellspacing='3px'>";

        txt += "   <tr valign='center' align='center' class='imageDisplay'>";
        txt += "      <td class='dataField' colspan='2' >";
        txt += "          <img src='"+image_url+"' style='max-width: "+max_img_width+"px; max-height: "+max_img_height+"px;'/>";
        txt += "      </td>";
        txt += "   </tr>";

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
        txt += "      <td class='titleField'>URL</td>";
        //		txt += "      <td class='dataField'>"+added_date+" (GMT)</td>";
        txt += "      <td class='dataField'><input id='' width='100%' type=text value='"+image_url+"' disabled/></td>";
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
        txt += "      <td class='titleField'>Alt Text</td>";
        txt += "      <td class='dataField'><textarea id='apollo_image_tags' width='100%'>"+alt_text+"</textarea></td>";
//        txt += "      <td class='dataField'><input id='apollo_image_tags' width='100%' type=text value='"+alt_text+"'/></td>";
        txt += "   </tr>";

        txt += "   <tr align='center'>";
        //		txt += "      <td colspan='2'><div class='update_button' onclick=\"ImageEditFrame.onSave('"+image_id+"')\"></div></td>";
        txt += "      <td colspan='2'>";
        txt += "          <button class='cancel_button' onclick=\"ImageEditFrame.onCancel()\">Done</button>";
        txt += "          <button class='save_button' onclick=\"ImageEditFrame.onSave('"+image_id+"')\">Save</button>";
        txt += "          <button class='delete_button' onclick=\"ImageEditFrame.onDelete('"+image_id+"')\">Delete</button>";
        txt += "      </td>";
        txt += "   </tr>";


        txt += "</table>";
        txt += "</div>";
			
        //var dialogTitle = img_title + "&nbsp;(" + img_width+"px by "+img_height+"px)";
        var dialogTitle = img_title;
																										
        $(targetDiv).dialog( 'destroy' );

        $(targetDiv).html(txt);

    },

    // ////////////////////////////////////////////////////////////////////////////

    onCancel : function(){
        FilesFrame.onCancelSelectImage();
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    onSave : function(media_id){
	
        var newTitle = $('#apollo_image_title').val();
        var newDesc = $('#apollo_image_desc').val();
        var newTags = $('#apollo_image_tags').val();

        MediaAPI.updateMediaInfo(DataStore.m_siteID, media_id, newTitle, newDesc, newTags, ImageEditFrame.onSaved);

    },
	
    onSaved : function(mediaObj){
        DataStore.updateMedia(mediaObj);        
    },

    // ////////////////////////////////////////////////////////////////////////////

    onDelete : function(media_id){
        AthenaDialog.confirm("Are you sure you want to delete this image? This can not be undone!", function(){
            ImageEditFrame.onDoDelete(media_id);
        });
    },

    onDoDelete : function(media_id){
        MediaAPI.deleteMedia(DataStore.m_siteID, media_id, ImageEditFrame.onDeleted);
    },

    onDeleted : function(media_id){
        // Update data store
        DataStore.deleteMedia(media_id);
        FilesFrame.repaint();
    }

    // ////////////////////////////////////////////////////////////////////////////


}