/**
* Allows access to the remote (Ajax) Athena Blog API
* 
* @author Mike Pritchard (mike@apollosites.com)
* @since 11th September, 2010
*/
var BlogAPI = {
	
    /** Command url */
    m_url : '/code/php/remoteapi/BlogAPI.php',
							
    // ////////////////////////////////////////////////////////////////////////
	
    /**
    * Initialize the API
    */
    init : function(){
        BlogAPI.m_url = defines.root_url + BlogAPI.m_url;
    },

    // ////////////////////////////////////////////////////////////////////////
		
    /**
    * Get the list of folders and media for this site
    */
    addComment : function(siteID, postID, authorName, authorEmail, authorURL, parentCommentID, commentContent, callback){
			
        var paras = {
            cmd : 'addComment',
            site_id: siteID,
            post_id: postID,
            name: authorName,
            email: authorEmail,
            author_url: authorURL,
            content: commentContent,
            pid: parentCommentID
        };

        $.ajax({
            url: BlogAPI.m_url,
            dataType: "json",
            data: paras,
            success: function(ret){
                BlogAPI.onCommentAdded(ret, callback);
            }
        });
		
    },
			
    /**
    * Check the response from the server, and load data if login is good
    */
    onCommentAdded : function(ret, callback){
				
        if (ret.result == 'ok'){
            callback();
        }
        else {
            AthenaDialog.showAjaxError(ret);
        }
    },
    			
    // ////////////////////////////////////////////////////////////////////////

    /**
    * Get the comments for this site
    */
    getComments : function(siteID, postID, callback){
	
        AthenaDialog.showLoading("Loading comments");
		
        var paras = {
            cmd : 'getComments',
            site_id: siteID,
            post_id: postID
        };

        $.ajax({
            url: BlogAPI.m_url,
            dataType: "json",
            data: paras,
            success: function(ret){
                BlogAPI.onGotComments(ret, callback);
            }
        });
		
    },
			
    /**
    * Check the response from the server, and load data if login is good
    */
    onGotComments : function(ret, callback){
		
        AthenaDialog.clearLoading();
		
        if (ret.result == 'ok'){
            callback(ret.data.post_id, ret.data.comments);
        }
        else {
            AthenaDialog.showAjaxError(ret);
        }
    },

    // ////////////////////////////////////////////////////////////////////////

    /**
    * Get the list of folders and media for this site
    */
    getSummary : function(siteID, callback){

        AthenaDialog.showLoading("Loading comments");

        var paras = {cmd : 'getSummary', site_id: siteID};

        $.ajax({
            url: BlogAPI.m_url,
            dataType: "json",
            data: paras,
            success: function(ret){
                BlogAPI.onGotSummary(ret, callback);
            }
        });

    },

    /**
    * Check the response from the server, and load data if login is good
    */
    onGotSummary : function(ret, callback){

        AthenaDialog.clearLoading();

        if (ret.result == 'ok'){
            
            var data = new Object();

            data.comments_approved = ret.data.comments_approved;
            data.comments_pending = ret.data.comments_pending;
            data.comments_trash = ret.data.comments_trash;
            data.comments_spam = ret.data.comments_spam;
            data.posts_published = ret.data.posts_published;
            data.posts_private = ret.data.posts_private;
            data.posts_draft = ret.data.posts_draft;            
            data.categories = ret.data.categories;
            data.tags = ret.data.tags;
            data.no_followers = ret.data.no_followers;
            data.top_followers = ret.data.followers;

            callback(data);
        }
        else {
            AthenaDialog.showAjaxError(ret);
        }
    },
    
    // ////////////////////////////////////////////////////////////////////////
    //
    // Secure methods, require a user to be logged in
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
            url: BlogAPI.m_url,
            type: 'post',
            dataType: "json",
            data: paras,
            success: function(ret){
                BlogAPI.onGotPost(ret, callback)
                }
        });
    },
				
    updatePost : function(siteID, postID, postTitle, postContent, postStatus, postCanComment, postSlug, callback){
		
        //AthenaDialog.showLoading("Updating post");
				
		if (postTitle == '' || postTitle == undefined || postTitle == null){
			AthenaDialog.error("Error saving post!");
			return;
		}
		
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
            url: BlogAPI.m_url,
            type: 'post',
            dataType: "json",
            data: paras,
            success: function(ret){
                BlogAPI.onGotPost(ret, callback)
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
            url: BlogAPI.m_url,
            type: 'post',
            dataType: "json",
            data: paras,
            success: function(ret){
                BlogAPI.onGotPost(ret, callback)
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
            url: BlogAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){
			        AthenaDialog.clearLoading();
			
			        if (ret.result == "ok"){
			            callback(ret.data.post_id);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
                }
        });
    },
	
    // ////////////////////////////////////////////////////////////////////////
    //
    // Post Tags and Categories
    //
    // ////////////////////////////////////////////////////////////////////////

	/**
	* Add a tag to a post, can handle single tags or csv tags
	*/
    addTag : function(siteID, postID, csvPostTags, callback){

        //AthenaDialog.showLoading("Adding tag");

        var paras = {
            cmd: 'addPostTags',
            site_id: siteID,
            post_id: postID,
            csvtags: csvPostTags
        };
				
        $.ajax({
            url: BlogAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){
			        //AthenaDialog.clearLoading();
			
			        if (ret.result == "ok"){
			            callback(ret.data.post, ret.data.tags);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
                }
        });
    },	
	
    // ////////////////////////////////////////////////////////////////////////

	/**
	* Add a category to a post, can handle single category or csv category
	*/
    addCategory : function(siteID, postID, csvPostCategories, callback){

        //AthenaDialog.showLoading("Adding category");

        var paras = {
            cmd: 'addPostCategories',
            site_id: siteID,
            post_id: postID,
            csvcats: csvPostCategories
        };
				
        $.ajax({
            url: BlogAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){
			        //AthenaDialog.clearLoading();
			
			        if (ret.result == "ok"){
			            callback(ret.data.post, ret.data.categories);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
                }
        });
    },
	
    // ////////////////////////////////////////////////////////////////////////

    /**
     * Delete a tag from the entire blog and every post
     */
    deleteTag : function(siteID, globalTag, callback){
        var paras = {cmd: 'deleteTag', site_id: siteID, tag: globalTag};

        $.ajax({
            url: BlogAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){ 
			        if (ret.result == "ok"){
			            callback(ret.data.tag);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
            	}
        });
    },

    // ////////////////////////////////////////////////////////////////////////

    /**
     * Delete a category from the entire blog and every post
     */
    deleteCategory : function(siteID, globalCategory, callback){
        var paras = {cmd: 'deleteCategory', site_id: siteID, category: globalCategory};

        $.ajax({
            url: BlogAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){ 
			        if (ret.result == "ok"){
			            callback(ret.data.category);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
            	}
        });
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
            url: BlogAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){
			        AthenaDialog.clearLoading();
			
			        if (ret.result == "ok"){
			            callback(ret.data.post_id, ret.data.tag);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
                }
        });
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
            url: BlogAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){
			        AthenaDialog.clearLoading();
			
			        if (ret.result == "ok"){
			            callback(ret.data.post_id, ret.data.category);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
                }
        });
    },
	
    // ////////////////////////////////////////////////////////////////////////
    //
    // Comments
    //
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
            url: BlogAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){
			        AthenaDialog.clearLoading();
			
			        if (ret.result == "ok"){
			            callback(ret.data.comment_id, ret.data.status);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
                }
        });
    },
    
}