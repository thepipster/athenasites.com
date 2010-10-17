<?php
/**
 * @package WordPress
 * @subpackage Holly Pacione Theme
 */ 
?>

<!-- begin footer -->
		
	<div id='menuRibbon'>
	
		<img class='logo' src='' />
		
		<?php 
									
			$url = "http://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
			$parts = parse_url($url);
			$current_page_slug = strtolower(basename($parts['path']));
																		
			foreach (PageManager::$page_list as $page){
			
				if ($page['parent_page_id'] == 0 && $page['status'] == 'Published'){
						
					$id = $page['id'];
					$parent_page_id = $page['parent_page_id'];
					$title = strtoupper($page['title']);	
					$page_slug = $page['slug'];
					$link = PageManager::getPageLink($id);					
					
					$is_page = false;
					if (($page['slug'] == $current_page_slug) || ($current_page_slug == '' && $page['is_homepage'])) {
						$is_page = true;
					}
								
					if ($page['template'] == 'basicpage.php'){
					
						$image = PageManager::getMediaURLFromThemePara(704); 

						if (!isset($image) || $image == ""){
							$image = PageManager::$common_url_root . 'imgs/blank.png';
						}
									
						if ($is_page){
							//echo "<span id='page_$id' class='menuItem menuItemSelected' onClick='thebeMain.doPopup($id); return false;'>$title</span>";
							echo "<a id='page_$id' class='menuItem menuItemSelected glowlink' href='$link' onClick='thebeMain.doPopup($id); return false;'>$title</a>";
						}
						else {
							echo "<a id='page_$id' class='menuItem glowlink' href='$link' onClick='thebeMain.doPopup($id); return false;'>$title</a>";
						}
												
					}
					else {
						if ($is_page){
							//echo "<span id='page_$id' class='menuItemSelected'>$title</span>";
							echo "<a id='page_$id' class='menuItem menuItemSelected' href='$link'>$title</a>";
						}
						else {
							echo "<a id='page_$id' class='menuItem glowlink' href='$link'>$title</a>";
						}
					}
												
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
	
$('.glowlink').addGlow({
    radius: 20,
    textColor: '#fff',
    haloColor: '#eec',
    duration: 200
});
	
siteID = <?= PageManager::$site_id ?>;
pageID = <?= PageManager::$page_id ?>;
	
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
	},
	
	doPopup : function(id){
				
		var txt = "";		
		txt += "<div id='popupPage'>";
		txt += "</div>";
		
		$('#popupWrapper').html(txt);
		
		// Get the popup content
	
        var paras = { cmd : 'getPage', site_id: siteID, page_id: id};

        $.ajax({
            url: "/admin/code/php/remoteapi/BlogAPI.php",
            dataType: "json",
            data: paras,
            success: thebeMain.gotPopupContent
        });		
				
		// Update menu
		$('.menuItem').removeClass('menuItemSelected glowlink');
		
		$('#page_'+id).addClass('menuItemSelected');
		
		//$('.menuItem').addClass('glowlink');
				
		//$('.menuItemSelected').removeClass('glowlink');
		
		$('.glowlink').addGlow({
		    radius: 20,
		    textColor: '#fff',
		    haloColor: '#eec',
		    duration: 200
		});
			
		
	},
	
	gotPopupContent : function(ret){
		
		if (ret.result == 'ok'){
		
			var title = ret.data.page.title;
			var backgroundImage = '';
			var content = ret.data.page.content;
			
			var txt = "";
			
			txt += "    <div align='center' class='popupContent' style=\"background-image: url('"+backgroundImage+"')\">";
			txt += "        <h2>"+title+"</h2>";
			txt += "        <span class='divider'></span>";
			txt += "        <div class='popupText' align='left'>";
			txt += content;
			txt += "        </div>";
			txt += "    </div>";
			
			$('#popupPage').html(txt);
			$('.popupContent').jScrollPane();
		}		
		
	}

}
	
</script>

<?php PageManager::doFooter(); ?>

</body>
</html>