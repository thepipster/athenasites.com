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
		
		txt += "<div id='apollo_gallery_edit'>";
		
	    txt += "   <h2>";
	    txt += "      <table>";
	    txt += "         <tr>";
	        
	    txt += "            <td><span class='box_title'>Gallery</span></td>";
	    txt += "            <td style='padding-left:10px' >";
	    txt += "               <select id='apollo_edit_gallery_select' onChange='EditGallery.selectGallery(this.value)'>";
		/*
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
		*/
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
	}

}