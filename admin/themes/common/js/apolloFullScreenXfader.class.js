var apolloFullScreenXfader = {

	center : 0,
	
	imageList : ["test_images/rover1.jpg", "test_images/bear.jpg", "test_images/rover2.jpg", "test_images/bear.jpg"],
	
	currentImage : 0,			
	img1 : 0,
	img2 : -1,
	
	timeBetweenFades : 2000,
	fadeTime : 1000,
	
	isPaused : false,
	
	nextImg : 1,
	
	// ///////////////////////////////////////////////////////////////////
	
	start : function(targetDiv){
			
		$("body").css("overflow","hidden");
		
		$(window).load(function() {
			apolloFullScreenXfader.resizeImage();
			apolloFullScreenXfader.nextImage();
		});
		
		$(window).bind("resize",function() {
			apolloFullScreenXfader.resizeImage();
		});		
		
		$(targetDiv).html("<img id='xFadeImage1' class='xFadeImage' src='"+apolloFullScreenXfader.imageList[apolloFullScreenXfader.img1]+"'><img id='xFadeImage2' class='xFadeImage'  src='"+apolloFullScreenXfader.imageList[apolloFullScreenXfader.img2]+"'>");
	},

	// ///////////////////////////////////////////////////////////////////

	img1Front : false,
	toHandle : '',

	nextImage : function(){
	
		$('.xFadeImage').stop();
		
		if (apolloFullScreenXfader.toHandle != ''){
			clearTimeout(apolloFullScreenXfader.toHandle);
		}
		
		apolloFullScreenXfader.img1Front = !apolloFullScreenXfader.img1Front;

		apolloFullScreenXfader.img1++;				
		apolloFullScreenXfader.img2++;

		if (apolloFullScreenXfader.img1 >= apolloFullScreenXfader.imageList.length) apolloFullScreenXfader.img1 = 0;
		if (apolloFullScreenXfader.img2 >= apolloFullScreenXfader.imageList.length) apolloFullScreenXfader.img2 = 0;
		
		apolloFullScreenXfader.doTransition();		
	},
	
	// ///////////////////////////////////////////////////////////////////

	prevImage : function(){
	
		$('.xFadeImage').stop();
	
		if (apolloFullScreenXfader.toHandle != ''){
			clearTimeout(apolloFullScreenXfader.toHandle);
		}
		
		apolloFullScreenXfader.img1Front = !apolloFullScreenXfader.img1Front;
		
		apolloFullScreenXfader.img1--;				
		apolloFullScreenXfader.img2--;
		
		if (apolloFullScreenXfader.img1 < 0) apolloFullScreenXfader.img1 = apolloFullScreenXfader.imageList.length - 1;
		if (apolloFullScreenXfader.img2 < 0) apolloFullScreenXfader.img2 = apolloFullScreenXfader.imageList.length - 1;
		
		apolloFullScreenXfader.doTransition();		
					
	},
	
	// ///////////////////////////////////////////////////////////////////

	togglePlay : function(){
		
		apolloFullScreenXfader.isPaused = !apolloFullScreenXfader.isPaused;
		
		if (apolloFullScreenXfader.isPaused){
			clearTimeout(apolloFullScreenXfader.toHandle);
		}
		else {
			apolloFullScreenXfader.doTransition();					
		}
	},

	// ///////////////////////////////////////////////////////////////////
				
	doTransition : function(){
	
		// Swap out image src for whatever imnage is currently 'behind'
		if (apolloFullScreenXfader.img1Front){
			// Image 1 is in front
			$("#xFadeImage2").attr('src', apolloFullScreenXfader.imageList[apolloFullScreenXfader.img2]);
		}
		else {
			// Image 2 is in front
			$("#xFadeImage1").attr('src', apolloFullScreenXfader.imageList[apolloFullScreenXfader.img2]);
		}
		
					
		if (apolloFullScreenXfader.img1Front){
			$("#xFadeImage1").fadeOut(apolloFullScreenXfader.fadeTime, apolloFullScreenXfader.transistionComplete);
			$("#xFadeImage2").fadeIn(apolloFullScreenXfader.fadeTime);					
		}
		else {
			$("#xFadeImage1").fadeIn(apolloFullScreenXfader.fadeTime);
			$("#xFadeImage2").fadeOut(apolloFullScreenXfader.fadeTime, apolloFullScreenXfader.transistionComplete);					
		}			
						
	},
	
	transistionComplete : function(){
								
		if (!apolloFullScreenXfader.isPaused){
			apolloFullScreenXfader.toHandle = setTimeout(apolloFullScreenXfader.nextImage, apolloFullScreenXfader.timeBetweenFades);
		}											
	},
	
	// ///////////////////////////////////////////////////////////////////
			
	resizeImage : function() {
		
		//$("body").css({
		//	"overflow":"hidden"
		//});
		
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