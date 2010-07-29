<?php
/**
 * @package WordPress
 * @subpackage Callisto Theme
 */
/*
Template Name: Basic Page
*/

// Get the current user info
get_currentuserinfo();

// Get the current page id
$page_id = $wp_query->post->ID;

//error_log(">>> Page id = " . $page_id);

$data = $wpdb->get_row( "SELECT * FROM apollo_PageParas WHERE page_post_id = $page_id", ARRAY_A);
			
$background_image = '';

if (isset($data['para_value'])){
	$temp_post = get_post($data['para_value']);
	$background_image = $temp_post->guid;				
}

?>

<?php get_header(); ?>

		<div id='content'><div id='scroller'>

			<div class='backgroundImage'>
				<img src="<?=$background_image?>" width='100%' height='100%'/>
			</div>
			
			<div class="singleCol" align="left">
				<div class='contentText'>
					<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
														
						<div class="storycontent">
							<?php the_content(__('(more...)')); ?>
						</div>
						
					<?php endwhile; endif; ?>
				</div>
			</div>
			
		</div></div><!-- content -->

		
<script type="text/javascript">

// Major version of Flash required
var requiredMajorVersion = 8;

// Minor version of Flash required
var requiredMinorVersion = 0;

// Minor version of Flash required
var requiredRevision = 0;

var hasFlash = DetectFlashVer(requiredMajorVersion, requiredMinorVersion, requiredRevision);

var hpContent = {

	/** Width of content box gallery viewer */
	imgWidth : 1200,
	
	/** Height of flash gallery viewer */
	imgHeight : 800,

	/** Ratio of width to height */
	imgRatio : 0,

	/** Minimum allowed width */
	minWidth : 800,
	
	init : function(){
						
		// Optimize size for gallery
		//hpContent.imgRatio = hpContent.imgHeight / hpContent.imgWidth;
		hpContent.imgRatio = hpContent.imgWidth / hpContent.imgHeight;
	
		hpContent.onResize();
		
		setTimeout("hpContent.onResize()", 200);
								
	},
	
	onResize : function(){

		if (hasFlash){
								
			var galH = $("#wrapper").height() - $("#nav_container").height();
			var galW = Math.floor(hpContent.imgRatio * galH);	
					
			//alert('Min width: ' + $("#nav_container").attr('min-width'));			
			
			if (galW > hpContent.minWidth){
			
				$("#nav_container").width(galW);	
				$("#container").width(galW);	
				
				$("#content").height(galH);
				$("#content").width(galW);
				
			}
		}
		
	}

}

// /////////////////////////////////////////////////////////////////////////////////

$(document).ready(hpContent.init);
$(window).resize(hpContent.onResize);

</script>

<?php get_footer(); ?>