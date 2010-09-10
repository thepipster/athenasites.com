<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <style>
        body{font:11px verdana,arial,sans-serif;}
        a{color:#0000cc;font-size:xx-small;}
    </style>
    
    <script language=JavaScript src='../scripts/innovaeditor.js'></script>

    <!-- Include JQUERY -->
    <script src="../common/jquery-1.4.2.min.js" type="text/javascript"></script>
    <script language="javascript" type="text/javascript">
        $(document).ready(function () {

            $('a.media').each(function (i) {
                var audioPlayer = '<object type="application/x-shockwave-flash" data="../common/audioplayer/player.swf" height="24" width="290">';
                audioPlayer += '<param name="movie" value="../common/audioplayer/player.swf">';
                audioPlayer += '<param name="FlashVars" value="playerID=' + i + '&amp;soundFile=' + $(this).attr('href') + '&titles=' + $(this).html() + '">';
                audioPlayer += '<param name="quality" value="high">';
                audioPlayer += '<param name="menu" value="false">';
                audioPlayer += '<param name="wmode" value="transparent">';
                audioPlayer += '</object>';
                /*audioPlayer += '<br/><a href=\"' + $(this).attr('href') + '\" target=\"_blank\">download mp3</a>';*/
                $(this).after(audioPlayer).remove();
            });

        });
    </script>

</head>
<body>

<form method="post" action="default.php" id="Form1">

    <h2>Extending InnovaStudio WYSIWYG Editor using Custom Buttom & JQUERY - <a href="../default.htm">Back</a></h2>

    <br />

    <h3>HOW IT WORKS</h3>
    <img src="images/HowItWorks.png" />


    <h3>IMPLEMENTATION</h3>
    <p>   
    <b>STEP 1</b>: Initialize the Custom Button to open mp3.htm:<br />
    <pre>oEdit1.arrCustomButtons = [["CustomName1","modelessDialogShow('../common/mp3.htm',340,125)","Insert Music","btnMusic.gif"]]</pre>
    <br />mp3.htm is a Custom Dialog that we use to insert a hyperlink with class="media".
    <br /><br /><br />
    <b>STEP 2</b>: Include JQUERY<br />
    <pre>&lt;script src="../common/jquery-1.4.2.min.js" type="text/javascript">&lt;/script></pre>
    <br /><br />
    <b>STEP 3</b>: Add  the following code on document ready:<br />
    <pre>
    &lt;script language="javascript" type="text/javascript">
    $(document).ready(function () {

        $('a.media').each(function (i) {
            var audioPlayer = '&lt;object type="application/x-shockwave-flash" data="../common/audioplayer/player.swf" height="24" width="290">';
            audioPlayer += '&lt;param name="movie" value="../common/audioplayer/player.swf">';
            audioPlayer += '&lt;param name="FlashVars" value="playerID=' + i + '&amp;soundFile=' + $(this).attr('href') + '&titles=' + $(this).html() + '">';
            audioPlayer += '&lt;param name="quality" value="high">';
            audioPlayer += '&lt;param name="menu" value="false">';
            audioPlayer += '&lt;param name="wmode" value="transparent">';
            audioPlayer += '&lt;/object>';
            /*audioPlayer += '&lt;br/>&lt;a href=\"' + $(this).attr('href') + '\" target=\"_blank\">download mp3&lt;/a>';*/
            $(this).after(audioPlayer).remove();
        });

    });
    &lt;/script>
    </pre>
    </p>

    <h3>DEMO</h3>
    
  <textarea id="txtContent" name="txtContent" rows=4 cols=30>
  <?php
  function encodeHTML($sHTML)
    {
    $sHTML=ereg_replace("&","&amp;",$sHTML);
    $sHTML=ereg_replace("<","&lt;",$sHTML);
    $sHTML=ereg_replace(">","&gt;",$sHTML);
    return $sHTML;
    }

  if(isset($_POST["txtContent"]))
    {
    $sContent=stripslashes($_POST['txtContent']); /*** remove (/) slashes ***/
    echo encodeHTML($sContent);
    }
  ?>
  </textarea>

  <script>
    var oEdit1 = new InnovaEditor("oEdit1");

    oEdit1.width=680;
    oEdit1.height=450;

    /***************************************************
    ADDING CUSTOM BUTTONS
    ***************************************************/

    oEdit1.arrCustomButtons = [["CustomName1","modelessDialogShow('../common/mp3.htm',340,125)","Insert Music","btnMusic.gif"]]


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

    oEdit1.cmdAssetManager = "modalDialogShow('/Editor/assetmanager/assetmanager.php',640,465)"; //Command to open the Asset Manager add-on.
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
  
    <div style="margin-top:30px;margin-bottom:30px;">
    <?php
    echo isset($_POST["txtContent"]) ? $_POST["txtContent"] : "";
    ?>
    </div>
    
</form>

</body>
</html>