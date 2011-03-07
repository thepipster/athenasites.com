<?php
/**
* @Theme: CGP4
* @Template: Products Page
* @Description: Another gallery page with more focus on displaying the text you've associated with each image.
*/

?>
				
	<div id='productsPage' class='pageContents'>
	
		<table border="0" cellpadding="0" cellspacing="0" width="100%" height="100%">
	
			<tr>
				<td valign="top" height="100%">
				
					<div class='pageGalProduct'>

						<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0' width='100%' height='100%' id='productGalFlashObj' salign='tl'> 
							<param name='allowScriptAccess' value='sameDomain' /> 
							<param name='movie' value='<?= PageManager::$theme_url_root; ?>flash/gal7500x500.swf' />
							<param name='quality' value='high' /> 
							<param name='wmode' value='transparent' /> 
							<param name='bgcolor' value='#ffffff' /> 
							<embed src='<?= PageManager::$theme_url_root; ?>flash/gal7500x500.swf' quality='high' bgcolor='#ffffff' wmode='transparent' width='100%' height='100%' name='productGalFlashObj' salign='tl' allowScriptAccess='sameDomain' type='application/x-shockwave-flash' pluginspage='http://www.macromedia.com/go/getflashplayer' /> 
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



// /////////////////////////////////////////////////////////////////////////////////

$(document).ready(cgpProduct.init);

</script>