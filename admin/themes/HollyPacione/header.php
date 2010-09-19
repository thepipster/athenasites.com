<?php
PageManager::doHeader();

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" <?= PageManager::getLanguageAttributes(); ?>>

<head profile="http://gmpg.org/xfn/11">

	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

	<title><?= PageManager::getPageTitle() ?></title>
	
	<!-- Favicon ///////////////////////////////////////////////////// -->

	<link rel="icon" type="image/png" href="<?= PageManager::getFavIconURL() ?>">
	
	<!-- Style sheets ///////////////////////////////////////////////////// -->

	<link rel="stylesheet" href="<?= PageManager::$theme_url_root; ?>style.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="<?= PageManager::$theme_url_root; ?>datePicker.css" type="text/css" id="" media="print, projection, screen" />
	
	<!-- JS Includes ///////////////////////////////////////////////////// -->

	<script type="text/javascript" src="<?= PageManager::$theme_url_root; ?>js/jquery-1.3.1.min.js"></script>
	<script type="text/javascript" src="<?= PageManager::$theme_url_root; ?>js/AC_OETags.js"></script>
	<script type="text/javascript" src="<?= PageManager::$theme_url_root; ?>js/jquery.validate.min.js"></script>
	<script type="text/javascript" src="<?= PageManager::$theme_url_root; ?>js/date.js"></script>
	<script type="text/javascript" src="<?= PageManager::$theme_url_root; ?>js/jquery.datePicker.js"></script>
	<script type="text/javascript" src="<?= PageManager::$theme_url_root; ?>js/jquery.ez-bg-resize.js"></script>	
	<script type="text/javascript" src="<?= PageManager::$theme_url_root; ?>js/hollyGallery.js"></script>
	<script type="text/javascript" src="<?= PageManager::$theme_url_root; ?>js/hollyInfoPage.js"></script>


<!--
	<script type="text/javascript" src="http://www.google-analytics.com/ga.js"></script>
-->
	<!-- Page Styles  //////////////////////////////////////////////////// -->

	<?php
		global $background_col, $border_color;
		
		// Over-ride any default styles with user content	
		$background_col = ThemeTable::getGlobalParaValue(PageManager::$site_id, 211);
		$logo_url = ThemeTable::getGlobalImageParaValue(PageManager::$site_id, 207);
		$foreground_color = ThemeTable::getGlobalParaValue(PageManager::$site_id, 212);
		$nav_text_color = ThemeTable::getGlobalParaValue(PageManager::$site_id, 217);
		$border_color = ThemeTable::getGlobalParaValue(PageManager::$site_id, 218);

		$blog_post_title_color = ThemeTable::getGlobalParaValue(PageManager::$site_id, 219);
		$blog_image_border_width = ThemeTable::getGlobalParaValue(PageManager::$site_id, 220);
		$blog_image_border_color = ThemeTable::getGlobalParaValue(PageManager::$site_id, 221);

	?>

	<script type="text/javascript">
		// Make the border color choice known to JS
		border_color = '<?php if (isset($border_color)) { echo '#'.$border_color; } else { echo 'black'; }?>';
	</script>
	
	<style type="text/css">

		/* ie6 png fix */		
		div { behavior: url("<?= PageManager::$theme_url_root; ?>/iepngfix.htc") }

		<?php
			if (isset($background_col)){
				echo "html { background-color: #".$background_col."; }\n";
			}

			if (isset($foreground_color)){
				echo "html { color: #".$foreground_color."; }\n";
			}

			if (isset($logo_url)){				
				echo "#nav_container { background-image: url('".$logo_url."'); }\n";
			}
			
			if (isset($nav_text_color)){				
				echo "#nav a { color: #".$nav_text_color."; }\n";
			}

			if (isset($border_color)){				
				echo "#nav li:hover {border-color: #".$border_color."; }\n";
				echo "#content {border-color: #".$border_color."; }\n";
				echo "#content .rightCol {border-color: #".$border_color."; }\n";
				echo "#content .leftCol {border-color: #".$border_color."; }\n";
			}

			if (isset($blog_post_title_color)){				
				echo "#content .blogPostTitle {color: #".$blog_post_title_color." !important; }\n";
			}

			if (isset($blog_image_border_width)){				
				echo "#content .blogImage {border-width: ".$blog_image_border_width."px; }\n";
			}

			if (isset($blog_image_border_color)){				
				echo "#content .blogImage {border-color: #".$blog_image_border_color." !important; }\n";
				/*
				echo "#content .blogImage a {border-color: #".$blog_image_border_color." !important; }\n";
				echo "#content .blogImage a:hover {border-color: #".$blog_image_border_color." !important; }\n";
				echo "#content .blogImage a:link {border-color: #".$blog_image_border_color." !important; }\n";
				echo "#content .blogImage a:visited {border-color: #".$blog_image_border_color." !important; }\n";
				echo "#content .blogImage a:active {border-color: #".$blog_image_border_color." !important; }\n";
				*/
			}
					
		?>
						
	</style>

	<!-- Pingback ////////////////////////////////////////////////////////////// -->

	<link rel="pingback" href="<?= PageManager::getPingBackURL();?>" />
