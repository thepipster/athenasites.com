<?php

require_once("code/php/setup.php");

PageManager::init();

// Echo header
require_once('themes/ApolloSites/header.php');

?>

<!-- Javascript includes //////////////////////////////////////////////////////////// -->

<script type="text/javascript" src="code/js/3rdparty/jquery-1.4.2.min.js"></script>
<script type="text/javascript" src="code/js/3rdparty/jquery.validate.min.js"></script>
<script type="text/javascript" src="code/js/3rdparty/jquery.json-2.2.js"></script>
 
<script src="code/js/defines.js" type="text/javascript"></script>
<script src="code/js/utils/AthenaDialog.class.js" type="text/javascript"></script>
<script src="code/js/remoteapi/SystemAPI.class.js" type="text/javascript"></script>


<div id='leftCol'>
	<h3>ApolloSites News & Latest Features</h3>
	<div id='leftColContents'>
		<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin pellentesque, est ut venenatis aliquam, lorem quam porttitor ligula, eget ultrices velit dui sed quam. Praesent vehicula placerat lectus. Nulla pede. Quisque a nulla quis massa pulvinar sagittis. Pellentesque neque massa, mattis vulputate, pellentesque nec, vehicula volutpat, purus. Proin pretium dui et nulla cursus eleifend. Aenean aliquam urna eget urna. Vestibulum euismod elit. Donec eget augue sit amet neque elementum pretium. Proin posuere lacus id lacus. Duis vel justo suscipit neque ornare iaculis.</p>	
		<p>Ut urna urna, rhoncus eget, vestibulum tempus, venenatis non, nunc. Nunc consequat quam in nulla. Praesent feugiat posuere orci. Sed ac ante. Mauris pellentesque massa vitae ante mattis bibendum. Quisque dapibus lectus eu eros. Nulla facilisi. Praesent hendrerit egestas erat. Suspendisse at velit. Quisque mollis feugiat est. Curabitur ut leo. Cras auctor semper augue. Pellentesque leo pede, tempus sed, ornare in, venenatis sed, nisl. Quisque est velit, eleifend vitae, mollis ac, adipiscing at, eros. Mauris velit. Etiam nec lorem. Vestibulum pellentesque ligula a velit. Maecenas felis metus, suscipit et, eleifend vel, accumsan vitae, magna. Phasellus ut justo vel magna congue laoreet.</p>	
		<p>Sed vel nisl. Vivamus pretium est non mauris. Fusce condimentum. Proin molestie. Vestibulum est. Morbi at metus. Nam nisl nulla, euismod at, vehicula nec, molestie vitae, enim. Donec euismod nulla a metus. Suspendisse venenatis metus dapibus dolor. Quisque euismod libero a est. Aliquam feugiat.</p>
	</div>
</div><!-- leftCol -->


<div id='rightCol'>
	<div align='center' id='loginBox' style='padding-top:30px;'>
		
		<h3>Sign in to your site</h3>

		<form id="loginForm" method="get" action="" onsubmit="return false;">

			<table width="90%" border="0">
				<tr>
					<td align="right">Email:</td>
					<td><input type='text' name='email' id='email' value='' class="required email"/></td>
				</tr>
				<tr>
					<td align="right">Password:</td>
					<td><input type='password' name='password' id='password' value='' class="required"/></td>
				</tr>
			</table>				
				
			<br/>
			<div align='center'>
				<input type="submit" value="Login" onclick='ssLogin.onLogin()'>
				<br/>
				<div class='stats'>&nbsp;</div>
			</div>	
				
		</form>
		
	</div>
</div><!-- rightCol -->

<!-- Javascript code /////////////////////////////////////////////////////////////// -->

<script type="text/javascript">


var ssLogin = {

	// ////////////////////////////////////////////////////////////////////////

	init : function(){		
		SystemAPI.init();		
		ssLogin.getStats();				
	},

	// ////////////////////////////////////////////////////////////////////////
	
	onLogin : function(){		
		$('#loginForm').validate({messages: {email: "Enter valid email!", password: "Enter a password"}});
		if ($('#loginForm').valid()){
			SystemAPI.checkUser($('#email').val(), $('#password').val(), ssLogin.onPasswordChecked);
		}
	},
		
	// ////////////////////////////////////////////////////////////////////////
	
	onPasswordChecked : function(isValid){
	
		if (isValid){
			window.location = "main.php";	
		}
		else {
			alert('Bad username/password');
		}
		
	},

	// ////////////////////////////////////////////////////////////////////////
	
	getStats : function(){
		SystemAPI.getStats(ssLogin.onGotStats);
	},	
			
	onGotStats : function(no_users, no_sites, no_pageviews){
    	//var txt = no_sites + " sites, with " + no_users + " users and " + ssLogin.addCommas(no_pageviews) + " page views";
    	var txt = no_sites + " sites, with a total " + ssLogin.addCommas(no_pageviews) + " page views";
    	$('.stats').html(txt);
	},
	
	addCommas : function(nStr) {
		nStr += '';
		x = nStr.split('.');
		x1 = x[0];
		x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
	}
	
}

ssLogin.init();
//$(document).ready(ssLogin.init());

</script>
<?php
// Echo footer
require_once('themes/ApolloSites/footer.php');
?>