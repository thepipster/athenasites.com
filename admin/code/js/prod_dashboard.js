/**
 *
 * Color picker
 * Author: Stefan Petre www.eyecon.ro
 * 
 * Dual licensed under the MIT and GPL licenses
 * 
 */
(function ($) {
	var ColorPicker = function () {
		var
			ids = {},
			inAction,
			charMin = 65,
			visible,
			tpl = '<div class="colorpicker"><div class="colorpicker_color"><div><div></div></div></div><div class="colorpicker_hue"><div></div></div><div class="colorpicker_new_color"></div><div class="colorpicker_current_color"></div><div class="colorpicker_hex"><input type="text" maxlength="6" size="6" /></div><div class="colorpicker_rgb_r colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_rgb_g colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_rgb_b colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_h colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_s colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_b colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_submit"></div></div>',
			defaults = {
				eventName: 'click',
				onShow: function () {},
				onBeforeShow: function(){},
				onHide: function () {},
				onChange: function () {},
				onSubmit: function () {},
				color: 'ff0000',
				livePreview: true,
				flat: false
			},
			fillRGBFields = function  (hsb, cal) {
				var rgb = HSBToRGB(hsb);
				$(cal).data('colorpicker').fields
					.eq(1).val(rgb.r).end()
					.eq(2).val(rgb.g).end()
					.eq(3).val(rgb.b).end();
			},
			fillHSBFields = function  (hsb, cal) {
				$(cal).data('colorpicker').fields
					.eq(4).val(hsb.h).end()
					.eq(5).val(hsb.s).end()
					.eq(6).val(hsb.b).end();
			},
			fillHexFields = function (hsb, cal) {
				$(cal).data('colorpicker').fields
					.eq(0).val(HSBToHex(hsb)).end();
			},
			setSelector = function (hsb, cal) {
				$(cal).data('colorpicker').selector.css('backgroundColor', '#' + HSBToHex({h: hsb.h, s: 100, b: 100}));
				$(cal).data('colorpicker').selectorIndic.css({
					left: parseInt(150 * hsb.s/100, 10),
					top: parseInt(150 * (100-hsb.b)/100, 10)
				});
			},
			setHue = function (hsb, cal) {
				$(cal).data('colorpicker').hue.css('top', parseInt(150 - 150 * hsb.h/360, 10));
			},
			setCurrentColor = function (hsb, cal) {
				$(cal).data('colorpicker').currentColor.css('backgroundColor', '#' + HSBToHex(hsb));
			},
			setNewColor = function (hsb, cal) {
				$(cal).data('colorpicker').newColor.css('backgroundColor', '#' + HSBToHex(hsb));
			},
			keyDown = function (ev) {
				var pressedKey = ev.charCode || ev.keyCode || -1;
				if ((pressedKey > charMin && pressedKey <= 90) || pressedKey == 32) {
					return false;
				}
				var cal = $(this).parent().parent();
				if (cal.data('colorpicker').livePreview === true) {
					change.apply(this);
				}
			},
			change = function (ev) {
				var cal = $(this).parent().parent(), col;
				if (this.parentNode.className.indexOf('_hex') > 0) {
					cal.data('colorpicker').color = col = HexToHSB(fixHex(this.value));
				} else if (this.parentNode.className.indexOf('_hsb') > 0) {
					cal.data('colorpicker').color = col = fixHSB({
						h: parseInt(cal.data('colorpicker').fields.eq(4).val(), 10),
						s: parseInt(cal.data('colorpicker').fields.eq(5).val(), 10),
						b: parseInt(cal.data('colorpicker').fields.eq(6).val(), 10)
					});
				} else {
					cal.data('colorpicker').color = col = RGBToHSB(fixRGB({
						r: parseInt(cal.data('colorpicker').fields.eq(1).val(), 10),
						g: parseInt(cal.data('colorpicker').fields.eq(2).val(), 10),
						b: parseInt(cal.data('colorpicker').fields.eq(3).val(), 10)
					}));
				}
				if (ev) {
					fillRGBFields(col, cal.get(0));
					fillHexFields(col, cal.get(0));
					fillHSBFields(col, cal.get(0));
				}
				setSelector(col, cal.get(0));
				setHue(col, cal.get(0));
				setNewColor(col, cal.get(0));
				cal.data('colorpicker').onChange.apply(cal, [col, HSBToHex(col), HSBToRGB(col)]);
			},
			blur = function (ev) {
				var cal = $(this).parent().parent();
				cal.data('colorpicker').fields.parent().removeClass('colorpicker_focus');
			},
			focus = function () {
				charMin = this.parentNode.className.indexOf('_hex') > 0 ? 70 : 65;
				$(this).parent().parent().data('colorpicker').fields.parent().removeClass('colorpicker_focus');
				$(this).parent().addClass('colorpicker_focus');
			},
			downIncrement = function (ev) {
				var field = $(this).parent().find('input').focus();
				var current = {
					el: $(this).parent().addClass('colorpicker_slider'),
					max: this.parentNode.className.indexOf('_hsb_h') > 0 ? 360 : (this.parentNode.className.indexOf('_hsb') > 0 ? 100 : 255),
					y: ev.pageY,
					field: field,
					val: parseInt(field.val(), 10),
					preview: $(this).parent().parent().data('colorpicker').livePreview					
				};
				$(document).bind('mouseup', current, upIncrement);
				$(document).bind('mousemove', current, moveIncrement);
			},
			moveIncrement = function (ev) {
				ev.data.field.val(Math.max(0, Math.min(ev.data.max, parseInt(ev.data.val + ev.pageY - ev.data.y, 10))));
				if (ev.data.preview) {
					change.apply(ev.data.field.get(0), [true]);
				}
				return false;
			},
			upIncrement = function (ev) {
				change.apply(ev.data.field.get(0), [true]);
				ev.data.el.removeClass('colorpicker_slider').find('input').focus();
				$(document).unbind('mouseup', upIncrement);
				$(document).unbind('mousemove', moveIncrement);
				return false;
			},
			downHue = function (ev) {
				var current = {
					cal: $(this).parent(),
					y: $(this).offset().top
				};
				current.preview = current.cal.data('colorpicker').livePreview;
				$(document).bind('mouseup', current, upHue);
				$(document).bind('mousemove', current, moveHue);
			},
			moveHue = function (ev) {
				change.apply(
					ev.data.cal.data('colorpicker')
						.fields
						.eq(4)
						.val(parseInt(360*(150 - Math.max(0,Math.min(150,(ev.pageY - ev.data.y))))/150, 10))
						.get(0),
					[ev.data.preview]
				);
				return false;
			},
			upHue = function (ev) {
				fillRGBFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
				fillHexFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
				$(document).unbind('mouseup', upHue);
				$(document).unbind('mousemove', moveHue);
				return false;
			},
			downSelector = function (ev) {
				var current = {
					cal: $(this).parent(),
					pos: $(this).offset()
				};
				current.preview = current.cal.data('colorpicker').livePreview;
				$(document).bind('mouseup', current, upSelector);
				$(document).bind('mousemove', current, moveSelector);
			},
			moveSelector = function (ev) {
				change.apply(
					ev.data.cal.data('colorpicker')
						.fields
						.eq(6)
						.val(parseInt(100*(150 - Math.max(0,Math.min(150,(ev.pageY - ev.data.pos.top))))/150, 10))
						.end()
						.eq(5)
						.val(parseInt(100*(Math.max(0,Math.min(150,(ev.pageX - ev.data.pos.left))))/150, 10))
						.get(0),
					[ev.data.preview]
				);
				return false;
			},
			upSelector = function (ev) {
				fillRGBFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
				fillHexFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
				$(document).unbind('mouseup', upSelector);
				$(document).unbind('mousemove', moveSelector);
				return false;
			},
			enterSubmit = function (ev) {
				$(this).addClass('colorpicker_focus');
			},
			leaveSubmit = function (ev) {
				$(this).removeClass('colorpicker_focus');
			},
			clickSubmit = function (ev) {
				var cal = $(this).parent();
				var col = cal.data('colorpicker').color;
				cal.data('colorpicker').origColor = col;
				setCurrentColor(col, cal.get(0));
				cal.data('colorpicker').onSubmit(col, HSBToHex(col), HSBToRGB(col), cal.data('colorpicker').el);
			},
			show = function (ev) {
				var cal = $('#' + $(this).data('colorpickerId'));
				cal.data('colorpicker').onBeforeShow.apply(this, [cal.get(0)]);
				var pos = $(this).offset();
				var viewPort = getViewport();
				var top = pos.top + this.offsetHeight;
				var left = pos.left;
				if (top + 176 > viewPort.t + viewPort.h) {
					top -= this.offsetHeight + 176;
				}
				if (left + 356 > viewPort.l + viewPort.w) {
					left -= 356;
				}
				cal.css({left: left + 'px', top: top + 'px'});
				if (cal.data('colorpicker').onShow.apply(this, [cal.get(0)]) != false) {
					cal.show();
				}
				$(document).bind('mousedown', {cal: cal}, hide);
				return false;
			},
			hide = function (ev) {
				if (!isChildOf(ev.data.cal.get(0), ev.target, ev.data.cal.get(0))) {
					if (ev.data.cal.data('colorpicker').onHide.apply(this, [ev.data.cal.get(0)]) != false) {
						ev.data.cal.hide();
					}
					$(document).unbind('mousedown', hide);
				}
			},
			isChildOf = function(parentEl, el, container) {
				if (parentEl == el) {
					return true;
				}
				if (parentEl.contains) {
					return parentEl.contains(el);
				}
				if ( parentEl.compareDocumentPosition ) {
					return !!(parentEl.compareDocumentPosition(el) & 16);
				}
				var prEl = el.parentNode;
				while(prEl && prEl != container) {
					if (prEl == parentEl)
						return true;
					prEl = prEl.parentNode;
				}
				return false;
			},
			getViewport = function () {
				var m = document.compatMode == 'CSS1Compat';
				return {
					l : window.pageXOffset || (m ? document.documentElement.scrollLeft : document.body.scrollLeft),
					t : window.pageYOffset || (m ? document.documentElement.scrollTop : document.body.scrollTop),
					w : window.innerWidth || (m ? document.documentElement.clientWidth : document.body.clientWidth),
					h : window.innerHeight || (m ? document.documentElement.clientHeight : document.body.clientHeight)
				};
			},
			fixHSB = function (hsb) {
				return {
					h: Math.min(360, Math.max(0, hsb.h)),
					s: Math.min(100, Math.max(0, hsb.s)),
					b: Math.min(100, Math.max(0, hsb.b))
				};
			}, 
			fixRGB = function (rgb) {
				return {
					r: Math.min(255, Math.max(0, rgb.r)),
					g: Math.min(255, Math.max(0, rgb.g)),
					b: Math.min(255, Math.max(0, rgb.b))
				};
			},
			fixHex = function (hex) {
				var len = 6 - hex.length;
				if (len > 0) {
					var o = [];
					for (var i=0; i<len; i++) {
						o.push('0');
					}
					o.push(hex);
					hex = o.join('');
				}
				return hex;
			}, 
			HexToRGB = function (hex) {
				var hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
				return {r: hex >> 16, g: (hex & 0x00FF00) >> 8, b: (hex & 0x0000FF)};
			},
			HexToHSB = function (hex) {
				return RGBToHSB(HexToRGB(hex));
			},
			RGBToHSB = function (rgb) {
				var hsb = {
					h: 0,
					s: 0,
					b: 0
				};
				var min = Math.min(rgb.r, rgb.g, rgb.b);
				var max = Math.max(rgb.r, rgb.g, rgb.b);
				var delta = max - min;
				hsb.b = max;
				if (max != 0) {
					
				}
				hsb.s = max != 0 ? 255 * delta / max : 0;
				if (hsb.s != 0) {
					if (rgb.r == max) {
						hsb.h = (rgb.g - rgb.b) / delta;
					} else if (rgb.g == max) {
						hsb.h = 2 + (rgb.b - rgb.r) / delta;
					} else {
						hsb.h = 4 + (rgb.r - rgb.g) / delta;
					}
				} else {
					hsb.h = -1;
				}
				hsb.h *= 60;
				if (hsb.h < 0) {
					hsb.h += 360;
				}
				hsb.s *= 100/255;
				hsb.b *= 100/255;
				return hsb;
			},
			HSBToRGB = function (hsb) {
				var rgb = {};
				var h = Math.round(hsb.h);
				var s = Math.round(hsb.s*255/100);
				var v = Math.round(hsb.b*255/100);
				if(s == 0) {
					rgb.r = rgb.g = rgb.b = v;
				} else {
					var t1 = v;
					var t2 = (255-s)*v/255;
					var t3 = (t1-t2)*(h%60)/60;
					if(h==360) h = 0;
					if(h<60) {rgb.r=t1;	rgb.b=t2; rgb.g=t2+t3}
					else if(h<120) {rgb.g=t1; rgb.b=t2;	rgb.r=t1-t3}
					else if(h<180) {rgb.g=t1; rgb.r=t2;	rgb.b=t2+t3}
					else if(h<240) {rgb.b=t1; rgb.r=t2;	rgb.g=t1-t3}
					else if(h<300) {rgb.b=t1; rgb.g=t2;	rgb.r=t2+t3}
					else if(h<360) {rgb.r=t1; rgb.g=t2;	rgb.b=t1-t3}
					else {rgb.r=0; rgb.g=0;	rgb.b=0}
				}
				return {r:Math.round(rgb.r), g:Math.round(rgb.g), b:Math.round(rgb.b)};
			},
			RGBToHex = function (rgb) {
				var hex = [
					rgb.r.toString(16),
					rgb.g.toString(16),
					rgb.b.toString(16)
				];
				$.each(hex, function (nr, val) {
					if (val.length == 1) {
						hex[nr] = '0' + val;
					}
				});
				return hex.join('');
			},
			HSBToHex = function (hsb) {
				return RGBToHex(HSBToRGB(hsb));
			},
			restoreOriginal = function () {
				var cal = $(this).parent();
				var col = cal.data('colorpicker').origColor;
				cal.data('colorpicker').color = col;
				fillRGBFields(col, cal.get(0));
				fillHexFields(col, cal.get(0));
				fillHSBFields(col, cal.get(0));
				setSelector(col, cal.get(0));
				setHue(col, cal.get(0));
				setNewColor(col, cal.get(0));
			};
		return {
			init: function (opt) {
				opt = $.extend({}, defaults, opt||{});
				if (typeof opt.color == 'string') {
					opt.color = HexToHSB(opt.color);
				} else if (opt.color.r != undefined && opt.color.g != undefined && opt.color.b != undefined) {
					opt.color = RGBToHSB(opt.color);
				} else if (opt.color.h != undefined && opt.color.s != undefined && opt.color.b != undefined) {
					opt.color = fixHSB(opt.color);
				} else {
					return this;
				}
				return this.each(function () {
					if (!$(this).data('colorpickerId')) {
						var options = $.extend({}, opt);
						options.origColor = opt.color;
						var id = 'collorpicker_' + parseInt(Math.random() * 1000);
						$(this).data('colorpickerId', id);
						var cal = $(tpl).attr('id', id);
						if (options.flat) {
							cal.appendTo(this).show();
						} else {
							cal.appendTo(document.body);
						}
						options.fields = cal
											.find('input')
												.bind('keyup', keyDown)
												.bind('change', change)
												.bind('blur', blur)
												.bind('focus', focus);
						cal
							.find('span').bind('mousedown', downIncrement).end()
							.find('>div.colorpicker_current_color').bind('click', restoreOriginal);
						options.selector = cal.find('div.colorpicker_color').bind('mousedown', downSelector);
						options.selectorIndic = options.selector.find('div div');
						options.el = this;
						options.hue = cal.find('div.colorpicker_hue div');
						cal.find('div.colorpicker_hue').bind('mousedown', downHue);
						options.newColor = cal.find('div.colorpicker_new_color');
						options.currentColor = cal.find('div.colorpicker_current_color');
						cal.data('colorpicker', options);
						cal.find('div.colorpicker_submit')
							.bind('mouseenter', enterSubmit)
							.bind('mouseleave', leaveSubmit)
							.bind('click', clickSubmit);
						fillRGBFields(options.color, cal.get(0));
						fillHSBFields(options.color, cal.get(0));
						fillHexFields(options.color, cal.get(0));
						setHue(options.color, cal.get(0));
						setSelector(options.color, cal.get(0));
						setCurrentColor(options.color, cal.get(0));
						setNewColor(options.color, cal.get(0));
						if (options.flat) {
							cal.css({
								position: 'relative',
								display: 'block'
							});
						} else {
							$(this).bind(options.eventName, show);
						}
					}
				});
			},
			showPicker: function() {
				return this.each( function () {
					if ($(this).data('colorpickerId')) {
						show.apply(this);
					}
				});
			},
			hidePicker: function() {
				return this.each( function () {
					if ($(this).data('colorpickerId')) {
						$('#' + $(this).data('colorpickerId')).hide();
					}
				});
			},
			setColor: function(col) {
				if (typeof col == 'string') {
					col = HexToHSB(col);
				} else if (col.r != undefined && col.g != undefined && col.b != undefined) {
					col = RGBToHSB(col);
				} else if (col.h != undefined && col.s != undefined && col.b != undefined) {
					col = fixHSB(col);
				} else {
					return this;
				}
				return this.each(function(){
					if ($(this).data('colorpickerId')) {
						var cal = $('#' + $(this).data('colorpickerId'));
						cal.data('colorpicker').color = col;
						cal.data('colorpicker').origColor = col;
						fillRGBFields(col, cal.get(0));
						fillHSBFields(col, cal.get(0));
						fillHexFields(col, cal.get(0));
						setHue(col, cal.get(0));
						setSelector(col, cal.get(0));
						setCurrentColor(col, cal.get(0));
						setNewColor(col, cal.get(0));
					}
				});
			}
		};
	}();
	$.fn.extend({
		ColorPicker: ColorPicker.init,
		ColorPickerHide: ColorPicker.hidePicker,
		ColorPickerShow: ColorPicker.showPicker,
		ColorPickerSetColor: ColorPicker.setColor
	});
})(jQuery)
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

        // Initialize the remote API's
        SystemAPI.init();
        BlogAPI.init();
        MediaAPI.init();
        GalleryAPI.init();

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
/**
* Allows access to the remote (Ajax) Athena System API
* 
* @author Mike Pritchard (mike@apollosites.com)
* @since 27th, July 2010
*/
var SystemAPI = {
	
	/** Command url */
	m_url : '/code/php/remoteapi/SystemAPI.php',
							
	// ////////////////////////////////////////////////////////////////////////
	
	/**
	* Initialize the API
	*/
	init : function(){		
		SystemAPI.m_url = defines.root_url + SystemAPI.m_url;
	},
	
	// ////////////////////////////////////////////////////////////////////////
	
	logOut : function(callback){

		var paras = {cmd : 'logOut'};

		$.ajax({
			url: SystemAPI.m_url,
			dataType: "json",
			data: paras,
			success: function(ret){callback();}			
		});	
	},
		
	// ////////////////////////////////////////////////////////////////////////

	/**
	* Add a new user
	*/	
	/*
	addUser : function(email, pass, name, callback){
					
		// Add to server
		var paras = {cmd : 'createUser', em: email, ps: pass, nm: name};
		
		$.ajax({
			url: SystemAPI.m_url,
			dataType: "json",
			data: paras,
			success: function(ret){SystemAPI.onUserChecked(ret, callback);}
		});	
	},
	*/
	// ////////////////////////////////////////////////////////////////////////
	
	/**
	* Check to see if the user exists, if so then log that user in
	*/
	checkUser : function(email, pass, callback){
			
		var paras = {cmd : 'checkUser', em: email, ps: pass};

		$.ajax({
			url: SystemAPI.m_url,
			dataType: "json",
			data: paras,
			success: function(ret){SystemAPI.onUserChecked(ret, callback);}
		});			
		
	},
		
	// ////////////////////////////////////////////////////////////////////////
	
	/**
	* Check the response from the server, and load data if login is good
	*/
	onUserChecked : function(ret, callback){
				
		if (ret.result == 'ok'){	
			if (ret.data == 'true'){
				callback(true);
			}
			else {
				callback(false);
			}
		}
		else {
			AthenaDialog.showAjaxError(ret);
		}
	},
	
	// ////////////////////////////////////////////////////////////////////////
	
	/**
	* Get high level stats (number of pages, number of posts, number of users, number of comments for the
	* entire system!)
	*/	
	getStats : function(callback){
		
		var paras = {cmd : 'getStats'};

		$.ajax({
			url: SystemAPI.m_url,
			dataType: "json",
			success: function(ret){SystemAPI.onGotStats(ret, callback);},
			data: paras
		});
	},	
			
	onGotStats : function(ret, callback){

		// $msg = '{"result":"true", "us": "'.$no_users.'", "si": "'.$no_sites.'", "pg": "'.$no_pages.'", "po": "'.$no_posts.'"}';

        if (ret.result == 'ok'){
    		callback(ret.data.no_users, ret.data.no_sites, ret.data.no_pageviews);    	
	    }
		else {
			AthenaDialog.showAjaxError(ret);
		}
        
   	}	
   					
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
if(!document.createElement("canvas").getContext){(function(){var z=Math;var K=z.round;var J=z.sin;var U=z.cos;var b=z.abs;var k=z.sqrt;var D=10;var F=D/2;function T(){return this.context_||(this.context_=new W(this))}var O=Array.prototype.slice;function G(i,j,m){var Z=O.call(arguments,2);return function(){return i.apply(j,Z.concat(O.call(arguments)))}}function AD(Z){return String(Z).replace(/&/g,"&amp;").replace(/"/g,"&quot;")}function r(i){if(!i.namespaces.g_vml_){i.namespaces.add("g_vml_","urn:schemas-microsoft-com:vml","#default#VML")}if(!i.namespaces.g_o_){i.namespaces.add("g_o_","urn:schemas-microsoft-com:office:office","#default#VML")}if(!i.styleSheets.ex_canvas_){var Z=i.createStyleSheet();Z.owningElement.id="ex_canvas_";Z.cssText="canvas{display:inline-block;overflow:hidden;text-align:left;width:300px;height:150px}"}}r(document);var E={init:function(Z){if(/MSIE/.test(navigator.userAgent)&&!window.opera){var i=Z||document;i.createElement("canvas");i.attachEvent("onreadystatechange",G(this.init_,this,i))}},init_:function(m){var j=m.getElementsByTagName("canvas");for(var Z=0;Z<j.length;Z++){this.initElement(j[Z])}},initElement:function(i){if(!i.getContext){i.getContext=T;r(i.ownerDocument);i.innerHTML="";i.attachEvent("onpropertychange",S);i.attachEvent("onresize",w);var Z=i.attributes;if(Z.width&&Z.width.specified){i.style.width=Z.width.nodeValue+"px"}else{i.width=i.clientWidth}if(Z.height&&Z.height.specified){i.style.height=Z.height.nodeValue+"px"}else{i.height=i.clientHeight}}return i}};function S(i){var Z=i.srcElement;switch(i.propertyName){case"width":Z.getContext().clearRect();Z.style.width=Z.attributes.width.nodeValue+"px";Z.firstChild.style.width=Z.clientWidth+"px";break;case"height":Z.getContext().clearRect();Z.style.height=Z.attributes.height.nodeValue+"px";Z.firstChild.style.height=Z.clientHeight+"px";break}}function w(i){var Z=i.srcElement;if(Z.firstChild){Z.firstChild.style.width=Z.clientWidth+"px";Z.firstChild.style.height=Z.clientHeight+"px"}}E.init();var I=[];for(var AC=0;AC<16;AC++){for(var AB=0;AB<16;AB++){I[AC*16+AB]=AC.toString(16)+AB.toString(16)}}function V(){return[[1,0,0],[0,1,0],[0,0,1]]}function d(m,j){var i=V();for(var Z=0;Z<3;Z++){for(var AF=0;AF<3;AF++){var p=0;for(var AE=0;AE<3;AE++){p+=m[Z][AE]*j[AE][AF]}i[Z][AF]=p}}return i}function Q(i,Z){Z.fillStyle=i.fillStyle;Z.lineCap=i.lineCap;Z.lineJoin=i.lineJoin;Z.lineWidth=i.lineWidth;Z.miterLimit=i.miterLimit;Z.shadowBlur=i.shadowBlur;Z.shadowColor=i.shadowColor;Z.shadowOffsetX=i.shadowOffsetX;Z.shadowOffsetY=i.shadowOffsetY;Z.strokeStyle=i.strokeStyle;Z.globalAlpha=i.globalAlpha;Z.font=i.font;Z.textAlign=i.textAlign;Z.textBaseline=i.textBaseline;Z.arcScaleX_=i.arcScaleX_;Z.arcScaleY_=i.arcScaleY_;Z.lineScale_=i.lineScale_}var B={aliceblue:"#F0F8FF",antiquewhite:"#FAEBD7",aquamarine:"#7FFFD4",azure:"#F0FFFF",beige:"#F5F5DC",bisque:"#FFE4C4",black:"#000000",blanchedalmond:"#FFEBCD",blueviolet:"#8A2BE2",brown:"#A52A2A",burlywood:"#DEB887",cadetblue:"#5F9EA0",chartreuse:"#7FFF00",chocolate:"#D2691E",coral:"#FF7F50",cornflowerblue:"#6495ED",cornsilk:"#FFF8DC",crimson:"#DC143C",cyan:"#00FFFF",darkblue:"#00008B",darkcyan:"#008B8B",darkgoldenrod:"#B8860B",darkgray:"#A9A9A9",darkgreen:"#006400",darkgrey:"#A9A9A9",darkkhaki:"#BDB76B",darkmagenta:"#8B008B",darkolivegreen:"#556B2F",darkorange:"#FF8C00",darkorchid:"#9932CC",darkred:"#8B0000",darksalmon:"#E9967A",darkseagreen:"#8FBC8F",darkslateblue:"#483D8B",darkslategray:"#2F4F4F",darkslategrey:"#2F4F4F",darkturquoise:"#00CED1",darkviolet:"#9400D3",deeppink:"#FF1493",deepskyblue:"#00BFFF",dimgray:"#696969",dimgrey:"#696969",dodgerblue:"#1E90FF",firebrick:"#B22222",floralwhite:"#FFFAF0",forestgreen:"#228B22",gainsboro:"#DCDCDC",ghostwhite:"#F8F8FF",gold:"#FFD700",goldenrod:"#DAA520",grey:"#808080",greenyellow:"#ADFF2F",honeydew:"#F0FFF0",hotpink:"#FF69B4",indianred:"#CD5C5C",indigo:"#4B0082",ivory:"#FFFFF0",khaki:"#F0E68C",lavender:"#E6E6FA",lavenderblush:"#FFF0F5",lawngreen:"#7CFC00",lemonchiffon:"#FFFACD",lightblue:"#ADD8E6",lightcoral:"#F08080",lightcyan:"#E0FFFF",lightgoldenrodyellow:"#FAFAD2",lightgreen:"#90EE90",lightgrey:"#D3D3D3",lightpink:"#FFB6C1",lightsalmon:"#FFA07A",lightseagreen:"#20B2AA",lightskyblue:"#87CEFA",lightslategray:"#778899",lightslategrey:"#778899",lightsteelblue:"#B0C4DE",lightyellow:"#FFFFE0",limegreen:"#32CD32",linen:"#FAF0E6",magenta:"#FF00FF",mediumaquamarine:"#66CDAA",mediumblue:"#0000CD",mediumorchid:"#BA55D3",mediumpurple:"#9370DB",mediumseagreen:"#3CB371",mediumslateblue:"#7B68EE",mediumspringgreen:"#00FA9A",mediumturquoise:"#48D1CC",mediumvioletred:"#C71585",midnightblue:"#191970",mintcream:"#F5FFFA",mistyrose:"#FFE4E1",moccasin:"#FFE4B5",navajowhite:"#FFDEAD",oldlace:"#FDF5E6",olivedrab:"#6B8E23",orange:"#FFA500",orangered:"#FF4500",orchid:"#DA70D6",palegoldenrod:"#EEE8AA",palegreen:"#98FB98",paleturquoise:"#AFEEEE",palevioletred:"#DB7093",papayawhip:"#FFEFD5",peachpuff:"#FFDAB9",peru:"#CD853F",pink:"#FFC0CB",plum:"#DDA0DD",powderblue:"#B0E0E6",rosybrown:"#BC8F8F",royalblue:"#4169E1",saddlebrown:"#8B4513",salmon:"#FA8072",sandybrown:"#F4A460",seagreen:"#2E8B57",seashell:"#FFF5EE",sienna:"#A0522D",skyblue:"#87CEEB",slateblue:"#6A5ACD",slategray:"#708090",slategrey:"#708090",snow:"#FFFAFA",springgreen:"#00FF7F",steelblue:"#4682B4",tan:"#D2B48C",thistle:"#D8BFD8",tomato:"#FF6347",turquoise:"#40E0D0",violet:"#EE82EE",wheat:"#F5DEB3",whitesmoke:"#F5F5F5",yellowgreen:"#9ACD32"};function g(i){var m=i.indexOf("(",3);var Z=i.indexOf(")",m+1);var j=i.substring(m+1,Z).split(",");if(j.length==4&&i.substr(3,1)=="a"){alpha=Number(j[3])}else{j[3]=1}return j}function C(Z){return parseFloat(Z)/100}function N(i,j,Z){return Math.min(Z,Math.max(j,i))}function c(AF){var j,i,Z;h=parseFloat(AF[0])/360%360;if(h<0){h++}s=N(C(AF[1]),0,1);l=N(C(AF[2]),0,1);if(s==0){j=i=Z=l}else{var m=l<0.5?l*(1+s):l+s-l*s;var AE=2*l-m;j=A(AE,m,h+1/3);i=A(AE,m,h);Z=A(AE,m,h-1/3)}return"#"+I[Math.floor(j*255)]+I[Math.floor(i*255)]+I[Math.floor(Z*255)]}function A(i,Z,j){if(j<0){j++}if(j>1){j--}if(6*j<1){return i+(Z-i)*6*j}else{if(2*j<1){return Z}else{if(3*j<2){return i+(Z-i)*(2/3-j)*6}else{return i}}}}function Y(Z){var AE,p=1;Z=String(Z);if(Z.charAt(0)=="#"){AE=Z}else{if(/^rgb/.test(Z)){var m=g(Z);var AE="#",AF;for(var j=0;j<3;j++){if(m[j].indexOf("%")!=-1){AF=Math.floor(C(m[j])*255)}else{AF=Number(m[j])}AE+=I[N(AF,0,255)]}p=m[3]}else{if(/^hsl/.test(Z)){var m=g(Z);AE=c(m);p=m[3]}else{AE=B[Z]||Z}}}return{color:AE,alpha:p}}var L={style:"normal",variant:"normal",weight:"normal",size:10,family:"sans-serif"};var f={};function X(Z){if(f[Z]){return f[Z]}var m=document.createElement("div");var j=m.style;try{j.font=Z}catch(i){}return f[Z]={style:j.fontStyle||L.style,variant:j.fontVariant||L.variant,weight:j.fontWeight||L.weight,size:j.fontSize||L.size,family:j.fontFamily||L.family}}function P(j,i){var Z={};for(var AF in j){Z[AF]=j[AF]}var AE=parseFloat(i.currentStyle.fontSize),m=parseFloat(j.size);if(typeof j.size=="number"){Z.size=j.size}else{if(j.size.indexOf("px")!=-1){Z.size=m}else{if(j.size.indexOf("em")!=-1){Z.size=AE*m}else{if(j.size.indexOf("%")!=-1){Z.size=(AE/100)*m}else{if(j.size.indexOf("pt")!=-1){Z.size=m/0.75}else{Z.size=AE}}}}}Z.size*=0.981;return Z}function AA(Z){return Z.style+" "+Z.variant+" "+Z.weight+" "+Z.size+"px "+Z.family}function t(Z){switch(Z){case"butt":return"flat";case"round":return"round";case"square":default:return"square"}}function W(i){this.m_=V();this.mStack_=[];this.aStack_=[];this.currentPath_=[];this.strokeStyle="#000";this.fillStyle="#000";this.lineWidth=1;this.lineJoin="miter";this.lineCap="butt";this.miterLimit=D*1;this.globalAlpha=1;this.font="10px sans-serif";this.textAlign="left";this.textBaseline="alphabetic";this.canvas=i;var Z=i.ownerDocument.createElement("div");Z.style.width=i.clientWidth+"px";Z.style.height=i.clientHeight+"px";Z.style.overflow="hidden";Z.style.position="absolute";i.appendChild(Z);this.element_=Z;this.arcScaleX_=1;this.arcScaleY_=1;this.lineScale_=1}var M=W.prototype;M.clearRect=function(){if(this.textMeasureEl_){this.textMeasureEl_.removeNode(true);this.textMeasureEl_=null}this.element_.innerHTML=""};M.beginPath=function(){this.currentPath_=[]};M.moveTo=function(i,Z){var j=this.getCoords_(i,Z);this.currentPath_.push({type:"moveTo",x:j.x,y:j.y});this.currentX_=j.x;this.currentY_=j.y};M.lineTo=function(i,Z){var j=this.getCoords_(i,Z);this.currentPath_.push({type:"lineTo",x:j.x,y:j.y});this.currentX_=j.x;this.currentY_=j.y};M.bezierCurveTo=function(j,i,AI,AH,AG,AE){var Z=this.getCoords_(AG,AE);var AF=this.getCoords_(j,i);var m=this.getCoords_(AI,AH);e(this,AF,m,Z)};function e(Z,m,j,i){Z.currentPath_.push({type:"bezierCurveTo",cp1x:m.x,cp1y:m.y,cp2x:j.x,cp2y:j.y,x:i.x,y:i.y});Z.currentX_=i.x;Z.currentY_=i.y}M.quadraticCurveTo=function(AG,j,i,Z){var AF=this.getCoords_(AG,j);var AE=this.getCoords_(i,Z);var AH={x:this.currentX_+2/3*(AF.x-this.currentX_),y:this.currentY_+2/3*(AF.y-this.currentY_)};var m={x:AH.x+(AE.x-this.currentX_)/3,y:AH.y+(AE.y-this.currentY_)/3};e(this,AH,m,AE)};M.arc=function(AJ,AH,AI,AE,i,j){AI*=D;var AN=j?"at":"wa";var AK=AJ+U(AE)*AI-F;var AM=AH+J(AE)*AI-F;var Z=AJ+U(i)*AI-F;var AL=AH+J(i)*AI-F;if(AK==Z&&!j){AK+=0.125}var m=this.getCoords_(AJ,AH);var AG=this.getCoords_(AK,AM);var AF=this.getCoords_(Z,AL);this.currentPath_.push({type:AN,x:m.x,y:m.y,radius:AI,xStart:AG.x,yStart:AG.y,xEnd:AF.x,yEnd:AF.y})};M.rect=function(j,i,Z,m){this.moveTo(j,i);this.lineTo(j+Z,i);this.lineTo(j+Z,i+m);this.lineTo(j,i+m);this.closePath()};M.strokeRect=function(j,i,Z,m){var p=this.currentPath_;this.beginPath();this.moveTo(j,i);this.lineTo(j+Z,i);this.lineTo(j+Z,i+m);this.lineTo(j,i+m);this.closePath();this.stroke();this.currentPath_=p};M.fillRect=function(j,i,Z,m){var p=this.currentPath_;this.beginPath();this.moveTo(j,i);this.lineTo(j+Z,i);this.lineTo(j+Z,i+m);this.lineTo(j,i+m);this.closePath();this.fill();this.currentPath_=p};M.createLinearGradient=function(i,m,Z,j){var p=new v("gradient");p.x0_=i;p.y0_=m;p.x1_=Z;p.y1_=j;return p};M.createRadialGradient=function(m,AE,j,i,p,Z){var AF=new v("gradientradial");AF.x0_=m;AF.y0_=AE;AF.r0_=j;AF.x1_=i;AF.y1_=p;AF.r1_=Z;return AF};M.drawImage=function(AO,j){var AH,AF,AJ,AV,AM,AK,AQ,AX;var AI=AO.runtimeStyle.width;var AN=AO.runtimeStyle.height;AO.runtimeStyle.width="auto";AO.runtimeStyle.height="auto";var AG=AO.width;var AT=AO.height;AO.runtimeStyle.width=AI;AO.runtimeStyle.height=AN;if(arguments.length==3){AH=arguments[1];AF=arguments[2];AM=AK=0;AQ=AJ=AG;AX=AV=AT}else{if(arguments.length==5){AH=arguments[1];AF=arguments[2];AJ=arguments[3];AV=arguments[4];AM=AK=0;AQ=AG;AX=AT}else{if(arguments.length==9){AM=arguments[1];AK=arguments[2];AQ=arguments[3];AX=arguments[4];AH=arguments[5];AF=arguments[6];AJ=arguments[7];AV=arguments[8]}else{throw Error("Invalid number of arguments")}}}var AW=this.getCoords_(AH,AF);var m=AQ/2;var i=AX/2;var AU=[];var Z=10;var AE=10;AU.push(" <g_vml_:group",' coordsize="',D*Z,",",D*AE,'"',' coordorigin="0,0"',' style="width:',Z,"px;height:",AE,"px;position:absolute;");if(this.m_[0][0]!=1||this.m_[0][1]||this.m_[1][1]!=1||this.m_[1][0]){var p=[];p.push("M11=",this.m_[0][0],",","M12=",this.m_[1][0],",","M21=",this.m_[0][1],",","M22=",this.m_[1][1],",","Dx=",K(AW.x/D),",","Dy=",K(AW.y/D),"");var AS=AW;var AR=this.getCoords_(AH+AJ,AF);var AP=this.getCoords_(AH,AF+AV);var AL=this.getCoords_(AH+AJ,AF+AV);AS.x=z.max(AS.x,AR.x,AP.x,AL.x);AS.y=z.max(AS.y,AR.y,AP.y,AL.y);AU.push("padding:0 ",K(AS.x/D),"px ",K(AS.y/D),"px 0;filter:progid:DXImageTransform.Microsoft.Matrix(",p.join(""),", sizingmethod='clip');")}else{AU.push("top:",K(AW.y/D),"px;left:",K(AW.x/D),"px;")}AU.push(' ">','<g_vml_:image src="',AO.src,'"',' style="width:',D*AJ,"px;"," height:",D*AV,'px"',' cropleft="',AM/AG,'"',' croptop="',AK/AT,'"',' cropright="',(AG-AM-AQ)/AG,'"',' cropbottom="',(AT-AK-AX)/AT,'"'," />","</g_vml_:group>");this.element_.insertAdjacentHTML("BeforeEnd",AU.join(""))};M.stroke=function(AM){var m=10;var AN=10;var AE=5000;var AG={x:null,y:null};var AL={x:null,y:null};for(var AH=0;AH<this.currentPath_.length;AH+=AE){var AK=[];var AF=false;AK.push("<g_vml_:shape",' filled="',!!AM,'"',' style="position:absolute;width:',m,"px;height:",AN,'px;"',' coordorigin="0,0"',' coordsize="',D*m,",",D*AN,'"',' stroked="',!AM,'"',' path="');var AO=false;for(var AI=AH;AI<Math.min(AH+AE,this.currentPath_.length);AI++){if(AI%AE==0&&AI>0){AK.push(" m ",K(this.currentPath_[AI-1].x),",",K(this.currentPath_[AI-1].y))}var Z=this.currentPath_[AI];var AJ;switch(Z.type){case"moveTo":AJ=Z;AK.push(" m ",K(Z.x),",",K(Z.y));break;case"lineTo":AK.push(" l ",K(Z.x),",",K(Z.y));break;case"close":AK.push(" x ");Z=null;break;case"bezierCurveTo":AK.push(" c ",K(Z.cp1x),",",K(Z.cp1y),",",K(Z.cp2x),",",K(Z.cp2y),",",K(Z.x),",",K(Z.y));break;case"at":case"wa":AK.push(" ",Z.type," ",K(Z.x-this.arcScaleX_*Z.radius),",",K(Z.y-this.arcScaleY_*Z.radius)," ",K(Z.x+this.arcScaleX_*Z.radius),",",K(Z.y+this.arcScaleY_*Z.radius)," ",K(Z.xStart),",",K(Z.yStart)," ",K(Z.xEnd),",",K(Z.yEnd));break}if(Z){if(AG.x==null||Z.x<AG.x){AG.x=Z.x}if(AL.x==null||Z.x>AL.x){AL.x=Z.x}if(AG.y==null||Z.y<AG.y){AG.y=Z.y}if(AL.y==null||Z.y>AL.y){AL.y=Z.y}}}AK.push(' ">');if(!AM){R(this,AK)}else{a(this,AK,AG,AL)}AK.push("</g_vml_:shape>");this.element_.insertAdjacentHTML("beforeEnd",AK.join(""))}};function R(j,AE){var i=Y(j.strokeStyle);var m=i.color;var p=i.alpha*j.globalAlpha;var Z=j.lineScale_*j.lineWidth;if(Z<1){p*=Z}AE.push("<g_vml_:stroke",' opacity="',p,'"',' joinstyle="',j.lineJoin,'"',' miterlimit="',j.miterLimit,'"',' endcap="',t(j.lineCap),'"',' weight="',Z,'px"',' color="',m,'" />')}function a(AO,AG,Ah,AP){var AH=AO.fillStyle;var AY=AO.arcScaleX_;var AX=AO.arcScaleY_;var Z=AP.x-Ah.x;var m=AP.y-Ah.y;if(AH instanceof v){var AL=0;var Ac={x:0,y:0};var AU=0;var AK=1;if(AH.type_=="gradient"){var AJ=AH.x0_/AY;var j=AH.y0_/AX;var AI=AH.x1_/AY;var Aj=AH.y1_/AX;var Ag=AO.getCoords_(AJ,j);var Af=AO.getCoords_(AI,Aj);var AE=Af.x-Ag.x;var p=Af.y-Ag.y;AL=Math.atan2(AE,p)*180/Math.PI;if(AL<0){AL+=360}if(AL<0.000001){AL=0}}else{var Ag=AO.getCoords_(AH.x0_,AH.y0_);Ac={x:(Ag.x-Ah.x)/Z,y:(Ag.y-Ah.y)/m};Z/=AY*D;m/=AX*D;var Aa=z.max(Z,m);AU=2*AH.r0_/Aa;AK=2*AH.r1_/Aa-AU}var AS=AH.colors_;AS.sort(function(Ak,i){return Ak.offset-i.offset});var AN=AS.length;var AR=AS[0].color;var AQ=AS[AN-1].color;var AW=AS[0].alpha*AO.globalAlpha;var AV=AS[AN-1].alpha*AO.globalAlpha;var Ab=[];for(var Ae=0;Ae<AN;Ae++){var AM=AS[Ae];Ab.push(AM.offset*AK+AU+" "+AM.color)}AG.push('<g_vml_:fill type="',AH.type_,'"',' method="none" focus="100%"',' color="',AR,'"',' color2="',AQ,'"',' colors="',Ab.join(","),'"',' opacity="',AV,'"',' g_o_:opacity2="',AW,'"',' angle="',AL,'"',' focusposition="',Ac.x,",",Ac.y,'" />')}else{if(AH instanceof u){if(Z&&m){var AF=-Ah.x;var AZ=-Ah.y;AG.push("<g_vml_:fill",' position="',AF/Z*AY*AY,",",AZ/m*AX*AX,'"',' type="tile"',' src="',AH.src_,'" />')}}else{var Ai=Y(AO.fillStyle);var AT=Ai.color;var Ad=Ai.alpha*AO.globalAlpha;AG.push('<g_vml_:fill color="',AT,'" opacity="',Ad,'" />')}}}M.fill=function(){this.stroke(true)};M.closePath=function(){this.currentPath_.push({type:"close"})};M.getCoords_=function(j,i){var Z=this.m_;return{x:D*(j*Z[0][0]+i*Z[1][0]+Z[2][0])-F,y:D*(j*Z[0][1]+i*Z[1][1]+Z[2][1])-F}};M.save=function(){var Z={};Q(this,Z);this.aStack_.push(Z);this.mStack_.push(this.m_);this.m_=d(V(),this.m_)};M.restore=function(){if(this.aStack_.length){Q(this.aStack_.pop(),this);this.m_=this.mStack_.pop()}};function H(Z){return isFinite(Z[0][0])&&isFinite(Z[0][1])&&isFinite(Z[1][0])&&isFinite(Z[1][1])&&isFinite(Z[2][0])&&isFinite(Z[2][1])}function y(i,Z,j){if(!H(Z)){return }i.m_=Z;if(j){var p=Z[0][0]*Z[1][1]-Z[0][1]*Z[1][0];i.lineScale_=k(b(p))}}M.translate=function(j,i){var Z=[[1,0,0],[0,1,0],[j,i,1]];y(this,d(Z,this.m_),false)};M.rotate=function(i){var m=U(i);var j=J(i);var Z=[[m,j,0],[-j,m,0],[0,0,1]];y(this,d(Z,this.m_),false)};M.scale=function(j,i){this.arcScaleX_*=j;this.arcScaleY_*=i;var Z=[[j,0,0],[0,i,0],[0,0,1]];y(this,d(Z,this.m_),true)};M.transform=function(p,m,AF,AE,i,Z){var j=[[p,m,0],[AF,AE,0],[i,Z,1]];y(this,d(j,this.m_),true)};M.setTransform=function(AE,p,AG,AF,j,i){var Z=[[AE,p,0],[AG,AF,0],[j,i,1]];y(this,Z,true)};M.drawText_=function(AK,AI,AH,AN,AG){var AM=this.m_,AQ=1000,i=0,AP=AQ,AF={x:0,y:0},AE=[];var Z=P(X(this.font),this.element_);var j=AA(Z);var AR=this.element_.currentStyle;var p=this.textAlign.toLowerCase();switch(p){case"left":case"center":case"right":break;case"end":p=AR.direction=="ltr"?"right":"left";break;case"start":p=AR.direction=="rtl"?"right":"left";break;default:p="left"}switch(this.textBaseline){case"hanging":case"top":AF.y=Z.size/1.75;break;case"middle":break;default:case null:case"alphabetic":case"ideographic":case"bottom":AF.y=-Z.size/2.25;break}switch(p){case"right":i=AQ;AP=0.05;break;case"center":i=AP=AQ/2;break}var AO=this.getCoords_(AI+AF.x,AH+AF.y);AE.push('<g_vml_:line from="',-i,' 0" to="',AP,' 0.05" ',' coordsize="100 100" coordorigin="0 0"',' filled="',!AG,'" stroked="',!!AG,'" style="position:absolute;width:1px;height:1px;">');if(AG){R(this,AE)}else{a(this,AE,{x:-i,y:0},{x:AP,y:Z.size})}var AL=AM[0][0].toFixed(3)+","+AM[1][0].toFixed(3)+","+AM[0][1].toFixed(3)+","+AM[1][1].toFixed(3)+",0,0";var AJ=K(AO.x/D)+","+K(AO.y/D);AE.push('<g_vml_:skew on="t" matrix="',AL,'" ',' offset="',AJ,'" origin="',i,' 0" />','<g_vml_:path textpathok="true" />','<g_vml_:textpath on="true" string="',AD(AK),'" style="v-text-align:',p,";font:",AD(j),'" /></g_vml_:line>');this.element_.insertAdjacentHTML("beforeEnd",AE.join(""))};M.fillText=function(j,Z,m,i){this.drawText_(j,Z,m,i,false)};M.strokeText=function(j,Z,m,i){this.drawText_(j,Z,m,i,true)};M.measureText=function(j){if(!this.textMeasureEl_){var Z='<span style="position:absolute;top:-20000px;left:0;padding:0;margin:0;border:none;white-space:pre;"></span>';this.element_.insertAdjacentHTML("beforeEnd",Z);this.textMeasureEl_=this.element_.lastChild}var i=this.element_.ownerDocument;this.textMeasureEl_.innerHTML="";this.textMeasureEl_.style.font=this.font;this.textMeasureEl_.appendChild(i.createTextNode(j));return{width:this.textMeasureEl_.offsetWidth}};M.clip=function(){};M.arcTo=function(){};M.createPattern=function(i,Z){return new u(i,Z)};function v(Z){this.type_=Z;this.x0_=0;this.y0_=0;this.r0_=0;this.x1_=0;this.y1_=0;this.r1_=0;this.colors_=[]}v.prototype.addColorStop=function(i,Z){Z=Y(Z);this.colors_.push({offset:i,color:Z.color,alpha:Z.alpha})};function u(i,Z){q(i);switch(Z){case"repeat":case null:case"":this.repetition_="repeat";break;case"repeat-x":case"repeat-y":case"no-repeat":this.repetition_=Z;break;default:n("SYNTAX_ERR")}this.src_=i.src;this.width_=i.width;this.height_=i.height}function n(Z){throw new o(Z)}function q(Z){if(!Z||Z.nodeType!=1||Z.tagName!="IMG"){n("TYPE_MISMATCH_ERR")}if(Z.readyState!="complete"){n("INVALID_STATE_ERR")}}function o(Z){this.code=this[Z];this.message=Z+": DOM Exception "+this.code}var x=o.prototype=new Error;x.INDEX_SIZE_ERR=1;x.DOMSTRING_SIZE_ERR=2;x.HIERARCHY_REQUEST_ERR=3;x.WRONG_DOCUMENT_ERR=4;x.INVALID_CHARACTER_ERR=5;x.NO_DATA_ALLOWED_ERR=6;x.NO_MODIFICATION_ALLOWED_ERR=7;x.NOT_FOUND_ERR=8;x.NOT_SUPPORTED_ERR=9;x.INUSE_ATTRIBUTE_ERR=10;x.INVALID_STATE_ERR=11;x.SYNTAX_ERR=12;x.INVALID_MODIFICATION_ERR=13;x.NAMESPACE_ERR=14;x.INVALID_ACCESS_ERR=15;x.VALIDATION_ERR=16;x.TYPE_MISMATCH_ERR=17;G_vmlCanvasManager=E;CanvasRenderingContext2D=W;CanvasGradient=v;CanvasPattern=u;DOMException=o})()};
(function(){jQuery.color={};jQuery.color.make=function(G,H,J,I){var A={};A.r=G||0;A.g=H||0;A.b=J||0;A.a=I!=null?I:1;A.add=function(C,D){for(var E=0;E<C.length;++E){A[C.charAt(E)]+=D}return A.normalize()};A.scale=function(C,D){for(var E=0;E<C.length;++E){A[C.charAt(E)]*=D}return A.normalize()};A.toString=function(){if(A.a>=1){return"rgb("+[A.r,A.g,A.b].join(",")+")"}else{return"rgba("+[A.r,A.g,A.b,A.a].join(",")+")"}};A.normalize=function(){function C(E,D,F){return D<E?E:(D>F?F:D)}A.r=C(0,parseInt(A.r),255);A.g=C(0,parseInt(A.g),255);A.b=C(0,parseInt(A.b),255);A.a=C(0,A.a,1);return A};A.clone=function(){return jQuery.color.make(A.r,A.b,A.g,A.a)};return A.normalize()};jQuery.color.extract=function(E,F){var A;do{A=E.css(F).toLowerCase();if(A!=""&&A!="transparent"){break}E=E.parent()}while(!jQuery.nodeName(E.get(0),"body"));if(A=="rgba(0, 0, 0, 0)"){A="transparent"}return jQuery.color.parse(A)};jQuery.color.parse=function(A){var F,H=jQuery.color.make;if(F=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(A)){return H(parseInt(F[1],10),parseInt(F[2],10),parseInt(F[3],10))}if(F=/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(A)){return H(parseInt(F[1],10),parseInt(F[2],10),parseInt(F[3],10),parseFloat(F[4]))}if(F=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(A)){return H(parseFloat(F[1])*2.55,parseFloat(F[2])*2.55,parseFloat(F[3])*2.55)}if(F=/rgba\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(A)){return H(parseFloat(F[1])*2.55,parseFloat(F[2])*2.55,parseFloat(F[3])*2.55,parseFloat(F[4]))}if(F=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(A)){return H(parseInt(F[1],16),parseInt(F[2],16),parseInt(F[3],16))}if(F=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(A)){return H(parseInt(F[1]+F[1],16),parseInt(F[2]+F[2],16),parseInt(F[3]+F[3],16))}var G=jQuery.trim(A).toLowerCase();if(G=="transparent"){return H(255,255,255,0)}else{F=B[G];return H(F[0],F[1],F[2])}};var B={aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,0,0],blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],silver:[192,192,192],white:[255,255,255],yellow:[255,255,0]}})();(function(C){function B(l,W,X,E){var O=[],g={colors:["#edc240","#afd8f8","#cb4b4b","#4da74d","#9440ed"],legend:{show:true,noColumns:1,labelFormatter:null,labelBoxBorderColor:"#ccc",container:null,position:"ne",margin:5,backgroundColor:null,backgroundOpacity:0.85},xaxis:{mode:null,transform:null,inverseTransform:null,min:null,max:null,autoscaleMargin:null,ticks:null,tickFormatter:null,labelWidth:null,labelHeight:null,tickDecimals:null,tickSize:null,minTickSize:null,monthNames:null,timeformat:null,twelveHourClock:false},yaxis:{autoscaleMargin:0.02},x2axis:{autoscaleMargin:null},y2axis:{autoscaleMargin:0.02},series:{points:{show:false,radius:3,lineWidth:2,fill:true,fillColor:"#ffffff"},lines:{lineWidth:2,fill:false,fillColor:null,steps:false},bars:{show:false,lineWidth:2,barWidth:1,fill:true,fillColor:null,align:"left",horizontal:false},shadowSize:3},grid:{show:true,aboveData:false,color:"#545454",backgroundColor:null,tickColor:"rgba(0,0,0,0.15)",labelMargin:5,borderWidth:2,borderColor:null,markings:null,markingsColor:"#f4f4f4",markingsLineWidth:2,clickable:false,hoverable:false,autoHighlight:true,mouseActiveRadius:10},hooks:{}},P=null,AC=null,AD=null,Y=null,AJ=null,s={xaxis:{},yaxis:{},x2axis:{},y2axis:{}},e={left:0,right:0,top:0,bottom:0},y=0,Q=0,I=0,t=0,L={processOptions:[],processRawData:[],processDatapoints:[],draw:[],bindEvents:[],drawOverlay:[]},G=this;G.setData=f;G.setupGrid=k;G.draw=AH;G.getPlaceholder=function(){return l};G.getCanvas=function(){return P};G.getPlotOffset=function(){return e};G.width=function(){return I};G.height=function(){return t};G.offset=function(){var AK=AD.offset();AK.left+=e.left;AK.top+=e.top;return AK};G.getData=function(){return O};G.getAxes=function(){return s};G.getOptions=function(){return g};G.highlight=AE;G.unhighlight=x;G.triggerRedrawOverlay=q;G.pointOffset=function(AK){return{left:parseInt(T(AK,"xaxis").p2c(+AK.x)+e.left),top:parseInt(T(AK,"yaxis").p2c(+AK.y)+e.top)}};G.hooks=L;b(G);r(X);c();f(W);k();AH();AG();function Z(AM,AK){AK=[G].concat(AK);for(var AL=0;AL<AM.length;++AL){AM[AL].apply(this,AK)}}function b(){for(var AK=0;AK<E.length;++AK){var AL=E[AK];AL.init(G);if(AL.options){C.extend(true,g,AL.options)}}}function r(AK){C.extend(true,g,AK);if(g.grid.borderColor==null){g.grid.borderColor=g.grid.color}if(g.xaxis.noTicks&&g.xaxis.ticks==null){g.xaxis.ticks=g.xaxis.noTicks}if(g.yaxis.noTicks&&g.yaxis.ticks==null){g.yaxis.ticks=g.yaxis.noTicks}if(g.grid.coloredAreas){g.grid.markings=g.grid.coloredAreas}if(g.grid.coloredAreasColor){g.grid.markingsColor=g.grid.coloredAreasColor}if(g.lines){C.extend(true,g.series.lines,g.lines)}if(g.points){C.extend(true,g.series.points,g.points)}if(g.bars){C.extend(true,g.series.bars,g.bars)}if(g.shadowSize){g.series.shadowSize=g.shadowSize}for(var AL in L){if(g.hooks[AL]&&g.hooks[AL].length){L[AL]=L[AL].concat(g.hooks[AL])}}Z(L.processOptions,[g])}function f(AK){O=M(AK);U();m()}function M(AN){var AL=[];for(var AK=0;AK<AN.length;++AK){var AM=C.extend(true,{},g.series);if(AN[AK].data){AM.data=AN[AK].data;delete AN[AK].data;C.extend(true,AM,AN[AK]);AN[AK].data=AM.data}else{AM.data=AN[AK]}AL.push(AM)}return AL}function T(AM,AK){var AL=AM[AK];if(!AL||AL==1){return s[AK]}if(typeof AL=="number"){return s[AK.charAt(0)+AL+AK.slice(1)]}return AL}function U(){var AP;var AV=O.length,AK=[],AN=[];for(AP=0;AP<O.length;++AP){var AS=O[AP].color;if(AS!=null){--AV;if(typeof AS=="number"){AN.push(AS)}else{AK.push(C.color.parse(O[AP].color))}}}for(AP=0;AP<AN.length;++AP){AV=Math.max(AV,AN[AP]+1)}var AL=[],AO=0;AP=0;while(AL.length<AV){var AR;if(g.colors.length==AP){AR=C.color.make(100,100,100)}else{AR=C.color.parse(g.colors[AP])}var AM=AO%2==1?-1:1;AR.scale("rgb",1+AM*Math.ceil(AO/2)*0.2);AL.push(AR);++AP;if(AP>=g.colors.length){AP=0;++AO}}var AQ=0,AW;for(AP=0;AP<O.length;++AP){AW=O[AP];if(AW.color==null){AW.color=AL[AQ].toString();++AQ}else{if(typeof AW.color=="number"){AW.color=AL[AW.color].toString()}}if(AW.lines.show==null){var AU,AT=true;for(AU in AW){if(AW[AU].show){AT=false;break}}if(AT){AW.lines.show=true}}AW.xaxis=T(AW,"xaxis");AW.yaxis=T(AW,"yaxis")}}function m(){var AW=Number.POSITIVE_INFINITY,AQ=Number.NEGATIVE_INFINITY,Ac,Aa,AZ,AV,AL,AR,Ab,AX,AP,AO,AK,Ai,Af,AT;for(AK in s){s[AK].datamin=AW;s[AK].datamax=AQ;s[AK].used=false}function AN(Al,Ak,Aj){if(Ak<Al.datamin){Al.datamin=Ak}if(Aj>Al.datamax){Al.datamax=Aj}}for(Ac=0;Ac<O.length;++Ac){AR=O[Ac];AR.datapoints={points:[]};Z(L.processRawData,[AR,AR.data,AR.datapoints])}for(Ac=0;Ac<O.length;++Ac){AR=O[Ac];var Ah=AR.data,Ae=AR.datapoints.format;if(!Ae){Ae=[];Ae.push({x:true,number:true,required:true});Ae.push({y:true,number:true,required:true});if(AR.bars.show){Ae.push({y:true,number:true,required:false,defaultValue:0})}AR.datapoints.format=Ae}if(AR.datapoints.pointsize!=null){continue}if(AR.datapoints.pointsize==null){AR.datapoints.pointsize=Ae.length}AX=AR.datapoints.pointsize;Ab=AR.datapoints.points;insertSteps=AR.lines.show&&AR.lines.steps;AR.xaxis.used=AR.yaxis.used=true;for(Aa=AZ=0;Aa<Ah.length;++Aa,AZ+=AX){AT=Ah[Aa];var AM=AT==null;if(!AM){for(AV=0;AV<AX;++AV){Ai=AT[AV];Af=Ae[AV];if(Af){if(Af.number&&Ai!=null){Ai=+Ai;if(isNaN(Ai)){Ai=null}}if(Ai==null){if(Af.required){AM=true}if(Af.defaultValue!=null){Ai=Af.defaultValue}}}Ab[AZ+AV]=Ai}}if(AM){for(AV=0;AV<AX;++AV){Ai=Ab[AZ+AV];if(Ai!=null){Af=Ae[AV];if(Af.x){AN(AR.xaxis,Ai,Ai)}if(Af.y){AN(AR.yaxis,Ai,Ai)}}Ab[AZ+AV]=null}}else{if(insertSteps&&AZ>0&&Ab[AZ-AX]!=null&&Ab[AZ-AX]!=Ab[AZ]&&Ab[AZ-AX+1]!=Ab[AZ+1]){for(AV=0;AV<AX;++AV){Ab[AZ+AX+AV]=Ab[AZ+AV]}Ab[AZ+1]=Ab[AZ-AX+1];AZ+=AX}}}}for(Ac=0;Ac<O.length;++Ac){AR=O[Ac];Z(L.processDatapoints,[AR,AR.datapoints])}for(Ac=0;Ac<O.length;++Ac){AR=O[Ac];Ab=AR.datapoints.points,AX=AR.datapoints.pointsize;var AS=AW,AY=AW,AU=AQ,Ad=AQ;for(Aa=0;Aa<Ab.length;Aa+=AX){if(Ab[Aa]==null){continue}for(AV=0;AV<AX;++AV){Ai=Ab[Aa+AV];Af=Ae[AV];if(!Af){continue}if(Af.x){if(Ai<AS){AS=Ai}if(Ai>AU){AU=Ai}}if(Af.y){if(Ai<AY){AY=Ai}if(Ai>Ad){Ad=Ai}}}}if(AR.bars.show){var Ag=AR.bars.align=="left"?0:-AR.bars.barWidth/2;if(AR.bars.horizontal){AY+=Ag;Ad+=Ag+AR.bars.barWidth}else{AS+=Ag;AU+=Ag+AR.bars.barWidth}}AN(AR.xaxis,AS,AU);AN(AR.yaxis,AY,Ad)}for(AK in s){if(s[AK].datamin==AW){s[AK].datamin=null}if(s[AK].datamax==AQ){s[AK].datamax=null}}}function c(){function AK(AM,AL){var AN=document.createElement("canvas");AN.width=AM;AN.height=AL;if(C.browser.msie){AN=window.G_vmlCanvasManager.initElement(AN)}return AN}y=l.width();Q=l.height();l.html("");if(l.css("position")=="static"){l.css("position","relative")}if(y<=0||Q<=0){throw"Invalid dimensions for plot, width = "+y+", height = "+Q}if(C.browser.msie){window.G_vmlCanvasManager.init_(document)}P=C(AK(y,Q)).appendTo(l).get(0);Y=P.getContext("2d");AC=C(AK(y,Q)).css({position:"absolute",left:0,top:0}).appendTo(l).get(0);AJ=AC.getContext("2d");AJ.stroke()}function AG(){AD=C([AC,P]);if(g.grid.hoverable){AD.mousemove(D)}if(g.grid.clickable){AD.click(d)}Z(L.bindEvents,[AD])}function k(){function AL(AT,AU){function AP(AV){return AV}var AS,AO,AQ=AU.transform||AP,AR=AU.inverseTransform;if(AT==s.xaxis||AT==s.x2axis){AS=AT.scale=I/(AQ(AT.max)-AQ(AT.min));AO=AQ(AT.min);if(AQ==AP){AT.p2c=function(AV){return(AV-AO)*AS}}else{AT.p2c=function(AV){return(AQ(AV)-AO)*AS}}if(!AR){AT.c2p=function(AV){return AO+AV/AS}}else{AT.c2p=function(AV){return AR(AO+AV/AS)}}}else{AS=AT.scale=t/(AQ(AT.max)-AQ(AT.min));AO=AQ(AT.max);if(AQ==AP){AT.p2c=function(AV){return(AO-AV)*AS}}else{AT.p2c=function(AV){return(AO-AQ(AV))*AS}}if(!AR){AT.c2p=function(AV){return AO-AV/AS}}else{AT.c2p=function(AV){return AR(AO-AV/AS)}}}}function AN(AR,AT){var AQ,AS=[],AP;AR.labelWidth=AT.labelWidth;AR.labelHeight=AT.labelHeight;if(AR==s.xaxis||AR==s.x2axis){if(AR.labelWidth==null){AR.labelWidth=y/(AR.ticks.length>0?AR.ticks.length:1)}if(AR.labelHeight==null){AS=[];for(AQ=0;AQ<AR.ticks.length;++AQ){AP=AR.ticks[AQ].label;if(AP){AS.push('<div class="tickLabel" style="float:left;width:'+AR.labelWidth+'px">'+AP+"</div>")}}if(AS.length>0){var AO=C('<div style="position:absolute;top:-10000px;width:10000px;font-size:smaller">'+AS.join("")+'<div style="clear:left"></div></div>').appendTo(l);AR.labelHeight=AO.height();AO.remove()}}}else{if(AR.labelWidth==null||AR.labelHeight==null){for(AQ=0;AQ<AR.ticks.length;++AQ){AP=AR.ticks[AQ].label;if(AP){AS.push('<div class="tickLabel">'+AP+"</div>")}}if(AS.length>0){var AO=C('<div style="position:absolute;top:-10000px;font-size:smaller">'+AS.join("")+"</div>").appendTo(l);if(AR.labelWidth==null){AR.labelWidth=AO.width()}if(AR.labelHeight==null){AR.labelHeight=AO.find("div").height()}AO.remove()}}}if(AR.labelWidth==null){AR.labelWidth=0}if(AR.labelHeight==null){AR.labelHeight=0}}function AM(){var AP=g.grid.borderWidth;for(i=0;i<O.length;++i){AP=Math.max(AP,2*(O[i].points.radius+O[i].points.lineWidth/2))}e.left=e.right=e.top=e.bottom=AP;var AO=g.grid.labelMargin+g.grid.borderWidth;if(s.xaxis.labelHeight>0){e.bottom=Math.max(AP,s.xaxis.labelHeight+AO)}if(s.yaxis.labelWidth>0){e.left=Math.max(AP,s.yaxis.labelWidth+AO)}if(s.x2axis.labelHeight>0){e.top=Math.max(AP,s.x2axis.labelHeight+AO)}if(s.y2axis.labelWidth>0){e.right=Math.max(AP,s.y2axis.labelWidth+AO)}I=y-e.left-e.right;t=Q-e.bottom-e.top}var AK;for(AK in s){K(s[AK],g[AK])}if(g.grid.show){for(AK in s){F(s[AK],g[AK]);p(s[AK],g[AK]);AN(s[AK],g[AK])}AM()}else{e.left=e.right=e.top=e.bottom=0;I=y;t=Q}for(AK in s){AL(s[AK],g[AK])}if(g.grid.show){h()}AI()}function K(AN,AQ){var AM=+(AQ.min!=null?AQ.min:AN.datamin),AK=+(AQ.max!=null?AQ.max:AN.datamax),AP=AK-AM;if(AP==0){var AL=AK==0?1:0.01;if(AQ.min==null){AM-=AL}if(AQ.max==null||AQ.min!=null){AK+=AL}}else{var AO=AQ.autoscaleMargin;if(AO!=null){if(AQ.min==null){AM-=AP*AO;if(AM<0&&AN.datamin!=null&&AN.datamin>=0){AM=0}}if(AQ.max==null){AK+=AP*AO;if(AK>0&&AN.datamax!=null&&AN.datamax<=0){AK=0}}}}AN.min=AM;AN.max=AK}function F(AP,AS){var AO;if(typeof AS.ticks=="number"&&AS.ticks>0){AO=AS.ticks}else{if(AP==s.xaxis||AP==s.x2axis){AO=0.3*Math.sqrt(y)}else{AO=0.3*Math.sqrt(Q)}}var AX=(AP.max-AP.min)/AO,AZ,AT,AV,AW,AR,AM,AL;if(AS.mode=="time"){var AU={second:1000,minute:60*1000,hour:60*60*1000,day:24*60*60*1000,month:30*24*60*60*1000,year:365.2425*24*60*60*1000};var AY=[[1,"second"],[2,"second"],[5,"second"],[10,"second"],[30,"second"],[1,"minute"],[2,"minute"],[5,"minute"],[10,"minute"],[30,"minute"],[1,"hour"],[2,"hour"],[4,"hour"],[8,"hour"],[12,"hour"],[1,"day"],[2,"day"],[3,"day"],[0.25,"month"],[0.5,"month"],[1,"month"],[2,"month"],[3,"month"],[6,"month"],[1,"year"]];var AN=0;if(AS.minTickSize!=null){if(typeof AS.tickSize=="number"){AN=AS.tickSize}else{AN=AS.minTickSize[0]*AU[AS.minTickSize[1]]}}for(AR=0;AR<AY.length-1;++AR){if(AX<(AY[AR][0]*AU[AY[AR][1]]+AY[AR+1][0]*AU[AY[AR+1][1]])/2&&AY[AR][0]*AU[AY[AR][1]]>=AN){break}}AZ=AY[AR][0];AV=AY[AR][1];if(AV=="year"){AM=Math.pow(10,Math.floor(Math.log(AX/AU.year)/Math.LN10));AL=(AX/AU.year)/AM;if(AL<1.5){AZ=1}else{if(AL<3){AZ=2}else{if(AL<7.5){AZ=5}else{AZ=10}}}AZ*=AM}if(AS.tickSize){AZ=AS.tickSize[0];AV=AS.tickSize[1]}AT=function(Ac){var Ah=[],Af=Ac.tickSize[0],Ai=Ac.tickSize[1],Ag=new Date(Ac.min);var Ab=Af*AU[Ai];if(Ai=="second"){Ag.setUTCSeconds(A(Ag.getUTCSeconds(),Af))}if(Ai=="minute"){Ag.setUTCMinutes(A(Ag.getUTCMinutes(),Af))}if(Ai=="hour"){Ag.setUTCHours(A(Ag.getUTCHours(),Af))}if(Ai=="month"){Ag.setUTCMonth(A(Ag.getUTCMonth(),Af))}if(Ai=="year"){Ag.setUTCFullYear(A(Ag.getUTCFullYear(),Af))}Ag.setUTCMilliseconds(0);if(Ab>=AU.minute){Ag.setUTCSeconds(0)}if(Ab>=AU.hour){Ag.setUTCMinutes(0)}if(Ab>=AU.day){Ag.setUTCHours(0)}if(Ab>=AU.day*4){Ag.setUTCDate(1)}if(Ab>=AU.year){Ag.setUTCMonth(0)}var Ak=0,Aj=Number.NaN,Ad;do{Ad=Aj;Aj=Ag.getTime();Ah.push({v:Aj,label:Ac.tickFormatter(Aj,Ac)});if(Ai=="month"){if(Af<1){Ag.setUTCDate(1);var Aa=Ag.getTime();Ag.setUTCMonth(Ag.getUTCMonth()+1);var Ae=Ag.getTime();Ag.setTime(Aj+Ak*AU.hour+(Ae-Aa)*Af);Ak=Ag.getUTCHours();Ag.setUTCHours(0)}else{Ag.setUTCMonth(Ag.getUTCMonth()+Af)}}else{if(Ai=="year"){Ag.setUTCFullYear(Ag.getUTCFullYear()+Af)}else{Ag.setTime(Aj+Ab)}}}while(Aj<Ac.max&&Aj!=Ad);return Ah};AW=function(Aa,Ad){var Af=new Date(Aa);if(AS.timeformat!=null){return C.plot.formatDate(Af,AS.timeformat,AS.monthNames)}var Ab=Ad.tickSize[0]*AU[Ad.tickSize[1]];var Ac=Ad.max-Ad.min;var Ae=(AS.twelveHourClock)?" %p":"";if(Ab<AU.minute){fmt="%h:%M:%S"+Ae}else{if(Ab<AU.day){if(Ac<2*AU.day){fmt="%h:%M"+Ae}else{fmt="%b %d %h:%M"+Ae}}else{if(Ab<AU.month){fmt="%b %d"}else{if(Ab<AU.year){if(Ac<AU.year){fmt="%b"}else{fmt="%b %y"}}else{fmt="%y"}}}}return C.plot.formatDate(Af,fmt,AS.monthNames)}}else{var AK=AS.tickDecimals;var AQ=-Math.floor(Math.log(AX)/Math.LN10);if(AK!=null&&AQ>AK){AQ=AK}AM=Math.pow(10,-AQ);AL=AX/AM;if(AL<1.5){AZ=1}else{if(AL<3){AZ=2;if(AL>2.25&&(AK==null||AQ+1<=AK)){AZ=2.5;++AQ}}else{if(AL<7.5){AZ=5}else{AZ=10}}}AZ*=AM;if(AS.minTickSize!=null&&AZ<AS.minTickSize){AZ=AS.minTickSize}if(AS.tickSize!=null){AZ=AS.tickSize}AP.tickDecimals=Math.max(0,(AK!=null)?AK:AQ);AT=function(Ac){var Ae=[];var Af=A(Ac.min,Ac.tickSize),Ab=0,Aa=Number.NaN,Ad;do{Ad=Aa;Aa=Af+Ab*Ac.tickSize;Ae.push({v:Aa,label:Ac.tickFormatter(Aa,Ac)});++Ab}while(Aa<Ac.max&&Aa!=Ad);return Ae};AW=function(Aa,Ab){return Aa.toFixed(Ab.tickDecimals)}}AP.tickSize=AV?[AZ,AV]:AZ;AP.tickGenerator=AT;if(C.isFunction(AS.tickFormatter)){AP.tickFormatter=function(Aa,Ab){return""+AS.tickFormatter(Aa,Ab)}}else{AP.tickFormatter=AW}}function p(AO,AQ){AO.ticks=[];if(!AO.used){return }if(AQ.ticks==null){AO.ticks=AO.tickGenerator(AO)}else{if(typeof AQ.ticks=="number"){if(AQ.ticks>0){AO.ticks=AO.tickGenerator(AO)}}else{if(AQ.ticks){var AP=AQ.ticks;if(C.isFunction(AP)){AP=AP({min:AO.min,max:AO.max})}var AN,AK;for(AN=0;AN<AP.length;++AN){var AL=null;var AM=AP[AN];if(typeof AM=="object"){AK=AM[0];if(AM.length>1){AL=AM[1]}}else{AK=AM}if(AL==null){AL=AO.tickFormatter(AK,AO)}AO.ticks[AN]={v:AK,label:AL}}}}}if(AQ.autoscaleMargin!=null&&AO.ticks.length>0){if(AQ.min==null){AO.min=Math.min(AO.min,AO.ticks[0].v)}if(AQ.max==null&&AO.ticks.length>1){AO.max=Math.max(AO.max,AO.ticks[AO.ticks.length-1].v)}}}function AH(){Y.clearRect(0,0,y,Q);var AL=g.grid;if(AL.show&&!AL.aboveData){S()}for(var AK=0;AK<O.length;++AK){AA(O[AK])}Z(L.draw,[Y]);if(AL.show&&AL.aboveData){S()}}function N(AL,AR){var AO=AR+"axis",AK=AR+"2axis",AN,AQ,AP,AM;if(AL[AO]){AN=s[AO];AQ=AL[AO].from;AP=AL[AO].to}else{if(AL[AK]){AN=s[AK];AQ=AL[AK].from;AP=AL[AK].to}else{AN=s[AO];AQ=AL[AR+"1"];AP=AL[AR+"2"]}}if(AQ!=null&&AP!=null&&AQ>AP){return{from:AP,to:AQ,axis:AN}}return{from:AQ,to:AP,axis:AN}}function S(){var AO;Y.save();Y.translate(e.left,e.top);if(g.grid.backgroundColor){Y.fillStyle=R(g.grid.backgroundColor,t,0,"rgba(255, 255, 255, 0)");Y.fillRect(0,0,I,t)}var AL=g.grid.markings;if(AL){if(C.isFunction(AL)){AL=AL({xmin:s.xaxis.min,xmax:s.xaxis.max,ymin:s.yaxis.min,ymax:s.yaxis.max,xaxis:s.xaxis,yaxis:s.yaxis,x2axis:s.x2axis,y2axis:s.y2axis})}for(AO=0;AO<AL.length;++AO){var AK=AL[AO],AQ=N(AK,"x"),AN=N(AK,"y");if(AQ.from==null){AQ.from=AQ.axis.min}if(AQ.to==null){AQ.to=AQ.axis.max}if(AN.from==null){AN.from=AN.axis.min}if(AN.to==null){AN.to=AN.axis.max}if(AQ.to<AQ.axis.min||AQ.from>AQ.axis.max||AN.to<AN.axis.min||AN.from>AN.axis.max){continue}AQ.from=Math.max(AQ.from,AQ.axis.min);AQ.to=Math.min(AQ.to,AQ.axis.max);AN.from=Math.max(AN.from,AN.axis.min);AN.to=Math.min(AN.to,AN.axis.max);if(AQ.from==AQ.to&&AN.from==AN.to){continue}AQ.from=AQ.axis.p2c(AQ.from);AQ.to=AQ.axis.p2c(AQ.to);AN.from=AN.axis.p2c(AN.from);AN.to=AN.axis.p2c(AN.to);if(AQ.from==AQ.to||AN.from==AN.to){Y.beginPath();Y.strokeStyle=AK.color||g.grid.markingsColor;Y.lineWidth=AK.lineWidth||g.grid.markingsLineWidth;Y.moveTo(AQ.from,AN.from);Y.lineTo(AQ.to,AN.to);Y.stroke()}else{Y.fillStyle=AK.color||g.grid.markingsColor;Y.fillRect(AQ.from,AN.to,AQ.to-AQ.from,AN.from-AN.to)}}}Y.lineWidth=1;Y.strokeStyle=g.grid.tickColor;Y.beginPath();var AM,AP=s.xaxis;for(AO=0;AO<AP.ticks.length;++AO){AM=AP.ticks[AO].v;if(AM<=AP.min||AM>=s.xaxis.max){continue}Y.moveTo(Math.floor(AP.p2c(AM))+Y.lineWidth/2,0);Y.lineTo(Math.floor(AP.p2c(AM))+Y.lineWidth/2,t)}AP=s.yaxis;for(AO=0;AO<AP.ticks.length;++AO){AM=AP.ticks[AO].v;if(AM<=AP.min||AM>=AP.max){continue}Y.moveTo(0,Math.floor(AP.p2c(AM))+Y.lineWidth/2);Y.lineTo(I,Math.floor(AP.p2c(AM))+Y.lineWidth/2)}AP=s.x2axis;for(AO=0;AO<AP.ticks.length;++AO){AM=AP.ticks[AO].v;if(AM<=AP.min||AM>=AP.max){continue}Y.moveTo(Math.floor(AP.p2c(AM))+Y.lineWidth/2,-5);Y.lineTo(Math.floor(AP.p2c(AM))+Y.lineWidth/2,5)}AP=s.y2axis;for(AO=0;AO<AP.ticks.length;++AO){AM=AP.ticks[AO].v;if(AM<=AP.min||AM>=AP.max){continue}Y.moveTo(I-5,Math.floor(AP.p2c(AM))+Y.lineWidth/2);Y.lineTo(I+5,Math.floor(AP.p2c(AM))+Y.lineWidth/2)}Y.stroke();if(g.grid.borderWidth){var AR=g.grid.borderWidth;Y.lineWidth=AR;Y.strokeStyle=g.grid.borderColor;Y.strokeRect(-AR/2,-AR/2,I+AR,t+AR)}Y.restore()}function h(){l.find(".tickLabels").remove();var AK=['<div class="tickLabels" style="font-size:smaller;color:'+g.grid.color+'">'];function AM(AP,AQ){for(var AO=0;AO<AP.ticks.length;++AO){var AN=AP.ticks[AO];if(!AN.label||AN.v<AP.min||AN.v>AP.max){continue}AK.push(AQ(AN,AP))}}var AL=g.grid.labelMargin+g.grid.borderWidth;AM(s.xaxis,function(AN,AO){return'<div style="position:absolute;top:'+(e.top+t+AL)+"px;left:"+Math.round(e.left+AO.p2c(AN.v)-AO.labelWidth/2)+"px;width:"+AO.labelWidth+'px;text-align:center" class="tickLabel">'+AN.label+"</div>"});AM(s.yaxis,function(AN,AO){return'<div style="position:absolute;top:'+Math.round(e.top+AO.p2c(AN.v)-AO.labelHeight/2)+"px;right:"+(e.right+I+AL)+"px;width:"+AO.labelWidth+'px;text-align:right" class="tickLabel">'+AN.label+"</div>"});AM(s.x2axis,function(AN,AO){return'<div style="position:absolute;bottom:'+(e.bottom+t+AL)+"px;left:"+Math.round(e.left+AO.p2c(AN.v)-AO.labelWidth/2)+"px;width:"+AO.labelWidth+'px;text-align:center" class="tickLabel">'+AN.label+"</div>"});AM(s.y2axis,function(AN,AO){return'<div style="position:absolute;top:'+Math.round(e.top+AO.p2c(AN.v)-AO.labelHeight/2)+"px;left:"+(e.left+I+AL)+"px;width:"+AO.labelWidth+'px;text-align:left" class="tickLabel">'+AN.label+"</div>"});AK.push("</div>");l.append(AK.join(""))}function AA(AK){if(AK.lines.show){a(AK)}if(AK.bars.show){n(AK)}if(AK.points.show){o(AK)}}function a(AN){function AM(AY,AZ,AR,Ad,Ac){var Ae=AY.points,AS=AY.pointsize,AW=null,AV=null;Y.beginPath();for(var AX=AS;AX<Ae.length;AX+=AS){var AU=Ae[AX-AS],Ab=Ae[AX-AS+1],AT=Ae[AX],Aa=Ae[AX+1];if(AU==null||AT==null){continue}if(Ab<=Aa&&Ab<Ac.min){if(Aa<Ac.min){continue}AU=(Ac.min-Ab)/(Aa-Ab)*(AT-AU)+AU;Ab=Ac.min}else{if(Aa<=Ab&&Aa<Ac.min){if(Ab<Ac.min){continue}AT=(Ac.min-Ab)/(Aa-Ab)*(AT-AU)+AU;Aa=Ac.min}}if(Ab>=Aa&&Ab>Ac.max){if(Aa>Ac.max){continue}AU=(Ac.max-Ab)/(Aa-Ab)*(AT-AU)+AU;Ab=Ac.max}else{if(Aa>=Ab&&Aa>Ac.max){if(Ab>Ac.max){continue}AT=(Ac.max-Ab)/(Aa-Ab)*(AT-AU)+AU;Aa=Ac.max}}if(AU<=AT&&AU<Ad.min){if(AT<Ad.min){continue}Ab=(Ad.min-AU)/(AT-AU)*(Aa-Ab)+Ab;AU=Ad.min}else{if(AT<=AU&&AT<Ad.min){if(AU<Ad.min){continue}Aa=(Ad.min-AU)/(AT-AU)*(Aa-Ab)+Ab;AT=Ad.min}}if(AU>=AT&&AU>Ad.max){if(AT>Ad.max){continue}Ab=(Ad.max-AU)/(AT-AU)*(Aa-Ab)+Ab;AU=Ad.max}else{if(AT>=AU&&AT>Ad.max){if(AU>Ad.max){continue}Aa=(Ad.max-AU)/(AT-AU)*(Aa-Ab)+Ab;AT=Ad.max}}if(AU!=AW||Ab!=AV){Y.moveTo(Ad.p2c(AU)+AZ,Ac.p2c(Ab)+AR)}AW=AT;AV=Aa;Y.lineTo(Ad.p2c(AT)+AZ,Ac.p2c(Aa)+AR)}Y.stroke()}function AO(AX,Ae,Ac){var Af=AX.points,AR=AX.pointsize,AS=Math.min(Math.max(0,Ac.min),Ac.max),Aa,AV=0,Ad=false;for(var AW=AR;AW<Af.length;AW+=AR){var AU=Af[AW-AR],Ab=Af[AW-AR+1],AT=Af[AW],AZ=Af[AW+1];if(Ad&&AU!=null&&AT==null){Y.lineTo(Ae.p2c(AV),Ac.p2c(AS));Y.fill();Ad=false;continue}if(AU==null||AT==null){continue}if(AU<=AT&&AU<Ae.min){if(AT<Ae.min){continue}Ab=(Ae.min-AU)/(AT-AU)*(AZ-Ab)+Ab;AU=Ae.min}else{if(AT<=AU&&AT<Ae.min){if(AU<Ae.min){continue}AZ=(Ae.min-AU)/(AT-AU)*(AZ-Ab)+Ab;AT=Ae.min}}if(AU>=AT&&AU>Ae.max){if(AT>Ae.max){continue}Ab=(Ae.max-AU)/(AT-AU)*(AZ-Ab)+Ab;AU=Ae.max}else{if(AT>=AU&&AT>Ae.max){if(AU>Ae.max){continue}AZ=(Ae.max-AU)/(AT-AU)*(AZ-Ab)+Ab;AT=Ae.max}}if(!Ad){Y.beginPath();Y.moveTo(Ae.p2c(AU),Ac.p2c(AS));Ad=true}if(Ab>=Ac.max&&AZ>=Ac.max){Y.lineTo(Ae.p2c(AU),Ac.p2c(Ac.max));Y.lineTo(Ae.p2c(AT),Ac.p2c(Ac.max));AV=AT;continue}else{if(Ab<=Ac.min&&AZ<=Ac.min){Y.lineTo(Ae.p2c(AU),Ac.p2c(Ac.min));Y.lineTo(Ae.p2c(AT),Ac.p2c(Ac.min));AV=AT;continue}}var Ag=AU,AY=AT;if(Ab<=AZ&&Ab<Ac.min&&AZ>=Ac.min){AU=(Ac.min-Ab)/(AZ-Ab)*(AT-AU)+AU;Ab=Ac.min}else{if(AZ<=Ab&&AZ<Ac.min&&Ab>=Ac.min){AT=(Ac.min-Ab)/(AZ-Ab)*(AT-AU)+AU;AZ=Ac.min}}if(Ab>=AZ&&Ab>Ac.max&&AZ<=Ac.max){AU=(Ac.max-Ab)/(AZ-Ab)*(AT-AU)+AU;Ab=Ac.max}else{if(AZ>=Ab&&AZ>Ac.max&&Ab<=Ac.max){AT=(Ac.max-Ab)/(AZ-Ab)*(AT-AU)+AU;AZ=Ac.max}}if(AU!=Ag){if(Ab<=Ac.min){Aa=Ac.min}else{Aa=Ac.max}Y.lineTo(Ae.p2c(Ag),Ac.p2c(Aa));Y.lineTo(Ae.p2c(AU),Ac.p2c(Aa))}Y.lineTo(Ae.p2c(AU),Ac.p2c(Ab));Y.lineTo(Ae.p2c(AT),Ac.p2c(AZ));if(AT!=AY){if(AZ<=Ac.min){Aa=Ac.min}else{Aa=Ac.max}Y.lineTo(Ae.p2c(AT),Ac.p2c(Aa));Y.lineTo(Ae.p2c(AY),Ac.p2c(Aa))}AV=Math.max(AT,AY)}if(Ad){Y.lineTo(Ae.p2c(AV),Ac.p2c(AS));Y.fill()}}Y.save();Y.translate(e.left,e.top);Y.lineJoin="round";var AP=AN.lines.lineWidth,AK=AN.shadowSize;if(AP>0&&AK>0){Y.lineWidth=AK;Y.strokeStyle="rgba(0,0,0,0.1)";var AQ=Math.PI/18;AM(AN.datapoints,Math.sin(AQ)*(AP/2+AK/2),Math.cos(AQ)*(AP/2+AK/2),AN.xaxis,AN.yaxis);Y.lineWidth=AK/2;AM(AN.datapoints,Math.sin(AQ)*(AP/2+AK/4),Math.cos(AQ)*(AP/2+AK/4),AN.xaxis,AN.yaxis)}Y.lineWidth=AP;Y.strokeStyle=AN.color;var AL=V(AN.lines,AN.color,0,t);if(AL){Y.fillStyle=AL;AO(AN.datapoints,AN.xaxis,AN.yaxis)}if(AP>0){AM(AN.datapoints,0,0,AN.xaxis,AN.yaxis)}Y.restore()}function o(AN){function AP(AU,AT,Ab,AR,AV,AZ,AY){var Aa=AU.points,AQ=AU.pointsize;for(var AS=0;AS<Aa.length;AS+=AQ){var AX=Aa[AS],AW=Aa[AS+1];if(AX==null||AX<AZ.min||AX>AZ.max||AW<AY.min||AW>AY.max){continue}Y.beginPath();Y.arc(AZ.p2c(AX),AY.p2c(AW)+AR,AT,0,AV,false);if(Ab){Y.fillStyle=Ab;Y.fill()}Y.stroke()}}Y.save();Y.translate(e.left,e.top);var AO=AN.lines.lineWidth,AL=AN.shadowSize,AK=AN.points.radius;if(AO>0&&AL>0){var AM=AL/2;Y.lineWidth=AM;Y.strokeStyle="rgba(0,0,0,0.1)";AP(AN.datapoints,AK,null,AM+AM/2,Math.PI,AN.xaxis,AN.yaxis);Y.strokeStyle="rgba(0,0,0,0.2)";AP(AN.datapoints,AK,null,AM/2,Math.PI,AN.xaxis,AN.yaxis)}Y.lineWidth=AO;Y.strokeStyle=AN.color;AP(AN.datapoints,AK,V(AN.points,AN.color),0,2*Math.PI,AN.xaxis,AN.yaxis);Y.restore()}function AB(AV,AU,Ad,AQ,AY,AN,AL,AT,AS,Ac,AZ){var AM,Ab,AR,AX,AO,AK,AW,AP,Aa;if(AZ){AP=AK=AW=true;AO=false;AM=Ad;Ab=AV;AX=AU+AQ;AR=AU+AY;if(Ab<AM){Aa=Ab;Ab=AM;AM=Aa;AO=true;AK=false}}else{AO=AK=AW=true;AP=false;AM=AV+AQ;Ab=AV+AY;AR=Ad;AX=AU;if(AX<AR){Aa=AX;AX=AR;AR=Aa;AP=true;AW=false}}if(Ab<AT.min||AM>AT.max||AX<AS.min||AR>AS.max){return }if(AM<AT.min){AM=AT.min;AO=false}if(Ab>AT.max){Ab=AT.max;AK=false}if(AR<AS.min){AR=AS.min;AP=false}if(AX>AS.max){AX=AS.max;AW=false}AM=AT.p2c(AM);AR=AS.p2c(AR);Ab=AT.p2c(Ab);AX=AS.p2c(AX);if(AL){Ac.beginPath();Ac.moveTo(AM,AR);Ac.lineTo(AM,AX);Ac.lineTo(Ab,AX);Ac.lineTo(Ab,AR);Ac.fillStyle=AL(AR,AX);Ac.fill()}if(AO||AK||AW||AP){Ac.beginPath();Ac.moveTo(AM,AR+AN);if(AO){Ac.lineTo(AM,AX+AN)}else{Ac.moveTo(AM,AX+AN)}if(AW){Ac.lineTo(Ab,AX+AN)}else{Ac.moveTo(Ab,AX+AN)}if(AK){Ac.lineTo(Ab,AR+AN)}else{Ac.moveTo(Ab,AR+AN)}if(AP){Ac.lineTo(AM,AR+AN)}else{Ac.moveTo(AM,AR+AN)}Ac.stroke()}}function n(AM){function AL(AS,AR,AU,AP,AT,AW,AV){var AX=AS.points,AO=AS.pointsize;for(var AQ=0;AQ<AX.length;AQ+=AO){if(AX[AQ]==null){continue}AB(AX[AQ],AX[AQ+1],AX[AQ+2],AR,AU,AP,AT,AW,AV,Y,AM.bars.horizontal)}}Y.save();Y.translate(e.left,e.top);Y.lineWidth=AM.bars.lineWidth;Y.strokeStyle=AM.color;var AK=AM.bars.align=="left"?0:-AM.bars.barWidth/2;var AN=AM.bars.fill?function(AO,AP){return V(AM.bars,AM.color,AO,AP)}:null;AL(AM.datapoints,AK,AK+AM.bars.barWidth,0,AN,AM.xaxis,AM.yaxis);Y.restore()}function V(AM,AK,AL,AO){var AN=AM.fill;if(!AN){return null}if(AM.fillColor){return R(AM.fillColor,AL,AO,AK)}var AP=C.color.parse(AK);AP.a=typeof AN=="number"?AN:0.4;AP.normalize();return AP.toString()}function AI(){l.find(".legend").remove();if(!g.legend.show){return }var AP=[],AN=false,AV=g.legend.labelFormatter,AU,AR;for(i=0;i<O.length;++i){AU=O[i];AR=AU.label;if(!AR){continue}if(i%g.legend.noColumns==0){if(AN){AP.push("</tr>")}AP.push("<tr>");AN=true}if(AV){AR=AV(AR,AU)}AP.push('<td class="legendColorBox"><div style="border:1px solid '+g.legend.labelBoxBorderColor+';padding:1px"><div style="width:4px;height:0;border:5px solid '+AU.color+';overflow:hidden"></div></div></td><td class="legendLabel">'+AR+"</td>")}if(AN){AP.push("</tr>")}if(AP.length==0){return }var AT='<table style="font-size:smaller;color:'+g.grid.color+'">'+AP.join("")+"</table>";if(g.legend.container!=null){C(g.legend.container).html(AT)}else{var AQ="",AL=g.legend.position,AM=g.legend.margin;if(AM[0]==null){AM=[AM,AM]}if(AL.charAt(0)=="n"){AQ+="top:"+(AM[1]+e.top)+"px;"}else{if(AL.charAt(0)=="s"){AQ+="bottom:"+(AM[1]+e.bottom)+"px;"}}if(AL.charAt(1)=="e"){AQ+="right:"+(AM[0]+e.right)+"px;"}else{if(AL.charAt(1)=="w"){AQ+="left:"+(AM[0]+e.left)+"px;"}}var AS=C('<div class="legend">'+AT.replace('style="','style="position:absolute;'+AQ+";")+"</div>").appendTo(l);if(g.legend.backgroundOpacity!=0){var AO=g.legend.backgroundColor;if(AO==null){AO=g.grid.backgroundColor;if(AO&&typeof AO=="string"){AO=C.color.parse(AO)}else{AO=C.color.extract(AS,"background-color")}AO.a=1;AO=AO.toString()}var AK=AS.children();C('<div style="position:absolute;width:'+AK.width()+"px;height:"+AK.height()+"px;"+AQ+"background-color:"+AO+';"> </div>').prependTo(AS).css("opacity",g.legend.backgroundOpacity)}}}var w=[],J=null;function AF(AR,AP,AM){var AX=g.grid.mouseActiveRadius,Aj=AX*AX+1,Ah=null,Aa=false,Af,Ad;for(Af=0;Af<O.length;++Af){if(!AM(O[Af])){continue}var AY=O[Af],AQ=AY.xaxis,AO=AY.yaxis,Ae=AY.datapoints.points,Ac=AY.datapoints.pointsize,AZ=AQ.c2p(AR),AW=AO.c2p(AP),AL=AX/AQ.scale,AK=AX/AO.scale;if(AY.lines.show||AY.points.show){for(Ad=0;Ad<Ae.length;Ad+=Ac){var AT=Ae[Ad],AS=Ae[Ad+1];if(AT==null){continue}if(AT-AZ>AL||AT-AZ<-AL||AS-AW>AK||AS-AW<-AK){continue}var AV=Math.abs(AQ.p2c(AT)-AR),AU=Math.abs(AO.p2c(AS)-AP),Ab=AV*AV+AU*AU;if(Ab<=Aj){Aj=Ab;Ah=[Af,Ad/Ac]}}}if(AY.bars.show&&!Ah){var AN=AY.bars.align=="left"?0:-AY.bars.barWidth/2,Ag=AN+AY.bars.barWidth;for(Ad=0;Ad<Ae.length;Ad+=Ac){var AT=Ae[Ad],AS=Ae[Ad+1],Ai=Ae[Ad+2];if(AT==null){continue}if(O[Af].bars.horizontal?(AZ<=Math.max(Ai,AT)&&AZ>=Math.min(Ai,AT)&&AW>=AS+AN&&AW<=AS+Ag):(AZ>=AT+AN&&AZ<=AT+Ag&&AW>=Math.min(Ai,AS)&&AW<=Math.max(Ai,AS))){Ah=[Af,Ad/Ac]}}}}if(Ah){Af=Ah[0];Ad=Ah[1];Ac=O[Af].datapoints.pointsize;return{datapoint:O[Af].datapoints.points.slice(Ad*Ac,(Ad+1)*Ac),dataIndex:Ad,series:O[Af],seriesIndex:Af}}return null}function D(AK){if(g.grid.hoverable){H("plothover",AK,function(AL){return AL.hoverable!=false})}}function d(AK){H("plotclick",AK,function(AL){return AL.clickable!=false})}function H(AL,AK,AM){var AN=AD.offset(),AS={pageX:AK.pageX,pageY:AK.pageY},AQ=AK.pageX-AN.left-e.left,AO=AK.pageY-AN.top-e.top;if(s.xaxis.used){AS.x=s.xaxis.c2p(AQ)}if(s.yaxis.used){AS.y=s.yaxis.c2p(AO)}if(s.x2axis.used){AS.x2=s.x2axis.c2p(AQ)}if(s.y2axis.used){AS.y2=s.y2axis.c2p(AO)}var AT=AF(AQ,AO,AM);if(AT){AT.pageX=parseInt(AT.series.xaxis.p2c(AT.datapoint[0])+AN.left+e.left);AT.pageY=parseInt(AT.series.yaxis.p2c(AT.datapoint[1])+AN.top+e.top)}if(g.grid.autoHighlight){for(var AP=0;AP<w.length;++AP){var AR=w[AP];if(AR.auto==AL&&!(AT&&AR.series==AT.series&&AR.point==AT.datapoint)){x(AR.series,AR.point)}}if(AT){AE(AT.series,AT.datapoint,AL)}}l.trigger(AL,[AS,AT])}function q(){if(!J){J=setTimeout(v,30)}}function v(){J=null;AJ.save();AJ.clearRect(0,0,y,Q);AJ.translate(e.left,e.top);var AL,AK;for(AL=0;AL<w.length;++AL){AK=w[AL];if(AK.series.bars.show){z(AK.series,AK.point)}else{u(AK.series,AK.point)}}AJ.restore();Z(L.drawOverlay,[AJ])}function AE(AM,AK,AN){if(typeof AM=="number"){AM=O[AM]}if(typeof AK=="number"){AK=AM.data[AK]}var AL=j(AM,AK);if(AL==-1){w.push({series:AM,point:AK,auto:AN});q()}else{if(!AN){w[AL].auto=false}}}function x(AM,AK){if(AM==null&&AK==null){w=[];q()}if(typeof AM=="number"){AM=O[AM]}if(typeof AK=="number"){AK=AM.data[AK]}var AL=j(AM,AK);if(AL!=-1){w.splice(AL,1);q()}}function j(AM,AN){for(var AK=0;AK<w.length;++AK){var AL=w[AK];if(AL.series==AM&&AL.point[0]==AN[0]&&AL.point[1]==AN[1]){return AK}}return -1}function u(AN,AM){var AL=AM[0],AR=AM[1],AQ=AN.xaxis,AP=AN.yaxis;if(AL<AQ.min||AL>AQ.max||AR<AP.min||AR>AP.max){return }var AO=AN.points.radius+AN.points.lineWidth/2;AJ.lineWidth=AO;AJ.strokeStyle=C.color.parse(AN.color).scale("a",0.5).toString();var AK=1.5*AO;AJ.beginPath();AJ.arc(AQ.p2c(AL),AP.p2c(AR),AK,0,2*Math.PI,false);AJ.stroke()}function z(AN,AK){AJ.lineWidth=AN.bars.lineWidth;AJ.strokeStyle=C.color.parse(AN.color).scale("a",0.5).toString();var AM=C.color.parse(AN.color).scale("a",0.5).toString();var AL=AN.bars.align=="left"?0:-AN.bars.barWidth/2;AB(AK[0],AK[1],AK[2]||0,AL,AL+AN.bars.barWidth,0,function(){return AM},AN.xaxis,AN.yaxis,AJ,AN.bars.horizontal)}function R(AM,AL,AQ,AO){if(typeof AM=="string"){return AM}else{var AP=Y.createLinearGradient(0,AQ,0,AL);for(var AN=0,AK=AM.colors.length;AN<AK;++AN){var AR=AM.colors[AN];if(typeof AR!="string"){AR=C.color.parse(AO).scale("rgb",AR.brightness);AR.a*=AR.opacity;AR=AR.toString()}AP.addColorStop(AN/(AK-1),AR)}return AP}}}C.plot=function(G,E,D){var F=new B(C(G),E,D,C.plot.plugins);return F};C.plot.plugins=[];C.plot.formatDate=function(H,E,G){var L=function(N){N=""+N;return N.length==1?"0"+N:N};var D=[];var M=false;var K=H.getUTCHours();var I=K<12;if(G==null){G=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]}if(E.search(/%p|%P/)!=-1){if(K>12){K=K-12}else{if(K==0){K=12}}}for(var F=0;F<E.length;++F){var J=E.charAt(F);if(M){switch(J){case"h":J=""+K;break;case"H":J=L(K);break;case"M":J=L(H.getUTCMinutes());break;case"S":J=L(H.getUTCSeconds());break;case"d":J=""+H.getUTCDate();break;case"m":J=""+(H.getUTCMonth()+1);break;case"y":J=""+H.getUTCFullYear();break;case"b":J=""+G[H.getUTCMonth()];break;case"p":J=(I)?("am"):("pm");break;case"P":J=(I)?("AM"):("PM");break}D.push(J);M=false}else{if(J=="%"){M=true}else{D.push(J)}}}return D.join("")};function A(E,D){return D*Math.floor(E/D)}})(jQuery);
/*
Flot plugin for showing a crosshair, thin lines, when the mouse hovers
over the plot.

  crosshair: {
    mode: null or "x" or "y" or "xy"
    color: color
    lineWidth: number
  }

Set the mode to one of "x", "y" or "xy". The "x" mode enables a
vertical crosshair that lets you trace the values on the x axis, "y"
enables a horizontal crosshair and "xy" enables them both. "color" is
the color of the crosshair (default is "rgba(170, 0, 0, 0.80)"),
"lineWidth" is the width of the drawn lines (default is 1).

The plugin also adds four public methods:

  - setCrosshair(pos)

    Set the position of the crosshair. Note that this is cleared if
    the user moves the mouse. "pos" should be on the form { x: xpos,
    y: ypos } (or x2 and y2 if you're using the secondary axes), which
    is coincidentally the same format as what you get from a "plothover"
    event. If "pos" is null, the crosshair is cleared.

  - clearCrosshair()

    Clear the crosshair.

  - lockCrosshair(pos)

    Cause the crosshair to lock to the current location, no longer
    updating if the user moves the mouse. Optionally supply a position
    (passed on to setCrosshair()) to move it to.

    Example usage:
      var myFlot = $.plot( $("#graph"), ..., { crosshair: { mode: "x" } } };
      $("#graph").bind("plothover", function (evt, position, item) {
        if (item) {
          // Lock the crosshair to the data point being hovered
          myFlot.lockCrosshair({ x: item.datapoint[0], y: item.datapoint[1] });
        }
        else {
          // Return normal crosshair operation
          myFlot.unlockCrosshair();
        }
      });

  - unlockCrosshair()

    Free the crosshair to move again after locking it.
*/

(function ($) {
    var options = {
        crosshair: {
            mode: null, // one of null, "x", "y" or "xy",
            color: "rgba(170, 0, 0, 0.80)",
            lineWidth: 1
        }
    };
    
    function init(plot) {
        // position of crosshair in pixels
        var crosshair = { x: -1, y: -1, locked: false };

        plot.setCrosshair = function setCrosshair(pos) {
            if (!pos)
                crosshair.x = -1;
            else {
                var axes = plot.getAxes();
                
                crosshair.x = Math.max(0, Math.min(pos.x != null ? axes.xaxis.p2c(pos.x) : axes.x2axis.p2c(pos.x2), plot.width()));
                crosshair.y = Math.max(0, Math.min(pos.y != null ? axes.yaxis.p2c(pos.y) : axes.y2axis.p2c(pos.y2), plot.height()));
            }
            
            plot.triggerRedrawOverlay();
        };
        
        plot.clearCrosshair = plot.setCrosshair; // passes null for pos
        
        plot.lockCrosshair = function lockCrosshair(pos) {
            if (pos)
                plot.setCrosshair(pos);
            crosshair.locked = true;
        }

        plot.unlockCrosshair = function unlockCrosshair() {
            crosshair.locked = false;
        }

        plot.hooks.bindEvents.push(function (plot, eventHolder) {
            if (!plot.getOptions().crosshair.mode)
                return;

            eventHolder.mouseout(function () {
                if (crosshair.x != -1) {
                    crosshair.x = -1;
                    plot.triggerRedrawOverlay();
                }
            });
            
            eventHolder.mousemove(function (e) {
                if (plot.getSelection && plot.getSelection()) {
                    crosshair.x = -1; // hide the crosshair while selecting
                    return;
                }
                
                if (crosshair.locked)
                    return;
                
                var offset = plot.offset();
                crosshair.x = Math.max(0, Math.min(e.pageX - offset.left, plot.width()));
                crosshair.y = Math.max(0, Math.min(e.pageY - offset.top, plot.height()));
                plot.triggerRedrawOverlay();
            });
        });

        plot.hooks.drawOverlay.push(function (plot, ctx) {
            var c = plot.getOptions().crosshair;
            if (!c.mode)
                return;

            var plotOffset = plot.getPlotOffset();
            
            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);

            if (crosshair.x != -1) {
                ctx.strokeStyle = c.color;
                ctx.lineWidth = c.lineWidth;
                ctx.lineJoin = "round";

                ctx.beginPath();
                if (c.mode.indexOf("x") != -1) {
                    ctx.moveTo(crosshair.x, 0);
                    ctx.lineTo(crosshair.x, plot.height());
                }
                if (c.mode.indexOf("y") != -1) {
                    ctx.moveTo(0, crosshair.y);
                    ctx.lineTo(plot.width(), crosshair.y);
                }
                ctx.stroke();
            }
            ctx.restore();
        });
    }
    
    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'crosshair',
        version: '1.0'
    });
})(jQuery);

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


