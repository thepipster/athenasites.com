var callistoPage = {

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

		callistoPage.imgWidth = options.width;
		callistoPage.imgHeight = options.height;
		callistoPage.maxHeight = options.maxHeight;
		callistoPage.minWidth = options.minWidth;
						
		// Optimize size for gallery
		//callistoPage.imgRatio = callistoPage.imgHeight / callistoPage.imgWidth;
		callistoPage.imgRatio = callistoPage.imgWidth / callistoPage.imgHeight;
	
		callistoPage.onResize();
		
		setTimeout("callistoPage.onResize()", 200);
					
		// Set resize listener
		// TODO: Should append listener to any existing
		$(window).resize(callistoPage.onResize);
								
	},
	
	// /////////////////////////////////////////////////////////////////////////////////

	onResize : function(){

		var galH = $("#wrapper").height() - $("#nav_container").height();	
		if (galH > callistoPage.maxHeight) galH = callistoPage.maxHeight;						
		var galW = Math.floor(callistoPage.imgRatio * galH);	
							
		if (galW > callistoPage.minWidth){
		
			$("#nav_container").width(galW);	
			$("#container").width(galW);	
												
			$("#content").height(galH);
			$("#content").width(galW);
			
		}
		
	}

}