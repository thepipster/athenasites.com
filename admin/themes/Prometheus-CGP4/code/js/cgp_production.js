/*	SWFObject v2.2 <http://code.google.com/p/swfobject/> 
	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
var swfobject=function(){var D="undefined",r="object",S="Shockwave Flash",W="ShockwaveFlash.ShockwaveFlash",q="application/x-shockwave-flash",R="SWFObjectExprInst",x="onreadystatechange",O=window,j=document,t=navigator,T=false,U=[h],o=[],N=[],I=[],l,Q,E,B,J=false,a=false,n,G,m=true,M=function(){var aa=typeof j.getElementById!=D&&typeof j.getElementsByTagName!=D&&typeof j.createElement!=D,ah=t.userAgent.toLowerCase(),Y=t.platform.toLowerCase(),ae=Y?/win/.test(Y):/win/.test(ah),ac=Y?/mac/.test(Y):/mac/.test(ah),af=/webkit/.test(ah)?parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,X=!+"\v1",ag=[0,0,0],ab=null;if(typeof t.plugins!=D&&typeof t.plugins[S]==r){ab=t.plugins[S].description;if(ab&&!(typeof t.mimeTypes!=D&&t.mimeTypes[q]&&!t.mimeTypes[q].enabledPlugin)){T=true;X=false;ab=ab.replace(/^.*\s+(\S+\s+\S+$)/,"$1");ag[0]=parseInt(ab.replace(/^(.*)\..*$/,"$1"),10);ag[1]=parseInt(ab.replace(/^.*\.(.*)\s.*$/,"$1"),10);ag[2]=/[a-zA-Z]/.test(ab)?parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0}}else{if(typeof O.ActiveXObject!=D){try{var ad=new ActiveXObject(W);if(ad){ab=ad.GetVariable("$version");if(ab){X=true;ab=ab.split(" ")[1].split(",");ag=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}}catch(Z){}}}return{w3:aa,pv:ag,wk:af,ie:X,win:ae,mac:ac}}(),k=function(){if(!M.w3){return}if((typeof j.readyState!=D&&j.readyState=="complete")||(typeof j.readyState==D&&(j.getElementsByTagName("body")[0]||j.body))){f()}if(!J){if(typeof j.addEventListener!=D){j.addEventListener("DOMContentLoaded",f,false)}if(M.ie&&M.win){j.attachEvent(x,function(){if(j.readyState=="complete"){j.detachEvent(x,arguments.callee);f()}});if(O==top){(function(){if(J){return}try{j.documentElement.doScroll("left")}catch(X){setTimeout(arguments.callee,0);return}f()})()}}if(M.wk){(function(){if(J){return}if(!/loaded|complete/.test(j.readyState)){setTimeout(arguments.callee,0);return}f()})()}s(f)}}();function f(){if(J){return}try{var Z=j.getElementsByTagName("body")[0].appendChild(C("span"));Z.parentNode.removeChild(Z)}catch(aa){return}J=true;var X=U.length;for(var Y=0;Y<X;Y++){U[Y]()}}function K(X){if(J){X()}else{U[U.length]=X}}function s(Y){if(typeof O.addEventListener!=D){O.addEventListener("load",Y,false)}else{if(typeof j.addEventListener!=D){j.addEventListener("load",Y,false)}else{if(typeof O.attachEvent!=D){i(O,"onload",Y)}else{if(typeof O.onload=="function"){var X=O.onload;O.onload=function(){X();Y()}}else{O.onload=Y}}}}}function h(){if(T){V()}else{H()}}function V(){var X=j.getElementsByTagName("body")[0];var aa=C(r);aa.setAttribute("type",q);var Z=X.appendChild(aa);if(Z){var Y=0;(function(){if(typeof Z.GetVariable!=D){var ab=Z.GetVariable("$version");if(ab){ab=ab.split(" ")[1].split(",");M.pv=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}else{if(Y<10){Y++;setTimeout(arguments.callee,10);return}}X.removeChild(aa);Z=null;H()})()}else{H()}}function H(){var ag=o.length;if(ag>0){for(var af=0;af<ag;af++){var Y=o[af].id;var ab=o[af].callbackFn;var aa={success:false,id:Y};if(M.pv[0]>0){var ae=c(Y);if(ae){if(F(o[af].swfVersion)&&!(M.wk&&M.wk<312)){w(Y,true);if(ab){aa.success=true;aa.ref=z(Y);ab(aa)}}else{if(o[af].expressInstall&&A()){var ai={};ai.data=o[af].expressInstall;ai.width=ae.getAttribute("width")||"0";ai.height=ae.getAttribute("height")||"0";if(ae.getAttribute("class")){ai.styleclass=ae.getAttribute("class")}if(ae.getAttribute("align")){ai.align=ae.getAttribute("align")}var ah={};var X=ae.getElementsByTagName("param");var ac=X.length;for(var ad=0;ad<ac;ad++){if(X[ad].getAttribute("name").toLowerCase()!="movie"){ah[X[ad].getAttribute("name")]=X[ad].getAttribute("value")}}P(ai,ah,Y,ab)}else{p(ae);if(ab){ab(aa)}}}}}else{w(Y,true);if(ab){var Z=z(Y);if(Z&&typeof Z.SetVariable!=D){aa.success=true;aa.ref=Z}ab(aa)}}}}}function z(aa){var X=null;var Y=c(aa);if(Y&&Y.nodeName=="OBJECT"){if(typeof Y.SetVariable!=D){X=Y}else{var Z=Y.getElementsByTagName(r)[0];if(Z){X=Z}}}return X}function A(){return !a&&F("6.0.65")&&(M.win||M.mac)&&!(M.wk&&M.wk<312)}function P(aa,ab,X,Z){a=true;E=Z||null;B={success:false,id:X};var ae=c(X);if(ae){if(ae.nodeName=="OBJECT"){l=g(ae);Q=null}else{l=ae;Q=X}aa.id=R;if(typeof aa.width==D||(!/%$/.test(aa.width)&&parseInt(aa.width,10)<310)){aa.width="310"}if(typeof aa.height==D||(!/%$/.test(aa.height)&&parseInt(aa.height,10)<137)){aa.height="137"}j.title=j.title.slice(0,47)+" - Flash Player Installation";var ad=M.ie&&M.win?"ActiveX":"PlugIn",ac="MMredirectURL="+O.location.toString().replace(/&/g,"%26")+"&MMplayerType="+ad+"&MMdoctitle="+j.title;if(typeof ab.flashvars!=D){ab.flashvars+="&"+ac}else{ab.flashvars=ac}if(M.ie&&M.win&&ae.readyState!=4){var Y=C("div");X+="SWFObjectNew";Y.setAttribute("id",X);ae.parentNode.insertBefore(Y,ae);ae.style.display="none";(function(){if(ae.readyState==4){ae.parentNode.removeChild(ae)}else{setTimeout(arguments.callee,10)}})()}u(aa,ab,X)}}function p(Y){if(M.ie&&M.win&&Y.readyState!=4){var X=C("div");Y.parentNode.insertBefore(X,Y);X.parentNode.replaceChild(g(Y),X);Y.style.display="none";(function(){if(Y.readyState==4){Y.parentNode.removeChild(Y)}else{setTimeout(arguments.callee,10)}})()}else{Y.parentNode.replaceChild(g(Y),Y)}}function g(ab){var aa=C("div");if(M.win&&M.ie){aa.innerHTML=ab.innerHTML}else{var Y=ab.getElementsByTagName(r)[0];if(Y){var ad=Y.childNodes;if(ad){var X=ad.length;for(var Z=0;Z<X;Z++){if(!(ad[Z].nodeType==1&&ad[Z].nodeName=="PARAM")&&!(ad[Z].nodeType==8)){aa.appendChild(ad[Z].cloneNode(true))}}}}}return aa}function u(ai,ag,Y){var X,aa=c(Y);if(M.wk&&M.wk<312){return X}if(aa){if(typeof ai.id==D){ai.id=Y}if(M.ie&&M.win){var ah="";for(var ae in ai){if(ai[ae]!=Object.prototype[ae]){if(ae.toLowerCase()=="data"){ag.movie=ai[ae]}else{if(ae.toLowerCase()=="styleclass"){ah+=' class="'+ai[ae]+'"'}else{if(ae.toLowerCase()!="classid"){ah+=" "+ae+'="'+ai[ae]+'"'}}}}}var af="";for(var ad in ag){if(ag[ad]!=Object.prototype[ad]){af+='<param name="'+ad+'" value="'+ag[ad]+'" />'}}aa.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+ah+">"+af+"</object>";N[N.length]=ai.id;X=c(ai.id)}else{var Z=C(r);Z.setAttribute("type",q);for(var ac in ai){if(ai[ac]!=Object.prototype[ac]){if(ac.toLowerCase()=="styleclass"){Z.setAttribute("class",ai[ac])}else{if(ac.toLowerCase()!="classid"){Z.setAttribute(ac,ai[ac])}}}}for(var ab in ag){if(ag[ab]!=Object.prototype[ab]&&ab.toLowerCase()!="movie"){e(Z,ab,ag[ab])}}aa.parentNode.replaceChild(Z,aa);X=Z}}return X}function e(Z,X,Y){var aa=C("param");aa.setAttribute("name",X);aa.setAttribute("value",Y);Z.appendChild(aa)}function y(Y){var X=c(Y);if(X&&X.nodeName=="OBJECT"){if(M.ie&&M.win){X.style.display="none";(function(){if(X.readyState==4){b(Y)}else{setTimeout(arguments.callee,10)}})()}else{X.parentNode.removeChild(X)}}}function b(Z){var Y=c(Z);if(Y){for(var X in Y){if(typeof Y[X]=="function"){Y[X]=null}}Y.parentNode.removeChild(Y)}}function c(Z){var X=null;try{X=j.getElementById(Z)}catch(Y){}return X}function C(X){return j.createElement(X)}function i(Z,X,Y){Z.attachEvent(X,Y);I[I.length]=[Z,X,Y]}function F(Z){var Y=M.pv,X=Z.split(".");X[0]=parseInt(X[0],10);X[1]=parseInt(X[1],10)||0;X[2]=parseInt(X[2],10)||0;return(Y[0]>X[0]||(Y[0]==X[0]&&Y[1]>X[1])||(Y[0]==X[0]&&Y[1]==X[1]&&Y[2]>=X[2]))?true:false}function v(ac,Y,ad,ab){if(M.ie&&M.mac){return}var aa=j.getElementsByTagName("head")[0];if(!aa){return}var X=(ad&&typeof ad=="string")?ad:"screen";if(ab){n=null;G=null}if(!n||G!=X){var Z=C("style");Z.setAttribute("type","text/css");Z.setAttribute("media",X);n=aa.appendChild(Z);if(M.ie&&M.win&&typeof j.styleSheets!=D&&j.styleSheets.length>0){n=j.styleSheets[j.styleSheets.length-1]}G=X}if(M.ie&&M.win){if(n&&typeof n.addRule==r){n.addRule(ac,Y)}}else{if(n&&typeof j.createTextNode!=D){n.appendChild(j.createTextNode(ac+" {"+Y+"}"))}}}function w(Z,X){if(!m){return}var Y=X?"visible":"hidden";if(J&&c(Z)){c(Z).style.visibility=Y}else{v("#"+Z,"visibility:"+Y)}}function L(Y){var Z=/[\\\"<>\.;]/;var X=Z.exec(Y)!=null;return X&&typeof encodeURIComponent!=D?encodeURIComponent(Y):Y}var d=function(){if(M.ie&&M.win){window.attachEvent("onunload",function(){var ac=I.length;for(var ab=0;ab<ac;ab++){I[ab][0].detachEvent(I[ab][1],I[ab][2])}var Z=N.length;for(var aa=0;aa<Z;aa++){y(N[aa])}for(var Y in M){M[Y]=null}M=null;for(var X in swfobject){swfobject[X]=null}swfobject=null})}}();return{registerObject:function(ab,X,aa,Z){if(M.w3&&ab&&X){var Y={};Y.id=ab;Y.swfVersion=X;Y.expressInstall=aa;Y.callbackFn=Z;o[o.length]=Y;w(ab,false)}else{if(Z){Z({success:false,id:ab})}}},getObjectById:function(X){if(M.w3){return z(X)}},embedSWF:function(ab,ah,ae,ag,Y,aa,Z,ad,af,ac){var X={success:false,id:ah};if(M.w3&&!(M.wk&&M.wk<312)&&ab&&ah&&ae&&ag&&Y){w(ah,false);K(function(){ae+="";ag+="";var aj={};if(af&&typeof af===r){for(var al in af){aj[al]=af[al]}}aj.data=ab;aj.width=ae;aj.height=ag;var am={};if(ad&&typeof ad===r){for(var ak in ad){am[ak]=ad[ak]}}if(Z&&typeof Z===r){for(var ai in Z){if(typeof am.flashvars!=D){am.flashvars+="&"+ai+"="+Z[ai]}else{am.flashvars=ai+"="+Z[ai]}}}if(F(Y)){var an=u(aj,am,ah);if(aj.id==ah){w(ah,true)}X.success=true;X.ref=an}else{if(aa&&A()){aj.data=aa;P(aj,am,ah,ac);return}else{w(ah,true)}}if(ac){ac(X)}})}else{if(ac){ac(X)}}},switchOffAutoHideShow:function(){m=false},ua:M,getFlashPlayerVersion:function(){return{major:M.pv[0],minor:M.pv[1],release:M.pv[2]}},hasFlashPlayerVersion:F,createSWF:function(Z,Y,X){if(M.w3){return u(Z,Y,X)}else{return undefined}},showExpressInstall:function(Z,aa,X,Y){if(M.w3&&A()){P(Z,aa,X,Y)}},removeSWF:function(X){if(M.w3){y(X)}},createCSS:function(aa,Z,Y,X){if(M.w3){v(aa,Z,Y,X)}},addDomLoadEvent:K,addLoadEvent:s,getQueryParamValue:function(aa){var Z=j.location.search||j.location.hash;if(Z){if(/\?/.test(Z)){Z=Z.split("?")[1]}if(aa==null){return L(Z)}var Y=Z.split("&");for(var X=0;X<Y.length;X++){if(Y[X].substring(0,Y[X].indexOf("="))==aa){return L(Y[X].substring((Y[X].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(a){var X=c(R);if(X&&l){X.parentNode.replaceChild(l,X);if(Q){w(Q,true);if(M.ie&&M.win){l.style.display="block"}}if(E){E(B)}}a=false}}}}();
// Flash Player Version Detection - Rev 1.6
// Detect Client Browser type
// Copyright(c) 2005-2006 Adobe Macromedia Software, LLC. All rights reserved.
var isIE  = (navigator.appVersion.indexOf("MSIE") != -1) ? true : false;
var isWin = (navigator.appVersion.toLowerCase().indexOf("win") != -1) ? true : false;
var isOpera = (navigator.userAgent.indexOf("Opera") != -1) ? true : false;

function ControlVersion()
{
	var version;
	var axo;
	var e;

	// NOTE : new ActiveXObject(strFoo) throws an exception if strFoo isn't in the registry

	try {
		// version will be set for 7.X or greater players
		axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
		version = axo.GetVariable("$version");
	} catch (e) {
	}

	if (!version)
	{
		try {
			// version will be set for 6.X players only
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
			
			// installed player is some revision of 6.0
			// GetVariable("$version") crashes for versions 6.0.22 through 6.0.29,
			// so we have to be careful. 
			
			// default to the first public version
			version = "WIN 6,0,21,0";

			// throws if AllowScripAccess does not exist (introduced in 6.0r47)		
			axo.AllowScriptAccess = "always";

			// safe to call for 6.0r47 or greater
			version = axo.GetVariable("$version");

		} catch (e) {
		}
	}

	if (!version)
	{
		try {
			// version will be set for 4.X or 5.X player
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
			version = axo.GetVariable("$version");
		} catch (e) {
		}
	}

	if (!version)
	{
		try {
			// version will be set for 3.X player
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
			version = "WIN 3,0,18,0";
		} catch (e) {
		}
	}

	if (!version)
	{
		try {
			// version will be set for 2.X player
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
			version = "WIN 2,0,0,11";
		} catch (e) {
			version = -1;
		}
	}
	
	return version;
}

// JavaScript helper required to detect Flash Player PlugIn version information
function GetSwfVer(){
	// NS/Opera version >= 3 check for Flash plugin in plugin array
	var flashVer = -1;
	
	if (navigator.plugins != null && navigator.plugins.length > 0) {
		if (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]) {
			var swVer2 = navigator.plugins["Shockwave Flash 2.0"] ? " 2.0" : "";
			var flashDescription = navigator.plugins["Shockwave Flash" + swVer2].description;
			var descArray = flashDescription.split(" ");
			var tempArrayMajor = descArray[2].split(".");			
			var versionMajor = tempArrayMajor[0];
			var versionMinor = tempArrayMajor[1];
			var versionRevision = descArray[3];
			if (versionRevision == "") {
				versionRevision = descArray[4];
			}
			if (versionRevision[0] == "d") {
				versionRevision = versionRevision.substring(1);
			} else if (versionRevision[0] == "r") {
				versionRevision = versionRevision.substring(1);
				if (versionRevision.indexOf("d") > 0) {
					versionRevision = versionRevision.substring(0, versionRevision.indexOf("d"));
				}
			}
			var flashVer = versionMajor + "." + versionMinor + "." + versionRevision;
			//alert("flashVer="+flashVer);
		}
	}
	// MSN/WebTV 2.6 supports Flash 4
	else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.6") != -1) flashVer = 4;
	// WebTV 2.5 supports Flash 3
	else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.5") != -1) flashVer = 3;
	// older WebTV supports Flash 2
	else if (navigator.userAgent.toLowerCase().indexOf("webtv") != -1) flashVer = 2;
	else if ( isIE && isWin && !isOpera ) {
		flashVer = ControlVersion();
	}	
	return flashVer;
}

// When called with reqMajorVer, reqMinorVer, reqRevision returns true if that version or greater is available
function DetectFlashVer(reqMajorVer, reqMinorVer, reqRevision)
{
	versionStr = GetSwfVer();
	if (versionStr == -1 ) {
		return false;
	} else if (versionStr != 0) {
		if(isIE && isWin && !isOpera) {
			// Given "WIN 2,0,0,11"
			tempArray         = versionStr.split(" "); 	// ["WIN", "2,0,0,11"]
			tempString        = tempArray[1];			// "2,0,0,11"
			versionArray      = tempString.split(",");	// ['2', '0', '0', '11']
		} else {
			versionArray      = versionStr.split(".");
		}
		var versionMajor      = versionArray[0];
		var versionMinor      = versionArray[1];
		var versionRevision   = versionArray[2];

        	// is the major.revision >= requested major.revision AND the minor version >= requested minor
		if (versionMajor > parseFloat(reqMajorVer)) {
			return true;
		} else if (versionMajor == parseFloat(reqMajorVer)) {
			if (versionMinor > parseFloat(reqMinorVer))
				return true;
			else if (versionMinor == parseFloat(reqMinorVer)) {
				if (versionRevision >= parseFloat(reqRevision))
					return true;
			}
		}
		return false;
	}
}

function AC_AddExtension(src, ext)
{
  if (src.indexOf('?') != -1)
    return src.replace(/\?/, ext+'?'); 
  else
    return src + ext;
}

function AC_Generateobj(objAttrs, params, embedAttrs) 
{ 
    var str = '';
    if (isIE && isWin && !isOpera)
    {
  		str += '<object ';
  		for (var i in objAttrs)
  			str += i + '="' + objAttrs[i] + '" ';
  		for (var i in params)
  			str += '><param name="' + i + '" value="' + params[i] + '" /> ';
  		str += '></object>';
    } else {
  		str += '<embed ';
  		for (var i in embedAttrs)
  			str += i + '="' + embedAttrs[i] + '" ';
  		str += '> </embed>';
    }

    document.write(str);
}

function AC_FL_RunContent(){
  var ret = 
    AC_GetArgs
    (  arguments, ".swf", "movie", "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"
     , "application/x-shockwave-flash"
    );
  AC_Generateobj(ret.objAttrs, ret.params, ret.embedAttrs);
}

function AC_GetArgs(args, ext, srcParamName, classid, mimeType){
  var ret = new Object();
  ret.embedAttrs = new Object();
  ret.params = new Object();
  ret.objAttrs = new Object();
  for (var i=0; i < args.length; i=i+2){
    var currArg = args[i].toLowerCase();    

    switch (currArg){	
      case "classid":
        break;
      case "pluginspage":
        ret.embedAttrs[args[i]] = args[i+1];
        break;
      case "src":
      case "movie":	
        args[i+1] = AC_AddExtension(args[i+1], ext);
        ret.embedAttrs["src"] = args[i+1];
        ret.params[srcParamName] = args[i+1];
        break;
      case "onafterupdate":
      case "onbeforeupdate":
      case "onblur":
      case "oncellchange":
      case "onclick":
      case "ondblClick":
      case "ondrag":
      case "ondragend":
      case "ondragenter":
      case "ondragleave":
      case "ondragover":
      case "ondrop":
      case "onfinish":
      case "onfocus":
      case "onhelp":
      case "onmousedown":
      case "onmouseup":
      case "onmouseover":
      case "onmousemove":
      case "onmouseout":
      case "onkeypress":
      case "onkeydown":
      case "onkeyup":
      case "onload":
      case "onlosecapture":
      case "onpropertychange":
      case "onreadystatechange":
      case "onrowsdelete":
      case "onrowenter":
      case "onrowexit":
      case "onrowsinserted":
      case "onstart":
      case "onscroll":
      case "onbeforeeditfocus":
      case "onactivate":
      case "onbeforedeactivate":
      case "ondeactivate":
      case "type":
      case "codebase":
        ret.objAttrs[args[i]] = args[i+1];
        break;
      case "id":
      case "width":
      case "height":
      case "align":
      case "vspace": 
      case "hspace":
      case "class":
      case "title":
      case "accesskey":
      case "name":
      case "tabindex":
        ret.embedAttrs[args[i]] = ret.objAttrs[args[i]] = args[i+1];
        break;
      default:
        ret.embedAttrs[args[i]] = ret.params[args[i]] = args[i+1];
    }
  }
  ret.objAttrs["classid"] = classid;
  if (mimeType) ret.embedAttrs["type"] = mimeType;
  return ret;
}



/*
 * Date prototype extensions. Doesn't depend on any
 * other code. Doens't overwrite existing methods.
 *
 * Adds dayNames, abbrDayNames, monthNames and abbrMonthNames static properties and isLeapYear,
 * isWeekend, isWeekDay, getDaysInMonth, getDayName, getMonthName, getDayOfYear, getWeekOfYear,
 * setDayOfYear, addYears, addMonths, addDays, addHours, addMinutes, addSeconds methods
 *
 * Copyright (c) 2006 J�rn Zaefferer and Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
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

(function(D){D.fn.extend({renderCalendar:function(P){var X=function(Y){return document.createElement(Y)};P=D.extend({},D.fn.datePicker.defaults,P);if(P.showHeader!=D.dpConst.SHOW_HEADER_NONE){var M=D(X("tr"));for(var S=Date.firstDayOfWeek;S<Date.firstDayOfWeek+7;S++){var H=S%7;var R=Date.dayNames[H];M.append(jQuery(X("th")).attr({scope:"col",abbr:R,title:R,"class":(H==0||H==6?"weekend":"weekday")}).html(P.showHeader==D.dpConst.SHOW_HEADER_SHORT?R.substr(0,1):R))}}var E=D(X("table")).attr({cellspacing:2,className:"jCalendar"}).append((P.showHeader!=D.dpConst.SHOW_HEADER_NONE?D(X("thead")).append(M):X("thead")));var F=D(X("tbody"));var U=(new Date()).zeroTime();var W=P.month==undefined?U.getMonth():P.month;var N=P.year||U.getFullYear();var K=new Date(N,W,1);var J=Date.firstDayOfWeek-K.getDay()+1;if(J>1){J-=7}var O=Math.ceil(((-1*J+1)+K.getDaysInMonth())/7);K.addDays(J-1);var V=function(){if(P.hoverClass){D(this).addClass(P.hoverClass)}};var G=function(){if(P.hoverClass){D(this).removeClass(P.hoverClass)}};var L=0;while(L++<O){var Q=jQuery(X("tr"));for(var S=0;S<7;S++){var I=K.getMonth()==W;var T=D(X("td")).text(K.getDate()+"").attr("className",(I?"current-month ":"other-month ")+(K.isWeekend()?"weekend ":"weekday ")+(I&&K.getTime()==U.getTime()?"today ":"")).hover(V,G);if(P.renderCallback){P.renderCallback(T,K,W,N)}Q.append(T);K.addDays(1)}F.append(Q)}E.append(F);return this.each(function(){D(this).empty().append(E)})},datePicker:function(E){if(!D.event._dpCache){D.event._dpCache=[]}E=D.extend({},D.fn.datePicker.defaults,E);return this.each(function(){var G=D(this);var I=true;if(!this._dpId){this._dpId=D.event.guid++;D.event._dpCache[this._dpId]=new A(this);I=false}if(E.inline){E.createButton=false;E.displayClose=false;E.closeOnSelect=false;G.empty()}var F=D.event._dpCache[this._dpId];F.init(E);if(!I&&E.createButton){F.button=D('<a href="#" class="dp-choose-date" title="'+D.dpText.TEXT_CHOOSE_DATE+'">'+D.dpText.TEXT_CHOOSE_DATE+"</a>").bind("click",function(){G.dpDisplay(this);this.blur();return false});G.after(F.button)}if(!I&&G.is(":text")){G.bind("dateSelected",function(K,J,L){this.value=J.asString()}).bind("change",function(){if(this.value!=""){var J=Date.fromString(this.value);if(J){F.setSelected(J,true,true)}}});if(E.clickInput){G.bind("click",function(){G.dpDisplay()})}var H=Date.fromString(this.value);if(this.value!=""&&H){F.setSelected(H,true,true)}}G.addClass("dp-applied")})},dpSetDisabled:function(E){return B.call(this,"setDisabled",E)},dpSetStartDate:function(E){return B.call(this,"setStartDate",E)},dpSetEndDate:function(E){return B.call(this,"setEndDate",E)},dpGetSelected:function(){var E=C(this[0]);if(E){return E.getSelected()}return null},dpSetSelected:function(G,F,E){if(F==undefined){F=true}if(E==undefined){E=true}return B.call(this,"setSelected",Date.fromString(G),F,E,true)},dpSetDisplayedMonth:function(E,F){return B.call(this,"setDisplayedMonth",Number(E),Number(F),true)},dpDisplay:function(E){return B.call(this,"display",E)},dpSetRenderCallback:function(E){return B.call(this,"setRenderCallback",E)},dpSetPosition:function(E,F){return B.call(this,"setPosition",E,F)},dpSetOffset:function(E,F){return B.call(this,"setOffset",E,F)},dpClose:function(){return B.call(this,"_closeCalendar",false,this[0])},_dpDestroy:function(){}});var B=function(G,F,E,I,H){return this.each(function(){var J=C(this);if(J){J[G](F,E,I,H)}})};function A(E){this.ele=E;this.displayedMonth=null;this.displayedYear=null;this.startDate=null;this.endDate=null;this.showYearNavigation=null;this.closeOnSelect=null;this.displayClose=null;this.selectMultiple=null;this.verticalPosition=null;this.horizontalPosition=null;this.verticalOffset=null;this.horizontalOffset=null;this.button=null;this.renderCallback=[];this.selectedDates={};this.inline=null;this.context="#dp-popup"}D.extend(A.prototype,{init:function(E){this.setStartDate(E.startDate);this.setEndDate(E.endDate);this.setDisplayedMonth(Number(E.month),Number(E.year));this.setRenderCallback(E.renderCallback);this.showYearNavigation=E.showYearNavigation;this.closeOnSelect=E.closeOnSelect;this.displayClose=E.displayClose;this.selectMultiple=E.selectMultiple;this.verticalPosition=E.verticalPosition;this.horizontalPosition=E.horizontalPosition;this.hoverClass=E.hoverClass;this.setOffset(E.verticalOffset,E.horizontalOffset);this.inline=E.inline;if(this.inline){this.context=this.ele;this.display()}},setStartDate:function(E){if(E){this.startDate=Date.fromString(E)}if(!this.startDate){this.startDate=(new Date()).zeroTime()}this.setDisplayedMonth(this.displayedMonth,this.displayedYear)},setEndDate:function(E){if(E){this.endDate=Date.fromString(E)}if(!this.endDate){this.endDate=(new Date("12/31/2999"))}if(this.endDate.getTime()<this.startDate.getTime()){this.endDate=this.startDate}this.setDisplayedMonth(this.displayedMonth,this.displayedYear)},setPosition:function(E,F){this.verticalPosition=E;this.horizontalPosition=F},setOffset:function(E,F){this.verticalOffset=parseInt(E)||0;this.horizontalOffset=parseInt(F)||0},setDisabled:function(E){$e=D(this.ele);$e[E?"addClass":"removeClass"]("dp-disabled");if(this.button){$but=D(this.button);$but[E?"addClass":"removeClass"]("dp-disabled");$but.attr("title",E?"":D.dpText.TEXT_CHOOSE_DATE)}if($e.is(":text")){$e.attr("disabled",E?"disabled":"")}},setDisplayedMonth:function(E,L,I){if(this.startDate==undefined||this.endDate==undefined){return}var H=new Date(this.startDate.getTime());H.setDate(1);var K=new Date(this.endDate.getTime());K.setDate(1);var G;if((!E&&!L)||(isNaN(E)&&isNaN(L))){G=new Date().zeroTime();G.setDate(1)}else{if(isNaN(E)){G=new Date(L,this.displayedMonth,1)}else{if(isNaN(L)){G=new Date(this.displayedYear,E,1)}else{G=new Date(L,E,1)}}}if(G.getTime()<H.getTime()){G=H}else{if(G.getTime()>K.getTime()){G=K}}var F=this.displayedMonth;var J=this.displayedYear;this.displayedMonth=G.getMonth();this.displayedYear=G.getFullYear();if(I&&(this.displayedMonth!=F||this.displayedYear!=J)){this._rerenderCalendar();D(this.ele).trigger("dpMonthChanged",[this.displayedMonth,this.displayedYear])}},setSelected:function(K,E,F,H){if(E==this.isSelected(K)){return}if(this.selectMultiple==false){this.selectedDates={};D("td.selected",this.context).removeClass("selected")}if(F&&this.displayedMonth!=K.getMonth()){this.setDisplayedMonth(K.getMonth(),K.getFullYear(),true)}this.selectedDates[K.toString()]=E;var I="td.";I+=K.getMonth()==this.displayedMonth?"current-month":"other-month";I+=':contains("'+K.getDate()+'")';var J;D(I,this.ele).each(function(){if(D(this).text()==K.getDate()){J=D(this);J[E?"addClass":"removeClass"]("selected")}});if(H){var G=this.isSelected(K);$e=D(this.ele);$e.trigger("dateSelected",[K,J,G]);$e.trigger("change")}},isSelected:function(E){return this.selectedDates[E.toString()]},getSelected:function(){var E=[];for(s in this.selectedDates){if(this.selectedDates[s]==true){E.push(Date.parse(s))}}return E},display:function(E){if(D(this.ele).is(".dp-disabled")){return}E=E||this.ele;var L=this;var H=D(E);var K=H.offset();var M;var N;var G;var I;if(L.inline){M=D(this.ele);N={id:"calendar-"+this.ele._dpId,className:"dp-popup dp-popup-inline"};I={}}else{M=D("body");N={id:"dp-popup",className:"dp-popup"};I={top:K.top+L.verticalOffset,left:K.left+L.horizontalOffset};var J=function(Q){var O=Q.target;var P=D("#dp-popup")[0];while(true){if(O==P){return true}else{if(O==document){L._closeCalendar();return false}else{O=D(O).parent()[0]}}}};this._checkMouse=J;this._closeCalendar(true)}M.append(D("<div></div>").attr(N).css(I).append(D("<h2></h2>"),D('<div class="dp-nav-prev"></div>').append(D('<a class="dp-nav-prev-year" href="#" title="'+D.dpText.TEXT_PREV_YEAR+'">&lt;&lt;</a>').bind("click",function(){return L._displayNewMonth.call(L,this,0,-1)}),D('<a class="dp-nav-prev-month" href="#" title="'+D.dpText.TEXT_PREV_MONTH+'">&lt;</a>').bind("click",function(){return L._displayNewMonth.call(L,this,-1,0)})),D('<div class="dp-nav-next"></div>').append(D('<a class="dp-nav-next-year" href="#" title="'+D.dpText.TEXT_NEXT_YEAR+'">&gt;&gt;</a>').bind("click",function(){return L._displayNewMonth.call(L,this,0,1)}),D('<a class="dp-nav-next-month" href="#" title="'+D.dpText.TEXT_NEXT_MONTH+'">&gt;</a>').bind("click",function(){return L._displayNewMonth.call(L,this,1,0)})),D("<div></div>").attr("className","dp-calendar")).bgIframe());var F=this.inline?D(".dp-popup",this.context):D("#dp-popup");if(this.showYearNavigation==false){D(".dp-nav-prev-year, .dp-nav-next-year",L.context).css("display","none")}if(this.displayClose){F.append(D('<a href="#" id="dp-close">'+D.dpText.TEXT_CLOSE+"</a>").bind("click",function(){L._closeCalendar();return false}))}L._renderCalendar();D(this.ele).trigger("dpDisplayed",F);if(!L.inline){if(this.verticalPosition==D.dpConst.POS_BOTTOM){F.css("top",K.top+H.height()-F.height()+L.verticalOffset)}if(this.horizontalPosition==D.dpConst.POS_RIGHT){F.css("left",K.left+H.width()-F.width()+L.horizontalOffset)}D(document).bind("mousedown",this._checkMouse)}},setRenderCallback:function(E){if(E==null){return}if(E&&typeof(E)=="function"){E=[E]}this.renderCallback=this.renderCallback.concat(E)},cellRender:function(J,E,H,G){var K=this.dpController;var I=new Date(E.getTime());J.bind("click",function(){var L=D(this);if(!L.is(".disabled")){K.setSelected(I,!L.is(".selected")||!K.selectMultiple,false,true);if(K.closeOnSelect){K._closeCalendar()}}});if(K.isSelected(I)){J.addClass("selected")}for(var F=0;F<K.renderCallback.length;F++){K.renderCallback[F].apply(this,arguments)}},_displayNewMonth:function(F,E,G){if(!D(F).is(".disabled")){this.setDisplayedMonth(this.displayedMonth+E,this.displayedYear+G,true)}F.blur();return false},_rerenderCalendar:function(){this._clearCalendar();this._renderCalendar()},_renderCalendar:function(){D("h2",this.context).html(Date.monthNames[this.displayedMonth]+" "+this.displayedYear);D(".dp-calendar",this.context).renderCalendar({month:this.displayedMonth,year:this.displayedYear,renderCallback:this.cellRender,dpController:this,hoverClass:this.hoverClass});if(this.displayedYear==this.startDate.getFullYear()&&this.displayedMonth==this.startDate.getMonth()){D(".dp-nav-prev-year",this.context).addClass("disabled");D(".dp-nav-prev-month",this.context).addClass("disabled");D(".dp-calendar td.other-month",this.context).each(function(){var H=D(this);if(Number(H.text())>20){H.addClass("disabled")}});var G=this.startDate.getDate();D(".dp-calendar td.current-month",this.context).each(function(){var H=D(this);if(Number(H.text())<G){H.addClass("disabled")}})}else{D(".dp-nav-prev-year",this.context).removeClass("disabled");D(".dp-nav-prev-month",this.context).removeClass("disabled");var G=this.startDate.getDate();if(G>20){var F=new Date(this.startDate.getTime());F.addMonths(1);if(this.displayedYear==F.getFullYear()&&this.displayedMonth==F.getMonth()){D("dp-calendar td.other-month",this.context).each(function(){var H=D(this);if(Number(H.text())<G){H.addClass("disabled")}})}}}if(this.displayedYear==this.endDate.getFullYear()&&this.displayedMonth==this.endDate.getMonth()){D(".dp-nav-next-year",this.context).addClass("disabled");D(".dp-nav-next-month",this.context).addClass("disabled");D(".dp-calendar td.other-month",this.context).each(function(){var H=D(this);if(Number(H.text())<14){H.addClass("disabled")}});var G=this.endDate.getDate();D(".dp-calendar td.current-month",this.context).each(function(){var H=D(this);if(Number(H.text())>G){H.addClass("disabled")}})}else{D(".dp-nav-next-year",this.context).removeClass("disabled");D(".dp-nav-next-month",this.context).removeClass("disabled");var G=this.endDate.getDate();if(G<13){var E=new Date(this.endDate.getTime());E.addMonths(-1);if(this.displayedYear==E.getFullYear()&&this.displayedMonth==E.getMonth()){D(".dp-calendar td.other-month",this.context).each(function(){var H=D(this);if(Number(H.text())>G){H.addClass("disabled")}})}}}},_closeCalendar:function(E,F){if(!F||F==this.ele){D(document).unbind("mousedown",this._checkMouse);this._clearCalendar();D("#dp-popup a").unbind();D("#dp-popup").empty().remove();if(!E){D(this.ele).trigger("dpClosed",[this.getSelected()])}}},_clearCalendar:function(){D(".dp-calendar td",this.context).unbind();D(".dp-calendar",this.context).empty()}});D.dpConst={SHOW_HEADER_NONE:0,SHOW_HEADER_SHORT:1,SHOW_HEADER_LONG:2,POS_TOP:0,POS_BOTTOM:1,POS_LEFT:0,POS_RIGHT:1};D.dpText={TEXT_PREV_YEAR:"Previous year",TEXT_PREV_MONTH:"Previous month",TEXT_NEXT_YEAR:"Next year",TEXT_NEXT_MONTH:"Next month",TEXT_CLOSE:"Close",TEXT_CHOOSE_DATE:"Choose date"};D.dpVersion="$Id: jquery.datePicker.js 15 2008-12-17 04:40:18Z kelvin.luck $";D.fn.datePicker.defaults={month:undefined,year:undefined,showHeader:D.dpConst.SHOW_HEADER_SHORT,startDate:undefined,endDate:undefined,inline:false,renderCallback:null,createButton:true,showYearNavigation:true,closeOnSelect:true,displayClose:false,selectMultiple:false,clickInput:false,verticalPosition:D.dpConst.POS_TOP,horizontalPosition:D.dpConst.POS_LEFT,verticalOffset:0,horizontalOffset:0,hoverClass:"dp-hover"};function C(E){if(E._dpId){return D.event._dpCache[E._dpId]}return false}if(D.fn.bgIframe==undefined){D.fn.bgIframe=function(){return this}}D(window).bind("unload",function(){var F=D.event._dpCache||[];for(var E in F){D(F[E].ele)._dpDestroy()}})})(jQuery);
/*
 * jQuery validation plug-in 1.5.5
 *
 * http://bassistance.de/jquery-plugins/jquery-plugin-validation/
 * http://docs.jquery.com/Plugins/Validation
 *
 * Copyright (c) 2006 - 2008 Jörn Zaefferer
 *
 * $Id: jquery.validate.js 6403 2009-06-17 14:27:16Z joern.zaefferer $
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
(function($){$.extend($.fn,{validate:function(options){if(!this.length){options&&options.debug&&window.console&&console.warn("nothing selected, can't validate, returning nothing");return;}var validator=$.data(this[0],'validator');if(validator){return validator;}validator=new $.validator(options,this[0]);$.data(this[0],'validator',validator);if(validator.settings.onsubmit){this.find("input, button").filter(".cancel").click(function(){validator.cancelSubmit=true;});if(validator.settings.submitHandler){this.find("input, button").filter(":submit").click(function(){validator.submitButton=this;});}this.submit(function(event){if(validator.settings.debug)event.preventDefault();function handle(){if(validator.settings.submitHandler){if(validator.submitButton){var hidden=$("<input type='hidden'/>").attr("name",validator.submitButton.name).val(validator.submitButton.value).appendTo(validator.currentForm);}validator.settings.submitHandler.call(validator,validator.currentForm);if(validator.submitButton){hidden.remove();}return false;}return true;}if(validator.cancelSubmit){validator.cancelSubmit=false;return handle();}if(validator.form()){if(validator.pendingRequest){validator.formSubmitted=true;return false;}return handle();}else{validator.focusInvalid();return false;}});}return validator;},valid:function(){if($(this[0]).is('form')){return this.validate().form();}else{var valid=true;var validator=$(this[0].form).validate();this.each(function(){valid&=validator.element(this);});return valid;}},removeAttrs:function(attributes){var result={},$element=this;$.each(attributes.split(/\s/),function(index,value){result[value]=$element.attr(value);$element.removeAttr(value);});return result;},rules:function(command,argument){var element=this[0];if(command){var settings=$.data(element.form,'validator').settings;var staticRules=settings.rules;var existingRules=$.validator.staticRules(element);switch(command){case"add":$.extend(existingRules,$.validator.normalizeRule(argument));staticRules[element.name]=existingRules;if(argument.messages)settings.messages[element.name]=$.extend(settings.messages[element.name],argument.messages);break;case"remove":if(!argument){delete staticRules[element.name];return existingRules;}var filtered={};$.each(argument.split(/\s/),function(index,method){filtered[method]=existingRules[method];delete existingRules[method];});return filtered;}}var data=$.validator.normalizeRules($.extend({},$.validator.metadataRules(element),$.validator.classRules(element),$.validator.attributeRules(element),$.validator.staticRules(element)),element);if(data.required){var param=data.required;delete data.required;data=$.extend({required:param},data);}return data;}});$.extend($.expr[":"],{blank:function(a){return!$.trim(a.value);},filled:function(a){return!!$.trim(a.value);},unchecked:function(a){return!a.checked;}});$.validator=function(options,form){this.settings=$.extend({},$.validator.defaults,options);this.currentForm=form;this.init();};$.validator.format=function(source,params){if(arguments.length==1)return function(){var args=$.makeArray(arguments);args.unshift(source);return $.validator.format.apply(this,args);};if(arguments.length>2&&params.constructor!=Array){params=$.makeArray(arguments).slice(1);}if(params.constructor!=Array){params=[params];}$.each(params,function(i,n){source=source.replace(new RegExp("\\{"+i+"\\}","g"),n);});return source;};$.extend($.validator,{defaults:{messages:{},groups:{},rules:{},errorClass:"error",validClass:"valid",errorElement:"label",focusInvalid:true,errorContainer:$([]),errorLabelContainer:$([]),onsubmit:true,ignore:[],ignoreTitle:false,onfocusin:function(element){this.lastActive=element;if(this.settings.focusCleanup&&!this.blockFocusCleanup){this.settings.unhighlight&&this.settings.unhighlight.call(this,element,this.settings.errorClass,this.settings.validClass);this.errorsFor(element).hide();}},onfocusout:function(element){if(!this.checkable(element)&&(element.name in this.submitted||!this.optional(element))){this.element(element);}},onkeyup:function(element){if(element.name in this.submitted||element==this.lastElement){this.element(element);}},onclick:function(element){if(element.name in this.submitted)this.element(element);},highlight:function(element,errorClass,validClass){$(element).addClass(errorClass).removeClass(validClass);},unhighlight:function(element,errorClass,validClass){$(element).removeClass(errorClass).addClass(validClass);}},setDefaults:function(settings){$.extend($.validator.defaults,settings);},messages:{required:"This field is required.",remote:"Please fix this field.",email:"Please enter a valid email address.",url:"Please enter a valid URL.",date:"Please enter a valid date.",dateISO:"Please enter a valid date (ISO).",dateDE:"Bitte geben Sie ein gültiges Datum ein.",number:"Please enter a valid number.",numberDE:"Bitte geben Sie eine Nummer ein.",digits:"Please enter only digits",creditcard:"Please enter a valid credit card number.",equalTo:"Please enter the same value again.",accept:"Please enter a value with a valid extension.",maxlength:$.validator.format("Please enter no more than {0} characters."),minlength:$.validator.format("Please enter at least {0} characters."),rangelength:$.validator.format("Please enter a value between {0} and {1} characters long."),range:$.validator.format("Please enter a value between {0} and {1}."),max:$.validator.format("Please enter a value less than or equal to {0}."),min:$.validator.format("Please enter a value greater than or equal to {0}.")},autoCreateRanges:false,prototype:{init:function(){this.labelContainer=$(this.settings.errorLabelContainer);this.errorContext=this.labelContainer.length&&this.labelContainer||$(this.currentForm);this.containers=$(this.settings.errorContainer).add(this.settings.errorLabelContainer);this.submitted={};this.valueCache={};this.pendingRequest=0;this.pending={};this.invalid={};this.reset();var groups=(this.groups={});$.each(this.settings.groups,function(key,value){$.each(value.split(/\s/),function(index,name){groups[name]=key;});});var rules=this.settings.rules;$.each(rules,function(key,value){rules[key]=$.validator.normalizeRule(value);});function delegate(event){var validator=$.data(this[0].form,"validator");validator.settings["on"+event.type]&&validator.settings["on"+event.type].call(validator,this[0]);}$(this.currentForm).delegate("focusin focusout keyup",":text, :password, :file, select, textarea",delegate).delegate("click",":radio, :checkbox",delegate);if(this.settings.invalidHandler)$(this.currentForm).bind("invalid-form.validate",this.settings.invalidHandler);},form:function(){this.checkForm();$.extend(this.submitted,this.errorMap);this.invalid=$.extend({},this.errorMap);if(!this.valid())$(this.currentForm).triggerHandler("invalid-form",[this]);this.showErrors();return this.valid();},checkForm:function(){this.prepareForm();for(var i=0,elements=(this.currentElements=this.elements());elements[i];i++){this.check(elements[i]);}return this.valid();},element:function(element){element=this.clean(element);this.lastElement=element;this.prepareElement(element);this.currentElements=$(element);var result=this.check(element);if(result){delete this.invalid[element.name];}else{this.invalid[element.name]=true;}if(!this.numberOfInvalids()){this.toHide=this.toHide.add(this.containers);}this.showErrors();return result;},showErrors:function(errors){if(errors){$.extend(this.errorMap,errors);this.errorList=[];for(var name in errors){this.errorList.push({message:errors[name],element:this.findByName(name)[0]});}this.successList=$.grep(this.successList,function(element){return!(element.name in errors);});}this.settings.showErrors?this.settings.showErrors.call(this,this.errorMap,this.errorList):this.defaultShowErrors();},resetForm:function(){if($.fn.resetForm)$(this.currentForm).resetForm();this.submitted={};this.prepareForm();this.hideErrors();this.elements().removeClass(this.settings.errorClass);},numberOfInvalids:function(){return this.objectLength(this.invalid);},objectLength:function(obj){var count=0;for(var i in obj)count++;return count;},hideErrors:function(){this.addWrapper(this.toHide).hide();},valid:function(){return this.size()==0;},size:function(){return this.errorList.length;},focusInvalid:function(){if(this.settings.focusInvalid){try{$(this.findLastActive()||this.errorList.length&&this.errorList[0].element||[]).filter(":visible").focus();}catch(e){}}},findLastActive:function(){var lastActive=this.lastActive;return lastActive&&$.grep(this.errorList,function(n){return n.element.name==lastActive.name;}).length==1&&lastActive;},elements:function(){var validator=this,rulesCache={};return $([]).add(this.currentForm.elements).filter(":input").not(":submit, :reset, :image, [disabled]").not(this.settings.ignore).filter(function(){!this.name&&validator.settings.debug&&window.console&&console.error("%o has no name assigned",this);if(this.name in rulesCache||!validator.objectLength($(this).rules()))return false;rulesCache[this.name]=true;return true;});},clean:function(selector){return $(selector)[0];},errors:function(){return $(this.settings.errorElement+"."+this.settings.errorClass,this.errorContext);},reset:function(){this.successList=[];this.errorList=[];this.errorMap={};this.toShow=$([]);this.toHide=$([]);this.formSubmitted=false;this.currentElements=$([]);},prepareForm:function(){this.reset();this.toHide=this.errors().add(this.containers);},prepareElement:function(element){this.reset();this.toHide=this.errorsFor(element);},check:function(element){element=this.clean(element);if(this.checkable(element)){element=this.findByName(element.name)[0];}var rules=$(element).rules();var dependencyMismatch=false;for(method in rules){var rule={method:method,parameters:rules[method]};try{var result=$.validator.methods[method].call(this,element.value.replace(/\r/g,""),element,rule.parameters);if(result=="dependency-mismatch"){dependencyMismatch=true;continue;}dependencyMismatch=false;if(result=="pending"){this.toHide=this.toHide.not(this.errorsFor(element));return;}if(!result){this.formatAndAdd(element,rule);return false;}}catch(e){this.settings.debug&&window.console&&console.log("exception occured when checking element "+element.id
+", check the '"+rule.method+"' method");throw e;}}if(dependencyMismatch)return;if(this.objectLength(rules))this.successList.push(element);return true;},customMetaMessage:function(element,method){if(!$.metadata)return;var meta=this.settings.meta?$(element).metadata()[this.settings.meta]:$(element).metadata();return meta&&meta.messages&&meta.messages[method];},customMessage:function(name,method){var m=this.settings.messages[name];return m&&(m.constructor==String?m:m[method]);},findDefined:function(){for(var i=0;i<arguments.length;i++){if(arguments[i]!==undefined)return arguments[i];}return undefined;},defaultMessage:function(element,method){return this.findDefined(this.customMessage(element.name,method),this.customMetaMessage(element,method),!this.settings.ignoreTitle&&element.title||undefined,$.validator.messages[method],"<strong>Warning: No message defined for "+element.name+"</strong>");},formatAndAdd:function(element,rule){var message=this.defaultMessage(element,rule.method);if(typeof message=="function")message=message.call(this,rule.parameters,element);this.errorList.push({message:message,element:element});this.errorMap[element.name]=message;this.submitted[element.name]=message;},addWrapper:function(toToggle){if(this.settings.wrapper)toToggle=toToggle.add(toToggle.parent(this.settings.wrapper));return toToggle;},defaultShowErrors:function(){for(var i=0;this.errorList[i];i++){var error=this.errorList[i];this.settings.highlight&&this.settings.highlight.call(this,error.element,this.settings.errorClass,this.settings.validClass);this.showLabel(error.element,error.message);}if(this.errorList.length){this.toShow=this.toShow.add(this.containers);}if(this.settings.success){for(var i=0;this.successList[i];i++){this.showLabel(this.successList[i]);}}if(this.settings.unhighlight){for(var i=0,elements=this.validElements();elements[i];i++){this.settings.unhighlight.call(this,elements[i],this.settings.errorClass,this.settings.validClass);}}this.toHide=this.toHide.not(this.toShow);this.hideErrors();this.addWrapper(this.toShow).show();},validElements:function(){return this.currentElements.not(this.invalidElements());},invalidElements:function(){return $(this.errorList).map(function(){return this.element;});},showLabel:function(element,message){var label=this.errorsFor(element);if(label.length){label.removeClass().addClass(this.settings.errorClass);label.attr("generated")&&label.html(message);}else{label=$("<"+this.settings.errorElement+"/>").attr({"for":this.idOrName(element),generated:true}).addClass(this.settings.errorClass).html(message||"");if(this.settings.wrapper){label=label.hide().show().wrap("<"+this.settings.wrapper+"/>").parent();}if(!this.labelContainer.append(label).length)this.settings.errorPlacement?this.settings.errorPlacement(label,$(element)):label.insertAfter(element);}if(!message&&this.settings.success){label.text("");typeof this.settings.success=="string"?label.addClass(this.settings.success):this.settings.success(label);}this.toShow=this.toShow.add(label);},errorsFor:function(element){return this.errors().filter("[for='"+this.idOrName(element)+"']");},idOrName:function(element){return this.groups[element.name]||(this.checkable(element)?element.name:element.id||element.name);},checkable:function(element){return/radio|checkbox/i.test(element.type);},findByName:function(name){var form=this.currentForm;return $(document.getElementsByName(name)).map(function(index,element){return element.form==form&&element.name==name&&element||null;});},getLength:function(value,element){switch(element.nodeName.toLowerCase()){case'select':return $("option:selected",element).length;case'input':if(this.checkable(element))return this.findByName(element.name).filter(':checked').length;}return value.length;},depend:function(param,element){return this.dependTypes[typeof param]?this.dependTypes[typeof param](param,element):true;},dependTypes:{"boolean":function(param,element){return param;},"string":function(param,element){return!!$(param,element.form).length;},"function":function(param,element){return param(element);}},optional:function(element){return!$.validator.methods.required.call(this,$.trim(element.value),element)&&"dependency-mismatch";},startRequest:function(element){if(!this.pending[element.name]){this.pendingRequest++;this.pending[element.name]=true;}},stopRequest:function(element,valid){this.pendingRequest--;if(this.pendingRequest<0)this.pendingRequest=0;delete this.pending[element.name];if(valid&&this.pendingRequest==0&&this.formSubmitted&&this.form()){$(this.currentForm).submit();}else if(!valid&&this.pendingRequest==0&&this.formSubmitted){$(this.currentForm).triggerHandler("invalid-form",[this]);}},previousValue:function(element){return $.data(element,"previousValue")||$.data(element,"previousValue",previous={old:null,valid:true,message:this.defaultMessage(element,"remote")});}},classRuleSettings:{required:{required:true},email:{email:true},url:{url:true},date:{date:true},dateISO:{dateISO:true},dateDE:{dateDE:true},number:{number:true},numberDE:{numberDE:true},digits:{digits:true},creditcard:{creditcard:true}},addClassRules:function(className,rules){className.constructor==String?this.classRuleSettings[className]=rules:$.extend(this.classRuleSettings,className);},classRules:function(element){var rules={};var classes=$(element).attr('class');classes&&$.each(classes.split(' '),function(){if(this in $.validator.classRuleSettings){$.extend(rules,$.validator.classRuleSettings[this]);}});return rules;},attributeRules:function(element){var rules={};var $element=$(element);for(method in $.validator.methods){var value=$element.attr(method);if(value){rules[method]=value;}}if(rules.maxlength&&/-1|2147483647|524288/.test(rules.maxlength)){delete rules.maxlength;}return rules;},metadataRules:function(element){if(!$.metadata)return{};var meta=$.data(element.form,'validator').settings.meta;return meta?$(element).metadata()[meta]:$(element).metadata();},staticRules:function(element){var rules={};var validator=$.data(element.form,'validator');if(validator.settings.rules){rules=$.validator.normalizeRule(validator.settings.rules[element.name])||{};}return rules;},normalizeRules:function(rules,element){$.each(rules,function(prop,val){if(val===false){delete rules[prop];return;}if(val.param||val.depends){var keepRule=true;switch(typeof val.depends){case"string":keepRule=!!$(val.depends,element.form).length;break;case"function":keepRule=val.depends.call(element,element);break;}if(keepRule){rules[prop]=val.param!==undefined?val.param:true;}else{delete rules[prop];}}});$.each(rules,function(rule,parameter){rules[rule]=$.isFunction(parameter)?parameter(element):parameter;});$.each(['minlength','maxlength','min','max'],function(){if(rules[this]){rules[this]=Number(rules[this]);}});$.each(['rangelength','range'],function(){if(rules[this]){rules[this]=[Number(rules[this][0]),Number(rules[this][1])];}});if($.validator.autoCreateRanges){if(rules.min&&rules.max){rules.range=[rules.min,rules.max];delete rules.min;delete rules.max;}if(rules.minlength&&rules.maxlength){rules.rangelength=[rules.minlength,rules.maxlength];delete rules.minlength;delete rules.maxlength;}}if(rules.messages){delete rules.messages}return rules;},normalizeRule:function(data){if(typeof data=="string"){var transformed={};$.each(data.split(/\s/),function(){transformed[this]=true;});data=transformed;}return data;},addMethod:function(name,method,message){$.validator.methods[name]=method;$.validator.messages[name]=message||$.validator.messages[name];if(method.length<3){$.validator.addClassRules(name,$.validator.normalizeRule(name));}},methods:{required:function(value,element,param){if(!this.depend(param,element))return"dependency-mismatch";switch(element.nodeName.toLowerCase()){case'select':var options=$("option:selected",element);return options.length>0&&(element.type=="select-multiple"||($.browser.msie&&!(options[0].attributes['value'].specified)?options[0].text:options[0].value).length>0);case'input':if(this.checkable(element))return this.getLength(value,element)>0;default:return $.trim(value).length>0;}},remote:function(value,element,param){if(this.optional(element))return"dependency-mismatch";var previous=this.previousValue(element);if(!this.settings.messages[element.name])this.settings.messages[element.name]={};this.settings.messages[element.name].remote=typeof previous.message=="function"?previous.message(value):previous.message;param=typeof param=="string"&&{url:param}||param;if(previous.old!==value){previous.old=value;var validator=this;this.startRequest(element);var data={};data[element.name]=value;$.ajax($.extend(true,{url:param,mode:"abort",port:"validate"+element.name,dataType:"json",data:data,success:function(response){var valid=response===true;if(valid){var submitted=validator.formSubmitted;validator.prepareElement(element);validator.formSubmitted=submitted;validator.successList.push(element);validator.showErrors();}else{var errors={};errors[element.name]=previous.message=response||validator.defaultMessage(element,"remote");validator.showErrors(errors);}previous.valid=valid;validator.stopRequest(element,valid);}},param));return"pending";}else if(this.pending[element.name]){return"pending";}return previous.valid;},minlength:function(value,element,param){return this.optional(element)||this.getLength($.trim(value),element)>=param;},maxlength:function(value,element,param){return this.optional(element)||this.getLength($.trim(value),element)<=param;},rangelength:function(value,element,param){var length=this.getLength($.trim(value),element);return this.optional(element)||(length>=param[0]&&length<=param[1]);},min:function(value,element,param){return this.optional(element)||value>=param;},max:function(value,element,param){return this.optional(element)||value<=param;},range:function(value,element,param){return this.optional(element)||(value>=param[0]&&value<=param[1]);},email:function(value,element){return this.optional(element)||/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);},url:function(value,element){return this.optional(element)||/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);},date:function(value,element){return this.optional(element)||!/Invalid|NaN/.test(new Date(value));},dateISO:function(value,element){return this.optional(element)||/^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(value);},dateDE:function(value,element){return this.optional(element)||/^\d\d?\.\d\d?\.\d\d\d?\d?$/.test(value);},number:function(value,element){return this.optional(element)||/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value);},numberDE:function(value,element){return this.optional(element)||/^-?(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d+)?$/.test(value);},digits:function(value,element){return this.optional(element)||/^\d+$/.test(value);},creditcard:function(value,element){if(this.optional(element))return"dependency-mismatch";if(/[^0-9-]+/.test(value))return false;var nCheck=0,nDigit=0,bEven=false;value=value.replace(/\D/g,"");for(n=value.length-1;n>=0;n--){var cDigit=value.charAt(n);var nDigit=parseInt(cDigit,10);if(bEven){if((nDigit*=2)>9)nDigit-=9;}nCheck+=nDigit;bEven=!bEven;}return(nCheck%10)==0;},accept:function(value,element,param){param=typeof param=="string"?param.replace(/,/g,'|'):"png|jpe?g|gif";return this.optional(element)||value.match(new RegExp(".("+param+")$","i"));},equalTo:function(value,element,param){return value==$(param).val();}}});$.format=$.validator.format;})(jQuery);;(function($){var ajax=$.ajax;var pendingRequests={};$.ajax=function(settings){settings=$.extend(settings,$.extend({},$.ajaxSettings,settings));var port=settings.port;if(settings.mode=="abort"){if(pendingRequests[port]){pendingRequests[port].abort();}return(pendingRequests[port]=ajax.apply(this,arguments));}return ajax.apply(this,arguments);};})(jQuery);;(function($){$.each({focus:'focusin',blur:'focusout'},function(original,fix){$.event.special[fix]={setup:function(){if($.browser.msie)return false;this.addEventListener(original,$.event.special[fix].handler,true);},teardown:function(){if($.browser.msie)return false;this.removeEventListener(original,$.event.special[fix].handler,true);},handler:function(e){arguments[0]=$.event.fix(e);arguments[0].type=fix;return $.event.handle.apply(this,arguments);}};});$.extend($.fn,{delegate:function(type,delegate,handler){return this.bind(type,function(event){var target=$(event.target);if(target.is(delegate)){return handler.apply(target,arguments);}});},triggerEvent:function(type,target){return this.triggerHandler(type,[$.event.fix({type:type,target:target})]);}})})(jQuery);
/**
* Handle customer contact requests
*/
var apolloContactRequest = {

	/**
	* This allows you to process a contact request, this logs the customer information in the ApolloSites CRM and then sends the email
	* to the client for action.
	*/
	submitRequest : function(siteID, pageID, reqNonce, reqName, reqEmail, reqPhone, reqLocation, reqDate, reqComments, callback){
		
		var paras = {
				page_id: pageID, 
				site_id: siteID, 
				nonce: reqNonce, 
				name: reqName, 
				email: reqEmail, 
				phone: reqPhone, 
				location: reqLocation, 
				comments: reqComments, 
				datetime: reqDate
		};
				
		$.ajax({
			url: "/admin/themes/common/php/SendEmail.php",
			dataType: "text",
			data: paras,
			success: function(ret){apolloContactRequest.onSentForm(ret, callback);}
		});	
		
	},
			
				
	/**
	* Parse the server response on send data to callback, with the following form;
	*
	* callback(isSuccess, isSpam, message)
	*/		
	onSentForm : function(ret, callback){
		
		if (ret == "TRUE"){
			callback(true, false, 'Message sent, thankyou!');
		}
		else if (ret == "FALSE"){
			callback(false, false, 'Error sending message!');
		}
		else if (ret == "SPAM"){
			callback(false, true, 'Sorry, this comment looks like spam');
		}
		else if (ret == "NA"){
		 	// NONCE ran out, or is incorrect!
			callback(false, false, "Page timed-out as anti-spam measure. Please refresh the page to try again");
		}
		else {
			callback(false, false, "Unknown error!");
		}
	}	

}
var apolloXfader = {

	center : 0,
	
	imageList : '',
	altTextList : '',
	
	currentImage : 0,			
	img1 : 0,
	img2 : -1,
	
	timeBetweenFades : 2000,
	fadeTime : 1000,
	
	isPaused : false,
	isFullScreen : false,
	
	nextImg : 1,
	
	targetDiv : '',
	
	noScaleUp : false,
	
	paddingTop : 0,
	paddingBottom : 0,
	paddingLeft : 0,
	paddingTop : 0,
	
	// ///////////////////////////////////////////////////////////////////
	
	/**
	* @param targetDiv - the target div for the gallery
	* @param options; 
	*   images - array of image url's
	*   altText - array of image alt text
	*   altText - array of image alt text
	*   fadeTime - fade time (ms)
	*   timeBetweenFades - time between fades (ms)
	*/
	start : function(targetDiv, options){
			
		if (options.images == undefined){
			alert("apolloXfader has not been given any images!!!");
			return;
		}
		
		apolloXfader.targetDiv = targetDiv;
		
		if (options.images != undefined) apolloXfader.imageList = options.images;
		if (options.altText != undefined) apolloXfader.altTextList = options.altText;
		if (options.fullscreen != undefined) apolloXfader.isFullScreen = options.fullscreen;
		if (options.fadeTime != undefined) apolloXfader.fadeTime = options.fadeTime;
		if (options.timeBetweenFades != undefined) apolloXfader.timeBetweenFades = options.timeBetweenFades;

		if (options.paddingTop != undefined) apolloXfader.paddingTop = options.paddingTop;
		if (options.paddingBottom != undefined) apolloXfader.paddingBottom = options.paddingBottom;
		if (options.paddingLeft != undefined) apolloXfader.paddingLeft = options.paddingLeft;
		if (options.paddingTop != undefined) apolloXfader.paddingTop = options.paddingTop;
				
		if (apolloXfader.isFullScreen){
			$("body").css("overflow","hidden");					
		}		

		$(window).load(function() {
			apolloXfader.resizeImage();
			apolloXfader.nextImage();
		});

		$(window).resize(apolloXfader.resizeImage);
								
		$(targetDiv).html("<img id='xFadeImage1' class='xFadeImage' src='"+apolloXfader.imageList[apolloXfader.img1]+"'><img id='xFadeImage2' class='xFadeImage'  src='"+apolloXfader.imageList[apolloXfader.img2]+"'>");
		
		apolloXfader.resizeImage();
	},

	// ///////////////////////////////////////////////////////////////////

	img1Front : false,
	toHandle : '',

	nextImage : function(){
	
		$('.xFadeImage').stop();
		
		if (apolloXfader.toHandle != ''){
			clearTimeout(apolloXfader.toHandle);
		}
		
		apolloXfader.img1Front = !apolloXfader.img1Front;

		apolloXfader.img1++;				
		apolloXfader.img2++;

		if (apolloXfader.img1 >= apolloXfader.imageList.length) apolloXfader.img1 = 0;
		if (apolloXfader.img2 >= apolloXfader.imageList.length) apolloXfader.img2 = 0;
		
		apolloXfader.doTransition();		
	},
	
	// ///////////////////////////////////////////////////////////////////

	prevImage : function(){
	
		$('.xFadeImage').stop();
	
		if (apolloXfader.toHandle != ''){
			clearTimeout(apolloXfader.toHandle);
		}
		
		apolloXfader.img1Front = !apolloXfader.img1Front;
		
		apolloXfader.img1--;				
		apolloXfader.img2--;
		
		if (apolloXfader.img1 < 0) apolloXfader.img1 = apolloXfader.imageList.length - 1;
		if (apolloXfader.img2 < 0) apolloXfader.img2 = apolloXfader.imageList.length - 1;
		
		apolloXfader.doTransition();		
					
	},
	
	// ///////////////////////////////////////////////////////////////////

	togglePlay : function(){
		
		apolloXfader.isPaused = !apolloXfader.isPaused;
		
		if (apolloXfader.isPaused){
			clearTimeout(apolloXfader.toHandle);
		}
		else {
			apolloXfader.doTransition();					
		}
	},

	// ///////////////////////////////////////////////////////////////////
				
	doTransition : function(){
	
		// Swap out image src for whatever imnage is currently 'behind'
		if (apolloXfader.img1Front){
			// Image 1 is in front
			$("#xFadeImage2").attr('src', apolloXfader.imageList[apolloXfader.img2]);
		}
		else {
			// Image 2 is in front
			$("#xFadeImage1").attr('src', apolloXfader.imageList[apolloXfader.img2]);
		}
		
					
		if (apolloXfader.img1Front){
			$("#xFadeImage1").fadeOut(apolloXfader.fadeTime, apolloXfader.transistionComplete);
			$("#xFadeImage2").fadeIn(apolloXfader.fadeTime);					
		}
		else {
			$("#xFadeImage1").fadeIn(apolloXfader.fadeTime);
			$("#xFadeImage2").fadeOut(apolloXfader.fadeTime, apolloXfader.transistionComplete);					
		}			
						
	},
	
	transistionComplete : function(){
								
		if (!apolloXfader.isPaused){
			apolloXfader.toHandle = setTimeout(apolloXfader.nextImage, apolloXfader.timeBetweenFades);
		}											
	},
	
	// ///////////////////////////////////////////////////////////////////
			
	resizeImage : function() {
						
		if (!apolloXfader.isFullScreen){

			var divObj = $(apolloXfader.targetDiv);		
			var pos = divObj.position();
			
			//$("body").css({
			//	"overflow":"hidden"
			//});
			
			$('.xFadeImage').css({
				"position":"absolute",
				"top": (pos.top + apolloXfader.paddingTop) + "px",
				"left": (pos.left + apolloXfader.paddingLeft) + "px",
				"z-index":"-1",
				"overflow":"hidden"
			});
			
			$('#xFadeImage1').css("z-index", 1);
			$('#xFadeImage2').css("z-index", 0);
	
			var w = divObj.width() - apolloXfader.paddingLeft - apolloXfader.paddingRight;
			var h = divObj.height() - apolloXfader.paddingTop - apolloXfader.paddingBottom;
			
			if (apolloXfader.noScaleUp){
				if ($('.xFadeImage').width() > 0){
					$('.xFadeImage').width(Math.min(w, $('.xFadeImage').width()));				
					$('.xFadeImage').height(h);				
				}
				else {
					$('.xFadeImage').width(w);				
					if (h > 0)
						$('.xFadeImage').height(h);				
				}
			}
			else {
				$('.xFadeImage').width(w);				
				if (h > 0)
					$('.xFadeImage').height(h);				
			}
					
		}
		else {
		
			$('.xFadeImage').css({
				"position":"absolute",
				"top":"0px",
				"left":"0px",
				"z-index":"-1",
				"overflow":"hidden",
				"width":$(window).width() + "px",
				"height":$(window).height() + "px"
			});
			
			$('#xFadeImage1').css("z-index", 1);
			$('#xFadeImage2').css("z-index", 0);
			
			var containerObj = $('.xFadeImage');
			
			// Resize the img object to the proper ratio of the window.
			var iw = containerObj.children('img').width();
			var ih = containerObj.children('img').height();
			
			if ($(window).width() > $(window).height()) {
				if (iw > ih) {
					var fRatio = iw/ih;
					containerObj.children('img').css("width",$(window).width() + "px");
					containerObj.children('img').css("height",Math.round($(window).width() * (1/fRatio)));
	
					var newIh = Math.round($(window).width() * (1/fRatio));
	
					if(newIh < $(window).height()) {
						var fRatio = ih/iw;
						containerObj.children('img').css("height",$(window).height());
						containerObj.children('img').css("width",Math.round($(window).height() * (1/fRatio)));
					}
				} else {
					var fRatio = ih/iw;
					containerObj.children('img').css("height",$(window).height());
					containerObj.children('img').css("width",Math.round($(window).height() * (1/fRatio)));
				}
			} else {
				var fRatio = ih/iw;
				containerObj.children('img').css("height",$(window).height());
				containerObj.children('img').css("width",Math.round($(window).height() * (1/fRatio)));
			}
			
			containerObj.css("visibility","visible");
			
			// Center BG Image
			if (apolloFullScreenXfader.center) {
				
				containerObj.children('img').css("position","relative");
				
				if (containerObj.children('img').width() > containerObj.width()) {
					var wDiff = (containerObj.children('img').width() - containerObj.width()) / 2;
					containerObj.children('img').css("left", "-" + wDiff + "px");
				}
			}
			
		}
	}
}
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
* Class to contain common operators
*/
var cgpCommon = {

	// //////////////////////////////////////////////////////////////////////////////

	/**
	* Do the common things!
	*/ 
	init : function(page, showLogger){

		// Setup menu		
		$('#navigation').css('display', 'inline');

		$('#navigation').accordion({ 
		    active: true, 
		    header: '.menuHead', 
		    fillSpace: false,
		    autoHeight: false,
		    navigation: true
		   // event: 'mouseover'
		});		
		
		// Do any IE6 hackes (ugh, hate IE6!)
		if (cgpCommon.isIE6()){
			// Remove any non-tile positioned background png images as 
			// ie6 will not position transparent png background images correctly
			$('.pageContents').css('background-image', "url('')");
		}
		
		// Setup debugger		
		Logger.init('#debug_txt');
		
		if (showLogger) Logger.show();
		
	},
			
	// //////////////////////////////////////////////////////////////////////////////

	isIE6 : function(){
		if ($.browser.msie && $.browser.version < 7) return true;
		return false;
	}

	// //////////////////////////////////////////////////////////////////////////////
	
}
/**
* Class to handle the blog interaction
*/
var cgpBlog = {

    /** Minimum allowed width */
    minWidth : 800,
    
    /** Ajax url */
    m_commandURL : '',

	m_postID : 0,
	
	m_siteID : 0,
		
	// ////////////////////////////////////////////////////////////////
	
    init : function(){
        	
        var setup = false;
	
        // See if this is a category....
        var sp1 = location.href.indexOf('blog/cat/');
        if (sp1 > 0){
            var cat = location.href.substring(sp1 + 9);
            cat = cat.substring(0, cat.length-1);
            cgpCommon.init('blog', cat);
            setup = true;
        }
	
        // see if this is a tag....
        sp1 = location.href.indexOf('blog/?tag=');
        if (sp1 > 0){
            var tag = location.href.substring(sp1 + 10);
            cgpCommon.init('blog', tag);
            setup = true;
        }

        if (!setup){
            cgpCommon.init('blog', 'all');
        }
            


    

        cgpBlog.m_commandURL = 'http://' + location.host + '/admin/code/php/remoteapi/BlogAPI.php';
    
        // Get the comments
        cgpBlog.getComments();
        
		// Validation
		$("#commentForm").validate();
						
		$.validator.addMethod(
			"required_email", function(value, element) { 
			
		  		if (value == 'Your E-mail Address') return false; 
		  		if (value == '') return false; 
		  		
		  		// Check to see if this group is complete
		  		return cgpBlog.checkEmail(value);
			}, 
			"Enter a valid email");

		$.validator.addMethod(
			"required_name", function(value, element) { 
			
		  		if (value == 'Your Name') return false; 
		  		if (value == '') return false; 
		  		
		  		return true;
			}, 
			"Please enter your name");
		            	        
    },

	// ////////////////////////////////////////////////////////////////

	checkEmail : function(email) {
		var filter = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
		if (!filter.test(email)) {
			return false;
		}
		return true;
	},
    
	// ////////////////////////////////////////////////////////////////

    getComments : function(){

        var paras = {
            cmd : 'getApprovedComments',
            site_id: cgpBlog.m_siteID,
            post_id: cgpBlog.m_postID
        };

        $.ajax({
            url: cgpBlog.m_commandURL,
            dataType: "json",
            data: paras,
            success: cgpBlog.onGotComments
        });
           
    },
    
	// //////////////////////////////////////////////////////

    onGotComments : function(ret){
    
    	if (ret.result != 'ok') return;
    	
    	var commentList = ret.data.comments;
    	var postID = ret.data.post_id;
    	
    	var txt = "<h2>Comments</h2>";
    	
    	for (var i=0; i<commentList.length; i++){

	        var dt = new Date(commentList[i].created);
    	    var dateStr = dateFormat(dt, "ddd, mmm dS yyyy");
    	    var timeStr = dateFormat(dt, "h:MM:ss TT");
    	    var author = commentList[i].name;

			var commentClass = "odd";
			if (i%2 == 0) commentClass = "even";
			
    		txt += "<div align='left' class='comment "+commentClass+"'>";
    		txt += "    <span class='comment_time'>On " + dateStr + " at " + timeStr + "</span>";
    		txt += "    <span class='comment_author'>"+author+"</span> says <br/>";
    		txt += "    <p>"+commentList[i].content+"</p>";
    		txt += "</div>"
    	}
    	  
    	$('#comments').html(txt);  
    },
    
	// ////////////////////////////////////////////////////////////////

    onPostComment : function(){

		if ($("#commentForm").valid()){

        	var authorName = $('#author').val();
        	var authorEmail = $('#email').val();
        	var commentContent = $('#comment').val();
        	var authorURL = $('#url').val();
        	var parentCommentID = 0;
        		        	
	        var paras = {
	            cmd : 'addComment',
	            site_id: cgpBlog.m_siteID,
	            post_id: cgpBlog.m_postID,
	            name: authorName, 
	            email: authorEmail,
	            author_url: escape(authorURL),
	            content: commentContent,
	            pid: parentCommentID
	        };
			     					     	
	        $.ajax({
	            url: cgpBlog.m_commandURL,
	            dataType: "json",
	            data: paras,
	            success:  cgpBlog.onCommentPosted,
	            error: function(ret){alert(ret);}
	        });
	     
        }                	
    },
    
	// ////////////////////////////////////////////////////////////////

    onCommentPosted : function(ret){
    	$('.commentStatus').hide();
    	$('.commentStatus').html("Thank you for your comment. It will be displayed once approved.");
    	$('.commentStatus').fadeIn();
        $('#author').val('');
        $('#email').val('');
        $('#comment').val('');    	
        $('#url').val('');    	
    }

}


