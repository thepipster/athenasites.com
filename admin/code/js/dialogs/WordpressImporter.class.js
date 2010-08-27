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
				height:220, 
				resizable:false, 
				title: 'Import a WordPress blog' });
		
		// Progress bar.....
		
		$("#progressBar").progressbar({ value: 0 });
		
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

	postCt : 0,
	
	/**
	* Respond to the flash player extracting a post
	* post: title, date, date_gmt, can_comment, password, author, tags, categories, content, excerpt
	* comment: id, author, author_email, author_url, author_ip, date, date_gmt, content, approved, parent_id
	*/
	onPost : function(postJSONString, commentsJSONString){
	
		WordpressImporter.postCt++;
			
		try {	
		
			//var post = eval('(' + postJSONString + ')');
			var post = $.parseJSON( postJSONString );
			var comments = $.parseJSON( commentsJSONString );

			var paras = {cmd: 'importPost', 
						site_id: DataStore.m_siteID, 
						title: post.title, 
						content: unescape(post.content), 
						status: post.status, 
						can_comment: post.can_comment, 
						created_date: post.date_gmt, 
						import_source:'wordpress'
						};
			
			if (WordpressImporter.postCt == 10){
			/*
				$.ajax({
					url: MediaAPI.m_url,
					dataType: "json",
					data: paras,
					success: function(ret){WordpressImporter.onPostAdded(ret)}
				});	
			*/
			}				
	
			
			for (var i=0; i<comments.length; i++){
				var id = comments[i].id;
				WordpressImporter.onMessage("    >> Comment: id= " + id+"");
			}
				
		}	
		catch(err){
			Logger.error(err.toString());
		}

		// Update progress
		var prog = Math.ceil(100 * WordpressImporter.postCt / WordpressImporter.noPosts);		
		$("#status").html("Processed post " + WordpressImporter.postCt + " of " + WordpressImporter.noPosts);						
		$("#progressBar").progressbar({ value: prog });	
							
	},


	onPostAdded : function(ret){
											
		if (ret.result == "ok"){		
			callback(ret.data.post);			
		}					
		else {
			AthenaDialog.showAjaxError(ret);
		}		
	},
	
	// ////////////////////////////////////////////////////////////////////////

	noPosts : 0,
	
	/**
	* Respond to the flash object decoding global level stuff
	*/
	onMeta : function(noPosts, tags, categories){

		WordpressImporter.noPosts = noPosts;		

		//alert('TBD: add tags/categories');
		WordpressImporter.onMessage("Number Posts: " + noPosts);
		WordpressImporter.onMessage("Tags: " + tags);
		WordpressImporter.onMessage("Categories: " + categories);
	},
	
	// ////////////////////////////////////////////////////////////////////////

	onFileSelected : function(name, size, type){
		WordpressImporter.onMessage(name + " " + size + "kb " + type);	
	},

	onProgress : function(bytes, total){

		// Update progress
		var prog = Math.ceil(100 * bytes / total);
		$("#status").html("Reading file...");						
		$("#progressBar").progressbar({ value: prog });						
	},

	onLoaded : function(content){
		$('#fileContents').html(content);
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