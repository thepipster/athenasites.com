<?php
/**
* @Theme: ApolloSites
* @Template: Home Page
* @Description: Home Page
*/

// Figure out the location of this file
$discRoot = realpath(dirname(__FILE__)) . "/";
$common_code_root = substr($discRoot, 0, strpos($discRoot, 'wp-content')) . 'wp-content/CommonCode/';

require_once($common_code_root . 'php/dal/ThemeTable.class.php');


global $blog_id;
$page_id = $wp_query->post->ID;

$noflash = $_GET['noflash'];
$xml_url = "http://" . $_SERVER['HTTP_HOST'] ."/wp-content/CommonCode/php/getUserGalleryXML.php?p=".$blog_id.",".$page_id."&cache=01101976";

$query = "SELECT * FROM apollo_GalleryTable WHERE page_post_id = $page_id ORDER BY slot_number ASC";
$image_list = $wpdb->get_results($query, ARRAY_A);


/*


global $blog_id;
$page_image = ThemeTable::getGlobalImageParaValue($blog_id, 20);

if (!isset($page_image)){				
	$url_root = 'http://' . $_SERVER['HTTP_HOST']; 
	$page_image = $url_root . "/wp-content/themes/ApolloSites/images/temp/home_page_image.png";
}	
*/			

get_header(); 

?>

<script type="text/javascript">

	apolloMiniGallery.preInit();		
	<?php
		if (isset($noflash) && $noflash == 1){
			echo 'apolloMiniGallery.hasFlash = false;';
		}
	?>

</script>

<div id="page_contents" align="center">

		<table border="0" cellpadding="0" cellspacing="0" width="100%" height="100%" >
			<tr>
				<!-- Page content -->
				<td width="50%" height="100%" valign="top" align="left" style='padding-right:20px'>

					<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
						<?php the_content('<p class="serif">Read the rest of this page &raquo;</p>'); ?>
					<?php endwhile; endif; ?>

					<div class='float_left_button_holder'>
						<a href='about' class='take_tour_button'></a>
					</div>	
					
					<div class='float_left_button_holder'>
						<a href='themes' class='view_themes_button'></a>
					</div>	
					
				</td>
				<td valign="top"  style='padding-left:20px'>
					<div id='miniGallery' style='width:100%; height:100%'>
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
			</tr>	
							
		</table>
					
</div>

<script type="text/javascript">

	apolloMiniGallery.init({
		swf:"<?= PageManager::$theme_url_root; ?>/flash/homeGal.swf", 
		xml:"<?= $xml_url?>",
		div: 'miniGallery',
		width: 1350,
		height: 800,
		minWidth: 800,
		maxHeight: 800
	});

</script>

<?php get_footer(); ?>