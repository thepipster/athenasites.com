<?php
/**
 * @package WordPress
 * @subpackage Callisto Theme
 */
/*
Template Name: Text left, image right page
*/

get_header();

global $blog_id;

$page_id = $wp_query->post->ID;

$data = $wpdb->get_row( "SELECT * FROM apollo_PageParas WHERE page_post_id = $page_id AND blog_id = $blog_id ", ARRAY_A);
			
$image_url = '';
$image_title = '';
$image_alt = '';
$image_caption = '';
$image_description = '';

if (isset($data['para_value'])){

	$image_post_id = $data['para_value'];
	
	$post = get_post($image_post_id);
	$meta = get_post_meta($image_post_id, '_wp_attachment_image_alt');
	
	$image_url = $post->guid;				
	$image_title = $post->post_title;				
	$image_description = $post->post_content;										
	$image_caption = $post->post_excerpt;										
	$image_alt = $meta[0];		

	$attach_meta = wp_get_attachment_metadata($image_post_id);
	//error_log(print_r($meta,true));
	$width = $attach_meta['width'];
	$height = $attach_meta['height'];
			
}

?>
		<div id='content'>	

			<table width="100%" height="100%" border="0" cellpadding="20px">
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
					<td valign="top" align="center" height='100%'>						
						<div class='infoPageImage'>
							<?php
								if ($width > $height){
									echo "<img id='miniImage' src='$image_url' title='$image_title' alt='$image_alt' width='100%'/>";
									echo "<div align='left'>";
									echo "    <span class='infoImageTitle'>$image_title</span>";
									echo "    <span class='infoImageCaption'>$image_caption</span>";
									echo "</div>";
								}
								else {
									echo "<img id='miniImage' src='$image_url' title='$image_title' alt='$image_alt' height='100%'/>";
									echo "<div align='left'>";
									echo "    <span class='infoImageTitle'>$image_title</span>";
									echo "    <span class='infoImageCaption'>$image_caption</span>";
									echo "</div>";
								}
							?>
						</div>
						
					</td>
				</tr>
			</table>
			
		</div>	
			
<script type="text/javascript">

	callistoPage.init({
		width: 1350,
		height: 800,
		minWidth: 800,
		maxHeight: 800
		});
	
	<?php 
		if ($width < $height){
			echo "$('#miniImage').height($('#content').height()-60)";
		}
	?>
	
</script>

<?php get_footer(); ?>