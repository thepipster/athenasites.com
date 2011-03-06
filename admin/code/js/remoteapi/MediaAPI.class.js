/**
* Allows access to the remote (Ajax) Athena System API
* 
* @author Mike Pritchard (mike@apollosites.com)
* @since 27th, July 2010
*/
var MediaAPI = {
	
    /** Command url */
    m_url : '/code/php/remoteapi/MediaAPI.php',
							
    // ////////////////////////////////////////////////////////////////////////
	
    /**
    * Initialize the API
    */
    init : function(){
        MediaAPI.m_url = defines.root_url + MediaAPI.m_url;
    },
			
    // ////////////////////////////////////////////////////////////////////////

    /**
    * Get the list of folders and media for this site
    */
    getAll : function(siteID, callback){
	
        AthenaDialog.showLoading("Loading media data");
		
        var paras = {
            cmd : 'getAll',
            site_id: siteID
        };

        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){
			        AthenaDialog.clearLoading();
					
			        if (ret.result == 'ok'){
			            callback(ret.data.folders, ret.data.media, ret.data.pages, ret.data.theme, ret.data.page_templates, ret.data.theme_paras, ret.data.page_paras, ret.data.posts, ret.data.tags, ret.data.categories, ret.data.media_tags);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
            	}
        });
		
    },
				
    // ////////////////////////////////////////////////////////////////////////
    //
    // Folders and media
    //
    // ////////////////////////////////////////////////////////////////////////
		
    /**
    * Get the list of folders for this site
    */
    getFolders : function(siteID, callback){
	
        AthenaDialog.showLoading();
		
        var paras = {
            cmd : 'getFolders',
            site_id: siteID
        };

        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){
			        AthenaDialog.clearLoading();
					
			        if (ret.result == 'ok'){
			            callback(ret.data);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
            	}
        });
		
    },
    
    // ////////////////////////////////////////////////////////////////////////
    	
    addFolder : function(siteID, folderName, callback){

        AthenaDialog.showLoading("Adding folder");

        if (folderName == undefined){
            folderName = 'new folder';
        }
		
        var paras = {
            cmd: 'addFolder',
            site_id: siteID,
            folder_name: folderName
        };
												
        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){
            			
			        AthenaDialog.clearLoading();
											
			        if (ret.result == "ok"){
			            callback(ret.data.name, ret.data.id);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
                }
        });
    },
	
    // ////////////////////////////////////////////////////////////////////////
		
    renameFolder : function(siteID, folderID, newName, callback){
				
        var paras = {
            cmd: 'renameFolder',
            site_id: siteID,
            folder_id: folderID,
            folder_name: newName
        };
												
        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){
			        if (ret.result == "ok"){
			            callback(ret.data.id, ret.data.name);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
                }
        });
    },
	
    // ////////////////////////////////////////////////////////////////////////
		
    addMediaToFolder : function(siteID, mediaID, folderID, callback){
		
        var paras = {
            cmd: 'addMediaToFolder',
            site_id: siteID,
            folder_id: folderID,
            media_id: mediaID
        };
												
        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){
			        if (ret.result == "ok"){
			            callback(ret.data.folder_id, ret.data.media_id);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }            		            		
                }
        });
    },
	
    // ////////////////////////////////////////////////////////////////////////
	
    /**
	* Delete a folder, any media assigned to that folder will be considered 'unassigned' so 
	* it is not deleted!
	*/
    deleteFolder : function(siteID, folderID, callback){
		
        var paras = {
            cmd: 'deleteFolder',
            site_id: siteID,
            folder_id: folderID
        };
												
        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){
			        if (ret.result == "ok"){
			            callback(ret.data.id);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
                }
        });
    },
	
    // ////////////////////////////////////////////////////////////////////////
			
    /**
	* Get the list of media for this site
	*/	
    getMedia : function(siteID, callback){
		
        AthenaDialog.showLoading();
		
        var paras = {
            cmd : 'getMedia',
            site_id: siteID
        };

        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            success: function(ret){
                MediaAPI.onGotMedia(ret, callback);
            },
            data: paras
        });
    },
			
    onGotMedia : function(ret, callback){

        AthenaDialog.clearLoading();
		
        if (ret.result == 'ok'){
            if (ret.data == 'true'){
                callback(ret.data);
            }
            else {
                callback(ret.data);
            }
        }
        else {
            AthenaDialog.showAjaxError(ret);
        }
        
    },
   	
    // ////////////////////////////////////////////////////////////////////////
	
    /**
     * Get the list of media for this site
     */
    updateMediaInfo : function(siteID, mediaID, mediaTitle, mediaDesc, mediaTags, callback){
		
        //AthenaDialog.showLoading("Updating file");
		
        var paras = {
            cmd : 'saveMediaInfo',
            site_id: siteID,
            media_id: mediaID,
            title: mediaTitle,
            desc: mediaDesc,
            tags: mediaTags
        };

        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            success: function(ret){
                MediaAPI.onGotMedia(ret, callback);
            },
            data: paras
        });
    },

    // ////////////////////////////////////////////////////////////////////////

    /**
     * Delete the given media id
     */
    deleteMedia : function(siteID, mediaID, callback){

        AthenaDialog.showLoading("Deleting file");

        var paras = {
            cmd : 'deleteMedia',
            site_id: siteID,
            media_id: mediaID
        };

        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            success: 
            function(ret){
		        AthenaDialog.clearLoading();
		
		        if (ret.result == 'ok'){
		            callback(ret.data.media_id);
		        }
		        else {
		            AthenaDialog.showAjaxError(ret);
		        }
            },
            data: paras
        });
    },
    
    // ////////////////////////////////////////////////////////////////////////
    //
    // Media tags
    //
    // ////////////////////////////////////////////////////////////////////////

	/**
	* Remove the association of the given tag from the given media file
	*/
	removeMediaTag : function(siteID, mediaID, tagStr, callback){

        //AthenaDialog.showLoading("Removing tag");

        var paras = {cmd: 'removeMediaTag', site_id: siteID, media_id: mediaID, tag: tagStr};

        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){ 
			        //AthenaDialog.clearLoading();
			        
			        if (ret.result == "ok"){
			            callback(ret.data.media);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
            	}
        });	
	},

    // ////////////////////////////////////////////////////////////////////////

	/**
	* Remove the association of the given tag from the given media file
	*/
	renameMediaTag : function(siteID, currentTagStr, newTagStr, callback){
		
        //AthenaDialog.showLoading("Removing tag");

        var paras = {cmd: 'renameMediaTag', site_id: siteID, tag: currentTagStr, new_tag: newTagStr};

        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){ 
			        //AthenaDialog.clearLoading();
			        
			        if (ret.result == "ok"){
			            callback(ret.data.tags);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
            	}
        });	
	},
	
    // ////////////////////////////////////////////////////////////////////////

	/**
	* Delete a media tag, which will remove this from ALL media files that are associated
	* with this tag
	*/
	deleteMediaTag : function(siteID, tagStr, callback){

        AthenaDialog.showLoading("Deleting tag");

        var paras = {cmd: 'deleteMediaTag', site_id: siteID, tag: tagStr};

        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){ 
			        AthenaDialog.clearLoading();
			        
			        if (ret.result == "ok"){
			            callback(ret.data.tags);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
            	}
        });	
	},
	    	
    // ////////////////////////////////////////////////////////////////////////
	
/*
    case "addMediaTags":
        $csv_tags = CommandHelper::getPara('csvtags', true, CommandHelper::$PARA_TYPE_STRING);
        addMediaTags($site_id, $csv_tags);
        break;

*/	
	addMediaCSVTags : function(siteID, mediaID, tagsCSV, callback){
	
        AthenaDialog.showLoading("Adding tag");

        var paras = {cmd : 'addMediaTags', site_id: siteID, media_id: mediaID, csvtags: tagsCSV};

        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            success: 
            	function(ret){
					AthenaDialog.clearLoading();
					
					if (ret.result == 'ok'){
					    callback(ret.data.media, ret.data.tags);
					}
					else {
					    AthenaDialog.showAjaxError(ret);
					}            
				},
            data: paras
        });	
	} 
}
    