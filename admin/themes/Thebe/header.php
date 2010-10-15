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

	<script type="text/javascript" src="<?= PageManager::$common_url_root; ?>js/3rdparty/jquery-1.4.2.min.js"></script>
	<script type="text/javascript" src="<?= PageManager::$common_url_root; ?>js/3rdparty/AC_OETags.js"></script>
	<script type="text/javascript" src="<?= PageManager::$common_url_root; ?>js/3rdparty/jquery.validate.min.js"></script>
	<script type="text/javascript" src="<?= PageManager::$common_url_root; ?>js/3rdparty/date.js"></script>
	<script type="text/javascript" src="<?= PageManager::$common_url_root; ?>js/3rdparty/jquery.datePicker.js"></script>
	<script type="text/javascript" src="<?= PageManager::$common_url_root; ?>js/3rdparty/date.format.js"></script>

<!--
	<script type="text/javascript" src="<?= PageManager::$theme_url_root; ?>js/hpBlog.class.js"></script>
	<script type="text/javascript" src="http://www.google-analytics.com/ga.js"></script>
-->
	<!-- Page Styles  //////////////////////////////////////////////////// -->

	<style type="text/css">

		/* ie6 png fix */		
		div { behavior: url("<?= PageManager::$theme_url_root; ?>/iepngfix.htc") }

	</style>

	<!-- Pingback ////////////////////////////////////////////////////////////// -->

	<link rel="pingback" href="<?= PageManager::getPingBackURL();?>" />
	
</head>

<body>