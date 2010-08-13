/**
* Store all current data
*
* @since 28th July, 2010
* @author (mike@apollosites.com)
*/
var DataStore = {

	m_currentFolderID : 1, // folder id of 1 is considered 'unassigned'
	
	m_currentPageID : 0,
	
	/** Currently selected site id (if the user has more than 1 site!) */
	m_siteID : 0,
	
	/** List of folders for the site with fields; id, site_id, name */
	m_folderList : '',

	/** List of media for the site */
	m_mediaList : '',

	/** List of pages for the site */
	m_pageList : '',

	/** Page template list */
	m_templateList : '',
	
	/** Theme parameter list */	
	m_themeParaList : '',
	
	/** List of parameters set for this site */
	m_siteParaList : '',
	
	/** Gallery image list */		
	m_galleryImageList : '',
	
	/** Gallery meta information */
	m_galleryMetaList : '',
		
	// //////////////////////////////////////////////////////////////////////////////////
	
	init : function(){
		
	},

	// //////////////////////////////////////////////////////////////////////////////////

	clear : function(){
		DataStore.m_folderList = '';
		DataStore.m_mediaList = '';
		DataStore.m_pageList = '';
	},
	
	// //////////////////////////////////////////////////////////////////////////////////

	getSiteParaValue : function(page_id, theme_para_id){

		for(var i=0; i<DataStore.m_siteParaList.length; i++){

 			if ((DataStore.m_siteParaList[i].theme_para_id == theme_para_id) && (DataStore.m_siteParaList[i].page_id == page_id)){
				return DataStore.m_siteParaList[i].para_value;
			}
		}
		
		return false;
	},
		
	// //////////////////////////////////////////////////////////////////////////////////

	getPageThemeParas : function(template_name){	
		var list = new Array();
		for(var i=0; i<DataStore.m_themeParaList.length; i++){
			if (DataStore.m_themeParaList[i].page_template_name == template_name){
				list.push(DataStore.m_themeParaList[i]);
			}
		}
		return list;
	},
	
	// //////////////////////////////////////////////////////////////////////////////////

	getImage : function(image_id){
	
		for(var i=0; i<DataStore.m_mediaList.length; i++){
			if (DataStore.m_mediaList[i].id == image_id){
				return DataStore.m_mediaList[i];
			}
		}
		return false;
	},
	
	// //////////////////////////////////////////////////////////////////////////////////

	/**
	* Check to see if a page can have a gallery, based on its template
	*/
	isGalleryPage : function(page_id){
	
		var page = DataStore.getPage(page_id);
		var pageParas = DataStore.getPageThemeParas(page.template);
		
		for (var i=0; i<pageParas.length; i++){
			if (pageParas[i].para_type == 'gallery'){
				return true;
			}
		}
		return false;
	},
	
	
	// //////////////////////////////////////////////////////////////////////////////////

	getPage : function(page_id){

		for(var i=0; i<DataStore.m_pageList.length; i++){
			if (DataStore.m_pageList[i].id == page_id){
				return DataStore.m_pageList[i];
			}
		}
		return false;
	},	
	
	// //////////////////////////////////////////////////////////////////////////////////

	getCurrentPage : function(){
		return DataStore.getPage(DataStore.m_currentPageID);
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	/**
	* Get the path to a page
	*/
	/*
	getPagePath : function(page_id){
		var pathObj = new Array();
		var pathObj = DataStore.buildPagePath(DataStore.m_currentPageID, pathObj);
		var txt = '/';
		for (var i=pathObj.length-1; i>=0; i--){
			txt += pathObj[i] + "/";
		}
		return txt;
	},
			
	buildPagePath : function(page_id, pathObj){
			
		var page = DataStore.getPage(page_id);
		if (page.parent_page_id == 0){
			return pathObj;
		}
		else {
			var parentPage = DataStore.getPage(page.parent_page_id);
			var path = parentPage.slug.substring(0, parentPage.slug.indexOf('.html'));
			pathObj.push(path);
			
			if (parentPage.parent_page_id == 0){
				return pathObj;
			}
			else {
				return DataStore.buildPagePath(page.parent_page_id, pathObj);
			}
		}
			
	},	
	*/
	// //////////////////////////////////////////////////////////////////////////////////
	
	getFolderName : function(folder_id){
	
		if (folder_id == FolderSidebarFrame.ID_UNASSIGNED){
			return "Unassigned";
		}
		
		for (var i=0; i<DataStore.m_folderList.length; i++){
			if (DataStore.m_folderList[i].id == folder_id){
				return DataStore.m_folderList[i].name;
			}			
		}
		
		return "? ("+folder_id+")";
	},

	// //////////////////////////////////////////////////////////////////////////////////

	/**
	* For a given page, traverse up the branch to find the root page
	*/
	getRootPage : function(page_id){
	
		var page = DataStore.getPage(page_id);
		
		//alert(page_id + ' ' + page.title + ' ' + page.parent_page_id);
		
		if (page.parent_page_id == 0){
			return page;
		}
		
		return DataStore.getRootPage(page.parent_page_id);
	},
			
	// //////////////////////////////////////////////////////////////////////////////////

	/**
	* Check to see if test_page_id is a child of page_id
	*/
	isChildOff : function(page_id, test_page_id){

		var testPage = DataStore.getPage(test_page_id);

		if (testPage.parent_page_id == 0){
			return false;
		}
		
		if (testPage.parent_page_id == page_id){
			return true;
		}
		else {
			return DataStore.isChildOff(page_id, testPage.parent_page_id);
		}

	},
	
	// //////////////////////////////////////////////////////////////////////////////////

	/**
	* Get the deepest page depth
	*/
	getMaxDepth : function(){
	
		var max_depth = 0;
		for (var i=0; i<DataStore.m_pageList.length; i++){
			var depth = DataStore.getPageDepth(DataStore.m_pageList[i].id);
			
			//alert(DataStore.m_pageList[i].title + " " + depth);
			
			if (depth > max_depth){
				max_depth = depth;
			}
		}
		
		return max_depth;
	},
	
	// //////////////////////////////////////////////////////////////////////////////////
	
	getPageDepth : function(page_id){
		
		var page = DataStore.getPage(page_id);
		if (page.parent_page_id == 0){
			return 1;
		}
		else {
			return 1 + DataStore.getPageDepth(page.parent_page_id);
		}
	},
	
	// //////////////////////////////////////////////////////////////////////////////////

	updateSitePara : function(theme_para_id, page_id, new_para_val){

		for (var i=0; i<DataStore.m_siteParaList.length; i++){
		
 			if ((DataStore.m_siteParaList[i].theme_para_id == theme_para_id) && (DataStore.m_siteParaList[i].page_id == page_id)){
 				DataStore.m_siteParaList[i].para_value = new_para_val;
 				return;
			}
					
		}
	},
	
	// //////////////////////////////////////////////////////////////////////////////////

	/**
	* Update an existing page
	*/
	updatePage : function(pageObj){
		
		for (var i=0; i<DataStore.m_pageList.length; i++){
			if (DataStore.m_pageList[i].id == pageObj.id){
			
				DataStore.m_pageList[i].id = pageObj.id;
				DataStore.m_pageList[i].title = AthenaUtils.htmlEncode(pageObj.title);
				DataStore.m_pageList[i].user_id = pageObj.user_id;
				DataStore.m_pageList[i].content = pageObj.content;
				DataStore.m_pageList[i].status = pageObj.status;
				DataStore.m_pageList[i].last_edit = pageObj.last_edit;
				DataStore.m_pageList[i].created = pageObj.created;
				DataStore.m_pageList[i].status = pageObj.status;
				DataStore.m_pageList[i].template = pageObj.template;
				DataStore.m_pageList[i].parent_page_id = pageObj.parent_page_id;
				DataStore.m_pageList[i].slug = pageObj.slug;
				DataStore.m_pageList[i].path = pageObj.path;
				DataStore.m_pageList[i].is_homepage = pageObj.is_homepage;
				DataStore.m_pageList[i].order = pageObj.page_order;		
								
				return;
			}
		}
	},
	
	// //////////////////////////////////////////////////////////////////////////////////

	deletePage : function(page_id){
	
		var tempList = new Array();
		
		for(var i=0; i<DataStore.m_pageList.length; i++){
			if (DataStore.m_pageList[i].id != page_id){
				tempList.push(DataStore.m_pageList[i]);
			}
		}
		
		DataStore.m_pageList = tempList;
			
	},
	
	// //////////////////////////////////////////////////////////////////////////////////

	/**
	* Add a page from a returned page object from the MediaAPI
	*/
	addPage : function(pageObj){
	
		var temp = new Object();
		temp.id = pageObj.id;
		temp.title = AthenaUtils.htmlEncode(pageObj.title);
		temp.user_id = pageObj.user_id;
		temp.content = pageObj.content;
		temp.status = pageObj.status;
		temp.last_edit = pageObj.last_edit;
		temp.created = pageObj.created;
		temp.status = pageObj.status;
		temp.template = pageObj.template;
		temp.parent_page_id = pageObj.parent_page_id;
		temp.slug = pageObj.slug;
		temp.path = pageObj.path;
		temp.is_homepage = pageObj.is_homepage;
		temp.order = pageObj.page_order;
						
		DataStore.m_pageList.push(temp);
	},
		
	// //////////////////////////////////////////////////////////////////////////////////

	save : function(){
	},
				
	// //////////////////////////////////////////////////////////////////////////////////
	
	load : function(callback){
	
		GalleryAPI.getAll(DataStore.m_siteID, function(gallery_images, gallery_meta){DataStore.onGotGalleryData(gallery_images, gallery_meta);});
		
		MediaAPI.getAll(DataStore.m_siteID, function(folders, media, pages, theme, page_templates, theme_paras, page_paras){ 
			DataStore.onGotData(folders, media, pages, theme, page_templates, theme_paras, page_paras, callback);
		});
	},
	
	// //////////////////////////////////////////////////////////////////////////////////
	
	onGotGalleryData : function(gallery_images, gallery_meta){
		DataStore.m_galleryImageList = gallery_images;
		DataStore.m_galleryMetaList = gallery_meta;
		
		if (DataStore.m_galleryImageList == undefined) DataStore.DataStore.m_galleryImageList = new Array();
		if (DataStore.m_galleryMetaList == undefined) DataStore.m_galleryMetaList = new Array();		
	},
	
	// //////////////////////////////////////////////////////////////////////////////////

	onGotData : function(folder_list, media_list, page_list, theme, page_templates, theme_paras, paga_paras, callback){

		DataStore.onGotFolders(folder_list);
		DataStore.onGotMedia(media_list);
		DataStore.onGotPages(page_list);
		DataStore.onGotPageTemplates(page_templates);
		//DataStore.onGotThemeParas(theme_paras);

		DataStore.m_siteParaList = paga_paras;
		DataStore.m_themeParaList = theme_paras;
		DataStore.m_theme = theme; // id, theme_name, theme_title, price, thumb_url, description, is_private, max_page_depth

		if (DataStore.m_themeParaList == undefined) DataStore.m_themeParaList = new Array();
		if (DataStore.m_siteParaList == undefined) DataStore.m_siteParaList = new Array();

		callback();
	},

	// //////////////////////////////////////////////////////////////////////////////////
	/*
	onGotThemeParas : function(theme_paras){

		if (!theme_paras || theme_paras == undefined){
			DataStore.m_themeParaList = new Array();			
			return;
		}
		
		DataStore.m_themeParaList = new Array();
				
		for(var i=0; i<theme_paras.length; i++){			
			
			var temp = new Object();
			temp.template_name = page_templates[i].template_name;
			temp.template_description = page_templates[i].template_description;
			temp.template_file = page_templates[i].template_file;
			
			DataStore.m_themeParaList[i] = temp;			

		}	
		
	},
	*/			
	// //////////////////////////////////////////////////////////////////////////////////

	onGotPageTemplates : function(page_templates){

		if (!page_templates || page_templates == undefined){
			DataStore.m_templateList = new Array();			
			return;
		}
		
		DataStore.m_templateList = new Array();
				
		for(var i=0; i<page_templates.length; i++){			
			
			var temp = new Object();
			temp.template_name = page_templates[i].template_name;
			temp.template_description = page_templates[i].template_description;
			temp.template_file = page_templates[i].template_file;
			
			DataStore.m_templateList[i] = temp;			

		}	
		
	},
	
	// //////////////////////////////////////////////////////////////////////////////////

	onGotPages : function(page_list){

		if (!page_list || page_list == undefined){
			DataStore.m_pageList = new Array();			
			return;
		}
		
		DataStore.m_pageList = new Array();
				
		for(var i=0; i<page_list.length; i++){			
			
			DataStore.addPage(page_list[i]);

		}	
		
		if (page_list.length > 0 && DataStore.m_currentPageID == 0){
			DataStore.m_currentPageID = page_list[0].id;
		} 
	},
	
	// //////////////////////////////////////////////////////////////////////////////////

	onGotFolders : function(folder_list){
		
		if (!folder_list || folder_list == undefined){
			DataStore.m_folderList = new Array();			
			return;
		}
		
		DataStore.m_folderList = new Array(folder_list.length);
				
		for(var i=0; i<folder_list.length; i++){			
			
			var temp = new Object();
			temp.id = folder_list[i].id;
			temp.name = folder_list[i].name;
			
			if (i == 0){
				//alert(temp.id + " " + temp.name);
			}
			
			DataStore.m_folderList[i] = temp;
			
		}		
	},
	
	// //////////////////////////////////////////////////////////////////////////////////
	
	onGotMedia : function(media_list){
		
		if (!media_list || media_list == undefined){
			DataStore.m_mediaList = new Array();			
			return;
		}
		
		DataStore.m_mediaList = new Array(media_list.length);
				
		for(var i=0; i<media_list.length; i++){			
			
			var files_root = defines.user_files_root_url + DataStore.m_siteID + "/";
			var temp = new Object();
			
			temp.thumb_url = files_root + media_list[i].thumb_filename;
			temp.file_url = files_root + media_list[i].filename;
			temp.mime_type = media_list[i].mime_type;
			temp.title = media_list[i].title;
			temp.description = media_list[i].description;
			temp.tags = media_list[i].tags;
			temp.width = media_list[i].width;
			temp.height = media_list[i].height;
			temp.thumb_width = media_list[i].thumb_width;
			temp.thumb_height = media_list[i].thumb_height;
			temp.id = media_list[i].id;
			temp.date_added = media_list[i].created;
			temp.folder_id = media_list[i].folder_id;
			
			if (i == 0){
				//alert(temp.thumb_url);
			}
			
			DataStore.m_mediaList[i] = temp;
		}
		
	}
		
}