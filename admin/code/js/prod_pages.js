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
/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 * @see http://blog.stevenlevithan.com/archives/date-time-format
 */

var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};

/*
 * Date prototype extensions. Doesn't depend on any
 * other code. Doens't overwrite existing methods.
 *
 * Adds dayNames, abbrDayNames, monthNames and abbrMonthNames static properties and isLeapYear,
 * isWeekend, isWeekDay, getDaysInMonth, getDayName, getMonthName, getDayOfYear, getWeekOfYear,
 * setDayOfYear, addYears, addMonths, addDays, addHours, addMinutes, addSeconds methods
 *
 * Copyright (c) 2006 Jšrn Zaefferer and Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 *
 * Additional methods and properties added by Kelvin Luck: firstDayOfWeek, dateFormat, zeroTime, asString, fromString -
 * I've added my name to these methods so you know who to blame if they are broken!
 * 
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */

/**
 * An Array of day names starting with Sunday.
 * 
 * @example dayNames[0]
 * @result 'Sunday'
 *
 * @name dayNames
 * @type Array
 * @cat Plugins/Methods/Date
 */
Date.dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * An Array of abbreviated day names starting with Sun.
 * 
 * @example abbrDayNames[0]
 * @result 'Sun'
 *
 * @name abbrDayNames
 * @type Array
 * @cat Plugins/Methods/Date
 */
Date.abbrDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * An Array of month names starting with Janurary.
 * 
 * @example monthNames[0]
 * @result 'January'
 *
 * @name monthNames
 * @type Array
 * @cat Plugins/Methods/Date
 */
Date.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * An Array of abbreviated month names starting with Jan.
 * 
 * @example abbrMonthNames[0]
 * @result 'Jan'
 *
 * @name monthNames
 * @type Array
 * @cat Plugins/Methods/Date
 */
Date.abbrMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * The first day of the week for this locale.
 *
 * @name firstDayOfWeek
 * @type Number
 * @cat Plugins/Methods/Date
 * @author Kelvin Luck
 */
Date.firstDayOfWeek = 1;

/**
 * The format that string dates should be represented as (e.g. 'dd/mm/yyyy' for UK, 'mm/dd/yyyy' for US, 'yyyy-mm-dd' for Unicode etc).
 *
 * @name format
 * @type String
 * @cat Plugins/Methods/Date
 * @author Kelvin Luck
 */
Date.format = 'dd/mm/yyyy';
//Date.format = 'mm/dd/yyyy';
//Date.format = 'yyyy-mm-dd';
//Date.format = 'dd mmm yy';

/**
 * The first two numbers in the century to be used when decoding a two digit year. Since a two digit year is ambiguous (and date.setYear
 * only works with numbers < 99 and so doesn't allow you to set years after 2000) we need to use this to disambiguate the two digit year codes.
 *
 * @name format
 * @type String
 * @cat Plugins/Methods/Date
 * @author Kelvin Luck
 */
Date.fullYearStart = '20';

(function() {

	/**
	 * Adds a given method under the given name 
	 * to the Date prototype if it doesn't
	 * currently exist.
	 *
	 * @private
	 */
	function add(name, method) {
		if( !Date.prototype[name] ) {
			Date.prototype[name] = method;
		}
	};
	
	/**
	 * Checks if the year is a leap year.
	 *
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.isLeapYear();
	 * @result true
	 *
	 * @name isLeapYear
	 * @type Boolean
	 * @cat Plugins/Methods/Date
	 */
	add("isLeapYear", function() {
		var y = this.getFullYear();
		return (y%4==0 && y%100!=0) || y%400==0;
	});
	
	/**
	 * Checks if the day is a weekend day (Sat or Sun).
	 *
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.isWeekend();
	 * @result false
	 *
	 * @name isWeekend
	 * @type Boolean
	 * @cat Plugins/Methods/Date
	 */
	add("isWeekend", function() {
		return this.getDay()==0 || this.getDay()==6;
	});
	
	/**
	 * Check if the day is a day of the week (Mon-Fri)
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.isWeekDay();
	 * @result false
	 * 
	 * @name isWeekDay
	 * @type Boolean
	 * @cat Plugins/Methods/Date
	 */
	add("isWeekDay", function() {
		return !this.isWeekend();
	});
	
	/**
	 * Gets the number of days in the month.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.getDaysInMonth();
	 * @result 31
	 * 
	 * @name getDaysInMonth
	 * @type Number
	 * @cat Plugins/Methods/Date
	 */
	add("getDaysInMonth", function() {
		return [31,(this.isLeapYear() ? 29:28),31,30,31,30,31,31,30,31,30,31][this.getMonth()];
	});
	
	/**
	 * Gets the name of the day.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.getDayName();
	 * @result 'Saturday'
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.getDayName(true);
	 * @result 'Sat'
	 * 
	 * @param abbreviated Boolean When set to true the name will be abbreviated.
	 * @name getDayName
	 * @type String
	 * @cat Plugins/Methods/Date
	 */
	add("getDayName", function(abbreviated) {
		return abbreviated ? Date.abbrDayNames[this.getDay()] : Date.dayNames[this.getDay()];
	});

	/**
	 * Gets the name of the month.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.getMonthName();
	 * @result 'Janurary'
	 *
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.getMonthName(true);
	 * @result 'Jan'
	 * 
	 * @param abbreviated Boolean When set to true the name will be abbreviated.
	 * @name getDayName
	 * @type String
	 * @cat Plugins/Methods/Date
	 */
	add("getMonthName", function(abbreviated) {
		return abbreviated ? Date.abbrMonthNames[this.getMonth()] : Date.monthNames[this.getMonth()];
	});

	/**
	 * Get the number of the day of the year.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.getDayOfYear();
	 * @result 11
	 * 
	 * @name getDayOfYear
	 * @type Number
	 * @cat Plugins/Methods/Date
	 */
	add("getDayOfYear", function() {
		var tmpdtm = new Date("1/1/" + this.getFullYear());
		return Math.floor((this.getTime() - tmpdtm.getTime()) / 86400000);
	});
	
	/**
	 * Get the number of the week of the year.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.getWeekOfYear();
	 * @result 2
	 * 
	 * @name getWeekOfYear
	 * @type Number
	 * @cat Plugins/Methods/Date
	 */
	add("getWeekOfYear", function() {
		return Math.ceil(this.getDayOfYear() / 7);
	});

	/**
	 * Set the day of the year.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.setDayOfYear(1);
	 * dtm.toString();
	 * @result 'Tue Jan 01 2008 00:00:00'
	 * 
	 * @name setDayOfYear
	 * @type Date
	 * @cat Plugins/Methods/Date
	 */
	add("setDayOfYear", function(day) {
		this.setMonth(0);
		this.setDate(day);
		return this;
	});
	
	/**
	 * Add a number of years to the date object.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.addYears(1);
	 * dtm.toString();
	 * @result 'Mon Jan 12 2009 00:00:00'
	 * 
	 * @name addYears
	 * @type Date
	 * @cat Plugins/Methods/Date
	 */
	add("addYears", function(num) {
		this.setFullYear(this.getFullYear() + num);
		return this;
	});
	
	/**
	 * Add a number of months to the date object.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.addMonths(1);
	 * dtm.toString();
	 * @result 'Tue Feb 12 2008 00:00:00'
	 * 
	 * @name addMonths
	 * @type Date
	 * @cat Plugins/Methods/Date
	 */
	add("addMonths", function(num) {
		var tmpdtm = this.getDate();
		
		this.setMonth(this.getMonth() + num);
		
		if (tmpdtm > this.getDate())
			this.addDays(-this.getDate());
		
		return this;
	});
	
	/**
	 * Add a number of days to the date object.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.addDays(1);
	 * dtm.toString();
	 * @result 'Sun Jan 13 2008 00:00:00'
	 * 
	 * @name addDays
	 * @type Date
	 * @cat Plugins/Methods/Date
	 */
	add("addDays", function(num) {
		//this.setDate(this.getDate() + num);
		this.setTime(this.getTime() + (num*86400000) );
		return this;
	});
	
	/**
	 * Add a number of hours to the date object.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.addHours(24);
	 * dtm.toString();
	 * @result 'Sun Jan 13 2008 00:00:00'
	 * 
	 * @name addHours
	 * @type Date
	 * @cat Plugins/Methods/Date
	 */
	add("addHours", function(num) {
		this.setHours(this.getHours() + num);
		return this;
	});

	/**
	 * Add a number of minutes to the date object.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.addMinutes(60);
	 * dtm.toString();
	 * @result 'Sat Jan 12 2008 01:00:00'
	 * 
	 * @name addMinutes
	 * @type Date
	 * @cat Plugins/Methods/Date
	 */
	add("addMinutes", function(num) {
		this.setMinutes(this.getMinutes() + num);
		return this;
	});
	
	/**
	 * Add a number of seconds to the date object.
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.addSeconds(60);
	 * dtm.toString();
	 * @result 'Sat Jan 12 2008 00:01:00'
	 * 
	 * @name addSeconds
	 * @type Date
	 * @cat Plugins/Methods/Date
	 */
	add("addSeconds", function(num) {
		this.setSeconds(this.getSeconds() + num);
		return this;
	});
	
	/**
	 * Sets the time component of this Date to zero for cleaner, easier comparison of dates where time is not relevant.
	 * 
	 * @example var dtm = new Date();
	 * dtm.zeroTime();
	 * dtm.toString();
	 * @result 'Sat Jan 12 2008 00:01:00'
	 * 
	 * @name zeroTime
	 * @type Date
	 * @cat Plugins/Methods/Date
	 * @author Kelvin Luck
	 */
	add("zeroTime", function() {
		this.setMilliseconds(0);
		this.setSeconds(0);
		this.setMinutes(0);
		this.setHours(0);
		return this;
	});
	
	/**
	 * Returns a string representation of the date object according to Date.format.
	 * (Date.toString may be used in other places so I purposefully didn't overwrite it)
	 * 
	 * @example var dtm = new Date("01/12/2008");
	 * dtm.asString();
	 * @result '12/01/2008' // (where Date.format == 'dd/mm/yyyy'
	 * 
	 * @name asString
	 * @type Date
	 * @cat Plugins/Methods/Date
	 * @author Kelvin Luck
	 */
	add("asString", function(format) {
		var r = format || Date.format;
		return r
			.split('yyyy').join(this.getFullYear())
			.split('yy').join((this.getFullYear() + '').substring(2))
			.split('mmmm').join(this.getMonthName(false))
			.split('mmm').join(this.getMonthName(true))
			.split('mm').join(_zeroPad(this.getMonth()+1))
			.split('dd').join(_zeroPad(this.getDate()));
	});
	
	/**
	 * Returns a new date object created from the passed String according to Date.format or false if the attempt to do this results in an invalid date object
	 * (We can't simple use Date.parse as it's not aware of locale and I chose not to overwrite it incase it's functionality is being relied on elsewhere)
	 *
	 * @example var dtm = Date.fromString("12/01/2008");
	 * dtm.toString();
	 * @result 'Sat Jan 12 2008 00:00:00' // (where Date.format == 'dd/mm/yyyy'
	 * 
	 * @name fromString
	 * @type Date
	 * @cat Plugins/Methods/Date
	 * @author Kelvin Luck
	 */
	Date.fromString = function(s)
	{
		var f = Date.format;
		var d = new Date('01/01/1977');
		
		var mLength = 0;

		var iM = f.indexOf('mmmm');
		if (iM > -1) {
			for (var i=0; i<Date.monthNames.length; i++) {
				var mStr = s.substr(iM, Date.monthNames[i].length);
				if (Date.monthNames[i] == mStr) {
					mLength = Date.monthNames[i].length - 4;
					break;
				}
			}
			d.setMonth(i);
		} else {
			iM = f.indexOf('mmm');
			if (iM > -1) {
				var mStr = s.substr(iM, 3);
				for (var i=0; i<Date.abbrMonthNames.length; i++) {
					if (Date.abbrMonthNames[i] == mStr) break;
				}
				d.setMonth(i);
			} else {
				d.setMonth(Number(s.substr(f.indexOf('mm'), 2)) - 1);
			}
		}
		
		var iY = f.indexOf('yyyy');

		if (iY > -1) {
			if (iM < iY)
			{
				iY += mLength;
			}
			d.setFullYear(Number(s.substr(iY, 4)));
		} else {
			if (iM < iY)
			{
				iY += mLength;
			}
			// TODO - this doesn't work very well - are there any rules for what is meant by a two digit year?
			d.setFullYear(Number(Date.fullYearStart + s.substr(f.indexOf('yy'), 2)));
		}
		var iD = f.indexOf('dd');
		if (iM < iD)
		{
			iD += mLength;
		}
		d.setDate(Number(s.substr(iD, 2)));
		if (isNaN(d.getTime())) {
			return false;
		}
		return d;
	};
	
	// utility method
	var _zeroPad = function(num) {
		var s = '0'+num;
		return s.substring(s.length-2)
		//return ('0'+num).substring(-2); // doesn't work on IE :(
	};
	
})();
/**
 * Copyright (c) 2008 Kelvin Luck (http://www.kelvinluck.com/)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * $Id: jquery.datePicker.js 52 2009-02-09 06:16:11Z kelvin.luck $
 **/

