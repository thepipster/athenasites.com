var callistoMiniGallery = {
	
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
		callistoMiniGallery.hasFlash = DetectFlashVer(callistoMiniGallery.requiredMajorVersion, callistoMiniGallery.requiredMinorVersion, callistoMiniGallery.requiredRevision);
	},
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	flashXML : '',
	flashSWF : '',
	
	init : function(options){

		callistoMiniGallery.imgWidth = options.width;
		callistoMiniGallery.imgHeight = options.height;
		callistoMiniGallery.maxHeight = options.maxHeight;
		callistoMiniGallery.minWidth = options.minWidth;

		callistoMiniGallery.flashXML = options.xml;
		callistoMiniGallery.flashSWF = options.swf;		
		callistoMiniGallery.targetDiv = options.div;		
								
		if (callistoMiniGallery.hasFlash){				
			// Clear the div as fast as possible			
			//document.getElementById(callistoMiniGallery.targetDiv).innerHTML = "";		
			$('#'+callistoMiniGallery.targetDiv).html("");
		}		
													
		//$(document).ready(callistoMiniGallery.doInit);
		// Optimize size for gallery
		callistoMiniGallery.imgRatio = callistoMiniGallery.imgWidth / callistoMiniGallery.imgHeight;
		
		// Setup display dimensions			
		callistoMiniGallery.onResize();		
		
		if (callistoMiniGallery.hasFlash){				
			setTimeout("callistoMiniGallery.paintGallery()", 200);
		}
			
		// Set resize listener
		// TODO: Should append listener to any existing
		$(window).resize(callistoMiniGallery.onResize);
		
	},
		
	// /////////////////////////////////////////////////////////////////////////////////
	
	paintGallery : function(){
	
		var txt = "";
		txt += "<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0' width='100%' height='100%' id='miniGalFlashObject' align='top' salign='t'>";
		txt += "	<param name='allowScriptAccess' value='sameDomain' /> ";
		txt += "	<param name='wmode' value='transparent' /> ";
		txt += "	<param name='movie' value='"+callistoMiniGallery.flashSWF+"'/> ";
		txt += "	<param name='quality' value='high' /> ";
		txt += "	<param name='bgcolor' value='#cccccc' /> ";
		txt += "	<param name='FlashVars' value='xmlFile="+callistoMiniGallery.flashXML+"' /> ";
		txt += "	<embed FlashVars='xmlFile="+callistoMiniGallery.flashXML+"' src='"+callistoMiniGallery.flashSWF+"' quality='high' bgcolor='#cccccc' wmode='transparent' width='100%' height='100%' name='miniGalFlashObject' align='top' salign='t' allowScriptAccess='sameDomain' type='application/x-shockwave-flash' pluginspage='http://www.macromedia.com/go/getflashplayer' /> ";
		txt += "</object>";
	
		//document.getElementById('galleryWrapper').innerHTML = txt;
		$('#'+callistoMiniGallery.targetDiv).html(txt);
		callistoMiniGallery.onResize();
	},
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	onResize : function(){

		if (callistoMiniGallery.hasFlash){
			
			var galH = $("#wrapper").height() - $("#nav_container").height();	
			if (galH > callistoMiniGallery.maxHeight) galH = callistoMiniGallery.maxHeight;						
			var galW = Math.floor(callistoMiniGallery.imgRatio * galH);	
								
			if (galW > callistoMiniGallery.minWidth){
			
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