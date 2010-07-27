<?php
/**
 * @package WordPress
 * @subpackage Holly Pacione Theme
 */
/*
Template Name: Content Left Page
*/

// Get the current user info
get_currentuserinfo();

// Get the current page id
$page_id = $wp_query->post->ID;

//error_log(">>> Page id = " . $page_id);

$data = $wpdb->get_row( "SELECT * FROM apollo_PageParas WHERE page_post_id = $page_id", ARRAY_A);
			
$background_image = '';

$width = 0; $height = 0;

if (isset($data['para_value'])){

	$temp_post = get_post($data['para_value']);
	$background_image = $temp_post->guid;				
	$meta = wp_get_attachment_metadata($temp_post->ID);
	//error_log(print_r($meta,true));
	$width = $meta['width'];
	$height = $meta['height'];
	
}


?>

<?php get_header(); ?>

		<div id='content' <?php if ($width > $height){ echo "style='width:{$width}px"; } ?>><div id='scroller'>

			<div class='backgroundImage'>
			<?php
				if ($width > $height){
					echo "<img id='back_image' src='$background_image' width='100%'/>";
				}
				else {
					echo "<img id='back_image' style='float:right' src='$background_image' height='100%'/>";
				}
			?>
			</div>
			
			<div class='leftCol' align="left">
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
	pageType: 'left'
});
				
/*	
	onResize : function(){


		if (hasFlash){
								
			var galH = $("#wrapper").height() - $("#nav_container").height();
			var galW = Math.floor(hpContent.imgRatio * galH);	

			if (galW > hpContent.minWidth){
				galW = hpContent.minWidth;
			}
						
			
				$("#nav_container").width(galW);	
				$("#container").width(galW);	
				
				$("#content").height(galH);
				$("#content").width(galW);
				

			var imgH = $('#back_image').height();
			var imgW = $('#back_image').width();			
				
			//$('#debug').append(galW + ' ' + galH + "   " + imgW + ",  " + imgH + '<br>');
				
			if ($('#back_image').width() < $('#back_image').height()){
				$('.leftCol').width(galW - $('#back_image').width());
			}
			else {
				$("#content").height(imgH);
			}
			
			//alert('Min width: ' + $("#nav_container").attr('min-width'));			
			
		}
		
		//alert($("#nav_container").width());
		//$("#logo").css('left', $("#nav_container").width());
		//$(".logo").css('left', $("#nav_container").width());
		
	}

}
*/

</script>

<?php get_footer(); ?>