(function($){
    
	$.fn.extend({
/**
 * Render a calendar table into any matched elements.
 * 
 * @param Object s (optional) Customize your calendars.
 * @option Number month The month to render (NOTE that months are zero based). Default is today's month.
 * @option Number year The year to render. Default is today's year.
 * @option Function renderCallback A reference to a function that is called as each cell is rendered and which can add classes and event listeners to the created nodes. Default is no callback.
 * @option Number showHeader Whether or not to show the header row, possible values are: $.dpConst.SHOW_HEADER_NONE (no header), $.dpConst.SHOW_HEADER_SHORT (first letter of each day) and $.dpConst.SHOW_HEADER_LONG (full name of each day). Default is $.dpConst.SHOW_HEADER_SHORT.
 * @option String hoverClass The class to attach to each cell when you hover over it (to allow you to use hover effects in IE6 which doesn't support the :hover pseudo-class on elements other than links). Default is dp-hover. Pass false if you don't want a hover class.
 * @type jQuery
 * @name renderCalendar
 * @cat plugins/datePicker
 * @author Kelvin Luck (http://www.kelvinluck.com/)
 *
 * @example $('#calendar-me').renderCalendar({month:0, year:2007});
 * @desc Renders a calendar displaying January 2007 into the element with an id of calendar-me.
 *
 * @example
 * var testCallback = function($td, thisDate, month, year)
 * {
 * if ($td.is('.current-month') && thisDate.getDay() == 4) {
 *		var d = thisDate.getDate();
 *		$td.bind(
 *			'click',
 *			function()
 *			{
 *				alert('You clicked on ' + d + '/' + (Number(month)+1) + '/' + year);
 *			}
 *		).addClass('thursday');
 *	} else if (thisDate.getDay() == 5) {
 *		$td.html('Friday the ' + $td.html() + 'th');
 *	}
 * }
 * $('#calendar-me').renderCalendar({month:0, year:2007, renderCallback:testCallback});
 * 
 * @desc Renders a calendar displaying January 2007 into the element with an id of calendar-me. Every Thursday in the current month has a class of "thursday" applied to it, is clickable and shows an alert when clicked. Every Friday on the calendar has the number inside replaced with text.
 **/
		renderCalendar  :   function(s)
		{
			var dc = function(a)
			{
				return document.createElement(a);
			};

			s = $.extend({}, $.fn.datePicker.defaults, s);
			
			if (s.showHeader != $.dpConst.SHOW_HEADER_NONE) {
				var headRow = $(dc('tr'));
				for (var i=Date.firstDayOfWeek; i<Date.firstDayOfWeek+7; i++) {
					var weekday = i%7;
					var day = Date.dayNames[weekday];
					headRow.append(
						jQuery(dc('th')).attr({'scope':'col', 'abbr':day, 'title':day, 'class':(weekday == 0 || weekday == 6 ? 'weekend' : 'weekday')}).html(s.showHeader == $.dpConst.SHOW_HEADER_SHORT ? day.substr(0, 1) : day)
					);
				}
			};
			
			var calendarTable = $(dc('table'))
									.attr(
										{
											'cellspacing':2,
											'className':'jCalendar'
										}
									)
									.append(
										(s.showHeader != $.dpConst.SHOW_HEADER_NONE ? 
											$(dc('thead'))
												.append(headRow)
											:
											dc('thead')
										)
									);
			var tbody = $(dc('tbody'));
			
			var today = (new Date()).zeroTime();
			
			var month = s.month == undefined ? today.getMonth() : s.month;
			var year = s.year || today.getFullYear();
			
			var currentDate = new Date(year, month, 1);
			
			
			var firstDayOffset = Date.firstDayOfWeek - currentDate.getDay() + 1;
			if (firstDayOffset > 1) firstDayOffset -= 7;
			var weeksToDraw = Math.ceil(( (-1*firstDayOffset+1) + currentDate.getDaysInMonth() ) /7);
			currentDate.addDays(firstDayOffset-1);
			
			var doHover = function(firstDayInBounds)
			{
				return function()
				{
					if (s.hoverClass) {
						var $this = $(this);
						if (!s.selectWeek) {
							$this.addClass(s.hoverClass);
						} else if (firstDayInBounds && !$this.is('.disabled')) {
							$this.parent().addClass('activeWeekHover');
						}
					}
				}
			};
			var unHover = function()
			{
				if (s.hoverClass) {
					var $this = $(this);
					$this.removeClass(s.hoverClass);
					$this.parent().removeClass('activeWeekHover');
				}
			};	
			
			var w = 0;
			while (w++<weeksToDraw) {
				var r = jQuery(dc('tr'));
				var firstDayInBounds = s.dpController ? currentDate > s.dpController.startDate : false;
				for (var i=0; i<7; i++) {
					var thisMonth = currentDate.getMonth() == month;
					var d = $(dc('td'))
								.text(currentDate.getDate() + '')
								.attr('className', (thisMonth ? 'current-month ' : 'other-month ') +
													(currentDate.isWeekend() ? 'weekend ' : 'weekday ') +
													(thisMonth && currentDate.getTime() == today.getTime() ? 'today ' : '')
								)
								.data('datePickerDate', currentDate.asString())
								.hover(doHover(firstDayInBounds), unHover)
							;
					r.append(d);
					if (s.renderCallback) {
						s.renderCallback(d, currentDate, month, year);
					}
					currentDate.addDays(1);
				}
				tbody.append(r);
			}
			calendarTable.append(tbody);
			
			return this.each(
				function()
				{
					$(this).empty().append(calendarTable);
				}
			);
		},
/**
 * Create a datePicker associated with each of the matched elements.
 *
 * The matched element will receive a few custom events with the following signatures:
 *
 * dateSelected(event, date, $td, status)
 * Triggered when a date is selected. event is a reference to the event, date is the Date selected, $td is a jquery object wrapped around the TD that was clicked on and status is whether the date was selected (true) or deselected (false)
 * 
 * dpClosed(event, selected)
 * Triggered when the date picker is closed. event is a reference to the event and selected is an Array containing Date objects.
 *
 * dpMonthChanged(event, displayedMonth, displayedYear)
 * Triggered when the month of the popped up calendar is changed. event is a reference to the event, displayedMonth is the number of the month now displayed (zero based) and displayedYear is the year of the month.
 *
 * dpDisplayed(event, $datePickerDiv)
 * Triggered when the date picker is created. $datePickerDiv is the div containing the date picker. Use this event to add custom content/ listeners to the popped up date picker.
 *
 * @param Object s (optional) Customize your date pickers.
 * @option Number month The month to render when the date picker is opened (NOTE that months are zero based). Default is today's month.
 * @option Number year The year to render when the date picker is opened. Default is today's year.
 * @option String startDate The first date date can be selected.
 * @option String endDate The last date that can be selected.
 * @option Boolean inline Whether to create the datePicker as inline (e.g. always on the page) or as a model popup. Default is false (== modal popup)
 * @option Boolean createButton Whether to create a .dp-choose-date anchor directly after the matched element which when clicked will trigger the showing of the date picker. Default is true.
 * @option Boolean showYearNavigation Whether to display buttons which allow the user to navigate through the months a year at a time. Default is true.
 * @option Boolean closeOnSelect Whether to close the date picker when a date is selected. Default is true.
 * @option Boolean displayClose Whether to create a "Close" button within the date picker popup. Default is false.
 * @option Boolean selectMultiple Whether a user should be able to select multiple dates with this date picker. Default is false.
 * @option Number numSelectable The maximum number of dates that can be selected where selectMultiple is true. Default is a very high number.
 * @option Boolean clickInput If the matched element is an input type="text" and this option is true then clicking on the input will cause the date picker to appear.
 * @option Boolean rememberViewedMonth Whether the datePicker should remember the last viewed month and open on it. If false then the date picker will always open with the month for the first selected date visible.
 * @option Boolean selectWeek Whether to select a complete week at a time...
 * @option Number verticalPosition The vertical alignment of the popped up date picker to the matched element. One of $.dpConst.POS_TOP and $.dpConst.POS_BOTTOM. Default is $.dpConst.POS_TOP.
 * @option Number horizontalPosition The horizontal alignment of the popped up date picker to the matched element. One of $.dpConst.POS_LEFT and $.dpConst.POS_RIGHT.
 * @option Number verticalOffset The number of pixels offset from the defined verticalPosition of this date picker that it should pop up in. Default in 0.
 * @option Number horizontalOffset The number of pixels offset from the defined horizontalPosition of this date picker that it should pop up in. Default in 0.
 * @option (Function|Array) renderCallback A reference to a function (or an array of seperate functions) that is called as each cell is rendered and which can add classes and event listeners to the created nodes. Each callback function will receive four arguments; a jquery object wrapping the created TD, a Date object containing the date this TD represents, a number giving the currently rendered month and a number giving the currently rendered year. Default is no callback.
 * @option String hoverClass The class to attach to each cell when you hover over it (to allow you to use hover effects in IE6 which doesn't support the :hover pseudo-class on elements other than links). Default is dp-hover. Pass false if you don't want a hover class.
 * @type jQuery
 * @name datePicker
 * @cat plugins/datePicker
 * @author Kelvin Luck (http://www.kelvinluck.com/)
 *
 * @example $('input.date-picker').datePicker();
 * @desc Creates a date picker button next to all matched input elements. When the button is clicked on the value of the selected date will be placed in the corresponding input (formatted according to Date.format).
 *
 * @example demo/index.html
 * @desc See the projects homepage for many more complex examples...
 **/
		datePicker : function(s)
		{			
			if (!$.event._dpCache) $.event._dpCache = [];
			
			// initialise the date picker controller with the relevant settings...
			s = $.extend({}, $.fn.datePicker.defaults, s);
			
			return this.each(
				function()
				{
					var $this = $(this);
					var alreadyExists = true;
					
					if (!this._dpId) {
						this._dpId = $.event.guid++;
						$.event._dpCache[this._dpId] = new DatePicker(this);
						alreadyExists = false;
					}
					
					if (s.inline) {
						s.createButton = false;
						s.displayClose = false;
						s.closeOnSelect = false;
						$this.empty();
					}
					
					var controller = $.event._dpCache[this._dpId];
					
					controller.init(s);
					
					if (!alreadyExists && s.createButton) {
						// create it!
						controller.button = $('<a href="#" class="dp-choose-date" title="' + $.dpText.TEXT_CHOOSE_DATE + '">' + $.dpText.TEXT_CHOOSE_DATE + '</a>')
								.bind(
									'click',
									function()
									{
										$this.dpDisplay(this);
										this.blur();
										return false;
									}
								);
						$this.after(controller.button);
					}
					
					if (!alreadyExists && $this.is(':text')) {
						$this
							.bind(
								'dateSelected',
								function(e, selectedDate, $td)
								{
									this.value = selectedDate.asString();
								}
							).bind(
								'change',
								function()
								{
									if (this.value != '') {
										var d = Date.fromString(this.value);
										if (d) {
											controller.setSelected(d, true, true);
										}
									}
								}
							);
						if (s.clickInput) {
							$this.bind(
								'click',
								function()
								{
									$this.dpDisplay();
								}
							);
						}
						var d = Date.fromString(this.value);
						if (this.value != '' && d) {
							controller.setSelected(d, true, true);
						}
					}
					
					$this.addClass('dp-applied');
					
				}
			)
		},
/**
 * Disables or enables this date picker
 *
 * @param Boolean s Whether to disable (true) or enable (false) this datePicker
 * @type jQuery
 * @name dpSetDisabled
 * @cat plugins/datePicker
 * @author Kelvin Luck (http://www.kelvinluck.com/)
 *
 * @example $('.date-picker').datePicker();
 * $('.date-picker').dpSetDisabled(true);
 * @desc Prevents this date picker from displaying and adds a class of dp-disabled to it (and it's associated button if it has one) for styling purposes. If the matched element is an input field then it will also set the disabled attribute to stop people directly editing the field.
 **/
		dpSetDisabled : function(s)
		{
			return _w.call(this, 'setDisabled', s);
		},
/**
 * Updates the first selectable date for any date pickers on any matched elements.
 *
 * @param String d A string representing the first selectable date (formatted according to Date.format).
 * @type jQuery
 * @name dpSetStartDate
 * @cat plugins/datePicker
 * @author Kelvin Luck (http://www.kelvinluck.com/)
 *
 * @example $('.date-picker').datePicker();
 * $('.date-picker').dpSetStartDate('01/01/2000');
 * @desc Creates a date picker associated with all elements with a class of "date-picker" then sets the first selectable date for each of these to the first day of the millenium.
 **/
		dpSetStartDate : function(d)
		{
			return _w.call(this, 'setStartDate', d);
		},
/**
 * Updates the last selectable date for any date pickers on any matched elements.
 *
 * @param String d A string representing the last selectable date (formatted according to Date.format).
 * @type jQuery
 * @name dpSetEndDate
 * @cat plugins/datePicker
 * @author Kelvin Luck (http://www.kelvinluck.com/)
 *
 * @example $('.date-picker').datePicker();
 * $('.date-picker').dpSetEndDate('01/01/2010');
 * @desc Creates a date picker associated with all elements with a class of "date-picker" then sets the last selectable date for each of these to the first Janurary 2010.
 **/
		dpSetEndDate : function(d)
		{
			return _w.call(this, 'setEndDate', d);
		},
/**
 * Gets a list of Dates currently selected by this datePicker. This will be an empty array if no dates are currently selected or NULL if there is no datePicker associated with the matched element.
 *
 * @type Array
 * @name dpGetSelected
 * @cat plugins/datePicker
 * @author Kelvin Luck (http://www.kelvinluck.com/)
 *
 * @example $('.date-picker').datePicker();
 * alert($('.date-picker').dpGetSelected());
 * @desc Will alert an empty array (as nothing is selected yet)
 **/
		dpGetSelected : function()
		{
			var c = _getController(this[0]);
			if (c) {
				return c.getSelected();
			}
			return null;
		},
/**
 * Selects or deselects a date on any matched element's date pickers. Deselcting is only useful on date pickers where selectMultiple==true. Selecting will only work if the passed date is within the startDate and endDate boundries for a given date picker.
 *
 * @param String d A string representing the date you want to select (formatted according to Date.format).
 * @param Boolean v Whether you want to select (true) or deselect (false) this date. Optional - default = true.
 * @param Boolean m Whether you want the date picker to open up on the month of this date when it is next opened. Optional - default = true.
 * @type jQuery
 * @name dpSetSelected
 * @cat plugins/datePicker
 * @author Kelvin Luck (http://www.kelvinluck.com/)
 *
 * @example $('.date-picker').datePicker();
 * $('.date-picker').dpSetSelected('01/01/2010');
 * @desc Creates a date picker associated with all elements with a class of "date-picker" then sets the selected date on these date pickers to the first Janurary 2010. When the date picker is next opened it will display Janurary 2010.
 **/
		dpSetSelected : function(d, v, m)
		{
			if (v == undefined) v=true;
			if (m == undefined) m=true;
			return _w.call(this, 'setSelected', Date.fromString(d), v, m, true);
		},
/**
 * Sets the month that will be displayed when the date picker is next opened. If the passed month is before startDate then the month containing startDate will be displayed instead. If the passed month is after endDate then the month containing the endDate will be displayed instead.
 *
 * @param Number m The month you want the date picker to display. Optional - defaults to the currently displayed month.
 * @param Number y The year you want the date picker to display. Optional - defaults to the currently displayed year.
 * @type jQuery
 * @name dpSetDisplayedMonth
 * @cat plugins/datePicker
 * @author Kelvin Luck (http://www.kelvinluck.com/)
 *
 * @example $('.date-picker').datePicker();
 * $('.date-picker').dpSetDisplayedMonth(10, 2008);
 * @desc Creates a date picker associated with all elements with a class of "date-picker" then sets the selected date on these date pickers to the first Janurary 2010. When the date picker is next opened it will display Janurary 2010.
 **/
		dpSetDisplayedMonth : function(m, y)
		{
			return _w.call(this, 'setDisplayedMonth', Number(m), Number(y), true);
		},
/**
 * Displays the date picker associated with the matched elements. Since only one date picker can be displayed at once then the date picker associated with the last matched element will be the one that is displayed.
 *
 * @param HTMLElement e An element that you want the date picker to pop up relative in position to. Optional - default behaviour is to pop up next to the element associated with this date picker.
 * @type jQuery
 * @name dpDisplay
 * @cat plugins/datePicker
 * @author Kelvin Luck (http://www.kelvinluck.com/)
 *
 * @example $('#date-picker').datePicker();
 * $('#date-picker').dpDisplay();
 * @desc Creates a date picker associated with the element with an id of date-picker and then causes it to pop up.
 **/
		dpDisplay : function(e)
		{
			return _w.call(this, 'display', e);
		},
/**
 * Sets a function or array of functions that is called when each TD of the date picker popup is rendered to the page
 *
 * @param (Function|Array) a A function or an array of functions that are called when each td is rendered. Each function will receive four arguments; a jquery object wrapping the created TD, a Date object containing the date this TD represents, a number giving the currently rendered month and a number giving the currently rendered year.
 * @type jQuery
 * @name dpSetRenderCallback
 * @cat plugins/datePicker
 * @author Kelvin Luck (http://www.kelvinluck.com/)
 *
 * @example $('#date-picker').datePicker();
 * $('#date-picker').dpSetRenderCallback(function($td, thisDate, month, year)
 * {
 * 	// do stuff as each td is rendered dependant on the date in the td and the displayed month and year
 * });
 * @desc Creates a date picker associated with the element with an id of date-picker and then creates a function which is called as each td is rendered when this date picker is displayed.
 **/
		dpSetRenderCallback : function(a)
		{
			return _w.call(this, 'setRenderCallback', a);
		},
/**
 * Sets the position that the datePicker will pop up (relative to it's associated element)
 *
 * @param Number v The vertical alignment of the created date picker to it's associated element. Possible values are $.dpConst.POS_TOP and $.dpConst.POS_BOTTOM
 * @param Number h The horizontal alignment of the created date picker to it's associated element. Possible values are $.dpConst.POS_LEFT and $.dpConst.POS_RIGHT
 * @type jQuery
 * @name dpSetPosition
 * @cat plugins/datePicker
 * @author Kelvin Luck (http://www.kelvinluck.com/)
 *
 * @example $('#date-picker').datePicker();
 * $('#date-picker').dpSetPosition($.dpConst.POS_BOTTOM, $.dpConst.POS_RIGHT);
 * @desc Creates a date picker associated with the element with an id of date-picker and makes it so that when this date picker pops up it will be bottom and right aligned to the #date-picker element.
 **/
		dpSetPosition : function(v, h)
		{
			return _w.call(this, 'setPosition', v, h);
		},
/**
 * Sets the offset that the popped up date picker will have from it's default position relative to it's associated element (as set by dpSetPosition)
 *
 * @param Number v The vertical offset of the created date picker.
 * @param Number h The horizontal offset of the created date picker.
 * @type jQuery
 * @name dpSetOffset
 * @cat plugins/datePicker
 * @author Kelvin Luck (http://www.kelvinluck.com/)
 *
 * @example $('#date-picker').datePicker();
 * $('#date-picker').dpSetOffset(-20, 200);
 * @desc Creates a date picker associated with the element with an id of date-picker and makes it so that when this date picker pops up it will be 20 pixels above and 200 pixels to the right of it's default position.
 **/
		dpSetOffset : function(v, h)
		{
			return _w.call(this, 'setOffset', v, h);
		},
/**
 * Closes the open date picker associated with this element.
 *
 * @type jQuery
 * @name dpClose
 * @cat plugins/datePicker
 * @author Kelvin Luck (http://www.kelvinluck.com/)
 *
 * @example $('.date-pick')
 *		.datePicker()
 *		.bind(
 *			'focus',
 *			function()
 *			{
 *				$(this).dpDisplay();
 *			}
 *		).bind(
 *			'blur',
 *			function()
 *			{
 *				$(this).dpClose();
 *			}
 *		);
 * @desc Creates a date picker and makes it appear when the relevant element is focused and disappear when it is blurred.
 **/
		dpClose : function()
		{
			return _w.call(this, '_closeCalendar', false, this[0]);
		},
		// private function called on unload to clean up any expandos etc and prevent memory links...
		_dpDestroy : function()
		{
			// TODO - implement this?
		}
	});
	
	// private internal function to cut down on the amount of code needed where we forward
	// dp* methods on the jQuery object on to the relevant DatePicker controllers...
	var _w = function(f, a1, a2, a3, a4)
	{
		return this.each(
			function()
			{
				var c = _getController(this);
				if (c) {
					c[f](a1, a2, a3, a4);
				}
			}
		);
	};
	
	function DatePicker(ele)
	{
		this.ele = ele;
		
		// initial values...
		this.displayedMonth		=	null;
		this.displayedYear		=	null;
		this.startDate			=	null;
		this.endDate			=	null;
		this.showYearNavigation	=	null;
		this.closeOnSelect		=	null;
		this.displayClose		=	null;
		this.rememberViewedMonth=	null;
		this.selectMultiple		=	null;
		this.numSelectable		=	null;
		this.numSelected		=	null;
		this.verticalPosition	=	null;
		this.horizontalPosition	=	null;
		this.verticalOffset		=	null;
		this.horizontalOffset	=	null;
		this.button				=	null;
		this.renderCallback		=	[];
		this.selectedDates		=	{};
		this.inline				=	null;
		this.context			=	'#dp-popup';
		this.settings			=	{};
	};
	$.extend(
		DatePicker.prototype,
		{	
			init : function(s)
			{
				this.setStartDate(s.startDate);
				this.setEndDate(s.endDate);
				this.setDisplayedMonth(Number(s.month), Number(s.year));
				this.setRenderCallback(s.renderCallback);
				this.showYearNavigation = s.showYearNavigation;
				this.closeOnSelect = s.closeOnSelect;
				this.displayClose = s.displayClose;
				this.rememberViewedMonth =	s.rememberViewedMonth;
				this.selectMultiple = s.selectMultiple;
				this.numSelectable = s.selectMultiple ? s.numSelectable : 1;
				this.numSelected = 0;
				this.verticalPosition = s.verticalPosition;
				this.horizontalPosition = s.horizontalPosition;
				this.hoverClass = s.hoverClass;
				this.setOffset(s.verticalOffset, s.horizontalOffset);
				this.inline = s.inline;
				this.settings = s;
				if (this.inline) {
					this.context = this.ele;
					this.display();
				}
			},
			setStartDate : function(d)
			{
				if (d) {
					this.startDate = Date.fromString(d);
				}
				if (!this.startDate) {
					this.startDate = (new Date()).zeroTime();
				}
				this.setDisplayedMonth(this.displayedMonth, this.displayedYear);
			},
			setEndDate : function(d)
			{
				if (d) {
					this.endDate = Date.fromString(d);
				}
				if (!this.endDate) {
					this.endDate = (new Date('12/31/2999')); // using the JS Date.parse function which expects mm/dd/yyyy
				}
				if (this.endDate.getTime() < this.startDate.getTime()) {
					this.endDate = this.startDate;
				}
				this.setDisplayedMonth(this.displayedMonth, this.displayedYear);
			},
			setPosition : function(v, h)
			{
				this.verticalPosition = v;
				this.horizontalPosition = h;
			},
			setOffset : function(v, h)
			{
				this.verticalOffset = parseInt(v) || 0;
				this.horizontalOffset = parseInt(h) || 0;
			},
			setDisabled : function(s)
			{
				$e = $(this.ele);
				$e[s ? 'addClass' : 'removeClass']('dp-disabled');
				if (this.button) {
					$but = $(this.button);
					$but[s ? 'addClass' : 'removeClass']('dp-disabled');
					$but.attr('title', s ? '' : $.dpText.TEXT_CHOOSE_DATE);
				}
				if ($e.is(':text')) {
					$e.attr('disabled', s ? 'disabled' : '');
				}
			},
			setDisplayedMonth : function(m, y, rerender)
			{
				if (this.startDate == undefined || this.endDate == undefined) {
					return;
				}
				var s = new Date(this.startDate.getTime());
				s.setDate(1);
				var e = new Date(this.endDate.getTime());
				e.setDate(1);
				
				var t;
				if ((!m && !y) || (isNaN(m) && isNaN(y))) {
					// no month or year passed - default to current month
					t = new Date().zeroTime();
					t.setDate(1);
				} else if (isNaN(m)) {
					// just year passed in - presume we want the displayedMonth
					t = new Date(y, this.displayedMonth, 1);
				} else if (isNaN(y)) {
					// just month passed in - presume we want the displayedYear
					t = new Date(this.displayedYear, m, 1);
				} else {
					// year and month passed in - that's the date we want!
					t = new Date(y, m, 1)
				}
				// check if the desired date is within the range of our defined startDate and endDate
				if (t.getTime() < s.getTime()) {
					t = s;
				} else if (t.getTime() > e.getTime()) {
					t = e;
				}
				var oldMonth = this.displayedMonth;
				var oldYear = this.displayedYear;
				this.displayedMonth = t.getMonth();
				this.displayedYear = t.getFullYear();

				if (rerender && (this.displayedMonth != oldMonth || this.displayedYear != oldYear))
				{
					this._rerenderCalendar();
					$(this.ele).trigger('dpMonthChanged', [this.displayedMonth, this.displayedYear]);
				}
			},
			setSelected : function(d, v, moveToMonth, dispatchEvents)
			{
				var s = this.settings;
				if (s.selectWeek)
				{
					d = d.addDays(- (d.getDay() - Date.firstDayOfWeek + 7) % 7);
					if (d < this.startDate) // The first day of this week is before the start date so is unselectable...
					{
						return;
					}
				}
				if (v == this.isSelected(d)) // this date is already un/selected
				{
					return;
				}
				if (this.selectMultiple == false) {
					this.selectedDates = {};
					this.numSelected = 0;
					$('td.selected', this.context).removeClass('selected').parent().removeClass('selectedWeek');
				} else if (v && this.numSelected == this.numSelectable) {
					// can't select any more dates...
					return;
				}
				if (moveToMonth && (this.displayedMonth != d.getMonth() || this.displayedYear != d.getFullYear())) {
					this.setDisplayedMonth(d.getMonth(), d.getFullYear(), true);
				}
				this.selectedDates[d.toString()] = v;
				this.numSelected += v ? 1 : -1;
				var selectorString = 'td.' +( d.getMonth() == this.displayedMonth ? 'current-month' : 'other-month');
				var $td;
				$(selectorString, this.context).each(
					function()
					{
						if ($(this).data('datePickerDate') == d.asString()) {
							$td = $(this);
							if (s.selectWeek)
							{
								$td.parent()[v ? 'addClass' : 'removeClass']('selectedWeek');
							}
							$td[v ? 'addClass' : 'removeClass']('selected'); 
						}
					}
				);
				$('td', this.context).not('.selected')[this.selectMultiple &&  this.numSelected == this.numSelectable ? 'addClass' : 'removeClass']('unselectable');
				
				if (dispatchEvents)
				{
					var s = this.isSelected(d);
					$e = $(this.ele);
					var dClone = Date.fromString(d.asString());
					$e.trigger('dateSelected', [dClone, $td, s]);
					$e.trigger('change');
				}
			},
			isSelected : function(d)
			{
				return this.selectedDates[d.toString()];
			},
			getSelected : function()
			{
				var r = [];
				for(s in this.selectedDates) {
					if (this.selectedDates[s] == true) {
						r.push(Date.parse(s));
					}
				}
				return r;
			},
			display : function(eleAlignTo)
			{
				if ($(this.ele).is('.dp-disabled')) return;
				
				eleAlignTo = eleAlignTo || this.ele;
				var c = this;
				var $ele = $(eleAlignTo);
				var eleOffset = $ele.offset();
				
				var $createIn;
				var attrs;
				var attrsCalendarHolder;
				var cssRules;
				
				if (c.inline) {
					$createIn = $(this.ele);
					attrs = {
						'id'		:	'calendar-' + this.ele._dpId,
						'className'	:	'dp-popup dp-popup-inline'
					};

					$('.dp-popup', $createIn).remove();
					cssRules = {
					};
				} else {
					$createIn = $('body');
					attrs = {
						'id'		:	'dp-popup',
						'className'	:	'dp-popup'
					};
					cssRules = {
						'top'	:	eleOffset.top + c.verticalOffset,
						'left'	:	eleOffset.left + c.horizontalOffset
					};
					
					var _checkMouse = function(e)
					{
						var el = e.target;
						var cal = $('#dp-popup')[0];
						
						while (true){
							if (el == cal) {
								return true;
							} else if (el == document) {
								c._closeCalendar();
								return false;
							} else {
								el = $(el).parent()[0];
							}
						}
					};
					this._checkMouse = _checkMouse;
					
					c._closeCalendar(true);
					$(document).bind(
						'keydown.datepicker', 
						function(event)
						{
							if (event.keyCode == 27) {
								c._closeCalendar();
							}
						}
					);
				}
				
				if (!c.rememberViewedMonth)
				{
					var selectedDate = this.getSelected()[0];
					if (selectedDate) {
						selectedDate = new Date(selectedDate);
						this.setDisplayedMonth(selectedDate.getMonth(), selectedDate.getFullYear(), false);
					}
				}
				
				$createIn
					.append(
						$('<div></div>')
							.attr(attrs)
							.css(cssRules)
							.append(
//								$('<a href="#" class="selecteee">aaa</a>'),
								$('<h2></h2>'),
								$('<div class="dp-nav-prev"></div>')
									.append(
										$('<a class="dp-nav-prev-year" href="#" title="' + $.dpText.TEXT_PREV_YEAR + '">&lt;&lt;</a>')
											.bind(
												'click',
												function()
												{
													return c._displayNewMonth.call(c, this, 0, -1);
												}
											),
										$('<a class="dp-nav-prev-month" href="#" title="' + $.dpText.TEXT_PREV_MONTH + '">&lt;</a>')
											.bind(
												'click',
												function()
												{
													return c._displayNewMonth.call(c, this, -1, 0);
												}
											)
									),
								$('<div class="dp-nav-next"></div>')
									.append(
										$('<a class="dp-nav-next-year" href="#" title="' + $.dpText.TEXT_NEXT_YEAR + '">&gt;&gt;</a>')
											.bind(
												'click',
												function()
												{
													return c._displayNewMonth.call(c, this, 0, 1);
												}
											),
										$('<a class="dp-nav-next-month" href="#" title="' + $.dpText.TEXT_NEXT_MONTH + '">&gt;</a>')
											.bind(
												'click',
												function()
												{
													return c._displayNewMonth.call(c, this, 1, 0);
												}
											)
									),
								$('<div></div>')
									.attr('className', 'dp-calendar')
							)
							.bgIframe()
						);
					
				var $pop = this.inline ? $('.dp-popup', this.context) : $('#dp-popup');
				
				if (this.showYearNavigation == false) {
					$('.dp-nav-prev-year, .dp-nav-next-year', c.context).css('display', 'none');
				}
				if (this.displayClose) {
					$pop.append(
						$('<a href="#" id="dp-close">' + $.dpText.TEXT_CLOSE + '</a>')
							.bind(
								'click',
								function()
								{
									c._closeCalendar();
									return false;
								}
							)
					);
				}
				c._renderCalendar();

				$(this.ele).trigger('dpDisplayed', $pop);
				
				if (!c.inline) {
					if (this.verticalPosition == $.dpConst.POS_BOTTOM) {
						$pop.css('top', eleOffset.top + $ele.height() - $pop.height() + c.verticalOffset);
					}
					if (this.horizontalPosition == $.dpConst.POS_RIGHT) {
						$pop.css('left', eleOffset.left + $ele.width() - $pop.width() + c.horizontalOffset);
					}
//					$('.selectee', this.context).focus();
					$(document).bind('mousedown.datepicker', this._checkMouse);
				}
				
			},
			setRenderCallback : function(a)
			{
				if (a == null) return;
				if (a && typeof(a) == 'function') {
					a = [a];
				}
				this.renderCallback = this.renderCallback.concat(a);
			},
			cellRender : function ($td, thisDate, month, year) {
				var c = this.dpController;
				var d = new Date(thisDate.getTime());
				
				// add our click handlers to deal with it when the days are clicked...
				
				$td.bind(
					'click',
					function()
					{
						var $this = $(this);
						if (!$this.is('.disabled')) {
							c.setSelected(d, !$this.is('.selected') || !c.selectMultiple, false, true);
							if (c.closeOnSelect) {
								c._closeCalendar();
							}
							// TODO: Instead of this which doesn't work in IE anyway we should find the next focusable element in the document
							// and pass the focus onto that. That would allow the user to continue on the form as expected...
							if (!$.browser.msie)
							{
								$(c.ele).trigger('focus', [$.dpConst.DP_INTERNAL_FOCUS]);
							}
						}
					}
				);
				
				if (c.isSelected(d)) {
					$td.addClass('selected');
					if (c.settings.selectWeek)
					{
						$td.parent().addClass('selectedWeek');
					}
				} else  if (c.selectMultiple && c.numSelected == c.numSelectable) {
					$td.addClass('unselectable');
				}
				
			},
			_applyRenderCallbacks : function()
			{
				var c = this;
				$('td', this.context).each(
					function()
					{
						for (var i=0; i<c.renderCallback.length; i++) {
							$td = $(this);
							c.renderCallback[i].apply(this, [$td, Date.fromString($td.data('datePickerDate')), c.displayedMonth, c.displayedYear]);
						}
					}
				);
				return;
			},
			// ele is the clicked button - only proceed if it doesn't have the class disabled...
			// m and y are -1, 0 or 1 depending which direction we want to go in...
			_displayNewMonth : function(ele, m, y) 
			{
				if (!$(ele).is('.disabled')) {
					this.setDisplayedMonth(this.displayedMonth + m, this.displayedYear + y, true);
				}
				ele.blur();
				return false;
			},
			_rerenderCalendar : function()
			{
				this._clearCalendar();
				this._renderCalendar();
			},
			_renderCalendar : function()
			{
				// set the title...
				$('h2', this.context).html((new Date(this.displayedYear, this.displayedMonth, 1)).asString($.dpText.HEADER_FORMAT));
				
				// render the calendar...
				$('.dp-calendar', this.context).renderCalendar(
					$.extend(
						{},
						this.settings, 
						{
							month			: this.displayedMonth,
							year			: this.displayedYear,
							renderCallback	: this.cellRender,
							dpController	: this,
							hoverClass		: this.hoverClass
						})
				);
				
				// update the status of the control buttons and disable dates before startDate or after endDate...
				// TODO: When should the year buttons be disabled? When you can't go forward a whole year from where you are or is that annoying?
				if (this.displayedYear == this.startDate.getFullYear() && this.displayedMonth == this.startDate.getMonth()) {
					$('.dp-nav-prev-year', this.context).addClass('disabled');
					$('.dp-nav-prev-month', this.context).addClass('disabled');
					$('.dp-calendar td.other-month', this.context).each(
						function()
						{
							var $this = $(this);
							if (Number($this.text()) > 20) {
								$this.addClass('disabled');
							}
						}
					);
					var d = this.startDate.getDate();
					$('.dp-calendar td.current-month', this.context).each(
						function()
						{
							var $this = $(this);
							if (Number($this.text()) < d) {
								$this.addClass('disabled');
							}
						}
					);
				} else {
					$('.dp-nav-prev-year', this.context).removeClass('disabled');
					$('.dp-nav-prev-month', this.context).removeClass('disabled');
					var d = this.startDate.getDate();
					if (d > 20) {
						// check if the startDate is last month as we might need to add some disabled classes...
						var st = this.startDate.getTime();
						var sd = new Date(st);
						sd.addMonths(1);
						if (this.displayedYear == sd.getFullYear() && this.displayedMonth == sd.getMonth()) {
							$('.dp-calendar td.other-month', this.context).each(
								function()
								{
									var $this = $(this);
									if (Date.fromString($this.data('datePickerDate')).getTime() < st) {
										$this.addClass('disabled');
									}
								}
							);
						}
					}
				}
				if (this.displayedYear == this.endDate.getFullYear() && this.displayedMonth == this.endDate.getMonth()) {
					$('.dp-nav-next-year', this.context).addClass('disabled');
					$('.dp-nav-next-month', this.context).addClass('disabled');
					$('.dp-calendar td.other-month', this.context).each(
						function()
						{
							var $this = $(this);
							if (Number($this.text()) < 14) {
								$this.addClass('disabled');
							}
						}
					);
					var d = this.endDate.getDate();
					$('.dp-calendar td.current-month', this.context).each(
						function()
						{
							var $this = $(this);
							if (Number($this.text()) > d) {
								$this.addClass('disabled');
							}
						}
					);
				} else {
					$('.dp-nav-next-year', this.context).removeClass('disabled');
					$('.dp-nav-next-month', this.context).removeClass('disabled');
					var d = this.endDate.getDate();
					if (d < 13) {
						// check if the endDate is next month as we might need to add some disabled classes...
						var ed = new Date(this.endDate.getTime());
						ed.addMonths(-1);
						if (this.displayedYear == ed.getFullYear() && this.displayedMonth == ed.getMonth()) {
							$('.dp-calendar td.other-month', this.context).each(
								function()
								{
									var $this = $(this);
									if (Number($this.text()) > d) {
										$this.addClass('disabled');
									}
								}
							);
						}
					}
				}
				this._applyRenderCallbacks();
			},
			_closeCalendar : function(programatic, ele)
			{
				if (!ele || ele == this.ele)
				{
					$(document).unbind('mousedown.datepicker');
					$(document).unbind('keydown.datepicker');
					this._clearCalendar();
					$('#dp-popup a').unbind();
					$('#dp-popup').empty().remove();
					if (!programatic) {
						$(this.ele).trigger('dpClosed', [this.getSelected()]);
					}
				}
			},
			// empties the current dp-calendar div and makes sure that all events are unbound
			// and expandos removed to avoid memory leaks...
			_clearCalendar : function()
			{
				// TODO.
				$('.dp-calendar td', this.context).unbind();
				$('.dp-calendar', this.context).empty();
			}
		}
	);
	
	// static constants
	$.dpConst = {
		SHOW_HEADER_NONE	:	0,
		SHOW_HEADER_SHORT	:	1,
		SHOW_HEADER_LONG	:	2,
		POS_TOP				:	0,
		POS_BOTTOM			:	1,
		POS_LEFT			:	0,
		POS_RIGHT			:	1,
		DP_INTERNAL_FOCUS	:	'dpInternalFocusTrigger'
	};
	// localisable text
	$.dpText = {
		TEXT_PREV_YEAR		:	'Previous year',
		TEXT_PREV_MONTH		:	'Previous month',
		TEXT_NEXT_YEAR		:	'Next year',
		TEXT_NEXT_MONTH		:	'Next month',
		TEXT_CLOSE			:	'Close',
		TEXT_CHOOSE_DATE	:	'Choose date',
		HEADER_FORMAT		:	'mmmm yyyy'
	};
	// version
	$.dpVersion = '$Id: jquery.datePicker.js 52 2009-02-09 06:16:11Z kelvin.luck $';

	$.fn.datePicker.defaults = {
		month				: undefined,
		year				: undefined,
		showHeader			: $.dpConst.SHOW_HEADER_SHORT,
		startDate			: undefined,
		endDate				: undefined,
		inline				: false,
		renderCallback		: null,
		createButton		: true,
		showYearNavigation	: true,
		closeOnSelect		: true,
		displayClose		: false,
		selectMultiple		: false,
		numSelectable		: Number.MAX_VALUE,
		clickInput			: false,
		rememberViewedMonth	: true,
		selectWeek			: false,
		verticalPosition	: $.dpConst.POS_TOP,
		horizontalPosition	: $.dpConst.POS_LEFT,
		verticalOffset		: 0,
		horizontalOffset	: 0,
		hoverClass			: 'dp-hover'
	};

	function _getController(ele)
	{
		if (ele._dpId) return $.event._dpCache[ele._dpId];
		return false;
	};
	
	// make it so that no error is thrown if bgIframe plugin isn't included (allows you to use conditional
	// comments to only include bgIframe where it is needed in IE without breaking this plugin).
	if ($.fn.bgIframe == undefined) {
		$.fn.bgIframe = function() {return this; };
	};


	// clean-up
	$(window)
		.bind('unload', function() {
			var els = $.event._dpCache || [];
			for (var i in els) {
				$(els[i].ele)._dpDestroy();
			}
		});
		
	
})(jQuery);

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
/* 
 * Class that allows the user to view and edit comments for the currently selected
 * blog post
 *
 * @author Mike Pritchard (mike@apollosites.com)
 */
