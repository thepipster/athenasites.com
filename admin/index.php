<?php

require_once("code/php/setup.php");

PageManager::init(1);
PageManager::$page_title = 'ApolloSites | Admin';

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
	<?php
	$post = PostsTable::getLatestPostFromCategory(PageManager::$site_id, 'news');	
	?>
	<h3><?= $post['title'] ?></h3>
	<div id='leftColContents'>
		<?= $post['content'] ?>
	</div>
</div><!-- leftCol -->


<div id='rightCol'>
	<div align='center' id='loginBox' style='padding-top:30px;'>
		
		<h3>Sign in to your site</h3>

		<form id="loginForm" method="get" action="" onsubmit="return false;">

			<table width="90%" border="0">
				<tr>
					<td align="right">Email:</td>
					<td><input class='input_field' type='text' name='email' id='email' value='' class="required email"/></td>
				</tr>
				<tr>
					<td align="right">Password:</td>
					<td><input class='input_field' type='password' name='password' id='password' value='' class="required"/></td>
				</tr>
			</table>				
				
			<br/>
			<div align='center'>				
				<input type="submit" value="Login" onclick='ssLogin.onLogin()'>
				<br/>
				<div class='browser_info'>During our beta period, we recommend using Firefox 3+</div>
				<!--
				<div class='browser_info'>Best viewed in Firefox 3+, Internet Explorer 7+, Chrome 8+ or Safari 5+</div>
				-->
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
PageManager::$page_title = 'Admin';
require_once('themes/ApolloSites/footer.php');
?>