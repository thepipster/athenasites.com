/**
* Class to handle the blog interaction
*/
var cgpBlog = {

    /** Minimum allowed width */
    minWidth : 800,
    
    /** Ajax url */
    m_commandURL : '',

	m_postID : 0,
	
	m_siteID : 0,
		
	// ////////////////////////////////////////////////////////////////
	
    init : function(){
        	
        var setup = false;
	
        // See if this is a category....
        var sp1 = location.href.indexOf('blog/cat/');
        if (sp1 > 0){
            var cat = location.href.substring(sp1 + 9);
            cat = cat.substring(0, cat.length-1);
            cgpCommon.init('blog', cat);
            setup = true;
        }
	
        // see if this is a tag....
        sp1 = location.href.indexOf('blog/?tag=');
        if (sp1 > 0){
            var tag = location.href.substring(sp1 + 10);
            cgpCommon.init('blog', tag);
            setup = true;
        }

        if (!setup){
            cgpCommon.init('blog', 'all');
        }
            


    

        cgpBlog.m_commandURL = 'http://' + location.host + '/admin/code/php/remoteapi/BlogAPI.php';
    
        // Get the comments
        cgpBlog.getComments();
        
		// Validation
		$("#commentForm").validate();
						
		$.validator.addMethod(
			"required_email", function(value, element) { 
			
		  		if (value == 'Your E-mail Address') return false; 
		  		if (value == '') return false; 
		  		
		  		// Check to see if this group is complete
		  		return cgpBlog.checkEmail(value);
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

    getComments : function(){

        var paras = {
            cmd : 'getApprovedComments',
            site_id: cgpBlog.m_siteID,
            post_id: cgpBlog.m_postID
        };

        $.ajax({
            url: cgpBlog.m_commandURL,
            dataType: "json",
            data: paras,
            success: cgpBlog.onGotComments
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
        	var postURL = window.location;
        	var parentCommentID = 0;
        		        	
	        var paras = {
	            cmd : 'addComment',
	            site_id: cgpBlog.m_siteID,
	            post_id: cgpBlog.m_postID,
	            name: authorName, 
	            email: authorEmail,
	            post_url: escape(postURL),
	            content: commentContent,
	            pid: parentCommentID
	        };
			     					     	
	        $.ajax({
	            url: cgpBlog.m_commandURL,
	            dataType: "json",
	            data: paras,
	            success:  cgpBlog.onCommentPosted,
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
        $('#url').val('');    	
    }

}

