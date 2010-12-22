/**
* Class for a cross-fading image gallery
*/	
var jsImageFader = {

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
					
		jsImageFader.setImage(0);
		
		$('#image1').css('top',pos.top + topOffset);
		$('#image1').css('left',pos.left);

		$('#image2').css('top',pos.top + topOffset);
		$('#image2').css('left',pos.left);		
		
		//setTimeout('jsImageFader.start()', jsImageFader.showTime);
	},
	
	
	/**
	* Set the current image
	*/
	setImage : function(imgNo){
		
		jsImageFader.prevImage = jsImageFader.currentImage;
		jsImageFader.currentImage = imgNo;
		
		var img1 = jsImageFader.currentImage;
		var img2 = jsImageFader.prevImage;

		if (!jsImageFader.topLayer){
			img1 = jsImageFader.prevImage;
			img2 = jsImageFader.currentImage;
		}
		
		$('#image1').attr('src',gl_imgSrcList[img1]);
		$('#image2').attr('src',gl_imgSrcList[img2]);

		$('#image1').attr('alt',gl_altTxtList[img1]);
		$('#image2').attr('alt',gl_altTxtList[img2]);

		// Mark image layer as flipped...			
		jsImageFader.topLayer = !jsImageFader.topLayer;

	},
	
	
	timerHandle : '',
	
	
	start : function(){
		jsImageFader.doFade();
		jsImageFader.timerHandle = setInterval("jsImageFader.fadeToNext()", jsImageFader.showTime);
	},
	
	
	stop : function(){
		clearTimeout(jsImageFader.timerHandle);
	},
	
	
	fadeToNext : function(){

		var next = jsImageFader.currentImage + 1;

		if (next > gl_imgSrcList.length) {
			next = 0;
		}
		
		//alert(next);
		jsImageFader.setImage(next);
		jsImageFader.doFade();
	},
	
	
	/**
	* Do that fade
	*/
	doFade : function(){

		if (jsImageFader.topLayer){
	      $("#image1").fadeTo(jsImageFader.fadeTime, 0.0);
//		      $("#image2").fadeTo(jsImageFader.fadeTime, 1.0, jsImageFader.onFadeComplete);
	      $("#image2").fadeTo(jsImageFader.fadeTime, 1.0);
		}
		else {
//		      $("#image1").fadeTo(jsImageFader.fadeTime, 1.0, jsImageFader.onFadeComplete);
	      $("#image1").fadeTo(jsImageFader.fadeTime, 1.0);
	      $("#image2").fadeTo(jsImageFader.fadeTime, 0.0);
		}
		
	},
	
	
	/**
	* Update after fade has completed...
	*/
	onFadeComplete : function(){
	
		// Update image index...
		
		jsImageFader.currentImage++;

		if (jsImageFader.currentImage > gl_imgSrcList.length) {
			jsImageFader.currentImage = 0;
		}
		
		// Switch out faded image to next in sequence...
		
		if (jsImageFader.topLayer){
			// image2 is now top, so change image1 to next image in sequence
			$('#image1').attr('src',gl_imgSrcList[jsImageFader.currentImage]);
		}
		else {
			// image1 is now top, so change image2 to next image in sequence
			$('#image2').attr('src',gl_imgSrcList[jsImageFader.currentImage]);
		}
		
		// Mark image layer as flipped...			
		jsImageFader.topLayer = !jsImageFader.topLayer;
	}
}