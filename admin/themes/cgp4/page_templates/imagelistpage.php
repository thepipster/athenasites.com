<?php
/**
 * @package WordPress
 * @subpackage CGP4 Theme
 */
/*
Template Name: Image List Page
*/

// Get the current user info
//get_currentuserinfo();
$page_id = $wp_query->post->ID;

error_log(">>> Page id = " . $page_id);

$query = "SELECT * FROM apollo_GalleryTable WHERE page_post_id = $page_id ORDER BY slot_number ASC";
$image_list = $wpdb->get_results($query, ARRAY_A);

?>

<?php get_header(); ?>

<div class='pageContents'>

	<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
										
		<div class="storycontent">
			<?php the_content(__('(more...)')); ?>
		</div>
		
	<?php endwhile; endif; ?>
				
	<p align="left">

		<?php
			foreach($image_list as $image){
			
				$image_id = $image['image_post_id'];
		
				$post = get_post($image_id);
				$meta = get_post_meta($image_id, '_wp_attachment_image_alt');
		
				$image_url = $post->guid;
				$caption = $post->post_excerpt;
				$title = $post->post_title;
				$description = $post->post_content;										
				$alt_text = $meta[0];
								
				echo "<div id='noFlashImage'>";
				echo "    <img src='$image_url' title='$title' alt='$alt_text' width='100%'/>";   
				echo "    <span class='title'>$title</span>";
				echo "    <span class='caption'>$caption</span>"; 
				echo "</div>";
				echo "<br/>";
				
			}
		?>
	
	</p>

	<br />							

	<p>
		Photos by <a href="http://www.charlottegeary.com">Charlotte Geary Photography</a> in Colorado Springs, Colorado<br>
		Return to <a href="index.html">Wedding Venues</a>
	</p>
		
</div>		
<?php get_footer(); ?>