<?php

require_once("code/php/setup.php");

$domain = str_replace('www.', '', $_SERVER['HTTP_HOST']);
$site_id = 1;

if (!SecurityUtils::isSuperUser()) {
    SecurityUtils::logOut();
    header("Location: index.php");
}

PageManager::init(1);
PageManager::$page_title = 'ApolloSites | Stats';

// Echo header
require_once('themes/ApolloSites/header.php');

?>

<style type="text/css">

.stats_graph {
	width: 100%;
	height: 300px;
	background-color: #f1f1f1;
}

</style>
        
<!-- Javascript includes //////////////////////////////////////////////////////////// -->

<script src="code/js/3rdparty/jquery-1.4.2.min.js" type="text/javascript" ></script>
<script src="code/js/3rdparty/jquery-ui/jquery-ui-1.8.4.custom.min.js" type="text/javascript"></script>

<!--[if IE]><script src="code/js/3rdparty/flot/excanvas.min.js" type="text/javascript"></script><![endif]-->  
<script src="code/js/3rdparty/flot/jquery.flot.min.js" type="text/javascript"></script>
<script src="code/js/3rdparty/flot/jquery.flot.crosshair.js" type="text/javascript"></script>
 
<script src="code/js/defines.js" type="text/javascript"></script>
<script src="code/js/utils/AthenaDialog.class.js" type="text/javascript"></script>
<script src="code/js/utils/StatViewer.class.js" type="text/javascript"></script>
<script src="code/js/remoteapi/StatsAPI.class.js" type="text/javascript"></script>
 
<div id='apollo_loading_dialog'></div>
 
Disc Usage: <span id='disc_usage'></span> MB 
<br/>
<br/>


<div id='server0_views_graph_title' class='stats_graph_title'></div>
<div id='server0_views_graph' class='stats_graph'></div>

<br/>

<div id='server1_views_graph_title' class='stats_graph_title'></div>
<div id='server1_views_graph' class='stats_graph'></div>

<br/>

<div id='server2_views_graph_title' class='stats_graph_title'></div>
<div id='server2_views_graph' class='stats_graph'></div>

<br/>
 
<script type="text/javascript">


var apStats = {

	// ////////////////////////////////////////////////////////////////////////

	init : function(){		
        StatsAPI.getServerStats(apStats.gotStats);		
	},
	
    // ////////////////////////////////////////////////////////////////////////////

    gotStats : function(disc_usage, server_page_views){
    
    	$('#disc_usage').html(disc_usage);
    	        	
		for (var i=0; i<server_page_views.length; i++){
			var page_views = server_page_views[i];
	        StatViewer.paintStatGraph("#server"+i+"_views_graph", page_views);
	        $("#server"+i+"_views_graph_title").html("Server " + i);
		}    	        	
//        StatViewer.paintStatGraph("#apollo_stats_graph_small", DashboardFrame.m_pageViews);   
        
    }	
	
}

$(document).ready(apStats.init());

</script>
 

<?php
// Echo footer
PageManager::$page_title = 'Stats';
require_once('themes/ApolloSites/footer.php');
?>