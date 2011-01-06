var apolloXfader = {

	center : 0,
	
	imageList : '',
	altTextList : '',
	
	currentImage : 0,			
	img1 : 0,
	img2 : -1,
	
	timeBetweenFades : 2000,
	fadeTime : 1000,
	
	isPaused : false,
	isFullScreen : false,
	
	nextImg : 1,
	
	targetDiv : '',
	
	noScaleUp : false,
	
	// ///////////////////////////////////////////////////////////////////
	
	/**
	* @param targetDiv - the target div for the gallery
	* @param options; 
	*   images - array of image url's
	*   altText - array of image alt text
	*   altText - array of image alt text
	*   fadeTime - fade time (ms)
	*   timeBetweenFades - time between fades (ms)
	*/
	start : function(targetDiv, options){
			
		if (options.images == undefined){
			alert("apolloXfader has not been given any images!!!");
			return;
		}
		
		apolloXfader.targetDiv = targetDiv;
		
		if (options.images != undefined) apolloXfader.imageList = options.images;
		if (options.altText != undefined) apolloXfader.altTextList = options.altText;
		if (options.fullscreen != undefined) apolloXfader.isFullScreen = options.fullscreen;
		if (options.fadeTime != undefined) apolloXfader.fadeTime = options.fadeTime;
		if (options.timeBetweenFades != undefined) apolloXfader.timeBetweenFades = options.timeBetweenFades;
				
		if (apolloXfader.isFullScreen){
			$("body").css("overflow","hidden");					
		}		

		$(window).load(function() {
			apolloXfader.resizeImage();
			apolloXfader.nextImage();
		});

		$(window).resize(apolloXfader.resizeImage);
								
		$(targetDiv).html("<img id='xFadeImage1' class='xFadeImage' src='"+apolloXfader.imageList[apolloXfader.img1]+"'><img id='xFadeImage2' class='xFadeImage'  src='"+apolloXfader.imageList[apolloXfader.img2]+"'>");
		
		apolloXfader.resizeImage();
	},

	// ///////////////////////////////////////////////////////////////////

	img1Front : false,
	toHandle : '',

	nextImage : function(){
	
		$('.xFadeImage').stop();
		
		if (apolloXfader.toHandle != ''){
			clearTimeout(apolloXfader.toHandle);
		}
		
		apolloXfader.img1Front = !apolloXfader.img1Front;

		apolloXfader.img1++;				
		apolloXfader.img2++;

		if (apolloXfader.img1 >= apolloXfader.imageList.length) apolloXfader.img1 = 0;
		if (apolloXfader.img2 >= apolloXfader.imageList.length) apolloXfader.img2 = 0;
		
		apolloXfader.doTransition();		
	},
	
	// ///////////////////////////////////////////////////////////////////

	prevImage : function(){
	
		$('.xFadeImage').stop();
	
		if (apolloXfader.toHandle != ''){
			clearTimeout(apolloXfader.toHandle);
		}
		
		apolloXfader.img1Front = !apolloXfader.img1Front;
		
		apolloXfader.img1--;				
		apolloXfader.img2--;
		
		if (apolloXfader.img1 < 0) apolloXfader.img1 = apolloXfader.imageList.length - 1;
		if (apolloXfader.img2 < 0) apolloXfader.img2 = apolloXfader.imageList.length - 1;
		
		apolloXfader.doTransition();		
					
	},
	
	// ///////////////////////////////////////////////////////////////////

	togglePlay : function(){
		
		apolloXfader.isPaused = !apolloXfader.isPaused;
		
		if (apolloXfader.isPaused){
			clearTimeout(apolloXfader.toHandle);
		}
		else {
			apolloXfader.doTransition();					
		}
	},

	// ///////////////////////////////////////////////////////////////////
				
	doTransition : function(){
	
		// Swap out image src for whatever imnage is currently 'behind'
		if (apolloXfader.img1Front){
			// Image 1 is in front
			$("#xFadeImage2").attr('src', apolloXfader.imageList[apolloXfader.img2]);
		}
		else {
			// Image 2 is in front
			$("#xFadeImage1").attr('src', apolloXfader.imageList[apolloXfader.img2]);
		}
		
					
		if (apolloXfader.img1Front){
			$("#xFadeImage1").fadeOut(apolloXfader.fadeTime, apolloXfader.transistionComplete);
			$("#xFadeImage2").fadeIn(apolloXfader.fadeTime);					
		}
		else {
			$("#xFadeImage1").fadeIn(apolloXfader.fadeTime);
			$("#xFadeImage2").fadeOut(apolloXfader.fadeTime, apolloXfader.transistionComplete);					
		}			
						
	},
	
	transistionComplete : function(){
								
		if (!apolloXfader.isPaused){
			apolloXfader.toHandle = setTimeout(apolloXfader.nextImage, apolloXfader.timeBetweenFades);
		}											
	},
	
	// ///////////////////////////////////////////////////////////////////
			
	resizeImage : function() {
						
		if (!apolloXfader.isFullScreen){

			var divObj = $(apolloXfader.targetDiv);		
			var pos = divObj.position();
			
			//$("body").css({
			//	"overflow":"hidden"
			//});
			
			$('.xFadeImage').css({
				"position":"absolute",
				"top": (pos.top + parseInt($(apolloXfader.targetDiv).css('padding-top'))) + "px",
				"left": (pos.left + parseInt($(apolloXfader.targetDiv).css('padding-left'))) + "px",
				"z-index":"-1",
				"overflow":"hidden"
			});
			
			$('#xFadeImage1').css("z-index", 1);
			$('#xFadeImage2').css("z-index", 0);
	
			if (apolloXfader.isFullScreen){
				$('.xFadeImage').css("height", divObj.height() + "px");
				$('.xFadeImage').css("width", divObj.width() + "px");
			}
			else {
				if (apolloXfader.noScaleUp){
					if ($('.xFadeImage').width() > 0){
						$('.xFadeImage').css("width", Math.min(divObj.width(), $('.xFadeImage').width())  + "px");				
					}
					else {
						$('.xFadeImage').css("width", divObj.width() + "px");				
					}
				}
				else {
					$('.xFadeImage').css("width", divObj.width() + "px");				
				}
			}
					
		}
		else {
		
			$('.xFadeImage').css({
				"position":"absolute",
				"top":"0px",
				"left":"0px",
				"z-index":"-1",
				"overflow":"hidden",
				"width":$(window).width() + "px",
				"height":$(window).height() + "px"
			});
			
			$('#xFadeImage1').css("z-index", 1);
			$('#xFadeImage2').css("z-index", 0);
			
			var containerObj = $('.xFadeImage');
			
			// Resize the img object to the proper ratio of the window.
			var iw = containerObj.children('img').width();
			var ih = containerObj.children('img').height();
			
			if ($(window).width() > $(window).height()) {
				if (iw > ih) {
					var fRatio = iw/ih;
					containerObj.children('img').css("width",$(window).width() + "px");
					containerObj.children('img').css("height",Math.round($(window).width() * (1/fRatio)));
	
					var newIh = Math.round($(window).width() * (1/fRatio));
	
					if(newIh < $(window).height()) {
						var fRatio = ih/iw;
						containerObj.children('img').css("height",$(window).height());
						containerObj.children('img').css("width",Math.round($(window).height() * (1/fRatio)));
					}
				} else {
					var fRatio = ih/iw;
					containerObj.children('img').css("height",$(window).height());
					containerObj.children('img').css("width",Math.round($(window).height() * (1/fRatio)));
				}
			} else {
				var fRatio = ih/iw;
				containerObj.children('img').css("height",$(window).height());
				containerObj.children('img').css("width",Math.round($(window).height() * (1/fRatio)));
			}
			
			containerObj.css("visibility","visible");
			
			// Center BG Image
			if (apolloFullScreenXfader.center) {
				
				containerObj.children('img').css("position","relative");
				
				if (containerObj.children('img').width() > containerObj.width()) {
					var wDiff = (containerObj.children('img').width() - containerObj.width()) / 2;
					containerObj.children('img').css("left", "-" + wDiff + "px");
				}
			}
			
		}
	}
}