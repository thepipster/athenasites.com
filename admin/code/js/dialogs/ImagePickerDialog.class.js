/**
* Javascript class that allows a user to pick an image from their wordpress media library
*/
var ImagePickerDialog = {

	folder_id : 0,
	imageSelectCallback : '',
	targetDiv : '',
	
	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	*
	*/
	show : function(targetDiv, imageSelectCallback){
	
		ImagePickerDialog.imageSelectCallback = imageSelectCallback;
		ImagePickerDialog.targetDiv = targetDiv;
		
		var imageList = DataStore.m_mediaList;
		var dialogTitle = 'Select an image';
		var minHeight = $(window).height()/2;
										
		var txt = "";
		
		txt += "<div class='ImagePicker'>";
		txt += "Folder: <select id='ImagePickerFolderSelect' onchange='ImagePickerDialog.onFolderSelected()'>";
		txt += "<option value='1'>Unassigned</option>";
		for (var i=0; i<DataStore.m_folderList.length; i++){
			txt += "<option value='"+DataStore.m_folderList[i].id+"'>"+DataStore.m_folderList[i].name+"</option>";
		}
		txt += "</select>";
		txt += "<div class='' style='height: 100%; width:100%; margin-top:10px' id='image_selector_content'></div>";
		txt += "</div>";
										
		$(targetDiv).html(txt);
		
		$(targetDiv).dialog( 'destroy' );	
		$(targetDiv).dialog({modal: true, width:200+$(window).width()/2, height:130+minHeight, title: dialogTitle });

		
		ImagePickerDialog.paintImages();
		
		$(targetDiv).disableSelection();
	
	},

	// ////////////////////////////////////////////////////////////////////////////

	paintImages : function(){
	
		var imageList = DataStore.m_mediaList;
		
		var d = new Date();
		var localTime = d.getTime();
		var localOffset = d.getTimezoneOffset() * 60000;
		var utc_date = new Date(localTime + localOffset);
		var utc_time = localTime + localOffset;
				
		var txt = "";
		
		for (var i=0; i<imageList.length; i++){
			
			var thumb_url = imageList[i].thumb_url;
			var image_id = imageList[i].id;
			var title = imageList[i].title;
			var width = imageList[i].width;
			var height = imageList[i].height;
			var image_folder_id = parseInt(imageList[i].folder_id);
			var added_date = new Date(imageList[i].date_added);						
			var hours_ago = (utc_time - added_date.getTime())/3600000;
						
			//alert(image_folder_id + " = " + ImagePickerDialog.folder_id);
						
			switch(ImagePickerDialog.folder_id){
			
				case ImageSelector.ID_UNASSIGNED:
					if (image_folder_id == ImageSelector.ID_ALL || image_folder_id == ImageSelector.ID_UNASSIGNED)
						txt += ImagePickerDialog.getImageHTML(image_id, thumb_url, title, width, height);	
					break;
					
				case ImageSelector.ID_LAST_1_HOUR:
					if (hours_ago <= 1){
						txt += ImagePickerDialog.getImageHTML(image_id, thumb_url, title, width, height);				
					}
					break;

				case ImageSelector.ID_LAST_24_HOURS:
					if (hours_ago <= 24){
						txt += ImagePickerDialog.getImageHTML(image_id, thumb_url, title, width, height);				
					}
					break;

				case ImageSelector.ID_LAST_7_DAYS:
					if (hours_ago <= 168){
						txt += ImagePickerDialog.getImageHTML(image_id, thumb_url, title, width, height);				
					}
					break;

				case ImageSelector.ID_ALL:
					txt += ImagePickerDialog.getImageHTML(image_id, thumb_url, title, width, height);				
					break;	

				case image_folder_id:	
					txt += ImagePickerDialog.getImageHTML(image_id, thumb_url, title, width, height);				
					break;	

				default:					
					// Nothing to do
			}			
			
		}
		
		$('#image_selector_content').html(txt);
				
	},
	
	// ////////////////////////////////////////////////////////////////////////////
	
	getImageHTML : function(image_id, thumb_url, title, width, height){

		var txt = "";

		var titleText = title + " (" + width + "px by " + height + "px)";
		
//		txt += "   <img id='img_"+image_id+"' src='"+thumb_url+"' class='thumb' width='50px' title='"+titleText+"'/>";

		txt += "<div class='thumbwrapper' align='center' onclick=\"ImagePickerDialog.onSelectImage('"+image_id+"')\">";
		txt += "   <img id='img+"+image_id+"' src='"+thumb_url+"' class='thumb' width='50px'/>";
		txt += "   <div class='imageTitle'>" + title + "</div>";
		txt += "   <div class='imageSize'>(" + width + ", " + height + ")</div>";
		txt += "</div>";
		
						
		// onclick='ImageSelector.onSelectImage("+image_id+")'
		return txt;
	},
		
	// ////////////////////////////////////////////////////////////////////////////
		
	onFolderSelected : function(){
		ImagePickerDialog.folder_id = parseInt($('#ImagePickerFolderSelect').val());
		ImagePickerDialog.paintImages();
	},	
	
	// ////////////////////////////////////////////////////////////////////////////

	/**
	* Get the image list for the currently selected gallery page
	*/
	onSelectImage : function(imageID){	
		if (ImagePickerDialog.imageSelectCallback != ''){
			ImagePickerDialog.imageSelectCallback(imageID);
		}
		$(ImagePickerDialog.targetDiv).dialog('close');
	}		
}