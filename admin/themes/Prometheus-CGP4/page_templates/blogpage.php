<?php
/**
 * @Theme: CGP4
 * @Template: Blog Page
 * @Description: Blog Page
 * @isBlog: 1
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
                <?= PageManager::getCommentsLink($post); ?><br/>
        </p>

    </div>

    <p class=''>

        <strong>Share This Post! </strong>
		<br/>
		<br/>
			<!-- Add links to add this post to one of a handful of services. -->
				<?php echo $postObj->like_facebook(); ?>
				
				<br/><br/>
								
				<?php echo $postObj->add_to_delicious(); ?>
				&nbsp;&nbsp;																							
				<?php echo $postObj->add_to_digg(); ?>
				&nbsp;&nbsp;																							
				<?php echo $postObj->add_to_facebook(); ?>				
				&nbsp;&nbsp;				
				<?php echo $postObj->add_to_stumble_upon(); ?>
				&nbsp;&nbsp;				
				<!--
				<?php echo $postObj->search_technorati(); ?>
				&nbsp;&nbsp;
				-->				
				<?php echo $postObj->add_to_twitter(); ?>
				&nbsp;&nbsp;

        </p>

<?php } ?>

<?php if (PageManager::$blog_mode == PageManager::$BLOGMODE_SINGLEPOST){ ?>
<!-- Comments wrapper -->
<div id='commentsWrapper'>						
		
	<div id="comments"><h2>Comments</h2><p>No comments yet.</p></div>																					
			
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