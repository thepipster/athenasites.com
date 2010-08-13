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
	* Get the list of folders and media for this site
	*/
	getAll : function(siteID, callback){
	
		AthenaDialog.showLoading("Loading media data");
		
		var paras = {cmd : 'getAll', site_id: siteID};

		$.ajax({
			url: MediaAPI.m_url,
			dataType: "json",
			data: paras,
			success: function(ret){MediaAPI.onGotAll(ret, callback);}
		});			
		
	},
			
	/**
	* Check the response from the server, and load data if login is good
	*/
	onGotAll : function(ret, callback){
		
		AthenaDialog.clearLoading();
		
		if (ret.result == 'ok'){	
			callback(ret.data.folders, ret.data.media, ret.data.pages, ret.data.theme, ret.data.page_templates, ret.data.theme_paras, ret.data.page_paras);
		}
		else {
			AthenaDialog.showAjaxError(ret);
		}
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
			
	/**
	* Check the response from the server, and load data if login is good
	*/
	onGotFolders : function(ret, callback){
		
		AthenaDialog.clearLoading();
		
		if (ret.result == 'ok'){	
			callback(ret.data);
		}
		else {
			AthenaDialog.showAjaxError(ret);
		}
	},
	
	// ////////////////////////////////////////////////////////////////////////
	
	setPagePara : function(themeParaID, paraValue, callback){
			
		var paras = {cmd: 'setPagePara', site_id: DataStore.m_siteID, page_id: DataStore.m_currentPageID, theme_para_id: themeParaID, para_value: paraValue};
												
		jQuery.ajax({
			url: MediaAPI.m_url,
			dataType: "json",
			data: paras,
			success: function(ret){MediaAPI.onPageParaSet(ret, callback);}
		});	
	},

	onPageParaSet : function(ret, callback){
		if (ret.result == "ok"){		
			callback(ret.data.theme_para_id, ret.data.new_value, ret.data.page_id);			
		}					
		else {
			AthenaDialog.showAjaxError(ret);
		}
	},	
	
	// ////////////////////////////////////////////////////////////////////////
	
	setGlobalPara : function(themeParaID, paraValue, callback){
	
		var paras = {cmd: 'setGlobalPara', site_id: DataStore.m_siteID, theme_para_id: themeParaID, para_value: paraValue};

		jQuery.ajax({
			url: MediaAPI.m_url,
			dataType: "json",
			data: paras,
			success: function(ret){MediaAPI.onGlobalParaSet(ret, callback);}
		});	
	},

	onGlobalParaSet : function(ret, callback){
		if (ret.result == "ok"){		
			callback(ret.data.theme_para_id, ret.data.new_value);			
		}					
		else {
			AthenaDialog.showAjaxError(ret);
		}
	},		
	
	// ////////////////////////////////////////////////////////////////////////

	updatePage : function(siteID, pageID, pageTitle, pageContent, pageStatus, templateName, parentPageID, pageSlug, pageOrder, isHome, callback){
		
		AthenaDialog.showLoading("Updating page");
		
		var paras = {cmd: 'updatePage', site_id: siteID, page_id: pageID, title: pageTitle, content: pageContent, status: pageStatus, template_id: templateName, 
				parent_page_id: parentPageID, slug: pageSlug, ishome: isHome, order: pageOrder};
				
		$.ajax({
			url: MediaAPI.m_url,
			dataType: "json",
			data: paras,
			success: function(ret){MediaAPI.onPageAdded(ret, callback)}
		});	
	},

	addPage : function(siteID, pageTitle, pageContent, pageStatus, templateName, parentPageID, pageSlug, pageOrder, isHome, callback){
		
		AthenaDialog.showLoading("Adding page");
		
		var paras = {cmd: 'addPage', site_id: siteID, title: pageTitle, content: pageContent, status: pageStatus, 
				template_id: templateName, parent_page_id: parentPageID, slug: pageSlug, ishome: isHome, order: pageOrder};
				
		$.ajax({
			url: MediaAPI.m_url,
			dataType: "json",
			data: paras,
			success: function(ret){MediaAPI.onPageAdded(ret, callback)}
		});	
	},
	
	onPageAdded : function(ret, callback){
			
		AthenaDialog.clearLoading();
								
		if (ret.result == "ok"){		
			callback(ret.data.page);			
		}					
		else {
			AthenaDialog.showAjaxError(ret);
		}		
	},

	// ////////////////////////////////////////////////////////////////////////

	deletePage : function(siteID, pageID, callback){

		AthenaDialog.showLoading("Deleting page");

		var paras = {cmd: 'deletePage', site_id: siteID, page_id: pageID};
				
		$.ajax({
			url: MediaAPI.m_url,
			dataType: "json",
			data: paras,
			success: function(ret){MediaAPI.onPageDeleted(ret, callback)}
		});	
	},
	
	onPageDeleted : function(ret, callback){

		AthenaDialog.clearLoading();

		if (ret.result == "ok"){		
			callback(ret.data.page_id);			
		}					
		else {
			AthenaDialog.showAjaxError(ret);
		}	
	},
		
	// ////////////////////////////////////////////////////////////////////////
	
	addFolder : function(siteID, folderName, callback){

		AthenaDialog.showLoading("Adding folder");

		if (folderName == undefined){
			folderName = 'new folder';
		}
		
		var paras = {cmd: 'addFolder', site_id: siteID, folder_name: folderName};
												
		$.ajax({
			url: MediaAPI.m_url,
			dataType: "json",
			data: paras,
			success: function(ret){MediaAPI.onAddedFolder(ret, callback)}
		});	
	},
	
	onAddedFolder : function(ret, callback){
		
		AthenaDialog.clearLoading();
								
		if (ret.result == "ok"){		
			callback(ret.data.name, ret.data.id);			
		}					
		else {
			AthenaDialog.showAjaxError(ret);
		}		
	},

	// ////////////////////////////////////////////////////////////////////////
		
	renameFolder : function(siteID, folderID, newName, callback){
				
		var paras = {cmd: 'renameFolder', site_id: siteID, folder_id: folderID, folder_name: newName};
												
		$.ajax({
			url: MediaAPI.m_url,
			dataType: "json",
			data: paras,
			success: function(ret){MediaAPI.onRenamedFolder(ret, callback)}
		});	
	},
	
	onRenamedFolder : function(ret, callback){								
		if (ret.result == "ok"){
			callback(ret.data.id, ret.data.name);			
		}					
		else {
			AthenaDialog.showAjaxError(ret);
		}		
	},

	// ////////////////////////////////////////////////////////////////////////
		
	addMediaToFolder : function(siteID, mediaID, folderID, callback){
		
		var paras = {cmd: 'addMediaToFolder', site_id: siteID, folder_id: folderID, media_id: mediaID};
												
		$.ajax({
			url: MediaAPI.m_url,
			dataType: "json",
			data: paras,
			success: function(ret){MediaAPI.onMediaAddedToFolder(ret, callback)}
		});	
	},
	
	onMediaAddedToFolder : function(ret, callback){								
		if (ret.result == "ok"){
			callback(ret.data.folder_id, ret.data.media_id);			
		}					
		else {
			AthenaDialog.showAjaxError(ret);
		}		
	},

	// ////////////////////////////////////////////////////////////////////////
	
	/**
	* Delete a folder, any media assigned to that folder will be considered 'unassigned' so 
	* it is not deleted!
	*/
	deleteFolder : function(siteID, folderID, callback){
		
		var paras = {cmd: 'deleteFolder', site_id: siteID, folder_id: folderID};
												
		$.ajax({
			url: MediaAPI.m_url,
			dataType: "json",
			data: paras,
			success: function(ret){MediaAPI.onDeletedFolder(ret, callback)}
		});	
	},
	
	onDeletedFolder : function(ret, callback){
		if (ret.result == "ok"){
			callback(ret.data.id);			
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
    