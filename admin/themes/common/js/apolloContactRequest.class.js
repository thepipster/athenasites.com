/**
* Handle customer contact requests
*/
var apolloContactRequest = {

	/**
	* This allows you to process a contact request, this logs the customer information in the ApolloSites CRM and then sends the email
	* to the client for action.
	*/
	submitRequest : function(siteID, pageID, reqNonce, reqName, reqEmail, reqPhone, reqLocation, reqDate, reqComments, callback){
		
		var paras = {
				page_id: pageID, 
				site_id: siteID, 
				nonce: reqNonce, 
				name: reqName, 
				email: reqEmail, 
				phone: reqPhone, 
				location: reqLocation, 
				comments: reqComments, 
				datetime: reqDate
		};
				
		$.ajax({
			url: "/admin/themes/common/php/SendEmail.php",
			dataType: "text",
			data: paras,
			success: function(ret){apolloContactRequest.onSentForm(ret, callback);}
		});	
		
	},
			
				
	/**
	* Parse the server response on send data to callback, with the following form;
	*
	* callback(isSuccess, isSpam, message)
	*/		
	onSentForm : function(ret, callback){
		
		if (ret == "TRUE"){
			callback(true, false, 'Message sent, thankyou!');
		}
		else if (ret == "FALSE"){
			callback(false, false, 'Error sending message!');
		}
		else if (ret == "SPAM"){
			callback(false, true, 'Sorry, this comment looks like spam');
		}
		else if (ret == "NA"){
		 	// NONCE ran out, or is incorrect!
			callback(false, false, "Page timed-out as anti-spam measure. Please refresh the page to try again");
		}
		else {
			callback(false, false, "Unknown error!");
		}
	}	

}