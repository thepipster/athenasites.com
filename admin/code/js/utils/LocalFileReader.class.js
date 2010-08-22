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
/*
		var w = 80;
		var h = 22;
		
		var text = "";
		text += "   <div style=''> \n";
		text += "      <object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0' width='"+w+"' height='"+h+"' id='flashObject' align='middle'> \n";
		text += "         <param name='allowScriptAccess' value='sameDomain' /> \n";
		text += "         <param name='movie' value='"+flash_url+"' /> \n";
		text += "         <param name='quality' value='high' /> \n";
		text += "         <param name='bgcolor' value='#ffffff' /> \n";
		text += "         <embed src='"+flash_url+"' quality='high' bgcolor='#ffffff' width='"+w+"' height='"+h+"' name='flashObject' align='middle' allowScriptAccess='sameDomain' type='application/x-shockwave-flash' pluginspage='http://www.macromedia.com/go/getflashplayer' /> \n";
		text += "      </object> \n";
		text += "   </div>	 \n";		
		
		$(targetDiv).html(text);		
		
		if(navigator.appName.indexOf('Microsoft') != -1) {
			LocalFileReader.flash = window.flashObject;
		}
		else {
			LocalFileReader.flash = window.document.flashObject;
		}		
		*/
		
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