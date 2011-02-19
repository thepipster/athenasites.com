<?php
?>


<div class='pageContents'>

	<h1>Sorry, we could not find the page you were looking for. Try one of the links below</h2>

	<p id="results" style='min-height:600px'>Loading...</p>
	
	<?php 

		// See http://code.google.com/apis/customsearch/docs/js/cselement-devguide.html 			
		$parts = parse_url($url);	
		$page = strtolower(basename($parts['path']));			
		$page = str_ireplace("-", " ", $page);	
	
		PageManager::echoSERP('results', $page) 
	?>
                                
</div>