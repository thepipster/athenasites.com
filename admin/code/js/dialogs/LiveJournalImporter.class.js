/**
* Javascript interface to the Flash LiveJournalImporter.swf that allows the Javascript to read the contents of 
* a file from the users local file system
*
* @author Mike Pritchard (mike@apollosites.com)
* @since 3rd September, 2010
*/
var LiveJournalImporter = {
	
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
		txt += "        <legend>Controls</legend>";
		txt += "        <table border='0' width='100%'>";
		txt += "            <tr>";
		txt += "                <td><span class='label' id=''>Livejournal Username</span></td>";
		txt += "                <td><input type='text' id='ljuser' name='ljuser' value='charlottegeary'></td>";
		txt += "            </tr>";
		txt += "            <tr>";
		txt += "                <td><span class='label' id=''>Livejournal Password</span></td>";
		txt += "                <td><input type='password' id='ljpass' name='ljpass' value='r00bies'></td>";
		txt += "            </tr>";
		txt += "        </table>";
		txt += "        <button onclick='LiveJournalImporter.startImport()'>Start Import</button>";
		txt += "    </fieldset>";
		txt += "</div>";
		
		$('#apollo_dialog').html(txt);							
		$('#apollo_dialog').dialog( 'destroy' );
		$('#apollo_dialog').dialog({
				modal: true, 
				width:385, 
				height:260, 
				resizable:false, 
				title: 'Import your LiveJournal blog' });
		
		// Progress bar.....
		
		$("#progressBar").progressbar({ value: 0 });
		
	},

	// ////////////////////////////////////////////////////////////////////////

	startImport : function(){
		
		var paras = {cmd: 'importLJ', 
					site_id: DataStore.m_siteID, 
					us: $('#ljuser').val(), 
					ps: $('#ljpass').val()};
								
		$.ajax({
			url: MediaAPI.m_url,
			type: 'post',
			dataType: "json",
			success: function(ret){LiveJournalImporter.onPostAdded(ret)},
			data: paras
		});	
				
	},
	
	// ////////////////////////////////////////////////////////////////////////

	postCt : 0,	
	comments : '',
	
	/**
	* Respond to the flash player extracting a post
	* post: title, date, date_gmt, can_comment, password, author, tags, categories, content, excerpt
	* comment: id, author, author_email, author_url, author_ip, date, date_gmt, content, approved, parent_id
	*/
	onPost : function(postJSONString, commentsJSONString){
				
		try {	
		
			//var post = eval('(' + postJSONString + ')');
			var post = $.parseJSON( postJSONString );
			var comments = $.parseJSON( commentsJSONString );

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
						import_source:'wordpress'
						};
									
			$.ajax({
				url: MediaAPI.m_url,
				type: 'post',
				dataType: "json",
				success: function(ret){LiveJournalImporter.onPostAdded(ret)},
				data: paras
			});	
	
			// Store comments until we have the post id
			LiveJournalImporter.comments = comments;			
				
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
				
		// Update progress
		LiveJournalImporter.postCt++;
		var prog = Math.ceil(100 * LiveJournalImporter.postCt / LiveJournalImporter.noPosts);		
		$("#status").html("Processed post " + LiveJournalImporter.postCt + " of " + LiveJournalImporter.noPosts);						
		$("#progressBar").progressbar({ value: prog });	

		// Add comments....	
		
		if (LiveJournalImporter.comments.length > 0){
		
			var paras = {cmd: 'importComments', 
						site_id: DataStore.m_siteID, 
						pid: post_id, 
						com: $.toJSON(LiveJournalImporter.comments),
						ims: 'wordpress'
						};
						
			$.ajax({url: MediaAPI.m_url, type: 'post', dataType: "json", data: paras});	
						
		}
	
		// Get the next post, but give a small pause!		
		LiveJournalImporter.getNextPost();
	},
	
	// ////////////////////////////////////////////////////////////////////////

	getNextPost : function(){
		if(navigator.appName.indexOf('Microsoft') != -1) {
			window.LiveJournalImporter.getNextPost();
		}
		else {
			window.document.LiveJournalImporter.getNextPost();
		}
	},

	// ////////////////////////////////////////////////////////////////////////

	noPosts : 0,
	
	/**
	* Respond to the flash object decoding global level stuff
	*/
	onMeta : function(noPosts, tags, categories){

		LiveJournalImporter.noPosts = noPosts;		

		// Add tags
		var paras = {cmd: 'addTags', site_id: DataStore.m_siteID, csvtags: tags};		
		$.ajax({ url: MediaAPI.m_url, dataType: "json", data: paras });	

		// Add categories
		var paras = {cmd: 'addCategories', site_id: DataStore.m_siteID, csvcats: categories};		
		$.ajax({ url: MediaAPI.m_url, dataType: "json", data: paras });	
				
		// Start getting posts
		LiveJournalImporter.getNextPost();		
	},
	
	// ////////////////////////////////////////////////////////////////////////

	onFileSelected : function(name, size, type){
		LiveJournalImporter.onMessage(name + " " + size + "kb " + type);	
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
		alert('done');
	},
		
	// ////////////////////////////////////////////////////////////////////////

	onMessage : function(msg){
		//$('#status').html(msg);
	},

	onError : function(msg){
		$('#status').html("<span style='color:red'>"+msg+"</span>");
	}
	
	// ////////////////////////////////////////////////////////////////////////
	
}