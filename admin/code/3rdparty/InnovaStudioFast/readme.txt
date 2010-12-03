InnovaStudio WYSIWYG Editor - Fast Edition 1.1
Copyright © 2010, INNOVA STUDIO (www.InnovaStudio.com). All rights reserved.
____________________________________________________________________

*******************
    How to Use
*******************

1. Include the Editor js & css in the HEAD section of your HTML page:

	<link href="scripts/online-html-editor.css" rel="stylesheet" type="text/css" />
    <script src="scripts/online-html-editor.js" type="text/javascript"></script>
    
2. Add class "editThis" on any textarea you want to change into WYSIWYG editor.

    <textarea class="editThis" id="TextArea1" name="TextArea1" style="width:560px;height:260px;border:#92cefa 5px solid;">
    </textarea>
    
    Note: width, height & border of the textarea will be applied to the Editor.
    
3. (Only if you're using the Editor in ASP.NET page) Please add: OnClientClick="I_FinishEditing()" on the Submit Button:

    <asp:Button ID="Button1" runat="server" Text=" Submit " OnClientClick="I_FinishEditing()" OnClick="Button1_Click" />
    
    Note: The Editor also works in ASP.NET Update Panel.


*******************
	Examples
*******************

sample1.htm (Basic usage)

sample2.htm (With preloaded content)

sample3.aspx (ASP.NET AJAX/Update Panel support)

sample4.htm (Image & Link picker)


**************************
    What's New in 1.1
**************************

1. New Methods to use custom Image & Link picker (See sample4.htm). Usage:

    <script src="scripts/online-html-editor.js" type="text/javascript"></script>
    <script type="text/javascript" language="javascript">
		//If using ASP.NET:
        oEditorUtil.ImageManager = "asset.aspx";
        oEditorUtil.LinkManager = "asset.aspx";

        //If using PHP:
        //oEditorUtil.ImageManager = "asset.php";
        //oEditorUtil.LinkManager = "asset.php";

        //If using ASP:
        //oEditorUtil.ImageManager = "asset.asp";
        //oEditorUtil.LinkManager = "asset.asp";
    </script>

	To specify default folder for file browsing, change the root parameter:
	(in file: asset.aspx / asset.php / asset.asp)

    <script language="javascript" type="text/javascript">
        $(document).ready(function () {
            $('#container_id').fileTree({
                root: '/images/',
		...
		...
    </script>

2. New Method to insert custom html. Usage:

	<input id="Button1" type="button" value="Insert" onclick="I_InsertHTML('Content here..')" />


Thank you for using our product.

____________________________________________________________________
http://www.InnovaStudio.com