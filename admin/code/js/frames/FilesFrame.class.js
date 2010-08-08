/**
*
* 
* @since 27th July, 2010
*/
var FilesFrame = {
	
	// ////////////////////////////////////////////////////////////////////////

	init : function(){
		
	},
	
	// ////////////////////////////////////////////////////////////////////////
	
	repaint : function(){
							
		var txt = "";
		/*
		txt += "<div id='FilesFrameContent' align='left'>";

		txt += "<div class='frameTitle'>Folder: </div>";		
		txt += "<div id='athena_folder_contents'></div>";
					
		txt += "<div id='flashUploderContent' class='subframebox' style='height:100%;'>";
								
		txt += "			<span class='title'>Upload Files</span>";
													
		txt += "			<div class='uploadControls'>";
		txt += "				<span id='flashUploadButton'></span>";
		txt += "				<button id='flashUploadCancelButton' onclick='swfu.cancelQueue();' disabled='disabled'>Cancel</button>";						
		txt += "			</div>";				
					
		txt += "			<div class='uploadProgress' id='flashUploaderProgress'>";
		txt += "			</div>";
					
		txt += "		</div>";											
	
		txt += "</div><!-- FilesFrameContent -->";
		*/
			
		txt += "<div id='FilesFrameContent' align='left'>";

		txt += "<table border='0' cellpadding='0' cellspacing='0' style='width:100%; height:100%;'>";

		txt += "<tr valign='top'>";
		
		txt += "	<td>";
		//txt += "		<div class='frameTitle'>Folder: </div>";		
		txt += "		<div id='apollo_folder_contents'></div>";
		txt += "	</td>";
							
		// Edit images frame...........
							
		txt += "	<td id='imageEditContent' style='height:100%; padding:5px'>";																
		txt += "		<div class='subframebox' style='height:100%; width:500px;'>";								
		txt += "			<span class='title'>Edit Image</span>";																		
		txt += "			<div id='imageInfoContent'>";
		txt += "			</div>";					
		txt += "		</div>";														
		txt += "	</td>";

		// File uploader frame...........

		txt += "	<td id='flashUploderContent' style='height:100%; padding:5px'>";																
		txt += "		<div class='subframebox' style='height:100%;'>";								
		txt += "			<span class='title'>Upload Files</span>";													
		txt += "			<div class='uploadControls'>";
		txt += "				<span id='flashUploadButton'></span>";
		txt += "				<button id='flashUploadCancelButton' onclick='swfu.cancelQueue();' disabled='disabled'>Cancel</button>";
		txt += "			</div>";									
		txt += "			<div class='uploadProgress' id='flashUploaderProgress'>";
		txt += "			</div>";					
		txt += "		</div>";														
		txt += "	</td>";

		txt += "</tr>";

		txt += "</table>";
	
		txt += "</div>"					
							
		$('#FilesFrame').html(txt);

		FilesFrame.paintUploader();
		FilesFrame.paintImages();
		
		FilesFrame.onShowUploader();
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	onCancelSelectImage : function(){
		FilesFrame.onShowUploader();
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	onSelectImage : function(image_id){	
		
		$('#imageEditContent').show();
		$('#flashUploderContent').hide();
		
		$('#imageEditContent').width(500);
		
		ImageEditFrame.paint('#imageInfoContent', image_id);
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	onShowUploader : function(){
		$('#imageEditContent').hide();
		$('#flashUploderContent').show();
		
		$('#flashUploderContent').width(200);
	},
	
	// ////////////////////////////////////////////////////////////////////////////
	
	updateFolderName : function(name){
		//$('#apollo_title_folder_name').html(name);
	},
	
	// ////////////////////////////////////////////////////////////////////////
	// ////////////////////////////////////////////////////////////////////////
	
	paintUploader : function(){

		//FlashUploader.paint('#flashUploader');

		var settings = {
			flash_url : defines.code_url + "js/3rdparty/SWFUpload/Flash/swfupload.swf",
			upload_url: defines.code_url + "php/ProcessUpload.php",
			post_params: {"PHPSESSID" : defines.session_id, "folder_id": DataStore.m_currentFolderID, "site_id": DataStore.m_siteID},

			// File Upload Settings
			file_size_limit : "102400",	// 100MB
			file_types : "*.jpg; *.gif; *.png; *.jpeg;",
			file_types_description : "All Files",
			file_upload_limit : "0",
			file_queue_limit : "0",
			
			custom_settings : {
				progressTarget : "flashUploaderProgress",
				cancelButtonId : "flashUploadCancelButton"
			},

			debug: false,

			// Button settings			
			button_image_url: defines.root_url + "images/FileUploadButton.png",
			button_width: "61",
			button_height: "22",
			button_placeholder_id: "flashUploadButton",
//			button_text: '<span class="theFont">Hello</span>',
//			button_text_style: ".theFont { font-size: 16; }",
//			button_text_left_padding: 12,
//			button_text_top_padding: 3,
			
			// The event handler functions are defined in handlers.js
			file_queued_handler 		: FlashUploader.fileQueued,
			file_queue_error_handler 	: FlashUploader.fileQueueError,
			file_dialog_complete_handler: FlashUploader.fileDialogComplete,
			upload_start_handler 		: FlashUploader.uploadStart,
			upload_progress_handler 	: FlashUploader.uploadProgress,
			upload_error_handler 		: FlashUploader.uploadError,
			upload_success_handler 		: FlashUploader.uploadSuccess,
			upload_complete_handler 	: FlashUploader.uploadComplete,
			queue_complete_handler 		: FlashUploader.queueComplete	// Queue plugin event
		};
				
		var swfu = new SWFUpload(settings);
		
		$('#flashUploaderProgress').height( $('#FilesFrame').outerHeight() - $('.uploadControls').outerHeight() - 60 );
	},
	
	// ////////////////////////////////////////////////////////////////////////////
	
	paintImages : function(){
		
		var imageList = DataStore.m_mediaList;
		
		var txt = "";

		var d = new Date();
		var localTime = d.getTime();
		var localOffset = d.getTimezoneOffset() * 60000;
		var utc_date = new Date(localTime + localOffset);
		var utc_time = localTime + localOffset;
								
		//alert(DataStore.m_currentFolderID + " " + FolderSidebarFrame.ID_UNASSIGNED);
								
		for (var i=0; i<imageList.length; i++){

			var thumb_url = imageList[i].thumb_url;
			var post_id = imageList[i].id;
			var title = imageList[i].title;
			var width = imageList[i].thumb_width;
			var height = imageList[i].thumb_height;
			var image_folder_id = parseInt(imageList[i].folder_id);
			var added_date = new Date(imageList[i].date_added);						
			var hours_ago = (utc_time - added_date.getTime())/3600000;
						
			//FilesFrame.showMessage(added_date + "  |||   " + utc_date + " Delta = " + hours_ago);
			//FilesFrame.showMessage(" Delta = " + hours_ago);
			
			switch(DataStore.m_currentFolderID){
			
				case FolderSidebarFrame.ID_UNASSIGNED:
					if (image_folder_id == FilesFrame.ID_ALL || image_folder_id == FolderSidebarFrame.ID_UNASSIGNED)
						txt += FilesFrame.getImageHTML(post_id, thumb_url, title, width, height);	
					break;
					
				case FolderSidebarFrame.ID_LAST_1_HOUR:
					if (hours_ago <= 1){
						txt += FilesFrame.getImageHTML(post_id, thumb_url, title, width, height);				
					}
					break;

				case FolderSidebarFrame.ID_LAST_24_HOURS:
					if (hours_ago <= 24){
						txt += FilesFrame.getImageHTML(post_id, thumb_url, title, width, height);				
					}
					break;

				case FolderSidebarFrame.ID_LAST_7_DAYS:
					if (hours_ago <= 168){
						txt += FilesFrame.getImageHTML(post_id, thumb_url, title, width, height);				
					}
					break;

				case FolderSidebarFrame.ID_ALL:
					txt += FilesFrame.getImageHTML(post_id, thumb_url, title, width, height);				
					break;	

				case image_folder_id:	
					txt += FilesFrame.getImageHTML(post_id, thumb_url, title, width, height);				
					break;	

				default:					
					// Nothing to do
			}
			
		}
								
		$('#apollo_folder_contents').html(txt);

		$('#apollo_folder_contents').disableSelection();
		$('#apollo_folder_contents').noContext();

		//$(".thumb").rightClick( function(e) {FilesFrame.onRightClickImage(e, this);});
				
		// Make draggable
		$(".thumb").draggable({revert: true, zIndex: 300});	
		
		
	},

	// ////////////////////////////////////////////////////////////////////////////
	
	getImageHTML : function(post_id, thumb_url, title, width, height){

		var txt = "";
		//var ph = (60 - height - 8)/2;
		
		var titleText = title + " (" + width + "px by " + height + "px)";

		var onclick = "FilesFrame.onSelectImage('"+post_id+"')";
		
		txt += "<div class='thumbwrapper' align='center' onclick=\""+onclick+"\">";
		txt += "<img id='img_"+post_id+"' src='"+thumb_url+"' class='thumb' width='"+width+"px' height='"+height+"px' title='"+titleText+"'/>";
		txt += "</div>";
		return txt;
	}	

	// ////////////////////////////////////////////////////////////////////////////
}