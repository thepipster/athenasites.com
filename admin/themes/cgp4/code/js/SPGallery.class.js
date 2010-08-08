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
			 id: 'SPGallery_flashObject',
		    src: SPGallery.swf_url,
		    width: w,
		    height: h
		});

		var isIE = navigator.appName.indexOf("Microsoft") != -1;
  		SPGallery.flash = (isIE) ? window['SPGallery_flashObject'] : document['SPGallery_flashObject'];
  		
 		//alert(SPGallery.flash);

	},


	// ////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	* Respond to the user selecting a gallery by loading that gallery into the
	* flash gallery component (its already loaded, but just needs to be selected)
	*/
	onGallerySelected : function(){
	}
	
}