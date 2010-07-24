/**
* Javascript class that allows a user to pick an image from their wordpress media library
* The image data is assumed to be in the class ImagePickerData see the fucntion 
* echoImagePickerJSImageData in plugin_functions.php
*
* @since 24th March, 2010
*/
var ImageSelector = {

	folder_id : 0,
	
	MODE_EDIT_GALLERY : 0,
	MODE_ORG_MEDIA : 1,
	
	mode : 1,
	
	ID_ALL : 0, // hard-coded folder id for all images
	ID_UNASSIGNED : 1, // hard-coded folder id for unassigned images
	ID_LAST_24_HOURS : 2, // hard-coded folder id for images uploaded in last 24 hrs
	ID_LAST_7_DAYS : 3, // hard-coded folder id for images uploaded in last 7 days
	ID_LAST_1_HOUR : 4, // hard-coded folder id for images uploaded in last 1 hrs
	
	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	*
	*/
	paint : function(mode){
	
		ImageSelector.mode = mode;
		
		folder_name = "(All)";
		
		if (ImagePickerData.folderList.length >= 1){
			ImageSelector.folder_id = ImagePickerData.folderList[0].id;	
			folder_name = ImagePickerData.folderList[0].folder_name;
		}
		
		var minHeight = 550;

		if (mode == ImageSelector.MODE_EDIT_GALLERY){
			minHeight = 300;
		}
		
		var txt = "";
		
		//txt += "<br/>";
		
		txt += "<table width='100%' cellspacing='0px' style='padding-right:20px'>";
		txt += "   <tr valign='middle'>";
		txt += "      <td width='65px'>";
		txt += "         <h2>Folders</h2>";
		txt += "      </td>";
		txt += "      <td align='left' style='padding-top:8px' width='185px'>";
		txt += "         <div class='nav_buttons'<div class='apollo_add_button' style='float:left' onclick='ImageSelector.addFolder()'></div>";
		txt += "      </td>";
		txt += "      <td style='padding-left:20px'>";

		if (mode == ImageSelector.MODE_EDIT_GALLERY){
			txt += "     <h2>Library Images<span id='apollo_title_folder_name'>"+folder_name+"</span><span id='apollo_title_feedback'></span></h2>";			
		}
		else {
			txt += "     <h2>Library Images<span id='apollo_title_folder_name'>"+folder_name+"</span>";
			txt += "         <span id='apollo_title_feedback'></span>";
			txt += "         <span class='view_options' onclick='ImageSelector.onDeselectAll()'>clear all</span>";
			txt += "         <span class='view_options' onclick='ImageSelector.onSelectAll()'>select all</span>";
			txt += "         <span id='apollo_show_titles' class='view_options' onclick='ImageSelector.onShowDetails()'>show details</span>";
			txt += "     </h2>";			
		}
		
		txt += "      </td>";		
		txt += "   </tr>";
		
		txt += "   <tr valign='top'>";
		txt += "      <td colspan='2' width='250px' height='100%'>";
		txt += "         <div class='dialogbox' style='min-width: 100px; min-height:"+minHeight+"px' id='apollo_folder_list'></div>";
		txt += "      </td>";
		txt += "      <td style='padding-left:20px'>";
		txt += "         <div class='dialogbox' style='min-width: 200px; min-height:"+minHeight+"px' id='apollo_image_library'></div>";
		txt += "      </td>";		
		txt += "   </tr>";
		txt += "</table>";
				
		txt += "<div id='imageEditDialog'></div>";
		
						
		// Right click pop-up menu....
		txt += "<ul id='folderMenu' class='rightClickMenu'>";
		txt += "	<li class='edit'><a href='#edit'>Rename</a></li>";
		txt += "	<li class='delete'><a href='#delete'>Delete</a></li>";
		txt += "	<li class='quit separator'><a href='#quit'>Cancel</a></li>";
		txt += "</ul>";


		txt += "<ul id='imageMenu' class='rightClickMenu'>";
		txt += "	<li class='edit'><a href='#edit_image'>Edit Information</a></li>";
		//txt += "	<li class='delete'><a href='#delete_image'>Delete</a></li>";
		txt += "	<li class='quit separator'><a href='#quit'>Cancel</a></li>";
		txt += "</ul>";

							
		//jQuery(targetDiv).attr('title',dialogTitle);					
		jQuery('#ApolloImageSelector').html(txt);
		
		ImageSelector.paintFolders();		
		ImageSelector.paintImages();
		
		jQuery('#ApolloImageSelector').disableSelection();
		jQuery('#ApolloImageSelector').noContext();
		
		// Disable right click menu except where we want it
		//jQuery('#ApolloImageSelector').bind("rightClickMenu",function(e){return false;}); 		
		
	},

	// ////////////////////////////////////////////////////////////////////////////

	onDeselectAll : function(){
		//jQuery('.multiselected').draggable('destroy');
		//jQuery('.thumb').removeClass('multiselected');				
		//jQuery('.imageWrapper').removeClass('multiselected');	
		ImageSelector.paintImages();			
	},
	
	onSelectAll : function(){	
		ImageSelector.paintImages();			
		if (ImageSelector.showImageDetails){
			jQuery('.imageWrapper').addClass('multiselected');		
		}
		else {
			jQuery('.thumb').addClass('multiselected');				
		}
		setTimeout('ImageSelector.makeMultiSelectedDraggable()', 300);
	},

	// ////////////////////////////////////////////////////////////////////////////
	
	showImageDetails : false,
	
	/**
	* Toggles the display of image details
	*/
	onShowDetails : function(){
		
		ImageSelector.showImageDetails = !ImageSelector.showImageDetails;
		
		if (ImageSelector.showImageDetails){
			jQuery('#apollo_show_titles').html("hide details");
		}
		else {
			jQuery('#apollo_show_titles').html("show details");
		}
		
		ImageSelector.paintImages();
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	paintImages : function(){
		
		var imageList = ImagePickerData.imageList;
		
		var txt = "";

		var d = new Date();
		var localTime = d.getTime();
		var localOffset = d.getTimezoneOffset() * 60000;
		var utc_date = new Date(localTime + localOffset);
		var utc_time = localTime + localOffset;
				
		//alert(ImageSelector.folder_id + " " + ImageSelector.ID_LAST_24_HOURS);
				
		for (var i=0; i<imageList.length; i++){

			var thumb_url = imageList[i].thumb_url;
			var post_id = imageList[i].post_id;
			var title = imageList[i].title;
			var width = imageList[i].width;
			var height = imageList[i].height;
			var image_folder_id = parseInt(imageList[i].folder_id);
			var added_date = new Date(imageList[i].date_added);						
			var hours_ago = (utc_time - added_date.getTime())/3600000;
			
			//ImageSelector.showMessage(added_date + "  |||   " + utc_date + " Delta = " + hours_ago);
			//ImageSelector.showMessage(" Delta = " + hours_ago);
			
			switch(ImageSelector.folder_id){
			
				case ImageSelector.ID_UNASSIGNED:
					if (image_folder_id == ImageSelector.ID_ALL)
						txt += ImageSelector.getImageHTML(post_id, thumb_url, title, width, height);	
					break;
					
				case ImageSelector.ID_LAST_1_HOUR:
					if (hours_ago <= 1){
						txt += ImageSelector.getImageHTML(post_id, thumb_url, title, width, height);				
					}
					break;

				case ImageSelector.ID_LAST_24_HOURS:
					if (hours_ago <= 24){
						txt += ImageSelector.getImageHTML(post_id, thumb_url, title, width, height);				
					}
					break;

				case ImageSelector.ID_LAST_7_DAYS:
					if (hours_ago <= 168){
						txt += ImageSelector.getImageHTML(post_id, thumb_url, title, width, height);				
					}
					break;

				case ImageSelector.ID_ALL:
					txt += ImageSelector.getImageHTML(post_id, thumb_url, title, width, height);				
					break;	

				case image_folder_id:	
					txt += ImageSelector.getImageHTML(post_id, thumb_url, title, width, height);				
					break;	

				default:					
					// Nothing to do
			}
			
		}
				
		jQuery('#apollo_image_library').html(txt);
		jQuery('#apollo_image_library').noContext();


		var dragClass = '.thumb';
		
		if (ImageSelector.showImageDetails){
			dragClass = ".imageWrapper";
		}
		

		jQuery(dragClass).mousedown( function(e) {					
			
			var evt = e;					
			
			jQuery(this).mouseup( 
				function() {
								
					//jQuery(this).unbind('mousedown');
					jQuery(this).unbind('mouseup');
					
					if( evt.button == 0 ) {
						if (evt.shiftKey){
							// Shift-left click
							ImageSelector.onShiftClick(e, this);
						}
						else if (evt.ctrlKey || evt.altKey){
							// Ctrl-left click
							ImageSelector.onCtrlClick(e, this);
						}
						else {
							// Just a left click
							ImageSelector.onStartClick(e, this);
						}
						return false;
					} 
					else if( evt.button == 2 ) {
						// Right click
						ImageSelector.onRightClickImage(e, this);
						return true;
					}
				}
			)
		});
				

		//jQuery(dragClass).rightClick( function(e) {ImageSelector.onRightClickImage(e, this);});		
		
	},

	// ////////////////////////////////////////////////////////////////////////////

	isDragging : false,
	shiftSelectStarted : false,
	shiftSelectStartedID : '',
	
	onStartClick : function(e, obj){
		
			//if (ImageSelector.isDragging) return;
			
			if (ImageSelector.shiftSelectStarted){
				jQuery('.multiselected').removeClass('multiselected');
			}
			
			//if (ImageSelector.isDragging) return;		
			if (jQuery(obj).is('.multiselected')){
				ImageSelector.shiftSelectStarted = false;
				jQuery(obj).removeClass('multiselected');				
			}
			else {
				ImageSelector.shiftSelectStarted = true;
				ImageSelector.shiftSelectStartedID = jQuery(obj).attr('id');
				jQuery(obj).addClass('multiselected');
				setTimeout('ImageSelector.makeMultiSelectedDraggable()', 300);
			}
		

	},

	// ////////////////////////////////////////////////////////////////////////////
	
	onCtrlClick : function(e, obj){
					
		if (jQuery(obj).is('.multiselected')){
			jQuery(obj).removeClass('multiselected');				
		}
		else {
			jQuery(obj).addClass('multiselected');
		}
		
	},
		
	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	* Respond to a shift-click event
	*/
	onShiftClick : function(e, obj){
										
		var id = jQuery(obj).attr('id');
			
	  	jQuery('.thumb').removeClass('multiselected')
			
		if (ImageSelector.shiftSelectStarted){

			var foundStart = false;
			var foundEnd = false;
					
	  		jQuery('.thumb').each(	
	  			function(){	  				
	  				if (!foundEnd){
		  				if (jQuery(this).attr('id') == ImageSelector.shiftSelectStartedID){
		  					foundStart = true;
		  				}
		  				
		  				if (foundStart){
		  					jQuery(this).addClass('multiselected');
		  				}
		  				
		  				if (foundStart && jQuery(this).attr('id') == id){
		  					foundEnd = true;
		  				}
	  				}	  				
	  			}
	  		);
	  		
	  		// If we didn't find the end, try going backwards
	  		if (!foundEnd){
	  		
	  			jQuery('.multiselected').removeClass('multiselected')
	  			
				foundStart = false;
				foundEnd = false;
	  		
		  		jQuery('.thumb').each(	
		  			function(){	  				
		  				if (!foundEnd){
		  				
			  				if (jQuery(this).attr('id') == id){
			  					foundStart = true;
			  				}
		  							  				
			  				if (foundStart){
			  					jQuery(this).addClass('multiselected');
			  				}
			  				
			  				if (jQuery(this).attr('id') == ImageSelector.shiftSelectStartedID){
			  					foundEnd = true;
			  				}
			  				
		  				}	  				
		  			}
		  		);
	  		}
		
//			ImageSelector.makeMultiSelectedDraggable();
			setTimeout('ImageSelector.makeMultiSelectedDraggable()', 300);
			
		}
		else {
			ImageSelector.onStartClick(e,obj);
		}

	},
					
	// ////////////////////////////////////////////////////////////////////////////

	/**
	* Respond to a shift/alt/ctrl-click event
	*/
	onCtrlClick : function(e, obj){
	
		//e.stopPropagation();
		//jQuery(obj).unbind('click')
			/*		
		if (jQuery(obj).is('.multiselected')){
			jQuery(obj).removeClass('multiselected');				
			jQuery(obj).draggable({revert: true, zIndex: 300});
		}
		else {
			jQuery(obj).draggable("destroy");
			jQuery(obj).addClass('multiselected');
			setTimeout('ImageSelector.makeMultiSelectedDraggable()', 300);
		}
		*/
	},
	
	// ////////////////////////////////////////////////////////////////////////////
				
	makeMultiSelectedDraggable : function(){
	
		jQuery('.multiselected').draggable({		
				revert: true,
				zIndex: 300,
			  	helper: function(){
			  		//return "<div>sdgsgsg</div>"			  		
			  		var txt = "<div id='multidrag_container'>";
			  		var ct = 0;
			  		
			  		jQuery('.multiselected').each(	
			  			function(){
			  				if (ct < 10){
				  				var offset = ct * 10; ct++;
				  				var src = jQuery(this).attr('src');
				  				var id = jQuery(this).attr('id');
				  				var style = "position: absolute; top: " + offset + "px; left:" + offset + "px;";
				  				txt += "<img id='"+id+"' src='"+src+"' class='dragged_thumb' width='50px' height='50px' style='"+style+"'>";
			  				}
			  			}
			  		);
			  		
			  		txt += "</div>";
			  		
			  		return txt;
			  					  		
    				//var selected = jQuery('.multiselected');
					//if (selected.length === 0) {
					//	selected = jQuery(this);
					//}
					//var container = jQuery('<div/>').attr('id', 'draggingContainer');
					//container.append(selected.clone());
					//return container;					 					
				}
			}
		);
	},
			
	// ////////////////////////////////////////////////////////////////////////////
	
	getImageHTML : function(post_id, thumb_url, title, width, height){

		var txt = "";

		if (ImageSelector.showImageDetails){
			txt += "<div class='imageWrapper' id='img+"+post_id+"' align='center' >";		
			txt += "   <img id='img+"+post_id+"' src='"+thumb_url+"' class='thumb' width='100%'/>";
			txt += "   <div class='imageTitle'>" + title + "</div>";
			txt += "   <div class='imageSize'>(" + width + ", " + height + ")</div>";
			txt += "</div>";		
		}
		else {
			txt += "   <img id='img_"+post_id+"' src='"+thumb_url+"' class='thumb' width='50px'/>";
		}
				
		
		// onclick='ImageSelector.onSelectImage("+post_id+")'
		return txt;
	},

	// ////////////////////////////////////////////////////////////////////////////
	
	paintFolders : function(){
		
		var folderList = ImagePickerData.folderList;
		
		var txt = "";
		
		// NOTE: Folder id's 0-9 are reserved for system folders, so can safely use these id's here
		
		// Hard-coded 'all' folder....		
		if (ImageSelector.folder_id == 0){
			txt += "<div id='folder_0' class='apollo_system_folder' style='width:100%;' onclick=\"ImageSelector.onSelectFolder('0')\"><div class='folder_name_selected'>Show All</div></div>";
			jQuery('#apollo_title_folder_name').html('(All)');
		}
		else {
			txt += "<div id='folder_0' class='apollo_system_folder' style='width:100%;' onclick=\"ImageSelector.onSelectFolder('0')\"><div class='folder_name'>Show All</div></div>";
		}
		
		
		// Hard-coded 'unassigned' folder....		
		if (ImageSelector.folder_id == ImageSelector.ID_UNASSIGNED){
			txt += "<div id='folder_"+ImageSelector.ID_UNASSIGNED+"' class='apollo_folder apollo_system_folder' style='width:100%;' onclick=\"ImageSelector.onSelectFolder("+ImageSelector.ID_UNASSIGNED+")\"><div class='folder_name_selected'>Unassigned images</div></div>";
			jQuery('#apollo_title_folder_name').html('(Unassigned images)');
		}
		else {
			txt += "<div id='folder_1' class='apollo_folder apollo_system_folder' style='width:100%;' onclick=\"ImageSelector.onSelectFolder("+ImageSelector.ID_UNASSIGNED+")\"><div class='folder_name'>Unassigned images</div></div>";
		}		

		// Hard-coded 'last hour' folder....		
		if (ImageSelector.folder_id == ImageSelector.ID_LAST_1_HOUR){
			txt += "<div id='folder_"+ImageSelector.ID_LAST_1_HOUR+"' class='apollo_system_folder' style='width:100%;' onclick=\"ImageSelector.onSelectFolder("+ImageSelector.ID_LAST_1_HOUR+")\"><div class='folder_name_selected'>Added in last hour</div></div>";
			jQuery('#apollo_title_folder_name').html('(Added in last hour)');
		}
		else {
			txt += "<div id='folder_"+ImageSelector.ID_LAST_1_HOUR+"' class='apollo_system_folder' style='width:100%;' onclick=\"ImageSelector.onSelectFolder("+ImageSelector.ID_LAST_1_HOUR+")\"><div class='folder_name'>Added in last hour</div></div>";
		}	

		// Hard-coded 'added last 24 hours' folder....		
		if (ImageSelector.folder_id == ImageSelector.ID_LAST_24_HOURS){
			txt += "<div id='folder_"+ImageSelector.ID_LAST_24_HOURS+"' class='apollo_system_folder' style='width:100%;' onclick=\"ImageSelector.onSelectFolder("+ImageSelector.ID_LAST_24_HOURS+")\"><div class='folder_name_selected'>Added in last 24 hours</div></div>";
			jQuery('#apollo_title_folder_name').html('(Added in last 24 hours)');
		}
		else {
			txt += "<div id='folder_"+ImageSelector.ID_LAST_24_HOURS+"' class='apollo_system_folder' style='width:100%;' onclick=\"ImageSelector.onSelectFolder("+ImageSelector.ID_LAST_24_HOURS+")\"><div class='folder_name'>Added in last 24 hours</div></div>";
		}		
		
		

		for (var i=0; i<folderList.length; i++){

			var folder_name = ApolloUtils.htmlEncode(folderList[i].name);
			var folder_id = folderList[i].id;
			
			//alert(folder_name + " " + folder_id);
			
			if (folder_id == ImageSelector.folder_id){
				jQuery('#apollo_title_folder_name').html('('+folder_name+')');
				txt += "<div id='folder_"+folder_id+"' class='apollo_folder folder_with_menu' style='width:100%;' title='Right click to edit' onclick=\"ImageSelector.onSelectFolder('"+folder_id+"')\"><div class='folder_name folder_name_selected'>"+folder_name+"</div></div>";
			}
			else {
				txt += "<div id='folder_"+folder_id+"' class='apollo_folder folder_with_menu' style='width:100%;' title='Right click to edit' onclick=\"ImageSelector.onSelectFolder('"+folder_id+"')\"><div class='folder_name'>"+folder_name+"</div></div>";
			}

			
		}
		
		jQuery('#apollo_folder_list').html(txt);
		
		jQuery('.apollo_folder').droppable({
				drop: ImageSelector.onAddToFolder,
				over: function(ev, ui) {jQuery(this).addClass( 'apollo_folder_droppable_hover' );},
				out: function(ev, ui) {jQuery(this).removeClass( 'apollo_folder_droppable_hover' );}
			});			

				
	   // jQuery(".folder_with_menu").rightClickMenu({menu: "folderMenu"}, function(action, el, pos){ImageSelector.onMenuItem(action, el)});
		jQuery(".folder_with_menu").rightClick( function(e) {ImageSelector.onRightClickFolder(e, this);});

		jQuery("#apollo_folder_list").disableSelection();
				
	},

	// ////////////////////////////////////////////////////////////////////////////

	onRightClickFolder : function(e, obj){

		e.stopPropagation();
		
		//var x = e.pageX - jQuery('#adminmenu').width() - 30;
		//var y = e.pageY - jQuery('#wphead').height() - jQuery('#update-nag').height();		
		var x = e.pageX;
		var y = e.pageY;		

		jQuery('#folderMenu').css('top',y);
		jQuery('#folderMenu').css('left',x);
		jQuery('#folderMenu').show();

		jQuery('#folderMenu .edit').unbind('click');
		jQuery('#folderMenu .delete').unbind('click');
		jQuery('#folderMenu .quit').unbind('click');

		jQuery('#folderMenu .edit').click(function(){ImageSelector.onMenuItem('rename_folder', obj)});
		jQuery('#folderMenu .delete').click(function(){ImageSelector.onMenuItem('delete_folder', obj)});
		jQuery('#folderMenu .quit').click(function(){ImageSelector.onMenuItem('quit', obj)});
		
	},
	
	onRightClickImage : function(e, obj){

		e.stopPropagation();

		//var x = e.pageX - jQuery('#adminmenu').width() - 30;
		//var y = e.pageY - jQuery('#wphead').height() - jQuery('#update-nag').height();		
		var x = e.pageX;
		var y = e.pageY;		

		jQuery('#imageMenu').css('top',y);
		jQuery('#imageMenu').css('left',x);
		jQuery('#imageMenu').show();

		jQuery('#imageMenu .edit').unbind('click');
		jQuery('#imageMenu .delete').unbind('click');
		jQuery('#imageMenu .quit').unbind('click');
		
		jQuery('#imageMenu .edit').click(function(){ImageSelector.onMenuItem('edit_image', obj)});
		jQuery('#imageMenu .delete').click(function(){ImageSelector.onMenuItem('delete_image', obj)});
		jQuery('#imageMenu .quit').click(function(){ImageSelector.onMenuItem('quit', obj)});
		
	},
		
	// ////////////////////////////////////////////////////////////////////////////

	messageTimeout : -1,
	
	showMessage : function(msg){
		jQuery('#apollo_title_feedback').html(msg);
		jQuery('#apollo_title_feedback').show();
		if (ImageSelector.messageTimeout != -1){
			clearTimeout(ImageSelector.messageTimeout)
		}
		setTimeout('ImageSelector.hideMessage()', 5000);
	},
	
	hideMessage : function(){
		jQuery('#apollo_title_feedback').hide();
	},
	
	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	* Respond to the user selecting a menu item
	*/
	onMenuItem : function(item, selectedElement){
		
		jQuery('#imageMenu').hide();
		jQuery('#folderMenu').hide();
		
		
		var divID = jQuery(selectedElement).attr('id');
		
		if (item == 'rename_folder' || item == 'delete_folder'){
			var name = jQuery('#'+divID + ' .folder_name').html();
			var folder_id = parseInt(divID.substr(7));
		}
		else {
			var image_post_id = parseInt(divID.substr(4));
		}
		
		
		// Process events related to folders...					
		if (item == 'rename_folder'){
			ImageSelector.makeFolderNameEditable(folder_id);
		}
		else if (item == 'delete_folder'){		
			ApolloDialog.confirm("Are you sure you want to delete this folder? This can not be undone.", function(){ImageSelector.deleteFolder(folder_id);});
		}
		
		// Process events related to images...											
		else if (item == 'edit_image'){
			ImageEditDialog.show('#imageEditDialog', image_post_id);
		}
		else if (item == 'delete_image'){
			ApolloDialog.alert('feature coming soon');
		}
		
	},

	// ////////////////////////////////////////////////////////////////////////////

	makeFolderNameEditable : function(folder_id){
		
		var divID = '#folder_' + folder_id;
		var name = jQuery(divID + ' .folder_name').html();
		
		jQuery(divID).attr('onclick','');
		jQuery(divID).html("<input id='folder_name_edit' style='margin-left:30px' type='text' value='"+name+"' onblur='ImageSelector.paintFolders()'/>");
		
		jQuery("#folder_name_edit").keypress(function (e) {
			if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
				ImageSelector.renameFolder(folder_id, jQuery("#folder_name_edit").val());
			}
	    });
		
		jQuery("#folder_name_edit").focus();
	},
		
	// ////////////////////////////////////////////////////////////////////////////
		
	onSelectFolder : function(folder_id){
		ImageSelector.folder_id = parseInt(folder_id);
		ImageSelector.paintImages();
		ImageSelector.paintFolders();				
	},
			
	// ////////////////////////////////////////////////////////////////////////////

	deleteFolder : function(folderdId){
	
		var paras = {cmd: 14, folder_id: folderdId};
												
		jQuery.ajax({
			url: ImagePickerData.commandURL,
			dataType: "text",
			data: paras,
			success: function(ret){ImageSelector.onFolderDeleted(ret, folderdId)}	
		});	
	},
	
	onFolderDeleted : function(res, folder_id){

		ImageSelector.showMessage("Folder deleted");
		
		var temp = new Array();
		
		for (var i=0; i<ImagePickerData.folderList.length; i++){
		
			if (ImagePickerData.folderList[i].id != folder_id){
				temp.push(ImagePickerData.folderList[i]);
			}
			
		}

		ImagePickerData.folderList = temp;
		ImageSelector.paintFolders()	
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	addFolder : function(folderName){

		if (folderName == undefined){
			folderName = 'new folder';
		}
		
		var paras = {cmd: 12, folder_name: folderName};
												
		jQuery.ajax({
			url: ImagePickerData.commandURL,
			dataType: "json",
			data: paras,
			success: function(ret){ImageSelector.onAddedFolder(ret, folderName)}
		});	
	},
	
	onAddedFolder : function(msg, folderName){
		
		//eval("var msg = ("+ret+")");
						
		if (msg.result == "ok"){
			var folder_id = msg.folder_id;
			
			var temp = new Array();
			temp.id = folder_id;
			temp.name = folderName;
			ImagePickerData.folderList.push(temp);
			ImageSelector.paintFolders();		
			ImageSelector.makeFolderNameEditable(folder_id);					
			
			ImageSelector.showMessage("Folder added");
			
		}					
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	getFolderName : function(folder_id){
	
		if (folder_id == ImageSelector.ID_UNASSIGNED){
			return "Unassigned";
		}
		
		for (var i=0; i<ImagePickerData.folderList.length; i++){
			if (ImagePickerData.folderList[i].id == folder_id){
				return ImagePickerData.folderList[i].name;
			}			
		}
		
		return "? ("+folder_id+")";
	},
			
	// ////////////////////////////////////////////////////////////////////////////

	/**
	* Rename a folder
	*/
	renameFolder : function(folderId, folderName){
		var paras = {cmd: 11, folder_id: folderId, folder_name: folderName};
												
		jQuery.ajax({
			url: ImagePickerData.commandURL,
			dataType: "text",
			data: paras,
			success: function(ret){ImageSelector.onFolderRenamed(ret, folderId, folderName)}
		});	
	},
	
	onFolderRenamed : function(ret, folderId, folderName){

		for (var i=0; i<ImagePickerData.folderList.length; i++){
			if (ImagePickerData.folderList[i].id == folderId){
				ImagePickerData.folderList[i].name = folderName;
				break;
			}
		}

		ImageSelector.paintFolders()
	},				

	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	* Get the image list for the currently selected gallery page. Note that even for multi-drag
	* the object dropped on the folder is still the source thumbnail, and not the image that is
	* show during the drag (defined by the helper function)
	*/
	onAddToFolder : function(event, ui){

		var imgID = parseInt(jQuery(ui.draggable).attr('id').substring(4));						
		var folderID = parseInt(jQuery(this).attr('id').substring(7));	// format folder_xxx

		// Check to see if there are images multi-selected, and whether this image
		// is one of them
		var imgList = new Array();
		var is_multiDrag = false;
		
  		jQuery('.multiselected').each(	
  			function(){
				var multi_imgID = parseInt(jQuery(this).attr('id').substring(4));
				imgList.push(multi_imgID);	
				if (imgID == multi_imgID){
					is_multiDrag = true;
				}					
  			}
  		);		
		
		// Its possible that the user didn't drag a multi-selected image, so in that case
		// we want to ignore anything that is multi-selected
		if (!is_multiDrag){
			imgList = new Array();
			imgList[0] = imgID;
		}

		// Now assign all the images in the image list 
		for (var i=0; i<imgList.length; i++){
		
			var tempImgID = imgList[i];
			
			if (folderID == ImageSelector.ID_UNASSIGNED || folderID > 9){		
				
				var paras = {cmd: 10, media_post_id: tempImgID, folder_id: folderID};
														
				jQuery.ajax({
					url: ImagePickerData.commandURL,
					dataType: "json",
					data: paras,
					success: function(ret){ImageSelector.onAddedToFolder(ret)}
				});
			}	
		}

		//alert(jQuery(ui.draggable).html());
		//alert(jQuery(ui.draggable).attr('id'));
		
		jQuery(this).removeClass( 'apollo_folder_droppable_hover' );
			
	},
	
	onAddedToFolder : function(msg){
								
		if (msg.result == "ok"){

			var imgID = msg.media_post_id;
			var folderID = msg.folder_id;
					
			for (var i=0; i<ImagePickerData.imageList.length; i++){
				
				if (ImagePickerData.imageList[i].post_id == imgID){
					ImagePickerData.imageList[i].folder_id = folderID;						
					break;
				}
			}
			
			ImageSelector.paintImages();

			if (folderID == 0){
				ImageSelector.showMessage("Image removed from folder");			
			}
			else {
				ImageSelector.showMessage("Image added to folder <i>" + ImageSelector.getFolderName(folderID) + "</i>");			
			}

			
		}
		else if(msg.result == 'duplicate'){
			ImageSelector.showMessage("Image already in folder  <i>" + ImageSelector.getFolderName(folderID) + "</i>");			
		}
		
	}
		
}