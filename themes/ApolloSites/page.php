<?php
/**
 * @package WordPress
 * @subpackage Apollo Theme
 */
/*
Template Name: Basic Page
*/
?>

<?php get_header(); ?>


<div id="page_contents" align="center">

	<div class='contentText'>
		<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
											
			<div class="storycontent">
				<?php the_content(__('(more...)')); ?>
			</div>
			
		<?php endwhile; endif; ?>
	</div>
					
</div>

		
<script type="text/javascript">
</script>

<?php get_footer(); ?>