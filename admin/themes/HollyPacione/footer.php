<?php
/**
 * @package WordPress
 * @subpackage Holly Pacione Theme
 */ 
?>
<!-- begin footer -->

		
		<div id='footer' align="center">
			All images are copyright of Holly Pacione Photography and not to be used without permission.
		</div>

	</div> <!-- Wrapper -->


<!-- Global tracking -->
<!--
<script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script type="text/javascript">
try {
var pageTracker = _gat._getTracker("UA-15157624-1");
pageTracker._setDomainName(".apollosites.com");
pageTracker._trackPageview();
} catch(err) {}</script>
-->

<script type="text/javascript">


var hpNav = {
	
	timer : -1,
	
	mouseOver : function(level, parentID, thisID){
		jQuery('#'+parentID).css('border-color', border_color);	
		jQuery('#'+thisID).addClass('sfhover'); // IE hover fix		
	},

	mouseOut : function(level, parentID, thisID){
		jQuery('#'+parentID).css('border-color', 'transparent');	
		jQuery('#'+thisID).removeClass('sfhover'); // IE hover fix	
	}
	
}

function apolloPreloader(){
				
     // set image list
     images = new Array();
	
	<?php
		
		global $blog_id, $wpdb;
		$page_id = $wp_query->post->ID;
		
		// Get list of all images for this page
		$sql_string = "SELECT posts.guid as url FROM apollo_PageParas paras INNER JOIN wp_{$blog_id}_posts posts WHERE posts.ID = paras.para_value AND paras.page_post_id = $page_id AND post_type = 'attachment' AND post_mime_type LIKE 'image/%'";				
		$url_list = $wpdb->get_results($sql_string, ARRAY_A);
		
		//echo "var = \"$sql_string\";\n";

		$ct = 0;
		foreach($url_list as $url){
			$img_url = $url['url'];
			echo "images[$ct]='$img_url';\n";
			$ct++;
		}
	?>

     // start preloading
     for(i=0; i<images.length; i++) 
     {
	     // create object
	     imageObj = new Image();
     
          imageObj.src = images[i];
     }
}

</script>


</body>
</html>