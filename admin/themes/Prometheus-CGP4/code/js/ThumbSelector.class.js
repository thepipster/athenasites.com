/**
 * Class to handle the Js side of the Flash file uploader
 * 
 * @author Mike Pritchard
 * @since November 3rd, 2007
 */
ThumbSelector = {
	
	flash : '',
	swf_url : 'http://cgp.local.com/code/flash/thumbViewer.swf',
	
	// ////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Print the file uploader form
	 * 
	 * @param {Object} targetDiv
	 */
	paint : function(targetDiv, w, h) {

/*
		text = "";
	
		text += "   <div style='visibility:hidden;'> \n";
		text += "      <object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0' width='"+w+"' height='"+h+"' id='flashObject' align='middle'> \n";
		text += "         <param name='allowScriptAccess' value='sameDomain' /> \n";
//		text += "         <param name='wmode' value='transparent'>";
		text += "         <param name='movie' value='"+ThumbSelector.swf_url+"' /> \n";
		text += "         <param name='quality' value='high' /> \n";
		text += "          <param name='bgcolor' value='#ffffff' /> \n";
		text += "         <embed src='"+ThumbSelector.swf_url+"' quality='high' bgcolor='#ffffff' width='"+w+"' height='"+h+"' wmode='transparent' name='flashObject' align='middle' allowScriptAccess='sameDomain' type='application/x-shockwave-flash' pluginspage='http://www.macromedia.com/go/getflashplayer' /> \n";
		text += "      </object> \n";
		text += "   </div>	 \n";		

		
		$(targetDiv).html(text);

*/

		$(targetDiv).flash({
		    wmode: 'transparent',
			 id: 'ThumbSelector_flashObject',
		    src: ThumbSelector.swf_url,
		    width: w,
		    height: h
		});

		var isIE = navigator.appName.indexOf("Microsoft") != -1;
  		ThumbSelector.flash = (isIE) ? window['ThumbSelector_flashObject'] : document['ThumbSelector_flashObject'];
  		
//  		alert(ThumbSelector.flash);

	},


	// ////////////////////////////////////////////////////////////////////////////////////////////////////////

	setImageList : function(thumbList){
/*	
		if (!ThumbSelector.flash.setImageList || ThumbSelector.flash.setImageList == 'undefined'){
			alert("ThumbSelector.setImageList('"+thumbList+"')");
			setTimeout("ThumbSelector.setImageList('"+thumbList+"')", 100);
			return;
		}
*/			
		//alert(ThumbSelector.flash);
		
		var imgString = "";
		
		for (i=0; i<thumbList.length; i++){
			imgString += thumbList[i];
			if (i != thumbList.length-1){
				imgString += ",";
			}
		}

		ThumbSelector.flash.setImageList(imgString);
		
	},
	
	// ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
// ExternalInterface.addCallback("setImageList", this, setImageList);
// ExternalInterface.addCallback("onImageSelected", this, onImageSelected);

	onImageSelected : function(){
		ThumbSelector.flash.setImageList(imgString);
	},
	
	// ////////////////////////////////////////////////////////////////////////////////////////////////////////

	onSelectImage : function(no){
		alert(no);
	}
}