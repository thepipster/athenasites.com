/**
* Class for site-wide dialogs
*/
var AthenaDialog = {

    // ////////////////////////////////////////////////////////////////////////

    showLoading : function(msg){

        /*
		var txt = "";
		txt += "<div class='loading_box' style='position:relative; top:45%; width:200px; overflow:hidden' align='center'>";		
		txt += "    <img  src='"+defines.root_url+"images/loading_spinner.gif'/>";
		txt += "    <br/><span>" + msg + "</span>";
		txt += "</div>";

		$('#apollo_loading_display').html(txt);
		$('#apollo_loading_display').width($(window).width());
		$('#apollo_loading_display').height($(window).height());
		$('#apollo_loading_display').show();
*/


        $('#apollo_loading_dialog').dialog("destroy");
				
        $('#apollo_loading_dialog').html("<div align='center'><img src='"+defines.root_url+"images/spinner.gif'/></div>");
		
        $('#apollo_loading_dialog').dialog({
            resizable: true,
            height:70,
            width: 250,
            closeOnEscape: false,
            modal: true,
            //overlay: {opacity: 0.1, background: "black"},
            title: msg
        })
		
    },

    // ////////////////////////////////////////////////////////////////////////

    clearLoading : function(){
        //$('#apollo_loading_display').html("");
        //$('#apollo_loading_display').hide();
        $('#apollo_loading_dialog').dialog("destroy");
    },

    // ////////////////////////////////////////////////////////////////////

    error : function(msg){
		/*
        $('#apollo_dialog').dialog("destroy");
				
        $('#apollo_dialog').html(msg);
		
        $('#apollo_dialog').dialog({
            resizable: false,
            //height:140,
            modal: true,
            title: "Error"
        });
        */
        //Message.error(msg);
    },
	
    // ////////////////////////////////////////////////////////////////////////

    /**
	* Display a info message to the user
	*/
    message : function(msg, msgTitle){
    
        if (msgTitle == undefined){
            msgTitle = "Message";
        }

        $('#apollo_dialog').dialog("destroy");

        $('#apollo_dialog').html(msg);

        $('#apollo_dialog').dialog({
            resizable: false,
            //			height:140,
            modal: true,
            title: msgTitle,
            buttons: {
                Ok: function() {
                    $(this).dialog('close');
                }
            }
        });
    },
	
    // ////////////////////////////////////////////////////////////////////////

    /**
	* Display an alert to the user
	*/
    alert : function(msg, msgTitle){
		
        if (msgTitle == undefined){
            msgTitle = "Message";
        }
		
        $('#apollo_dialog').dialog("destroy");
				
        $('#apollo_dialog').html(msg);
		
        $('#apollo_dialog').dialog({
            resizable: false,
            //			height:140,
            modal: false,
            title: msgTitle,
            buttons: {
                Ok: function() {
                    $(this).dialog('close');
                }
            }
        });
    },
	
    // ////////////////////////////////////////////////////////////////////////

    confirm : function(msg, onOKCallback, onCancelCallback){
				
        $('#apollo_dialog').dialog("destroy");
				
        $('#apollo_dialog').html(msg);
		
        $('#apollo_dialog').dialog({
            resizable: false,
            height:140,
            modal: true,
            title: "Confirm",
            buttons: {
                Cancel: function() {
                    $(this).dialog('close');
                    if (onCancelCallback) onCancelCallback();
                },
                Ok: function() {
                    $(this).dialog('close');
                    if (onOKCallback) onOKCallback();
                }
            }
        })
		
    },
		
    // ////////////////////////////////////////////////////////////////////////
	
    showAjaxError : function(ret){
		
        if (ret.data != undefined){
            Message.error(ret.result + '\n' + ret.data);
        }
        else {
            Message.error(ret.data);
        }
		
    },
    
    // ////////////////////////////////////////////////////////////////////////
    
    /**
    * Set the colormap to use for a progress bar (a jQuery UI progress bar)
    *
    * @param string div - div of the progress bar
    * @param string map - color map to user, options are 'heat', 'roygbiv'
    */
    setProgressBarColorMap : function(div, minVal, maxVal, map){
    
	    $(div).bind('progressbarchange', function(event, ui) {
	        var selector = "#" + this.id + " > div";
	        var val = this.getAttribute( "aria-valuenow" );
	        
	        if (map == undefined) map = 'heat';
	        
	        var hexCol = '#f00';
	        
	        if (map == 'heat'){
				hexCol = AthenaDialog.findHeatcolor(val, minVal, maxVal, 'greentored');
	        }
	        else if (map == 'roygbiv'){
				hexCol = AthenaDialog.findHeatcolor(val, minVal, maxVal, 'roygbiv');
	        }
			
			$(selector).css({ 'background': hexCol });
			
	        /*
	        if (value < 10){
	            $(selector).css({ 'background': 'Green' });
	        } else if (value < 20){
	            $(selector).css({ 'background': 'Yellow' });
	        } else if (value < 30){
	            $(selector).css({ 'background': '#ffccee' });
	        } else if (value < 40){
	            $(selector).css({ 'background': '#ffccee' });
	        } else if (value < 50){
	            $(selector).css({ 'background': '#ffccee' });
	        } else if (value < 60){
	            $(selector).css({ 'background': '#ffccee' });
	        } else if (value < 70){
	            $(selector).css({ 'background': '#ffccee' });
	        } else if (value < 80){
	            $(selector).css({ 'background': '#ffccee' });
	        } else if (value < 90){
	            $(selector).css({ 'background': '#ffccee' });
	        } else{
	            $(selector).css({ 'background': 'DarkRed' });
	        }*/
	    });
	},   
	        
	findHeatcolor : function(curval, mn, mx, colorStyle) {

		// value between 1 and 0
		var position = 1 - ((curval - mn) / (mx - mn)); 
		var lightness = 0.15; // 0 to 0.9
		
		// this adds 0.5 at the top to get red, and limits the bottom at x= 1.7 to get purple
		var shft = colorStyle == 'roygbiv' ? 0.5*position + 1.7*(1-position) : position + 0.2 + 5.5*(1-position);
		
		// scale will be multiplied by the cos(x) + 1 
		// (value from 0 to 2) so it comes up to a max of 255
		var scale = 128;
		
		// period is 2Pi
		var period = 2*Math.PI;
		
		// x is place along x axis of cosine wave
		var x = shft + position * period;
		
		// shift to negative if greentored
		x = colorStyle != 'roygbiv' ? -x : x;
			
		var r = AthenaDialog.processColor( Math.floor((Math.cos(x) + 1) * scale), lightness );
		var g = AthenaDialog.processColor( Math.floor((Math.cos(x+Math.PI/2) + 1) * scale), lightness );
		var b = AthenaDialog.processColor( Math.floor((Math.cos(x+Math.PI) + 1) * scale), lightness );
		
		return '#' + r + g + b;

	},
	
	/**
	* 
	*/
	processColor : function( num, lightness ) {
		
		// adjust lightness
		var n = Math.floor( num + lightness * (256 - num));
		
		// turn to hex
		var s = n.toString(16);
		
		// if no first char, prepend 0
		s = s.length == 1 ? '0' + s : s;
		
		return s;		
	}
}