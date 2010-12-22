<?php
/**
* @Theme: CGP4
* @Template: Products Page
* @Description: Products Page
*/

?>
				
	<div id='productsPage' class='pageContents'>
	
		<table border="0" cellpadding="0" cellspacing="0" width="100%" height="100%">
	
			<tr>
				<td valign="top" height="100%">
				
					<div class='pageGalProduct'>

						<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0' width='100%' height='100%' id='productGalFlashObj' salign='tl'> 
							<param name='allowScriptAccess' value='sameDomain' /> 
							<param name='movie' value='code/flash/productGal.swf' /> 
							<param name='quality' value='high' /> 
							<param name='wmode' value='transparent' /> 
							<param name='bgcolor' value='#ffffff' /> 
							<embed src='code/flash/productGal.swf' quality='high' bgcolor='#ffffff' wmode='transparent' width='100%' height='100%' name='productGalFlashObj' salign='tl' allowScriptAccess='sameDomain' type='application/x-shockwave-flash' pluginspage='http://www.macromedia.com/go/getflashplayer' /> 
						</object>	
						
					</div>

					<div class='pageGalDescProduct' align="left">
						<span id='productGalleryTitle'></span>
						<span id='productGalleryDesc'></span>
					</div>
				
				</td>
				
				<td width="200px" valign="top">
					<div class='productPageMenu'>
						
						<span class="header">PRODUCTS</span>
						<span class='nav' onclick='cgpProduct.gotoProductGallery(1)' id='prodGal1'>Flushmount album</span>
						<span class='nav' onclick='cgpProduct.gotoProductGallery(2)' id='prodGal2'>Fine art book</span>
						<span class='nav' onclick='cgpProduct.gotoProductGallery(3)' id='prodGal3'>Coffee table book</span>
						<span class='nav' onclick='cgpProduct.gotoProductGallery(4)' id='prodGal4'>Signature guestbook</span>
						<span class='nav' onclick='cgpProduct.gotoProductGallery(5)' id='prodGal5'>Gift certificate</span>
						<span class='nav' onclick='cgpProduct.gotoProductGallery(6)' id='prodGal6'>Proof book</span>
						<span class='nav' onclick='cgpProduct.gotoProductGallery(7)' id='prodGal7'>Flushmount album case</span>
						<span class='nav' onclick='cgpProduct.gotoProductGallery(8)' id='prodGal8'>Cards and gifts</span>
						
					</div>
				</td>

				
			</tr>
			
		</table>
		
	</div><!-- productsPage -->
	
<script type="text/javascript">


var cgpProduct = {

	/** Width of flash gallery viewer */
	galWidth : 750,
	
	/** Height of flash gallery viewer */
	galHeight : 500,

	/** Ratio of width to height */
	imgRatio : 0,
	
	/** Reference to product flash gallery */
	prodFlash : '',

	// //////////////////////////////////////////////////////////////////////////////

	init : function(){
		
		cgpCommon.init('products');

		// Tell google!
		//cgpProduct.pageTracker = _gat._getTracker("UA-534928-3");
		//cgpProduct.pageTracker._trackPageview();

		// Optimize size for gallery
		cgpProduct.imgRatio = cgpProduct.galHeight / cgpProduct.galWidth;
		
		cgpProduct.onResize();
		
		cgpProduct.getProductGalleryHandle();
		
		// Highlight first in menu
		$('#prodGal1').css('font-weight', 'bold')

		setTimeout("cgpProduct.onResize()", 100);

	},
	
	// //////////////////////////////////////////////////////////////////////////////

	onResize : function(){
		
		// Make the gallery as big as it can be, then adjust the height of the container to fit
		var galW = $(".pageGalProduct").width();
//		var galW = $("#container").width() - $("#menuContainer").width() - $(".productPageMenu").width();
		
		var galH = Math.round(cgpProduct.imgRatio * galW);
			
		$(".pageGalProduct").height(galH);
		$("#productGalFlashObj").height(galH);
		
		// Now adjust the height of the container
//		var topPad = parseInt($("#productsPage").css('paddingTop'));
		
		var pageH = $("#productsPage").height() + 20;
		
		pageH = galH + 150;

		$("#container").height(pageH);
				
		Logger.info(galW + ", " + galH + " - " + pageH);
				
	},
	
	// //////////////////////////////////////////////////////////////////////////////
	
	gotoProductGallery : function(galNo){
				
		try {
			var pageTracker = _gat._getTracker("UA-534928-3");
			pageTracker._trackPageview("product_" + galNo);
		} catch(err) {}

		// Reset all menuItems...
		$('.nav').css('font-weight', 'normal')
			
		if (cgpProduct.prodFlash.loadGallery){
			Logger.debug('Loading product gallery ' + galNo);
			cgpProduct.prodFlash.loadGallery('gal'+galNo); 	
			$('#prodGal' + galNo).css('font-weight', 'bold')
		}
		else {
			Logger.error('Product gallery not defined');
			cgpProduct.getProductGalleryHandle();
			setTimeout("cgpProduct.gotoProductGallery('"+galNo+"')", 1000);
			return;
		}
		
	},

	// //////////////////////////////////////////////////////////////////////////////

	/**
	* Respond to a product image being loaded, and show the title/caption
	*/
	onProductImageLoaded : function(title, caption){
	},

	// //////////////////////////////////////////////////////////////////////////////

	onProductGalleryLoaded : function(title, description){
		//Logger.debug(title + '  ' + description);
		$('#productGalleryDesc').html(description);
		$('#productGalleryTitle').html(title);
	},		
	
	// //////////////////////////////////////////////////////////////////////////////

	getProductGalleryHandle : function(){
		var isIE = navigator.appName.indexOf("Microsoft") != -1;
  		cgpProduct.prodFlash = (isIE) ? window['productGalFlashObj'] : document['productGalFlashObj'];

  		try {
	  		if (cgpProduct.prodFlash.loadGallery){
	  			Logger.debug("getProductGalleryHandle: got handle ok!");
	  		}
	  		else {
	  			Logger.error("getProductGalleryHandle: Can't get a handle to the flash object " + cgpProduct.prodFlash.loadGallery);
  				setTimeout("cgpProduct.getProductGalleryHandle()", 200);
	  		}
  		}
  		catch(e){
  			Logger.error("getProductGalleryHandle: Can't get a handle to the flash object " + cgpProduct.prodFlash.loadGallery);
  			setTimeout("cgpProduct.getProductGalleryHandle()", 200);
  		}
	}	

}

// /////////////////////////////////////////////////////////////////////////////////

$(document).ready(cgpProduct.init);
$(window).resize(cgpProduct.onResize);

</script>