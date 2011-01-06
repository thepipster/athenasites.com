var cgpGallery = {

	/** Width of flash gallery viewer */
	imgWidth : 1270,
	
	/** Height of flash gallery viewer */
	imgHeight : 810,

	/** The width of the thumb display column (not the thumbs) */
	thumbWidth : 70,
	
	/** Ratio of width to height */
	imgRatio : 0,

	/** Minimum allowed width */
	minWidth : 800,
	
	// /////////////////////////////////////////////////////////////////

	init : function(){
						
		// Optimize size for gallery
		cgpGallery.imgRatio = cgpGallery.imgHeight / cgpGallery.imgWidth;	
	
		cgpGallery.onResize();
		
		setTimeout("cgpGallery.onResize()", 200);
					
		$(window).resize(cgpGallery.onResize);
								
	},
	
	// /////////////////////////////////////////////////////////////////
	
	onResize : function(){

		if (hasFlash){
				
			$("#menuContainer").width(200);
			
			var galW = $("#container").width() - $("#menuContainer").width() - 25;		
			var galH = Math.floor(cgpGallery.imgRatio * galW);
			
			$("#container").height(galH);	
			
			$("#galleryContent").height(galH);
			$("#galleryContent").width(galW);
			
			//Logger.info("galW = " + galW + " galH = " + galH);
	
			// Gallery controls.................
					
			// Figure out thumb width, and make the controls that wide
			/*
			var r = cgpGallery.thumbWidth / cgpGallery.imgWidth;			
			var w = r * galW;
					
			if (!cgpCommon.isIE6()){
				$('.nextButton').css('width', (w/2));
				$('.prevButton').css('width', (w/2));
			}
			else {
				$('.nextButton').css('padding-right', 10);
			}
			
			$('.toggleShow').css('width', w);
			*/
		}
		
	}

}
