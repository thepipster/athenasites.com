/**
* Javascript class that allows a user to pick an image from their wordpress media library
* @see http://www.eyecon.ro/colorpicker
*/
var StatViewer = {
	
	// ////////////////////////////////////////////////////////////////////////////

	paintPieChart : function(div){
	
		var no_stats = StatViewerData.browserStats.length;
		
		var firefox3 = 0;
		var firefox2 = 0;		
		var safari2 = 0;
		var safari3 = 0;
		var safari4 = 0;
		var ie6 = 0;
		var ie7 = 0;
		var ie8 = 0;
		var ie9 = 0;
		var iphone = 0;		
		var other = 0;	
		var chrome = 0;	
		
		for (var i=0; i<no_stats; i++){
					
			var browser = StatViewerData.browserStats[i].browser;
			var ver = parseInt(StatViewerData.browserStats[i].version.substring(0,1))
			var hits = StatViewerData.browserStats[i].hits;

			if (browser.indexOf('Firefox') != -1){
				if (ver == 3){
					firefox3+=hits;
				}
				else if (ver == 2){
					firefox2+=hits;
				}
			}
			else if (browser.indexOf('Safari') != -1){
				if (ver == 2){
					safari2+=hits;
				}
				else if (ver == 3){
					safari3+=hits;
				}
				else if (ver == 4){
					safari4+=hits;
				}
			}
			else if (browser.indexOf('iPhone') != -1){
				iphone++;
			}			
			else if (browser.indexOf('Explorer') != -1){
				if (ver == 6){
					ie6+=hits;
				}
				else if (ver == 7){
					ie7+=hits;
				}
				else if (ver == 8){
					ie8+=hits;
				}
				else if (ver == 9){
					ie9+=hits;
				}
			}
			else if (browser.indexOf('Chrome') != -1){
				chrome++;
			}						
			else {
				if (browser != "unknown"){
					other+=hits;
				}
				
			}
		}		
		
		var data = [
			{ label: "Firefox 2",  data: firefox2},
			{ label: "Firefox 3",  data: firefox3},
			{ label: "Safari 2",  data: safari2},
			{ label: "Safari 3",  data: safari3},
			{ label: "Safari 4",  data: safari4},
			{ label: "iPhone",  data: iphone},
			{ label: "IE 6",  data: ie6},
			{ label: "IE 7",  data: ie7},
			{ label: "IE 8",  data: ie8},
			{ label: "IE 9",  data: ie9},
			{ label: "Chrome",  data: chrome},
			{ label: "Other",  data: other}
		];
		
	/*
		var data = [];
		var series = Math.floor(Math.random()*10)+1;
		for( var i = 0; i<series; i++)
		{
			data[i] = { label: "Series"+(i+1), data: Math.floor(Math.random()*100)+1 }
		}
	*/			
		jQuery.plot(jQuery(div), data, 
		{
			series: {
				pie: { 
					show: true
				}
			},
			legend: {
				show: false
			}
		});
		
	},
	
	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	* Paint a small graph the shows the crawler activity
	*/	
	paintCrawlerGraph : function(div){
	
		var stats = StatViewerData.crawlerStats;
		var no_stats = StatViewerData.crawlerStats.length;
		
		var yahooStats = new Array(); // Hits from 'Yahoo! Slurp'
		var googleStats = new Array(); // Hits from 'GoogleBot'
		var msnStats = new Array(); // Hits from 'MSN'
		var curlStats = new Array(); // Hits from 'Curl'
		var yandexStats = new Array(); // Hits from 'Yandex' (Russian)
		var otherStats = new Array(); // Others
		
	    var maxTime = new Date('1/1/1970');
		var nowTime = new Date();
		
		//Set 1 day in milliseconds
		var one_day=1000*60*60*24

		// Clear arrays 
		for (var i=1; i<31; i++){
		
		    var now = new Date();
		    now.setDate(now.getDate()-i);
		    
			googleStats[i] = new Array(now.getTime(), 0);
			yahooStats[i] = new Array(now.getTime(), 0);
			msnStats[i] = new Array(now.getTime(), 0);
			curlStats[i] = new Array(now.getTime(), 0);
			otherStats[i] = new Array(now.getTime(), 0);
		    	    
		}
		
		// Get the number of different crawlers
		for (var i=0; i<no_stats; i++){
			
			var crawler = StatViewerData.crawlerStats[i].crawler;
			var hits = StatViewerData.crawlerStats[i].hits;
			var t = new Date(StatViewerData.crawlerStats[i].statdate);
						
			var daysago = Math.floor((nowTime.getTime() - t.getTime())/one_day);
			//alert(daysago);
			
			if (crawler.indexOf('Google') != -1){
				googleStats[daysago] = Array(t.getTime(), hits);
			}
			else if (crawler.indexOf('MSN') != -1){
				//msnStats.push([t.getTime(), hits]);
				msnStats[daysago] = Array(t.getTime(), hits);
			}
			else if (crawler.indexOf('Yahoo') != -1){
				yahooStats[daysago] = Array(t.getTime(), hits);
//				yahooStats.push([t.getTime(), hits]);
			}
			else if (crawler.indexOf('Curl') != -1){
				curlStats[daysago] = Array(t.getTime(), hits);
				//curlStats.push([t.getTime(), hits]);
			}
			else if (crawler.indexOf('Yandex') != -1){
				yandexStats[daysago] = Array(t.getTime(), hits);
				//curlStats.push([t.getTime(), hits]);
			}
			else {
				otherStats[daysago] = Array(t.getTime(), hits);
				//otherStats.push([t.getTime(), hits]);
			}
			
			if (t.getTime() > maxTime.getTime()){
				maxTime = new Date(t.getTime());
			}			
		}	
        
        	
	    var now = new Date();
	    now.setDate(now.getDate()-30);	    

	    var startTime = now.getTime();
		var endTime = maxTime.getTime();
        	        	
        if (StatViewerData.isGlobal){
 	   		var plot = jQuery.plot(jQuery(div), [
		        {
	    	        data: googleStats,
	        	    label: 'Google',
					bars: { show: true }
		        },
		        {
	    	        data: yahooStats,
	        	    label: 'Yahoo',
					bars: { show: true }
		        },
		        {
	    	        data: msnStats,
	        	    label: 'Bing (Microsoft)',
					bars: { show: true }
		        },
		        {
	    	        data: curlStats,
	        	    label: 'Curl (probable spambot)',
					bars: { show: true }
		        },
		        {
	    	        data: yandexStats,
	        	    label: 'Yandex (Russian)',
					bars: { show: true }
		        },
	    	    {
	        	    data: otherStats,
	            	label: 'Other',
					bars: { show: true }
	    	    }],
	        	{
	        		xaxis: { mode: "time", min: startTime, max: endTime },
	        		grid: { hoverable: true, clickable: true },
	        		series: {
	        			bars: { show: true, lineWidth: 5 },
	        			points: { show: false, fill: false }
	        		}
	        	});	   
        }
        else {        	
	   		var plot = jQuery.plot(jQuery(div), [
		        {
	    	        data: googleStats,
	        	    label: 'Google',
					bars: { show: true },
		        },
		        {
	    	        data: yahooStats,
	        	    label: 'Yahoo',
					bars: { show: true }
		        },
		        {
	    	        data: msnStats,
	        	    label: 'Bing (Microsoft)',
					bars: { show: true }
		        },
		        {
	    	        data: yandexStats,
	        	    label: 'Yandex (Russian)',
					bars: { show: true }
		        },
	    	    {
	        	    data: otherStats,
	            	label: 'Other',
					bars: { show: true }
	    	    }],
	        	{
	        		xaxis: { mode: "time", min: startTime, max: endTime },
	        		grid: { hoverable: true, clickable: true },
	        		series: {
	        			bars: { show: true, lineWidth: 5 },
	        			points: { show: false, fill: false }
	        		}
	        	});	        	
        }	
        	
	    var previousPoint = null;
	    jQuery(div).bind("plothover", function (event, pos, item) {
	
	        jQuery("#x").text(pos.x.toFixed(2));
	        jQuery("#y").text(pos.y.toFixed(2));
	
            if (item) {
                if (previousPoint != item.datapoint) {
                    
                    previousPoint = item.datapoint;
                    
                    jQuery("#tooltip").remove();
                    var x = item.datapoint[0].toFixed(2), y = item.datapoint[1].toFixed(2);                    
                    StatViewer.showTooltip(item.pageX, item.pageY, item.series.label + " = " + y);
                }
            }
            else {
                jQuery("#tooltip").remove();
                previousPoint = null;            
            }
	    });
	
	    jQuery(div).bind("plotclick", function (event, pos, item) {
	        if (item) {
	            jQuery("#clickdata").text("You clicked point " + item.dataIndex + " in " + item.series.label + ".");
	            plot.highlight(item.series, item.datapoint);
	        }
	    });        	
	},

	// ////////////////////////////////////////////////////////////////////////////

	
	/**
	* Get the image list for the currently selected gallery page
	*/
	paintStatGraph : function(div){
	
		var uniqueViews = StatViewerData.uniqueViewList;
		var pageViews = StatViewerData.pageViewList;
		var dateList = StatViewerData.dateList;
		
	    var graphdata1 = new Array();
	    var graphdata2 = new Array();
	    	    
	    var maxTime = new Date('1/1/1970');
	    	    
	    for (var i=0; i<uniqueViews.length; i++){
	       	var t = new Date(dateList[i]);
			graphdata1.push([t.getTime(), uniqueViews[i]]);
	    }

	    for (var i=0; i<pageViews.length; i++){
	       	var t = new Date(dateList[i]);
			graphdata2.push([t.getTime(), pageViews[i]]);
			
			if (t.getTime() > maxTime.getTime()){
				maxTime = new Date(t.getTime());
			}
	    }	    
	    
	    	    
	    var now = new Date();
	    now.setDate(now.getDate()-30);	    

	    var startTime = now.getTime();
		var endTime = maxTime.getTime();
	    
   		var plot = jQuery.plot(jQuery(div), [
	        {
    	        data: graphdata1,
        	    label: 'Unique Visitors',
            	lines: { show: true, fill: true }
	        },
    	    {
        	    data: graphdata2,
            	label: 'Page Views',
	            lines: { show: true, fill: true }
    	    }],
        	{
        		xaxis: { mode: "time", min: startTime, max: endTime },
        		grid: { hoverable: true, clickable: true },
        		series: {lines: { show: true }, points: { show: true }}
        	});		
        	
        	
	    var previousPoint = null;
	    jQuery(div).bind("plothover", function (event, pos, item) {
	
	        jQuery("#x").text(pos.x.toFixed(2));
	        jQuery("#y").text(pos.y.toFixed(2));
	
            if (item) {
                if (previousPoint != item.datapoint) {
                    
                    previousPoint = item.datapoint;
                    
                    jQuery("#tooltip").remove();
                    var x = item.datapoint[0].toFixed(2), y = item.datapoint[1].toFixed(2);                    
                    StatViewer.showTooltip(item.pageX, item.pageY, item.series.label + " = " + y);
                }
            }
            else {
                jQuery("#tooltip").remove();
                previousPoint = null;            
            }
	    });
	
	    jQuery(div).bind("plotclick", function (event, pos, item) {
	        if (item) {
	            jQuery("#clickdata").text("You clicked point " + item.dataIndex + " in " + item.series.label + ".");
	            plot.highlight(item.series, item.datapoint);
	        }
	    });
        		
	},
	
	
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

