var thebeGallery = {

	// Major version of Flash required
	requiredMajorVersion : 9,
	
	// Minor version of Flash required
	requiredMinorVersion : 0,
	
	// Minor version of Flash required
	requiredRevision : 0,

	// flag set if flash detected
	hasFlash : false,

	flashID : 'homeGalFlashObject',
	
	// /////////////////////////////////////////////////////////////////////////////////

	preInit : function(){
		thebeGallery.hasFlash = DetectFlashVer(thebeGallery.requiredMajorVersion, thebeGallery.requiredMinorVersion, thebeGallery.requiredRevision);
	},
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	flashXML : '',
	flashSWF : '',
	
	init : function(options){

		thebeGallery.flashXML = options.xml;
		thebeGallery.flashSWF = options.swf;		
		thebeGallery.loadingSpinner = options.loadingSpinner;
								
		if (thebeGallery.hasFlash){				
			// Clear the div as fast as possible			
			var txt = "";
			if (thebeGallery.loadingSpinner){
				txt += "<div class='flashGalWrapper'>";
				txt += "</div>";
			}
			document.getElementById('content').innerHTML = txt;		
			///$('#content').html("");
		}		
																	
		if (thebeGallery.hasFlash){				
			setTimeout("thebeGallery.paintGallery()", 200);
		}
			
	},
		
	// /////////////////////////////////////////////////////////////////////////////////
	
	paintGallery : function(){
	
		var id = thebeGallery.flashID;
		var align = "center";
		//var wmode = "transparent";
		/*
		var txt = "";
		if (thebeGallery.loadingSpinner){
			txt += "<div class='flashGalWrapper'>";
		}
		txt += "<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0' width='100%' height='100%' id='"+id+"' align='"+align+"'>";
		txt += "	<param name='allowScriptAccess' value='sameDomain' /> ";
		txt += "	<param name='wmode' value='"+wmode+"' /> ";
		txt += "	<param name='movie' value='"+thebeGallery.flashSWF+"'/> ";
		txt += "	<param name='quality' value='high' /> ";
		txt += "	<param name='bgcolor' value='#cccccc' /> ";
		txt += "	<param name='FlashVars' value='xmlFile="+thebeGallery.flashXML+"' /> ";
		txt += "	<embed FlashVars='xmlFile="+thebeGallery.flashXML+"' src='"++"' quality='high' bgcolor='#cccccc' wmode='"+wmode+"' width='100%' height='100%' name='"+id+"' align='"+align+"' allowScriptAccess='sameDomain' type='application/x-shockwave-flash' pluginspage='http://www.macromedia.com/go/getflashplayer' /> ";
		txt += "</object>";
		if (thebeGallery.loadingSpinner){
			txt += "</div>";
		}

		$('#content').html(txt);
		
	*/
	
		var flashvars = { 
			xmlFile: thebeGallery.flashXML, 
			startGal: 1,
			startImg: 5 
		};
		
		var params = {
		  menu: "false",
		  wmode: 'transparent'

		};
		var attributes = {
		  align: 'center',
		  id: "thebeGal_flashObject",
		  name: "thebeGal_flashObject"
		};
		
		swfobject.embedSWF(thebeGallery.flashSWF, "content", "100%", "100%", "9.0.0","expressInstall.swf", flashvars, params, attributes);
		
				
	},
	
	// /////////////////////////////////////////////////////////////////////////////////

	nextImage : function(){	
		var isIE = navigator.appName.indexOf("Microsoft") != -1;
  		var flashObj = (isIE) ? window['thebeGal_flashObject'] : document['thebeGal_flashObject'];
  		flashObj.nextImage();	
	},
	
	prevImage : function(){
		var isIE = navigator.appName.indexOf("Microsoft") != -1;
  		var flashObj = (isIE) ? window['thebeGal_flashObject'] : document['thebeGal_flashObject'];
  		flashObj.prevImage();	
	},
	
	togglePlay : function(){
		var isIE = navigator.appName.indexOf("Microsoft") != -1;
  		var flashObj = (isIE) ? window['thebeGal_flashObject'] : document['thebeGal_flashObject'];
  		flashObj.togglePlay();		
	}
		
}