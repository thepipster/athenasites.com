// jQuery Right-Click Plugin
//
// Version 1.01
//
// Cory S.N. LaViska
// A Beautiful Site (http://abeautifulsite.net/)
// 20 December 2008
//
// Visit http://abeautifulsite.net/notebook/68 for more information
//
// Usage:
//
//		// Capture right click
//		jQuery("#selector").rightClick( function(e) {
//			// Do something
//		});
//		
//		// Capture right mouse down
//		jQuery("#selector").rightMouseDown( function(e) {
//			// Do something
//		});
//		
//		// Capture right mouseup
//		jQuery("#selector").rightMouseUp( function(e) {
//			// Do something
//		});
//		
//		// Disable context menu on an element
//		jQuery("#selector").noContext();
// 
// History:
//
//		1.01 - Updated (20 December 2008)
//		     - References to 'this' now work the same way as other jQuery plugins, thus
//		       the el parameter has been deprecated.  Use this or jQuery(this) instead
//		     - The mouse event is now passed to the callback function
//		     - Changed license to GNU GPL
//
//		1.00 - Released (13 May 2008)
//
// License:
// 
// This plugin is dual-licensed under the GNU General Public License and the MIT License
// and is copyright 2008 A Beautiful Site, LLC. 
//
if(jQuery) (function(){
	
	jQuery.extend(jQuery.fn, {
		
		// ///////////////////////////////////////////////////////////////////////////////////
				
		rightClick: function(handler) {
			jQuery(this).each( function() {
				jQuery(this).mousedown( function(e) {
					var evt = e;
					jQuery(this).mouseup( function() {
						jQuery(this).unbind('mouseup');
						if( evt.button == 2 ) {
							handler.call( jQuery(this), evt );
							return false;
						} else {
							return true;
						}
					});
				});
				jQuery(this)[0].oncontextmenu = function() {
					return false;
				}
			});
			return jQuery(this);
		},		
	
		// ///////////////////////////////////////////////////////////////////////////////////
				
		leftClick: function(handler) {
		
			jQuery(this).each( function() {
				jQuery(this).mousedown( function(e) {
					
					var evt = e;
					
					jQuery(this).mouseup( function() {
						jQuery(this).unbind('mouseup');
						if( evt.button == 0 ) {
							handler.call( jQuery(this), evt );
							return false;
						} else {
							return true;
						}
					});
				});
			});
			return jQuery(this);
		},	
			
		// ///////////////////////////////////////////////////////////////////////////////////
		
		rightMouseDown: function(handler) {
			jQuery(this).each( function() {
				jQuery(this).mousedown( function(e) {
					if( e.button == 2 ) {
						handler.call( jQuery(this), e );
						return false;
					} else {
						return true;
					}
				});
				jQuery(this)[0].oncontextmenu = function() {
					return false;
				}
			});
			return jQuery(this);
		},
		
		// ///////////////////////////////////////////////////////////////////////////////////
		
		rightMouseUp: function(handler) {
			jQuery(this).each( function() {
				jQuery(this).mouseup( function(e) {
					if( e.button == 2 ) {
						handler.call( jQuery(this), e );
						return false;
					} else {
						return true;
					}
				});
				jQuery(this)[0].oncontextmenu = function() {
					return false;
				}
			});
			return jQuery(this);
		},
		
		// ///////////////////////////////////////////////////////////////////////////////////
		
		noContext: function() {
			jQuery(this).each( function() {
				jQuery(this)[0].oncontextmenu = function() {
					return false;
				}
			});
			return jQuery(this);
		},
	
		// ///////////////////////////////////////////////////////////////////////////////////
	
		/**
		* Detect a alt-click
		*/
		altClick: function(handler) {		
		
			jQuery(this).each( function() {
				
				jQuery(this).mousedown( function(e) {
					
					var evt = e;
					jQuery(this).mouseup( function() {
						if( evt.altKey) {
							jQuery(this).unbind('mouseup');
							handler.call( jQuery(this), evt );
							return false;
						} else {
							return true;
						}
					});
				});
				
			});
			return jQuery(this);
		},
		
		// ///////////////////////////////////////////////////////////////////////////////////
				
		/**
		* Detect a shift-click
		*/
		shiftClick: function(handler) {		
		
			jQuery(this).each( function() {
				
				jQuery(this).mousedown( function(e) {
					
					var evt = e;
					jQuery(this).mouseup( function() {
						if( evt.shiftKey ) {
							jQuery(this).unbind('mouseup');
							handler.call( jQuery(this), evt );
							return false;
						} else {
							return true;
						}
					});
				});
				
			});
			return jQuery(this);
		},			
	
		// ///////////////////////////////////////////////////////////////////////////////////
	
		/**
		* Detect a ctr-click
		*/
		ctrlClick: function(handler) {		
		
			jQuery(this).each( function() {
				
				jQuery(this).mousedown( function(e) {
					
					var evt = e;
					jQuery(this).mouseup( function() {
						if( evt.ctrlKey ) {
							jQuery(this).unbind('mouseup');
							handler.call( jQuery(this), evt );
							return false;
						} else {
							return true;
						}
					});
				});
				
			});
			return jQuery(this);
		},			
	});
	
})(jQuery);	