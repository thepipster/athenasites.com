/**
* Javascript class that allows a common source of dialog's throughout
*
* @since 27th March, 2010
*/
var ApolloDialog = {
	
	init : function(){
		if (jQuery('#apollo_dialog').attr('id') != 'apollo_dialog'){
			jQuery(document).append("<div id='apollo_dialog'></div>");
		}
	},
	
	// ////////////////////////////////////////////////////////////////////

	error : function(msg){

		// Setup if we need to
		if (jQuery('#apollo_dialog').attr('id') != 'apollo_dialog'){
			jQuery("#ApolloContentWrapper").append("<div id='apollo_dialog'></div>");
		}
				
		jQuery('#apollo_dialog').dialog("destroy");
				
		jQuery('#apollo_dialog').html(msg);
		
		jQuery('#apollo_dialog').dialog({resizable: false, height:140, modal: true, title: "Error"});
	},
	
	// ////////////////////////////////////////////////////////////////////

	alert : function(msg){
	
		// Setup if we need to
		if (jQuery('#apollo_dialog').attr('id') != 'apollo_dialog'){
			jQuery("#ApolloContentWrapper").append("<div id='apollo_dialog'></div>");
		}
				
		jQuery('#apollo_dialog').dialog("destroy");
				
		jQuery('#apollo_dialog').html(msg);
		
		jQuery('#apollo_dialog').dialog({resizable: false, height:140, modal: true, title: "Error"});
	},
	
	// ////////////////////////////////////////////////////////////////////
		
	confirm : function(msg, onOKCallback, onCancelCallback){
		
		// Setup if we need to
		if (jQuery('#apollo_dialog').attr('id') != 'apollo_dialog'){
			jQuery("#ApolloContentWrapper").append("<div id='apollo_dialog'></div>");
		}
				
		jQuery('#apollo_dialog').dialog("destroy");
				
		jQuery('#apollo_dialog').html(msg);
		
		jQuery('#apollo_dialog').dialog({
			resizable: false,
			height:140,
			modal: true,
			title: "Confirm",
			buttons: {
				Ok: function() {
					jQuery(this).dialog('close'); if (onOKCallback) onOKCallback();
				},
				Cancel: function() {
					jQuery(this).dialog('close'); if (onCancelCallback) onCancelCallback();
				}
			}
		})
		
				
	},

	// ////////////////////////////////////////////////////////////////////

	showLoading : function(msg){

		// Check out http://www.chimply.com/Generator for great loading spinners
		
		// Setup if we need to
		if (jQuery('#apollo_dialog').attr('id') != 'apollo_dialog'){
			jQuery("#ApolloContentWrapper").append("<div id='apollo_dialog'></div>");
		}
		
		jQuery('#apollo_dialog').dialog("destroy");
				

		if (msg != undefined){
			jQuery('#apollo_dialog').html("<div align='center' class='apollo_loading_div'><br/>"+msg+"</div>");
		}
		else {
			jQuery('#apollo_dialog').html("<div class='apollo_loading_div'></div>");
		}
		
		jQuery('#apollo_dialog').dialog({
			resizable: false,
			disabled: true,
			draggable: false,
			closeOnEscape: false,
			closeText: 'hide',			
			height: 30,
			width: 'auto',
			modal: true,
			title: "Loading...",
		})
				
		//jQuery("#ApolloContentWrapper").html("<div class='apollo_loading_div'></div>");
	},

	// ////////////////////////////////////////////////////////////////////

	hideLoading : function(){
		jQuery('#apollo_dialog').dialog("destroy");
	},

	// ////////////////////////////////////////////////////////////////////
/*
	globalEmailParaSet : function(themeParaID, blogId, currentVal, descText, helpText){
	},
*/	
	// ////////////////////////////////////////////////////////////////////

	globalParaSet : function(paraType, themeParaID, blogId, currentVal, descText, helpText){
		
		// Setup if we need to
		if (jQuery('#apollo_dialog').attr('id') != 'apollo_dialog'){
			jQuery("#ApolloContentWrapper").append("<div id='apollo_dialog'></div>");
		}
				
		if (currentVal == 'default') currentVal = '';
				
		jQuery('#apollo_dialog').dialog("destroy");
				
		var txt = "";
		txt += "<p>" + helpText + "</p>";
				
		if (paraType == 'small_int'){
			var onkey = "";
			onkey += "var newVal = parseInt(this.value);"; 			
			onkey += "if (newVal >= 0 && newVal <= 100){";
			onkey += "	this.value = newVal;";
			onkey += "	jQuery('#global_set_error').html('');";
			onkey += "}"; 
			onkey += "else if (newVal > 100){";
			onkey += "	this.value = 100;";
			onkey += "	jQuery('#global_set_error').html('Must be 100 or less!');";
			onkey += "}"; 
			onkey += "else {";
			onkey += "	this.value = '';";
			onkey += "	jQuery('#global_set_error').html('Must be a valid number, from 0 to 100!');";
//			onkey += "	setTimeout(function(){jQuery('#global_set_error').hide()}, 5000);";
			onkey += "}";
			txt += "<input id='global_set_para' type='text' value='"+currentVal+"' onKeyUp=\""+onkey+"\"/>";			
		}
		else if (paraType == 'text'){
			txt += "<textarea id='global_set_para' style='width:100%; height:150px'>"+currentVal+"</textarea>";
		}
		else if (paraType == 'email'){
			txt += "<input id='global_set_para' type='text' value='"+currentVal+"' />";			
		}
		txt += "<p id='global_set_error' style='color:red'></p>";
			
								
		jQuery('#apollo_dialog').html(txt);
		
		var dialogTitle = descText;
		
		jQuery('#apollo_dialog').dialog({
			resizable: false,
			height: 350,
			modal: true,
			title: dialogTitle,
			buttons: {
				Save: function() {
				
					if (paraType == 'email'){
						var filter = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
						var emailVal = jQuery('#global_set_para').val();

						if (!filter.test(emailVal)) {
							jQuery('#global_set_error').html('Must be a valid email!');
							return false;
						}
						else {
							jQuery('#global_set_error').html('');
						}
					}
					
					jQuery(this).dialog('close');
										
					var paraVal = jQuery('#global_set_para').val();					
					var paras = {cmd: 5, blog_id: blogId, theme_para_id: themeParaID, para_value: paraVal};
																						
					jQuery.ajax({
						url: ImagePickerData.commandURL,
						dataType: "json",
						data: paras,
						success: function(ret){ if(ret.result = 'ok'){window.location.href=window.location.href;}}
					});	
					
				},
				Cancel: function() {
					jQuery(this).dialog('close'); if (onCancelCallback) onCancelCallback();
				}
			}
		});
		
	},
		
	// ////////////////////////////////////////////////////////////////////
	
	textEntry : function(msg, onDoneCallback, onCancelCallback){
	}
	
	// ////////////////////////////////////////////////////////////////////
	
}