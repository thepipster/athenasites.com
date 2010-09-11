/**
*
* 
* @since 16th, August 2010
*/
var PostsFrame = {

    oEdit : '',

    painted : false,
		
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

        //var postObj = DataStore.getCurrentPost();
        								
        if (!PostsFrame.painted){
            //(postObj);
            PostsFrame.painted = true;
            MediaAPI.getPostDetails(DataStore.m_siteID, DataStore.m_currentPostID, PostsFrame.fullRepaint);
        }
        else {
            //PostsFrame.repaintData(postObj);
            MediaAPI.getPostDetails(DataStore.m_siteID, DataStore.m_currentPostID, PostsFrame.repaintData);
        }
								
    },

    // ////////////////////////////////////////////////////////////////////////////

    fullRepaint : function(postObj){
						
        var post_id = DataStore.m_currentPostID;
				
        var txt = "";
	
        txt += "<div id='PostsFrameImagePicker'></div>";
		
        txt += "<table border='0' cellpadding='0' cellspacing='0' style='width:100%; height:100%;'>";

        txt += "<tr valign='top'>";
		
        txt += "    <td height='30px'>";
        txt += "        <div class='frameControlsBar'>";
        txt += "            <span class='label'>Title:</span>";
        txt += "            <input id='postTitle' type='text' value='"+postObj.title+"'/>";
        //txt += "            <button class='basic_button' style='' onclick=\"ImagePickerDialog.show('#PostsFrameImagePicker', PostsFrame.onImageSelected);\">Insert Image</button>";
        txt += "            <a id='postLink' href='' style='font-size:10px'></a>";
        txt += "        </div>";
        txt += "    </td>";
											
        txt += "    <td rowspan='2' width='250px' style='height:100%; padding:5px'>";
																
        txt += "	<div class='subframebox' style='height:100%;width:250px'>"
				
        txt += "	    <span class='title'>Post Settings</span>";

        txt += "            <fieldset>";

        txt += "	    <div class='postInfoLine'>";
        txt += "                <span class='postLabel'>Slug:</span>";
        txt += "                <span class='postData' id='postSlug'>"+postObj.slug+"</span>";
        txt += "	    </div>";


        txt += "	    <div class='postInfoLine'>";
        txt += "                <span class='postLabel'>Status:</span>";
        txt += "                <span class='postData'>";
        txt += "                <select id='postStatusSelector'>";
        txt += "                    <option value='Published' class=''>Published</selected>";
        txt += "                    <option value='Draft' class=''>Draft</selected>";
        txt += "                    <option value='Private' class=''>Private</selected>";
        txt += "                </select>";
        txt += "                </span>";
        txt += "	    </div>";

        txt += "	   <div class='postInfoLine'>";
        txt += "            <span class='postLabel'>Allow Comments:</span>";
        txt += "            <span class='postData'>";
        txt += "            <select id='postCanCommentSelector'>";
        txt += "                <option value='1' selected>Yes</selected>";
        txt += "                <option value='0'>No</selected>";
        txt += "            </select>";
        txt += "            </span>";
        txt += "	    </div>";
		
        txt += "	    <div class='postInfoLine'>";
        txt += "            <span class='postLabel'>Last Edit:</span>";
        txt += "            <span class='postData' id='postLastEdit'>"+postObj.last_edit+"</span>";
        txt += "	    </div>";

        txt += "            <div class='postInfoLine'>";
        txt += "                <span class='postLabel'>Created:</span>";
        txt += "                <span class='postData' id='postCreated'>"+postObj.created+"</span>";
        txt += "            </div>";
				
        txt += "            <div class='postInfoLine'>";
        txt += "                <span class='postLabel'>Controls:</span>";
        txt += "                    <button class='save_button' onclick=\"PostsFrame.onSavePost()\">Save</button>";
        txt += "                    <button class='delete_button' onclick=\"PostsFrame.onDeletePost()\">Delete</button>";
        txt += "            </div>";

        txt += "            <div class='postInfoLine'>";
        txt += "                <span class='postLabel'>Tools:</span>";
        txt += "                    <button class='basic_button' onclick=\"PostsFrame.paintTools()\">Import Posts</button>";
        txt += "            </div>";


        txt += "            </fieldset>";

        txt += "            <fieldset>";
		
        txt += "                <p><strong>Tags</strong></p>";
        txt += "			    <div class='postInfoLine'>";
        txt += "                    <span class='postData' id='postTags'><input id='postTag' type='text' value=''/></span>";
        txt += "                    <span class='postLabel'><button class='basic_button' onclick='PostsFrame.addTag();'>Add</button></span>";
        txt += "			    </div>";
        txt += "                <div id='apollo_post_tags'></div>";

        txt += "                <p><strong>Categories</strong></p>";
        txt += "			    <div class='postInfoLine'>";
        txt += "                    <span class='postData' id='postCategories'><input id='postCategory' type='text' value=''/></span>";
        txt += "                    <span class='postLabel'><button class='basic_button' onclick='PostsFrame.addCategory()';>Add</button></span>";
        txt += "			    </div>";
        txt += "                <div id='apollo_post_categories'></div>"
		
        txt += "            </fieldset>";

        txt += "		</div>";
			
        txt += "	</td>";
        txt += "</tr>";


        txt += "<tr valign='top'>";
        txt += "	<td>";
        txt += "        <div id='postContentEditorWrapper' style='margin-top:5px; margin-left:5px' align='left'>";
        //txt += "<iframe>";
        //txt += "<link type='text/css' rel='Stylesheet' href='http://cgp.athena.local/admin/themes/cgp4/code/blog.css' />";
        //txt += "<form method='post' action='default_toolbar2.php' id='Form1'>";
        txt += "    <textarea id='postContentEditor' name='postContentEditor' class='innovaeditor' style='width:100%; height:100%;'>"+postObj.content+"</textarea>";
        //txt += "    <script> var oEdit1 = new InnovaEditor(\"oEdit1\"); oEdit1.REPLACE(\"postContentEditor\"); </script>";
        //txt += "</form>";
        //txt += "</iframe>";
        txt += "	    </div>";
        txt += "	</td>";
        txt += "</tr>";

        txt += "</table>";
					
        $('#PostsFrame').html(txt);

        if (postObj.status != ''){
            $('#postStatusSelector').val(postObj.status);
        }
        //PostsFrame.refreshStatusSelectBox();
				
        PostsFrame.paintOpenWYSIWYG();
		
        PostsFrame.updatePostLink(postObj);
        PostsFrame.updateTagsAndCategoris();
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    repaintData : function(postObj){
				
        //CKEDITOR.instances.postContentEditor.setData(postObj.content);  
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
    },

    // ////////////////////////////////////////////////////////////////////////////


    paintTools : function(){

        var txt = "";

        //txt += "<div class='subframebox'>";
        //txt += "    <span class='title'>Tools</span>";
        //txt += "    <fieldset>";
        //txt += "    <legend>Import Blog Posts</legend>";
        txt += "    <button class='basic_button' onclick='WordpressImporter.show()'>Wordpress</button><br/>";
        txt += "    <button class='basic_button' onclick=''>Blogger</button><br/>";
        txt += "    <button class='basic_button' onclick='LiveJournalImporter.show()'>Livejournal</button><br/>";
        //txt += "    </fieldset>";
        //txt += "</div>"

        //$('#apollo_site_tools_content').html(txt);
        AthenaDialog.alert(txt, "Import Posts");
    },

    // ////////////////////////////////////////////////////////////////////////////

    updatePostLink : function(postObj){

        var blogPage = DataStore.getBlogPage();
				
        if (!blogPage || blogPage == undefined){
            AthenaDialog.alert("You do not have a blog page for your site yet. You can add one using the pages tab. You can continue to create blog posts, but they will not be visible to users", "No Blog Page!");
            $('#postLink').html("");
        }
        else {
            if (blogPage.status != 'Published'){
                AthenaDialog.alert("Your blog page is not public, therefore visitors to your site will not be able to see your blog. You can change your blog pages status using the Pages tab", "Blog Page is not public!");
            }
		
            var blogslug = blogPage.path + blogPage.slug;
            blogslug = blogslug.substring(0, blogslug.length-5); // Strip .html
            $('#postLink').html("View Post");
            $('#postLink').attr('href', 'http://' + defines.domain + blogslug + postObj.path + postObj.slug);
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
		
        var post = DataStore.getPost(DataStore.m_currentPostID);
			
        var txt = "";
        var onclick = "";
        for (var i=0; i<post.tags.length; i++){
            onclick = "PostsFrame.deleteTag(\""+post.tags[i]+"\")";
            txt += "<div class='postTagCatLine'><span class='postTagCat'>"+post.tags[i]+"</span><span class='postRemoveTagCat' onclick='"+onclick+"'></span></div>";
        }
        $('#apollo_post_tags').html(txt);

        txt = "";
        for (var i=0; i<post.categories.length; i++){
            onclick = "PostsFrame.deleteCategory(\""+post.categories[i]+"\")";
            txt += "<div class='postTagCatLine'><span class='postTagCat'>"+post.categories[i]+"</span><span class='postRemoveTagCat' onclick='"+onclick+"'></span></div>";
        }
        $('#apollo_post_categories').html(txt);

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
        var content = oUtil.obj.getXHTMLBody();

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

    paintOpenWYSIWYG : function(){
        
        //WYSIWYG.attach('#postContentEditor');
        //alert('sdgsdg');
        //var oEdit1 = new InnovaEditor("oEdit1");
        //oEdit1.REPLACE("postContentEditor");

        var ht = $('#PostsFrame').innerHeight();

        //        var featuresObj = ["FullScreen","Preview","Print","Search",
        //"Cut","Copy","Paste","PasteWord","PasteText","|","Undo","Redo","|",
        //"ForeColor","BackColor","|","Bookmark","Hyperlink","XHTMLSource","BRK",
        //"Numbering","Bullets","|","Indent","Outdent","LTR","RTL","|",
        //"Image","Flash","Media","|","Table","Guidelines","Absolute","|",
        //"Characters","Line","Form","RemoveFormat","ClearAll","BRK",
        //"StyleAndFormatting","TextFormatting","ListFormatting","BoxFormatting",
        //"ParagraphFormatting","CssText","Styles","|",
        //"Paragraph","FontName","FontSize","|",
        //"Bold","Italic","Underline","Strikethrough","|",
        //"JustifyLeft","JustifyCenter","JustifyRight","JustifyFull"];
        //
        var groupsObj = [
        ["grpPage", "Page & View", ["FullScreen", "XHTMLSource", "Search", "BRK", "Undo", "Redo", "SpellCheck", "RemoveFormat"]],
        ["grpFont", "Font",
        ["FontName", "FontSize", "Strikethrough", "Superscript", "Subscript", "BRK",
        "Bold", "Italic", "Underline", "ForeColor", "BackColor"
        ]
        ],
        ["grpStyles", "Styles", ["Table", "Guidelines", "BRK",  "StyleAndFormatting", "Styles"]], //"Absolute"
        ["grpPara", "Paragraph",
        ["Paragraph", "Indent", "Outdent", "LTR", "RTL", "BRK", "JustifyLeft",
        "JustifyCenter", "JustifyRight","JustifyFull", "Numbering", "Bullets"
        ]
        ],
        ["grpObjects", "Objects", ["Image", "InsertInternalImage", "Flash", "Media", "BRK", "Hyperlink", "Characters", "Line",  "ApolloPageBreak"]]
        ];

        oUtil.initializeEditor("#postContentEditor", {
            width:"100%",
            height:ht+"px",
            btnSpellCheck:true,
            useTagSelector:false,
            toolbarMode: 2,
            useBR:true, // Force to use <br> for line breaks by default
            arrCustomButtons: [
            ["InsertInternalImage","ImagePickerDialog.show('#PostsFrameImagePicker', PostsFrame.onImageSelected)","Insert an image from your media library", "btnInternalImage.gif"],
            ["ApolloPageBreak","PostsFrame.onInsertPageBreak()","Insert a more link into your blog post", "btnApolloPageBreak.png"]],
            //features:featuresObj,
            groups: groupsObj,
            css: DataStore.m_theme.cms_blog_css
        });
    /*
oUtil.obj.features=["FullScreen","Preview","Print","Search",
"Cut","Copy","Paste","PasteWord","PasteText","|","Undo","Redo","|",
"ForeColor","BackColor","|","Bookmark","Hyperlink","XHTMLSource","BRK",
"Numbering","Bullets","|","Indent","Outdent","LTR","RTL","|",
"Image","Flash","Media","|","Table","Guidelines","Absolute","|",
"Characters","Line","Form","RemoveFormat","ClearAll","BRK",
"StyleAndFormatting","TextFormatting","ListFormatting","BoxFormatting",
"ParagraphFormatting","CssText","Styles","|",
"Paragraph","FontName","FontSize","|",
"Bold","Italic","Underline","Strikethrough","|",
"JustifyLeft","JustifyCenter","JustifyRight","JustifyFull"];
*/
    },

    // ////////////////////////////////////////////////////////////////////////////

    /**
     * Insert a custom apollo page break
     */
    onInsertPageBreak : function(){

        // Has the user already got a apollo page break in this page?
        var content = oUtil.obj.getXHTMLBody();
        var myRegExp = /apolloPageBreak/;
        var pos = content.search(myRegExp);

        if (pos > 0){
            AthenaDialog.alert("Sorry, you already have a break in this post and you can only have one, you'll need to delete the old one before you can add one here!", "Can't add more than 1 break");
            return;
        }
        
        var txt = "<div class='apolloPageBreak'>More...</div> ";
        oUtil.obj.insertHTML(txt);
    },

    // ////////////////////////////////////////////////////////////////////////////

    onImageSelected : function(imageID){
        var img = DataStore.getImage(imageID);
        var txt = "<img src='"+img.file_url+"' alt='"+img.description+"' width='"+img.width+"px' height='"+img.height+"px'/>";
        oUtil.obj.insertHTML(txt);
    }

}