/**
* Class for a cross-fading image gallery
*/	
var apolloXfader = {

	/** List of images */
	imgList : [
		"images/test3.jpg", 
		"images/test1.jpg", 
		"images/test2.jpg", 
		"images/test4.jpg", 
		"images/test5.jpg", 
		"images/test6.jpg", 
		"images/test7.jpg", 
		"images/test8.jpg", 
		"images/test9.jpg"
	],
		
	/** Current image index */
	currentImage : 0,

	/** Prev image index */
	prevImage : 0,
	
	/** Set to true if image1 is top */
	topLayer : true,

	/** Time between images */
	showTime : 4000,
	
	/** Fade time */
	fadeTime : 1000,
	
	/** 
	* Initialize fader
	*/
	init : function(topOffset){
						
		var text = "";
		text += "<img id='image2' src=''>";
		text += "<img id='image1' src=''>";
		
		$('#galleryContainer').html(text);	
												
		// Position the gallery...
		var pos = $('#galleryContainer').position();
					
		apolloXfader.setImage(0);
		
		$('#image1').css('top',pos.top + topOffset);
		$('#image1').css('left',pos.left);

		$('#image2').css('top',pos.top + topOffset);
		$('#image2').css('left',pos.left);		
		
		//setTimeout('apolloXfader.start()', apolloXfader.showTime);
	},
	
	
	/**
	* Set the current image
	*/
	setImage : function(imgNo){
		
		apolloXfader.prevImage = apolloXfader.currentImage;
		apolloXfader.currentImage = imgNo;
		
		var img1 = apolloXfader.currentImage;
		var img2 = apolloXfader.prevImage;

		if (!apolloXfader.topLayer){
			img1 = apolloXfader.prevImage;
			img2 = apolloXfader.currentImage;
		}
		
		$('#image1').attr('src',gl_imgSrcList[img1]);
		$('#image2').attr('src',gl_imgSrcList[img2]);

		$('#image1').attr('alt',gl_altTxtList[img1]);
		$('#image2').attr('alt',gl_altTxtList[img2]);

		// Mark image layer as flipped...			
		apolloXfader.topLayer = !apolloXfader.topLayer;

	},
	
	
	timerHandle : '',
	
	
	start : function(){
		apolloXfader.doFade();
		apolloXfader.timerHandle = setInterval("apolloXfader.fadeToNext()", apolloXfader.showTime);
	},
	
	
	stop : function(){
		clearTimeout(apolloXfader.timerHandle);
	},
	
	
	fadeToNext : function(){

		var next = apolloXfader.currentImage + 1;

		if (next > gl_imgSrcList.length) {
			next = 0;
		}
		
		//alert(next);
		apolloXfader.setImage(next);
		apolloXfader.doFade();
	},
	
	
	/**
	* Do that fade
	*/
	doFade : function(){

		if (apolloXfader.topLayer){
	      $("#image1").fadeTo(apolloXfader.fadeTime, 0.0);
//		      $("#image2").fadeTo(apolloXfader.fadeTime, 1.0, apolloXfader.onFadeComplete);
	      $("#image2").fadeTo(apolloXfader.fadeTime, 1.0);
		}
		else {
//		      $("#image1").fadeTo(apolloXfader.fadeTime, 1.0, apolloXfader.onFadeComplete);
	      $("#image1").fadeTo(apolloXfader.fadeTime, 1.0);
	      $("#image2").fadeTo(apolloXfader.fadeTime, 0.0);
		}
		
	},
	
	
	/**
	* Update after fade has completed...
	*/
	onFadeComplete : function(){
	
		// Update image index...
		
		apolloXfader.currentImage++;

		if (apolloXfader.currentImage > gl_imgSrcList.length) {
			apolloXfader.currentImage = 0;
		}
		
		// Switch out faded image to next in sequence...
		
		if (apolloXfader.topLayer){
			// image2 is now top, so change image1 to next image in sequence
			$('#image1').attr('src',gl_imgSrcList[apolloXfader.currentImage]);
		}
		else {
			// image1 is now top, so change image2 to next image in sequence
			$('#image2').attr('src',gl_imgSrcList[apolloXfader.currentImage]);
		}
		
		// Mark image layer as flipped...			
		apolloXfader.topLayer = !apolloXfader.topLayer;
	}
}