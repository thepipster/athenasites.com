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
		}		
	});
	
})(jQuery);	
// jQuery-typing
//
// Version: 0.2.0
// Website: http://narf.pl/jquery-typing/
// License: public domain <http://unlicense.org/>
// Author:  Maciej Konieczny <hello@narf.pl>
(function(f){function l(g,h){function d(a){if(!e){e=true;c.start&&c.start(a,b)}}function i(a,j){if(e){clearTimeout(k);k=setTimeout(function(){e=false;c.stop&&c.stop(a,b)},j>=0?j:c.delay)}}var c=f.extend({start:null,stop:null,delay:400},h),b=f(g),e=false,k;b.keypress(d);b.keydown(function(a){if(a.keyCode===8||a.keyCode===46)d(a)});b.keyup(i);b.blur(function(a){i(a,0)})}f.fn.typing=function(g){return this.each(function(h,d){l(d,g)})}})(jQuery);

/**
 * @author mikep
 */

// ///////////////////////////////////////////////////////////////////

//code_url = window.location.href.substr(0, window.location.href.indexOf("/admin") ) + "/code/";
//base_url = window.location.href.substr(0, window.location.href.indexOf("/admin") );

// location object:
//<protocol>//<host>[:<port>]/<pathname>[<hash>][<search>]
var base_url = location.protocol + '//' + location.host + "/";
var admin_base_url = location.protocol + '//' + location.host + '/admin/';
var code_url = admin_base_url + 'code/';

/**
* This class contains all the globally required constants
*/
var defines = {
	flash_upload_processor:	code_url + "php/FlashProcessUpload.php",
	upload_processor:		code_url + "php/ProcessUpload.php",
	root_url: 				admin_base_url,
	code_url: 				code_url,
//	user_files_root_url: 	base_url + "user_files/",
	user_files_root_url: 	"http://files.apollosites.com/",
	domain:                 "athenasites.com",
	max_hdd:				500 // MB
};

/**
 * @author Mike Pritchard
 * @since 30th November
 */
