<?php
/**
* @Theme: AdAstra
* @Template: Blog Page
* @Description: Blog Page
*/

?>

	<div id='blog_contents' align='left'>
	
		<table border="0" cellpadding="0" cellspacing="0" width="100%" height="100%" >
			<tr>
				<!-- Bog content -->
				<td width="80%" height="100%" valign="top" align="left" style='padding-left:35px'>
					
				<?php echo PageManager::getCurrentPageContent(); ?>
								
				<?php 
					$post_list = PageManager::getPosts();
					foreach($post_list as $post){
						$post_link = PageManager::getPostLink($post);
						$post_title = $post['title'];
				?>
				
				<div align="left" class='post_spacer_outer'><div class='post_spacer'></div></div>
				
				<div id="post-<?= $post['id']; ?>">
				
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
				
				
				<?php //comments_template(); // Get wp-comments.php template ?>
				
				<?php } ?>
				
				<div style='padding-bottom:30px;'>
					<span style='float:left; padding-left:35px;'><?= PageManager::getOlderPostsLink('&laquo; Older posts'); ?></span>
					<span style='float:right; padding-right:35px;'><?= PageManager::getNewerPostsLink('Newer posts &raquo;'); ?></span>
				</div>
				
				<!-- Side bar -->
				<td valign="top" align="left"> 
					<?php echo PageManager::getSidebar(); ?>
				</td>
			</tr>	
						
		</table>
								

	</div>

    	
</div><!-- contents -->






		
		<div id='blog_contents' align='left'>
		
			<table border="0" cellpadding="0" cellspacing="0" width="100%" >
				<tr>
					<!-- Page content -->
					<td width="80%" height="100%" valign="top" align="left" style='padding-left:35px'>


		
					</td>
				</tr>	
								
			</table>

		</div>
    	    	
</div><!-- contents -->
