/**
* Settings frame
* 
* @since 24th November, 2010
*/
var SettingsFrame = {

    // ////////////////////////////////////////////////////////////////////////////

	init : function(){
	},
	
    // ////////////////////////////////////////////////////////////////////////////

	repaint : function(){
		SettingsFrame.paintSiteParas();
	},
	
    // ////////////////////////////////////////////////////////////////////////////
    
    paintSiteParas : function(){
        var txt = SettingsFrame.getThemeParasHTML('all', 0);
        if (txt != ""){
			//txt = "<p><strong>Custom Parameters</strong></p>" + txt;
	        $('#apollo_site_settings_site_custom_paras').html(txt);   	
        } 
    },
    
    // ////////////////////////////////////////////////////////////////////////////

	/**
	* Launch a popup dialog that allows users to import blog posts from external sources,
	* such as Wordpress, LiveJournal etc.
	*/
    onPaintPostImporter : function(){

        var txt = "";

        txt += "<p>This tool allows you to import blog posts, comments and followers from other blogging engines.</p>";
        txt += "<p>To get started, click on the button below that corresponds to the blog you want to import from.</p>";
        txt += "<br/>";
        txt += "<div align='center'>";
        txt += "    <button class='basic_button' onclick='WordpressImporter.show()'>Wordpress</button>";
        txt += "    <button class='basic_button' onclick='BloggerImporter.show()'>Blogger</button>";
        txt += "    <button class='basic_button' onclick='LiveJournalImporter.show()'>LiveJournal</button>";
        txt += "</div>"
        txt += "<br/>";
        txt += "<p>If you need to import from a blog engine not listed above, email us at <a href='mailto:support@apollosites.com?subject=Feature request: New blog import&body=It would be really awesome if you supported imports from my old blog, which is at xxxxx'>support@apollosites.com</a> and we'll try to add that blogging engine to the list as soon as we can!</p>";

        //AthenaDialog.alert(txt, "Import Posts");


        $('#apollo_dialog').dialog("destroy");

        $('#apollo_dialog').html(txt);

        $('#apollo_dialog').dialog({
            resizable: false,
            width: 400,
            //	height:140,
            modal: true,
            title: "Import Posts",
            buttons: {
                Cancel: function() {
                    $(this).dialog('close');
                }
            }
        });

    },
        
    // ////////////////////////////////////////////////////////////////////////////
        
    /**
     * Get the html for editing the theme paras for the given template name.
     * If you set the template name to 'All' it will return the global paras
     * @param string templateName
     */
    getThemeParasHTML : function(templateName, blogParas){
        
        var theme_para_list = DataStore.getPageThemeParas(templateName);

        var txt = "";
        var noParas = 0;

        for (var i=0; i<theme_para_list.length; i++){

			if ((blogParas == 1 && theme_para_list[i].is_blog_para == 1) || (blogParas == 0 && theme_para_list[i].is_blog_para == 0)){
			
	            var pageID = DataStore.m_currentPageID;
	            if (templateName == 'all'){
	                pageID = 0;
	            }
	            var paraVal = DataStore.getSiteParaValue(pageID, theme_para_list[i].id);
	
	            // 'email','image','gallery','font-family','favicon','font-size','color','text','small-int','multi-gallery'
	            switch(theme_para_list[i].para_type){
	
	                case 'favicon':
	                case 'image':
	
	                    onclick = "SettingsFrame.selectImagePara("+theme_para_list[i].id+")";
	
	                    txt += "<table border='0'>";
	                    txt += "<tr valign='top'>";
	                    txt += "    <td width='40px'>";
	                    var image_url = '';
	                    if (paraVal){
	                        var image = DataStore.getImage(parseInt(paraVal));
	                        if (image){
	                            image_url = image.thumb_url
	                            }
	                    }
	                    txt += "<img src='"+image_url+"' class='thumbBox' width='30px' height='30px' onclick=\""+onclick+"\" >";
	                    txt += "    </td>";
	
	                    txt += "    <td>";
	                    txt += "        <span class='paraTitle'>"+theme_para_list[i].description+"</span>";
	                    txt += "        <span class='paraDesc'>"+theme_para_list[i].help_text+"</span>";
	                    //txt += "        <button class='save_button' onclick=\""+onclick+"\" style='font-size:10px'>Change</button>";
	                    txt += "    </td>";
	                    txt += "</tr>";
	                    txt += "</table>";
	
	                    noParas++;
	
	                    break;
	
	                case 'color':
	
	                    onclick = "SettingsFrame.selectColorPara("+theme_para_list[i].id+", '"+paraVal+"')";
	
	                    txt += "<table border='0'>";
	                    txt += "<tr valign='top'>";
	                    txt += "    <td width='40px'>";
	                    txt += "        <div class='colorBox' style='background-color:#"+paraVal+";' onclick=\""+onclick+"\"></div>";
	                    txt += "    </td>";
	
	                    txt += "    <td>";
	                    txt += "        <span class='paraTitle'>"+theme_para_list[i].description+"</span>";
	                    txt += "        <span class='paraDesc'>"+theme_para_list[i].help_text+"</span>";
	                    txt += "    </td>";
	                    txt += "</tr>";
	                    txt += "</table>";
	
	                    noParas++;
	
	                    break;
	
	                case 'email':
	                    break;
	
	                case 'text':
	                    break;
	
	                case 'small-int':
	                    break;
	
	                case 'font-family':
	                    break;
	
	                case 'font-size':
	                    break;
	
	                case 'multi-gallery':
	                case 'gallery':
	                    break;
	            }

			} 

        }

        if (noParas > 0){            
            txt = "<table border='0' width='100%'>" + txt + "</table><br/>";
        }

        return txt;

    },
    
    // ////////////////////////////////////////////////////////////////////////////

    m_themeParaID : 0,
	
    selectColorPara : function(themeParaID, paraVal){
        SettingsFrame.m_themeParaID = themeParaID;
        ColorPickerDialog.show('#PagesFrameColorPicker', paraVal, SettingsFrame.onParaSelected)
    },
	
    // ////////////////////////////////////////////////////////////////////////////
	
    selectImagePara : function(themeParaID){
        SettingsFrame.m_themeParaID = themeParaID;
        ImagePickerDialog.show('#PagesFrameImagePicker', SettingsFrame.onParaSelected)
    },    
	
  	// ////////////////////////////////////////////////////////////////////////////

    onParaSelected : function(newParaVal){
        page_id = 0;
        MediaAPI.setPagePara(SettingsFrame.m_themeParaID, newParaVal, page_id, SettingsFrame.onPagesParaChanged);
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    onPagesParaChanged : function(theme_para_id, new_value, page_id){
                
        //location.href = location.href;
        DataStore.updateSitePara(theme_para_id, page_id, new_value);

        // Update para in data store
        var paraFound = false;
        for (var i=0; i<DataStore.m_siteParaList.length; i++){
            if (DataStore.m_siteParaList[i].theme_para_id == theme_para_id){
                DataStore.m_siteParaList[i].para_value = new_value;
                paraFound = true;
            }
        }

        // If we didn't find the para, it must be a new para (that wasn't set before)
        if (!paraFound){
            var temp = new Object();
            temp.theme_para_id = theme_para_id;
            temp.para_value = new_value;
            temp.page_id = page_id;
            DataStore.m_siteParaList.push(temp);
        }

        // Now repaint...
	    SettingsFrame.repaint();
/*
        switch(ssMain.view){

            case ssMain.VIEW_PAGES :
	            PagesFrame.repaint();
            	break;
            case ssMain.VIEW_SETTINGS: 
	            SettingsFrame.repaint();
            	break; 
        }        
 */

    }	
}