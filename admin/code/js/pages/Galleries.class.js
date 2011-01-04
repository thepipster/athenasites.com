/* 
 * Galleries Page functionality
 *
 * @author Mike Pritchard (mike@apollosites.com)
 * @since 3rd January, 2011
 */
var Galleries = {

    // ////////////////////////////////////////////////////////////////////////

    init : function(siteID){
                
        $('#GalleriesFrame').show();
                
        // Initialize the remote API's
        MediaAPI.init();
        GalleryAPI.init();

        // Setup the data store for the site
        DataStore.init(siteID);

        // Setup classes...
        GalleriesFrame.init();
        SidebarFrame.init();

        // Start loading data
        DataStore.load(Galleries.onDataLoaded);
        
    },

    // ////////////////////////////////////////////////////////////////////////

    onDataLoaded : function(){

        if (DataStore.m_currentFolderID > 0){
            FolderSidebarFrame.onSelectFolder(DataStore.m_currentFolderID);
        }
        else {
            if (DataStore.m_currentFolderID == -1 && DataStore.m_folderList.length > 0){
                FolderSidebarFrame.onSelectFolder(DataStore.m_folderList[0].id);
            }
            else {
                FolderSidebarFrame.onSelectFolder(1); // unassigned folders
            }
        }

        GalleriesFrame.repaint();
        SidebarFrame.repaint();
    }
	
    // ////////////////////////////////////////////////////////////////////////
}

