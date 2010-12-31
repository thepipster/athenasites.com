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
			
		//alert('SidebarFrame.repaint() mode = ' + SidebarFrame.m_mode);
		
        switch(ssMain.view){
			
            case ssMain.VIEW_DASHBOARD :
            case ssMain.VIEW_SETTINGS :
            case ssMain.VIEW_ACCOUNT :
                $('#SideBar').html("");
                SidebarFrame.m_mode = '';
                break;
			
            case ssMain.VIEW_POSTS :
                if (SidebarFrame.m_mode != 'Posts'){
                    $('#SideBar').html("");
                    SidebarFrame.m_mode = 'Posts';
                    SidebarFrame.paintPosts();
                }
                break;
				
            case ssMain.VIEW_GALLERIES :
                if (SidebarFrame.m_mode != 'Galleries'){
                    $('#SideBar').html("");
                    SidebarFrame.m_mode = 'Galleries';
                    SidebarFrame.paintGalleries();
                    SidebarFrame.paintFolders();
                }
                break;
			
            case ssMain.VIEW_PAGES :
                if (SidebarFrame.m_mode != 'Pages'){
                    $('#SideBar').html("");
                    SidebarFrame.m_mode = 'Pages';
                    SidebarFrame.paintPages();
                }
                break;
			
            case ssMain.VIEW_STATS :
                if (SidebarFrame.m_mode != 'Stats'){
                    $('#SideBar').html("");
                    SidebarFrame.m_mode = 'Stats';
                    SidebarFrame.paintStatsSidebar();
                }
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

    getHeader : function(){
        return "<span class='spacer'></span>";
    },
    
    // ////////////////////////////////////////////////////////////////////////////

    paintPosts : function(){
        
        var txt = SidebarFrame.getHeader();
        txt += "<p>Blog Posts<span class='add_new_project' onclick='PostsSidebarFrame.addPost()' title='Add a new blank post to you blog.'>&nbsp;(add)</span></p>";
        txt += "<div id='SideBar_Posts'></div>";
		
        $('#SideBar').append(txt);

        PostsSidebarFrame.paint('#SideBar_Posts');
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    paintGalleries : function(){
        
        var txt = SidebarFrame.getHeader();
        txt += "<p>Pages with Galleries</p>";
        txt += "<div id='SideBar_Pages'></div>";
		
        $('#SideBar').append(txt);

        GalleriesSidebarFrame.paint('#SideBar_Pages');
		
    },

    // ////////////////////////////////////////////////////////////////////////////

	paintStatsSidebar : function(){

        var txt = SidebarFrame.getHeader();
        txt += "<p>Pages<span class='add_new_project' onclick='PagesSidebarFrame.addPage()' title='Add a new blank page to you site.'>&nbsp;(add)</span></p>";
        txt += "<div id='SideBar_Pages'></div>";
		
        $('#SideBar').append(txt);

        StatsSidebarFrame.paint('#SideBar_Pages');

	},
	
    // ////////////////////////////////////////////////////////////////////////////
	
    paintPages : function(){

        var txt = SidebarFrame.getHeader();
        txt += "<p>Pages<span class='add_new_project' onclick='PagesSidebarFrame.addPage()' title='Add a new blank page to you site.'>&nbsp;(add)</span></p>";
        txt += "<div id='SideBar_Pages'></div>";
		
        $('#SideBar').append(txt);

        PagesSidebarFrame.paint('#SideBar_Pages');
		
    },
		
    // ////////////////////////////////////////////////////////////////////////////
	
	m_folderTagMode : true,
	
	showTags : function(){ 
		SidebarFrame.m_mode = '';
		SidebarFrame.m_folderTagMode = true;
		SidebarFrame.repaint();
	},
	
	showFolders : function(){ 
		SidebarFrame.m_mode = '';
		SidebarFrame.m_folderTagMode = false;
		SidebarFrame.repaint();
	},
	
    paintFolders : function(){
			
        var txt = SidebarFrame.getHeader();
		
		if (!SidebarFrame.m_folderTagMode){	
	        txt += "<p>Folders";
	        
	        //txt += " <span class='add_new_project' onclick='SidebarFrame.showTags()' title=''>&nbsp;(view tags)</span>";
	        txt += " <span class='add_new_project' onclick='FolderSidebarFrame.addFolder()' title='Add a new folder to help organize your images and other media files'>&nbsp;(add)</span>";
	        
	        //txt += " <img src='images/button_plus4_small.png'  class='folder_view_change_icon' height='16px' onclick='FolderSidebarFrame.addFolder()' title='Add a new folder to help organize your images and other media files' />";
	        //txt += " <img src='images/tag_icon_blue.png'  class='folder_view_change_icon' height='16px' onclick='SidebarFrame.showTags()' title='View your media tags' />";
	        
	        txt += "</p>";
	        txt += "<div id='SideBar_Folders'></div>";						
	        $('#SideBar').append(txt);
	        FolderSidebarFrame.paint('#SideBar_Folders');
		}
		else {
	        txt += "<p>Tags";
	        //txt += " <img class='folder_view_change_icon' src='images/folder_small.png' onclick='SidebarFrame.showFolders()' title='View your folders' />";
	        txt += "</p>";			
	        txt += "<div id='SideBar_Folders'></div>";						
	        $('#SideBar').append(txt);
	        TagsSidebarFrame.paint('#SideBar_Folders');
      	}
		
		
    }
	
}