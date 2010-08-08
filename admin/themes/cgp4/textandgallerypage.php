<?php
/**
 * @package WordPress
 * @subpackage CGP4 Theme
 */
/*
Template Name: Text & Mini-Gallery Page
*/

$page_id = $wp_query->post->ID;

error_log(">>> Page id = " . $page_id);

/*
$data = $wpdb->get_row( "SELECT * FROM apollo_PageParas WHERE page_post_id = $page_id", ARRAY_A);

error_log(print_r($data,true));
			
$background_image = '';

if (isset($data['para_value'])){
	$temp_post = get_post($data['para_value']);
	$background_image = $temp_post->guid;				
}
*/

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
			<td valign="top" height="100%">
				<div id='miniGallery' style='width:95%; height:100%;'>
			
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
							
							/*
							$meta = wp_get_attachment_metadata($post_id);
							$meta->sizes->medium->file;
							$meta->sizes->medium->width;
							$meta->sizes->medium->height;
							$thumb_url = 					
							*/
							
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
		
</div><!-- infoPage -->
						
		
<script type="text/javascript">

// Major version of Flash required
var requiredMajorVersion = 8;

// Minor version of Flash required
var requiredMinorVersion = 0;

// Minor version of Flash required
var requiredRevision = 0;

var hasFlash = DetectFlashVer(requiredMajorVersion, requiredMinorVersion, requiredRevision);

if (hasFlash){
				
	// Clear the div as fast as possible			
	document.getElementById('miniGallery').innerHTML = "";

	var txt = "";

	txt += "<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0' width='100%' height='100%' id='infoGalFlashObj' align='top' salign='t'>";
	txt += "	<param name='allowScriptAccess' value='sameDomain' />";
	txt += "	<param name='movie' value='<?php bloginfo('stylesheet_directory'); ?>/code/flash/infoGal.swf' />";
	txt += "	<param name='quality' value='high' />";
	txt += "	<param name='wmode' value='transparent' />";
	txt += "	<param name='bgcolor' value='#ffffff' />"; 
	txt += "	<param name='salign' value='t' />";
	txt += "	<param name='FlashVars' value='xmlFile=<?php bloginfo('stylesheet_directory'); ?>/code/php/getUserGalleryXML.php?pageid=<?=$page_id ?>' /> ";
	txt += "	<embed FlashVars='xmlFile=<?php bloginfo('stylesheet_directory'); ?>/code/php/getUserGalleryXML.php?pageid=<?=$page_id ?>' src='<?php bloginfo('stylesheet_directory'); ?>/code/flash/infoGal.swf' quality='high' bgcolor='#ffffff' wmode='transparent' width='100%' height='100%' name='infoGalFlashObj' align='top' salign='t' allowScriptAccess='sameDomain' type='application/x-shockwave-flash' pluginspage='http://www.macromedia.com/go/getflashplayer' />";
	txt += "</object>";
	
	document.getElementById('miniGallery').innerHTML = txt;
}	

</script>						
							
<?php get_footer(); ?>