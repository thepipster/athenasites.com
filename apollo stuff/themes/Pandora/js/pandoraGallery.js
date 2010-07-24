var pandoraGallery = {

	// Major version of Flash required
	requiredMajorVersion : 8,
	
	// Minor version of Flash required
	requiredMinorVersion : 0,
	
	// Minor version of Flash required
	requiredRevision : 0,

	// flag set if flash detected
	hasFlash : false,

	targetDiv : 'content',
	
	flashXML : '',
	flashSWF : '',
	
	// /////////////////////////////////////////////////////////////////////////////////

	preInit : function(){
		pandoraGallery.hasFlash = DetectFlashVer(pandoraGallery.requiredMajorVersion, pandoraGallery.requiredMinorVersion, pandoraGallery.requiredRevision);
	},
	
	// /////////////////////////////////////////////////////////////////////////////////
		
	init : function(options){

		pandoraGallery.flashXML = options.xml;
		pandoraGallery.flashSWF = options.swf;		
		pandoraGallery.targetDiv = options.targetDiv;
								
		if (pandoraGallery.hasFlash){				
			// Clear the div as fast as possible			
			document.getElementById(pandoraGallery.targetDiv).innerHTML = "";		
			setTimeout("pandoraGallery.paintGallery()", 200);
		}		
															
		// Setup display dimensions			
		//setTimeout("pandoraGallery.onResize()", 100);
		pandoraGallery.onResize();		
							
		// Set resize listener
		$(window).resize(pandoraGallery.onResize);
								
	},
		
	// /////////////////////////////////////////////////////////////////////////////////
	
	paintGallery : function(){
	
		var txt = "";
		txt += "<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0' width='100%' height='100%' id='homeGalFlashObject' align='left'>";
		txt += "	<param name='allowScriptAccess' value='sameDomain' /> ";
		txt += "	<param name='wmode' value='transparent' /> ";
		txt += "	<param name='movie' value='"+pandoraGallery.flashSWF+"'/> ";
		txt += "	<param name='quality' value='high' /> ";
		txt += "	<param name='bgcolor' value='#cccccc' /> ";
		txt += "	<param name='FlashVars' value='xmlFile="+pandoraGallery.flashXML+"' /> ";
		txt += "	<embed FlashVars='xmlFile="+pandoraGallery.flashXML+"' src='"+pandoraGallery.flashSWF+"' quality='high' bgcolor='#cccccc' wmode='transparent' width='100%' height='100%' name='homeGalFlashObject' align='left' allowScriptAccess='sameDomain' type='application/x-shockwave-flash' pluginspage='http://www.macromedia.com/go/getflashplayer' /> ";
		txt += "</object>";
			
		//document.getElementById('galleryWrapper').innerHTML = txt;
		$('#'+pandoraGallery.targetDiv).html(txt);
	},
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	onResize : function(){
	
		if (!pandoraGallery.hasFlash) {
			//var cH = $(document).height() - $('#footerNav').height();
			//alert($("#content").height() + " " + $('#footerNav').height());
			
			//$('#noFlashWrapper').height($("#content").height());
			//$('#noFlashWrapper').height($(document).height() - $('#footerNav').height()-50);
		}
	
/*
		if (pandoraGallery.hasFlash){
			
			var galH = $("#wrapper").height() - $("#nav_container").height();	
			if (galH > pandoraGallery.maxHeight) galH = pandoraGallery.maxHeight;						
			var galW = Math.floor(pandoraGallery.imgRatio * galH);	
								
			if (galW > pandoraGallery.minWidth){
			
				$("#nav_container").width(galW);	
				$("#container").width(galW);	
									
				$("#homeGalFlashObject").width(galW);
				$("#homeGalFlashObject").height(galH);
				
				$("#"+pandoraGallery.targetDiv).height(galH);
				$("#"+pandoraGallery.targetDiv).width(galW);
				
			}
		}
*/	
	}

}