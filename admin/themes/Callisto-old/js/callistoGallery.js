var callistoGallery = {

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
		callistoGallery.hasFlash = DetectFlashVer(callistoGallery.requiredMajorVersion, callistoGallery.requiredMinorVersion, callistoGallery.requiredRevision);
	},
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	flashXML : '',
	flashSWF : '',
	
	init : function(options){

		callistoGallery.flashXML = options.xml;
		callistoGallery.flashSWF = options.swf;		
		callistoGallery.imgWidth = options.width;
		callistoGallery.imgHeight = options.height;
		callistoGallery.maxHeight = options.maxHeight;
		callistoGallery.minWidth = options.minWidth;
								
		if (callistoGallery.hasFlash){				
			// Clear the div as fast as possible			
			document.getElementById('content').innerHTML = "";		
			///$('#content').html("");
		}		
													
		//$(document).ready(callistoGallery.doInit);
		// Optimize size for gallery
		callistoGallery.imgRatio = callistoGallery.imgWidth / callistoGallery.imgHeight;
		
		// Setup display dimensions			
		callistoGallery.onResize();		
		
		if (callistoGallery.hasFlash){				
			setTimeout("callistoGallery.paintGallery()", 200);
		}
			
		// Set resize listener
		// TODO: Should append listener to any existing
		$(window).resize(callistoGallery.onResize);
		
	},
		
	// /////////////////////////////////////////////////////////////////////////////////
	
	paintGallery : function(){
	
		var txt = "";
		txt += "<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0' width='100%' height='100%' id='homeGalFlashObject' align='left'>";
		txt += "	<param name='allowScriptAccess' value='sameDomain' /> ";
		txt += "	<param name='wmode' value='transparent' /> ";
		txt += "	<param name='movie' value='"+callistoGallery.flashSWF+"'/> ";
		txt += "	<param name='quality' value='high' /> ";
		txt += "	<param name='bgcolor' value='#cccccc' /> ";
		txt += "	<param name='FlashVars' value='xmlFile="+callistoGallery.flashXML+"' /> ";
		txt += "	<embed FlashVars='xmlFile="+callistoGallery.flashXML+"' src='"+callistoGallery.flashSWF+"' quality='high' bgcolor='#cccccc' wmode='transparent' width='100%' height='100%' name='homeGalFlashObject' align='left' allowScriptAccess='sameDomain' type='application/x-shockwave-flash' pluginspage='http://www.macromedia.com/go/getflashplayer' /> ";
		txt += "</object>";
	
		//document.getElementById('galleryWrapper').innerHTML = txt;
		$('#content').html(txt);
		callistoGallery.onResize();
	},
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	onResize : function(){

		if (callistoGallery.hasFlash){
			
			var galH = $("#wrapper").height() - $("#nav_container").height();	
			if (galH > callistoGallery.maxHeight) galH = callistoGallery.maxHeight;						
			var galW = Math.floor(callistoGallery.imgRatio * galH);	
								
			if (galW > callistoGallery.minWidth){
			
				$("#nav_container").width(galW);	
				$("#container").width(galW);	
									
				$("#homeGalFlashObject").width(galW);
				$("#homeGalFlashObject").height(galH);
				
				$("#content").height(galH);
				$("#content").width(galW);
				
			}
		}
		
	}

}