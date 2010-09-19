/**
 * Javascript interface to the Flash WordpressImporter.swf that allows the Javascript to read the contents of
 * a file from the users local file system
 *
 * @author Mike Pritchard (mike@apollosites.com)
 * @since 22nd August, 2010
 */
var WordpressImporter = {
	
    // ////////////////////////////////////////////////////////////////////////
	
    show : function(){
	
        var txt = "";
        txt += "<div id='apolloBlogImporter'>";
        txt += "    <fieldset>";
        txt += "        <legend>Progress</legend>";
        txt += "        <div class='importProgress' id='status'>Status</div>";
        txt += "        <div id='progressBar'></div>";
        txt += "    </fieldset>";
        txt += "    <fieldset>";
        txt += "        <legend>Select File</legend>";
        //txt += "        <div class='importText'>To export your old Wordpress blog, log in to your old Wordpress blog and select tools->export to download you WordPress eXtended RSS (WXR) file</div>";
        txt += "        <div class='importText'>Import your WordPress eXtended RSS (WXR) file</div><br/>";
        txt += "        <div id='flashImporter'></div>";
        txt += "    </fieldset>";
        txt += "</div>";
		
        $('#apollo_dialog').html(txt);	
        $('#apollo_dialog').dialog( 'destroy' );
        $('#apollo_dialog').dialog({
            modal: true,
            width:385,
//            height:280,
            resizable:false,
            buttons: {
                "Done": function() {
                    $(this).dialog('close');
                }
            },
            title: 'Import a WordPress blog'});
		
        // Progress bar.....
		
        $("#progressBar").progressbar({
            value: 0
        });
        AthenaDialog.setProgressBarColorMap("#progressBar", 0, 100, 'roygbiv');
		
        // Paint flash object....
			
        var flash_url = defines.code_url + "flash/wordpressimporter/WordpressImporter.swf";

        var flashvars = {};
        var params = {
            bgcolor: "#ffffff",
            quality: "high",
            menu: "false",
            allowScriptAccess: "sameDomain"
        };
        var attributes = {
            id: "WordpressImporter",
            name: "WordpressImporter"
        };
		
        swfobject.embedSWF(flash_url, 'flashImporter', "80", "22", "10.0.0","expressInstall.swf", flashvars, params, attributes);
    },

    // ////////////////////////////////////////////////////////////////////////

    updateProgress : function(){
        // Update progress
        WordpressImporter.postCt++;
        var prog = Math.ceil(100 * WordpressImporter.postCt / WordpressImporter.noPosts);
        $("#status").html("Processed item " + WordpressImporter.postCt + " of " + WordpressImporter.noPosts);
        $("#progressBar").progressbar({value: prog});
    },
	
    postCt : 0,
    comments : '',
	
    /**
     * Respond to the flash player extracting a post
     * post: title, date, date_gmt, can_comment, password, author, tags, categories, content, excerpt
     * comment: id, author, author_email, author_url, author_ip, date, date_gmt, content, approved, parent_id
     */
    onPost : function(postJSONString, commentsJSONString){
				
        if (postJSONString == ""){
            WordpressImporter.updateProgress();
            //setTimeout('WordpressImporter.getNextPost()', 2000);
            WordpressImporter.getNextPost();
            return;
        }
				
        try {
					
            //var post = eval('(' + postJSONString + ')');
            var post = $.parseJSON( postJSONString );
            var comments = false;
            if (commentsJSONString != ""){
                comments = $.parseJSON( commentsJSONString );
            }

            // Add post.....

            // Mon, 24 Jan 2005 16:26:00 +0000
            //var pubdate = post.date_gmt;
						
            var paras = {cmd: 'importPost',
                site_id: DataStore.m_siteID,
                title: unescape(post.title),
                content: unescape(post.content),
                status: post.status,
                comment: post.can_comment ? 1 : 0,
                pubdate: post.date_gmt,
                csvtags: post.tags,
                csvcats: post.categories,
                import_source:'wordpress',
                source_id: post.id
            };
									
            $.ajax({
                url: MediaAPI.m_url,
                type: 'post',
                dataType: "json",
                success: function(ret){WordpressImporter.onPostAdded(ret)},
                data: paras
            });
	
            // Store comments until we have the post id
            WordpressImporter.comments = comments;
				
        }
        catch(err){
            Logger.error(err.toString());
        }

							
    },

    // ////////////////////////////////////////////////////////////////////////
		
    /**
     * Called when the post has been added on the backed
     */
    onPostAdded : function(ret){
	
        if (ret.result != 'ok'){
            return;
        }
		
        var post_id = ret.data.post_id;
        WordpressImporter.updateProgress();
				
        // Add comments....
		
        if (WordpressImporter.comments){
            if (WordpressImporter.comments.length > 0){
			
                var paras = {cmd: 'importComments',
                    site_id: DataStore.m_siteID,
                    pid: post_id,
                    com: $.toJSON(WordpressImporter.comments),
                    ims: 'wordpress'
                };
							
                $.ajax({url: MediaAPI.m_url, type: 'post', dataType: "json", data: paras});
							
            }
        }
		
        /*
		var comments = WordpressImporter.comments;
		
		for (var i=0; i<comments.length; i++){
															
			var paras = {cmd: 'importComment', 
						site_id: DataStore.m_siteID, 
						arn: unescape(comments[i].author), 
						aem: unescape(comments[i].author_email), 
						aip: comments[i].author_ip, 
						aurl: comments[i].author_url, 
						content: unescape(comments[i].content), 
						cid: comments[i].id, 
						pcid: comments[i].parent_id, 
						pid: post_id, 
						pubdate: comments[i].date_gmt, 
						apr: comments[i].approved ? 1 : 0, 
						ims: 'wordpress'
						};
			if (!WordpressImporter.test){
				$.ajax({url: MediaAPI.m_url, type: 'post', dataType: "json", data: paras});	
				WordpressImporter.test = true;
			}
		}
         */

        // Get the next post, but give a small pause!
        //setTimeout('WordpressImporter.getNextPost()', 2000);
        WordpressImporter.getNextPost();
    },
	
    // ////////////////////////////////////////////////////////////////////////

    getNextPost : function(){

        if(navigator.appName.indexOf('Microsoft') != -1) {
            window.WordpressImporter.getNextPost();
        }
        else {
            window.document.WordpressImporter.getNextPost();
        }
    },

    // ////////////////////////////////////////////////////////////////////////

    noPosts : 0,
	
    /**
     * Respond to the flash object decoding global level stuff
     * @param noItems - total number of items (posts, pages, etc.)
     * @param noPosts - just the number of posts
     */
    onMeta : function(noItems, noPosts, tags, categories){

        WordpressImporter.noPosts = noItems;

        // Add tags
        var paras = {cmd: 'addTags', site_id: DataStore.m_siteID, csvtags: tags};
        $.ajax({url: MediaAPI.m_url, dataType: "json", data: paras});

        // Add categories
        var paras = {cmd: 'addCategories', site_id: DataStore.m_siteID, csvcats: categories};
        $.ajax({url: MediaAPI.m_url, dataType: "json", data: paras});
				
        // Start getting posts
        WordpressImporter.getNextPost();
    },
	
    // ////////////////////////////////////////////////////////////////////////

    onFileSelected : function(name, size, type){
        WordpressImporter.onMessage(name + " " + size + "kb " + type);
    },

    onProgress : function(bytes, total){

        // Update progress
        var prog = Math.ceil(100 * bytes / total);
        if (bytes < total){
            $("#status").html("Reading file...");
        }
        else {
            $("#status").html("Starting processing...");
        }
		
        //$("#progressBar").progressbar({ value: prog });
    },

    onLoaded : function(content){
        $('#fileContents').html(content);
    },

    // ////////////////////////////////////////////////////////////////////////

    onComplete : function(){
        //$('#apollo_dialog').dialog('destroy');
        $('#status').html("<span style='color:green'>Complete! Refresh the browser to see the changes.</span>");
    },
		
    // ////////////////////////////////////////////////////////////////////////

    onMessage : function(msg){
        //$('#status').html(msg);
    },

    onError : function(msg){
        $('#status').html("<span style='color:red'>"+msg+"</span>");
        Logger.error(msg);
    }
	
    // ////////////////////////////////////////////////////////////////////////
	
}