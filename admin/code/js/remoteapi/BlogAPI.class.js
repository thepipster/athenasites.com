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
    }
}