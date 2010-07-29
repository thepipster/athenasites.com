<?php
/**
 * @package WordPress
 * @subpackage Alpha Theme
 */
/*
Template Name: Themes Page
*/
		
get_header();

global $blog_id;

$url_root = 'http://' . $_SERVER['HTTP_HOST']; 
$page_id = $wp_query->post->ID;
$theme_para_id = 102;

//$data = $wpdb->get_row( "SELECT * FROM apollo_PageParas WHERE page_post_id = $page_id AND blog_id = $blog_id ", ARRAY_A);

$sql = $wpdb->prepare("SELECT * FROM apollo_GalleryMeta WHERE page_post_id = %d AND theme_para_id = %d AND blog_id = %d ORDER BY gallery_number ASC", $page_id, $theme_para_id, $blog_id); 		
$meta_list = $wpdb->get_results($sql, ARRAY_A);

//error_log(print_r($wp_query->post, true));
error_log(print_r($meta_list, true));

$query = "SELECT * FROM apollo_Theme WHERE is_private = '0' ORDER BY id ASC";
$theme_list = $wpdb->get_results($query, ARRAY_A);
//$no_themes = count($theme_list);
//$NO_IMAGES_PER_ROW = 3;
				
?>

<?php get_header(); ?>

<div id="page_contents">
	
	<!--
	<div class="coda-slider-wrapper">
		<div class="coda-slider preload" id="coda-slider-1">
			<div class="panel">
				<div class="panel-wrapper">
					<h2 class="title">Panel 1</h2>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas metus nulla, commodo a sodales sed, dignissim pretium nunc. Nam et lacus neque. Sed volutpat ante id mauris laoreet vestibulum. Nam blandit felis non neque cursus aliquet. Morbi vel enim dignissim massa dignissim commodo vitae quis tellus. Nunc non mollis nulla. Sed consectetur elit id mi consectetur bibendum. Ut enim massa, sodales tempor convallis et, iaculis ac massa. Etiam suscipit nisl eget lorem pellentesque quis iaculis mi mattis. Aliquam sit amet purus lectus. Maecenas tempor ornare sollicitudin.</p>
				</div>
			</div>
			<div class="panel">
				<div class="panel-wrapper">
					<h2 class="title">Panel 2</h2>
					<p>Proin nec turpis eget dolor dictum lacinia. Nullam nunc magna, tincidunt eu porta in, faucibus sed magna. Suspendisse laoreet ornare ullamcorper. Nulla in tortor nibh. Pellentesque sed est vitae odio vestibulum aliquet in nec leo.</p>
				</div>
			</div>
			<div class="panel">
				<div class="panel-wrapper">
					<h2 class="title">Panel 3</h2>
					<p>Cras luctus fringilla odio vel hendrerit. Cras pulvinar auctor sollicitudin. Sed lacus quam, sodales sit amet feugiat sit amet, viverra nec augue. Sed enim ipsum, malesuada quis blandit vel, posuere eget erat. Sed a arcu justo. Integer ultricies, nunc at lobortis facilisis, ligula lacus vestibulum quam, id tincidunt sapien arcu in velit. Vestibulum consequat augue et turpis condimentum mollis sed vitae metus. Morbi leo libero, tincidunt lobortis fermentum eget, rhoncus vel sem. Morbi varius viverra velit vel tempus. Morbi enim turpis, facilisis vel volutpat at, condimentum quis erat. Morbi auctor rutrum libero sed placerat. Etiam ipsum velit, eleifend in vehicula eu, tristique a ipsum. Donec vitae quam vel diam iaculis bibendum eget ut diam. Fusce quis interdum diam. Ut urna justo, dapibus a tempus sit amet, bibendum at lectus. Sed venenatis molestie commodo.</p>
				</div>
			</div>
			<div class="panel">
				<div class="panel-wrapper">
					<h2 class="title">Panel 4</h2>
					<p>Nulla ultricies ornare erat, a rutrum lacus varius nec. Pellentesque vehicula lobortis dignissim. Ut scelerisque auctor eros sed porttitor. Nullam pulvinar ultrices malesuada. Quisque lobortis bibendum nisi et condimentum. Mauris quis erat vel dui lobortis dignissim.</p>
				</div>
			</div>
		</div>
	</div> -->
	


	<div class="coda-slider-wrapper">
		<div id='theme_table' class="coda-slider preload" >
				<?php
									
					foreach($meta_list as $meta){
							
						$id = $meta['id'];
						$description = $meta['description'];
						$no = $meta['gallery_number'];
						$title = $meta['title'];
						$thumb_image_id = $meta['image_post_id'];
						$theme_id = -1;
						
						//$image_url = WordPressHelper::getRealImageURL($image_id, $blogid);
						$thumb_url = WordPressHelper::getRealThumbURL($thumb_image_id, $blog_id);
						
						// Match the gallery title to a theme title
						$theme_match_found = false;
						
						foreach($theme_list as $theme){
							if (strtolower($theme['theme_title']) == strtolower($title)){
								$theme_id = $theme['id'];
								$theme_title = $theme['theme_title'];
								$theme_price = $theme['price'];
								$theme_description = $theme['description'];
								$theme_match_found = true;
								break;
							}
						}
						
//						$imglink = "<a id='themeimg_$id' class='theme_image' href='".$url_root."/themes/viewtheme?id=".$theme_id."' onmouseover=\"themeSelect.onMouseOver('".$theme['id']."')\"><img src='$thumb_url' alt='$theme_description' width='150px' class='reflect'/></a>";
						$imglink = "<a id='themeimg_$id' class='theme_image' href='".$url_root."/themes/viewtheme?id=".$theme_id."' onmouseover=\"themeSelect.onMouseOver('".$theme['id']."')\"><img src='$thumb_url' alt='$theme_description' width='150px' class=''/></a>";
						
						if ($theme_match_found){
							echo "<div class='panel'> \n";
							echo "   <div class='panel-wrapper'> \n";
							echo "       <h2 class='title'>$theme_title</h2>";
							echo "           <p>";
							echo "               <table class='theme_table_display' border='0'>";
							echo "                   <tr valign='top'>";
							echo "                       <td width='170px' height='170px'>$imglink</td>";						
							echo "                       <td rowspan='2'>$theme_description</td>";						
							echo "                   </tr>";
							echo "                   <tr valign='top'>";
							echo "                       <td>$".$theme_price."</td>";						
							echo "                   </tr>";
							echo "               </table>";
							echo "            </p>";
							echo "    </div> \n";
							echo "</div> \n";
						}
					}
		
				?>
		</div>
	</div>
	
				
</div><!-- page_contents -->


<script type="text/javascript">

// see http://www.digitalia.be/software/reflectionjs-for-jquery#download
//$('.theme_image').reflect({height:200,opacity:0.5});

var themeSelect = {
	
	onMouseOver : function(theme_id){
		//$("themeimg_"+theme_id).hide();
		//$("#themeimg_"+theme_id).effect('scale', { percent: 50, direction: 'both' }, 1000);	
	}
}

$().ready(function() {
	$('#theme_table').codaSlider({
		dynamicArrows: true,
		dynamicArrowLeftText:'',
		dynamicArrowRightText:'',
		dynamicTabs: true,
		dynamicTabsAlign: 'left'
	});
});

		
</script>


<?php get_footer(); ?>