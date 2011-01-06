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
		    fillSpace: false,
		    autoHeight: false,
		    navigation: true
		   // event: 'mouseover'
		});		
		
		// Do any IE6 hackes (ugh, hate IE6!)
		if (cgpCommon.isIE6()){
			// Remove any non-tile positioned background png images as 
			// ie6 will not position transparent png background images correctly
			$('.pageContents').css('background-image', "url('')");
		}
		
		// Setup debugger		
		Logger.init('#debug_txt');
		
		if (showLogger) Logger.showDebugWindow();
		
	},
			
	// //////////////////////////////////////////////////////////////////////////////

	isIE6 : function(){
		if ($.browser.msie && $.browser.version < 7) return true;
		return false;
	}

	// //////////////////////////////////////////////////////////////////////////////
	
}