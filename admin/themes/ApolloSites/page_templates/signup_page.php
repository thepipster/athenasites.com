<?php
/**
* @Theme: ApolloSites
* @Template: Signup Page
* @Description: Signup Page
*/

$theme_id = CommandHelper::getPara('theme', false, CommandHelper::$PARA_TYPE_NUMERIC);

if (!isset($theme_id) || $theme_id < 2) {
	die();
}

$months = array(
	1 => 'Jan',
	2 => 'Feb',
	3 => 'Mar',
	4 => 'Apr',
	5 => 'May',
	6 => 'Jun',
	7 => 'Jul',
	8 => 'Aug',
	9 => 'Sep',
	10 => 'Oct',
	11 => 'Nov',
	12 => 'Dec'
);

// Get the selected theme
$theme = DatabaseManager::getSingleResult(DatabaseManager::prepare("SELECT * FROM apollo_Theme WHERE is_private = 0 AND id = %d", $theme_id));

$theme_id 			= $theme['id'];
$theme_name 		= $theme['theme_name'];
$theme_description 	= $theme['description'];
$theme_title 		= $theme['theme_title'];
//$theme_price = $theme['theme_price'];						
$theme_url 			= $theme['thumb_url'];
$theme_demo_url 	= $theme['demo_url'];

Logger::dump($theme);

?>

<div id='SignupPage' align="left">
	
	<!-- Account Panel ////////////////////////// -->
	
	<div id='createAccountPanel'>
	
		<h2>Create an account</h2>
						
		<h3>Theme</h3>
		
		<img class='themeImage' src='<?=$theme_url?>' />		
		
	    <div class='themeInfoWrapper'>
			<p>You've selected the <span class='themeTitle'><?=$theme_title?></span> theme</p>
			<p>Monthly service fee:<span class='price'>$25.00</span></p>
			<p class='infoText'>The first month of service is free, and you can cancel at any time.</p>
		</div>

		<h3>Setup your account</h3>

	    <div class='dataWrapper'>
	    	<p class='infoText'>Select a URL for your website, this will be your new website's URL but you can easily point another domain to your ApolloSites website later. Your URL must only contain letters or numbers.</p>
		    <span class='dataLabel'>Select your URL</span><input class='dataValue usernameValue' id='username' type='text' value=''/><span class='domain'>.apollosites.com</span><span class='accountAvailability'></span>
	    </div>

	    <div class='dataWrapper'>
		    <span class='dataLabel'>Your email</span><input class='dataValue' id='email' type='text' value='' /><span class='emailValidity'></span>
	    </div>
	
		<br/>
		
	    <p class='infoText'>If you have a coupon or referral code, use it below</p>

	    <div class='dataWrapper'>
		    <span class='dataLabel'>Coupon Code</span><input class='dataValue' type='text' id='couponCode'/>
	    </div>
		    			
	</div>
	
	<!-- EULA Panel ////////////////////////// -->

	<div id='eulaPanel' style='display:none'>
		<?=file_get_contents(PageManager::$theme_url_root . "/eula.html");?>
	</div>
		
	<!-- Credit Card Panel ////////////////////////// -->
	
	<div id='checkoutPanel' style='display:none'>
	
	    <h3>Enter Your Credit Card Details</h3>
			
		<p>Please enter your credit card details. We currently only accept Visa and Mastercard.</p>	
		
	    <div class='dataWrapper'>
	    	<span class='dataLabel'>Name on Card</span><input id='cardName' class='dataValue' type='text' />
		    <span class='cardTypeIcon'></span>
	    </div>
	
	    <div class='dataWrapper'>
		    <span class='dataLabel'>Card Number</span><input id='cardNumber' class='dataValue' type='text' />
	    </div>
			
	    <div class='dataWrapper'>
		    <span class='dataLabel'>Expiration</span>
				
		    <span class='dataValue'>
		        <select class='expMonth' id='cardExp'>
					<?php
					for ($m=1; $m<=12; $m++){
		            	echo "<option value='$m'>$m - " . $months[$m] . "</option>";
		            }
		            ?>
		        </select>
		
		        <select class='expYear'>
					<?php
					for ($y=2011; $y<=2030; $y++){
		            	echo "<option value='$y'>$y</option>";
		            }
		            ?>
		        </select>
		    </span>		
	    </div>
			
	    <div class='dataWrapper'>
		    <span class='dataLabel'>Security Code</span><input id='cardSecurityCode' class='dataValue' type='text' />
	    </div>
			
	    <br/>
			
	    <div class='dataWrapper'>
		    <span class='dataLabel'>Address</span><input id='cardAddress1' class='dataValue' type='text' />
	    </div>
	
	    <div class='dataWrapper'>
		    <span class='dataLabel'>Address</span><input id='cardAddress2' class='dataValue' type='text' />
	    </div>
	
	    <div class='dataWrapper'>
	    	<span class='dataLabel'>City</span><input id='cardCity' class='dataValue' type='text' />
	    </div>
	
	    <div class='dataWrapper'>
	    	<span class='dataLabel'>State/Province</span><input id='cardState' class='dataValue' type='text' />
	    </div>
			
	    <div class='dataWrapper'>
	    	<span class='dataLabel'>Zip/Postcode</span><input id='cardZip' class='dataValue' type='text' />
	    </div>
	
	    <div class='dataWrapper'>
	    	<span class='dataLabel'>Country</span>
			<script type="text/javascript">
				document.write(isoCountry.getHTML('cardCountry', 'dataValue countrySelect'));
			</script>	
		</div>	

		<br/>
		
		<p class='infoText'>By clicking the button below, you agree to allow us to bill your credit card monthly. We will bill your account on the first day of every month. You can cancel at anytime, and the cancellation will take effect on the first day of the following month.</p>	
		    			
	</div>
		
	<!-- Credit Card Panel ////////////////////////// -->
	
	<div id='completePanel' style='display:none'>
		
		<h3>Thankyou and welcome to ApolloSites!</h3>
		
		<p>
		We will shortly send you a confirmation email, you'll need to click the link to activate your account. As soon as you've activated your account your website will be live!
		</p>

		<h3>Your Website</h3>
		
		<p>You can visit your website at: <a id='sitelink' href='' target='_blank'><span class='siteLink'>http://mike.apollosites.com</span></a></p>

		<h3>Administer Your Site</h3>
		<p>
		You can customize and administer your site by logging in with your email and password. We will send you a temporary password via email, you can change your password at anytime
		using your account settings.
			<a id='adminlink' href='' target='_blank'><span class='siteLink'>http://mike.apollosites.com/admin</span></a>
		</p>

		<h3>Support & Help</h3>
		<p>Checkout our <a href='http://apollosites.com/support/quick-start-guide.html' target='_blank'><b>quick start guide</b></a>. You can also find more help and support on our Support pages, and email us with any questions you have at support@apollosites.com</p>
		
	</div>
			
	<button id='create_button' class='ApolloButton SignupButton' onclick='apSignup.createAccount()'>Create Account</button>
	<button id='agree_button' class='ApolloButton SignupButton' style='display:none' onclick='apSignup.eulaAgree()'>Click to Agree</button>
	<button id='buy_button' class='ApolloButton SignupButton' style='display:none' onclick='apSignup.buy()'>Purchase</button>
		
