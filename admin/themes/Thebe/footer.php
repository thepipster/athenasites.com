<?php
/**
 * @package WordPress
 * @subpackage Holly Pacione Theme
 */ 
?>

<!-- begin footer -->
		
		
			
	<div id='menuRibbonWrapper'></div>
	<div id='menuRibbon'>
	
		<table border="0" width="100%" height="100%" style='width:100%; height:100%'>
			<tr valign="center">
			<td align="left" width="150px" style='width:150px'><img class='logo' src='' /></td>
			<td align="left">
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
									echo "<a class='glowlink' href='$link' onClick='thebeMain.doPopup($id); return false;'><span id='page_$id' class='menuItem menuItemSelected'>$title</span></a>";
								}
								else {
									echo "<a class='glowlink' href='$link' onClick='thebeMain.doPopup($id); return false;'><span id='page_$id' class='menuItem'>$title</span></a>";
								}
														
							}
							else {
								if ($is_page){
									echo "<a class='glowlink' href='$link'><span id='page_$id' class='menuItem menuItemSelected'>$title</span></a>";
								}
								else {
									echo "<a class='glowlink' href='$link'><span id='page_$id' class='menuItem'>$title</span></a>";
								}
							}
														
						}	
					}			
				?>
			</td>
			<td align="left" width="130px" style='width:130px'>
				<a class='control' onClick='thebeMain.onPrevImage();'><</a>			
				<a class='control' id='togglePlay' onClick='thebeMain.onTogglePlay();'>pause</a>
				<a class='control' onClick='thebeMain.onNextImage();'>></a>
			</td>
			</tr>
		</table>
		
			
	</div>				
	
<!-- Javascript code /////////////////////////////////////////////////////////////// -->

<script type="text/javascript">
	/*
$('.glowlink').addGlow({
    radius: 20,
    textColor: '#fff',
    haloColor: '#eec',
    duration: 200
});
	*/
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
		$('.menuItem').removeClass('menuItemSelected');
		
		$('#page_'+id).addClass('menuItemSelected');
		
		//$('.menuItem').addClass('glowlink');
				
		//$('.menuItemSelected').removeClass('glowlink');
		
		/*
		$('.glowlink').addGlow({
		    radius: 20,
		    textColor: '#fff',
		    haloColor: '#eec',
		    duration: 200
		});
		*/	
		
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
			//$('.popupContent').jScrollPane();
		}		
		
	}

}
	
</script>

<?php PageManager::doFooter(); ?>

</body>
</html>