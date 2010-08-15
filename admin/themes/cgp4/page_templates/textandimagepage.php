<?php
/**
 * @package WordPress
 * @subpackage CGP4 Theme
 */
/*
Template Name: Text & Image Page
*/

$page_id = $wp_query->post->ID;

error_log(">>> Page id = " . $page_id);


$data = $wpdb->get_row( "SELECT * FROM apollo_PageParas WHERE page_post_id = $page_id", ARRAY_A);
			
$image_url = '';
$image_title = '';
$image_alt = '';
$image_caption = '';
$image_description = '';

if (isset($data['para_value'])){

	$post = get_post($data['para_value']);
	$meta = get_post_meta($data['para_value'], '_wp_attachment_image_alt');
	
	$image_url = $post->guid;				
	$image_title = $post->post_title;				
	$image_description = $post->post_content;										
	$image_caption = $post->post_excerpt;										
	$image_alt = $meta[0];				
}


$query = "SELECT * FROM apollo_GalleryTable WHERE page_post_id = $page_id ORDER BY slot_number ASC";
$image_list = $wpdb->get_results($query, ARRAY_A);


get_header();
?>

<!-- INFO PAGE /////////////////////////// -->

<div class='pageContents'>

	<table width="100%" height="100%" border="0">
		<tr>
			<td width="50%" valign="top">
				<div class='infoPageText'>
					<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
														
						<div class="storycontent">
							<?php the_content(__('(more...)')); ?>
						</div>
						
					<?php endwhile; endif; ?>	
				</div>
			</td>
			<td valign="top">
				<?php echo "<img src='$image_url' title='$image_title' alt='$image_alt' width='95%'/>"; ?>						
			</td>
		</tr>
	</table>

</div><!-- infoPage -->

							
<?php get_footer(); ?>