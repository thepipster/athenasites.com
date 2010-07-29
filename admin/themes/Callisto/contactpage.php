<?php
/**
 * @package WordPress
 * @subpackage Callisto Theme
 */
/*
Template Name: Contact Page
*/

// Get the current page id
$page_id = $wp_query->post->ID;
$url_root = get_bloginfo("template_url");

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

<?php get_header(); ?>


		<div id='content'>	

			<table width="100%" height="100%" border="0" cellpadding="20px">
				<tr>
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
//									echo "<img id='miniImage' src='$image_url' title='$image_title' alt='$image_alt' width='100%'/>";
									echo "<div align='left'>";
									echo "    <span class='infoImageTitle'>$image_title</span>";
									echo "    <span class='infoImageCaption'>$image_caption</span>";
									echo "</div>";
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
							
							<form id='contactForm' method='post' action='' onsubmit="return callistoContactPage.onSubmit();">
								<input type="text" class='inputText required_name' id='name' name='name' value="Your Name" onfocus="if (this.value == 'Your Name'){this.value = '';}" onblur='callistoContactPage.onChange()'>
								<input type="text" class='inputText required_email' id='email' name='email' value="Your E-mail Address" onfocus="if (this.value == 'Your E-mail Address'){this.value = '';}" onblur='callistoContactPage.onChange()'>
								<input type="text" class='inputText required_phone' id='phone' name='phone' value="Your Phone" onfocus="if (this.value == 'Your Phone'){this.value = '';}" onblur='callistoContactPage.onChange()'>
								<input type="text" class='inputText' id='location' name='location' value="Event Location" onfocus="if (this.value == 'Event Location'){this.value = '';}" onblur='callistoContactPage.onChange()'>
								<input type="text" class='inputText datepicker' id='datetime' name='datetime' value="Requested Date">
								<textarea class='inputTextArea' id='comments' name='comments' onfocus="if (this.value == 'How did you find out about us?'){this.value = '';}">How did you find out about us?</textarea>
								<input type="submit" value="Submit" onclick=""><span class='formMessage'></span>
								<!-- <button onclick="callistoContactPage.onSubmit()">Submit</button> -->
							</form>
							
						</div>
					</td>
				</tr>
			</table>
			
		</div>	
		
					
<script type="text/javascript">

	callistoContactPage.init({
		width: 1350,
		height: 800,
		minWidth: 800,
		maxHeight: 800,
		pageID: <?=$page_id?>,
		commandURL: '<?=$url_root?>/php/SendEmail.php',
		nonce: '<?=wp_create_nonce( 'contact_page' )?>',
		});
	
	<?php 
		if ($width < $height){
			echo "$('#miniImage').height($('#content').height()-60)";
		}
	?>
	
</script>
<?php get_footer(); ?>
