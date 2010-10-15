<?php
/**
 * @package WordPress
 * @subpackage Holly Pacione Theme
 */ 
?>
<!-- begin footer -->

		<div id='nav_container'>
		
			<div class='ribbonMask' id='ribbonMask'>
				<img class='logo' src='SB.png' />
				<a class='option' onClick='showServices();'>services</a>
				<a class='option' onClick='showAbout();'>about</a>
				<a class='option' onClick='showContact();'>contact</a>
		
				<a class='option' href='http://www.stephaniebrauerweddings.com/Blog/' target='_blank'>blog</a>
				<a class='option' onClick='showClients();'>clients</a>
				<a class='control1' id='control1' onClick='goPrevious();'><</a>
				<a class='control2'  id='toggle' onClick='pausePlay();'>pause</a>
				<a class='control3'  onClick='goNext();'>></a>
			</div>		

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
		
		</div>
		
	</div> <!-- Wrapper -->

<?php PageManager::doFooter(); ?>

</body>
</html>