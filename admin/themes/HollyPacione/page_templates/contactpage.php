<?php
/**
* @Theme: HollyPacione
* @Template: Contact Page
* @Description: Contact Page
*/

$background_image = PageParasTable::getMediaURLFromThemePara(205);
// Email = 206 
?>

		<div id='content'><div id='scroller'>

			<div class='backgroundImage'>
				<img src="<?=$background_image?>" width='100%' height='100%'/>
			</div>
			
			<div class='rightCol' align="left">
			
				<div class='contentText'>
					<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
														
						<div class="storycontent">
							<?php the_content(__('(more...)')); ?>
						</div>
						
					<?php endwhile; endif; ?>
					
					<form id='contactForm' method='post' action='' onsubmit="return hpContact.onSubmit();">
						<input type="text" class='inputText required_name' id='name' name='name' value="Your Name" onfocus="if (this.value == 'Your Name'){this.value = '';}" onblur='hpContact.onChange()'>
						<input type="text" class='inputText required_email' id='email' name='email' value="Your E-mail Address" onfocus="if (this.value == 'Your E-mail Address'){this.value = '';}" onblur='hpContact.onChange()'>
						<input type="text" class='inputText required_phone' id='phone' name='phone' value="Your Phone" onfocus="if (this.value == 'Your Phone'){this.value = '';}" onblur='hpContact.onChange()'>
						<input type="text" class='inputText' id='location' name='location' value="Event Location" onfocus="if (this.value == 'Event Location'){this.value = '';}" onblur='hpContact.onChange()'>
						<input type="text" class='inputText datepicker' id='datetime' name='datetime' value="Requested Date">
						<textarea class='inputTextArea' id='comments' name='comments' onfocus="if (this.value == 'How did you find out about us?'){this.value = '';}">How did you find out about us?</textarea>
						<input type="submit" value="Submit" onclick=""><span class='formMessage'></span>
						<!-- <button onclick="hpContact.onSubmit()">Submit</button> -->
					</form>
					
					
				</div>
				
			</div>

		</div></div>

		
<script type="text/javascript">

// Major version of Flash required
var requiredMajorVersion = 8;

// Minor version of Flash required
var requiredMinorVersion = 0;

// Minor version of Flash required
var requiredRevision = 0;

var hasFlash = DetectFlashVer(requiredMajorVersion, requiredMinorVersion, requiredRevision);

var hpContact = {

	/** Width of content box gallery viewer */
	imgWidth : 1200,
	
	/** Height of flash gallery viewer */
	imgHeight : 800,

	/** Ratio of width to height */
	imgRatio : 0,

	/** Minimum allowed width */
	minWidth : 800,
	
	commandURL : '<?=PageManager::$theme_url_root?>/php/SendEmail.php',
	
	page_id : <?=PageManager::$page_id?>,
	
	nonce : '<?=wp_create_nonce( 'contact_page' )?>',
	
	sentMessage : 'Message sent, thankyou!',
	
	sentErrorMessage : 'Error sending message!',
	
	init : function(){
						
		// Optimize size for gallery
		//hpContact.imgRatio = hpContact.imgHeight / hpContact.imgWidth;
		hpContact.imgRatio = hpContact.imgWidth / hpContact.imgHeight;
	
		hpContact.onResize();
		
		setTimeout("hpContact.onResize()", 200);
			
			
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
	
	onResize : function(){

		if (hasFlash){
								
			var galH = $("#wrapper").height() - $("#nav_container").height();
			var galW = Math.floor(hpContact.imgRatio * galH);	
					
			//alert('Min width: ' + $("#nav_container").attr('min-width'));			
			
			if (galW > hpContact.minWidth){
			
				$("#nav_container").width(galW);	
				$("#container").width(galW);	
				
				$("#content").height(galH);
				$("#content").width(galW);
				
			}
		}
		
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
			
			//alert(aName + " " + aEmail + " " + aPhone + " " + aLocation + " " + aDatetime + " " + aComments); 
			
			var paras = {page_id: hpContact.page_id, nonce: hpContact.nonce, name: aName, email: aEmail, phone: aPhone, location: aLocation, comments: aComments, datetime: aDatetime};
					
			jQuery.ajax({
				url: hpContact.commandURL,
				dataType: "text",
				data: paras,
				success: function(ret){hpContact.onSentForm(ret);}
			});	
		}		
		
		return false;
	},
		
	onSentForm : function(ret){
		
		if (ret == "TRUE"){
			$('.formMessage').html(hpContact.sentMessage);
		}
		else if (ret == "FALSE"){
			$('.formMessage').html(hpContact.sentErrorMessage);
		}
		else if (ret == "NA"){
			$('.formMessage').html("Not authorized error!");
		}
		else {
			$('.formMessage').html("Unknown error!");
		}
	}

}

// /////////////////////////////////////////////////////////////////////////////////

$(document).ready(hpContact.init);
$(window).resize(hpContact.onResize);

</script>