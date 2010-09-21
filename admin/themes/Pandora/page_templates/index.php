<?php
/**
 * @package WordPress
 * @subpackage HollyPacione_Theme
 */
get_header();

/**
* Strip out any hard coded style attributes
*/
function stripImages($postContent){
	
	$newContent = preg_replace( '/<img.*src="(.*?)".*?>/', '<div class="blogImageWrapper" align="center"><img src="\1" class="blogImage"/></div>', $postContent );	
	
		
	return $newContent;
}

?>


		<div id='content' align="left">	

			<table id='blogTable' border="0" width="100%" height="100%">
			
				<tr valign="top">
					
					<td>
						
						<div class='postWrapper'>
						
							<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
													
							<div <?php post_class() ?> id="post-<?php the_ID(); ?>">
							
								<div class='postContent'>
								
									<h2 class="postTitle">
									<a href="<?php the_permalink() ?>" rel="bookmark"><?php the_title(); ?></a>
									</h2>
					
									<span class='blogDate'><?php the_date('','',''); ?></span>
								
									<div class="storycontent">
										<?php 
											//the_content(__('(more...)')); 
											$content = get_the_content(__('(more...)'));
											echo stripImages($content);
										?>
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
								
							</div>
						
						</div><!-- postWrapper -->
						
					</td>
					
					<td width="120px">
						<div class='blogSidebarWrapper'>
							<?php get_sidebar(); ?>
						</div>
					</td>
					
				</tr>
			</table>
						
		</div>

		
<script type="text/javascript">

	pandoraBlogPage.init({
		width: 1350,
		height: 800,
		minWidth: 800,
		maxHeight: 800
		});

</script>

		
<?php get_footer(); ?>
