<?php
/**
 * @Theme: HollyPacione
 * @Template: Blog Page
 * @Description: Blog Page
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


						<!-- Comments wrapper -->
						<div id='commentsWrapper'>
						
						
							<h2 id="comments">No Comments<a href="#postcomment" title="Leave a comment">&raquo;</a></h2>
							
							<p>No comments yet.</p>
							
							
							<p>
								<a href='http://hollypacionephotography.com/2010/09/16/nate-and-christys-wedding-at-forestgate-presbyterian-church/feed/'>
									<abbr title="Really Simple Syndication">RSS</abbr> feed for comments on this post.
								</a>			
								
								<a href="http://hollypacionephotography.com/2010/09/16/nate-and-christys-wedding-at-forestgate-presbyterian-church/trackback/" rel="trackback">
									TrackBack <abbr title="Universal Resource Locator">URL</abbr>
								</a>
							</p>
							
							<h2 id="postcomment">Leave a comment</h2>
							
							
							<form id='commentForm' method='post' action='' onsubmit="hpBlog.onPostComment(); return false;">
														
								<p><input type="text" name="author" id="author" value="" size="22" tabindex="1" class="required_name"  />
							
								<label for="author"><small>Name (required)</small></label></p>
							
								<p>
									<input type="text" name="email" id="email" value="" size="22" tabindex="2" class="required_email" />
									<label for="email"><small>Email (will not be published) (required)</small></label>
								</p>
								
								<p>
									<input type="text" name="url" id="url" value="" size="22" tabindex="3" />
									<label for="url"><small>Website</small></label>
								</p>
														
								<p><textarea name="comment" id="comment" cols="70%" rows="10" tabindex="4"></textarea></p>
														
								<p>
									<input name="submit" type="submit" id="submit" tabindex="5" value="Submit Comment" />							
								</p>
							
							</form>
																		
						</div><!-- commentsWrapper-->			
									
									
						<!-- Next/Prev links (will only show up if the blog is showing all posts! -->
                        <div style='padding-bottom:30px;' id='blogSidebar'>
                            <span style='float:left; padding-left:35px;'><?= PageManager::getOlderPostsLink('&laquo; Older posts'); ?></span>
                            <span style='float:right; padding-right:35px;'><?=  PageManager::getNewerPostsLink('Newer posts &raquo;'); ?></span>
                        </div>

                    </div>

                </div><!-- postWrapper -->

            </td>

            <td width="200px">
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

    var hpBlog = {

        /** Minimum allowed width */
        minWidth : 800,
        /** Ajax url */
        m_commandURL : '',

		// ////////////////////////////////////////////////////////////////
		
        init : function(){
        
			// Validation
			$("#commentForm").validate();
				
				
			$.validator.addMethod(
				"required_email", function(value, element) { 
				
			  		if (value == 'Your E-mail Address') return false; 
			  		if (value == '') return false; 
			  		
			  		// Check to see if this group is complete
			  		return hpBlog.checkEmail(value);
				}, 
				"Enter a valid email");
	
			$.validator.addMethod(
				"required_name", function(value, element) { 
				
			  		if (value == 'Your Name') return false; 
			  		if (value == '') return false; 
			  		
			  		return true;
				}, 
				"Please enter your name");
			        
	        hpBlog.m_commandURL = 'http//' + location.host + '/admin/code/php/remoteapi/BlogAPI.php';
        	
            hpBlog.onResize();
            setTimeout("hpBlog.onResize()", 200);
        },

		// ////////////////////////////////////////////////////////////////

		checkEmail : function(email) {
			var filter = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
			if (!filter.test(email)) {
				return false;
			}
			return true;
		},
	
		// ////////////////////////////////////////////////////////////////

        onResize : function(){

            var postWidth = $('#content').width() - 340;
            var blogW = $("#blogTable").width();

            $("#nav_container").width(blogW);
            $("#container").width(blogW);
            $("#content").width(blogW);

        },
        
		// ////////////////////////////////////////////////////////////////

        getComments : function(){

	        var paras = {
	            cmd : 'getComments',
	            site_id: <?=PageManager::$site_id?>,
	            post_id: <?=PageManager::$current_post['id']?>
	        };
	
	        $.ajax({
	            url: hpBlog.m_commandURL,
	            dataType: "json",
	            data: paras,
	            success: function(ret){
	                hpBlog.onGotComments(ret, callback);
	            }
	        });
               
        },
        
		// //////////////////////////////////////////////////////

        onGotComments : function(postID, commentList){
        },
        
		// ////////////////////////////////////////////////////////////////

        onPostComment : function(){

			if ($("#commentForm").valid()){

	        	var authorName = $('#author').val();
	        	var authorEmail = $('#email').val();
	        	var commentContent = $('#comment').val();
	        	var postURL = window.location;
	        	var parentCommentID = 0;
	        	
	        	alert("Name: " + authorName + " Email: " + authorEmail + " Comment: " + commentContent + " Post URL: " + postURL);
	        	
		        var paras = {
		            cmd : 'addComment',
		            site_id: <?=PageManager::$site_id?>,
		            post_id: <?=PageManager::$current_post['id']?>,
		            arn: authorName,
		            aem: authorEmail,
		            purl: postURL,
		            content: commentContent,
		            pid: parentCommentID
		        };
		
		alert('2 ' + hpBlog.m_commandURL);
		
		        $.ajax({
		            url: hpBlog.m_commandURL,
		            dataType: "json",
		            data: paras,
		            success: function(ret){
		                hpBlog.onCommentPosted(ret, callback);
		            }
		        });
		        
	        }
                	
            alert('done!');    	
        },
        
		// ////////////////////////////////////////////////////////////////

        onCommentPosted : function(){
        }

    }

    // /////////////////////////////////////////////////////////////////////////////////

    hpBlog.init();

    //$(document).ready(hpBlog.init);
    $(window).resize(hpBlog.onResize);

</script>