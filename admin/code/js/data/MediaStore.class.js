/**
* Store all current data
*
* @since 28th July, 2010
* @author (mike@apollosites.com)
*/
var MediaStore = {

    m_currentFolderID : -1, // folder id of 1 is considered 'unassigned'
    m_currentPageID : 0,
    m_currentGalleryNo : 1, // For multi-galleries
    m_currentPostID : 0,
    m_currentTag : '',

    /** Currently selected site id (if the user has more than 1 site!) */
    m_siteID : 0,

    /** List of folders for the site with fields; id, site_id, name */
    m_folderList : '',

    /** List of media for the site */
    m_mediaList : '',

    /** List of media tags */
    m_mediaTags : '',
        
    /** Flag to enable stopping/starting of auto-save feature */
    m_doAutoSave : true,

    // //////////////////////////////////////////////////////////////////////////////////

    getImage : function(image_id){

        for(var i=0; i<MediaStore.m_mediaList.length; i++){
            if (MediaStore.m_mediaList[i].id == image_id){
                return MediaStore.m_mediaList[i];
            }
        }
        
        return false;
    },

    // //////////////////////////////////////////////////////////////////////////////////

    getFolderName : function(folder_id){

        if (folder_id == FolderSidebarFrame.ID_UNASSIGNED){
            return "Unassigned";
        }

        for (var i=0; i<MediaStore.m_folderList.length; i++){
            if (MediaStore.m_folderList[i].id == folder_id){
                return MediaStore.m_folderList[i].name;
            }
        }

        return "? ("+folder_id+")";
    },

    // //////////////////////////////////////////////////////////////////////////////////

	/**
	* Save any items that have been marked as changed
	*/
    save : function(){
        
        if (!MediaStore.m_doAutoSave) return;
        
        var autosaved = false;
        
		// Check images/media....
    	for (i=0; i<MediaStore.m_mediaList.length; i++){
    		if (MediaStore.m_mediaList[i].isChanged != undefined && MediaStore.m_mediaList[i].isChanged == 1){  
    			MediaStore.saveMedia(MediaStore.m_mediaList[i]);   			
    			autosaved = true;		
    			savingMedia = true;
    		}
    	}  
									
		AthenaDialog.backgroundMessage("Autosaved");
    },

    // //////////////////////////////////////////////////////////////////////////////////

	saveMedia : function(mediaObj){
        MediaAPI.updateMediaInfo(MediaStore.m_siteID, mediaObj.id, mediaObj.title, mediaObj.description, mediaObj.tags, MediaStore.onMediaSaved);
	},
	
	onMediaSaved : function(mediaObj){
	
		MediaStore.updateMedia(mediaObj);
		
		// Mark as saved...
    	for (var i=0; i<MediaStore.m_mediaList.length; i++){
    		if (MediaStore.m_mediaList[i].id == mediaObj.id){
    			MediaStore.m_mediaList[i].isChanged = 0;
    		}
		}			
	},
	
    // //////////////////////////////////////////////////////////////////////////////////

    load : function(callback){

        MediaAPI.getMedia(MediaStore.m_siteID,
            function(folders, media, media_tag_list){
                MediaStore.onGotData(folders, media, pages, theme, page_templates, theme_paras, page_paras, posts, tags, categories, media_tag_list, callback);
            });
    },

    // //////////////////////////////////////////////////////////////////////////////////

    onGotData : function(folder_list, media_list, page_list, theme, page_templates, theme_paras, paga_paras, post_list, tag_list, categories_list, media_tag_list, callback){

        MediaStore.onGotFolders(folder_list);
        MediaStore.onGotMedia(media_list);

        MediaStore.m_siteParaList = paga_paras;
        MediaStore.m_themeParaList = theme_paras;
        MediaStore.m_theme = theme; // id, theme_name, theme_title, price, thumb_url, description, is_private, max_page_depth
        MediaStore.m_categories = categories_list;
        MediaStore.m_tags = tag_list;
        MediaStore.m_mediaTags = media_tag_list;

        if (MediaStore.m_themeParaList == undefined) MediaStore.m_themeParaList = new Array();
        if (MediaStore.m_siteParaList == undefined) MediaStore.m_siteParaList = new Array();
        if (MediaStore.m_categories == undefined) MediaStore.m_categories = new Array();
        if (MediaStore.m_tags == undefined) MediaStore.m_tags = new Array();

        callback();
    },
    

    // //////////////////////////////////////////////////////////////////////////////////

    onGotFolders : function(folder_list){

        if (!folder_list || folder_list == undefined){
            MediaStore.m_folderList = new Array();
            return;
        }

        MediaStore.m_folderList = new Array(folder_list.length);

        for(var i=0; i<folder_list.length; i++){

            var temp = new Object();
            temp.id = folder_list[i].id;
            temp.name = folder_list[i].name;

            if (i == 0){
            //alert(temp.id + " " + temp.name);
            }

            MediaStore.m_folderList[i] = temp;
        }

    },

    // //////////////////////////////////////////////////////////////////////////////////

    onGotMedia : function(media_list){

        if (!media_list || media_list == undefined){
            MediaStore.m_mediaList = new Array();
            return;
        }

        MediaStore.m_mediaList = new Array(media_list.length);
		
        for(var i=0; i<media_list.length; i++){

            var files_root = defines.user_files_root_url + MediaStore.m_siteID + "/";
            var temp = new Object();

            temp.thumb_url = files_root + media_list[i].filepath + media_list[i].thumb_filename;
            temp.file_url = files_root + media_list[i].filepath + media_list[i].filename;
            temp.mime_type = media_list[i].mime_type;
            temp.title = media_list[i].title;
            temp.description = media_list[i].description;
            temp.tags = media_list[i].tags;
            temp.width = media_list[i].width;
            temp.height = media_list[i].height;
            temp.thumb_width = media_list[i].thumb_width;
            temp.thumb_height = media_list[i].thumb_height;
            temp.id = media_list[i].id;
            temp.date_added = media_list[i].created;
            temp.folder_id = media_list[i].folder_id;
            temp.media_tags = media_list[i].media_tags;
					
            if (i == 0){
            //alert(temp.thumb_url);
            }

            MediaStore.m_mediaList[i] = temp;
        }

    },

    // //////////////////////////////////////////////////////////////////////////////////

    /**
    * Update an existing page, if preserveURL is set to true then don't add the path to the image url
    */
    updateMedia : function(mediaObj, preserveURL){

		if (preserveURL == undefined) preserveURL = false;
		
        for (var i=0; i<MediaStore.m_mediaList.length; i++){
            if (MediaStore.m_mediaList[i].id == mediaObj.id){

                var files_root = defines.user_files_root_url + MediaStore.m_siteID + "/";

                MediaStore.m_mediaList[i].id = mediaObj.id;
                
                if (preserveURL){
	                MediaStore.m_mediaList[i].thumb_url = mediaObj.thumb_url;
	                MediaStore.m_mediaList[i].file_url = mediaObj.file_url;
                }
                else {
	                MediaStore.m_mediaList[i].thumb_url = files_root + mediaObj.filepath + mediaObj.thumb_filename;
	                MediaStore.m_mediaList[i].file_url = files_root + mediaObj.filepath + mediaObj.filename;
                }
                
                MediaStore.m_mediaList[i].mime_type = mediaObj.mime_type;
                MediaStore.m_mediaList[i].title = mediaObj.title;
                MediaStore.m_mediaList[i].description = mediaObj.description;
                MediaStore.m_mediaList[i].tags = mediaObj.tags;
                MediaStore.m_mediaList[i].width = mediaObj.width;
                MediaStore.m_mediaList[i].height = mediaObj.height;
                MediaStore.m_mediaList[i].thumb_width = mediaObj.thumb_width;
                MediaStore.m_mediaList[i].thumb_height = mediaObj.thumb_height;
                MediaStore.m_mediaList[i].date_added = mediaObj.date_added;
                MediaStore.m_mediaList[i].folder_id = mediaObj.folder_id;
                MediaStore.m_mediaList[i].media_tags = mediaObj.media_tags;
                MediaStore.m_mediaList[i].isChanged = 1;

                return;
            }
        }
    },

    // //////////////////////////////////////////////////////////////////////////////////

    /**
     * Remove a media file from the list
     */
    deleteMedia : function(media_id){

        var tempList = new Array();

        for(var i=0; i<MediaStore.m_mediaList.length; i++){
            if (MediaStore.m_mediaList[i].id != media_id){
                tempList.push(MediaStore.m_mediaList[i]);
            }
        }

        MediaStore.m_mediaList = tempList;

		// Remove from any galleries

        var tempList = new Array();
        for(var i=0; i<MediaStore.m_galleryImageList.length; i++){
            if (MediaStore.m_galleryImageList[i].image_id != media_id){
                tempList.push(MediaStore.m_galleryImageList[i]);
            }
        }

        MediaStore.m_galleryImageList = tempList;
				
    },
    
    // //////////////////////////////////////////////////////////////////////////////////

	/**
	* Get a list of all the images that have the given media tag associated with them
	*/
	getImagesForCurrentTag : function(){
	
		var tag = MediaStore.m_currentTag;
        var imageList = MediaStore.m_mediaList;
		var tagImageList = new Array();
        	    		
        for (var i=0; i<imageList.length; i++){
        	if (imageList[i].media_tags != undefined && imageList[i].media_tags != null){
	        	for (var j=0; j<imageList[i].media_tags.length; j++){  
	        		if (imageList[i].media_tags[j] == tag){
		        		tagImageList.push(imageList[i]);
	        		}      	
	        	}        	
        	}
		}
			
		return tagImageList;	
	},
	
    // //////////////////////////////////////////////////////////////////////////////////
    
	/**
	* Get a list of images for the currently selected folder/filter
	* @return Return an array of images for the currently selected folder
	*/
	getImagesForCurrentFolder : function(){

        var d = new Date();
        var localTime = d.getTime();
        var localOffset = d.getTimezoneOffset() * 60000;
        var utc_date = new Date(localTime + localOffset);
        var utc_time = localTime + localOffset;
												
        var imageList = MediaStore.m_mediaList;
        
		var folderImageList = new Array();
		
        for (var i=0; i<imageList.length; i++){

            var image_folder_id = parseInt(imageList[i].folder_id);
            var added_date = new Date(imageList[i].date_added);
            var hours_ago = (utc_time - added_date.getTime())/3600000;
									
            switch(MediaStore.m_currentFolderID){
			
                case FolderSidebarFrame.ID_UNASSIGNED:
                    if (image_folder_id == FolderSidebarFrame.ID_ALL || image_folder_id == FolderSidebarFrame.ID_UNASSIGNED)
                    	folderImageList.push(imageList[i]);
                    break;
					
                case FolderSidebarFrame.ID_LAST_1_HOUR:
                    if (hours_ago <= 1){
                    	folderImageList.push(imageList[i]);
                    }
                    break;

                case FolderSidebarFrame.ID_LAST_24_HOURS:
                    if (hours_ago <= 24){
                    	folderImageList.push(imageList[i]);
                    }
                    break;

                case FolderSidebarFrame.ID_LAST_7_DAYS:
                    if (hours_ago <= 168){
                    	folderImageList.push(imageList[i]);
                    }
                    break;

                case FolderSidebarFrame.ID_ALL:
                   	folderImageList.push(imageList[i]);
                    break;

                case image_folder_id:
                   	folderImageList.push(imageList[i]);
                    break;

                default:
            // Nothing to do
            }
			
        }
        
        return folderImageList;
                
	}

}