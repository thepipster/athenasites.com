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
	
	// <img src="http://farm5.static.flickr.com/4006/4581828756_babd091e8b_o.jpg" style="border: 10px solid black" alt="056" height="800" />

/*	
	$newContent = preg_replace( '/<img.*src="(.*?)".*alt="(.*?)".*height="(.*?)".*?>/', '<img src="\1" alt="\2" class="hpBlogImage" style="max-width=\3px;"/>', $postContent );	
	$newContent = preg_replace( '/<img.*src="(.*?)".*alt="(.*?)".*?>/', '<div class="blogImageWrapper" align="center"><img src="\1" alt="\2" class="blogImage"/></div>', $postContent );	
*/
/*
	$newContent = preg_replace( '/<img.*src="(.*?)".*?>/', '<div class="blogImageWrapper" align="center"><img src="\1" class="blogImage"/></div>', $postContent );	
*/
/*
	// Cases where we have a height AND width specified
	$newContent = preg_replace( '/<img.*src="(.*?)".*height="(.*?)".*width="(.*?)".*?>/', '<img src="\1" height="\2" width="\3" class="blogImage" />', $postContent );	

	// Cases where we have a height specified
	$newContent = preg_replace( '/<img.*src="(.*?)".*height="(.*?)".*?>/', '<img src="\1" height="\2" class="blogImage" />', $newContent );	

	// Cases where we have just the src specified
	$newContent = preg_replace( '/<img.*src="(.*?)".*?>/', '<img src="\1" class="blogImage" />', $newContent );	
*/

	$newContent = str_replace("<img", "<img class='blogImage' ", $postContent);
	
	return $newContent;
}

?>


		<div id='content' align="left" style='max-height: none; max-width: none'>	

			<table id='blogTable' border="0" width="100%" height="100%">
			
				<tr valign="top">
					
					<td>
						
						<div id='hpPostWrapper' class='postWrapper'>
						
							<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
													
							<div <?php post_class() ?> id="post-<?php the_ID(); ?>">
							
								<div class='postContent'>
								
									<h2 class="postTitle">
									<a href="<?php the_permalink() ?>" rel="bookmark" class='blogPostTitle'><?php the_title(); ?></a>
									</h2>
					
									<span class='blogDate'><?php the_date('','',''); ?></span>
								
									<div class="storycontent">
										<?php 
											//the_content(__('(more...)')); 
											$content = get_the_content(__('(more...)'));
											echo stripImages($content);
											//echo $content;
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

var hpBlog = {

	/** Minimum allowed width */
	minWidth : 800,
	
	init : function(){
							
		hpBlog.onResize();
		
		setTimeout("hpBlog.onResize()", 200);
				
	},
	
	onResize : function(){
				
		var postWidth = $('#content').width() - 340;
		
		//$('img').addClass('blogImage');
		
		/*		
		$('img').each(function(){
			
			var width = $(this).width();
			var height = $(this).height()
			
			if (width > postWidth){

				if (width > height){
					$(this).css('height', 'auto');
					$(this).width(postWidth);
				}
				else {
					$(this).width(postWidth*0.7);
					$(this).css('height', 'auto');
				}
			}
			
		
		});		
		*/
		//$('img').addClass('blogImage');
		
		var blogW = $("#blogTable").width();
		
		$("#nav_container").width(blogW);	
		$("#container").width(blogW);				
		$("#content").width(blogW);		
		
	}

}

// /////////////////////////////////////////////////////////////////////////////////

hpBlog.init();

//$(document).ready(hpBlog.init);
$(window).resize(hpBlog.onResize);

</script>

		
<?php get_footer(); ?>