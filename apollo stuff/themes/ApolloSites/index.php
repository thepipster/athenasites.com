<?php
/**
 * @package WordPress
 * @subpackage AdAstra_Theme
 */
get_header();

//$url_root = 'http://' . $_SERVER['HTTP_HOST']; 

?>
		
	<div id='blog_contents' align='left'>
	
		<table border="0" cellpadding="0" cellspacing="0" width="100%" height="100%" >
			<tr>
				
				<!-- Bog content -->
				<td width="80%" height="100%" valign="top" align="left" style='padding-left:35px'>
					
					<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
											
					<div <?php post_class() ?> id="post-<?php the_ID(); ?>">
					
						<h2 class="storytitle">
						<a href="<?php the_permalink() ?>" rel="bookmark"><?php the_title(); ?></a>
						</h2>

						<span class='blogDate'><?php the_date('','',''); ?></span>
					
						<div class="storycontent">
							<?php the_content(__('(more...)')); ?>
						</div>
						
						<div class="post_author">
							by <?php the_author(); ?>
						</div>
						
						<p>
							Categories: <?php the_category(',') ?><br/>
							Tags: <?php the_tags('', ', ', ''); ?><br/>
							<?php wp_link_pages(); ?>
							<?php comments_popup_link(__('Comments (0)'), __('Comments (1)'), __('Comments (%)')); ?><br/>
							<?php edit_post_link(__('Edit This')); ?><br/>
						</p>
						
					</div>
					
					<?php comments_template(); // Get wp-comments.php template ?>
					
					<div align="left" class='post_spacer_outer'><div class='post_spacer'></div></div>
					
					<?php endwhile; endif; ?>
					
					<div style='padding-bottom:30px;'>
						<span style='float:left; padding-left:35px;'><?php next_posts_link('&laquo; Older posts'); ?></span>
						<span style='float:right; padding-right:35px;'><?php previous_posts_link('Newer posts &raquo;'); ?></span>
					</div>
				</td>
				
				<!-- Side bar -->
				<td valign="top" align="left"> 
					<?php get_sidebar(); ?>
				</td>
			</tr>	
						
		</table>
								

	</div>

<script type="text/javascript">

/*
var cgpBlog = {

	init : function(){
	
		var setup = false;
		
		// See if this is a category....
        var sp1 = location.href.indexOf('blog/cat/');
        if (sp1 > 0){
	    	var cat = location.href.substring(sp1 + 9);
	    	cat = cat.substring(0, cat.length-1);
			cgpCommon.init('blog', cat);
			setup = true;
    	}
    	
    	// see if this is a tag....
        sp1 = location.href.indexOf('blog/?tag=');
        if (sp1 > 0){
	    	var tag = location.href.substring(sp1 + 10);
			cgpCommon.init('blog', tag);
			setup = true;
    	}
	
		if (!setup){
	    	cgpCommon.init('blog', 'all');
		}    	
	}
}

$(document).ready(cgpBlog.init);
*/
</script>

<?php get_footer(); ?>