/**
*
* 
* @since 27th July, 2010
*/
var DashboardFrame = {

    /** What we're showing in the snap shot tab */
    m_snapshotMode : 'traffic',

    /** What typs of comments to display, 'Pending','Approved','Trash','Spam' */
    m_commentsMode : 'Pending',

    /** Comments data */
    m_comments : '',

    /** Summary data */
    m_summaryData : '',

    /** Stats data */
    m_crawlerViews : '',
    m_pageViews : '',
    m_discUsage : '',
    
    m_painted : false,

    // ////////////////////////////////////////////////////////////////////////////

    init : function(){
    },
	
    // ////////////////////////////////////////////////////////////////////////////
	
    repaint : function(){
        if (DashboardFrame.m_painted){
            DashboardFrame.paintSnapshotTab();
        }
        else {
            $('#apollo_followers_summary').hide();
            $('#apollo_site_stats_summary').hide();
            BlogAPI.getComments(DataStore.m_siteID, 0, DashboardFrame.gotComments);
            BlogAPI.getSummary(DataStore.m_siteID, DashboardFrame.gotSummary);
            DashboardFrame.m_painted = true;
        }
    },

    // ////////////////////////////////////////////////////////////////////////////

    gotSummary : function(data){
        DashboardFrame.m_summaryData = data;
        MediaAPI.getStats(DataStore.m_siteID, DashboardFrame.gotStats);
    },
    
    // ////////////////////////////////////////////////////////////////////////////

    gotStats : function(disc_usage, page_views, crawler_views){
        DashboardFrame.m_discUsage = disc_usage;
        DashboardFrame.m_pageViews = page_views;
        DashboardFrame.m_crawlerViews = crawler_views;
        DashboardFrame.paintSnapshotTab();
    },

    // ////////////////////////////////////////////////////////////////////////////

    paintSnapshotTab : function(){
		
        if (DashboardFrame.m_snapshotMode == 'traffic'){
            $('#apollo_followers_summary').hide();
            $('#apollo_site_stats_summary').show();
            DashboardFrame.paintStats();
        }
        else {
            $('#apollo_followers_summary').show();
            $('#apollo_site_stats_summary').hide();
            DashboardFrame.paintFollowers();
        }
    },

    // ////////////////////////////////////////////////////////////////////////////

    showTraffic : function(){
	
        $('.subFrameCommand').removeClass('selected');
        $('#showTraffic').addClass('selected');
	
        DashboardFrame.m_snapshotMode = 'traffic';
        DashboardFrame.paintSnapshotTab();
    },
	
    showFollowers : function(){
	
        $('.subFrameCommand').removeClass('selected');
        $('#showFollowers').addClass('selected');
        
        DashboardFrame.m_snapshotMode = 'followers';
        DashboardFrame.paintSnapshotTab();
    },
		
    // ////////////////////////////////////////////////////////////////////////////

    m_discUsePC : 0,
	
    paintStats : function(){        

        var data = DashboardFrame.m_summaryData;
		
        $('#no_comments_approved').html( data.comments_approved);
        $('#no_comments_pending').html( data.comments_pending);
        $('#no_comments_spam').html( data.comments_spam);
        $('#no_comments_trash').html( data.comments_trash);
        $('#no_posts_published').html( data.posts_published);
        $('#no_posts_draft').html( data.posts_draft);
        $('#no_posts_private').html( data.posts_private);
        $('#no_catgeories').html( data.categories);
        $('#no_tags').html( data.tags);
        $('#no_followers').html( data.no_followers);
            
        $('#disc_usage').html(AthenaUtils.addCommas(DashboardFrame.m_discUsage, 2) + " MB");
            
        /*    
        var maxDisc = defines.max_hdd;
        DashboardFrame.m_discUsePC = 100 * DashboardFrame.m_discUsage / maxDisc  
        $("#disc_usage_bar").height(15);
        $("#disc_usage_bar").progressbar({
            value: 0
        });
        
        AthenaDialog.setProgressBarColorMap("#disc_usage_bar", 0, 100, 'heat');		
        DashboardFrame.animateDU();
        
        */
            
        StatViewer.paintCrawlerGraph("#apollo_crawler_graph_small", DashboardFrame.m_crawlerViews);
        StatViewer.paintStatGraph("#apollo_stats_graph_small", DashboardFrame.m_pageViews);        
    },
    
	/*
    tempVal : 0,
	
    animateDU : function(){
        DashboardFrame.tempVal += 1;
        $("#disc_usage_bar").progressbar({
            value: DashboardFrame.tempVal
            });
        if (DashboardFrame.tempVal < DashboardFrame.m_discUsePC){
            setTimeout("DashboardFrame.animateDU()", 10);
        }
        else {
            $("#disc_usage_bar").progressbar({
                value: DashboardFrame.m_discUsePC
                });
        }
    },
	*/	    
    // ////////////////////////////////////////////////////////////////////////////
                
    /**
     * Paint the blog summary information
     */
    paintFollowers : function(){

        var data = DashboardFrame.m_summaryData;

        if (!data.top_followers || data.top_followers == undefined || data.top_followers.length == 0){
            return;
        }
                
        // Paint the top followers...
        
        var txt = "";
        txt += '<table class="statsTable"  border="0" cellspacing="2" cellpadding="3">';
        txt += '<thead class="head" align="left">';
        txt += '<th>#</th><th>Commenter</th><th>Last Activity</th><th>No Comments</th>';
        txt += '</thead>';

        for (var i=0; i<data.top_followers.length; i++){

            var dt = new Date(data.top_followers[i].last_activity);
            var dateStr = dateFormat(dt, "ddd, mmm dS yyyy");

            var namelink = data.top_followers[i].name;
            if (data.top_followers[i].url != undefined){
                namelink = "<a href='"+data.top_followers[i].url+"'>"+data.top_followers[i].name+"</a>";
            }
            
            var className = 'odd';
            if (i % 2) className = 'even';
            
            txt += '<tr align="left" class="'+className+'">';
            txt += '    <td>'+(i+1)+'</td>';
            txt += '    <td class="commentName" id="follower0name">'+namelink+'</td>';
            txt += '    <td class="commentDate" >'+dateStr+'</td>';
            txt += '    <td>'+data.top_followers[i].no+'</td>';
            txt += '</tr>';
        }


        txt += '</table>';
        $('#apollo_followers_summary').html(txt);
    //        $('#apollo_followers_sumary').removeClass("scroll-pane");
    //        $('#apollo_followers_sumary').addClass("scroll-pane");
    //        $('#apollo_followers_sumary').jScrollPane();

    },

    // ////////////////////////////////////////////////////////////////////////////

    gotComments : function(postID, comments){
        DashboardFrame.m_comments = comments;
        DashboardFrame.paintComments(comments);
    },

    // ////////////////////////////////////////////////////////////////////////////

    /**
     * Update what comments we should display
     */
    showComments : function(status){
        $('.subFrameCommand').removeClass('selected');
        $('#showComments'+status).addClass('selected');
        DashboardFrame.m_commentsMode = status;
        DashboardFrame.paintComments();
    },
    
    // ////////////////////////////////////////////////////////////////////////

    paintComments : function(){

        var txt = "";
        if (!DashboardFrame.m_comments || DashboardFrame.m_comments == undefined || DashboardFrame.m_comments.length == 0){
            $('#apollo_site_comments').html("<div align='center'><p>I'm sorry, you don't have any comments yet</p></div>");
            return;
        }
        
        var comments = DashboardFrame.m_comments;
        
        for (var i=0; i<comments.length; i++){
            if (DashboardFrame.m_commentsMode == 'All' || comments[i].status == DashboardFrame.m_commentsMode){
                txt += DashboardFrame.getCommentHTML(comments[i]);
            }
        }

        $('#apollo_site_comments').html(txt);
    //        $('#apollo_site_comments').removeClass("scroll-pane");
    //        $('#apollo_site_comments').addClass("scroll-pane");
    //        $('#apollo_site_comments').jScrollPane();
    //        $('#apollo_site_comments_wrapper').css('margin-right', 0);
    //        $('#apollo_site_comments_wrapper').css('padding-right', 0);
        
    },

    // ////////////////////////////////////////////////////////////////////////

    getCommentHTML : function(commentObj){

        var txt = "";
        var id = commentObj.id;
        var dt = new Date(commentObj.created);
        var dateStr = dateFormat(dt, "ddd, mmm dS yyyy, h:MM:ss TT");

        var classStr = "pending_comment";
        switch (commentObj.status){
            //            case 'Pending':
            //                classStr = "pending_comment";
            //                break;
            case 'Spam':
            case 'Trash':
                classStr = "trashed_comment";
                break;
        //                classStr = "spam_comment";
        //                break;
        //            case 'Approved':
        //                classStr = "approved_comment";
        //                break;
        }

        var post = DataStore.getPost(commentObj.post_id);
        
        txt += "<div class='commentWrapper " + classStr + "'>";

        txt += "    <div class='commentTitle' style='overflow:hidden'>";
        txt += "    <span class='commentPostTitle'>" + post.title + "</span>";
        txt += "    </div>"
        txt += "    <div class='commentTitle'>";
        txt += "        By <span class='commentName'>" + commentObj.name + "</span> on <span class='commentDate'>" + dateStr + "</span>";

        if (commentObj.status != 'Spam'){
            txt += "    <a href='#' class='commentEdit' onclick=\"DashboardFrame.spamComment("+id+")\">spam</a>";
        }
        else {
            txt += "    <a href='#' class='commentEdit' onclick=\"DashboardFrame.unspamComment("+id+")\">not spam</a>";
        }

        if (commentObj.status != 'Spam'){
            if (commentObj.status == 'Trash'){
                txt += "    <a href='#' class='commentEdit' onclick=\"DashboardFrame.undeleteComment("+id+")\">undelete</a>";
            }
            else {
                txt += "    <a href='#' class='commentEdit' onclick=\"DashboardFrame.deleteComment("+id+")\">delete</a>";
            }
        }

        if (commentObj.status == 'Pending'){
            txt += "    <a href='#' class='commentEdit' onclick=\"DashboardFrame.approveComment("+id+")\">approve</a>";
        }
        else if (commentObj.status == 'Approved'){
            txt += "    <a href='#' class='commentEdit' onclick=\"DashboardFrame.unapproveComment("+id+")\">unapprove</a>";
        }
        txt += "    </div>";

        txt += "    <div class='commentContents'>"+commentObj.content+"</div>";
        txt += "</div>";

        return txt;
    },

    // ////////////////////////////////////////////////////////////////////////////

    unspamComment : function(comment_id){
        MediaAPI.updateCommentStatus(DataStore.m_siteID, comment_id, 'Approved', DashboardFrame.onCommentUpdate);
    },

    spamComment : function(comment_id){
        MediaAPI.updateCommentStatus(DataStore.m_siteID, comment_id, 'Spam', DashboardFrame.onCommentUpdate);
    },

    unapproveComment : function(comment_id){
        MediaAPI.updateCommentStatus(DataStore.m_siteID, comment_id, 'Pending', DashboardFrame.onCommentUpdate);
    },

    approveComment : function(comment_id){
        MediaAPI.updateCommentStatus(DataStore.m_siteID, comment_id, 'Approved', DashboardFrame.onCommentUpdate);
    },

    deleteComment : function(comment_id){
        MediaAPI.updateCommentStatus(DataStore.m_siteID, comment_id, 'Trash', DashboardFrame.onCommentUpdate);
    },

    undeleteComment : function(comment_id){
        MediaAPI.updateCommentStatus(DataStore.m_siteID, comment_id, 'Pending', DashboardFrame.onCommentUpdate);
    },

    onCommentUpdate : function(commentID, newStatus){
    	
        for (var i=0; i<DashboardFrame.m_comments.length; i++){
            if (DashboardFrame.m_comments[i].id == commentID){
                DashboardFrame.m_comments[i].status = newStatus;
                DashboardFrame.paintComments();
            }
        }
    	
    }

}
/* 
 * Dashboard Page functionality
 *
 * @author Mike Pritchard (mike@apollosites.com)
 * @since 3rd January, 2011
 */
var Dashboard = {

    // ////////////////////////////////////////////////////////////////////////

    init : function(siteID){
                
        $('#DashboardFrame').show();
                
        // Setup the data store for the site
        DataStore.init(siteID);

        // Setup classes...
        DashboardFrame.init();

        // Start loading data
        DataStore.load(Dashboard.onDataLoaded);
        
    },

    // ////////////////////////////////////////////////////////////////////////

    onDataLoaded : function(){
        DashboardFrame.repaint();
    }
	
    // ////////////////////////////////////////////////////////////////////////
}


