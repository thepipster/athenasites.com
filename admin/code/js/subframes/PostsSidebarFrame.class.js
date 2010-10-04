/**
* Javascript class that allows a user to pick an image from their wordpress media library
* The image data is assumed to be in the class ImagePickerData see the fucntion 
* echoImagePickerJSImageData in plugin_functions.php
*
* @since 17th August, 2010
*/
var PostsSidebarFrame = {
	
    m_targetDiv : '',
    
    /** Number of posts per 'page' */
    m_postsPerPage : 25,
    
    m_currentPostPage : 0,
    
    m_numberPages : 0,
		
    // ////////////////////////////////////////////////////////////////////////////

    /**
     * First time painting method
     */
    paint : function(targetDiv){
		
        PostsSidebarFrame.m_targetDiv = targetDiv;

        var txt = "";

        txt += "<div style='height:20px'>";        
        txt += "<span class='more_posts_link' id='prev_posts_link' style='float:left; padding-left:15px' onclick='PostsSidebarFrame.showOlderPosts()' title='Display older posts'>&laquo; older</span>";
        txt += "<span class='more_posts_link' id='next_posts_link' style='float:right; padding-right:15px' onclick='PostsSidebarFrame.showNewerPosts()' title='Display newer posts'>newer &raquo;</span>";
        txt += "</div>";
        
        txt += "<div id='apollo_post_list'></div>";
		
        $(targetDiv).html(txt);
		
    	var h = $(window).height() - 80;		
		PostsSidebarFrame.m_postsPerPage = Math.floor(h / 30);
        PostsSidebarFrame.m_numberPages = Math.ceil(DataStore.m_postList.length / PostsSidebarFrame.m_postsPerPage);
		
        PostsSidebarFrame.paintPosts();
		
        $(targetDiv).disableSelection();
        $(targetDiv).noContext();
		
    },

    // ////////////////////////////////////////////////////////////////////////////

    /**
     * Called to handle repaints
     */
    repaint : function(){
        PostsSidebarFrame.paint(PostsSidebarFrame.m_targetDiv);
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    /**
     * Paint the post data
     */
    paintPosts : function(){
		
        var postList = DataStore.m_postList;
				
        var txt = "";

        var start_i = PostsSidebarFrame.m_currentPostPage * PostsSidebarFrame.m_postsPerPage;
        var end_i = Math.min(postList.length, start_i+PostsSidebarFrame.m_postsPerPage);
                
        for (var i=start_i; i< end_i; i++){
            txt += PostsSidebarFrame.getPostHtml(postList[i].id, postList[i].title, postList[i].status);
        }

        if (PostsSidebarFrame.m_currentPostPage < PostsSidebarFrame.m_numberPages-1){
            $('#prev_posts_link').show();
        }
        else {
            $('#prev_posts_link').hide();
        }

        if (PostsSidebarFrame.m_currentPostPage > 0){
            $('#next_posts_link').show();
        }
        else {
            $('#next_posts_link').hide();
        }

		
        $('#apollo_post_list').html(txt);
        $("#apollo_post_list").disableSelection();
				
    },

    // ////////////////////////////////////////////////////////////////////////////

    getPostHtml : function(post_id, post_title, post_status){

        var txt = '';

        var icon = "images/post.png";
        var status_class = "";
        
        if (post_status == 'Draft'){
            //icon = "images/webpage_draft.png";
            status_class = 'status_draft';
        }
        else if (post_status == 'Private'){
            //icon = "images/webpage_private.png";
            status_class = 'status_private';
        }
        else if (post_status == 'Published'){
            //icon = "images/webpage_published.png";
            status_class = 'status_public';
        }
							
        var selected = '';
        if (post_id == DataStore.m_currentPostID){
            selected = 'selected';
        }

        if (post_title == "") post_title = "(no title)";
			
        txt += "<div onclick=\"PostsSidebarFrame.onSelectPost('"+post_id+"')\" class='page page_depth_0' id='post_"+post_id+"' title='"+post_title+"'>";
        txt += "    <img class='page_icon' src='"+icon+"'>";
        txt += "    <span class='page_name "+status_class+" "+selected+"'>"+post_title+"</span>";
        txt += "</div>";
				
        return txt;
    },

    // ////////////////////////////////////////////////////////////////////////////

    showOlderPosts : function(){
        if (PostsSidebarFrame.m_currentPostPage < PostsSidebarFrame.m_numberPages-1){
            PostsSidebarFrame.m_currentPostPage += 1;
        }
        PostsSidebarFrame.paintPosts();
    },

    // ////////////////////////////////////////////////////////////////////////////

    showNewerPosts : function(){
        if (PostsSidebarFrame.m_currentPostPage > 0){
            PostsSidebarFrame.m_currentPostPage -= 1;
        }
        PostsSidebarFrame.paintPosts();
    },

    // ////////////////////////////////////////////////////////////////////////////

    addPost : function(){
        var title = 'New post ' + (DataStore.m_postList.length+1);
        var postSlug = AthenaUtils.encodeSlug(title);
        MediaAPI.addPost(DataStore.m_siteID, title, '', 'Draft', 1, postSlug, PostsSidebarFrame.onPostAdded);
    },
	
    onPostAdded : function(postObj){
        // Add the new post, but to the start of the post list
        DataStore.addPost(postObj, true);
        PostsSidebarFrame.onSelectPost(postObj.id);
    },
	
    /**
	* Encode the page slug based on the title
	*/
    encodeSlug : function(title){
	
        var slug = title.replace(/ /g, ""); // Remove spaces
        slug = slug.replace(/'/g, ""); // Remove single quotes
        slug = slug.replace(/\"/g, ""); // Remove double quotes

        slug = escape(slug);
        slug = slug.replace(/\//g,"%2F");
        slug = slug.replace(/\?/g,"%3F");
        slug = slug.replace(/=/g,"%3D");
        slug = slug.replace(/&/g,"%26");
        slug = slug.replace(/@/g,"%40");
		
        return slug;
    },
		
    // ////////////////////////////////////////////////////////////////////////////
		
    onSelectPost : function(post_id){
        DataStore.m_currentPostID = parseInt(post_id);
        PostsFrame.repaint();
        PostsSidebarFrame.paintPosts();
    }
			
// ////////////////////////////////////////////////////////////////////////////

}