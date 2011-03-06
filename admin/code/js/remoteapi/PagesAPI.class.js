/**
* Allows access to the remote (Ajax) Athena System API
* 
* @author Mike Pritchard (mike@apollosites.com)
* @since 27th, July 2010
*/
var PagesAPI = {
	
    /** Command url */
    m_url : '/code/php/remoteapi/PagesAPI.php',
							
    // ////////////////////////////////////////////////////////////////////////
	
    /**
    * Initialize the API
    */
    init : function(){
        PagesAPI.m_url = defines.root_url + PagesAPI.m_url;
    },
			
    // ////////////////////////////////////////////////////////////////////////
	
    setPagePara : function(themeParaID, paraValue, pageID, callback){
			
        var paras = {
            cmd: 'setPagePara',
            site_id: ssMain.siteID,
            page_id: pageID,
            theme_para_id: themeParaID,
            para_value: paraValue
        };
												
        $.ajax({
            url: PagesAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){
			        if (ret.result == "ok"){
			            callback(ret.data.theme_para_id, ret.data.new_value, ret.data.page_id);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
            	}
        });
    },
	
    // ////////////////////////////////////////////////////////////////////////

    updatePage : function(siteID, pageID, pageTitle, pageContent, pageStatus, templateName, parentPageID, pageSlug, pageOrder, description, browserTitle ,callback){
		
        //AthenaDialog.showLoading("Updating page");
		
        var paras = {
            cmd: 'updatePage',
            site_id: siteID,
            page_id: pageID,
            title: pageTitle,
            browser_title: browserTitle,
            content: pageContent,
            status: pageStatus,
            template_id: templateName,
            parent_page_id: parentPageID,
            slug: pageSlug,
            order: pageOrder,
            desc: description
        };
				
        $.ajax({
            url: PagesAPI.m_url,
            type: 'post',
            dataType: "json",
            data: paras,
            success: 
            	function(ret){
			        AthenaDialog.clearLoading();
			        if (ret.result == "ok"){
			            callback(ret.data.page);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
                }
            });
    },

    // ////////////////////////////////////////////////////////////////////////

    getPage : function(siteID, pageID, callback){
		
        AthenaDialog.showLoading("Getting page");
		
        var paras = { cmd: 'getPage', site_id: siteID, page_id: pageID};
				
        $.ajax({
            url: PagesAPI.m_url,
            type: 'post',
            dataType: "json",
            data: paras,
            success: 
            	function(ret){
			        AthenaDialog.clearLoading();
			
			        if (ret.result == "ok"){
			            callback(ret.data.page);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
                }
        });
    },	
    
    // ////////////////////////////////////////////////////////////////////////

    addPage : function(siteID, pageTitle, pageContent, pageStatus, templateName, parentPageID, pageSlug, pageOrder, isHome, isBlog, callback){
		
        AthenaDialog.showLoading("Adding page");
		
        var paras = {
            cmd: 'addPage',
            site_id: siteID,
            title: pageTitle,
            content: pageContent,
            status: pageStatus,
            template_id: templateName,
            parent_page_id: parentPageID,
            slug: pageSlug,
            ishome: isHome,
            isblog: isBlog,
            order: pageOrder
        };
				
        $.ajax({
            url: PagesAPI.m_url,
            type: 'post',
            dataType: "json",
            data: paras,
            success: 
            	function(ret){
			        AthenaDialog.clearLoading();
			
			        if (ret.result == "ok"){
			            callback(ret.data.page);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
                }
        });
    },	

    // ////////////////////////////////////////////////////////////////////////

    deletePage : function(siteID, pageID, callback){

        AthenaDialog.showLoading("Deleting page");

        var paras = {
            cmd: 'deletePage',
            site_id: siteID,
            page_id: pageID
        };
				
        $.ajax({
            url: PagesAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){
			        AthenaDialog.clearLoading();
			
			        if (ret.result == "ok"){
			            callback(ret.data.page_id);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
                }
        });
    }
}
    