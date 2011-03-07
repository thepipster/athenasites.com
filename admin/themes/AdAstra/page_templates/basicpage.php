<?php
/**
* @Theme: AdAstra
* @Template: Basic Page
* @Description: A basic page which allows you to place any content you want into it.
*/

?>
			
		<div id='page_contents' align='left'>
		
			<table border="0" cellpadding="0" cellspacing="0" width="100%" >
				<tr>
					<!-- Page content -->
					<td width="80%" height="100%" valign="top" align="left" style='padding-left:35px'>

						<?php echo PageManager::getCurrentPageContent(); ?>
		
					</td>
				</tr>	
								
			</table>

		</div>			
			
</div><!-- contents -->