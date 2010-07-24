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

if(!document.createElement("canvas").getContext){(function(){var S=Math;var T=S.round;var P=S.sin;var c=S.cos;var K=S.abs;var b=S.sqrt;var A=10;var L=A/2;function H(){return this.context_||(this.context_=new N(this))}var R=Array.prototype.slice;function d(e,g,h){var Z=R.call(arguments,2);return function(){return e.apply(g,Z.concat(R.call(arguments)))}}var I={init:function(Z){if(/MSIE/.test(navigator.userAgent)&&!window.opera){var e=Z||document;e.createElement("canvas");e.attachEvent("onreadystatechange",d(this.init_,this,e))}},init_:function(g){if(!g.namespaces.g_vml_){g.namespaces.add("g_vml_","urn:schemas-microsoft-com:vml","#default#VML")}if(!g.namespaces.g_o_){g.namespaces.add("g_o_","urn:schemas-microsoft-com:office:office","#default#VML")}if(!g.styleSheets.ex_canvas_){var f=g.createStyleSheet();f.owningElement.id="ex_canvas_";f.cssText="canvas{display:inline-block;overflow:hidden;text-align:left;width:300px;height:150px}g_vml_\\:*{behavior:url(#default#VML)}g_o_\\:*{behavior:url(#default#VML)}"}var e=g.getElementsByTagName("canvas");for(var Z=0;Z<e.length;Z++){this.initElement(e[Z])}},initElement:function(e){if(!e.getContext){e.getContext=H;e.innerHTML="";e.attachEvent("onpropertychange",a);e.attachEvent("onresize",B);var Z=e.attributes;if(Z.width&&Z.width.specified){e.style.width=Z.width.nodeValue+"px"}else{e.width=e.clientWidth}if(Z.height&&Z.height.specified){e.style.height=Z.height.nodeValue+"px"}else{e.height=e.clientHeight}}return e}};function a(f){var Z=f.srcElement;switch(f.propertyName){case"width":Z.style.width=Z.attributes.width.nodeValue+"px";Z.getContext().clearRect();break;case"height":Z.style.height=Z.attributes.height.nodeValue+"px";Z.getContext().clearRect();break}}function B(f){var Z=f.srcElement;if(Z.firstChild){Z.firstChild.style.width=Z.clientWidth+"px";Z.firstChild.style.height=Z.clientHeight+"px"}}I.init();var E=[];for(var W=0;W<16;W++){for(var V=0;V<16;V++){E[W*16+V]=W.toString(16)+V.toString(16)}}function O(){return[[1,0,0],[0,1,0],[0,0,1]]}function D(g,f){var e=O();for(var Z=0;Z<3;Z++){for(var j=0;j<3;j++){var h=0;for(var i=0;i<3;i++){h+=g[Z][i]*f[i][j]}e[Z][j]=h}}return e}function U(e,Z){Z.fillStyle=e.fillStyle;Z.lineCap=e.lineCap;Z.lineJoin=e.lineJoin;Z.lineWidth=e.lineWidth;Z.miterLimit=e.miterLimit;Z.shadowBlur=e.shadowBlur;Z.shadowColor=e.shadowColor;Z.shadowOffsetX=e.shadowOffsetX;Z.shadowOffsetY=e.shadowOffsetY;Z.strokeStyle=e.strokeStyle;Z.globalAlpha=e.globalAlpha;Z.arcScaleX_=e.arcScaleX_;Z.arcScaleY_=e.arcScaleY_;Z.lineScale_=e.lineScale_}function C(e){var h,g=1;e=String(e);if(e.substring(0,3)=="rgb"){var k=e.indexOf("(",3);var Z=e.indexOf(")",k+1);var j=e.substring(k+1,Z).split(",");h="#";for(var f=0;f<3;f++){h+=E[Number(j[f])]}if(j.length==4&&e.substr(3,1)=="a"){g=j[3]}}else{h=e}return{color:h,alpha:g}}function Q(Z){switch(Z){case"butt":return"flat";case"round":return"round";case"square":default:return"square"}}function N(e){this.m_=O();this.mStack_=[];this.aStack_=[];this.currentPath_=[];this.strokeStyle="#000";this.fillStyle="#000";this.lineWidth=1;this.lineJoin="miter";this.lineCap="butt";this.miterLimit=A*1;this.globalAlpha=1;this.canvas=e;var Z=e.ownerDocument.createElement("div");Z.style.width=e.clientWidth+"px";Z.style.height=e.clientHeight+"px";Z.style.overflow="hidden";Z.style.position="absolute";e.appendChild(Z);this.element_=Z;this.arcScaleX_=1;this.arcScaleY_=1;this.lineScale_=1}var J=N.prototype;J.clearRect=function(){this.element_.innerHTML=""};J.beginPath=function(){this.currentPath_=[]};J.moveTo=function(e,Z){var f=this.getCoords_(e,Z);this.currentPath_.push({type:"moveTo",x:f.x,y:f.y});this.currentX_=f.x;this.currentY_=f.y};J.lineTo=function(e,Z){var f=this.getCoords_(e,Z);this.currentPath_.push({type:"lineTo",x:f.x,y:f.y});this.currentX_=f.x;this.currentY_=f.y};J.bezierCurveTo=function(f,e,l,k,j,h){var Z=this.getCoords_(j,h);var i=this.getCoords_(f,e);var g=this.getCoords_(l,k);M(this,i,g,Z)};function M(Z,g,f,e){Z.currentPath_.push({type:"bezierCurveTo",cp1x:g.x,cp1y:g.y,cp2x:f.x,cp2y:f.y,x:e.x,y:e.y});Z.currentX_=e.x;Z.currentY_=e.y}J.quadraticCurveTo=function(j,f,e,Z){var i=this.getCoords_(j,f);var h=this.getCoords_(e,Z);var k={x:this.currentX_+2/3*(i.x-this.currentX_),y:this.currentY_+2/3*(i.y-this.currentY_)};var g={x:k.x+(h.x-this.currentX_)/3,y:k.y+(h.y-this.currentY_)/3};M(this,k,g,h)};J.arc=function(m,k,l,h,e,f){l*=A;var r=f?"at":"wa";var n=m+c(h)*l-L;var q=k+P(h)*l-L;var Z=m+c(e)*l-L;var o=k+P(e)*l-L;if(n==Z&&!f){n+=0.125}var g=this.getCoords_(m,k);var j=this.getCoords_(n,q);var i=this.getCoords_(Z,o);this.currentPath_.push({type:r,x:g.x,y:g.y,radius:l,xStart:j.x,yStart:j.y,xEnd:i.x,yEnd:i.y})};J.rect=function(f,e,Z,g){this.moveTo(f,e);this.lineTo(f+Z,e);this.lineTo(f+Z,e+g);this.lineTo(f,e+g);this.closePath()};J.strokeRect=function(f,e,Z,g){var h=this.currentPath_;this.beginPath();this.moveTo(f,e);this.lineTo(f+Z,e);this.lineTo(f+Z,e+g);this.lineTo(f,e+g);this.closePath();this.stroke();this.currentPath_=h};J.fillRect=function(f,e,Z,g){var h=this.currentPath_;this.beginPath();this.moveTo(f,e);this.lineTo(f+Z,e);this.lineTo(f+Z,e+g);this.lineTo(f,e+g);this.closePath();this.fill();this.currentPath_=h};J.createLinearGradient=function(e,g,Z,f){var h=new X("gradient");h.x0_=e;h.y0_=g;h.x1_=Z;h.y1_=f;return h};J.createRadialGradient=function(g,i,f,e,h,Z){var j=new X("gradientradial");j.x0_=g;j.y0_=i;j.r0_=f;j.x1_=e;j.y1_=h;j.r1_=Z;return j};J.drawImage=function(t,f){var m,k,o,AB,r,p,v,AD;var n=t.runtimeStyle.width;var s=t.runtimeStyle.height;t.runtimeStyle.width="auto";t.runtimeStyle.height="auto";var l=t.width;var z=t.height;t.runtimeStyle.width=n;t.runtimeStyle.height=s;if(arguments.length==3){m=arguments[1];k=arguments[2];r=p=0;v=o=l;AD=AB=z}else{if(arguments.length==5){m=arguments[1];k=arguments[2];o=arguments[3];AB=arguments[4];r=p=0;v=l;AD=z}else{if(arguments.length==9){r=arguments[1];p=arguments[2];v=arguments[3];AD=arguments[4];m=arguments[5];k=arguments[6];o=arguments[7];AB=arguments[8]}else{throw Error("Invalid number of arguments")}}}var AC=this.getCoords_(m,k);var g=v/2;var e=AD/2;var AA=[];var Z=10;var j=10;AA.push(" <g_vml_:group",' coordsize="',A*Z,",",A*j,'"',' coordorigin="0,0"',' style="width:',Z,"px;height:",j,"px;position:absolute;");if(this.m_[0][0]!=1||this.m_[0][1]){var i=[];i.push("M11=",this.m_[0][0],",","M12=",this.m_[1][0],",","M21=",this.m_[0][1],",","M22=",this.m_[1][1],",","Dx=",T(AC.x/A),",","Dy=",T(AC.y/A),"");var y=AC;var x=this.getCoords_(m+o,k);var u=this.getCoords_(m,k+AB);var q=this.getCoords_(m+o,k+AB);y.x=S.max(y.x,x.x,u.x,q.x);y.y=S.max(y.y,x.y,u.y,q.y);AA.push("padding:0 ",T(y.x/A),"px ",T(y.y/A),"px 0;filter:progid:DXImageTransform.Microsoft.Matrix(",i.join(""),", sizingmethod='clip');")}else{AA.push("top:",T(AC.y/A),"px;left:",T(AC.x/A),"px;")}AA.push(' ">','<g_vml_:image src="',t.src,'"',' style="width:',A*o,"px;"," height:",A*AB,'px;"',' cropleft="',r/l,'"',' croptop="',p/z,'"',' cropright="',(l-r-v)/l,'"',' cropbottom="',(z-p-AD)/z,'"'," />","</g_vml_:group>");this.element_.insertAdjacentHTML("BeforeEnd",AA.join(""))};J.stroke=function(AF){var k=[];var l=false;var AQ=C(AF?this.fillStyle:this.strokeStyle);var AB=AQ.color;var AL=AQ.alpha*this.globalAlpha;var g=10;var n=10;k.push("<g_vml_:shape",' filled="',!!AF,'"',' style="position:absolute;width:',g,"px;height:",n,'px;"',' coordorigin="0 0" coordsize="',A*g," ",A*n,'"',' stroked="',!AF,'"',' path="');var m=false;var AP={x:null,y:null};var x={x:null,y:null};for(var AK=0;AK<this.currentPath_.length;AK++){var AJ=this.currentPath_[AK];var AO;switch(AJ.type){case"moveTo":AO=AJ;k.push(" m ",T(AJ.x),",",T(AJ.y));break;case"lineTo":k.push(" l ",T(AJ.x),",",T(AJ.y));break;case"close":k.push(" x ");AJ=null;break;case"bezierCurveTo":k.push(" c ",T(AJ.cp1x),",",T(AJ.cp1y),",",T(AJ.cp2x),",",T(AJ.cp2y),",",T(AJ.x),",",T(AJ.y));break;case"at":case"wa":k.push(" ",AJ.type," ",T(AJ.x-this.arcScaleX_*AJ.radius),",",T(AJ.y-this.arcScaleY_*AJ.radius)," ",T(AJ.x+this.arcScaleX_*AJ.radius),",",T(AJ.y+this.arcScaleY_*AJ.radius)," ",T(AJ.xStart),",",T(AJ.yStart)," ",T(AJ.xEnd),",",T(AJ.yEnd));break}if(AJ){if(AP.x==null||AJ.x<AP.x){AP.x=AJ.x}if(x.x==null||AJ.x>x.x){x.x=AJ.x}if(AP.y==null||AJ.y<AP.y){AP.y=AJ.y}if(x.y==null||AJ.y>x.y){x.y=AJ.y}}}k.push(' ">');if(!AF){var w=this.lineScale_*this.lineWidth;if(w<1){AL*=w}k.push("<g_vml_:stroke",' opacity="',AL,'"',' joinstyle="',this.lineJoin,'"',' miterlimit="',this.miterLimit,'"',' endcap="',Q(this.lineCap),'"',' weight="',w,'px"',' color="',AB,'" />')}else{if(typeof this.fillStyle=="object"){var o=this.fillStyle;var u=0;var AI={x:0,y:0};var AC=0;var s=1;if(o.type_=="gradient"){var r=o.x0_/this.arcScaleX_;var e=o.y0_/this.arcScaleY_;var q=o.x1_/this.arcScaleX_;var AR=o.y1_/this.arcScaleY_;var AN=this.getCoords_(r,e);var AM=this.getCoords_(q,AR);var j=AM.x-AN.x;var h=AM.y-AN.y;u=Math.atan2(j,h)*180/Math.PI;if(u<0){u+=360}if(u<0.000001){u=0}}else{var AN=this.getCoords_(o.x0_,o.y0_);var Z=x.x-AP.x;var f=x.y-AP.y;AI={x:(AN.x-AP.x)/Z,y:(AN.y-AP.y)/f};Z/=this.arcScaleX_*A;f/=this.arcScaleY_*A;var AH=S.max(Z,f);AC=2*o.r0_/AH;s=2*o.r1_/AH-AC}var AA=o.colors_;AA.sort(function(p,i){return p.offset-i.offset});var v=AA.length;var z=AA[0].color;var y=AA[v-1].color;var AE=AA[0].alpha*this.globalAlpha;var AD=AA[v-1].alpha*this.globalAlpha;var AG=[];for(var AK=0;AK<v;AK++){var t=AA[AK];AG.push(t.offset*s+AC+" "+t.color)}k.push('<g_vml_:fill type="',o.type_,'"',' method="none" focus="100%"',' color="',z,'"',' color2="',y,'"',' colors="',AG.join(","),'"',' opacity="',AD,'"',' g_o_:opacity2="',AE,'"',' angle="',u,'"',' focusposition="',AI.x,",",AI.y,'" />')}else{k.push('<g_vml_:fill color="',AB,'" opacity="',AL,'" />')}}k.push("</g_vml_:shape>");this.element_.insertAdjacentHTML("beforeEnd",k.join(""))};J.fill=function(){this.stroke(true)};J.closePath=function(){this.currentPath_.push({type:"close"})};J.getCoords_=function(f,e){var Z=this.m_;return{x:A*(f*Z[0][0]+e*Z[1][0]+Z[2][0])-L,y:A*(f*Z[0][1]+e*Z[1][1]+Z[2][1])-L}};J.save=function(){var Z={};U(this,Z);this.aStack_.push(Z);this.mStack_.push(this.m_);this.m_=D(O(),this.m_)};J.restore=function(){U(this.aStack_.pop(),this);this.m_=this.mStack_.pop()};function G(Z){for(var f=0;f<3;f++){for(var e=0;e<2;e++){if(!isFinite(Z[f][e])||isNaN(Z[f][e])){return false}}}return true}function Y(e,Z,f){if(!G(Z)){return }e.m_=Z;if(f){var g=Z[0][0]*Z[1][1]-Z[0][1]*Z[1][0];e.lineScale_=b(K(g))}}J.translate=function(f,e){var Z=[[1,0,0],[0,1,0],[f,e,1]];Y(this,D(Z,this.m_),false)};J.rotate=function(e){var g=c(e);var f=P(e);var Z=[[g,f,0],[-f,g,0],[0,0,1]];Y(this,D(Z,this.m_),false)};J.scale=function(f,e){this.arcScaleX_*=f;this.arcScaleY_*=e;var Z=[[f,0,0],[0,e,0],[0,0,1]];Y(this,D(Z,this.m_),true)};J.transform=function(h,g,j,i,e,Z){var f=[[h,g,0],[j,i,0],[e,Z,1]];Y(this,D(f,this.m_),true)};J.setTransform=function(h,g,j,i,f,e){var Z=[[h,g,0],[j,i,0],[f,e,1]];Y(this,Z,true)};J.clip=function(){};J.arcTo=function(){};J.createPattern=function(){return new F};function X(Z){this.type_=Z;this.x0_=0;this.y0_=0;this.r0_=0;this.x1_=0;this.y1_=0;this.r1_=0;this.colors_=[]}X.prototype.addColorStop=function(e,Z){Z=C(Z);this.colors_.push({offset:e,color:Z.color,alpha:Z.alpha})};function F(){}G_vmlCanvasManager=I;CanvasRenderingContext2D=N;CanvasGradient=X;CanvasPattern=F})()};
/*
Flot plugin for rendering pie charts. The plugin assumes the data is 
coming is as a single data value for each series, and each of those 
values is a positive value or zero (negative numbers don't make 
any sense and will cause strange effects). The data values do 
NOT need to be passed in as percentage values because it 
internally calculates the total and percentages.

* Created by Brian Medendorp, June 2009
* Updated by Anthony Aragues, July 2009 http://suddenDevelopment.com

Available options are:
series: {
	pie: {
		show: true/false
		radius: 0-1 for percentage of fullsize, or a specified pixel length, or 'auto'
		startAngle: 0-2 factor of PI used for starting angle (in radians) i.e 3/2 starts at the top, 0 and 2 have the same result
		tilt: 0-1 for percentage to tilt the pie, where 1 is no tilt, and 0 is completely flat (nothing will show)
		offset: {
			top: integer value to move the pie up or down
			left: integer value to move the pie left or right, or 'auto'
		},
		stroke: {
			color: any hexidecimal color value (other formats may or may not work, so best to stick with something like '#FFF')
			width: integer pixel width of the stroke
		},
		label: {
			show: true/false, or 'auto'
			formatter:  a user-defined function that modifies the text/style of the label text
			radius: 0-1 for percentage of fullsize, or a specified pixel length
			background: {
				color: any hexidecimal color value (other formats may or may not work, so best to stick with something like '#000')
				opacity: 0-1
			},
			threshold: 0-1 for the percentage value at which to hide labels (if they're too small)
		},
		combine: {
			threshold: 0-1 for the percentage value at which to combine slices (if they're too small)
			color: any hexidecimal color value (other formats may or may not work, so best to stick with something like '#CCC'), if null, the plugin will automatically use the color of the first slice to be combined
			label: any text value of what the combined slice should be labeled
		}
	}
}

Border Layout for labels:
options.series.pie.label.show: 'border'

Donut hole:
options.series.pie.innerRadius: > 0

More detail and specific examples can be found in the included HTML 
file.

*/

