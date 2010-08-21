/**
* Class for site-wide dialogs
*/
var AthenaDialog = {

	// ////////////////////////////////////////////////////////////////////////

	showLoading : function(msg){

/*		
		var txt = "";
		txt += "<div class='loading_box' style='position:relative; top:45%; width:200px; overflow:hidden' align='center'>";		
		txt += "    <img  src='"+defines.root_url+"images/loading_spinner.gif'/>";
		txt += "    <br/><span>" + msg + "</span>";
		txt += "</div>";

		$('#apollo_loading_display').html(txt);
		$('#apollo_loading_display').width($(window).width());
		$('#apollo_loading_display').height($(window).height());
		$('#apollo_loading_display').show();
*/


		jQuery('#apollo_dialog').dialog("destroy");
				
		jQuery('#apollo_dialog').html("<div align='center'><img src='"+defines.root_url+"images/spinner.gif'/></div>");
		
		jQuery('#apollo_dialog').dialog({
			resizable: true,
			height:70,
			width: 250,
		 closeOnEscape: false,
			modal: true,
			title: msg
		})
		
	},

	// ////////////////////////////////////////////////////////////////////////

	clearLoading : function(){
		//$('#apollo_loading_display').html("");
		//$('#apollo_loading_display').hide();
		jQuery('#apollo_dialog').dialog("destroy");
	},

	// ////////////////////////////////////////////////////////////////////

	error : function(msg){

		jQuery('#apollo_dialog').dialog("destroy");
				
		jQuery('#apollo_dialog').html(msg);
		
		jQuery('#apollo_dialog').dialog({resizable: false, height:140, modal: true, title: "Error"});
	},
	
	// ////////////////////////////////////////////////////////////////////////

	/**
	* Display a info message to the user
	*/
	message : function(msg){
		//alert(msg);
	},
	
	// ////////////////////////////////////////////////////////////////////////

	/**
	* Display an alert to the user
	*/
	alert : function(msg, msgTitle){
		
		if (msgTitle == undefined){
			msgTitle = "Message";
		}
		
		jQuery('#apollo_dialog').dialog("destroy");
				
		jQuery('#apollo_dialog').html(msg);
		
		jQuery('#apollo_dialog').dialog({
			resizable: false,
//			height:140,
			modal: true,
			title: msgTitle,
			buttons: {
				Ok: function() {
					jQuery(this).dialog('close');
				}
			}
		})
	},
	
	// ////////////////////////////////////////////////////////////////////////

	confirm : function(msg, onOKCallback, onCancelCallback){
				
		jQuery('#apollo_dialog').dialog("destroy");
				
		jQuery('#apollo_dialog').html(msg);
		
		jQuery('#apollo_dialog').dialog({
			resizable: false,
			height:140,
			modal: true,
			title: "Confirm",
			buttons: {
				Cancel: function() {
					jQuery(this).dialog('close'); if (onCancelCallback) onCancelCallback();
				},
				Ok: function() {
					jQuery(this).dialog('close'); if (onOKCallback) onOKCallback();
				}
			}
		})
		
	},
		
	// ////////////////////////////////////////////////////////////////////////
	
	showAjaxError : function(ret){
		
		if (ret.data != undefined){
			alert(ret.result + '\n' + ret.data);
		}
		else {
			alert(ret.data);
		}
		
	}
}