/**
* Javascript class that allows a user to pick an image from their wordpress media library
* The image data is assumed to be in the class ImagePickerData see the fucntion 
* echoImagePickerJSImageData in plugin_functions.php
*
* @since 24th March, 2010
*/
var ImageSelector = {

	folder_id : 0,
	targetDiv : '',
	
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
	paint : function(mode, targetDiv){
	
		ImageSelector.mode = mode;
		ImageSelector.targetDiv = targetDiv;
		
		folder_name = "(All)";
		
		if (DataStore.m_folderList.length >= 1){
			ImageSelector.folder_id = DataStore.m_folderList[0].id;	
			folder_name = DataStore.m_folderList[0].folder_name;
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
			//txt += "         <span id='apollo_show_titles' class='view_options' onclick='ImageSelector.onShowDetails()'>show details</span>";
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

							
		//$(targetDiv).attr('title',dialogTitle);					
		$(ImageSelector.targetDiv).html(txt);
		
		ImageSelector.paintFolders();		
		ImageSelector.paintImages();
		
		$(ImageSelector.targetDiv).disableSelection();
		$(ImageSelector.targetDiv).noContext();
		
		// Disable right click menu except where we want it
		//$(ImageSelector.targetDiv).bind("rightClickMenu",function(e){return false;}); 		
		
	},

	// ////////////////////////////////////////////////////////////////////////////

	onDeselectAll : function(){
		ImageSelector.paintImages();			
	},
	
	onSelectAll : function(){	
		ImageSelector.paintImages();			
		$('.thumb').addClass('multiselected');				
		setTimeout('ImageSelector.makeMultiSelectedDraggable()', 300);
	},

	// ////////////////////////////////////////////////////////////////////////////
	
	paintImages : function(){
		
		var imageList = DataStore.m_mediaList;
		
		var txt = "";

		var d = new Date();
		var localTime = d.getTime();
		var localOffset = d.getTimezoneOffset() * 60000;
		var utc_date = new Date(localTime + localOffset);
		var utc_time = localTime + localOffset;
								
		//alert(ImageSelector.folder_id + " " + ImageSelector.ID_LAST_24_HOURS);
				
		for (var i=0; i<imageList.length; i++){

			var thumb_url = imageList[i].thumb_url;
			var post_id = imageList[i].id;
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
					if (image_folder_id == ImageSelector.ID_ALL || image_folder_id == ImageSelector.ID_UNASSIGNED)
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
				
		$('#apollo_image_library').html(txt);
		$('#apollo_image_library').noContext();

				
		if (ImageSelector.mode == ImageSelector.MODE_EDIT_GALLERY){
			$(".thumb").draggable({revert: true, zIndex: 300});				
		}
		else {

			//$(dragClass).multiDrag();
			

			$('.thumb').mousedown( function(e) {					
				
				var evt = e;					
				
				$(this).mouseup( 
					function() {
									
						//$(this).unbind('mousedown');
						$(this).unbind('mouseup');
						
						//alert("Ctrl:"+evt.ctrlKey + " Alt:" + evt.altKey + " Shift:" + evt.shiftKey);
						
						if (evt.ctrlKey){
							// Ctrl-left click
							ImageSelector.onAltClick(e, this);
						}
						else if( evt.button == 0 ) {
							if (evt.shiftKey){
								// Shift-left click
								ImageSelector.onShiftClick(e, this);
							}
							else if (evt.altKey){
								// Ctrl-left click
								ImageSelector.onAltClick(e, this);
							}
							else {
								// Just a left click
								ImageSelector.onStartClick(e, this);
							}
							return false;
						} 
						else if( evt.button == 2) {
							// Right click
							ImageSelector.onRightClickImage(e, this);
							return true;
						}
					}
				)
			});

		}		
		
	},

	// ////////////////////////////////////////////////////////////////////////////

	isDragging : false,
	shiftSelectStarted : false,
	shiftSelectStartedID : '',
	
	onStartClick : function(e, obj){
		
			var id = $(obj).attr('id');
			var isSelected = $(obj).is('.multiselected');
			
			if (ImageSelector.shiftSelectStarted){
				// This clears the current selection
				$('.multiselected').removeClass('multiselected');
			}
			
			//if (ImageSelector.isDragging) return;		
			if (isSelected){
				ImageSelector.shiftSelectStarted = false;
				ImageSelector.paintImages();	
			}
			else {
				ImageSelector.shiftSelectStartedID = id;
				ImageSelector.shiftSelectStarted = true;
				ImageSelector.paintImages();			
				$('#'+id).addClass('multiselected');
				setTimeout('ImageSelector.makeMultiSelectedDraggable()', 300);
			}
		

	},

	// ////////////////////////////////////////////////////////////////////////////
	
	onAltClick : function(e, obj){
							
		var id = $(obj).attr('id');
		var isSelected = $(obj).is('.multiselected');
			
		if (isSelected){
			$('#'+id).removeClass('multiselected');
			$('#'+id).draggable('destroy');
		}
		else {
			$('#'+id).addClass('multiselected');
			setTimeout('ImageSelector.makeMultiSelectedDraggable()', 300);
		}
		
		/*		
		if ($(obj).is('.multiselected')){
			$(obj).removeClass('multiselected');				
		}
		else {
			$(obj).addClass('multiselected');
		}
		*/
		
	},
		
	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	* Respond to a shift-click event
	*/
	onShiftClick : function(e, obj){
										
		var id = $(obj).attr('id');
			
	  	$('.thumb').removeClass('multiselected')
			
		if (ImageSelector.shiftSelectStarted){

			var foundStart = false;
			var foundEnd = false;
					
	  		$('.thumb').each(	
	  			function(){	  				
	  				if (!foundEnd){
		  				if ($(this).attr('id') == ImageSelector.shiftSelectStartedID){
		  					foundStart = true;
		  				}
		  				
		  				if (foundStart){
		  					$(this).addClass('multiselected');
		  				}
		  				
		  				if (foundStart && $(this).attr('id') == id){
		  					foundEnd = true;
		  				}
	  				}	  				
	  			}
	  		);
	  		
	  		// If we didn't find the end, try going backwards
	  		if (!foundEnd){
	  		
	  			$('.multiselected').removeClass('multiselected')
	  			
				foundStart = false;
				foundEnd = false;
	  		
		  		$('.thumb').each(	
		  			function(){	  				
		  				if (!foundEnd){
		  				
			  				if ($(this).attr('id') == id){
			  					foundStart = true;
			  				}
		  							  				
			  				if (foundStart){
			  					$(this).addClass('multiselected');
			  				}
			  				
			  				if ($(this).attr('id') == ImageSelector.shiftSelectStartedID){
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
		//$(obj).unbind('click')
			/*		
		if ($(obj).is('.multiselected')){
			$(obj).removeClass('multiselected');				
			$(obj).draggable({revert: true, zIndex: 300});
		}
		else {
			$(obj).draggable("destroy");
			$(obj).addClass('multiselected');
			setTimeout('ImageSelector.makeMultiSelectedDraggable()', 300);
		}
		*/
	},
	
	// ////////////////////////////////////////////////////////////////////////////
				
	makeMultiSelectedDraggable : function(){
	
		$('.multiselected').draggable({		
				revert: true,
				zIndex: 300,
				delay: 200,				
			  	helper: function(){
			  		//return "<div>sdgsgsg</div>"			  		
			  		var txt = "<div id='multidrag_container'>";
			  		var ct = 0;
			  		
			  		$('.multiselected').each(	
			  			function(){
			  				if (ct < 20){
				  				var offset = ct * 5; ct++;
				  				var src = $(this).attr('src');
				  				var id = $(this).attr('id');
				  				var style = "position: absolute; top: " + offset + "px; left:" + offset + "px;";
				  				txt += "<img id='"+id+"' src='"+src+"' class='dragged_thumb' width='50px' height='50px' style='"+style+"'>";
			  				}
			  			}
			  		);
			  		
			  		txt += "</div>";
			  		
			  		return txt;
			  					  		
    				//var selected = $('.multiselected');
					//if (selected.length === 0) {
					//	selected = $(this);
					//}
					//var container = $('<div/>').attr('id', 'draggingContainer');
					//container.append(selected.clone());
					//return container;					 					
				}
			}
		);
	},
			
	// ////////////////////////////////////////////////////////////////////////////
	
	getImageHTML : function(post_id, thumb_url, title, width, height){

		var txt = "";

		var titleText = title + " (" + width + "px by " + height + "px)";
		txt += "   <img id='img_"+post_id+"' src='"+thumb_url+"' class='thumb' width='50px' title='"+titleText+"'/>";
						
		// onclick='ImageSelector.onSelectImage("+post_id+")'
		return txt;
	},

	// ////////////////////////////////////////////////////////////////////////////
	
	paintFolders : function(){
		
		var folderList = DataStore.m_folderList;
		
		var txt = "";
		
		// NOTE: Folder id's 0-9 are reserved for system folders, so can safely use these id's here
		
		// Hard-coded 'all' folder....		
		if (ImageSelector.folder_id == 0){
			txt += "<div id='folder_0' class='apollo_system_folder' style='width:100%;' onclick=\"ImageSelector.onSelectFolder('0')\"><div class='folder_name_selected'>Show All</div></div>";
			$('#apollo_title_folder_name').html('(All)');
		}
		else {
			txt += "<div id='folder_0' class='apollo_system_folder' style='width:100%;' onclick=\"ImageSelector.onSelectFolder('0')\"><div class='folder_name'>Show All</div></div>";
		}
		
		
		// Hard-coded 'unassigned' folder....		
		if (ImageSelector.folder_id == ImageSelector.ID_UNASSIGNED){
			txt += "<div id='folder_"+ImageSelector.ID_UNASSIGNED+"' class='apollo_folder apollo_system_folder' style='width:100%;' onclick=\"ImageSelector.onSelectFolder("+ImageSelector.ID_UNASSIGNED+")\"><div class='folder_name_selected'>Unassigned images</div></div>";
			$('#apollo_title_folder_name').html('(Unassigned images)');
		}
		else {
			txt += "<div id='folder_1' class='apollo_folder apollo_system_folder' style='width:100%;' onclick=\"ImageSelector.onSelectFolder("+ImageSelector.ID_UNASSIGNED+")\"><div class='folder_name'>Unassigned images</div></div>";
		}		

		// Hard-coded 'last hour' folder....		
		if (ImageSelector.folder_id == ImageSelector.ID_LAST_1_HOUR){
			txt += "<div id='folder_"+ImageSelector.ID_LAST_1_HOUR+"' class='apollo_system_folder' style='width:100%;' onclick=\"ImageSelector.onSelectFolder("+ImageSelector.ID_LAST_1_HOUR+")\"><div class='folder_name_selected'>Added in last hour</div></div>";
			$('#apollo_title_folder_name').html('(Added in last hour)');
		}
		else {
			txt += "<div id='folder_"+ImageSelector.ID_LAST_1_HOUR+"' class='apollo_system_folder' style='width:100%;' onclick=\"ImageSelector.onSelectFolder("+ImageSelector.ID_LAST_1_HOUR+")\"><div class='folder_name'>Added in last hour</div></div>";
		}	

		// Hard-coded 'added last 24 hours' folder....		
		if (ImageSelector.folder_id == ImageSelector.ID_LAST_24_HOURS){
			txt += "<div id='folder_"+ImageSelector.ID_LAST_24_HOURS+"' class='apollo_system_folder' style='width:100%;' onclick=\"ImageSelector.onSelectFolder("+ImageSelector.ID_LAST_24_HOURS+")\"><div class='folder_name_selected'>Added in last 24 hours</div></div>";
			$('#apollo_title_folder_name').html('(Added in last 24 hours)');
		}
		else {
			txt += "<div id='folder_"+ImageSelector.ID_LAST_24_HOURS+"' class='apollo_system_folder' style='width:100%;' onclick=\"ImageSelector.onSelectFolder("+ImageSelector.ID_LAST_24_HOURS+")\"><div class='folder_name'>Added in last 24 hours</div></div>";
		}		
		
		

		for (var i=0; i<folderList.length; i++){

			var folder_name = ApolloUtils.htmlEncode(folderList[i].name);
			var folder_id = folderList[i].id;
			
			//alert(folder_name + " " + folder_id);
			
			if (folder_id == ImageSelector.folder_id){
				$('#apollo_title_folder_name').html('('+folder_name+')');
				txt += "<div id='folder_"+folder_id+"' class='apollo_folder folder_with_menu' style='width:100%;' title='Right click to edit' onclick=\"ImageSelector.onSelectFolder('"+folder_id+"')\"><div class='folder_name folder_name_selected'>"+folder_name+"</div></div>";
			}
			else {
				txt += "<div id='folder_"+folder_id+"' class='apollo_folder folder_with_menu' style='width:100%;' title='Right click to edit' onclick=\"ImageSelector.onSelectFolder('"+folder_id+"')\"><div class='folder_name'>"+folder_name+"</div></div>";
			}

			
		}
		
		$('#apollo_folder_list').html(txt);
		
		$('.apollo_folder').droppable({
				drop: ImageSelector.onAddToFolder,
				over: function(ev, ui) {$(this).addClass( 'apollo_folder_droppable_hover' );},
				out: function(ev, ui) {$(this).removeClass( 'apollo_folder_droppable_hover' );}
			});			

				
	   // $(".folder_with_menu").rightClickMenu({menu: "folderMenu"}, function(action, el, pos){ImageSelector.onMenuItem(action, el)});
		if (ImageSelector.mode != ImageSelector.MODE_EDIT_GALLERY){
			$(".folder_with_menu").rightClick( function(e) {ImageSelector.onRightClickFolder(e, this);});
		}

		$("#apollo_folder_list").disableSelection();
				
	},

	// ////////////////////////////////////////////////////////////////////////////

	onRightClickFolder : function(e, obj){

		e.stopPropagation();
		
		//var x = e.pageX - $('#adminmenu').width() - 30;
		//var y = e.pageY - $('#wphead').height() - $('#update-nag').height();		
		var x = e.pageX;
		var y = e.pageY;		

		$('#folderMenu').css('top',y);
		$('#folderMenu').css('left',x);
		$('#folderMenu').show();

		$('#folderMenu .edit').unbind('click');
		$('#folderMenu .delete').unbind('click');
		$('#folderMenu .quit').unbind('click');

		$('#folderMenu .edit').click(function(){ImageSelector.onMenuItem('rename_folder', obj)});
		$('#folderMenu .delete').click(function(){ImageSelector.onMenuItem('delete_folder', obj)});
		$('#folderMenu .quit').click(function(){ImageSelector.onMenuItem('quit', obj)});
		
	},
	
	onRightClickImage : function(e, obj){

		e.stopPropagation();

		//var x = e.pageX - $('#adminmenu').width() - 30;
		//var y = e.pageY - $('#wphead').height() - $('#update-nag').height();		
		var x = e.pageX;
		var y = e.pageY;		

		$('#imageMenu').css('top',y);
		$('#imageMenu').css('left',x);
		$('#imageMenu').show();

		$('#imageMenu .edit').unbind('click');
		$('#imageMenu .delete').unbind('click');
		$('#imageMenu .quit').unbind('click');
		
		$('#imageMenu .edit').click(function(){ImageSelector.onMenuItem('edit_image', obj)});
		$('#imageMenu .delete').click(function(){ImageSelector.onMenuItem('delete_image', obj)});
		$('#imageMenu .quit').click(function(){ImageSelector.onMenuItem('quit', obj)});
		
	},
		
	// ////////////////////////////////////////////////////////////////////////////

	messageTimeout : -1,
	
	showMessage : function(msg){
		$('#apollo_title_feedback').html(msg);
		$('#apollo_title_feedback').show();
		if (ImageSelector.messageTimeout != -1){
			clearTimeout(ImageSelector.messageTimeout)
		}
		setTimeout('ImageSelector.hideMessage()', 5000);
	},
	
	hideMessage : function(){
		$('#apollo_title_feedback').hide();
	},
	
	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	* Respond to the user selecting a menu item
	*/
	onMenuItem : function(item, selectedElement){
		
		$('#imageMenu').hide();
		$('#folderMenu').hide();
		
		
		var divID = $(selectedElement).attr('id');
		
		if (item == 'rename_folder' || item == 'delete_folder'){
			var name = $('#'+divID + ' .folder_name').html();
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
		var name = $(divID + ' .folder_name').html();
		
		$(divID).attr('onclick','');
		$(divID).html("<input id='folder_name_edit' style='margin-left:30px' type='text' value='"+name+"' onblur='ImageSelector.paintFolders()'/>");
		
		$("#folder_name_edit").keypress(function (e) {
			if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
				ImageSelector.renameFolder(folder_id, $("#folder_name_edit").val());
			}
	    });
		
		$("#folder_name_edit").focus();
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
												
		$.ajax({
			url: ImagePickerData.commandURL,
			dataType: "text",
			data: paras,
			success: function(ret){ImageSelector.onFolderDeleted(ret, folderdId)}	
		});	
	},
	
	onFolderDeleted : function(res, folder_id){

		ImageSelector.showMessage("Folder deleted");
		
		var temp = new Array();
		
		for (var i=0; i<DataStore.m_folderList.length; i++){
		
			if (DataStore.m_folderList[i].id != folder_id){
				temp.push(DataStore.m_folderList[i]);
			}
			
		}

		DataStore.m_folderList = temp;
		ImageSelector.paintFolders()	
	},
	
	// ////////////////////////////////////////////////////////////////////////////

	addFolder : function(folderName){

		if (folderName == undefined){
			folderName = 'new folder';
		}
		
		var paras = {cmd: 12, folder_name: folderName};
												
		$.ajax({
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
			DataStore.m_folderList.push(temp);
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
		
		for (var i=0; i<DataStore.m_folderList.length; i++){
			if (DataStore.m_folderList[i].id == folder_id){
				return DataStore.m_folderList[i].name;
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
												
		$.ajax({
			url: ImagePickerData.commandURL,
			dataType: "text",
			data: paras,
			success: function(ret){ImageSelector.onFolderRenamed(ret, folderId, folderName)}
		});	
	},
	
	onFolderRenamed : function(ret, folderId, folderName){

		for (var i=0; i<DataStore.m_folderList.length; i++){
			if (DataStore.m_folderList[i].id == folderId){
				DataStore.m_folderList[i].name = folderName;
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

		var imgID = parseInt($(ui.draggable).attr('id').substring(4));						
		var folderID = parseInt($(this).attr('id').substring(7));	// format folder_xxx

		// Check to see if there are images multi-selected, and whether this image
		// is one of them
		var imgList = new Array();
		var is_multiDrag = false;
		
  		$('.multiselected').each(	
  			function(){
				var multi_imgID = parseInt($(this).attr('id').substring(4));
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
				
				//alert("Adding image: post_id: " + tempImgID + " folder_id: " + folderID);
				
				var paras = {cmd: 10, media_post_id: tempImgID, folder_id: folderID};
														
				$.ajax({
					url: ImagePickerData.commandURL,
					dataType: "json",
					data: paras,
					success: function(ret){ImageSelector.onAddedToFolder(ret)}
				});
			}	
		}

		//alert($(ui.draggable).html());
		//alert($(ui.draggable).attr('id'));
		
		$(this).removeClass( 'apollo_folder_droppable_hover' );
			
	},
	
	onAddedToFolder : function(msg){
								
		if (msg.result == "ok"){

			var imgID = msg.media_post_id;
			var folderID = msg.folder_id;
					
			for (var i=0; i<DataStore.m_mediaList.length; i++){
				
				if (DataStore.m_mediaList[i].post_id == imgID){
					DataStore.m_mediaList[i].folder_id = folderID;						
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