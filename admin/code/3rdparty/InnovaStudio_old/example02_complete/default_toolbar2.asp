<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <style>
    body{font:11px verdana,arial,sans-serif;}
    a{color:#0000cc;font-size:xx-small;}
  </style>

  <script language=JavaScript src='../scripts/innovaeditor.js'></script>
</head>
<body>

<h4>Full Features - Tabbed Toolbar (ASP example) - <a href="../default.htm">Back</a></h4>

<form method="post" action="default_toolbar2.asp" id="Form1">

  <textarea id="txtContent" name="txtContent" rows=4 cols=30>
  <%
  function encodeHTML(sHTML)
    sHTML=replace(sHTML,"&","&amp;")
    sHTML=replace(sHTML,"<","&lt;")
    sHTML=replace(sHTML,">","&gt;")
    encodeHTML=sHTML
  end function

  Response.Write encodeHTML(Request("txtContent"))
  %>
  </textarea>

  <script>
    var oEdit1 = new InnovaEditor("oEdit1");

    oEdit1.width=680;
    oEdit1.height=450;

    /***************************************************
      ADDING CUSTOM BUTTONS
    ***************************************************/

    oEdit1.arrCustomButtons = [["CustomName1","alert('Command 1 here.')","Caption 1 here","btnCustom1.gif"],
              ["CustomName2","alert(\"Command '2' here.\")","Caption 2 here","btnCustom2.gif"],
              ["CustomName3","alert('Command \"3\" here.')","Caption 3 here","btnCustom3.gif"]]

    /***************************************************
      RECONFIGURE TOOLBAR BUTTONS
    ***************************************************/

    /*Set toolbar mode: 0: standard, 1: tab toolbar, 2: group toolbar */
    oEdit1.toolbarMode = 1;

    oEdit1.tabs=[
    ["tabHome", "Home", ["grpEdit", "grpFont", "grpPara"]],
    ["tabStyle", "Insert", ["grpInsert", "grpTables", "grpMedia", "grpResource"]]
    ];

    oEdit1.groups=[
    ["grpEdit", "", ["XHTMLSource", "FullScreen", "Search", "RemoveFormat", "BRK", "Undo", "Redo", "Cut", "Copy", "Paste", "PasteWord", "PasteText"]],
    ["grpFont", "", ["FontName", "FontSize", "Strikethrough", "Superscript", "BRK", "Bold", "Italic", "Underline", "ForeColor", "BackColor"]],
    ["grpPara", "", ["Paragraph", "Indent", "Outdent", "Styles", "StyleAndFormatting", "BRK", "JustifyLeft", "JustifyCenter", "JustifyRight", "JustifyFull", "Numbering", "Bullets"]],
    ["grpInsert", "", ["Hyperlink", "Bookmark", "BRK", "Image"]],
    ["grpTables", "", ["Table", "BRK", "Guidelines"]],
    ["grpMedia", "", ["Media", "Flash", "CustomName1", "CustomName2", "CustomName3", "BRK", "CustomTag", "Characters", "Line"]],
    ["grpResource", "", ["InternalLink", "BRK", "CustomObject"]]
    ];

    /***************************************************
      OTHER SETTINGS
    ***************************************************/
    oEdit1.css="style/test.css";//Specify external css file here

    oEdit1.cmdAssetManager = "modalDialogShow('/Editor/assetmanager/assetmanager.asp',640,465)"; //Command to open the Asset Manager add-on.
    oEdit1.cmdInternalLink = "modelessDialogShow('links.htm',365,270)"; //Command to open your custom link lookup page.
    oEdit1.cmdCustomObject = "modelessDialogShow('objects.htm',365,270)"; //Command to open your custom content lookup page.

    oEdit1.arrCustomTag=[["First Name","{%first_name%}"],
        ["Last Name","{%last_name%}"],
        ["Email","{%email%}"]];//Define custom tag selection

    oEdit1.customColors=["#ff4500","#ffa500","#808000","#4682b4","#1e90ff","#9400d3","#ff1493","#a9a9a9"];//predefined custom colors

    oEdit1.mode="XHTMLBody"; //Editing mode. Possible values: "HTMLBody" (default), "XHTMLBody", "HTML", "XHTML"

    oEdit1.REPLACE("txtContent");
  </script>

  <input type="submit" value="Submit" id="btnSubmit">

</form>

</body>
</html>