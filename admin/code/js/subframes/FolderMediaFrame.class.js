/**
* Javascript class that allows a user to pick an image from their wordpress media library
* The image data is assumed to be in the class ImagePickerData see the fucntion 
* echoImagePickerJSImageData in plugin_functions.php
*
* @since 24th March, 2010
*/
var FolderMediaFrame = {

	folder_id : 0,
			
	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	*
	*/
	paint : function(targetDiv){
	
		FolderMediaFrame.targetDiv = targetDiv;
		
		var txt = "";
		
		
		txt += "<div id='apollo_image_library'></div>";		
				
		txt += "<div id='imageEditDialog'></div>";
		
		txt += "<ul id='imageMenu' class='rightClickMenu'>";
		txt += "	<li class='edit'><a href='#edit_image'>Edit</a></li>";
		//txt += "	<li class='delete'><a href='#delete_image'>Delete</a></li>";
		txt += "	<li class='quit separator'><a href='#quit'>Cancel</a></li>";
		txt += "</ul>";
		
							
		$(FolderMediaFrame.targetDiv).html(txt);
		
		FolderMediaFrame.paintImages();
		
		$(FolderMediaFrame.targetDiv).disableSelection();
		$(FolderMediaFrame.targetDiv).noContext();
		
		// Disable right click menu except where we want it
		//$(FolderMediaFrame.targetDiv).bind("rightClickMenu",function(e){return false;}); 		
		
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
								
		//alert(DataStore.m_currentFolderID + " " + FolderMediaFrame.ID_LAST_24_HOURS);
								
		for (var i=0; i<imageList.length; i++){

			var thumb_url = imageList[i].thumb_url;
			var post_id = imageList[i].id;
			var title = imageList[i].title;
			var width = imageList[i].thumb_width;
			var height = imageList[i].thumb_height;
			var image_folder_id = parseInt(imageList[i].folder_id);
			var added_date = new Date(imageList[i].date_added);						
			var hours_ago = (utc_time - added_date.getTime())/3600000;
			
			//FolderMediaFrame.showMessage(added_date + "  |||   " + utc_date + " Delta = " + hours_ago);
			//FolderMediaFrame.showMessage(" Delta = " + hours_ago);
			
			switch(DataStore.m_currentFolderID){
			
				case FolderMediaFrame.ID_UNASSIGNED:
					if (image_folder_id == FolderMediaFrame.ID_ALL || image_folder_id == FolderMediaFrame.ID_UNASSIGNED)
						txt += FolderMediaFrame.getImageHTML(post_id, thumb_url, title, width, height);	
					break;
					
				case FolderMediaFrame.ID_LAST_1_HOUR:
					if (hours_ago <= 1){
						txt += FolderMediaFrame.getImageHTML(post_id, thumb_url, title, width, height);				
					}
					break;

				case FolderMediaFrame.ID_LAST_24_HOURS:
					if (hours_ago <= 24){
						txt += FolderMediaFrame.getImageHTML(post_id, thumb_url, title, width, height);				
					}
					break;

				case FolderMediaFrame.ID_LAST_7_DAYS:
					if (hours_ago <= 168){
						txt += FolderMediaFrame.getImageHTML(post_id, thumb_url, title, width, height);				
					}
					break;

				case FolderMediaFrame.ID_ALL:
					txt += FolderMediaFrame.getImageHTML(post_id, thumb_url, title, width, height);				
					break;	

				case image_folder_id:	
					txt += FolderMediaFrame.getImageHTML(post_id, thumb_url, title, width, height);				
					break;	

				default:					
					// Nothing to do
			}
			
		}
								
		$('#apollo_image_library').html(txt);
		$('#apollo_image_library').noContext();
				
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
						//FolderMediaFrame.onAltClick(e, this);
					}
					else if( evt.button == 0 ) {
						if (evt.shiftKey){
							// Shift-left click
							//FolderMediaFrame.onShiftClick(e, this);
						}
						else if (evt.altKey){
							// Ctrl-left click
							//FolderMediaFrame.onAltClick(e, this);
						}
						else {
							// Just a left click
							//FolderMediaFrame.onStartClick(e, this);
						}
						return false;
					} 
					else if( evt.button == 2) {
						// Right click
						FolderMediaFrame.onRightClickImage(e, this);
						return true;
					}
				}
			)
		});

		
	},

	// ////////////////////////////////////////////////////////////////////////////
	
	getImageHTML : function(post_id, thumb_url, title, width, height){

		var txt = "";
		//var ph = (60 - height - 8)/2;
		
		var titleText = title + " (" + width + "px by " + height + "px)";

		txt += "<div class='thumbwrapper' align='center'>";
		//txt += "<img id='img_"+post_id+"' src='"+thumb_url+"' class='thumb' style='margin-top:"+ph+"px' width='"+width+"px' height='"+height+"px' title='"+titleText+"'/>";
		txt += "<img id='img_"+post_id+"' src='"+thumb_url+"' class='thumb' width='"+width+"px' height='"+height+"px' title='"+titleText+"'/>";
		//txt += "<span class='thumbtitle'>"+title+"</span>";
		txt += "</div>";
		//				alert(txt);
		// onclick='FolderMediaFrame.onSelectImage("+post_id+")'
		return txt;
	},

	// ////////////////////////////////////////////////////////////////////////////
	
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
		
		$('#imageMenu .edit').click(function(){FolderMediaFrame.onMenuItem('edit_image', obj)});
		$('#imageMenu .delete').click(function(){FolderMediaFrame.onMenuItem('delete_image', obj)});
		$('#imageMenu .quit').click(function(){FolderMediaFrame.onMenuItem('quit', obj)});
		
	},
			
	// ////////////////////////////////////////////////////////////////////////////
	
	/**
	* Respond to the user selecting a menu item
	*/
	onMenuItem : function(item, selectedElement){
		
		$('#imageMenu').hide();
				
		var divID = $(selectedElement).attr('id');
		
		if (item == 'rename_folder' || item == 'delete_folder'){
			var name = $('#'+divID + ' .folder_name').html();
			var folder_id = parseInt(divID.substr(7));
		}
		else {
			var image_post_id = parseInt(divID.substr(4));
		}
										
		// Process events related to images...											
		if (item == 'edit_image'){
			ImageEditDialog.show('#imageEditDialog', image_post_id);
		}
		else if (item == 'delete_image'){
			ApolloDialog.alert('feature coming soon');
		}
		
	}
		
}