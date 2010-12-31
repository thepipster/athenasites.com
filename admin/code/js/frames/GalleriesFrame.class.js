/**
*
* 
* @since 27th July, 2010
*/
var GalleriesFrame = {

    m_themeParaID :0,
	
	/** Images are divided into pages so we can fit the right number on the screen */
    m_currentImagePage : 0,
    
    /** Max number of images per page */    
    m_imagesPerPage : 50,
    
    /** Number of image pages */
    m_numberImagePages : 0,

	/** List of images based on the current folder selection */	
	m_imageList : '',
	
    // ////////////////////////////////////////////////////////////////////////////

    init : function(){
    },
	
    // ////////////////////////////////////////////////////////////////////////////
	
    repaint : function(){			

        GalleriesFrame.m_themeParaID = GalleriesFrame.getThemeParaForGalleryPage();
        
        if (SidebarFrame.m_folderTagMode){
			GalleriesFrame.m_imageList = DataStore.getImagesForCurrentTag();
        }
        else {
			GalleriesFrame.m_imageList = DataStore.getImagesForCurrentFolder();
        }        
   		
		GalleriesFrame.calcImagePages();
        GalleriesFrame.paintGallerySlots();
        GalleriesFrame.paintImages();	

        //alert($('#GalleriesFrame').height());		
        
        $('#GalleriesFrame').css('height','100%');	
        
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    showMultiGalSettings : function(){
        $('#gallerySettings').show();
    },
		
    // ////////////////////////////////////////////////////////////////////////////

	/**
	* Calculate number of images to display per page, we divide the images into 'pages' 
	* so we don't oveflow the display
	*/
	calcImagePages : function(){

    	var h = $('#apollo_image_contents_wrapper').height();
    	var w = 0;

        if (GalleriesFrame.m_mode == 'edit_image'){
	  		w = $('#GalleryFrameContent').width() - 500;
        }
        else {
	  		w = $('#GalleryFrameContent').width() - 300;
        }
        
    	// images per row = w / thumb_width
    	// images per col = h / thumb_height
    	// so.. images per page = (w/60) * (h/60) = (w*h)/(thumb_width*thumb_height)
    	//    = (w*h) / (50*50) = (w*h) / 2500
    	
    	GalleriesFrame.m_imagesPerPage = Math.floor((w*h) / 4900);    
        
        
		GalleriesFrame.m_numberImagePages = Math.ceil(GalleriesFrame.m_imageList.length / GalleriesFrame.m_imagesPerPage);
        
        if (GalleriesFrame.m_numberImagePages <= 1){
        	$('.more_link').hide();
        }
        else {
        	$('.more_link').show();
        }
        
        /*        
        Logger.show();
		Logger.debug("Width: " + w + " Height: " + h);
		Logger.info($('#apollo_image_contents_wrapper').height());
		Logger.debug("Images per row: " + (w/70) + " per col: " + (h/70) + " per page: " + GalleriesFrame.m_imagesPerPage);
		*/
	},
	
    // ////////////////////////////////////////////////////////////////////////////

	showPrevImages : function(){

		GalleriesFrame.m_currentImagePage--;
		
		//var noPages = Math.ceil(GalleriesFrame.m_imageList.length / GalleriesFrame.m_imagesPerPage);
		
		if (GalleriesFrame.m_currentImagePage < 0){
			GalleriesFrame.m_currentImagePage = GalleriesFrame.m_numberImagePages - 1;
		}
		
		//Logger.error(GalleriesFrame.m_currentImagePage + " / " + noPages);
		
		GalleriesFrame.paintImages();		

	},
	
    // ////////////////////////////////////////////////////////////////////////////

	showNextImages : function(){

		GalleriesFrame.m_currentImagePage++;

		//m_numberImagePagesvar noPages = Math.ceil(GalleriesFrame.m_imageList.length / GalleriesFrame.m_imagesPerPage);

		if (GalleriesFrame.m_currentImagePage >= GalleriesFrame.m_numberImagePages){
			GalleriesFrame.m_currentImagePage = 0;
		}
	
		//Logger.error(GalleriesFrame.m_currentImagePage + " / " + noPages);
		
		GalleriesFrame.paintImages();		
		
	},
		
    // ////////////////////////////////////////////////////////////////////////////
	
    getThemeParaForGalleryPage : function(){

        var page = DataStore.getCurrentPage();
				
        for(var i=0; i<DataStore.m_themeParaList.length; i++){
        
            if (DataStore.m_themeParaList[i].page_template_name == page.template){

                if (DataStore.m_themeParaList[i].para_type == 'gallery'){
                    return DataStore.m_themeParaList[i].id;
                }
                else if (DataStore.m_themeParaList[i].para_type == 'multi-gallery'){
                    GalleriesFrame.showMultiGalSettings();
                    return DataStore.m_themeParaList[i].id;
                }
				
            }
        }
        
        return 0;
    },
		
    // ////////////////////////////////////////////////////////////////////////////
	
    paintGallerySlots : function(){

        //$('#apollo_gallery_contents').remove();
        //$('#apollo_gallery_contents_wrapper').html("<div align='left' id='apollo_gallery_contents'></div>");

		if (!DataStore.isGalleryPage(DataStore.m_currentPageID)){
			$('#apollo_gallery_contents').html("<p>No gallery selected. Select a gallery from the page list to the left</p>");
	        $('#galleryTitle').html("Gallery Contents");
	        $('#delete_slot').hide();
			return;
		}

        $('#delete_slot').show();
		
        $('.gallery_slot').droppable('destroy');
        $(".gallery_thumb").draggable('destroy');
        $('#apollo_gallery_contents').html("");

        var txt = "";

        var noSlots = 23;
        for (var i=0; i<DataStore.m_galleryImageList.length; i++){
        	var slot = parseInt(DataStore.m_galleryImageList[i].slot_number);
            if (DataStore.m_galleryImageList[i].theme_para_id == GalleriesFrame.m_themeParaID &&  slot > noSlots){
                noSlots = slot;
            }
        }

        noSlots = noSlots + 2;
		
        for (var i=0; i<noSlots; i++){
            //txt += "<div class='gallery_slot' id='slot_"+i+"' align='center'><table><tr valigin='center'><td>";
            //txt += "<div class='gallery_slot_text' align='center'>"+(i+1)+"</div>";
            //txt += "</td></tr></table></div>";
            txt += "<div class='gallery_slot' id='slot_"+i+"' align='center'>";
            txt += "    <div class='gallery_slot_text' align='center'>"+(i+1)+"</div>";
            txt += "</div>";
        }
/*
        // Add special delete slot
        txt += "<div class='gallery_slot' id='delete_slot' align='center'>";
        txt += "    <div class='delete_slot_text' align='center'>remove</div>";        
        txt += "</div>";
*/					
        $('#apollo_gallery_contents').html(txt);
        
        // Update the gallery title
        var page = DataStore.getCurrentPage();
        $('#galleryTitle').html("Gallery "+page.title);
						
        for (var i=0; i<DataStore.m_galleryImageList.length; i++){
            
            if ((DataStore.m_galleryImageList[i].page_id == DataStore.m_currentPageID) &&
                (DataStore.m_galleryImageList[i].theme_para_id == GalleriesFrame.m_themeParaID) &&
                (DataStore.m_galleryImageList[i].gallery_number == DataStore.m_currentGalleryNo)){
						
                var img_id = DataStore.m_galleryImageList[i].image_id;
                var image = DataStore.getImage(img_id);
                var url = image.thumb_url;
                var slot_no = DataStore.m_galleryImageList[i].slot_number;

                $("#slot_"+slot_no).html("<img class='gallery_slot_image gallery_thumb' slot='"+slot_no+"' id='galimg_"+img_id+"' src='"+url+"'/>");
		//$(".gallery_thumb").draggable({	revert: false, zIndex: 300 });
            }
        }


        // Make the images draggable
        $(".gallery_thumb").draggable({
            revert: false,
            zIndex: 300
        });


        $('.gallery_slot').droppable({
            drop: GalleriesFrame.onDrop,
            over: function(ev, ui) {
                $(this).addClass( 'gallery_slot_hover' );
            },
            out: function(ev, ui) {
                $(this).removeClass( 'gallery_slot_hover' );
            }
        });
	
		// Make the 'drop here to remove from gallery' box droppable
        $('#delete_slot').droppable({
            drop: GalleriesFrame.onRemoveImage,
            over: function(ev, ui) {
                $(this).addClass( 'gallery_slot_hover' );
            },
            out: function(ev, ui) {
                $(this).removeClass( 'gallery_slot_hover' );
            }
        });
		
				
    },
    
    // ////////////////////////////////////////////////////////////////////////////
    
    paintImages : function(){
		
        $(".thumb").draggable('destroy');
				
		if (GalleriesFrame.m_imageList == ''){
	        if (SidebarFrame.m_folderTagMode){
				GalleriesFrame.m_imageList = DataStore.getImagesForCurrentTag();
	        }
	        else {
				GalleriesFrame.m_imageList = DataStore.getImagesForCurrentFolder();
	        }        
			GalleriesFrame.calcImagePages();
		}		
				
		var startIndex = GalleriesFrame.m_imagesPerPage * GalleriesFrame.m_currentImagePage;
		var endIndex = Math.min(startIndex + GalleriesFrame.m_imagesPerPage, GalleriesFrame.m_imageList.length);
		
		//Logger.debug("Image page: " + GalleriesFrame.m_currentImagePage);
				
        var txt = "";
    	
		// Get the html for the selected images...
        for (var i=startIndex; i<endIndex; i++){

            var thumb_url = GalleriesFrame.m_imageList[i].thumb_url;
            var post_id = GalleriesFrame.m_imageList[i].id;
            var title = GalleriesFrame.m_imageList[i].title;
            var thumb_width = GalleriesFrame.m_imageList[i].thumb_width;
            var thumb_height = GalleriesFrame.m_imageList[i].thumb_height;
            var width = GalleriesFrame.m_imageList[i].width;
            var height = GalleriesFrame.m_imageList[i].height;

        	txt += GalleriesFrame.getImageHTML(post_id, thumb_url, title, width, height, thumb_width, thumb_height);
		}
	
	
        if (txt == ""){
            txt += "<div style='color:#444444;'>This folder is empty</div>";
        }
		
        $('#apollo_image_contents').html(txt);
        $('#apollo_image_contents').disableSelection();
        $('#apollo_image_contents').noContext();

        //$(".thumb").rightClick( function(e) {GalleriesFrame.onRightClickImage(e, this);});
				
        // Make draggable
        $(".thumb").draggable({
            revert: true,
            zIndex: 300
        });
		
		
    },

    // ////////////////////////////////////////////////////////////////////////////
	
    getImageHTML : function(post_id, thumb_url, title, width, height, thumb_width, thumb_height){

        var txt = "";
        //var ph = (60 - height - 8)/2;
		
        var titleText = title + " (" + width + "px by " + height + "px)";

        var onclick = "GalleriesFrame.onSelectImage('"+post_id+"')";
		
        txt += "<div class='thumbwrapper' align='center' onclick=\""+onclick+"\">";
        txt += "<img id='img_"+post_id+"' src='"+thumb_url+"' class='thumb' width='"+thumb_width+"px' height='"+thumb_height+"px' title='"+titleText+"'/>";
        txt += "</div>";
        return txt;
    },
        
    // ////////////////////////////////////////////////////////////////////////////

    /**
	* Handle an image being dropped on the remove box
	*/	
    onRemoveImage : function(event, ui){

        img_id = parseInt($(ui.draggable).attr('id').substring(7));
        prev_slot_id = $(ui.draggable).attr('slot');        
        //slot_id = parseInt($(this).attr('id').substring(5));
        GalleryAPI.onRemoveImage(DataStore.m_siteID,
					            DataStore.m_currentPageID,
					            img_id,
					            DataStore.m_currentGalleryNo,
					            prev_slot_id,
					            GalleriesFrame.m_themeParaID,
					            GalleriesFrame.onImageRemoved);
    },
        
    // ////////////////////////////////////////////////////////////////////////////
				
    /**
	* Handle an image being dropped on the gallery, or moved withing the gallery
	*/	
    onDrop : function(event, ui){
	
        //alert('GalleriesFrame.onDrop()');
		
        var slot_id = 0;
        var img_id = -1;
        var url = '';
        var image_moved = true;
        var prev_slot_id = -1;
				        
        if ($(ui.draggable).attr('id').substring(0,3) == 'gal'){

            // This is an existing image being moved!
            img_id = parseInt($(ui.draggable).attr('id').substring(7));
            slot_id = parseInt($(this).attr('id').substring(5));
            url = $('#galimg_'+img_id).attr('src');
            prev_slot_id = $(ui.draggable).attr('slot');
			
            GalleryAPI.onMoveImage( DataStore.m_siteID,
                DataStore.m_currentPageID,
                img_id,
                prev_slot_id,
                slot_id,
                DataStore.m_currentGalleryNo,
                DataStore.m_currentGalleryNo,
                GalleriesFrame.m_themeParaID,
                GalleriesFrame.onImageMoved);
        }
        else {

            // This is a new image being added
            image_moved = false;
            img_id = parseInt($(ui.draggable).attr('id').substring(4));
            slot_id = parseInt($(this).attr('id').substring(5));
            url = $('#img_'+img_id).attr('src');
			
            GalleryAPI.onAddImage(	DataStore.m_siteID,
                DataStore.m_currentPageID,
                img_id,
                slot_id,
                DataStore.m_currentGalleryNo,
                GalleriesFrame.m_themeParaID,
                GalleriesFrame.onImageAdded);
			
        }

    /*
		if (img_id == -1){
			alert('bad image id');
			return;
		}
*/								
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    onImageMoved : function(gallery_images, gallery_meta){
        // Add the new image to the data store
        DataStore.onGotGalleryData(gallery_images, gallery_meta);
        setTimeout("GalleriesFrame.paintGallerySlots()", 50);
//        GalleriesFrame.paintGallerySlots();
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    onImageAdded : function(gallery_images, gallery_meta){
        // Add the new image to the data store
        DataStore.onGotGalleryData(gallery_images, gallery_meta);
        setTimeout("GalleriesFrame.paintGallerySlots()", 50);
//        GalleriesFrame.paintGallerySlots();
    },
	
    // ////////////////////////////////////////////////////////////////////////////

    onImageRemoved : function(slot_number){
        DataStore.removeGalleryImage(slot_number);
        setTimeout("GalleriesFrame.paintGallerySlots()", 50);        
        //GalleriesFrame.paintGallerySlots();
    }
}