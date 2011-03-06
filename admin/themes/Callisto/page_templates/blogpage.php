<?php
/**
 * @Theme: HollyPacione
 * @Template: Blog Page
 * @Description: Blog Page
 * @isBlog: 1
 * @Data: Blog
 */


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

<div id='content' align="left" style='max-height: none; max-width: none; height: auto'>

    <table id='blogTable' border="0" width="100%" height="100%">

        <tr valign="top">

            <td>

                <div id='hpPostWrapper' class='postWrapper'>

                    <?php
                    $post_list = PageManager::getPosts();

                    foreach ($post_list as $post) {
                        $post_link = PageManager::getPostLink($post);
                        $post_title = $post['title'];
                    ?>

                    <div id="post-<?= $post['id']; ?>" class='post'>

                        <div class='postContent'>

                            <h2 class="postTitle">
                                <a href="<?= $post_link ?>" rel="bookmark"><?= $post_title ?></a>
                            </h2>

                            <span class='blogDate'><?= PageManager::getPostDate($post); ?></span>

                            <div class="storycontent">
                                <?php
                                $content = PageManager::getBlogContent($post);
                                echo stripImages($content);
                                ?>
                            </div>

                            <div class="post_author">
								by <?= $post['author'] ?>
                            </div>

                            <p>
                                Categories: <?= PageManager::getCategories($post); ?><br/>
                                Tags: <?= PageManager::getTags($post); ?><br/>

                                <?= PageManager::getCommentsLink($post); ?><br/>
                            </p>

                        </div><!-- postContent -->

                        <?php //comments_template(); // Get wp-comments.php template ?>

                        <div align="left" class='post_spacer_outer'><div class='post_spacer'></div></div>

                        <?php } ?>

						
						<?php if (PageManager::$blog_mode == PageManager::$BLOGMODE_SINGLEPOST){ ?>
						<!-- Comments wrapper -->
						<div id='commentsWrapper'>						
						
							<div id="comments"><h2>No comments yet.</h2></div>																					
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
							
							<form id='commentForm' method='post' action='' onsubmit="hpBlog.onPostComment(); return false;">
														
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

                </div><!-- postWrapper -->

            </td>

            <td width="200px" align="left">
                <div class='blogSidebarWrapper'>

                    <h2>Tags</h2>
                    <?= SideBarManager::getTags(PageManager::$site_id); ?>

                    <h2>Categories</h2>
                    <?= SideBarManager::getCategories(PageManager::$site_id); ?>

                    <h2>Archive</h2>
                    <?= SideBarManager::getArchive(PageManager::$site_id); ?>
                    
                </div>
            </td>

        </tr>
    </table>

</div><!-- content -->

<script type="text/javascript">

	<?php if (PageManager::$blog_mode == PageManager::$BLOGMODE_SINGLEPOST){ ?>

	hpBlog.m_postID = <?= PageManager::$current_post['id'] ?>;	
	    
	<?php } ?>

	hpBlog.m_siteID = <?= PageManager::$site_id  ?>;	
    hpBlog.init();

    //$(document).ready(hpBlog.init);
    //$(window).resize(hpBlog.onResize);

</script>