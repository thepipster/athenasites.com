/**
*
* 
* @since 16th, August 2010
*/
var PostsFrame = {

    /**
     * Store a reference to the current post, this is more detailed than what is
     * store in the DataStore
     */
    postObj : false,
    
    // ////////////////////////////////////////////////////////////////////////////

    init : function(){
    //PostsFrame.painted = false;
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    repaint : function(){
			
		$('#postTitle').show();
		$('#pageTitle').hide();
			
        if (DataStore.m_postList.length == 0){
            AthenaDialog.backgroundMessage("You currently have no posts, you can add a post using the side-bar");
        }

		//oUtil.obj.onKeyPress = PostsFrame.onContentKeyPress;

        MediaAPI.getPostDetails(DataStore.m_siteID, DataStore.m_currentPostID, PostsFrame.repaintData);
								
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    repaintData : function(postObj){

        PostsFrame.postObj = '';
        PostsFrame.postObj = postObj;

        $('#postSettings').show();
        $('#pageSettings').hide();

        oUtil.obj.css = DataStore.m_theme.cms_blog_css;
        
        if (postObj != undefined){
        
	        oUtil.obj.loadHTML(postObj.content);
	        
	        //PostsFrame.oEdit.loadHTML(postObj.content);
		
	        $('#postTitle').val(postObj.title);
	        $('#postSlug').html(postObj.slug);
	        $('#postLastEdit').html(postObj.last_edit);
	        $('#postCreated').html(postObj.created);
			
	        $('#postStatusSelector').val(postObj.status);
	        //PostsFrame.refreshStatusSelectBox();
					
	        PostsFrame.updatePostLink(postObj);
	        
	        PostsFrame.updateTagsAndCategoris();
        }

    },

    // ////////////////////////////////////////////////////////////////////////////


    paintTools : function(){

        var txt = "";

        txt += "<p>This tool allows you to import blog posts, comments and followers from other blogging engines.</p>";
        txt += "<p>To get started, click on the button below that corresponds to the blog you want to import from.</p>";
        txt += "<br/>";
        txt += "<div align='center'>";
        txt += "    <button class='basic_button' onclick='WordpressImporter.show()'>Wordpress</button>";
        txt += "    <button class='basic_button' onclick='BloggerImporter.show()'>Blogger</button>";
        txt += "    <button class='basic_button' onclick='LiveJournalImporter.show()'>LiveJournal</button>";
        txt += "</div>"
        txt += "<br/>";
        txt += "<p>If you need to import from a blog engine not listed above, email us at <a href='mailto:support@apollosites.com?subject=Feature request: New blog import&body=It would be really awesome if you supported imports from my old blog, which is at xxxxx'>support@apollosites.com</a> and we'll try to add that blogging engine to the list as soon as we can!</p>";

        //AthenaDialog.alert(txt, "Import Posts");


        $('#apollo_dialog').dialog("destroy");

        $('#apollo_dialog').html(txt);

        $('#apollo_dialog').dialog({
            resizable: false,
            width: 400,
            //	height:140,
            modal: true,
            title: "Import Posts",
            buttons: {
                Cancel: function() {
                    $(this).dialog('close');
                }
            }
        });

    },

    // ////////////////////////////////////////////////////////////////////////////

    updatePostLink : function(postObj){

        var blogPage = DataStore.getBlogPage();
				
        if (!blogPage || blogPage == undefined){
            //AthenaDialog.backgroundMessage("You do not have a blog page for your site yet. You can add one using the pages tab. You can continue to create blog posts, but they will not be visible to users", "No Blog Page!");
            AthenaDialog.backgroundMessage("You have not set blog page for your site yet.");
            $('#pageLink').html("");
        }
        else {
            if (blogPage.status != 'Published'){
                AthenaDialog.backgroundMessage("Your blog page is not public. You can change your blog pages status using the Pages tab");
            }
		
            var blogslug = blogPage.path + blogPage.slug;
            
            // Strip .html, if it has it
            var pos = blogslug.indexOf('.html');
            if (pos > 0){
	            blogslug = blogslug.substring(0, pos); 
            }
            $('#pageLink').html("View Post");
            $('#pageLink').attr('href', 'http://' + defines.domain + blogslug + postObj.path + postObj.slug);
        }
			
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    refreshStatusSelectBox : function(){
        $('#postStatusSelector').removeClass('select_option_public select_option_draft select_option_private');
        switch($('#postStatusSelector').val()){
            case 'Published':
                $('#postStatusSelector').addClass('select_option_public');
                break;
            case 'Draft':
                $('#postStatusSelector').addClass('select_option_draft');
                break;
            case 'Private':
                $('#postStatusSelector').addClass('select_option_private');
                break;
        }
    },
    
    // ////////////////////////////////////////////////////////////////////////////
	
    /**
	* Get the complete list of tags and categories for the entire site, and populate an auto-complete field with this data
	*/
    updateTagsAndCategoris : function(){

        $("#postTag").autocomplete({
            source: DataStore.m_tags
        });
        $("#postCategory").autocomplete({
            source: DataStore.m_categories
        });
		
        var post = PostsFrame.postObj;

        var txt = "";
        var onclick = "";

        if (post.tags){
            for (var i=0; i<post.tags.length; i++){
                onclick = "PostsFrame.deleteTag(\""+post.tags[i]+"\")";
                txt += "<div class='postTagCatLine'><span class='postTagCat'>"+post.tags[i]+"</span><span class='postRemoveTagCat' onclick='"+onclick+"'></span></div>";
            }
            $('#apollo_post_tags').html(txt);
        }
        else {
            $('#apollo_post_tags').html("");
        }


        if (post.categories){
            txt = "";
            for (var i=0; i<post.categories.length; i++){
                onclick = "PostsFrame.deleteCategory(\""+post.categories[i]+"\")";
                txt += "<div class='postTagCatLine'><span class='postTagCat'>"+post.categories[i]+"</span><span class='postRemoveTagCat' onclick='"+onclick+"'></span></div>";
            }
            $('#apollo_post_categories').html(txt);
        }
        else {
            $('#apollo_post_categories').html("");
        }


    },
    
    // ////////////////////////////////////////////////////////////////////////////

    /**
	* Delete the post!
	*/
    onDeletePost : function(){
        AthenaDialog.confirm("Are you sure you want to delete this post?", function(){
            PostsFrame.onDoDelete();
        });
    },
	
    onDoDelete : function(){
        MediaAPI.deletePost(DataStore.m_siteID, DataStore.m_currentPostID, PostsFrame.onPostDeleted);
    },
	
    onPostDeleted : function(post_id){
        DataStore.deletePost(post_id);
        if (DataStore.m_postList.length > 0){
            DataStore.m_currentPostID = DataStore.m_postList[0].id;
        }
        else {
            DataStore.m_currentPostID = 0;
        }
        PostsFrame.repaint();
        PostsSidebarFrame.repaint();
    },
		
    // ////////////////////////////////////////////////////////////////////////////

	/**
	* Called whenever any post information is changed
	*/	
	onChange : function(){
	
        var postObj = DataStore.getPost(DataStore.m_currentPostID);
						
        //var content = CKEDITOR.instances.postContentEditor.getData();
        postObj.content = oUtil.obj.getXHTMLBody();
        postObj.title = $('#postTitle').val();
        postObj.status = $('#postStatusSelector').val();
        postObj.canComment = $('#postCanCommentSelector').val();
        postObj.slug = AthenaUtils.encodeSlug(postObj.title);

        DataStore.updatePost(postObj);
        PostsSidebarFrame.repaint();
	
	},
	
	m_contentChangedTO : '',
	
	/**
	* Called whenever is key is pressed in the content editor. We want to wait until the user has stopped
	* typing before we submit changes
	*/
	onContentKeyPress : function(){
				
		if (PostsFrame.m_contentChangedTO != ''){
			// Still typing, so clear timeout and reset
			clearTimeout(PostsFrame.m_contentChangedTO);
		}
		
		PostsFrame.m_contentChangedTO = setTimeout(PostsFrame.onChange, 500);
	},	
	
    /**
	* Save all the users changes to the site
	*/
	/*
    onSavePost : function(){

        var postObj = DataStore.getPost(DataStore.m_currentPostID);
						
        //var content = CKEDITOR.instances.postContentEditor.getData();
        postObj.content = oUtil.obj.getXHTMLBody();
        postObj.title = $('#pageTitle').val();
        postObj.status = $('#postStatusSelector').val();
        postObj.canComment = $('#postCanCommentSelector').val();
        postObj.slug = AthenaUtils.encodeSlug(title);

        DataStore.updatePost(postObj);
        
        //MediaAPI.updatePost(DataStore.m_siteID, DataStore.m_currentPostID, title, content, status, canComment, slug, PostsFrame.onPostSaved)
				
    },
	
    onPostSaved : function(postObj){
        DataStore.updatePost(postObj);
        PostsFrame.repaint();
        PostsSidebarFrame.repaint();
    },
*/
    // ////////////////////////////////////////////////////////////////////////////

    addTag : function(){
        var tag = $('#postTag').val();
        $('#postTag').val('');
        MediaAPI.addTag(DataStore.m_siteID, DataStore.m_currentPostID, tag, PostsFrame.onTagAdded);
    },

    onTagAdded : function(post_id, tag){
		
        var post = DataStore.getPost(post_id);
        post.tags.push(tag);
        DataStore.updatePost(post);
		
        // Is this a new tag?
        var newTag = true;
        for (var i=0; i<DataStore.m_tags.length; i++){
            if (DataStore.m_tags[i] == tag){
                newTag = false;
                break;
            }
        }
		
        if (newTag){
            DataStore.m_tags.push(tag);
        }
		
        PostsFrame.repaint();
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    addCategory : function(){
        var cat = $('#postCategory').val();
        $('#postCategory').val('');
        MediaAPI.addCategory(DataStore.m_siteID, DataStore.m_currentPostID, cat, PostsFrame.onCategoryAdded);
    },
	
    onCategoryAdded : function(post_id, category){
	
        var post = DataStore.getPost(post_id);
        post.categories.push(category);
        DataStore.updatePost(post);
	
        // Is this a new cat?
        var newCat = true;
        for (var i=0; i<DataStore.m_categories.length; i++){
            if (DataStore.m_categories[i] == category){
                newCat = false;
                break;
            }
        }
		
        if (newCat){
            DataStore.m_categories.push(category);
        }

        PostsFrame.repaint();
    },
	
    // ////////////////////////////////////////////////////////////////////////////
	
    deleteCategory : function(cat){
        AthenaDialog.confirm("Are you sure you want to remove this tag from this post?", function(){
            MediaAPI.removeCategory(DataStore.m_siteID, DataStore.m_currentPostID, cat, PostsFrame.onCategoryDeleted);
        });
    },
	
    onCategoryDeleted : function(post_id, cat){
				
        // Update post....
        var post = DataStore.getPost(post_id);
        var newList = new Array();
        for (var i=0; i<post.categories.length; i++){
            if (post.categories[i] != cat){
                newList.push(post.categories[i]);
            }
        }
        post.categories = newList;
        DataStore.updatePost(post);
	
        PostsFrame.repaint();
			
    },
	
    // ////////////////////////////////////////////////////////////////////////////
	
    deleteTag : function(tag){
        AthenaDialog.confirm("Are you sure you want to remove this tag from this post?", function(){
            MediaAPI.removeTag(DataStore.m_siteID, DataStore.m_currentPostID, tag, PostsFrame.onTagDeleted);
        });
    },

    onTagDeleted : function(post_id, tag){

        // Update post....
        var post = DataStore.getPost(post_id);
        var newList = new Array();
        for (var i=0; i<post.tags.length; i++){
            if (post.tags[i] != tag){
                newList.push(post.tags[i]);
            }
        }
        post.tags = newList;
        DataStore.updatePost(post);
	
        PostsFrame.repaint();

    },

    // ////////////////////////////////////////////////////////////////////////////

    /**
     * Launch a dialog that lists all a users tags and allows them to delete them
     */
    viewTags : function(){

        var txt = "";

        for (var i=0; i<DataStore.m_tags.length; i++){
            onclick = "PostsFrame.onDeleteGlobalTag("+i+")";
            txt += "<div class='postTagCatLine'><span class='postTagCat'>"+DataStore.m_tags[i]+"</span><span class='postRemoveTagCat' onclick='"+onclick+"'></span></div>";
        }

        $('#apollo_dialog').dialog("destroy");
        $('#apollo_dialog').html(txt);
        $('#apollo_dialog').dialog({
            resizable: false,
            width: $(window).width()*2/3,
            //	height:140,
            modal: true,
            title: "Your Tags",
            buttons: {
                Cancel: function() {
                    $(this).dialog('close');
                }
            }
        });
    },

    // ////////////////////////////////////////////////////////////////////////////

    onDeleteGlobalTag : function(tagIndex){
        AthenaDialog.confirm("Are you sure you want to delete the tag '"+DataStore.m_tags[i]+"' for all your posts? This can not be undone!", function(){
            PostsFrame.onDoDeleteGlobalTag(tagIndex);
        });
    },

    onDoDeleteGlobalTag : function(tagIndex){
        MediaAPI.deleteTag(DataStore.m_siteID, DataStore.m_tags[tagIndex], PostsFrame.onGlobalTagDeleted);
    },

    onGlobalTagDeleted : function(tag){

        // Remove category from cat list
        var new_list = new Array();
        for (var i=0; i<DataStore.m_tags.length; i++){
            if (DataStore.m_tags[i] != tag){
                new_list.push(DataStore.m_tags[i]);
            }
        }
        DataStore.m_tags = new_list;

        // Repaint frame
        PostsFrame.repaint();
    },

    // ////////////////////////////////////////////////////////////////////////////

    /**
     * Launch a dialog that lists all a users categories and allows them to delete them
     */
    viewCategories : function(){

        var txt = "";

        for (var i=0; i<DataStore.m_categories.length; i++){
            onclick = "PostsFrame.onDeleteGlobalCategory("+i+")";
            txt += "<div class='postTagCatLine'><span class='postTagCat'>"+DataStore.m_categories[i]+"</span><span class='postRemoveTagCat' onclick='"+onclick+"'></span></div>";
        }

        $('#apollo_dialog').dialog("destroy");
        $('#apollo_dialog').html(txt);
        $('#apollo_dialog').dialog({
            resizable: false,
            width: $(window).width()*2/3,
            //	height:140,
            modal: true,
            title: "Your Categories",
            buttons: {
                Cancel: function() {
                    $(this).dialog('close');
                }
            }
        });

    },

    // ////////////////////////////////////////////////////////////////////////////

    onDeleteGlobalCategory : function(catIndex){
        AthenaDialog.confirm("Are you sure you want to delete the category '"+DataStore.m_categories[catIndex]+"' for all your posts? This can not be undone!", function(){
            PostsFrame.onDoDeleteGlobalCategory(catIndex);
        });
    },

    onDoDeleteGlobalCategory : function(catIndex){
        MediaAPI.deleteCategory(DataStore.m_siteID, DataStore.m_categories[catIndex], PostsFrame.onGlobalCategoryDeleted);
    },

    onGlobalCategoryDeleted : function(category){
        
        // Remove category from cat list
        var new_list = new Array();
        for (var i=0; i<DataStore.m_categories.length; i++){
            if (DataStore.m_categories[i] != category){
                new_list.push(DataStore.m_categories[i]);
            }
        }
        DataStore.m_categories = new_list;

        // Repaint frame
        PostsFrame.repaint();
    }

    // ////////////////////////////////////////////////////////////////////////////

}