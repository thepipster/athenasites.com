var pandoraMiniGallery = {
	
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
		pandoraMiniGallery.hasFlash = DetectFlashVer(pandoraMiniGallery.requiredMajorVersion, pandoraMiniGallery.requiredMinorVersion, pandoraMiniGallery.requiredRevision);
	},
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	flashXML : '',
	flashSWF : '',
	
	init : function(options){

		pandoraMiniGallery.imgWidth = options.width;
		pandoraMiniGallery.imgHeight = options.height;
		pandoraMiniGallery.maxHeight = options.maxHeight;
		pandoraMiniGallery.minWidth = options.minWidth;

		pandoraMiniGallery.flashXML = options.xml;
		pandoraMiniGallery.flashSWF = options.swf;		
		pandoraMiniGallery.targetDiv = options.div;		
								
		if (pandoraMiniGallery.hasFlash){				
			// Clear the div as fast as possible			
			//document.getElementById(pandoraMiniGallery.targetDiv).innerHTML = "";		
			$('#'+pandoraMiniGallery.targetDiv).html("");
		}		
													
		//$(document).ready(pandoraMiniGallery.doInit);
		// Optimize size for gallery
		pandoraMiniGallery.imgRatio = pandoraMiniGallery.imgWidth / pandoraMiniGallery.imgHeight;
		
		// Setup display dimensions			
		pandoraMiniGallery.onResize();		
		
		if (pandoraMiniGallery.hasFlash){				
			setTimeout("pandoraMiniGallery.paintGallery()", 200);
		}
			
		// Set resize listener
		// TODO: Should append listener to any existing
		$(window).resize(pandoraMiniGallery.onResize);
		
	},
		
	// /////////////////////////////////////////////////////////////////////////////////
	
	paintGallery : function(){
	
		var txt = "";
		txt += "<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0' width='100%' height='100%' id='miniGalFlashObject' align='top' salign='t'>";
		txt += "	<param name='allowScriptAccess' value='sameDomain' /> ";
		txt += "	<param name='wmode' value='transparent' /> ";
		txt += "	<param name='movie' value='"+pandoraMiniGallery.flashSWF+"'/> ";
		txt += "	<param name='quality' value='high' /> ";
		txt += "	<param name='bgcolor' value='#cccccc' /> ";
		txt += "	<param name='FlashVars' value='xmlFile="+pandoraMiniGallery.flashXML+"' /> ";
		txt += "	<embed FlashVars='xmlFile="+pandoraMiniGallery.flashXML+"' src='"+pandoraMiniGallery.flashSWF+"' quality='high' bgcolor='#cccccc' wmode='transparent' width='100%' height='100%' name='miniGalFlashObject' align='top' salign='t' allowScriptAccess='sameDomain' type='application/x-shockwave-flash' pluginspage='http://www.macromedia.com/go/getflashplayer' /> ";
		txt += "</object>";
	
		//document.getElementById('galleryWrapper').innerHTML = txt;
		$('#'+pandoraMiniGallery.targetDiv).html(txt);
		pandoraMiniGallery.onResize();
	},
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	onResize : function(){

		if (pandoraMiniGallery.hasFlash){
			
			var galH = $("#wrapper").height() - $("#nav_container").height();	
			if (galH > pandoraMiniGallery.maxHeight) galH = pandoraMiniGallery.maxHeight;						
			var galW = Math.floor(pandoraMiniGallery.imgRatio * galH);	
								
			if (galW > pandoraMiniGallery.minWidth){
			
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