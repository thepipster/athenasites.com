/**
* Class for site-wide dialogs
*/
var AthenaDialog = {

	// ////////////////////////////////////////////////////////////////////////

	showLoading : function(msg){
		$('#sync_spinner').html("<img height='12xpx' src='/images/loading_spinner.gif'/>");
	},

	// ////////////////////////////////////////////////////////////////////////

	clearLoading : function(){
		$('#sync_spinner').html("");
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