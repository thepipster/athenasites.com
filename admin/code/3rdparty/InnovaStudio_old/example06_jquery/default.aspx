<%@ Page Language="vb" ValidateRequest="false" Debug="true" %>
<%@ Register TagPrefix="editor" Assembly="WYSIWYGEditor" namespace="InnovaStudio" %>

<script language="VB" runat="server">
    Sub Page_Load(Source As Object, E As EventArgs)
        
        If Not Page.IsPostBack Then
            oEdit1.Text = "Hello World!"
        End If
                
        '***************************************************
        '   SETTING EDITOR DIMENSION (WIDTH x HEIGHT)
        '***************************************************
            
        oEdit1.Width = 650
        oEdit1.Height=350
            

        '***************************************************
        '   ADDING CUSTOM BUTTON TO OPEN CUSTOM DIALOG (mp3.htm)
        '***************************************************
        
        oEdit1.ToolbarCustomButtons.Add(New CustomButton("CustomName1", "modelessDialogShow('../common/mp3.htm',340,125)", "Insert Music", "btnMusic.gif"))

        '***************************************************
        '   RECONFIGURE TOOLBAR BUTTONS
        '***************************************************
 
        oEdit1.ToolbarMode = 1
        Dim grpEdit As ISGroup = New ISGroup("grpEdit", "", New String() {"XHTMLSource", "FullScreen", "Search", "RemoveFormat", "BRK", "Undo", "Redo", "Cut", "Copy", "Paste", "PasteWord", "PasteText"})
        Dim grpFont As ISGroup = New ISGroup("grpFont", "", New String() {"FontName", "FontSize", "Strikethrough", "Superscript", "BRK", "Bold", "Italic", "Underline", "ForeColor", "BackColor"})
        Dim grpPara As ISGroup = New ISGroup("grpPara", "", New String() {"Paragraph", "Indent", "Outdent", "Styles", "StyleAndFormatting", "BRK", "JustifyLeft", "JustifyCenter", "JustifyRight", "JustifyFull", "Numbering", "Bullets"})
        Dim grpInsert As ISGroup = New ISGroup("Insert", "", New String() {"Hyperlink", "Bookmark", "BRK", "Image"})
        Dim grpTables As ISGroup = New ISGroup("grpTables", "", New String() {"Table", "BRK", "Guidelines"})
        Dim grpMedia As ISGroup = New ISGroup("grpMedia", "", New String() {"Media", "Flash", "CustomName1", "BRK", "CustomTag", "Characters", "Line"})
        Dim grpResource As ISGroup = New ISGroup("grpResource", "", New String() {"InternalLink", "BRK", "CustomObject"})
          
        Dim tabHome = New ISTab("tabHome", "Home")
        tabHome.Groups.AddRange(New ISGroup() {grpEdit, grpFont, grpPara})
        oEdit1.ToolbarTabs.add(tabHome)
            
        Dim tabStyle = new ISTab("tabStyle", "Insert")
        tabStyle.Groups.AddRange(New ISGroup() {grpInsert, grpTables, grpMedia, grpResource})
        oEdit1.ToolbarTabs.add(tabStyle)
        
            
        '***************************************************
        '   OTHER SETTINGS
        '***************************************************
            
        oEdit1.Css="style/test.css" 'Specify external css file here
                            
        oEdit1.AssetManagerWidth = 575
        oEdit1.AssetManagerHeight = 550
        oEdit1.AssetManager = "/Editor/assetmanager/assetmanager.aspx?c=en-US"

        oEdit1.InternalLinkWidth = 365
        oEdit1.InternalLinkHeight = 270
        oEdit1.InternalLink = "common/links.htm"

        oEdit1.CustomObjectWidth = 365
        oEdit1.CustomObjectHeight = 270
        oEdit1.CustomObject = "common/objects.htm"

        oEdit1.CustomTags.add(new Param("First Name","{%first_name%}"))
        oEdit1.CustomTags.add(new Param("Last Name","{%last_name%}"))
        oEdit1.CustomTags.add(new Param("Email","{%email%}"))

        oEdit1.CustomColors = New String() {"#ff4500","#ffa500","#808000","#4682b4","#1e90ff","#9400d3","#ff1493","#a9a9a9"}

        oEdit1.EditMode = EditorModeEnum.XHTMLBody

    End Sub

    Sub Button1_Click(Source As System.Object, E As System.EventArgs)
        Label1.Text = oEdit1.Text
    End Sub
</script>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <style>
        body{font:11px verdana,arial,sans-serif;}
        a{color:#0000cc;font-size:xx-small;}
    </style>

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
   
<form id="Form1" method="post" runat="server">

    <h2>Extending InnovaStudio WYSIWYG Editor using Custom Buttom & JQUERY - <a href="../default.htm">Back</a></h2>

    <br />

    <h3>HOW IT WORKS</h3>
    <img src="images/HowItWorks.png" />


    <h3>IMPLEMENTATION</h3>
    <p>   
    <b>STEP 1</b>: Initialize the Custom Button to open mp3.htm:<br />
    <pre>oEdit1.ToolbarCustomButtons.Add(New CustomButton("CustomName1", "modelessDialogShow('../common/mp3.htm',340,125)", "Insert Music", "btnMusic.gif"))</pre>
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

    <editor:wysiwygeditor 
        Runat="server"
        scriptPath="../scripts/"
        ID="oEdit1" />
        
    <asp:button runat="server" onclick="Button1_Click" Text="SUBMIT" ID="btnSubmit" />

    <div style="margin-top:30px;margin-bottom:30px;">
    <asp:label id="Label1" runat="server"/>
    </div>
</form>

</body>
</html>