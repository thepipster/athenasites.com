/**
* Store all current data
*
* @since 28th July, 2010
* @author (mike@apollosites.com)
*/
var DataStore = {

    m_currentFolderID : -1, // folder id of 1 is considered 'unassigned'
    m_currentPageID : 0,
    m_currentGalleryNo : 1, // For multi-galleries
    m_currentPostID : 0,

    /** Currently selected site id (if the user has more than 1 site!) */
    m_siteID : 0,

    /** List of folders for the site with fields; id, site_id, name */
    m_folderList : '',

    /** List of media for the site */
    m_mediaList : '',

    /** List of posts */
    m_postList : '',

    /** List of pages for the site */
    m_pageList : '',

    /** Page template list */
    m_templateList : '',

    /** Theme parameter list */
    m_themeParaList : '',

    /** List of parameters set for this site */
    m_siteParaList : '',

    /** Gallery image list */
    m_galleryImageList : '',

    /** Gallery meta information */
    m_galleryMetaList : '',

    /** List of post categories */
    m_categories : '',

    /** List of post tags */
    m_tags : '',
    
    /** Flag to enable stopping/starting of auto-save feature */
    m_doAutoSave : true,

    // //////////////////////////////////////////////////////////////////////////////////

    init : function(){

    },

    // //////////////////////////////////////////////////////////////////////////////////

    clear : function(){
        DataStore.m_folderList = '';
        DataStore.m_mediaList = '';
        DataStore.m_pageList = '';
    },

    // //////////////////////////////////////////////////////////////////////////////////

    getSiteParaValue : function(page_id, theme_para_id){

        for(var i=0; i<DataStore.m_siteParaList.length; i++){

            if ((DataStore.m_siteParaList[i].theme_para_id == theme_para_id) && (DataStore.m_siteParaList[i].page_id == page_id)){
                return DataStore.m_siteParaList[i].para_value;
            }
        }

        return false;
    },

    // //////////////////////////////////////////////////////////////////////////////////

    getPageThemeParas : function(template_name){
        var list = new Array();
        for(var i=0; i<DataStore.m_themeParaList.length; i++){
            if (DataStore.m_themeParaList[i].page_template_name == template_name){
                list.push(DataStore.m_themeParaList[i]);
            }
        }
        return list;
    },

    // //////////////////////////////////////////////////////////////////////////////////

    getImage : function(image_id){

        for(var i=0; i<DataStore.m_mediaList.length; i++){
            if (DataStore.m_mediaList[i].id == image_id){
                return DataStore.m_mediaList[i];
            }
        }
        
        return false;
    },

 
    // //////////////////////////////////////////////////////////////////////////////////

    /**
	* Add a new image to a gallery. If the slot is currently full, then insert the image by moving all the laters image
	* by one slot.
	*/
    /*
	addGalleryImage : function(media_id, slot_no, theme_para_id){


		var slotContents = DataStore.getGallerySlotImage(slot_no, gallery_no);
		var currentImage = false;
		var newImage = DataStore.getImage(media_id);

		if (slotContents){
			image = DataStore.getImage(slotContents.image_id);
		}

		// If the slot is not open, then increment the slot counter for all images
		// with slot numbers equal to or greater than this one
		if (!DataStore.isSlotFree(slot_no)){
			for (var i=0; i<DataStore.m_galleryImageList.length; i++){
				if (DataStore.m_galleryImageList[i].slot_number >= slot_no){
					DataStore.m_galleryImageList[i].slot_number++;
				}
			}
		}

		// Add the new image.....
		var galImg = new Array();
		galImg.image_id = media_id;
		galImg.slot_number = slot_no;
		galImg.theme_para_id = theme_para_id;
		galImg.gallery_number = DataStore.m_currentGalleryNo;
		galImg.page_id = DataStore.m_currentPageID;

		DataStore.m_galleryImageList.push(img);
	},
	*/

    removeGalleryImage : function(slot_no){

        var tempList = new Array();

        for (var i=0; i<DataStore.m_galleryImageList.length; i++){

            if (!(DataStore.m_galleryImageList[i].slot_number == slot_no &&
                DataStore.m_galleryImageList[i].gallery_number == DataStore.m_currentGalleryNo)){
                tempList.push(DataStore.m_galleryImageList[i]);
            }
        }

        DataStore.m_galleryImageList = tempList;

    },

    // //////////////////////////////////////////////////////////////////////////////////

    isSlotFree : function(slot_no){
        var slotContents = DataStore.getGallerySlotImage(slot_no, gallery_no);
        if (slotContents == undefined || !slotContents) return false;
        return true;
    },

    // //////////////////////////////////////////////////////////////////////////////////

    /**
	* Check to see if a page can have a gallery, based on its template
	*/
    isGalleryPage : function(page_id){

        var page = DataStore.getPage(page_id);
        var pageParas = DataStore.getPageThemeParas(page.template);

        for (var i=0; i<pageParas.length; i++){
            if (pageParas[i].para_type == 'gallery'){
                return true;
            }
        }
        return false;
    },

    // //////////////////////////////////////////////////////////////////////////////////

    getGallerySlotImage : function(slot_no, gallery_no){
        for (var i=0; i<DataStore.m_galleryImageList.length; i++){
            if (DataStore.m_galleryImageList[i].slot_number == slot_no &&
                DataStore.m_galleryImageList[i].gallery_number == gallery_no){
                return DataStore.m_galleryImageList[i];
            }
        }
        return false;
    },

    // //////////////////////////////////////////////////////////////////////////////////

    getPage : function(page_id){

        for(var i=0; i<DataStore.m_pageList.length; i++){
            if (DataStore.m_pageList[i].id == page_id){
                return DataStore.m_pageList[i];
            }
        }
        AthenaDialog.error('coiuld not find page with id = ' + page_id);
        return false;
    },

    // //////////////////////////////////////////////////////////////////////////////////

    getHomePage : function(){

        for(var i=0; i<DataStore.m_pageList.length; i++){
            if (DataStore.m_pageList[i].is_homepage == 1){
                return DataStore.m_pageList[i];
            }
        }
        return false;
    },

    // //////////////////////////////////////////////////////////////////////////////////

    getBlogPage : function(){

        for(var i=0; i<DataStore.m_pageList.length; i++){
            if (DataStore.m_pageList[i].is_blogpage == 1){
                return DataStore.m_pageList[i];
            }
        }
        return false;
    },

    // //////////////////////////////////////////////////////////////////////////////////

    getCurrentPage : function(){
        return DataStore.getPage(DataStore.m_currentPageID);
    },

    // //////////////////////////////////////////////////////////////////////////////////

    getFolderName : function(folder_id){

        if (folder_id == FolderSidebarFrame.ID_UNASSIGNED){
            return "Unassigned";
        }

        for (var i=0; i<DataStore.m_folderList.length; i++){
            if (DataStore.m_folderList[i].id == folder_id){
                return DataStore.m_folderList[i].name;
            }
        }

        return "? ("+folder_id+")";
    },

    // //////////////////////////////////////////////////////////////////////////////////

    /**
	* For a given page, traverse up the branch to find the root page
	*/
    getRootPage : function(page_id){

        var page = DataStore.getPage(page_id);

        //alert(page_id + ' ' + page.title + ' ' + page.parent_page_id);

        if (page.parent_page_id == 0){
            return page;
        }

        return DataStore.getRootPage(page.parent_page_id);
    },

    // //////////////////////////////////////////////////////////////////////////////////

    /**
	* Check to see if test_page_id is a child of page_id
	*/
    isChildOff : function(page_id, test_page_id){

        var testPage = DataStore.getPage(test_page_id);

        if (testPage.parent_page_id == 0){
            return false;
        }

        if (testPage.parent_page_id == page_id){
            return true;
        }
        else {
            return DataStore.isChildOff(page_id, testPage.parent_page_id);
        }

    },

    // //////////////////////////////////////////////////////////////////////////////////

    /**
	* Get the deepest page depth
	*/
    getMaxDepth : function(){

        var max_depth = 0;
        for (var i=0; i<DataStore.m_pageList.length; i++){
            var depth = DataStore.getPageDepth(DataStore.m_pageList[i].id);

            //alert(DataStore.m_pageList[i].title + " " + depth);

            if (depth > max_depth){
                max_depth = depth;
            }
        }

        return max_depth;
    },

    // //////////////////////////////////////////////////////////////////////////////////

    getPageDepth : function(page_id){

        var page = DataStore.getPage(page_id);
        if (page.parent_page_id == 0){
            return 1;
        }
        else {
            return 1 + DataStore.getPageDepth(page.parent_page_id);
        }
    },

    // //////////////////////////////////////////////////////////////////////////////////

    updateSitePara : function(theme_para_id, page_id, new_para_val){

		//alert(theme_para_id + ", " + page_id + ", " + new_para_val);
		
        // Update para in data store
        var paraFound = false;
        for (var i=0; i<DataStore.m_siteParaList.length; i++){
            if ((DataStore.m_siteParaList[i].theme_para_id == theme_para_id) && (DataStore.m_siteParaList[i].page_id == page_id)){
                DataStore.m_siteParaList[i].para_value = new_para_val;
                paraFound = true;
            }
        }
        
//        alert(paraFound);

        // If we didn't find the para, it must be a new para (that wasn't set before)
        if (!paraFound){
            var temp = new Object();
            temp.theme_para_id = theme_para_id;
            temp.para_value = new_para_val;
            temp.page_id = page_id;
            DataStore.m_siteParaList.push(temp);
        }		
		/*
        for (var i=0; i<DataStore.m_siteParaList.length; i++){

            if ((DataStore.m_siteParaList[i].theme_para_id == theme_para_id) && (DataStore.m_siteParaList[i].page_id == page_id)){
                DataStore.m_siteParaList[i].para_value = new_para_val;
                return;
            }

        }
        */
    },

    // //////////////////////////////////////////////////////////////////////////////////

    /**
	* Update an existing page
	*/
    updatePage : function(pageObj){

        for (var i=0; i<DataStore.m_pageList.length; i++){
            if (DataStore.m_pageList[i].id == pageObj.id){

                DataStore.m_pageList[i].id = pageObj.id;
                DataStore.m_pageList[i].title = AthenaUtils.encodeTitle(pageObj.title);
                DataStore.m_pageList[i].browser_title = AthenaUtils.encodeTitle(pageObj.browser_title);                
                DataStore.m_pageList[i].user_id = pageObj.user_id;
                DataStore.m_pageList[i].content = pageObj.content;
                DataStore.m_pageList[i].status = pageObj.status;
                DataStore.m_pageList[i].last_edit = pageObj.last_edit;
                DataStore.m_pageList[i].created = pageObj.created;
                DataStore.m_pageList[i].template = pageObj.template;
                DataStore.m_pageList[i].parent_page_id = pageObj.parent_page_id;
                DataStore.m_pageList[i].slug = pageObj.slug;
                DataStore.m_pageList[i].path = pageObj.path;
                DataStore.m_pageList[i].is_homepage = pageObj.is_homepage;
                DataStore.m_pageList[i].is_blogpage = pageObj.is_blogpage;
                DataStore.m_pageList[i].page_order = pageObj.page_order;
                DataStore.m_pageList[i].description = pageObj.description;

				// Flag as changed 
                DataStore.m_pageList[i].isChanged = 1;

                return;
            }
        }
    },

    // //////////////////////////////////////////////////////////////////////////////////

    deletePage : function(page_id){

        // TODO: replace with array.splice, it will be faster - see http://www.elated.com/articles/manipulating-javascript-arrays/
        var tempList = new Array();

        for(var i=0; i<DataStore.m_pageList.length; i++){
            if (DataStore.m_pageList[i].id != page_id){
                tempList.push(DataStore.m_pageList[i]);
            }
        }

        DataStore.m_pageList = tempList;

        // update any pages that had this page as their parent page id
        for(var i=0; i<DataStore.m_pageList.length; i++){
            if (DataStore.m_pageList[i].parent_page_id == page_id){
                DataStore.m_pageList[i].parent_page_id = 0;
            }
        }

    },

    // //////////////////////////////////////////////////////////////////////////////////

    /**
	* Add a page from a returned page object from the MediaAPI
	*/
    addPage : function(pageObj){

        var temp = new Object();
        temp.id = pageObj.id;
        temp.title = AthenaUtils.encodeTitle(pageObj.title);
        temp.user_id = pageObj.user_id;
        temp.content = pageObj.content;
        temp.status = pageObj.status;
        temp.last_edit = pageObj.last_edit;
        temp.created = pageObj.created;
        temp.template = pageObj.template;
        temp.parent_page_id = pageObj.parent_page_id;
        temp.slug = pageObj.slug;
        temp.path = pageObj.path;
        temp.is_homepage = pageObj.is_homepage;
        temp.is_blogpage = pageObj.is_blogpage;
        temp.page_order = pageObj.page_order;
        temp.description = pageObj.description;
        temp.browser_title = pageObj.browser_title;

        DataStore.m_pageList.push(temp);
    },

    // //////////////////////////////////////////////////////////////////////////////////

    /**
     * Add a post from a returned page object from the MediaAPI
     * @param object postObj the post object to add
     * @param boolean toStart (optional) if set to true, this post will be added to the start of the list
     * useful for new posts, as they have the latest creation date so we want them to be at the start of the list
     * and don't want to have to sort the list based on date
     */
    addPost : function(postObj, toStart){

        var temp = new Object();
        temp.id = postObj.id;
        temp.title = AthenaUtils.encodeTitle(postObj.title);
        temp.user_id = postObj.user_id;
        temp.content = AthenaUtils.decodeContent(postObj.content);
        temp.status = postObj.status;
        temp.last_edit = postObj.last_edit;
        temp.created = postObj.created;
        temp.slug = postObj.slug;
        temp.path = postObj.path;
        temp.canComment = postObj.canComment;
        temp.tags = postObj.tags;
        temp.categories = postObj.categories;

        if (temp.tags == undefined){
            temp.tags = new Array();
        }
        if (temp.categories == undefined){
            temp.categories = new Array();
        }

        if (!toStart){
            DataStore.m_postList.push(temp);
        }
        else {
            DataStore.m_postList.unshift(temp);
        }
    },

    // //////////////////////////////////////////////////////////////////////////////////

    /**
	* Update an existing page
	*/
    updatePost : function(postObj){
		
        for (var i=0; i<DataStore.m_postList.length; i++){
            if (DataStore.m_postList[i].id == postObj.id){

                DataStore.m_postList[i].id = postObj.id;
                DataStore.m_postList[i].title = AthenaUtils.encodeTitle(postObj.title);
                DataStore.m_postList[i].user_id = postObj.user_id;
                DataStore.m_postList[i].content = AthenaUtils.decodeContent(postObj.content);
                DataStore.m_postList[i].status = postObj.status;
                DataStore.m_postList[i].last_edit = postObj.last_edit;
                DataStore.m_postList[i].created = postObj.created;
                DataStore.m_postList[i].slug = postObj.slug;
                DataStore.m_postList[i].path = postObj.path;
                DataStore.m_postList[i].canComment = postObj.canComment;
                DataStore.m_postList[i].tags = postObj.tags;
                DataStore.m_postList[i].categories = postObj.categories;

                if (DataStore.m_postList[i].tags == undefined){
                    DataStore.m_postList[i].tags = new Array();
                }
                if (DataStore.m_postList[i].categories == undefined){
                    DataStore.m_postList[i].categories = new Array();
                }

				// Flag as changed
                DataStore.m_postList[i].isChanged = 1;

                return;
            }
        }
    },

    // //////////////////////////////////////////////////////////////////////////////////

    deletePost : function(post_id){

        // TODO: replace with array.splice, it will be faster - see http://www.elated.com/articles/manipulating-javascript-arrays/

        var tempList = new Array();

        for(var i=0; i<DataStore.m_postList.length; i++){
            if (DataStore.m_postList[i].id != post_id){
                tempList.push(DataStore.m_postList[i]);
            }
        }

        DataStore.m_postList = tempList;

    },

    // //////////////////////////////////////////////////////////////////////////////////

    getPost : function(post_id){

        for(var i=0; i<DataStore.m_postList.length; i++){
            if (DataStore.m_postList[i].id == post_id){
                return DataStore.m_postList[i];
            }
        }
        return false;
    },

    // //////////////////////////////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////////////////////////////

	/**
	* Save any items that have been marked as changed
	*/
    save : function(){
        
        if (!DataStore.m_doAutoSave) return;
        
        var autosaved = false;
        var savingPost = false;
        var savingPage = false;
        var savingMedia = false;
        
        // Check posts
    	for (var i=0; i<DataStore.m_postList.length; i++){
    		if (DataStore.m_postList[i].isChanged != undefined && DataStore.m_postList[i].isChanged == 1){    	
    			DataStore.savePost(DataStore.m_postList[i]);   	
    			autosaved = true;		
    			savingPost = true;
    		}
    	}

		// Check pages...
    	for (i=0; i<DataStore.m_pageList.length; i++){
    		if (DataStore.m_pageList[i].isChanged != undefined && DataStore.m_pageList[i].isChanged == 1){  
    			DataStore.savePage(DataStore.m_pageList[i]);   			
    			autosaved = true;		
    			savingPage = true;
    		}
    	}    	

		// Check images/media....
    	for (i=0; i<DataStore.m_mediaList.length; i++){
    		if (DataStore.m_mediaList[i].isChanged != undefined && DataStore.m_mediaList[i].isChanged == 1){  
    			DataStore.saveMedia(DataStore.m_mediaList[i]);   			
    			autosaved = true;		
    			savingMedia = true;
    		}
    	}  
		
		if (autosaved){

			var what = "";
			
			if (savingPost) what += " post";
			if (savingPage) what += " page";
			if (savingMedia) what += " media";
							
			AthenaDialog.backgroundMessage("Autosaved" + what);
		}    	
    },

    // //////////////////////////////////////////////////////////////////////////////////

	saveMedia : function(mediaObj){
        MediaAPI.updateMediaInfo(DataStore.m_siteID, mediaObj.id, mediaObj.title, mediaObj.description, mediaObj.tags, DataStore.onMediaSaved);
	},
	
	onMediaSaved : function(mediaObj){
	
		DataStore.updateMedia(mediaObj);
		
		// Mark as saved...
    	for (var i=0; i<DataStore.m_mediaList.length; i++){
    		if (DataStore.m_mediaList[i].id == mediaObj.id){
    			DataStore.m_mediaList[i].isChanged = 0;
    		}
		}			
	},
	
    // //////////////////////////////////////////////////////////////////////////////////

	/**
	* Save a page to the server
	*/ 
	savePage : function(pageObj){
			
        MediaAPI.updatePage(DataStore.m_siteID, 
        					pageObj.id, 
        					pageObj.title, 
        					pageObj.content, 
        					pageObj.status, 
        					pageObj.template, 
        					pageObj.parent_page_id, 
        					pageObj.slug, 
        					pageObj.page_order, 
        					pageObj.is_homepage, 
        					pageObj.description, 
        					pageObj.browser_title, 
        					DataStore.onPageSaved);
	},
	
	onPageSaved : function(pageObj){
		
		DataStore.updatePage(pageObj);
				
		// Mark as saved...
    	for (var i=0; i<DataStore.m_pageList.length; i++){
    		if (DataStore.m_pageList[i].id == pageObj.id){
    			DataStore.m_pageList[i].isChanged = 0;
    		}
		}		
		
		// Is this page being displayed? If so, update the last edit display
		if (pageObj.id == DataStore.m_currentPageID && ssMain.view == ssMain.VIEW_PAGES){
			$('#pageLastEdit').html(pageObj.last_edit);
			//$('#pageLastEdit').effect("highlight", {color: 'white'}, 2000);
			$('#pageLastEdit').effect("pulsate", { times:1 }, 2000);
		}
	},
	
    // //////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Save a post to the server
	*/
	savePost : function(postObj, callback){
	
        MediaAPI.updatePost(DataStore.m_siteID, 
        					postObj.id, 
        					postObj.title, 
        					postObj.content, 
        					postObj.status, 
        					postObj.canComment, 
        					postObj.slug, 
        					DataStore.onPostSaved)
	},
	
	onPostSaved : function(postObj){

		DataStore.updatePost(postObj);

		// Mark as saved...
    	for (var i=0; i<DataStore.m_postList.length; i++){
    		if (DataStore.m_postList[i].id == postObj.id){
    			DataStore.m_postList[i].isChanged = 0;
    		}
		}	
		
		// Is this page being displayed? If so, update the last edit display
		if (postObj.id == DataStore.m_currentPostID && ssMain.view == ssMain.VIEW_POSTS){
			$('#postLastEdit').html(postObj.last_edit);
			$('#postLastEdit').effect("pulsate", { times:1 }, 2000);
		}
			
	},
	
    // //////////////////////////////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////////////////////////////

    load : function(callback){

        GalleryAPI.getAll(DataStore.m_siteID, function(gallery_images, gallery_meta){
            DataStore.onGotGalleryData(gallery_images, gallery_meta);
        });

        MediaAPI.getAll(DataStore.m_siteID,
            function(folders, media, pages, theme, page_templates, theme_paras, page_paras, posts, tags, categories){
                DataStore.onGotData(folders, media, pages, theme, page_templates, theme_paras, page_paras, posts, tags, categories, callback);
            });
    },

    // //////////////////////////////////////////////////////////////////////////////////

    onGotGalleryData : function(gallery_images, gallery_meta){

        DataStore.onGotGalleryImages(gallery_images);
        //DataStore.m_galleryImageList = gallery_images;
        DataStore.m_galleryMetaList = gallery_meta;

        if (DataStore.m_galleryImageList == undefined) DataStore.DataStore.m_galleryImageList = new Array();
        if (DataStore.m_galleryMetaList == undefined) DataStore.m_galleryMetaList = new Array();
    },

    // //////////////////////////////////////////////////////////////////////////////////

    onGotGalleryImages : function(gallery_images){

        if (!gallery_images || gallery_images == undefined){
            DataStore.m_galleryImageList = new Array();
            return;
        }

        DataStore.m_galleryImageList = new Array(gallery_images.length);

        for(var i=0; i<gallery_images.length; i++){

            var temp = new Object();

            temp.id = parseInt(gallery_images[i].id);
            temp.image_id = parseInt(gallery_images[i].image_id);
            temp.slot_number = parseInt(gallery_images[i].slot_number);
            temp.gallery_number = parseInt(gallery_images[i].gallery_number);
            temp.theme_para_id = parseInt(gallery_images[i].theme_para_id);
            temp.page_id = parseInt(gallery_images[i].page_id);

            DataStore.m_galleryImageList[i] = temp;
        }

    },

    // //////////////////////////////////////////////////////////////////////////////////

    onGotData : function(folder_list, media_list, page_list, theme, page_templates, theme_paras, paga_paras, post_list, tag_list, categories_list, callback){

        DataStore.onGotFolders(folder_list);
        DataStore.onGotMedia(media_list);
        DataStore.onGotPages(page_list);
        DataStore.onGotPosts(post_list);
        DataStore.onGotPageTemplates(page_templates);
        //DataStore.onGotThemeParas(theme_paras);

        DataStore.m_siteParaList = paga_paras;
        DataStore.m_themeParaList = theme_paras;
        DataStore.m_theme = theme; // id, theme_name, theme_title, price, thumb_url, description, is_private, max_page_depth
        DataStore.m_categories = categories_list;
        DataStore.m_tags = tag_list;

        if (DataStore.m_themeParaList == undefined) DataStore.m_themeParaList = new Array();
        if (DataStore.m_siteParaList == undefined) DataStore.m_siteParaList = new Array();
        if (DataStore.m_categories == undefined) DataStore.m_categories = new Array();
        if (DataStore.m_tags == undefined) DataStore.m_tags = new Array();

        callback();
    },

    // //////////////////////////////////////////////////////////////////////////////////
    /*
	onGotThemeParas : function(theme_paras){

		if (!theme_paras || theme_paras == undefined){
			DataStore.m_themeParaList = new Array();
			return;
		}

		DataStore.m_themeParaList = new Array();

		for(var i=0; i<theme_paras.length; i++){

			var temp = new Object();
			temp.template_name = page_templates[i].template_name;
			temp.template_description = page_templates[i].template_description;
			temp.template_file = page_templates[i].template_file;

			DataStore.m_themeParaList[i] = temp;

		}

	},
	*/
    // //////////////////////////////////////////////////////////////////////////////////

    onGotPageTemplates : function(page_templates){

        if (!page_templates || page_templates == undefined){
            DataStore.m_templateList = new Array();
            return;
        }

        DataStore.m_templateList = new Array();

        for(var i=0; i<page_templates.length; i++){

            var temp = new Object();
            temp.template_name = page_templates[i].template_name;
            temp.template_description = page_templates[i].template_description;
            temp.template_file = page_templates[i].template_file;

            DataStore.m_templateList[i] = temp;

        }

    },

    // //////////////////////////////////////////////////////////////////////////////////

    onGotPosts : function(post_list){

        if (!post_list || post_list == undefined){
            DataStore.m_postList = new Array();
            return;
        }

        DataStore.m_postList = new Array();

        for(var i=0; i<post_list.length; i++){

            DataStore.addPost(post_list[i]);

        }

        if (post_list.length > 0 && DataStore.m_currentPostID == 0){
            DataStore.m_currentPostID = post_list[0].id;
        }

    },

    // //////////////////////////////////////////////////////////////////////////////////

    onGotPages : function(page_list){

        if (!page_list || page_list == undefined){
            DataStore.m_pageList = new Array();
            return;
        }

        DataStore.m_pageList = new Array();

        for(var i=0; i<page_list.length; i++){

            DataStore.addPage(page_list[i]);

        }

        if (page_list.length > 0 && DataStore.m_currentPageID == 0){
            DataStore.m_currentPageID = page_list[0].id;
        }

    },

    // //////////////////////////////////////////////////////////////////////////////////

    onGotFolders : function(folder_list){

        if (!folder_list || folder_list == undefined){
            DataStore.m_folderList = new Array();
            return;
        }

        DataStore.m_folderList = new Array(folder_list.length);

        for(var i=0; i<folder_list.length; i++){

            var temp = new Object();
            temp.id = folder_list[i].id;
            temp.name = folder_list[i].name;

            if (i == 0){
            //alert(temp.id + " " + temp.name);
            }

            DataStore.m_folderList[i] = temp;
        }

    },

    // //////////////////////////////////////////////////////////////////////////////////

    onGotMedia : function(media_list){

        if (!media_list || media_list == undefined){
            DataStore.m_mediaList = new Array();
            return;
        }

        DataStore.m_mediaList = new Array(media_list.length);
		
        for(var i=0; i<media_list.length; i++){

            var files_root = defines.user_files_root_url + DataStore.m_siteID + "/";
            var temp = new Object();

            temp.thumb_url = files_root + media_list[i].filepath + media_list[i].thumb_filename;
            temp.file_url = files_root + media_list[i].filepath + media_list[i].filename;
            temp.mime_type = media_list[i].mime_type;
            temp.title = media_list[i].title;
            temp.description = media_list[i].description;
            temp.tags = media_list[i].tags;
            temp.width = media_list[i].width;
            temp.height = media_list[i].height;
            temp.thumb_width = media_list[i].thumb_width;
            temp.thumb_height = media_list[i].thumb_height;
            temp.id = media_list[i].id;
            temp.date_added = media_list[i].created;
            temp.folder_id = media_list[i].folder_id;
			
            if (i == 0){
            //alert(temp.thumb_url);
            }

            DataStore.m_mediaList[i] = temp;
        }

    },

    // //////////////////////////////////////////////////////////////////////////////////

    /**
    * Update an existing page, if preserveURL is set to true then don't add the path to the image url
    */
    updateMedia : function(mediaObj, preserveURL){

		if (preserveURL == undefined) preserveURL = false;
		
        for (var i=0; i<DataStore.m_mediaList.length; i++){
            if (DataStore.m_mediaList[i].id == mediaObj.id){

                var files_root = defines.user_files_root_url + DataStore.m_siteID + "/";

                DataStore.m_mediaList[i].id = mediaObj.id;
                
                if (preserveURL){
	                DataStore.m_mediaList[i].thumb_url = mediaObj.thumb_url;
	                DataStore.m_mediaList[i].file_url = mediaObj.file_url;
                }
                else {
	                DataStore.m_mediaList[i].thumb_url = files_root + mediaObj.filepath + mediaObj.thumb_filename;
	                DataStore.m_mediaList[i].file_url = files_root + mediaObj.filepath + mediaObj.filename;
                }
                
                DataStore.m_mediaList[i].mime_type = mediaObj.mime_type;
                DataStore.m_mediaList[i].title = mediaObj.title;
                DataStore.m_mediaList[i].description = mediaObj.description;
                DataStore.m_mediaList[i].tags = mediaObj.tags;
                DataStore.m_mediaList[i].width = mediaObj.width;
                DataStore.m_mediaList[i].height = mediaObj.height;
                DataStore.m_mediaList[i].thumb_width = mediaObj.thumb_width;
                DataStore.m_mediaList[i].thumb_height = mediaObj.thumb_height;
                DataStore.m_mediaList[i].date_added = mediaObj.date_added;
                DataStore.m_mediaList[i].folder_id = mediaObj.folder_id;
                DataStore.m_mediaList[i].isChanged = 1;

                return;
            }
        }
    },

    // //////////////////////////////////////////////////////////////////////////////////

    /**
     * Remove a media file from the list
     */
    deleteMedia : function(media_id){

        var tempList = new Array();

        for(var i=0; i<DataStore.m_mediaList.length; i++){
            if (DataStore.m_mediaList[i].id != media_id){
                tempList.push(DataStore.m_mediaList[i]);
            }
        }

        DataStore.m_mediaList = tempList;

		// Remove from any galleries

        var tempList = new Array();
        for(var i=0; i<DataStore.m_galleryImageList.length; i++){
            if (DataStore.m_galleryImageList[i].image_id != media_id){
                tempList.push(DataStore.m_galleryImageList[i]);
            }
        }

        DataStore.m_galleryImageList = tempList;
				
    },
    
    // //////////////////////////////////////////////////////////////////////////////////
    
	/**
	* Get a list of images for the currently selected folder/filter
	* @return Return an array of images for the currently selected folder
	*/
	getImages : function(){

        var d = new Date();
        var localTime = d.getTime();
        var localOffset = d.getTimezoneOffset() * 60000;
        var utc_date = new Date(localTime + localOffset);
        var utc_time = localTime + localOffset;
												
        var imageList = DataStore.m_mediaList;
        
		var folderImageList = new Array();
		
        for (var i=0; i<imageList.length; i++){

            var image_folder_id = parseInt(imageList[i].folder_id);
            var added_date = new Date(imageList[i].date_added);
            var hours_ago = (utc_time - added_date.getTime())/3600000;
									
            switch(DataStore.m_currentFolderID){
			
                case FolderSidebarFrame.ID_UNASSIGNED:
                    if (image_folder_id == FolderSidebarFrame.ID_ALL || image_folder_id == FolderSidebarFrame.ID_UNASSIGNED)
                    	folderImageList.push(imageList[i]);
                    break;
					
                case FolderSidebarFrame.ID_LAST_1_HOUR:
                    if (hours_ago <= 1){
                    	folderImageList.push(imageList[i]);
                    }
                    break;

                case FolderSidebarFrame.ID_LAST_24_HOURS:
                    if (hours_ago <= 24){
                    	folderImageList.push(imageList[i]);
                    }
                    break;

                case FolderSidebarFrame.ID_LAST_7_DAYS:
                    if (hours_ago <= 168){
                    	folderImageList.push(imageList[i]);
                    }
                    break;

                case FolderSidebarFrame.ID_ALL:
                   	folderImageList.push(imageList[i]);
                    break;

                case image_folder_id:
                   	folderImageList.push(imageList[i]);
                    break;

                default:
            // Nothing to do
            }
			
        }
        
        return folderImageList;
                
	}

}