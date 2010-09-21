/**
* Allows access to the remote (Ajax) Athena Gallery API
* 
* @author Mike Pritchard (mike@apollosites.com)
* @since 13th August, 2010
*/
var GalleryAPI = {
	
    /** Command url */
    m_url : '/code/php/remoteapi/GalleryAPI.php',
							
    // ////////////////////////////////////////////////////////////////////////
	
    /**
	* Initialize the API
	*/
    init : function(){
        GalleryAPI.m_url = defines.root_url + GalleryAPI.m_url;
    },
			
    // ////////////////////////////////////////////////////////////////////////

    /**
	* Get the list of folders and media for this site
	*/
    getAll : function(siteID, callback){
	
        AthenaDialog.showLoading("Loading gallery data");
		
        var paras = {
            cmd : 'getAll',
            site_id: siteID
        };

        $.ajax({
            url: GalleryAPI.m_url,
            dataType: "json",
            data: paras,
            success: function(ret){
                GalleryAPI.onGotAll(ret, callback);
            }
        });
		
    },
			
    /**
	* Check the response from the server, and load data if login is good
	*/
    onGotAll : function(ret, callback){
		
        AthenaDialog.clearLoading();
		
        if (ret.result == 'ok'){
            callback(ret.data.gallery_images, ret.data.gallery_meta);
        }
        else {
            AthenaDialog.showAjaxError(ret);
        }
    },
	
    // ////////////////////////////////////////////////////////////////////////
	
    onMoveImage : function(siteID, pageID, imageID, old_slot, new_slot, oldGalleryNo, newGalleryNo, themeParaID, callback) {
		
        //alert('moving image: imageID = ' + imageID + ' slot = ' + slot);
		
        var paras = {
            cmd: 'moveImage',
            site_id: siteID,
            image_id: imageID,
            old_slot_no: old_slot,
            new_slot_no: new_slot,
            page_id: pageID,
            old_gallery_no: oldGalleryNo,
            new_gallery_no: newGalleryNo,
            theme_para_id: themeParaID
        };
		
        AthenaDialog.showLoading("Moving image", false);
				
        jQuery.ajax({
            url: GalleryAPI.m_url,
            dataType: "json",
            data: paras,
            success: function(ret){
                GalleryAPI.onGotAll(ret, callback);
            }
        });
	
    },
			
    // ////////////////////////////////////////////////////////////////////////////
	
    onAddImage : function(siteID, pageID, imageID, slot, galleryNo, themeParaID, callback){
		
        //alert('adding image: pageID = ' + GalleryAPI.m_galleryPageID + ' imageID = ' + imageID + ' slot = ' + slot + ' gallery = ' + galleryNo);
		
        var paras = {
            cmd: 'addImage',
            site_id: siteID,
            page_id: pageID,
            image_id: imageID,
            slot_no: slot,
            gallery_no: galleryNo,
            theme_para_id: themeParaID
        };
			
        AthenaDialog.showLoading("Adding image", false);
				
        jQuery.ajax({
            url: GalleryAPI.m_url,
            dataType: "json",
            data: paras,
            success: function(ret){
                GalleryAPI.onGotAll(ret, callback);
            }
        });
		
    },

    // ////////////////////////////////////////////////////////////////////////////
	
    onRemoveImage : function(siteID, pageID, imageID, galleryNo, slot, themeParaID, callback){

        var paras = {
            cmd: 'removeImage',
            site_id: siteID,
            page_id: pageID,
            slot_no: slot,
            image_id: imageID,
            gallery_no: galleryNo,
            theme_para_id: themeParaID
        };
				
        jQuery.ajax({
            url: GalleryAPI.m_url,
            dataType: "json",
            data: paras,
            success: function(ret){
                GalleryAPI.onImageRemoved(ret, callback);
            }
        });
		
    },
	
    onImageRemoved : function(ret, callback){
				
        if (ret.result == "ok"){
            callback(ret.data.slot_no);
        }
        else {
            AthenaDialog.showAjaxError(ret);
        }
				
    }
}
    