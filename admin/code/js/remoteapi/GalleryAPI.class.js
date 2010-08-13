/**
* Allows access to the remote (Ajax) Athena Gallery API
* 
* @author Mike Pritchard (mike@apollosites.com)
* @since 13th August, 2010
*/
var GalleryAPI = {
	
	/** Command url */
	m_url : '/code/php/remoteapi/GalleryAPI.php',
							
	// ////////////////////////////////////////////////////////////////////////
	
	/**
	* Initialize the API
	*/
	init : function(){		
		GalleryAPI.m_url = defines.root_url + GalleryAPI.m_url;
	},
			
	// ////////////////////////////////////////////////////////////////////////

	/**
	* Get the list of folders and media for this site
	*/
	getAll : function(siteID, callback){
	
		AthenaDialog.showLoading("Loading gallery data");
		
		var paras = {cmd : 'getAll', site_id: siteID};

		$.ajax({
			url: GalleryAPI.m_url,
			dataType: "json",
			data: paras,
			success: function(ret){GalleryAPI.onGotAll(ret, callback);}
		});			
		
	},
			
	/**
	* Check the response from the server, and load data if login is good
	*/
	onGotAll : function(ret, callback){
		
		AthenaDialog.clearLoading();
		
		if (ret.result == 'ok'){	
			callback(ret.data.gallery_images, ret.data.gallery_meta);
		}
		else {
			AthenaDialog.showAjaxError(ret);
		}
	}
	
}
    