</div>			

<script src="http://closure-library.googlecode.com/svn/trunk/closure/goog/base.js"></script> 
<script src="http://closure-library.googlecode.com/svn/trunk/closure/goog/string/string.js"></script>  
<script src="http://closure-library.googlecode.com/svn/trunk/closure/goog/format/emailaddress.js"></script>  

<script type="text/javascript">

var apSignup = {

	emailOK : false,
	usernameOK : false,
		
	email : '',
	username : '',
	name : '',
	coupon : '',
	
	// ///////////////////////////////////////////////////////////////

	init : function(){
	
		$('#username').typing({ stop: apSignup.checkAccount, delay: 400});
		$('#email').typing({ stop: apSignup.checkEmail, delay: 400});
		$('#cardNumber').typing({ stop: apSignup.onCardNumber, delay: 400});

		$('.ApolloButton').hide();	
		$('#create_button').show()
	},
	
	// ///////////////////////////////////////////////////////////////

	createAccount : function(){
		
		apSignup.checkEmail();
		apSignup.checkAccount();
				
		if (apSignup.emailOK && apSignup.usernameOK){
		
			apSignup.coupon = $('#couponCode').val();
			
			$('#createAccountPanel').hide();			
			$('#eulaPanel').show();			
			$('#checkoutPanel').hide();	
			
			$('.ApolloButton').hide();	
			$('#agree_button').show()
		}
	},
	
	// ///////////////////////////////////////////////////////////////
	
	eulaAgree : function(){
									
		var paras = {cmd : 'logEulaAgreement', em: apSignup.email, us: apSignup.username};
				
		$.ajax({
			url: '/admin/code/php/remoteapi/SystemAPI.php',
			dataType: "json",
			data: paras,
			success: function(ret){
				if (ret.result == 'ok'){
				
					$('#createAccountPanel').hide();			
					$('#eulaPanel').hide();			
					$('#checkoutPanel').show();	
					
					$('.ApolloButton').hide();	
					$('#buy_button').show()
					
				}
			}
		});	
				
	},
	
	// ///////////////////////////////////////////////////////////////

	buy : function(){
/*
		$email = CommandHelper::getPara('em', true, CommandHelper::$PARA_TYPE_STRING);
		$name = CommandHelper::getPara('nm', true, CommandHelper::$PARA_TYPE_STRING);
		$username = CommandHelper::getPara('us', true, CommandHelper::$PARA_TYPE_STRING);
		$theme_id = CommandHelper::getPara('tid', true, CommandHelper::$PARA_TYPE_NUMERIC);
*/
		var name = $('#cardName').val();
		var number = $('#cardNumber').val();
		var exp = $('#cardExp').val();
		var code = $('#cardSecurityCode').val();
		var address1 = $('#cardAddress1').val();
		var address2 = $('#cardAddress2').val();
		var city = $('#cardCity').val();
		var state = $('#cardState').val();
		var zip = $('#cardZip').val();
		var country = $('#cardCountry').val();

		apSignup.name = name;

		// TODO: Add credit card stuff
		apSignup.onCreditCardOK();
	},

	// ///////////////////////////////////////////////////////////////

	onCreditCardOK : function(){

		var paras = {cmd : 'createUser', em: apSignup.email, us: apSignup.username, nm: apSignup.name, tid: <?= $theme_id ?>, nonce: '<?= SecurityUtils::createNonce('create-user') ?>', cp: apSignup.coupon};
				
		$.ajax({
			url: '/admin/code/php/remoteapi/SystemAPI.php',
			dataType: "json",
			data: paras,
			success: function(ret){

				$('#createAccountPanel').hide();			
				$('#eulaPanel').hide();			
				$('#checkoutPanel').hide();	
		
				$('.ApolloButton').hide();	
		
				$('#completePanel').show();
				
				$('#sitelink').attr('href',"http://"+apSignup.username+".apollosites.com");
				$('#sitelink').html("<span class='siteLink'>http://"+apSignup.username+".apollosites.com</span>");
		
				$('#adminlink').attr('href',"http://"+apSignup.username+".apollosites.com/admin");
				$('#adminlink').html("<span class='siteLink'>http://"+apSignup.username+".apollosites.com/admin</span>");
			
			}
		});	
	},
		
	// ///////////////////////////////////////////////////////////////
	
	checkEmail : function(){

		$('.emailValidity').removeClass('emailValid emailInvalid');
		
		var email = $('#email').val();

		if (goog.format.EmailAddress.isValidAddress(email)){
			$('.emailValidity').addClass('emailValid');
			apSignup.emailOK = true;
			apSignup.email = email;
		}
		else {
			$('.emailValidity').addClass('emailInvalid');
			apSignup.emailOK = false;
		}
		
	},
	
	// ///////////////////////////////////////////////////////////////
	
	checkAccount : function(){
		
		//var username = $('#username').val().replace(/ /g,'');
		var username = $('#username').val();
		username = $.trim(username);
		username = username.replace(/[^a-zA-Z 0-9]+/g,'');
		
		$('#username').val(username);

		if (username == ''){
			$('.accountAvailability').addClass('accountTaken');					
			return;
		}
		
		$('.accountAvailability').removeClass('accountFree accountTaken');
			
		var paras = {cmd : 'checkUser', us: username};
				
		$.ajax({
			url: '/admin/code/php/remoteapi/SystemAPI.php',
			dataType: "json",
			data: paras,
			success: function(ret){
				if (ret.result == 'ok' && ret.data == 'true'){	
					$('.accountAvailability').addClass('accountTaken');					
					apSignup.usernameOK = false;
				}
				else {
					$('.accountAvailability').addClass('accountFree');					
					apSignup.username = username;
					apSignup.usernameOK = true;
				}			
			}
		});	
				
	},
	
    // ////////////////////////////////////////////////////////////////////////

	onCardNumber : function(){
			
		var number = $('#cardNumber').val();
		var type = apSignup.getCardTypeByNumber(number);

		$('.cardTypeIcon').removeClass('visa amex mastercard');

		switch(type){
			case 'AMEX' : $('.cardTypeIcon').addClass('amex'); break;
			case 'Visa' : $('.cardTypeIcon').addClass('visa'); break;
			case 'MasterCard' : $('.cardTypeIcon').addClass('mastercard'); break;
		}
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
    	if (apSignup.getCardTypeByNumber(str) == '?') return false;
    	return true;
	}    
	
	
}

$(document).ready(apSignup.init());
</script>