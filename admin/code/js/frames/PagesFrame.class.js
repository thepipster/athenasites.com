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
		var content = "";		
		var title = "";		
		var last_edit = "";		
		var created = "";		
		var created = "";		
		var status = "";		
		var template = "";		
		var slug = "";		
		
		if (pageObj != undefined && pageObj){
			content = pageObj.content;
			title = pageObj.title;
			last_edit = pageObj.last_edit;
			created = pageObj.created;
			status = pageObj.status;
			template = pageObj.template;
			slug = pageObj.slug;
		}
			
		var txt = "";
	
		txt += "<div id='PagesFrameImagePicker'></div>";		

		txt += "<table border='0' cellpadding='0' cellspacing='0' style='width:100%; height:100%;'>";

		txt += "<tr valign='top'>";
		
		txt += "	<td>";
		txt += "        <div style='margin-top:5px; margin-left:5px'>";
		txt += "		<textarea id='pageContentEditor' name='pageContentEditor' style='width:100%; height:100%;'>"+content+"</textarea>";
		txt += "	</div>";		
		txt += "	</td>";
							
		txt += "	<td width='250px' style='height:100%; padding:5px'>";
																
		txt += "		<div class='subframebox' style='height:100%;width:250px'>"		
		txt += "			<span class='title'>Page Settings</span>";																	

//		txt += "            <fieldset><legend>Publish</legend>";
		txt += "            <fieldset>";

		txt += "			<div class='pageInfoLine'>";
		txt += "            <span class='pageLabel'>Title:</span>";
		txt += "            <span class='pageData'><input type=text value='"+title+"'/></span>";
		txt += "			</div>";

		txt += "			<div class='pageInfoLine'>";
		txt += "            <span class='pageLabel'>Slug:</span>";
		txt += "            <span class='pageData'>"+slug+"</span>";
		txt += "			</div>";

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
		txt += "            <select>";
		txt += "                <option value='none'>(none)</selected>";
		for (var i=0; i<DataStore.m_pageList.length; i++){
			txt += "                <option value='"+DataStore.m_pageList[i].id+"'>"+DataStore.m_pageList[i].title+"</selected>";
		}
		txt += "            </select>";
		txt += "            </span>";
		txt += "			</div>";

		txt += "			<div class='pageInfoLine'>";
		txt += "            <span class='pageLabel'>Template:</span>";
		txt += "            <span class='pageData'>";
		txt += "            <select>";
		txt += "                <option value='43'>Template1</selected>";
		txt += "                <option value='45'>Template2</selected>";
		txt += "                <option value='45'>Template3</selected>";
		txt += "            </select>";
		txt += "            </span>";
		txt += "			</div>";

		txt += "			<div class='pageInfoLine'>";
		txt += "            <span class='pageLabel'>Order:</span>";
		txt += "            <span class='pageData'><input type=text size=5/></span>";
		txt += "			</div>";
		
		txt += "            </fieldset>";

		txt += "			<div align='right' style='padding-right:10px'>";
		txt += "			<button class='delete_button' onclick=\"PagesFrame.onDeletePage()\">Delete Page</button>";
		txt += "			<button class='save_button' onclick=\"PagesFrame.onSavePage()\">Save Changes</button>";
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
		alert('TBD');
	},
		
	// ////////////////////////////////////////////////////////////////////////////

	/**
	* Save all the users changes to the site
	*/
	onSavePage : function(){
		//var content = $('#pageContentEditor').html();
		var content = CKEDITOR.instances.pageContentEditor.getData();		
	},
		
	// ////////////////////////////////////////////////////////////////////////////
	
	paintCKEditor : function(){
		
		PagesFrame.ckEditor = CKEDITOR.replace( 'pageContentEditor',
			{
				height: $('#PagesFrame').innerHeight() - 150,
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

		PagesFrame.ckEditor.ui.addButton( 'MyButton', {
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