/**
* Javascript class that allows a user to pick an image from their wordpress media library
*/
var ImagePickerDialog = {

	//imageList : Array(Array('test.png', 1, 'title'), Array('test.png', 1, 'title')),

	MODE_IMAGE : 'image',
	MODE_FAVICON : 'favicon',
	MODE_GALLERY_THUMB : 'galthumb',
	
	mode : 'image',
	
	isGlobal : false,
	para1 : -1,
	themeParaID : -2,
	
	folder_id : 0,
	
	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	*
	* @param mode 'image' or 'favicon'
	* @param isGlobal true/false 
	* @param themeParaID the theme's parameter id
	* @param para1 'blog id' if isGlobal is true, otherwise this will be 'page_post_id' (the page we're setting the para for)
	*/
	show : function(mode, isGlobal, themeParaID, para1, para2){
	
		ImagePickerDialog.mode = mode;
		ImagePickerDialog.isGlobal = isGlobal;
		ImagePickerDialog.para1 = para1;
		ImagePickerDialog.para2 = para2;
		ImagePickerDialog.themeParaID = themeParaID;

		var imageList = ImagePickerData.imageList;
		var dialogTitle = 'Select an image';

		if (ImagePickerDialog.mode == ImagePickerDialog.MODE_FAVICON){
			imageList = ImagePickerData.favIconList;
			dialogTitle = 'Select a favicon';
		}
		
		//var targetDiv = '#apolloImagePicker';
		var targetDiv = '#ApolloImageSelector';


				
		if (ImagePickerData.folderList.length >= 1){
			ImagePickerDialog.folder_id = ImagePickerData.folderList[0].id;	
		}
		
		var minHeight = jQuery(window).height()/2;
		
		var txt = "";
		
		txt += "<div>";
		txt += "<table width='100%' height='100%' cellspacing='0px'>";		
		txt += "   <tr height='100%'>";
		txt += "      <td width='250px'>";
		txt += "         <div class='dialog_h2'>Folders</div>";
		txt += "         <div class='dialogbox' style='height: 100%; min-width: 100px; min-height:"+minHeight+"px' id='apollo_folder_list'></div>";
		txt += "      </td>";
		txt += "      <td style='padding-left:20px'>";
		txt += "         <div class='dialog_h2'>Library Images<span id='apollo_title_folder_name'>(All)</span></div>";			
		txt += "         <div class='dialogbox' style='height: 100%; min-width: 200px; min-height:"+minHeight+"px' id='apollo_image_library'></div>";
		txt += "      </td>";		
		txt += "   </tr>";
		txt += "</table>";
		txt += "</div>";
											
		jQuery(targetDiv).html(txt);
		
		jQuery(targetDiv).dialog( 'destroy' );
	
		jQuery(targetDiv).dialog({modal: true, width:200+jQuery(window).width()/2, height:130+minHeight, title: dialogTitle });

		
		ImagePickerDialog.paintFolders();		
		ImagePickerDialog.paintImages();
		
		jQuery(targetDiv).disableSelection();



/*



		//var txt = "<div class='box' id='apollo_image_library' style='width:100%; height:100%'>";
		var txt = "";
		
		for (var i=0; i<imageList.length; i++){
			
			var thumb_url = imageList[i].thumb_url;
			var post_id = imageList[i].post_id;
			var title = imageList[i].title;
			var width = imageList[i].width
			var height = imageList[i].height
			
			txt += "<div class='imageWrapper' align='center' onclick=\"ImagePickerDialog.onSelectImage('"+post_id+"')\">";
			
			txt += "   <img id='img+"+post_id+"' src='"+thumb_url+"' class='thumb' width='100%'/>";
			txt += "   <div class='imageTitle'>" + title + "</div>";
			txt += "   <div class='imageSize'>(" + width + ", " + height + ")</div>";

			txt += "</div>";
			
		}
						
		//jQuery(targetDiv).attr('title',dialogTitle);					
		jQuery(targetDiv).html(txt);			
		jQuery(targetDiv).dialog( 'destroy' );
	
		jQuery(targetDiv).dialog({modal: true, width:jQuery(window).width()/2, height:jQuery(window).height()/2, title: dialogTitle });
*/		
	},

	// ////////////////////////////////////////////////////////////////////////////

	paintImages : function(){
	
		var imageList = ImagePickerData.imageList;
		
		var d = new Date();
		var localTime = d.getTime();
		var localOffset = d.getTimezoneOffset() * 60000;
		var utc_date = new Date(localTime + localOffset);
		var utc_time = localTime + localOffset;
				
		var txt = "";
		
		for (var i=0; i<imageList.length; i++){
			
			var thumb_url = imageList[i].thumb_url;
			var post_id = imageList[i].post_id;
			var title = imageList[i].title;
			var width = imageList[i].width;
			var height = imageList[i].height;
			var image_folder_id = parseInt(imageList[i].folder_id);
			var added_date = new Date(imageList[i].date_added);						
			var hours_ago = (utc_time - added_date.getTime())/3600000;
						
			//alert(image_folder_id + " = " + ImagePickerDialog.folder_id);
						
			switch(ImagePickerDialog.folder_id){
			
				case ImageSelector.ID_UNASSIGNED:
					if (image_folder_id == ImageSelector.ID_ALL || image_folder_id == ImageSelector.ID_UNASSIGNED)
						txt += ImagePickerDialog.getImageHTML(post_id, thumb_url, title, width, height);	
					break;
					
				case ImageSelector.ID_LAST_1_HOUR:
					if (hours_ago <= 1){
						txt += ImagePickerDialog.getImageHTML(post_id, thumb_url, title, width, height);				
					}
					break;

				case ImageSelector.ID_LAST_24_HOURS:
					if (hours_ago <= 24){
						txt += ImagePickerDialog.getImageHTML(post_id, thumb_url, title, width, height);				
					}
					break;

				case ImageSelector.ID_LAST_7_DAYS:
					if (hours_ago <= 168){
						txt += ImagePickerDialog.getImageHTML(post_id, thumb_url, title, width, height);				
					}
					break;

				case ImageSelector.ID_ALL:
					txt += ImagePickerDialog.getImageHTML(post_id, thumb_url, title, width, height);				
					break;	

				case image_folder_id:	
					txt += ImagePickerDialog.getImageHTML(post_id, thumb_url, title, width, height);				
					break;	

				default:					
					// Nothing to do
			}			
			
		}
		
		jQuery('#apollo_image_library').html(txt);
				
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	getImageHTML : function(post_id, thumb_url, title, width, height){
	
		var txt = '';
/*		
		txt += "<div class='imageWrapper' align='center' onclick=\"ImagePickerDialog.onSelectImage('"+post_id+"')\">";
		txt += "   <img id='img+"+post_id+"' src='"+thumb_url+"' class='thumb' width='100%'/>";
		txt += "   <div class='imageTitle'>" + title + "</div>";
		txt += "   <div class='imageSize'>(" + width + ", " + height + ")</div>";
		txt += "</div>";
*/
		var titleText = title + " (" + width + "px by " + height + "px)";
		txt += "   <img id='img_"+post_id+"' src='"+thumb_url+"' class='thumb' width='50px' style='cursor:pointer' title='"+titleText+"' onclick=\"ImagePickerDialog.onSelectImage('"+post_id+"')\"/>";
		
		return txt;
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	paintFolders : function(){
		
		var folderList = ImagePickerData.folderList;
		
		var txt = "";
		
		// NOTE: Folder id's 0-9 are reserved for system folders, so can safely use these id's here
		
		// Hard-coded 'all' folder....		
		if (ImagePickerDialog.folder_id == 0){
			txt += "<div id='folder_0' class='apollo_system_folder' style='width:100%;' onclick=\"ImagePickerDialog.onSelectFolder('0')\"><div class='folder_name_selected'>Show All</div></div>";
			jQuery('#apollo_title_folder_name').html('(All)');
		}
		else {
			txt += "<div id='folder_0' class='apollo_system_folder' style='width:100%;' onclick=\"ImagePickerDialog.onSelectFolder('0')\"><div class='folder_name'>Show All</div></div>";
		}
		
		
		// Hard-coded 'unassigned' folder....		
		if (ImagePickerDialog.folder_id == ImageSelector.ID_UNASSIGNED){
			txt += "<div id='folder_"+ImageSelector.ID_UNASSIGNED+"' class='apollo_system_folder' style='width:100%;' onclick=\"ImagePickerDialog.onSelectFolder("+ImageSelector.ID_UNASSIGNED+")\"><div class='folder_name_selected'>Unassigned images</div></div>";
			jQuery('#apollo_title_folder_name').html('(Unassigned images)');
		}
		else {
			txt += "<div id='folder_1' class='apollo_system_folder' style='width:100%;' onclick=\"ImagePickerDialog.onSelectFolder("+ImageSelector.ID_UNASSIGNED+")\"><div class='folder_name'>Unassigned images</div></div>";
		}		

		// Hard-coded 'last hour' folder....		
		if (ImagePickerDialog.folder_id == ImageSelector.ID_LAST_1_HOUR){
			txt += "<div id='folder_"+ImageSelector.ID_LAST_1_HOUR+"' class='apollo_system_folder' style='width:100%;' onclick=\"ImagePickerDialog.onSelectFolder("+ImageSelector.ID_LAST_1_HOUR+")\"><div class='folder_name_selected'>Added in last hour</div></div>";
			jQuery('#apollo_title_folder_name').html('(Added in last hour)');
		}
		else {
			txt += "<div id='folder_"+ImageSelector.ID_LAST_1_HOUR+"' class='apollo_system_folder' style='width:100%;' onclick=\"ImagePickerDialog.onSelectFolder("+ImageSelector.ID_LAST_1_HOUR+")\"><div class='folder_name'>Added in last hour</div></div>";
		}	

		// Hard-coded 'added last 24 hours' folder....		
		if (ImagePickerDialog.folder_id == ImageSelector.ID_LAST_24_HOURS){
			txt += "<div id='folder_"+ImageSelector.ID_LAST_24_HOURS+"' class='apollo_system_folder' style='width:100%;' onclick=\"ImagePickerDialog.onSelectFolder("+ImageSelector.ID_LAST_24_HOURS+")\"><div class='folder_name_selected'>Added in last 24 hours</div></div>";
			jQuery('#apollo_title_folder_name').html('(Added in last 24 hours)');
		}
		else {
			txt += "<div id='folder_"+ImageSelector.ID_LAST_24_HOURS+"' class='apollo_system_folder' style='width:100%;' onclick=\"ImagePickerDialog.onSelectFolder("+ImageSelector.ID_LAST_24_HOURS+")\"><div class='folder_name'>Added in last 24 hours</div></div>";
		}		
		
		
		// Now paint user's folders.............		
		

		for (var i=0; i<folderList.length; i++){

			var folder_name = ApolloUtils.htmlEncode(folderList[i].name);
			var folder_id = folderList[i].id;
			
			//alert(folder_name + " " + folder_id);
			
			if (folder_id == ImagePickerDialog.folder_id){
				jQuery('#apollo_title_folder_name').html('('+folder_name+')');
				txt += "<div id='folder_"+folder_id+"' class='apollo_folder folder_with_menu' style='width:100%;' title='Right click to edit' onclick=\"ImagePickerDialog.onSelectFolder('"+folder_id+"')\"><div class='folder_name folder_name_selected'>"+folder_name+"</div></div>";
			}
			else {
				txt += "<div id='folder_"+folder_id+"' class='apollo_folder folder_with_menu' style='width:100%;' title='Right click to edit' onclick=\"ImagePickerDialog.onSelectFolder('"+folder_id+"')\"><div class='folder_name'>"+folder_name+"</div></div>";
			}

			
		}
		
		jQuery('#apollo_folder_list').html(txt);
		
		jQuery('.apollo_folder').droppable({
				drop: ImagePickerDialog.onAddToFolder,
				over: function(ev, ui) {jQuery(this).addClass( 'apollo_folder_droppable_hover' );},
				out: function(ev, ui) {jQuery(this).removeClass( 'apollo_folder_droppable_hover' );}
			});			
				
	  //  jQuery(".folder_with_menu").contextMenu({menu: "folderMenu"}, function(action, el, pos){ImagePickerDialog.onMenuItem(action, el)});

		jQuery("#apollo_folder_list").disableSelection();
				
	},
	
	// ////////////////////////////////////////////////////////////////////////////
		
	onSelectFolder : function(folder_id){
		ImagePickerDialog.folder_id = parseInt(folder_id);
		ImagePickerDialog.paintImages();
		ImagePickerDialog.paintFolders();				
	},	
	
	// ////////////////////////////////////////////////////////////////////////////

	/**
	* Get the image list for the currently selected gallery page
	*/
	onSelectImage : function(postID){
	
		//alert('Selected image' + postID + ' URL: ' + ImagePickerData.commandURL);
		
		var paras = '';
		
		if (ImagePickerDialog.mode == ImagePickerDialog.MODE_GALLERY_THUMB){
			paras = {cmd: 8, page_id: ImagePickerDialog.para1, theme_para_id: ImagePickerDialog.themeParaID, image_id: postID, gallery_no: ImagePickerDialog.para2};
		}
		else {			
			if (ImagePickerDialog.isGlobal){
				paras = {cmd: 5, blog_id: ImagePickerDialog.para1, theme_para_id: ImagePickerDialog.themeParaID, para_value: postID};
			}
			else {
				paras = {cmd: 6, page_post_id: ImagePickerDialog.para1, theme_para_id: ImagePickerDialog.themeParaID, para_value: postID};
			}
		}
												
		jQuery.ajax({
			url: ImagePickerData.commandURL,
			dataType: "json",
			data: paras,
			success: function(ret){ImagePickerDialog.onImageSelected(ret);}
		});	
			
	},
	
	// ////////////////////////////////////////////////////////////////////////////
	
	onImageSelected : function(msg){
	
		//eval("var msg = ("+ret+")");
						
		if (msg.result != "ok"){
			ApolloDialog.alert('error!');	
		}
		else {
			// Force a page reload
			window.location.href=window.location.href
		}
			
		jQuery('#apolloImagePickerDialog').dialog('close');		
	}
	
		
}

