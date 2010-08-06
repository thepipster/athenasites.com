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
							
		$('#FilesFrame').html();
		
		$.get(
			defines.root_url + 'code/html/FilesFrame.html', 
			function(data) {
		  		$('#FilesFrame').html(data);
		  		FilesFrame.onGotHTML();
			}
		);
	},
	
	// ////////////////////////////////////////////////////////////////////////

	onGotHTML : function(){
		FilesFrame.paintUploader();
		FilesFrame.paintMedia();
	},
	
	// ////////////////////////////////////////////////////////////////////////

	paintMedia : function(){
		FolderMediaFrame.paint('#athena_folder_contents');
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