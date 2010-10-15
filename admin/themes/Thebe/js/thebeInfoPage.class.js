var thebeInfoPage = {

	/** Width of flash gallery viewer */
	imgWidth : 1350,
	
	/** Height of flash gallery viewer */
	imgHeight : 800,
			
	/** Ratio of width to height */
	imgRatio : 0,
			
	/** left, right or none */
	pageType : 'none',
			
	// /////////////////////////////////////////////////////////////////////////////////

	init : function(options){

		if (options != null){
			if (options.pageType != undefined) thebeInfoPage.imgWidth = options.width;
			if (options.pageType != undefined) thebeInfoPage.imgHeight = options.height;
			if (options.pageType != undefined) thebeInfoPage.pageType = options.pageType;
		}
		
		// Optimize size for gallery
		thebeInfoPage.imgRatio = thebeInfoPage.imgWidth / thebeInfoPage.imgHeight;

		thebeInfoPage.onResize();
				
		setTimeout("thebeInfoPage.onResize()", 200);
						
		// Set resize listener
		// TODO: Should append listener to any existing
		$(window).resize(thebeInfoPage.onResize);										
	},
			
	// /////////////////////////////////////////////////////////////////////////////////
	
	onResize : function(){
	
		var minH = parseInt($("#content").css("min-height"));
		var maxH = parseInt($("#content").css("max-height"));
		var minW = parseInt($("#content").css("min-width"));
											
		var galH = $("#wrapper").height() - $("#nav_container").height();
		
		// If the requested height is more than the containers max height then ajdust
		// (but test to see if the max height is set in the style sheet first)
		if (maxH != null && maxH != undefined){
			if (galH > maxH) galH = maxH;						
		}	

		// If the height is less than the minimum height, then adjust
		if (minH != null && minH != undefined){
			if (minH > galH) galH = minH;
		}
		
		var galW = Math.floor(thebeInfoPage.imgRatio * galH);								
		
		// If the width is less than the minimum width, then adjust
		if (minW != null && minW != undefined){
			if (minW > galW) galW = minW;
		}
				
		$("#nav_container").width(galW);	
		$("#container").width(galW);	
		
		$("#content").height(galH);
		$("#content").width(galW);
		
		// Update the background image size
		
		var imgH = $('#back_image').height();
		var imgW = $('#back_image').width();
									
		if ($('#back_image').width() < $('#back_image').height()){
			if (thebeInfoPage.pageType == 'left'){
				alert("galW = " + galW + " imgW = " + imgW);
				$('.leftCol').width(galW - imgW);
			}
			else if (thebeInfoPage.pageType == 'right'){
				$('.rightCol').width(galW - imgW);
			}
			
		}
		else {
		
			if (thebeInfoPage.pageType == 'none') return;
			
			// If the width is less than the minimum width, then adjust
			if (minW != null && minW != undefined){
				if (minW > imgW) {
					var ratio = imgH / imgW;
					imgW = minW;
					imgH = ratio * imgW;					
				}
			}		
				
//			alert(imgW + ", " + imgH);
				
//			$("#content").height(imgH);
//			$("#content").width(imgW);								
/*
			if (thebeInfoPage.pageType == 'left'){
				$('.leftCol').width(0.5 * imgW);
			}
			else if (thebeInfoPage.pageType == 'right'){
				$('.rightCol').width(0.5 * imgW);
			}
			else {
			}
*/		
		}
		
		
	}

}