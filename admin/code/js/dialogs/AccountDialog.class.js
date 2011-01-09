/*
 * Class that allows the user to view and edit their account settings
 *
 * @author Mike Pritchard (mike@apollosites.com)
 */
var AccountDialog = {

	show : function(){
		AccountDialog.paint();
		
		// Get data		
		BillingAPI.getAccountInfo(ssMain.siteID, AccountDialog.onGotData);
	},
	
    // ////////////////////////////////////////////////////////////////////////

	onGotData : function(user_info){
	
		$('#memberSince').val($.datepicker.formatDate('mm/dd/yy', new Date(user_info.account_created)));
		$('#paymentPlan').val(user_info.payment_plan);
		$('#hostingFee').val('$' + user_info.monthly_fee);
		$('#lastPayment').val($.datepicker.formatDate('mm/dd/yy', new Date(user_info.last_payment)));
		$('#nextPayment').val($.datepicker.formatDate('mm/dd/yy', new Date(user_info.next_payment_due)));
				
		$('#userDomain').val(user_info.domain);
		$('#userEmail').val(user_info.email);
	},
	
    // ////////////////////////////////////////////////////////////////////////

    paint : function(){

        var txt = "";
        txt += "<div id='apolloAccountSettings'>";

		txt += "<table width='100%'><tr valign='top'>";
		txt += "<td>";
		
		txt += "    <h3>Account Settings</h3>";

		txt += "    <div class='dataWrapper'>";
		txt += "    <span class='dataLabel'>Domain</span><input id='userDomain' class='dataValue' type='text' />";
		txt += "    <button class='basic_button' onclick='AccountDialog.setDomain()'>Update</button>"
		txt += "    </div>";

		txt += "    <div class='dataWrapper'>";
		txt += "    <span class='dataLabel'>Email</span><input id='userEmail' class='dataValue' type='text' />";
		txt += "    <button class='basic_button' onclick='AccountDialog.setEmail()'>Update</button>"
		txt += "    </div>";
		
		
		txt += "    <h3>Billing</h3>";
		
		txt += "    <div class='dataWrapper'>";
		txt += "    <span class='dataLabel'>Member Since</span><input id='memberSince' class='dataValueDisabled' type='text' disabled />";
		txt += "    </div>";

		txt += "    <div class='dataWrapper'>";
		txt += "    <span class='dataLabel'>Payment Plan</span><input id='paymentPlan' class='dataValueDisabled' type='text' disabled value='Monthly'/>";
		txt += "    </div>";

		txt += "    <div class='dataWrapper'>";
		txt += "    <span class='dataLabel'>Hosting Fee</span><input id='hostingFee' class='dataValueDisabled' type='text' disabled value='$8.00'/>";
		txt += "    </div>";

		txt += "    <div class='dataWrapper'>";
		txt += "    <span class='dataLabel'>Last Payment</span><input id='lastPayment' class='dataValueDisabled' type='text' disabled />";
		txt += "    </div>";

		txt += "    <div class='dataWrapper'>";
		txt += "    <span class='dataLabel'>Next Payment</span><input id='nextPayment' class='dataValueDisabled' type='text' disabled />";
		txt += "    </div>";
		
		txt += "</td>";


		txt += "<td>";

		txt += "    <h3>Change Password</h3>";

		txt += "    <div class='dataWrapper'>";
		txt += "    <span class='dataLabel'>Old Password</span><input class='dataValue' type='password' />";
		txt += "    </div>";

		txt += "    <div class='dataWrapper'>";
		txt += "    <span class='dataLabel'>New Password</span><input class='dataValue' type='password' />";
		txt += "    <button class='basic_button' onclick='AccountDialog.setEmail()'>Change</button>"
		txt += "    </div>";


		txt += "    <h3>Credit Card</h3>";
		
		txt += "    <div class='dataWrapper'>";
		txt += "    <span class='dataLabel'>Name on Card</span><input class='dataValue' type='text' />";
		txt += "    <span class='cardTypeIcon'></span>";
		txt += "    </div>";

		txt += "    <div class='dataWrapper'>";
		txt += "    <span class='dataLabel'>Card Number</span><input id='cardNumber' class='dataValue' type='text' />";
		txt += "    </div>";
		
		txt += "    <div class='dataWrapper'>";
		txt += "    <span class='dataLabel'>Expiration</span>";
		
		txt += "    <span class='dataValue'>";
		txt += "        <select class='expMonth'>";
		for (var m=1; m<=12; m++){
		txt += "            <option value='"+m+"'>"+m+" - " + AccountDialog.monthToName(m) + "</option>";
		}
		txt += "        </select>";

		txt += "        <select class='expYear'>";
		for (var y=2011; y<=2020; y++){
		txt += "            <option value='"+y+"'>"+y+"</option>";
		}
		txt += "        </select>";
		txt += "    </span>";		
		txt += "    </div>";
		
		txt += "    <br/>";
		
		txt += "    <div class='dataWrapper'>";
		txt += "    <span class='dataLabel'>Address</span><input class='dataValue' type='text' />";
		txt += "    </div>";

		txt += "    <div class='dataWrapper'>";
		txt += "    <span class='dataLabel'>Address</span><input class='dataValue' type='text' />";
		txt += "    </div>";

		txt += "    <div class='dataWrapper'>";
		txt += "    <span class='dataLabel'>City</span><input class='dataValue' type='text' />";
		txt += "    </div>";

		txt += "    <div class='dataWrapper'>";
		txt += "    <span class='dataLabel'>State/Province</span><input class='dataValue' type='text' />";
		txt += "    </div>";
		
		txt += "    <div class='dataWrapper'>";
		txt += "    <span class='dataLabel'>Zip/Postcode</span><input class='dataValue' type='text' />";
		txt += "    </div>";

		txt += "    <div class='dataWrapper'>";
		txt += "    <span class='dataLabel'>Country</span>";
		
		txt += isoCountry.getHTML();
		
		txt += "    <button class='basic_button' onclick='AccountDialog.setEmail()'>Update</button>"
		txt += "</div>";
				
		txt += "</td>";


		txt += "</tr></table>";
		txt += "<td>";
		        
        txt += "</div>";

		// Create dialog.......
				
        $('#apollo_dialog').html(txt);
        
        $('#apollo_dialog').dialog( 'destroy' );
        $('#apollo_dialog').dialog({
            modal: false,
            width:800,
            height: 550,
            resizable:false,
            buttons: {
                Ok: function() {
                    $(this).dialog('close');
                }
            },
            title: 'Your Account Settings'});
            
        // Update card icon as the number is typed    
		$('#cardNumber').typing({ stop: AccountDialog.onCardNumber, delay: 400});
            

    },

    // ////////////////////////////////////////////////////////////////////////

	onCardNumber : function(){
			
		var number = $('#cardNumber').val();
		var type = AccountDialog.getCardTypeByNumber(number);

		$('.cardTypeIcon').removeClass('visa amex mastercard');

		switch(type){
			case 'AMEX' : $('.cardTypeIcon').addClass('amex'); break;
			case 'Visa' : $('.cardTypeIcon').addClass('visa'); break;
			case 'MasterCard' : $('.cardTypeIcon').addClass('mastercard'); break;
		}
	},
	
    // ////////////////////////////////////////////////////////////////////////
    
    monthToName : function(no){
    	var txt = "";
    	switch (no){
    		case 1 : txt = "Jan"; break;
    		case 2 : txt = "Feb"; break;
    		case 3 : txt = "Mar"; break;
    		case 4 : txt = "Apr"; break;
    		case 5 : txt = "May"; break;
    		case 6 : txt = "Jun"; break;
    		case 7 : txt = "Jul"; break;
    		case 8 : txt = "Aug"; break;
    		case 9 : txt = "Sep"; break;
    		case 10 : txt = "Oct"; break;
    		case 11 : txt = "Nov"; break;
    		case 12 : txt = "Dec"; break;
    	}
    	return txt;
    },
    
    // ////////////////////////////////////////////////////////////////////////
    
	getCardTypeByNumber : function(number) {
	    var cc = (number + '').replace(/\s/g, ''); //remove space
	 
	    if ((/^(34|37)/).test(cc) && cc.length == 15) {
	        return 'AMEX'; //AMEX begins with 34 or 37, and length is 15.
	    } else if ((/^(51|52|53|54|55)/).test(cc) && cc.length == 16) {
	        return 'MasterCard'; //MasterCard beigins with 51-55, and length is 16.
	    } else if ((/^(4)/).test(cc) && (cc.length == 13 || cc.length == 16)) {
	        return 'Visa'; //VISA begins with 4, and length is 13 or 16.
	    } else if ((/^(300|301|302|303|304|305|36|38)/).test(cc) && cc.length == 14) {
	        return 'DinersClub'; //Diners Club begins with 300-305 or 36 or 38, and length is 14.
	    } else if ((/^(2014|2149)/).test(cc) && cc.length == 15) {
	        return 'enRoute'; //enRoute begins with 2014 or 2149, and length is 15.
	    } else if ((/^(6011)/).test(cc) && cc.length == 16) {
	        return 'Discover'; //Discover begins with 6011, and length is 16.
	    } else if ((/^(3)/).test(cc) && cc.length == 16) {
	        return 'JCB';  //JCB begins with 3, and length is 16.
	    } else if ((/^(2131|1800)/).test(cc) && cc.length == 15) {
	        return 'JCB';  //JCB begins with 2131 or 1800, and length is 15.
	    }
	    return '?'; //unknow type
	},
 
	isValidCC : function(str) { //A boolean version
    	if (AccountDialog.getCardTypeByNumber(str) == '?') return false;
    	return true;
	}    
}