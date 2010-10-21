<?php
/**
* @Theme: Thebe
* @Template: Contact Page
* @Description: Contact Page
*/
		
$pre_gallery_page_id = Session::get('pre_gallery_page_id');

if (!isset($pre_gallery_page_id) || $pre_gallery_page_id == 0){
	$pre_gallery_page_id = PagesTable::getHomepageID(PageManager::$site_id);
}

$gallery_image_list = ClientGalleryTable::getImagesForPage(PageManager::$site_id, $pre_gallery_page_id);
$xml_url = "http://" . $_SERVER['HTTP_HOST'] ."/admin/code/php/getUserGalleryXML.php?p=".PageManager::$site_id.",".$pre_gallery_page_id."&cache=" . mt_rand();


// Get a string representation of a Javascript array to feed to JS xFader (if needed)
$gal_images_string = "[";
$ct = 0;
foreach($gallery_image_list as $gal_mapping){

	if ($ct != 0){
		$gal_images_string .= ", ";
	}

	$image_id = $gal_mapping['image_id'];
	$image = FolderTable::getMedia(PageManager::$site_id, $image_id);	
	
	$image_url = "'" . PageManager::$media_root_url . $image['filepath'] . $image['filename'] . "'";

	$gal_images_string .= $image_url;
	
	$ct++;
}
$gal_images_string .= "]";

?>

<script type="text/javascript">

	<?php if (isset($pre_gallery_page_id)){ ?>
		thebeGallery.preInit();				
	<?php } ?>

</script>

<div  id='popupPage' class='curvedOuterWrapper'>
	<div class='curvedWrapper'>
		<div class="curved" align="center" >
		
			<div class='scrollWrapper' align="left">
			
				<div class='popupContent' align="center">
					<h2><?php echo PageManager::getPageTitle(); ?></h2>
					
					<span class='divider'></span>
									
					<div class='popupText' align="left">
						<?php echo PageManager::getCurrentPageContent(); ?>
						<br/>
					
					<form id='contactForm' method='post' action='' onsubmit="thebeContact.onSubmit(); return false;">					
					<table border="0" cellpadding="50px" cellspacing="0" id='contentTable' width="100%" height="100%" style="width:100%; height:100%;">
						
						<tr valign="top" align='left' height="100%">
							<td colspan='2' >Name</td>
						</tr>

						<tr valign="top" align='left' height="100%">
							<td colspan='2' ><input type="text" class='inputText required_name' id='name' name='name' value=""></td>
						</tr>

						<tr valign="top" align='left' height="100%">
							<td>Email</td>
							<td>Phone</td>
						</tr>

						<tr valign="top" align='left' height="100%">
							<td width="70%"><input type="text" class='inputText required_email' id='email' name='email' value=""></td>
							<td width="30%"><input type="text" class='inputText required_phone' id='phone' name='phone' value=""></td>
						</tr>

						<tr valign="top" align='left' height="100%">
							<td>Event Location</td>
							<td>Requested Date</td>
						</tr>

						<tr valign="top" align='left' height="100%">
							<td><input type="text" class='inputText' id='location' name='location' value=""></td>
							<td><input type="text" class='inputText datepicker' id='datetime' name='datetime' value=""></td>
						</tr>

						<tr valign="top" align='left' height="100%">
							<td colspan='2' >How did you find out about us?</td>
						</tr>							

						<tr valign="top" align='left' height="100%">
							<td colspan='2' ><input type="text" class='inputText' id='request_source' name='request_source' value=""></td>
						</tr>	
						
						<tr valign="top" align='left' height="100%">
							<td colspan='2' >Message</td>
						</tr>
							
						<tr valign="top" align='left' height="100%">
							<td colspan='2' ><textarea class='inputTextArea' id='comments' name='comments' rows="5"></textarea></td>
						</tr>									
									
						<tr valign="top" align='left' height="100%">
							<td colspan='2' ><input type="submit" value="Submit" onclick=""><span class='formMessage'></span></td>
						</tr>																																											
						
					</table>					
					</form>
					
					</div>
					
				</div>
				
			</div>			
			
		</div>
	</div>
</div>

<div id='content'>
</div><!-- content -->
	
		
<script type="text/javascript">

var thebeContact = {
		
	page_id : <?=PageManager::$page_id?>,
	
	site_id : <?=PageManager::$site_id?>,
        
    nonce : '<?= SecurityUtils::createNonce('email-link') ?>',

	init : function(){
									
		// Validation
		$("#contactForm").validate();
						
		$.validator.addMethod(
			"required_email", function(value, element) { 
		  		if (value == '') return false; 
		  		return thebeContact.checkEmail(value);
			}, 
			" ");

		$.validator.addMethod(
			"required_name", function(value, element) { 			
		  		if (value == '') return false; 		  		
		  		return true;
			}, 
			" ");
						
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
		
	onSubmit : function(){
		
		if ($("#contactForm").valid()){
			
			var aName = $("#name").val();
			var aEmail = $("#email").val();
			var aPhone = $("#phone").val();
			var aLocation = $("#location").val();
			var aDatetime = $("#datetime").val();
			var aComments = $("#comments").val();
			
			// submitRequest : function(siteID, pageID, reqName, reqEmail, reqPhone, reqLocation, reqDate, reqComments, callback)

			apolloContactRequest.submitRequest(thebeContact.site_id, thebeContact.page_id, thebeContact.nonce, aName, aEmail, aPhone, aLocation, aDatetime, aComments, thebeContact.onSentForm);
			
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

$(window).ready(function() {

	thebeContact.init();
	
	<?php if (isset($pre_gallery_page_id)){ ?>

	thebeGallery.init({
		swf:"<?= PageManager::$theme_url_root; ?>/flash/fullScreenGal.swf", 
		xml:"<?= $xml_url?>",
		images: <?= $gal_images_string ?>
		});

		
	<?php } ?>

	$('.scrollWrapper').jScrollPane();
	
	// Chrome was stuborn, so wait and try later...
	setTimeout("$('.scrollWrapper').jScrollPane()", 200)
});
	
</script>