/*** Editor Script Wrapper ***/
var oScripts = document.getElementsByTagName("script");
var sEditorPath;
for (var i = 0; i < oScripts.length; i++) {
    var sSrc = oScripts[i].src.toLowerCase();
    if (sSrc.indexOf("scripts/online-html-editor.js") != -1) sEditorPath = oScripts[i].src.replace(/online-html-editor.js/, "");
}

if (navigator.appName.indexOf('Microsoft') != -1) {
    document.write("<scr" + "ipt src='" + sEditorPath + "editor_ie.js'></scr" + "ipt>");
} else if (navigator.userAgent.indexOf('Safari') != -1) {
    document.write("<scr" + "ipt src='" + sEditorPath + "editor_saf.js'></scr" + "ipt>");
} else {
    document.write("<scr" + "ipt src='" + sEditorPath + "editor_moz.js'></scr" + "ipt>");
}  