/**
* Class to contain common operators
*/
var cgpCommon = {

	// //////////////////////////////////////////////////////////////////////////////

	/**
	* Do the common things!
	*/ 
	init : function(page, showLogger){

		// Setup menu		
		$('#navigation').css('display', 'inline');

		$('#navigation').accordion({ 
		    active: true, 
		    header: '.menuHead', 
		    fillSpace: false,
		    autoHeight: false,
		    navigation: true
		   // event: 'mouseover'
		});		
		
		// Do any IE6 hackes (ugh, hate IE6!)
		if (cgpCommon.isIE6()){
			// Remove any non-tile positioned background png images as 
			// ie6 will not position transparent png background images correctly
			$('.pageContents').css('background-image', "url('')");
		}
		
		// Setup debugger		
		Logger.init('#debug_txt');
		
		if (showLogger) Logger.show();
		
	},
			
	// //////////////////////////////////////////////////////////////////////////////

	isIE6 : function(){
		if ($.browser.msie && $.browser.version < 7) return true;
		return false;
	}

	// //////////////////////////////////////////////////////////////////////////////
	
}
var cgpContact = {

	// //////////////////////////////////////////////////////////////////////////////

	init : function(){
		
		Date.firstDayOfWeek = 7;
		Date.format = 'yyyy-mm-dd';
		$('.date-pick').datePicker({clickInput:true, createButton:false});
		
		cgpCommon.init('contact');
		
	}
		
}
var cgpGallery = {

	/** Width of flash gallery viewer */
	imgWidth : 1270,
	
	/** Height of flash gallery viewer */
	imgHeight : 810,

	/** The width of the thumb display column (not the thumbs) */
	thumbWidth : 70,
	
	/** Ratio of width to height */
	imgRatio : 0,

	/** Minimum allowed width */
	minWidth : 800,
	
	// /////////////////////////////////////////////////////////////////

	init : function(){
						
		// Optimize size for gallery
		cgpGallery.imgRatio = cgpGallery.imgHeight / cgpGallery.imgWidth;	
	
		cgpGallery.onResize();
		
		setTimeout("cgpGallery.onResize()", 200);
					
		$(window).resize(cgpGallery.onResize);
								
	},
	
	// /////////////////////////////////////////////////////////////////
	
	onResize : function(){

		if (hasFlash){
				
			$("#menuContainer").width(200);
			
			var galW = $("#container").width() - $("#menuContainer").width() - 25;		
			var galH = Math.floor(cgpGallery.imgRatio * galW);
			
			$("#container").height(galH);	
			
			$("#galleryContent").height(galH);
			$("#galleryContent").width(galW);
			
			//Logger.info("galW = " + galW + " galH = " + galH);
	
			// Gallery controls.................
					
			// Figure out thumb width, and make the controls that wide
			/*
			var r = cgpGallery.thumbWidth / cgpGallery.imgWidth;			
			var w = r * galW;
					
			if (!cgpCommon.isIE6()){
				$('.nextButton').css('width', (w/2));
				$('.prevButton').css('width', (w/2));
			}
			else {
				$('.nextButton').css('padding-right', 10);
			}
			
			$('.toggleShow').css('width', w);
			*/
		}
		
	}

}

