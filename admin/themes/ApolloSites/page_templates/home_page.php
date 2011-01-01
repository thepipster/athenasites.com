<?php
/**
* @Theme: ApolloSites
* @Template: Home Page
* @Description: Home Page
*/

?>

<div id="page_contents" align="center">

		<table border="0" cellpadding="0" cellspacing="0" width="100%" height="100%" >
			<tr>
				<!-- Page content -->
				<td width="100%" height="100%" valign="top" align="left" style='padding-right:20px'>

					<?php echo PageManager::getCurrentPageContent(); ?>
<!--
					<div class='float_left_button_holder'>
						<a href='about' class='take_tour_button'></a>
					</div>	
					
					<div class='float_left_button_holder'>
						<a href='themes' class='view_themes_button'></a>
					</div>	
	-->				
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