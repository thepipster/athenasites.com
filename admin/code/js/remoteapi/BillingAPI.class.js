/**
*
* Billing Interface
* Note: This requires a secure connection (HTTPS) to the server.
*
* @author Mike Pritchard (mike@adastrasystems.com)
* @since 8th January, 2011
*/
var BillingAPI = {

    /** Command url */
    m_url : '/admin/code/php/remoteapi/BillingAPI.php',

    // ////////////////////////////////////////////////////////////////////////

    /**
    * Perform any initialization
    */
    init : function(){
    },

    // /////////////////////////////////////////////////////////////////////////////

	getAccountInfo : function(siteID, callback){

       var paras = { cmd : 'getAccountInfo', site_id: siteID };

        $.ajax({
            url: BillingAPI.m_url,
            dataType: "json",
            data: paras,
            success: function(ret){
            	callback(ret.data.user_info);
            }
        });

	},
	
    // /////////////////////////////////////////////////////////////////////////////

    /**
     * Add a new credit card for this user. If succesful, this will return the card_id for the new credit card.
     *
     * @param user_id The internal user id for this card
     * @param firstName The first name on the credit card
     * @param lastName The last name on the credit card
     * @param address The address associated with the credit card
     * @param city The city associated with the credit card
     * @param state The state associated with the credit card
     * @param zip The zip associated with the credit card
     * @param cardNo The credit card number
     * @param ccvCode The three- or four- digit number on the back of a credit card (on the front for American Express
     * @param expirationDate The card's expiration date, in the form YYYY-MM
     * @param country The country of the credit card
     * @param callback Reference to function call when this asynchronous command completes
     */
    addCreditCard : function(user_id, firstName, lastName, address, city, state, zip, cardNo, ccvCode, expirationDate, country, callback){

        var paras = {
            cmd : 'addCreditCard',
            uid: user_id,
            fnm: firstName,
            lnm: lastName,
            add: address,
            cty: city,
            st: state,
            zp: zip,
            cno: cardNo,
            ccv: ccvCode,
            exp: expirationDate,
            cnt: country
        };

        $.ajax({
            url: BillingAPI.m_url,
            dataType: "json",
            data: paras,
            success: function(ret){callback(ret)}
        });
        
    },
    
    // /////////////////////////////////////////////////////////////////////////////
  
    /**
     * Update an existing credit card for this user
     *
     * @param user_id The internal user id for this card
     * @param card_id The card id (the internal id used by us for each payment profile, i.e. the id of the lzads_authorizenet_payment_profile_ids table)
     * @param newExpirationDate The card's expiration date, in the form YYYY-MM
     * @param isPrimary Set to 1 if this is the primary card for this user, otherwise use 0 to indicate a secondary card
     * @param callback Reference to function call when this asynchronous command completes
     */
    updateCreditCard : function(user_id, card_id, newExpirationDate, isPrimary, callback){

        var paras = {
            cmd : 'updateCreditCard',
            uid: user_id,
            cid: card_id,
            exp: newExpirationDate,
            pri: isPrimary
        };

        $.ajax({
            url: BillingAPI.m_url,
            dataType: "json",
            data: paras,
            success: function(ret){
                BillingAPI.onGotData(ret, callback)
            }
        });
        
    },
    
    // /////////////////////////////////////////////////////////////////////////////

    /**
     * Delete a user's credit card from our records
     *
     * @param user_id The internal user id for this card
     * @param card_id The card id (the internal id used by us for each payment profile, i.e. the id of the lzads_authorizenet_payment_profile_ids table)
     * @param callback Reference to function call when this asynchronous command completes
     */
    deleteCreditCard : function(user_id, card_id, callback){

        var paras = {
            cmd : 'deleteCreditCard',
            uid: user_id,
            cid: card_id
        };

        $.ajax({
            url: BillingAPI.m_url,
            dataType: "json",
            data: paras,
            success: function(ret){
                BillingAPI.onGotData(ret, callback)
            }
        });

    },

    // /////////////////////////////////////////////////////////////////////////////

    /**
     * Make a user's credit card their primary card
     *
     * @param user_id The internal user id for this card
     * @param card_id The card id (the internal id used by us for each payment profile, i.e. the id of the lzads_authorizenet_payment_profile_ids table)
     * @param callback Reference to function call when this asynchronous command completes
     */
    makeCreditCardPrimary : function(user_id, card_id, callback){

        var paras = {
            cmd : 'makeCardPrimary',
            uid: user_id,
            cid: card_id
        };

        $.ajax({
            url: BillingAPI.m_url,
            dataType: "json",
            data: paras,
            success: function(ret){
                BillingAPI.onGotData(ret, callback)
            }
        });

    },
    
    // /////////////////////////////////////////////////////////////////////////////

    /**
     * Get a list of credit cards and associated billing information for a user.
     *
     * Will return an array with a list of credit cards an associated information, in the form;
     *
     * "credit_cards":[
     *     {"firstname":"customer firstname",
     *      "lastname":"customer lastname",
     *      "company":"customer company",
     *      "address":"customer address",
     *      "city":"some city",
     *      "state":"CO",
     *      "zip":"80829",
     *      "country":"USA",
     *      "phone":"7196851111",
     *      "card_number":"XXXX5129",
     *      "card_type":"visa"}
     *   ]
     *   
     *
     * @param user_id The internal user id 
     * @param callback Reference to function call when this asynchronous command completes
     */
    getCreditCards : function(user_id, callback){

        var paras = { cmd : 'getCreditCards', uid: user_id };

        $.ajax({
            url: BillingAPI.m_url,
            dataType: "json",
            data: paras,
            success: function(ret){
                BillingAPI.onGotData(ret, callback)
            }
        });

    },

    // /////////////////////////////////////////////////////////////////////////////
    //
    // Billing info
    //
    // /////////////////////////////////////////////////////////////////////////////


    checkIfUserHasProfile : function(user_id, callback){
        var paras = { cmd : 'checkIfUserHasProfile', uid: user_id };
        $.ajax({
            url: BillingAPI.m_url,
            dataType: "json",
            data: paras,
            success: function(ret){ callback(ret) }
        });
    },

    getTransactionDetails : function(user_id, transaction_id, callback){

        var paras = { cmd : 'getTransactionDetails', uid: user_id, tid: transaction_id  };
		
        $.ajax({
            url: BillingAPI.m_url,
            dataType: "json",
            data: paras,
            success: function(ret){
                BillingAPI.onGotData(ret, callback)
            }
        });
    },


    // /////////////////////////////////////////////////////////////////////////////

    getTransactions : function(user_id, callback){

        var paras = { cmd : 'getTransactions', uid: user_id };
		
        $.ajax({
            url: BillingAPI.m_url,
            dataType: "json",
            data: paras,
            success: function(ret){
                BillingAPI.onGotData(ret, callback)
            }
        });
    },

    // /////////////////////////////////////////////////////////////////////////////
	
    getBillingInfo : function(user_id, noDays, callback){

        var paras = { cmd : 'getBillingInfo', uid: user_id, dys: noDays };

        $.ajax({
            url: BillingAPI.m_url,
            dataType: "json",
            data: paras,
            success: function(ret){
                BillingAPI.onGotData(ret, callback)
            }
        });
    },
	
    // /////////////////////////////////////////////////////////////////////////////
	
    getCreditHistory : function(user_id, noDays, callback){

        AthenaDialog.showLoading("Loading...");

        var paras = { cmd : 'getCreditHistory', uid: user_id, dys: noDays };

        $.ajax({
            url: BillingAPI.m_url,
            dataType: "json",
            data: paras,
            success: 
            	function(ret){
			        AthenaDialog.clearLoading();
					
			        if (ret.result == 'ok'){
			            callback(data.credit_cards);
			        }
			        else {
			            AthenaDialog.showAjaxError(ret);
			        }
            	}
		});
    },
    	
    // /////////////////////////////////////////////////////////////////////////////
	//
	// Ad related stuff
	//
    // /////////////////////////////////////////////////////////////////////////////
    	
    /**
     * Cancel an ad and reimburse the customer for any outstanding credit
     *
     * @param user_id The internal user id for this card
     * @param ad_id The ad id
     * @param callback Reference to function call when this asynchronous command completes
     */
    cancelAd : function(user_id, ad_id, callback){

        var paras = {
            cmd : 'cancelAd',
            uid: user_id,
            aid: ad_id
        };

        $.ajax({
            url: BillingAPI.m_url,
            dataType: "json",
            data: paras,
            success: function(ret){
                BillingAPI.onGotData(ret, callback)
            }
        });
        
    },    	
    	
    // /////////////////////////////////////////////////////////////////////////////
    // /////////////////////////////////////////////////////////////////////////////
    // /////////////////////////////////////////////////////////////////////////////

    onGotData : function(ret, callback){

        if (ret.result == 'fail') return;
		
        if (ret.result == 'ok') {
            callback(ret.data);
        }
        else {
            lzaCommon.showAjaxError(ret);
        }

    }

}