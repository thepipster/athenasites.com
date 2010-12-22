/**
 * Common utils
 * 
 * @author Mike Pritchard
 * @since February 1st, 2009
 */
Utils = {

	/**
	* 
	*/
	roundCorners : function(div){

		if (!$.browser.msie){

			if ($.browser.mozilla && $.browser.version.substr(0,3)=="1.9"){
/*
				$('#menuContainer').corners("top-left bottom-left");
				$('#galleryContainer').corners("top-right bottom-right");
*/
				$('#container').corners();
				Logger.debug("Setting rounded corners (FF3)");
			}
			
			if ($.browser.safari){
				$('#container').corners();
				Logger.debug("Setting rounded corners (Safari)");
			}
		}
		
	}
	
}