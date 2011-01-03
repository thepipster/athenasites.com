<?php
/**
 * @Theme: Apollo
 * @Template: Blog Page
 * @Description: Blog Page
 */
 
/*

Categories: <?= PageManager::getCategories($post); ?><br/>
Tags: <?= PageManager::getTags($post); ?><br/>

if (PageManager::$blog_mode != PageManager::$BLOGMODE_SINGLEPOST){
	echo PageManager::getCommentsLink($post);
}
*/

$post_list = PageManager::getPosts();


if (PageManager::$blog_mode == PageManager::$BLOGMODE_SINGLEPOST){
	echo "<style type='text/css'>";
	echo "    .coda-nav-left a { background-image: url(''); }";
	echo "    .coda-nav-right a { background-image: url(''); }";
	echo "</style>";
} 

?>

<div id='BlogPage' align="center">
<div style='width:900px;'>

<div class="coda-slider-wrapper">
    <div class="coda-slider preload" id="coda-slider-9">
            
        
<?php
foreach ($post_list as $post) {

    $post_link = PageManager::getPostLink($post);
    $post_title = $post['title'];
    $content = PageManager::getBlogContent($post);
    $author = $post['author'] ;       
      	                     
?>
    <div class="panel">
        <div class="panel-wrapper">

			<div class='postWrapper' align="left">
		
				<span class='postTitle'><a href='<?=$post_link?>' title='<?=$post_title?>'><?=$post_title?></a></span>	
				&nbsp;				
				<span class='postDate'><?= date("jS F Y", strtotime($post['created'])) ?></span>	
				
				<br/>
				<br/>
					
				<div class='postContents'>
				<?= $content ?>
				</div>	
				
			</div><!-- postWrapper -->
		
        </div>
    </div>
	
<?php
}
?>

    </div><!-- .coda-slider -->
</div><!-- .coda-slider-wrapper -->

</div>

</div>


    
<script type="text/javascript">
$(document).ready(function() {
	$('#coda-slider-9').codaSlider({
		dynamicTabs:false,
		dynamicArrows: true,
//		dynamicArrowLeftText: '&#171; older',
//		dynamicArrowRightText: 'newer &#187;'
		dynamicArrowLeftText: '',
		dynamicArrowRightText: ''
	});
});
</script>

