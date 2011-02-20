/**
* Class to handle the blog interaction
*/
var hpBlog = {

    /** Minimum allowed width */
    minWidth : 800,
    
    /** Ajax url */
    m_commandURL : '',

	m_postID : 0,
	
	m_siteID : 0,
		
	// ////////////////////////////////////////////////////////////////
	
    init : function(){
        	
        hpBlog.m_commandURL = 'http://' + location.host + '/admin/code/php/remoteapi/BlogAPI.php';
    
        hpBlog.onResize();
        setTimeout("hpBlog.onResize()", 200);
    
        // Get the comments
        hpBlog.getComments();
        
		// Validation
		$("#commentForm").validate();
						
		$.validator.addMethod(
			"required_email", function(value, element) { 
			
		  		if (value == 'Your E-mail Address') return false; 
		  		if (value == '') return false; 
		  		
		  		// Check to see if this group is complete
		  		return hpBlog.checkEmail(value);
			}, 
			"Enter a valid email");

		$.validator.addMethod(
			"required_name", function(value, element) { 
			
		  		if (value == 'Your Name') return false; 
		  		if (value == '') return false; 
		  		
		  		return true;
			}, 
			"Please enter your name");
		            	        
    },

	// ////////////////////////////////////////////////////////////////

	checkEmail : function(email) {
		var filter = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
		if (!filter.test(email)) {
			return false;
		}
		return true;
	},

	// ////////////////////////////////////////////////////////////////

    onResize : function(){

        var postWidth = $('#content').width() - 340;
        var blogW = $("#blogTable").width();
        
        //alert(blogW +", " + $('#content').width());

        $("#nav_container").width(blogW);
        $("#container").width(blogW);
        $("#content").width(blogW+20);

    },
    
	// ////////////////////////////////////////////////////////////////

    getComments : function(){

        var paras = {
            cmd : 'getApprovedComments',
            site_id: hpBlog.m_siteID,
            post_id: hpBlog.m_postID
        };

        $.ajax({
            url: hpBlog.m_commandURL,
            dataType: "json",
            data: paras,
            success: hpBlog.onGotComments
        });
           
    },
    
	// //////////////////////////////////////////////////////

    onGotComments : function(ret){
    
    	if (ret.result != 'ok') return;
    	
    	var commentList = ret.data.comments;
    	var postID = ret.data.post_id;
    	
    	var txt = "<h2>Comments</h2>";
    	
    	for (var i=0; i<commentList.length; i++){

	        var dt = new Date(commentList[i].created);
    	    var dateStr = dateFormat(dt, "ddd, mmm dS yyyy");
    	    var timeStr = dateFormat(dt, "h:MM:ss TT");
    	    var author = commentList[i].name;

			var commentClass = "odd";
			if (i%2 == 0) commentClass = "even";
			
    		txt += "<div align='left' class='comment "+commentClass+"'>";
    		txt += "    <span class='comment_time'>On " + dateStr + " at " + timeStr + "</span>";
    		txt += "    <span class='comment_author'>"+author+"</span> says <br/>";
    		txt += "    <p>"+commentList[i].content+"</p>";
    		txt += "</div>"
    	}
    	  
    	$('#comments').html(txt);  
    },
    
	// ////////////////////////////////////////////////////////////////

    onPostComment : function(){

		if ($("#commentForm").valid()){

        	var authorName = $('#author').val();
        	var authorEmail = $('#email').val();
        	var commentContent = $('#comment').val();
        	var authorURL = $('#url').val();
        	var parentCommentID = 0;
        		        	
	        var paras = {
	            cmd : 'addComment',
	            site_id: hpBlog.m_siteID,
	            post_id: hpBlog.m_postID,
	            name: authorName, 
	            email: authorEmail,
	            author_url: escape(authorURL),
	            content: commentContent,
	            pid: parentCommentID
	        };
			     					     	
	        $.ajax({
	            url: hpBlog.m_commandURL,
	            dataType: "json",
	            data: paras,
	            success:  hpBlog.onCommentPosted,
	            error: function(ret){alert(ret);}
	        });
	     
        }                	
    },
    
	// ////////////////////////////////////////////////////////////////

    onCommentPosted : function(ret){
    	$('.commentStatus').hide();
    	$('.commentStatus').html("Thank you for your comment. It will be displayed once approved.");
    	$('.commentStatus').fadeIn();
        $('#author').val('');
        $('#email').val('');
        $('#comment').val('');    	
    }

}

