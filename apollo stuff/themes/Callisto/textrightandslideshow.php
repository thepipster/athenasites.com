<?php
/**
 * @package WordPress
 * @subpackage CGP4 Theme
 */
/*
Template Name: Text right, slide show left page
*/

global $blog_id;
// Get the current page id
$page_id = $wp_query->post->ID;

$noflash = $_GET['noflash'];
$xml_url = "http://" . $_SERVER['HTTP_HOST'] ."/wp-content/CommonCode/php/getUserGalleryXML.php?p=".$blog_id.",".$page_id."&cache=01101976";

$query = "SELECT * FROM apollo_GalleryTable WHERE page_post_id = $page_id ORDER BY slot_number ASC";
$image_list = $wpdb->get_results($query, ARRAY_A);

get_header(); 

?>
<script type="text/javascript">

	callistoMiniGallery.preInit();		
	<?php
		if (isset($noflash) && $noflash == 1){
			echo 'callistoMiniGallery.hasFlash = false;';
		}
	?>

</script>

		<div id='content'>	

			<table width="100%" height="100%" border="0" cellpadding="20">
				<tr>
					<td valign="top" height='100%' valign='top'>
						<div id='miniGallery' class='infoPageGallery'>
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
									echo "    <img src='$image_url' title='$title' alt='$alt_text' width='95%'/>";   
									echo "    <span class='title'>$title</span>";
									echo "    <span class='caption'>$caption</span>"; 
									echo "</div>";
									echo "<br/>";
									
								}
							?>
						</div>
					</td>
					<td width="50%" valign="top">
						<div class='infoPageText'>
							<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
																
								<div class="storycontent">
									<?php the_content(__('(more...)')); ?>
								</div>
								
							<?php endwhile; endif; ?>	
						</div>
					</td>
				</tr>
			</table>
			
		</div>	
											
<script type="text/javascript">

	callistoMiniGallery.init({
		swf:"<?php bloginfo('stylesheet_directory'); ?>/flash/homeGal.swf", 
		xml:"<?= $xml_url?>",
		div: 'miniGallery',
		width: 1350,
		height: 800,
		minWidth: 800,
		maxHeight: 800
	});

</script>		

<?php get_footer(); ?>