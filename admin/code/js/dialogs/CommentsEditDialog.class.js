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
        txt += "    <div id='commentList'></div>"
        txt += "</div>";
        
        $('#apollo_dialog').html(txt);
        $('#apollo_dialog').dialog( 'destroy' );
        $('#apollo_dialog').dialog({
            modal: true,
            width:550,
            height: $(window).height()-100,
            resizable:false,
            buttons: {
                Ok: function() {
                    $(this).dialog('close');
                }
            },
            title: 'Edit Post Comments'});

        BlogAPI.getComments(ssMain.siteID, DataStore.m_currentPostID, CommentsEditDialog.onGotComments)
    },

    // ////////////////////////////////////////////////////////////////////////

    unapproveComment : function(comment_id){
        MediaAPI.updateCommentStatus(ssMain.siteID, comment_id, 'Pending', CommentsEditDialog.onUpdate);
    },

    // ////////////////////////////////////////////////////////////////////////

    approveComment : function(comment_id){
        MediaAPI.updateCommentStatus(ssMain.siteID, comment_id, 'Approved', CommentsEditDialog.onUpdate);
    },

    // ////////////////////////////////////////////////////////////////////////

    deleteComment : function(comment_id){
        MediaAPI.updateCommentStatus(ssMain.siteID, comment_id, 'Trash', CommentsEditDialog.onUpdate);
    },

    // ////////////////////////////////////////////////////////////////////////

    undeleteComment : function(comment_id){
        MediaAPI.updateCommentStatus(ssMain.siteID, comment_id, 'Pending', CommentsEditDialog.onUpdate);
    },

    // ////////////////////////////////////////////////////////////////////////

    onUpdate : function(commentID, newStatus){
        CommentsEditDialog.show();
    },
    
    // ////////////////////////////////////////////////////////////////////////

    m_comments : '',

    onGotComments : function(postID, comments){

        if (!comments || comments == undefined){
            $('commentList').html('no comments');
            return;
        }

        CommentsEditDialog.m_comments = comments;

        CommentsEditDialog.paintComments();
    },
    
    // ////////////////////////////////////////////////////////////////////////

    paintComments : function(){

        comments = CommentsEditDialog.m_comments;

        // 'Pending','Approved','Trash','Spam'

        var noPending = 0;
        var noTrashed = 0;
        var noSpam = 0;
        var noApproved = 0;
        
        for (var i=0; i<comments.length; i++){
            switch (comments[i].status){
                case 'Pending':noPending++;break;
                case 'Trash':noTrashed++;break;
                case 'Spam':noSpam++;break;
                case 'Approved':noApproved++;break;
            }
        }

        var txt = "";

        txt += "<h3 class='commentSummary'>" + noApproved + " comments approved, " + noPending + " awaiting approval</h3>";

        if (noPending != 0){
            txt += "<h3>Comments Pending Approval</h3>";
            for (var i=0; i<comments.length; i++){
                if (comments[i].status == 'Pending'){
                    txt += CommentsEditDialog.getCommentHTML(comments[i]);
                }
            }
        }

        if (noApproved != 0){
            txt += "<h3>Approved Comments</h3>";
            for (var i=0; i<comments.length; i++){
                if (comments[i].status == 'Approved'){
                    txt += CommentsEditDialog.getCommentHTML(comments[i]);
                }
            }
        }

        if (noTrashed != 0){
            txt += "<h3>Deleted</h3>";
            for (var i=0; i<comments.length; i++){
                if (comments[i].status == 'Trash'){
                    txt += CommentsEditDialog.getCommentHTML(comments[i]);
                }
            }
        }
/*
        txt += "<h3>Spam</h3>";

        for (var i=0; i<comments.length; i++){
            if (comments[i].status == 'Spam'){
                txt += CommentsEditDialog.getCommentHTML(comments[i]);
            }
        }
*/
        $('#commentList').html(txt);
        
    },

    // ////////////////////////////////////////////////////////////////////////

    getCommentHTML : function(commentObj){

        var txt = "";
        var id = commentObj.id;
        var dt = new Date(commentObj.created);
        // For formats, see http://www.opengroup.org/onlinepubs/007908799/xsh/strftime.html
        var dateStr = dt.toLocaleFormat("%I:%M%p, %a, %b %e, %Y");

        var classStr = "";
        switch (commentObj.status){
            case 'Pending':classStr = "pending_comment";break;
            case 'Trash':classStr = "trashed_comment";break;
            case 'Spam':classStr = "spam_comment";break;
            case 'Approved':classStr = "approved_comment";break;
        }

        txt += "<div class='commentWrapper " + classStr + "'>";

        txt += "    <div class='commentTitle'>";
        txt += "        By <span class='commentName'>" + commentObj.name + "</span> on <span class='commentDate'>" + dateStr + "</span>";
        
        if (commentObj.status == 'Trash'){
            txt += "    <a href='#' class='commentEdit' onclick=\"CommentsEditDialog.undeleteComment("+id+")\">undelete</a>";
        }
        else {
            txt += "    <a href='#' class='commentEdit' onclick=\"CommentsEditDialog.deleteComment("+id+")\">delete</a>";
        }
        
        if (commentObj.status == 'Pending'){
            txt += "    <a href='#' class='commentEdit' onclick=\"CommentsEditDialog.approveComment("+id+")\">approve</a>";
        }
        else if (commentObj.status == 'Approved'){
            txt += "    <a href='#' class='commentEdit' onclick=\"CommentsEditDialog.unapproveComment("+id+")\">unapprove</a>";
        }
        txt += "    </div>";

        txt += "    <div class='commentContents'>"+commentObj.content+"</div>";
        txt += "</div>";

        return txt;
    } 

    // ////////////////////////////////////////////////////////////////////////
}

