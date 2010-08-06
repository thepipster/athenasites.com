/**
* Allows access to the remote (Ajax) Athena System API
* 
* @author Mike Pritchard (mike@apollosites.com)
* @since 27th, July 2010
*/
var MediaAPI = {
	
	/** Command url */
	m_url : '/code/php/remoteapi/MediaAPI.php',
							
	// ////////////////////////////////////////////////////////////////////////
	
	/**
	* Initialize the API
	*/
	init : function(){		
		MediaAPI.m_url = defines.root_url + MediaAPI.m_url;
	},
			
	// ////////////////////////////////////////////////////////////////////////
	
	/**
	* Get the list of folders for this site
	*/
	getFolders : function(siteID, callback){
	
		AthenaDialog.showLoading();
		
		var paras = {cmd : 'getFolders', site_id: siteID};

		$.ajax({
			url: MediaAPI.m_url,
			dataType: "json",
			data: paras,
			success: function(ret){MediaAPI.onGotFolders(ret, callback);}
		});			
		
	},
		
	// ////////////////////////////////////////////////////////////////////////
	
	/**
	* Check the response from the server, and load data if login is good
	*/
	onGotFolders : function(ret, callback){
		
		AthenaDialog.clearLoading();
		
		if (ret.result == 'ok'){	
			if (ret.data == 'true'){
				callback(ret.data);
			}
			else {
				callback(ret.data);
			}
		}
		else {
			AthenaDialog.showAjaxError(ret);
		}
	},
	
	// ////////////////////////////////////////////////////////////////////////
	
	/**
	* Get the list of media for this site
	*/	
	getMedia : function(siteID, callback){
		
		AthenaDialog.showLoading();
		
		var paras = {cmd : 'getMedia', site_id: siteID};

		$.ajax({
			url: MediaAPI.m_url,
			dataType: "json",
			success: function(ret){MediaAPI.onGotMedia(ret, callback);},
			data: paras
		});
	},	
			
	onGotMedia : function(ret, callback){

		AthenaDialog.clearLoading();
		
		if (ret.result == 'ok'){	
			if (ret.data == 'true'){
				callback(ret.data);
			}
			else {
				callback(ret.data);
			}
		}
		else {
			AthenaDialog.showAjaxError(ret);
		}
        
   	},	
   	
	// ////////////////////////////////////////////////////////////////////////
	
	/**
	* Get the list of media for this site
	*/	
	saveMediaInfo : function(siteID, mediaTitle, mediaDesc, mediaTags, callback){
		
		AthenaDialog.showLoading();
		
		var paras = {cmd : 'saveMediaInfo', site_id: siteID, title: mediaTitle, desc: mediaDesc, tags: mediaTags};

		$.ajax({
			url: MediaAPI.m_url,
			dataType: "json",
			success: function(ret){MediaAPI.onMediaInfoSaved(ret, callback);},
			data: paras
		});
	},	
			
	onMediaInfoSaved : function(ret, callback){

		AthenaDialog.clearLoading();
		
		if (ret.result == 'ok'){	
			if (ret.data == 'true'){
				callback(ret.data);
			}
			else {
				callback(ret.data);
			}
		}
		else {
			AthenaDialog.showAjaxError(ret);
		}
        
   	}   					
}
    