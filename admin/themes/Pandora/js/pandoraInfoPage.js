var pandoraInfoPage = {

	setup : false,
	
	// Major version of Flash required
	requiredMajorVersion : 8,
	
	// Minor version of Flash required
	requiredMinorVersion : 0,
	
	// Minor version of Flash required
	requiredRevision : 0,

	// flag set if flash detected
	hasFlash : false,
	
	// target div
	targetDiv : 'content',
	
	flashXML : '',
	flashSWF : '',
			
	// /////////////////////////////////////////////////////////////////////////////////
	
	preInit : function(){
		pandoraInfoPage.hasFlash = DetectFlashVer(pandoraInfoPage.requiredMajorVersion, pandoraInfoPage.requiredMinorVersion, pandoraInfoPage.requiredRevision);
	},
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	init : function(options){
	
		pandoraInfoPage.flashXML = options.xml;
		pandoraInfoPage.flashSWF = options.swf;		
		pandoraInfoPage.targetDiv = options.targetDiv;

		pandoraInfoPage.onResize();
								
		if (pandoraInfoPage.hasFlash){				
			// Clear the div as fast as possible			
			document.getElementById(pandoraInfoPage.targetDiv).innerHTML = "";		
			setTimeout("pandoraInfoPage.paintGallery()", 2000);
		}
										
		// Set resize listener
		// TODO: Should append listener to any existing
		$(window).resize(pandoraInfoPage.onResize);

		setTimeout("pandoraInfoPage.onResize()", 100);
				
	},
			
	// /////////////////////////////////////////////////////////////////////////////////
	
	paintGallery : function(options){
	
		var txt = "";
		txt += "<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0' width='100%' height='100%' id='homeGalFlashObject' align='left'>";
		txt += "	<param name='allowScriptAccess' value='sameDomain' /> ";
		txt += "	<param name='wmode' value='opaque' /> ";
		txt += "	<param name='movie' value='"+pandoraInfoPage.flashSWF+"'/> ";
		txt += "	<param name='quality' value='high' /> ";
		txt += "	<param name='bgcolor' value='#cccccc' /> ";
		txt += "	<param name='FlashVars' value='xmlFile="+pandoraInfoPage.flashXML+"' /> ";
		txt += "	<embed FlashVars='xmlFile="+pandoraInfoPage.flashXML+"' src='"+pandoraInfoPage.flashSWF+"' quality='high' bgcolor='#cccccc' wmode='opaque' width='100%' height='100%' name='homeGalFlashObject' align='left' allowScriptAccess='sameDomain' type='application/x-shockwave-flash' pluginspage='http://www.macromedia.com/go/getflashplayer' /> ";
		txt += "</object>";
			
		//document.getElementById('galleryWrapper').innerHTML = txt;
		$('#'+pandoraInfoPage.targetDiv).html(txt);
	},
		
	// /////////////////////////////////////////////////////////////////////////////////

	onResize : function(){
		$('#contentTextWrapper').hide();
		$('#contentTextWrapper').fadeIn({
				duration: 500,
				complete : function(){pandoraInfoPage.doResize()}
			});
	},
	
	// /////////////////////////////////////////////////////////////////////////////////

	doResize : function(){
						
		if (pandoraInfoPage.setup){
			$('#contentText').jScrollPaneRemove();
		}
		else {
			pandoraInfoPage.setup = true;			
		}
			
			
		var pos = $('#content').position();
		var cw = $('#content').width(); 
		var ch = $('#content').height(); 
		
		//var w = Math.ceil(0.45 * cw);
		//var h = Math.ceil(0.8 * ch);
		var w = 0.4 * cw;
		var h = 0.8 * ch;
		
		// Position the container
		$('#contentTextWrapper').css('top', (ch-h)/2);
		$('#contentTextWrapper').css('left', pos.left + 60);
		$('#contentTextWrapper').width(w);
		$('#contentTextWrapper').height(h);
					
		var tw = w - parseInt($('#contentText').css('padding-left')) - parseInt($('#contentText').css('padding-right'));
		var th = h - parseInt($('#contentText').css('padding-top')) - parseInt($('#contentText').css('padding-bottom'));
		$('#contentText').width(tw);
		$('#contentText').height(th);

		//alert($('#contentTextWrapper').width() + "  " + tw);
					
		$('#contentText').jScrollPane();			
		//setTimeout("$('#contentText').jScrollPane();", 1000);
		
		
	}
}
