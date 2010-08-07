/**
*
* 
* @since 27th July, 2010
*/
var FilesFrame = {
	
	init : function(){
		
	},
	
	// ////////////////////////////////////////////////////////////////////////
	
	repaint : function(){
							
		var txt = "";
		
		txt += "<div id='FilesFrameContent' align='left'>";

		txt += "<table border='0' cellpadding='0' cellspacing='0' style='width:100%; height:100%;'>";

		txt += "<tr valign='top'>";
		
		txt += "	<td>";
		txt += "		<div id='athena_folder_contents'></div>";
		txt += "	</td>";
					
		txt += "	<td width='150px' style='height:100%; padding:5px'>";
																
		txt += "		<div id='flashUploderContent' class='subframebox' style='height:100%;'>";
								
		txt += "			<span class='title'>Upload Files</span>";
													
		txt += "			<div class='uploadControls'>";
		txt += "				<!--";
		txt += "				<h3>Upload Files</h3>";
		txt += "				-->";						
		txt += "				<span id='flashUploadButton'></span>";
		txt += "				<button id='flashUploadCancelButton' onclick='swfu.cancelQueue();' disabled='disabled'>Cancel</button>";
		txt += "				<!--";
		txt += "				<button id='flashUploadCancelButton' onclick='swfu.cancelQueue();' disabled='disabled'>Cancel</button>";
		txt += "				<input id='flashUploadCancelButton' type='button' value='Cancel All Uploads' onclick='swfu.cancelQueue();' disabled='disabled' style='margin-left: 2px; font-size: 8pt; height: 29px;' />";
		txt += "				<div id='flashUploaderStatus'>0 Files Uploaded</div>";
		txt += "				-->";
						
		txt += "			</div>";				
					
		txt += "			<div class='uploadProgress' id='flashUploaderProgress'>";
		txt += "			</div>";
					
		txt += "		</div>";											
			
		txt += "	</td>";
		txt += "</tr>";

		txt += "</table>";
	
		txt += "</div>"					
							
		$('#FilesFrame').html(txt);

		/*
		$.get(
			defines.root_url + 'code/html/FilesFrame.html', 
			function(data) {
		  		$('#FilesFrame').html(data);
		  		FilesFrame.onGotHTML();
			}
		);
		*/

		FilesFrame.paintUploader();
		FilesFrame.paintMedia();
	},
	
	// ////////////////////////////////////////////////////////////////////////
/*
	onGotHTML : function(){
		FilesFrame.paintUploader();
		FilesFrame.paintMedia();
	},
*/	
	// ////////////////////////////////////////////////////////////////////////

	paintMedia : function(){
		UploadMediaFrame.paint('#athena_folder_contents');
	},
	
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
	}
	
	// ////////////////////////////////////////////////////////////////////////
	

}