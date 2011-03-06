/**
*
* 
* @since 27th July, 2010
*/
var DashboardFrame = {

    /** What we're showing in the snap shot tab */
    m_snapshotMode : 'traffic',

    /** What typs of comments to display, 'Pending','Approved','Trash','Spam' */
    m_commentsMode : 'Pending',

    /** Comments data */
    m_comments : '',

    /** Summary data */
    m_summaryData : '',

    /** Stats data */
    m_pageViews : '',
    m_discUsage : '',
    
    m_painted : false,

    // ////////////////////////////////////////////////////////////////////////////

    init : function(){
    },
	
    // ////////////////////////////////////////////////////////////////////////////
	
    repaint : function(){
        if (DashboardFrame.m_painted){
            DashboardFrame.paintSnapshotTab();
        }
        else {
            $('#apollo_followers_summary').hide();
            $('#apollo_site_stats_summary').hide();
            BlogAPI.getComments(ssMain.siteID, 0, DashboardFrame.gotComments);
            BlogAPI.getSummary(ssMain.siteID, DashboardFrame.gotSummary);
            DashboardFrame.m_painted = true;
        }
    },

    // ////////////////////////////////////////////////////////////////////////////

    gotSummary : function(data){
        DashboardFrame.m_summaryData = data;
        StatsAPI.getSiteSummaryStats(ssMain.siteID, 30, DashboardFrame.gotStats);
    },
    
    // ////////////////////////////////////////////////////////////////////////////

    gotStats : function(disc_usage, page_views){
        DashboardFrame.m_discUsage = disc_usage;
        DashboardFrame.m_pageViews = page_views;
        DashboardFrame.paintSnapshotTab();
    },

    // ////////////////////////////////////////////////////////////////////////////

    paintSnapshotTab : function(){
		
        if (DashboardFrame.m_snapshotMode == 'traffic'){
            $('#apollo_followers_summary').hide();
            $('#apollo_site_stats_summary').show();
            DashboardFrame.paintStats();
        }
        else {
            $('#apollo_followers_summary').show();
            $('#apollo_site_stats_summary').hide();
            DashboardFrame.paintFollowers();
        }
    },

    // ////////////////////////////////////////////////////////////////////////////

    showTraffic : function(){
	
        $('.subFrameCommand').removeClass('selected');
        $('#showTraffic').addClass('selected');
	
        DashboardFrame.m_snapshotMode = 'traffic';
        DashboardFrame.paintSnapshotTab();
    },
	
    showFollowers : function(){
	
        $('.subFrameCommand').removeClass('selected');
        $('#showFollowers').addClass('selected');
        
        DashboardFrame.m_snapshotMode = 'followers';
        DashboardFrame.paintSnapshotTab();
    },
		
    // ////////////////////////////////////////////////////////////////////////////

    m_discUsePC : 0,
	
    paintStats : function(){        

        var data = DashboardFrame.m_summaryData;
		
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
            
        $('#disc_usage').html(AthenaUtils.addCommas(DashboardFrame.m_discUsage, 2) + " MB");
            
        /*    
        var maxDisc = defines.max_hdd;
        DashboardFrame.m_discUsePC = 100 * DashboardFrame.m_discUsage / maxDisc  
        $("#disc_usage_bar").height(15);
        $("#disc_usage_bar").progressbar({
            value: 0
        });
        
        AthenaDialog.setProgressBarColorMap("#disc_usage_bar", 0, 100, 'heat');		
        DashboardFrame.animateDU();
        
        */
            
        StatViewer.paintStatGraph("#apollo_stats_graph_small", DashboardFrame.m_pageViews);        
    },
    
	/*
    tempVal : 0,
	
    animateDU : function(){
        DashboardFrame.tempVal += 1;
        $("#disc_usage_bar").progressbar({
            value: DashboardFrame.tempVal
            });
        if (DashboardFrame.tempVal < DashboardFrame.m_discUsePC){
            setTimeout("DashboardFrame.animateDU()", 10);
        }
        else {
            $("#disc_usage_bar").progressbar({
                value: DashboardFrame.m_discUsePC
                });
        }
    },
	*/	    
    // ////////////////////////////////////////////////////////////////////////////
                
    /**
     * Paint the blog summary information
     */
    paintFollowers : function(){

        var data = DashboardFrame.m_summaryData;

        if (!data.top_followers || data.top_followers == undefined || data.top_followers.length == 0){
            return;
        }
                
        // Paint the top followers...
        
        var txt = "";
        txt += '<table class="statsTable"  border="0" cellspacing="2" cellpadding="3">';
        txt += '<thead class="head" align="left">';
        txt += '<th>#</th><th>Commenter</th><th>Last Activity</th><th>No Comments</th>';
        txt += '</thead>';

        for (var i=0; i<data.top_followers.length; i++){

            var dt = new Date(data.top_followers[i].last_activity);
            var dateStr = dateFormat(dt, "ddd, mmm dS yyyy");

            var namelink = data.top_followers[i].name;
            if (data.top_followers[i].url != undefined){
                namelink = "<a href='"+data.top_followers[i].url+"'>"+data.top_followers[i].name+"</a>";
            }
            
            var className = 'odd';
            if (i % 2) className = 'even';
            
            txt += '<tr align="left" class="'+className+'">';
            txt += '    <td>'+(i+1)+'</td>';
            txt += '    <td class="commentName" id="follower0name">'+namelink+'</td>';
            txt += '    <td class="commentDate" >'+dateStr+'</td>';
            txt += '    <td>'+data.top_followers[i].no+'</td>';
            txt += '</tr>';
        }


        txt += '</table>';
        $('#apollo_followers_summary').html(txt);
    //        $('#apollo_followers_sumary').removeClass("scroll-pane");
    //        $('#apollo_followers_sumary').addClass("scroll-pane");
    //        $('#apollo_followers_sumary').jScrollPane();

    },

    // ////////////////////////////////////////////////////////////////////////////

    gotComments : function(postID, comments){
        DashboardFrame.m_comments = comments;
        DashboardFrame.paintComments(comments);
    },

    // ////////////////////////////////////////////////////////////////////////////

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
        if (!DashboardFrame.m_comments || DashboardFrame.m_comments == undefined || DashboardFrame.m_comments.length == 0){
            $('#apollo_site_comments').html("<div align='center'><p>I'm sorry, you don't have any comments yet</p></div>");
            return;
        }
        
        var comments = DashboardFrame.m_comments;
        
        for (var i=0; i<comments.length; i++){
            if (DashboardFrame.m_commentsMode == 'All' || comments[i].status == DashboardFrame.m_commentsMode){
                txt += DashboardFrame.getCommentHTML(comments[i]);
            }
        }

        $('#apollo_site_comments').html(txt);
    //        $('#apollo_site_comments').removeClass("scroll-pane");
    //        $('#apollo_site_comments').addClass("scroll-pane");
    //        $('#apollo_site_comments').jScrollPane();
    //        $('#apollo_site_comments_wrapper').css('margin-right', 0);
    //        $('#apollo_site_comments_wrapper').css('padding-right', 0);
        
    },

    // ////////////////////////////////////////////////////////////////////////

    getCommentHTML : function(commentObj){

        var txt = "";
        var id = commentObj.id;
        var dt = new Date(commentObj.created);
        var dateStr = dateFormat(dt, "ddd, mmm dS yyyy, h:MM:ss TT");

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
        BlogAPI.updateCommentStatus(ssMain.siteID, comment_id, 'Approved', DashboardFrame.onCommentUpdate);
    },

    spamComment : function(comment_id){
        BlogAPI.updateCommentStatus(ssMain.siteID, comment_id, 'Spam', DashboardFrame.onCommentUpdate);
    },

    unapproveComment : function(comment_id){
        BlogAPI.updateCommentStatus(ssMain.siteID, comment_id, 'Pending', DashboardFrame.onCommentUpdate);
    },

    approveComment : function(comment_id){
        BlogAPI.updateCommentStatus(ssMain.siteID, comment_id, 'Approved', DashboardFrame.onCommentUpdate);
    },

    deleteComment : function(comment_id){
        BlogAPI.updateCommentStatus(ssMain.siteID, comment_id, 'Trash', DashboardFrame.onCommentUpdate);
    },

    undeleteComment : function(comment_id){
        BlogAPI.updateCommentStatus(ssMain.siteID, comment_id, 'Pending', DashboardFrame.onCommentUpdate);
    },

    onCommentUpdate : function(commentID, newStatus){
    	
        for (var i=0; i<DashboardFrame.m_comments.length; i++){
            if (DashboardFrame.m_comments[i].id == commentID){
                DashboardFrame.m_comments[i].status = newStatus;
                DashboardFrame.paintComments();
            }
        }
    	
    }

}