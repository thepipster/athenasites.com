/**
*
* 
* @since 27th July, 2010
*/
var FilesFrame = {
	
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

    fullRepaint : function(){

        FilesFrame.paintUploader();
        FilesFrame.paintImages('#apollo_folder_contents');
        FilesFrame.onShowUploader();
    },

    // ////////////////////////////////////////////////////////////////////////////

    repaintData : function(){
        FilesFrame.paintImages('#apollo_folder_contents');
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
	
    paintImages : function(targetDiv){
		
        $(".thumb").draggable('destroy');
		
        var imageList = DataStore.m_mediaList;
		
        var txt = "";

        var d = new Date();
        var localTime = d.getTime();
        var localOffset = d.getTimezoneOffset() * 60000;
        var utc_date = new Date(localTime + localOffset);
        var utc_time = localTime + localOffset;
								
        //alert(DataStore.m_currentFolderID + " " + FolderSidebarFrame.ID_UNASSIGNED);
        //alert("Folder id = " + DataStore.m_currentFolderID + " " + imageList.length + " images");
								
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
	
        if (txt == ""){
            txt += "<div style='color:#444444;'>This folder is empy</div>";
        }
		
        $(targetDiv).html(txt);

        $(targetDiv).disableSelection();
        $(targetDiv).noContext();

        //$(".thumb").rightClick( function(e) {FilesFrame.onRightClickImage(e, this);});
				
        // Make draggable
        $(".thumb").draggable({
            revert: true,
            zIndex: 300
        });
		
		
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