var Logger = {

	/** Div to display Loggers */
	m_div : '',
	m_width : 500,
	m_height : 500,
	
	m_showDebug : false,

	// ////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Set up this class, setting the div to display Loggers in
	*/
	init : function(div){
	
		Logger.m_div = div;
		$(Logger.m_div).draggable();
		
		Logger.clear();
		
		// Grab starting size
		Logger.m_width = $(Logger.m_div).width();
		Logger.m_height = $(Logger.m_div).height();
		
		$(Logger.m_div).css('left','10%');
		//$(Logger.m_div).dblclick(Logger.onToggleShrink);
		
	},
	
	// ////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Clear all messages
	*/
	clear : function(){
		//Effect.Fade(Logger.m_div);
		var txt = "<div id='Logger_headerBar' style='background-color: grey; height:22px; width:100%;'>";
		txt += "<button onclick='Logger.clear()' style='float:left; margin-right:5px'>Clear</button>";
		txt += "<button id='Logger_shrinkButton' onclick='Logger.onToggleShrink()' style='float:left; margin-right:5px'>Shrink</button>";
		txt += "<button onclick='Logger.hide()' style='float:right;'>Exit</button>";
		txt += "</div>";
		txt += "<div id='Logger_content' style='width:100%; clear: both'></div>";
		
		$(Logger.m_div).html(txt);
	},
	
	// ////////////////////////////////////////////////////////////////////////////////
	
	onToggleShrink : function(){
		var ht = $(Logger.m_div).height();
		
		if (ht < Logger.m_height){
			// Grow
			$(Logger.m_div).height(Logger.m_height);
			$(Logger.m_div).width(Logger.m_width);
			$('#Logger_shrinkButton').html('Shrink');
			$(Logger.m_div).css('overflow','auto');
		}
		else {
			// Shrink
			$(Logger.m_div).height(30);
			$(Logger.m_div).width(200);
			$('#Logger_shrinkButton').html('Grow');
			$(Logger.m_div).css('overflow','hidden');
		}
		
		//$(Logger.m_div)	
	},

	// ////////////////////////////////////////////////////////////////////////////////
	
    toggleShow : function(){
        if (Logger.m_showDebug){
            Logger.hide();
        }
        else {
            Logger.show();
        }
    },

	// ////////////////////////////////////////////////////////////////////////////////

	m_showOnError : false,
	
	/**
	* Hides the Logger box unless there is an error!
	*/
	showOnError : function(){
		Logger.m_showOnError = true;
	},

	// ////////////////////////////////////////////////////////////////////////////////
	
	show : function(){
		Logger.m_showDebug = true;
		$(Logger.m_div).show();
	},

	// ////////////////////////////////////////////////////////////////////////////////

	hide : function(){
		Logger.m_showDebug = false;
		$(Logger.m_div).hide();
	},

  
	// ////////////////////////////////////////////////////////////////////////////////
			
	trace : function(msg, type){

		// For getting a detailed stack trace, check out 
		// http://github.com/emwendelin/javascript-stacktrace/blob/master/stacktrace.js
		
		var col = 'black';
		
		if (type){
			if (type == 'error') col = 'red';
			if (type == 'warn') col = 'orange';
			if (type == 'info') col = 'white';
			if (type == 'debug') col = 'green';
		} 
		        
		if (Logger.m_showOnError && !Logger.m_showDebug && type == 'error'){
			Logger.show();
		}
		        
		//var text = $(Logger.m_div).html();
		//$(Logger.m_div).html(text + "<b style='color: "+col+"'>" + msg + "</b><br/>");
		//var text = $(Logger.m_div).html();
		$('#Logger_content').prepend("<b style='color: "+col+"'>" + msg + "</b><br/>");
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
		//Effect.Appear(Logger.m_div);
		//setTimeout('Logger.clear()', 4000);
	},

	// ////////////////////////////////////////////////////////////////////////////////

	debug : function(msg){ Logger.trace(msg, 'debug');},
	info : function(msg){ Logger.trace(msg, 'info');},
	warn : function(msg){ Logger.trace(msg, 'warn');},	
	warning : function(msg){ Logger.trace(msg, 'warn');},	
	error : function(msg){ Logger.trace(msg, 'error');}	
				
}
/**
* Class for site-wide dialogs
*/
var AthenaDialog = {

    // ////////////////////////////////////////////////////////////////////////

	/**
	* Locak the background by painting a full screen transparent div
	*/
	lockBackground : function(){
			// TODO: background lock out
	},
	
	unlockBackground : function(){
	},
	
    // ////////////////////////////////////////////////////////////////////////

    showLoading : function(msg, isModal){

        if (isModal == undefined){
            isModal = true;
        }

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
		if (isModal){
			AthenaDialog.lockBackground();
		}

        $('#apollo_loading_dialog').dialog("destroy");
				
        $('#apollo_loading_dialog').html("<div align='center'><img src='"+defines.root_url+"images/spinner.gif'/></div>");
		
        $('#apollo_loading_dialog').dialog({
            resizable: true,
            height:70,
            width: 250,
            closeOnEscape: false,
            modal: false,
            //overlay: {opacity: 0.1, background: "black"},
            title: msg
        })
		
    },

    // ////////////////////////////////////////////////////////////////////////

    clearLoading : function(){
        //$('#apollo_loading_display').html("");
        //$('#apollo_loading_display').hide();
        $('#apollo_loading_dialog').dialog("destroy");
		AthenaDialog.unlockBackground();
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
        //Logger.error(msg);
    },
	
    // ////////////////////////////////////////////////////////////////////////
	
	/**
	* Display an alert to the user that is not in the form of a dialog, but is just text that
	* isn't too distracting
	*/
	backgroundMessage : function(msg){

		$('.user_message').stop();
	
		var startCol = '#032f5d'; 
//		var midCol = '#cc2222';
		var midCol = '#cc2222';
		var endCol = startCol;
		
		$('.user_message').html(msg);
		$('.user_message').show();
		$('.user_message').css('color', startCol);
		
		$('.user_message').animate({ color: midCol }, 3000, 
			function(){
				$('.user_message').animate({ color: endCol }, 3000, function(){$('.user_message').fadeOut('slow')})
			}
		);
	},
	
	clearBackgroundMessage : function(msg){
		$('.user_message').fadeOut('slow');
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
            modal: false,
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
            Logger.error(ret.result + '\n' + ret.data);
        }
        else {
            Logger.error(ret.data);
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
/**
* Utiliy functions
*
* @since 30th March, 2010
*/
var AthenaUtils = {

    /**
	* Encode characters to html tags;
	* ' becomes &#039;
	* & becomes &amp;
	* " becomes &quot;
	* < becomes &lt;
	* > becomes &gt;
	*/
    htmlEncode : function(string) {
        if (string == '' || string == undefined){
            return '';
        }
        string = string.toString();
        string = string.replace(/&/g, '&amp;');	    
        string = string.replace(/'/g, '&#039;');
        string = string.replace(/"/g, '&quot;');
        string = string.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return string;
    },

    /**
	* Decode content coing back from the DB
	*/
    decodeContent : function(string){
        if (string == '' || string == undefined){
            return '';
        }
        string = string.toString();
        string = string.replace(/\\/g, '');	    
        return string;
    },
	
    /**
	* Encode a post/page title, do nothing on client side for now
	*/
    encodeTitle : function(string){
        return string;
    },
	
    /**
	* Encode the page/post slug, do nothing on client side for now
	*/
    encodeSlug : function(title){
        return title;
    },


	/**
	* Format a number, and add commas
	*
	* @nStr Number to be formatted
	* @nDP Number of decimal places
	*/
	addCommas : function(nStr, nDP) {
		nStr = parseFloat(nStr).toFixed(nDP);
		nStr += '';
		x = nStr.split('.');
		x1 = x[0];
		x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2; //.toFixed(nDP);
	}    
}
/**
*
* @author Mike Pritchard (mike@apollosites.com)
* @since 3rd January, 2011
*/
var ssMain = {

    VIEW_DASHBOARD 	: 1,
    VIEW_PAGES 		: 3,
    VIEW_FILES 		: 2,
    VIEW_POSTS 		: 4,
    VIEW_GALLERIES 	: 5,
    VIEW_STATS 		: 6,
    VIEW_SETTINGS 	: 7,

    view : 1,
    
    // ////////////////////////////////////////////////////////////////////////

    init : function(siteID, view){

		ssMain.view = view;
		
        // Setup the JS logger
        Logger.init('#debug_txt');
        //Logger.showOnError();

        // Start auto-save timer....
        setInterval ( "DataStore.save()", 5000 );

        // Save when browser quits
        $(window).unload( function () {DataStore.save();} );

		// Force resize, and setup resize event
		setTimeout("ssMain.onResize()", 100);
        $(window).resize( function(){ssMain.onResize()});
        
		// Change listeners
		$('.apolloDataInput').typing({ stop: ssMain.onDataChange, delay: 400});
		$('.apolloDataInput').change(ssMain.onDataChange);        
	},
	
    // ////////////////////////////////////////////////////////////////////////

    onResize : function(){
     	$('#MainContents').height($(window).height()-$('#menu_container').height()-20);
    },

    // ////////////////////////////////////////////////////////////////////////

    onLogout : function(){
        AthenaDialog.confirm("Are you sure you want to log out?", ssMain.startLogout);
    },

    startLogout : function(){
        SystemAPI.logOut(ssMain.doLogout);
    },

    doLogout : function(){
        window.location = "index.php";
    },
		
    // ////////////////////////////////////////////////////////////////////////

	/**
	* Listen for changes in data input fields (that have the class 'apolloDataInput'), and pipe to the correct frame
	*/	
	onDataChange : function(){
        switch(ssMain.view){
            case ssMain.VIEW_PAGES : PagesFrame.onChange(); break;
            case ssMain.VIEW_POSTS : PostsFrame.onChange(); break;
            case ssMain.VIEW_FILES: FilesFrame.onImageEditorChange(); break;
            case ssMain.VIEW_DASHBOARD:
            case ssMain.VIEW_GALLERIES:
            case ssMain.VIEW_STATS: break;
        }		
	}		
}
/**
* Store all current data
*
* @since 28th July, 2010
* @author (mike@apollosites.com)
*/
var DataStore = {

    m_currentFolderID : -1, // folder id of 1 is considered 'unassigned'
    m_currentPageID : 0,
    m_currentGalleryNo : 1, // For multi-galleries
    m_currentPostID : 0,
    m_currentTag : '',

    /** Currently selected site id (if the user has more than 1 site!) */
    m_siteID : 0,

    /** List of folders for the site with fields; id, site_id, name */
    m_folderList : '',

    /** List of media for the site */
    m_mediaList : '',

    /** List of posts */
    m_postList : '',

    /** List of pages for the site */
    m_pageList : '',

    /** Page template list */
    m_templateList : '',

    /** Theme parameter list */
    m_themeParaList : '',

    /** List of parameters set for this site */
    m_siteParaList : '',

    /** Gallery image list */
    m_galleryImageList : '',

    /** Gallery meta information */
    m_galleryMetaList : '',

    /** List of post categories */
    m_categories : '',

    /** List of post tags */
    m_tags : '',
    
    /** List of media tags */
    m_mediaTags : '',
        
    /** Flag to enable stopping/starting of auto-save feature */
    m_doAutoSave : true,

    // //////////////////////////////////////////////////////////////////////////////////

    init : function(siteID){
        DataStore.m_siteID = siteID;
    },

    // //////////////////////////////////////////////////////////////////////////////////

    clear : function(){
        DataStore.m_folderList = '';
        DataStore.m_mediaList = '';
        DataStore.m_pageList = '';
    },

    // //////////////////////////////////////////////////////////////////////////////////

    getSiteParaValue : function(page_id, theme_para_id){

        for(var i=0; i<DataStore.m_siteParaList.length; i++){

            if ((DataStore.m_siteParaList[i].theme_para_id == theme_para_id) && (DataStore.m_siteParaList[i].page_id == page_id)){
                return DataStore.m_siteParaList[i].para_value;
            }
        }

        return false;
    },

    // //////////////////////////////////////////////////////////////////////////////////

    getPageThemeParas : function(template_name){
        var list = new Array();
        for(var i=0; i<DataStore.m_themeParaList.length; i++){
            if (DataStore.m_themeParaList[i].page_template_name == template_name){
                list.push(DataStore.m_themeParaList[i]);
            }
        }
        return list;
    },

    // //////////////////////////////////////////////////////////////////////////////////

    getImage : function(image_id){

        for(var i=0; i<DataStore.m_mediaList.length; i++){
            if (DataStore.m_mediaList[i].id == image_id){
                return DataStore.m_mediaList[i];
            }
        }
        
        return false;
    },

 
    // //////////////////////////////////////////////////////////////////////////////////

    /**
	* Add a new image to a gallery. If the slot is currently full, then insert the image by moving all the laters image
	* by one slot.
	*/
    /*
	addGalleryImage : function(media_id, slot_no, theme_para_id){


		var slotContents = DataStore.getGallerySlotImage(slot_no, gallery_no);
		var currentImage = false;
		var newImage = DataStore.getImage(media_id);

		if (slotContents){
			image = DataStore.getImage(slotContents.image_id);
		}

		// If the slot is not open, then increment the slot counter for all images
		// with slot numbers equal to or greater than this one
		if (!DataStore.isSlotFree(slot_no)){
			for (var i=0; i<DataStore.m_galleryImageList.length; i++){
				if (DataStore.m_galleryImageList[i].slot_number >= slot_no){
					DataStore.m_galleryImageList[i].slot_number++;
				}
			}
		}

		// Add the new image.....
		var galImg = new Array();
		galImg.image_id = media_id;
		galImg.slot_number = slot_no;
		galImg.theme_para_id = theme_para_id;
		galImg.gallery_number = DataStore.m_currentGalleryNo;
		galImg.page_id = DataStore.m_currentPageID;

		DataStore.m_galleryImageList.push(img);
	},
	*/

    removeGalleryImage : function(slot_no){

        var tempList = new Array();

        for (var i=0; i<DataStore.m_galleryImageList.length; i++){

            if (!(DataStore.m_galleryImageList[i].slot_number == slot_no &&
                DataStore.m_galleryImageList[i].gallery_number == DataStore.m_currentGalleryNo)){
                tempList.push(DataStore.m_galleryImageList[i]);
            }
        }

        DataStore.m_galleryImageList = tempList;

    },

    // //////////////////////////////////////////////////////////////////////////////////

    isSlotFree : function(slot_no){
        var slotContents = DataStore.getGallerySlotImage(slot_no, gallery_no);
        if (slotContents == undefined || !slotContents) return false;
        return true;
    },

    // //////////////////////////////////////////////////////////////////////////////////

    /**
	* Check to see if a page can have a gallery, based on its template
	*/
    isGalleryPage : function(page_id){

        var page = DataStore.getPage(page_id);
        var pageParas = DataStore.getPageThemeParas(page.template);

        for (var i=0; i<pageParas.length; i++){
            if (pageParas[i].para_type == 'gallery'){
                return true;
            }
        }
        return false;
    },

    // //////////////////////////////////////////////////////////////////////////////////

    getGallerySlotImage : function(slot_no, gallery_no){
        for (var i=0; i<DataStore.m_galleryImageList.length; i++){
            if (DataStore.m_galleryImageList[i].slot_number == slot_no &&
                DataStore.m_galleryImageList[i].gallery_number == gallery_no){
                return DataStore.m_galleryImageList[i];
            }
        }
        return false;
    },

    // //////////////////////////////////////////////////////////////////////////////////

    getPage : function(page_id){

        for(var i=0; i<DataStore.m_pageList.length; i++){
            if (DataStore.m_pageList[i].id == page_id){
                return DataStore.m_pageList[i];
            }
        }
        AthenaDialog.error('coiuld not find page with id = ' + page_id);
        return false;
    },

    // //////////////////////////////////////////////////////////////////////////////////

    getHomePage : function(){

        for(var i=0; i<DataStore.m_pageList.length; i++){
            if (DataStore.m_pageList[i].is_homepage == 1){
                return DataStore.m_pageList[i];
            }
        }
        return false;
    },

    // //////////////////////////////////////////////////////////////////////////////////

    getBlogPage : function(){

        for(var i=0; i<DataStore.m_pageList.length; i++){
            if (DataStore.m_pageList[i].is_blogpage == 1){
                return DataStore.m_pageList[i];
            }
        }
        return false;
    },

    // //////////////////////////////////////////////////////////////////////////////////

    getCurrentPage : function(){
        return DataStore.getPage(DataStore.m_currentPageID);
    },

    // //////////////////////////////////////////////////////////////////////////////////

    getFolderName : function(folder_id){

        if (folder_id == FolderSidebarFrame.ID_UNASSIGNED){
            return "Unassigned";
        }

        for (var i=0; i<DataStore.m_folderList.length; i++){
            if (DataStore.m_folderList[i].id == folder_id){
                return DataStore.m_folderList[i].name;
            }
        }

        return "? ("+folder_id+")";
    },

    // //////////////////////////////////////////////////////////////////////////////////

    /**
	* For a given page, traverse up the branch to find the root page
	*/
    getRootPage : function(page_id){

        var page = DataStore.getPage(page_id);

        //alert(page_id + ' ' + page.title + ' ' + page.parent_page_id);

        if (page.parent_page_id == 0){
            return page;
        }

        return DataStore.getRootPage(page.parent_page_id);
    },

    // //////////////////////////////////////////////////////////////////////////////////

    /**
	* Check to see if test_page_id is a child of page_id
	*/
    isChildOff : function(page_id, test_page_id){

        var testPage = DataStore.getPage(test_page_id);

        if (testPage.parent_page_id == 0){
            return false;
        }

        if (testPage.parent_page_id == page_id){
            return true;
        }
        else {
            return DataStore.isChildOff(page_id, testPage.parent_page_id);
        }

    },

    // //////////////////////////////////////////////////////////////////////////////////

    /**
	* Get the deepest page depth
	*/
    getMaxDepth : function(){

        var max_depth = 0;
        for (var i=0; i<DataStore.m_pageList.length; i++){
            var depth = DataStore.getPageDepth(DataStore.m_pageList[i].id);

            //alert(DataStore.m_pageList[i].title + " " + depth);

            if (depth > max_depth){
                max_depth = depth;
            }
        }

        return max_depth;
    },

    // //////////////////////////////////////////////////////////////////////////////////

    getPageDepth : function(page_id){

        var page = DataStore.getPage(page_id);
        if (page.parent_page_id == 0){
            return 1;
        }
        else {
            return 1 + DataStore.getPageDepth(page.parent_page_id);
        }
    },

    // //////////////////////////////////////////////////////////////////////////////////

    updateSitePara : function(theme_para_id, page_id, new_para_val){

		//alert(theme_para_id + ", " + page_id + ", " + new_para_val);
		
        // Update para in data store
        var paraFound = false;
        for (var i=0; i<DataStore.m_siteParaList.length; i++){
            if ((DataStore.m_siteParaList[i].theme_para_id == theme_para_id) && (DataStore.m_siteParaList[i].page_id == page_id)){
                DataStore.m_siteParaList[i].para_value = new_para_val;
                paraFound = true;
            }
        }
        
//        alert(paraFound);

        // If we didn't find the para, it must be a new para (that wasn't set before)
        if (!paraFound){
            var temp = new Object();
            temp.theme_para_id = theme_para_id;
            temp.para_value = new_para_val;
            temp.page_id = page_id;
            DataStore.m_siteParaList.push(temp);
        }		
		/*
        for (var i=0; i<DataStore.m_siteParaList.length; i++){

            if ((DataStore.m_siteParaList[i].theme_para_id == theme_para_id) && (DataStore.m_siteParaList[i].page_id == page_id)){
                DataStore.m_siteParaList[i].para_value = new_para_val;
                return;
            }

        }
        */
    },

    // //////////////////////////////////////////////////////////////////////////////////

    /**
	* Update an existing page
	*/
    updatePage : function(pageObj){

        for (var i=0; i<DataStore.m_pageList.length; i++){
            if (DataStore.m_pageList[i].id == pageObj.id){

                DataStore.m_pageList[i].id = pageObj.id;
                DataStore.m_pageList[i].title = AthenaUtils.encodeTitle(pageObj.title);
                DataStore.m_pageList[i].browser_title = AthenaUtils.encodeTitle(pageObj.browser_title);                
                DataStore.m_pageList[i].user_id = pageObj.user_id;
                DataStore.m_pageList[i].content = pageObj.content;
                DataStore.m_pageList[i].status = pageObj.status;
                DataStore.m_pageList[i].last_edit = pageObj.last_edit;
                DataStore.m_pageList[i].created = pageObj.created;
                DataStore.m_pageList[i].template = pageObj.template;
                DataStore.m_pageList[i].parent_page_id = pageObj.parent_page_id;
                DataStore.m_pageList[i].slug = pageObj.slug;
                DataStore.m_pageList[i].path = pageObj.path;
                DataStore.m_pageList[i].is_homepage = pageObj.is_homepage;
                DataStore.m_pageList[i].is_blogpage = pageObj.is_blogpage;
                DataStore.m_pageList[i].page_order = pageObj.page_order;
                DataStore.m_pageList[i].description = pageObj.description;

				// Flag as changed 
                DataStore.m_pageList[i].isChanged = 1;

                return;
            }
        }
    },

    // //////////////////////////////////////////////////////////////////////////////////

    deletePage : function(page_id){

        // TODO: replace with array.splice, it will be faster - see http://www.elated.com/articles/manipulating-javascript-arrays/
        var tempList = new Array();

        for(var i=0; i<DataStore.m_pageList.length; i++){
            if (DataStore.m_pageList[i].id != page_id){
                tempList.push(DataStore.m_pageList[i]);
            }
        }

        DataStore.m_pageList = tempList;

        // update any pages that had this page as their parent page id
        for(var i=0; i<DataStore.m_pageList.length; i++){
            if (DataStore.m_pageList[i].parent_page_id == page_id){
                DataStore.m_pageList[i].parent_page_id = 0;
            }
        }

    },

    // //////////////////////////////////////////////////////////////////////////////////

    /**
	* Add a page from a returned page object from the MediaAPI
	*/
    addPage : function(pageObj){

        var temp = new Object();
        temp.id = pageObj.id;
        temp.title = AthenaUtils.encodeTitle(pageObj.title);
        temp.user_id = pageObj.user_id;
        temp.content = pageObj.content;
        temp.status = pageObj.status;
        temp.last_edit = pageObj.last_edit;
        temp.created = pageObj.created;
        temp.template = pageObj.template;
        temp.parent_page_id = pageObj.parent_page_id;
        temp.slug = pageObj.slug;
        temp.path = pageObj.path;
        temp.is_homepage = pageObj.is_homepage;
        temp.is_blogpage = pageObj.is_blogpage;
        temp.page_order = pageObj.page_order;
        temp.description = pageObj.description;
        temp.browser_title = pageObj.browser_title;

        DataStore.m_pageList.push(temp);
    },

    // //////////////////////////////////////////////////////////////////////////////////

    /**
     * Add a post from a returned page object from the MediaAPI
     * @param object postObj the post object to add
     * @param boolean toStart (optional) if set to true, this post will be added to the start of the list
     * useful for new posts, as they have the latest creation date so we want them to be at the start of the list
     * and don't want to have to sort the list based on date
     */
    addPost : function(postObj, toStart){

        var temp = new Object();
        temp.id = postObj.id;
        temp.title = AthenaUtils.encodeTitle(postObj.title);
        temp.user_id = postObj.user_id;
        temp.content = AthenaUtils.decodeContent(postObj.content);
        temp.status = postObj.status;
        temp.last_edit = postObj.last_edit;
        temp.created = postObj.created;
        temp.slug = postObj.slug;
        temp.path = postObj.path;
        temp.canComment = postObj.canComment;
        temp.tags = postObj.tags;
        temp.categories = postObj.categories;

        if (temp.tags == undefined){
            temp.tags = new Array();
        }
        if (temp.categories == undefined){
            temp.categories = new Array();
        }

        if (!toStart){
            DataStore.m_postList.push(temp);
        }
        else {
            DataStore.m_postList.unshift(temp);
        }
    },

    // //////////////////////////////////////////////////////////////////////////////////

    /**
	* Update an existing page
	*/
    updatePost : function(postObj){
		
        for (var i=0; i<DataStore.m_postList.length; i++){
            if (DataStore.m_postList[i].id == postObj.id){

                DataStore.m_postList[i].id = postObj.id;
                DataStore.m_postList[i].title = AthenaUtils.encodeTitle(postObj.title);
                DataStore.m_postList[i].user_id = postObj.user_id;
                DataStore.m_postList[i].content = AthenaUtils.decodeContent(postObj.content);
                DataStore.m_postList[i].status = postObj.status;
                DataStore.m_postList[i].last_edit = postObj.last_edit;
                DataStore.m_postList[i].created = postObj.created;
                DataStore.m_postList[i].slug = postObj.slug;
                DataStore.m_postList[i].path = postObj.path;
                DataStore.m_postList[i].canComment = postObj.canComment;
                DataStore.m_postList[i].tags = postObj.tags;
                DataStore.m_postList[i].categories = postObj.categories;

                if (DataStore.m_postList[i].tags == undefined){
                    DataStore.m_postList[i].tags = new Array();
                }
                if (DataStore.m_postList[i].categories == undefined){
                    DataStore.m_postList[i].categories = new Array();
                }

				// Flag as changed
                DataStore.m_postList[i].isChanged = 1;

                return;
            }
        }
    },

    // //////////////////////////////////////////////////////////////////////////////////

    deletePost : function(post_id){

        // TODO: replace with array.splice, it will be faster - see http://www.elated.com/articles/manipulating-javascript-arrays/

        var tempList = new Array();

        for(var i=0; i<DataStore.m_postList.length; i++){
            if (DataStore.m_postList[i].id != post_id){
                tempList.push(DataStore.m_postList[i]);
            }
        }

        DataStore.m_postList = tempList;

    },

    // //////////////////////////////////////////////////////////////////////////////////

    getPost : function(post_id){

        for(var i=0; i<DataStore.m_postList.length; i++){
            if (DataStore.m_postList[i].id == post_id){
                return DataStore.m_postList[i];
            }
        }
        return false;
    },

    // //////////////////////////////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////////////////////////////

	/**
	* Save any items that have been marked as changed
	*/
    save : function(){
        
        if (!DataStore.m_doAutoSave) return;
        
        var autosaved = false;
        var savingPost = false;
        var savingPage = false;
        var savingMedia = false;
        
        // Check posts
    	for (var i=0; i<DataStore.m_postList.length; i++){
    		if (DataStore.m_postList[i].isChanged != undefined && DataStore.m_postList[i].isChanged == 1){    	
    			DataStore.savePost(DataStore.m_postList[i]);   	
    			autosaved = true;		
    			savingPost = true;
    		}
    	}

		// Check pages...
    	for (i=0; i<DataStore.m_pageList.length; i++){
    		if (DataStore.m_pageList[i].isChanged != undefined && DataStore.m_pageList[i].isChanged == 1){  
    			DataStore.savePage(DataStore.m_pageList[i]);   			
    			autosaved = true;		
    			savingPage = true;
    		}
    	}    	

		// Check images/media....
    	for (i=0; i<DataStore.m_mediaList.length; i++){
    		if (DataStore.m_mediaList[i].isChanged != undefined && DataStore.m_mediaList[i].isChanged == 1){  
    			DataStore.saveMedia(DataStore.m_mediaList[i]);   			
    			autosaved = true;		
    			savingMedia = true;
    		}
    	}  
		
		if (autosaved){

			var what = "";
			
			if (savingPost) what += " post";
			if (savingPage) what += " page";
			if (savingMedia) what += " media";
							
			AthenaDialog.backgroundMessage("Autosaved" + what);
		}    	
    },

    // //////////////////////////////////////////////////////////////////////////////////

	saveMedia : function(mediaObj){
        MediaAPI.updateMediaInfo(DataStore.m_siteID, mediaObj.id, mediaObj.title, mediaObj.description, mediaObj.tags, DataStore.onMediaSaved);
	},
	
	onMediaSaved : function(mediaObj){
	
		DataStore.updateMedia(mediaObj);
		
		// Mark as saved...
    	for (var i=0; i<DataStore.m_mediaList.length; i++){
    		if (DataStore.m_mediaList[i].id == mediaObj.id){
    			DataStore.m_mediaList[i].isChanged = 0;
    		}
		}			
	},
	
    // //////////////////////////////////////////////////////////////////////////////////

	/**
	* Save a page to the server
	*/ 
	savePage : function(pageObj){
			
        MediaAPI.updatePage(DataStore.m_siteID, 
        					pageObj.id, 
        					pageObj.title, 
        					pageObj.content, 
        					pageObj.status, 
        					pageObj.template, 
        					pageObj.parent_page_id, 
        					pageObj.slug, 
        					pageObj.page_order, 
        					pageObj.is_homepage, 
        					pageObj.description, 
        					pageObj.browser_title, 
        					DataStore.onPageSaved);
	},
	
	onPageSaved : function(pageObj){
		
		DataStore.updatePage(pageObj);
				
		// Mark as saved...
    	for (var i=0; i<DataStore.m_pageList.length; i++){
    		if (DataStore.m_pageList[i].id == pageObj.id){
    			DataStore.m_pageList[i].isChanged = 0;
    		}
		}		
		
		// Is this page being displayed? If so, update the last edit display
		if (pageObj.id == DataStore.m_currentPageID && ssMain.view == ssMain.VIEW_PAGES){
			$('#pageLastEdit').html(pageObj.last_edit);
			//$('#pageLastEdit').effect("highlight", {color: 'white'}, 2000);
			$('#pageLastEdit').effect("pulsate", { times:1 }, 2000);
		}
	},
	
    // //////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Save a post to the server
	*/
	savePost : function(postObj, callback){
	
        MediaAPI.updatePost(DataStore.m_siteID, 
        					postObj.id, 
        					postObj.title, 
        					postObj.content, 
        					postObj.status, 
        					postObj.canComment, 
        					postObj.slug, 
        					DataStore.onPostSaved)
	},
	
	onPostSaved : function(postObj){

		DataStore.updatePost(postObj);

		// Mark as saved...
    	for (var i=0; i<DataStore.m_postList.length; i++){
    		if (DataStore.m_postList[i].id == postObj.id){
    			DataStore.m_postList[i].isChanged = 0;
    		}
		}	
		
		// Is this page being displayed? If so, update the last edit display
		if (postObj.id == DataStore.m_currentPostID && ssMain.view == ssMain.VIEW_POSTS){
			$('#postLastEdit').html(postObj.last_edit);
			$('#postLastEdit').effect("pulsate", { times:1 }, 2000);
		}
			
	},
	
    // //////////////////////////////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////////////////////////////

    load : function(callback){

        GalleryAPI.getAll(DataStore.m_siteID, function(gallery_images, gallery_meta){
            DataStore.onGotGalleryData(gallery_images, gallery_meta);
        });

        MediaAPI.getAll(DataStore.m_siteID,
            function(folders, media, pages, theme, page_templates, theme_paras, page_paras, posts, tags, categories, media_tag_list){
                DataStore.onGotData(folders, media, pages, theme, page_templates, theme_paras, page_paras, posts, tags, categories, media_tag_list, callback);
            });
    },

    // //////////////////////////////////////////////////////////////////////////////////

    onGotData : function(folder_list, media_list, page_list, theme, page_templates, theme_paras, paga_paras, post_list, tag_list, categories_list, media_tag_list, callback){

        DataStore.onGotFolders(folder_list);
        DataStore.onGotMedia(media_list);
        DataStore.onGotPages(page_list);
        DataStore.onGotPosts(post_list);
        DataStore.onGotPageTemplates(page_templates);
        //DataStore.onGotThemeParas(theme_paras);

        DataStore.m_siteParaList = paga_paras;
        DataStore.m_themeParaList = theme_paras;
        DataStore.m_theme = theme; // id, theme_name, theme_title, price, thumb_url, description, is_private, max_page_depth
        DataStore.m_categories = categories_list;
        DataStore.m_tags = tag_list;
        DataStore.m_mediaTags = media_tag_list;

        if (DataStore.m_themeParaList == undefined) DataStore.m_themeParaList = new Array();
        if (DataStore.m_siteParaList == undefined) DataStore.m_siteParaList = new Array();
        if (DataStore.m_categories == undefined) DataStore.m_categories = new Array();
        if (DataStore.m_tags == undefined) DataStore.m_tags = new Array();

        callback();
    },
    
    // //////////////////////////////////////////////////////////////////////////////////

    onGotGalleryData : function(gallery_images, gallery_meta){

        DataStore.onGotGalleryImages(gallery_images);
        //DataStore.m_galleryImageList = gallery_images;
        DataStore.m_galleryMetaList = gallery_meta;

        if (DataStore.m_galleryImageList == undefined) DataStore.DataStore.m_galleryImageList = new Array();
        if (DataStore.m_galleryMetaList == undefined) DataStore.m_galleryMetaList = new Array();
    },

    // //////////////////////////////////////////////////////////////////////////////////

    onGotGalleryImages : function(gallery_images){

        if (!gallery_images || gallery_images == undefined){
            DataStore.m_galleryImageList = new Array();
            return;
        }

        DataStore.m_galleryImageList = new Array(gallery_images.length);

        for(var i=0; i<gallery_images.length; i++){

            var temp = new Object();

            temp.id = parseInt(gallery_images[i].id);
            temp.image_id = parseInt(gallery_images[i].image_id);
            temp.slot_number = parseInt(gallery_images[i].slot_number);
            temp.gallery_number = parseInt(gallery_images[i].gallery_number);
            temp.theme_para_id = parseInt(gallery_images[i].theme_para_id);
            temp.page_id = parseInt(gallery_images[i].page_id);

            DataStore.m_galleryImageList[i] = temp;
        }

    },

    // //////////////////////////////////////////////////////////////////////////////////
    /*
	onGotThemeParas : function(theme_paras){

		if (!theme_paras || theme_paras == undefined){
			DataStore.m_themeParaList = new Array();
			return;
		}

		DataStore.m_themeParaList = new Array();

		for(var i=0; i<theme_paras.length; i++){

			var temp = new Object();
			temp.template_name = page_templates[i].template_name;
			temp.template_description = page_templates[i].template_description;
			temp.template_file = page_templates[i].template_file;

			DataStore.m_themeParaList[i] = temp;

		}

	},
	*/
    // //////////////////////////////////////////////////////////////////////////////////

    onGotPageTemplates : function(page_templates){

        if (!page_templates || page_templates == undefined){
            DataStore.m_templateList = new Array();
            return;
        }

        DataStore.m_templateList = new Array();

        for(var i=0; i<page_templates.length; i++){

            var temp = new Object();
            temp.template_name = page_templates[i].template_name;
            temp.template_description = page_templates[i].template_description;
            temp.template_file = page_templates[i].template_file;

            DataStore.m_templateList[i] = temp;

        }

    },

    // //////////////////////////////////////////////////////////////////////////////////

    onGotPosts : function(post_list){

        if (!post_list || post_list == undefined){
            DataStore.m_postList = new Array();
            return;
        }

        DataStore.m_postList = new Array();

        for(var i=0; i<post_list.length; i++){

            DataStore.addPost(post_list[i]);

        }

        if (post_list.length > 0 && DataStore.m_currentPostID == 0){
            DataStore.m_currentPostID = post_list[0].id;
        }

    },

    // //////////////////////////////////////////////////////////////////////////////////

    onGotPages : function(page_list){

        if (!page_list || page_list == undefined){
            DataStore.m_pageList = new Array();
            return;
        }

        DataStore.m_pageList = new Array();

        for(var i=0; i<page_list.length; i++){

            DataStore.addPage(page_list[i]);

        }

        if (page_list.length > 0 && DataStore.m_currentPageID == 0){
            DataStore.m_currentPageID = page_list[0].id;
        }

    },

    // //////////////////////////////////////////////////////////////////////////////////

    onGotFolders : function(folder_list){

        if (!folder_list || folder_list == undefined){
            DataStore.m_folderList = new Array();
            return;
        }

        DataStore.m_folderList = new Array(folder_list.length);

        for(var i=0; i<folder_list.length; i++){

            var temp = new Object();
            temp.id = folder_list[i].id;
            temp.name = folder_list[i].name;

            if (i == 0){
            //alert(temp.id + " " + temp.name);
            }

            DataStore.m_folderList[i] = temp;
        }

    },

    // //////////////////////////////////////////////////////////////////////////////////

    onGotMedia : function(media_list){

        if (!media_list || media_list == undefined){
            DataStore.m_mediaList = new Array();
            return;
        }

        DataStore.m_mediaList = new Array(media_list.length);
		
        for(var i=0; i<media_list.length; i++){

            var files_root = defines.user_files_root_url + DataStore.m_siteID + "/";
            var temp = new Object();

            temp.thumb_url = files_root + media_list[i].filepath + media_list[i].thumb_filename;
            temp.file_url = files_root + media_list[i].filepath + media_list[i].filename;
            temp.mime_type = media_list[i].mime_type;
            temp.title = media_list[i].title;
            temp.description = media_list[i].description;
            temp.tags = media_list[i].tags;
            temp.width = media_list[i].width;
            temp.height = media_list[i].height;
            temp.thumb_width = media_list[i].thumb_width;
            temp.thumb_height = media_list[i].thumb_height;
            temp.id = media_list[i].id;
            temp.date_added = media_list[i].created;
            temp.folder_id = media_list[i].folder_id;
            temp.media_tags = media_list[i].media_tags;
					
            if (i == 0){
            //alert(temp.thumb_url);
            }

            DataStore.m_mediaList[i] = temp;
        }

    },

    // //////////////////////////////////////////////////////////////////////////////////

    /**
    * Update an existing page, if preserveURL is set to true then don't add the path to the image url
    */
    updateMedia : function(mediaObj, preserveURL){

		if (preserveURL == undefined) preserveURL = false;
		
        for (var i=0; i<DataStore.m_mediaList.length; i++){
            if (DataStore.m_mediaList[i].id == mediaObj.id){

                var files_root = defines.user_files_root_url + DataStore.m_siteID + "/";

                DataStore.m_mediaList[i].id = mediaObj.id;
                
                if (preserveURL){
	                DataStore.m_mediaList[i].thumb_url = mediaObj.thumb_url;
	                DataStore.m_mediaList[i].file_url = mediaObj.file_url;
                }
                else {
	                DataStore.m_mediaList[i].thumb_url = files_root + mediaObj.filepath + mediaObj.thumb_filename;
	                DataStore.m_mediaList[i].file_url = files_root + mediaObj.filepath + mediaObj.filename;
                }
                
                DataStore.m_mediaList[i].mime_type = mediaObj.mime_type;
                DataStore.m_mediaList[i].title = mediaObj.title;
                DataStore.m_mediaList[i].description = mediaObj.description;
                DataStore.m_mediaList[i].tags = mediaObj.tags;
                DataStore.m_mediaList[i].width = mediaObj.width;
                DataStore.m_mediaList[i].height = mediaObj.height;
                DataStore.m_mediaList[i].thumb_width = mediaObj.thumb_width;
                DataStore.m_mediaList[i].thumb_height = mediaObj.thumb_height;
                DataStore.m_mediaList[i].date_added = mediaObj.date_added;
                DataStore.m_mediaList[i].folder_id = mediaObj.folder_id;
                DataStore.m_mediaList[i].media_tags = mediaObj.media_tags;
                DataStore.m_mediaList[i].isChanged = 1;

                return;
            }
        }
    },

    // //////////////////////////////////////////////////////////////////////////////////

    /**
     * Remove a media file from the list
     */
    deleteMedia : function(media_id){

        var tempList = new Array();

        for(var i=0; i<DataStore.m_mediaList.length; i++){
            if (DataStore.m_mediaList[i].id != media_id){
                tempList.push(DataStore.m_mediaList[i]);
            }
        }

        DataStore.m_mediaList = tempList;

		// Remove from any galleries

        var tempList = new Array();
        for(var i=0; i<DataStore.m_galleryImageList.length; i++){
            if (DataStore.m_galleryImageList[i].image_id != media_id){
                tempList.push(DataStore.m_galleryImageList[i]);
            }
        }

        DataStore.m_galleryImageList = tempList;
				
    },
    
    // //////////////////////////////////////////////////////////////////////////////////

	/**
	* Get a list of all the images that have the given media tag associated with them
	*/
	getImagesForCurrentTag : function(){
	
		var tag = DataStore.m_currentTag;
        var imageList = DataStore.m_mediaList;
		var tagImageList = new Array();
        	    		
        for (var i=0; i<imageList.length; i++){
        	if (imageList[i].media_tags != undefined && imageList[i].media_tags != null){
	        	for (var j=0; j<imageList[i].media_tags.length; j++){  
	        		if (imageList[i].media_tags[j] == tag){
		        		tagImageList.push(imageList[i]);
	        		}      	
	        	}        	
        	}
		}
			
		return tagImageList;	
	},
	
    // //////////////////////////////////////////////////////////////////////////////////
    
	/**
	* Get a list of images for the currently selected folder/filter
	* @return Return an array of images for the currently selected folder
	*/
	getImagesForCurrentFolder : function(){

        var d = new Date();
        var localTime = d.getTime();
        var localOffset = d.getTimezoneOffset() * 60000;
        var utc_date = new Date(localTime + localOffset);
        var utc_time = localTime + localOffset;
												
        var imageList = DataStore.m_mediaList;
        
		var folderImageList = new Array();
		
        for (var i=0; i<imageList.length; i++){

            var image_folder_id = parseInt(imageList[i].folder_id);
            var added_date = new Date(imageList[i].date_added);
            var hours_ago = (utc_time - added_date.getTime())/3600000;
									
            switch(DataStore.m_currentFolderID){
			
                case FolderSidebarFrame.ID_UNASSIGNED:
                    if (image_folder_id == FolderSidebarFrame.ID_ALL || image_folder_id == FolderSidebarFrame.ID_UNASSIGNED)
                    	folderImageList.push(imageList[i]);
                    break;
					
                case FolderSidebarFrame.ID_LAST_1_HOUR:
                    if (hours_ago <= 1){
                    	folderImageList.push(imageList[i]);
                    }
                    break;

                case FolderSidebarFrame.ID_LAST_24_HOURS:
                    if (hours_ago <= 24){
                    	folderImageList.push(imageList[i]);
                    }
                    break;

                case FolderSidebarFrame.ID_LAST_7_DAYS:
                    if (hours_ago <= 168){
                    	folderImageList.push(imageList[i]);
                    }
                    break;

                case FolderSidebarFrame.ID_ALL:
                   	folderImageList.push(imageList[i]);
                    break;

                case image_folder_id:
                   	folderImageList.push(imageList[i]);
                    break;

                default:
            // Nothing to do
            }
			
        }
        
        return folderImageList;
                
	}

}
/* 
 * Galleries Page functionality
 *
 * @author Mike Pritchard (mike@apollosites.com)
 * @since 3rd January, 2011
 */
var Galleries = {

    // ////////////////////////////////////////////////////////////////////////

    init : function(siteID){
                
        $('#GalleriesFrame').show();
                
        // Initialize the remote API's
        MediaAPI.init();
        GalleryAPI.init();

        // Setup the data store for the site
        DataStore.init(siteID);

        // Setup classes...
        GalleriesFrame.init();
        SidebarFrame.init();

        // Start loading data
        DataStore.load(Galleries.onDataLoaded);
        
    },

    // ////////////////////////////////////////////////////////////////////////

    onDataLoaded : function(){

        if (DataStore.m_currentFolderID > 0){
            FolderSidebarFrame.onSelectFolder(DataStore.m_currentFolderID);
        }
        else {
            if (DataStore.m_currentFolderID == -1 && DataStore.m_folderList.length > 0){
                FolderSidebarFrame.onSelectFolder(DataStore.m_folderList[0].id);
            }
            else {
                FolderSidebarFrame.onSelectFolder(1); // unassigned folders
            }
        }

        GalleriesFrame.repaint();
        SidebarFrame.repaint();
    }
	
    // ////////////////////////////////////////////////////////////////////////
}


/**
* Allows access to the remote (Ajax) Athena System API
* 
* @author Mike Pritchard (mike@apollosites.com)
* @since 27th, July 2010
*/
var MediaAPI = {
	
    /** Command url */
    m_url : '/code/php/remoteapi/MediaAPI.php',
							
    // ////////////////////////////////////////////////////////////////////////
	
    /**
    * Initialize the API
    */
    init : function(){
        MediaAPI.m_url = defines.root_url + MediaAPI.m_url;
    },
			
    // ////////////////////////////////////////////////////////////////////////

    /**
    * Get the list of folders and media for this site
    */
    getAll : function(siteID, callback){
	
        AthenaDialog.showLoading("Loading media data");
		
        var paras = {
            cmd : 'getAll',
            site_id: siteID
        };

        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){
			        AthenaDialog.clearLoading();
					
			        if (ret.result == 'ok'){
			            callback(ret.data.folders, ret.data.media, ret.data.pages, ret.data.theme, ret.data.page_templates, ret.data.theme_paras, ret.data.page_paras, ret.data.posts, ret.data.tags, ret.data.categories, ret.data.media_tags);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
            	}
        });
		
    },
			
    // ////////////////////////////////////////////////////////////////////////

    /**
    * Get the list of folders and media for this site
    */
    getStats : function(siteID, callback){

        AthenaDialog.showLoading("Loading stats data");

        var paras = {
            cmd : 'getStats',
            site_id: siteID
        };

        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){
			       AthenaDialog.clearLoading();
			
					if (!ret || ret == undefined){
			            callback(0);
			            return;
					}
					
			        if (ret.result == 'ok'){
			            callback(ret.data.disc_usage, ret.data.page_views, ret.data.crawler_views);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
               	}
        });

    },
				
    // ////////////////////////////////////////////////////////////////////////
	
    setPagePara : function(themeParaID, paraValue, pageID, callback){
			
        var paras = {
            cmd: 'setPagePara',
            site_id: DataStore.m_siteID,
            page_id: pageID,
            theme_para_id: themeParaID,
            para_value: paraValue
        };
												
        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){
			        if (ret.result == "ok"){
			            callback(ret.data.theme_para_id, ret.data.new_value, ret.data.page_id);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
            	}
        });
    },
	
    // ////////////////////////////////////////////////////////////////////////
	
    setGlobalPara : function(themeParaID, paraValue, callback){
	
        var paras = {
            cmd: 'setGlobalPara',
            site_id: DataStore.m_siteID,
            theme_para_id: themeParaID,
            para_value: paraValue
        };

        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
				function(ret){
			        if (ret.result == "ok"){
			            callback(ret.data.theme_para_id, ret.data.new_value);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
				}
        });
    },
	
    // ////////////////////////////////////////////////////////////////////////
    //
    // Posts.....
    //
    // ////////////////////////////////////////////////////////////////////////

    getPostDetails : function(siteID, postID, callback){
		
        AthenaDialog.showLoading("Getting post details");
		
        var paras = {
            cmd: 'getPostDetails',
            site_id: siteID,
            post_id: postID
        };
				
        $.ajax({
            url: MediaAPI.m_url,
            type: 'post',
            dataType: "json",
            data: paras,
            success: function(ret){
                MediaAPI.onGotPost(ret, callback)
                }
        });
    },
				
    updatePost : function(siteID, postID, postTitle, postContent, postStatus, postCanComment, postSlug, callback){
		
        //AthenaDialog.showLoading("Updating post");
		
        var paras = {
            cmd: 'updatePost',
            site_id: siteID,
            post_id: postID,
            title: postTitle,
            content: postContent,
            status: postStatus,
            can_comment: postCanComment,
            slug: postSlug
        };
				
        $.ajax({
            url: MediaAPI.m_url,
            type: 'post',
            dataType: "json",
            data: paras,
            success: function(ret){
                MediaAPI.onGotPost(ret, callback)
                }
        });
    },

    addPost : function(siteID, postTitle, postContent, postStatus, postCanComment, postSlug, callback){
		
        AthenaDialog.showLoading("Adding post");
		
        var paras = {
            cmd: 'addPost',
            site_id: siteID,
            title: postTitle,
            content: postContent,
            status: postStatus,
            can_comment: postCanComment,
            slug: postSlug
        };
						
        $.ajax({
            url: MediaAPI.m_url,
            type: 'post',
            dataType: "json",
            data: paras,
            success: function(ret){
                MediaAPI.onGotPost(ret, callback)
                }
        });
    },
	
    onGotPost : function(ret, callback){
			
        AthenaDialog.clearLoading();
								
        if (ret.result == "ok"){
            callback(ret.data.post);
        }
        else {
            AthenaDialog.showAjaxError(ret);
        }
    },

    // ////////////////////////////////////////////////////////////////////////

    deletePost : function(siteID, postID, callback){

        AthenaDialog.showLoading("Deleting post");

        var paras = {
            cmd: 'deletePost',
            site_id: siteID,
            post_id: postID
        };
				
        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){
			        AthenaDialog.clearLoading();
			
			        if (ret.result == "ok"){
			            callback(ret.data.post_id);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
                }
        });
    },
	
    // ////////////////////////////////////////////////////////////////////////
    //
    // Post Tags and Categories
    //
    // ////////////////////////////////////////////////////////////////////////

	/**
	* Add a tag to a post, can handle single tags or csv tags
	*/
    addTag : function(siteID, postID, csvPostTags, callback){

        //AthenaDialog.showLoading("Adding tag");

        var paras = {
            cmd: 'addPostTags',
            site_id: siteID,
            post_id: postID,
            csvtags: csvPostTags
        };
				
        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){
			        //AthenaDialog.clearLoading();
			
			        if (ret.result == "ok"){
			            callback(ret.data.post, ret.data.tags);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
                }
        });
    },	
	
    // ////////////////////////////////////////////////////////////////////////

	/**
	* Add a category to a post, can handle single category or csv category
	*/
    addCategory : function(siteID, postID, csvPostCategories, callback){

        //AthenaDialog.showLoading("Adding category");

        var paras = {
            cmd: 'addPostCategories',
            site_id: siteID,
            post_id: postID,
            csvcats: csvPostCategories
        };
				
        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){
			        //AthenaDialog.clearLoading();
			
			        if (ret.result == "ok"){
			            callback(ret.data.post, ret.data.categories);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
                }
        });
    },
	
    // ////////////////////////////////////////////////////////////////////////

    /**
     * Delete a tag from the entire blog and every post
     */
    deleteTag : function(siteID, globalTag, callback){
        var paras = {cmd: 'deleteTag', site_id: siteID, tag: globalTag};

        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){ 
			        if (ret.result == "ok"){
			            callback(ret.data.tag);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
            	}
        });
    },

    // ////////////////////////////////////////////////////////////////////////

    /**
     * Delete a category from the entire blog and every post
     */
    deleteCategory : function(siteID, globalCategory, callback){
        var paras = {cmd: 'deleteCategory', site_id: siteID, category: globalCategory};

        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){ 
			        if (ret.result == "ok"){
			            callback(ret.data.category);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
            	}
        });
    },

    // ////////////////////////////////////////////////////////////////////////

    removeTag : function(siteID, postID, postTag, callback){

        AthenaDialog.showLoading("Removing tag");

        var paras = {
            cmd: 'removeTag',
            site_id: siteID,
            post_id: postID,
            tag: postTag
        };
				
        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){
			        AthenaDialog.clearLoading();
			
			        if (ret.result == "ok"){
			            callback(ret.data.post_id, ret.data.tag);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
                }
        });
    },
		
    // ////////////////////////////////////////////////////////////////////////

    removeCategory : function(siteID, postID, postCategory, callback){

        AthenaDialog.showLoading("Removing category");

        var paras = {
            cmd: 'removeCategory',
            site_id: siteID,
            post_id: postID,
            category: postCategory
        };
				
        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){
			        AthenaDialog.clearLoading();
			
			        if (ret.result == "ok"){
			            callback(ret.data.post_id, ret.data.category);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
                }
        });
    },
	
    // ////////////////////////////////////////////////////////////////////////
    //
    // Comments
    //
    // ////////////////////////////////////////////////////////////////////////

    updateCommentStatus : function(siteID, commentID, newStatus, callback){

        AthenaDialog.showLoading("Updating comment");

        var paras = {
            cmd: 'updateCommentStatus',
            site_id: siteID,
            cid: commentID,
            sts: newStatus
        };

        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){
			        AthenaDialog.clearLoading();
			
			        if (ret.result == "ok"){
			            callback(ret.data.comment_id, ret.data.status);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
                }
        });
    },


    // ////////////////////////////////////////////////////////////////////////
    //
    // Pages.....
    //
    // ////////////////////////////////////////////////////////////////////////

    updatePage : function(siteID, pageID, pageTitle, pageContent, pageStatus, templateName, parentPageID, pageSlug, pageOrder, isHome, description, browserTitle ,callback){
		
        //AthenaDialog.showLoading("Updating page");
		
        var paras = {
            cmd: 'updatePage',
            site_id: siteID,
            page_id: pageID,
            title: pageTitle,
            browser_title: browserTitle,
            content: pageContent,
            status: pageStatus,
            template_id: templateName,
            parent_page_id: parentPageID,
            slug: pageSlug,
            ishome: isHome,
            order: pageOrder,
            desc: description
        };
				
        $.ajax({
            url: MediaAPI.m_url,
            type: 'post',
            dataType: "json",
            data: paras,
            success: function(ret){
                MediaAPI.onPageAdded(ret, callback)
                }
        });
    },

    addPage : function(siteID, pageTitle, pageContent, pageStatus, templateName, parentPageID, pageSlug, pageOrder, isHome, callback){
		
        AthenaDialog.showLoading("Adding page");
		
        var paras = {
            cmd: 'addPage',
            site_id: siteID,
            title: pageTitle,
            content: pageContent,
            status: pageStatus,
            template_id: templateName,
            parent_page_id: parentPageID,
            slug: pageSlug,
            ishome: isHome,
            order: pageOrder
        };
				
        $.ajax({
            url: MediaAPI.m_url,
            type: 'post',
            dataType: "json",
            data: paras,
            success: function(ret){
                MediaAPI.onPageAdded(ret, callback)
                }
        });
    },
	
    onPageAdded : function(ret, callback){
			
        AthenaDialog.clearLoading();
								
        if (ret.result == "ok"){
            callback(ret.data.page);
        }
        else {
            AthenaDialog.showAjaxError(ret);
        }
    },

    // ////////////////////////////////////////////////////////////////////////

    deletePage : function(siteID, pageID, callback){

        AthenaDialog.showLoading("Deleting page");

        var paras = {
            cmd: 'deletePage',
            site_id: siteID,
            page_id: pageID
        };
				
        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){
			        AthenaDialog.clearLoading();
			
			        if (ret.result == "ok"){
			            callback(ret.data.page_id);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
                }
        });
    },
			
    // ////////////////////////////////////////////////////////////////////////
    //
    // Folders and media
    //
    // ////////////////////////////////////////////////////////////////////////
		
    /**
    * Get the list of folders for this site
    */
    getFolders : function(siteID, callback){
	
        AthenaDialog.showLoading();
		
        var paras = {
            cmd : 'getFolders',
            site_id: siteID
        };

        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){
			        AthenaDialog.clearLoading();
					
			        if (ret.result == 'ok'){
			            callback(ret.data);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
            	}
        });
		
    },
    
    // ////////////////////////////////////////////////////////////////////////
    	
    addFolder : function(siteID, folderName, callback){

        AthenaDialog.showLoading("Adding folder");

        if (folderName == undefined){
            folderName = 'new folder';
        }
		
        var paras = {
            cmd: 'addFolder',
            site_id: siteID,
            folder_name: folderName
        };
												
        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){
            			
			        AthenaDialog.clearLoading();
											
			        if (ret.result == "ok"){
			            callback(ret.data.name, ret.data.id);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
                }
        });
    },
	
    // ////////////////////////////////////////////////////////////////////////
		
    renameFolder : function(siteID, folderID, newName, callback){
				
        var paras = {
            cmd: 'renameFolder',
            site_id: siteID,
            folder_id: folderID,
            folder_name: newName
        };
												
        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){
			        if (ret.result == "ok"){
			            callback(ret.data.id, ret.data.name);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
                }
        });
    },
	
    // ////////////////////////////////////////////////////////////////////////
		
    addMediaToFolder : function(siteID, mediaID, folderID, callback){
		
        var paras = {
            cmd: 'addMediaToFolder',
            site_id: siteID,
            folder_id: folderID,
            media_id: mediaID
        };
												
        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){
			        if (ret.result == "ok"){
			            callback(ret.data.folder_id, ret.data.media_id);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }            		            		
                }
        });
    },
	
    // ////////////////////////////////////////////////////////////////////////
	
    /**
	* Delete a folder, any media assigned to that folder will be considered 'unassigned' so 
	* it is not deleted!
	*/
    deleteFolder : function(siteID, folderID, callback){
		
        var paras = {
            cmd: 'deleteFolder',
            site_id: siteID,
            folder_id: folderID
        };
												
        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){
			        if (ret.result == "ok"){
			            callback(ret.data.id);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
                }
        });
    },
	
    // ////////////////////////////////////////////////////////////////////////
			
    /**
	* Get the list of media for this site
	*/	
    getMedia : function(siteID, callback){
		
        AthenaDialog.showLoading();
		
        var paras = {
            cmd : 'getMedia',
            site_id: siteID
        };

        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            success: function(ret){
                MediaAPI.onGotMedia(ret, callback);
            },
            data: paras
        });
    },
			
    onGotMedia : function(ret, callback){

        AthenaDialog.clearLoading();
		
        if (ret.result == 'ok'){
            if (ret.data == 'true'){
                callback(ret.data);
            }
            else {
                callback(ret.data);
            }
        }
        else {
            AthenaDialog.showAjaxError(ret);
        }
        
    },
   	
    // ////////////////////////////////////////////////////////////////////////
	
    /**
     * Get the list of media for this site
     */
    updateMediaInfo : function(siteID, mediaID, mediaTitle, mediaDesc, mediaTags, callback){
		
        //AthenaDialog.showLoading("Updating file");
		
        var paras = {
            cmd : 'saveMediaInfo',
            site_id: siteID,
            media_id: mediaID,
            title: mediaTitle,
            desc: mediaDesc,
            tags: mediaTags
        };

        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            success: function(ret){
                MediaAPI.onGotMedia(ret, callback);
            },
            data: paras
        });
    },

    // ////////////////////////////////////////////////////////////////////////

    /**
     * Delete the given media id
     */
    deleteMedia : function(siteID, mediaID, callback){

        AthenaDialog.showLoading("Deleting file");

        var paras = {
            cmd : 'deleteMedia',
            site_id: siteID,
            media_id: mediaID
        };

        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            success: 
            function(ret){
		        AthenaDialog.clearLoading();
		
		        if (ret.result == 'ok'){
		            callback(ret.data.media_id);
		        }
		        else {
		            AthenaDialog.showAjaxError(ret);
		        }
            },
            data: paras
        });
    },
    
    // ////////////////////////////////////////////////////////////////////////
    //
    // Media tags
    //
    // ////////////////////////////////////////////////////////////////////////

	/**
	* Remove the association of the given tag from the given media file
	*/
	removeMediaTag : function(siteID, mediaID, tagStr, callback){

        //AthenaDialog.showLoading("Removing tag");

        var paras = {cmd: 'removeMediaTag', site_id: siteID, media_id: mediaID, tag: tagStr};

        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){ 
			        //AthenaDialog.clearLoading();
			        
			        if (ret.result == "ok"){
			            callback(ret.data.media);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
            	}
        });	
	},

    // ////////////////////////////////////////////////////////////////////////

	/**
	* Remove the association of the given tag from the given media file
	*/
	renameMediaTag : function(siteID, currentTagStr, newTagStr, callback){
		
        //AthenaDialog.showLoading("Removing tag");

        var paras = {cmd: 'renameMediaTag', site_id: siteID, tag: currentTagStr, new_tag: newTagStr};

        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){ 
			        //AthenaDialog.clearLoading();
			        
			        if (ret.result == "ok"){
			            callback(ret.data.tags);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
            	}
        });	
	},
	
    // ////////////////////////////////////////////////////////////////////////

	/**
	* Delete a media tag, which will remove this from ALL media files that are associated
	* with this tag
	*/
	deleteMediaTag : function(siteID, tagStr, callback){

        AthenaDialog.showLoading("Deleting tag");

        var paras = {cmd: 'deleteMediaTag', site_id: siteID, tag: tagStr};

        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){ 
			        AthenaDialog.clearLoading();
			        
			        if (ret.result == "ok"){
			            callback(ret.data.tags);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
            	}
        });	
	},
	    	
    // ////////////////////////////////////////////////////////////////////////
	
