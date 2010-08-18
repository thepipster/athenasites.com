/**
*
* 
* @since 16th, August 2010
*/
var PostsFrame = {

	ckEditor : '',
	ckEditorInstance : '',
	
	painted : false,
		
	// ////////////////////////////////////////////////////////////////////////////

	init : function(){
		//PostsFrame.painted = false;
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	repaint : function(){
	
		var postObj = DataStore.getCurrentPost();
		
		var post_id = DataStore.m_currentPostID;
		
		if (postObj == undefined || !postObj){				
			postObj = new Object();
			postObj.id = '';
			postObj.title = '';
			postObj.content = '';
			postObj.last_edit = '';
			postObj.created = '';
			postObj.status = '';
			postObj.slug = '';
			postObj.canComment = '';
			postObj.tags = '';
			postObj.categories = '';
		}
			
			
		if (!PostsFrame.painted){
			PostsFrame.fullRepaint(postObj);
			PostsFrame.painted = true;
		}
		else {
			PostsFrame.repaintData(postObj);
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
		
		txt += "	<td>";
		txt += "        <div style='margin-top:5px; margin-left:5px'>";
		txt += "		    <textarea id='postContentEditor' name='postContentEditor' style='width:100%; height:100%;'>"+postObj.content+"</textarea>";
		txt += "	    </div>";		
		txt += "	</td>";
							
		txt += "	<td width='250px' style='height:100%; padding:5px'>";
																
		txt += "		<div class='subframebox' style='height:100%;width:250px'>"		
				
		txt += "			<span class='title'>Post Settings</span>";																	

		txt += "            <fieldset>";

		txt += "			<div class='postInfoLine'>";
		txt += "            <span class='postLabel'>Title:</span>";
		txt += "            <span class='postData'><input id='postTitle' type=text value='"+postObj.title+"'/></span>";
		txt += "			</div>";

		txt += "			<div class='postInfoLine'>";
		txt += "            <span class='postLabel'>Slug:</span>";
		txt += "            <span class='postData' id='postSlug'>"+postObj.slug+"</span>";
		txt += "			</div>";

		txt += "			<div class='postInfoLine'>";
		txt += "            <span class='postLabel'>Status:</span>";
		txt += "            <span class='postData'>";																
		txt += "            <select id='postStatusSelector'>";
		txt += "                <option value='Published'>Published</selected>";
		txt += "                <option value='Draft'>Draft</selected>";
		txt += "                <option value='Private'>Private</selected>";
		txt += "            </select>";
		txt += "            </span>";
		txt += "			</div>";

		txt += "			<div class='postInfoLine'>";
		txt += "            <span class='postLabel'>Allow Comments:</span>";
		txt += "            <span class='postData'>";																
		txt += "            <select id='postCanCommentSelector'>";
		txt += "                <option value='1' selected>Yes</selected>";
		txt += "                <option value='0'>No</selected>";
		txt += "            </select>";
		txt += "            </span>";
		txt += "			</div>";
		
		txt += "			<div class='postInfoLine'>";
		txt += "            <span class='postLabel'>Last Edit:</span>";
		txt += "            <span class='postData' id='postLastEdit'>"+postObj.last_edit+"</span>";
		txt += "			</div>";

		txt += "			<div class='postInfoLine'>";
		txt += "            <span class='postLabel'>Created:</span>";
		txt += "            <span class='postData' id='postCreated'>"+postObj.created+"</span>";
		txt += "			</div>";
		

		txt += "			<div class='postInfoLine'>";
		txt += "            <span class='postLabel'>Categories:</span>";
		txt += "            <span class='postData' id='postCategories'>"+postObj.categories+"</span>";
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
		txt += "                <div id='apollo_post_categories'></div>"

		txt += "                <p><strong>Categories</strong></p>";
		txt += "			    <div class='postInfoLine'>";
		txt += "                    <span class='postData' id='postCategories'><input id='postCategory' type='text' value=''/></span>";
		txt += "                    <span class='postLabel'><button class='basic_button' onclick='PostsFrame.addCategory()';>Add</button></span>";
		txt += "			    </div>";
		txt += "                <div id='apollo_post_tags'></div>";
		
		txt += "            </fieldset>";

		txt += "		</div>";											
			
		txt += "	</td>";
		txt += "</tr>";

		txt += "</table>";
					
		$('#PostsFrame').html(txt);		

		if (postObj.status != ''){
			$('#postStatusSelector').val(postObj.status);
		}	
				
		// Good article on customization of CKEditor - http://www.voofie.com/content/2/ckeditor-plugin-development/		
		PostsFrame.paintCKEditor();
		
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	repaintData : function(postObj){
				
		CKEDITOR.instances.postContentEditor.setData(postObj.content);		
		
		$('#postTitle').val(postObj.title);
		$('#postSlug').html(postObj.slug);
		$('#postLastEdit').html(postObj.last_edit);
		$('#postCreated').html(postObj.created);
		
		$('#postStatusSelector').val(postObj.status);
		$('#postParent').val(postObj.parent_post_id);
		$('#postTemplate').val(postObj.template);
		$('#postOrder').val(postObj.order);
		
		//PostsFrame.updateStatusColor();
	},
		
	// ////////////////////////////////////////////////////////////////////////////

	/**
	* Delete the post!
	*/
	onDeletePost : function(){
		AthenaDialog.confirm("Are you sure you want to delete this post?", function(){PostsFrame.onDoDelete();});		
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
						
		var content = CKEDITOR.instances.postContentEditor.getData();				
		var title = $('#postTitle').val();		
		var status = $('#postStatusSelector').val();		
		var canComment = $('#postCanCommentSelector').val();
		var slug = PagesSidebarFrame.encodeSlug(title) + '.html';
			
		MediaAPI.updatePost(DataStore.m_siteID, DataStore.m_currentPostID, title, content, status, canComment, slug, PostsFrame.onPostSaved)
				
	},
	
	onPostSaved : function(postObj){
		DataStore.updatePost(postObj);
		PostsFrame.repaint();
		PagesSidebarFrame.repaint();
	},

	// ////////////////////////////////////////////////////////////////////////////

	addTag : function(){
		var tag = $('#postTag').val();
		MediaAPI.addTag(DataStore.m_siteID, DataStore.m_currentPostID, tag, PostsFrame.onTagAdded);
	},

	onTagAdded : function(post_id, tag){
		alert('tag ' + tag + ' added!');
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	addCategory : function(){
		var cat = $('#postCategory').val();
		MediaAPI.addCategory(DataStore.m_siteID, DataStore.m_currentPostID, cat, PostsFrame.onCategoryAdded);
	},
	
	onCategoryAdded : function(post_id, category){
		alert('category ' + category + ' added!');
	},
	
	// ////////////////////////////////////////////////////////////////////////////
	
	paintCKEditor : function(){
		
		PostsFrame.ckEditor = CKEDITOR.replace( 'postContentEditor',
			{
				height: $('#PostsFrame').innerHeight() - 150,
				
			     on :
			      {
			         instanceReady : function( ev )
			         {
			            this.dataProcessor.writer.setRules( 'p',
			               {
			                  indent : false,
			                  breakBeforeOpen : true,
			                  breakAfterOpen : false,
			                  breakBeforeClose : false,
			                  breakAfterClose : true
			               });
			         }
			       },         
			
				// Note that we have added out "MyButton" button here.
				//toolbar : [ [ 'Source', '-', 'Bold', 'Italic', 'Underline', 'Strike','-','Link', '-', 'MyButton' ] ]
				toolbar : [
				//		    ['Source','-','Save','NewPage','Preview','-','Templates'],
						    ['Source'],
						    ['Cut','Copy','Paste','PasteText','PasteFromWord','-','Print', 'SpellChecker', 'Scayt'],
						    ['Undo','Redo','-','Find','Replace','-','SelectAll','RemoveFormat'],
				//		    ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'],
						    '/',
						    ['Bold','Italic','Underline','Strike','-','Subscript','Superscript'],
						    ['NumberedList','BulletedList','-','Outdent','Indent','Blockquote','CreateDiv'],
						    ['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
						    ['Link','Unlink','Anchor'],
				//		    ['Image','Flash','Table','HorizontalRule','Smiley','SpecialChar','PageBreak'],
						    ['MyButton', 'Image', 'Table','HorizontalRule','Smiley','SpecialChar','PageBreak'],
						    '/',
				//		    ['Styles','Format','Font','FontSize'],
						    ['Format','Font','FontSize'],
						    ['TextColor','BGColor'],
						    ['Maximize', 'ShowBlocks','-','About']
						]
				
				
		});

		var ret = PostsFrame.ckEditor.ui.addButton( 'MyButton', {
								label : 'My Dialog', 
								click : function(){ImagePickerDialog.show('#PostsFrameImagePicker', PostsFrame.onImageSelected)}, 
								icon: defines.root_url + 'images/insert_media_button.png' 
		});
		
	},
		
	// ////////////////////////////////////////////////////////////////////////////
	
	onImageSelected : function(imageID){
		var img = DataStore.getImage(imageID);
		var txt = "<img src='"+img.file_url+"' alt='"+img.description+"' width='"+img.width+"px' height='"+img.height+"px'/>";
		CKEDITOR.instances.postContentEditor.insertHtml(txt);
	}

}