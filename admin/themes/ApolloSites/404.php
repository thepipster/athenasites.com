<?php
/**
* @Theme: ApolloSites
* @Template: 404 Page
* @Description: 404 Page
*/
?>

<img src='<?= PageManager::$theme_url_root; ?>/images/internet_connections.png' />

<h3>Sorry, we could not find the page you are looking for. Try one of the links below.</h3>

<div id="results" style='padding-bottom:20px' align="left">Loading...</div>

<?php 

	// See http://code.google.com/apis/customsearch/docs/js/cselement-devguide.html 			
	$parts = parse_url($url);	
	$page = strtolower(basename($parts['path']));			
	$page = str_ireplace("-", " ", $page);	

	PageManager::echoSERP('results', $page) 
?>