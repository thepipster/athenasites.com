/**
*
* 
* @since 27th July, 2010
*/
var PagesFrame = {

	ckEditor : '',
	ckEditorInstance : '',
	
	painted : false,
		
	// ////////////////////////////////////////////////////////////////////////////

	init : function(){
		//PagesFrame.painted = false;
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	repaint : function(){
	
		if (DataStore.m_pageList.length == 0){
			AthenaDialog.alert("You currently have no pages, you can add a post using the side-bar");	
			return;	
		}

		var pageObj = DataStore.getCurrentPage();
					
		if (!PagesFrame.painted){
			PagesFrame.fullRepaint(pageObj);
			PagesFrame.painted = true;
		}
		else {
			PagesFrame.repaintData(pageObj);
		}
								
	},

	// ////////////////////////////////////////////////////////////////////////////

	fullRepaint : function(pageObj){
		
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
				
		var page_id = DataStore.m_currentPageID;
	
		var txt = "";
	
		txt += "<div id='PagesFrameImagePicker'></div>";		
		
		txt += "<table border='0' cellpadding='0' cellspacing='0' style='width:100%; height:100%;'>";

		txt += "<tr valign='top'>";
		
		txt += "	<td height='30px'>";
		txt += "        <div class='frameControlsBar'>";
		txt += "            <span class='label'>Title:</span>";
		txt += "            <input id='pageTitle' type='text' value='"+pageObj.title+"'/>";
		txt += "            <button class='basic_button' style='' onclick=\"ImagePickerDialog.show('#PagesFrameImagePicker', PagesFrame.onImageSelected);\">Insert Image</button>";
//		txt += "            <button class='basic_button' style='' onclick=\"\">View Page</button>";
		txt += "        </div>";
		txt += "	</td>";
							
		txt += "	<td rowspan='2' width='250px' style='height:100%; padding:5px'>";
																
		txt += "		<div class='subframebox' style='height:100%;width:250px'>"		
				
		txt += "			<span class='title'>Page Settings</span>";																	

		txt += "            <fieldset>";
/*
		txt += "			<div class='pageInfoLine'>";
		txt += "            <span class='pageLabel'>Title:</span>";
		txt += "            <span class='pageData'><input id='pageTitle' type=text value='"+pageObj.title+"'/></span>";
		txt += "			</div>";
*/
/*
		txt += "			<div class='pageInfoLine'>";
		txt += "            <span class='pageLabel'>Slug:</span>";
		txt += "            <span class='pageData' id='pageSlug'>"+pageObj.slug+"</span>";
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
		txt += "            <span class='pageData' id='pageLastEdit'>"+pageObj.last_edit+"</span>";
		txt += "			</div>";

		txt += "			<div class='pageInfoLine'>";
		txt += "            <span class='pageLabel'>Created:</span>";
		txt += "            <span class='pageData' id='pageCreated'>"+pageObj.created+"</span>";
		txt += "			</div>";

		txt += "			<div class='pageInfoLine'>";
		txt += "            <span class='pageLabel'>Parent Page:</span>";
		txt += "            <span class='pageData' id='parentPageContents'></span>";
		txt += "			</div>";

		txt += "			<div class='pageInfoLine'>";
		txt += "            <span class='pageLabel'>Template:</span>";
		txt += "            <span class='pageData'>";
		txt += "            <select id='pageTemplate' onchange=\"PagesFrame.paintThemeParas()\">";
		txt += "                <option value=''>(none)</selected>";

		for (var i=0; i<DataStore.m_templateList.length; i++){
			if (DataStore.m_templateList[i].template_file == pageObj.template){
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
		txt += "            <span class='pageLabel'>Menu Order:</span>";
//		txt += "            <span class='pageData'><input id='pageOrder' type=text size=5 value='"+pageObj.order+"'/></span>";
		txt += "                                <span class='pageData'>";
		txt += "            <select id='pageOrder'>";
		for (var i=0; i<50; i++){
			txt += "            <option value='"+i+"'>"+i+"</selected>";
		}
		txt += "                        </select>";
		txt += "                        </span>";
		
		txt += "			</div>";
		
		txt += "            </fieldset>";

		txt += "			<div align='right' style='padding-right:10px'>";
		txt += "			<button class='delete_button' onclick=\"PagesFrame.onDeletePage()\">Delete Page</button>";
		txt += "			<button class='save_button' onclick=\"PagesFrame.onSavePage()\">Save Changes</button>";
		txt += "			</div>";

		txt += "            <fieldset>";
		txt += "                <div id='apollo_page_theme_paras'></div>"
		txt += "            </fieldset>";

		txt += "		</div>";											
			
		txt += "	</td>";
		
		txt += "<tr valign='top'>";
		txt += "	<td>";
		txt += "        <div style='margin-top:5px; margin-left:5px;'>";
		txt += "		    <textarea id='pageContentEditor' name='pageContentEditor' style='width:100%; height:100%;'>"+pageObj.content+"</textarea>";
		txt += "	    </div>";		
		txt += "	</td>";
		txt += "</tr>";
		
		txt += "</tr>";

		txt += "</table>";
					
		$('#PagesFrame').html(txt);		

		if (pageObj.status != ''){
			$('#pageStatusSelector').val(pageObj.status);
		}	
		
		//PagesFrame.updateStatusColor();
		
		// Paint the parent pages...
		PagesFrame.paintParentPages(pageObj);
		
		// Good article on customization of CKEditor - http://www.voofie.com/content/2/ckeditor-plugin-development/		
		PagesFrame.paintCKEditor();
		
		PagesFrame.paintThemeParas();
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	repaintData : function(pageObj){
				
		CKEDITOR.instances.pageContentEditor.setData(pageObj.content);		
		
		$('#pageTitle').val(pageObj.title);
		$('#pageSlug').html(pageObj.slug);
		$('#pageLastEdit').html(pageObj.last_edit);
		$('#pageCreated').html(pageObj.created);
		
		$('#pageStatusSelector').val(pageObj.status);
		$('#pageParent').val(pageObj.parent_page_id);
		$('#pageTemplate').val(pageObj.template);
		$('#pageOrder').val(pageObj.order);
		
		//PagesFrame.updateStatusColor();
				
		// Paint the parent pages...
		PagesFrame.paintParentPages(pageObj);
					
		PagesFrame.paintThemeParas();
						
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	updateStatusColor : function(){
				
		var status = $('#pageStatusSelector').val();
		
		$('#pageStatusSelector').removeClass('status_draft');
		$('#pageStatusSelector').removeClass('status_private');
		$('#pageStatusSelector').removeClass('status_public');
		
		switch (status){
			case 'Draft': $('#pageStatusSelector').addClass('status_draft'); break;
			case 'Private': $('#pageStatusSelector').addClass('status_private'); break;
			case 'Published': $('#pageStatusSelector').addClass('status_public'); break;
		}
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	/**
	* Paint any special theme paras associated with the chosen template
	*/
	paintThemeParas : function(){
	
		var template_name = $('#pageTemplate').val();
		var theme_para_list = DataStore.getPageThemeParas(template_name);
				
		var txt = "";

		if (theme_para_list.length > 0){
			txt += "<p><strong>Custom Parameters</strong></p>";
			txt += "<table border='0' width='100%'>";
		}
	
		var noParas = 0;
			
		for (var i=0; i<theme_para_list.length; i++){
			
			var paraVal = DataStore.getSiteParaValue(DataStore.m_currentPageID, theme_para_list[i].id);
			var para_html = '';			
				
										
			// 'email','image','gallery','font-family','favicon','font-size','color','text','small-int','multi-gallery'
			switch(theme_para_list[i].para_type){
			
				case 'image': 

					onclick = "PagesFrame.selectImagePara("+theme_para_list[i].id+")"; 
										
					txt += "<table border='0'>";							
					txt += "<tr valign='top'>";										
					txt += "    <td width='40px'>";					
					var image_url = '';
					if (paraVal){
						var image = DataStore.getImage(parseInt(paraVal));
						if (image){image_url = image.thumb_url}
					}
					txt += "<img src='"+image_url+"' class='thumbBox' width='30px' height='30px' onclick=\""+onclick+"\" >";
					txt += "    </td>";	
					
					txt += "    <td>";					
					txt += "        <span class='paraTitle'>"+theme_para_list[i].description+"</span>";
					txt += "        <span class='paraDesc'>"+theme_para_list[i].help_text+"</span>";
					//txt += "        <button class='save_button' onclick=\""+onclick+"\" style='font-size:10px'>Change</button>";
					txt += "    </td>";	
					txt += "</tr>";					
					txt += "</table>";
					
					noParas++;
					
					break;

				case 'color': 
				
					onclick = "PagesFrame.selectColorPara("+theme_para_list[i].id+", '"+paraVal+"')"; 
									
					txt += "<table border='0'>";							
					txt += "<tr valign='top'>";										
					txt += "    <td width='40px'>";					
					txt += "        <div class='colorBox' style='background-color:#"+paraVal+";' onclick=\""+onclick+"\"></div>";
					txt += "    </td>";	
					
					txt += "    <td>";					
					txt += "        <span class='paraTitle'>"+theme_para_list[i].description+"</span>";
					txt += "        <span class='paraDesc'>"+theme_para_list[i].help_text+"</span>";
					txt += "    </td>";	
					txt += "</tr>";					
					txt += "</table>";

					noParas++;
									
					break;
				
				case 'email': break;
				case 'text': break;
				case 'small-int': break;
				case 'font-family': break;
				case 'font-size': break;
				
				case 'favicon':
				case 'multi-gallery':
				case 'gallery': break;
			}


		}
		
		if (theme_para_list.length > 0){
			txt += "</table><br/>";
		}
		
		if (noParas > 0)
			$('#apollo_page_theme_paras').html(txt);
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	m_themeParaID : 0,
	
	selectColorPara : function(themeParaID, paraVal){
		PagesFrame.m_themeParaID = themeParaID;
		ColorPickerDialog.show('#PagesFrameImagePicker', paraVal, PagesFrame.onParaSelected)
	},
	
	selectImagePara : function(themeParaID){
		PagesFrame.m_themeParaID = themeParaID;
		ImagePickerDialog.show('#PagesFrameImagePicker', PagesFrame.onParaSelected)
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	onParaSelected : function(newParaVal){
		MediaAPI.setPagePara(PagesFrame.m_themeParaID, newParaVal, PagesFrame.onPagesParaChanged);
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	onPagesParaChanged : function(theme_para_id, new_value, page_id){
		//location.href = location.href;
		DataStore.updateSitePara(theme_para_id, page_id, new_value);
		PagesFrame.repaint();
	},
	
	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	* Paint the parent pages. Do not allow a user to select a parent page that is itself or
	* one of its own children 
	*/
	paintParentPages : function(pageObj){
	
		var page_id = DataStore.m_currentPageID;
		
		var txt = '';
		txt += "<select id='pageParent' >";
		txt += "    <option value='0'>(none)</selected>";
		
		for (var i=0; i<DataStore.m_pageList.length; i++){
			
			var isChild = DataStore.isChildOff(page_id, DataStore.m_pageList[i].id);
			//var isChild = false;
			
			if (DataStore.m_pageList[i].id != pageObj.id && !isChild){
				if (DataStore.m_pageList[i].id == pageObj.parent_page_id){
					txt += "    <option value='"+DataStore.m_pageList[i].id+"' selected>"+DataStore.m_pageList[i].title+"</selected>";
				}
				else {
					txt += "    <option value='"+DataStore.m_pageList[i].id+"'>"+DataStore.m_pageList[i].title+"</selected>";
				}
			}
		}
		txt += "</select>";	
		
		$('#parentPageContents').html(txt);
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
	onSavePage : function(){
			
		var page_id = DataStore.m_currentPageID;
			
		var originalPage = DataStore.getPage(page_id);
		
		//var content = $('#pageContentEditor').html();
		var content = CKEDITOR.instances.pageContentEditor.getData();		
		
		var title = $('#pageTitle').val();		
		var status = $('#pageStatusSelector').val();		
		var parent_id = $('#pageParent').val();		
		var template = $('#pageTemplate').val();		
		var order = $('#pageOrder').val();		
		var pageDepth = DataStore.getPageDepth(DataStore.m_currentPageID);
		var slug = AthenaUtils.encodeSlug(title);
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
				
		if ((originalPage.parent_page_id != parent_id) && (newDepth > DataStore.m_theme.max_page_depth)){
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
		/*
		var ret = PagesFrame.ckEditor.ui.addButton( 'MyButton', {
								label : 'My Dialog', 
								click : function(){ImagePickerDialog.show('#PagesFrameImagePicker', PagesFrame.onImageSelected)}, 
								icon: defines.root_url + 'images/insert_media_button.png' 
		});
		*/
	},
		
	// ////////////////////////////////////////////////////////////////////////////
	
	onImageSelected : function(imageID){
		var img = DataStore.getImage(imageID);
		var txt = "<img src='"+img.file_url+"' alt='"+img.description+"' width='"+img.width+"px' height='"+img.height+"px'/>";
		CKEDITOR.instances.pageContentEditor.insertHtml(txt);
	}

}