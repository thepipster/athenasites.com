/**
* Javascript class that allows a user to pick an image from their wordpress media library
* @see http://www.eyecon.ro/ColorPickerDialog
*/
var ColorPickerDialog = {
	
	isGlobal : false,
	para1 : -1,
	themeParaID : -2,
		
	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	*
	* @param mode 'image' or 'favicon'
	* @param isGlobal true/false 
	* @param themeParaID the theme's parameter id
	* @param para1 'blog id' if isGlobal is true, otherwise this will be 'page_post_id' (the page we're setting the para for)
	*/
	show : function(isGlobal, themeParaID, para1, currentCol){
	
		ColorPickerDialog.isGlobal = isGlobal;
		ColorPickerDialog.para1 = para1;
		ColorPickerDialog.themeParaID = themeParaID;
		
		var targetDiv = '#ApolloImageSelector';

		var txt = "<div id='apolloSelectColor'></div>";
		//txt += "<button class='colorSelectButton' onclick=\"ColorPickerDialog.onSelectColor()\">OK</button>";
						
		ColorPickerDialog.col = currentCol;						
		jQuery(targetDiv).html(txt);					
		jQuery(targetDiv).dialog( 'destroy' );
//		jQuery('#apolloSelectColor').ColorPicker({color: currentCol, flat: true, onSubmit: ColorPickerDialog.onSelectColor(), onChange: function(hsb, hex, rgb, el) {ColorPickerDialog.col = hex;}});					
		jQuery('#apolloSelectColor').ColorPicker({color: currentCol, flat: true, onSubmit: function(hsb, hex, rgb, el) {ColorPickerDialog.onSelectColor(hex);}});					
		jQuery(targetDiv).dialog({modal: true, width:385, height:235, resizable:false, title: 'Pick a color' });
		
	},

	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	* Get the image list for the currently selected gallery page
	*/
	onSelectColor : function(col){
		
		var paras = '';
			
		if (ColorPickerDialog.isGlobal){
			paras = {cmd: 5, blog_id: ColorPickerDialog.para1, theme_para_id: ColorPickerDialog.themeParaID, para_value: col};
		}
		else {
			paras = {cmd: 6, page_post_id: ColorPickerDialog.para1, theme_para_id: ColorPickerDialog.themeParaID, para_value: col};
		}
		//alert('Getting image list for page ' + EditGallery.m_galleryPageID + ' from ' + ApolloPlugin.commandURL);
		
		//alert(ImagePickerData.commandURL);
			
		jQuery.ajax({
			url: ImagePickerData.commandURL,
			dataType: "text",
			data: paras,
			success: function(ret){ColorPickerDialog.onColorSelected(ret);}
		});	
			
	},
	
	// ////////////////////////////////////////////////////////////////////////////
	
	onColorSelected : function(ret){
	
		eval("var msg = ("+ret+")");
					
		if (msg.result != "ok"){
			alert('error!');		
		}
		else {
			// Force a page reload
			window.location.href=window.location.href
		}
			
		jQuery('#apolloColorPickerDialog').dialog('close');		
	}
	
		
}