/*
    case "addMediaTags":
        $csv_tags = CommandHelper::getPara('csvtags', true, CommandHelper::$PARA_TYPE_STRING);
        addMediaTags($site_id, $csv_tags);
        break;

*/	
	addMediaCSVTags : function(siteID, mediaID, tagsCSV, callback){
	
        AthenaDialog.showLoading("Adding tag");

        var paras = {cmd : 'addMediaTags', site_id: siteID, media_id: mediaID, csvtags: tagsCSV};

        $.ajax({
            url: MediaAPI.m_url,
            dataType: "json",
            success: 
            	function(ret){
					AthenaDialog.clearLoading();
					
					if (ret.result == 'ok'){
					    callback(ret.data.media, ret.data.tags);
					}
					else {
					    AthenaDialog.showAjaxError(ret);
					}            
				},
            data: paras
        });	
	} 
}
    
/**
* Allows access to the remote (Ajax) Athena Gallery API
* 
* @author Mike Pritchard (mike@apollosites.com)
* @since 13th August, 2010
*/
var GalleryAPI = {
	
    /** Command url */
    m_url : '/code/php/remoteapi/GalleryAPI.php',
							
    // ////////////////////////////////////////////////////////////////////////
	
    /**
	* Initialize the API
	*/
    init : function(){
        GalleryAPI.m_url = defines.root_url + GalleryAPI.m_url;
    },
			
    // ////////////////////////////////////////////////////////////////////////

    /**
	* Get the list of folders and media for this site
	*/
    getAll : function(siteID, callback){
	
        AthenaDialog.showLoading("Loading gallery data");
		
        var paras = {
            cmd : 'getAll',
            site_id: siteID
        };

        $.ajax({
            url: GalleryAPI.m_url,
            dataType: "json",
            data: paras,
            success: function(ret){
                GalleryAPI.onGotAll(ret, callback);
            }
        });
		
    },
			
    /**
	* Check the response from the server, and load data if login is good
	*/
    onGotAll : function(ret, callback){
		
        AthenaDialog.clearLoading();
		
        if (ret.result == 'ok'){
            callback(ret.data.gallery_images, ret.data.gallery_meta);
        }
        else {
            AthenaDialog.showAjaxError(ret);
        }
    },
	
    // ////////////////////////////////////////////////////////////////////////
	
    onMoveImage : function(siteID, pageID, imageID, old_slot, new_slot, oldGalleryNo, newGalleryNo, themeParaID, callback) {
		
        //alert('moving image: imageID = ' + imageID + ' slot = ' + slot);
		
        var paras = {
            cmd: 'moveImage',
            site_id: siteID,
            image_id: imageID,
            old_slot_no: old_slot,
            new_slot_no: new_slot,
            page_id: pageID,
            old_gallery_no: oldGalleryNo,
            new_gallery_no: newGalleryNo,
            theme_para_id: themeParaID
        };
		
        AthenaDialog.showLoading("Moving image", false);
				
        jQuery.ajax({
            url: GalleryAPI.m_url,
            dataType: "json",
            data: paras,
            success: function(ret){
                GalleryAPI.onGotAll(ret, callback);
            }
        });
	
    },
			
    // ////////////////////////////////////////////////////////////////////////////
	
    onAddImage : function(siteID, pageID, imageID, slot, galleryNo, themeParaID, callback){
		
        //alert('adding image: pageID = ' + GalleryAPI.m_galleryPageID + ' imageID = ' + imageID + ' slot = ' + slot + ' gallery = ' + galleryNo);
		
        var paras = {
            cmd: 'addImage',
            site_id: siteID,
            page_id: pageID,
            image_id: imageID,
            slot_no: slot,
            gallery_no: galleryNo,
            theme_para_id: themeParaID
        };
			
        AthenaDialog.showLoading("Adding image", false);
				
        jQuery.ajax({
            url: GalleryAPI.m_url,
            dataType: "json",
            data: paras,
            success: function(ret){
                GalleryAPI.onGotAll(ret, callback);
            }
        });
		
    },

    // ////////////////////////////////////////////////////////////////////////////
	
    onRemoveImage : function(siteID, pageID, imageID, galleryNo, slot, themeParaID, callback){

        var paras = {
            cmd: 'removeImage',
            site_id: siteID,
            page_id: pageID,
            slot_no: slot,
            image_id: imageID,
            gallery_no: galleryNo,
            theme_para_id: themeParaID
        };
				
        jQuery.ajax({
            url: GalleryAPI.m_url,
            dataType: "json",
            data: paras,
            success: function(ret){
                GalleryAPI.onImageRemoved(ret, callback);
            }
        });
		
    },
	
    onImageRemoved : function(ret, callback){
				
        if (ret.result == "ok"){
            callback(ret.data.slot_no);
        }
        else {
            AthenaDialog.showAjaxError(ret);
        }
				
    }
}
    
