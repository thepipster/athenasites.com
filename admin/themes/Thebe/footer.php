<?php
/**
 * @package WordPress
 * @subpackage Holly Pacione Theme
 */
  
$logo_url = ThemeTable::getGlobalImageParaValue(PageManager::$site_id, 703);

if (!isset($logo_url) || $logo_url == ""){
	$logo_url = PageManager::$common_url_root . 'imgs/blank.png';
}
  
?>

<!-- begin footer -->
		
		
			
	<div id='menuRibbonWrapper'></div>
	<div id='menuRibbon'>
	
		<table border="0" width="100%" height="100%" style='width:100%; height:100%'>
			<tr valign="center">
			<td align="left" width="150px" style='width:150px'>
				<div class='logoWrapper'>
					<img class='logo' src='<?= $logo_url ?>' />
				</div>
			</td>
			<td align="left">
				<?php 
											
					$url = "http://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
					$parts = parse_url($url);
					$current_page_slug = strtolower(basename($parts['path']));
																				
					foreach (PageManager::$page_list as $page){
					
						if ($page['parent_page_id'] == 0 && $page['status'] == 'Published'){
								
							$id = $page['id'];
							$parent_page_id = $page['parent_page_id'];
							$title = $page['title'];	
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
									
								$onclick = "";			
								if (!PageManager::$is_blogpage){
									$onclick = "onclick=\"thebeMain.doPopup($id); return false;\"";
								}
											
								if ($is_page){
									echo "<a id='page_$id' class='menuItem menuItemSelected' href='$link'  $onclick >$title</a>";
								}
								else {
									echo "<a id='page_$id' class='glowlink menuItem' href='$link'  $onclick >$title</a>";
								}
														
							}
							else {
								if ($is_page){
									echo "<a id='page_$id' class='menuItem menuItemSelected' href='$link'>$title</a>";
								}
								else {
									echo "<a id='page_$id' class='glowlink menuItem' href='$link'>$title</a>";
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

//useMenuGlow = false; // Need to remove #menuRibbon .menuItem:hover

	$(window).resize(function() {
		
		if ($('.scrollWrapper').length){
			if (!$.browser.msie){
				$('.scrollWrapper').jScrollPane();
			}
		}
		
	});

	$(window).ready(function() {

		thebeMain.init();
		
//		if (useMenuGlow){
//			
//			$('.glowlink').addGlow({
//			    radius: 20,
//			    textColor: '#fff',
//			    haloColor: '#eec',
//			    duration: 200
//			});
//		}

	});

siteID = <?= PageManager::$site_id ?>;
pageID = <?= PageManager::$page_id ?>;
		
var thebeMain = {

	init : function(){		
	},
	
	/**
	* Close the popup box
	*/	
	onClose : function(){
		$('#popupPage').remove();
	},
		
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
		
		// Clear any old content
		$('#popupWrapper').html("");
		$('#popupPage').remove();
		
		// Add new wrapper
		$('#popupWrapper').html(txt);
		
		// Get the popup content
	
        var paras = { cmd : 'getPage', site_id: siteID, page_id: id};

        $.ajax({
            url: "/admin/code/php/remoteapi/BlogAPI.php",
            dataType: "json",
            data: paras,
            success: thebeMain.gotPopupContent
        });		
				
		// Update menu...
		
		// Hard code the colors back to what they should be (glow effect interferes with this)
		$(".menuItem").css('color', 'black');
		$('#page_'+id).css('color', 'white');
		
		// Remove the previopuslly selected menu item's selected status
		$('.menuItem').removeClass('menuItemSelected');

		$('#page_'+id).removeClass('glowlink');
		$('#page_'+id).addClass('menuItemSelected');
							
	},
		
	gotPopupContent : function(ret){
		
		if (ret.result == 'ok'){
		
			//var title = ret.data.page.title;
			var backgroundImage = '';
			var content = ret.data.page.content;
			
			var txt = "";
			
			txt += "<div id='popupPage' class='curvedOuterWrapper'>";
			txt += "    <div class='curvedWrapper'>";
			txt += "		<div class='curved' align='center' >";					
			txt += "            <div class='closePopup' onclick='thebeMain.onClose()'>X</div>";
			txt += "			<div class='scrollWrapper' align='left'>";						
			txt += "				<div class='popupContent'>"+content+"</div>";							
			txt += "			</div>	";								
			txt += "		</div>";
			txt += "	</div>";
			txt += "</div>";

			/*
			txt += "    <div align='center' class='popupContent' style=\"background-image: url('"+backgroundImage+"')\">";
			txt += "        <h2>"+title+"</h2>";
			txt += "        <span class='divider'></span>";
			txt += "        <div class='popupText' align='left'>";
			txt += content;
			txt += "        </div>";
			txt += "    </div>";
			*/
			$('#popupWrapper').html(txt);
			$('.scrollWrapper').jScrollPane();
		}		
		
	}

}
	
</script>

<?php PageManager::doFooter(); ?>

</body>
</html>