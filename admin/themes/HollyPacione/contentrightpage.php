<?php
/**
 * @package WordPress
 * @subpackage Holly Pacione Theme
 */
/*
Template Name: Content Right Page
*/

// Get the current user info
get_currentuserinfo();

// Get the current page id
$page_id = $wp_query->post->ID;

$data = $wpdb->get_row( "SELECT * FROM apollo_PageParas WHERE page_post_id = $page_id", ARRAY_A);
			
$background_image = '';

?>

<?php get_header(); ?>

		<div id='content'><div id='scroller'>

			<div class='backgroundImage'>
			<?php
				if (isset($data['para_value'])){
					$temp_post = get_post($data['para_value']);
					$background_image = $temp_post->guid;				
					$size = getimagesize($background_image);
					$width = $size[0];				
					$height = $size[1];				
					
					if ($width > $height){
						echo "<img id='back_image' src='$background_image' width='100%'/>";
					}
					else {
						echo "<img id='back_image' style='float:left' src='$background_image' height='100%'/>";
					}
				}
			?>
			</div>

			<div class='rightCol' align="left">
				<div class='contentText'>
					<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
														
						<div class="storycontent">
							<?php the_content(__('(more...)')); ?>
						</div>
						
					<?php endwhile; endif; ?>
				</div>
			</div>

		</div></div>

		
<script type="text/javascript">

hollyInfoPage.init({
	width: 1350,
	height: 800,
	pageType: 'right'
});
				
</script>


<?php get_footer(); ?>
