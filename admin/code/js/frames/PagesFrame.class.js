/**
*
* 
* @since 27th July, 2010
*/
var PagesFrame = {

    pageObj : false,

    // ////////////////////////////////////////////////////////////////////////////

    init : function(){
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    repaint : function(){
				
        if (DataStore.m_pageList.length == 0){
            AthenaDialog.backgroundMessage("You currently have no pages, you can add a post using the side-bar");
            return;
        }
				
		//oUtil.obj.onKeyPress = PagesFrame.onContentKeyPress;
        var pageObj = DataStore.getCurrentPage();
        PagesFrame.repaintData(pageObj);								
    },

    // ////////////////////////////////////////////////////////////////////////////

    repaintData : function(pageObj){
				
		if (pageObj.status != 'Published'){
			$('#pageTitleWrapper').html("<input id='pageTitle' type='text' value='"+pageObj.title+"' class='apolloDataInput'/>");
			$('#pageTitle').typing({ stop: ssMain.onDataChange, delay: 400});
		}
		else {
			var txt = "<span id='pageTitleDisplay'>" +pageObj.title + "</span>";
			txt += "<button class='basic_button' onclick='PagesFrame.onToggleTitle()' title='Allows you to edit the title of a page that has already been published.'>Edit Title</button>";
			$('#pageTitleWrapper').html(txt);
		}
		
		//$('#pageTitle').html(pageObj.title);

//        $('#pageTitle').val(pageObj.title);
		
        // Set prev content so we don't autosave before content actually changes
        Pages.m_prevContent = '';

		// Paint editor....
        oUtil.obj.css = DataStore.m_theme.cms_page_css;
        Pages.setContent(pageObj.content);
        
        //$('#pageContentEditor').html(pageObj.content);
        $('#pageBrowserTitle').val(pageObj.browser_title)
        $('#pageSlug').html(pageObj.slug);
        $('#pageLastEdit').html(pageObj.last_edit);
        $('#pageCreated').html(pageObj.created);		
        $('#pageStatusSelector').val(pageObj.status);
        $('#pageParent').val(pageObj.parent_page_id);
        $('#pageTemplate').val(pageObj.template);
        $('#pageOrder').val(pageObj.page_order);
        $('#pageDesc').val(pageObj.description);

        txt = "<select id='pageTemplate' onchange=\"PagesFrame.onChange(); PagesFrame.paintThemeParas();\">";
        for (var i=0; i<DataStore.m_templateList.length; i++){
            if (DataStore.m_templateList[i].template_file == pageObj.template){
                txt += "<option value='"+DataStore.m_templateList[i].template_file+"' selected>"+DataStore.m_templateList[i].template_name+"</option>";
            }
            else {
                txt += "<option value='"+DataStore.m_templateList[i].template_file+"'>"+DataStore.m_templateList[i].template_name+"</option>";
            }
        }
        txt += "</select>";
        
        $('#pageTemplateWrapper').html(txt);

        //PagesFrame.updateStatusColor();
				
        // Paint the parent pages...
        PagesFrame.paintParentPages(pageObj);
					
        PagesFrame.paintThemeParas();
        
        // Update page link
        PagesFrame.updateViewPageLink(pageObj.url);
    },
		
    // ////////////////////////////////////////////////////////////////////////////

	updateViewPageLink : function(url){
		$('#pageLink').attr('href', url);
	},
			
    // ////////////////////////////////////////////////////////////////////////////
	
    updateStatusColor : function(){
				
        var status = $('#pageStatusSelector').val();
		
        $('#pageStatusSelector').removeClass('status_draft');
        $('#pageStatusSelector').removeClass('status_private');
        $('#pageStatusSelector').removeClass('status_public');
		
        switch (status){
            case 'Draft':
                $('#pageStatusSelector').addClass('status_draft');
                break;
            case 'Private':
                $('#pageStatusSelector').addClass('status_private');
                break;
            case 'Published':
                $('#pageStatusSelector').addClass('status_public');
                break;
        }
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    /**
    * Paint any special theme paras associated with the chosen template
    */
    paintThemeParas : function(){	
        var templateName = $('#pageTemplate').val();
        var txt = PagesFrame.getThemeParasHTML(templateName, 0);
        if (txt != ""){
        	txt = "<p><strong>Custom Parameters</strong></p>" + txt;
        }
        $('#apollo_page_theme_paras').html(txt);
    },

    // ////////////////////////////////////////////////////////////////////////////

    m_themeParaID : 0,
	
    selectColorPara : function(themeParaID, paraVal){
        PagesFrame.m_themeParaID = themeParaID;
        ColorPickerDialog.show('#apollo_color_picker', paraVal, PagesFrame.onParaSelected)
    },
	
    selectImagePara : function(themeParaID){
        PagesFrame.m_themeParaID = themeParaID;
        ImagePickerDialog.show('#apollo_image_picker', PagesFrame.onParaSelected)
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    onParaSelected : function(newParaVal){
        var page_id = DataStore.m_currentPageID;        
        PagesAPI.setPagePara(PagesFrame.m_themeParaID, newParaVal, page_id, PagesFrame.onPagesParaChanged);
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    onPagesParaChanged : function(theme_para_id, new_value, page_id){
        
        //alert("Theme:" + theme_para_id + " Val:" + new_value + "Page ID:" + page_id);
        
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
        PagesFrame.repaint();
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
	
	                    onclick = "PagesFrame.selectImagePara("+theme_para_list[i].id+")";
	
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
	
	                    onclick = "PagesFrame.selectColorPara("+theme_para_list[i].id+", '"+paraVal+"')";
	
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

	                case 'gallery':

	                    txt += "        <span class='paraTitle'>"+theme_para_list[i].description+"</span>";
	                    txt += "        <span class='paraDesc'>"+theme_para_list[i].help_text+"</span>";

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
	
    /**
	* Paint the parent pages. Do not allow a user to select a parent page that is itself or
	* one of its own children 
	*/
    paintParentPages : function(pageObj){
	
        var page_id = DataStore.m_currentPageID;
		
        var txt = '';
        txt += "<select id='pageParent' onchange=\"PagesFrame.onChange()\">";
        txt += "    <option value='0'>(none)</selected>";
		
        for (var i=0; i<DataStore.m_pageList.length; i++){
			
            var isChild = DataStore.isChildOff(page_id, DataStore.m_pageList[i].id);
            //var isChild = false;
			
            if (DataStore.m_pageList[i].id != pageObj.id && !isChild){
                if (DataStore.m_pageList[i].id == pageObj.parent_page_id){
                    txt += "    <option value='"+DataStore.m_pageList[i].id+"' selected>"+DataStore.m_pageList[i].title+"</selected>";
                }
                else {
                    txt += "    <option value='"+DataStore.m_pageList[i].id+"'>"+DataStore.m_pageList[i].title+"</selected>";
                }
            }
        }
        txt += "</select>";
		
        $('#parentPageContents').html(txt);
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    /**
	* Delete the page!
	*/
    onDeletePage : function(){
        AthenaDialog.confirm("Are you sure you want to delete this page?", function(){
            PagesFrame.onDoDelete();
        });
    },
	
    onDoDelete : function(){
        PagesAPI.deletePage(ssMain.siteID, DataStore.m_currentPageID, PagesFrame.onPageDeleted);
    },
	
    onPageDeleted : function(page_id){
        DataStore.deletePage(page_id);
        if (DataStore.m_pageList.length > 0){
            DataStore.m_currentPageID = DataStore.m_pageList[0].id;
        }
        else {
            DataStore.m_currentPageID = 0;
        }
        PagesFrame.repaint();
        PagesSidebarFrame.repaint();
    },
		
    // ////////////////////////////////////////////////////////////////////////////

	/**
	* Called whenever any page information is changed
	*/	
	onChange : function(callback){

		//Logger.error('onchange!');

        var page_id = DataStore.m_currentPageID;			
        var originalPage = DataStore.getPage(page_id);
        var parent_id = $('#pageParent').val();
		        
        var pageDepth = DataStore.getPageDepth(DataStore.m_currentPageID);
			
        // Check what the new max depth would be.....
		
        // Need to get the root page for this branch
		
        var old_parent_id = originalPage.parent_page_id;
        originalPage.parent_page_id = parent_id;
        DataStore.updatePage(originalPage);
		
        try {
            //var newDepth = DataStore.getPageDepth(rootPage.id);
            var newDepth = DataStore.getMaxDepth();
        }
        catch (e){
            var newDepth = 99;
        }
		
        // Revert the original back
        originalPage.parent_page_id = old_parent_id;
        DataStore.updatePage(originalPage);
				
        if ((originalPage.parent_page_id != parent_id) && (newDepth > DataStore.m_theme.max_page_depth)){
            AthenaDialog.alert("Sorry, your theme does not support page depths of more than " +  DataStore.m_theme.max_page_depth + ", please choose another parent page!");
            return;
        }
        
        // Update the page..
        //originalPage.slug = AthenaUtils.encodeSlug(originalPage.title);
        var new_content 		= oUtil.obj.getHTMLBody();		
        var new_title 			= $('#pageTitle').val() || $('#pageTitleDisplay').html();
        var new_browser_title 	= $('#pageBrowserTitle').val();        
        var new_status 			= $('#pageStatusSelector').val();
        var new_parent_page_id 	= $('#pageParent').val();
        var new_template 		= $('#pageTemplate').val();
        var new_page_order 		= $('#pageOrder').val();
        var new_description 	= $('#pageDesc').val();        
                
        /*        
        if (originalPage.content != new_content) alert('new content');
		if (originalPage.title != new_title) alert('new title');
		if (originalPage.browser_title != new_browser_title) alert('new browser title');
		if (originalPage.status != new_status) alert('new status');
		if (originalPage.parent_page_id!= new_parent_page_id) alert('new parent page'); 
		if (originalPage.template != new_template) alert('new template');  
		if (originalPage.page_order != new_page_order) alert('new order');
		if (originalPage.description != new_description) alert('new description');		
        */
        
		// Check for changes, and only save if we detect a change
		if ((originalPage.content 		!= new_content) || 
			(originalPage.title 		!= new_title) ||  
			(originalPage.browser_title != new_browser_title) ||  
			(originalPage.status 		!= new_status) || 
			(originalPage.parent_page_id!= new_parent_page_id) ||  
			(originalPage.template 		!= new_template) ||  
			(originalPage.page_order 	!= new_page_order) ||  
			(originalPage.description 	!= new_description)){			

	        originalPage.content = new_content;		
	        originalPage.title = new_title;
	        originalPage.browser_title = new_browser_title;        
	        originalPage.status = new_status;
	        originalPage.parent_page_id = new_parent_page_id;
	        originalPage.template = new_template;
	        originalPage.page_order = new_page_order;
	        originalPage.description = new_description;        

		    // Force an immediate save
		    DataStore.updatePage(originalPage);
		    DataStore.save();
		}
		                        
	    // Repaint side-bar
        PagesSidebarFrame.repaint();                       	
	},
	
	m_contentChangedTO : '',
	
	/**
	* Called whenever is key is pressed in the content editor. We want to wait until the user has stopped
	* typing before we submit changes
	*/
	onContentKeyPress : function(){
				
		if (PagesFrame.m_contentChangedTO != ''){
			// Still typing, so clear timeout and reset
			clearTimeout(PagesFrame.m_contentChangedTO);
		}
		
		PagesFrame.m_contentChangedTO = setTimeout(PagesFrame.onChange, 500);
	},
	
    // ////////////////////////////////////////////////////////////////////////////

    /**
	* Save all the users changes to the site
	*/
	/*
    onSavePage : function(){
			
        var page_id = DataStore.m_currentPageID;
			
        originalPage = DataStore.getPage(page_id);
		
        var content = oUtil.obj.getXHTMLBody();
		
        var title = $('#pageTitle').val();
        var status = $('#pageStatusSelector').val();
        var parent_id = $('#pageParent').val();
        var template = $('#pageTemplate').val();
        var order = $('#pageOrder').val();
        var desc = $('#pageDesc').val();
        
        var pageDepth = DataStore.getPageDepth(DataStore.m_currentPageID);
        var slug = AthenaUtils.encodeSlug(title);
        //var path = DataStore.getPagePath();
        var ishome = 0;
			
        // Check what the new max depth would be.....
		
        // Need to get the root page for this branch
		
        var old_parent_id = originalPage.parent_page_id;
        originalPage.parent_page_id = parent_id;
        DataStore.updatePage(originalPage);
		
        try {
            //var newDepth = DataStore.getPageDepth(rootPage.id);
            var newDepth = DataStore.getMaxDepth();
        }
        catch (e){
            var newDepth = 99;
        }
		
        // Revert the original back
        originalPage.parent_page_id = old_parent_id;
        DataStore.updatePage(originalPage);
				
        if ((originalPage.parent_page_id != parent_id) && (newDepth > DataStore.m_theme.max_page_depth)){
            AthenaDialog.alert("Sorry, your theme does not support page depths of more than 3, please choose another parent page!");
            return;
        }
						
        PagesAPI.updatePage(ssMain.siteID, DataStore.m_currentPageID, title, content, status, template, parent_id, slug, order, desc, PagesFrame.onPageSaved)
				
    },
	
    onPageSaved : function(pageObj){
        DataStore.updatePage(pageObj);
        PagesFrame.repaint();
        PagesSidebarFrame.repaint();
    },
*/

	onToggleTitle : function(){			
		var title = $('#pageTitleDisplay').html();
		AthenaDialog.confirm("As this page has been published, if you change the page title you will change the page's URL which can have a bad effect on the SEO for this page. This is really only an issue for pages that have been live for a while.<br/> <br/>By clicking ok, you will be able to edit the title and it will be saved automatically.", 
			function(){
				$('#pageTitleWrapper').html("<input id='pageTitle' type='text' value='"+title+"' class='apolloDataInput'/>");
				$('#pageTitle').typing({ stop: ssMain.onDataChange, delay: 400});
			}
			);	
	},
	
    // ////////////////////////////////////////////////////////////////////////////

    saveChildPages : function(){
    }
			
    // ////////////////////////////////////////////////////////////////////////////
}