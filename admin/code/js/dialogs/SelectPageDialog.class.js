/*
 * Dialog for selecting a page
 *
 * @author Mike Pritchard (mike@apollosites.com)
 */
var SelectPageDialog = {

    // ////////////////////////////////////////////////////////////////////////

	show : function(){

        var txt = "";
        txt += "<div id='apolloSelectPage'>";
		
		// Check to see if we already have a home page or blog page
		var homePageObj = DataStore.getHomePage();
		var blogPageObj = DataStore.getBlogPage();
		
        for (var i=0; i<DataStore.m_templateList.length; i++){
        
        	var name = DataStore.m_templateList[i].template_name;
        	var desc = DataStore.m_templateList[i].template_description;
        	var file = DataStore.m_templateList[i].template_file;
        	var thumb = DataStore.m_templateList[i].thumbnail;
        	var isHomePage = DataStore.m_templateList[i].is_homepage;
        	var isBlogPage = DataStore.m_templateList[i].is_blogpage;

			if ((!isBlogPage && !isHomePage) || (isBlogPage && !blogPageObj) || (isHomePage && !homePageObj)) {
						
        	var onclick = "SelectPageDialog.onSelectPage("+isHomePage+", "+isBlogPage+", '"+name+"', '"+file+"')";
        	
            txt += "<table class='templateTable' border='0'>";
            txt += "<tr valign='top'>";
            txt += "    <td width='55px'>";

        	txt += "    <img class='templateThumbBox' src='" + thumb + "' onclick=\""+onclick+"\"  />";
        	
	        //txt += "<img src='"+image_url+"' class='thumbBox' width='30px' height='30px' onclick=\""+onclick+"\" >";
            txt += "    </td>";

            txt += "    <td>";
            txt += "        <span class='templateTitle'>"+name+"</span>";
            txt += "        <span class='templateDesc'>"+desc+"</span>";
            //txt += "        <button class='save_button' onclick=\""+onclick+"\" style='font-size:10px'>Change</button>";
            txt += "    </td>";
            txt += "</tr>";
            txt += "</table>";
            
			}
            
	                            	
        }

        txt += "</div>";

		// Create dialog.......
				
        $('#apollo_dialog').html(txt);
        
        $('#apollo_dialog').dialog( 'destroy' );
        $('#apollo_dialog').dialog({
            modal: false,
            width:650,
            height: 'auto',
            resizable:false,
            buttons: {
                Cancel: function() {
                    $(this).dialog('close');
                }
            },
            title: 'Select a page type'});
			
	},
	
    // ////////////////////////////////////////////////////////////////////////

	onSelectPage : function(isHomePage, isBlogPage, templateName, templateFileName){

		// (siteID, pageTitle, pageContent, pageStatus, templateName, parentPageID, pageSlug, pageOrder, isHome, isBlog, callback)
		
        var title = 'New ' + templateName  + ' ' + (DataStore.m_pageList.length+1);
        var pageSlug = AthenaUtils.encodeSlug(title);
        var order = 0;
        PagesAPI.addPage(ssMain.siteID, title, '', 'Draft', templateFileName, 0, pageSlug, order, isHomePage, isBlogPage, PagesSidebarFrame.onPageAdded);
        $('#apollo_dialog').dialog( 'close' );
	
	}	
	
 }