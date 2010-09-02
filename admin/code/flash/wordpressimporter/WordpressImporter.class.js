/**
* Javascript interface to the Flash WordpressImporter.swf that allows the Javascript to read the contents of 
* a file from the users local file system
*
* @author Mike Pritchard (mike@apollosites.com)
* @since 22nd August, 2010
*/
var WordpressImporter = {
	
	// ////////////////////////////////////////////////////////////////////////
	
	paint : function(targetDiv){
	
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
		
		swfobject.embedSWF(flash_url, targetDiv, "80", "22", "10.0.0","expressInstall.swf", flashvars, params, attributes);
/*
		var w = 80;
		var h = 22;
		
		var text = "";
		text += "   <div style=''> \n";
		text += "      <object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0' width='"+w+"' height='"+h+"' id='flashObject' align='middle'> \n";
		text += "         <param name='allowScriptAccess' value='sameDomain' /> \n";
		text += "         <param name='movie' value='"+flash_url+"' /> \n";
		text += "         <param name='quality' value='high' /> \n";
		text += "         <param name='bgcolor' value='#ffffff' /> \n";
		text += "         <embed src='"+flash_url+"' quality='high' bgcolor='#ffffff' width='"+w+"' height='"+h+"' name='flashObject' align='middle' allowScriptAccess='sameDomain' type='application/x-shockwave-flash' pluginspage='http://www.macromedia.com/go/getflashplayer' /> \n";
		text += "      </object> \n";
		text += "   </div>	 \n";		
		
		$(targetDiv).html(text);		
		
		if(navigator.appName.indexOf('Microsoft') != -1) {
			WordpressImporter.flash = window.flashObject;
		}
		else {
			WordpressImporter.flash = window.document.flashObject;
		}		
		*/
		
	},

	// ////////////////////////////////////////////////////////////////////////

	ct : 0,
	
	/**
	* Respond to the flash player extracting a post
	* {title:postTitle, date:postDate, date_gmt:postDateGMT, can_comment:canComment, password: postPassword, author: postCreator, tags: postTags, categories: postCategories, content: postContent, excerpt: postExcerpt}
	* comment: id, author, author_email, author_url, author_ip, date, date_gmt, content, approved, parent_id
	*/
	onPost : function(postJSONString, commentsJSONString){
	
		WordpressImporter.ct++;
		if (WordpressImporter.ct == 14){
	//		alert(postJSONString);
		}
		
		try {
			//var postObj = $.parseJSON( WordpressImporter.stripslashes(postJSONString) );
			var postObj = $.parseJSON( postJSONString );
			var commentsObj = $.parseJSON( commentsJSONString );
			//var postObj = eval('(' + postJSONString + ')');

			//alert(postObj);
			WordpressImporter.onMessage("Post Title: " + postObj.title + " Tags: " + postObj.tags + " No Comments: " + commentsObj.length);
			//for (var i=0; i<postObj.comments.length; i++){
			//	var id = postObj.comments[i].id;
			//	WordpressImporter.onMessage("    >> Comment: id= " + id+"");
			//}

		}	
		catch(err){
//			alert(WordpressImporter.ct);
			WordpressImporter.onError(err.toString());
		}
		
	},

	// ////////////////////////////////////////////////////////////////////////

	/**
	* Respond to the flash object decoding global level stuff
	*/
	onMeta : function(noPosts, tags, categories){
		WordpressImporter.onMessage("Number Posts: " + noPosts);
		WordpressImporter.onMessage("Tags: " + tags);
		WordpressImporter.onMessage("Categories: " + categories);
	},
	
	// ////////////////////////////////////////////////////////////////////////

	onFileSelected : function(name, size, type){
		WordpressImporter.onMessage(name + " " + size + "kb " + type);	
	},

	onProgress : function(bytes, total){
		WordpressImporter.onMessage(bytes + " / " + total);	
	},

	onLoaded : function(content){
		$('#fileContents').html(content);
	},
	
	// ////////////////////////////////////////////////////////////////////////

	onMessage : function(msg){
		$('#msg').append(msg + "<br>");
	},

	onError : function(msg){
		$('#msg').append("<span style='color:red'>"+msg + "</span><br>");
	},
	
	// ////////////////////////////////////////////////////////////////////////
	
	stripslashes : function(str) {
	    return (str+'').replace(/\\(.?)/g, function (s, n1) {
	        switch (n1) {
	            case '\\':
	                return '\\';
	            case '0':
	                return '\u0000';
	            case '':
	                return '';
	            default:
	                return n1;
	        }
   		 });   	 
	}	
}