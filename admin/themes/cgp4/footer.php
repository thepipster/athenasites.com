<?php
/**
 * @Theme: CGP4
 */
 
global $tracker_code;

?>

				</td>
				
			</tr>
			
		</table>				
				
	</div> <!-- container -->

	<div id='footer'>
		<span class='left '>Colorado Springs wedding and portrait photographers. Available throughout Colorado and worldwide.</span>
		<span class='right '>charlotte@charlottegeary.com | 719-685-1248</span>		
	</div> <!-- footer -->

	<br />
	<br />
	<br />

</div>	

<script type="text/javascript">

<?= PageManager::echoGoogleTracker($tracker_code); ?>
		
/**
* Class to contain common operators
*/
var cgpCommon = {

	// //////////////////////////////////////////////////////////////////////////////

	/**
	* Do the common things!
	*/ 
	init : function(){

		// Setup menu		
		$('#navigation').css('display', 'inline');
		
		$('#navigation').accordion({ 
		    active: true, 
		    header: '.menuHead', 
		    navigation: true,
		    event: 'mouseover'
		});		
		
		// Do any IE6 hackes (ugh, hate IE6!)
		if (cgpCommon.isIE6()){
			// Remove any non-tile positioned background png images as 
			// ie6 will not position transparent png background images correctly
			$('.pageContents').css('background-image', "url('')");
		}
		
		cgpCommon.roundCorners();
		
	},
	
	// //////////////////////////////////////////////////////////////////////////////
/*
	gotoGallery : function(no){
		try {
			if (cgpGallery){
				cgpGallery.gotoGallery(no)			
				return false;
			}
		}
		catch(e){
		}

		window.location = "gallery.html#gal" + no + "&img=1&play=true";
	},
*/		
	// //////////////////////////////////////////////////////////////////////////////
	
	isIE6 : function(){
		if ($.browser.msie && $.browser.version < 7) return true;
		return false;
	},
	
	
	// //////////////////////////////////////////////////////////////////////////////
/*
	getHashPara : function(paraName, hash){

		if (hash.length > 1){
			var si = hash.indexOf(paraName);
	
			if (si != -1){
				si = si + paraName.length;
				return parseInt(hash.substring(si, si+2)) - 1;
			}
		}
		
		return false;
	},
*/
	// //////////////////////////////////////////////////////////////////////////////
	
	/**
	* Create rounded corners for site
	*/
	roundCorners : function(){

		if (!$.browser.msie){

			if ($.browser.mozilla && $.browser.version.substr(0,3)=="1.9"){
				$('#container').corners();
			}
			
			if ($.browser.safari){
				$('#container').corners();
			}
		}
		
	}
	
}

// Don't wait for page to load, just initialize the menu as fast as possible
cgpCommon.init();

</script>

<?php PageManager::doFooter(); ?>
</body>
</html>