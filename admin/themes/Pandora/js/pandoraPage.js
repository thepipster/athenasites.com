var pandoraPage = {

	/** Width of flash gallery viewer */
	imgWidth : 1350,
	
	/** Height of flash gallery viewer */
	imgHeight : 800,

	/** Ratio of width to height */
	imgRatio : 0,

	/** Minimum allowed width */
	minWidth : 800,

	/** Maximum height, to avoid image scaling */	
	maxHeight : 800,
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	init : function(options){

		pandoraPage.imgWidth = options.width;
		pandoraPage.imgHeight = options.height;
		pandoraPage.maxHeight = options.maxHeight;
		pandoraPage.minWidth = options.minWidth;
						
		// Optimize size for gallery
		//pandoraPage.imgRatio = pandoraPage.imgHeight / pandoraPage.imgWidth;
		pandoraPage.imgRatio = pandoraPage.imgWidth / pandoraPage.imgHeight;
	
		pandoraPage.onResize();
		
		setTimeout("pandoraPage.onResize()", 200);
					
		// Set resize listener
		// TODO: Should append listener to any existing
		$(window).resize(pandoraPage.onResize);
								
	},
	
	// /////////////////////////////////////////////////////////////////////////////////

	onResize : function(){

		var galH = $("#wrapper").height() - $("#nav_container").height();	
		if (galH > pandoraPage.maxHeight) galH = pandoraPage.maxHeight;						
		var galW = Math.floor(pandoraPage.imgRatio * galH);	
							
		if (galW > pandoraPage.minWidth){
		
			$("#nav_container").width(galW);	
			$("#container").width(galW);	
												
			$("#content").height(galH);
			$("#content").width(galW);
			
		}
		
	}

}