/**
* Allows access to the remote (Ajax) Athena System API
* 
* @author Mike Pritchard (mike@apollosites.com)
* @since 27th, July 2010
*/
var SystemAPI = {
	
	/** Command url */
	m_url : 'code/php/remoteapi/SystemAPI.php',
							
	// ////////////////////////////////////////////////////////////////////////
	
	/**
	* Initialize the API
	*/
	init : function(){		
		SystemAPI.m_url = defines.root_url + SystemAPI.m_url;
	},
	
	// ////////////////////////////////////////////////////////////////////////
	
	logOut : function(callback){

		var paras = {cmd : 'logOut'};

		$.ajax({
			url: SystemAPI.m_url,
			dataType: "json",
			data: paras,
			success: function(ret){callback();}			
		});	
	},
		
	// ////////////////////////////////////////////////////////////////////////

	/**
	* Add a new user
	*/	
	/*
	addUser : function(email, pass, name, callback){
					
		// Add to server
		var paras = {cmd : 'createUser', em: email, ps: pass, nm: name};
		
		$.ajax({
			url: SystemAPI.m_url,
			dataType: "json",
			data: paras,
			success: function(ret){SystemAPI.onUserChecked(ret, callback);}
		});	
	},
	*/
	// ////////////////////////////////////////////////////////////////////////
	
	/**
	* Check to see if the user exists, if so then log that user in
	*/
	login : function(email, pass, callback){
			
		var paras = {cmd : 'login', em: email, ps: pass};
				
		$.ajax({
			url: SystemAPI.m_url,
			dataType: "json",
			data: paras,
			success: function(ret){								
				if (ret.result == 'ok'){	
					if (ret.data == 'true'){
						callback(true);
					}
					else {
						callback(false);
					}
				}
				else {
					AthenaDialog.showAjaxError(ret);
				}			
			}
		});			
		
	},
	
	// ////////////////////////////////////////////////////////////////////////
	
	/**
	* Check to see if the user exists, if so then log that user in
	*/
	checkUser : function(username, callback){
			
		var paras = {cmd : 'checkUser', us: username};
				
		$.ajax({
			url: SystemAPI.m_url,
			dataType: "json",
			data: paras,
			success: function(ret){
				if (ret.result == 'ok'){	
					if (ret.data == 'true'){
						callback(true);
					}
					else {
						callback(false);
					}
				}
				else {
					AthenaDialog.showAjaxError(ret);
				}			
			}
		});			
		
	},	
		
	// ////////////////////////////////////////////////////////////////////////
		
	/**
	* Get high level stats (number of pages, number of posts, number of users, number of comments for the
	* entire system!)
	*/	
	getStats : function(callback){
		
		var paras = {cmd : 'getStats'};

		$.ajax({
			url: SystemAPI.m_url,
			dataType: "json",
			success: function(ret){SystemAPI.onGotStats(ret, callback);},
			data: paras
		});
	},	
			
	onGotStats : function(ret, callback){

		// $msg = '{"result":"true", "us": "'.$no_users.'", "si": "'.$no_sites.'", "pg": "'.$no_pages.'", "po": "'.$no_posts.'"}';

        if (ret.result == 'ok'){
    		callback(ret.data.no_users, ret.data.no_sites, ret.data.no_pageviews);    	
	    }
		else {
			AthenaDialog.showAjaxError(ret);
		}
        
   	}	
   					
}
    