/*
 * Class that allows the user to view and edit their account settings
 *
 * @author Mike Pritchard (mike@apollosites.com)
 */
var AccountDialog = {

    // ////////////////////////////////////////////////////////////////////////

    show : function(){

        var txt = "";
        txt += "<div id='apolloAccountSettings'>";
        txt += "    <div id='commentList'></div>"
        txt += "</div>";

		// Change password
		
		// email, name, nice_name
		// payment_plan, last_payment, next_payment_due, monthly_fee,
		// address, city, state, post_code, iso_country_code, 
		// service_client_gallery
		// latitude, longitude
		
        $('#apollo_dialog').html(txt);
        $('#apollo_dialog').dialog( 'destroy' );
        $('#apollo_dialog').dialog({
            modal: false,
            width:600,
            height: 500,
            resizable:false,
            buttons: {
                Ok: function() {
                    $(this).dialog('close');
                }
            },
            title: 'Your Account Settings'});

    }

    // ////////////////////////////////////////////////////////////////////////
}
/**
* Javascript class that allows a user to pick an image from their wordpress media library
* The image data is assumed to be in the class ImagePickerData see the fucntion 
* echoImagePickerJSImageData in plugin_functions.php
*
* @since 24th March, 2010
*/
var FolderSidebarFrame = {

	ID_ALL : 0, // hard-coded folder id for all images
	ID_UNASSIGNED : 1, // hard-coded folder id for unassigned images
	ID_LAST_24_HOURS : 2, // hard-coded folder id for images uploaded in last 24 hrs
	ID_LAST_7_DAYS : 3, // hard-coded folder id for images uploaded in last 7 days
	ID_LAST_1_HOUR : 4, // hard-coded folder id for images uploaded in last 1 hrs
	
    /** Number of tags per 'page' */
    m_foldersPerPage : 25,    
    m_currentPage : 0,    
    m_numberPages : 0,
		
	/** Number of hard coded system folders */	
	m_noSystemFolders : 2,
	
	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	*
	*/
	paint : function(targetDiv){
		
		var txt = "";

		// Hard code 'switch to tag view' link		
		txt += "<div onclick=\"SidebarFrame.showTags()\" id='switch_to_tag_view' class='folder droppable_folder' title='' class='apollo_folder folder_with_menu'><img class='folder_filter_icon' src='images/tag_icon_blue_24x24.png'><span class='folder_name'>Switch to tag view</span></div>";
					
		txt += "<div id='apollo_folder_list'></div>";
				
        txt += "<div id='folderPageControls' class='sidebar_page_controls'>";        
        txt += "<table border='0'>";
        txt += "    <tr>";
        txt += "        <td width='33%' align='left'><span class='more_posts_link' id='prev_posts_link' style='padding-left:15px' onclick='FolderSidebarFrame.showPrevPage()' title='Display previous page'>&laquo; prev</span></td>";
        txt += "        <td width='33%' align='center'><span class='more_posts_pages' id='folders_sideframe_page_no' style=''>1 of 2</span></td>";                
        txt += "        <td width='33%' align='right'><span class='more_posts_link' id='next_posts_link' style='padding-right:15px' onclick='FolderSidebarFrame.showNextPage()' title='Display next page'>next &raquo;</span></td>";
        txt += "    </tr>";
        txt += "</table>";        
        txt += "</div>";
        
        						
		// Right click pop-up menu....
		txt += "<ul id='folderMenu' class='rightClickMenu'>";
		txt += "	<li class='edit'><a href='#edit'>Rename</a></li>";
		txt += "	<li class='delete'><a href='#delete'>Delete</a></li>";
		txt += "	<li class='quit separator'><a href='#quit'>Cancel</a></li>";
		txt += "</ul>";

		$(targetDiv).html(txt);
		
		var pos = $(targetDiv).position();

		var offset = pos.top + 30;
		var lineht = 30;
		var h = $('.ViewFrame').height() - offset - $('#folderPageControls').height(); 
				
/*		switch(ssMain.view){			
		
			case ssMain.VIEW_GALLERIES : 
//				h = ($(document).height()/2) - offset - $('#folderPageControls').height(); 
				h = $(document).height() - offset - $('#folderPageControls').height(); 
				break;
				
			case ssMain.VIEW_FILES : 
				h = $(document).height() - offset - $('#folderPageControls').height(); 
				break;
		}
*/		
		    	
		FolderSidebarFrame.m_foldersPerPage = Math.floor(h / lineht);		
        FolderSidebarFrame.m_numberPages = Math.ceil(DataStore.m_folderList.length / FolderSidebarFrame.m_foldersPerPage);
        
        if (FolderSidebarFrame.m_numberPages == 1){
        	$('#folderPageControls').hide();
        }
        
        		
		FolderSidebarFrame.paintFolders();		
        $('#apollo_folder_list').height(h);
        		
		$(targetDiv).disableSelection();
		$(targetDiv).noContext();
		
	},

	// ////////////////////////////////////////////////////////////////////////////
	
	paintFolders : function(){
		
		var folderList = DataStore.m_folderList;
				
        var start_i = FolderSidebarFrame.m_currentPage * FolderSidebarFrame.m_foldersPerPage;
        var end_i = Math.min(folderList.length, start_i+FolderSidebarFrame.m_foldersPerPage);
        $('#folders_sideframe_page_no').html((FolderSidebarFrame.m_currentPage+1) + " of " + FolderSidebarFrame.m_numberPages);
				
		var txt = "";
		
		// NOTE: Folder id's 0-9 are reserved for system folders, so can safely use these id's here		
		
		// Deal with hard-coded 'faves' folders....	
		
		if (FolderSidebarFrame.m_currentPage == 0){
		
			var help_text = "";
			var name = "";
				
			for (var i=0; i<FolderSidebarFrame.m_noSystemFolders; i++){
			
				switch(i){
					case 0: help_text = "Select to display all of your images"; break;
					case 1: help_text = "Select to display all unassigned files (files that have not been added to a folder"; break;
					case 2: help_text = "Select to display all files uploaded in the last hour"; break;
					case 3: help_text = "Select to display all files uploaded in the last 24 hours"; break;
					case 4: help_text = "Select to display all files uploaded in the last 7 days"; break;
				}
				
				switch(i){
					case 0: name = "Show All"; break;
					case 1: name = "Unassigned Files"; break;
					case 2: name = "Show Last Hour"; break;
					case 3: name = "Show Last 24 Hours"; break;
					case 4: name = "Show Last 7 Days"; break;
				}			
				
			
				if (DataStore.m_currentFolderID == i){
					txt += "<div onclick=\"FolderSidebarFrame.onSelectFolder("+i+")\" class='folder_filter' id='folder_0' title='"+help_text+"'><img class='folder_fav_icon' src='images/folder_favorites.png'><span class='folder_fav_name selected'>"+name+"</span></div>";
				}
				else {
					txt += "<div onclick=\"FolderSidebarFrame.onSelectFolder("+i+")\" class='folder_filter' id='folder_0' title='"+help_text+"'><img class='folder_fav_icon' src='images/folder_favorites.png'><span class='folder_fav_name'>"+name+"</span></div>";
				}		
				
			}
			
			start_i += FolderSidebarFrame.m_noSystemFolders;
		}
		
		// Now deal with the user's folders...
		
		for (var i=start_i; i<end_i; i++){

			var folder_name = folderList[i].name;
			var folder_id = folderList[i].id;
			
			if (folder_id == DataStore.m_currentFolderID){
				txt += "<div onclick=\"FolderSidebarFrame.onSelectFolder('"+folder_id+"')\" class='folder droppable_folder' id='folder_"+folder_id+"' title='' class='apollo_folder folder_with_menu'><img class='folder_filter_icon' src='images/folder_grey.png'><span class='folder_name selected'>"+folder_name+"</span></div>";
			}
			else {
				txt += "<div onclick=\"FolderSidebarFrame.onSelectFolder('"+folder_id+"')\" class='folder droppable_folder' id='folder_"+folder_id+"' title='' class='apollo_folder folder_with_menu'><img class='folder_filter_icon' src='images/folder_icon.png'><span class='folder_name'>"+folder_name+"</span></div>";
			}	
			
		}
		
		$('#apollo_folder_list').html(txt);

				
		$(".folder").rightClick( function(e) {FolderSidebarFrame.onRightClickFolder(e, this);});

		$('.droppable_folder').droppable({
				drop: FolderSidebarFrame.onAddToFolder,
				over: function(ev, ui) {$(this).addClass( 'folder_name_hover' );},
				out: function(ev, ui) {$(this).removeClass( 'folder_name_hover' );}
			});	
			
		$("#apollo_folder_list").disableSelection();
				
	},

    // ////////////////////////////////////////////////////////////////////////////

    showNextPage : function(){
		
        $('#prev_posts_link').show();
        	
        if (FolderSidebarFrame.m_currentPage < FolderSidebarFrame.m_numberPages-1){
            FolderSidebarFrame.m_currentPage += 1;
        }
        
        if (FolderSidebarFrame.m_currentPage == FolderSidebarFrame.m_numberPages-1){
        	$('#next_posts_link').hide();
        }
        
        FolderSidebarFrame.paintFolders();
    },

    // ////////////////////////////////////////////////////////////////////////////

    showPrevPage : function(){

        $('#next_posts_link').show();

        if (FolderSidebarFrame.m_currentPage > 0){
            FolderSidebarFrame.m_currentPage -= 1;
        }
        
        if (FolderSidebarFrame.m_currentPage == 0){
        	$('#prev_posts_link').hide();
        }
        
        FolderSidebarFrame.paintFolders();
    },
    
	// ////////////////////////////////////////////////////////////////////////////

	onRightClickFolder : function(e, obj){

		e.stopPropagation();
		
		//var x = e.pageX - $('#adminmenu').width() - 30;
		//var y = e.pageY - $('#wphead').height() - $('#update-nag').height();		
		var x = e.pageX;
		var y = e.pageY;		

		$('#folderMenu').css('top',y);
		$('#folderMenu').css('left',x);
		$('#folderMenu').show();

		$('#folderMenu .edit').unbind('click');
		$('#folderMenu .delete').unbind('click');
		$('#folderMenu .quit').unbind('click');

		$('#folderMenu .edit').click(function(){FolderSidebarFrame.onMenuItem('rename_folder', obj)});
		$('#folderMenu .delete').click(function(){FolderSidebarFrame.onMenuItem('delete_folder', obj)});
		$('#folderMenu .quit').click(function(){FolderSidebarFrame.onMenuItem('quit', obj)});
		
	},

	// ////////////////////////////////////////////////////////////////////////////

	/**
	* Get the image list for the currently selected gallery page. Note that even for multi-drag
	* the object dropped on the folder is still the source thumbnail, and not the image that is
	* show during the drag (defined by the helper function)
	*/
	onAddToFolder : function(event, ui){

		var imgID = parseInt($(ui.draggable).attr('id').substring(4));						
		var folderID = parseInt($(this).attr('id').substring(7));	// format folder_xxx
				
		if (folderID == FolderSidebarFrame.ID_UNASSIGNED || folderID > 9){		
			MediaAPI.addMediaToFolder(DataStore.m_siteID, imgID, folderID, FolderSidebarFrame.onAddedToFolder)
		}	
		
		$(this).removeClass( 'folder_name_hover' );
			
	},
	
	onAddedToFolder : function(folderID, mediaID){
		
		/*	
		if (folderID == 0){
			AthenaDialog.message("Image removed from folder");			
		}
		else {
			AthenaDialog.message("Image added to folder <i>" + DataStore.getFolderName(folderID) + "</i>");			
		}	
		*/
		
		for (var i=0; i<DataStore.m_mediaList.length; i++){
			
			if (DataStore.m_mediaList[i].id == mediaID){
				DataStore.m_mediaList[i].folder_id = folderID;						
				break;
			}
		}
		
		FilesFrame.repaint();			
	},

	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	* Respond to the user selecting a menu item
	*/
	onMenuItem : function(item, selectedElement){
				
		$('#imageMenu').hide();
		$('#folderMenu').hide();
		
		var divID = $(selectedElement).attr('id');		
		var name = $('#'+divID + ' .folder_name').html();		
		var folder_id = parseInt(divID.substr(7));		
				
		// Process events related to folders...					
		if (item == 'rename_folder'){
			FolderSidebarFrame.makeFolderNameEditable(folder_id);
		}
		else if (item == 'delete_folder'){		
			AthenaDialog.confirm("Are you sure you want to delete this folder? This can not be undone.", function(){FolderSidebarFrame.deleteFolder(folder_id);});
		}
				
	},

	// ////////////////////////////////////////////////////////////////////////////

	makeFolderNameEditable : function(folder_id){
		
		var divID = '#folder_' + folder_id;
		var name = $(divID + ' .folder_name').html();
		
		$(divID).attr('onclick','');

		$(divID + ' .folder_name').html("<input id='folder_name_edit' style='width:100px' type='text' value='"+name+"' onblur='FolderSidebarFrame.paintFolders()'/>");
		
		$("#folder_name_edit").keypress(function (e) {
			if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
				FolderSidebarFrame.renameFolder(folder_id, $("#folder_name_edit").val());
			}
	    });
		
		$("#folder_name_edit").focus();
	},
		
	// ////////////////////////////////////////////////////////////////////////////
		
	onSelectFolder : function(folder_id){

		DataStore.m_currentFolderID = parseInt(folder_id);
		FolderSidebarFrame.paintFolders();				

		switch(ssMain.view){			
			case ssMain.VIEW_GALLERIES : GalleriesFrame.repaint(); break;
			case ssMain.VIEW_FILES : FilesFrame.onSelectFolder(); break;
		}
		
	},
			
	// ////////////////////////////////////////////////////////////////////////////

	deleteFolder : function(folderId){
		MediaAPI.deleteFolder(DataStore.m_siteID, folderId, FolderSidebarFrame.onFolderDeleted);
	},
	
	onFolderDeleted : function(folder_id){

		//AthenaDialog.message("Folder deleted");
		
		var temp = new Array();		
		for (var i=0; i<DataStore.m_folderList.length; i++){
		
			if (DataStore.m_folderList[i].id != folder_id){
				temp.push(DataStore.m_folderList[i]);
			}
			
		}
		DataStore.m_folderList = temp;
		
		FolderSidebarFrame.paintFolders()	
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	addFolder : function(){		
		MediaAPI.addFolder(DataStore.m_siteID, 'new folder', FolderSidebarFrame.onAddedFolder);
	},
	
	onAddedFolder : function(folderName, folderID){

		//alert("Folder ID: " + folderID + " Folder Name: " + folderName);

		var temp = new Object();
		temp.id = folderID;
		temp.name = folderName;

		DataStore.m_folderList.push(temp);

		FolderSidebarFrame.paintFolders()
					
		// Make the folder name editable so the user can give it a good name
		FolderSidebarFrame.makeFolderNameEditable(folderID);					

/*		
		DataStore.load(function(){
			
			ssMain.onDataLoaded(); 
			
			// Make the folder name editable so the user can give it a good name
			FolderSidebarFrame.makeFolderNameEditable(folderID);					
		})
*/		
		
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	getFolderName : function(folder_id){
	
		if (folder_id == FolderSidebarFrame.ID_UNASSIGNED){
			return "Unassigned";
		}
		
		for (var i=0; i<DataStore.m_folderList.length; i++){
			if (DataStore.m_folderList[i].id == folder_id){
				return DataStore.m_folderList[i].name;
			}			
		}
		
		return "? ("+folder_id+")";
	},
			
	// ////////////////////////////////////////////////////////////////////////////

	/**
	* Rename a folder
	*/
	renameFolder : function(folderId, folderName){
		MediaAPI.renameFolder(DataStore.m_siteID, folderId, folderName, FolderSidebarFrame.onFolderRenamed);
	},
	
	onFolderRenamed : function(folderId, folderName){

		for (var i=0; i<DataStore.m_folderList.length; i++){
			if (DataStore.m_folderList[i].id == folderId){
				DataStore.m_folderList[i].name = folderName;
				break;
			}
		}

		FolderSidebarFrame.paintFolders()
	}			

}
/**
*
* @author Mike Pritchard (mike@apollosites.com)
* @since 30th December, 2010
*/
var TagsSidebarFrame = {

    /** Number of tags per 'page' */
    m_tagsPerPage : 25,    
    m_currentPage : 0,    
    m_numberPages : 0,

	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	*
	*/
	paint : function(targetDiv){
		
		var txt = "";

		// Hard code a 'switch to folder view' item							
		txt += "<div onclick=\"SidebarFrame.showFolders()\" id='switch_to_folder_view' class='folder' title='' class='apollo_tag tag_with_menu'><img class='folder_icon' src='images/folder_icon.png'><span class='switch_to_folder_view_name'>Switch to folder view</span></div>";

		txt += "<div id='apollo_tag_list'></div>";
															
        txt += "<div id='tagPageControls' class='sidebar_page_controls'>";        
        txt += "<table border='0'>";
        txt += "    <tr>";
        txt += "        <td width='33%' align='left'><span class='more_posts_link' id='prev_tags_page_link' style='padding-left:15px' onclick='TagsSidebarFrame.showPrevPage()' title='Display previous page'>&laquo; prev</span></td>";
        txt += "        <td width='33%' align='center'><span class='more_posts_pages' id='tags_sideframe_page_no' style=''>1 of 2</span></td>";                
        txt += "        <td width='33%' align='right'><span class='more_posts_link' id='next_tags_page_link' style='padding-right:15px' onclick='TagsSidebarFrame.showNextPage()' title='Display next page'>next &raquo;</span></td>";
        txt += "    </tr>";
        txt += "</table>";        
        txt += "</div>";
						
						
		// Right click pop-up menu....
		txt += "<ul id='tagMenu' class='rightClickMenu'>";
		txt += "	<li class='edit'><a href='#edit'>Rename</a></li>";
		txt += "	<li class='delete'><a href='#delete'>Delete</a></li>";
		txt += "	<li class='quit separator'><a href='#quit'>Cancel</a></li>";
		txt += "</ul>";

		$(targetDiv).html(txt);

		var pos = $(targetDiv).position();
		
		var offset = pos.top + 30;
		var lineht = 23;				
		var h = $('.ViewFrame').height() - offset - $('#tagPageControls').height(); 
/*				
		switch(ssMain.view){			
		
			case ssMain.VIEW_GALLERIES : 
				h = ($('.ViewFrame').height()/2) - offset - $('#tagPageControls').height();		 
				break;
				
			case ssMain.VIEW_FILES : 
				h = $('.ViewFrame').height() - offset - $('#tagPageControls').height(); 
				break;
		}
*/		    		    	    		
		TagsSidebarFrame.m_tagsPerPage = Math.floor(h / lineht);		
        TagsSidebarFrame.m_numberPages = Math.ceil(DataStore.m_mediaTags.length / TagsSidebarFrame.m_tagsPerPage);
        
        if (TagsSidebarFrame.m_numberPages == 1){
        	$('#tagPageControls').hide();
        }
        
		TagsSidebarFrame.paintTags();		
        $('#apollo_tag_list').height(h);
		
		$(targetDiv).disableSelection();
		$(targetDiv).noContext();
		
	},

	// ////////////////////////////////////////////////////////////////////////////
	
	paintTags : function(){
				
		var tagList = DataStore.m_mediaTags;
						
		if (tagList == undefined || tagList == null){
			$("#apollo_tag_list").html("");
		}
		
        var start_i = TagsSidebarFrame.m_currentPage * TagsSidebarFrame.m_tagsPerPage;
        var end_i = Math.min(tagList.length, start_i+TagsSidebarFrame.m_tagsPerPage);
        $('#tags_sideframe_page_no').html((TagsSidebarFrame.m_currentPage+1) + " of " + TagsSidebarFrame.m_numberPages);
		
		var txt = "";
							
		for (var i=start_i; i<end_i; i++){

			var tag = tagList[i];
						
			if (tag == DataStore.m_currentTag){
				txt += "<div onclick=\"TagsSidebarFrame.onSelectTag('"+tag+"')\" class='tag droppable_tag' id='tag_"+tag+"' title='' class='apollo_tag tag_with_menu'><img class='tag_icon' src='images/tag_icon_blue.png'><span class='tag_name selected'>"+tag+"</span></div>";
			}
			else {
				txt += "<div onclick=\"TagsSidebarFrame.onSelectTag('"+tag+"')\" class='tag droppable_tag' id='tag_"+tag+"' title='' class='apollo_tag tag_with_menu'><img class='tag_icon' src='images/tag_icon_blue.png'><span class='tag_name'>"+tag+"</span></div>";
			}	
			
		}
		
		$('#apollo_tag_list').html(txt);

		$(".tag").rightClick( function(e) {TagsSidebarFrame.onRightClickTag(e, this);});

		$('.droppable_tag').droppable({
				drop: TagsSidebarFrame.onAddToTag,
				over: function(ev, ui) {$(this).addClass( 'tag_name_hover' );},
				out: function(ev, ui) {$(this).removeClass( 'tag_name_hover' );}
			});	
			
		$("#apollo_tag_list").disableSelection();
				
	},

    // ////////////////////////////////////////////////////////////////////////////

    showNextPage : function(){
		
        $('#prev_tags_page_link').show();
        	
        if (TagsSidebarFrame.m_currentPage < TagsSidebarFrame.m_numberPages-1){
            TagsSidebarFrame.m_currentPage += 1;
        }
        
        if (TagsSidebarFrame.m_currentPage == TagsSidebarFrame.m_numberPages-1){
        	$('#next_tags_page_link').hide();
        }
        
        TagsSidebarFrame.paintTags();
    },

    // ////////////////////////////////////////////////////////////////////////////

    showPrevPage : function(){

        $('#next_tags_page_link').show();

        if (TagsSidebarFrame.m_currentPage > 0){
            TagsSidebarFrame.m_currentPage -= 1;
        }
        
        if (TagsSidebarFrame.m_currentPage == 0){
        	$('#prev_tags_page_link').hide();
        }
        
        TagsSidebarFrame.paintTags();
    },
    
	// ////////////////////////////////////////////////////////////////////////////

	onRightClickTag : function(e, obj){

		e.stopPropagation();
		
		//var x = e.pageX - $('#adminmenu').width() - 30;
		//var y = e.pageY - $('#wphead').height() - $('#update-nag').height();		
		var x = e.pageX;
		var y = e.pageY;		

		$('#tagMenu').css('top',y);
		$('#tagMenu').css('left',x);
		$('#tagMenu').show();

		$('#tagMenu .edit').unbind('click');
		$('#tagMenu .delete').unbind('click');
		$('#tagMenu .quit').unbind('click');

		$('#tagMenu .edit').click(function(){TagsSidebarFrame.onMenuItem('rename_tag', obj)});
		$('#tagMenu .delete').click(function(){TagsSidebarFrame.onMenuItem('delete_tag', obj)});
		$('#tagMenu .quit').click(function(){TagsSidebarFrame.onMenuItem('quit', obj)});
		
	},

	// ////////////////////////////////////////////////////////////////////////////

	/**
	* Get the image list for the currently selected gallery page. Note that even for multi-drag
	* the object dropped on the folder is still the source thumbnail, and not the image that is
	* show during the drag (defined by the helper function)
	*/
	onAddToTag : function(event, ui){
		
		var imgID = parseInt($(ui.draggable).attr('id').substring(4));						
		var tag = $(this).attr('id').substring(4);	// format tag_xxx

        MediaAPI.addMediaCSVTags(DataStore.m_siteID, imgID, tag, TagsSidebarFrame.onAddedToTag);
		
	},
			
	onAddedToTag : function(mediaObj, tags){
        DataStore.updateMedia(mediaObj);				
        DataStore.m_mediaTags = tags;
		TagsSidebarFrame.onSelectTag(DataStore.m_currentTag);
	},

	// ////////////////////////////////////////////////////////////////////////////
		
	/**
	* Respond to the user selecting a menu item
	*/
	onMenuItem : function(item, selectedElement){
				
		$('#tagMenu').hide();
		
		var divID = $(selectedElement).attr('id');		
		var name = $('#'+divID + ' .tag_name').html();		
		var tag = divID.substr(4);
				
		// Process events related to folders...					
		if (item == 'rename_tag'){
			TagsSidebarFrame.makeTagNameEditable(tag);
		}
		else if (item == 'delete_tag'){		
			AthenaDialog.confirm("Are you sure you want to delete this tag? This will not delete any of your images, just this tag", function(){TagsSidebarFrame.deleteTag(tag);});
		}
				
	},	

	// ////////////////////////////////////////////////////////////////////////////

	makeTagNameEditable : function(tag){
		
		var divID = '#tag_' + tag;
		var name = $(divID + ' .tag_name').html();
		
		$(divID).attr('onclick','');

		$(divID + ' .tag_name').html("<input id='tag_name_edit' style='width:100px' type='text' value='"+name+"' onblur='TagsSidebarFrame.paintTags()'/>");
		
		$("#tag_name_edit").keypress(function (e) {
			if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
				TagsSidebarFrame.renameTag(tag, $("#tag_name_edit").val());
			}
	    });
		
		$("#tag_name_edit").focus();
	},
		
	// ////////////////////////////////////////////////////////////////////////////
		
	onSelectTag : function(tag){
		
		DataStore.m_currentTag = tag;
		TagsSidebarFrame.paintTags();				

		switch(ssMain.view){			
			case ssMain.VIEW_GALLERIES : GalleriesFrame.repaint(); break;
			case ssMain.VIEW_FILES : FilesFrame.onSelectFolder(); break;
		}
		
	},
			
	// ////////////////////////////////////////////////////////////////////////////

	deleteTag : function(tag){
		MediaAPI.deleteMediaTag(DataStore.m_siteID, tag, TagsSidebarFrame.onTagDeleted)
	},
	
	onTagDeleted : function(newTagList){
        
        DataStore.m_mediaTags = newTagList;
        
        if (DataStore.m_mediaTag != undefined && DataStore.m_mediaTag != null && DataStore.m_mediaTag.length > 0){
        	DataStore.m_currentTag = DataStore.m_mediaTags[0];
			TagsSidebarFrame.onSelectTag(DataStore.m_currentTag);
        }
        else {
			TagsSidebarFrame.onSelectTag('');
        }
        		
	},
					
	// ////////////////////////////////////////////////////////////////////////////

	/**
	* Rename a folder
	*/
	renameTag : function(oldTagName, newTagName){
	
		// Check to see if this new name is not in use
		for (var i=0; i<DataStore.m_mediaTags.length; i++){
			if (DataStore.m_mediaTags[i] == newTagName){
				AthenaDialog.alert("Sorry, you already have a tag with that name!");
				return;
			}
		}
		
		TagsSidebarFrame.m_newTag = newTagName;
		MediaAPI.renameMediaTag(DataStore.m_siteID, oldTagName, newTagName, TagsSidebarFrame.onTagRenamed);
	},
	
	onTagRenamed : function(tags){
        DataStore.m_mediaTags = tags;
		TagsSidebarFrame.onSelectTag(TagsSidebarFrame.m_newTag);
	}			

}
/**
* Javascript class that allows a user to pick an image from their wordpress media library
* The image data is assumed to be in the class ImagePickerData see the fucntion 
* echoImagePickerJSImageData in plugin_functions.php
*
* @since 24th March, 2010
*/
var GalleriesSidebarFrame = {
	
	m_targetDiv : '',
	
    /** Number of tags per 'page' */
    m_tagsPerPage : 25,    
    m_currentPage : 0,    
    m_numberPages : 0,
	
	m_pageList : '',
	
	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	*
	*/
	paint : function(targetDiv){
		
		GalleriesSidebarFrame.m_targetDiv = targetDiv;
		
		var txt = "";

		txt += "<div id='apollo_page_list'></div>";
		
        txt += "<div id='galPagesSidebarControls' class='sidebar_page_controls'>";        
        txt += "<table border='0'>";
        txt += "    <tr>";
        txt += "        <td width='33%' align='left'><span class='more_posts_link' id='prev_pages_link' style='padding-left:15px' onclick='GalleriesSidebarFrame.showPrevPage()' title='Display previous page'>&laquo; prev</span></td>";
        txt += "        <td width='33%' align='center'><span class='more_posts_pages' id='galpages_sideframe_page_no' style=''>1 of 2</span></td>";                
        txt += "        <td width='33%' align='right'><span class='more_posts_link' id='next_pages_link' style='padding-right:15px' onclick='GalleriesSidebarFrame.showNextPage()' title='Display next page'>next &raquo;</span></td>";
        txt += "    </tr>";
        txt += "</table>";        
        txt += "</div>";
		
		/*
		// Right click pop-up menu....
		txt += "<ul id='pagesMenu' class='rightClickMenu'>";
		txt += "	<li class='edit'><a href='#edit'>Rename</a></li>";
		txt += "	<li class='duplicate'><a href='#edit'>Duplicate</a></li>";
		txt += "	<li class='delete'><a href='#delete'>Delete</a></li>";
		txt += "	<li class='quit separator'><a href='#quit'>Cancel</a></li>";
		txt += "</ul>";
		*/
		
		$(targetDiv).html(txt);

		GalleriesSidebarFrame.m_pageList = GalleriesSidebarFrame.getPagesWithGalleries();
		
		var offset = 110;
		var h = ($(window).height() - offset)/2;				 
				    		    	    		
		GalleriesSidebarFrame.m_tagsPerPage = Math.floor(h / 25);		
        GalleriesSidebarFrame.m_numberPages = Math.ceil(GalleriesSidebarFrame.m_pageList.length / GalleriesSidebarFrame.m_tagsPerPage);
                                                        				
        if (GalleriesSidebarFrame.m_numberPages == 1){
        	$('#galPagesSidebarControls').hide();
        }
		
		GalleriesSidebarFrame.paintPages();		

        $('#apollo_page_list').height(h);
		
		$(targetDiv).disableSelection();
		$(targetDiv).noContext();
		
	},

	// ////////////////////////////////////////////////////////////////////////////

	repaint : function(){
		GalleriesSidebarFrame.paint(GalleriesSidebarFrame.m_targetDiv);
	},

	// ////////////////////////////////////////////////////////////////////////////

	getPagesWithGalleries : function(){

		var pageList = new Array();
		
		for (var i=0; i<DataStore.m_pageList.length; i++){
			
			var hasGallery = DataStore.isGalleryPage(DataStore.m_pageList[i].id);
			
			if (hasGallery){
				pageList.push(DataStore.m_pageList[i]);
			}
		}
		
		return pageList;
	},
		
	// ////////////////////////////////////////////////////////////////////////////
	
	paintPages : function(){
		
		var pageList = GalleriesSidebarFrame.m_pageList;
				
        var start_i = GalleriesSidebarFrame.m_currentPage * GalleriesSidebarFrame.m_tagsPerPage;
        var end_i = Math.min(pageList.length, start_i+GalleriesSidebarFrame.m_tagsPerPage);
        $('#galpages_sideframe_page_no').html((GalleriesSidebarFrame.m_currentPage+1) + " of " + GalleriesSidebarFrame.m_numberPages);
				
		var txt = "";		
				
		if (pageList.length == 0){
			txt += "<div style='padding-left:10px;color:#444444;'>You have no pages using a gallery template yet</div>";
		}
		else {
			for (var i=start_i; i<end_i; i++){
				
				var hasGallery = DataStore.isGalleryPage(pageList[i].id);
				
				if (hasGallery){
					txt += GalleriesSidebarFrame.getPageHtml(pageList[i].id, pageList[i].title, pageList[i].status, 0);
				}
			}
		}
											
		$('#apollo_page_list').html(txt);
		
		//$(".folder").rightClick( function(e) {GalleriesSidebarFrame.onRightClickFolder(e, this);});

		$("#apollo_page_list").disableSelection();
				
	},

    // ////////////////////////////////////////////////////////////////////////////

    showNextPage : function(){
		
        $('#prev_pages_link').show();
        	
        if (GalleriesSidebarFrame.m_currentPage < GalleriesSidebarFrame.m_numberPages-1){
            GalleriesSidebarFrame.m_currentPage += 1;
        }
        
        if (GalleriesSidebarFrame.m_currentPage == GalleriesSidebarFrame.m_numberPages-1){
        	$('#next_pages_link').hide();
        }
        
        GalleriesSidebarFrame.paintPages();
    },

    // ////////////////////////////////////////////////////////////////////////////

    showPrevPage : function(){

        $('#next_pages_link').show();

        if (GalleriesSidebarFrame.m_currentPage > 0){
            GalleriesSidebarFrame.m_currentPage -= 1;
        }
        
        if (GalleriesSidebarFrame.m_currentPage == 0){
        	$('#prev_pages_link').hide();
        }
        
        GalleriesSidebarFrame.paintPages();
    },
    
	// ////////////////////////////////////////////////////////////////////////////

	getPageHtml : function(page_id, page_title, page_status, page_depth){

		var txt = '';
        var icon = "images/post.png";
		
        var status_class = "";
        var icon = "images/post.png";

        if (page_status == 'Draft'){
            status_class = 'status_draft';
            //icon = "images/webpage_draft.png";
        }
        else if (page_status == 'Private'){
            //icon = "images/webpage_private.png";
            status_class = 'status_private';
        }
        else if (page_status == 'Published'){
            //icon = "images/webpage_published.png";
            status_class = 'status_public';
        }
				
        var selected = '';
        if (page_id == DataStore.m_currentPageID){
            selected = 'selected';
        }
        
		page_depth = 0;
		
		
        txt += "<div onclick=\"GalleriesSidebarFrame.onSelectPage('"+page_id+"')\" class='page page_depth_"+page_depth+"' id='page_"+page_id+"' title=''>";
        txt += "    <img class='page_icon' src='images/web_page2.png'>";
        txt += "    <span class='page_name "+status_class+" "+selected+"'>"+page_title+"</span>";
        txt += "</div>";

/*		
        txt += "<div onclick=\"GalleriesSidebarFrame.onSelectPage('"+page_id+"')\" class='page page_depth_"+page_depth+"' id='page_"+page_id+"' title=''>";
        //txt += "    <img class='node_icon' src='"+nodeIcon+"'>";
        txt += "    <img class='page_icon' src='"+icon+"'>";
        txt += "    <span class='page_name "+status_class+" "+selected+"'>"+page_title+"</span>";
        txt += "</div>";
  */      				
		return txt;
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	onSelectPage : function(page_id){
		DataStore.m_currentPageID = parseInt(page_id);
		GalleriesFrame.repaint();
		GalleriesSidebarFrame.paintPages();				
	}
			
	// ////////////////////////////////////////////////////////////////////////////

}
/**
*
* 
* @since 27th July, 2010
*/
var SidebarFrame = {

    m_mode : '',
	
    FOLDER_ID_ALL : 0, // hard-coded folder id for all images
    FOLDER_ID_UNASSIGNED : 1, // hard-coded folder id for unassigned images
    FOLDER_ID_LAST_24_HOURS : 2, // hard-coded folder id for images uploaded in last 24 hrs
    FOLDER_ID_LAST_7_DAYS : 3, // hard-coded folder id for images uploaded in last 7 days
    FOLDER_ID_LAST_1_HOUR : 4, // hard-coded folder id for images uploaded in last 1 hrs
	
    // ////////////////////////////////////////////////////////////////////////////
	
    init : function(){	
    },
	
    // ////////////////////////////////////////////////////////////////////////////
	
    repaint : function(){
			
		//alert('SidebarFrame.repaint() mode = ' + SidebarFrame.m_mode);
		
        switch(ssMain.view){
			
            case ssMain.VIEW_DASHBOARD :
            case ssMain.VIEW_SETTINGS :
            case ssMain.VIEW_ACCOUNT :
                $('#SideBar').html("");
                SidebarFrame.m_mode = '';
                break;
			
            case ssMain.VIEW_POSTS :
                if (SidebarFrame.m_mode != 'Posts'){
                    $('#SideBar').html("");
                    SidebarFrame.m_mode = 'Posts';
                    SidebarFrame.paintPosts();
                }
                break;
				
            case ssMain.VIEW_GALLERIES :
                if (SidebarFrame.m_mode != 'Galleries'){
                    $('#SideBar').html("");
                    SidebarFrame.m_mode = 'Galleries';
                    SidebarFrame.paintGalleries();
			        SidebarFrame.paintFolders(true);
                }
                break;
			
            case ssMain.VIEW_PAGES :
                if (SidebarFrame.m_mode != 'Pages'){
                    $('#SideBar').html("");
                    SidebarFrame.m_mode = 'Pages';
                    SidebarFrame.paintPages();
                }
                break;
			
            case ssMain.VIEW_STATS :
                if (SidebarFrame.m_mode != 'Stats'){
                    $('#SideBar').html("");
                    SidebarFrame.m_mode = 'Stats';
                    SidebarFrame.paintStatsSidebar();
                }
                break;
			
            case ssMain.VIEW_FILES :
            case ssMain.VIEW_EDITFILES :
                if (SidebarFrame.m_mode != 'Folders'){
                    $('#SideBar').html("");
                    SidebarFrame.m_mode = 'Folders';
                    SidebarFrame.paintFolders();
                }
                break;
        }
		
    },

    // ////////////////////////////////////////////////////////////////////////////

    getHeader : function(){
        return "<span class='spacer'></span>";
    },
    
    // ////////////////////////////////////////////////////////////////////////////

    paintPosts : function(){
        
        var txt = SidebarFrame.getHeader();
        txt += "<p>Blog Posts<span class='add_new_project' onclick='PostsSidebarFrame.addPost()' title='Add a new blank post to you blog.'>&nbsp;(add)</span></p>";
        txt += "<div id='SideBar_Posts'></div>";
		
        $('#SideBar').append(txt);

        PostsSidebarFrame.paint('#SideBar_Posts');
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    paintGalleries : function(){
        
        var txt = SidebarFrame.getHeader();
        txt += "<p>Pages with Galleries</p>";
        txt += "<div id='SideBar_Pages'></div>";
		
        $('#SideBar').append(txt);

        GalleriesSidebarFrame.paint('#SideBar_Pages');
				
    },

    // ////////////////////////////////////////////////////////////////////////////

	paintStatsSidebar : function(){

        var txt = SidebarFrame.getHeader();
        txt += "<p>Pages<span class='add_new_project' onclick='PagesSidebarFrame.addPage()' title='Add a new blank page to you site.'>&nbsp;(add)</span></p>";
        txt += "<div id='SideBar_Pages'></div>";
		
        $('#SideBar').append(txt);

        StatsSidebarFrame.paint('#SideBar_Pages');

	},
	
    // ////////////////////////////////////////////////////////////////////////////
	
    paintPages : function(){

        var txt = SidebarFrame.getHeader();
        txt += "<p>Pages<span class='add_new_project' onclick='PagesSidebarFrame.addPage()' title='Add a new blank page to you site.'>&nbsp;(add)</span></p>";
        txt += "<div id='SideBar_Pages'></div>";
		
        $('#SideBar').append(txt);

        PagesSidebarFrame.paint('#SideBar_Pages');
		
    },
		
    // ////////////////////////////////////////////////////////////////////////////
	
	m_folderTagMode : false,
	
	showTags : function(){ 
		SidebarFrame.m_mode = '';
		SidebarFrame.m_folderTagMode = true;
		SidebarFrame.repaint();
	},
	
	showFolders : function(){ 
		SidebarFrame.m_mode = '';
		SidebarFrame.m_folderTagMode = false;
		SidebarFrame.repaint();
	},
	
    paintFolders : function(noHeader){
			
		var txt = "";
		
		
		if (noHeader != undefined && noHeader){
			txt = "";
		}
		else {
	        txt = SidebarFrame.getHeader();
		}	
		
		if (!SidebarFrame.m_folderTagMode){	
	        txt += "<p>Folders";
	        txt += " <span class='add_new_project' onclick='FolderSidebarFrame.addFolder()' title='Add a new folder to help organize your images and other media files'>&nbsp;(add)</span>";
	        txt += "</p>";
	        txt += "<div id='SideBar_Folders'></div>";						
	        $('#SideBar').append(txt);
	        FolderSidebarFrame.paint('#SideBar_Folders');
		}
		else {
	        txt += "<p>Tags";
	        txt += "</p>";			
	        txt += "<div id='SideBar_Folders'></div>";						
	        $('#SideBar').append(txt);
	        TagsSidebarFrame.paint('#SideBar_Folders');
      	}
		
		
    }
	
}
/**
*
* 
* @since 27th July, 2010
*/
var GalleriesFrame = {

    m_themeParaID :0,
	
	/** Images are divided into pages so we can fit the right number on the screen */
    m_currentImagePage : 0,
    
    /** Max number of images per page */    
    m_imagesPerPage : 50,
    
    /** Number of image pages */
    m_numberImagePages : 0,

	/** List of images based on the current folder selection */	
	m_imageList : '',
	
    // ////////////////////////////////////////////////////////////////////////////

    init : function(){
    },
	
    // ////////////////////////////////////////////////////////////////////////////
	
    repaint : function(){			

        GalleriesFrame.m_themeParaID = GalleriesFrame.getThemeParaForGalleryPage();
        
        if (SidebarFrame.m_folderTagMode){
			GalleriesFrame.m_imageList = DataStore.getImagesForCurrentTag();
        }
        else {
			GalleriesFrame.m_imageList = DataStore.getImagesForCurrentFolder();
        }        
   		
		GalleriesFrame.calcImagePages();
        GalleriesFrame.paintGallerySlots();
        GalleriesFrame.paintImages();	

        //alert($('#GalleriesFrame').height());		
        
        //$('#GalleriesFrame').css('height','100%');	
        
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    showMultiGalSettings : function(){
        $('#gallerySettings').show();
    },
		
    // ////////////////////////////////////////////////////////////////////////////

	/**
	* Calculate number of images to display per page, we divide the images into 'pages' 
	* so we don't oveflow the display
	*/
	calcImagePages : function(){

    	var h = $('#apollo_image_contents_wrapper').height();
    	var w = 0;

        if (GalleriesFrame.m_mode == 'edit_image'){
	  		w = $('#GalleriesFrame').width() - 500;
        }
        else {
	  		w = $('#GalleriesFrame').width() - 300;
        }
        
    	// images per row = w / thumb_width
    	// images per col = h / thumb_height
    	// so.. images per page = (w/60) * (h/60) = (w*h)/(thumb_width*thumb_height)
    	//    = (w*h) / (50*50) = (w*h) / 2500
    	
    	GalleriesFrame.m_imagesPerPage = Math.floor((w*h) / 4900);    
        
        
		GalleriesFrame.m_numberImagePages = Math.ceil(GalleriesFrame.m_imageList.length / GalleriesFrame.m_imagesPerPage);
        
        if (GalleriesFrame.m_numberImagePages <= 1){
        	$('.more_link').hide();
        }
        else {
        	$('.more_link').show();
        }
        
        /*        
        Logger.show();
		Logger.debug("Width: " + w + " Height: " + h);
		Logger.info($('#apollo_image_contents_wrapper').height());
		Logger.debug("Images per row: " + (w/70) + " per col: " + (h/70) + " per page: " + GalleriesFrame.m_imagesPerPage);
		*/
	},
	
    // ////////////////////////////////////////////////////////////////////////////

	showPrevImages : function(){

		GalleriesFrame.m_currentImagePage--;
		
		//var noPages = Math.ceil(GalleriesFrame.m_imageList.length / GalleriesFrame.m_imagesPerPage);
		
		if (GalleriesFrame.m_currentImagePage < 0){
			GalleriesFrame.m_currentImagePage = GalleriesFrame.m_numberImagePages - 1;
		}
		
		//Logger.error(GalleriesFrame.m_currentImagePage + " / " + noPages);
		
		GalleriesFrame.paintImages();		

	},
	
    // ////////////////////////////////////////////////////////////////////////////

	showNextImages : function(){

		GalleriesFrame.m_currentImagePage++;

		//m_numberImagePagesvar noPages = Math.ceil(GalleriesFrame.m_imageList.length / GalleriesFrame.m_imagesPerPage);

		if (GalleriesFrame.m_currentImagePage >= GalleriesFrame.m_numberImagePages){
			GalleriesFrame.m_currentImagePage = 0;
		}
	
		//Logger.error(GalleriesFrame.m_currentImagePage + " / " + noPages);
		
		GalleriesFrame.paintImages();		
		
	},
		
    // ////////////////////////////////////////////////////////////////////////////
	
    getThemeParaForGalleryPage : function(){

        var page = DataStore.getCurrentPage();
				
        for(var i=0; i<DataStore.m_themeParaList.length; i++){
        
            if (DataStore.m_themeParaList[i].page_template_name == page.template){

                if (DataStore.m_themeParaList[i].para_type == 'gallery'){
                    return DataStore.m_themeParaList[i].id;
                }
                else if (DataStore.m_themeParaList[i].para_type == 'multi-gallery'){
                    GalleriesFrame.showMultiGalSettings();
                    return DataStore.m_themeParaList[i].id;
                }
				
            }
        }
        
        return 0;
    },
		
    // ////////////////////////////////////////////////////////////////////////////
	
    paintGallerySlots : function(){

        //$('#apollo_gallery_contents').remove();
        //$('#apollo_gallery_contents_wrapper').html("<div align='left' id='apollo_gallery_contents'></div>");

		if (!DataStore.isGalleryPage(DataStore.m_currentPageID)){
			$('#apollo_gallery_contents').html("<p>No gallery selected. Select a gallery from the page list to the left</p>");
	        $('#galleryTitle').html("Gallery Contents");
	        $('#delete_slot').hide();
			return;
		}

        $('#delete_slot').show();
		
        $('.gallery_slot').droppable('destroy');
        $(".gallery_thumb").draggable('destroy');
        $('#apollo_gallery_contents').html("");

        var txt = "";

        var noSlots = 23;
        for (var i=0; i<DataStore.m_galleryImageList.length; i++){
        	var slot = parseInt(DataStore.m_galleryImageList[i].slot_number);
            if (DataStore.m_galleryImageList[i].theme_para_id == GalleriesFrame.m_themeParaID &&  slot > noSlots){
                noSlots = slot;
            }
        }

        noSlots = noSlots + 2;
		
        for (var i=0; i<noSlots; i++){
            //txt += "<div class='gallery_slot' id='slot_"+i+"' align='center'><table><tr valigin='center'><td>";
            //txt += "<div class='gallery_slot_text' align='center'>"+(i+1)+"</div>";
            //txt += "</td></tr></table></div>";
            txt += "<div class='gallery_slot' id='slot_"+i+"' align='center'>";
            txt += "    <div class='gallery_slot_text' align='center'>"+(i+1)+"</div>";
            txt += "</div>";
        }
/*
        // Add special delete slot
        txt += "<div class='gallery_slot' id='delete_slot' align='center'>";
        txt += "    <div class='delete_slot_text' align='center'>remove</div>";        
        txt += "</div>";
*/					
        $('#apollo_gallery_contents').html(txt);
        
        // Update the gallery title
        var page = DataStore.getCurrentPage();
        $('#galleryTitle').html("Gallery "+page.title);
						
        for (var i=0; i<DataStore.m_galleryImageList.length; i++){
            
            if ((DataStore.m_galleryImageList[i].page_id == DataStore.m_currentPageID) &&
                (DataStore.m_galleryImageList[i].theme_para_id == GalleriesFrame.m_themeParaID) &&
                (DataStore.m_galleryImageList[i].gallery_number == DataStore.m_currentGalleryNo)){
						
                var img_id = DataStore.m_galleryImageList[i].image_id;
                var image = DataStore.getImage(img_id);
                var url = image.thumb_url;
                var slot_no = DataStore.m_galleryImageList[i].slot_number;

                $("#slot_"+slot_no).html("<img class='gallery_slot_image gallery_thumb' slot='"+slot_no+"' id='galimg_"+img_id+"' src='"+url+"'/>");
		//$(".gallery_thumb").draggable({	revert: false, zIndex: 300 });
            }
        }


        // Make the images draggable
        $(".gallery_thumb").draggable({
            revert: false,
            zIndex: 300
        });


        $('.gallery_slot').droppable({
            drop: GalleriesFrame.onDrop,
            over: function(ev, ui) {
                $(this).addClass( 'gallery_slot_hover' );
            },
            out: function(ev, ui) {
                $(this).removeClass( 'gallery_slot_hover' );
            }
        });
	
		// Make the 'drop here to remove from gallery' box droppable
        $('#delete_slot').droppable({
            drop: GalleriesFrame.onRemoveImage,
            over: function(ev, ui) {
                $(this).addClass( 'gallery_slot_hover' );
            },
            out: function(ev, ui) {
                $(this).removeClass( 'gallery_slot_hover' );
            }
        });
		
				
    },
    
    // ////////////////////////////////////////////////////////////////////////////
    
    paintImages : function(){
		
        $(".thumb").draggable('destroy');
				
		if (GalleriesFrame.m_imageList == ''){
	        if (SidebarFrame.m_folderTagMode){
				GalleriesFrame.m_imageList = DataStore.getImagesForCurrentTag();
	        }
	        else {
				GalleriesFrame.m_imageList = DataStore.getImagesForCurrentFolder();
	        }        
			GalleriesFrame.calcImagePages();
		}		
				
		var startIndex = GalleriesFrame.m_imagesPerPage * GalleriesFrame.m_currentImagePage;
		var endIndex = Math.min(startIndex + GalleriesFrame.m_imagesPerPage, GalleriesFrame.m_imageList.length);
		
		//Logger.debug("Image page: " + GalleriesFrame.m_currentImagePage);
				
        var txt = "";
    	
		// Get the html for the selected images...
        for (var i=startIndex; i<endIndex; i++){

            var thumb_url = GalleriesFrame.m_imageList[i].thumb_url;
            var post_id = GalleriesFrame.m_imageList[i].id;
            var title = GalleriesFrame.m_imageList[i].title;
            var thumb_width = GalleriesFrame.m_imageList[i].thumb_width;
            var thumb_height = GalleriesFrame.m_imageList[i].thumb_height;
            var width = GalleriesFrame.m_imageList[i].width;
            var height = GalleriesFrame.m_imageList[i].height;

        	txt += GalleriesFrame.getImageHTML(post_id, thumb_url, title, width, height, thumb_width, thumb_height);
		}
	
	
        if (txt == ""){
            txt += "<div style='color:#444444;'>This folder is empty</div>";
        }
		
        $('#apollo_image_contents').html(txt);
        $('#apollo_image_contents').disableSelection();
        $('#apollo_image_contents').noContext();

        //$(".thumb").rightClick( function(e) {GalleriesFrame.onRightClickImage(e, this);});
				
        // Make draggable
        $(".thumb").draggable({
            revert: true,
            zIndex: 300
        });
		
		
    },

    // ////////////////////////////////////////////////////////////////////////////
	
    getImageHTML : function(post_id, thumb_url, title, width, height, thumb_width, thumb_height){

        var txt = "";
        //var ph = (60 - height - 8)/2;
		
        var titleText = title + " (" + width + "px by " + height + "px)";

        var onclick = "GalleriesFrame.onSelectImage('"+post_id+"')";
		
        txt += "<div class='thumbwrapper' align='center' onclick=\""+onclick+"\">";
        txt += "<img id='img_"+post_id+"' src='"+thumb_url+"' class='thumb' width='"+thumb_width+"px' height='"+thumb_height+"px' title='"+titleText+"'/>";
        txt += "</div>";
        return txt;
    },
        
    // ////////////////////////////////////////////////////////////////////////////

    /**
	* Handle an image being dropped on the remove box
	*/	
    onRemoveImage : function(event, ui){

        img_id = parseInt($(ui.draggable).attr('id').substring(7));
        prev_slot_id = $(ui.draggable).attr('slot');        
        //slot_id = parseInt($(this).attr('id').substring(5));
        GalleryAPI.onRemoveImage(DataStore.m_siteID,
					            DataStore.m_currentPageID,
					            img_id,
					            DataStore.m_currentGalleryNo,
					            prev_slot_id,
					            GalleriesFrame.m_themeParaID,
					            GalleriesFrame.onImageRemoved);
    },
        
    // ////////////////////////////////////////////////////////////////////////////
				
    /**
	* Handle an image being dropped on the gallery, or moved withing the gallery
	*/	
    onDrop : function(event, ui){
	
        //alert('GalleriesFrame.onDrop()');
		
        var slot_id = 0;
        var img_id = -1;
        var url = '';
        var image_moved = true;
        var prev_slot_id = -1;
				        
        if ($(ui.draggable).attr('id').substring(0,3) == 'gal'){

            // This is an existing image being moved!
            img_id = parseInt($(ui.draggable).attr('id').substring(7));
            slot_id = parseInt($(this).attr('id').substring(5));
            url = $('#galimg_'+img_id).attr('src');
            prev_slot_id = $(ui.draggable).attr('slot');
			
            GalleryAPI.onMoveImage( DataStore.m_siteID,
                DataStore.m_currentPageID,
                img_id,
                prev_slot_id,
                slot_id,
                DataStore.m_currentGalleryNo,
                DataStore.m_currentGalleryNo,
                GalleriesFrame.m_themeParaID,
                GalleriesFrame.onImageMoved);
        }
        else {

            // This is a new image being added
            image_moved = false;
            img_id = parseInt($(ui.draggable).attr('id').substring(4));
            slot_id = parseInt($(this).attr('id').substring(5));
            url = $('#img_'+img_id).attr('src');
			
            GalleryAPI.onAddImage(	DataStore.m_siteID,
                DataStore.m_currentPageID,
                img_id,
                slot_id,
                DataStore.m_currentGalleryNo,
                GalleriesFrame.m_themeParaID,
                GalleriesFrame.onImageAdded);
			
        }

    /*
		if (img_id == -1){
			alert('bad image id');
			return;
		}
*/								
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    onImageMoved : function(gallery_images, gallery_meta){
        // Add the new image to the data store
        DataStore.onGotGalleryData(gallery_images, gallery_meta);
        setTimeout("GalleriesFrame.paintGallerySlots()", 50);
//        GalleriesFrame.paintGallerySlots();
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    onImageAdded : function(gallery_images, gallery_meta){
        // Add the new image to the data store
        DataStore.onGotGalleryData(gallery_images, gallery_meta);
        setTimeout("GalleriesFrame.paintGallerySlots()", 50);
//        GalleriesFrame.paintGallerySlots();
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    onImageRemoved : function(slot_number){
        DataStore.removeGalleryImage(slot_number);
        setTimeout("GalleriesFrame.paintGallerySlots()", 50);        
        //GalleriesFrame.paintGallerySlots();
    }
}