/**
* Handle the gallery on the home page
*/
var cgpHome = {

	/** Width of flash gallery viewer */
	imgWidth : 1200,
	
	/** Height of flash gallery viewer */
	imgHeight : 800,
	
	/** Ratio of width to height */
	imgRatio : 0,

	/** Minimum allowed width */
	minWidth : 800,
	
	init : function(){
						
		// Optimize size for gallery
		cgpHome.imgRatio = cgpHome.imgHeight / cgpHome.imgWidth;	
	
		cgpHome.onResize();
		
		setTimeout("cgpHome.onResize()", 200);
		
		// If the client doesn't have flash, use the JS image gallery
		if (!hasFlash){
			apolloXfader.start('#galleryContent', {images:imgList, altText: altTxtList, paddingTop: 3, paddingBottom: 3, paddingLeft: 30, paddingRight: 0});
		}				
						
		$(window).resize(cgpHome.onResize);
								
	},
	
	// //////////////////////////////////////////////////////
	
	onResize : function(){

		//if (hasFlash){
				
			$("#menuContainer").width(200);
			
			//var wPad = $("#galleryContent").outerWidth() - $("#galleryContent").width();
			//var hPad = $("#galleryContent").outerHeight() - $("#galleryContent").height();
			var wPad = 25;
		
			var galW = $("#container").width() - $("#menuContainer").width() - wPad;		
			var galH = Math.floor(cgpHome.imgRatio * galW);
			
			$("#container").height(galH);	
			
			$("#galleryContent").height(galH);
			$("#galleryContent").width(galW);
									
			//alert( $('#homeGalFlashObject').width() + ", " + $('#homeGalFlashObject').height() );
			//alert( $('#galleryContent').width() + ", " + $('#galleryContent').height() );
			
			//alert("galW = " + galW + " galH = " + galH);
		//}
		
	}

}
