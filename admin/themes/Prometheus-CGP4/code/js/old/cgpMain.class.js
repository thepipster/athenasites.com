var cgpMain = {

	/** Google page tracker */
	pageTracker : '',
	
	/** Width of flash gallery viewer */
	imgWidth : 1270,
	
	/** Height of flash gallery viewer */
	imgHeight : 810,
	
	/** The width of the thumb display column (not the thumbs) */
	thumbWidth : 70,
	
	/** Ratio of width to height */
	imgRatio : 0,
	
	/** Reference to flash gallery */
	flash : '',
	
	/** Reference to product flash gallery */
	prodFlash : '',
	
	/** Min height */
	minHeight : 400,
	
	/** Flag to specify whether we enforce a minimu height or not */
	enforceMinHeight : true,
	
	// //////////////////////////////////////////////////////////////////////////////

	isIE6 : function(){
		if ($.browser.msie && $.browser.version < 7) return true;
		return false;
	},
	
	// //////////////////////////////////////////////////////////////////////////////

	init : function(){
		
		// Tell google!
		//cgpMain.pageTracker = _gat._getTracker("UA-534928-3");
		//cgpMain.pageTracker._trackPageview();
		
		// Setup menu		
		$('#navigation').css('display', 'inline');
		
		$('#navigation').accordion({ 
		    active: false, 
		    header: '.menuHead', 
		    navigation: true,
		    event: 'mouseover'
		});		
		
		// Optimize size for gallery
		cgpMain.imgRatio = cgpMain.imgHeight / cgpMain.imgWidth;
		
		cgpMain.roundCorners();
		
		cgpMain.getPageFromURL();
								
	},
	
	// //////////////////////////////////////////////////////////////////////////////

	pageMode : 'normal',
	
	onResize : function(){

		if (cgpMain.pageMode == 'big'){
			return;
		}
		
		
		$("#menuContainer").width(200);
		
		var galW = $("#container").width() - $("#menuContainer").width();		
		var galH = Math.round(cgpMain.imgRatio * galW);
		
		$("#homePage").height(galH);	
		$("#homePage").width(galW);

		$("#container").height(galH);	
		/*
		$("#menuContainer").css('height', '100%');	
		$("#galeryContainer").css('height', '100%');	
		*/
		$(".page").height(galH);	
		$("#galeryContainer").height(galH);	
		$("#menuContainer").height(galH);	
		
		Logger.info("galW = " + galW + " galH = " + galH + " ratio = " + cgpMain.imgRatio );	

		// Set loading div size
//		$('#loadingPage').height( $('#menuContainer').height() );
//		$('#loadingPage').width( $('#galleryContainer').width() );

//		Logger.debug( $('#galleryContainer').width() + ", " + $('#menuContainer').height() );
		
		// Gallery controls.................
				
		// Figure out thumb width, and make the controls that wide
		var r = cgpMain.thumbWidth / cgpMain.imgWidth;			
		var w = r * galW;
		
		if (!cgpMain.isIE6()){
			$('.nextButton').css('width', (w/2));
			$('.prevButton').css('width', (w/2));
		}
		else {
			$('.nextButton').css('padding-right', 10);
		}
		
		$('.toggleShow').css('width', w);
		
	},
		
	// //////////////////////////////////////////////////////////////////////////////

	/**
	* Get the current page from the url fragment
	*/
	getPageFromURL : function(){

		cgpMain.currentPage = '';
		
		var hash = parent.location.hash;
		hash = hash.substring(1);

		if (hash.length > 1){
			if (hash.substring(0,7) == 'gallery'){		
				var galNo = parseInt(hash.substring(7));
				var page = hash.substring(0,7);
				cgpMain.gotoPage(page, galNo);	
				return;
			}
			else {
				cgpMain.gotoPage(hash);	
				return;
			}
		}

		cgpMain.gotoPage('home');	
	},

	// //////////////////////////////////////////////////////////////////////////////

	showLoading : function(){
	return;

		if (!cgpMain.isIE6()){

			$('#loadingPage').height( $('#menuContainer').height() );
			$('#loadingPage').width( $('#galleryContainer').width() );

			$('#loadingPage').show();
		}
	},		

	hideLoading : function(){
	return;
		if (!cgpMain.isIE6()){
			$('#loadingPage').hide();
		}
	},		
	
	// //////////////////////////////////////////////////////////////////////////////
	
	currentPage : '',
	currentGal : 0,
	
	gotoPage : function(page, galNo){
		
		// Default resize behaviour...
		if (cgpMain.pageMode = 'big' && page != 'information'){
			cgpMain.pageMode = 'normal';
			cgpMain.onResize();
		}
		
		cgpMain.pageMode = 'normal';
		
								
		if (page == 'gallery'){
		//	if (galNo == cgpMain.currentGal){
		//		Logger.warn("Gallery ("+galNo+") already loaded!");
		//		return;
		//	}
		}
		else if (cgpMain.currentPage == page){
			Logger.warn("Page already loaded!");
			return;
		}
	
		// Setup url
		parent.location.hash = page;
					
		Logger.info("Loading page '" + page + "'");
		
		if (galNo){
			cgpMain.currentGal = galNo;
			parent.location.hash += galNo;
		}
		cgpMain.currentPage = page;
		
		if (page == 'gallery'){
			Logger.debug("Showing controls");
			$('#galleryControls').css('zIndex', 100);
			$('#galleryControls2').css('zIndex', 100);
		}
		else {
			Logger.debug("Hiding controls");
			$('#galleryControls').css('zIndex', -1);
			$('#galleryControls2').css('zIndex', -1);
		}

		// Reset all menuItems...
		$('.menuItem').css('font-weight', 'normal')
		
		$('#infoPage').hide();
		$('#pricingPage').hide();
		$('#galleryPage').hide();
		$('#homePage').hide();
		$('#productsPage').hide();
		$('#contactPage').hide();

		$('#galleryContainer').css('background-image', "url('code/imgs/branch_large.png')");

		switch(page){

			case 'home' :
			
				$('#homePage').show();

				//$('#galleryContainer').css('background-image', "url('')");

				break;
						
			case 'gallery' :
							
				$('#gal'+galNo).css('font-weight', 'bold')

				$('#galleryContainer').css('background-image', "url('')");

				$('#galleryPage').show();

					try {
						if (cgpMain.flash.loadGallery){
							cgpMain.flash.loadGallery('gal'+galNo);
							Logger.debug('Loading gallery ' + galNo);
						}
						else {
							cgpMain.showLoading();
							Logger.error("Can't load gallery [1] !!!!");
							cgpMain.getGalleryHandle();
							if (!cgpMain.isIE6()){
								cgpMain.currentPage = '';
								cgpMain.currentGal = -1;
								setTimeout("cgpMain.gotoPage('gallery', "+galNo+")", 1000);
							}
							return;
						}
					}
					catch (e) {
						cgpMain.showLoading();
						Logger.error("Can't load gallery [2] !!!!");
						cgpMain.getGalleryHandle();
						if (!cgpMain.isIE6()){
							cgpMain.currentPage = '';
							cgpMain.currentGal = -1;
							setTimeout("cgpMain.gotoPage('gallery', "+galNo+")", 1000);
						}
						return;
					}

				break;

			case 'pricing' :

				$('#pricingMenuItem').css('font-weight', 'bold')
				$('#pricingPage').show();

				// Get max dimension of flash gallery
				var w = Math.min($('#pricingImg').height(), $('#pricingImg').width());
				
				$('.pageText').css('height', w );


				$('.pageText').vAlign();
				$('.pageGal').vAlign();
				$('#pricingImg').vAlign();

				//$('.pageText').jScrollPane({showArrows:false, scrollbarWidth: 10, arrowSize: 16});		

				break;

			case 'products' :
			
				$('#productsMenuItem').css('font-weight', 'bold');
				$('#productsPage').show();
			
				// Want to keep a 750:500 ratio for flash object
				var nh = Math.round($('.pageGalProduct').width() * 500 / 750);
				$('.pageGalProduct').height(nh); 
				
				$('.pageGalDescProduct').height( $('#menuContainer').height() - nh - 10 - 20);
				
				cgpMain.gotoProductGallery(1);
					
				break;

			case 'contact' :
			
				$('#contactPage').show();
				$('#contactMenuItem').css('font-weight', 'bold');
				
				$('.pageText').height( $('#contactForm').height() );
				
				$('.pageGal').vAlign();
				$('.pageText').vAlign();

				Date.firstDayOfWeek = 7;
				Date.format = 'yyyy-mm-dd';
				$('.date-pick').datePicker({clickInput:true, createButton:false});
			
				break;
/*
			case 'blog' :
				window.open ("http://charlottegeary.livejournal.com","Charlotte Geary Blog"); 
				break;
*/						
			case 'information' :

				cgpMain.pageMode = 'big';
				
				$('#infoMenuItem').css('font-weight', 'bold')
				$('#infoPage').show();

				//var h = $('#menuContainer').height();
				var h = $('.infoPageText').height();

				$("#container").height(h);
				$('#menuContainer').height(h);
				$('#galleryContainer').height(h);
					
				break;
		}
		
		cgpMain.hideLoading();

				
	},
	
	// //////////////////////////////////////////////////////////////////////////////
	
	getGalleryHandle : function(){
						
		cgpMain.handleAttempts = cgpMain.handleAttempts + 1;
						
		Logger.debug("getting gallery handle ");
		
		var isIE = navigator.appName.indexOf("Microsoft") != -1;
  		cgpMain.flash = (isIE) ? window['galleryFlashObj'] : document['galleryFlashObj'];
  		
  		try {
	  		if (cgpMain.flash.loadGallery){
	  			Logger.debug("getGalleryHandle: got handle ok!");
	  		}
	  		else {
	  			Logger.error("getGalleryHandle [1]: Can't get a handle to the flash object " + cgpMain.flash.loadGallery);
  				setTimeout("cgpMain.getGalleryHandle()", 10);
  				return;
	  		}
  		}
  		catch(e){
  			Logger.error("getGalleryHandle [2]: Can't get a handle to the flash object " + cgpMain.flash.loadGallery);
  			setTimeout("cgpMain.getGalleryHandle()", 10);
  		}
  		 	
	},

	// //////////////////////////////////////////////////////////////////////////////

	getProductGalleryHandle : function(){
		var isIE = navigator.appName.indexOf("Microsoft") != -1;
  		cgpMain.prodFlash = (isIE) ? window['productGalFlashObj'] : document['productGalFlashObj'];

  		try {
	  		if (cgpMain.prodFlash.loadGallery){
	  			Logger.debug("getProductGalleryHandle: got handle ok!");
	  		}
	  		else {
	  			Logger.error("getProductGalleryHandle: Can't get a handle to the flash object " + cgpMain.prodFlash.loadGallery);
  				setTimeout("cgpMain.getProductGalleryHandle()", 10);
	  		}
  		}
  		catch(e){
  			Logger.error("getProductGalleryHandle: Can't get a handle to the flash object " + cgpMain.prodFlash.loadGallery);
  			setTimeout("cgpMain.getProductGalleryHandle()", 10);
  		}
	},
		
	// //////////////////////////////////////////////////////////////////////////////
	
	gotoGallery : function(galNo){
				
		cgpMain.gotoPage('gallery', galNo);

		// Get a handle to the gallery
		//cgpMain.getGalleryHandle();
/*
		try {
			cgpMain.gotoPage('gallery', galNo);
			Logger.debug('Loading gallery ' + galNo);
//			cgpMain.flash.loadGallery('gal'+galNo); 	
		}
		catch (e) {
			Logger.error('Gallery not defined ' + e);
			cgpMain.getGalleryHandle();
			setTimeout("cgpMain.gotoGallery('"+galNo+"')", 1000);
			return;
		}
*/	
	},

	// //////////////////////////////////////////////////////////////////////////////
	
	gotoProductGallery : function(galNo){
				
		// Reset all menuItems...
		$('.nav').css('font-weight', 'normal')
			
		if (cgpMain.prodFlash.loadGallery){
			Logger.debug('Loading product gallery ' + galNo);
			cgpMain.prodFlash.loadGallery('gal'+galNo); 	
			$('#prodGal' + galNo).css('font-weight', 'bold')
		}
		else {
			Logger.error('Product gallery not defined');
			cgpMain.getProductGalleryHandle();
			setTimeout("cgpMain.gotoProductGallery('"+galNo+"')", 1000);
			return;
		}
		
	},

	// //////////////////////////////////////////////////////////////////////////////

	/**
	* Respond to a product image being loaded, and show the title/caption
	*/
	onProductImageLoaded : function(title, caption){
//		Logger.debug(title + '  ' + caption);
	},

	// //////////////////////////////////////////////////////////////////////////////

	onProductGalleryLoaded : function(title, description){
		Logger.debug(title + '  ' + description);
		$('#productGalleryDesc').html(description);
		$('#productGalleryTitle').html(title);
	},
	
	// //////////////////////////////////////////////////////////////////////////////
	
	isPlaying : true,
	
	onTogglePlay : function(){
	
		if (cgpMain.isPlaying){
			$("#toggleShowText").html("play");
			cgpMain.isPlaying = false;
		}
		else {
			$("#toggleShowText").html("pause");
			cgpMain.isPlaying = true;
		}
		cgpMain.flash.togglePlay();				
	},
	
	// //////////////////////////////////////////////////////////////////////////////

	onNextImg : function(){
		if (cgpMain.isPlaying) {
			$("#toggleShowText").html("play");
			cgpMain.isPlaying = false;
		}
		cgpMain.flash.nextImage();				
	},
	
	// //////////////////////////////////////////////////////////////////////////////

	onPrevImg : function(){
		if (cgpMain.isPlaying) {
			$("#toggleShowText").html("play");
			cgpMain.isPlaying = false;
		}
		cgpMain.flash.prevImage();				
	},
	
	// //////////////////////////////////////////////////////////////////////////////

	roundCorners : function(){

		if (!$.browser.msie){

			if ($.browser.mozilla && $.browser.version.substr(0,3)=="1.9"){
/*
				$('#menuContainer').corners("top-left bottom-left");
				$('#galleryContainer').corners("top-right bottom-right");
*/
				$('#container').corners();
				Logger.debug("Setting rounded corners (FF3)");
			}
			
			if ($.browser.safari){
				$('#container').corners();
				Logger.debug("Setting rounded corners (Safari)");
			}
		}
		
	},

	// //////////////////////////////////////////////////////////////////////////////
	
	onFlashError : function(msg, src){
		Logger.showDebugWindow();
		Logger.error(src + ": " + msg);
	}
	
}	
