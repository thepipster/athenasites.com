/**
*
* 
* @since 27th July, 2010
*/
var DashboardFrame = {

    init : function(){
    },
	
    // ////////////////////////////////////////////////////////////////////////////
	
    repaint : function(){

        BlogAPI.getComments(DataStore.m_siteID, 0, DashboardFrame.paintPendingComments);
        BlogAPI.getSummary(DataStore.m_siteID, DashboardFrame.paintSummary);

        //DashboardFrame.paintTools();
        DashboardFrame.paintSettings();
    },

    // ////////////////////////////////////////////////////////////////////////////

    /**
     * Paint the blog summary information
     */
    paintSummary : function(data){

        $('#no_comments_approved').html( data.comments_approved);
        $('#no_comments_pending').html( data.comments_pending);
        $('#no_comments_spam').html( data.comments_spam);
        $('#no_comments_trash').html( data.comments_trash);
        $('#no_posts_published').html( data.posts_published);
        $('#no_posts_draft').html( data.posts_draft);
        $('#no_posts_private').html( data.posts_private);
        $('#no_catgeories').html( data.categories);
        $('#no_tags').html( data.tags);
        $('#no_followers').html( data.no_followers);

        
    },

    // ////////////////////////////////////////////////////////////////////////////

    paintSettings : function(){
		
        var txt = "";
		
        txt += "<div class='subframebox'>";
        txt += "    <span class='title'>Settings</span>";
        txt += "</div>"
		
        $('#apollo_site_settings_content').html(txt);
    },

    // ////////////////////////////////////////////////////////////////////////////

    //    paintComments : function(postID, comments){
    //
    //        var txt = "";
    //
    //        txt += "<div class='subframebox'>";
    //        txt += "    <span class='title'>Settings</span>";
    //        txt += "</div>"
    //
    //        $('#apollo_site_settings_content').html(txt);
    //    },

    paintPendingComments : function(postID, comments){
        
        var txt = "";

        for (var i=0; i<comments.length; i++){
            if (comments[i].status == 'Pending'){
                txt += DashboardFrame.getCommentHTML(comments[i]);
            }
        }

        $('#apollo_site_comments').html(txt);
        //$('#apollo_site_comments').height($('#MainContent').height()/2);
        $('#apollo_site_comments').height( ($(window).height()-$('#menu_container').height())/2);
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
            case 'Pending':
                classStr = "pending_comment";
                break;
            case 'Trash':
                classStr = "trashed_comment";
                break;
            case 'Spam':
                classStr = "spam_comment";
                break;
            case 'Approved':
                classStr = "approved_comment";
                break;
        }

        var post = DataStore.getPost(commentObj.post_id);
        
        txt += "<div class='commentWrapper " + classStr + "'>";

        txt += "    <div class='commentTitle' style='overflow:hidden'>";
        txt += "    <span class='commentPostTitle'>" + post.title + "</span>";
        txt += "    </div>"
        txt += "    <div class='commentTitle'>";
        txt += "        By <span class='commentName'>" + commentObj.name + "</span> on <span class='commentDate'>" + dateStr + "</span>";

//        if (commentObj.status != 'Spam' && commentObj.status != 'PossibleSpam'){
            txt += "    <a href='#' class='commentEdit' onclick=\"DashboardFrame.spamComment("+id+")\">spam</a>";
//        }
        
        if (commentObj.status == 'Trash'){
            txt += "    <a href='#' class='commentEdit' onclick=\"DashboardFrame.undeleteComment("+id+")\">undelete</a>";
        }
        else {
            txt += "    <a href='#' class='commentEdit' onclick=\"DashboardFrame.deleteComment("+id+")\">delete</a>";
        }

        if (commentObj.status == 'Pending'){
            txt += "    <a href='#' class='commentEdit' onclick=\"DashboardFrame.approveComment("+id+")\">approve</a>";
        }
        else if (commentObj.status == 'Approved'){
            txt += "    <a href='#' class='commentEdit' onclick=\"DashboardFrame.unapproveComment("+id+")\">unapprove</a>";
        }
        txt += "    </div>";

        txt += "    <div class='commentContents'>"+commentObj.content+"</div>";
        txt += "</div>";

        return txt;
    },

    spamComment : function(comment_id){
        MediaAPI.updateCommentStatus(DataStore.m_siteID, comment_id, 'Spam', DashboardFrame.onCommentUpdate);
    },

    unapproveComment : function(comment_id){
        MediaAPI.updateCommentStatus(DataStore.m_siteID, comment_id, 'Pending', DashboardFrame.onCommentUpdate);
    },

    approveComment : function(comment_id){
        MediaAPI.updateCommentStatus(DataStore.m_siteID, comment_id, 'Approved', DashboardFrame.onCommentUpdate);
    },

    deleteComment : function(comment_id){
        MediaAPI.updateCommentStatus(DataStore.m_siteID, comment_id, 'Trash', DashboardFrame.onCommentUpdate);
    },

    undeleteComment : function(comment_id){
        MediaAPI.updateCommentStatus(DataStore.m_siteID, comment_id, 'Pending', DashboardFrame.onCommentUpdate);
    },

    onCommentUpdate : function(commentID, newStatus){
        DashboardFrame.repaint();
    },

    // ////////////////////////////////////////////////////////////////////////////
	
    paintTools : function(){
		
        var txt = "";
		
        txt += "<div class='subframebox'>";
        txt += "    <span class='title'>Tools</span>";
        txt += "    <fieldset>";
        txt += "    <legend>Import Blog Posts</legend>";
        txt += "    <button class='basic_button' onclick='WordpressImporter.show()'>Wordpress</button><br/>";
        txt += "    <button class='basic_button' onclick=''>Blogger</button><br/>";
        txt += "    <button class='basic_button' onclick='LiveJournalImporter.show()'>Livejournal</button><br/>";
        txt += "    </fieldset>";
        txt += "</div>"
		
        $('#apollo_site_tools_content').html(txt);
    }

}