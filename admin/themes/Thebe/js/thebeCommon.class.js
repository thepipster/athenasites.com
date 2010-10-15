/**
* Class to contain common operators
*/
var thebeCommon = {

	// //////////////////////////////////////////////////////////////////////////////

	/**
	* Do the common things!
	*/ 
	init : function(){		
	},
	
	// //////////////////////////////////////////////////////////////////////////////

	gotoGallery : function(no){
		try {
			if (cgpGallery){
				cgpGallery.gotoGallery(no)			
				return false;
			}
		}
		catch(e){
		}

		window.location = "gallery.html#gal" + no + "&img=1&play=true";
	},
		
	// //////////////////////////////////////////////////////////////////////////////
	
	isIE6 : function(){
		if ($.browser.msie && $.browser.version < 7) return true;
		return false;
	},
	
	
	// //////////////////////////////////////////////////////////////////////////////

	getHashPara : function(paraName, hash){

		if (hash.length > 1){
			var si = hash.indexOf(paraName);
	
			if (si != -1){
				si = si + paraName.length;
				return parseInt(hash.substring(si, si+2));
			}
		}
		
		return false;
	}

	// //////////////////////////////////////////////////////////////////////////////

	
}