/**
*
* 
* @since 27th July, 2010
*/
var FilesFrame = {
	
	init : function(){
		
	},
	
	repaint : function(){
							
		$('#FilesFrame').html();
		
		$.get(
			defines.root_url + 'code/html/FilesFrame.html', 
			function(data) {
		  		$('#FilesFrame').html(data);
		  		FilesFrame.onGotHTML();
			}
		);
										
		
	
	/*
		// If a folder is selected, and the select folder callback is set
		// then call it
		if (FileTreeFrame.m_dirSelectCallback != '') {
		
			if (node.type != 'dir' && node.type != 'sysdir') {
				// File selected!!
				node_id = node.parent_id;
				node = DataManager.m_fileDataTree.getNodeFromID(node.parent_id);
			}
		
			var node_id = FileTreeFrame.m_selectedFolderID;
			
			// Get file list for this folder, and pass on (avoiding another ajax call)
			var node_list = DataManager.m_fileDataTree.getNodeContents(node_id);
			var file_list = new Array();
			
			for (var i = 0; i < node_list.length; i++) {
				if (node_list[i].type == 'file') 
					file_list[file_list.length] = node_list[i];
			}
			
			FileTreeFrame.m_dirSelectCallback(node.name, node_id, file_list);
		}
	*/
	
		// Populate the flash component..
		//FileTreeFrame.populateTree();
	},
	
	onGotHTML : function(){

		//FlashUploader.paint('#flashUploader');

		var settings = {
			flash_url : defines.code_url + "js/3rdparty/SWFUpload/Flash/swfupload.swf",
			upload_url: defines.code_url + "php/upload.php",
			post_params: {"PHPSESSID" : defines.session_id},

			// File Upload Settings
			file_size_limit : "102400",	// 100MB
			file_types : "*.*",
			file_types_description : "All Files",
			file_upload_limit : "10",
			file_queue_limit : "0",
			
			custom_settings : {
				progressTarget : "fsUploadProgress",
				cancelButtonId : "btnCancel"
			},
			debug: false,

			// Button settings			
			button_image_url: defines.root_url + "images/FileUploadButton.png",
			button_width: "61",
			button_height: "22",
			button_placeholder_id: "spanButtonPlaceHolder",
//			button_text: '<span class="theFont">Hello</span>',
//			button_text_style: ".theFont { font-size: 16; }",
//			button_text_left_padding: 12,
//			button_text_top_padding: 3,
			
			// The event handler functions are defined in handlers.js
			file_queued_handler : FlashUploader.fileQueued,
			file_queue_error_handler : FlashUploader.ffileQueueError,
			file_dialog_complete_handler : FlashUploader.ffileDialogComplete,
			upload_start_handler : FlashUploader.fuploadStart,
			upload_progress_handler : FlashUploader.fuploadProgress,
			upload_error_handler : FlashUploader.fuploadError,
			upload_success_handler : FlashUploader.fuploadSuccess,
			upload_complete_handler : FlashUploader.fuploadComplete,
			queue_complete_handler : FlashUploader.fqueueComplete	// Queue plugin event
		};
		
		var swfu = new SWFUpload(settings);

	}

}