/**
* Javascript interface to allow importing of posts and comments from Google's
* Blogger service
*
* @see http://code.google.com/apis/blogger/docs/2.0/developers_guide_protocol.html
*
* @author Mike Pritchard (mike@apollosites.com)
* @since 17th September, 2010
*/
var BloggerImporter = {

    /** Blogger username */
    m_username : '',

    /** Blogger URL */
    m_blogURL : '',
    
    m_noPosts : 0,
	
    m_postCt : 0,
	
    // ////////////////////////////////////////////////////////////////////////

    show : function(){

        var txt = "";
        txt += "<div id='apolloBlogImporter'>";
        txt += "    <fieldset>";
        txt += "        <legend>Progress</legend>";
        txt += "        <div class='importProgress' id='status' align='center'></div>";
        txt += "        <div id='progressBar'></div>";
        txt += "    </fieldset>";
        txt += "    <fieldset>";
        txt += "        <legend>Controls</legend>";
        txt += "        <table border='0' width='100%'>";
        txt += "            <tr>";
        txt += "                <td><span class='label' id=''>Blog Name</span></td>";
        txt += "                <td><input type='text' id='bloggerUser' name='bloggerUser' value=''></td>";
        txt += "            </tr>";
        txt += "        </table>";
        txt += "    </fieldset>";
        txt += "    <fieldset>";
        txt += "        <legend>Help</legend>";
        txt += "            <h3>What is my blog name?</h3>";
        txt += "            <p>Your blog name is the sub-domain of your blog, so for example if your blog is";
        txt += "               <b>apollosites.blogspot.com</b> then your blog name would be <b><i>apollosites</i></b></p>"
        txt += "    </fieldset>";
        /*
        txt += "    <fieldset>";
        txt += "        <legend>Help</legend>";
        txt += "            <h3>What is my blog ID number?</h3>";
        txt += "            <p>To find your blog ID, first log in to Blogger. Then choose the blog whose ID you want to find, and click on its name in the Dashboard, ";
        txt += "               just like you do when you want to post to it, or change the settings. </p><p>From any of the posting, settings, or template pages, you can find ";
        txt += "               your blog's ID number. Just look in your browser's address bar, at the end of the address you can something like blogID=XXXXXX</p>"
        txt += "    </fieldset>";
        */
        txt += "</div>";

        $('#apollo_dialog').html(txt);
        $('#apollo_dialog').dialog( 'destroy' );
        $('#apollo_dialog').dialog({
            modal: true,
            width:385,
            //height:260,
            resizable:false,
            buttons: {
                "Start": BloggerImporter.startImport,
                "Done": function() {
                    $(this).dialog('close');
                }
            },
            title: 'Import your Blogger blog'
        });

        // Progress bar.....

        $("#progressBar").progressbar({
            value: 0
        });
        AthenaDialog.setProgressBarColorMap("#progressBar", 0, 100, 'roygbiv');

    },

    // ////////////////////////////////////////////////////////////////////////

    startImport : function(){

        BloggerImporter.m_postCt = 0;
        $("#progressBar").progressbar({
            value: 0
        });
        
        BloggerImporter.m_username = $('#bloggerUser').val();
        
        if (BloggerImporter.m_username == "") {
            BloggerImporter.onError("You must enter a valid username!");
            return;
        }

        BloggerImporter.onMessage("Importing....");
        BloggerImporter.getPosts();

    },

    // ////////////////////////////////////////////////////////////////////////

//    m_email : '',
//    m_password : '',
//
//    checkCredentials : function(){
//
//      	var feedURL = "http://www.google.com/accounts/ClientLogin";
//
//        var username = "apollosites";
//
//        var paras = {
//            alt : 'json-in-script',
//            Email: BloggerImporter.m_email,
//            Passwd: BloggerImporter.m_password,
//            services: 'blogger',
//            accountType: 'GOOGLE',
//            source: 'apollosites-bloggerimporter-1'
//        };
//
//        $.ajax({
//            url: feedURL,
//            type: 'post',
//            dataType: "jsonp",
//            cache: false,
//            success: BloggerImporter.onCredentialsChecked,
//            error: BloggerImporter.onCredentialsChecked,
//            data: paras
//        });
//
//    },
//
//    onCredentialsChecked : function(data){
//        alert(data);
//    },
	
    // ////////////////////////////////////////////////////////////////////////

    getPosts : function(){
    
        // GET http://www.blogger.com/feeds/blogID/posts/default?published-min=2008-03-16T00:00:00&published-max=2008-03-24T23:59:59

        var feedURL = "http://"+BloggerImporter.m_username+".blogspot.com/feeds/posts/default";

        var paras = {
            alt : 'json-in-script'
        };

        $.ajax({
            url: feedURL,
            type: 'get',
            dataType: "jsonp",
            success: BloggerImporter.onGotPosts,
            data: paras
        });
        
    },
    
    // ////////////////////////////////////////////////////////////////////////

    /** List of posts */
    m_posts : false,
	
    /**
     * Parse the JSON comment data returned by the Google Blogger API
     * @see http://code.google.com/apis/gdata/docs/json.html
     */
    onGotPosts : function(data){
    	
        var feed = data.feed;
        var entries = feed.entry || [];

        BloggerImporter.m_posts = new Array();
        BloggerImporter.m_noPosts = entries.length;
		
        for (var i = 0; i < entries.length; ++i) {
                      
            var post = new Object();
            
            var pubDate = new Date(entries[i].published.$t); // 2010-05-06T14:31:11.746-06:00
            var updateDate = new Date(entries[i].updated.$t); // 2010-05-06T14:31:11.746-06:00
            var post_id = 0;
            
            // Get the id string, which contains the post id and blog id
            // tag:blogger.com,1999:blog-6545474407612624437.post-6821849969711838358
            var idString = entries[i].id.$t;
            var m = idString.match(/blog-([0-9]+).*post-([0-9]+)/);
            blog_id = m[1];
            post.id = m[2];
			
            post.title = entries[i].title.$t;
            post.content = entries[i].content.$t;
            post.date_gmt = pubDate.toString();
            post.can_comment = 1;
            post.tags = '';
            post.categories = '';
            post.status = 'Published';

            // <category scheme='http://www.blogger.com/atom/ns#' term='high school seniors'/>
        
            if (post.category != undefined){
                for (var cat=0; cat<post.category.length; cat++){
                    if (post.categories != ""){
                        post.categories += ",";
                    }
                    post.categories += post.category[cat].term;
                }
            }
        	
            BloggerImporter.m_posts.push(post);
           
            
        }    	
            
        // Now we have all the posts, start importing them into Apollo
        BloggerImporter.processNextPost();
    },

    // ////////////////////////////////////////////////////////////////////////

    /**
	* Process the posts one at a time
	*/
    processNextPost : function(){
	
        if (BloggerImporter.m_postCt >= BloggerImporter.m_noPosts){
            $('#status').html("<span style='color:green'>Import completed! Refresh the browser to see the changes.</span>");
            $("#progressBar").progressbar({
                value: 100
            });
            return;
        }
        	
        var post = BloggerImporter.m_posts[BloggerImporter.m_postCt];
        BloggerImporter.m_postCt++;
	        
        // Import the post into Apollo....
                    
        var paras = {
            cmd: 'importPost',
            site_id: DataStore.m_siteID,
            title: unescape(post.title),
            content: unescape(post.content),
            status: post.status,
            comment: post.can_comment,
            pubdate: post.date_gmt,
            csvtags: post.tags,
            csvcats: post.categories,
            import_source:'blogger',
            source_id: post.id
        };
								
        $.ajax({
            url: MediaAPI.m_url,
            type: 'post',
            dataType: "json",
            success: function(ret){
                BloggerImporter.onPostAdded(ret)
                },
            data: paras
        });
        
             	
    },
	
    // ////////////////////////////////////////////////////////////////////////

    m_bloggerPostID : 0,
    m_apolloPostID : 0,
	
    /**
	* Respond to a post being added by the apollo server
	*/ 
    onPostAdded : function(ret){

        if (ret.result != 'ok'){
            return;
        }
		
        BloggerImporter.m_apolloPostID = ret.data.post_id;
        BloggerImporter.m_bloggerPostID = ret.data.source_post_id;
				
        // Get comments for this post
        BloggerImporter.getComments(BloggerImporter.m_bloggerPostID);
				
    },
			
    // ////////////////////////////////////////////////////////////////////////

    /**
	* Get the comments for this post
	*/
    getComments : function(bloggerPostID){

        var feedURL = "http://"+BloggerImporter.m_username+".blogspot.com/feeds/"+bloggerPostID+"/comments/default";
        Logger.debug(feedURL);

        var paras = {
            alt : 'json-in-script'
        };

        $.ajax({
            url: feedURL,
            type: 'get',
            dataType: "jsonp",
            success: BloggerImporter.onGotCommentData,
            data: paras
        });
        
    },
		
    // ////////////////////////////////////////////////////////////////////////
		
    /**
     * Parse the JSON comment data returned by the Google Blogger API
     * @see http://code.google.com/apis/gdata/docs/json.html
     */
    onGotCommentData : function(data){

        var feed = data.feed;
        var entries = feed.entry || [];

        var commentList = new Array();
								
        for (var i = 0; i < entries.length; ++i) {
                      
            var entryObj = new Object();
            
            var pubDate = new Date(entries[i].published.$t);
            var updateDate = new Date(entries[i].updated.$t);
            
            /*
            var comment_url = "";
            for (var k=0; k < entries[i].link.length; k++){
            	if (entries[i].link.type == "application/atom+xml" && entries[i].link.rel == "self"){
            		comment_url = entries[i].link.href;
            	}
            }
            */

            // Get the id string, which contains the post id and blog id
            // tag:blogger.com,1999:blog-blogID.post-commentID
            var idString = entries[i].id.$t;

            var m = idString.match(/blog-([0-9]+).*post-([0-9]+)/);
            blog_id = m[1];
            var comment_id = m[2];

            entryObj.id = comment_id;
            entryObj.post_id = BloggerImporter.m_bloggerPostID;
            entryObj.parent_id = 0;

            entryObj.title = unescape(entries[i].title.$t);
            entryObj.content = unescape(entries[i].content.$t);
            entryObj.author = entries[i].author[0].name.$t;
            entryObj.author_email = entries[i].author[0].email.$t;
            if (entries[i].author[0].uri.$t != undefined){
                entryObj.author_url = entries[i].author[0].uri.$t;
            }
            else {
                entryObj.author_url = "";
            }
            entryObj.author_ip = '';
            entryObj.date_gmt = pubDate.toString();
            entryObj.approved = 1;
            
            commentList.push(entryObj);
            
        }
        
        if (commentList.length > 0){

            //alert(commentList.length + " comments, source post id = " + bloggerPostID + ", apollo post id = " + apolloPostID);
			
            // Import comments into Apollo
            var paras = {
                cmd: 'importComments',
                site_id: DataStore.m_siteID,
                pid: BloggerImporter.m_apolloPostID,
                com: $.toJSON(commentList),
                ims: 'blogger'
            };
						
            $.ajax({
                url: MediaAPI.m_url,
                type: 'post',
                dataType: "json",
                data: paras
            });
        }
                
        // Update progress bar
        BloggerImporter.updateProgress();
        
        // Get the next post
        BloggerImporter.processNextPost();
        
    },
    
	
    // ////////////////////////////////////////////////////////////////////////
	
    /**
	* Update progress bar
	*/
    updateProgress : function(){
        // Update progress
    
        var prog = Math.ceil(100 * BloggerImporter.m_postCt / BloggerImporter.m_noPosts);
        $("#status").html("Processed item " + BloggerImporter.m_postCt + " of " + BloggerImporter.m_noPosts);
        $("#progressBar").progressbar({
            value: prog
        });
        
    },
        
    // ////////////////////////////////////////////////////////////////////////

    onMessage : function(msg){
        $('#status').html("<span style='color:blue'>"+msg+"</span>");
    },

    onError : function(msg){
        $('#status').html("<span style='color:red'>"+msg+"</span>");
    }

// ////////////////////////////////////////////////////////////////////////

}