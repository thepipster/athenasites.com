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
		
        //$('#SettingsFrame').css('height','100%');	
        		
	},
	
    // ////////////////////////////////////////////////////////////////////////////
    
    paintSiteParas : function(){
        var txt = SettingsFrame.getThemeParasHTML('all', 0);
        if (txt != ""){
			//txt = "<p><strong>Custom Parameters</strong></p>" + txt;
	        $('#apollo_site_settings_custom_paras_2').html(txt);   	
        } 

        var txt = SettingsFrame.getThemeTextParasHTML('all', 0);
        if (txt != ""){
			//txt = "<p><strong>Custom Parameters</strong></p>" + txt;
	        $('#apollo_site_settings_custom_paras_1').html(txt);   	
        } 
        
		$('#apollo_site_settings_custom_paras_1 .customTextInput').typing({ stop: SettingsFrame.onSaveTextInputPara, delay: 400});
        
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
	* Update a text-input para
	*/
    onSaveTextInputPara : function(evt, obj){
        AthenaDialog.backgroundMessage("Saving new value");
    	var para_id = parseInt(obj.attr('id').substr(7));
    	//DataStore.updateSitePara(para_id, DataStore.m_currentPageID, obj.val());
        MediaAPI.setPagePara(para_id, obj.val(), 0, SettingsFrame.onTextInputParaSaved);
    },
        
    onTextInputParaSaved : function(theme_para_id, new_value, page_id){
    	// Update value in local store
        DataStore.updateSitePara(theme_para_id, page_id, new_value);
    },	
        
    // ////////////////////////////////////////////////////////////////////////////
        
    /**
     * Get the html for editing the theme paras for the given template name.
     * If you set the template name to 'All' it will return the global paras
     * @param string templateName
     */
    getThemeParasHTML : function(templateName){
        
        var theme_para_list = DataStore.getPageThemeParas(templateName);

        var txt = "";
        var noParas = 0;
	    var pageID = DataStore.m_currentPageID;	            
        
	    if (templateName == 'all') pageID = 0;

		//
		// Paint images....
		//
		
		txt += "<p><strong>Images</strong></p>";
		
        for (var i=0; i<theme_para_list.length; i++){

			var blogTxt = '';
			//if (theme_para_list[i].is_blog_para == 1) blogTxt = "<span class='blogParaIndicator'>(blog)</span>";
			
            var paraVal = DataStore.getSiteParaValue(pageID, theme_para_list[i].id);
            if (!paraVal) paraVal = "";

            switch(theme_para_list[i].para_type){

                case 'favicon':
                case 'image':
					
                    var onclick = "SettingsFrame.selectImagePara("+theme_para_list[i].id+")";
										
                    txt += "<table border='0'>";
                    txt += "<tr valign='top'>";
                    txt += "    <td width='40px'>";
                    var image_url = '/admin/images/blank.gif';
                    if (paraVal && paraVal != ''){
                        var image = DataStore.getImage(parseInt(paraVal));
                        if (image){
                            image_url = image.thumb_url
                        }
                    }
                    txt += "<img src='"+image_url+"' class='thumbBox' width='30px' height='30px' onclick=\""+onclick+"\" >";
                    txt += "    </td>";

                    txt += "    <td>";
                    txt += "        <span class='paraTitle'>"+theme_para_list[i].description+blogTxt+"</span>";
                    txt += "        <span class='paraDesc'>"+theme_para_list[i].help_text+"</span>";
                    //txt += "        <button class='save_button' onclick=\""+onclick+"\" style='font-size:10px'>Change</button>";
                    txt += "    </td>";
                    txt += "</tr>";
                    txt += "</table>";
					
                    noParas++;

                    break;
			}

        }

		//
		// Paint color pickers...
		//

		txt += "<p><strong>Colors</strong></p>";

        for (var i=0; i<theme_para_list.length; i++){
			
			var blogTxt = '';
			//if (theme_para_list[i].is_blog_para == 1) blogTxt = "<span class='blogParaIndicator'>(blog)</span>";
			
            var paraVal = DataStore.getSiteParaValue(pageID, theme_para_list[i].id);
            if (!paraVal) paraVal = "";

            switch(theme_para_list[i].para_type){
	
                case 'color':

                    var onclick = "SettingsFrame.selectColorPara("+theme_para_list[i].id+", '"+paraVal+"')";
	
					/*
                    txt += "<table border='0' width='100%'>";	                    
                    txt += "    <tr valign='top' width='100%'>";	                    
                    txt += "        <td colspan='2'><div class='paraTitle'>"+theme_para_list[i].description+"</div></td>";
                    txt += "    </tr>";	                    
                    txt += "    <tr valign='top'>";	                    
                    txt += "        <td width='40px'><div class='colorBox' style='background-color:#"+paraVal+";' onclick=\""+onclick+"\"></div></td>";
                    txt += "        <td><span class='paraDesc' style='width:95%;'>"+theme_para_list[i].help_text+"</span></td>";	                    
                    txt += "    </tr>";	                    
                    txt += "</table>";
                    */
                    
                    txt += "<table border='0'>";
                    txt += "<tr valign='top'>";
                    txt += "    <td width='40px'>";
                    txt += "        <div class='colorBox' style='background-color:#"+paraVal+";' onclick=\""+onclick+"\"></div>";
                    txt += "    </td>";	
                    txt += "    <td>";
                    txt += "        <span class='paraTitle'>"+theme_para_list[i].description+blogTxt+"</span>";
                    txt += "        <span class='paraDesc'>"+theme_para_list[i].help_text+"</span>";
                    txt += "    </td>";
                    txt += "</tr>";
                    txt += "</table>";
					
                    noParas++;

                    break;

            }

        }
		
        if (noParas > 0){            
            txt = "<table border='0' width='100%'>" + txt + "</table><br/>";
        }

        return txt;

    },
    
    // ////////////////////////////////////////////////////////////////////////////
        
    /**
     * Get the html for editing the theme paras for the given template name.
     * If you set the template name to 'All' it will return the global paras
     * @param string templateName
     */
    getThemeTextParasHTML : function(templateName){
        
        var theme_para_list = DataStore.getPageThemeParas(templateName);

        var txt = "";
        var noParas = 0;
	    var pageID = DataStore.m_currentPageID;	            
        
	    if (templateName == 'all') pageID = 0;

		//
		// Paint text and others...
		//

		txt += "<p><strong>Settings</strong></p>";

        for (var i=0; i<theme_para_list.length; i++){

			var blogTxt = '';
			//if (theme_para_list[i].is_blog_para == 1) blogTxt = "<span class='blogParaIndicator'>(blog)</span>";

            var paraVal = DataStore.getSiteParaValue(pageID, theme_para_list[i].id);
            if (!paraVal) paraVal = "";
            
            switch(theme_para_list[i].para_type){
	
                case 'email':
                    break;

                case 'text':
                	                	
                    txt += "<table border='0' style='width:100%'>";	                    
                    txt += "    <tr valign='top' rowspan='2' width='100%' style='width:100%'>";	                    
                    txt += "        <td rowspan='2' width='100px'><div class='paraTitle'>"+theme_para_list[i].description+blogTxt+"</div></td>";
                    txt += "        <td><input id='paraID_"+theme_para_list[i].id+"' value='"+paraVal+"' class='customTextInput' style='width:95%;'/></td>";
                    txt += "    </tr>";	                    
                    txt += "    <tr valign='top' width='100%' style='width:100%'>";	                    
                    txt += "        <td><span class='paraDesc' style='width:95%;'>"+theme_para_list[i].help_text+"</span></td>";	                    
                    txt += "    </tr>";	                    
                    txt += "</table>";
                    	 
                    noParas++;
                    	                
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


        if (noParas > 0){            
            txt = "<table border='0' width='100%'>" + txt + "</table><br/>";
        }

        return txt;

    },
        
    // ////////////////////////////////////////////////////////////////////////////

    m_themeParaID : 0,
	
    selectColorPara : function(themeParaID, paraVal){
        SettingsFrame.m_themeParaID = themeParaID;
        ColorPickerDialog.show('#apollo_color_picker', paraVal, SettingsFrame.onParaSelected)
    },
	
    // ////////////////////////////////////////////////////////////////////////////
	
    selectImagePara : function(themeParaID){
        SettingsFrame.m_themeParaID = themeParaID;
        ImagePickerDialog.show('#apollo_image_picker', SettingsFrame.onParaSelected)
    },    
	
  	// ////////////////////////////////////////////////////////////////////////////

    onParaSelected : function(newParaVal){
        AthenaDialog.backgroundMessage("Saving new value");
        page_id = 0;
        MediaAPI.setPagePara(SettingsFrame.m_themeParaID, newParaVal, page_id, SettingsFrame.onPagesParaChanged);
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    onPagesParaChanged : function(theme_para_id, new_value, page_id){
                
        //location.href = location.href;
        DataStore.updateSitePara(theme_para_id, page_id, new_value);

        // Now repaint...
	    SettingsFrame.repaint();

    }	
}