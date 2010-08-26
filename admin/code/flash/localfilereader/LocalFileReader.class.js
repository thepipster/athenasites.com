/**
* Javascript interface to the Flash LocalFileReader.swf that allows the Javascript to read the contents of 
* a file from the users local file system
*
* @author Mike Pritchard (mike@apollosites.com)
* @since 22nd August, 2010
*/
var LocalFileReader = {
	
	// ////////////////////////////////////////////////////////////////////////
	
	paint : function(targetDiv){
	
		var flash_url = defines.code_url + "flash/LocalFileReader.swf";

		var flashvars = {};
		var params = {
		  bgcolor: "#ffffff",
		  quality: "high",
		  menu: "false",
		  allowScriptAccess: "sameDomain"
		};
		var attributes = {
		  id: "localFileReader",
		  name: "localFileReader"
		};
		
		swfobject.embedSWF(flash_url, targetDiv, "80", "22", "10.0.0","expressInstall.swf", flashvars, params, attributes);
		
	},

	// ////////////////////////////////////////////////////////////////////////

	onFileSelected : function(name, size, type){
		LocalFileReader.onMessage(name + " " + size + "kb " + type);	
	},

	onProgress : function(bytes, total){
		LocalFileReader.onMessage(bytes + " / " + total);	
	},

	onLoaded : function(content){
		$('#fileContents').html(content);
	},
	
	// ////////////////////////////////////////////////////////////////////////

	onMessage : function(msg){
		$('#msg').append(msg + "<br>");
	},

	onError : function(msg){
		$('#msg').append("<span style='color:red'>"+msg + "</span><br>");
	}
	
	// ////////////////////////////////////////////////////////////////////////
	
}