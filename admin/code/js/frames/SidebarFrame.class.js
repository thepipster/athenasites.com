/**
*
* 
* @since 27th July, 2010
*/
var SidebarFrame = {

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
		/*
		var txt = "";
		
		txt += "<p>Folders<span class='add_new_project' onclick='ssMain.onAddFolder()' title='Add a new folder to help organize your images and other media files'>&nbsp;(add)</span></p>";
		txt += "<div id='SideBar_Folders'></div>";

		txt += "<p>Pages<span class='add_new_project' onclick='ssMain.onAddPage()' title='Add a new page to your site!'>&nbsp;(add)</span></p>";
		txt += "<div id='SideBar_Pages'></div>";

		txt += "<p>Posts</p>";
		txt += "<div id='SideBar_Users'></div>";
		
		$('#SideBar').html(txt);
		*/
		
		$('#SideBar').html("");
		
		switch(ssMain.view){
			case ssMain.VIEW_DASHBOARD : break;
			case ssMain.VIEW_PAGES : break;
			case ssMain.VIEW_POSTS : break;
			case ssMain.VIEW_SETTINGS : break;
			case ssMain.VIEW_STATS : break;
			case ssMain.VIEW_ACCOUNT : break;
			case ssMain.VIEW_GALLERIES : break;
			case ssMain.VIEW_FILES : SidebarFrame.paintFolders(); break;
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