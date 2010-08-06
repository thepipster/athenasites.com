/**
* Store all current data
*
* @since 28th July, 2010
* @author (mike@apollosites.com)
*/
var DataStore = {

	m_currentFolderID : 1, // folder id of 1 is considered 'unassigned'
	
	/** Currently selected site id (if the user has more than 1 site!) */
	m_siteID : 0,
	
	/** List of folders for the site */
	m_folderList : '',

	/** List of media for the site */
	m_mediaList : '',
	
	// //////////////////////////////////////////////////////////////////////////////////
	
	init : function(){
		
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

	save : function(){
	},
				
	// //////////////////////////////////////////////////////////////////////////////////

	m_dataLoadedCallback : '',
	
	load : function(callback){
		DataStore.m_dataLoadedCallback = callback;
		MediaAPI.getFolders(DataStore.m_siteID, DataStore.onGotFolders);
		MediaAPI.getMedia(DataStore.m_siteID, DataStore.onGotMedia);
	},
	
	// //////////////////////////////////////////////////////////////////////////////////

	onGotFolders : function(folder_list){
		DataStore.folderList = folder_list;
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
		
		// Call the callback
		DataStore.m_dataLoadedCallback();
	}
		
}