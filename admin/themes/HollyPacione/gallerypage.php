<?php
/**
 * @package WordPress
 * @subpackage Callisto Theme
 */
/*
Template Name: Gallery Page
*/

global $blog_id;
// Get the current page id
$page_id = $wp_query->post->ID;

$noflash = $_GET['noflash'];
$xml_url = "http://" . $_SERVER['HTTP_HOST'] ."/wp-content/CommonCode/php/getUserGalleryXML.php?p=".$blog_id.",".$page_id."&cache=" . mt_rand();

$query = "SELECT * FROM apollo_GalleryTable WHERE page_post_id = $page_id ORDER BY slot_number ASC";
$image_list = $wpdb->get_results($query, ARRAY_A);

get_header(); 

?>
<script type="text/javascript">

	hollyGallery.preInit();		
	<?php
		if (isset($noflash) && $noflash == 1){
			echo 'hollyGallery.hasFlash = false;';
		}
	?>

</script>

		<div id='content'>	
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
		</div>
		
<script type="text/javascript">

	hollyGallery.init({
		swf:"<?php bloginfo('stylesheet_directory'); ?>/flash/spGallery.swf", 
		xml:"<?= $xml_url?>",
		width: 1350,
		height: 800,
		loadingSpinner: true
		});
		
</script>

<?php get_footer(); ?>