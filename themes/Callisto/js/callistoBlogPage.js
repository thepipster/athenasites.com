var callistoBlogPage = {

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

		callistoBlogPage.imgWidth = options.width;
		callistoBlogPage.imgHeight = options.height;
		callistoBlogPage.maxHeight = options.maxHeight;
		callistoBlogPage.minWidth = options.minWidth;
						
		// Optimize size for gallery
		//callistoBlogPage.imgRatio = callistoBlogPage.imgHeight / callistoBlogPage.imgWidth;
		callistoBlogPage.imgRatio = callistoBlogPage.imgWidth / callistoBlogPage.imgHeight;
	
		callistoBlogPage.onResize();
		
		setTimeout("callistoBlogPage.onResize()", 200);
					
		// Set resize listener
		// TODO: Should append listener to any existing
		$(window).resize(callistoBlogPage.onResize);
								
	},
	
	// /////////////////////////////////////////////////////////////////////////////////

	onResize : function(){
				
		var postWidth = $('#content').width() - 340;
				
		// Check to see if we have any imags that are too wide, and resize them
		// if needed
		$('img').each(function(){
			
			var width = $(this).width();
			var height = $(this).height()
			
			if (width > postWidth){

				if (width > height){
					$(this).css('height', 'auto');
					$(this).width(postWidth);
				}
				else {
					$(this).width(postWidth*0.7);
					$(this).css('height', 'auto');
				}
			}
			
		
		});		
		
		var blogW = $("#blogTable").width();
		
		$("#nav_container").width(blogW);	
		$("#container").width(blogW);				
		$("#content").width(blogW);		
		
	}
/*
	onResize : function(){

		var galH = $("#wrapper").height() - $("#nav_container").height();	
		if (galH > callistoBlogPage.maxHeight) galH = callistoBlogPage.maxHeight;						
		var galW = Math.floor(callistoBlogPage.imgRatio * galH);	
							
		if (galW > callistoBlogPage.minWidth){
		
			$("#nav_container").width(galW);	
			$("#container").width(galW);	
												
			$("#content").height(galH);
			$("#content").width(galW);
			
		}
		
	}
*/
}