/**
* Detect a shift-click event
*
* @author Mike Pritchard (mike@apollosites.com)
* @since 9th April, 2010
*/

if(jQuery)(function() {

	var defaults = {
		length: 300,
		minTrail: 20,
		moreText: "more",
		lessText: "less"
	};
	
//	isDragging : false,
//	shiftSelectStarted : false,
//	shiftSelectStartedID : '',

	// /////////////////////////////////////////////////////////////
	
	// plugin definition
	jQuery.fn.multiDrag = function(options) {
	
	  		// Extend our default options with those provided.
  			var opts = jQuery.extend(defaults, options);
  
			jQuery(this).each( function() {
				jQuery(this).mousedown( function(e) {
					
					var evt = e;
					
					jQuery(this).mouseup( 
						function() {
										
							//jQuery(this).unbind('mousedown');
							jQuery(this).unbind('mouseup');
							
							//alert("Ctrl:"+evt.ctrlKey + " Alt:" + evt.altKey + " Shift:" + evt.shiftKey);
							
							if (evt.ctrlKey){
								// Ctrl-left click
								trace('ctrl-click');
								onAltClick(this);
							}
							else if( evt.button == 0 ) {
								if (evt.shiftKey){
									// Shift-left click
									trace('shift-click');
									onShiftClick(this);
								}
								else if (evt.altKey){
									// Alt-left click
									trace('alt-click');
									onAltClick(this);
								}
								else {
									// Just a left click
									trace('left-click');
									onStartClick(this);
								}
								return false;
							} 
							else if( evt.button == 2) {
								// Right click
								trace('right-click');
								onRightClickImage(this);
								return true;
							}
						}
					);
				});
			});	
	
	};
	
	// /////////////////////////////////////////////////////////////
	
	// private function for debugging
	function trace(msg) {
		//alert(msg);
	};
	
	// /////////////////////////////////////////////////////////////
	
	var shiftSelectStartedID = -1;
	var	shiftSelectStarted = false;
	
	function onStartClick(obj){
					
		// This clears the current selection
		if (jQuery('.multiselected').size() > 0){
			jQuery('.multiselected').removeClass('multiselected');
		}
					
		if (jQuery(obj).is('.multiselected')){
			shiftSelectStarted = false;
			jQuery(obj).removeClass('multiselected');
		}
		else {
			shiftSelectStartedID = jQuery(obj).attr('id');
			shiftSelectStarted = true;
			jQuery(obj).addClass('multiselected');
			//setTimeout('jQuery.multiDrag.makeMultiSelectedDraggable()',300);
			setTimeout(function() { makeMultiSelectedDraggable(); }, 300 );
		}
		
	};
	
	// /////////////////////////////////////////////////////////////
	
	function onAltClick(obj){
										
		if (jQuery(obj).is('.multiselected')){
			jQuery(obj).draggable('destroy');
			jQuery(obj).removeClass('multiselected');
		}
		else {
			jQuery(obj).addClass('multiselected');
			//setTimeout('jQuery.multiDrag.makeMultiSelectedDraggable()',300);
			setTimeout(function() { makeMultiSelectedDraggable(); }, 300 );
		}
		
	};

	// /////////////////////////////////////////////////////////////

	function onShiftClick(obj){
										
		var id = jQuery(obj).attr('id');						

	 	jQuery('.multiselected').removeClass('multiselected')
		
		if (shiftSelectStarted){

			var foundStart = false;
			var foundEnd = false;
					
	  		jQuery('.thumb').each(	
	  			function(){	  				
	  				if (!foundEnd){
		  				if (jQuery(this).attr('id') == shiftSelectStartedID){
		  					foundStart = true;
		  				}
		  				
		  				if (foundStart){
		  					jQuery(this).addClass('multiselected');
		  				}
		  				
		  				if (foundStart && jQuery(this).attr('id') == id){
		  					foundEnd = true;
		  				}
	  				}	  				
	  			}
	  		);
	  		
	  		// If we didn't find the end, try going backwards
	  		if (!foundEnd){
	  		
	  			jQuery('.multiselected').removeClass('multiselected')
	  			
				foundStart = false;
				foundEnd = false;
	  		
		  		jQuery('.thumb').each(	
		  			function(){	  				
		  				if (!foundEnd){
		  				
			  				if (jQuery(this).attr('id') == id){
			  					foundStart = true;
			  				}
		  							  				
			  				if (foundStart){
			  					jQuery(this).addClass('multiselected');
			  				}
			  				
			  				if (jQuery(this).attr('id') == ImageSelector.shiftSelectStartedID){
			  					foundEnd = true;
			  				}
			  				
		  				}	  				
		  			}
		  		);
	  		}
		
			//setTimeout('jQuery.multiDrag.makeMultiSelectedDraggable()',300);
			setTimeout(function() { makeMultiSelectedDraggable(); }, 300 );
			
		}
		else {
			onStartClick(obj);
		}

	};
	
	// /////////////////////////////////////////////////////////////

	function makeMultiSelectedDraggable() {
	
		jQuery('.multiselected').draggable({		
				revert: true,
				zIndex: 300,
				delay: 200,				
			  	helper: function(){
			  		//return "<div>sdgsgsg</div>"			  		
			  		var txt = "<div id='multidrag_container'>";
			  		var ct = 0;
			  		
			  		jQuery('.multiselected').each(	
			  			function(){
			  				if (ct < 20){
				  				var offset = ct * 5; ct++;
				  				var src = jQuery(this).attr('src');
				  				var id = jQuery(this).attr('id');
				  				var style = "position: absolute; top: " + offset + "px; left:" + offset + "px;";
				  				txt += "<img id='"+id+"' src='"+src+"' class='dragged_thumb' width='50px' height='50px' style='"+style+"'>";
			  				}
			  			}
			  		);
			  		
			  		txt += "</div>";
			  		
			  		return txt;			  					  		
				}
			}
		);
	};

	// /////////////////////////////////////////////////////////////

})(jQuery);