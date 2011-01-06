/**
* Handle the gallery on the home page
*/
var cgpHome = {

	/** Width of flash gallery viewer */
	imgWidth : 1200,
	
	/** Height of flash gallery viewer */
	imgHeight : 800,
	
	/** Ratio of width to height */
	imgRatio : 0,

	/** Minimum allowed width */
	minWidth : 800,
	
	init : function(){
						
		// Optimize size for gallery
		cgpHome.imgRatio = cgpHome.imgHeight / cgpHome.imgWidth;	
	
		cgpHome.onResize();
		
		setTimeout("cgpHome.onResize()", 200);
		
		// If the client doesn't have flash, use the JS image gallery
		if (!hasFlash){
			apolloXfader.start('#galleryContent', {images:imgList, altText: altTxtList, paddingTop: 3, paddingBottom: 3, paddingLeft: 30, paddingRight: 0});
		}				
						
		$(window).resize(cgpHome.onResize);
								
	},
	
	// //////////////////////////////////////////////////////
	
	onResize : function(){

		//if (hasFlash){
				
			$("#menuContainer").width(200);
			
			//var wPad = $("#galleryContent").outerWidth() - $("#galleryContent").width();
			//var hPad = $("#galleryContent").outerHeight() - $("#galleryContent").height();
			var wPad = 25;
		
			var galW = $("#container").width() - $("#menuContainer").width() - wPad;		
			var galH = Math.floor(cgpHome.imgRatio * galW);
			
			$("#container").height(galH);	
			
			$("#galleryContent").height(galH);
			$("#galleryContent").width(galW);
									
			//alert( $('#homeGalFlashObject').width() + ", " + $('#homeGalFlashObject').height() );
			//alert( $('#galleryContent').width() + ", " + $('#galleryContent').height() );
			
			//alert("galW = " + galW + " galH = " + galH);
		//}
		
	}

}