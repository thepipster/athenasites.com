var apolloMiniGallery = {
	
	/** Width of flash gallery viewer */
	imgWidth : 1350,
	
	/** Height of flash gallery viewer */
	imgHeight : 800,

	/** Ratio of width to height */
	imgRatio : 0,
	
	/** Minimum allowed width */
	minWidth : 800,

	/** Maximum height, to avoid image scaling */	
	maxHeight : 800,
	
	// Major version of Flash required
	requiredMajorVersion : 8,
	
	// Minor version of Flash required
	requiredMinorVersion : 0,
	
	// Minor version of Flash required
	requiredRevision : 0,

	// flag set if flash detected
	hasFlash : false,

	// /////////////////////////////////////////////////////////////////////////////////

	preInit : function(){
		apolloMiniGallery.hasFlash = DetectFlashVer(apolloMiniGallery.requiredMajorVersion, apolloMiniGallery.requiredMinorVersion, apolloMiniGallery.requiredRevision);
	},
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	flashXML : '',
	flashSWF : '',
	
	init : function(options){

		apolloMiniGallery.imgWidth = options.width;
		apolloMiniGallery.imgHeight = options.height;
		apolloMiniGallery.maxHeight = options.maxHeight;
		apolloMiniGallery.minWidth = options.minWidth;

		apolloMiniGallery.flashXML = options.xml;
		apolloMiniGallery.flashSWF = options.swf;		
		apolloMiniGallery.targetDiv = options.div;		
								
		if (apolloMiniGallery.hasFlash){				
			// Clear the div as fast as possible			
			//document.getElementById(apolloMiniGallery.targetDiv).innerHTML = "";		
			$('#'+apolloMiniGallery.targetDiv).html("");
		}		
													
		//$(document).ready(apolloMiniGallery.doInit);
		// Optimize size for gallery
		apolloMiniGallery.imgRatio = apolloMiniGallery.imgWidth / apolloMiniGallery.imgHeight;
		
		// Setup display dimensions			
		apolloMiniGallery.onResize();		
		
		if (apolloMiniGallery.hasFlash){				
			setTimeout("apolloMiniGallery.paintGallery()", 200);
		}
			
		// Set resize listener
		// TODO: Should append listener to any existing
		$(window).resize(apolloMiniGallery.onResize);
		
	},
		
	// /////////////////////////////////////////////////////////////////////////////////
	
	paintGallery : function(){
	
		var txt = "";
		txt += "<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0' width='100%' height='100%' id='miniGalFlashObject' align='top' salign='t'>";
		txt += "	<param name='allowScriptAccess' value='sameDomain' /> ";
		txt += "	<param name='wmode' value='transparent' /> ";
		txt += "	<param name='movie' value='"+apolloMiniGallery.flashSWF+"'/> ";
		txt += "	<param name='quality' value='high' /> ";
		txt += "	<param name='bgcolor' value='#cccccc' /> ";
		txt += "	<param name='FlashVars' value='xmlFile="+apolloMiniGallery.flashXML+"' /> ";
		txt += "	<embed FlashVars='xmlFile="+apolloMiniGallery.flashXML+"' src='"+apolloMiniGallery.flashSWF+"' quality='high' bgcolor='#cccccc' wmode='transparent' width='100%' height='100%' name='miniGalFlashObject' align='top' salign='t' allowScriptAccess='sameDomain' type='application/x-shockwave-flash' pluginspage='http://www.macromedia.com/go/getflashplayer' /> ";
		txt += "</object>";
	
		//document.getElementById('galleryWrapper').innerHTML = txt;
		$('#'+apolloMiniGallery.targetDiv).html(txt);
		apolloMiniGallery.onResize();
	},
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	onResize : function(){

		if (apolloMiniGallery.hasFlash){
			
			var galH = $("#wrapper").height() - $("#nav_container").height();	
			if (galH > apolloMiniGallery.maxHeight) galH = apolloMiniGallery.maxHeight;						
			var galW = Math.floor(apolloMiniGallery.imgRatio * galH);	
								
			if (galW > apolloMiniGallery.minWidth){
			
				$("#nav_container").width(galW);	
				$("#container").width(galW);	
									
				//$("#miniGalFlashObject").width(galW);
				//$("#miniGalFlashObject").height(galH);
				
				$("#content").height(galH);
				$("#content").width(galW);
				
			}
		}
		
	}

}