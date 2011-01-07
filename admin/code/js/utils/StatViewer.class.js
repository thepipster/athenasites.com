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
        {
            label: "Firefox 2",
            data: firefox2
        },

        {
            label: "Firefox 3",
            data: firefox3
        },

        {
            label: "Safari 2",
            data: safari2
        },

        {
            label: "Safari 3",
            data: safari3
        },

        {
            label: "Safari 4",
            data: safari4
        },

        {
            label: "iPhone",
            data: iphone
        },

        {
            label: "IE 6",
            data: ie6
        },

        {
            label: "IE 7",
            data: ie7
        },

        {
            label: "IE 8",
            data: ie8
        },

        {
            label: "IE 9",
            data: ie9
        },

        {
            label: "Chrome",
            data: chrome
        },

        {
            label: "Other",
            data: other
        }
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
    paintCrawlerGraph : function(div, crawlerStats, isGlobal){

        if (isGlobal == undefined) isGlobal = false;
        
        var no_stats = 0;
		if (crawlerStats || crawlerStats != undefined){
	        no_stats = crawlerStats.length;
		}
        
		
        var yahooStats = new Array(); // Hits from 'Yahoo! Slurp'
        var googleStats = new Array(); // Hits from 'GoogleBot'
        var msnStats = new Array(); // Hits from 'MSN'
        var curlStats = new Array(); // Hits from 'Curl'
        var yandexStats = new Array(); // Hits from 'Yandex' (Russian)
        var otherStats = new Array(); // Others
		
		var maxTimeSet = false;
        var maxTime = new Date('1/1/1970');
        var nowTime = new Date();
        var now = new Date();
		
        //Set 1 day in milliseconds
        var one_day=1000*60*60*24

        // Clear arrays
        for (var i=1; i<31; i++){
		
			var d = new Date();
			d.setDate(d.getDate()-i);
		    
            googleStats[i] = new Array(d.getTime(), 0);
            yahooStats[i] = new Array(d.getTime(), 0);
            msnStats[i] = new Array(d.getTime(), 0);
            curlStats[i] = new Array(d.getTime(), 0);
            otherStats[i] = new Array(d.getTime(), 0);
		    	    
        }

        // Get the number of different crawlers
        for (var i=0; i<no_stats; i++){
			
            var crawler = crawlerStats[i].crw;
            var hits = crawlerStats[i].pv;
            var t = new Date(crawlerStats[i].dt);
						
            var daysago = Math.ceil((nowTime.getTime() - t.getTime())/one_day);
			
            if (crawler.indexOf('Google') != -1){
                googleStats[daysago] = Array(t.getTime(), hits);
            }
            else if (crawler.indexOf('MSN') != -1){
                msnStats[daysago] = Array(t.getTime(), hits);
            }
            else if (crawler.indexOf('Yahoo') != -1){
                yahooStats[daysago] = Array(t.getTime(), hits);
            }
            else if (crawler.indexOf('Curl') != -1){
                curlStats[daysago] = Array(t.getTime(), hits);
            }
            //else if (crawler.indexOf('Yandex') != -1){
            //    yandexStats[daysago] = Array(t.getTime(), hits);
            //}
            else {
                otherStats[daysago] = Array(t.getTime(), hits);
            }
			
            if (t.getTime() > maxTime.getTime()){
                maxTime = new Date(t.getTime());
                maxTimeSet = true;
            }
        }

		if (!maxTimeSet){
			maxTime = new Date();
		}
		
        //for (var i=1; i<31; i++){
		//	var d = new Date(googleStats[i][0]);
		//	Logger.error(d.toString() + " - " + googleStats[i][1]);
		//}
		
        now = new Date();
        now.setDate(now.getDate()-30);

        var startTime = now.getTime();
        var endTime = maxTime.getTime();
        
        //Logger.debug(now.toString() + " " + maxTime.toString());

        var plot = jQuery.plot(jQuery(div), [
        {
            data: googleStats,
            label: 'Google',
            lines: {
                show: true,
                fill: true
            }            
        },
        {
            data: yahooStats,
            label: 'Yahoo',
            lines: {
                show: true,
                fill: true
            }            
        },
        {
            data: msnStats,
            label: 'Bing (Microsoft)',
            lines: {
                show: true,
                fill: true
            }            
        },
        /*
        {
            data: yandexStats,
            label: 'Yandex (Russian)',
            bars: {
                show: true
            }
        },
        */
        {
            data: otherStats,
            label: 'Other',
//            bars: {
//                show: true
//            }
            lines: {
                show: true,
                fill: true
            }            
        }],
        {
        	legend: {
        		show: true,
        		position: "nw"
        	},        
            xaxis: {
                mode: "time",
                min: startTime,
                max: endTime
            },
            grid: {
                hoverable: true,
                clickable: true,
                markings: StatViewer.weekendAreas
            },
            series: {
                bars: {
                    show: false,
                    lineWidth: 5
                },
                points: {
                    show: true,
                    fill: false
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
	* @param string div - target div for graph
	* @param object pageViewData - data object returned by ajax call to server, in the form of an array of objects with
	* fields dt = date, uv = unique views, dt = data of view
	*/
    paintStatGraph : function(div, pageViewData){

        var uniqueViews = new Array();
        var pageViews = new Array();
        var dateList = new Array();
		
		if (pageViewData || pageViewData != undefined){
			for (var i=0; i<pageViewData.length; i++){
				uniqueViews.push(pageViewData[i].uv);
				pageViews.push(pageViewData[i].pv);
				dateList.push(pageViewData[i].dt);
			}
		}
		
		
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
            lines: {
                show: true,
                fill: true
            }
        },
        {
            data: graphdata2,
            label: 'Page Views',
            lines: {
                show: true,
                fill: true
            }
        }],
        {
        	legend: {
        		show: true,
        		position: "nw"
        	},
            xaxis: {
                mode: "time",
                min: startTime,
                max: endTime
            },
            grid: {
                hoverable: true,
                clickable: true,
                markings: StatViewer.weekendAreas
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
	                StatViewer.showTooltip(item.pageX, item.pageY, item.series.label + " = " + y + " on " + dateStr);
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

