/**
* Data manager to allow storage and retrieval to abstracted local client
* side database using PersistJS (http://pablotron.org/?cid=1557)
*
* Requires; sha1.js
*
* @author Mike Pritchard (mikep76@gmail.com)
* @since 13th November, 2008
*/
var RemoteManager = {
	
	/** Command url */
	m_url : '',

	/** List of pages */
	m_pageist : '',
							
	// ////////////////////////////////////////////////////////////////////////
	
	/**
	* Create a store name based on a users email address,
	* which is unique and therefore we don't need to hit 
	* the server to get a unique user name
	*/
	init : function(){

		RemoteManager.m_pageist = new Array();
		
		var base = location.href;

		if (base.indexOf('local') > 0){
			RemoteManager.m_url = base.substring(0, base.indexOf('local'));
			RemoteManager.m_url = RemoteManager.m_url + 'local/code/php/RemoteManager.php';	
		}
		else {
			RemoteManager.m_url = base.substring(0, base.indexOf('com'));
			RemoteManager.m_url = RemoteManager.m_url + 'com/code/php/RemoteManager.php';	
		}
		
		//alert(RemoteManager.m_url);					
	},
	
	// ////////////////////////////////////////////////////////////////////////
	
	logOut : function(){

		var paras = {cmd : 'logOut'};

		$.ajax({
			url: RemoteManager.m_url,
			dataType: "json",
			data: paras
		});	
	},

	// ////////////////////////////////////////////////////////////////////////
	
	/**
	* Add a new user to the local file store and create a new data store
	*/
	checkValid : function(callback){
	
		// Add to server
		var paras = {cmd : 'checkValid'};
		
		$.ajax({
			url: RemoteManager.m_url,
			dataType: "json",
			data: paras,
			success: function(ret){callback(ret)}
		});	
	},	
	
	// ////////////////////////////////////////////////////////////////////////

	/**
	* Add a new user to the local file store and create a new data store
	*/
	/*
	addUser : function(email, pass, firstname, lastname, company, callback){
			
		var shaPass = hex_sha1(pass);
		
		// Add to server
		var paras = {cmd : 'createUser', e54232: email, p54232: shaPass, fn: firstname, ln: lastname, cm: company};
		
		$.ajax({
			url: RemoteManager.m_url,
			dataType: "text",
			data: paras,
			success: function(ret){RemoteManager.onUserChecked(ret, callback);}
		});	
	},
	*/
	// ////////////////////////////////////////////////////////////////////////
	
	/**
	* Check to see if the user exists, if so then initialize the store for that email address
	*/
	checkUser : function(email, pass, callback){
	
		RemoteManager.showLoading();

		var shaPass = hex_sha1(pass);
		
		var paras = {cmd : 'checkUser', e54232: email, p54232: shaPass};

		$.ajax({
			url: RemoteManager.m_url,
			dataType: "json",
			data: paras,
			success: function(ret){RemoteManager.onUserChecked(ret, callback);}
		});			
		
	},
		
	// ////////////////////////////////////////////////////////////////////////
	
	/**
	* Check the response from the server, and load data if login is good
	*/
	onUserChecked : function(ret, callback){
		
		RemoteManager.clearLoading();
		
		if (ret.result == 'true'){	
			// set callback with isValid=true, isRemote=true
			callback(true);
		}
		else {
			callback(false);
		}
	},

	// ////////////////////////////////////////////////////////////////////////

	showLoading : function(){
		$('#sync_spinner').html("<img height='12xpx' src='/images/loading_spinner.gif'/>");
	},

	// ////////////////////////////////////////////////////////////////////////

	clearLoading : function(){
		$('#sync_spinner').html("");
	}
	
}
    