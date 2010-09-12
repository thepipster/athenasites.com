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
        // TODO: edit comment dialog
        txt += "TODO!";

        txt += "</div>";

        $('#apollo_dialog').html(txt);
        $('#apollo_dialog').dialog( 'destroy' );
        $('#apollo_dialog').dialog({
            modal: true,
            width:385,
//            height:280,
            resizable:false,
            buttons: {
                Ok: function() {
                    $(this).dialog('close');
                }
            },
            title: 'Edit Post Comments' });

    }
}

