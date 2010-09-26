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
            success: function(ret){
                MediaAPI.onGotAll(ret, callback);
            }
        });
		
    },
			
    /**
    * Check the response from the server, and load data if login is good
    */
    onGotAll : function(ret, callback){
		
        AthenaDialog.clearLoading();
		
        if (ret.result == 'ok'){
            callback(ret.data.folders, ret.data.media, ret.data.pages, ret.data.theme, ret.data.page_templates, ret.data.theme_paras, ret.data.page_paras, ret.data.posts, ret.data.tags, ret.data.categories);
        }
        else {
            AthenaDialog.showAjaxError(ret);
        }
    },

    // ////////////////////////////////////////////////////////////////////////

    /**
    * Get the list of folders and media for this site
    */
    getStats : function(siteID, callback){

        AthenaDialog.showLoading("Loading stats data");

        var paras = {
            cmd : 'getStats',
            site_id: siteID
        };

        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: function(ret){
                MediaAPI.onGotStats(ret, callback);
            }
        });

    },

    /**
    * Check the response from the server, and load data if login is good
    */
    onGotStats : function(ret, callback){

        AthenaDialog.clearLoading();

		if (!ret || ret == undefined){
            callback(0);
            return;
		}
		
        if (ret.result == 'ok'){
            callback(ret.data.disc_usage, ret.data.page_views, ret.data.crawler_views);
        }
        else {
            AthenaDialog.showAjaxError(ret);
        }
    },

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
            success: function(ret){
                MediaAPI.onGotFolders(ret, callback);
            }
        });
		
    },
			
    /**
	* Check the response from the server, and load data if login is good
	*/
    onGotFolders : function(ret, callback){
		
        AthenaDialog.clearLoading();
		
        if (ret.result == 'ok'){
            callback(ret.data);
        }
        else {
            AthenaDialog.showAjaxError(ret);
        }
    },
	
    // ////////////////////////////////////////////////////////////////////////
	
    setPagePara : function(themeParaID, paraValue, pageID, callback){
			
        var paras = {
            cmd: 'setPagePara',
            site_id: DataStore.m_siteID,
            page_id: pageID,
            theme_para_id: themeParaID,
            para_value: paraValue
        };
												
        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: function(ret){
                MediaAPI.onPageParaSet(ret, callback);
            }
        });
    },

    onPageParaSet : function(ret, callback){
        if (ret.result == "ok"){
            callback(ret.data.theme_para_id, ret.data.new_value, ret.data.page_id);
        }
        else {
            AthenaDialog.showAjaxError(ret);
        }
    },
	
    // ////////////////////////////////////////////////////////////////////////
	
    setGlobalPara : function(themeParaID, paraValue, callback){
	
        var paras = {
            cmd: 'setGlobalPara',
            site_id: DataStore.m_siteID,
            theme_para_id: themeParaID,
            para_value: paraValue
        };

        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: function(ret){
                MediaAPI.onGlobalParaSet(ret, callback);
            }
        });
    },

    onGlobalParaSet : function(ret, callback){
        if (ret.result == "ok"){
            callback(ret.data.theme_para_id, ret.data.new_value);
        }
        else {
            AthenaDialog.showAjaxError(ret);
        }
    },
	
    // ////////////////////////////////////////////////////////////////////////
    //
    // Posts.....
    //
    // ////////////////////////////////////////////////////////////////////////

    getPostDetails : function(siteID, postID, callback){
		
        AthenaDialog.showLoading("Getting post details");
		
        var paras = {
            cmd: 'getPostDetails',
            site_id: siteID,
            post_id: postID
        };
				
        $.ajax({
            url: MediaAPI.m_url,
            type: 'post',
            dataType: "json",
            data: paras,
            success: function(ret){
                MediaAPI.onGotPost(ret, callback)
                }
        });
    },
				
    updatePost : function(siteID, postID, postTitle, postContent, postStatus, postCanComment, postSlug, callback){
		
        //AthenaDialog.showLoading("Updating post");
		
        var paras = {
            cmd: 'updatePost',
            site_id: siteID,
            post_id: postID,
            title: postTitle,
            content: postContent,
            status: postStatus,
            can_comment: postCanComment,
            slug: postSlug
        };
				
        $.ajax({
            url: MediaAPI.m_url,
            type: 'post',
            dataType: "json",
            data: paras,
            success: function(ret){
                MediaAPI.onGotPost(ret, callback)
                }
        });
    },

    addPost : function(siteID, postTitle, postContent, postStatus, postCanComment, postSlug, callback){
		
        AthenaDialog.showLoading("Adding post");
		
        var paras = {
            cmd: 'addPost',
            site_id: siteID,
            title: postTitle,
            content: postContent,
            status: postStatus,
            can_comment: postCanComment,
            slug: postSlug
        };
						
        $.ajax({
            url: MediaAPI.m_url,
            type: 'post',
            dataType: "json",
            data: paras,
            success: function(ret){
                MediaAPI.onGotPost(ret, callback)
                }
        });
    },
	
    onGotPost : function(ret, callback){
			
        AthenaDialog.clearLoading();
								
        if (ret.result == "ok"){
            callback(ret.data.post);
        }
        else {
            AthenaDialog.showAjaxError(ret);
        }
    },

    // ////////////////////////////////////////////////////////////////////////

    deletePost : function(siteID, postID, callback){

        AthenaDialog.showLoading("Deleting post");

        var paras = {
            cmd: 'deletePost',
            site_id: siteID,
            post_id: postID
        };
				
        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: function(ret){
                MediaAPI.onPostDeleted(ret, callback)
                }
        });
    },
	
    onPostDeleted : function(ret, callback){

        AthenaDialog.clearLoading();

        if (ret.result == "ok"){
            callback(ret.data.post_id);
        }
        else {
            AthenaDialog.showAjaxError(ret);
        }
    },

    // ////////////////////////////////////////////////////////////////////////

    addTag : function(siteID, postID, postTag, callback){

        //AthenaDialog.showLoading("Adding tag");

        var paras = {
            cmd: 'addTag',
            site_id: siteID,
            post_id: postID,
            tag: postTag
        };
				
        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: function(ret){
                MediaAPI.onTagAdded(ret, callback)
                }
        });
    },
	
    onTagAdded : function(ret, callback){

        //AthenaDialog.clearLoading();

        if (ret.result == "ok"){
            callback(ret.data.post_id, ret.data.tag);
        }
        else {
            AthenaDialog.showAjaxError(ret);
        }
    },
	
    // ////////////////////////////////////////////////////////////////////////

    addCategory : function(siteID, postID, postCategory, callback){

        //AthenaDialog.showLoading("Adding category");

        var paras = {
            cmd: 'addCategory',
            site_id: siteID,
            post_id: postID,
            category: postCategory
        };
				
        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: function(ret){
                MediaAPI.onCategoryAdded(ret, callback)
                }
        });
    },
	
    onCategoryAdded : function(ret, callback){

        //AthenaDialog.clearLoading();

        if (ret.result == "ok"){
            callback(ret.data.post_id, ret.data.category);
        }
        else {
            AthenaDialog.showAjaxError(ret);
        }
    },

    // ////////////////////////////////////////////////////////////////////////

    /**
     * Delete a tag from the entire blog and every post
     */
    deleteTag : function(siteID, globalTag, callback){
        var paras = {cmd: 'deleteTag', site_id: siteID, tag: globalTag};

        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: function(ret){ MediaAPI.onTagDeleted(ret, callback)}
        });
    },

    onTagDeleted : function(ret, callback){
        if (ret.result == "ok"){
            callback(ret.data.tag);
        }
        else {
            AthenaDialog.showAjaxError(ret);
        }
    },

    // ////////////////////////////////////////////////////////////////////////

    /**
     * Delete a category from the entire blog and every post
     */
    deleteCategory : function(siteID, globalCategory, callback){
        var paras = {cmd: 'deleteCategory', site_id: siteID, category: globalCategory};

        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: function(ret){ MediaAPI.onCategoryDeleted(ret, callback)}
        });
    },

    onCategoryDeleted : function(ret, callback){
        if (ret.result == "ok"){
            callback(ret.data.category);
        }
        else {
            AthenaDialog.showAjaxError(ret);
        }
    },

    // ////////////////////////////////////////////////////////////////////////

    removeTag : function(siteID, postID, postTag, callback){

        AthenaDialog.showLoading("Removing tag");

        var paras = {
            cmd: 'removeTag',
            site_id: siteID,
            post_id: postID,
            tag: postTag
        };
				
        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: function(ret){
                MediaAPI.onTagRemoved(ret, callback)
                }
        });
    },
	
    onTagRemoved : function(ret, callback){

        AthenaDialog.clearLoading();

        if (ret.result == "ok"){
            callback(ret.data.post_id, ret.data.tag);
        }
        else {
            AthenaDialog.showAjaxError(ret);
        }
    },
	
    // ////////////////////////////////////////////////////////////////////////

    removeCategory : function(siteID, postID, postCategory, callback){

        AthenaDialog.showLoading("Removing category");

        var paras = {
            cmd: 'removeCategory',
            site_id: siteID,
            post_id: postID,
            category: postCategory
        };
				
        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: function(ret){
                MediaAPI.onCategoryRemoved(ret, callback)
                }
        });
    },
	
    onCategoryRemoved : function(ret, callback){

        AthenaDialog.clearLoading();

        if (ret.result == "ok"){
            callback(ret.data.post_id, ret.data.category);
        }
        else {
            AthenaDialog.showAjaxError(ret);
        }
    },

    // ////////////////////////////////////////////////////////////////////////

    updateCommentStatus : function(siteID, commentID, newStatus, callback){

        AthenaDialog.showLoading("Updating comment");

        var paras = {
            cmd: 'updateCommentStatus',
            site_id: siteID,
            cid: commentID,
            sts: newStatus
        };

        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: function(ret){
                MediaAPI.onCommentStatusUpdated(ret, callback)
                }
        });
    },

    onCommentStatusUpdated : function(ret, callback){

        AthenaDialog.clearLoading();

        if (ret.result == "ok"){
            callback(ret.data.comment_id, ret.data.status);
        }
        else {
            AthenaDialog.showAjaxError(ret);
        }
    },


    // ////////////////////////////////////////////////////////////////////////
    //
    // Pages.....
    //
    // ////////////////////////////////////////////////////////////////////////

    updatePage : function(siteID, pageID, pageTitle, pageContent, pageStatus, templateName, parentPageID, pageSlug, pageOrder, isHome, description, browserTitle ,callback){
		
        //AthenaDialog.showLoading("Updating page");
		
        var paras = {
            cmd: 'updatePage',
            site_id: siteID,
            page_id: pageID,
            title: pageTitle,
            browser_title: browserTitle,
            content: pageContent,
            status: pageStatus,
            template_id: templateName,
            parent_page_id: parentPageID,
            slug: pageSlug,
            ishome: isHome,
            order: pageOrder,
            desc: description
        };
				
        $.ajax({
            url: MediaAPI.m_url,
            type: 'post',
            dataType: "json",
            data: paras,
            success: function(ret){
                MediaAPI.onPageAdded(ret, callback)
                }
        });
    },

    addPage : function(siteID, pageTitle, pageContent, pageStatus, templateName, parentPageID, pageSlug, pageOrder, isHome, callback){
		
        AthenaDialog.showLoading("Adding page");
		
        var paras = {
            cmd: 'addPage',
            site_id: siteID,
            title: pageTitle,
            content: pageContent,
            status: pageStatus,
            template_id: templateName,
            parent_page_id: parentPageID,
            slug: pageSlug,
            ishome: isHome,
            order: pageOrder
        };
				
        $.ajax({
            url: MediaAPI.m_url,
            type: 'post',
            dataType: "json",
            data: paras,
            success: function(ret){
                MediaAPI.onPageAdded(ret, callback)
                }
        });
    },
	
    onPageAdded : function(ret, callback){
			
        AthenaDialog.clearLoading();
								
        if (ret.result == "ok"){
            callback(ret.data.page);
        }
        else {
            AthenaDialog.showAjaxError(ret);
        }
    },

    // ////////////////////////////////////////////////////////////////////////

    deletePage : function(siteID, pageID, callback){

        AthenaDialog.showLoading("Deleting page");

        var paras = {
            cmd: 'deletePage',
            site_id: siteID,
            page_id: pageID
        };
				
        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: function(ret){
                MediaAPI.onPageDeleted(ret, callback)
                }
        });
    },
	
    onPageDeleted : function(ret, callback){

        AthenaDialog.clearLoading();

        if (ret.result == "ok"){
            callback(ret.data.page_id);
        }
        else {
            AthenaDialog.showAjaxError(ret);
        }
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
            success: function(ret){
                MediaAPI.onAddedFolder(ret, callback)
                }
        });
    },
	
    onAddedFolder : function(ret, callback){
		
        AthenaDialog.clearLoading();
								
        if (ret.result == "ok"){
            callback(ret.data.name, ret.data.id);
        }
        else {
            AthenaDialog.showAjaxError(ret);
        }
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
            success: function(ret){
                MediaAPI.onRenamedFolder(ret, callback)
                }
        });
    },
	
    onRenamedFolder : function(ret, callback){
        if (ret.result == "ok"){
            callback(ret.data.id, ret.data.name);
        }
        else {
            AthenaDialog.showAjaxError(ret);
        }
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
            success: function(ret){
                MediaAPI.onMediaAddedToFolder(ret, callback)
                }
        });
    },
	
    onMediaAddedToFolder : function(ret, callback){
        if (ret.result == "ok"){
            callback(ret.data.folder_id, ret.data.media_id);
        }
        else {
            AthenaDialog.showAjaxError(ret);
        }
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
            success: function(ret){
                MediaAPI.onDeletedFolder(ret, callback)
                }
        });
    },
	
    onDeletedFolder : function(ret, callback){
        if (ret.result == "ok"){
            callback(ret.data.id);
        }
        else {
            AthenaDialog.showAjaxError(ret);
        }
	
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
		
        AthenaDialog.showLoading("Updating file");
		
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
            success: function(ret){
                MediaAPI.onMediaDeleted(ret, callback);
            },
            data: paras
        });
    },

    onMediaDeleted : function(ret, callback){

        AthenaDialog.clearLoading();

        if (ret.result == 'ok'){
            callback(ret.data.media_id);
        }
        else {
            AthenaDialog.showAjaxError(ret);
        }

    }
}
    