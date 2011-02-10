<?php
/**
 * @Theme: CGP4
 * @Template: Blog Page
 * @Description: Blog Page
 */
?>

<div id='blogPage' class='pageContents' style="background-image:url('')">

	<?php echo PageManager::getCurrentPageContent(); ?>

    <?php
    $post_list = PageManager::getPosts();
    
    foreach ($post_list as $post) {
    
    	$postObj = new Post($post);
    	
        $post_link = PageManager::getPostLink($post);
        $post_title = $post['title'];
        
        
    ?>

    <div align="left" class='post_spacer_outer'><div class='post_spacer'></div></div>

    <div id="post-<?= $post['id']; ?>" class='post'>

        <h2 class="storytitle">
            <a href="<?= $post_link ?>" rel="bookmark"><?= $post_title ?></a>
        </h2>

        <span class='blogDate'><?= PageManager::getPostDate($post); ?></span>

        <div class="storycontent">
            <?= PageManager::getBlogContent($post); ?>
        </div>

        <p>
				Categories: <?= PageManager::getCategories($post); ?><br/>
				Tags: <?= PageManager::getTags($post); ?><br/>
            <?php //wp_link_pages(); ?>
            <?php //comments_popup_link(__('Comments (0)'), __('Comments (1)'), __('Comments (%)')); ?><br/>
            <?php //edit_post_link(__('Edit This')); ?><br/>
        </p>

    </div>

    <p class=''>

        <strong>Share This Post! </strong>
		<br/>
		<br/>
			<!-- Add links to add this post to one of a handful of services. -->
				<a href="<?php echo $postObj->add_to_blinklist(); ?>" title="Add post to Blinklist"><img style='border:none' src="/admin/images/SocialNetworksFavIcons/blinklist.png" alt="Blinklist" /></a>
				<a href="<?php echo $postObj->add_to_blogmarks(); ?>" title="Add post to Blogmarks"><img style='border:none' src="/admin/images/SocialNetworksFavIcons/blogmarks.png" alt="Blogmarks" /></a>
				<a href="<?php echo $postObj->add_to_delicious(); ?>" title="Add post to del.icio.us"><img style='border:none' src="/admin/images/SocialNetworksFavIcons/delicious.png" alt="del.icio.us" /></a>
				<a href="<?php echo $postObj->add_to_digg(); ?>" title="Digg this!"><img style='border:none' src="/admin/images/SocialNetworksFavIcons/digg.png" alt="Digg" /></a>
				<a href="<?php echo $postObj->add_to_magnolia(); ?>" title="Add post to Ma.gnolia"><img style='border:none' src="/admin/images/SocialNetworksFavIcons/magnolia.png" alt="Ma.gnolia" /></a>
				<a href="<?php echo $postObj->add_to_myweb20(); ?>" title="Add post to My Web 2.0"><img style='border:none' src="/admin/images/SocialNetworksFavIcons/myweb2.png" alt="My Web 2.0" /></a>
				<a href="<?php echo $postObj->add_to_newsvine(); ?>" title="Add post to Newsvine"><img style='border:none' src="/admin/images/SocialNetworksFavIcons/newsvine.png" alt="Newsvine" /></a>
				<a href="<?php echo $postObj->add_to_reddit(); ?>" title="Add post to Reddit"><img style='border:none' src="/admin/images/SocialNetworksFavIcons/reddit.png" alt="Reddit" /></a>
				<a href="<?php echo $postObj->add_to_segnalo(); ?>" title="Add post to Segnalo"><img style='border:none' src="/admin/images/SocialNetworksFavIcons/segnalo.png" alt="Segnalo" /></a>
				<a href="<?php echo $postObj->add_to_simpy(); ?>" title="Add post to Simpy"><img style='border:none' src="/admin/images/SocialNetworksFavIcons/simpy.png" alt="Simpy" /></a>
				<a href="<?php echo $postObj->add_to_spurl(); ?>" title="Add post to Spurl"><img style='border:none' src="/admin/images/SocialNetworksFavIcons/spurl.png" alt="Spurl" /></a>
				<a href="<?php echo $postObj->add_to_wists(); ?>" title="Add post to Wists"><img style='border:none' src="/admin/images/SocialNetworksFavIcons/wists.png" alt="Wists" /></a>
				<a href="<?php echo $postObj->search_technorati(); ?>" title="Who's linking to this post?"><img style='border:none' src="/admin/images/SocialNetworksFavIcons/technorati.png" alt="Technorati" /></a>
			
        </p>

<?php } ?>

<?php if (PageManager::$blog_mode == PageManager::$BLOGMODE_SINGLEPOST){ ?>
<!-- Comments wrapper -->
<div id='commentsWrapper'>						
		
	<div id="comments"><h2>Comments</h2></div>																					
	
	<p>No comments yet.</p>
	
	<!--
	<p>
		<a href='<?=$post_link?>/feed/'>
			<abbr title="Really Simple Syndication">RSS</abbr> feed for comments on this post.
		</a>			
		
		<a href="<?=$post_link?>/trackback/" rel="trackback">
			TrackBack <abbr title="Universal Resource Locator">URL</abbr>
		</a>
	</p>
	-->
	
	<h2 id="postcomment">Leave a comment</h2>
	
	<div class='commentStatus'></div>
	
	<form id='commentForm' method='post' action='' onsubmit="cgpBlog.onPostComment(); return false;">
								
		<p><input type="text" name="author" id="author" size="22" tabindex="1" class="required_name" value=""/>
	
		<label for="author"><small>Name (required)</small></label></p>
	
		<p>
			<input type="text" name="email" id="email" size="22" tabindex="2" class="required_email" value="" />
			<label for="email"><small>Email (will not be published) (required)</small></label>
		</p>
		
		<p>
			<input type="text" name="url" id="url" size="22" tabindex="3" value="" />
			<label for="url"><small>Website</small></label>
		</p>
								
		<p><textarea name="comment" id="comment" cols="70%" rows="10" tabindex="4" class='required'></textarea></p>
								
		<p>
			<input name="submit" type="submit" id="submit" tabindex="5" value="Submit Comment" />							
		</p>
	
	</form>
												
</div><!-- commentsWrapper-->			
			
<?php } else { ?>
			
	<!-- Next/Prev links (will only show up if the blog is showing all posts! -->
	<div style='padding-bottom:30px;' id='blogSidebar'>
	    <span style='float:left; padding-left:35px;'><?= PageManager::getOlderPostsLink('&laquo; Older posts'); ?></span>
	    <span style='float:right; padding-right:35px;'><?=  PageManager::getNewerPostsLink('Newer posts &raquo;'); ?></span>
	</div>

<?php } ?>


</div>


<script type="text/javascript">

	<?php if (PageManager::$blog_mode == PageManager::$BLOGMODE_SINGLEPOST){ ?>

	cgpBlog.m_postID = <?= PageManager::$current_post['id'] ?>;	
	    
	<?php } ?>

	cgpBlog.m_siteID = <?= PageManager::$site_id  ?>;	

    $(document).ready(cgpBlog.init);

</script>