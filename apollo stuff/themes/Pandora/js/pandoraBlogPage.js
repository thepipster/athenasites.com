var pandoraBlogPage = {

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

		pandoraBlogPage.imgWidth = options.width;
		pandoraBlogPage.imgHeight = options.height;
		pandoraBlogPage.maxHeight = options.maxHeight;
		pandoraBlogPage.minWidth = options.minWidth;
						
		// Optimize size for gallery
		//pandoraBlogPage.imgRatio = pandoraBlogPage.imgHeight / pandoraBlogPage.imgWidth;
		pandoraBlogPage.imgRatio = pandoraBlogPage.imgWidth / pandoraBlogPage.imgHeight;
	
		pandoraBlogPage.onResize();
		
		setTimeout("pandoraBlogPage.onResize()", 200);
					
		// Set resize listener
		// TODO: Should append listener to any existing
		$(window).resize(pandoraBlogPage.onResize);
								
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
		if (galH > pandoraBlogPage.maxHeight) galH = pandoraBlogPage.maxHeight;						
		var galW = Math.floor(pandoraBlogPage.imgRatio * galH);	
							
		if (galW > pandoraBlogPage.minWidth){
		
			$("#nav_container").width(galW);	
			$("#container").width(galW);	
												
			$("#content").height(galH);
			$("#content").width(galW);
			
		}
		
	}
*/
}