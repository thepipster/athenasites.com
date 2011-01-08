/*
 * Class that allows the user to view and edit their account settings
 *
 * @author Mike Pritchard (mike@apollosites.com)
 */
var AccountDialog = {

    // ////////////////////////////////////////////////////////////////////////

    show : function(){

        var txt = "";
        txt += "<div id='apolloAccountSettings'>";

		txt += "<h3>Account Settings</h3>";

		txt += "<div class='dataWrapper'>";
		txt += "<span class='dataLabel'>Domain</span><input class='dataValue' type='text' />";
		txt += "</div>";

		txt += "<div class='dataWrapper'>";
		txt += "<span class='dataLabel'>Email</span><input class='dataValue' type='text' />";
		txt += "</div>";

		txt += "<div class='dataWrapper'>";
		txt += "<span class='dataLabel'>Address</span><input class='dataValue' type='text' />";
		txt += "</div>";

		txt += "<h3>Billing</h3>";
		
		txt += "<div class='dataWrapper'>";
		txt += "<span class='dataLabel'>Domain</span><input class='dataValue' type='text' />";
		txt += "</div>";

		        
        txt += "</div>";

		// Change password
		
		// email, name, nice_name
		// payment_plan, last_payment, next_payment_due, monthly_fee,
		// address, city, state, post_code, iso_country_code, 
		// service_client_gallery
		// latitude, longitude
		
        $('#apollo_dialog').html(txt);
        $('#apollo_dialog').dialog( 'destroy' );
        $('#apollo_dialog').dialog({
            modal: false,
            width:600,
            height: 500,
            resizable:false,
            buttons: {
                Ok: function() {
                    $(this).dialog('close');
                }
            },
            title: 'Your Account Settings'});

    }

    // ////////////////////////////////////////////////////////////////////////
}