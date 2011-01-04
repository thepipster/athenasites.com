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
 * Settings Page functionality
 *
 * @author Mike Pritchard (mike@apollosites.com)
 * @since 3rd January, 2011
 */
var Settings = {

    // ////////////////////////////////////////////////////////////////////////

    init : function(siteID){
                
        $('#SettingsFrame').show();
                
        // Initialize the remote API's
        BlogAPI.init();
        MediaAPI.init();
        GalleryAPI.init();

        // Setup the data store for the site
        DataStore.init(siteID);

        // Setup classes...
        SettingsFrame.init();

        // Start loading data
        DataStore.load(Settings.onDataLoaded);
        
    },

    // ////////////////////////////////////////////////////////////////////////

    onDataLoaded : function(){
        SettingsFrame.repaint();
    }
	
    // ////////////////////////////////////////////////////////////////////////
}


/**
* Allows access to the remote (Ajax) Athena Blog API
* 
* @author Mike Pritchard (mike@apollosites.com)
* @since 11th September, 2010
*/
var BlogAPI = {
	
    /** Command url */
    m_url : '/code/php/remoteapi/BlogAPI.php',
							
    // ////////////////////////////////////////////////////////////////////////
	
    /**
    * Initialize the API
    */
    init : function(){
        BlogAPI.m_url = defines.root_url + BlogAPI.m_url;
    },

    // ////////////////////////////////////////////////////////////////////////
		
    /**
    * Get the list of folders and media for this site
    */
    addComment : function(siteID, postID, authorName, authorEmail, postURL, parentCommentID, commentContent, callback){
			
        var paras = {
            cmd : 'addComment',
            site_id: siteID,
            post_id: postID,
            name: authorName,
            email: authorEmail,
            post_url: postURL,
            content: commentContent,
            pid: parentCommentID
        };

        $.ajax({
            url: BlogAPI.m_url,
            dataType: "json",
            data: paras,
            success: function(ret){
                BlogAPI.onCommentAdded(ret, callback);
            }
        });
		
    },
			
    /**
    * Check the response from the server, and load data if login is good
    */
    onCommentAdded : function(ret, callback){
				
        if (ret.result == 'ok'){
            callback();
        }
        else {
            AthenaDialog.showAjaxError(ret);
        }
    },
    			
    // ////////////////////////////////////////////////////////////////////////

    /**
    * Get the list of folders and media for this site
    */
    getComments : function(siteID, postID, callback){
	
        AthenaDialog.showLoading("Loading comments");
		
        var paras = {
            cmd : 'getComments',
            site_id: siteID,
            post_id: postID
        };

        $.ajax({
            url: BlogAPI.m_url,
            dataType: "json",
            data: paras,
            success: function(ret){
                BlogAPI.onGotComments(ret, callback);
            }
        });
		
    },
			
    /**
    * Check the response from the server, and load data if login is good
    */
    onGotComments : function(ret, callback){
		
        AthenaDialog.clearLoading();
		
        if (ret.result == 'ok'){
            callback(ret.data.post_id, ret.data.comments);
        }
        else {
            AthenaDialog.showAjaxError(ret);
        }
    },

    // ////////////////////////////////////////////////////////////////////////

    /**
    * Get the list of folders and media for this site
    */
    getSummary : function(siteID, callback){

        AthenaDialog.showLoading("Loading comments");

        var paras = {cmd : 'getSummary', site_id: siteID};

        $.ajax({
            url: BlogAPI.m_url,
            dataType: "json",
            data: paras,
            success: function(ret){
                BlogAPI.onGotSummary(ret, callback);
            }
        });

    },

    /**
    * Check the response from the server, and load data if login is good
    */
    onGotSummary : function(ret, callback){

        AthenaDialog.clearLoading();

        if (ret.result == 'ok'){
            
            var data = new Object();

            data.comments_approved = ret.data.comments_approved;
            data.comments_pending = ret.data.comments_pending;
            data.comments_trash = ret.data.comments_trash;
            data.comments_spam = ret.data.comments_spam;
            data.posts_published = ret.data.posts_published;
            data.posts_private = ret.data.posts_private;
            data.posts_draft = ret.data.posts_draft;            
            data.categories = ret.data.categories;
            data.tags = ret.data.tags;
            data.no_followers = ret.data.no_followers;
            data.top_followers = ret.data.followers;

            callback(data);
        }
        else {
            AthenaDialog.showAjaxError(ret);
        }
    }
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
*/
var ImagePickerDialog = {

    folder_id : 0,
    imageSelectCallback : '',
    targetDiv : '',
	
    // ////////////////////////////////////////////////////////////////////////////
	
    /**
     *
     */
    show : function(targetDiv, imageSelectCallback){

        ImagePickerDialog.imageSelectCallback = imageSelectCallback;
        ImagePickerDialog.targetDiv = targetDiv;
		
        var imageList = DataStore.m_mediaList;
        var dialogTitle = 'Select an image';
        var minHeight = $(window).height()/2;
										
        var txt = "";
		
        txt += "<div class='ImagePicker'>";
        txt += "Folder: <select id='ImagePickerFolderSelect' onchange='ImagePickerDialog.onFolderSelected()'>";
        txt += "<option value='1'>Unassigned</option>";
        for (var i=0; i<DataStore.m_folderList.length; i++){
            txt += "<option value='"+DataStore.m_folderList[i].id+"'>"+DataStore.m_folderList[i].name+"</option>";
        }
        txt += "</select>";
        txt += "<div class='' style='height: 100%; width:100%; margin-top:10px' id='image_selector_content'></div>";
        txt += "</div>";

        $(targetDiv).html(txt);
		
        $(targetDiv).dialog( 'destroy' );
        $(targetDiv).dialog({
            modal: true,
            width:200+$(window).width()/2,
            height:130+minHeight,
            title: dialogTitle
        });
	
        ImagePickerDialog.paintImages();
		
        $(targetDiv).disableSelection();
	
    },

    // ////////////////////////////////////////////////////////////////////////////

    paintImages : function(){
	
        var imageList = DataStore.m_mediaList;
		
        var d = new Date();
        var localTime = d.getTime();
        var localOffset = d.getTimezoneOffset() * 60000;
        var utc_date = new Date(localTime + localOffset);
        var utc_time = localTime + localOffset;
				
        var txt = "";
		
        for (var i=0; i<imageList.length; i++){
			
            var thumb_url = imageList[i].thumb_url;
            var image_id = imageList[i].id;
            var title = imageList[i].title;
            var width = imageList[i].width;
            var height = imageList[i].height;
            var image_folder_id = parseInt(imageList[i].folder_id);
            var added_date = new Date(imageList[i].date_added);
            var hours_ago = (utc_time - added_date.getTime())/3600000;
						
            //alert(image_folder_id + " = " + ImagePickerDialog.folder_id);
						
            switch(ImagePickerDialog.folder_id){
			
                case ImageSelector.ID_UNASSIGNED:
                    if (image_folder_id == ImageSelector.ID_ALL || image_folder_id == ImageSelector.ID_UNASSIGNED)
                        txt += ImagePickerDialog.getImageHTML(image_id, thumb_url, title, width, height);
                    break;
					
                case ImageSelector.ID_LAST_1_HOUR:
                    if (hours_ago <= 1){
                        txt += ImagePickerDialog.getImageHTML(image_id, thumb_url, title, width, height);
                    }
                    break;

                case ImageSelector.ID_LAST_24_HOURS:
                    if (hours_ago <= 24){
                        txt += ImagePickerDialog.getImageHTML(image_id, thumb_url, title, width, height);
                    }
                    break;

                case ImageSelector.ID_LAST_7_DAYS:
                    if (hours_ago <= 168){
                        txt += ImagePickerDialog.getImageHTML(image_id, thumb_url, title, width, height);
                    }
                    break;

                case ImageSelector.ID_ALL:
                    txt += ImagePickerDialog.getImageHTML(image_id, thumb_url, title, width, height);
                    break;

                case image_folder_id:
                    txt += ImagePickerDialog.getImageHTML(image_id, thumb_url, title, width, height);
                    break;

                default:
            // Nothing to do
            }
			
        }
		
        $('#image_selector_content').html(txt);
				
    },
	
    // ////////////////////////////////////////////////////////////////////////////
	
    getImageHTML : function(image_id, thumb_url, title, width, height){

        var txt = "";

        var titleText = title + " (" + width + "px by " + height + "px)";
		
        //		txt += "   <img id='img_"+image_id+"' src='"+thumb_url+"' class='thumb' width='50px' title='"+titleText+"'/>";

        txt += "<div class='thumbwrapper' align='center' onclick=\"ImagePickerDialog.onSelectImage('"+image_id+"')\">";
        txt += "   <img id='img+"+image_id+"' src='"+thumb_url+"' class='thumb' width='50px'/>";
        txt += "   <div class='imageTitle'>" + title + "</div>";
        txt += "   <div class='imageSize'>(" + width + ", " + height + ")</div>";
        txt += "</div>";
		
						
        // onclick='ImageSelector.onSelectImage("+image_id+")'
        return txt;
    },
		
    // ////////////////////////////////////////////////////////////////////////////
		
    onFolderSelected : function(){
        ImagePickerDialog.folder_id = parseInt($('#ImagePickerFolderSelect').val());
        ImagePickerDialog.paintImages();
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    /**
	* Get the image list for the currently selected gallery page
	*/
    onSelectImage : function(imageID){
        if (ImagePickerDialog.imageSelectCallback != ''){
            ImagePickerDialog.imageSelectCallback(imageID);
        }
        $(ImagePickerDialog.targetDiv).dialog('close');
    }
}
/**
* Javascript class that allows a user to pick an image from their wordpress media library
* @see http://www.eyecon.ro/ColorPickerDialog
*/
var ColorPickerDialog = {
			
    m_callback : '',
			
    m_targetDiv : '',
			
    // ////////////////////////////////////////////////////////////////////////////
	
    /**
	*
	*/
    show : function(targetDiv, currentCol, callback){
	
        ColorPickerDialog.m_targetDiv = targetDiv;
        ColorPickerDialog.m_callback = callback;
		
        var txt = "<div id='apolloSelectColor'></div>";
        //txt += "<button class='colorSelectButton' onclick=\"ColorPickerDialog.onSelectColor()\">OK</button>";
						
        ColorPickerDialog.col = currentCol;
        
        $(targetDiv).dialog('destroy');
        $(targetDiv).html(txt);
        
        //jQuery(targetDiv).ColorPicker({color: currentCol, flat: true, onSubmit: ColorPickerDialog.onSelectColor(), onChange: function(hsb, hex, rgb, el) {ColorPickerDialog.col = hex;}});

        
        $(targetDiv).dialog({
            modal: true,
            width:385,
            height:235,
            resizable:false,
            title: 'Pick a color'
            });

        $('#apolloSelectColor').ColorPicker({
            color: currentCol,
            flat: true,
            onSubmit: function(hsb, hex, rgb, el) {
                ColorPickerDialog.onSelectColor(hex);
            }
        });
        
    },

    // ////////////////////////////////////////////////////////////////////////////

    /**
    * Get the image list for the currently selected gallery page
    */
    onSelectColor : function(col){

        if (ColorPickerDialog.m_callback != ''){
            ColorPickerDialog.m_callback(col);
        }

        $(ColorPickerDialog.m_targetDiv).dialog('close');

    }
	
		
}
/**
* Javascript class that allows a user to pick an image from their wordpress media library
* The image data is assumed to be in the class ImagePickerData see the fucntion 
* echoImagePickerJSImageData in plugin_functions.php
*
* @since 24th March, 2010
*/
var ImageSelector = {

	folder_id : 0,
	targetDiv : '',
	
	MODE_EDIT_GALLERY : 0,
	MODE_ORG_MEDIA : 1,
	
	mode : 1,
	
	ID_ALL : 0, // hard-coded folder id for all images
	ID_UNASSIGNED : 1, // hard-coded folder id for unassigned images
	ID_LAST_24_HOURS : 2, // hard-coded folder id for images uploaded in last 24 hrs
	ID_LAST_7_DAYS : 3, // hard-coded folder id for images uploaded in last 7 days
	ID_LAST_1_HOUR : 4, // hard-coded folder id for images uploaded in last 1 hrs
	
	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	*
	*/
	paint : function(mode, targetDiv){
	
		ImageSelector.mode = mode;
		ImageSelector.targetDiv = targetDiv;
		
		folder_name = "(All)";
		
		if (DataStore.m_folderList.length >= 1){
			ImageSelector.folder_id = DataStore.m_folderList[0].id;	
			folder_name = DataStore.m_folderList[0].folder_name;
		}
		
		var minHeight = 550;

		if (mode == ImageSelector.MODE_EDIT_GALLERY){
			minHeight = 300;
		}
		
		var txt = "";
		
		//txt += "<br/>";
		
		txt += "<table width='100%' cellspacing='0px' style='padding-right:20px'>";
		txt += "   <tr valign='middle'>";
		txt += "      <td width='65px'>";
		txt += "         <h2>Folders</h2>";
		txt += "      </td>";
		txt += "      <td align='left' style='padding-top:8px' width='185px'>";
		txt += "         <div class='nav_buttons'<div class='apollo_add_button' style='float:left' onclick='ImageSelector.addFolder()'></div>";
		txt += "      </td>";
		txt += "      <td style='padding-left:20px'>";

		if (mode == ImageSelector.MODE_EDIT_GALLERY){
			txt += "     <h2>Library Images<span id='apollo_title_folder_name'>"+folder_name+"</span><span id='apollo_title_feedback'></span></h2>";			
		}
		else {
			txt += "     <h2>Library Images<span id='apollo_title_folder_name'>"+folder_name+"</span>";
			txt += "         <span id='apollo_title_feedback'></span>";
			txt += "         <span class='view_options' onclick='ImageSelector.onDeselectAll()'>clear all</span>";
			txt += "         <span class='view_options' onclick='ImageSelector.onSelectAll()'>select all</span>";
			//txt += "         <span id='apollo_show_titles' class='view_options' onclick='ImageSelector.onShowDetails()'>show details</span>";
			txt += "     </h2>";			
		}
		
		txt += "      </td>";		
		txt += "   </tr>";
		
		txt += "   <tr valign='top'>";
		txt += "      <td colspan='2' width='250px' height='100%'>";
		txt += "         <div class='dialogbox' style='min-width: 100px; min-height:"+minHeight+"px' id='apollo_folder_list'></div>";
		txt += "      </td>";
		txt += "      <td style='padding-left:20px'>";
		txt += "         <div class='dialogbox' style='min-width: 200px; min-height:"+minHeight+"px' id='apollo_image_library'></div>";
		txt += "      </td>";		
		txt += "   </tr>";
		txt += "</table>";
				
		txt += "<div id='imageEditDialog'></div>";
		
						
		// Right click pop-up menu....
		txt += "<ul id='folderMenu' class='rightClickMenu'>";
		txt += "	<li class='edit'><a href='#edit'>Rename</a></li>";
		txt += "	<li class='delete'><a href='#delete'>Delete</a></li>";
		txt += "	<li class='quit separator'><a href='#quit'>Cancel</a></li>";
		txt += "</ul>";


		txt += "<ul id='imageMenu' class='rightClickMenu'>";
		txt += "	<li class='edit'><a href='#edit_image'>Edit Information</a></li>";
		//txt += "	<li class='delete'><a href='#delete_image'>Delete</a></li>";
		txt += "	<li class='quit separator'><a href='#quit'>Cancel</a></li>";
		txt += "</ul>";

							
		//$(targetDiv).attr('title',dialogTitle);					
		$(ImageSelector.targetDiv).html(txt);
		
		ImageSelector.paintFolders();		
		ImageSelector.paintImages();
		
		$(ImageSelector.targetDiv).disableSelection();
		$(ImageSelector.targetDiv).noContext();
		
		// Disable right click menu except where we want it
		//$(ImageSelector.targetDiv).bind("rightClickMenu",function(e){return false;}); 		
		
	},

	// ////////////////////////////////////////////////////////////////////////////

	onDeselectAll : function(){
		ImageSelector.paintImages();			
	},
	
	onSelectAll : function(){	
		ImageSelector.paintImages();			
		$('.thumb').addClass('multiselected');				
		setTimeout('ImageSelector.makeMultiSelectedDraggable()', 300);
	},

	// ////////////////////////////////////////////////////////////////////////////
	
	paintImages : function(){
		
		var imageList = DataStore.m_mediaList;
		
		var txt = "";

		var d = new Date();
		var localTime = d.getTime();
		var localOffset = d.getTimezoneOffset() * 60000;
		var utc_date = new Date(localTime + localOffset);
		var utc_time = localTime + localOffset;
								
		//alert(ImageSelector.folder_id + " " + ImageSelector.ID_LAST_24_HOURS);
				
		for (var i=0; i<imageList.length; i++){

			var thumb_url = imageList[i].thumb_url;
			var post_id = imageList[i].id;
			var title = imageList[i].title;
			var width = imageList[i].width;
			var height = imageList[i].height;
			var image_folder_id = parseInt(imageList[i].folder_id);
			var added_date = new Date(imageList[i].date_added);						
			var hours_ago = (utc_time - added_date.getTime())/3600000;
			
			//ImageSelector.showMessage(added_date + "  |||   " + utc_date + " Delta = " + hours_ago);
			//ImageSelector.showMessage(" Delta = " + hours_ago);
			
			switch(ImageSelector.folder_id){
			
				case ImageSelector.ID_UNASSIGNED:
					if (image_folder_id == ImageSelector.ID_ALL || image_folder_id == ImageSelector.ID_UNASSIGNED)
						txt += ImageSelector.getImageHTML(post_id, thumb_url, title, width, height);	
					break;
					
				case ImageSelector.ID_LAST_1_HOUR:
					if (hours_ago <= 1){
						txt += ImageSelector.getImageHTML(post_id, thumb_url, title, width, height);				
					}
					break;

				case ImageSelector.ID_LAST_24_HOURS:
					if (hours_ago <= 24){
						txt += ImageSelector.getImageHTML(post_id, thumb_url, title, width, height);				
					}
					break;

				case ImageSelector.ID_LAST_7_DAYS:
					if (hours_ago <= 168){
						txt += ImageSelector.getImageHTML(post_id, thumb_url, title, width, height);				
					}
					break;

				case ImageSelector.ID_ALL:
					txt += ImageSelector.getImageHTML(post_id, thumb_url, title, width, height);				
					break;	

				case image_folder_id:	
					txt += ImageSelector.getImageHTML(post_id, thumb_url, title, width, height);				
					break;	

				default:					
					// Nothing to do
			}
			
		}
				
		$('#apollo_image_library').html(txt);
		$('#apollo_image_library').noContext();

				
		if (ImageSelector.mode == ImageSelector.MODE_EDIT_GALLERY){
			$(".thumb").draggable({revert: true, zIndex: 300});				
		}
		else {

			//$(dragClass).multiDrag();
			

			$('.thumb').mousedown( function(e) {					
				
				var evt = e;					
				
				$(this).mouseup( 
					function() {
									
						//$(this).unbind('mousedown');
						$(this).unbind('mouseup');
						
						//alert("Ctrl:"+evt.ctrlKey + " Alt:" + evt.altKey + " Shift:" + evt.shiftKey);
						
						if (evt.ctrlKey){
							// Ctrl-left click
							ImageSelector.onAltClick(e, this);
						}
						else if( evt.button == 0 ) {
							if (evt.shiftKey){
								// Shift-left click
								ImageSelector.onShiftClick(e, this);
							}
							else if (evt.altKey){
								// Ctrl-left click
								ImageSelector.onAltClick(e, this);
							}
							else {
								// Just a left click
								ImageSelector.onStartClick(e, this);
							}
							return false;
						} 
						else if( evt.button == 2) {
							// Right click
							ImageSelector.onRightClickImage(e, this);
							return true;
						}
					}
				)
			});

		}		
		
	},

	// ////////////////////////////////////////////////////////////////////////////

	isDragging : false,
	shiftSelectStarted : false,
	shiftSelectStartedID : '',
	
	onStartClick : function(e, obj){
		
			var id = $(obj).attr('id');
			var isSelected = $(obj).is('.multiselected');
			
			if (ImageSelector.shiftSelectStarted){
				// This clears the current selection
				$('.multiselected').removeClass('multiselected');
			}
			
			//if (ImageSelector.isDragging) return;		
			if (isSelected){
				ImageSelector.shiftSelectStarted = false;
				ImageSelector.paintImages();	
			}
			else {
				ImageSelector.shiftSelectStartedID = id;
				ImageSelector.shiftSelectStarted = true;
				ImageSelector.paintImages();			
				$('#'+id).addClass('multiselected');
				setTimeout('ImageSelector.makeMultiSelectedDraggable()', 300);
			}
		

	},

	// ////////////////////////////////////////////////////////////////////////////
	
	onAltClick : function(e, obj){
							
		var id = $(obj).attr('id');
		var isSelected = $(obj).is('.multiselected');
			
		if (isSelected){
			$('#'+id).removeClass('multiselected');
			$('#'+id).draggable('destroy');
		}
		else {
			$('#'+id).addClass('multiselected');
			setTimeout('ImageSelector.makeMultiSelectedDraggable()', 300);
		}
		
		/*		
		if ($(obj).is('.multiselected')){
			$(obj).removeClass('multiselected');				
		}
		else {
			$(obj).addClass('multiselected');
		}
		*/
		
	},
		
	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	* Respond to a shift-click event
	*/
	onShiftClick : function(e, obj){
										
		var id = $(obj).attr('id');
			
	  	$('.thumb').removeClass('multiselected')
			
		if (ImageSelector.shiftSelectStarted){

			var foundStart = false;
			var foundEnd = false;
					
	  		$('.thumb').each(	
	  			function(){	  				
	  				if (!foundEnd){
		  				if ($(this).attr('id') == ImageSelector.shiftSelectStartedID){
		  					foundStart = true;
		  				}
		  				
		  				if (foundStart){
		  					$(this).addClass('multiselected');
		  				}
		  				
		  				if (foundStart && $(this).attr('id') == id){
		  					foundEnd = true;
		  				}
	  				}	  				
	  			}
	  		);
	  		
	  		// If we didn't find the end, try going backwards
	  		if (!foundEnd){
	  		
	  			$('.multiselected').removeClass('multiselected')
	  			
				foundStart = false;
				foundEnd = false;
	  		
		  		$('.thumb').each(	
		  			function(){	  				
		  				if (!foundEnd){
		  				
			  				if ($(this).attr('id') == id){
			  					foundStart = true;
			  				}
		  							  				
			  				if (foundStart){
			  					$(this).addClass('multiselected');
			  				}
			  				
			  				if ($(this).attr('id') == ImageSelector.shiftSelectStartedID){
			  					foundEnd = true;
			  				}
			  				
		  				}	  				
		  			}
		  		);
	  		}
		
//			ImageSelector.makeMultiSelectedDraggable();
			setTimeout('ImageSelector.makeMultiSelectedDraggable()', 300);
			
		}
		else {
			ImageSelector.onStartClick(e,obj);
		}

	},
					
	// ////////////////////////////////////////////////////////////////////////////

	/**
	* Respond to a shift/alt/ctrl-click event
	*/
	onCtrlClick : function(e, obj){
	
		//e.stopPropagation();
		//$(obj).unbind('click')
			/*		
		if ($(obj).is('.multiselected')){
			$(obj).removeClass('multiselected');				
			$(obj).draggable({revert: true, zIndex: 300});
		}
		else {
			$(obj).draggable("destroy");
			$(obj).addClass('multiselected');
			setTimeout('ImageSelector.makeMultiSelectedDraggable()', 300);
		}
		*/
	},
	
	// ////////////////////////////////////////////////////////////////////////////
				
	makeMultiSelectedDraggable : function(){
	
		$('.multiselected').draggable({		
				revert: true,
				zIndex: 300,
				delay: 200,				
			  	helper: function(){
			  		//return "<div>sdgsgsg</div>"			  		
			  		var txt = "<div id='multidrag_container'>";
			  		var ct = 0;
			  		
			  		$('.multiselected').each(	
			  			function(){
			  				if (ct < 20){
				  				var offset = ct * 5; ct++;
				  				var src = $(this).attr('src');
				  				var id = $(this).attr('id');
				  				var style = "position: absolute; top: " + offset + "px; left:" + offset + "px;";
				  				txt += "<img id='"+id+"' src='"+src+"' class='dragged_thumb' width='50px' height='50px' style='"+style+"'>";
			  				}
			  			}
			  		);
			  		
			  		txt += "</div>";
			  		
			  		return txt;
			  					  		
    				//var selected = $('.multiselected');
					//if (selected.length === 0) {
					//	selected = $(this);
					//}
					//var container = $('<div/>').attr('id', 'draggingContainer');
					//container.append(selected.clone());
					//return container;					 					
				}
			}
		);
	},
			
	// ////////////////////////////////////////////////////////////////////////////
	
	getImageHTML : function(post_id, thumb_url, title, width, height){

		var txt = "";

		var titleText = title + " (" + width + "px by " + height + "px)";
		txt += "   <img id='img_"+post_id+"' src='"+thumb_url+"' class='thumb' width='50px' title='"+titleText+"'/>";
						
		// onclick='ImageSelector.onSelectImage("+post_id+")'
		return txt;
	},

	// ////////////////////////////////////////////////////////////////////////////
	
	paintFolders : function(){
		
		var folderList = DataStore.m_folderList;
		
		var txt = "";
		
		// NOTE: Folder id's 0-9 are reserved for system folders, so can safely use these id's here
		
		// Hard-coded 'all' folder....		
		if (ImageSelector.folder_id == 0){
			txt += "<div id='folder_0' class='apollo_system_folder' style='width:100%;' onclick=\"ImageSelector.onSelectFolder('0')\"><div class='folder_name_selected'>Show All</div></div>";
			$('#apollo_title_folder_name').html('(All)');
		}
		else {
			txt += "<div id='folder_0' class='apollo_system_folder' style='width:100%;' onclick=\"ImageSelector.onSelectFolder('0')\"><div class='folder_name'>Show All</div></div>";
		}
		
		
		// Hard-coded 'unassigned' folder....		
		if (ImageSelector.folder_id == ImageSelector.ID_UNASSIGNED){
			txt += "<div id='folder_"+ImageSelector.ID_UNASSIGNED+"' class='apollo_folder apollo_system_folder' style='width:100%;' onclick=\"ImageSelector.onSelectFolder("+ImageSelector.ID_UNASSIGNED+")\"><div class='folder_name_selected'>Unassigned images</div></div>";
			$('#apollo_title_folder_name').html('(Unassigned images)');
		}
		else {
			txt += "<div id='folder_1' class='apollo_folder apollo_system_folder' style='width:100%;' onclick=\"ImageSelector.onSelectFolder("+ImageSelector.ID_UNASSIGNED+")\"><div class='folder_name'>Unassigned images</div></div>";
		}		

		// Hard-coded 'last hour' folder....		
		if (ImageSelector.folder_id == ImageSelector.ID_LAST_1_HOUR){
			txt += "<div id='folder_"+ImageSelector.ID_LAST_1_HOUR+"' class='apollo_system_folder' style='width:100%;' onclick=\"ImageSelector.onSelectFolder("+ImageSelector.ID_LAST_1_HOUR+")\"><div class='folder_name_selected'>Added in last hour</div></div>";
			$('#apollo_title_folder_name').html('(Added in last hour)');
		}
		else {
			txt += "<div id='folder_"+ImageSelector.ID_LAST_1_HOUR+"' class='apollo_system_folder' style='width:100%;' onclick=\"ImageSelector.onSelectFolder("+ImageSelector.ID_LAST_1_HOUR+")\"><div class='folder_name'>Added in last hour</div></div>";
		}	

		// Hard-coded 'added last 24 hours' folder....		
		if (ImageSelector.folder_id == ImageSelector.ID_LAST_24_HOURS){
			txt += "<div id='folder_"+ImageSelector.ID_LAST_24_HOURS+"' class='apollo_system_folder' style='width:100%;' onclick=\"ImageSelector.onSelectFolder("+ImageSelector.ID_LAST_24_HOURS+")\"><div class='folder_name_selected'>Added in last 24 hours</div></div>";
			$('#apollo_title_folder_name').html('(Added in last 24 hours)');
		}
		else {
			txt += "<div id='folder_"+ImageSelector.ID_LAST_24_HOURS+"' class='apollo_system_folder' style='width:100%;' onclick=\"ImageSelector.onSelectFolder("+ImageSelector.ID_LAST_24_HOURS+")\"><div class='folder_name'>Added in last 24 hours</div></div>";
		}		
		
		

		for (var i=0; i<folderList.length; i++){

			var folder_name = ApolloUtils.htmlEncode(folderList[i].name);
			var folder_id = folderList[i].id;
			
			//alert(folder_name + " " + folder_id);
			
			if (folder_id == ImageSelector.folder_id){
				$('#apollo_title_folder_name').html('('+folder_name+')');
				txt += "<div id='folder_"+folder_id+"' class='apollo_folder folder_with_menu' style='width:100%;' title='Right click to edit' onclick=\"ImageSelector.onSelectFolder('"+folder_id+"')\"><div class='folder_name folder_name_selected'>"+folder_name+"</div></div>";
			}
			else {
				txt += "<div id='folder_"+folder_id+"' class='apollo_folder folder_with_menu' style='width:100%;' title='Right click to edit' onclick=\"ImageSelector.onSelectFolder('"+folder_id+"')\"><div class='folder_name'>"+folder_name+"</div></div>";
			}

			
		}
		
		$('#apollo_folder_list').html(txt);
		
		$('.apollo_folder').droppable({
				drop: ImageSelector.onAddToFolder,
				over: function(ev, ui) {$(this).addClass( 'apollo_folder_droppable_hover' );},
				out: function(ev, ui) {$(this).removeClass( 'apollo_folder_droppable_hover' );}
			});			

				
	   // $(".folder_with_menu").rightClickMenu({menu: "folderMenu"}, function(action, el, pos){ImageSelector.onMenuItem(action, el)});
		if (ImageSelector.mode != ImageSelector.MODE_EDIT_GALLERY){
			$(".folder_with_menu").rightClick( function(e) {ImageSelector.onRightClickFolder(e, this);});
		}

		$("#apollo_folder_list").disableSelection();
				
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

		$('#folderMenu .edit').click(function(){ImageSelector.onMenuItem('rename_folder', obj)});
		$('#folderMenu .delete').click(function(){ImageSelector.onMenuItem('delete_folder', obj)});
		$('#folderMenu .quit').click(function(){ImageSelector.onMenuItem('quit', obj)});
		
	},
	
	onRightClickImage : function(e, obj){

		e.stopPropagation();

		//var x = e.pageX - $('#adminmenu').width() - 30;
		//var y = e.pageY - $('#wphead').height() - $('#update-nag').height();		
		var x = e.pageX;
		var y = e.pageY;		

		$('#imageMenu').css('top',y);
		$('#imageMenu').css('left',x);
		$('#imageMenu').show();

		$('#imageMenu .edit').unbind('click');
		$('#imageMenu .delete').unbind('click');
		$('#imageMenu .quit').unbind('click');
		
		$('#imageMenu .edit').click(function(){ImageSelector.onMenuItem('edit_image', obj)});
		$('#imageMenu .delete').click(function(){ImageSelector.onMenuItem('delete_image', obj)});
		$('#imageMenu .quit').click(function(){ImageSelector.onMenuItem('quit', obj)});
		
	},
		
	// ////////////////////////////////////////////////////////////////////////////

	messageTimeout : -1,
	
	showMessage : function(msg){
		$('#apollo_title_feedback').html(msg);
		$('#apollo_title_feedback').show();
		if (ImageSelector.messageTimeout != -1){
			clearTimeout(ImageSelector.messageTimeout)
		}
		setTimeout('ImageSelector.hideMessage()', 5000);
	},
	
	hideMessage : function(){
		$('#apollo_title_feedback').hide();
	},
	
	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	* Respond to the user selecting a menu item
	*/
	onMenuItem : function(item, selectedElement){
		
		$('#imageMenu').hide();
		$('#folderMenu').hide();
		
		
		var divID = $(selectedElement).attr('id');
		
		if (item == 'rename_folder' || item == 'delete_folder'){
			var name = $('#'+divID + ' .folder_name').html();
			var folder_id = parseInt(divID.substr(7));
		}
		else {
			var image_post_id = parseInt(divID.substr(4));
		}
		
		
		// Process events related to folders...					
		if (item == 'rename_folder'){
			ImageSelector.makeFolderNameEditable(folder_id);
		}
		else if (item == 'delete_folder'){		
			ApolloDialog.confirm("Are you sure you want to delete this folder? This can not be undone.", function(){ImageSelector.deleteFolder(folder_id);});
		}
		
		// Process events related to images...											
		else if (item == 'edit_image'){
			ImageEditDialog.show('#imageEditDialog', image_post_id);
		}
		else if (item == 'delete_image'){
			ApolloDialog.alert('feature coming soon');
		}
		
	},

	// ////////////////////////////////////////////////////////////////////////////

	makeFolderNameEditable : function(folder_id){
		
		var divID = '#folder_' + folder_id;
		var name = $(divID + ' .folder_name').html();
		
		$(divID).attr('onclick','');
		$(divID).html("<input id='folder_name_edit' style='margin-left:30px' type='text' value='"+name+"' onblur='ImageSelector.paintFolders()'/>");
		
		$("#folder_name_edit").keypress(function (e) {
			if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
				ImageSelector.renameFolder(folder_id, $("#folder_name_edit").val());
			}
	    });
		
		$("#folder_name_edit").focus();
	},
		
	// ////////////////////////////////////////////////////////////////////////////
		
	onSelectFolder : function(folder_id){
		ImageSelector.folder_id = parseInt(folder_id);
		ImageSelector.paintImages();
		ImageSelector.paintFolders();				
	},
			
	// ////////////////////////////////////////////////////////////////////////////

	deleteFolder : function(folderdId){
	
		var paras = {cmd: 14, folder_id: folderdId};
												
		$.ajax({
			url: ImagePickerData.commandURL,
			dataType: "text",
			data: paras,
			success: function(ret){ImageSelector.onFolderDeleted(ret, folderdId)}	
		});	
	},
	
	onFolderDeleted : function(res, folder_id){

		ImageSelector.showMessage("Folder deleted");
		
		var temp = new Array();
		
		for (var i=0; i<DataStore.m_folderList.length; i++){
		
			if (DataStore.m_folderList[i].id != folder_id){
				temp.push(DataStore.m_folderList[i]);
			}
			
		}

		DataStore.m_folderList = temp;
		ImageSelector.paintFolders()	
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	addFolder : function(folderName){

		if (folderName == undefined){
			folderName = 'new folder';
		}
		
		var paras = {cmd: 12, folder_name: folderName};
												
		$.ajax({
			url: ImagePickerData.commandURL,
			dataType: "json",
			data: paras,
			success: function(ret){ImageSelector.onAddedFolder(ret, folderName)}
		});	
	},
	
	onAddedFolder : function(msg, folderName){
		
		//eval("var msg = ("+ret+")");
						
		if (msg.result == "ok"){
			var folder_id = msg.folder_id;
			
			var temp = new Array();
			temp.id = folder_id;
			temp.name = folderName;
			DataStore.m_folderList.push(temp);
			ImageSelector.paintFolders();		
			ImageSelector.makeFolderNameEditable(folder_id);					
			
			ImageSelector.showMessage("Folder added");
			
		}					
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	getFolderName : function(folder_id){
	
		if (folder_id == ImageSelector.ID_UNASSIGNED){
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
		var paras = {cmd: 11, folder_id: folderId, folder_name: folderName};
												
		$.ajax({
			url: ImagePickerData.commandURL,
			dataType: "text",
			data: paras,
			success: function(ret){ImageSelector.onFolderRenamed(ret, folderId, folderName)}
		});	
	},
	
	onFolderRenamed : function(ret, folderId, folderName){

		for (var i=0; i<DataStore.m_folderList.length; i++){
			if (DataStore.m_folderList[i].id == folderId){
				DataStore.m_folderList[i].name = folderName;
				break;
			}
		}

		ImageSelector.paintFolders()
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

		// Check to see if there are images multi-selected, and whether this image
		// is one of them
		var imgList = new Array();
		var is_multiDrag = false;
		
  		$('.multiselected').each(	
  			function(){
				var multi_imgID = parseInt($(this).attr('id').substring(4));
				imgList.push(multi_imgID);	
				if (imgID == multi_imgID){
					is_multiDrag = true;
				}					
  			}
  		);		
		
		// Its possible that the user didn't drag a multi-selected image, so in that case
		// we want to ignore anything that is multi-selected
		if (!is_multiDrag){
			imgList = new Array();
			imgList[0] = imgID;
		}


		// Now assign all the images in the image list 
		for (var i=0; i<imgList.length; i++){
		
			var tempImgID = imgList[i];
			
			if (folderID == ImageSelector.ID_UNASSIGNED || folderID > 9){		
				
				//alert("Adding image: post_id: " + tempImgID + " folder_id: " + folderID);
				
				var paras = {cmd: 10, media_post_id: tempImgID, folder_id: folderID};
														
				$.ajax({
					url: ImagePickerData.commandURL,
					dataType: "json",
					data: paras,
					success: function(ret){ImageSelector.onAddedToFolder(ret)}
				});
			}	
		}

		//alert($(ui.draggable).html());
		//alert($(ui.draggable).attr('id'));
		
		$(this).removeClass( 'apollo_folder_droppable_hover' );
			
	},
	
	onAddedToFolder : function(msg){
								
		if (msg.result == "ok"){

			var imgID = msg.media_post_id;
			var folderID = msg.folder_id;
					
			for (var i=0; i<DataStore.m_mediaList.length; i++){
				
				if (DataStore.m_mediaList[i].post_id == imgID){
					DataStore.m_mediaList[i].folder_id = folderID;						
					break;
				}
			}
			
			ImageSelector.paintImages();

			if (folderID == 0){
				ImageSelector.showMessage("Image removed from folder");			
			}
			else {
				ImageSelector.showMessage("Image added to folder <i>" + ImageSelector.getFolderName(folderID) + "</i>");			
			}

			
		}
		else if(msg.result == 'duplicate'){
			ImageSelector.showMessage("Image already in folder  <i>" + ImageSelector.getFolderName(folderID) + "</i>");			
		}
		
	}
		
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
* Settings frame
* 
* @since 24th November, 2010
*/
var SettingsFrame = {

    // ////////////////////////////////////////////////////////////////////////////

	init : function(){
	},
	
    // ////////////////////////////////////////////////////////////////////////////

	repaint : function(){
		SettingsFrame.paintSiteParas();
		
        //$('#SettingsFrame').css('height','100%');	
        		
	},
	
    // ////////////////////////////////////////////////////////////////////////////
    
    paintSiteParas : function(){
        var txt = SettingsFrame.getThemeParasHTML('all', 0);
        if (txt != ""){
			//txt = "<p><strong>Custom Parameters</strong></p>" + txt;
	        $('#apollo_site_settings_custom_paras_2').html(txt);   	
        } 

        var txt = SettingsFrame.getThemeTextParasHTML('all', 0);
        if (txt != ""){
			//txt = "<p><strong>Custom Parameters</strong></p>" + txt;
	        $('#apollo_site_settings_custom_paras_1').html(txt);   	
        } 
        
		$('#apollo_site_settings_custom_paras_1 .customTextInput').typing({ stop: SettingsFrame.onSaveTextInputPara, delay: 400});
        
    },
    
    // ////////////////////////////////////////////////////////////////////////////

	/**
	* Launch a popup dialog that allows users to import blog posts from external sources,
	* such as Wordpress, LiveJournal etc.
	*/
    onPaintPostImporter : function(){

        var txt = "";

        txt += "<p>This tool allows you to import blog posts, comments and followers from other blogging engines.</p>";
        txt += "<p>To get started, click on the button below that corresponds to the blog you want to import from.</p>";
        txt += "<br/>";
        txt += "<div align='center'>";
        txt += "    <button class='basic_button' onclick='WordpressImporter.show()'>Wordpress</button>";
        txt += "    <button class='basic_button' onclick='BloggerImporter.show()'>Blogger</button>";
        txt += "    <button class='basic_button' onclick='LiveJournalImporter.show()'>LiveJournal</button>";
        txt += "</div>"
        txt += "<br/>";
        txt += "<p>If you need to import from a blog engine not listed above, email us at <a href='mailto:support@apollosites.com?subject=Feature request: New blog import&body=It would be really awesome if you supported imports from my old blog, which is at xxxxx'>support@apollosites.com</a> and we'll try to add that blogging engine to the list as soon as we can!</p>";

        //AthenaDialog.alert(txt, "Import Posts");


        $('#apollo_dialog').dialog("destroy");

        $('#apollo_dialog').html(txt);

        $('#apollo_dialog').dialog({
            resizable: false,
            width: 400,
            //	height:140,
            modal: true,
            title: "Import Posts",
            buttons: {
                Cancel: function() {
                    $(this).dialog('close');
                }
            }
        });

    },
        
    // ////////////////////////////////////////////////////////////////////////////

	/**
	* Update a text-input para
	*/
    onSaveTextInputPara : function(evt, obj){
        AthenaDialog.backgroundMessage("Saving new value");
    	var para_id = parseInt(obj.attr('id').substr(7));
    	//DataStore.updateSitePara(para_id, DataStore.m_currentPageID, obj.val());
        MediaAPI.setPagePara(para_id, obj.val(), 0, SettingsFrame.onTextInputParaSaved);
    },
        
    onTextInputParaSaved : function(theme_para_id, new_value, page_id){
    	// Update value in local store
        DataStore.updateSitePara(theme_para_id, page_id, new_value);
    },	
        
    // ////////////////////////////////////////////////////////////////////////////
        
    /**
     * Get the html for editing the theme paras for the given template name.
     * If you set the template name to 'All' it will return the global paras
     * @param string templateName
     */
    getThemeParasHTML : function(templateName){
        
        var theme_para_list = DataStore.getPageThemeParas(templateName);

        var txt = "";
        var noParas = 0;
	    var pageID = DataStore.m_currentPageID;	            
        
	    if (templateName == 'all') pageID = 0;

		//
		// Paint images....
		//
		
		txt += "<p><strong>Images</strong></p>";
		
        for (var i=0; i<theme_para_list.length; i++){

			var blogTxt = '';
			//if (theme_para_list[i].is_blog_para == 1) blogTxt = "<span class='blogParaIndicator'>(blog)</span>";
			
            var paraVal = DataStore.getSiteParaValue(pageID, theme_para_list[i].id);
            if (!paraVal) paraVal = "";

            switch(theme_para_list[i].para_type){

                case 'favicon':
                case 'image':
					
                    var onclick = "SettingsFrame.selectImagePara("+theme_para_list[i].id+")";
										
                    txt += "<table border='0'>";
                    txt += "<tr valign='top'>";
                    txt += "    <td width='40px'>";
                    var image_url = '/admin/images/blank.gif';
                    if (paraVal && paraVal != ''){
                        var image = DataStore.getImage(parseInt(paraVal));
                        if (image){
                            image_url = image.thumb_url
                        }
                    }
                    txt += "<img src='"+image_url+"' class='thumbBox' width='30px' height='30px' onclick=\""+onclick+"\" >";
                    txt += "    </td>";

                    txt += "    <td>";
                    txt += "        <span class='paraTitle'>"+theme_para_list[i].description+blogTxt+"</span>";
                    txt += "        <span class='paraDesc'>"+theme_para_list[i].help_text+"</span>";
                    //txt += "        <button class='save_button' onclick=\""+onclick+"\" style='font-size:10px'>Change</button>";
                    txt += "    </td>";
                    txt += "</tr>";
                    txt += "</table>";
					
                    noParas++;

                    break;
			}

        }

		//
		// Paint color pickers...
		//

		txt += "<p><strong>Colors</strong></p>";

        for (var i=0; i<theme_para_list.length; i++){
			
			var blogTxt = '';
			//if (theme_para_list[i].is_blog_para == 1) blogTxt = "<span class='blogParaIndicator'>(blog)</span>";
			
            var paraVal = DataStore.getSiteParaValue(pageID, theme_para_list[i].id);
            if (!paraVal) paraVal = "";

            switch(theme_para_list[i].para_type){
	
                case 'color':

                    var onclick = "SettingsFrame.selectColorPara("+theme_para_list[i].id+", '"+paraVal+"')";
	
					/*
                    txt += "<table border='0' width='100%'>";	                    
                    txt += "    <tr valign='top' width='100%'>";	                    
                    txt += "        <td colspan='2'><div class='paraTitle'>"+theme_para_list[i].description+"</div></td>";
                    txt += "    </tr>";	                    
                    txt += "    <tr valign='top'>";	                    
                    txt += "        <td width='40px'><div class='colorBox' style='background-color:#"+paraVal+";' onclick=\""+onclick+"\"></div></td>";
                    txt += "        <td><span class='paraDesc' style='width:95%;'>"+theme_para_list[i].help_text+"</span></td>";	                    
                    txt += "    </tr>";	                    
                    txt += "</table>";
                    */
                    
                    txt += "<table border='0'>";
                    txt += "<tr valign='top'>";
                    txt += "    <td width='40px'>";
                    txt += "        <div class='colorBox' style='background-color:#"+paraVal+";' onclick=\""+onclick+"\"></div>";
                    txt += "    </td>";	
                    txt += "    <td>";
                    txt += "        <span class='paraTitle'>"+theme_para_list[i].description+blogTxt+"</span>";
                    txt += "        <span class='paraDesc'>"+theme_para_list[i].help_text+"</span>";
                    txt += "    </td>";
                    txt += "</tr>";
                    txt += "</table>";
					
                    noParas++;

                    break;

            }

        }
		
        if (noParas > 0){            
            txt = "<table border='0' width='100%'>" + txt + "</table><br/>";
        }

        return txt;

    },
    
    // ////////////////////////////////////////////////////////////////////////////
        
    /**
     * Get the html for editing the theme paras for the given template name.
     * If you set the template name to 'All' it will return the global paras
     * @param string templateName
     */
    getThemeTextParasHTML : function(templateName){
        
        var theme_para_list = DataStore.getPageThemeParas(templateName);

        var txt = "";
        var noParas = 0;
	    var pageID = DataStore.m_currentPageID;	            
        
	    if (templateName == 'all') pageID = 0;

		//
		// Paint text and others...
		//

		txt += "<p><strong>Settings</strong></p>";

        for (var i=0; i<theme_para_list.length; i++){

			var blogTxt = '';
			//if (theme_para_list[i].is_blog_para == 1) blogTxt = "<span class='blogParaIndicator'>(blog)</span>";

            var paraVal = DataStore.getSiteParaValue(pageID, theme_para_list[i].id);
            if (!paraVal) paraVal = "";
            
            switch(theme_para_list[i].para_type){
	
                case 'email':
                    break;

                case 'text':
                	                	
                    txt += "<table border='0' style='width:100%'>";	                    
                    txt += "    <tr valign='top' rowspan='2' width='100%' style='width:100%'>";	                    
                    txt += "        <td rowspan='2' width='100px'><div class='paraTitle'>"+theme_para_list[i].description+blogTxt+"</div></td>";
                    txt += "        <td><input id='paraID_"+theme_para_list[i].id+"' value='"+paraVal+"' class='customTextInput' style='width:95%;'/></td>";
                    txt += "    </tr>";	                    
                    txt += "    <tr valign='top' width='100%' style='width:100%'>";	                    
                    txt += "        <td><span class='paraDesc' style='width:95%;'>"+theme_para_list[i].help_text+"</span></td>";	                    
                    txt += "    </tr>";	                    
                    txt += "</table>";
                    	 
                    noParas++;
                    	                
                    break;

                case 'small-int':
                    break;

                case 'font-family':
                    break;

                case 'font-size':
                    break;

                case 'multi-gallery':
                case 'gallery':
                    break;
            }

        }


        if (noParas > 0){            
            txt = "<table border='0' width='100%'>" + txt + "</table><br/>";
        }

        return txt;

    },
        
    // ////////////////////////////////////////////////////////////////////////////

    m_themeParaID : 0,
	
    selectColorPara : function(themeParaID, paraVal){
        SettingsFrame.m_themeParaID = themeParaID;
        ColorPickerDialog.show('#apollo_color_picker', paraVal, SettingsFrame.onParaSelected)
    },
	
    // ////////////////////////////////////////////////////////////////////////////
	
    selectImagePara : function(themeParaID){
        SettingsFrame.m_themeParaID = themeParaID;
        ImagePickerDialog.show('#apollo_image_picker', SettingsFrame.onParaSelected)
    },    
	
  	// ////////////////////////////////////////////////////////////////////////////

    onParaSelected : function(newParaVal){
        AthenaDialog.backgroundMessage("Saving new value");
        page_id = 0;
        MediaAPI.setPagePara(SettingsFrame.m_themeParaID, newParaVal, page_id, SettingsFrame.onPagesParaChanged);
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    onPagesParaChanged : function(theme_para_id, new_value, page_id){
                
        //location.href = location.href;
        DataStore.updateSitePara(theme_para_id, page_id, new_value);

        // Now repaint...
	    SettingsFrame.repaint();

    }	
}
