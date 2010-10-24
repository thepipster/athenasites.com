var thebeGallery = {

	// Major version of Flash required
	requiredMajorVersion : 9,
	
	// Minor version of Flash required
	requiredMinorVersion : 0,
	
	// Minor version of Flash required
	requiredRevision : 0,

	// flag set if flash detected
	hasFlash : false,
	
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
								
		if (thebeGallery.hasFlash){				
			// Clear the div as fast as possible			
			document.getElementById('content').innerHTML = "";		
		}		
		
		// If flash is available, use it - otherwise use the JS x-fader															
		if (thebeGallery.hasFlash){				
			setTimeout("thebeGallery.paintGallery()", 200);
		}
		else {
			if (options.images != undefined){
				apolloFullScreenXfader.imageList = options.images;
				apolloFullScreenXfader.start('#content');
			}
		}
			
	},
		
	// /////////////////////////////////////////////////////////////////////////////////
	
	paintGallery : function(){
	
		var flashvars = { 
			xmlFile: thebeGallery.flashXML, 
			startGal: 1,
			startImg: 0 
		};
		
		var params = {
		  menu: "false",
		  wmode: 'transparent',
		  bgcolor: '#ccc'

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
	
		if (thebeGallery.hasFlash){				
			var isIE = navigator.appName.indexOf("Microsoft") != -1;
	  		var flashObj = (isIE) ? window['thebeGal_flashObject'] : document['thebeGal_flashObject'];
	  		flashObj.nextImage();	
		}
		else {
			apolloFullScreenXfader.nextImage();
		}	
	},
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	prevImage : function(){

		if (thebeGallery.hasFlash){				
			var isIE = navigator.appName.indexOf("Microsoft") != -1;
	  		var flashObj = (isIE) ? window['thebeGal_flashObject'] : document['thebeGal_flashObject'];
	  		flashObj.prevImage();	
		}
		else {
			apolloFullScreenXfader.prevImage();
		}	

	},
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	togglePlay : function(){

		if (thebeGallery.hasFlash){				
			var isIE = navigator.appName.indexOf("Microsoft") != -1;
	  		var flashObj = (isIE) ? window['thebeGal_flashObject'] : document['thebeGal_flashObject'];
	  		flashObj.togglePlay();		
		}
		else {
			apolloFullScreenXfader.togglePlay();
		}	

	}
		
}