<?php
/**
 * @Theme: CGP4
 */
 
// Do default actions
PageManager::doHeader();

$media_tag_list = MediaTable::getTags(PageManager::$site_id);

if (!defined('VIRTUAL_PAGE_ID')){
	define('VIRTUAL_PAGE_ID', 0);
}

$WEDDING_IDEAS_PAGE_ID = 33;

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" <?= PageManager::getLanguageAttributes(); ?>>

<head profile="http://gmpg.org/xfn/11">

	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

	<title><?= PageManager::getPageTitle() ?></title>

	<!-- Meta data //////////////////////////////////////////////////////// --> 	
	
	<?php PageManager::doSiteMetaTags(); ?>
	
	<!-- Favicon ///////////////////////////////////////////////////// -->

	<link rel="shortcut icon" type="image/png" href="<?= PageManager::getFavIconURL() ?>">

	<?php
	/*
	<!-- Style sheets ///////////////////////////////////////////////////// -->

	<link rel="stylesheet" href="<?= PageManager::$theme_url_root; ?>style.css" type="text/css" media="screen" />
	
	<!-- JS Includes ///////////////////////////////////////////////////// -->

    <script type="text/javascript" src="<?= PageManager::$common_url_root; ?>js/3rdparty/swfobject.js"></script>
	<script type="text/javascript" src="<?= PageManager::$common_url_root; ?>js/3rdparty/AC_OETags.js"></script>	
	<script type="text/javascript" src="<?= PageManager::$common_url_root; ?>js/3rdparty/date.js"></script>	
	<script type="text/javascript" src="<?= PageManager::$common_url_root; ?>js/3rdparty/jquery.datePicker.min-2.1.2.js"></script>	

	<script type="text/javascript" src="<?= PageManager::$common_url_root; ?>js/apolloXfader.class.js"></script>	
	<script type="text/javascript" src="<?= PageManager::$common_url_root; ?>js/utils/Logger.class.js"></script>
	
	<script type="text/javascript" src="<?= PageManager::$theme_url_root; ?>code/js/cgpCommon.class.js"></script>
	<script type="text/javascript" src="<?= PageManager::$theme_url_root; ?>code/js/cgpBlog.class.js"></script>
	<script type="text/javascript" src="<?= PageManager::$theme_url_root; ?>code/js/cgpContact.class.js"></script>
	<script type="text/javascript" src="<?= PageManager::$theme_url_root; ?>code/js/cgpGallery.class.js"></script>
	<script type="text/javascript" src="<?= PageManager::$theme_url_root; ?>code/js/cgpHome.class.js"></script>
	<script type="text/javascript" src="<?= PageManager::$theme_url_root; ?>code/js/cgpProduct.class.js"></script>
		
	@import url("code/css/main.css");
	@import url("code/css/blog.css");
	@import url("code/css/contact.css");
	@import url("code/css/datePicker.css");	
	*/	
	if (DEV_MODE) {
			
		$common_base_dir = FILE_ROOT . "admin/themes/common/";
		$theme_base_dir = FILE_ROOT . "admin/themes/Prometheus-CGP4/code";
				
		$js_list = array(
			//"$common_base_dir/js/3rdparty/jquery-1.4.2.min.js",
			//"$common_base_dir/js/3rdparty/jquery-ui/jquery-ui-1.8.4.custom.min.js",
			"$common_base_dir/js/3rdparty/swfobject.js",
			"$common_base_dir/js/3rdparty/AC_OETags.js",
			"$common_base_dir/js/3rdparty/date.js",
			"$common_base_dir/js/3rdparty/date.format.js",
			"$common_base_dir/js/3rdparty/jquery.datePicker.min-2.1.2.js",
			"$common_base_dir/js/3rdparty/jquery.validate.min.js",
									
			"$common_base_dir/js/apolloXfader.class.js",
			"$common_base_dir/js/utils/Logger.class.js",
			
			"$theme_base_dir/js/cgpCommon.class.js",
			"$theme_base_dir/js/cgpBlog.class.js",
			"$theme_base_dir/js/cgpCommon.class.js",
			"$theme_base_dir/js/cgpContact.class.js",
			"$theme_base_dir/js/cgpGallery.class.js",
			"$theme_base_dir/js/cgpHome.class.js",
			"$theme_base_dir/js/cgpProduct"
		);
		
		$css_list = array(
			"$theme_base_dir/css/main.css",
			"$theme_base_dir/css/blog.css",
			"$theme_base_dir/css/contact.css",
			"$theme_base_dir/css/datePicker.css"
		);
		
		ProductionBuilder::buildProductionJS($js_list, "$theme_base_dir/js/cgp_production.js", false);
		ProductionBuilder::buildProductionCSS($css_list, "$theme_base_dir/css/cgp_production.css", false);
		
	}
	
	?>
		
	<link rel="stylesheet" href="<?= PageManager::$theme_url_root; ?>code/css/cgp_production.css" type="text/css" media="screen" />

    <script type="text/javascript" src="<?= PageManager::$common_url_root; ?>js/3rdparty/jquery-1.4.2.min.js"></script>
    <script type="text/javascript" src="<?= PageManager::$common_url_root; ?>js/3rdparty/jquery-ui/jquery-ui-1.8.4.custom.min.js"></script>
		
	<script type="text/javascript" src="<?= PageManager::$theme_url_root; ?>code/js/cgp_production.js"></script>

	<!-- Page Styles  //////////////////////////////////////////////////// -->

	<style type="text/css">

		/* ie6 png fix */		
		div { behavior: url("<?= PageManager::$theme_url_root; ?>/iepngfix.htc") }
						
		<?php
		// Handle any custom site styles
		$background_image = PageManager::getGlobalMediaFromThemePara(309); 
		
		if (isset($background_image)){
			$image_url = PageManager::$media_root_url . $background_image['filepath'] . $background_image['filename'];
			echo "html {background-image: url('$image_url');}\n";			
		}
		?>			
		
		.error {
			color: red;
			padding-left: 5px;
			padding-right: 4px;
		}
			
	</style>

	<!-- Pingback ////////////////////////////////////////////////////////////// -->

	<link rel="pingback" href="<?= PageManager::getPingBackURL();?>" />
	
