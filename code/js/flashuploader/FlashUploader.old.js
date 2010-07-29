/**
 * Class to handle the Js side of the Flash file uploader
 * 
 * @author Mike Pritchard
 * @since November 3rd, 2007
 */
FlashUploader = {
	
	target_div : '',
	flash : '',
	upload_processor_url : defines.upload_processor,
	swf_url : defines.code_url + 'flash/FlashUploader.swf',
	
	file_selected_flag : false,
	progress_callback : null,
	status_callback : null,
	completion_callback : null,

	// ////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Print the file uploader form
	 * 
	 * @param {Object} targetDiv Div to print the FlashUploader form into
	 * @param {Object} width
	 * @param {Object} height
	 */
	paint : function(targetDiv) {

		FlashUploader.target_div = targetDiv;
		
		text = "";
	
		text += "<span id='FlashUploader_Buttons'> \n";	
		text += "   <input id='FileName' style='width:60%'/> \n";
		text += "   <input type='Button' value='Browse...' onclick='FlashUploader.onBrowse();' /> \n";
//		text += "   <input type='Button' value='Upload' onclick='FlashUploader.onUpload();'/> \n";
		text += "</span> \n";
		
		text += "<br>";
		
//		text += "   <div style='visibility:hidden;'> \n";
		text += "   <div> \n";
		text += "      <object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0' width='1' height='1' id='flashObject' align='middle'> \n";
		text += "         <param name='allowScriptAccess' value='sameDomain' /> \n";
		text += "         <param name='movie' value='"+FlashUploader.swf_url+"' /> \n";
		text += "         <param name='quality' value='high' /> \n";
		text += "          <param name='bgcolor' value='#ffffff' /> \n";
		text += "         <embed src='"+FlashUploader.swf_url+"' quality='high' bgcolor='#ffffff' width='1' height='1' name='flashObject' align='middle' allowScriptAccess='sameDomain' type='application/x-shockwave-flash' pluginspage='http://www.macromedia.com/go/getflashplayer' /> \n";
		text += "      </object> \n";
		text += "   </div>	 \n";		
		
		$(targetDiv).html(text);
		
		if(navigator.appName.indexOf('Microsoft') != -1) {
			FlashUploader.flash = window.flashObject;
		}
		else {
			FlashUploader.flash = window.document.flashObject;
		}

	},

	// ////////////////////////////////////////////////////////////////////////////////////////////////////////

	isFileSelected : function(){ return FlashUploader.file_selected_flag; },
	setProgressCallback : function(callback){FlashUploader.progress_callback = callback;},
	setStatusCallback : function(callback){FlashUploader.status_callback = callback;},
	setOnCompleteCallback : function(callback){FlashUploader.completion_callback = callback;},

	// ////////////////////////////////////////////////////////////////////////////////////////////////////////

	
	/**
	 * Handle status messages sent back from the flash object
	 * @param {Object} msg
	 */
    statusMsg : function(msg) {
		if(FlashUploader.status_callback != null)	
			FlashUploader.status_callback(msg);	
	},

	// ////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Respond to the flash object saying that a file has been selected by the user
	 * @param {Object} file_size File size
	 * @param {Object} file_type File type
	 * @param {Object} file_name File name (NOTE: not the full path)
	 * @param {Object} file_mod_date File modifcation date
	 * @param {Object} file_create_date File creation date
	 */
    onFileSelected : function(file_size, file_type, file_name, file_mod_date, file_create_date) {
		FlashUploader.file_selected_flag = true;
		$('#FileName').val(file_name);
	},

	// ////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * The flash object calls this method periodically with an update of how many bytes have been uploaded
	 * @param {Object} bytesLoaded Bytes uploaded so far
	 * @param {Object} bytesTotal Total number of bytes to upload
	 */			
    onProgress : function(bytesLoaded, bytesTotal) {
		if (bytesLoaded >= (bytesTotal-1))
			percent = 100;
		else
			percent = Math.round(100*bytesLoaded / bytesTotal);
			
		if(FlashUploader.progress_callback != null)	
			FlashUploader.progress_callback(percent);	
    },

	// ////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Called by the flash object when the file upload is complete
	 */
    onComplete : function() {
		if(FlashUploader.completion_callback != null)	
			FlashUploader.completion_callback();	
   },

	// ////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Interface to the flash object, whe a user hits the client side browse button, this is called which 
	 * tells the flahs object to launch a file select dialog box
	 */
    onBrowse : function() {
		FlashUploader.flash.onBrowse();
    },

	// ////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Interface to flash object, enables the Javascript (client-side) to initiate a file upload
	 */
    onUpload : function() {
		FlashUploader.flash.onUpload();
		return true;
    },

	// ////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Called by flash object to get the location (full URL) of the file that will process the upload.
	 * The upload uses the url set by setUploadProcessorURL.
	 */
    getTargetURL : function() {
		return FlashUploader.upload_processor_url;
    },
	
	// ////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Set the url for the file that will handle the uploaded file once it is on the server. The flash
	 * object uses the standard html post method to upload the file, so standard techniques can be used
	 * on the server to handle the upload.
	 * @param {Object} target_url Target URL (use full path to be safe)
	 */
	setUploadProcessorURL : function(target_url) {
		FlashUploader.upload_processor_url = target_url;
	}

}