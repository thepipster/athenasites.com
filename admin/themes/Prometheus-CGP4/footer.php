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
		<span class='left '><?= ThemeTable::getGlobalParaValue(PageManager::$site_id, 307) ?></span>
		<span class='right '><?= ThemeTable::getGlobalParaValue(PageManager::$site_id, 308) ?></span>		
	</div> <!-- footer -->

	<br />
	<br />
	<br />

</div>	

<script type="text/javascript">
		
// Don't wait for page to load, just initialize the menu as fast as possible
cgpCommon.init();

</script>

<?php PageManager::doFooter(); ?>
</body>
</html>