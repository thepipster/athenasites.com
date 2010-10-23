var FlashUploader = {

	fileQueued : function(file) {
						
		try {
			var progress = new FileProgress(file, this.customSettings.progressTarget);
			progress.setStatus("Pending...");
			progress.toggleCancel(true, this);
	
		} catch (ex) {
			Logger.error("[FlashUploader.fileQueued] " + ex);
		}

	},

	// //////////////////////////////////////////////////////////////////////////////////

	fileQueueError : function(file, errorCode, message) {
		
		try {
			if (errorCode === SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {
				AthenaDialog.message("You have attempted to queue too many files.\n" + (message === 0 ? "You have reached the upload limit." : "You may select " + (message > 1 ? "up to " + message + " files." : "one file.")));
				return;
			}
	
			var progress = new FileProgress(file, this.customSettings.progressTarget);
			progress.setError();
			progress.toggleCancel(false);
	
			switch (errorCode) {
			case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
				progress.setStatus("File is too big.");
				Logger.error("[FlashUploader.fileQueueError ] Error Code: File too big, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
				break;
			case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
				progress.setStatus("Cannot upload Zero Byte files.");
				Logger.error("[FlashUploader.fileQueueError ] Error Code: Zero byte file, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
				break;
			case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
				progress.setStatus("Invalid File Type.");
				Logger.error("[FlashUploader.fileQueueError ] Error Code: Invalid File Type, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
				break;
			default:
				if (file !== null) {
					progress.setStatus("Unhandled Error");
				}
				Logger.error("[FlashUploader.fileQueueError ] Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
				break;
			}
		} catch (ex) {
	        Logger.error(ex);
	    }
	},

	// //////////////////////////////////////////////////////////////////////////////////

	fileDialogComplete : function(numFilesSelected, numFilesQueued) {
		try {
			if (numFilesSelected > 0) {
				if (this.customSettings.cancelButtonId != undefined){
					document.getElementById(this.customSettings.cancelButtonId).disabled = false;
				}
			}
			
			/* I want auto start the upload and I can do that here */
			this.startUpload();
		} catch (ex)  {
	        Logger.error("[FlashUploader.fileDialogComplete] " + ex);
		}
	},
	
	// //////////////////////////////////////////////////////////////////////////////////

	uploadStart : function(file) {		
		
		try {
			/* I don't want to do any file validation or anything,  I'll just update the UI and
			return true to indicate that the upload should start.
			It's important to update the UI here because in Linux no uploadProgress events are called. The best
			we can do is say we are uploading.
			 */
			
			this.removePostParam('folder_id');
			this.addPostParam('folder_id', DataStore.m_currentFolderID);
			
			var progress = new FileProgress(file, this.customSettings.progressTarget);
			progress.setStatus("Uploading...");
			progress.toggleCancel(true, this);
		}
		catch (ex) {
	        Logger.error("[FlashUploader.uploadStart] " + ex);
		}
		
		return true;
	},
	
	// //////////////////////////////////////////////////////////////////////////////////
	
	uploadProgress : function(file, bytesLoaded, bytesTotal) {
		try {
			var percent = Math.ceil((bytesLoaded / bytesTotal) * 100);	
			var progress = new FileProgress(file, this.customSettings.progressTarget);
			progress.setProgress(percent);
			progress.setStatus("Uploading...");
		} catch (ex) {
			Logger.error("[FlashUploader.uploadProgress] " + ex);
		}
	},
	
	// //////////////////////////////////////////////////////////////////////////////////	
	
	uploadSuccess : function(file, serverData) {
		try {
			var progress = new FileProgress(file, this.customSettings.progressTarget);
			progress.setComplete();
			progress.setStatus("Complete.");
			progress.toggleCancel(false);
	
		} catch (ex) {
			Logger.error("[FlashUploader.uploadSuccess] " + ex);
		}
	},
	
	// //////////////////////////////////////////////////////////////////////////////////
	
	uploadError : function(file, errorCode, message) {
		try {
			var progress = new FileProgress(file, this.customSettings.progressTarget);
			progress.setError();
			progress.toggleCancel(false);
	
			switch (errorCode) {
			case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
				if (message == 413){
					progress.setStatus("Error: Exceeded maximum file size");
				}
				else {
					progress.setStatus("Upload Error: " + message);
				}
				Logger.error("[FlashUploader.uploadError] Error Code: HTTP Error, File name: " + file.name + ", Message: " + message);
				break;
			case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
				progress.setStatus("Upload Failed.");
				Logger.error("[FlashUploader.uploadError] Error Code: Upload Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
				break;
			case SWFUpload.UPLOAD_ERROR.IO_ERROR:
				progress.setStatus("Server (IO) Error");
				Logger.error("[FlashUploader.uploadError] Error Code: IO Error, File name: " + file.name + ", Message: " + message);
				break;
			case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
				progress.setStatus("Security Error");
				Logger.error("[FlashUploader.uploadError] Error Code: Security Error, File name: " + file.name + ", Message: " + message);
				break;
			case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
				progress.setStatus("Upload limit exceeded.");
				Logger.error("[FlashUploader.uploadError] Error Code: Upload Limit Exceeded, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
				break;
			case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
				progress.setStatus("Failed Validation. Upload skipped.");
				Logger.error("[FlashUploader.uploadError] Error Code: File Validation Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
				break;
			case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
				// If there aren't any files left (they were all cancelled) disable the cancel button
				if (FlashUploader.getStats().files_queued === 0) {
					if (this.customSettings.cancelButtonId != undefined){
						document.getElementById(this.customSettings.cancelButtonId).disabled = true;
					}
				}
				progress.setStatus("Cancelled");
				progress.setCancelled();
				break;
			case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
				progress.setStatus("Stopped");
				break;
			default:
				progress.setStatus("Unhandled Error: " + errorCode);
				Logger.error("[FlashUploader.uploadError] Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
				break;
			}
		} catch (ex) {
	        Logger.error(ex);
	    }
	},
	
	// //////////////////////////////////////////////////////////////////////////////////

	uploadComplete : function(file) {
		if (this.getStats().files_queued === 0) {
			if (this.customSettings.cancelButtonId != undefined){
				document.getElementById(this.customSettings.cancelButtonId).disabled = true;
			}
		}
	},
	
	// //////////////////////////////////////////////////////////////////////////////////
	
	// FlashUploader event comes from the Queue Plugin
	queueComplete : function(numFilesUploaded) {
		//$('#flashUploaderStatus').html(numFilesUploaded + " file" + (numFilesUploaded === 1 ? "" : "s") + " uploaded.");
		ssMain.refresh();
	}


}