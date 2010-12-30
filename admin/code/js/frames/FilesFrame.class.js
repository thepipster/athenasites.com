/**
*
* 
* @since 27th July, 2010
*/
var FilesFrame = {
	
	/** Current sub-frame mode, 'upload', 'edit_image' */
	m_mode : '',
	
	/** Images are divided into pages so we can fit the right number on the screen */
    m_currentImagePage : 0,
    
    /** Max number of images per page */    
    m_imagesPerPage : 50,
    
    /** Number of image pages */
    m_numberImagePages : 0,
    
	/** List of images based on the current folder selection */	
	m_imageList : '',
    
    /** Flag to determine if we have done a full repaint or not */	
    painted : false,
	
    // ////////////////////////////////////////////////////////////////////////

    init : function(){
        PagesFrame.painted = false;
    },
	
    // ////////////////////////////////////////////////////////////////////////
	
    repaint : function(){
					
        if (!FilesFrame.painted){
            FilesFrame.fullRepaint();
            FilesFrame.painted = true;
        }
        else {
            FilesFrame.repaintData();
        }
							
    },

    // ////////////////////////////////////////////////////////////////////////////

	/**
	* Do a full repaint. In this case, we don't want to repaint the flash upload unless we have to!
	*/
    fullRepaint : function(){
    
		FilesFrame.m_mode = 'upload'; 
        FilesFrame.paintUploader();
        FilesFrame.repaintData();          
        
		$('.more_link').disableSelection();
		$('.more_link').noContext();
        
    },

    // ////////////////////////////////////////////////////////////////////////////

	/**
	* Just repaint the data
	*/
    repaintData : function(){
                
		FilesFrame.m_imageList = DataStore.getImages();
		FilesFrame.calcImagePages();

        if (FilesFrame.m_mode == 'edit_image'){
	        FilesFrame.onSelectImage(FilesFrame.m_currentImageID);
        }
        else {
	        FilesFrame.onShowUploader();
        }
		
		FilesFrame.paintImages();		
		
                /*

		var prevMode = FilesFrame.m_mode;

        if (FilesFrame.m_mode == 'edit_image'){
			FilesFrame.m_mode = 'edit_image'; 
	        FilesFrame.onSelectImage(FilesFrame.m_currentImageID);
        }
        else {
			FilesFrame.m_mode = 'upload'; 
	        FilesFrame.onShowUploader();
        }
                
		// If the mode has changed, we need to update the current images being
		// dispalyed as the area used for painting images has changed size
		if (prevMode != FilesFrame.m_mode){
			FilesFrame.calcImagePages();
			FilesFrame.paintImages();		
		}
	*/	        
    },
		
    // ////////////////////////////////////////////////////////////////////////////
	
	onSelectFolder : function(){
		FilesFrame.m_currentImagePage = 0;
		FilesFrame.repaintData();
        FilesFrame.onShowUploader();
	},
	
    // ////////////////////////////////////////////////////////////////////////////

	showPrevImages : function(){

		FilesFrame.m_currentImagePage--;
		
		//var noPages = Math.ceil(FilesFrame.m_imageList.length / FilesFrame.m_imagesPerPage);
		
		if (FilesFrame.m_currentImagePage < 0){
			FilesFrame.m_currentImagePage = FilesFrame.m_numberImagePages - 1;
		}
		
		//Logger.error(FilesFrame.m_currentImagePage + " / " + noPages);
		
		FilesFrame.paintImages();		

	},
	
    // ////////////////////////////////////////////////////////////////////////////

	showNextImages : function(){

		FilesFrame.m_currentImagePage++;

		//m_numberImagePagesvar noPages = Math.ceil(FilesFrame.m_imageList.length / FilesFrame.m_imagesPerPage);

		if (FilesFrame.m_currentImagePage >= FilesFrame.m_numberImagePages){
			FilesFrame.m_currentImagePage = 0;
		}
	
		//Logger.error(FilesFrame.m_currentImagePage + " / " + noPages);
		
		FilesFrame.paintImages();		
		
	},	
	
    // ////////////////////////////////////////////////////////////////////////////
	
    updateFolderName : function(name){
    //$('#apollo_title_folder_name').html(name);
    },

    // ////////////////////////////////////////////////////////////////////////
    //
    // Image Editor
    //
    // ////////////////////////////////////////////////////////////////////////

	m_currentImageID : 0,
	
    onSelectImage : function(image_id){		
                
		FilesFrame.m_currentImageID = image_id;  
        
        // If this image id does not exist, then select the first image for
        // the current image list
        if (!DataStore.getImage(image_id)){
        	image_id = FilesFrame.m_imageList[0].id;	
        }
                
        var imageData = DataStore.getImage(image_id);

        if (!imageData) {
            AthenaDialog.error('Error, could not find image!');
            return;
        }
        
        // Clear values
        $('#apollo_image_title').val("");
        $('#apollo_image_date').val("");
        $('#apollo_image_size').val("");
        $('#apollo_image_desc').val("");
        $('#apollo_image_tags').val("");
        $('#apollo_image_url').attr('src', '');
        
        $('#imageEditContent').show();
        $('#flashUploderContent').hide();		
        $('#imageEditContent').width(500);		
        
        
        //ImageEditFrame.paint('#imageInfoContent', image_id);	
        									
        var thumb_url = imageData.thumb_url;
        var img_width = imageData.width;
        var img_height = imageData.height;
        var image_folder_id = imageData.folder_id;
        var added_date = imageData.date_added;	// UTC

        var img_title = AthenaUtils.htmlEncode(imageData.title);
        var desc = AthenaUtils.htmlEncode(imageData.description);
        var alt_text = AthenaUtils.htmlEncode(imageData.tags);
        var image_url = imageData.file_url;        
        
        var max_img_width = $('#imageEditContent').innerWidth() - 20;
        var max_img_height = 0.4*$(window).height();    
                                
        $('#apollo_image_title').val(img_title);
        $('#apollo_image_date').val(added_date + " (GMT)");
        $('#apollo_image_size').val(img_width + "px by " + img_height + "px");
        $('#apollo_image_desc').val(desc);
        $('#apollo_image_tags').val(alt_text);
        
        $('#apollo_image_url').css('max-width', max_img_width);
        $('#apollo_image_url').css('max-height', max_img_height);
        $('#apollo_image_url').attr('src', image_url);
        
        // Paint tags...
        var txt = "";
        $('#apollo_image_custom_tag_list').html("");
        for (var i=0; i<imageData.media_tags.length; i++){
            var onclick = "FilesFrame.deleteImageTag(\""+imageData.media_tags[i]+"\")";
	        txt += "<div class='postTagCatLine'><span class='postTagCat'>"+imageData.media_tags[i]+"</span><span class='postRemoveTagCat' onclick='"+onclick+"'></span></div>";
        }
		$('#apollo_image_custom_tag_list').html(txt);
                                                       	       		
		var prevMode = FilesFrame.m_mode;
		FilesFrame.m_mode = 'edit_image'; 
		
		// If the mode has changed, we need to update the current images being
		// dispalyed as the area used for painting images has changed size
		if (prevMode != 'edit_image'){
			FilesFrame.calcImagePages();
			FilesFrame.paintImages();		
		}
		     
    },	
	
    // ////////////////////////////////////////////////////////////////////////////

	/**
	* Called whenever something changes on the edit image sub-frame. Stores the content locally
	* which is then stored to the server by the autosave feature
	*/	
	onImageEditorChange : function(){
	
        var mediaObj = DataStore.getImage(FilesFrame.m_currentImageID);
        mediaObj.title = $('#apollo_image_title').val();        
        mediaObj.description = $('#apollo_image_desc').val();        
        mediaObj.tags = $('#apollo_image_tags').val(); 
        
        //alert(FilesFrame.m_currentImageID + " = " + mediaObj.description);           
        DataStore.updateMedia(mediaObj, true);
	},

	// ////////////////////////////////////////////////////////////////////////////

	deleteImageTag : function(tag){
		MediaAPI.removeMediaTag(DataStore.m_siteID, FilesFrame.m_currentImageID, tag, FilesFrame.onMediaTagChanged)
	},
		
	// ////////////////////////////////////////////////////////////////////////////

	addMediaTag : function(){
		var csvtags = $('#apollo_image_custom_tags').val();
        $('#apollo_image_custom_tags').val('');		
        MediaAPI.addMediaCSVTags(DataStore.m_siteID, FilesFrame.m_currentImageID, csvtags, FilesFrame.onMediaTagChanged);
	},
			
    onMediaTagChanged : function(mediaObj){
        DataStore.updateMedia(mediaObj);				
        FilesFrame.repaint();
    },	
    		
    // ////////////////////////////////////////////////////////////////////////////

	/** 
	* Hide the image edit sub-frame
	*/
    onCancel : function(){
        FilesFrame.onShowUploader();
    },
	
    // ////////////////////////////////////////////////////////////////////////////
	
	/**
	* Delete a image
	*/
    onDeleteImage : function(media_id){
    	
    	var media_id = FilesFrame.m_currentImageID;	
    	
        AthenaDialog.confirm("Are you sure you want to delete this image? This can not be undone!", function(){
            FilesFrame.onDoDelete(media_id);
        });
    },

    onDoDelete : function(media_id){
        MediaAPI.deleteMedia(DataStore.m_siteID, media_id, FilesFrame.onDeleted);
    },

    onDeleted : function(media_id){
        // Update data store
        DataStore.deleteMedia(media_id);
        FilesFrame.repaint();
        FilesFrame.onShowUploader();
    },	
		
    // ////////////////////////////////////////////////////////////////////////
    //
    // File Uploader
    //
    // ////////////////////////////////////////////////////////////////////////
	
    onShowUploader : function(){        
    
        $('#imageEditContent').hide();
        $('#flashUploderContent').show();		
        $('#flashUploderContent').width(200);
        
		var prevMode = FilesFrame.m_mode;
		FilesFrame.m_mode = 'upload'; 
        
		// If the mode has changed, we need to update the current images being
		// dispalyed as the area used for painting images has changed size
		if (prevMode != 'upload'){
			FilesFrame.calcImagePages();
			FilesFrame.paintImages();		
		}
        
    },
    	
    // ////////////////////////////////////////////////////////////////////////
    	
    paintUploader : function(){

        //FlashUploader.paint('#flashUploader');

        var settings = {
            flash_url : defines.code_url + "js/3rdparty/SWFUpload/Flash/swfupload.swf",
            upload_url: defines.code_url + "php/ProcessUpload.php",
            post_params: {
                "PHPSESSID" : defines.session_id,
                "folder_id": DataStore.m_currentFolderID,
                "site_id": DataStore.m_siteID
                },

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

	/**
	* Calculate number of images to display per page, we divide the images into 'pages' 
	* so we don't oveflow the display
	*/
	calcImagePages : function(){

    	var h = $(window).height() - 150;
    	var w = 0;

        if (FilesFrame.m_mode == 'edit_image'){
	  		w = $('#FilesFrameContent').width() - 500;
        }
        else {
	  		w = $('#FilesFrameContent').width() - 300;
        }
        
    	// images per row = w / thumb_width
    	// images per col = h / thumb_height
    	// so.. images per page = (w/60) * (h/60) = (w*h)/(thumb_width*thumb_height)
    	//    = (w*h) / (50*50) = (w*h) / 2500
    	
    	FilesFrame.m_imagesPerPage = Math.floor((w*h) / 4900);    
        
        
		FilesFrame.m_numberImagePages = Math.ceil(FilesFrame.m_imageList.length / FilesFrame.m_imagesPerPage);
        
        if (FilesFrame.m_numberImagePages <= 1){
        	$('.more_link').hide();
        }
        else {
        	$('.more_link').show();
        }
                
        //Logger.show();
		//Logger.debug("Width: " + w + " Height: " + h);
		//Logger.debug("Images per row: " + (w/70) + " per col: " + (h/70) + " per page: " + FilesFrame.m_imagesPerPage);
	},
			
    // ////////////////////////////////////////////////////////////////////////////
    
    paintImages : function(){
		
        $(".thumb").draggable('destroy');
				
		if (FilesFrame.m_imageList == ''){
			FilesFrame.m_imageList = DataStore.getImages();
			FilesFrame.calcImagePages();
		}		
				
		var startIndex = FilesFrame.m_imagesPerPage * FilesFrame.m_currentImagePage;
		var endIndex = Math.min(startIndex + FilesFrame.m_imagesPerPage, FilesFrame.m_imageList.length);
		
		//Logger.debug("Image page: " + FilesFrame.m_currentImagePage);
				
        var txt = "";
    	
		// Get the html for the selected images...
        for (var i=startIndex; i<endIndex; i++){

            var thumb_url = FilesFrame.m_imageList[i].thumb_url;
            var post_id = FilesFrame.m_imageList[i].id;
            var title = FilesFrame.m_imageList[i].title;
            var thumb_width = FilesFrame.m_imageList[i].thumb_width;
            var thumb_height = FilesFrame.m_imageList[i].thumb_height;
            var width = FilesFrame.m_imageList[i].width;
            var height = FilesFrame.m_imageList[i].height;

        	txt += FilesFrame.getImageHTML(post_id, thumb_url, title, width, height, thumb_width, thumb_height);
		}
	
	
        if (txt == ""){
            txt += "<div style='color:#444444;'>This folder is empty</div>";
        }
		
        $('#apollo_folder_contents').html(txt);
        $('#apollo_folder_contents').disableSelection();
        $('#apollo_folder_contents').noContext();

        //$(".thumb").rightClick( function(e) {FilesFrame.onRightClickImage(e, this);});
				
        // Make draggable
        $(".thumb").draggable({
            revert: true,
            zIndex: 300
        });
		
		
    },

    // ////////////////////////////////////////////////////////////////////////////
	
    getImageHTML : function(post_id, thumb_url, title, width, height, thumb_width, thumb_height){

        var txt = "";
        //var ph = (60 - height - 8)/2;
		
        var titleText = title + " (" + width + "px by " + height + "px)";

        var onclick = "FilesFrame.onSelectImage('"+post_id+"')";
       	var mt = 0;
        if (thumb_height < 50){
        	mt = (50 - thumb_height)/2;
	        //alert(thumb_height + ", " + mt);
        }
        
		
        txt += "<div class='thumbwrapper' align='center' onclick=\""+onclick+"\">";
        txt += "<span></span>"; // hacky-IE7 fix for vertical alignment
        txt += "<img id='img_"+post_id+"' src='"+thumb_url+"' class='thumb' width='"+thumb_width+"px' height='"+thumb_height+"px' title='"+titleText+"' style='margin-top:"+mt+"px'/>";
        txt += "</div>";
        
//        txt += "<div class="wraptocenter"><span></span><img src="..." alt="..."></div>";
//        txt += "<div class='thumbwrapper'><span></span><img src="..." alt="..."></div>";


        return txt;
    }
    
    // ////////////////////////////////////////////////////////////////////////////
	
}