var cgp3Main = {

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
	
	// //////////////////////////////////////////////////////////////////////////////

	init : function(){
		
		// Tell google!
		//cgp3Main.pageTracker = _gat._getTracker("UA-534928-3");
		//cgp3Main.pageTracker._trackPageview();
		
		// Setup menu			
		$('#navigation').css('display', 'inline');
//		$('#navigation').fadeIn();
		
		$('#navigation').accordion({ 
		    active: false, 
		    header: '.menuHead', 
		    navigation: true,
		    event: 'mouseover'
		});		
		
		// Optimize size for gallery
		cgp3Main.imgRatio = cgp3Main.imgWidth / cgp3Main.imgHeight;

		$('#menuContainer').corners("top-left bottom-left");
		$('#galleryContainer').corners("top-right bottom-right");
		$('#container').vAlign();

		// Load the home page
		cgp3Main.gotoPage('home');
		
		cgp3Main.onResize();
		
	},

	// //////////////////////////////////////////////////////////////////////////////

	getGalleryHandle : function(){
	
		var isIE = navigator.appName.indexOf("Microsoft") != -1;
  		cgp3Main.flash = (isIE) ? window['flashObject'] : document['flashObject'];
  		
  		try {
	  		if (cgp3Main.flash.loadGallery){
	  			Logger.debug("getGalleryHandle: got handle ok!");
	  		}
  		}
  		catch(e){
  			Logger.error("getGalleryHandle: Can't get a handle to the flash object");
  			setTimeout("cgp3Main.getGalleryHandle()", 1000);
  		}
  	
	},

	// //////////////////////////////////////////////////////////////////////////////

	getProductGalleryHandle : function(){
		var isIE = navigator.appName.indexOf("Microsoft") != -1;
  		cgp3Main.prodFlash = (isIE) ? window['productGalFlashObj'] : document['productGalFlashObj'];
	},
		
	// //////////////////////////////////////////////////////////////////////////////

	onResize : function(){

		Logger.debug("Starting resize");
		
		$('#menuContainer').width(200);

		var containerH = $('#menuContainer').height();
		var menuW = $('#menuContainer').width();

		Logger.info("Start container width = " + $('#container').width() + " height = " + containerH);

		Logger.info("Img Ratio = " + cgp3Main.imgRatio);


		// Get teh new widths of the gallery and container	
		var galW = Math.round(cgp3Main.imgRatio * containerH);
		var containerW = Math.round(galW + menuW);

		Logger.info("menuW = " + menuW + " galW = " + galW);
		Logger.info("containerH = " + containerH + " containerW = " + containerW);
		
		// Resize container, logo and footer...
		$('#container').css('width', containerW);			
				
		Logger.debug("Finished resize");
		
	},
	
	// //////////////////////////////////////////////////////////////////////////////
	
	currentPage : '',
	currentGal : 0,
	
	gotoPage : function(page, galNo){
	
		if (page == 'gallery'){
			if (galNo == cgp3Main.currentGal){
				Logger.warn("Gallery ("+galNo+") already loaded!");
				return;
			}
		}
		else if (cgp3Main.currentPage == page){
			Logger.warn("Page already loaded!");
			return;
		}
		
		Logger.info("Loading page '" + page + "'");
		
		if (galNo){
			cgp3Main.currentGal = galNo;
		}
		cgp3Main.currentPage = page;
		
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

		$('#galleryContainer').css('background-image', "url('res/branch_large.png')");

		switch(page){

			case 'home' :
			
				$('#homePage').show();

				$('#galleryContainer').css('background-image', "url('')");

				break;
						
			case 'gallery' :
			
				$('#galleryPage').show();
				$('#gal'+galNo).css('font-weight', 'bold')

				$('#galleryContainer').css('background-image', "url('')");

				var text = "";
				text += "	<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0' width='100%' height='100%' id='flashObject' align='middle'>";
				text += "		<param name='allowScriptAccess' value='sameDomain' /> ";
				text += "		<param name='wmode' value='transparent' />  ";
				text += "		<param name='movie' value='spGallery.swf' />  ";
				text += "		<param name='quality' value='high' />  ";
				text += "		<param name='bgcolor' value='#ffffff' />  ";
				text += "		<param name='FlashVars' value='startGal=gal"+galNo+"' /> ";
				text += "		<embed FlashVars='startGal=gal"+galNo+"' src='spGallery.swf' quality='high' bgcolor='#ffffff' wmode='transparent' width='100%' height='100%' name='flashObject' align='middle' allowScriptAccess='sameDomain' type='application/x-shockwave-flash' pluginspage='http://www.macromedia.com/go/getflashplayer' />  ";
				text += "	</object> ";

				$('#galleryPage').html(text);

				break;

			case 'pricing' :

				$('#pricingMenuItem').css('font-weight', 'bold')
				$('#pricingPage').show();

				// Get max dimension of flash gallery
				var w = Math.min($('#pricingImg').height(), $('#pricingImg').width());

				$('.pageText').height( w );
		
				$('.pageText').vAlign();
				$('.pageGal').vAlign();
				$('#pricingImg').vAlign();

				break;

			case 'products' :
			
				$('#productsMenuItem').css('font-weight', 'bold');
				$('#productsPage').show();
			
				// Want to keep a 750:500 ratio for flash object
				var nh = Math.round($('.pageGalProduct').width() * 500 / 750);
				$('.pageGalProduct').height(nh); 
				
				//alert(nh)
				// Load first gallery
				cgp3Main.gotoProductGallery(1);
					
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

				$('#infoMenuItem').css('font-weight', 'bold')
				$('#infoPage').show();
				
				// Get max dimension of flash gallery
				var w = Math.min($('.pageGal').height(), $('.pageGal').width());
				$('.pageText').height( w );
		
				$('.pageText').vAlign();
				$('.pageGal').vAlign();
		
				break;
		}
	},
	
	// //////////////////////////////////////////////////////////////////////////////
	
	gotoGallery : function(galNo){
				
		cgp3Main.gotoPage('gallery', galNo);

		// Get a handle to the gallery
		cgp3Main.getGalleryHandle();

/*
		try {
			cgp3Main.gotoPage('gallery', galNo);
			Logger.debug('Loading gallery ' + galNo);
//			cgp3Main.flash.loadGallery('gal'+galNo); 	
		}
		catch (e) {
			Logger.error('Gallery not defined ' + e);
			cgp3Main.getGalleryHandle();
			setTimeout("cgp3Main.gotoGallery('"+galNo+"')", 1000);
			return;
		}
*/	
	},

	// //////////////////////////////////////////////////////////////////////////////
	
	gotoProductGallery : function(galNo){
				
		// Reset all menuItems...
		$('.nav').css('font-weight', 'normal')
			
		if (cgp3Main.prodFlash.loadGallery){
			Logger.debug('Loading product gallery ' + galNo);
			cgp3Main.prodFlash.loadGallery('gal'+galNo); 	
			$('#prodGal' + galNo).css('font-weight', 'bold')
		}
		else {
			Logger.error('Product gallery not defined');
			cgp3Main.getProductGalleryHandle();
			setTimeout("cgp3Main.gotoProductGallery('"+galNo+"')", 1000);
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
	
		if (cgp3Main.isPlaying){
			$("#toggleShowText").html("play");
			cgp3Main.isPlaying = false;
		}
		else {
			$("#toggleShowText").html("pause");
			cgp3Main.isPlaying = true;
		}
		cgp3Main.flash.togglePlay();				
	},
	
	// //////////////////////////////////////////////////////////////////////////////

	onNextImg : function(){
		if (cgp3Main.isPlaying) {
			$("#toggleShowText").html("play");
			cgp3Main.isPlaying = false;
		}
		cgp3Main.flash.nextImage();				
	},
	
	// //////////////////////////////////////////////////////////////////////////////

	onPrevImg : function(){
		if (cgp3Main.isPlaying) {
			$("#toggleShowText").html("play");
			cgp3Main.isPlaying = false;
		}
		cgp3Main.flash.prevImage();				
	},
	
	// //////////////////////////////////////////////////////////////////////////////
	
	onFlashError : function(msg, src){
		Logger.showDebugWindow();
		Logger.error(src + ": " + msg);
	}
	
}	


// /////////////////////////////////////////////////////////////////////////////////
//
// Vertical alignment extension for jquery
//
// /////////////////////////////////////////////////////////////////////////////////
