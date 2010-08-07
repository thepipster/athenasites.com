/**
*
* 
* @since 6th August, 2010
*/
var EditImageFrame = {
	
	init : function(){
		
	},
	
	// ////////////////////////////////////////////////////////////////////////
	
	repaint : function(){
							
		var txt = "";
		
		txt += "<div id='FilesFrameContent' align='left'>";

		txt += "<table border='0' cellpadding='0' cellspacing='0' style='width:100%; height:100%;'>";

		txt += "<tr valign='top'>";
		
		txt += "	<td>";
		txt += "		<div id='athena_edit_images_content'></div>";
		txt += "	</td>";
					
		txt += "	<td width='150px' style='height:100%; padding:5px'>";
																
		txt += "		<div class='subframebox' style='height:100%; width:500px'>";
								
		txt += "			<span class='title'>Edit Image</span>";
																		
		txt += "			<div id='imageInfoContent'>";
		txt += "			</div>";
					
		txt += "		</div>";											
			
		txt += "	</td>";
		txt += "</tr>";

		txt += "</table>";
	
		txt += "</div>"					
							
		$('#EditFilesFrame').html(txt);

		EditImageFrame.paintImages();
	},
	
	// ////////////////////////////////////////////////////////////////////////

	onSelectImage : function(image_id){	
		ImageEditFrame.paint('#imageInfoContent', image_id);
	},

	// ////////////////////////////////////////////////////////////////////////

	paintImages : function(){
		
		var imageList = DataStore.m_mediaList;
		
		var txt = "";

		var d = new Date();
		var localTime = d.getTime();
		var localOffset = d.getTimezoneOffset() * 60000;
		var utc_date = new Date(localTime + localOffset);
		var utc_time = localTime + localOffset;
								
		//alert(DataStore.m_currentFolderID + " " + FolderSidebarFrame.ID_UNASSIGNED);
								
		for (var i=0; i<imageList.length; i++){

			var thumb_url = imageList[i].thumb_url;
			var post_id = imageList[i].id;
			var title = imageList[i].title;
			var width = imageList[i].thumb_width;
			var height = imageList[i].thumb_height;
			var image_folder_id = parseInt(imageList[i].folder_id);
			var added_date = new Date(imageList[i].date_added);						
			var hours_ago = (utc_time - added_date.getTime())/3600000;
						
			//UploadMediaFrame.showMessage(added_date + "  |||   " + utc_date + " Delta = " + hours_ago);
			//UploadMediaFrame.showMessage(" Delta = " + hours_ago);
			
			switch(DataStore.m_currentFolderID){
			
				case FolderSidebarFrame.ID_UNASSIGNED:
					if (image_folder_id == UploadMediaFrame.ID_ALL || image_folder_id == FolderSidebarFrame.ID_UNASSIGNED)
						txt += EditImageFrame.getImageHTML(post_id, thumb_url, title, width, height);	
					break;
					
				case FolderSidebarFrame.ID_LAST_1_HOUR:
					if (hours_ago <= 1){
						txt += EditImageFrame.getImageHTML(post_id, thumb_url, title, width, height);				
					}
					break;

				case FolderSidebarFrame.ID_LAST_24_HOURS:
					if (hours_ago <= 24){
						txt += EditImageFrame.getImageHTML(post_id, thumb_url, title, width, height);				
					}
					break;

				case FolderSidebarFrame.ID_LAST_7_DAYS:
					if (hours_ago <= 168){
						txt += EditImageFrame.getImageHTML(post_id, thumb_url, title, width, height);				
					}
					break;

				case FolderSidebarFrame.ID_ALL:
					txt += EditImageFrame.getImageHTML(post_id, thumb_url, title, width, height);				
					break;	

				case image_folder_id:	
					txt += EditImageFrame.getImageHTML(post_id, thumb_url, title, width, height);				
					break;	

				default:					
					// Nothing to do
			}
			
		}
								
		$('#athena_edit_images_content').html(txt);
		$('#athena_edit_images_content').noContext();
				

		//$(".thumb").rightClick( function(e) {UploadMediaFrame.onRightClickImage(e, this);});

		// Make draggable
		$(".thumb").draggable({revert: true, zIndex: 300});	
		
	},
	
	// ////////////////////////////////////////////////////////////////////////////
	
	getImageHTML : function(post_id, thumb_url, title, width, height){

		var txt = "";
		//var ph = (60 - height - 8)/2;
		
		var titleText = title + " (" + width + "px by " + height + "px)";

		var onclick = "EditImageFrame.onSelectImage('"+post_id+"')";
		
		txt += "<div class='thumbwrapper' align='center' onclick=\""+onclick+"\">";
		txt += "<img id='img_"+post_id+"' src='"+thumb_url+"' class='thumb' width='"+width+"px' height='"+height+"px' title='"+titleText+"'/>";
		txt += "</div>";
		return txt;
	}	
}