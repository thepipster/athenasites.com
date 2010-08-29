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

		txt += "<table border='0' cellpadding='0' cellspacing='0' height='100%' style='width:100%; height:100%;'>";

		txt += "<tr valign='top' style='height:100%'>";
		
		txt += "	<td class='frameContents' style='height:100%; padding:5px'>";
		txt += "        <div id='apollo_site_settings_content'></div>";
		txt += "	</td>";		

		txt += "	<td class='frameContents' style='height:100%; width:250px; padding:5px'>";
		txt += "        <div id='apollo_site_tools_content'></div>";
		txt += "	</td>";		

		txt += "</tr>";

		txt += "</table>";
	
		txt += "</div>"					
					
		$('#DashboardFrame').html(txt);	
		
		DashboardFrame.paintTools();
		DashboardFrame.paintSettings();
	},

	// ////////////////////////////////////////////////////////////////////////////
	
	paintSettings : function(){
		
		var txt = "";
		
		txt += "<div class='subframebox'>";
		txt += "    <span class='title'>Settings</span>";
		txt += "</div>"					
		
		$('#apollo_site_settings_content').html(txt);
	},
		
	// ////////////////////////////////////////////////////////////////////////////
	
	paintTools : function(){
		
		var txt = "";
		
		txt += "<div class='subframebox'>";
		txt += "    <span class='title'>Tools</span>";
		txt += "    <fieldset>";
		txt += "    <legend>Import Blog Posts</legend>";
		txt += "    <button class='basic_button' onclick='WordpressImporter.show()'>Wordpress</button><br/>";		
		txt += "    <button class='basic_button' onclick=''>Blogger</button><br/>";		
		txt += "    <button class='basic_button' onclick=''>Livejournal</button><br/>";		
		txt += "    </fieldset>";
		txt += "</div>"					
		
		$('#apollo_site_tools_content').html(txt);
	}

}