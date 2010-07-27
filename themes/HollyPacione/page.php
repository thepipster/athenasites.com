<?php
/**
 * @package WordPress
 * @subpackage Holly Pacione Theme
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

hollyInfoPage.init({
	width: 1350,
	height: 800,
	pageType: 'none'
});

/*	
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
*/
</script>

<?php get_footer(); ?>