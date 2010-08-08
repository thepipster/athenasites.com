var pandoraHome = {

	imageList : -1,
	
	// ////////////////////////////////////////////////////////////////////

	init : function(){
	/*
		if (pandoraHome.supportsCanvas()){			
		
			$('#content').html("<canvas id='backgroundImageCanvas' style=\"width='100%';height='100%'\"></canvas>");		
			
			$('#backgroundImageCanvas').height($('#content').height())
			$('#backgroundImageCanvas').width($('#content').width())
			//alert($('#backgroundImageCanvas').height());
			
			// Load all the images
			pandoraHome.imageList = new Array();

			pandoraHome.imageList[0] = new Image(); 
			pandoraHome.imageList[0].src = "<?php bloginfo('stylesheet_directory'); ?>/res/test_images/intro_02.jpg";
			pandoraHome.imageList[0].onLoad = pandoraHome.paintBackgroundImage();

		}
		else {
			alert("Your browser does not support HTML5, if you have IE7 or IE8 then you can download a plugin for it at http://code.google.com/p/explorercanvas/");
		}
		*/
		
	},
	
	// ////////////////////////////////////////////////////////////////////

	paintBackgroundImage2 : function(){
	
		//alert('first image loaded!');
		
		var canvas = document.getElementById('backgroundImageCanvas');
		var ctx = canvas.getContext('2d');
		var img = pandoraHome.imageList[0];
		
		// Hide						
		//$('#backgroundImageCanvas').hide();
		
		// Get scaling paras
		var contentW = $("#content").innerWidth();
		var contentH = $("#content").innerHeight();
			
		alert(contentW + ", " + contentH);
			
		// Get the image size (1260 x 800)
		//var imgW = 1260;
		//var imgH = 800;
		
		//var scaleW = imgW / contentW;
		//var scaleH = imgH / contentH;

		// Draw and scale		
		ctx.drawImage(img, 0, 0, contentW, contentH); 
		
		// Crop image
		//ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
		//ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, contentW, contentH)


		//ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
		//ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, contentW, contentH)

		
		/*						
		ctx.clearRect(0,0,canvas.width,canvas.height); // clear canvas
		ctx.fillStyle = 'rgba(0,0,0,0.4)';
		//pandoraHome.imageList[0]
		ctx.scale(scaleW, scaleH);
		ctx.drawImage(oObj, 0, 0);
		*/
	},
	
	// ////////////////////////////////////////////////////////////////////
	
	/**
	* test for html5 canvas tag, ask user to download support for ie from 
	* http://code.google.com/p/explorercanvas/
	*/
	supportsCanvas : function() {
	  return !!document.createElement('canvas').getContext;
	}
	
}