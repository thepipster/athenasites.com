<?php
/**
* @Theme: Callisto
* @Template: Contact Page
* @Description: A page that will allow your visitors to contact you and request information.
*/

//$background_image = PageManager::getMediaURLFromThemePara(205); 

$contact_form_background_color = PageParasTable::getParaValue(PageManager::$page_id, 420, PageManager::$site_id);

$style = '';
if (isset($contact_form_background_color)){
	$style = "background-color: #".$contact_form_background_color;
}

?>


	<div id="content" class='basicPage' align="left">
		
		<table border="0" cellpadding="0" cellspacing="0" id='contentTable' width="100%" height="100%" style="width:100%; height:100%;">
			
			<tr valign="top" align='left' height="100%">

				<td width="55%" height="100%"> 
					<?php echo PageManager::getCurrentPageContent(); ?>
				</td>
							
				<td width="45%" height="100%" class='rightCol'>
					
					<form id='contactForm' method='post' action='' style='<?=$style?>' onsubmit="callistoContact.onSubmit(); return false;">

						<span class='fieldName'>Your Name</span>
						<input type="text" class='inputText required_name' id='name' name='name' value="" >

						<span class='fieldName'>Your E-mail Address</span>
						<input type="text" class='inputText required_email' id='email' name='email' value="" >

						<span class='fieldName'>Your Phone</span>
						<input type="text" class='inputText required_phone' id='phone' name='phone' value="" >

						<span class='fieldName'>Event Location</span>
						<input type="text" class='inputText' id='location' name='location' value="" >

						<span class='fieldName'>Requested Date</span>
						<input type="text" class='inputText datepicker' id='datetime' name='datetime' value="">

						<span class='fieldName'>How did you find out about us?</span>
						<textarea class='inputTextArea' id='comments' name='comments' rows="5"></textarea>

						<input class='formButton' type="submit" value="Submit" onclick="">
						<!-- <button onclick="callistoContact.onSubmit()">Submit</button> -->
						
						<span class='formMessage'></span>

					</form>
				</td>
				
			</tr>
			
		</table>
		
	</div>
	
	
		
<script type="text/javascript">

callistoInfoPage.init({
	width: 1350,
	height: 800,
	pageType: 'right'
});

// Major version of Flash required
var requiredMajorVersion = 8;

// Minor version of Flash required
var requiredMinorVersion = 0;

// Minor version of Flash required
var requiredRevision = 0;

var hasFlash = DetectFlashVer(requiredMajorVersion, requiredMinorVersion, requiredRevision);

var callistoContact = {
		
	page_id : <?=PageManager::$page_id?>,
	
	site_id : <?=PageManager::$site_id?>,
        
    nonce : '<?= SecurityUtils::createNonce('email-link') ?>',
	
	sentMessage : 'Message sent, thankyou!',
	
	sentErrorMessage : 'Error sending message!',
	
	init : function(){
									
		// Validation
		$("#contactForm").validate();
			
			
		$.validator.addMethod(
			"required_email", function(value, element) { 
			
		  		if (value == 'Your E-mail Address') return false; 
		  		if (value == '') return false; 
		  		
		  		// Check to see if this group is complete
		  		return callistoContact.checkEmail(value);
			}, 
			"Enter a valid email");

		$.validator.addMethod(
			"required_name", function(value, element) { 
			
		  		if (value == 'Your Name') return false; 
		  		if (value == '') return false; 
		  		
		  		return true;
			}, 
			"Please enter your name");
	
					
		// Setup date picker...
		Date.firstDayOfWeek = 0;
		Date.format = 'mm/dd/yyyy';
		$('.datepicker').datePicker({clickInput:true, startDate:'01/01/2009'});
								
	},
	
	checkEmail : function(email) {
		var filter = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
		if (!filter.test(email)) {
			return false;
		}
		return true;
	},
	
	onChange : function(){
		$("#contactForm").valid();
	},
	
	onSubmit : function(){
		
		if ($("#contactForm").valid()){
			
			var aName = $("#name").val();
			var aEmail = $("#email").val();
			var aPhone = $("#phone").val();
			var aLocation = $("#location").val();
			var aDatetime = $("#datetime").val();
			var aComments = $("#comments").val();
			
			// submitRequest : function(siteID, pageID, reqName, reqEmail, reqPhone, reqLocation, reqDate, reqComments, callback)

			apolloContactRequest.submitRequest(callistoContact.site_id, callistoContact.page_id, callistoContact.nonce, aName, aEmail, aPhone, aLocation, aDatetime, aComments, callistoContact.onSentForm);
			
		}	
		
		return false;
	},
	
	onSentForm : function(isSuccess, isSpam, message){
	
		if (isSuccess){
			$('.formMessage').html("Request sent!");
		}
		else if (isSpam) {
			$('.formMessage').html("Sorry, this comment looks like spam?");
		}
		else {
			$('.formMessage').html(message);
		}	
		
	}

}

// /////////////////////////////////////////////////////////////////////////////////

$(document).ready(callistoContact.init);

</script>