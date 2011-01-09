/*
 * Class that allows the user to view and edit their account settings
 *
 * @author Mike Pritchard (mike@apollosites.com)
 */
var AccountDialog = {

	userEmail : '',
	userDomain : '',

	apolloIP : '173.203.122.229',
	
    // ////////////////////////////////////////////////////////////////////////

	show : function(){
		AccountDialog.paint();
		
		// Get data		
		BillingAPI.getAccountInfo(ssMain.siteID, AccountDialog.onGotData);
	},
	
    // ////////////////////////////////////////////////////////////////////////

	onGotData : function(user_info){
	
		AccountDialog.userEmail = user_info.email;
		AccountDialog.userDomain = user_info.domain;
				
		var fee_due = user_info.monthly_fee;
		if (user_info.payment_plan != 'Monthly'){
			fee_due = user_info.monthly_fee*12;
		}

		$('#memberSince').html($.datepicker.formatDate('mm/dd/yy', new Date(user_info.account_created)));
		$('#paymentPlan').html(user_info.payment_plan);
		$('#lastPayment').html($.datepicker.formatDate('mm/dd/yy', new Date(user_info.last_payment)));
		$('#hostingFee').html('$' + user_info.monthly_fee + ' per month');

		$('#nextPayment').html('$' + fee_due + ' on ' + $.datepicker.formatDate('mm/dd/yy', new Date(user_info.next_payment_due)));
				
		$('#userDomain').val(user_info.domain);
		$('#userEmail').val(user_info.email);
	},
	
    // ////////////////////////////////////////////////////////////////////////

    paint : function(){

        var txt = "";
        txt += "<div id='apolloAccountSettings'>";

		txt += "<table width='100%'><tr valign='top'>";
		txt += "<td>";
		
		txt += "    <h3>Site Settings</h3>";

		
		txt += "    <div class='dataWrapper'>";
		txt += "    <span class='instructions'>To change the domain name of your site, you'll need to edit your domain's DNS settings.";
		txt += "    Make sure you set the A-RECORD to ApolloSites IP address (<b>"+AccountDialog.apolloIP+"</b>).";
		txt += "    See this <a href='http://apollosites.com/custom-domain-name.html'>Custom Domain Name</a> page for more information.</span>";
		txt += "    </div>";

		txt += "    <div class='dataWrapper'>";
		txt += "    <span class='dataLabel'>Domain</span><input id='userDomain' class='dataValue' type='text' />";
		txt += "    <button class='basic_button' onclick='AccountDialog.changeDomain()'>Change</button>"
		txt += "    </div>";
		
		txt += "    <div class='dataWrapper'>";
		txt += "    <span class='dataLabel'>Email</span><input id='userEmail' class='dataValue' type='text' />";
		txt += "    <button class='basic_button' onclick='AccountDialog.changeEmail()'>Change</button>"
		txt += "    </div>";
		
		txt += "<br/>";
		
		txt += "    <h3>Billing</h3>";
		
		txt += "    <div class='dataWrapper'>";
		txt += "    <span class='dataLabel'>Member Since</span><span id='memberSince' class='dataValueDisabled'></span>";
		txt += "    </div>";

		txt += "    <div class='dataWrapper'>";
		txt += "    <span class='dataLabel'>Payment Plan</span><span id='paymentPlan' class='dataValueDisabled'></span>";
		txt += "    </div>";

		txt += "    <div class='dataWrapper'>";
		txt += "    <span class='dataLabel'>Hosting Fee</span><span id='hostingFee' class='dataValueDisabled'></span>";
		txt += "    </div>";

		txt += "    <div class='dataWrapper'>";
		txt += "    <span class='dataLabel'>Last Payment</span><span id='lastPayment' class='dataValueDisabled'></span>";
		txt += "    </div>";

		txt += "    <div class='dataWrapper'>";
		txt += "    <span class='dataLabel'>Next Payment</span><span id='nextPayment' class='dataValueDisabled'></span>";
		txt += "    </div>";
		
		txt += "</td>";


		txt += "<td>";

		txt += "    <h3>Change Password</h3>";

		txt += "    <div class='dataWrapper'>";
		txt += "    <span class='dataLabel'>Old Password</span><input id='oldPassword' class='dataValue' type='password' />";
		txt += "    </div>";

		txt += "    <div class='dataWrapper'>";
		txt += "    <span class='dataLabel'>New Password</span><input id='newPassword' class='dataValue' type='password' />";
		txt += "    </div>";

		txt += "    <div class='dataWrapper'>";
		txt += "    <span class='dataLabel'>Confirm Password</span><input id='newPassword2' class='dataValue' type='password' />";
		txt += "    <button class='basic_button' onclick='AccountDialog.changePassword()'>Change</button>"
		txt += "    </div>";

		txt += "<br/>";

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
		
		txt += "    <div class='dataWrapper'>";
		txt += "    <span class='dataLabel'>Security Code</span><input class='dataValue' type='text' />";
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
		
		txt += "    <button class='basic_button' onclick='AccountDialog.changeCard()'>Update</button>"
		txt += "</div>";
				
		txt += "</td>";


		txt += "</tr></table>";
		txt += "<td>";
		        
        txt += "</div>";

		// Create dialog.......
				
        $('#apollo_account_dialog').html(txt);
        
        $('#apollo_account_dialog').dialog( 'destroy' );
        $('#apollo_account_dialog').dialog({
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

	changePassword : function(){
	
		var oldPassword = $('#oldPassword').val();
		var newPassword = $('#newPassword').val();
		var newPassword2 = $('#newPassword2').val();
		
		if (newPassword != newPassword2){
			$('#newPassword2').val('');
			AthenaDialog.alert("Your new password, and the new password confirmation do not match!", "New Passwords Mismatch");		
			return;
		}
		
		BillingAPI.changePassword(ssMain.siteID, oldPassword, newPassword, AccountDialog.onPasswordChanged);
		
		
	},

	onPasswordChanged : function(isChanged){
		if (isChanged){
			AthenaDialog.alert("Your password has been changed!", "Password Changed");		
			$('#oldPassword').val('');
			$('#newPassword').val('');
			$('#newPassword2').val('');
		}
		else {
			AthenaDialog.alert("Your old password is not correct, please try again", "Incorrect Password");		
		}
	},
	
    // ////////////////////////////////////////////////////////////////////////

	changeEmail : function(){

		var newEmail = $('#userEmail').val();

		if (AccountDialog.userEmail == newEmail){
			AthenaDialog.alert("This is the same as your current email address!", "Error");		
			return;
		}
		
		AthenaDialog.alert("You will be sent an email to confirm and activate this new email address before this change is adopted.", "Email Validation");		
		BillingAPI.changeEmail(ssMain.siteID, newEmail);
	},

    // ////////////////////////////////////////////////////////////////////////

	changeDomain : function(){
	
		var ip = AccountDialog.apolloIP;
		var newDomain = $('#userDomain').val();
		
		if (AccountDialog.userDomain == newDomain){
			AthenaDialog.alert("This is the same as your current domain!", "Error");		
			return;
		}
		
		var msg = "Make sure the A-Record of this domain is set to ApolloSites IP address ("+ip+"). If you have not made these changes";
		msg += " or these changes haven't taken effect yet (it can take up to 24 hours for DNS changes to take effect) then this change ";
		msg += "WILL BREAK YOUR SITE. If this happens, email support at support@apollosites.com and we'll be able to fix it for you!";
		
		AthenaDialog.confirm(msg, AccountDialog.doChangeDomain);
	},

	doChangeDomain : function(){
		var newDomain = $('#userDomain').val();
		var msg = "Your domain has been changed! To administer your site, you'll need to use the new url http://"+newDomain+"/admin";		
		BillingAPI.changeDomain(ssMain.siteID, newDomain, function(newDomain){AthenaDialog.alert(msg, "Domain Changed")});
	},
	
    // ////////////////////////////////////////////////////////////////////////

	changeCard : function(){
		AthenaDialog.alert('Coming soon!');	
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