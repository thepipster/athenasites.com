/**
* Javascript interface to the Flash LiveJournalImporter.swf that allows the Javascript to read the contents of 
* a file from the users local file system
*
* @author Mike Pritchard (mike@apollosites.com)
* @since 3rd September, 2010
*/
var LiveJournalImporter = {
	
    // ////////////////////////////////////////////////////////////////////////
	
    show : function(){
	
        var txt = "";
        txt += "<div id='apolloBlogImporter'>";
        txt += "    <fieldset>";
        txt += "        <legend>Progress</legend>";
        txt += "        <div class='importProgress' id='status' align='center'>Enter your username/password and hit start to begin</div>";
        txt += "        <div id='progressBar'></div>";
        txt += "    </fieldset>";
        txt += "    <fieldset>";
        txt += "        <legend>Controls</legend>";
        txt += "        <table border='0' width='100%'>";
        txt += "            <tr>";
        txt += "                <td><span class='label' id=''>Livejournal Username</span></td>";
        txt += "                <td><input type='text' id='ljuser' name='ljuser' value=''></td>";
        txt += "            </tr>";
        txt += "            <tr>";
        txt += "                <td><span class='label' id=''>Livejournal Password</span></td>";
        txt += "                <td><input type='password' id='ljpass' name='ljpass' value=''></td>";
        txt += "            </tr>";
        txt += "        </table>";
        txt += "    </fieldset>";
        txt += "</div>";
		
        $('#apollo_dialog').html(txt);
        $('#apollo_dialog').dialog( 'destroy' );
        $('#apollo_dialog').dialog({
            modal: true,
            width:385,
            //height:260,
            resizable:false,
            buttons: {
                "Start": LiveJournalImporter.startImport,
                "Done": function() {
                    $(this).dialog('close');
                }
            },
            title: 'Import your LiveJournal blog'
        });
		
        // Progress bar.....
		
        //$("#progressBar").progressbar({
        //    value: 0
        //});
		
    },

    // ////////////////////////////////////////////////////////////////////////

    startImport : function(){

        if ($('#ljuser').val() == "" || $('#ljpass').val() == "") {
            LiveJournalImporter.onError("You must enter a valid username and password!");
            return;
        }

        LiveJournalImporter.onMessage("Importing....");
        $('#progressBar').html("<div align='center'><img src='"+defines.root_url+"images/spinner.gif'/></div>");

        var paras = {
            cmd: 'importLJ',
            site_id: ssMain.siteID,
            us: $('#ljuser').val(),
            ps: $('#ljpass').val()
            };
								
        $.ajax({
            url: MediaAPI.m_url,
            type: 'post',
            dataType: "json",
            success: function(ret){
                LiveJournalImporter.onComplete(ret)
                },
            data: paras
        });
				
    },
	
    // ////////////////////////////////////////////////////////////////////////

    onComplete : function(ret){
        
        $('#progressBar').html("");
        
    	if (ret.result == 'ok'){
	        $('#status').html("<span style='color:green'>Import completed! Refresh the browser to see the changes.</span>");
    	}
    	else {
	        $('#status').html("<span style='color:red'>"+ret.data+"</span>");
    	}
    },
		
    // ////////////////////////////////////////////////////////////////////////

    onMessage : function(msg){
        $('#status').html("<span style='color:blue'>"+msg+"</span>");
    },

    onError : function(msg){
        $('#status').html("<span style='color:red'>"+msg+"</span>");
    }
	
// ////////////////////////////////////////////////////////////////////////
	
}