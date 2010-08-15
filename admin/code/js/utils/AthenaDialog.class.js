/**
* Class for site-wide dialogs
*/
var AthenaDialog = {

	// ////////////////////////////////////////////////////////////////////////

	showLoading : function(msg){

		var txt = "";
		txt += "<div class='loading_box' style='position:relative; top:45%; width:200px; overflow:hidden' align='center'>";		
		txt += "    <img  src='"+defines.root_url+"images/loading_spinner.gif'/>";
		txt += "    <br/><span>" + msg + "</span>";
		txt += "</div>";
		
		$('#apollo_loading_display').html(txt);
		$('#apollo_loading_display').width($(window).width());
		$('#apollo_loading_display').height($(window).height());
		$('#apollo_loading_display').show();
	},

	// ////////////////////////////////////////////////////////////////////////

	clearLoading : function(){
		$('#apollo_loading_display').html("");
		$('#apollo_loading_display').hide();
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
	alert : function(msg){
		alert(msg);
	},
	
	// ////////////////////////////////////////////////////////////////////////

	confirm : function(msg, callback){
		if (confirm(msg)){
			callback();
		}
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