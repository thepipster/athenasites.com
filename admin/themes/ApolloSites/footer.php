<?php
/**
 * @package WordPress
 * @subpackage AdAstra_Theme
 */
 
global $apollo_root_url;

?>
<!-- begin footer -->

	</div> <!-- contents -->
</div> <!-- contentsWrapper -->

   	
<div id='footerBarWrapper'>
	
	<div id='footerBar'>
		<table width="100%">
			<tr align="left" valign="top">
				
				<td width="33%">
					<h3>About ApolloSites</h3>
					<p><a href='<?=$apollo_root_url?>/blog'>Get the latest news at our company Blog</a></p>
					<p><a href='<?=$apollo_root_url?>/privacy.html'>Check out our privacy policy</a></p>
					<p><a href='<?=$apollo_root_url?>/contact.html'>Contact us</a><span class='coming_soon'>(coming soon)</span></p>
					<p><a href='<?=$apollo_root_url?>/privacy-policy-faq.html'>Privacy FAQs</a></p>
				</td>
				
				<td width="33%">
					<h3>Support & Help</h3>
					<p><a href='<?=$apollo_root_url?>/help.html'>Help & guidance on using ApolloSites</a><span class='coming_soon'>(coming soon)</span></p>
					<p><a href='<?=$apollo_root_url?>/support.html'>Request help at the support page</a><span class='coming_soon'>(coming soon)</span></p>
					<p><a href='<?=$apollo_root_url?>/contactsupport.html'>Still stuck? Contact support</a><span class='coming_soon'>(coming soon)</span></p>
				</td>
				
				<td width="33%">
					<h3>Community</h3>
					<p><a href='<?=$apollo_root_url?>/#'>Community wiki</a><span class='coming_soon'>(coming soon)</span></p>
					<h3>Custom Services</h3>
					<p><a href='<?=$apollo_root_url?>/#'>Want us to convert your existing site?</a><span class='coming_soon'>(coming soon)</span></p>
				</td>
			</tr>
		</table>

		<div align="center">
			<div id='copyFooter'>&copy; 2011 ApolloSites. All rights reserved.</div>				
		</div>

	</div>


</div><!-- footerBarWrapper -->
		
<?php PageManager::doFooter(); ?>

</body>
</html>
