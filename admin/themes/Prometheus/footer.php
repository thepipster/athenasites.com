<?php
/**
 * @Theme: CGP4
 */
 
global $tracker_code;

?>

				</td>
				
			</tr>
			
		</table>				
				
	</div> <!-- container -->

	<div id='footer'>
		<span class='left '>Colorado Springs wedding and portrait photographers. Available throughout Colorado and worldwide.</span>
		<span class='right '>charlotte@charlottegeary.com | 719-685-1248</span>		
	</div> <!-- footer -->

	<br />
	<br />
	<br />

</div>	

<script type="text/javascript">

<?= PageManager::echoGoogleTracker($tracker_code); ?>
		
// Don't wait for page to load, just initialize the menu as fast as possible
cgpCommon.init();

</script>

<?php PageManager::doFooter(); ?>
</body>
</html>