/**
 * Class to handle interaction with the slide show pro gallery component
 * 
 * @author Mike Pritchard
 * @since February 4th, 2009
 */
SPGallery = {
	
	flash : '',
//	swf_url : 'http://cgp.local.com/code/flash/spGallery.swf',
	swf_url : 'spGallery.swf',
	
		// ////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Print the file uploader form
	 * 
	 * @param {Object} targetDiv
	 */
	paint : function(targetDiv) {

		var w = '100%';
		var h = '100%';
		
		$(targetDiv).flash({
//		    wmode: 'transparent',
			 id: 'thebeGal_flashObject',
		    src: SPGallery.swf_url,
		    width: w,
		    height: h
		});

  		
 		//alert(SPGallery.flash);

	},

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
	},
	
	// ////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	* Respond to the user selecting a gallery by loading that gallery into the
	* flash gallery component (its already loaded, but just needs to be selected)
	*/
	onGallerySelected : function(){
	}
	
}