(function ($) 
{
	function init(plot) // this is the "body" of the plugin
	{
		var canvas = null,
			ctx = null,
			target = null,
			eventHolder = null,
			options = null,
			maxRadius = null,
			centerLeft = null,
			centerTop = null,
			total = 0,
			redraw = true,
			redrawAttempts = 10,
			shrink = 0.95,
			legendWidth = 0,
			processed = false,
			raw = false,
		
			// interactive variables
		    lastMousePos = { pageX: null, pageY: null },
            highlights = [];
	
		// add hook to determine if pie plugin in enabled, and then perform necessary operations
		plot.hooks.processOptions.push(checkPieEnabled);
		plot.hooks.bindEvents.push(bindEvents);
	
		// check to see if the pie plugin is enabled
		function checkPieEnabled(plot, options)
		{
			if (options.series.pie.show)
			{
				//disable grid
				options.grid.show = false;
				
				// set labels.show
				if (options.series.pie.label.show=='auto')
					if (options.legend.show)
						options.series.pie.label.show = false;
					else
						options.series.pie.label.show = true;
				
				// set radius
				if (options.series.pie.radius=='auto')
					if (options.series.pie.label.show)
						options.series.pie.radius = 3/4;
					else
						options.series.pie.radius = 1;
						
				// ensure sane tilt
				if (options.series.pie.tilt>1)
					options.series.pie.tilt=1;
				if (options.series.pie.tilt<0)
					options.series.pie.tilt=0;
			
				// add processData hook to do transformations on the data
				plot.hooks.processDatapoints.push(processDatapoints);
				plot.hooks.drawOverlay.push(drawOverlay);
				
				// add draw hook
				plot.hooks.draw.push(draw);
			}
		}
		
		// bind hoverable events
		function bindEvents(plot, newEventHolder) {
			eventHolder = newEventHolder;
			var options = plot.getOptions();
			
			if (options.series.pie.show && 
			    options.grid.hoverable)
                eventHolder.unbind('mousemove').mousemove(onMouseMove);
		}		
		
		// debugging function that prints out an object
		function alertObject(obj)
		{
			var msg = '';
			function traverse(obj, depth)
			{
				if (!depth)
					depth = 0;
				for(var i in obj)
				{
					for (var j=0; j<depth; j++)
						msg += '\t';
				
					if( typeof obj[i] == "object")
					{	// its an object
						msg += ''+i+':\n';
						traverse(obj[i], depth+1);
					}
					else
					{	// its a value
						msg += ''+i+': '+obj[i]+'\n';
					}
				}
			}
			traverse(obj);
			alert(msg);
		}
		
		function calcTotal(data)
		{
			for (var i in data)
			{
				var item = parseFloat(data[i].data[0][1]);
				if (item)
					total += item;
			}
		}	
		
		function processDatapoints(plot, series, data, datapoints) 
		{	
			if (!processed)
			{
				processed = true;
			
				canvas = plot.getCanvas();
				target = $(canvas).parent();
				options = plot.getOptions();
			
				plot.setData(combine(plot.getData()));
			}
		}
		
		function setupPie()
		{
			legendWidth = target.children().filter('.legend').children().width();
		
			// calculate maximum radius and center point
			maxRadius =  Math.min(canvas.width,canvas.height)/2;
			centerTop = (canvas.height/2)+options.series.pie.offset.top;
			centerLeft = (canvas.width/2);
			
			if (options.series.pie.offset.left=='auto')
				if (options.legend.position.match('w'))
					centerLeft += legendWidth/2;
				else
					centerLeft -= legendWidth/2;
			else
				centerLeft += options.series.pie.offset.left;
					
			if (centerLeft<maxRadius)
				centerLeft = maxRadius;
			else if (centerLeft>canvas.width-maxRadius)
				centerLeft = canvas.width-maxRadius;
		}
		
		function fixData(data)
		{
			for (var i in data)
			{
				if (typeof(data[i].data)=='number')
					data[i].data = [[1,data[i].data]];
				else if (typeof(data[i].data)=='undefined' || typeof(data[i].data[0])=='undefined')
				{
					if (typeof(data[i].data)!='undefined' && typeof(data[i].data.label)!='undefined')
						data[i].label = data[i].data.label; // fix weirdness coming from flot
					data[i].data = [[1,0]];
					
				}
			}
			return data;
		}
		
		function combine(data)
		{
			data = fixData(data);
			calcTotal(data);
			var combined = 0;
			var numCombined = 0;
			var color = options.series.pie.combine.color;
			
			var newdata = [];
			for (var i in data)
			{
				// make sure its a number
				data[i].data[0][1] = parseFloat(data[i].data[0][1]);
				if (!data[i].data[0][1])
					data[i].data[0][1] = 0;
					
				if (data[i].data[0][1]/total<=options.series.pie.combine.threshold)
				{
					combined += data[i].data[0][1];
					numCombined++;
					if (!color)
						color = data[i].color;
				}				
				else
				{
					newdata.push({
						data: [[1,data[i].data[0][1]]], 
						color: data[i].color, 
						label: data[i].label,
						angle: (data[i].data[0][1]*(Math.PI*2))/total,
						percent: (data[i].data[0][1]/total*100)
					});
				}
			}
			if (numCombined>0)
				newdata.push({
					data: [[1,combined]], 
					color: color, 
					label: options.series.pie.combine.label,
					angle: (combined*(Math.PI*2))/total,
					percent: (combined/total*100)
				});
			return newdata;
		}		
		
		function draw(plot, newCtx)
		{			
			if (!target) return; // if no series were passed
			
			ctx = newCtx;
						
			setupPie();
			var slices = plot.getData();
		
			var attempts = 0;
			while (redraw && attempts<redrawAttempts)
			{
				redraw = false;
				if (attempts>0)
					maxRadius *= shrink;
				attempts += 1;
				clear();
				if (options.series.pie.tilt<=0.8)
					drawShadow();
				drawPie();
			}
			if (attempts >= redrawAttempts) {
				clear();
				target.prepend('<div class="error">Could not draw pie with labels contained inside canvas</div>');
			}
			
			if ( plot.setSeries && plot.insertLegend )
			{
				plot.setSeries(slices);
				plot.insertLegend();
			}
			
			// we're actually done at this point, just defining internal functions at this point
			
			function clear()
			{
				ctx.clearRect(0,0,canvas.width,canvas.height);
				target.children().filter('.pieLabel, .pieLabelBackground').remove();
			}
			
			function drawShadow()
			{
				var shadowLeft = 5;
				var shadowTop = 15;
				var edge = 10;
				var alpha = 0.02;
			
				// set radius
				if (options.series.pie.radius>1)
					var radius = options.series.pie.radius;
				else
					var radius = maxRadius * options.series.pie.radius;
					
				if (radius>=(canvas.width/2)-shadowLeft || radius*options.series.pie.tilt>=(canvas.height/2)-shadowTop || radius<=edge)
					return;	// shadow would be outside canvas, so don't draw it
			
				ctx.save();
				ctx.translate(shadowLeft,shadowTop);
				ctx.globalAlpha = alpha;
				ctx.fillStyle = '#000';

				// center and rotate to starting position
				ctx.translate(centerLeft,centerTop);
				ctx.scale(1, options.series.pie.tilt);
				
				//radius -= edge;
				for (var i=1; i<=edge; i++)
				{
					ctx.beginPath();
					ctx.arc(0,0,radius,0,Math.PI*2,false);
					ctx.fill();
					radius -= i;
				}	
				
				ctx.restore();
			}
			
			function drawPie()
			{
				startAngle = Math.PI*options.series.pie.startAngle;
				
				// set radius
				if (options.series.pie.radius>1)
					var radius = options.series.pie.radius;
				else
					var radius = maxRadius * options.series.pie.radius;
				
				// center and rotate to starting position
				ctx.save();
				ctx.translate(centerLeft,centerTop);
				ctx.scale(1, options.series.pie.tilt);
				//ctx.rotate(startAngle); // start at top; -- This doesn't work properly in Opera
				
				// draw slices
				ctx.save();
				var currentAngle = startAngle;
				for (var i in slices) {
					slices[i].startAngle = currentAngle;
					drawSlice(slices[i].angle, slices[i].color, true); 
				}
				ctx.restore();
				
				// draw slice outlines
				ctx.save();
				ctx.lineWidth = options.series.pie.stroke.width;
				currentAngle = startAngle;
				for (var i in slices)
					drawSlice(slices[i].angle, options.series.pie.stroke.color, false);
				ctx.restore();
				
				// draw labels
				if (options.series.pie.label.show)
					drawLabels();
				
				// restore to original state
				ctx.restore();
				
				function drawSlice(angle, color, fill)
				{	
					if (angle<=0)
						return;
				
					if (fill){ ctx.fillStyle = color; }
					else{ ctx.strokeStyle = color; }

					ctx.beginPath();
					if (angle!=Math.PI*2)
						ctx.moveTo(0,0); // Center of the pie
					else if ($.browser.msie)
						angle -= 0.0001;
					//ctx.arc(0,0,radius,0,angle,false); // This doesn't work properly in Opera
					ctx.arc(0,0,radius,currentAngle,currentAngle+angle,false);
					ctx.closePath();
					//ctx.rotate(angle); // This doesn't work properly in Opera
					currentAngle += angle;
					
					if (fill)
						ctx.fill();
					else
						ctx.stroke();
				}
				
				function drawLabels()
				{
					var currentAngle = startAngle;
					
					// set radius
					if (options.series.pie.label.radius>1)
						var radius = options.series.pie.label.radius;
					else
						var radius = maxRadius * options.series.pie.label.radius;
					
					for(var i in slices)
					{
						if (slices[i].percent >= options.series.pie.label.threshold*100)
							drawLabel(slices[i], currentAngle, i);
						currentAngle += slices[i].angle;
					}
					
					function drawLabel(slice, startAngle, index)
					{
						if (slice.data[0][1]==0)
							return;
							
						// format label text
						var lf = options.legend.labelFormatter, text, plf = options.series.pie.label.formatter;
						if (lf){
							text = lf(slice.label, slice);}
						else{
							text = slice.label;}
						if (plf){
							text = plf(text, slice);}
							
						var halfAngle = ((startAngle+slice.angle) + startAngle)/2;
						var x = centerLeft + Math.round(Math.cos(halfAngle) * radius);
						var y = centerTop + Math.round(Math.sin(halfAngle) * radius) * options.series.pie.tilt;
						
						var html = '<span class="pieLabel" id="pieLabel'+index+'" style="position:absolute;top:' + y + 'px;left:' + x + 'px;">' + text + "</span>";
						target.append(html);
						var label = target.children('#pieLabel'+index);
						var labelTop = (y - label.height()/2);
						var labelLeft = (x - label.width()/2);
						
						/* Border layout for labels */
						if(options.series.pie.label.show == 'border'){
							ctx.restore();
							ctx.beginPath();
							ctx.strokeStyle = '#000000';
							ctx.moveTo(x,y);
							if(x > (canvas.width/2)){
								var endX = canvas.width - label.width();
								var endY = y;
								labelLeft = endX;
							}else{
								var endX = label.width();
								var endY = y;
								labelLeft = 0;
							}
							ctx.lineTo(endX, endY);
							ctx.stroke();
							ctx.save();
						}	
						
						label.css('top', labelTop);
						label.css('left', labelLeft);
						
						// check to make sure that the label is not outside the canvas
						if (0-labelTop>0 || 0-labelLeft>0 || canvas.height-(labelTop+label.height())<0 || canvas.width-(labelLeft+label.width())<0)
							redraw = true;
						
						if (options.series.pie.label.background.opacity != 0) {
							// put in the transparent background separately to avoid blended labels and label boxes
							var c = options.series.pie.label.background.color;
							if (c == null) {
								c = slice.color;
							}
							var pos = 'top:'+labelTop+'px;left:'+labelLeft+'px;';
							$('<div class="pieLabelBackground" style="position:absolute;width:' + label.width() + 'px;height:' + label.height() + 'px;' + pos +'background-color:' + c + ';"> </div>').insertBefore(label).css('opacity', options.series.pie.label.background.opacity);
						}
					} // end individual label function
				} // end drawLabels function
			} // end drawPie function
			
			if(options.series.pie.innerRadius > 0){
				/* donut hole */
				radius = options.series.pie.radius > 1 ? options.series.pie.radius : maxRadius * options.series.pie.radius;
				ctx.translate(centerLeft,centerTop);
				ctx.scale(1, options.series.pie.tilt);
				ctx.save();
				ctx.beginPath();
				ctx.strokeStyle = options.series.pie.stroke.color;
				ctx.fillStyle = options.series.pie.stroke.color;
				ctx.arc(0,0,radius*options.series.pie.innerRadius,0,Math.PI*2,false);
				ctx.fill();
				ctx.closePath();
			}
			/* debug */

			/*  end debug  */
		} // end draw function
	
	function isPointInPoly(poly, pt){
	for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
		((poly[i][1] <= pt[1] && pt[1] < poly[j][1]) || (poly[j][1] <= pt[1] && pt[1]< poly[i][1]))
		&& (pt[0] < (poly[j][0] - poly[i][0]) * (pt[1] - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0])
		&& (c = !c);
	return c;
	}
		// returns the data item the mouse is over, or null if none is found
        function findNearbyItem(mouseX, mouseY, seriesFilter) {
            var item = null, foundPoint = false, i, j,
				series = plot.getData(),
				radius = options.series.pie.radius > 1 ? options.series.pie.radius : maxRadius * options.series.pie.radius;

            for (var i = 0; i < series.length; ++i) {
                if (!seriesFilter(series[i]))
                    continue;
                
                var s = series[i];					

                if (s.pie.show) {
					ctx.save();
					ctx.beginPath();
					ctx.translate(centerLeft,centerTop);
					ctx.scale(1, options.series.pie.tilt);
					ctx.moveTo(0,0); // Center of the pie
					ctx.arc(0,0,radius,s.startAngle,s.startAngle+s.angle,false);
					ctx.closePath();
					x = mouseX-centerLeft;
					y = mouseY-centerTop;
					if(ctx.isPointInPath){
						if (ctx.isPointInPath(x, y)){
							item = {datapoint: [series[i].percent, series[i].data], dataIndex: 0, series: series[i], seriesIndex: i}; 
						}
					}else{
						/* excanvas for IE doesn;t support isPointInPath, this is a workaround. */
						p1X = (radius * Math.cos(s.startAngle));
						p1Y = (radius * Math.sin(s.startAngle));
						p2X = (radius * Math.cos(s.startAngle+(s.angle/4)));
						p2Y = (radius * Math.sin(s.startAngle+(s.angle/4)));
						p3X = (radius * Math.cos(s.startAngle+(s.angle/2)));
						p3Y = (radius * Math.sin(s.startAngle+(s.angle/2)));
						p4X = (radius * Math.cos(s.startAngle+(s.angle/1.5)));
						p4Y = (radius * Math.sin(s.startAngle+(s.angle/1.5)));
						p5X = (radius * Math.cos(s.startAngle+s.angle));
						p5Y = (radius * Math.sin(s.startAngle+s.angle));
						arrPoly = [[0,0],[p1X,p1Y],[p2X,p2Y],[p3X,p3Y],[p4X,p4Y],[p5X,p5Y]];
						arrPoint = [x,y];
						if(isPointInPoly(arrPoly, arrPoint)){
							item = {datapoint: [series[i].percent, series[i].data], dataIndex: 0, series: series[i], seriesIndex: i};
						}			
					}
					ctx.restore();
                }
            }
            
            return item;
        }
		
		function onMouseMove(e) {
			if (!processed) return;
			
            lastMousePos.pageX = e.pageX;
            lastMousePos.pageY = e.pageY;
            
            if (options.grid.hoverable){
                triggerClickHoverEvent("plothover", lastMousePos,
                                       function (s) { return s["hoverable"] != false;});
			}
		}
		
		// trigger click or hover event (they send the same parameters
        // so we share their code)
        function triggerClickHoverEvent(eventname, event, seriesFilter) {
			var plotOffset = plot.getPlotOffset(),
				offset = eventHolder.offset(),
                pos = { pageX: event.pageX, pageY: event.pageY },
                canvasX = event.pageX - offset.left - plotOffset.left,
                canvasY = event.pageY - offset.top - plotOffset.top;

            var item = findNearbyItem(canvasX, canvasY, seriesFilter);
            if (item) {
                
				// fill in mouse pos for any listeners out there
                item.pageX = event.pageX;
				item.pageY = event.pageY;
				
            }

            if (options.grid.autoHighlight) {
                // clear auto-highlights
                for (var i = 0; i < highlights.length; ++i) {
                    var h = highlights[i];
                    if (h.auto == eventname &&
                        !(item && h.series == item.series))
                        unhighlight(h.series);
                }
                
                if (item)
                    highlight(item.series, eventname);
            }
            
            target.trigger(eventname, [ pos, item ]);
        }
		
		function highlight(s, auto) {
            if (typeof s == "number")
                s = series[s];

            var i = indexOfHighlight(s);
            if (i == -1) {
                highlights.push({ series: s, auto: auto });

                plot.triggerRedrawOverlay();
            }
            else if (!auto)
                highlights[i].auto = false;
        }
            
        function unhighlight(s) {
            if (s == null) {
                highlights = [];
                plot.triggerRedrawOverlay();
            }
            
            if (typeof s == "number")
                s = series[s];

            var i = indexOfHighlight(s);
            if (i != -1) {
                highlights.splice(i, 1);

                plot.triggerRedrawOverlay();
            }
        }
        
        function indexOfHighlight(s) {
            for (var i = 0; i < highlights.length; ++i) {
                var h = highlights[i];
                if (h.series == s)
                    return i;
            }
            return -1;
        }
		
		function drawOverlay(plot, octx) {
            var radius = options.series.pie.radius > 1 ? options.series.pie.radius : maxRadius * options.series.pie.radius,
				i, hi;

			octx.save();
            octx.translate(centerLeft, centerTop);
            
            for (i = 0; i < highlights.length; ++i) {
				drawHighlight(highlights[i].series);
            }

			octx.restore();
		
			function drawHighlight(series) {
				if (series.angle < 0) return;
				
				octx.fillStyle = parseColor(options.series.pie.highlight.color).scale(null, null, null, options.series.pie.highlight.opacity).toString();
							
				octx.beginPath();
				if (series.angle!=Math.PI*2)
					octx.moveTo(0,0); // Center of the pie
				octx.arc(0,0,radius,series.startAngle,series.startAngle+series.angle,false);
				octx.closePath();
				
				octx.fill();
			}
			
		}		
		
	} // end init (plugin body)
	
	function clamp(min, value, max) {
        if (value < min)
            return min;
        else if (value > max)
            return max;
        else
            return value;
    }
	
	// color helpers, inspiration from the jquery color animation
    // plugin by John Resig
    function Color (r, g, b, a) {
       
        var rgba = ['r','g','b','a'];
        var x = 4; //rgba.length
       
        while (-1<--x) {
            this[rgba[x]] = arguments[x] || ((x==3) ? 1.0 : 0);
        }
       
        this.toString = function() {
            if (this.a >= 1.0) {
                return "rgb("+[this.r,this.g,this.b].join(",")+")";
            } else {
                return "rgba("+[this.r,this.g,this.b,this.a].join(",")+")";
            }
        };

        this.scale = function(rf, gf, bf, af) {
            x = 4; //rgba.length
            while (-1<--x) {
                if (arguments[x] != null)
                    this[rgba[x]] *= arguments[x];
            }
            return this.normalize();
        };

        this.adjust = function(rd, gd, bd, ad) {
            x = 4; //rgba.length
            while (-1<--x) {
                if (arguments[x] != null)
                    this[rgba[x]] += arguments[x];
            }
            return this.normalize();
        };

        this.clone = function() {
            return new Color(this.r, this.b, this.g, this.a);
        };

        var limit = function(val,minVal,maxVal) {
            return Math.max(Math.min(val, maxVal), minVal);
        };

        this.normalize = function() {
            this.r = clamp(0, parseInt(this.r), 255);
            this.g = clamp(0, parseInt(this.g), 255);
            this.b = clamp(0, parseInt(this.b), 255);
            this.a = clamp(0, this.a, 1);
            return this;
        };

        this.normalize();
    }
	
	function parseColor(str) {
        var result;

        // Look for rgb(num,num,num)
        if (result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(str))
            return new Color(parseInt(result[1], 10), parseInt(result[2], 10), parseInt(result[3], 10));
        
        // Look for rgba(num,num,num,num)
        if (result = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(str))
            return new Color(parseInt(result[1], 10), parseInt(result[2], 10), parseInt(result[3], 10), parseFloat(result[4]));
            
        // Look for rgb(num%,num%,num%)
        if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(str))
            return new Color(parseFloat(result[1])*2.55, parseFloat(result[2])*2.55, parseFloat(result[3])*2.55);

        // Look for rgba(num%,num%,num%,num)
        if (result = /rgba\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(str))
            return new Color(parseFloat(result[1])*2.55, parseFloat(result[2])*2.55, parseFloat(result[3])*2.55, parseFloat(result[4]));
        
        // Look for #a0b1c2
        if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(str))
            return new Color(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16));

        // Look for #fff
        if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(str))
            return new Color(parseInt(result[1]+result[1], 16), parseInt(result[2]+result[2], 16), parseInt(result[3]+result[3], 16));

        // Otherwise, we're most likely dealing with a named color
        var name = $.trim(str).toLowerCase();
        if (name == "transparent")
            return new Color(255, 255, 255, 0);
        else {
            result = lookupColors[name];
            return new Color(result[0], result[1], result[2]);
        }
    }
	
	// define pie specific options and their default values
	var options = {
		series: {
			pie: {
				show: false,
				radius: 'auto',	// actual radius of the visible pie (based on full calculated radius if <=1, or hard pixel value)
				innerRadius:0, /* for donut */
				startAngle: 0,
				tilt: 1,
				offset: {
					top: 0,
					left: 'auto'
				},
				stroke: {
					color: '#FFF',
					width: 1
				},
				label: {
					show: 'auto',
					formatter: function(label, slice){
						return '<div style="font-size:x-small;text-align:center;padding:2px;color:'+slice.color+';">'+label+'<br/>'+Math.round(slice.percent)+'%</div>';
					},	// formatter function
					radius: 1,	// radius at which to place the labels (based on full calculated radius if <=1, or hard pixel value)
					background: {
						color: null,
						opacity: 0
					},
					threshold: 0	// percentage at which to hide the label (i.e. the slice is too narrow)
				},
				combine: {
					threshold: -1,	// percentage at which to combine little slices into one larger slice
					color: null,	// color to give the new slice (auto-generated if null)
					label: 'Other'	// label to give the new slice
				},
				highlight: {
					color: '#ffee77',	// color to use for highlights
					opacity: 0.2		// opacity to use for highlights
				}
			}
		}
	};
    
	$.plot.plugins.push({
		init: init,
		options: options,
		name: "pie",
		version: "0.4"
	});
})(jQuery);
/**
* Utiliy functions
*
* @since 30th March, 2010
*/
var ApolloUtils = {

	/**
	* Encode characters to html tags;
	* ' becomes &#039;
	* & becomes &amp;
	* " becomes &quot;
	* < becomes &lt;
	* > becomes &gt;
	*/
	htmlEncode : function(string) {
	    string = string.toString();	    
        string = string.replace(/&/g, '&amp;');	    
        string = string.replace(/'/g, '&#039;');
        string = string.replace(/"/g, '&quot;');
	    string = string.replace(/</g, '&lt;').replace(/>/g, '&gt;');		
		return string;	
	}

}
/**
* Javascript class that allows a common source of dialog's throughout
*
* @since 27th March, 2010
*/
var ApolloDialog = {
	
	init : function(){
		if (jQuery('#apollo_dialog').attr('id') != 'apollo_dialog'){
			jQuery(document).append("<div id='apollo_dialog'></div>");
		}
	},
	
	// ////////////////////////////////////////////////////////////////////

	error : function(msg){

		// Setup if we need to
		if (jQuery('#apollo_dialog').attr('id') != 'apollo_dialog'){
			jQuery("#ApolloContentWrapper").append("<div id='apollo_dialog'></div>");
		}
				
		jQuery('#apollo_dialog').dialog("destroy");
				
		jQuery('#apollo_dialog').html(msg);
		
		jQuery('#apollo_dialog').dialog({resizable: false, height:140, modal: true, title: "Error"});
	},
	
	// ////////////////////////////////////////////////////////////////////

	alert : function(msg){
	
		// Setup if we need to
		if (jQuery('#apollo_dialog').attr('id') != 'apollo_dialog'){
			jQuery("#ApolloContentWrapper").append("<div id='apollo_dialog'></div>");
		}
				
		jQuery('#apollo_dialog').dialog("destroy");
				
		jQuery('#apollo_dialog').html(msg);
		
		jQuery('#apollo_dialog').dialog({resizable: false, height:140, modal: true, title: "Error"});
	},
	
	// ////////////////////////////////////////////////////////////////////
		
	confirm : function(msg, onOKCallback, onCancelCallback){
		
		// Setup if we need to
		if (jQuery('#apollo_dialog').attr('id') != 'apollo_dialog'){
			jQuery("#ApolloContentWrapper").append("<div id='apollo_dialog'></div>");
		}
				
		jQuery('#apollo_dialog').dialog("destroy");
				
		jQuery('#apollo_dialog').html(msg);
		
		jQuery('#apollo_dialog').dialog({
			resizable: false,
			height:140,
			modal: true,
			title: "Confirm",
			buttons: {
				Ok: function() {
					jQuery(this).dialog('close'); if (onOKCallback) onOKCallback();
				},
				Cancel: function() {
					jQuery(this).dialog('close'); if (onCancelCallback) onCancelCallback();
				}
			}
		})
		
				
	},

	// ////////////////////////////////////////////////////////////////////

	showLoading : function(msg){

		// Check out http://www.chimply.com/Generator for great loading spinners
		
		// Setup if we need to
		if (jQuery('#apollo_dialog').attr('id') != 'apollo_dialog'){
			jQuery("#ApolloContentWrapper").append("<div id='apollo_dialog'></div>");
		}
		
		jQuery('#apollo_dialog').dialog("destroy");
				

		if (msg != undefined){
			jQuery('#apollo_dialog').html("<div align='center' class='apollo_loading_div'><br/>"+msg+"</div>");
		}
		else {
			jQuery('#apollo_dialog').html("<div class='apollo_loading_div'></div>");
		}
		
		jQuery('#apollo_dialog').dialog({
			resizable: false,
			disabled: true,
			draggable: false,
			closeOnEscape: false,
			closeText: 'hide',			
			height: 30,
			width: 'auto',
			modal: true,
			title: "Loading...",
		})
				
		//jQuery("#ApolloContentWrapper").html("<div class='apollo_loading_div'></div>");
	},

	// ////////////////////////////////////////////////////////////////////

	hideLoading : function(){
		jQuery('#apollo_dialog').dialog("destroy");
	},

	// ////////////////////////////////////////////////////////////////////
/*
	globalEmailParaSet : function(themeParaID, blogId, currentVal, descText, helpText){
	},
*/	
	// ////////////////////////////////////////////////////////////////////

	globalParaSet : function(paraType, themeParaID, blogId, currentVal, descText, helpText){
		
		// Setup if we need to
		if (jQuery('#apollo_dialog').attr('id') != 'apollo_dialog'){
			jQuery("#ApolloContentWrapper").append("<div id='apollo_dialog'></div>");
		}
				
		if (currentVal == 'default') currentVal = '';
				
		jQuery('#apollo_dialog').dialog("destroy");
				
		var txt = "";
		txt += "<p>" + helpText + "</p>";
				
		if (paraType == 'small_int'){
			var onkey = "";
			onkey += "var newVal = parseInt(this.value);"; 			
			onkey += "if (newVal >= 0 && newVal <= 100){";
			onkey += "	this.value = newVal;";
			onkey += "	jQuery('#global_set_error').html('');";
			onkey += "}"; 
			onkey += "else if (newVal > 100){";
			onkey += "	this.value = 100;";
			onkey += "	jQuery('#global_set_error').html('Must be 100 or less!');";
			onkey += "}"; 
			onkey += "else {";
			onkey += "	this.value = '';";
			onkey += "	jQuery('#global_set_error').html('Must be a valid number, from 0 to 100!');";
//			onkey += "	setTimeout(function(){jQuery('#global_set_error').hide()}, 5000);";
			onkey += "}";
			txt += "<input id='global_set_para' type='text' value='"+currentVal+"' onKeyUp=\""+onkey+"\"/>";			
		}
		else if (paraType == 'text'){
			txt += "<textarea id='global_set_para' style='width:100%; height:150px'>"+currentVal+"</textarea>";
		}
		else if (paraType == 'email'){
			txt += "<input id='global_set_para' type='text' value='"+currentVal+"' />";			
		}
		txt += "<p id='global_set_error' style='color:red'></p>";
			
								
		jQuery('#apollo_dialog').html(txt);
		
		var dialogTitle = descText;
		
		jQuery('#apollo_dialog').dialog({
			resizable: false,
			height: 350,
			modal: true,
			title: dialogTitle,
			buttons: {
				Save: function() {
				
					if (paraType == 'email'){
						var filter = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
						var emailVal = jQuery('#global_set_para').val();

						if (!filter.test(emailVal)) {
							jQuery('#global_set_error').html('Must be a valid email!');
							return false;
						}
						else {
							jQuery('#global_set_error').html('');
						}
					}
					
					jQuery(this).dialog('close');
										
					var paraVal = jQuery('#global_set_para').val();					
					var paras = {cmd: 5, blog_id: blogId, theme_para_id: themeParaID, para_value: paraVal};
																						
					jQuery.ajax({
						url: ImagePickerData.commandURL,
						dataType: "json",
						data: paras,
						success: function(ret){ if(ret.result = 'ok'){window.location.href=window.location.href;}}
					});	
					
				},
				Cancel: function() {
					jQuery(this).dialog('close'); if (onCancelCallback) onCancelCallback();
				}
			}
		});
		
	},
		
	// ////////////////////////////////////////////////////////////////////
	
	textEntry : function(msg, onDoneCallback, onCancelCallback){
	}
	
	// ////////////////////////////////////////////////////////////////////
	
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
	paint : function(mode){
	
		ImageSelector.mode = mode;
		
		folder_name = "(All)";
		
		if (ImagePickerData.folderList.length >= 1){
			ImageSelector.folder_id = ImagePickerData.folderList[0].id;	
			folder_name = ImagePickerData.folderList[0].folder_name;
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

							
		//jQuery(targetDiv).attr('title',dialogTitle);					
		jQuery('#ApolloImageSelector').html(txt);
		
		ImageSelector.paintFolders();		
		ImageSelector.paintImages();
		
		jQuery('#ApolloImageSelector').disableSelection();
		jQuery('#ApolloImageSelector').noContext();
		
		// Disable right click menu except where we want it
		//jQuery('#ApolloImageSelector').bind("rightClickMenu",function(e){return false;}); 		
		
	},

	// ////////////////////////////////////////////////////////////////////////////

	onDeselectAll : function(){
		ImageSelector.paintImages();			
	},
	
	onSelectAll : function(){	
		ImageSelector.paintImages();			
		jQuery('.thumb').addClass('multiselected');				
		setTimeout('ImageSelector.makeMultiSelectedDraggable()', 300);
	},

	// ////////////////////////////////////////////////////////////////////////////
	
	paintImages : function(){
		
		var imageList = ImagePickerData.imageList;
		
		var txt = "";

		var d = new Date();
		var localTime = d.getTime();
		var localOffset = d.getTimezoneOffset() * 60000;
		var utc_date = new Date(localTime + localOffset);
		var utc_time = localTime + localOffset;
				
		//alert(ImageSelector.folder_id + " " + ImageSelector.ID_LAST_24_HOURS);
				
		for (var i=0; i<imageList.length; i++){

			var thumb_url = imageList[i].thumb_url;
			var post_id = imageList[i].post_id;
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
				
		jQuery('#apollo_image_library').html(txt);
		jQuery('#apollo_image_library').noContext();

				
		if (ImageSelector.mode == ImageSelector.MODE_EDIT_GALLERY){
			jQuery(".thumb").draggable({revert: true, zIndex: 300});				
		}
		else {

			//jQuery(dragClass).multiDrag();
			

			jQuery('.thumb').mousedown( function(e) {					
				
				var evt = e;					
				
				jQuery(this).mouseup( 
					function() {
									
						//jQuery(this).unbind('mousedown');
						jQuery(this).unbind('mouseup');
						
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
		
			var id = jQuery(obj).attr('id');
			var isSelected = jQuery(obj).is('.multiselected');
			
			if (ImageSelector.shiftSelectStarted){
				// This clears the current selection
				jQuery('.multiselected').removeClass('multiselected');
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
				jQuery('#'+id).addClass('multiselected');
				setTimeout('ImageSelector.makeMultiSelectedDraggable()', 300);
			}
		

	},

	// ////////////////////////////////////////////////////////////////////////////
	
	onAltClick : function(e, obj){
							
		var id = jQuery(obj).attr('id');
		var isSelected = jQuery(obj).is('.multiselected');
			
		if (isSelected){
			jQuery('#'+id).removeClass('multiselected');
			jQuery('#'+id).draggable('destroy');
		}
		else {
			jQuery('#'+id).addClass('multiselected');
			setTimeout('ImageSelector.makeMultiSelectedDraggable()', 300);
		}
		
		/*		
		if (jQuery(obj).is('.multiselected')){
			jQuery(obj).removeClass('multiselected');				
		}
		else {
			jQuery(obj).addClass('multiselected');
		}
		*/
		
	},
		
	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	* Respond to a shift-click event
	*/
	onShiftClick : function(e, obj){
										
		var id = jQuery(obj).attr('id');
			
	  	jQuery('.thumb').removeClass('multiselected')
			
		if (ImageSelector.shiftSelectStarted){

			var foundStart = false;
			var foundEnd = false;
					
	  		jQuery('.thumb').each(	
	  			function(){	  				
	  				if (!foundEnd){
		  				if (jQuery(this).attr('id') == ImageSelector.shiftSelectStartedID){
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
		//jQuery(obj).unbind('click')
			/*		
		if (jQuery(obj).is('.multiselected')){
			jQuery(obj).removeClass('multiselected');				
			jQuery(obj).draggable({revert: true, zIndex: 300});
		}
		else {
			jQuery(obj).draggable("destroy");
			jQuery(obj).addClass('multiselected');
			setTimeout('ImageSelector.makeMultiSelectedDraggable()', 300);
		}
		*/
	},
	
	// ////////////////////////////////////////////////////////////////////////////
				
	makeMultiSelectedDraggable : function(){
	
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
			  					  		
    				//var selected = jQuery('.multiselected');
					//if (selected.length === 0) {
					//	selected = jQuery(this);
					//}
					//var container = jQuery('<div/>').attr('id', 'draggingContainer');
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
		
		var folderList = ImagePickerData.folderList;
		
		var txt = "";
		
		// NOTE: Folder id's 0-9 are reserved for system folders, so can safely use these id's here
		
		// Hard-coded 'all' folder....		
		if (ImageSelector.folder_id == 0){
			txt += "<div id='folder_0' class='apollo_system_folder' style='width:100%;' onclick=\"ImageSelector.onSelectFolder('0')\"><div class='folder_name_selected'>Show All</div></div>";
			jQuery('#apollo_title_folder_name').html('(All)');
		}
		else {
			txt += "<div id='folder_0' class='apollo_system_folder' style='width:100%;' onclick=\"ImageSelector.onSelectFolder('0')\"><div class='folder_name'>Show All</div></div>";
		}
		
		
		// Hard-coded 'unassigned' folder....		
		if (ImageSelector.folder_id == ImageSelector.ID_UNASSIGNED){
			txt += "<div id='folder_"+ImageSelector.ID_UNASSIGNED+"' class='apollo_folder apollo_system_folder' style='width:100%;' onclick=\"ImageSelector.onSelectFolder("+ImageSelector.ID_UNASSIGNED+")\"><div class='folder_name_selected'>Unassigned images</div></div>";
			jQuery('#apollo_title_folder_name').html('(Unassigned images)');
		}
		else {
			txt += "<div id='folder_1' class='apollo_folder apollo_system_folder' style='width:100%;' onclick=\"ImageSelector.onSelectFolder("+ImageSelector.ID_UNASSIGNED+")\"><div class='folder_name'>Unassigned images</div></div>";
		}		

		// Hard-coded 'last hour' folder....		
		if (ImageSelector.folder_id == ImageSelector.ID_LAST_1_HOUR){
			txt += "<div id='folder_"+ImageSelector.ID_LAST_1_HOUR+"' class='apollo_system_folder' style='width:100%;' onclick=\"ImageSelector.onSelectFolder("+ImageSelector.ID_LAST_1_HOUR+")\"><div class='folder_name_selected'>Added in last hour</div></div>";
			jQuery('#apollo_title_folder_name').html('(Added in last hour)');
		}
		else {
			txt += "<div id='folder_"+ImageSelector.ID_LAST_1_HOUR+"' class='apollo_system_folder' style='width:100%;' onclick=\"ImageSelector.onSelectFolder("+ImageSelector.ID_LAST_1_HOUR+")\"><div class='folder_name'>Added in last hour</div></div>";
		}	

		// Hard-coded 'added last 24 hours' folder....		
		if (ImageSelector.folder_id == ImageSelector.ID_LAST_24_HOURS){
			txt += "<div id='folder_"+ImageSelector.ID_LAST_24_HOURS+"' class='apollo_system_folder' style='width:100%;' onclick=\"ImageSelector.onSelectFolder("+ImageSelector.ID_LAST_24_HOURS+")\"><div class='folder_name_selected'>Added in last 24 hours</div></div>";
			jQuery('#apollo_title_folder_name').html('(Added in last 24 hours)');
		}
		else {
			txt += "<div id='folder_"+ImageSelector.ID_LAST_24_HOURS+"' class='apollo_system_folder' style='width:100%;' onclick=\"ImageSelector.onSelectFolder("+ImageSelector.ID_LAST_24_HOURS+")\"><div class='folder_name'>Added in last 24 hours</div></div>";
		}		
		
		

		for (var i=0; i<folderList.length; i++){

			var folder_name = ApolloUtils.htmlEncode(folderList[i].name);
			var folder_id = folderList[i].id;
			
			//alert(folder_name + " " + folder_id);
			
			if (folder_id == ImageSelector.folder_id){
				jQuery('#apollo_title_folder_name').html('('+folder_name+')');
				txt += "<div id='folder_"+folder_id+"' class='apollo_folder folder_with_menu' style='width:100%;' title='Right click to edit' onclick=\"ImageSelector.onSelectFolder('"+folder_id+"')\"><div class='folder_name folder_name_selected'>"+folder_name+"</div></div>";
			}
			else {
				txt += "<div id='folder_"+folder_id+"' class='apollo_folder folder_with_menu' style='width:100%;' title='Right click to edit' onclick=\"ImageSelector.onSelectFolder('"+folder_id+"')\"><div class='folder_name'>"+folder_name+"</div></div>";
			}

			
		}
		
		jQuery('#apollo_folder_list').html(txt);
		
		jQuery('.apollo_folder').droppable({
				drop: ImageSelector.onAddToFolder,
				over: function(ev, ui) {jQuery(this).addClass( 'apollo_folder_droppable_hover' );},
				out: function(ev, ui) {jQuery(this).removeClass( 'apollo_folder_droppable_hover' );}
			});			

				
	   // jQuery(".folder_with_menu").rightClickMenu({menu: "folderMenu"}, function(action, el, pos){ImageSelector.onMenuItem(action, el)});
		if (ImageSelector.mode != ImageSelector.MODE_EDIT_GALLERY){
			jQuery(".folder_with_menu").rightClick( function(e) {ImageSelector.onRightClickFolder(e, this);});
		}

		jQuery("#apollo_folder_list").disableSelection();
				
	},

	// ////////////////////////////////////////////////////////////////////////////

	onRightClickFolder : function(e, obj){

		e.stopPropagation();
		
		//var x = e.pageX - jQuery('#adminmenu').width() - 30;
		//var y = e.pageY - jQuery('#wphead').height() - jQuery('#update-nag').height();		
		var x = e.pageX;
		var y = e.pageY;		

		jQuery('#folderMenu').css('top',y);
		jQuery('#folderMenu').css('left',x);
		jQuery('#folderMenu').show();

		jQuery('#folderMenu .edit').unbind('click');
		jQuery('#folderMenu .delete').unbind('click');
		jQuery('#folderMenu .quit').unbind('click');

		jQuery('#folderMenu .edit').click(function(){ImageSelector.onMenuItem('rename_folder', obj)});
		jQuery('#folderMenu .delete').click(function(){ImageSelector.onMenuItem('delete_folder', obj)});
		jQuery('#folderMenu .quit').click(function(){ImageSelector.onMenuItem('quit', obj)});
		
	},
	
	onRightClickImage : function(e, obj){

		e.stopPropagation();

		//var x = e.pageX - jQuery('#adminmenu').width() - 30;
		//var y = e.pageY - jQuery('#wphead').height() - jQuery('#update-nag').height();		
		var x = e.pageX;
		var y = e.pageY;		

		jQuery('#imageMenu').css('top',y);
		jQuery('#imageMenu').css('left',x);
		jQuery('#imageMenu').show();

		jQuery('#imageMenu .edit').unbind('click');
		jQuery('#imageMenu .delete').unbind('click');
		jQuery('#imageMenu .quit').unbind('click');
		
		jQuery('#imageMenu .edit').click(function(){ImageSelector.onMenuItem('edit_image', obj)});
		jQuery('#imageMenu .delete').click(function(){ImageSelector.onMenuItem('delete_image', obj)});
		jQuery('#imageMenu .quit').click(function(){ImageSelector.onMenuItem('quit', obj)});
		
	},
		
	// ////////////////////////////////////////////////////////////////////////////

	messageTimeout : -1,
	
	showMessage : function(msg){
		jQuery('#apollo_title_feedback').html(msg);
		jQuery('#apollo_title_feedback').show();
		if (ImageSelector.messageTimeout != -1){
			clearTimeout(ImageSelector.messageTimeout)
		}
		setTimeout('ImageSelector.hideMessage()', 5000);
	},
	
	hideMessage : function(){
		jQuery('#apollo_title_feedback').hide();
	},
	
	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	* Respond to the user selecting a menu item
	*/
	onMenuItem : function(item, selectedElement){
		
		jQuery('#imageMenu').hide();
		jQuery('#folderMenu').hide();
		
		
		var divID = jQuery(selectedElement).attr('id');
		
		if (item == 'rename_folder' || item == 'delete_folder'){
			var name = jQuery('#'+divID + ' .folder_name').html();
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
		var name = jQuery(divID + ' .folder_name').html();
		
		jQuery(divID).attr('onclick','');
		jQuery(divID).html("<input id='folder_name_edit' style='margin-left:30px' type='text' value='"+name+"' onblur='ImageSelector.paintFolders()'/>");
		
		jQuery("#folder_name_edit").keypress(function (e) {
			if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
				ImageSelector.renameFolder(folder_id, jQuery("#folder_name_edit").val());
			}
	    });
		
		jQuery("#folder_name_edit").focus();
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
												
		jQuery.ajax({
			url: ImagePickerData.commandURL,
			dataType: "text",
			data: paras,
			success: function(ret){ImageSelector.onFolderDeleted(ret, folderdId)}	
		});	
	},
	
	onFolderDeleted : function(res, folder_id){

		ImageSelector.showMessage("Folder deleted");
		
		var temp = new Array();
		
		for (var i=0; i<ImagePickerData.folderList.length; i++){
		
			if (ImagePickerData.folderList[i].id != folder_id){
				temp.push(ImagePickerData.folderList[i]);
			}
			
		}

		ImagePickerData.folderList = temp;
		ImageSelector.paintFolders()	
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	addFolder : function(folderName){

		if (folderName == undefined){
			folderName = 'new folder';
		}
		
		var paras = {cmd: 12, folder_name: folderName};
												
		jQuery.ajax({
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
			ImagePickerData.folderList.push(temp);
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
		
		for (var i=0; i<ImagePickerData.folderList.length; i++){
			if (ImagePickerData.folderList[i].id == folder_id){
				return ImagePickerData.folderList[i].name;
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
												
		jQuery.ajax({
			url: ImagePickerData.commandURL,
			dataType: "text",
			data: paras,
			success: function(ret){ImageSelector.onFolderRenamed(ret, folderId, folderName)}
		});	
	},
	
	onFolderRenamed : function(ret, folderId, folderName){

		for (var i=0; i<ImagePickerData.folderList.length; i++){
			if (ImagePickerData.folderList[i].id == folderId){
				ImagePickerData.folderList[i].name = folderName;
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

		var imgID = parseInt(jQuery(ui.draggable).attr('id').substring(4));						
		var folderID = parseInt(jQuery(this).attr('id').substring(7));	// format folder_xxx

		// Check to see if there are images multi-selected, and whether this image
		// is one of them
		var imgList = new Array();
		var is_multiDrag = false;
		
  		jQuery('.multiselected').each(	
  			function(){
				var multi_imgID = parseInt(jQuery(this).attr('id').substring(4));
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
														
				jQuery.ajax({
					url: ImagePickerData.commandURL,
					dataType: "json",
					data: paras,
					success: function(ret){ImageSelector.onAddedToFolder(ret)}
				});
			}	
		}

		//alert(jQuery(ui.draggable).html());
		//alert(jQuery(ui.draggable).attr('id'));
		
		jQuery(this).removeClass( 'apollo_folder_droppable_hover' );
			
	},
	
	onAddedToFolder : function(msg){
								
		if (msg.result == "ok"){

			var imgID = msg.media_post_id;
			var folderID = msg.folder_id;
					
			for (var i=0; i<ImagePickerData.imageList.length; i++){
				
				if (ImagePickerData.imageList[i].post_id == imgID){
					ImagePickerData.imageList[i].folder_id = folderID;						
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
* Javascript class that allows a user to pick an image from their wordpress media library
*/
var ImagePickerDialog = {

	//imageList : Array(Array('test.png', 1, 'title'), Array('test.png', 1, 'title')),

	MODE_IMAGE : 'image',
	MODE_FAVICON : 'favicon',
	MODE_GALLERY_THUMB : 'galthumb',
	
	mode : 'image',
	
	isGlobal : false,
	para1 : -1,
	themeParaID : -2,
	
	folder_id : 0,
	
	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	*
	* @param mode 'image' or 'favicon'
	* @param isGlobal true/false 
	* @param themeParaID the theme's parameter id
	* @param para1 'blog id' if isGlobal is true, otherwise this will be 'page_post_id' (the page we're setting the para for)
	*/
	show : function(mode, isGlobal, themeParaID, para1, para2){
	
		ImagePickerDialog.mode = mode;
		ImagePickerDialog.isGlobal = isGlobal;
		ImagePickerDialog.para1 = para1;
		ImagePickerDialog.para2 = para2;
		ImagePickerDialog.themeParaID = themeParaID;

		var imageList = ImagePickerData.imageList;
		var dialogTitle = 'Select an image';

		if (ImagePickerDialog.mode == ImagePickerDialog.MODE_FAVICON){
			imageList = ImagePickerData.favIconList;
			dialogTitle = 'Select a favicon';
		}
		
		//var targetDiv = '#apolloImagePicker';
		var targetDiv = '#ApolloImageSelector';


				
		if (ImagePickerData.folderList.length >= 1){
			ImagePickerDialog.folder_id = ImagePickerData.folderList[0].id;	
		}
		
		var minHeight = jQuery(window).height()/2;
		
		var txt = "";
		
		txt += "<div>";
		txt += "<table width='100%' height='100%' cellspacing='0px'>";		
		txt += "   <tr height='100%'>";
		txt += "      <td width='250px'>";
		txt += "         <div class='dialog_h2'>Folders</div>";
		txt += "         <div class='dialogbox' style='height: 100%; min-width: 100px; min-height:"+minHeight+"px' id='apollo_folder_list'></div>";
		txt += "      </td>";
		txt += "      <td style='padding-left:20px'>";
		txt += "         <div class='dialog_h2'>Library Images<span id='apollo_title_folder_name'>(All)</span></div>";			
		txt += "         <div class='dialogbox' style='height: 100%; min-width: 200px; min-height:"+minHeight+"px' id='apollo_image_library'></div>";
		txt += "      </td>";		
		txt += "   </tr>";
		txt += "</table>";
		txt += "</div>";
											
		jQuery(targetDiv).html(txt);
		
		jQuery(targetDiv).dialog( 'destroy' );
	
		jQuery(targetDiv).dialog({modal: true, width:200+jQuery(window).width()/2, height:130+minHeight, title: dialogTitle });

		
		ImagePickerDialog.paintFolders();		
		ImagePickerDialog.paintImages();
		
		jQuery(targetDiv).disableSelection();



/*



		//var txt = "<div class='box' id='apollo_image_library' style='width:100%; height:100%'>";
		var txt = "";
		
		for (var i=0; i<imageList.length; i++){
			
			var thumb_url = imageList[i].thumb_url;
			var post_id = imageList[i].post_id;
			var title = imageList[i].title;
			var width = imageList[i].width
			var height = imageList[i].height
			
			txt += "<div class='imageWrapper' align='center' onclick=\"ImagePickerDialog.onSelectImage('"+post_id+"')\">";
			
			txt += "   <img id='img+"+post_id+"' src='"+thumb_url+"' class='thumb' width='100%'/>";
			txt += "   <div class='imageTitle'>" + title + "</div>";
			txt += "   <div class='imageSize'>(" + width + ", " + height + ")</div>";

			txt += "</div>";
			
		}
						
		//jQuery(targetDiv).attr('title',dialogTitle);					
		jQuery(targetDiv).html(txt);			
		jQuery(targetDiv).dialog( 'destroy' );
	
		jQuery(targetDiv).dialog({modal: true, width:jQuery(window).width()/2, height:jQuery(window).height()/2, title: dialogTitle });
*/		
	},

	// ////////////////////////////////////////////////////////////////////////////

	paintImages : function(){
	
		var imageList = ImagePickerData.imageList;
		
		var d = new Date();
		var localTime = d.getTime();
		var localOffset = d.getTimezoneOffset() * 60000;
		var utc_date = new Date(localTime + localOffset);
		var utc_time = localTime + localOffset;
				
		var txt = "";
		
		for (var i=0; i<imageList.length; i++){
			
			var thumb_url = imageList[i].thumb_url;
			var post_id = imageList[i].post_id;
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
						txt += ImagePickerDialog.getImageHTML(post_id, thumb_url, title, width, height);	
					break;
					
				case ImageSelector.ID_LAST_1_HOUR:
					if (hours_ago <= 1){
						txt += ImagePickerDialog.getImageHTML(post_id, thumb_url, title, width, height);				
					}
					break;

				case ImageSelector.ID_LAST_24_HOURS:
					if (hours_ago <= 24){
						txt += ImagePickerDialog.getImageHTML(post_id, thumb_url, title, width, height);				
					}
					break;

				case ImageSelector.ID_LAST_7_DAYS:
					if (hours_ago <= 168){
						txt += ImagePickerDialog.getImageHTML(post_id, thumb_url, title, width, height);				
					}
					break;

				case ImageSelector.ID_ALL:
					txt += ImagePickerDialog.getImageHTML(post_id, thumb_url, title, width, height);				
					break;	

				case image_folder_id:	
					txt += ImagePickerDialog.getImageHTML(post_id, thumb_url, title, width, height);				
					break;	

				default:					
					// Nothing to do
			}			
			
		}
		
		jQuery('#apollo_image_library').html(txt);
				
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	getImageHTML : function(post_id, thumb_url, title, width, height){
	
		var txt = '';
/*		
		txt += "<div class='imageWrapper' align='center' onclick=\"ImagePickerDialog.onSelectImage('"+post_id+"')\">";
		txt += "   <img id='img+"+post_id+"' src='"+thumb_url+"' class='thumb' width='100%'/>";
		txt += "   <div class='imageTitle'>" + title + "</div>";
		txt += "   <div class='imageSize'>(" + width + ", " + height + ")</div>";
		txt += "</div>";
*/
		var titleText = title + " (" + width + "px by " + height + "px)";
		txt += "   <img id='img_"+post_id+"' src='"+thumb_url+"' class='thumb' width='50px' style='cursor:pointer' title='"+titleText+"' onclick=\"ImagePickerDialog.onSelectImage('"+post_id+"')\"/>";
		
		return txt;
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	paintFolders : function(){
		
		var folderList = ImagePickerData.folderList;
		
		var txt = "";
		
		// NOTE: Folder id's 0-9 are reserved for system folders, so can safely use these id's here
		
		// Hard-coded 'all' folder....		
		if (ImagePickerDialog.folder_id == 0){
			txt += "<div id='folder_0' class='apollo_system_folder' style='width:100%;' onclick=\"ImagePickerDialog.onSelectFolder('0')\"><div class='folder_name_selected'>Show All</div></div>";
			jQuery('#apollo_title_folder_name').html('(All)');
		}
		else {
			txt += "<div id='folder_0' class='apollo_system_folder' style='width:100%;' onclick=\"ImagePickerDialog.onSelectFolder('0')\"><div class='folder_name'>Show All</div></div>";
		}
		
		
		// Hard-coded 'unassigned' folder....		
		if (ImagePickerDialog.folder_id == ImageSelector.ID_UNASSIGNED){
			txt += "<div id='folder_"+ImageSelector.ID_UNASSIGNED+"' class='apollo_system_folder' style='width:100%;' onclick=\"ImagePickerDialog.onSelectFolder("+ImageSelector.ID_UNASSIGNED+")\"><div class='folder_name_selected'>Unassigned images</div></div>";
			jQuery('#apollo_title_folder_name').html('(Unassigned images)');
		}
		else {
			txt += "<div id='folder_1' class='apollo_system_folder' style='width:100%;' onclick=\"ImagePickerDialog.onSelectFolder("+ImageSelector.ID_UNASSIGNED+")\"><div class='folder_name'>Unassigned images</div></div>";
		}		

		// Hard-coded 'last hour' folder....		
		if (ImagePickerDialog.folder_id == ImageSelector.ID_LAST_1_HOUR){
			txt += "<div id='folder_"+ImageSelector.ID_LAST_1_HOUR+"' class='apollo_system_folder' style='width:100%;' onclick=\"ImagePickerDialog.onSelectFolder("+ImageSelector.ID_LAST_1_HOUR+")\"><div class='folder_name_selected'>Added in last hour</div></div>";
			jQuery('#apollo_title_folder_name').html('(Added in last hour)');
		}
		else {
			txt += "<div id='folder_"+ImageSelector.ID_LAST_1_HOUR+"' class='apollo_system_folder' style='width:100%;' onclick=\"ImagePickerDialog.onSelectFolder("+ImageSelector.ID_LAST_1_HOUR+")\"><div class='folder_name'>Added in last hour</div></div>";
		}	

		// Hard-coded 'added last 24 hours' folder....		
		if (ImagePickerDialog.folder_id == ImageSelector.ID_LAST_24_HOURS){
			txt += "<div id='folder_"+ImageSelector.ID_LAST_24_HOURS+"' class='apollo_system_folder' style='width:100%;' onclick=\"ImagePickerDialog.onSelectFolder("+ImageSelector.ID_LAST_24_HOURS+")\"><div class='folder_name_selected'>Added in last 24 hours</div></div>";
			jQuery('#apollo_title_folder_name').html('(Added in last 24 hours)');
		}
		else {
			txt += "<div id='folder_"+ImageSelector.ID_LAST_24_HOURS+"' class='apollo_system_folder' style='width:100%;' onclick=\"ImagePickerDialog.onSelectFolder("+ImageSelector.ID_LAST_24_HOURS+")\"><div class='folder_name'>Added in last 24 hours</div></div>";
		}		
		
		
		// Now paint user's folders.............		
		

		for (var i=0; i<folderList.length; i++){

			var folder_name = ApolloUtils.htmlEncode(folderList[i].name);
			var folder_id = folderList[i].id;
			
			//alert(folder_name + " " + folder_id);
			
			if (folder_id == ImagePickerDialog.folder_id){
				jQuery('#apollo_title_folder_name').html('('+folder_name+')');
				txt += "<div id='folder_"+folder_id+"' class='apollo_folder folder_with_menu' style='width:100%;' title='Right click to edit' onclick=\"ImagePickerDialog.onSelectFolder('"+folder_id+"')\"><div class='folder_name folder_name_selected'>"+folder_name+"</div></div>";
			}
			else {
				txt += "<div id='folder_"+folder_id+"' class='apollo_folder folder_with_menu' style='width:100%;' title='Right click to edit' onclick=\"ImagePickerDialog.onSelectFolder('"+folder_id+"')\"><div class='folder_name'>"+folder_name+"</div></div>";
			}

			
		}
		
		jQuery('#apollo_folder_list').html(txt);
		
		jQuery('.apollo_folder').droppable({
				drop: ImagePickerDialog.onAddToFolder,
				over: function(ev, ui) {jQuery(this).addClass( 'apollo_folder_droppable_hover' );},
				out: function(ev, ui) {jQuery(this).removeClass( 'apollo_folder_droppable_hover' );}
			});			
				
	  //  jQuery(".folder_with_menu").contextMenu({menu: "folderMenu"}, function(action, el, pos){ImagePickerDialog.onMenuItem(action, el)});

		jQuery("#apollo_folder_list").disableSelection();
				
	},
	
	// ////////////////////////////////////////////////////////////////////////////
		
	onSelectFolder : function(folder_id){
		ImagePickerDialog.folder_id = parseInt(folder_id);
		ImagePickerDialog.paintImages();
		ImagePickerDialog.paintFolders();				
	},	
	
	// ////////////////////////////////////////////////////////////////////////////

	/**
	* Get the image list for the currently selected gallery page
	*/
	onSelectImage : function(postID){
	
		//alert('Selected image' + postID + ' URL: ' + ImagePickerData.commandURL);
		
		var paras = '';
		
		if (ImagePickerDialog.mode == ImagePickerDialog.MODE_GALLERY_THUMB){
			paras = {cmd: 8, page_id: ImagePickerDialog.para1, theme_para_id: ImagePickerDialog.themeParaID, image_id: postID, gallery_no: ImagePickerDialog.para2};
		}
		else {			
			if (ImagePickerDialog.isGlobal){
				paras = {cmd: 5, blog_id: ImagePickerDialog.para1, theme_para_id: ImagePickerDialog.themeParaID, para_value: postID};
			}
			else {
				paras = {cmd: 6, page_post_id: ImagePickerDialog.para1, theme_para_id: ImagePickerDialog.themeParaID, para_value: postID};
			}
		}
												
		jQuery.ajax({
			url: ImagePickerData.commandURL,
			dataType: "json",
			data: paras,
			success: function(ret){ImagePickerDialog.onImageSelected(ret);}
		});	
			
	},
	
	// ////////////////////////////////////////////////////////////////////////////
	
	onImageSelected : function(msg){
	
		//eval("var msg = ("+ret+")");
						
		if (msg.result != "ok"){
			ApolloDialog.alert('error!');	
		}
		else {
			// Force a page reload
			window.location.href=window.location.href
		}
			
		jQuery('#apolloImagePickerDialog').dialog('close');		
	}
	
		
}


/**
* Javascript class that allows a user to edit information about an image
*/
var ImageEditDialog = {

	image_post_id : 0,
	image_index : 0, // Image's index in the ImagePickerData image list array
	
	// ////////////////////////////////////////////////////////////////////////////

	show : function(targetDiv, post_id){

		var paras = {cmd: 17, image_post_id: post_id};
												
		jQuery.ajax({
			url: ImagePickerData.commandURL,
			dataType: "json",
			data: paras,
			success: function(ret){ImageEditDialog.onGotData(ret, targetDiv, post_id);}
		});
		
		/*
		var dHeight = jQuery(window).height()/2;
		var dWidth = jQuery(window).width()/2;
		
		var txt = "";
		
		txt += "<div id='ApolloImageEditDialog' align='center'>";
		
		txt += "<img class='imageDisplay' src='' width='100px' height='100px'/>";
		
		txt += "<table width='100%' height='100%' cellspacing='3px'>";		

		txt += "   <tr>";
		txt += "      <td class='titleField'>Title</td>";
		txt += "      <td class='dataField'><input id='apollo_image_title' type=text value=''/></td>";
		txt += "   </tr>";

		txt += "   <tr>";
		txt += "      <td class='titleField'>Added</td>";
		txt += "      <td class='dataField'></td>";
		txt += "   </tr>";

		txt += "   <tr>";
		txt += "      <td class='titleField'>Size</td>";
		txt += "      <td class='dataField'></td>";
		txt += "   </tr>";

		txt += "   <tr>";
		txt += "      <td class='titleField'>Caption</td>";
		txt += "      <td class='dataField'><input id='apollo_image_caption' width='100%' type=text value=''/></td>";
		txt += "   </tr>";

		txt += "   <tr>";
		txt += "      <td class='titleField'>Description</td>";
		txt += "      <td class='dataField'><textarea id='apollo_image_desc' width='100%'></textarea></td>";
		txt += "   </tr>";


		txt += "</table>";
		txt += "</div>";		
					
		jQuery(targetDiv).html(txt);
		
		jQuery(targetDiv).dialog( 'destroy' );
	
		jQuery(targetDiv).dialog({
				modal: true, 
				width:dWidth, 
				height:dHeight, 
				title: '',
				buttons: {
					Save: function() {						
						ImageEditDialog.onSave(image_post_id); jQuery(this).dialog('close');
					},
					Cancel: function() {
						jQuery(this).dialog('close');
					}
			} });
		*/		
		
	},
	
	// ////////////////////////////////////////////////////////////////////////////
		
	onGotData : function(ret, targetDiv, image_post_id){
			
		ImagePickerDialog.image_post_id = image_post_id;
	
		if (ret.result != 'ok') {
			ApolloDialog.error('Error, could not load data!');
			return;
		}
				
		// Get the image data...
				
		var imageList = ImagePickerData.imageList;
		var imageFound = false;
		
		for (var i=0; i<imageList.length; i++){
			
			if (imageList[i].post_id == image_post_id){
			
				var thumb_url = imageList[i].thumb_url;
				var post_id = imageList[i].post_id;
				var img_width = imageList[i].width;
				var img_height = imageList[i].height;
				var image_folder_id = imageList[i].folder_id;
				var added_date = imageList[i].date_added;	// UTC

				var img_title = ApolloUtils.htmlEncode(ret.title);
				var caption = ApolloUtils.htmlEncode(ret.caption);
				var desc = ApolloUtils.htmlEncode(ret.desc);
				var alt_text = ApolloUtils.htmlEncode(ret.alt_text);
				var image_url = ret.image_url;
								
				imageFound = true;
				break;
			}
		}
		
		if (!imageFound) {
			ApolloDialog.error('Error, could not find image!');
			return;
		}
						
		var dHeight = img_height/2 + 250;
		var dWidth = img_width/2 + 50;
		
		if (dWidth < 500) dWidth = 500;
		if (dHeight < 600) dWidth = 600;
		
		var txt = "";
		
		txt += "<div id='ApolloImageEditDialog' align='center'>";
		
		txt += "<img class='imageDisplay' src='"+image_url+"' width='"+Math.round(img_width/2)+"px' height='"+Math.round(img_height/2)+"'/>";
		
		txt += "<table width='100%' height='100%' cellspacing='3px'>";		

		txt += "   <tr>";
		txt += "      <td class='titleField'>Title</td>";
		txt += "      <td class='dataField'><input id='apollo_image_title' type=text value='"+img_title+"'/></td>";
		txt += "   </tr>";
/*
		txt += "   <tr>";
		txt += "      <td class='titleField'>Added</td>";
		txt += "      <td class='dataField'>"+added_date+" (GMT)</td>";
		txt += "   </tr>";

		txt += "   <tr>";
		txt += "      <td class='titleField'>Size</td>";
		txt += "      <td class='dataField'>"+img_width+"px by "+img_height+"px</td>";
		txt += "   </tr>";
*/
		txt += "   <tr>";
		txt += "      <td class='titleField'>Caption</td>";
		txt += "      <td class='dataField'><input id='apollo_image_caption' width='100%' type=text value='"+caption+"'/></td>";
		txt += "   </tr>";

		txt += "   <tr>";
		txt += "      <td class='titleField'>Description</td>";
		txt += "      <td class='dataField'><input id='apollo_image_desc' width='100%' type=text value='"+desc+"'/></td>";
		txt += "   </tr>";
		
		txt += "   <tr>";
		txt += "      <td class='titleField'>Alt Text</td>";
//		txt += "      <td class='dataField'><textarea id='apollo_image_alt' width='100%'>"+alt_text+"</textarea></td>";
		txt += "      <td class='dataField'><input id='apollo_image_alt' width='100%' type=text value='"+alt_text+"'/></td>";
		txt += "   </tr>";


		txt += "</table>";
		txt += "</div>";
			
		//var dialogTitle = img_title + "&nbsp;(" + img_width+"px by "+img_height+"px)";
		var dialogTitle = img_title;
																										
		jQuery(targetDiv).dialog( 'destroy' );

		jQuery(targetDiv).html(txt);
		
		//jQuery(targetDiv).dialog( { width: dWidth, height:dHeight } );

		jQuery(targetDiv).dialog({
				modal: true, 
				width:dWidth, 
				height:dHeight, 
				title: dialogTitle,
				buttons: {
					Save: function() {
						ImageEditDialog.onSave(image_post_id); jQuery(this).dialog('close');
					},
					Cancel: function() {
						jQuery(this).dialog('close');
					}
			} });
		

	},

	// ////////////////////////////////////////////////////////////////////////////

	onSave : function(post_id){
	
		var newTitle = jQuery('#apollo_image_title').val();
		var newCaption = jQuery('#apollo_image_caption').val();
		var newDesc = jQuery('#apollo_image_desc').val();
		var newAlt = jQuery('#apollo_image_alt').val();

		var paras = {cmd: 15, image_post_id: post_id, caption: newCaption, description: newDesc, title: newTitle, alt_text: newAlt };
												
		jQuery.ajax({
			url: ImagePickerData.commandURL,
			dataType: "json",
			data: paras,
			success: function(ret){ImageEditDialog.onSaved(ret, post_id, newTitle, newCaption, newDesc);}
		});	
						
	},
	
	onSaved : function(ret, image_post_id, newTitle, newCaption, newDesc){
			
		// Update
		
		for (var i=0; i<ImagePickerData.imageList.length; i++){
			
			if (ImagePickerData.imageList[i].post_id == image_post_id){
				ImagePickerData.imageList[i].caption = newCaption;
				ImagePickerData.imageList[i].title = newTitle;
				ImagePickerData.imageList[i].desc = newDesc;
				break;
			}
		}		
	}

	// ////////////////////////////////////////////////////////////////////////////
}


/**
* Javascript class that allows a user to pick an image from their wordpress media library
* @see http://www.eyecon.ro/ColorPickerDialog
*/
var ColorPickerDialog = {
	
	isGlobal : false,
	para1 : -1,
	themeParaID : -2,
		
	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	*
	* @param mode 'image' or 'favicon'
	* @param isGlobal true/false 
	* @param themeParaID the theme's parameter id
	* @param para1 'blog id' if isGlobal is true, otherwise this will be 'page_post_id' (the page we're setting the para for)
	*/
	show : function(isGlobal, themeParaID, para1, currentCol){
	
		ColorPickerDialog.isGlobal = isGlobal;
		ColorPickerDialog.para1 = para1;
		ColorPickerDialog.themeParaID = themeParaID;
		
		var targetDiv = '#ApolloImageSelector';

		var txt = "<div id='apolloSelectColor'></div>";
		//txt += "<button class='colorSelectButton' onclick=\"ColorPickerDialog.onSelectColor()\">OK</button>";
						
		ColorPickerDialog.col = currentCol;						
		jQuery(targetDiv).html(txt);					
		jQuery(targetDiv).dialog( 'destroy' );
//		jQuery('#apolloSelectColor').ColorPicker({color: currentCol, flat: true, onSubmit: ColorPickerDialog.onSelectColor(), onChange: function(hsb, hex, rgb, el) {ColorPickerDialog.col = hex;}});					
		jQuery('#apolloSelectColor').ColorPicker({color: currentCol, flat: true, onSubmit: function(hsb, hex, rgb, el) {ColorPickerDialog.onSelectColor(hex);}});					
		jQuery(targetDiv).dialog({modal: true, width:385, height:235, resizable:false, title: 'Pick a color' });
		
	},

	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	* Get the image list for the currently selected gallery page
	*/
	onSelectColor : function(col){
		
		var paras = '';
			
		if (ColorPickerDialog.isGlobal){
			paras = {cmd: 5, blog_id: ColorPickerDialog.para1, theme_para_id: ColorPickerDialog.themeParaID, para_value: col};
		}
		else {
			paras = {cmd: 6, page_post_id: ColorPickerDialog.para1, theme_para_id: ColorPickerDialog.themeParaID, para_value: col};
		}
		//alert('Getting image list for page ' + EditGallery.m_galleryPageID + ' from ' + ApolloPlugin.commandURL);
		
		//alert(ImagePickerData.commandURL);
			
		jQuery.ajax({
			url: ImagePickerData.commandURL,
			dataType: "text",
			data: paras,
			success: function(ret){ColorPickerDialog.onColorSelected(ret);}
		});	
			
	},
	
	// ////////////////////////////////////////////////////////////////////////////
	
	onColorSelected : function(ret){
	
		eval("var msg = ("+ret+")");
					
		if (msg.result != "ok"){
			alert('error!');		
		}
		else {
			// Force a page reload
			window.location.href=window.location.href
		}
			
		jQuery('#apolloColorPickerDialog').dialog('close');		
	}
	
		
}


/**
* Javascript class that allows a user to pick an image from their wordpress media library
* @see http://www.eyecon.ro/ApolloParaPicker
*/
var ApolloParaPicker = {
	
	isGlobal : false,
	blogOrPostID : -1,
	themeParaID : -2,	
	paraValue : '',
	
	// ////////////////////////////////////////////////////////////////////////////

	onSetPageEmail : function(inputFieldDivID, themeParaID, pagePostID){
		
		ApolloParaPicker.isGlobal = false;
		ApolloParaPicker.blogOrPostID = pagePostID;
		ApolloParaPicker.themeParaID = themeParaID;
		ApolloParaPicker.paraValue = jQuery(inputFieldDivID).val();
		
		ApolloParaPicker.onSelect();
	},

	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	* Get the image list for the currently selected gallery page
	*/
	onSelect : function(){
	
		var paras = '';
			
		if (ApolloParaPicker.isGlobal){
			paras = {cmd: 5, blog_id: ApolloParaPicker.blogOrPostID, theme_para_id: ApolloParaPicker.themeParaID, para_value: ApolloParaPicker.paraValue};
		}
		else {
			paras = {cmd: 6, page_post_id: ApolloParaPicker.blogOrPostID, theme_para_id: ApolloParaPicker.themeParaID, para_value: ApolloParaPicker.paraValue};
		}
		//alert('Getting image list for page ' + EditGallery.m_galleryPageID + ' from ' + ApolloPlugin.commandURL);
												
		jQuery.ajax({
			url: ApolloPlugin.commandURL,
			dataType: "text",
			data: paras,
			success: function(ret){ApolloParaPicker.onColorSelected(ret);}
		});	
			
	},
	
	// ////////////////////////////////////////////////////////////////////////////
	
	onColorSelected : function(ret){
	
		eval("var msg = ("+ret+")");
						
		if (msg.result != "ok"){
			alert('error!');		
		}
		else {
			// Force a page reload
			window.location.href=window.location.href
		}
			
		jQuery('#apolloApolloParaPicker').dialog('close');		
	}
	
		
}


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
			{ label: "Firefox 2",  data: firefox2},
			{ label: "Firefox 3",  data: firefox3},
			{ label: "Safari 2",  data: safari2},
			{ label: "Safari 3",  data: safari3},
			{ label: "Safari 4",  data: safari4},
			{ label: "iPhone",  data: iphone},
			{ label: "IE 6",  data: ie6},
			{ label: "IE 7",  data: ie7},
			{ label: "IE 8",  data: ie8},
			{ label: "IE 9",  data: ie9},
			{ label: "Chrome",  data: chrome},
			{ label: "Other",  data: other}
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
	paintCrawlerGraph : function(div){
	
		var stats = StatViewerData.crawlerStats;
		var no_stats = StatViewerData.crawlerStats.length;
		
		var yahooStats = new Array(); // Hits from 'Yahoo! Slurp'
		var googleStats = new Array(); // Hits from 'GoogleBot'
		var msnStats = new Array(); // Hits from 'MSN'
		var curlStats = new Array(); // Hits from 'Curl'
		var yandexStats = new Array(); // Hits from 'Yandex' (Russian)
		var otherStats = new Array(); // Others
		
	    var maxTime = new Date('1/1/1970');
		var nowTime = new Date();
		
		//Set 1 day in milliseconds
		var one_day=1000*60*60*24

		// Clear arrays 
		for (var i=1; i<31; i++){
		
		    var now = new Date();
		    now.setDate(now.getDate()-i);
		    
			googleStats[i] = new Array(now.getTime(), 0);
			yahooStats[i] = new Array(now.getTime(), 0);
			msnStats[i] = new Array(now.getTime(), 0);
			curlStats[i] = new Array(now.getTime(), 0);
			otherStats[i] = new Array(now.getTime(), 0);
		    	    
		}
		
		// Get the number of different crawlers
		for (var i=0; i<no_stats; i++){
			
			var crawler = StatViewerData.crawlerStats[i].crawler;
			var hits = StatViewerData.crawlerStats[i].hits;
			var t = new Date(StatViewerData.crawlerStats[i].statdate);
						
			var daysago = Math.floor((nowTime.getTime() - t.getTime())/one_day);
			//alert(daysago);
			
			if (crawler.indexOf('Google') != -1){
				googleStats[daysago] = Array(t.getTime(), hits);
			}
			else if (crawler.indexOf('MSN') != -1){
				//msnStats.push([t.getTime(), hits]);
				msnStats[daysago] = Array(t.getTime(), hits);
			}
			else if (crawler.indexOf('Yahoo') != -1){
				yahooStats[daysago] = Array(t.getTime(), hits);
//				yahooStats.push([t.getTime(), hits]);
			}
			else if (crawler.indexOf('Curl') != -1){
				curlStats[daysago] = Array(t.getTime(), hits);
				//curlStats.push([t.getTime(), hits]);
			}
			else if (crawler.indexOf('Yandex') != -1){
				yandexStats[daysago] = Array(t.getTime(), hits);
				//curlStats.push([t.getTime(), hits]);
			}
			else {
				otherStats[daysago] = Array(t.getTime(), hits);
				//otherStats.push([t.getTime(), hits]);
			}
			
			if (t.getTime() > maxTime.getTime()){
				maxTime = new Date(t.getTime());
			}			
		}	
        
        	
	    var now = new Date();
	    now.setDate(now.getDate()-30);	    

	    var startTime = now.getTime();
		var endTime = maxTime.getTime();
        	        	
        if (StatViewerData.isGlobal){
 	   		var plot = jQuery.plot(jQuery(div), [
		        {
	    	        data: googleStats,
	        	    label: 'Google',
					bars: { show: true }
		        },
		        {
	    	        data: yahooStats,
	        	    label: 'Yahoo',
					bars: { show: true }
		        },
		        {
	    	        data: msnStats,
	        	    label: 'Bing (Microsoft)',
					bars: { show: true }
		        },
		        {
	    	        data: curlStats,
	        	    label: 'Curl (probable spambot)',
					bars: { show: true }
		        },
		        {
	    	        data: yandexStats,
	        	    label: 'Yandex (Russian)',
					bars: { show: true }
		        },
	    	    {
	        	    data: otherStats,
	            	label: 'Other',
					bars: { show: true }
	    	    }],
	        	{
	        		xaxis: { mode: "time", min: startTime, max: endTime },
	        		grid: { hoverable: true, clickable: true },
	        		series: {
	        			bars: { show: true, lineWidth: 5 },
	        			points: { show: false, fill: false }
	        		}
	        	});	   
        }
        else {        	
	   		var plot = jQuery.plot(jQuery(div), [
		        {
	    	        data: googleStats,
	        	    label: 'Google',
					bars: { show: true },
		        },
		        {
	    	        data: yahooStats,
	        	    label: 'Yahoo',
					bars: { show: true }
		        },
		        {
	    	        data: msnStats,
	        	    label: 'Bing (Microsoft)',
					bars: { show: true }
		        },
		        {
	    	        data: yandexStats,
	        	    label: 'Yandex (Russian)',
					bars: { show: true }
		        },
	    	    {
	        	    data: otherStats,
	            	label: 'Other',
					bars: { show: true }
	    	    }],
	        	{
	        		xaxis: { mode: "time", min: startTime, max: endTime },
	        		grid: { hoverable: true, clickable: true },
	        		series: {
	        			bars: { show: true, lineWidth: 5 },
	        			points: { show: false, fill: false }
	        		}
	        	});	        	
        }	
        	
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
	*/
	paintStatGraph : function(div){
	
		var uniqueViews = StatViewerData.uniqueViewList;
		var pageViews = StatViewerData.pageViewList;
		var dateList = StatViewerData.dateList;
		
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
            	lines: { show: true, fill: true }
	        },
    	    {
        	    data: graphdata2,
            	label: 'Page Views',
	            lines: { show: true, fill: true }
    	    }],
        	{
        		xaxis: { mode: "time", min: startTime, max: endTime },
        		grid: { hoverable: true, clickable: true },
        		series: {lines: { show: true }, points: { show: true }}
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


var EditGallery = {

	/** Gallery page post id */
	m_galleryPageID : 0,
	
	m_slots : 0,
	
	m_minNumberSlots : 20,

	m_maxNoSlots : 60,
	
	/** Matches the thumbnail width in the php code */	
	thumbWidth : 50,
	
	m_galleryDescriptions : '',
		
	m_themeParaID : -1,
	
	// ////////////////////////////////////////////////////////////////////////////
	
	init : function(){

		// Find out what gallery is currently selected
		EditGallery.selectGallery(jQuery('#apollo_edit_gallery_select').val());
			
		jQuery('#ApolloImageSelector').droppable({
		   drop: EditGallery.onRemove
		});		
											
	},

	// ////////////////////////////////////////////////////////////////////////////

	selectGallery : function(fieldVal){

		// Number in format xx_yy where xx is the theme para id, and yy is the page_id
		var sepIndx = fieldVal.indexOf('_');
				
		EditGallery.m_themeParaID = parseInt(fieldVal.substring(0,sepIndx));
		EditGallery.m_galleryPageID = parseInt(fieldVal.substring(sepIndx+1));

		EditGallery.getImageList();
				
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	/**
	* Add another (empty) slot to the gallery
	*/
	
	addSlot : function(){
					
		// Add an empty slot at the end
		var img = new Array();
		img.url = '';
		img.image_id = 0;
		
		// Add to all galleries
		for (var gal_no=0; gal_no<EditGallery.m_slots.length; gal_no++){
		
			if (EditGallery.m_slots[gal_no].length >= EditGallery.m_maxNoSlots){
				if (EditGallery.m_slots.length == 0){
					alert("Sorry, you can't add any more slots to this gallery!");
				}
			}
			else {
				EditGallery.m_slots[gal_no].push(img);
			}
		}
				
		EditGallery.repaintGallery();
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	/**
	* Respond to user request to add another gallery
	*/
	addSubGallery : function(){
	
		var galData = -1;
		for (var i=0; i<EditGalleryData.galleryData.length; i++){
			if (EditGalleryData.galleryData[i].page_post_id == EditGallery.m_galleryPageID){
				galData = EditGalleryData.galleryData[i];
				EditGallery.galeryDataIndex = i;
				break;
			}
		}
		
		if (galData == -1) {
			alert('Error!');
		}
			
		var no_gals = galData.no_galleries;
		
		if (no_gals >= 99){
			alert("I'm sorry, but you've already reached your maximum number of sub-galleries!");
			return;
		}
		
		var paras = {cmd: 7, page_id: EditGallery.m_galleryPageID, theme_para_id: galData.theme_para_id};
				
		jQuery.ajax({
			url: EditGalleryData.commandURL,
			dataType: "json",
			data: paras,
			success: function(ret){EditGallery.onSubGalleryAdded(ret);}
		});	

				
	},
	
	onSubGalleryAdded : function(msg){
	
		//eval("var msg = ("+ret+")");
								
		if (msg.result = "ok"){
			//EditGallery.m_themeParaID = msg.data.theme_para_id;
			/*
			var page_id = msg.data.page_post_id;
			
			// Find this gallery in the EditGalleryData data, and update the sub-gallery count
			for (var i=0; i<EditGalleryData.galleryData.length; i++){
				if (EditGalleryData.galleryData[i].page_post_id == page_id){
					EditGalleryData.galleryData[i].no_galleries++;
					break;
				}
			}
	
			EditGallery.getImageList();	
			*/
			// Force page refresh
			window.location = window.location;	
		}
		else {
			ApolloDialog.error("Sorry, you can not add any more sub-galleries!");
		}
			
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	deleteGallery : function(themeParaID, galleryNo){
		ApolloDialog.confirm("Are you sure you want to delete this sub-gallery? This can not be undone!", function(){EditGallery.doDeleteGallery(themeParaID, galleryNo)});			
	},


	doDeleteGallery : function(themeParaID, galleryNo){

		paras = {cmd: 18, page_id: EditGallery.m_galleryPageID, theme_para_id: themeParaID, gallery_no: galleryNo};
		
		jQuery.ajax({
			url: EditGalleryData.commandURL,
			dataType: "json",
			data: paras,
			success: function(ret){
				if (ret.result == 'ok'){
					window.location.href=window.location.href;
				}
				else {
					ApolloDialog.error("Sorry, you can not delete this sub-gallery!");
				}
			} // Force a page reload
		});	
			
	},
			
	// ////////////////////////////////////////////////////////////////////////////

	setGalleryTitle : function(themeParaID, galleryNo){
	
		paras = {cmd: 9, page_id: EditGallery.m_galleryPageID, theme_para_id: themeParaID, gallery_no: galleryNo, title: jQuery('#galname_'+galleryNo).val()};
		
		jQuery.ajax({
			url: EditGalleryData.commandURL,
			dataType: "json",
			data: paras
//			success: function(ret){window.location.href=window.location.href;} // Force a page reload
//			success: function(ret){alert(ret)} // Force a page reload
		});	
		
	},

	// ////////////////////////////////////////////////////////////////////////////

	setGalleryImagePostID : function(themeParaID, galleryNo){
		ImagePickerDialog.show(ImagePickerDialog.MODE_GALLERY_THUMB, false, themeParaID, EditGallery.m_galleryPageID, galleryNo);
	},
				
	// ////////////////////////////////////////////////////////////////////////////

	clear : function(){
		jQuery('#apollo_gallery').html("");
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	galeryDataIndex : -1,

	repaintGallery : function(){
		
		jQuery(".gallery_thumb").draggable('destroy');
		jQuery(".thumb").draggable('destroy');
		jQuery(".gallery_slot").droppable('destroy');
		
		var galData = -1;
		
		for (var i=0; i<EditGalleryData.galleryData.length; i++){
			if (EditGalleryData.galleryData[i].page_post_id == EditGallery.m_galleryPageID){
				galData = EditGalleryData.galleryData[i];
				EditGallery.galeryDataIndex = i;
				break;
			}
		}
		
		// Is this a multi-gallery?
		//alert(galData.page_post_id);
		
		// Clear draggables
		jQuery(".gallery_thumb").draggable('destroy');
		jQuery(".thumb").draggable('destroy');
		

		if (galData.is_multi){
			jQuery('.apollo_add_subgallery_button').show();
		}
		else {
			jQuery('.apollo_add_subgallery_button').hide();
		}

		
		EditGallery.doRepaintGallery(galData);
				
		
		// Setup draggables....
				
		jQuery(".gallery_thumb").draggable({revert: 'invalid', zIndex: 300});
		jQuery(".thumb").draggable({revert: true, zIndex: 300});		
		
		jQuery('.gallery_slot').droppable({
		   drop: EditGallery.onDrop
		});							
		
		jQuery("#apollo_gallery").disableSelection();
		
	},
		
	// ////////////////////////////////////////////////////////////////////////////

	/**
	* Paint the view for a standard gallery
	*/
	doRepaintGallery : function(galData){	
				
		var no_galleries = 1;
		
		if (galData.is_multi){
			no_galleries = galData.no_galleries;
		}
						
		var txt = "";
		
		for (var gal_no=0; gal_no < no_galleries; gal_no++){

			var gal_nostr = '' + gal_no;			
			if (gal_nostr.length < 2) gal_nostr = '00'+gal_no; // Make sure this is a 3 digit no
			if (gal_nostr.length < 3) gal_nostr = '0'+gal_no; // Make sure this is a 3 digit no

			//alert("gal_no = " + gal_no + " gal_nostr = " + gal_nostr + " length = " + gal_nostr.length);
			
			txt += "<div class='box'>";
			
			if (galData.is_multi){
				
				//var title = galData[gal_no].title;
				//var desc = galData[gal_no].description;
				var title = galData.meta[gal_no].title;
				var thumb_url = galData.meta[gal_no].thumb_url;

				txt += "<div class='multicontrols'>";
				txt += "   <table><tr valign='middle'>";
				txt += "      <td style='padding-right:5px'>";
				if (thumb_url != ''){
					txt += "         <img class='gallery_meta_thumb' src='"+thumb_url+"' width='30px'/>";
				}
				txt += "      </td>";
				txt += "      <td>";
				txt += "         Title: ";
				txt += "         <input id='galname_"+gal_no+"' type='text' value='"+title+"'/>";
				txt += "      </td>";
				txt += "      <td>";
				txt += "         <div class='apollo_update_button' onclick=\"EditGallery.setGalleryTitle('"+galData.theme_para_id+"', '"+gal_no+"')\"></div>";
				txt += "      </td>";
				txt += "      <td style='padding-left:10px'>";
				txt += "         <div class='apollo_thumbnail_button' onclick=\"EditGallery.setGalleryImagePostID('"+galData.theme_para_id+"', '"+gal_no+"')\"></div>";
				txt += "      </td>";
				txt += "      <td style='padding-left:10px'>";
				txt += "         <div class='apollo_delete_gallery_button' onclick=\"EditGallery.deleteGallery('"+galData.theme_para_id+"', '"+gal_no+"')\"></div>";
				txt += "      </td>";								
				txt += "   </tr></table>";
				txt += "</div>";

			}
						
			for (var i=0; i<EditGallery.m_slots[gal_no].length; i++){
							
				txt += "<div class='gallery_slot' id='slot_"+gal_nostr+"_"+i+"' align='center'><table><tr><td>";
				
//				alert('['+gal_no+'] ' + EditGallery.m_slots[gal_no][i].gallery_number + ' ' + gal_no);
				
				if (EditGallery.m_slots[gal_no][i].url == ''){
					txt += "<div class='gallery_slot_text' align='center'>"+(i+1)+"</div>";
				}
				else {
					var img_id = EditGallery.m_slots[gal_no][i].image_id;
					var url = EditGallery.m_slots[gal_no][i].url;				
					var style = "style='background-image: url("+url+")'; margin:0; padding:0;";
						
					txt += "<img src='"+url+"' id='galimg_"+gal_nostr+"_"+img_id+"' slot='"+i+"' class='gallery_slot_image gallery_thumb' width='100%' />";
					
				}
				
				txt += "</td></tr></table></div>";
			}	
			
			txt += "</div>";
			
			if (galData.is_multi){
				txt += "<br/>";
			}
		
		}
			
		jQuery('#apollo_gallery').html(txt);
		

		
	},
	
	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	* Get the image list for the currently selected gallery page
	*/
	getImageList : function(){
	
		//alert('Getting image list for page ' + EditGallery.m_galleryPageID + ' from ' + EditGalleryData.commandURL);
		
		var paras = {cmd: 1, page_id: EditGallery.m_galleryPageID, theme_para_id: EditGallery.m_themeParaID};
				
		jQuery.ajax({
			url: EditGalleryData.commandURL,
			dataType: "json",
			data: paras,
			success: function(ret){EditGallery.onGotImageList(ret);}
		});	
			
	},
	
	// ////////////////////////////////////////////////////////////////////////////
	
	onGotImageList : function(msg){
	
		//eval("var msg = ("+ret+")");
				
		//alert(msg.result);
				
		if (msg.result = "ok"){
		
			var number_galleries = msg.number_galleries; // Number of sub galleries, should be 1 except for mult-galleries
						
			EditGallery.m_slots = new Array(number_galleries);
												
			for(var gal_no=0; gal_no<number_galleries; gal_no++){

				var max_slot_no = 0;
				var data = msg.data[gal_no];
				
				if (data == undefined){
					data = new Array();
				}
											
				// Get the max slot no
				for (var i=0; i<data.length; i++){
					var slot_no = parseInt(data[i].slot_number) + 1;
					if (slot_no > max_slot_no) {
						max_slot_no = slot_no;
					}
				}			
	
				if (max_slot_no < EditGallery.m_minNumberSlots){
					max_slot_no = EditGallery.m_minNumberSlots;
				}
	
				// Clear out all the slots
				EditGallery.m_slots[gal_no] = new Array(max_slot_no);
					
				for (var i=0; i<max_slot_no; i++){
				
					var img = new Array();
					img.url = '';
					img.image_id = 0;
					img.gallery_no = 0;
					img.theme_para_id = 0;
																
					EditGallery.m_slots[gal_no][i] = img;				
				}
							
				
				// Load up new data...	
				for (var i=0; i<data.length; i++){
					
					var slot_no = data[i].slot_number;
					
					EditGallery.m_slots[gal_no][slot_no].url = data[i].url;
					EditGallery.m_slots[gal_no][slot_no].image_id = data[i].image_post_id;
					EditGallery.m_slots[gal_no][slot_no].theme_para_id = data[i].theme_para_id;
					
					//alert("[" + data[i].image_post_id + "] " + data[i].url);
					
				}
			
			}
																		
			EditGallery.repaintGallery();
			
		}
		else {
			ApolloDialog.error("Error getting images, please refresh the page to try again. If this problem persists, contact ApolloSites support. We apologize for any inconvenience");
		}
			
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	onMoveImage : function(imageID, old_slot, new_slot, oldGalleryNo, newGalleryNo) {
		
		//alert('moving image: imageID = ' + imageID + ' slot = ' + slot + ' url = ' + imgURL);
		
		var paras = {cmd: 3, image_id: imageID, old_slot_no: old_slot, new_slot_no: new_slot, page_id: EditGallery.m_galleryPageID, old_gallery_no: oldGalleryNo, new_gallery_no: newGalleryNo, theme_para_id: EditGallery.m_themeParaID};
		
		ApolloDialog.showLoading("Moving image");
				
		jQuery.ajax({
			url: EditGalleryData.commandURL,
			dataType: "json",
			data: paras,
			success: function(ret){EditGallery.onImageMoved(ret);}
		});
	
	},
	
	onImageMoved : function(ret){
		
		//eval("var msg = ("+ret+")");
		ApolloDialog.hideLoading();
				
		if (ret.result != "ok"){
			ApolloDialog.error('Error moving image');
		}
		else {
			EditGallery.onGotImageList(ret);
		}
				
	},
		
	// ////////////////////////////////////////////////////////////////////////////
	
	onAddImage : function(imageID, slot, imgURL, galleryNo){
		
		//alert('adding image: pageID = ' + EditGallery.m_galleryPageID + ' imageID = ' + imageID + ' slot = ' + slot + ' gallery = ' + galleryNo + ' url = ' + imgURL);
		
		var paras = {cmd: 2, page_id: EditGallery.m_galleryPageID, image_id: imageID, slot_no: slot, gallery_no: galleryNo, theme_para_id: EditGallery.m_themeParaID};
			
		ApolloDialog.showLoading("Adding image");
				
		jQuery.ajax({
			url: EditGalleryData.commandURL,
			dataType: "json",
			data: paras,
			success: function(ret){EditGallery.onImageAdded(ret);}
		});	
		
	},

	onImageAdded : function(ret){
		
		//eval("var msg = ("+ret+")");
		ApolloDialog.hideLoading();
				
		if (ret.result != "ok"){
			ApolloDialog.error('Error adding image');
		}
		else {
			EditGallery.onGotImageList(ret);
		}
		
	},
	
	// ////////////////////////////////////////////////////////////////////////////
	
	onRemoveImage : function(imageID, galleryNo, slot){

		var paras = {cmd: 4, page_id: EditGallery.m_galleryPageID, slot_no: slot, image_id: imageID, gallery_no: galleryNo, theme_para_id: EditGallery.m_themeParaID};
				
		jQuery.ajax({
			url: EditGalleryData.commandURL,
			dataType: "json",
			data: paras,
			success: function(ret){EditGallery.onImageRemoved(ret);}
		});	
		
	},
	
	onImageRemoved : function(ret){
		
		//eval("var msg = ("+ret+")");
				
		if (ret.result != "ok"){
			ApolloDialog.error('Error removing image');
		}

		// Force a repaint!
		EditGallery.repaintGallery();
		
	},
		
	// ////////////////////////////////////////////////////////////////////////////
		
	/**
	* Handle an image being dropped on the gallery, or moved withing the gallery
	*/	
	onDrop : function(event, ui){
	
		//alert('EditGallery.onDrop()');
		
		var slot_id = 0;
		var img_id = -1;
		var url = '';
		var image_moved = true;
		var gal_no = -1;
		var prev_slot_id = -1;
		var dropped_gal_no = -1;
						
		if (jQuery(ui.draggable).attr('id').substring(0,3) == 'gal'){

			// This is an existing image being moved!	
			
			// Format: 'galimg_xxx_yy' where xxx is gallery id, and yy is image_id			 
			gal_no = parseInt(jQuery(ui.draggable).attr('id').substring(7,10));						
			img_id = parseInt(jQuery(ui.draggable).attr('id').substring(11));						
			slot_id = parseInt(jQuery(this).attr('id').substring(9));	// format slot_000_4
			dropped_gal_no = parseInt(jQuery(this).attr('id').substring(5,8));	// format slot_000_4

			var gal_nostr = '' + gal_no;			
			if (gal_nostr.length < 2) gal_nostr = '00'+gal_no; // Make sure this is a 3 digit no
			if (gal_nostr.length < 3) gal_nostr = '0'+gal_no; // Make sure this is a 3 digit no

			url = jQuery('#galimg_'+gal_nostr+"_"+img_id).attr('src');
						
			//alert('moving image: imageID = ' + img_id + ' slot = ' + slot_id + ' gallery no = ' + gal_no + ' url = ' + url);
			
			// As this image was moved, clear the slot it came from					
			var prev_slot_id = jQuery(ui.draggable).attr('slot');	

			if (prev_slot_id != -1){	
				EditGallery.m_slots[gal_no][prev_slot_id].url = '';
				EditGallery.m_slots[gal_no][prev_slot_id].image_id = 0;
			}
			else {
				alert('Error: Previous slot is undefined!');
			}
						
		}
		else {
			
			// This is a new image being added
			image_moved = false;
			
			// Format: 'slot_xxx_yy' where xxx is gallery id, and yy is image_id			 
			
			img_id = parseInt(jQuery(ui.draggable).attr('id').substring(4));			
			
			slot_id = parseInt(jQuery(this).attr('id').substring(9));			
	        gal_no = parseInt(jQuery(this).attr('id').substring(5,8));	
			dropped_gal_no = gal_no;
			
			//alert(jQuery(this).attr('id') + " --- " + jQuery(this).attr('id').substring(5,8));
			
			url = jQuery('#img_'+img_id).attr('src');
							
			//alert('adding image: imageID = ' + img_id + ' slot = ' + slot_id + ' gallery no = ' + gal_no + ' url = ' + url);
						
			//<img id='img_jQuerypost_id' src='jQuerythumb_url' class='thumb' width='".THUMB_WIDTH."'/>
			//var txt = "<img src='"+url+"' id='galimg_"+img_id+"' slot='"+slot_id+"' class='thumb gallery_thumb' width='"+EditGallery.thumbWidth+"' />";		

		}

		if (img_id == -1){
			alert('bad image id');
			return;
		}

		
		//
		// Check to see if the new slot is empty, if it isn't then shift everything by 1 		
		//
		
		if (EditGallery.m_slots[dropped_gal_no][slot_id].url != ''){

			tempSlots = new Array();
		
			for (var i=0; i<slot_id; i++){
				tempSlots.push(EditGallery.m_slots[dropped_gal_no][i]);
			}
		
			var img = new Array();
			img.url = url;
			img.image_id = img_id;
						
			tempSlots.push(img);
			
			var skipped = false;
			
			for (var j=slot_id; j<EditGallery.m_slots[dropped_gal_no].length; j++){									
				
				// Check if the next slot is open, if so we stop incrementing everything
				
				if (EditGallery.m_slots[dropped_gal_no][j].url == ''){
					if (!skipped){
						skipped = true;
					}
					else {
						if (tempSlots.length < EditGallery.m_maxNoSlots){
							tempSlots.push(EditGallery.m_slots[dropped_gal_no][j]);
						}
					}
				}					
				else {
					if (tempSlots.length < EditGallery.m_maxNoSlots){
						tempSlots.push(EditGallery.m_slots[dropped_gal_no][j]);
					}
				}
				
			}				
			
			EditGallery.m_slots[dropped_gal_no] = tempSlots;
		}
		else {
			// Add to slot array
			EditGallery.m_slots[dropped_gal_no][slot_id].url = url;
			EditGallery.m_slots[dropped_gal_no][slot_id].image_id = img_id;
		}	
			
			
		// Update the database...
		if (image_moved){
			// onMoveImage : function(old_slot, new_slot, galleryNo)
			EditGallery.onMoveImage(img_id, prev_slot_id, slot_id, gal_no, dropped_gal_no);
		}
		else {
			EditGallery.onAddImage(img_id, slot_id, url, gal_no);
		}
			
		// Repaint gallery view		
		//EditGallery.clear();
		EditGallery.repaintGallery();
		
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	/**
	* Handle a image being dragged out of the gallery and back into the library (i.e.
	* removed from the gallery)
	*/
	onRemove : function(event, ui){
	
		if (jQuery(ui.draggable).attr('id').substring(0,3) == 'gal'){

			// This is an existing image being moved!	
			//var img_id = parseInt(jQuery(ui.draggable).attr('id').substring(7));						
			var slot_id = parseInt(jQuery(ui.draggable).attr('slot'));			

			// Format: 'galimg_xxx_yy' where xxx is gallery id, and yy is image_id			 
			// This is an existing image being moved!	
			var gal_no = parseInt(jQuery(ui.draggable).attr('id').substring(7,10));						
			var img_id = parseInt(jQuery(ui.draggable).attr('id').substring(11));						
			//var slot_id = parseInt(jQuery(this).attr('id').substring(9));
			
			//alert("Removing Image: slot = " + slot_id + " image id = " + img_id + " gallery no = " + gal_no);
			
			// Clear the slot
			if (slot_id != undefined){
				EditGallery.m_slots[gal_no][slot_id].url = '';
				EditGallery.m_slots[gal_no][slot_id].image_id = 0;
				EditGallery.m_slots[gal_no][slot_id].theme_para_id = 0;
			}
				
			EditGallery.onRemoveImage(img_id, gal_no, slot_id, EditGallery.m_themeParaID);			

			// Repaint gallery view		
			EditGallery.repaintGallery();
		}			
		
	}		
}


