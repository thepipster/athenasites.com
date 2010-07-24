/**
 * @author Mike Pritchard
 * @since 30th November
 */
var Message = {

	/** Div to display messages */
	m_div : '',
	
	m_showDebug : false,

	// ////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Set up this class, setting the div to display messages in
	*/
	init : function(div){
		Message.m_div = div;
		$(Message.m_div).draggable();
	},
	
	// ////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Clear all messages
	*/
	clear : function(){
		//Effect.Fade(Message.m_div);
		$(Message.m_div).html("");
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

		var col = 'black';
		
		if (type){
			if (type == 'error') col = 'red';
			if (type == 'warn') col = 'orange';
			if (type == 'info') col = 'blue';
			if (type == 'debug') col = 'green';
		} 
		        
		var text = $(Message.m_div).html();
		$(Message.m_div).html(text + "<b style='color: "+col+"'>" + msg + "</b><br/>");
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