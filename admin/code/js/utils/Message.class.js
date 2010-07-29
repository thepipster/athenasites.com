/**
 * @author Mike Pritchard
 * @since 30th November
 */
var Message = {

	/** Div to display messages */
	m_div : '',
	m_width : 500,
	m_height : 500,
	
	m_showDebug : false,

	// ////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Set up this class, setting the div to display messages in
	*/
	init : function(div){
	
		Message.m_div = div;
		$(Message.m_div).draggable();
		
		Message.clear();
		
		// Grab starting size
		Message.m_width = $(Message.m_div).width();
		Message.m_height = $(Message.m_div).height();
		
		$(Message.m_div).css('left','90%');
		//$(Message.m_div).dblclick(Message.onToggleShrink);
		
	},
	
	// ////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Clear all messages
	*/
	clear : function(){
		//Effect.Fade(Message.m_div);
		var txt = "<div id='Message_headerBar' style='background-color: grey; height:22px; width:100%;'>";
		txt += "<button onclick='Message.clear()' style='float:left; margin-right:5px'>Clear</button>";
		txt += "<button id='Message_shrinkButton' onclick='Message.onToggleShrink()' style='float:left; margin-right:5px'>Shrink</button>";
		txt += "<button onclick='Message.hide()' style='float:right;'>Exit</button>";
		txt += "</div>";
		txt += "<div id='Message_content' style='width:100%; clear: both'></div>";
		
		$(Message.m_div).html(txt);
	},
	
	// ////////////////////////////////////////////////////////////////////////////////
	
	onToggleShrink : function(){
		var ht = $(Message.m_div).height();
		
		if (ht < Message.m_height){
			// Grow
			$(Message.m_div).height(Message.m_height);
			$(Message.m_div).width(Message.m_width);
			$('#Message_shrinkButton').html('Shrink');
			$(Message.m_div).css('overflow','auto');
		}
		else {
			// Shrink
			$(Message.m_div).height(30);
			$(Message.m_div).width(200);
			$('#Message_shrinkButton').html('Grow');
			$(Message.m_div).css('overflow','hidden');
		}
		
		//$(Message.m_div)	
	},

	// ////////////////////////////////////////////////////////////////////////////////
	
    toggleShow : function(){
        if (Message.m_showDebug){
            Message.hide();
        }
        else {
            Message.show();
        }
    },

	// ////////////////////////////////////////////////////////////////////////////////

	m_showOnError : false,
	
	/**
	* Hides the message box unless there is an error!
	*/
	showOnError : function(){
		Message.m_showOnError = true;
	},

	// ////////////////////////////////////////////////////////////////////////////////
	
	show : function(){
		Message.m_showDebug = true;
		$(Message.m_div).show();
	},

	// ////////////////////////////////////////////////////////////////////////////////

	hide : function(){
		Message.m_showDebug = false;
		$(Message.m_div).hide();
	},

  
	// ////////////////////////////////////////////////////////////////////////////////
			
	trace : function(msg, type){

		// For getting a detailed stack trace, check out 
		// http://github.com/emwendelin/javascript-stacktrace/blob/master/stacktrace.js
		
		var col = 'black';
		
		if (type){
			if (type == 'error') col = 'red';
			if (type == 'warn') col = 'orange';
			if (type == 'info') col = 'blue';
			if (type == 'debug') col = 'green';
		} 
		        
		if (Message.m_showOnError && !Message.m_showDebug && type == 'error'){
			Message.show();
		}
		        
		//var text = $(Message.m_div).html();
		//$(Message.m_div).html(text + "<b style='color: "+col+"'>" + msg + "</b><br/>");
		//var text = $(Message.m_div).html();
		$('#Message_content').append("<b style='color: "+col+"'>" + msg + "</b><br/>");
/*
	  	try { 
	  		throw Error('') 
	  	} 
	  	catch(e) { 
			//var err = getErrorObject();			
			//err.fileName;
			//err.lineNumber; // or `err.line` in WebKit
		//	alert(err.fileName + " " + err.lineNumber);
			alert(e.stack);
	  	}
*/
		//Effect.Appear(Message.m_div);
		//setTimeout('Message.clear()', 4000);
	},

	// ////////////////////////////////////////////////////////////////////////////////

	debug : function(msg){ Message.trace(msg, 'debug');},
	info : function(msg){ Message.trace(msg, 'info');},
	warn : function(msg){ Message.trace(msg, 'warn');},	
	warning : function(msg){ Message.trace(msg, 'warn');},	
	error : function(msg){ Message.trace(msg, 'error');}	
				
}