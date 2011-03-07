<?php
/**
* @Theme: CGP4
* @Template: Contact Page
* @Description: A page that will allow your visitors to contact you and request information.
*/

?>

<!-- CONTACT PAGE /////////////////////////// -->

<div class='pageContents'>

	<table width="100%" height="100%" border="0">
		<tr>
			<td width="50%" valign="top">
				<div class='infoPageText'>
					<?php echo PageManager::getCurrentPageContent(); ?>
				</div>
			</td>
			<td width='50%' valign="top">
			
				<form id='contactForm' name="date" method="post" action="http://www.shootq.com/public/contactus_action.php">
			
				
					<table width="100%" cellpadding="1" cellspacing="1" border="0">

						<input type="hidden" name="strPhoneWork" value="">
						<input type="hidden" name="nCompanyID" value="495">								
						<input type="hidden" name="strCompanyAbb" value="CHA">										
						
						<tr	>
							<td width='25%' class='spacer'></td>
							<td width='75%'></td>
						</tr>							
						<tr>
							<td colspan="2" align='center'><h2>I'd love to hear from you!</h2><br></td>
						</tr>
						<tr>
							<td align="right" class='fieldName'>First Name</td>
							<td align="left" class='fieldInput'><input type="text" name='strFirstName' value=""/></td>
						</tr>
						<tr>
							<td align="right" class='fieldName'>Last Name</td>
							<td align="left" class='fieldInput'><input type="text" name='strLastName' value=""/></td>
						</tr>
						<tr>
							<td align="right" class='fieldName'>Cell Phone</td>
							<td align="left" class='fieldInput'><input type="text" name='strPhoneCell' value=""/></td>
						</tr>
						<tr>
							<td align="right" class='fieldName'>Home Phone</td>
							<td align="left" class='fieldInput'><input type="text" name='strPhoneHome' value=""/></td>
						</tr>
						<tr>
							<td align="right" class='fieldName'>Email</td>
							<td align="left" class='fieldInput'><input type="text" name="strEmail"></td>
						</tr>
						<tr>
							<td align="right" class='fieldName'>Type of event</td>
							<td align="left" class='fieldInput'>
								<select name="nType">
									<option value="">Select a type...</option>
									<option value="1">Wedding</option>
									<option value="265">Portrait</option>
									<option value="266">Other</option>
								</select>
							</td>
						</tr>
						<tr>
							<td align="right" class='fieldName'>Date</td>
							<td align="left" class='fieldInput'><input name="weddingdate" id="weddingdate" class="date-pick" /></td>
						</tr>
						<tr>
							<td align="right" class='fieldName'>Referred by</td>
							<td align="left" class='fieldInput'><input name='strReferredBy' value=""/></td>
						</tr>
						<tr>
							<td align="right" class='fieldName'>Message</td>
							<td align="left" class='fieldInput'><textarea name='blobComments' rows='10' value="test"></textarea></td>
						</tr>
						<tr>
							<td></td>
							<td><input type="submit" value="Submit" class='button'></td>
						</tr>
						<tr	>
							<td class='spacer'></td>
							<td></td>
						</tr>							


					</table>

				</form>
				
			</td>
		</tr>
	</table>

</div><!-- infoPage -->

<script type="text/javascript">

var cgpContact = {

	// //////////////////////////////////////////////////////////////////////////////

	init : function(){
		
		Date.firstDayOfWeek = 7;
		Date.format = 'yyyy-mm-dd';
		$('.date-pick').datePicker({clickInput:true, createButton:false});
		
		cgpCommon.init('contact');
		
	}
		
}

// /////////////////////////////////////////////////////////////////////////////////

$(document).ready(cgpContact.init);

</script>