var CommentsEditDialog = {

    // ////////////////////////////////////////////////////////////////////////

    show : function(){

        var txt = "";
        txt += "<div id='apolloCommentEditor'>";
        txt += "    <div id='commentList'></div>"
        txt += "</div>";
        
        $('#apollo_dialog').html(txt);
        $('#apollo_dialog').dialog( 'destroy' );
        $('#apollo_dialog').dialog({
            modal: true,
            width:550,
            height: $(window).height()-100,
            resizable:false,
            buttons: {
                Ok: function() {
                    $(this).dialog('close');
                }
            },
            title: 'Edit Post Comments'});

        BlogAPI.getComments(DataStore.m_siteID, DataStore.m_currentPostID, CommentsEditDialog.onGotComments)
    },

    // ////////////////////////////////////////////////////////////////////////

    unapproveComment : function(comment_id){
        MediaAPI.updateCommentStatus(DataStore.m_siteID, comment_id, 'Pending', CommentsEditDialog.onUpdate);
    },

    // ////////////////////////////////////////////////////////////////////////

    approveComment : function(comment_id){
        MediaAPI.updateCommentStatus(DataStore.m_siteID, comment_id, 'Approved', CommentsEditDialog.onUpdate);
    },

    // ////////////////////////////////////////////////////////////////////////

    deleteComment : function(comment_id){
        MediaAPI.updateCommentStatus(DataStore.m_siteID, comment_id, 'Trash', CommentsEditDialog.onUpdate);
    },

    // ////////////////////////////////////////////////////////////////////////

    undeleteComment : function(comment_id){
        MediaAPI.updateCommentStatus(DataStore.m_siteID, comment_id, 'Pending', CommentsEditDialog.onUpdate);
    },

    // ////////////////////////////////////////////////////////////////////////

    onUpdate : function(commentID, newStatus){
        CommentsEditDialog.show();
    },
    
    // ////////////////////////////////////////////////////////////////////////

    m_comments : '',

    onGotComments : function(postID, comments){

        if (!comments || comments == undefined){
            $('commentList').html('no comments');
            return;
        }

        CommentsEditDialog.m_comments = comments;

        CommentsEditDialog.paintComments();
    },
    
    // ////////////////////////////////////////////////////////////////////////

    paintComments : function(){

        comments = CommentsEditDialog.m_comments;

        // 'Pending','Approved','Trash','Spam'

        var noPending = 0;
        var noTrashed = 0;
        var noSpam = 0;
        var noApproved = 0;
        
        for (var i=0; i<comments.length; i++){
            switch (comments[i].status){
                case 'Pending':noPending++;break;
                case 'Trash':noTrashed++;break;
                case 'Spam':noSpam++;break;
                case 'Approved':noApproved++;break;
            }
        }

        var txt = "";

        txt += "<h3 class='commentSummary'>" + noApproved + " comments approved, " + noPending + " awaiting approval</h3>";

        if (noPending != 0){
            txt += "<h3>Comments Pending Approval</h3>";
            for (var i=0; i<comments.length; i++){
                if (comments[i].status == 'Pending'){
                    txt += CommentsEditDialog.getCommentHTML(comments[i]);
                }
            }
        }

        if (noApproved != 0){
            txt += "<h3>Approved Comments</h3>";
            for (var i=0; i<comments.length; i++){
                if (comments[i].status == 'Approved'){
                    txt += CommentsEditDialog.getCommentHTML(comments[i]);
                }
            }
        }

        if (noTrashed != 0){
            txt += "<h3>Deleted</h3>";
            for (var i=0; i<comments.length; i++){
                if (comments[i].status == 'Trash'){
                    txt += CommentsEditDialog.getCommentHTML(comments[i]);
                }
            }
        }
/*
        txt += "<h3>Spam</h3>";

        for (var i=0; i<comments.length; i++){
            if (comments[i].status == 'Spam'){
                txt += CommentsEditDialog.getCommentHTML(comments[i]);
            }
        }
*/
        $('#commentList').html(txt);
        
    },

    // ////////////////////////////////////////////////////////////////////////

    getCommentHTML : function(commentObj){

        var txt = "";
        var id = commentObj.id;
        var dt = new Date(commentObj.created);
        // For formats, see http://www.opengroup.org/onlinepubs/007908799/xsh/strftime.html
        var dateStr = dt.toLocaleFormat("%I:%M%p, %a, %b %e, %Y");

        var classStr = "";
        switch (commentObj.status){
            case 'Pending':classStr = "pending_comment";break;
            case 'Trash':classStr = "trashed_comment";break;
            case 'Spam':classStr = "spam_comment";break;
            case 'Approved':classStr = "approved_comment";break;
        }

        txt += "<div class='commentWrapper " + classStr + "'>";

        txt += "    <div class='commentTitle'>";
        txt += "        By <span class='commentName'>" + commentObj.name + "</span> on <span class='commentDate'>" + dateStr + "</span>";
        
        if (commentObj.status == 'Trash'){
            txt += "    <a href='#' class='commentEdit' onclick=\"CommentsEditDialog.undeleteComment("+id+")\">undelete</a>";
        }
        else {
            txt += "    <a href='#' class='commentEdit' onclick=\"CommentsEditDialog.deleteComment("+id+")\">delete</a>";
        }
        
        if (commentObj.status == 'Pending'){
            txt += "    <a href='#' class='commentEdit' onclick=\"CommentsEditDialog.approveComment("+id+")\">approve</a>";
        }
        else if (commentObj.status == 'Approved'){
            txt += "    <a href='#' class='commentEdit' onclick=\"CommentsEditDialog.unapproveComment("+id+")\">unapprove</a>";
        }
        txt += "    </div>";

        txt += "    <div class='commentContents'>"+commentObj.content+"</div>";
        txt += "</div>";

        return txt;
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
var PagesSidebarFrame = {
	
    m_targetDiv : '',
	
    /** Number of tags per 'page' */
    m_tagsPerPage : 25,    
    m_currentPage : 0,    
    m_numberPages : 0,
	
    // ////////////////////////////////////////////////////////////////////////////
	
    /**
	*
	*/
    paint : function(targetDiv){
		
        PagesSidebarFrame.m_targetDiv = targetDiv;
		
        var txt = "";

        txt += "<div id='apollo_page_list'></div>";
		
        txt += "<div id='pagesSidebarControls' class='sidebar_page_controls'>";        
        txt += "<table border='0'>";
        txt += "    <tr>";
        txt += "        <td width='33%' align='left'><span class='more_posts_link' id='prev_pages_link' style='padding-left:15px' onclick='PagesSidebarFrame.showPrevPage()' title='Display previous page'>&laquo; prev</span></td>";
        txt += "        <td width='33%' align='center'><span class='more_posts_pages' id='pages_sideframe_page_no' style=''>1 of 2</span></td>";                
        txt += "        <td width='33%' align='right'><span class='more_posts_link' id='next_pages_link' style='padding-right:15px' onclick='PagesSidebarFrame.showNextPage()' title='Display next page'>next &raquo;</span></td>";
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

		var pos = $(targetDiv).position();

		var offset = pos.top;
		var lineht = 25;				
		var h = $('.ViewFrame').height() - offset - $('#pagesSidebarControls').height(); 
				    		    	    		
		PagesSidebarFrame.m_tagsPerPage = Math.floor(h / lineht);		
        PagesSidebarFrame.m_numberPages = Math.ceil( DataStore.m_pageList.length / PagesSidebarFrame.m_tagsPerPage);
                        
        if (PagesSidebarFrame.m_numberPages == 1){
        	$('#pagesSidebarControls').hide();
        }
                                
        $(targetDiv).html(txt);
		
        PagesSidebarFrame.paintPages();
		
        $('#apollo_page_list').height(h);
        
        $(targetDiv).disableSelection();
        $(targetDiv).noContext();
		
    },

    // ////////////////////////////////////////////////////////////////////////////

    repaint : function(){
        PagesSidebarFrame.paint(PagesSidebarFrame.m_targetDiv);
    },
	
    // ////////////////////////////////////////////////////////////////////////////
	
	m_pageNodes : '',
	
    paintPages : function(){
		
        var pageList = DataStore.m_pageList;
		
        var start_i = PagesSidebarFrame.m_currentPage * PagesSidebarFrame.m_tagsPerPage;
        var end_i = Math.min(pageList.length, start_i+PagesSidebarFrame.m_tagsPerPage);
        $('#pages_sideframe_page_no').html((PagesSidebarFrame.m_currentPage+1) + " of " + PagesSidebarFrame.m_numberPages);
							
		var pageNodes = new Array();
			
        for (var i=0; i<pageList.length; i++){
									
            if (PagesSidebarFrame.m_tagsPerPage && pageList[i].parent_page_id == 0){

	            pageNodes.push(PagesSidebarFrame.getPageHtml(pageList[i].id, pageList[i].title, pageList[i].status, 0));
				
                // Paint children...
				
                for (var k=0; k<pageList.length; k++){

                    if (pageList[k].parent_page_id == pageList[i].id){
						
                        pageNodes.push(PagesSidebarFrame.getPageHtml(pageList[k].id, pageList[k].title, pageList[k].status, 1));
						
                        // Paint grand-children....
                        for (var m=0; m<pageList.length; m++){

                            if (pageList[m].parent_page_id == pageList[k].id){
                                pageNodes.push(PagesSidebarFrame.getPageHtml(pageList[m].id, pageList[m].title, pageList[m].status, 2));
                            }
                            
                        }
                    }
					
                }

            }
							
        }
		
		PagesSidebarFrame.m_pageNodes = pageNodes;
		
        var txt = "";
        for (var i=start_i; i<end_i; i++){
        	txt += pageNodes[i];
        }
		
        $('#apollo_page_list').html(txt);
		
        //$(".folder").rightClick( function(e) {PagesSidebarFrame.onRightClickFolder(e, this);});

        $("#apollo_page_list").disableSelection();					
    },

    // ////////////////////////////////////////////////////////////////////////////

    showNextPage : function(){
		
        $('#prev_pages_link').show();
        	
        if (PagesSidebarFrame.m_currentPage < PagesSidebarFrame.m_numberPages-1){
            PagesSidebarFrame.m_currentPage += 1;
        }
        
        if (PagesSidebarFrame.m_currentPage == PagesSidebarFrame.m_numberPages-1){
        	$('#next_pages_link').hide();
        }
        
        PagesSidebarFrame.paintPages();
    },

    // ////////////////////////////////////////////////////////////////////////////

    showPrevPage : function(){

        $('#next_pages_link').show();

        if (PagesSidebarFrame.m_currentPage > 0){
            PagesSidebarFrame.m_currentPage -= 1;
        }
        
        if (PagesSidebarFrame.m_currentPage == 0){
        	$('#prev_pages_link').hide();
        }
        
        PagesSidebarFrame.paintPages();
    },
    
    // ////////////////////////////////////////////////////////////////////////////

    getPageHtml : function(page_id, page_title, page_status, page_depth){

        var txt = '';

        var status_class = "";

        if (page_status == 'Draft'){
            status_class = 'status_draft';
        }
        else if (page_status == 'Private'){
            status_class = 'status_private';
        }
        else if (page_status == 'Published'){
            status_class = 'status_public';
        }

        var selected = '';
        if (page_id == DataStore.m_currentPageID){
            selected = 'selected';
        }

        txt += "<div onclick=\"PagesSidebarFrame.onSelectPage('"+page_id+"')\" class='page page_depth_"+page_depth+"' id='page_"+page_id+"' title=''>";
        txt += "    <img class='page_icon' src='images/web_page2.png'>";
        txt += "    <span class='page_name "+status_class+" "+selected+"'>"+page_title+"</span>";
        txt += "</div>";

        return txt;
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    addPage : function(){
        var title = 'New page ' + (DataStore.m_pageList.length+1);
        var pageSlug = AthenaUtils.encodeSlug(title);
        var order = 0;
        var isHome = 0;
        MediaAPI.addPage(DataStore.m_siteID, title, '', 'Draft', 0, 0, pageSlug, order, isHome, PagesSidebarFrame.onPageAdded);
    },
	
    onPageAdded : function(pageObj){
        
        DataStore.addPage(pageObj);        		
        
        // Make sure this new page is visible on the side bar                
        PagesSidebarFrame.m_currentPage = PagesSidebarFrame.m_numberPages-1;

        PagesSidebarFrame.onSelectPage(pageObj.id);
		
    },
	
    // ////////////////////////////////////////////////////////////////////////////
	
    /**
	* Encode the page slug based on the title
	*/
    encodeSlug : function(title){
	
        var slug = title.replace(/ /g, ""); // Remove spaces
        slug = slug.replace(/'/g, ""); // Remove single quotes
        slug = slug.replace(/\"/g, ""); // Remove double quotes

        slug = escape(slug);
        slug = slug.replace(/\//g,"%2F");
        slug = slug.replace(/\?/g,"%3F");
        slug = slug.replace(/=/g,"%3D");
        slug = slug.replace(/&/g,"%26");
        slug = slug.replace(/@/g,"%40");
		
        return slug;
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

        $('#folderMenu .edit').click(function(){
            PagesSidebarFrame.onMenuItem('rename_folder', obj)
            });
        $('#folderMenu .delete').click(function(){
            PagesSidebarFrame.onMenuItem('delete_folder', obj)
            });
        $('#folderMenu .quit').click(function(){
            PagesSidebarFrame.onMenuItem('quit', obj)
            });
		
    },

    // ////////////////////////////////////////////////////////////////////////////
	
    /**
	* Respond to the user selecting a menu item
	*/
    onMenuItem : function(item, selectedElement){
    /*
		$('#imageMenu').hide();
		$('#folderMenu').hide();
		
		var divID = $(selectedElement).attr('id');		
		var name = $('#'+divID + ' .folder_name').html();		
		var folder_id = parseInt(divID.substr(7));		
				
		// Process events related to folders...					
		if (item == 'rename_folder'){
			PagesSidebarFrame.makeFolderNameEditable(folder_id);
		}
		else if (item == 'delete_folder'){		
			AthenaDialog.confirm("Are you sure you want to delete this folder? This can not be undone.", function(){PagesSidebarFrame.deleteFolder(folder_id);});
		}
		*/		
    },

    // ////////////////////////////////////////////////////////////////////////////
		
    onSelectPage : function(page_id){
    	// Store the current content first!
		PagesFrame.onChange();		
        DataStore.m_currentPageID = parseInt(page_id);
        PagesFrame.repaint();
        PagesSidebarFrame.repaint();
    }
			
// ////////////////////////////////////////////////////////////////////////////

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
* Javascript class that allows a user to edit information about an image
*/
var ImageEditFrame = {

    image_id : 0,
    image_index : 0, // Image's index in the ImagePickerData image list array
	
    // ////////////////////////////////////////////////////////////////////////////

    paint : function(targetDiv, image_id){

        // Get the image data...
				
        var imageList = DataStore.m_mediaList;
		
        var imageData = DataStore.getImage(image_id);

        if (!imageData) {
            AthenaDialog.error('Error, could not find image!');
            return;
        }
						
			
        var thumb_url = imageData.thumb_url;
        var img_width = imageData.width;
        var img_height = imageData.height;
        var image_folder_id = imageData.folder_id;
        var added_date = imageData.date_added;	// UTC

        var img_title = imageData.title;
        var desc = imageData.description;
        var alt_text = imageData.tags;
        var image_url = imageData.file_url;
						
        var txt = "";
		
        //		txt += "<div id='ApolloImageEditDialog' align='center'>";
        txt += "<div id='ApolloImageEditFrame' align='center'>";
        /*
		if (img_width > img_height){
			txt += "<img class='imageDisplay' src='"+image_url+"' width='98%' style='max-height: 400px'/>";
		}
		else {
			txt += "<img class='imageDisplay' src='"+image_url+"' style='max-height: 400px'/>";
		}
		*/
        var max_img_width = $(targetDiv).innerWidth() - 20;
        var max_img_height = 400;
								
        txt += "<table width='100%' height='100%' cellspacing='3px'>";

        txt += "   <tr valign='center' align='center' class='imageDisplay'>";
        txt += "      <td class='dataField' colspan='2' >";
        txt += "          <img src='"+image_url+"' style='max-width: "+max_img_width+"px; max-height: "+max_img_height+"px;'/>";
        txt += "      </td>";
        txt += "   </tr>";

        txt += "   <tr>";
        txt += "      <td class='titleField'>Title</td>";
        txt += "      <td class='dataField'><input id='apollo_image_title' type=text value='"+img_title+"'/></td>";
        txt += "   </tr>";

        txt += "   <tr>";
        txt += "      <td class='titleField'>Added</td>";
        //		txt += "      <td class='dataField'>"+added_date+" (GMT)</td>";
        txt += "      <td class='dataField'><input id='' width='100%' type=text value='"+added_date+" (GMT)' disabled/></td>";
        txt += "   </tr>";
/*
        txt += "   <tr>";
        txt += "      <td class='titleField'>URL</td>";
        //		txt += "      <td class='dataField'>"+added_date+" (GMT)</td>";
        txt += "      <td class='dataField'><input id='' width='100%' type=text value='"+image_url+"' disabled/></td>";
        txt += "   </tr>";
*/
        txt += "   <tr>";
        txt += "      <td class='titleField'>Size</td>";
        //		txt += "      <td class='dataField'>"+img_width+"px by "+img_height+"px</td>";
        txt += "      <td class='dataField'><input id='' width='100%' type=text value='"+img_width+"px by "+img_height+"px' disabled/></td>";
        txt += "   </tr>";


        txt += "   <tr>";
        txt += "      <td class='titleField'>Description</td>";
        txt += "      <td class='dataField'><textarea id='apollo_image_desc' width='100%'>"+desc+"</textarea></td>";
        //		txt += "      <td class='dataField'><input id='apollo_image_desc' width='100%' type=text value='"+desc+"'/></td>";
        txt += "   </tr>";
		
        txt += "   <tr>";
        txt += "      <td class='titleField'>Alt Text</td>";
        txt += "      <td class='dataField'><textarea id='apollo_image_tags' width='100%'>"+alt_text+"</textarea></td>";
//        txt += "      <td class='dataField'><input id='apollo_image_tags' width='100%' type=text value='"+alt_text+"'/></td>";
        txt += "   </tr>";

        txt += "   <tr align='center'>";
        //		txt += "      <td colspan='2'><div class='update_button' onclick=\"ImageEditFrame.onSave('"+image_id+"')\"></div></td>";
        txt += "      <td colspan='2'>";
        txt += "          <button class='cancel_button' onclick=\"ImageEditFrame.onCancel()\">Done</button>";
        txt += "          <button class='save_button' onclick=\"ImageEditFrame.onSave('"+image_id+"')\">Save</button>";
        txt += "          <button class='delete_button' onclick=\"ImageEditFrame.onDelete('"+image_id+"')\">Delete</button>";
        txt += "      </td>";
        txt += "   </tr>";


        txt += "</table>";
        txt += "</div>";
			
        //var dialogTitle = img_title + "&nbsp;(" + img_width+"px by "+img_height+"px)";
        var dialogTitle = img_title;
																										
        $(targetDiv).dialog( 'destroy' );

        $(targetDiv).html(txt);

    },

    // ////////////////////////////////////////////////////////////////////////////

    onCancel : function(){
        FilesFrame.onCancelSelectImage();
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    onSave : function(media_id){
	
        var newTitle = $('#apollo_image_title').val();
        var newDesc = $('#apollo_image_desc').val();
        var newTags = $('#apollo_image_tags').val();

        MediaAPI.updateMediaInfo(DataStore.m_siteID, media_id, newTitle, newDesc, newTags, ImageEditFrame.onSaved);

    },
	
    onSaved : function(mediaObj){
        DataStore.updateMedia(mediaObj);        
    },

    // ////////////////////////////////////////////////////////////////////////////

    onDelete : function(media_id){
        AthenaDialog.confirm("Are you sure you want to delete this image? This can not be undone!", function(){
            ImageEditFrame.onDoDelete(media_id);
        });
    },

    onDoDelete : function(media_id){
        MediaAPI.deleteMedia(DataStore.m_siteID, media_id, ImageEditFrame.onDeleted);
    },

    onDeleted : function(media_id){
        // Update data store
        DataStore.deleteMedia(media_id);
        FilesFrame.repaint();
    }

    // ////////////////////////////////////////////////////////////////////////////


}
/**
*
* 
* @since 27th July, 2010
*/
var PagesFrame = {

    pageObj : false,

    // ////////////////////////////////////////////////////////////////////////////

    init : function(){
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    repaint : function(){
		
		$('#postTitle').hide();
		$('#pageTitle').show();
		
        if (DataStore.m_pageList.length == 0){
            AthenaDialog.backgroundMessage("You currently have no pages, you can add a post using the side-bar");
            return;
        }
				
		//oUtil.obj.onKeyPress = PagesFrame.onContentKeyPress;
        var pageObj = DataStore.getCurrentPage();
        PagesFrame.repaintData(pageObj);								
    },

    // ////////////////////////////////////////////////////////////////////////////

    repaintData : function(pageObj){
		
         $('#postSettings').hide();
         $('#pageSettings').show();

        oUtil.obj.css = DataStore.m_theme.cms_page_css;
        oUtil.obj.loadHTML(pageObj.content);

        //$('#pageContentEditor').html(pageObj.content);
        $('#pageTitle').val(pageObj.title);
        $('#pageBrowserTitle').val(pageObj.browser_title)
        $('#pageSlug').html(pageObj.slug);
        $('#pageLastEdit').html(pageObj.last_edit);
        $('#pageCreated').html(pageObj.created);		
        $('#pageStatusSelector').val(pageObj.status);
        $('#pageParent').val(pageObj.parent_page_id);
        $('#pageTemplate').val(pageObj.template);
        $('#pageOrder').val(pageObj.page_order);
        $('#pageDesc').val(pageObj.description);

        var txt = "<select id='pageTemplate' onchange=\"PagesFrame.onChange(); PagesFrame.paintThemeParas();\">";
        for (var i=0; i<DataStore.m_templateList.length; i++){
            if (DataStore.m_templateList[i].template_file == pageObj.template){
                txt += "<option value='"+DataStore.m_templateList[i].template_file+"' selected>"+DataStore.m_templateList[i].template_name+"</option>";
            }
            else {
                txt += "<option value='"+DataStore.m_templateList[i].template_file+"'>"+DataStore.m_templateList[i].template_name+"</option>";
            }
        }
        txt += "</select>";
        
        $('#pageTemplateWrapper').html(txt);

        //PagesFrame.updateStatusColor();
				
        // Paint the parent pages...
        PagesFrame.paintParentPages(pageObj);
					
        PagesFrame.paintThemeParas();
        PagesFrame.updatePageLink(pageObj);
						
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    updatePageLink : function(pageObj){
        $('#pageLink').html("View Page");
        if (pageObj.path == "") pageObj.path = "/";
        $('#pageLink').attr('href', 'http://' + defines.domain + pageObj.path + pageObj.slug);
    },
	
    // ////////////////////////////////////////////////////////////////////////////
	
    updateStatusColor : function(){
				
        var status = $('#pageStatusSelector').val();
		
        $('#pageStatusSelector').removeClass('status_draft');
        $('#pageStatusSelector').removeClass('status_private');
        $('#pageStatusSelector').removeClass('status_public');
		
        switch (status){
            case 'Draft':
                $('#pageStatusSelector').addClass('status_draft');
                break;
            case 'Private':
                $('#pageStatusSelector').addClass('status_private');
                break;
            case 'Published':
                $('#pageStatusSelector').addClass('status_public');
                break;
        }
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    /**
    * Paint any special theme paras associated with the chosen template
    */
    paintThemeParas : function(){	
        var templateName = $('#pageTemplate').val();
        var txt = PagesFrame.getThemeParasHTML(templateName, 0);
        if (txt != ""){
        	txt = "<p><strong>Custom Parameters</strong></p>" + txt;
        }
        $('#apollo_page_theme_paras').html(txt);
    },

    // ////////////////////////////////////////////////////////////////////////////

    m_themeParaID : 0,
	
    selectColorPara : function(themeParaID, paraVal){
        PagesFrame.m_themeParaID = themeParaID;
        ColorPickerDialog.show('#apollo_color_picker', paraVal, PagesFrame.onParaSelected)
    },
	
    selectImagePara : function(themeParaID){
        PagesFrame.m_themeParaID = themeParaID;
        ImagePickerDialog.show('#apollo_image_picker', PagesFrame.onParaSelected)
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    onParaSelected : function(newParaVal){
        var page_id = DataStore.m_currentPageID;        
        MediaAPI.setPagePara(PagesFrame.m_themeParaID, newParaVal, page_id, PagesFrame.onPagesParaChanged);
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    onPagesParaChanged : function(theme_para_id, new_value, page_id){
        
        //alert("Theme:" + theme_para_id + " Val:" + new_value + "Page ID:" + page_id);
        
        //location.href = location.href;
        DataStore.updateSitePara(theme_para_id, page_id, new_value);

        // Update para in data store
        var paraFound = false;
        for (var i=0; i<DataStore.m_siteParaList.length; i++){
            if (DataStore.m_siteParaList[i].theme_para_id == theme_para_id){
                DataStore.m_siteParaList[i].para_value = new_value;
                paraFound = true;
            }
        }

        // If we didn't find the para, it must be a new para (that wasn't set before)
        if (!paraFound){
            var temp = new Object();
            temp.theme_para_id = theme_para_id;
            temp.para_value = new_value;
            temp.page_id = page_id;
            DataStore.m_siteParaList.push(temp);
        }

        // Now repaint...        
        PagesFrame.repaint();
    },
	
    // ////////////////////////////////////////////////////////////////////////////
	
   	/**
     * Get the html for editing the theme paras for the given template name.
     * If you set the template name to 'All' it will return the global paras
     * @param string templateName
     */
    getThemeParasHTML : function(templateName, blogParas){
        
        var theme_para_list = DataStore.getPageThemeParas(templateName);

        var txt = "";
        var noParas = 0;

        for (var i=0; i<theme_para_list.length; i++){

			if ((blogParas == 1 && theme_para_list[i].is_blog_para == 1) || (blogParas == 0 && theme_para_list[i].is_blog_para == 0)){
			
	            var pageID = DataStore.m_currentPageID;
	            if (templateName == 'all'){
	                pageID = 0;
	            }
	            var paraVal = DataStore.getSiteParaValue(pageID, theme_para_list[i].id);
	
	            // 'email','image','gallery','font-family','favicon','font-size','color','text','small-int','multi-gallery'
	            switch(theme_para_list[i].para_type){
	
	                case 'favicon':
	                case 'image':
	
	                    onclick = "PagesFrame.selectImagePara("+theme_para_list[i].id+")";
	
	                    txt += "<table border='0'>";
	                    txt += "<tr valign='top'>";
	                    txt += "    <td width='40px'>";
	                    var image_url = '';
	                    if (paraVal){
	                        var image = DataStore.getImage(parseInt(paraVal));
	                        if (image){
	                            image_url = image.thumb_url
	                            }
	                    }
	                    txt += "<img src='"+image_url+"' class='thumbBox' width='30px' height='30px' onclick=\""+onclick+"\" >";
	                    txt += "    </td>";
	
	                    txt += "    <td>";
	                    txt += "        <span class='paraTitle'>"+theme_para_list[i].description+"</span>";
	                    txt += "        <span class='paraDesc'>"+theme_para_list[i].help_text+"</span>";
	                    //txt += "        <button class='save_button' onclick=\""+onclick+"\" style='font-size:10px'>Change</button>";
	                    txt += "    </td>";
	                    txt += "</tr>";
	                    txt += "</table>";
	
	                    noParas++;
	
	                    break;
	
	                case 'color':
	
	                    onclick = "PagesFrame.selectColorPara("+theme_para_list[i].id+", '"+paraVal+"')";
	
	                    txt += "<table border='0'>";
	                    txt += "<tr valign='top'>";
	                    txt += "    <td width='40px'>";
	                    txt += "        <div class='colorBox' style='background-color:#"+paraVal+";' onclick=\""+onclick+"\"></div>";
	                    txt += "    </td>";
	
	                    txt += "    <td>";
	                    txt += "        <span class='paraTitle'>"+theme_para_list[i].description+"</span>";
	                    txt += "        <span class='paraDesc'>"+theme_para_list[i].help_text+"</span>";
	                    txt += "    </td>";
	                    txt += "</tr>";
	                    txt += "</table>";
	
	                    noParas++;
	
	                    break;
	
	                case 'email':
	                    break;
	
	                case 'text':
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

        }

        if (noParas > 0){            
            txt = "<table border='0' width='100%'>" + txt + "</table><br/>";
        }

        return txt;

    },
    	
    // ////////////////////////////////////////////////////////////////////////////
	
    /**
	* Paint the parent pages. Do not allow a user to select a parent page that is itself or
	* one of its own children 
	*/
    paintParentPages : function(pageObj){
	
        var page_id = DataStore.m_currentPageID;
		
        var txt = '';
        txt += "<select id='pageParent' onchange=\"PagesFrame.onChange()\">";
        txt += "    <option value='0'>(none)</selected>";
		
        for (var i=0; i<DataStore.m_pageList.length; i++){
			
            var isChild = DataStore.isChildOff(page_id, DataStore.m_pageList[i].id);
            //var isChild = false;
			
            if (DataStore.m_pageList[i].id != pageObj.id && !isChild){
                if (DataStore.m_pageList[i].id == pageObj.parent_page_id){
                    txt += "    <option value='"+DataStore.m_pageList[i].id+"' selected>"+DataStore.m_pageList[i].title+"</selected>";
                }
                else {
                    txt += "    <option value='"+DataStore.m_pageList[i].id+"'>"+DataStore.m_pageList[i].title+"</selected>";
                }
            }
        }
        txt += "</select>";
		
        $('#parentPageContents').html(txt);
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    /**
	* Delete the page!
	*/
    onDeletePage : function(){
        AthenaDialog.confirm("Are you sure you want to delete this page?", function(){
            PagesFrame.onDoDelete();
        });
    },
	
    onDoDelete : function(){
        MediaAPI.deletePage(DataStore.m_siteID, DataStore.m_currentPageID, PagesFrame.onPageDeleted);
    },
	
    onPageDeleted : function(page_id){
        DataStore.deletePage(page_id);
        if (DataStore.m_pageList.length > 0){
            DataStore.m_currentPageID = DataStore.m_pageList[0].id;
        }
        else {
            DataStore.m_currentPageID = 0;
        }
        PagesFrame.repaint();
        PagesSidebarFrame.repaint();
    },
		
    // ////////////////////////////////////////////////////////////////////////////

	/**
	* Called whenever any page information is changed
	*/	
	onChange : function(){

		//Logger.error('onchange!');

        var page_id = DataStore.m_currentPageID;			
        var originalPage = DataStore.getPage(page_id);
        var parent_id = $('#pageParent').val();
		        
        var pageDepth = DataStore.getPageDepth(DataStore.m_currentPageID);
			
        // Check what the new max depth would be.....
		
        // Need to get the root page for this branch
		
        var old_parent_id = originalPage.parent_page_id;
        originalPage.parent_page_id = parent_id;
        DataStore.updatePage(originalPage);
		
        try {
            //var newDepth = DataStore.getPageDepth(rootPage.id);
            var newDepth = DataStore.getMaxDepth();
        }
        catch (e){
            var newDepth = 99;
        }
		
        // Revert the original back
        originalPage.parent_page_id = old_parent_id;
        DataStore.updatePage(originalPage);
				
        if ((originalPage.parent_page_id != parent_id) && (newDepth > DataStore.m_theme.max_page_depth)){
            AthenaDialog.alert("Sorry, your theme does not support page depths of more than " +  DataStore.m_theme.max_page_depth + ", please choose another parent page!");
            return;
        }
        
        // Update the page
        originalPage.content = oUtil.obj.getXHTMLBody();		
        originalPage.title = $('#pageTitle').val();
        originalPage.browser_title = $('#pageBrowserTitle').val();        
        originalPage.status = $('#pageStatusSelector').val();
        originalPage.parent_page_id = $('#pageParent').val();
        originalPage.template = $('#pageTemplate').val();
        originalPage.page_order = $('#pageOrder').val();
        originalPage.description = $('#pageDesc').val();
        originalPage.slug = AthenaUtils.encodeSlug(originalPage.title);
        originalPage.is_homepage = 0;
        
	    DataStore.updatePage(originalPage);
        PagesSidebarFrame.repaint();        
        	
	},
	
	m_contentChangedTO : '',
	
	/**
	* Called whenever is key is pressed in the content editor. We want to wait until the user has stopped
	* typing before we submit changes
	*/
	onContentKeyPress : function(){
				
		if (PagesFrame.m_contentChangedTO != ''){
			// Still typing, so clear timeout and reset
			clearTimeout(PagesFrame.m_contentChangedTO);
		}
		
		PagesFrame.m_contentChangedTO = setTimeout(PagesFrame.onChange, 500);
	},
	
    // ////////////////////////////////////////////////////////////////////////////

    /**
	* Save all the users changes to the site
	*/
	/*
    onSavePage : function(){
			
        var page_id = DataStore.m_currentPageID;
			
        originalPage = DataStore.getPage(page_id);
		
        var content = oUtil.obj.getXHTMLBody();
		
        var title = $('#pageTitle').val();
        var status = $('#pageStatusSelector').val();
        var parent_id = $('#pageParent').val();
        var template = $('#pageTemplate').val();
        var order = $('#pageOrder').val();
        var desc = $('#pageDesc').val();
        
        var pageDepth = DataStore.getPageDepth(DataStore.m_currentPageID);
        var slug = AthenaUtils.encodeSlug(title);
        //var path = DataStore.getPagePath();
        var ishome = 0;
			
        // Check what the new max depth would be.....
		
        // Need to get the root page for this branch
		
        var old_parent_id = originalPage.parent_page_id;
        originalPage.parent_page_id = parent_id;
        DataStore.updatePage(originalPage);
		
        try {
            //var newDepth = DataStore.getPageDepth(rootPage.id);
            var newDepth = DataStore.getMaxDepth();
        }
        catch (e){
            var newDepth = 99;
        }
		
        // Revert the original back
        originalPage.parent_page_id = old_parent_id;
        DataStore.updatePage(originalPage);
				
        if ((originalPage.parent_page_id != parent_id) && (newDepth > DataStore.m_theme.max_page_depth)){
            AthenaDialog.alert("Sorry, your theme does not support page depths of more than 3, please choose another parent page!");
            return;
        }
						
        MediaAPI.updatePage(DataStore.m_siteID, DataStore.m_currentPageID, title, content, status, template, parent_id, slug, order, ishome, desc, PagesFrame.onPageSaved)
				
    },
	
    onPageSaved : function(pageObj){
        DataStore.updatePage(pageObj);
        PagesFrame.repaint();
        PagesSidebarFrame.repaint();
    },
*/
    // ////////////////////////////////////////////////////////////////////////////

    saveChildPages : function(){
    }
			
    // ////////////////////////////////////////////////////////////////////////////
}
/* 
 * Pages Page functionality
 *
 * @author Mike Pritchard (mike@apollosites.com)
 * @since 3rd January, 2011
 */
var Pages = {

    // ////////////////////////////////////////////////////////////////////////

    init : function(siteID){
                
        $('#PagesFrame').show();
                
        // Setup the data store for the site
        DataStore.init(siteID);

        // Setup classes...
        PagesFrame.init();

        // Paint the custom wyswig editors
        Pages.paintOpenWYSIWYG();

        // Start loading data
        DataStore.load(Pages.onDataLoaded);
                
    },

    // ////////////////////////////////////////////////////////////////////////

    onDataLoaded : function(){    
        PagesFrame.repaint();
        SidebarFrame.repaint();
    },
	
    // ////////////////////////////////////////////////////////////////////////
    
    paintOpenWYSIWYG : function(){

		// Paint the InnovaStudio editor...
		
        var ht = $('.ViewFrame').height() - 40;

        var groupsObj = [
            ["grpPage", "Page & View", ["FullScreen", "XHTMLSource", "Search", "BRK", "Undo", "Redo", "SpellCheck", "RemoveFormat"]],
            ["grpFont", "Font",
                ["FontName", "FontSize", "Strikethrough", "Superscript", "Subscript", "BRK",
                    "Bold", "Italic", "Underline", "ForeColor", "BackColor"
                ]
            ],
            ["grpStyles", "Styles", ["Table", "Guidelines", "BRK",  "StyleAndFormatting", "Styles"]], //"Absolute"
            ["grpPara", "Paragraph",
                ["Paragraph", "Indent", "Outdent", "LTR", "RTL", "BRK", "JustifyLeft",
                    "JustifyCenter", "JustifyRight","JustifyFull", "Numbering", "Bullets"
                ]
            ],
            ["grpObjects", "Objects", ["Image", "InsertInternalImage", "Flash", "Media", "BRK", "Hyperlink", "Characters", "Line",  "ApolloPageBreak"]]
        ];

		// apolloContentEditor
        oUtil.initializeEditor("#pageContentEditor", {
            width:"100%",
            height:ht+"px",
//            height:"100%",
            btnSpellCheck:true,
            useTagSelector:false,
            toolbarMode: 2,
            mode:"XHTML",
            useBR:true, // Force to use <br> for line breaks by default
            arrCustomButtons: [
                ["InsertInternalImage","ImagePickerDialog.show('#apollo_image_picker', Pages.onInsertImage)","Insert an image from your media library", "btnInternalImage.gif"],
                ["ApolloPageBreak","Pages.onInsertPageBreak()","Insert a more link into your blog post", "btnApolloPageBreak.png"]],
            //features:featuresObj,
            //css: DataStore.m_theme.cms_blog_css
            groups: groupsObj
        });

 		setInterval(Pages.setEditorChangeListener, 500);

    },
	
	m_contentChangedTO : '',
	m_prevContent : '',
	
	/**
	* Called whenever is key is pressed in the content editor. We want to wait until the user has stopped
	* typing before we submit changes
	*/
	setEditorChangeListener : function(){
								
		// Get content
		var content = oUtil.obj.getXHTMLBody();
		if (Pages.m_prevContent == '') Pages.m_prevContent = content;
				
		if (content != Pages.m_prevContent){
			
	        switch(Pages.view){
    	        case ssMain.VIEW_PAGES : PagesFrame.onChange(); break;
	            case ssMain.VIEW_Pages : PagesFrame.onChange(); break;
			}		
			
		}		

		Pages.m_prevContent = content;
		
	},	

    // ////////////////////////////////////////////////////////////////////////

    onInsertImage : function(imageID){
        var img = DataStore.getImage(imageID);
        var txt = "<img src='"+img.file_url+"' alt='"+img.description+"' width='"+img.width+"px' height='"+img.height+"px'/>";
        oUtil.obj.insertHTML(txt);
    },

    // ////////////////////////////////////////////////////////////////////////

    /**
     * Insert a custom apollo page break
     */
    onInsertPageBreak : function(){

		if (Pages.view != Pages.VIEW_Pages) return;
		
        // Has the user already got a apollo page break in this page?
        var content = oUtil.obj.getXHTMLBody();
        var myRegExp = /apolloPageBreak/;
        var pos = content.search(myRegExp);

        if (pos > 0){
            AthenaDialog.alert("Sorry, you already have a break in this post and you can only have one, you'll need to delete the old one before you can add one here!", "Can't add more than 1 break");
            return;
        }

        var txt = "<div class='apolloPageBreak'>More...</div> ";
        oUtil.obj.insertHTML(txt);
    }

    
}
