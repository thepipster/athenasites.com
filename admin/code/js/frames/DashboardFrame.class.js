/**
*
* 
* @since 27th July, 2010
*/
var DashboardFrame = {

	init : function(){
	},
	
	// ////////////////////////////////////////////////////////////////////////////
	
	repaint : function(){
	
		var txt = "";
			
		txt += "<div id='DashboardFrameContent' align='left'>";

		txt += "<table border='1' cellpadding='0' cellspacing='0' style='width:100%; height:100%;'>";

		txt += "<tr valign='top'>";
		
		txt += "	<td class='frameContents'>";
		txt += "        <span class='frameTitle'>Site Settings</span>";
		txt += "        <div id='apollo_site_settings_content'></div>";
		txt += "	</td>";		

		txt += "	<td class='frameContents'>";
		txt += "        <span class='frameTitle'>Site Settings 2</span>";
		txt += "        <div id='apollo_site_settings_content2'></div>";
		txt += "	</td>";		

		txt += "</tr>";

		txt += "</table>";
	
		txt += "</div>"					
					
		$('#DashboardFrame').html(txt);	
	}

}