<?php
/**
 * @package WordPress
 * @subpackage Holly Pacione Theme
 */ 
?>
<!-- begin footer -->
	
	<div id='menuRibbon'>
	
		<img class='logo' src='' />
		<a class='menuItem' onClick='showServices();'>services</a>
		<a class='menuItem' onClick='showAbout();'>about</a>
		<a class='menuItem' onClick='showContact();'>contact</a>

		<a class='menuItem' href='http://www.stephaniebrauerweddings.com/Blog/' target='_blank'>blog</a>
		<a class='menuItem' onClick='showClients();'>clients</a>
		
		<?php 
												
			foreach (PageManager::$page_list as $page){
			
				if ($page['parent_page_id'] == 0 && $page['status'] == 'Published'){
	
					$id = $page['id'];
					$parent_page_id = $page['parent_page_id'];
					$title = $page['title'];								
					$page_slug = $page['slug'];
					$link = PageManager::getPageLink($id);
												
				}	
			}			
		?>
	
		<div class='controls_padding'></div>
		<a class='control' onClick='thebeMain.onNextImage();'>></a>
		<a class='control' id='togglePlay' onClick='thebeMain.onTogglePlay();'>pause</a>
		<a class='control' onClick='thebeMain.onPrevImage();'><</a>
	
	</div><!-- menuRibbon -->				
	
<!-- Javascript code /////////////////////////////////////////////////////////////// -->

<script type="text/javascript">
	
var thebeMain = {
	
	onNextImage : function(){
		thebeGallery.nextImage();
	},

	onPrevImage : function(){
		thebeGallery.prevImage();
	},
	
	onTogglePlay : function(){
		thebeGallery.togglePlay();
		if ($('#togglePlay').html() == 'pause') {
			$('#togglePlay').html('play');
		}
		else {
			$('#togglePlay').html('pause');
		}	
	}

}
	
</script>

<?php PageManager::doFooter(); ?>

</body>
</html>