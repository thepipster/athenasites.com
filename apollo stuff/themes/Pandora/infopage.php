<?php
/**
 * @package WordPress
 * @subpackage Pandora Theme
 */
/*
Template Name: Info Page
*/

global $blog_id;
$page_id = $wp_query->post->ID;

$xml_url = "http://" . $_SERVER['HTTP_HOST'] ."/wp-content/CommonCode/php/getUserGalleryXML.php?p=".$blog_id.",".$page_id."&cache=01101976";


get_header(); 
?>
<script type="text/javascript">
	pandoraInfoPage.preInit();		
	<?php
		if (isset($noflash) && $noflash == 1){
			echo 'pandoraInfoPage.hasFlash = false;';
		}
	?>
</script>

		<div id='content'>
		
			<div id='backgroundImageWrapper' align="center">
			</div>
			
			<div id='contentTextWrapper' align="center">
				<div id='contentText' class="scroll-pane">
					<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
														
						<div class="storycontent">
							<?php the_content(__('(more...)')); ?>
						</div>
						
					<?php endwhile; endif; ?>	
				</div>
			</div>
						
		</div>

<script type="text/javascript">
	
	pandoraInfoPage.init({
		swf:"<?php bloginfo('stylesheet_directory'); ?>/flash/homeGal.swf", 
		xml:"<?= $xml_url?>",
		targetDiv:"backgroundImageWrapper",
	});	
	
	//$(window).resize(pandoraInfoPage.onResize);
</script>

<?php get_footer(); ?>