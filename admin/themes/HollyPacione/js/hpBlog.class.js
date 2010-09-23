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
		        
        hpBlog.m_commandURL = 'http://' + location.host + '/admin/code/php/remoteapi/BlogAPI.php';
    	
        hpBlog.onResize();
        setTimeout("hpBlog.onResize()", 200);
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

        $("#nav_container").width(blogW);
        $("#container").width(blogW);
        $("#content").width(blogW);

    },
    
	// ////////////////////////////////////////////////////////////////

    getComments : function(){

        var paras = {
            cmd : 'getComments',
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

    onGotComments : function(postID, commentList){
    },
    
	// ////////////////////////////////////////////////////////////////

    onPostComment : function(){

		if ($("#commentForm").valid()){

        	var authorName = $('#author').val();
        	var authorEmail = $('#email').val();
        	var commentContent = $('#comment').val();
        	var postURL = window.location;
        	var parentCommentID = 0;
        		        	
	        var paras = {
	            cmd : 'addComment',
	            site_id: hpBlog.m_siteID,
	            post_id: hpBlog.m_postID,
	            name: authorName, 
	            email: authorEmail,
	            post_url: escape(postURL),
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
    	alert('comment posted!');
    	alert(ret);
    }

}

