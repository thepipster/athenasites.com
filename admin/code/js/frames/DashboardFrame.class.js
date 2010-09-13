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

        BlogAPI.getComments(DataStore.m_siteID, 0, DashboardFrame.gotComments);
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

        if (!data.top_followers || data.top_followers == undefined){
            return;
        }
        
        for (var i=0; i<data.top_followers.length; i++){
            $('#follower'+i+'name').html(data.top_followers[i].name);
            if (data.top_followers[i].email == ""){
                $('#follower'+i+'email').html("(unknown)");
            }
            else {
                $('#follower'+i+'email').html(data.top_followers[i].email);
            }
            $('#follower'+i+'activity').html(data.top_followers[i].last_activity);
            $('#follower'+i+'comments').html(data.top_followers[i].no);
        }
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

    m_comments : '',

    gotComments : function(postID, comments){

        // Force the size, so it scrolls properly - but do this  only once
        var h = $('#apollo_site_comments_wrapper').height() - $('#apollo_site_comments_wrapper .title').height() - 4;
        $('#apollo_site_comments').innerHeight(h);

        DashboardFrame.m_comments = comments;
        DashboardFrame.paintComments(comments);
    },

    // ////////////////////////////////////////////////////////////////////////////

    /** What typs of comments to display, 'Pending','Approved','Trash','Spam' */
    m_commentsMode : 'Pending',

    /**
     * Update what comments we should display
     */
    showComments : function(status){
        $('.subFrameCommand').removeClass('selected');
        $('#showComments'+status).addClass('selected');
        DashboardFrame.m_commentsMode = status;
        DashboardFrame.paintComments();
    },
    
    // ////////////////////////////////////////////////////////////////////////

    paintComments : function(){

        var txt = "";
        if (!DashboardFrame.m_comments || DashboardFrame.m_comments == undefined){
            return;
        }
        
        var comments = DashboardFrame.m_comments;
        
        for (var i=0; i<comments.length; i++){
            if (DashboardFrame.m_commentsMode == 'All' || comments[i].status == DashboardFrame.m_commentsMode){
                txt += DashboardFrame.getCommentHTML(comments[i]);
            }
        }

        $('#apollo_site_comments').html(txt);
        
    },

    // ////////////////////////////////////////////////////////////////////////

    getCommentHTML : function(commentObj){

        var txt = "";
        var id = commentObj.id;
        var dt = new Date(commentObj.created);
        // For formats, see http://www.opengroup.org/onlinepubs/007908799/xsh/strftime.html
        var dateStr = dt.toLocaleFormat("%I:%M%p, %a, %b %e, %Y");

        var classStr = "pending_comment";
        switch (commentObj.status){
//            case 'Pending':
//                classStr = "pending_comment";
//                break;
            case 'Spam':
            case 'Trash':
                classStr = "trashed_comment";
                break;
//                classStr = "spam_comment";
//                break;
//            case 'Approved':
//                classStr = "approved_comment";
//                break;
        }

        var post = DataStore.getPost(commentObj.post_id);
        
        txt += "<div class='commentWrapper " + classStr + "'>";

        txt += "    <div class='commentTitle' style='overflow:hidden'>";
        txt += "    <span class='commentPostTitle'>" + post.title + "</span>";
        txt += "    </div>"
        txt += "    <div class='commentTitle'>";
        txt += "        By <span class='commentName'>" + commentObj.name + "</span> on <span class='commentDate'>" + dateStr + "</span>";

        if (commentObj.status != 'Spam'){
            txt += "    <a href='#' class='commentEdit' onclick=\"DashboardFrame.spamComment("+id+")\">spam</a>";
        }
        else {
            txt += "    <a href='#' class='commentEdit' onclick=\"DashboardFrame.unspamComment("+id+")\">not spam</a>";
        }

        if (commentObj.status != 'Spam'){
            if (commentObj.status == 'Trash'){
                txt += "    <a href='#' class='commentEdit' onclick=\"DashboardFrame.undeleteComment("+id+")\">undelete</a>";
            }
            else {
                txt += "    <a href='#' class='commentEdit' onclick=\"DashboardFrame.deleteComment("+id+")\">delete</a>";
            }
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

    // ////////////////////////////////////////////////////////////////////////////

    unspamComment : function(comment_id){
        MediaAPI.updateCommentStatus(DataStore.m_siteID, comment_id, 'Approved', DashboardFrame.onCommentUpdate);
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