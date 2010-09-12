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
			
        if (DataStore.m_postList.length == 0){
            AthenaDialog.alert("<div class='noContent'>You currently have no posts, you can add a post using the side-bar</div>");
            return;
        }

        MediaAPI.getPostDetails(DataStore.m_siteID, DataStore.m_currentPostID, PostsFrame.repaintData);
								
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    repaintData : function(postObj){

        PostsFrame.postObj = '';
        PostsFrame.postObj = postObj;

        $('#postSettings').show();
        $('#pageSettings').hide();

        oUtil.obj.css = DataStore.m_theme.cms_blog_css;
        oUtil.obj.loadHTML(postObj.content);
        
        //PostsFrame.oEdit.loadHTML(postObj.content);
	
        $('#pageTitle').val(postObj.title);
        $('#postSlug').html(postObj.slug);
        $('#postLastEdit').html(postObj.last_edit);
        $('#postCreated').html(postObj.created);
		
        $('#postStatusSelector').val(postObj.status);
        //PostsFrame.refreshStatusSelectBox();
				
        PostsFrame.updatePostLink(postObj);
        PostsFrame.updateTagsAndCategoris();

    },

    // ////////////////////////////////////////////////////////////////////////////


    paintTools : function(){

        var txt = "";

        txt += "<p>This tool allows you to import blog posts, comments and followers from other blogging engines.</p>";
        txt += "<p>To get started, click on the button below that corresponds to the blog you want to import from.</p>";
        txt += "<br/>";
        txt += "<div align='center'>";
        txt += "    <button class='basic_button' onclick='WordpressImporter.show()'>Wordpress</button>";
        txt += "    <button class='basic_button' onclick=''>Blogger</button>";
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
            AthenaDialog.alert("You do not have a blog page for your site yet. You can add one using the pages tab. You can continue to create blog posts, but they will not be visible to users", "No Blog Page!");
            $('#pageLink').html("");
        }
        else {
            if (blogPage.status != 'Published'){
                AthenaDialog.alert("Your blog page is not public, therefore visitors to your site will not be able to see your blog. You can change your blog pages status using the Pages tab", "Blog Page is not public!");
            }
		
            var blogslug = blogPage.path + blogPage.slug;
            blogslug = blogslug.substring(0, blogslug.length-5); // Strip .html
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
	* Save all the users changes to the site
	*/
    onSavePost : function(){
						
        //var content = CKEDITOR.instances.postContentEditor.getData();
        var content = PostsFrame.m_editor.getXHTMLBody();

        var title = $('#postTitle').val();
        var status = $('#postStatusSelector').val();
        var canComment = $('#postCanCommentSelector').val();
        var slug = AthenaUtils.encodeSlug(title);
        MediaAPI.updatePost(DataStore.m_siteID, DataStore.m_currentPostID, title, content, status, canComment, slug, PostsFrame.onPostSaved)
				
    },
	
    onPostSaved : function(postObj){
        DataStore.updatePost(postObj);
        PostsFrame.repaint();
        PostsSidebarFrame.repaint();
    },

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
//
//    paintOpenWYSIWYG : function(readyCallback){
//
//
//        var ht = $('#PostsFrame').innerHeight();
//
//        var groupsObj = [
//        ["grpPage", "Page & View", ["FullScreen", "XHTMLSource", "Search", "BRK", "Undo", "Redo", "SpellCheck", "RemoveFormat"]],
//        ["grpFont", "Font",
//        ["FontName", "FontSize", "Strikethrough", "Superscript", "Subscript", "BRK",
//        "Bold", "Italic", "Underline", "ForeColor", "BackColor"
//        ]
//        ],
//        ["grpStyles", "Styles", ["Table", "Guidelines", "BRK",  "StyleAndFormatting", "Styles"]], //"Absolute"
//        ["grpPara", "Paragraph",
//        ["Paragraph", "Indent", "Outdent", "LTR", "RTL", "BRK", "JustifyLeft",
//        "JustifyCenter", "JustifyRight","JustifyFull", "Numbering", "Bullets"
//        ]
//        ],
//        ["grpObjects", "Objects", ["Image", "InsertInternalImage", "Flash", "Media", "BRK", "Hyperlink", "Characters", "Line",  "ApolloPageBreak"]]
//        ];
//
//        oUtil.initializeEditor("#postContentEditor", {
//            id: 1,
//            width:"100%",
//            height:ht+"px",
//            btnSpellCheck:true,
//            useTagSelector:false,
//            toolbarMode: 2,
//            mode:"XHTML",
//            useBR:true, // Force to use <br> for line breaks by default
//            arrCustomButtons: [
//            ["InsertInternalImage","ImagePickerDialog.show('#PostsFrameImagePicker', PostsFrame.onImageSelected)","Insert an image from your media library", "btnInternalImage.gif"],
//            ["ApolloPageBreak","PostsFrame.onInsertPageBreak()","Insert a more link into your blog post", "btnApolloPageBreak.png"]],
//            //features:featuresObj,
//            groups: groupsObj,
//            css: DataStore.m_theme.cms_blog_css
//        });
//
//        //PostsFrame.getEditorObj(readyCallback);
//           //  PostsFrame.m_editor = new InnovaEditor("PostsFrame.m_editor");
//        //setTimeout(PostsFrame.test, 1000);
//    },

    // ////////////////////////////////////////////////////////////////////////////
//
//    test : function(){
//             PostsFrame.m_editor.REPLACE("postContentEditor");
//    },
//
//    m_editor : false,
//
//    /**
//     * Get a handle to the embedded wyswig editor, and when we have it execute the callback
//     */
//    getEditorObj : function(callback){
//        if (oUtil.obj == undefined || !oUtil.obj){
//            setTimeout(function(){PostsFrame.getEditorObj(callback);}, 100);
//        }
//        else {
//            alert(oUtil.oName);
//            PostsFrame.m_editor = oUtil.obj;
//            if (callback != undefined){
//                callback();
//            }
//        }
//    },
//
//
//    // ////////////////////////////////////////////////////////////////////////////
//
//    /**
//     * Insert a custom apollo page break
//     */
//    onInsertPageBreak : function(){
//
//        // Has the user already got a apollo page break in this page?
//        var content = oUtil.obj.getXHTMLBody();
//        var myRegExp = /apolloPageBreak/;
//        var pos = content.search(myRegExp);
//
//        if (pos > 0){
//            AthenaDialog.alert("Sorry, you already have a break in this post and you can only have one, you'll need to delete the old one before you can add one here!", "Can't add more than 1 break");
//            return;
//        }
//
//        var txt = "<div class='apolloPageBreak'>More...</div> ";
//        oUtil.obj.insertHTML(txt);
//    },
//
//    // ////////////////////////////////////////////////////////////////////////////
//
//    onImageSelected : function(imageID){
//        var img = DataStore.getImage(imageID);
//        var txt = "<img src='"+img.file_url+"' alt='"+img.description+"' width='"+img.width+"px' height='"+img.height+"px'/>";
//        oUtil.obj.insertHTML(txt);
//    }

}