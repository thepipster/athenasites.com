<?php
?>


<div class='pageContents'>

	<h1>Sorry, we can't fine the page you were looking for. Try one of the links below</h2>

	<p id="results" style='min-height:600px'>Loading...</p>

	<script src="https://www.google.com/jsapi?ABQIAAAApd3TaflLK-nGV6GT_CxTqhSdm2A-7rwoGsE41YlBtCPOmvFDPxRCd_p-ugGZEcWT4iPDE9N7Rn-KXg"></script>

	<script type="text/javascript">
		
		<?php 
			// See http://code.google.com/apis/customsearch/docs/js/cselement-devguide.html 
			
			$parts = parse_url($url);	
			$domain = $parts['host'];
			$page = strtolower(basename($parts['path']));
			$path = strtolower(dirname($parts['path']));	
			
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
				var customSearchControl = new google.search.CustomSearchControl();
				
				customSearchControl.draw('results');
				customSearchControl.execute("<?php echo $page?>"); 
				
				// mikep76@gmail.com id pub-1988280901434851
				//customSearchControl.enableAds('pub-1988280901434851')
				         				
        	}, true);
		
 		
	</script>
                                
</div>