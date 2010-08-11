/**
*
* 
* @since 27th July, 2010
*/
var PagesFrame = {

	ckEditor : '',
		
	// ////////////////////////////////////////////////////////////////////////////

	init : function(){
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	repaint : function(){
	
				
		if (PagesFrame.ckEditor != ''){
			try {			
				PagesFrame.ckEditor.destroy();
				//CKEDITOR.instances.pageContentEditor.destroy();
			}
			catch(error){
				alert('could not destroy the CKEditor instance!' + error);
			}
			PagesFrame.ckEditor = '';
		}
			
		var pageObj = DataStore.getCurrentPage();
		
		var parent_page = "";		
		var content = "";		
		var title = "";		
		var last_edit = "";		
		var created = "";		
		var created = "";		
		var status = "";		
		var template = "";		
		var slug = "";		
		var order = "";		
		var path = "";		
		var parent_page_id = "";	
		var template = "";
		var page_id = DataStore.m_currentPageID;

		if (pageObj.parent_page_id != 0){
			var parentPage = DataStore.getPage(pageObj.parent_page_id);
		}
		
		if (pageObj != undefined && pageObj){
			content = pageObj.content;
			title = pageObj.title;
			last_edit = pageObj.last_edit;
			created = pageObj.created;
			status = pageObj.status;
			template = pageObj.template;
			slug = pageObj.slug;
			order = pageObj.order;
			path = pageObj.path;
			parent_page_id = pageObj.parent_page_id;
			template = pageObj.template;
		}
			
		var txt = "";
	
		txt += "<div id='PagesFrameImagePicker'></div>";		
		
		txt += "<table border='0' cellpadding='0' cellspacing='0' style='width:100%; height:100%;'>";

		txt += "<tr valign='top'>";
		
		txt += "	<td>";
		//txt += "        <div class='frame_control_bar'>";
		//txt += "            <button class='basic_button' style='position:absolute; top:50px; left:700px'>Insert Image</button>";
		//txt += "        </div>";
		txt += "        <div style='margin-top:5px; margin-left:5px'>";
		txt += "		    <textarea id='pageContentEditor' name='pageContentEditor' style='width:100%; height:100%;'>"+content+"</textarea>";
		txt += "	    </div>";		
		txt += "	</td>";
							
		txt += "	<td width='250px' style='height:100%; padding:5px'>";
																
		txt += "		<div class='subframebox' style='height:100%;width:250px'>"		
		txt += "			<span class='title'>Page Settings</span>";																	

//		txt += "            <fieldset><legend>Publish</legend>";
		txt += "            <fieldset>";

		txt += "			<div class='pageInfoLine'>";
		txt += "            <span class='pageLabel'>Title:</span>";
		txt += "            <span class='pageData'><input id='pageTitle' type=text value='"+title+"'/></span>";
		txt += "			</div>";

		txt += "			<div class='pageInfoLine'>";
		txt += "            <span class='pageLabel'>Slug:</span>";
		txt += "            <span class='pageData'>"+slug+"</span>";
		txt += "			</div>";
/*
		txt += "			<div class='pageInfoLine'>";
		txt += "            <span class='pageLabel'>Path:</span>";
		txt += "            <span class='pageData'>"+path+"</span>";
		txt += "			</div>";
*/
		txt += "			<div class='pageInfoLine'>";
		txt += "            <span class='pageLabel'>Status:</span>";
		txt += "            <span class='pageData'>";
		
		txt += "            <select id='pageStatusSelector'>";
		txt += "                <option value='Published'>Published</selected>";
		txt += "                <option value='Draft'>Draft</selected>";
		txt += "                <option value='Private'>Private</selected>";
		txt += "            </select>";
		txt += "            </span>";
		txt += "			</div>";

		txt += "			<div class='pageInfoLine'>";
		txt += "            <span class='pageLabel'>Last Edit:</span>";
		txt += "            <span class='pageData'>"+last_edit+"</span>";
		txt += "			</div>";

		txt += "			<div class='pageInfoLine'>";
		txt += "            <span class='pageLabel'>Created:</span>";
		txt += "            <span class='pageData'>"+created+"</span>";
		txt += "			</div>";

		txt += "			<div class='pageInfoLine'>";
		txt += "            <span class='pageLabel'>Parent Page:</span>";
		txt += "            <span class='pageData'>";
		txt += "            <select id='pageParent' >";
		txt += "                <option value='0'>(none)</selected>";
		for (var i=0; i<DataStore.m_pageList.length; i++){
			
			var isChild = DataStore.isChildOff(page_id, DataStore.m_pageList[i].id);
			
//			if (DataStore.m_pageList[i].id != page_id || !DataStore.isChildOff(page_id, DataStore.m_pageList[i].id)){
			if (DataStore.m_pageList[i].id != page_id && !isChild){
				if (DataStore.m_pageList[i].id == parent_page_id){
					txt += "                <option value='"+DataStore.m_pageList[i].id+"' selected>"+DataStore.m_pageList[i].title+"</selected>";
				}
				else {
					txt += "                <option value='"+DataStore.m_pageList[i].id+"'>"+DataStore.m_pageList[i].title+"</selected>";
				}
			}
		}
		txt += "            </select>";
		txt += "            </span>";
		txt += "			</div>";

		txt += "			<div class='pageInfoLine'>";
		txt += "            <span class='pageLabel'>Template:</span>";
		txt += "            <span class='pageData'>";
		txt += "            <select id='pageTemplate' >";
		txt += "                <option value=''>(none)</selected>";

		for (var i=0; i<DataStore.m_templateList.length; i++){
			if (DataStore.m_templateList[i].template_file == template){
				txt += "                <option value='"+DataStore.m_templateList[i].template_file+"' selected>"+DataStore.m_templateList[i].template_name+"</selected>";
			}
			else {
				txt += "                <option value='"+DataStore.m_templateList[i].template_file+"'>"+DataStore.m_templateList[i].template_name+"</selected>";
			}
		}

		txt += "            </select>";
		txt += "            </span>";
		txt += "			</div>";

		txt += "			<div class='pageInfoLine'>";
		txt += "            <span class='pageLabel'>Order:</span>";
		txt += "            <span class='pageData'><input id='pageOrder' type=text size=5 value='"+order+"'/></span>";
		txt += "			</div>";
		
		txt += "            </fieldset>";

		txt += "			<div align='right' style='padding-right:10px'>";
		txt += "			<button class='delete_button' onclick=\"PagesFrame.onDeletePage()\">Delete Page</button>";
		txt += "			<button class='save_button' onclick=\"PagesFrame.onSavePage('"+DataStore.m_currentPageID+"')\">Save Changes</button>";
		txt += "			</div>";


		txt += "		</div>";											
			
		txt += "	</td>";
		txt += "</tr>";

		txt += "</table>";
	
		
		$('#PagesFrame').html(txt);

		if (status != ''){
			$('#pageStatusSelector').val(status);
		}
		
		
		// Good article on customization of CKEditor - http://www.voofie.com/content/2/ckeditor-plugin-development/		
		PagesFrame.paintCKEditor();

	},

	// ////////////////////////////////////////////////////////////////////////////

	/**
	* Delete the page!
	*/
	onDeletePage : function(){
		AthenaDialog.confirm("Are you sure you want to delete this page?", function(){PagesFrame.onDoDelete();});		
	},
	
	onDoDelete : function(){
		MediaAPI.deletePage(DataStore.m_siteID, DataStore.m_currentPageID, PagesFrame.onPageDeleted);
	},
	
	onPageDeleted : function(page_id){
		DataStore.deletePage(page_id);
		if (DataStore.m_pageList.length > 0){
			DataStore.m_currentPageID = DataStore.m_pageList[0].id;
		}
		else {
			DataStore.m_currentPageID = 0;
		}
		PagesFrame.repaint();
		PagesSidebarFrame.repaint();		
	},
		
	// ////////////////////////////////////////////////////////////////////////////

	/**
	* Save all the users changes to the site
	*/
	onSavePage : function(page_id){
			
		var originalPage = DataStore.getPage(page_id);
		
		//var content = $('#pageContentEditor').html();
		var content = CKEDITOR.instances.pageContentEditor.getData();		
		
		var title = $('#pageTitle').val();		
		var status = $('#pageStatusSelector').val();		
		var parent_id = $('#pageParent').val();		
		var template = $('#pageTemplate').val();		
		var order = $('#pageOrder').val();		
		var pageDepth = DataStore.getPageDepth(DataStore.m_currentPageID);
		var slug = PagesSidebarFrame.encodeSlug(title) + '.html';
		//var path = DataStore.getPagePath();
		var ishome = 0;	
			
		// Check what the new max depth would be.....
		
		// Need to get the root page for this branch
		
		var old_parent_id = originalPage.parent_page_id;
		originalPage.parent_page_id = parent_id;
		DataStore.updatePage(originalPage);
		
		try {
			//var newDepth = DataStore.getPageDepth(rootPage.id);
			var newDepth = DataStore.getMaxDepth();
		}
		catch (e){
			var newDepth = 99;		
		}
		
		// Revert the original back
		originalPage.parent_page_id = old_parent_id;
		DataStore.updatePage(originalPage);
				
		if (newDepth > DataStore.m_theme.max_page_depth){
			AthenaDialog.alert("Sorry, your theme does not support page depths of more than 3, please choose another parent page!");
			return;
		}
						
		MediaAPI.updatePage(DataStore.m_siteID, DataStore.m_currentPageID, title, content, status, template, parent_id, slug, order, ishome, PagesFrame.onPageSaved)
				
	},
	
	onPageSaved : function(pageObj){
		DataStore.updatePage(pageObj);
		PagesFrame.repaint();
		PagesSidebarFrame.repaint();
	},

	// ////////////////////////////////////////////////////////////////////////////

	saveChildPages : function(){
	},
				
	// ////////////////////////////////////////////////////////////////////////////
	
	paintCKEditor : function(){
		
		PagesFrame.ckEditor = CKEDITOR.replace( 'pageContentEditor',
			{
				height: $('#PagesFrame').innerHeight() - 150,
		/*		
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
         */
			
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
						    ['Styles','Format','Font','FontSize'],
						    ['TextColor','BGColor'],
						    ['Maximize', 'ShowBlocks','-','About']
						]
				
				
		});

		var ret = PagesFrame.ckEditor.ui.addButton( 'MyButton', {
								label : 'My Dialog', 
								click : function(){ImagePickerDialog.show('#PagesFrameImagePicker', PagesFrame.onImageSelected)}, 
								icon: defines.root_url + 'images/insert_media_button.png' 
		});
		
	},
		
	// ////////////////////////////////////////////////////////////////////////////
	
	onImageSelected : function(imageID){
		var img = DataStore.getImage(imageID);
		var txt = "<img src='"+img.file_url+"' alt='"+img.description+"' width='"+img.width+"px' height='"+img.height+"px'/>";
		CKEDITOR.instances.pageContentEditor.insertHtml(txt);
	}

}