</head>

<body>


	<script type="text/javascript">
	
	var hpNav = {
		
		//timeoutHandle : -1,
		
		mouseOver : function(level, parentID, thisID){			
			$('#'+parentID).css('border-color', border_color);	
			$('#'+thisID).addClass('sfhover'); // IE hover fix		
		},
	
		mouseOut : function(level, parentID, thisID){
			$('#'+parentID).css('border-color', 'transparent');	
			$('#'+thisID).removeClass('sfhover'); // IE hover fix	
		}
		
	}
	
	</script>


	<div id='wrapper' align='center' style='padding-top:20px'>
	
		<div id='nav_container'>
		
			<div class='nav_bar' align="left">							
				<ul id="nav">
				
				
					<?php 
															
						foreach (PageManager::$page_list as $page){
						
							if ($page['parent_page_id'] == 0){
			
								$id = $page['id'];
								$parent_page_id = $page['parent_page_id'];
								$title = $page['title'];								
								$page_slug = $page['slug'];
								$link = PageManager::getPageLink($id);
																
								print("<li onmouseover=\"hpNav.mouseOver(1, $id, $id)\" onmouseout=\"hpNav.mouseOut(1, $id, $id)\" ><a id='$id' class='level1' href='$link'>$title</a>");								
								print("    <ul>");
								
								// Get child pages 
								foreach(PageManager::$page_list as $child){
									
									if ($child['parent_page_id'] == $id){

										$child_id = $child['id'];
										$child_title = $child['title'];
										$child_link = PageManager::getPageLink($child_id);	
																		
										print("        <li onmouseover=\"hpNav.mouseOver(2, $id, $child_id)\" onmouseout=\"hpNav.mouseOut(2, $id, $child_id)\" id='$child_id' ><a id='$child_id' class='level2' href='$child_link'>$child_title</a>");
										
										// Paint sub-children
										/*
										print("        <ul>");
										foreach(PageManager::$page_list as $sub_child){
											
											if ($sub_child['parent_page_id'] == $child_id){
		
												$subchild_id = $sub_child['id'];
												$subchild_title = $sub_child['title'];
												$subchild_link = PageManager::getPageLink($subchild_id);									
												print("            <li onmouseover=\"hpNav.mouseOver(3, $id, $subchild_id)\" onmouseout=\"hpNav.mouseOut(3, $id, $subchild_id)\" id='$subchild_id' ><a class='level3' href='$subchild_link'>$subchild_title</a>");																								
											}
										}
										print("        </ul>");
										*/
										
									}
								}
								
								
								print("    </ul>");
								
								print("</li>");
							}
							
						}			
					?>
				
				</ul>
					
			</div><!-- nav_bar -->
			
		</div>