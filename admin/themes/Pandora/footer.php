<?php
/**
 * @package WordPress
 * @subpackage Pandora Theme
 */ 

global $copyright_notice, $google_tracking_code;

?>
<!-- begin footer -->

			</td>
		</tr>
		<tr height='50px'>
			<td>
												
				<div id='footerNav' align='right'>
				
					<div id='footerLogo'>
						<?php if (isset($logo_url)){
						?>						
							<a href='<?= bloginfo('url'); ?>'><img src='<?=$logo_url?>' height='80px'/></a>
						<?php
						}
						else {
						?>
							<a href='<?= bloginfo('url'); ?>'>
								<div style='font-size:60px; height:100%; width:200px; padding-left:10px; color:white' align="left">Logo</div>
								<!--
								<img src='<?php bloginfo('stylesheet_directory'); ?>/res/logo.png' height='80px'/>
								-->
							</a>
						<?php
						}
						?>
						
					</div>				
				
					<ul id="nav">
									
						<?php 
							$args = array('sort_order' => 'desc', 'sort_column' => 'menu_order');
							$pages = get_pages($args);
								
							//error_log("Page ID: $page_id Parent Page ID: $parent_page_id");
													
							foreach ($pages as $page){
							
								if ($page->post_parent == 0){
									//error_log(print_r($page, true));
									
									$id = $page->ID;
									$title = $page->post_title;
									$link = get_page_link($page->ID);							
									
									// Blog show as page id=1, even if its not. Probably because the blog
									// is set as the home page
									if (strpos($_SERVER["REQUEST_URI"], $page->post_name)){
										$page_id = $id;
									}
									
									//error_log("[$id] $title ");
									
									print("<span class='nav_spacer'></span>");
									
									if ($page_id == $id || $parent_page_id == $id){
										print("<li onmouseover=\"pandoraCommon.navMouseOver(1, $id, $id)\" onmouseout=\"pandoraCommon.navMouseOut(1, $id, $id)\" ><a id='$id' class='level1 selected' href='$link'>$title</a>\n");								
									}
									else {
										print("<li onmouseover=\"pandoraCommon.navMouseOver(1, $id, $id)\" onmouseout=\"pandoraCommon.navMouseOut(1, $id, $id)\" ><a id='$id' class='level1' href='$link'>$title</a>\n");								
									}
									print("    <ul>");
									
									// Get child pages 
									$ct = 1;
									
									foreach($pages as $child){
										
										if ($child->post_parent == $id){
	
											//$pos = - (58 * $ct) - 63;
											$pos = - (58 * $ct) - 3;
											$ct++;
											
											$style = "position:relative; top:{$pos}px;";
											$child_id = $child->ID;
											$child_title = $child->post_title;
											$child_link = get_page_link($child->ID);									
											print("        <li onmouseover=\"pandoraCommon.navMouseOver(2, $id, $child_id)\" onmouseout=\"pandoraCommon.navMouseOut(2, $id, $child_id)\" id='$child_id' style=\"{$style}\"><a id='$child_id' class='level2' href='$child_link' >$child_title</a>\n");
																						
										}
									}
									
									
									print("    </ul>");
									
									print("</li>");
								}
								
							}			
						?>
					
					</ul>
					
				</div>
			</td>
		</tr>
	</table>

	<div id='footer' align='center'>
		<?php if (isset($copyright_notice)){ echo $copyright_notice; } ?>			
	</div>

</div> <!-- Wrapper -->

</div>

<!-- Global tracking -->
<?php
if (isset($google_tracking_code)){
echo "<script type='text/javascript'>
var gaJsHost = (('https:' == document.location.protocol) ? 'https://ssl.' : 'http://www.');
document.write(unescape('%3Cscript src='' + gaJsHost + 'google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E'));
</script>
<script type='text/javascript'>
try {
var pageTracker = _gat._getTracker('$google_tracking_code');
//pageTracker._setDomainName('.apollosites.com');
pageTracker._trackPageview();
} catch(err) {}</script>";
}
?>

<script type="text/javascript">

//$(document).ready(pandoraCommon.doOnLoadFunctions());

</script>

</body>
</html>