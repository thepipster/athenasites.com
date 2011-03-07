<?php
/**
* @Theme: HollyPacione
* @Template: Contact Page
* @Description: A page that will allow your visitors to contact you and request information.
* @Data: Text
*/

//$background_image = PageManager::getMediaURLFromThemePara(205); 

$image = PageManager::getMediaFromThemePara(205); 

if (isset($image)){
	$background_image = PageManager::getMediaURL($image['id']);
	$width = $image['width'];
	$height = $image['height'];
}
else {
	$background_image = PageManager::$common_url_root . 'imgs/blank.png';
	$width = 1350;
	$height = 800;
}


// Email = 206 
?>


	<div id="content" style="border:none;">
		
		<table border="0" cellpadding="0" cellspacing="0" id='contentTable' width="100%" height="100%" style="width:100%; height:100%; background-image: url('<?=$background_image?>')">
			
			<tr valign="top" align='left' height="100%">

				<td width="55%" height="100%"> 
					<!-- Empty -->
				</td>
							
				<td width="45%" height="100%" class='rightCol'>
					<?php echo PageManager::getCurrentPageContent(); ?>
					
					<form id='contactForm' method='post' action='' onsubmit="hpContact.onSubmit(); return false;">
						<input type="text" class='inputText required_name' id='name' name='name' value="Your Name" onfocus="if (this.value == 'Your Name'){this.value = '';}" onblur='hpContact.onChange()'>
						<input type="text" class='inputText required_email' id='email' name='email' value="Your E-mail Address" onfocus="if (this.value == 'Your E-mail Address'){this.value = '';}" onblur='hpContact.onChange()'>
						<input type="text" class='inputText required_phone' id='phone' name='phone' value="Your Phone" onfocus="if (this.value == 'Your Phone'){this.value = '';}" onblur='hpContact.onChange()'>
						<input type="text" class='inputText' id='location' name='location' value="Event Location" onfocus="if (this.value == 'Event Location'){this.value = '';}" onblur='hpContact.onChange()'>
						<input type="text" class='inputText datepicker' id='datetime' name='datetime' value="Requested Date">
						<textarea class='inputTextArea' id='comments' name='comments' onfocus="if (this.value == 'How did you find out about us?'){this.value = '';}" rows="5">How did you find out about us?</textarea>
						<input type="submit" value="Submit" onclick=""><span class='formMessage'></span>
						<!-- <button onclick="hpContact.onSubmit()">Submit</button> -->
					</form>
				</td>
				
			</tr>
			
		</table>
		
	</div>
	
	
		
<script type="text/javascript">

hollyInfoPage.init({
	width: <?= $width ?>,
	height: <?= $height ?>,
	pageType: 'right'
});

// Major version of Flash required
var requiredMajorVersion = 8;

// Minor version of Flash required
var requiredMinorVersion = 0;

// Minor version of Flash required
var requiredRevision = 0;

var hasFlash = DetectFlashVer(requiredMajorVersion, requiredMinorVersion, requiredRevision);

var hpContact = {
		
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
		  		return hpContact.checkEmail(value);
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

			apolloContactRequest.submitRequest(hpContact.site_id, hpContact.page_id, hpContact.nonce, aName, aEmail, aPhone, aLocation, aDatetime, aComments, hpContact.onSentForm);
			
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

$(document).ready(hpContact.init);

</script>