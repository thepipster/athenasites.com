/**
* Class to contain common operators
*/
var cgpCommon = {

	// //////////////////////////////////////////////////////////////////////////////

	/**
	* Do the common things!
	*/ 
	init : function(page, showLogger){

		// Setup menu		
		$('#navigation').css('display', 'inline');

		$('#navigation').accordion({ 
		    active: true, 
		    header: '.menuHead', 
//		    fillSpace: false,
		    autoHeight: false,
		    navigation: true,
		   // event: 'mouseover'
		});		
		
		// Update nav with current page		
		cgpCommon.setPage(page);

		// Do any IE6 hackes (ugh, hate IE6!)
		if (cgpCommon.isIE6()){
			// Remove any non-tile positioned background png images as 
			// ie6 will not position transparent png background images correctly
			$('.pageContents').css('background-image', "url('')");
		}
		
		// Setup debugger		
		Logger.init('#debug_txt');
		
		if (showLogger)
			Logger.showDebugWindow();
		
	},
	
	// //////////////////////////////////////////////////////////////////////////////

	/**
	* Set the currently selected page in the nav bar
	*/	
	setPage : function(page){
		
		// Reset all menuItems...
		$('.menuItem').css('font-weight', 'normal')
		
		switch(page){

			case 'home' :
			
				break;
						
			case 'gallery' :
							
				$('#gal'+gl_currentGallery).css('font-weight', 'bold')
				break;

			case 'pricing' :

				$('#pricingMenuItem').css('font-weight', 'bold')
				break;

			case 'products' :			
			
				$('#productsMenuItem').css('font-weight', 'bold');					
				break;

			case 'contact' :
			
				$('#contactMenuItem').css('font-weight', 'bold');
				break;

			case 'information' :

				$('#infoMenuItem').css('font-weight', 'bold')
				break;
		}
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
				return parseInt(hash.substring(si, si+2)) - 1;
			}
		}
		
		return false;
	},

	// //////////////////////////////////////////////////////////////////////////////
	
	/**
	* Create rounded corners for site
	*/
	roundCorners : function(){

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