</head>

<body>


<div style='height:100%; width:100%' align='center'>
	
	<a href="/"><div id='logo'></div></a>

	<div id='container' class='treeMenuLogo'>
		
		<table width="100%" height="100%" cellpadding="0" cellspacing="0" border="0">
			
			<tr>
				<td width='200px' height="100%" valign="top">
				
					<div id='menuContainer' align="right">
						<!--
						<div id='treeMenuLogo'><img src='<?= PageManager::$theme_url_root; ?>code/imgs/tree.png'/></div>
						-->							
						<ul id='navigation'>
										
						<?php 
																				
							// Construct menu.....
																				
							foreach (PageManager::$page_list as $page){
							
								//Logger::dump($page);
								
								$page_id = $page['id'];
								$parent_page_id = $page['parent_page_id'];
								$title = strtoupper($page['title']);		
								$page_slug = $page['slug'];
								$is_homepage = $page['is_homepage'];
								$is_blogpage = $page['is_blogpage'];
							
								if (!$is_homepage){
								
									if ($parent_page_id == 0 && $title != 'Home'){
											
										print("<li>");
										
										if ($is_blogpage){
										
											$link = PageManager::getPageLink($page_id);
											print("    <a href='$link' onclick=''><span class='menuHead_NonAccordian'>$title</span></a>");
																																	
											if (PageManager::$is_blogpage){
											
												$catList = PostsTable::getCategories(PageManager::$site_id);

												print("<ul>");
												foreach($catList as $cat){
													$cat_slug = StringUtils::encodeSlug($cat, '');
													$link = PageManager::$blog_url . "?category=" . $cat_slug;
													echo "<li style='padding:0; margin:0'><a href='{$link}'><span class='menuItem' id='blogMenuItem_{$cat_slug}'>{$cat_slug}</span></a></li>";
												}											
												print("</ul>");	
												
												$tagList = PostsTable::getTags(PageManager::$site_id);
												
												print("<div class='spacer'></div>");
												
												foreach($tagList as $tag){
													$tag_slug = StringUtils::encodeSlug($tag, '');
													$link = PageManager::$blog_url . "?tag=" . $tag_slug;
													echo "<li style='padding:0; margin:0'><a href='{$link}'><span class='menuTagItem' id='blogMenuItem_{$tag_slug}'>{$tag_slug}</span></a></li>";
													// <li><a href='/blog/?tag=air-force-academy'><span class='menuTagItem' id='blogMenuItem_air-force-academy'>air force academy</span></a></li>
												}											
												
												
												
											}								
										}
										else {
											print("    <span class='menuHead' id='page_$page_id'>".strtoupper($title)."</span>");									
										}
										
										
										// Get child pages 
										print("    <ul>");																																																		
										foreach(PageManager::$page_list as $child){
											
											if ($child['parent_page_id'] == $page_id){
		
												$child_id = $child['id'];
												$child_title = $child['title'];
	
												$child_link = PageManager::getPageLink($child['id']);
														
												//Logger::debug(">> Child Page: $child_title Link: $child_link");
																					
												if ($child['id'] == PageManager::$page_id){
													print("<li><a href='$child_link' onclick=''><span class='menuItem selected' id='page_$child_id'>$child_title</span></a></li>");
												}
												else {											
													print("<li><a href='$child_link' onclick=''><span class='menuItem' id='page_$child_id'>$child_title</span></a></li>");
												}											
												
													
												if ($child['id'] == $WEDDING_IDEAS_PAGE_ID && (PageManager::$page_id == $WEDDING_IDEAS_PAGE_ID || VIRTUAL_PAGE_ID == $WEDDING_IDEAS_PAGE_ID)){
												
													foreach($media_tag_list as $tag){
														$tag_slug = StringUtils::encodeSlug($tag, '');
														$link = "/wedding-ideas/$tag_slug";
																												
														if (strpos($_SERVER['REQUEST_URI'], $link) === false){
															echo "<li style='padding:0; margin:0'><a href='{$link}'><span class='menuSubItem' id='mediaTagMenuItem_{$tag_slug}'>{$tag}</span></a></li>";
														}
														else {
															echo "<li style='padding:0; margin:0'><a href='{$link}'><span class='menuSubItem subItemSelected' id='mediaTagMenuItem_{$tag_slug}'>{$tag}</span></a></li>";
														}
														// <li><a href='/blog/?tag=air-force-academy'><span class='menuTagItem' id='blogMenuItem_air-force-academy'>air force academy</span></a></li>
													}	
													
												}
												
											}
										}																			
										print("    </ul>");		
																	
										print("</li>");
										
										print("<div class='spacer'></div>");
										
									}

								}
								
							}			
						?>
						
						</ul>
					
						<div style='height:130px;'></div>
						
					</div> <!-- menuContainer -->

				</td>
				
				<td height="100%" align="left" valign="top" style='height:100%'>
