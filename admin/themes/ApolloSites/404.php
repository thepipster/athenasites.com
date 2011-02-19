<?php
/**
* @Theme: ApolloSites
* @Template: 404 Page
* @Description: 404 Page
*/
?>

<img src='<?= PageManager::$theme_url_root; ?>/images/internet_connections.png' />

<h3>Sorry, we could not find the page you are looking for. Try one of the links below.</h3>

<div id="results" style='padding-bottom:20px'>Loading...</div>

<script src="https://www.google.com/jsapi"></script>

<script type="text/javascript">
	
	<?php 
		// See http://code.google.com/apis/customsearch/docs/js/cselement-devguide.html 		
		$parts = parse_url($url);	
		$page = strtolower(basename($parts['path']));		
		$page = str_ireplace("-", " ", $page);	
	?>
	
	google.load('search', '1');
	//google.load("search", "1", {style: google.loader.themes.BUBBLEGUM});
	
	<?php
	/*
      o google.loader.themes.BUBBLEGUM
      o google.loader.themes.ESPRESSO
      o google.loader.themes.GREENSKY
      o google.loader.themes.MINIMALIST
      o google.loader.themes.SHINY
	*/
	?>
	
    google.setOnLoadCallback(
    
    	function(){
			//new google.search.CustomSearchControl().draw('results');
			// Create a custom search element
			var customSearchControl = new google.search.CustomSearchControl('ABQIAAAApd3TaflLK-nGV6GT_CxTqhSdm2A-7rwoGsE41YlBtCPOmvFDPxRCd_p-ugGZEcWT4iPDE9N7Rn-KXg');
			
			customSearchControl.draw('results');
			customSearchControl.execute("<?php echo $page?>"); 
			
			// mikep76@gmail.com id pub-1988280901434851
			customSearchControl.enableAds('pub-1988280901434851')
			         				
    	}, true);
	
		
</script>