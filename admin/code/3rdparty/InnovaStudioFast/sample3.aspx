<%@ Page Language="VB" AutoEventWireup="false" ValidateRequest="false" EnableEventValidation="false" ViewStateEncryptionMode="Never" enableViewStateMac="false" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<script runat="server">
    Protected Sub Button1_Click(ByVal sender As Object, ByVal e As System.EventArgs)
        Literal1.Text = TextBox1.Text
    End Sub
</script>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Editor</title>
    <link href="scripts/editor.css" rel="stylesheet" type="text/css" />
    <link href="scripts/online-html-editor.css" rel="stylesheet" type="text/css" />
    <script src="scripts/online-html-editor.js" type="text/javascript"></script>
</head>
<body style="margin:20px">
    <form id="form1" runat="server">

    <asp:ScriptManager ID="ScriptManager1" runat="server">
    </asp:ScriptManager>
  
    <asp:UpdatePanel ID="UpdatePanel1" runat="server">
    <ContentTemplate>

        <asp:TextBox ID="TextBox1" TextMode="MultiLine" CssClass="editThis" Width="550" Height="250" Text="Lorem ipsum fierent mnesarchum ne vel, et usu posse takimata omittantur, pro ut tale erant sapientem." runat="server">
        </asp:TextBox>
        
        <br /><br />        
        <asp:Button ID="Button1" CssClass="button" runat="server" Text=" Save Changes " OnClientClick="I_FinishEditing()" OnClick="Button1_Click" />
        
        <br /><br />
        <asp:Literal ID="Literal1" runat="server"></asp:Literal>

    </ContentTemplate>
    </asp:UpdatePanel>
    
    </form>

</body>
</html>
