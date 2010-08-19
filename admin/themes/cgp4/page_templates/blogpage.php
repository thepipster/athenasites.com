<?php
/**
* @Theme: CGP4
* @Template: Blog Page
* @Description: Blog Page
*/

?>

	<div id='blogPage' class='pageContents' style="background-image:url('')">

		<?php echo PageManager::getCurrentPageContent(); ?>

		<h1>BLOG</h1>
		
		<p>Hello! I'm a Colorado Springs wedding photographer and portrait photographer. I travel all over the country to document the 
		important moments in people's lives. My blog showcases some of my favorite photos of my clients and adventures. I update this 
		blog several times a week, so please visit frequently to see my latest images.</p>
		
		<?php 
			$post_list = PageManager::getPosts();
			foreach($post_list as $post){
		?>
		
		<div align="left" class='post_spacer_outer'><div class='post_spacer'></div></div>
		
		<div id="post-<?= $post['id']; ?>">
		
			<h2 class="storytitle">
			<a href="<?= PageManager::getPostLink($post['id']) ?>" rel="bookmark"><?= $post['title'] ?></a>
			</h2>

			<span class='blogDate'><?= PageManager::getPostDate($post['id']) ?></span>
		
			<div class="storycontent">
				<?php echo PageManager::getBlogContent(); ?>
			</div>
			
			<p>
				Categories: <?php PageManager::getCategories($post['id']); ?><br/>
				Tags: <?php PageManager::getTags($post['id']); ?><br/>
				<?php //wp_link_pages(); ?>
				<?php //comments_popup_link(__('Comments (0)'), __('Comments (1)'), __('Comments (%)')); ?><br/>
				<?php //edit_post_link(__('Edit This')); ?><br/>
			</p>
			
		</div>
		
		<p class=''>
			
			<strong>Share This Post! </strong> 
			
			&nbsp;&nbsp;
			
			<!-- DEL.ICIO.US //////////////////////////////////////////////////////////////////////// --> 
								
			<a href="http://del.icio.us/post?url=<?php the_permalink() ?>&title=<?php the_title(); ?>" target='_blank' title='Del.icio.us'>
				<img alt='Del.icio.us' border='0' height='16' src='http://3.bp.blogspot.com/_pzC_7PLtN-0/SXDK01IpJ6I/AAAAAAAAB-0/4AiDPosezwY/s400/De.licio.us+Icon.gif' width='16'/>
			</a> 
			<a href="http://del.icio.us/post?url=<?php the_permalink() ?>&title=<?php the_title(); ?>" target='_blank' title='Del.icio.us'>Del.icio.us</a> 
			
			&nbsp;&nbsp;
		
			<!-- DIGG //////////////////////////////////////////////////////////////////////// --> 
			
			<a href="http://www.digg.com/submit?url=<?php the_permalink() ?>&title=<?php the_title(); ?>&phase=2" target='_blank' title='Digg'>
				<img alt='Digg' border='0' height='14' src='http://4.bp.blogspot.com/_pzC_7PLtN-0/SXDK08-GbMI/AAAAAAAAB-s/p5LMcEOR6Jk/s400/Digg+Icon.gif' width='16'/>
			</a> 							
			<a href="http://www.digg.com/submit?url=<?php the_permalink() ?>&title=<?php the_title(); ?>&phase=2" target='_blank' title='Digg'>Digg</a> 
		
			&nbsp;&nbsp;
			
			<!-- FACEBOOK //////////////////////////////////////////////////////////////////////// --> 
			
			<a href="http://www.facebook.com/share.php?u=<?php the_permalink() ?>" target='_blank' title='Facebook'>
				<img alt='Facebook' border='0' height='16' src='http://2.bp.blogspot.com/_pzC_7PLtN-0/SXDK0jnR9vI/AAAAAAAAB-k/cB0CP-z6HSo/s400/Facebook+Icon.png' width='14'/>
			</a> 
			<a href="http://www.facebook.com/share.php?u=<?php the_permalink() ?>" target='_blank' title='Facebook'>Facebook</a> 
			
			&nbsp;&nbsp;
			
			<!-- STUMBLE UPON //////////////////////////////////////////////////////////////////////// --> 
			
			<a href="http://www.stumbleupon.com/submit?url=<?php the_permalink() ?>&title=<?php the_title(); ?>" target='_blank' title='StumbleUpon'>
				<img alt='StumbleUpon' border='0' height='16' src='http://3.bp.blogspot.com/_pzC_7PLtN-0/SdqXhm2cUkI/AAAAAAAACG0/eJRZZc3lXzs/s320/StumbleUpon+Icon.gif' width='16'/>
			</a> 
			<a href="http://www.stumbleupon.com/submit?url=<?php the_permalink() ?>&title=<?php the_title(); ?>" target='_blank' title='StumbleUpon'>StumbleUpon</a> 
			
			&nbsp;&nbsp;
			
			<!-- TECHNORATI //////////////////////////////////////////////////////////////////////// --> 
			<!--
			<a href="http://technorati.com/cosmos/search.html?url=<?php the_permalink() ?>" target='_blank' title='Technorati'>
				<img alt='Technorati' border='0' height='16' src='http://4.bp.blogspot.com/_pzC_7PLtN-0/SXDK0QSE_YI/AAAAAAAAB-U/y-HDJyntbOE/s400/Technorati+Icon.gif' width='14'/>
			</a>							
			<a href="http://technorati.com/cosmos/search.html?url=<?php the_permalink() ?>" target='_blank' title='Technorati'>Technorati</a> 
			
			&nbsp;&nbsp;
			-->
			<!-- TWITTER //////////////////////////////////////////////////////////////////////// --> 
			
			<a href="http://twitter.com/home/?status=Currently reading:<?php the_permalink() ?>" target='_blank' title='Twitter'>
				<img alt='Twitter' border='0' height='16' src='http://1.bp.blogspot.com/_pzC_7PLtN-0/SXDK0gJQmjI/AAAAAAAAB-c/AMQtMq7Cpcg/s400/Twitter+Icon.png' width='16'/>
			</a> 
			<a href="http://twitter.com/home/?status=Currently reading:<?php the_permalink() ?>" target='_blank' title='Twitter'>Twitter</a>

		</p>						
		
		<?php comments_template(); // Get wp-comments.php template ?>
		
		<?php endwhile; endif; ?>
		
		<div style='padding-bottom:30px;'>
			<span style='float:left; padding-left:35px;'><?php next_posts_link('&laquo; Older posts'); ?></span>
			<span style='float:right; padding-right:35px;'><?php previous_posts_link('Newer posts &raquo;'); ?></span>
		</div>
		
	</div>
							

<script type="text/javascript">

try {
	var pageTracker = _gat._getTracker("UA-534928-3");
	pageTracker._trackPageview("blog_home");
} catch(err) {}

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

</script>

<?php get_footer(); ?>