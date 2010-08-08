<?php
/**
 * @package WordPress
 * @subpackage Pandora Theme
 */
/*
Template Name: Gallery Page
*/

global $blog_id;
// Get the current page id
$page_id = $wp_query->post->ID;

$noflash = $_GET['noflash'];
$xml_url = "http://" . $_SERVER['HTTP_HOST'] ."/wp-content/CommonCode/php/getUserGalleryXML.php?p=".$blog_id.",".$page_id."&cache=01101976";

$query = "SELECT * FROM apollo_GalleryTable WHERE page_post_id = $page_id ORDER BY slot_number ASC";
$image_list = $wpdb->get_results($query, ARRAY_A);

get_header(); 

$noflash = 1;

?>
<script type="text/javascript">

	pandoraGallery.preInit();		
	<?php
		if (isset($noflash) && $noflash == 1){
			echo 'pandoraGallery.hasFlash = false;';
		}
	?>

</script>

		<div id='content' align="center">	

				<div class="coda-slider-wrapper">
					<div class="coda-slider preload" id="coda-slider-1">

			<?php
				
				$no_images = count($image_list);
				
				//echo "<div id='noFlashWrapper' style='overflow:auto; width:".($no_images * 600)."px; height:450px' align='center'>";
				
				foreach($image_list as $image){
				
					$image_id = $image['image_post_id'];
			
					$post = get_post($image_id);
					$meta = get_post_meta($image_id, '_wp_attachment_image_alt');
			
					$image_url = $post->guid;
					$caption = $post->post_excerpt;
					$title = $post->post_title;
					$description = $post->post_content;										
					$alt_text = $meta[0];					
					
					echo "
					<div class='panel'>
						<div class='panel-wrapper'>
							<!--<h2 class='title'>$title</h2>-->
							<img src='$image_url' title='$title' alt='$alt_text' width='100%'/>
						</div>
					</div>";			
									
				}
				
				//echo "</div>";
								
			?>
			
					</div><!-- .coda-slider -->
				</div><!-- .coda-slider-wrapper -->

		</div>
		
<script type="text/javascript">
/*
	$(document).ready(
		function(){
			pandoraGallery.init({
				swf:"<?php bloginfo('stylesheet_directory'); ?>/flash/spGallery.swf", 
				xml:"<?= $xml_url?>",
				targetDiv:"content"
				});				
		}
	);
*/


	$(document).ready(
		function(){
			pandoraSliderGallery.init({targetDiv:"content"});
		}
	);
   

		
</script>

<?php get_footer(); ?>