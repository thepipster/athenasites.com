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
	height: 400px;
	background-color: #f1f1f1;
}

</style>
        
<!-- Javascript includes //////////////////////////////////////////////////////////// -->

<script src="code/js/3rdparty/jquery-1.4.2.min.js" type="text/javascript" ></script>
<script src="code/js/3rdparty/jquery-ui/jquery-ui-1.8.4.custom.min.js" type="text/javascript"></script>

<!--[if IE]><script src="code/js/3rdparty/flot/excanvas.min.js" type="text/javascript"></script><![endif]-->  
<script src="code/js/3rdparty/flot/jquery.flot.min.js" type="text/javascript"></script>
<script src="code/js/3rdparty/flot/jquery.flot.crosshair.js" type="text/javascript"></script>
 
<script src="code/js/3rdparty/date.format.js" type="text/javascript"></script>

<script src="code/js/defines.js" type="text/javascript"></script>
<script src="code/js/utils/AthenaDialog.class.js" type="text/javascript"></script>
<script src="code/js/utils/AthenaUtils.class.js" type="text/javascript"></script>
<script src="code/js/remoteapi/StatsAPI.class.js" type="text/javascript"></script>
 

<div id='apollo_loading_dialog'></div>
 
Disc Usage: <span id='disc_usage'></span> MB 

<br/>
<br/>


<div id='server_views_graph' class='stats_graph'></div>
 
<script type="text/javascript">


var apStats = {

	// ////////////////////////////////////////////////////////////////////////

	init : function(){		
        StatsAPI.getServerStats(90, apStats.gotStats);		
	},
	
    // ////////////////////////////////////////////////////////////////////////////

    gotStats : function(disc_usage, server_page_views){
    
    	$('#disc_usage').html(AthenaUtils.addCommas(disc_usage,2));
    	        	
     	apStats.paintStatGraph("#server_views_graph", server_page_views);

    },
    
    // ////////////////////////////////////////////////////////////////////////////
    
    paintStatGraph : function(div, serverViews){
          
        var graphData = new Array();
          
        for (var i=0; i<serverViews.length; i++){
        
        	var temp = new Object();
        	temp.data = new Array();
        	temp.label = 'Server ' + i;
        	temp.lines = {show: true, fill: true}
        	
        	for (var j=0; j<serverViews[i].length; j++){
	            var t = new Date(serverViews[i][j].dt);
        		temp.data.push([t.getTime(), serverViews[i][j].pv]);
        	}
        	
        	graphData.push(temp);
        }      
        
        var plot = jQuery.plot(jQuery(div), graphData,
        {
        	legend: {
        		show: true,
        		position: "nw"
        	},
            xaxis: {
                mode: "time"
            },
            grid: {
                hoverable: true,
                clickable: true,
                markings: apStats.weekendAreas
            },
            series: {
                lines: {
                    show: true
                },
                points: {
                    show: true
                }
            }
        });
                        	 
        	
	    var previousPoint = null;
	    jQuery(div).bind("plothover", function (event, pos, item) {
		
	        jQuery("#x").text(pos.x.toFixed(2));
	        jQuery("#y").text(pos.y.toFixed(2));
		
	        if (item) {
	            if (previousPoint != item.datapoint) {
	                    
	                previousPoint = item.datapoint;
	                    
	                jQuery("#tooltip").remove();
	                var x = new Date(item.datapoint[0] + 18000000); // Convert from UTC to EST
	                var dateStr = $.datepicker.formatDate('mm/dd/yy', x);
	                var y = item.datapoint[1].toFixed(2);
	                apStats.showTooltip(item.pageX, item.pageY, item.series.label + " = " + y + " on " + dateStr);
	            }
	        }
	        else {
	            jQuery("#tooltip").remove();
	            previousPoint = null;
	        }
	    });
			        		
	},
	
    // ////////////////////////////////////////////////////////////////////////////
	
	/**
	* helper for returning the weekends in a period
	*/
	weekendAreas : function(axes) {
	    var markings = [];
	    var d = new Date(axes.xaxis.min);
	    // go to the first Saturday
	    d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 1) % 7))
	    d.setUTCSeconds(0);
	    d.setUTCMinutes(0);
	    d.setUTCHours(0);
	    var i = d.getTime();
	    do {
	        // when we don't set yaxis, the rectangle automatically
	        // extends to infinity upwards and downwards
	        markings.push({ xaxis: { from: i, to: i + 2 * 24 * 60 * 60 * 1000 }, color: "#d7dcdc" });
	        i += 7 * 24 * 60 * 60 * 1000;
	    } while (i < axes.xaxis.max);
	
	    return markings;
	},
		
    // ////////////////////////////////////////////////////////////////////////////
	
	showTooltip : function(x, y, contents) {
	    jQuery('<div id="tooltip">' + contents + '</div>').css( {
	        position: 'absolute',
	        display: 'none',
	        fontSize: '10px',
	        top: y + 5,
	        left: x + 5,
	        border: '1px solid #fdd',
	        padding: '2px',
	        'background-color': '#fee',
	        opacity: 0.80
	    }).appendTo("body").fadeIn(200);
	}	
    	
	
}

$(document).ready(apStats.init());

</script>
 

<?php
// Echo footer
PageManager::$page_title = 'Stats';
require_once('themes/ApolloSites/footer.php');
?>