/**
*
* 
* @since 27th July, 2010
*/
var SidebarFrame = {

	m_mode : '',
	
	FOLDER_ID_ALL : 0, // hard-coded folder id for all images
	FOLDER_ID_UNASSIGNED : 1, // hard-coded folder id for unassigned images
	FOLDER_ID_LAST_24_HOURS : 2, // hard-coded folder id for images uploaded in last 24 hrs
	FOLDER_ID_LAST_7_DAYS : 3, // hard-coded folder id for images uploaded in last 7 days
	FOLDER_ID_LAST_1_HOUR : 4, // hard-coded folder id for images uploaded in last 1 hrs
	
	// ////////////////////////////////////////////////////////////////////////////
	
	init : function(){
	
	},
	
	// ////////////////////////////////////////////////////////////////////////////
	
	repaint : function(){
						
		switch(ssMain.view){
			
			case ssMain.VIEW_DASHBOARD : 
				$('#SideBar').html("");
				SidebarFrame.m_mode = '';
				break;

			case ssMain.VIEW_PAGES : 
				$('#SideBar').html("");
				SidebarFrame.m_mode = '';
				break;

			case ssMain.VIEW_POSTS : 
				$('#SideBar').html("");
				SidebarFrame.m_mode = '';
				break;

			case ssMain.VIEW_SETTINGS : 
				$('#SideBar').html("");
				SidebarFrame.m_mode = '';
				break;

			case ssMain.VIEW_STATS : 
				$('#SideBar').html("");
				SidebarFrame.m_mode = '';
				break;

			case ssMain.VIEW_ACCOUNT : 
				$('#SideBar').html("");
				SidebarFrame.m_mode = '';
				break;

			case ssMain.VIEW_GALLERIES : 
				$('#SideBar').html("");
				SidebarFrame.m_mode = '';
				break;
			
			case ssMain.VIEW_FILES : 
			case ssMain.VIEW_EDITFILES : 
				if (SidebarFrame.m_mode != 'Folders'){
					$('#SideBar').html("");
					SidebarFrame.m_mode = 'Folders';
					SidebarFrame.paintFolders();				
				}
				break;
		}
		
	},
	
	// ////////////////////////////////////////////////////////////////////////////
	
	paintFolders : function(){
		
		var txt = "";
		txt += "<p>Folders<span class='add_new_project' onclick='FolderSidebarFrame.addFolder()' title='Add a new folder to help organize your images and other media files'>&nbsp;(add)</span></p>";		
		txt += "<div id='SideBar_Folders'></div>";
		
		$('#SideBar').hide();
		$('#SideBar').html(txt);

		FolderSidebarFrame.paint('#SideBar_Folders');
		
		$('#SideBar').fadeIn('slow');
		
		
	}
	
}