var callistoGallery = {

	/** Width of flash gallery viewer */
	imgWidth : 1350,
	
	/** Height of flash gallery viewer */
	imgHeight : 800,

	/** Ratio of width to height */
	imgRatio : 0,

	// Major version of Flash required
	requiredMajorVersion : 8,
	
	// Minor version of Flash required
	requiredMinorVersion : 0,
	
	// Minor version of Flash required
	requiredRevision : 0,

	// flag set if flash detected
	hasFlash : false,

	flashID : 'homeGalFlashObject',
	
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
		callistoGallery.loadingSpinner = options.loadingSpinner;
								
		if (callistoGallery.hasFlash){				
			// Clear the div as fast as possible			
			var txt = "";
			if (callistoGallery.loadingSpinner){
				txt += "<div class='flashGalWrapper'>";
				txt += "</div>";
			}
			document.getElementById('content').innerHTML = txt;		
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
	
		var id = callistoGallery.flashID;
		var align = "center";
		//var wmode = "opaque";
		var wmode = "transparent";
		
		var txt = "";
		if (callistoGallery.loadingSpinner){
			txt += "<div class='flashGalWrapper'>";
		}
		txt += "<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0' width='100%' height='100%' id='"+id+"' align='"+align+"'>";
		txt += "	<param name='allowScriptAccess' value='sameDomain' /> ";
		txt += "	<param name='wmode' value='"+wmode+"' /> ";
		txt += "	<param name='movie' value='"+callistoGallery.flashSWF+"'/> ";
		txt += "	<param name='quality' value='high' /> ";
		txt += "	<param name='bgcolor' value='#cccccc' /> ";
		txt += "	<param name='FlashVars' value='xmlFile="+callistoGallery.flashXML+"' /> ";
		txt += "	<embed FlashVars='xmlFile="+callistoGallery.flashXML+"' src='"+callistoGallery.flashSWF+"' quality='high' bgcolor='#cccccc' wmode='"+wmode+"' width='100%' height='100%' name='"+id+"' align='"+align+"' allowScriptAccess='sameDomain' type='application/x-shockwave-flash' pluginspage='http://www.macromedia.com/go/getflashplayer' /> ";
		txt += "</object>";
		if (callistoGallery.loadingSpinner){
			txt += "</div>";
		}
	
		//document.getElementById('galleryWrapper').innerHTML = txt;
		$('#content').html(txt);
		//setTimeout("callistoGallery.onResize()", 2000);
		callistoGallery.onResize();
	},
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	onResize : function(){

		if (callistoGallery.hasFlash){
			
			var minH = parseInt($("#content").css("min-height"));
			var maxH = parseInt($("#content").css("max-height"));

			var galH = $("#wrapper").height() - $("#nav_container").height();	
			
			// If the requested height is more than the containers max height then ajdust
			// (but test to see if the max height is set in the style sheet first)
			if (maxH != null && maxH != undefined){
				if (galH > maxH) galH = maxH;						
			}	

			// If the height is less than the minimum height, then adjust
			if (minH != null && minH != undefined){
				if (minH > galH) galH = minH;
			}
					
			var galW = Math.floor(callistoGallery.imgRatio * galH);	
							
			//alert($("#wrapper").height() + ", " + $("#nav_container").height());
			//alert("galW = " + galW + ", galH = " + galH);
								
			
			$("#nav_container").width(galW);	
			$("#container").width(galW);	
								
			$("#"+callistoGallery.flashID).width(galW);
			$("#"+callistoGallery.flashID).height(galH);
			
			$("#content").height(galH);
			$("#content").width(galW);
																
			/*
			var flashH = $("#"+callistoGallery.flashID).height();			
			if (flashH != null && (flashH != $("#content").height())){
				alert("Setting content height to " + flashH);
				$("#content").height(flashH);
			}
			
			alert("Flash height = " + $("#"+callistoGallery.flashID).height() + "  Content Height = " + $("#content").height());
			*/
		}
		
	}

}