<?php
/**
 * @package WordPress
 * @subpackage Callisto Theme
 */ 

global $copyright_notice, $google_tracking_code;

?>
<!-- begin footer -->

		
		<div id='footer' align='center'>
			<?php if (isset($copyright_notice)){ echo $copyright_notice; } ?>			
		</div>

	</div> <!-- Wrapper -->


<!-- Global tracking -->
<?php
if (isset($google_tracking_code)){
echo "<script type='text/javascript'>
var gaJsHost = (('https:' == document.location.protocol) ? 'https://ssl.' : 'http://www.');
document.write(unescape('%3Cscript src='' + gaJsHost + 'google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E'));
</script>
<script type='text/javascript'>
try {
var pageTracker = _gat._getTracker('$google_tracking_code');
//pageTracker._setDomainName('.apollosites.com');
pageTracker._trackPageview();
} catch(err) {}</script>";
}
?>


<script type='text/javascript'>


var hpNav = {
	
	timer : -1,
	
	mouseOver : function(level, parentID, thisID){
		$('#'+thisID).addClass('sfhover'); // IE hover fix		
		//$('#'+parentID).fadeIn();
	},

	mouseOut : function(level, parentID, thisID){
		$('#'+thisID).removeClass('sfhover'); // IE hover fix	

	}
	
}

</script>


</body>
</html>