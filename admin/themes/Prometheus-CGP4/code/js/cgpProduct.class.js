var cgpProduct = {

	/** Width of flash gallery viewer */
	galWidth : 750,
	
	/** Height of flash gallery viewer */
	galHeight : 500,

	/** Ratio of width to height */
	imgRatio : 0,
	
	/** Reference to product flash gallery */
	prodFlash : '',

	// //////////////////////////////////////////////////////////////////////////////

	init : function(){
		
		cgpCommon.init('products');

		// Tell google!
		//cgpProduct.pageTracker = _gat._getTracker("UA-534928-3");
		//cgpProduct.pageTracker._trackPageview();

		// Optimize size for gallery
		cgpProduct.imgRatio = cgpProduct.galHeight / cgpProduct.galWidth;
		
		cgpProduct.onResize();
		
		cgpProduct.getProductGalleryHandle();
		
		// Highlight first in menu
		$('#prodGal1').css('font-weight', 'bold')

		setTimeout("cgpProduct.onResize()", 100);

		$(window).resize(cgpProduct.onResize);

	},
	
	// //////////////////////////////////////////////////////////////////////////////

	onResize : function(){
		
		// Make the gallery as big as it can be, then adjust the height of the container to fit
		var galW = $(".pageGalProduct").width();
//		var galW = $("#container").width() - $("#menuContainer").width() - $(".productPageMenu").width();
		
		var galH = Math.round(cgpProduct.imgRatio * galW);
			
		$(".pageGalProduct").height(galH);
		$("#productGalFlashObj").height(galH);
		
		// Now adjust the height of the container
//		var topPad = parseInt($("#productsPage").css('paddingTop'));
		
		var pageH = $("#productsPage").height() + 20;
		
		pageH = galH + 150;

		$("#container").height(pageH);
				
		Logger.info(galW + ", " + galH + " - " + pageH);
				
	},
	
	// //////////////////////////////////////////////////////////////////////////////
	
	gotoProductGallery : function(galNo){
				
		try {
			var pageTracker = _gat._getTracker("UA-534928-3");
			pageTracker._trackPageview("product_" + galNo);
		} catch(err) {}

		// Reset all menuItems...
		$('.nav').css('font-weight', 'normal')
			
		if (cgpProduct.prodFlash.loadGallery){
			Logger.debug('Loading product gallery ' + galNo);
			cgpProduct.prodFlash.loadGallery('gal'+galNo); 	
			$('#prodGal' + galNo).css('font-weight', 'bold')
		}
		else {
			Logger.error('Product gallery not defined');
			cgpProduct.getProductGalleryHandle();
			setTimeout("cgpProduct.gotoProductGallery('"+galNo+"')", 1000);
			return;
		}
		
	},

	// //////////////////////////////////////////////////////////////////////////////

	/**
	* Respond to a product image being loaded, and show the title/caption
	*/
	onProductImageLoaded : function(title, caption){
	},

	// //////////////////////////////////////////////////////////////////////////////

	onProductGalleryLoaded : function(title, description){
		//Logger.debug(title + '  ' + description);
		$('#productGalleryDesc').html(description);
		$('#productGalleryTitle').html(title);
	},		
	
	// //////////////////////////////////////////////////////////////////////////////

	getProductGalleryHandle : function(){
		var isIE = navigator.appName.indexOf("Microsoft") != -1;
  		cgpProduct.prodFlash = (isIE) ? window['productGalFlashObj'] : document['productGalFlashObj'];

  		try {
	  		if (cgpProduct.prodFlash.loadGallery){
	  			Logger.debug("getProductGalleryHandle: got handle ok!");
	  		}
	  		else {
	  			Logger.error("getProductGalleryHandle: Can't get a handle to the flash object " + cgpProduct.prodFlash.loadGallery);
  				setTimeout("cgpProduct.getProductGalleryHandle()", 200);
	  		}
  		}
  		catch(e){
  			Logger.error("getProductGalleryHandle: Can't get a handle to the flash object " + cgpProduct.prodFlash.loadGallery);
  			setTimeout("cgpProduct.getProductGalleryHandle()", 200);
  		}
	}	

}
