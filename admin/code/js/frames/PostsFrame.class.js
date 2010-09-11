/**
*
* 
* @since 16th, August 2010
*/
var PostsFrame = {

    ckEditor : '',
    ckEditorInstance : '',

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
		
        if (PostsFrame.ckEditor != ''){
            try {
                PostsFrame.ckEditor.destroy();
            //CKEDITOR.instances.postContentEditor.destroy();
            }
            catch(error){
                alert('could not destroy the CKEditor instance!' + error);
            }
            PostsFrame.ckEditor = '';
        }
				
        var post_id = DataStore.m_currentPostID;
				
        var txt = "";
	
        txt += "<div id='PostsFrameImagePicker'></div>";
		
        txt += "<table border='0' cellpadding='0' cellspacing='0' style='width:100%; height:100%;'>";

        txt += "<tr valign='top'>";
		
        txt += "    <td height='30px'>";
        txt += "        <div class='frameControlsBar'>";
        txt += "            <span class='label'>Title:</span>";
        txt += "            <input id='postTitle' type='text' value='"+postObj.title+"'/>";
        txt += "            <button class='basic_button' style='' onclick=\"ImagePickerDialog.show('#PagesFrameImagePicker', PostsFrame.onImageSelected);\">Insert Image</button>";
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
        txt += "                    <option value='Published'>Published</selected>";
        txt += "                    <option value='Draft'>Draft</selected>";
        txt += "                    <option value='Private'>Private</selected>";
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

        txt += "			<div class='postInfoLine'>";
        txt += "            <span class='postLabel'>Created:</span>";
        txt += "            <span class='postData' id='postCreated'>"+postObj.created+"</span>";
        txt += "			</div>";
				
        txt += "            </fieldset>";

        txt += "			<div align='right' style='padding-right:10px'>";
        txt += "			<button class='delete_button' onclick=\"PostsFrame.onDeletePost()\">Delete Post</button>";
        txt += "			<button class='save_button' onclick=\"PostsFrame.onSavePost()\">Save Changes</button>";
        txt += "			</div>";

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
				
        // Good article on customization of CKEditor - http://www.voofie.com/content/2/ckeditor-plugin-development/
        //PostsFrame.paintCKEditor();
        PostsFrame.paintOpenWYSIWYG();
		
        PostsFrame.updatePostLink(postObj);
        PostsFrame.updateTagsAndCategoris();
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    repaintData : function(postObj){
				
        //CKEDITOR.instances.postContentEditor.setData(postObj.content);
        /*
        $('#postContentEditorWrapper').html("");
        var txt = "<textarea id='postContentEditor' name='postContentEditor' class='innovaeditor' style='width:100%; height:100%;'>"+postObj.content+"</textarea>";
        $('#postContentEditor').html(txt);        
        PostsFrame.paintOpenWYSIWYG();
        */

        oUtil.obj.loadHTML(postObj.content);
        
	//PostsFrame.oEdit.loadHTML(postObj.content);
	
        $('#postTitle').val(postObj.title);
        $('#postSlug').html(postObj.slug);
        $('#postLastEdit').html(postObj.last_edit);
        $('#postCreated').html(postObj.created);
		
        $('#postStatusSelector').val(postObj.status);
				
        PostsFrame.updatePostLink(postObj);
        PostsFrame.updateTagsAndCategoris();
    },
		
    // ////////////////////////////////////////////////////////////////////////////

    updatePostLink : function(postObj){

        var blogPage = DataStore.getBlogPage();
        //alert(blogPage.title + " " + blogPage.status);
				
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
        var content = oUtil.obj.getHTML();

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

        var ht = $('#PostsFrame').innerHeight() - 150;

        var featuresObj = ["FullScreen","Preview","Print","Search",
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

        var groupsObj = [
            ["grpEdit", "Edit",
                ["Undo", "Redo", "SpellCheck", "RemoveFormat"]
            ],
            ["grpFont", "Font",
                ["FontName", "FontSize", "BRK", "Bold", "Italic", "Underline",
                 "Strikethrough","Superscript", "Subscript", "ForeColor", "BackColor"
                ]
            ],
            ["grpPara", "Paragraph",
                ["Paragraph", "Indent", "Outdent", "LTR", "RTL", "BRK", "JustifyLeft",
                 "JustifyCenter", "JustifyRight","JustifyFull", "Numbering", "Bullets"
                ]
            ],
            ["grpPage", "Page & View", ["Save", "Print", "Preview", "BRK", "FullScreen", "XHTMLSource"]],
            ["grpObjects", "Objects",
                ["Image", "Flash","Media", "CustomObject", "BRK","CustomTag", "Characters", "Line", "Form"]
            ],
            ["grpLinks", "Links", ["Hyperlink","InternalLink", "BRK", "Bookmark"]],
            ["grpTables", "Tables", ["Table", "BRK", "Guidelines"]],
            ["grpStyles", "Styles", ["StyleAndFormatting", "Styles", "BRK", "Absolute"]],
            ["grpCustom", "Custom", ["CustomName1","CustomName2", "BRK","CustomName3"]]
        ];

        oUtil.initializeEditor("#postContentEditor", {
            width:"100%",
            height:ht+"px",
            btnSpellCheck:true,
            useTagSelector:false,
            toolbarMode: 2,
            //arrCustomButtons: ["ButtonName1","alert('Command 1 here')","Caption 1","btnCustom.gif"],
            //features:featuresObj,
            //groups: groupsObj,
            css:"/admin/themes/cgp4/code/css/cms_blog.css"
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
//
//    paintCKEditor : function(){
//
//        PostsFrame.ckEditor = CKEDITOR.replace( 'postContentEditor',
//        {
//            height: $('#PostsFrame').innerHeight() - 150,
//
//            on :
//            {
//                instanceReady : function( ev )
//                {
//                    this.dataProcessor.writer.setRules( 'p',
//                    {
//                        indent : false,
//                        breakBeforeOpen : true,
//                        breakAfterOpen : false,
//                        breakBeforeClose : false,
//                        breakAfterClose : true
//                    });
//                }
//            },
//
//            // Note that we have added out "MyButton" button here.
//            //toolbar : [ [ 'Source', '-', 'Bold', 'Italic', 'Underline', 'Strike','-','Link', '-', 'MyButton' ] ]
//            toolbar : [
//            //		    ['Source','-','Save','NewPage','Preview','-','Templates'],
//            ['Source'],
//            ['Cut','Copy','Paste','PasteText','PasteFromWord','-','Print', 'SpellChecker', 'Scayt'],
//            ['Undo','Redo','-','Find','Replace','-','SelectAll','RemoveFormat'],
//            //		    ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'],
//            '/',
//            ['Bold','Italic','Underline','Strike','-','Subscript','Superscript'],
//            ['NumberedList','BulletedList','-','Outdent','Indent','Blockquote','CreateDiv'],
//            ['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
//            ['Link','Unlink','Anchor'],
//            //		    ['Image','Flash','Table','HorizontalRule','Smiley','SpecialChar','PageBreak'],
//            ['MyButton', 'Image', 'Table','HorizontalRule','Smiley','SpecialChar','PageBreak'],
//            '/',
//            //		    ['Styles','Format','Font','FontSize'],
//            ['Format','Font','FontSize'],
//            ['TextColor','BGColor'],
//            ['Maximize', 'ShowBlocks','-','About']
//            ]
//
//
//        });
//
////        PostsFrame.ckEditor.contentsCss = 'http://cgp.athena.local/admin/themes/cgp4/style.css';
//        //PostsFrame.ckEditor.contentsCss = 'http://cgp.athena.local/admin/themes/cgp4/code/blog.css';
//
//        //config.contentsCss = 'some/path/contents.css';
//    /*
//		var ret = PostsFrame.ckEditor.ui.addButton( 'MyButton', {
//								label : 'My Dialog',
//								click : function(){ImagePickerDialog.show('#PostsFrameImagePicker', PostsFrame.onImageSelected)},
//								icon: defines.root_url + 'images/insert_media_button.png'
//		});
//*/
//    },
//
    // ////////////////////////////////////////////////////////////////////////////
	
    onImageSelected : function(imageID){
        var img = DataStore.getImage(imageID);
        var txt = "<img src='"+img.file_url+"' alt='"+img.description+"' width='"+img.width+"px' height='"+img.height+"px'/>";
        //CKEDITOR.instances.postContentEditor.insertHtml(txt);
        oUtil.obj.insertHTML(txt);
    }

}