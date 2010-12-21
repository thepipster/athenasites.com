/**
 * @author mikep
 */


/**
 * This class attemps to either cross fade 2 images (from an image list), only executing the fade when the
 * next image is fully loaded 
 */
BGImageFade = {

	m_targetDiv : '',
	
	/** Image object list */
	m_imageURLList : '',
	
	m_currentImage : 0,
	
	m_prevImage : -1,
	
	/** Desired fade time, in seconds */
	m_fadeTime : 1.0,
	
	/** Minimum timestep (ms) */
	//m_Ts : 10,

	/** Start opacity */
	m_startOpacity : 0.0,
	
	/** End opacity */
	m_endOpacity : 0.5,
	
	m_imgID : '_main_img',
		
	// /////////////////////////////////////////////////////////////////////////////////////

	init : function(target_div, img_url_list, background_color){

		var text = "";
		var style = "position:absolute; top:0px; left: 0px; width:100%; height:100%; display:none; background-color:"+background_color+";";
		var noImages = img_url_list.length;

		BGImageFade.m_targetDiv 	= target_div;
		BGImageFade.m_imageURLList 	= img_url_list;		
		BGImageFade.m_imgID 		= target_div + "_main_img";
		
		// Setup the html.......
		
		text += "<div id='msg' style='position:absolute; top:100px; left: 100px;z-index:200'></div>";

		for (var i = 0; i < noImages; i++) {

			var tmpStyle = style + "z-index: 1;" 
			var img_url = img_url_list[i];
			
			var div_id = target_div + "_div_layer_"+i;
			var img_id = target_div + "_img_layer_"+i;
	
//			text += "<div id='"+div_id+"' src='' style='display:hidden; z-index: 1'>";		
			text += "   <img id='"+img_id+"' src='' style='"+tmpStyle+"'>";
//			text += "</div>";

//			text += "<img id='"+img_id+"' src='' style='width:100%; height:100%; display:hidden; z-index: 1' >";
			
		}

		$(target_div).innerHTML = text;

		// Preload the images....	
		if (BrowserDetect.browser != 'Explorer') {
			BGImageFade.m_loadCt = 0;
			BGImageFade.loadNextImage();
		}
		else {
			// Add img src's
			for (var i = 0; i < noImages; i++) {
				var img_id = target_div + "_img_layer_"+i;
				$(img_id).src = BGImageFade.m_imageURLList[i];
			}

			BGImageFade.gotoImageNo(BGImageFade.m_currentImage);
		}
		
	},
	
	// /////////////////////////////////////////////////////////////////////////////////////

	gotoImageURL : function(url) {	
		for (var i=0; i<BGImageFade.m_imageURLList.length; i++){
			var img_id = BGImageFade.m_targetDiv + "_img_layer_"+i;
			//alert($(img_id).src + "  <--> " + url);
			if ($(img_id).src == url) {
				BGImageFade.gotoImageNo(i);
			}
		}
	},

	gotoImageNo : function(no) {

		if (no < 0 || no >= BGImageFade.m_imageURLList.length)
			return;

		if (BGImageFade.m_prevImage == BGImageFade.m_currentImage)
			return;
			
		BGImageFade.m_prevImage = BGImageFade.m_currentImage;
		BGImageFade.m_currentImage = no;
		BGImageFade.startFadeIn();
	},

	// /////////////////////////////////////////////////////////////////////////////////////

	m_loadCt : 0,
	
	loadNextImage : function(){
		var img 	= new Image();
		img.onload 	= BGImageFade.onImageLoaded();
		img.src 	= BGImageFade.m_imageURLList[BGImageFade.m_loadCt];		
	},

	onImageLoaded : function(no){

		if (BGImageFade.m_loadCt < BGImageFade.m_imageURLList.length) {

			var img_id = BGImageFade.m_targetDiv + "_img_layer_" + BGImageFade.m_loadCt;
	
			$(img_id).src = BGImageFade.m_imageURLList[BGImageFade.m_loadCt];
			

			if (BGImageFade.m_loadCt == BGImageFade.m_currentImage){						
				BGImageFade.startFadeIn();
			}

			// Load the next image
			BGImageFade.m_loadCt++;
			BGImageFade.loadNextImage();

		}
	},
	
	// /////////////////////////////////////////////////////////////////////////////////////

	startFadeIn: function(){
		
		//var div_id = BGImageFade.m_targetDiv + "_div_layer_" + BGImageFade.m_currentImage;
		var div_id = BGImageFade.m_targetDiv + "_div_layer_" + BGImageFade.m_currentImage;
		var prev_div_id = BGImageFade.m_targetDiv + "_div_layer_" + BGImageFade.m_prevImage;

		var img_id = BGImageFade.m_targetDiv + "_img_layer_" + BGImageFade.m_currentImage;
		var prev_img_id = BGImageFade.m_targetDiv + "_img_layer_" + BGImageFade.m_prevImage;

		// Copy image to master img 
		//$(BGImageFade.m_imgID).src = $(img_id).src;

		$(img_id).style.display = 'hidden';

		if (BGImageFade.m_prevImage != -1) {
			$(prev_img_id).style.display = '';
			$(prev_img_id).fade({duration: BGImageFade.m_fadeTime, from: 1.0, to: 0.0});
		}
		else {
			//$(prev_img_id).style.display = 'hidden';
		}

		
		$(img_id).appear({ duration: BGImageFade.m_fadeTime, from: 0.0, to: 1.0});		
			
	}

	// /////////////////////////////////////////////////////////////////////////////////////
/*
	startFadeIn : function(){		
			
		BGImageFade.m_prevTime = new Date()

		// Reset...		
		for (var i = 0; i < BGImageFade.m_noSteps; i += BGImageFade.m_fadeInc) {
			var div_id = BGImageFade.m_targetDiv + "_fade_" + i;
			$(div_id).style.display = 'none';
		}
		
		// Force first fade
		var div_id = BGImageFade.m_targetDiv + "_fade_" + 100;
		$(div_id).style.display = '';
		
		// Show the image (hidden right now, but make visible to enable fade to reveal image)
		var div_id = BGImageFade.m_targetDiv + "_div_layer_" + BGImageFade.m_currentImage;
		$(div_id).style.display = '';
				
		// Start fade (calling all timeouts at once is much much faster then calling them in sequence)
		setTimeout("BGImageFade.doFade('100')", 10);			

//		for (var i = 0; i <= 100; i += 1) {
//			var t = (100-i) * BGImageFade.m_Ts;
//			setTimeout("BGImageFade.doFade('"+i+"')", t);			
//		}
		
	},

	// /////////////////////////////////////////////////////////////////////////////////////

	m_prevFade : 0,
	
	m_prevTime : 0,
	m_totalTime : 0,
	m_avrg : 0,
	m_loopCt : 0,
			
	doFade : function(fade_no) {

		var curTime = new Date();
		var diff = curTime.getTime() - BGImageFade.m_prevTime;
		BGImageFade.m_totalTime += diff;
		BGImageFade.m_prevTime = curTime;
		BGImageFade.m_loopCt++;
		BGImageFade.m_avrg = BGImageFade.m_totalTime / BGImageFade.m_loopCt;	
		$('msg').innerHTML = "Loop time: " + diff + " ms <br>Total Time : " + BGImageFade.m_totalTime + " ms <br>Avrg : " + BGImageFade.m_avrg + " ms";
		
		
		var no = parseInt(fade_no);
	//	alert(no);
		
		var div_id = BGImageFade.m_targetDiv + "_fade_" + BGImageFade.m_prevFade;
		$(div_id).style.display = 'none';
		
		BGImageFade.m_prevFade = no;
		
		var div_id = BGImageFade.m_targetDiv + "_fade_" + no;
		$(div_id).style.display = '';
		
		if (no >= 0) {
			var newNo = no - 1;
			setTimeout("BGImageFade.doFade('" + newNo + "')", 10);
		}
		
	}
*/
	// /////////////////////////////////////////////////////////////////////////////////////
}