var apolloGallery = {

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
		apolloGallery.hasFlash = DetectFlashVer(apolloGallery.requiredMajorVersion, apolloGallery.requiredMinorVersion, apolloGallery.requiredRevision);
	},
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	flashXML : '',
	flashSWF : '',
	
	init : function(options){

		apolloGallery.flashXML = options.xml;
		apolloGallery.flashSWF = options.swf;		
		apolloGallery.imgWidth = options.width;
		apolloGallery.imgHeight = options.height;
		apolloGallery.maxHeight = options.maxHeight;
		apolloGallery.minWidth = options.minWidth;
								
		if (apolloGallery.hasFlash){				
			// Clear the div as fast as possible			
			document.getElementById('content').innerHTML = "";		
			///$('#content').html("");
		}		
													
		//$(document).ready(apolloGallery.doInit);
		// Optimize size for gallery
		apolloGallery.imgRatio = apolloGallery.imgWidth / apolloGallery.imgHeight;
		
		// Setup display dimensions			
		apolloGallery.onResize();		
		
		if (apolloGallery.hasFlash){				
			setTimeout("apolloGallery.paintGallery()", 200);
		}
			
		// Set resize listener
		// TODO: Should append listener to any existing
		$(window).resize(apolloGallery.onResize);
		
	},
		
	// /////////////////////////////////////////////////////////////////////////////////
	
	paintGallery : function(){
	
		var txt = "";
		txt += "<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0' width='100%' height='100%' id='homeGalFlashObject' align='left'>";
		txt += "	<param name='allowScriptAccess' value='sameDomain' /> ";
		txt += "	<param name='wmode' value='transparent' /> ";
		txt += "	<param name='movie' value='"+apolloGallery.flashSWF+"'/> ";
		txt += "	<param name='quality' value='high' /> ";
		txt += "	<param name='bgcolor' value='#cccccc' /> ";
		txt += "	<param name='FlashVars' value='xmlFile="+apolloGallery.flashXML+"' /> ";
		txt += "	<embed FlashVars='xmlFile="+apolloGallery.flashXML+"' src='"+apolloGallery.flashSWF+"' quality='high' bgcolor='#cccccc' wmode='transparent' width='100%' height='100%' name='homeGalFlashObject' align='left' allowScriptAccess='sameDomain' type='application/x-shockwave-flash' pluginspage='http://www.macromedia.com/go/getflashplayer' /> ";
		txt += "</object>";
	
		//document.getElementById('galleryWrapper').innerHTML = txt;
		$('#content').html(txt);
		apolloGallery.onResize();
	},
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	onResize : function(){

		if (apolloGallery.hasFlash){
			
			var galH = $("#wrapper").height() - $("#nav_container").height();	
			if (galH > apolloGallery.maxHeight) galH = apolloGallery.maxHeight;						
			var galW = Math.floor(apolloGallery.imgRatio * galH);	
								
			if (galW > apolloGallery.minWidth){
			
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