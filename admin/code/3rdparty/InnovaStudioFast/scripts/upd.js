try {
    var prm = Sys.WebForms.PageRequestManager.getInstance();
    prm.add_endRequest(function() {
        I_RenderEditor();
    });
}
catch (e) {
}