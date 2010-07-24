/**
* Javascript class that allows a user to pick an image from their wordpress media library
* @see http://www.eyecon.ro/ApolloParaPicker
*/
var ApolloParaPicker = {
	
	isGlobal : false,
	blogOrPostID : -1,
	themeParaID : -2,	
	paraValue : '',
	
	// ////////////////////////////////////////////////////////////////////////////

	onSetPageEmail : function(inputFieldDivID, themeParaID, pagePostID){
		
		ApolloParaPicker.isGlobal = false;
		ApolloParaPicker.blogOrPostID = pagePostID;
		ApolloParaPicker.themeParaID = themeParaID;
		ApolloParaPicker.paraValue = jQuery(inputFieldDivID).val();
		
		ApolloParaPicker.onSelect();
	},

	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	* Get the image list for the currently selected gallery page
	*/
	onSelect : function(){
	
		var paras = '';
			
		if (ApolloParaPicker.isGlobal){
			paras = {cmd: 5, blog_id: ApolloParaPicker.blogOrPostID, theme_para_id: ApolloParaPicker.themeParaID, para_value: ApolloParaPicker.paraValue};
		}
		else {
			paras = {cmd: 6, page_post_id: ApolloParaPicker.blogOrPostID, theme_para_id: ApolloParaPicker.themeParaID, para_value: ApolloParaPicker.paraValue};
		}
		//alert('Getting image list for page ' + EditGallery.m_galleryPageID + ' from ' + ApolloPlugin.commandURL);
												
		jQuery.ajax({
			url: ApolloPlugin.commandURL,
			dataType: "text",
			data: paras,
			success: function(ret){ApolloParaPicker.onColorSelected(ret);}
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
			
		jQuery('#apolloApolloParaPicker').dialog('close');		
	}
	
		
}

