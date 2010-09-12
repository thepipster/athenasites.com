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
            AthenaDialog.alert("You currently have no pages, you can add a post using the side-bar");
            return;
        }

        var pageObj = DataStore.getCurrentPage();
        PagesFrame.repaintData(pageObj);
								
    },

    // ////////////////////////////////////////////////////////////////////////////

    repaintData : function(pageObj){

         $('#postSettings').hide();
         $('#pageSettings').show();

        oUtil.obj.css = DataStore.m_theme.cms_page_css;
        oUtil.obj.loadHTML(pageObj.content);

        //$('#pageContentEditor').html(pageObj.content);
        $('#pageTitle').val(pageObj.title);
        $('#pageSlug').html(pageObj.slug);
        $('#pageLastEdit').html(pageObj.last_edit);
        $('#pageCreated').html(pageObj.created);
		
        $('#pageStatusSelector').val(pageObj.status);
        $('#pageParent').val(pageObj.parent_page_id);
        $('#pageTemplate').val(pageObj.template);
        $('#pageOrder').val(pageObj.order);

        var txt = "<select id='pageTemplate' onchange=\"PagesFrame.paintThemeParas()\">";
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
        PagesFrame.updatePageLink(pageObj);
						
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    updatePageLink : function(pageObj){
        $('#pageLink').html("View Page");
        $('#pageLink').attr('href', 'http://' + defines.domain + pageObj.path + pageObj.slug);
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
	
        var template_name = $('#pageTemplate').val();
        var theme_para_list = DataStore.getPageThemeParas(template_name);
				
        var txt = "";

        if (theme_para_list.length > 0){
            txt += "<p><strong>Custom Parameters</strong></p>";
            txt += "<table border='0' width='100%'>";
        }
	
        var noParas = 0;
			
        for (var i=0; i<theme_para_list.length; i++){
			
            var paraVal = DataStore.getSiteParaValue(DataStore.m_currentPageID, theme_para_list[i].id);
            var para_html = '';
				
										
            // 'email','image','gallery','font-family','favicon','font-size','color','text','small-int','multi-gallery'
            switch(theme_para_list[i].para_type){
			
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
				
                case 'favicon':
                case 'multi-gallery':
                case 'gallery':
                    break;
            }


        }
		
        if (theme_para_list.length > 0){
            txt += "</table><br/>";
        }
		
        if (noParas > 0)
            $('#apollo_page_theme_paras').html(txt);
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    m_themeParaID : 0,
	
    selectColorPara : function(themeParaID, paraVal){
        PagesFrame.m_themeParaID = themeParaID;
        ColorPickerDialog.show('#PagesFrameImagePicker', paraVal, PagesFrame.onParaSelected)
    },
	
    selectImagePara : function(themeParaID){
        PagesFrame.m_themeParaID = themeParaID;
        ImagePickerDialog.show('#PagesFrameImagePicker', PagesFrame.onParaSelected)
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    onParaSelected : function(newParaVal){
        MediaAPI.setPagePara(PagesFrame.m_themeParaID, newParaVal, PagesFrame.onPagesParaChanged);
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    onPagesParaChanged : function(theme_para_id, new_value, page_id){
        //location.href = location.href;
        DataStore.updateSitePara(theme_para_id, page_id, new_value);
        PagesFrame.repaint();
    },
	
    // ////////////////////////////////////////////////////////////////////////////
	
    /**
	* Paint the parent pages. Do not allow a user to select a parent page that is itself or
	* one of its own children 
	*/
    paintParentPages : function(pageObj){
	
        var page_id = DataStore.m_currentPageID;
		
        var txt = '';
        txt += "<select id='pageParent' >";
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
        MediaAPI.deletePage(DataStore.m_siteID, DataStore.m_currentPageID, PagesFrame.onPageDeleted);
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
	* Save all the users changes to the site
	*/
    onSavePage : function(){
			
        var page_id = DataStore.m_currentPageID;
			
        var originalPage = DataStore.getPage(page_id);
		
        var content = PagesFrame.m_editor.getXHTMLBody();
		
        var title = $('#pageTitle').val();
        var status = $('#pageStatusSelector').val();
        var parent_id = $('#pageParent').val();
        var template = $('#pageTemplate').val();
        var order = $('#pageOrder').val();
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
						
        MediaAPI.updatePage(DataStore.m_siteID, DataStore.m_currentPageID, title, content, status, template, parent_id, slug, order, ishome, PagesFrame.onPageSaved)
				
    },
	
    onPageSaved : function(pageObj){
        DataStore.updatePage(pageObj);
        PagesFrame.repaint();
        PagesSidebarFrame.repaint();
    },

    // ////////////////////////////////////////////////////////////////////////////

    saveChildPages : function(){
    },
				
   // ////////////////////////////////////////////////////////////////////////////

//    paintOpenWYSIWYG : function(readyCallback){
//
//        var ht = $('#PagesFrame').innerHeight();
//
//        var groupsObj = [
//        ["grpPage", "Page & View", ["FullScreen", "XHTMLSource", "Search", "BRK", "Undo", "Redo", "SpellCheck", "RemoveFormat"]],
//        ["grpFont", "Font",
//        ["FontName", "FontSize", "Strikethrough", "Superscript", "Subscript", "BRK",
//        "Bold", "Italic", "Underline", "ForeColor", "BackColor"
//        ]
//        ],
//        ["grpStyles", "Styles", ["Table", "Guidelines", "BRK",  "StyleAndFormatting", "Styles"]], //"Absolute"
//        ["grpPara", "Paragraph",
//        ["Paragraph", "Indent", "Outdent", "LTR", "RTL", "BRK", "JustifyLeft",
//        "JustifyCenter", "JustifyRight","JustifyFull", "Numbering", "Bullets"
//        ]
//        ],
//        ["grpObjects", "Objects", ["Image", "InsertInternalImage", "Flash", "Media", "BRK", "Hyperlink", "Characters", "Line",  "ApolloPageBreak"]]
//        ];
//
//        oUtil.initializeEditor("#pageContentEditor", {
//            id: 2,
//            width:"100%",
//            height:ht+"px",
//            btnSpellCheck:true,
//            useTagSelector:false,
//            toolbarMode: 2,
//            mode:"XHTML",
//            useBR:true, // Force to use <br> for line breaks by default
//            arrCustomButtons: [
//            ["InsertInternalImage","ImagePickerDialog.show('#PagesFrameImagePicker', PagesFrame.onImageSelected)","Insert an image from your media library", "btnInternalImage.gif"],
//            ["ApolloPageBreak","PagesFrame.onInsertPageBreak()","Insert a more link into your blog post", "btnApolloPageBreak.png"]],
//            //features:featuresObj,
//            groups: groupsObj,
//            css: DataStore.m_theme.cms_page_css
//        });
//
//        PagesFrame.getEditorObj(readyCallback);
//
//    },
//
//    // ////////////////////////////////////////////////////////////////////////////
//
//    m_editor : false,
//
//    /**
//     * Get a handle to the embedded wyswig editor, and when we have it execute the callback
//     */
//    getEditorObj : function(callback){
//        if (oUtil.obj == undefined || !oUtil.obj){
//            setTimeout(function(){PagesFrame.getEditorObj(callback);}, 100);
//        }
//        else {
//            alert(oUtil.oName);
//            PagesFrame.m_editor = oUtil.obj;
//            if (callback != undefined){
//                callback();
//            }
//        }
//    },
    
    // ////////////////////////////////////////////////////////////////////////////

    onImageSelected : function(imageID){
        var img = DataStore.getImage(imageID);
        var txt = "<img src='"+img.file_url+"' alt='"+img.description+"' width='"+img.width+"px' height='"+img.height+"px'/>";
        oUtil.obj.insertHTML(txt);
    }

}