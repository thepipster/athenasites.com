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
		
		$('#postTag').keyup(function(e) {
			//alert(e.keyCode);
			if(e.keyCode == 13) {
				PostsFrame.addTag();
			}
		}); 

		$('#postCategory').keyup(function(e) {
			//alert(e.keyCode);
			if(e.keyCode == 13) {
				PostsFrame.addCategory();
			}
		}); 
		
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    repaint : function(){
			
        if (DataStore.m_postList.length == 0){
            AthenaDialog.backgroundMessage("You currently have no posts, you can add a post using the side-bar");
        }

		//oUtil.obj.onKeyPress = PostsFrame.onContentKeyPress;

        BlogAPI.getPostDetails(ssMain.siteID, DataStore.m_currentPostID, PostsFrame.repaintData);
								
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    repaintData : function(postObj){

        PostsFrame.postObj = '';
        PostsFrame.postObj = postObj;

        $('#postSettings').show();
        $('#pageSettings').hide();

        oUtil.obj.css = DataStore.m_theme.cms_blog_css;
        
        if (postObj != undefined){
        
			if (postObj.status != 'Published'){
				$('#postTitleWrapper').html("<input id='postTitle' type='text' value='"+postObj.title+"' class='apolloDataInput'/>");
				$('#postTitle').typing({ stop: ssMain.onDataChange, delay: 400});
			}
			else {
				var txt = "<span id='pageTitleDisplay'>" +postObj.title + "</span>";
				txt += "<button class='basic_button' onclick='PostsFrame.onToggleTitle()' title='Allows you to edit the title of a post that has already been published.'>Edit Title</button>";
				$('#postTitleWrapper').html(txt);
			}
        
        	Posts.setContent(postObj.content);
	        		
	        $('#postTitle').val(postObj.title);
	        $('#postSlug').html(postObj.slug);
	        $('#postLastEdit').html(postObj.last_edit);
	        $('#postCreated').html(postObj.created);
			
			$('#number_comments').html("&nbsp;(" + postObj.noComments + ")");
			
	        $('#postStatusSelector').val(postObj.status);
	        //PostsFrame.refreshStatusSelectBox();
					
	        PostsFrame.updateViewPageLink(postObj.url);
	        
	        PostsFrame.updateTagsAndCategoris();
        }

    },

    // ////////////////////////////////////////////////////////////////////////////

	updateViewPageLink : function(url){
		$('#pageLink').attr('href', url);
	},

    // ////////////////////////////////////////////////////////////////////////////
/*	
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
*/	
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

        $('#postTag').autocomplete('destroy');		
        $('#postCategory').autocomplete('destroy');		

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
        BlogAPI.deletePost(ssMain.siteID, DataStore.m_currentPostID, PostsFrame.onPostDeleted);
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
        var content = oUtil.obj.getHTMLBody();
        var title = $('#postTitle').val() || $('#pageTitleDisplay').html();
        var status = $('#postStatusSelector').val();
        var canComment = $('#postCanCommentSelector').val();
        var slug = AthenaUtils.encodeSlug(postObj.title);
		
		// Check for changes, and only save if we detect a change
		if ((postObj.content != content) || (postObj.title != title) ||  (postObj.status != status) ||  (postObj.canComment != canComment)){

	        postObj.content = content;
	        postObj.title = title;
	        postObj.status = status;
	        postObj.canComment = canComment;
	        postObj.slug = slug;

	        DataStore.updatePost(postObj);
		    // Force an immediate save
		    DataStore.save();
		}
        
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

    // ////////////////////////////////////////////////////////////////////////////

    addTag : function(){
        var tag = $('#postTag').val();
        $('#postTag').val('');
        BlogAPI.addTag(ssMain.siteID, DataStore.m_currentPostID, tag, PostsFrame.onTagAdded);
    },

    onTagAdded : function(postObj, tags){		
        DataStore.updatePost(postObj);
        DataStore.m_tags = tags;						
        PostsFrame.repaint();
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    addCategory : function(){
        var cat = $('#postCategory').val();
        $('#postCategory').val('');
        BlogAPI.addCategory(ssMain.siteID, DataStore.m_currentPostID, cat, PostsFrame.onCategoryAdded);
    },
	
    onCategoryAdded : function(postObj, categories){	
        DataStore.updatePost(postObj);
        DataStore.m_categories = categories;
        PostsFrame.repaint();
    },
	
    // ////////////////////////////////////////////////////////////////////////////
	
    deleteCategory : function(cat){
        AthenaDialog.confirm("Are you sure you want to remove this tag from this post?", function(){
            BlogAPI.removeCategory(ssMain.siteID, DataStore.m_currentPostID, cat, PostsFrame.onCategoryDeleted);
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
            BlogAPI.removeTag(ssMain.siteID, DataStore.m_currentPostID, tag, PostsFrame.onTagDeleted);
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
        AthenaDialog.confirm("Are you sure you want to delete the tag '"+DataStore.m_tags[tagIndex]+"' for all your posts? This can not be undone!", function(){
            PostsFrame.onDoDeleteGlobalTag(tagIndex);
        });
    },

    onDoDeleteGlobalTag : function(tagIndex){
        BlogAPI.deleteTag(ssMain.siteID, DataStore.m_tags[tagIndex], PostsFrame.onGlobalTagDeleted);
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
        BlogAPI.deleteCategory(ssMain.siteID, DataStore.m_categories[catIndex], PostsFrame.onGlobalCategoryDeleted);
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
    },

    // ////////////////////////////////////////////////////////////////////////////
	
	onToggleTitle : function(){			
		var title = $('#pageTitleDisplay').html();
		AthenaDialog.confirm("As this post has been published, if you change the post title you will change the post's URL which can have a bad effect on the SEO for this post. This is really only an issue for posts that have been live for a while.<br/> <br/>By clicking ok, you will be able to edit the title and it will be saved automatically.", 
			function(){
				$('#postTitleWrapper').html("<input id='postTitle' type='text' value='"+title+"' class='apolloDataInput'/>");
				$('#postTitle').typing({ stop: ssMain.onDataChange, delay: 400});
			}
			);	
	}
}