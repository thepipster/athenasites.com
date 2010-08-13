/**
*
* 
* @since 27th July, 2010
*/
var GalleriesFrame = {

	// ////////////////////////////////////////////////////////////////////////////

	init : function(){

	},
	
	// ////////////////////////////////////////////////////////////////////////////
	
	repaint : function(){
	

		var txt = "";
			
		txt += "<div id='GalleryFrameContent' align='left'>";

		txt += "<table border='0' cellpadding='0' cellspacing='0' style='width:100%; height:100%;'>";

		txt += "<tr valign='top'>";
		
		txt += "	<td>";
		txt += "		<div id='apollo_gallery_contents'></div>";
		txt += "	</td>";
							
		// Gallery settings frame (for multi-gal)...........
							
		txt += "	<td width='250px' id='gallerySettings' style='height:100%; padding:5px'>";																
		txt += "		<div class='subframebox' style='height:100%; width:100%;'>";								
		txt += "			<span class='title'>Gallery Settings</span>";																		
		txt += "			<div id='gallerySettingsContent'>";
		txt += "			</div>";					
		txt += "		</div>";														
		txt += "	</td>";

		txt += "</tr>";

		txt += "</table>";
	
		txt += "</div>"					
							
		$('#GalleriesFrame').html(txt);

		GalleriesFrame.paintGallerySlots();	
/*
		var txt = "";
		
		txt += "<div id='apollo_gallery_edit'>";
		
	    txt += "   <h2>";
	    txt += "      <table>";
	    txt += "         <tr>";
	        
	    txt += "            <td><span class='box_title'>Gallery</span></td>";
	    txt += "            <td style='padding-left:10px' >";
	    txt += "               <select id='apollo_edit_gallery_select' onChange='EditGallery.selectGallery(this.value)'>";
		
		for($i=0; $i<$no_galleries; $i++){
		
			$desc = $gallery_pages[$i]['description'];
			$title = $gallery_pages[$i]['title'];
			$page_id = $gallery_pages[$i]['page_id'];
			$multi_gal = $gallery_pages[$i]['multi_gal'];
			$theme_para_id = $gallery_pages[$i]['theme_para_id'];
	
		    if ($multi_gal){
			    $title .= " (muti-gallery)";
		    }
	
		    if ($i == 0){
		    	$current_page_id = $page_id;
			    txt += "            <option value='".$theme_para_id."_".$page_id."' title='$desc' selected>$title</option>";
		    }
		    else {
			    txt += "            <option value='".$theme_para_id."_".$page_id."' title='$desc'>$title</option>";
		    }
		}
	
		//Logger::dump($gallery_pages);
	
	    txt += "               </select>";
	    txt += "            </td>";
	    txt += "            <td style='padding-left:10px' >";
	    txt += "    		     <div class='apollo_add_slot_button' onClick='EditGallery.addSlot()'></div>";
	    txt += "            </td>";
	    txt += "            <td style='padding-left:10px' >";
	    txt += "    		     <div class='apollo_add_subgallery_button' style='display:none' onClick='EditGallery.addSubGallery()'></div>";
	    txt += "            </td>";
	
	    txt += "         </tr>";
	
	    txt += "      </table>";
	
	    txt += "   </h2>";
	    
		txt += "    <div id='apollo_gallery'></div>";
	    txt += "    <div id='ApolloImageSelector'></div>";
	
		txt += "</div> <!-- apollo_gallery_edit -->\n";

		$('#GalleriesFrame').html(txt);
		
		*/
	},
	
	// ////////////////////////////////////////////////////////////////////////////
	
	paintGallerySlots : function(){
	
		var txt = "";
					/*		
		for (var i=0; i<EditGallery.m_slots[gal_no].length; i++){
						
			txt += "<div class='gallery_slot' id='slot_"+gal_nostr+"_"+i+"' align='center'><table><tr><td>";
			
//				alert('['+gal_no+'] ' + EditGallery.m_slots[gal_no][i].gallery_number + ' ' + gal_no);
			
			if (EditGallery.m_slots[gal_no][i].url == ''){
				txt += "<div class='gallery_slot_text' align='center'>"+(i+1)+"</div>";
			}
			else {
				var img_id = EditGallery.m_slots[gal_no][i].image_id;
				var url = EditGallery.m_slots[gal_no][i].url;				
				var style = "style='background-image: url("+url+")'; margin:0; padding:0;";
					
				txt += "<img src='"+url+"' id='galimg_"+gal_nostr+"_"+img_id+"' slot='"+i+"' class='gallery_slot_image gallery_thumb' width='100%' />";
				
			}
			
			txt += "</td></tr></table></div>";
		}	
		
		txt += "</div>";
					
		*/
		$('#apollo_gallery_contents').html(txt);
	}

}