/**
* Javascript class that allows a user to pick an image from their wordpress media library
* The image data is assumed to be in the class ImagePickerData see the fucntion 
* echoImagePickerJSImageData in plugin_functions.php
*
* @since 17th August, 2010
*/
var PostsSidebarFrame = {
	
    m_targetDiv : '',
	
    // ////////////////////////////////////////////////////////////////////////////
	
    paint : function(targetDiv){
		
        PostsSidebarFrame.m_targetDiv = targetDiv;
		
        var txt = "";

        txt += "<div id='apollo_post_list'></div>";
		
        $(targetDiv).html(txt);
		
        PostsSidebarFrame.paintPosts();
		
        $(targetDiv).disableSelection();
        $(targetDiv).noContext();
		
    },

    // ////////////////////////////////////////////////////////////////////////////

    repaint : function(){
        PostsSidebarFrame.paint(PostsSidebarFrame.m_targetDiv);
    },
	
    // ////////////////////////////////////////////////////////////////////////////
	
    paintPosts : function(){
		
        var postList = DataStore.m_postList;
				
        var txt = "";
		
	
        for (var i=0; i<postList.length; i++){
            txt += PostsSidebarFrame.getPostHtml(postList[i].id, postList[i].title, postList[i].status);
        }
		
        $('#apollo_post_list').html(txt);
        $("#apollo_post_list").disableSelection();
				
    },

    // ////////////////////////////////////////////////////////////////////////////

    getPostHtml : function(post_id, page_title, page_status){

        var txt = '';
        /*
		var status = "";
		if (page_status == 'Draft'){
			icon = "images/webpage_draft.png";
		}
		else if (page_status == 'Private'){
			icon = "images/webpage_private.png";
		}
		else if (page_status == 'Published'){
			icon = "images/webpage_published.png";
		}
		*/
        icon = "images/post.png";
					
        var selected = '';
        if (post_id == DataStore.m_currentPostID){
            selected = 'selected';
        }
			
        txt += "<div onclick=\"PostsSidebarFrame.onSelectPost('"+post_id+"')\" class='page page_depth_0' id='post_"+post_id+"' title=''>";
        txt += "    <img class='page_icon' src='"+icon+"'>";
        txt += "    <span class='page_name "+selected+"'>"+page_title+"</span>";
        txt += "</div>";
				
        return txt;
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    addPost : function(){
        var title = 'New post ' + (DataStore.m_postList.length+1);
        var postSlug = AthenaUtils.encodeSlug(title);
        var order = 0;
        var isHome = 0;
        MediaAPI.addPost(DataStore.m_siteID, title, '', 'Draft', 1, postSlug, PostsSidebarFrame.onPostAdded);
    },
	
    onPostAdded : function(postObj){
        DataStore.addPost(postObj);
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