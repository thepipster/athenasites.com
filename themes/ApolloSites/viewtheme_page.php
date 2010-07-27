<?php
/**
 * @package WordPress
 * @subpackage Alpha Theme
 */
/*
Template Name: View Theme Page
*/
		
$url_root = 'http://' . $_SERVER['HTTP_HOST']; 
$theme_id = $_GET['id'];

//$page_id = $wp_query->post->ID;
//error_log(print_r($wp_query->post, true));

$query = $wpdb->prepare("SELECT * FROM apollo_Theme WHERE id = $theme_id ORDER BY id ASC");
$theme_list = $wpdb->get_results($query, ARRAY_A);
$theme = $theme_list[0];

?>

<?php get_header(); ?>

<div id="page_contents" align="left">

	Theme URL: <?php echo $theme['demo_site'] ?>
	Theme ID: <?php echo $theme_id; ?>
	
	<a class='button' href='<?=$url_root?>/themes/signup?id=<?=$theme_id?>' >Buy Theme</a>	
	
	<div align="center">
	</div>	
	
</div>


<script type="text/javascript">

</script>


<?php get_footer(); ?>