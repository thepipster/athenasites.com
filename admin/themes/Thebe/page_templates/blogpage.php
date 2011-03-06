<?php
/**
 * @Theme: Thebe
 * @Template: Blog Page
 * @Description: Blog Page
 * @isBlog: 1
 */

?>

<div align='center'>
<div id='blogPage' align="center">

	<div class='postWrapper' align="left">
	<?php echo PageManager::getCurrentPageContent(); ?>
	</div>
	
	<br/>

	<?php

        $post_list = PageManager::getPosts();

        foreach ($post_list as $post) {
        
            $post_link = PageManager::getPostLink($post);
            $post_title = $post['title'];
            $content = PageManager::getBlogContent($post);
            $author = $post['author'] ;       
            
            $day = date("j", strtotime($post['created']));
            $month = strtolower(date("M", strtotime($post['created'])));
            $year = date("Y", strtotime($post['created']));
                             
	?>

	<div class='postWrapper' align="left">
	
		<table border="0" width="100%">
			
			<tr valign="bottom" align="left" width="100%">
				<td width='70px' style="width:70px;">
					<div class='dateWrapper'>
						<span class='month'><?=$month?></span>
						<span class='day'><?=$day?></span>
						<span class='year'><?=$year?></span>
					</div>				
				</td>
				
				<td>
					<div class='postTitle'>
						<a href='<?=$post_link?>' title='<?=$post_title?>'><?=$post_title?></a>				
					</div>					
				</td>
			</tr>
			
		</table>
				
					<div class='postContent' align="left">
						<?=$content?>			
					</div>
					<br/>
					
					<!--
			        <div class="post_author">
						by <?= $author ?>
			        </div>
					-->
					
			        <p>
			            Categories: <?= PageManager::getCategories($post); ?><br/>
			            Tags: <?= PageManager::getTags($post); ?><br/>
						<?php 
							if (PageManager::$blog_mode != PageManager::$BLOGMODE_SINGLEPOST){
								echo PageManager::getCommentsLink($post);
							}
						?>
			            <br/>
			        </p>		
	</div><!-- postWrapper -->

	<?php } ?>	

	
	<?php if (PageManager::$blog_mode == PageManager::$BLOGMODE_SINGLEPOST){ ?>
	<!-- Comments wrapper -->
	<div id='commentsWrapper' class='postWrapper' align="left">						
	
		<div id="comments"><h2>No comments yet.</h2></div>																					
		
		<p>
		<!--
			<a href='http://hollypacionephotography.com/2010/09/16/nate-and-christys-wedding-at-forestgate-presbyterian-church/feed/'>
				<abbr title="Really Simple Syndication">RSS</abbr> feed for comments on this post.
			</a>			
			
			<a href="http://hollypacionephotography.com/2010/09/16/nate-and-christys-wedding-at-forestgate-presbyterian-church/trackback/" rel="trackback">
				TrackBack <abbr title="Universal Resource Locator">URL</abbr>
			</a>
		-->
		</p>
		
		<h2 id="postcomment">Leave a comment</h2>
		
		<div class='commentStatus'></div>
		
		<form id='commentForm' method='post' action='' onsubmit="hpBlog.onPostComment(); return false;">
									
			<p><input type="text" name="author" id="author" size="22" tabindex="1" class="required_name" value="<?=$name?>"/>
		
			<label for="author"><small>Name (required)</small></label></p>
		
			<p>
				<input type="text" name="email" id="email" size="22" tabindex="2" class="required_email" value="<?=$email?>" />
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
    <div style='padding-bottom:30px;' id='blogSidebar' class='postWrapper'>
        <span class='morePostsLink' style='float:left; padding-left:5px;'><?= PageManager::getOlderPostsLink('&laquo; Older posts'); ?></span>
        <span class='morePostsLink' style='float:right; padding-right:5px;'><?=  PageManager::getNewerPostsLink('Newer posts &raquo;'); ?></span>
    </div>

	<div class='postWrapper' align="center">
		<table width="100%">
			<tr valign="top">
				<td>
					<h2>Archive</h2>
				    <?= SideBarManager::getArchive(PageManager::$site_id); ?>    
				</td>
				<td>
					<h2>Tags</h2>
				    <?= SideBarManager::getTags(PageManager::$site_id); ?>
				</td>
				<td>
					<h2>Categories</h2>
				    <?= SideBarManager::getCategories(PageManager::$site_id); ?>
				</td>
			</tr>
		</table>
		
	</div>    
    
	<?php } ?>	
			
</div>


<script type="text/javascript">

	//$('.control').hide();
	
	<?php if (PageManager::$blog_mode == PageManager::$BLOGMODE_SINGLEPOST){ ?>

	//thebeBlog.m_postID = <?= PageManager::$current_post['id'] ?>;	
	
	//thebeBlog.m_siteID = <?= PageManager::$site_id  ?>;
	
    //thebeBlog.init();
    
	<?php } ?>

</script>