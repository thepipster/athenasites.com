<?php
/**
* @Theme: ApolloSites
* @Template: Themes Page
* @Description: Themes Page
*/
		
$theme_list = DatabaseManager::getResults("SELECT * FROM apollo_Theme WHERE is_private = 0");
			
?>
<div class="coda-slider-wrapper">
	<div id='theme_table' class="coda-slider preload" >
	<?php
						
	foreach($theme_list as $theme){
			
		$theme_id = $theme['id'];
		$theme_name = $theme['theme_name'];
		$theme_description = $theme['description'];
		$theme_title = $theme['theme_title'];
		//$theme_price = $theme['theme_price'];						
		$theme_url = $theme['thumb_url'];
		$theme_demo_url = $theme['demo_url'];
		
		$page_templates = TemplateManager::getThemePageTemplates($theme_name);
						
		?>								
		<div class='panel'>
			<div class='panel-wrapper' align='left'>
		
				<h2 class='title'><?=$theme_title?></h2>
				<p>
		
					<div class='themeWrapper'>
						<img class='themeImage' src='<?=$theme_url?>'/>
						<div class='themeText'>
							<?=$theme_description?>
							<br/>
							
							<a class='ApolloButton' style='margin-top:10px' href="/themes/signup.html?theme=<?=$theme_id?>">Select Theme</a>
							<a class='ApolloButton' style='margin-top:10px' href='<?=$theme_demo_url?>' target='_blank'>View Demo</a>
							
						</div>					
					</div>
						
					
					<br/>
	
					<h3><?=$theme_title?> pages</h3>
						
					<?php
					foreach($page_templates as $template){
			
						$template_name = $template['template_name'];
						$template_desc = $template['template_description'];
						$template_thumb_url = $template['thumbnail'];
					?>
			
					<div class='templateWrapper'>
						<img class='templateImage' src='<?=$template_thumb_url?>' width='50px'/>
						<div class='templateTextWrapper'>
							<div class='templateName'><?=$template_name?></div>
							<div class='templateDescription'><?=$template_desc?></div>
						</div>
					</div>
					
					<?php
					}
					?>
		
				</p>
			</div><!-- panel-wrapper -->
		</div><!-- panel -->
	<?php
	}	
	?>
	</div><!-- theme_table -->
</div><!-- coda-slider-wrapper -->

				

<script type="text/javascript">

// see http://www.digitalia.be/software/reflectionjs-for-jquery#download
//$('.theme_image').reflect({height:200,opacity:0.5});

var themeSelect = {
	
	onMouseOver : function(theme_id){
		//$("themeimg_"+theme_id).hide();
		//$("#themeimg_"+theme_id).effect('scale', { percent: 50, direction: 'both' }, 1000);	
	}
}

$().ready(function() {
	$('#theme_table').codaSlider({
		dynamicArrows: true,
		dynamicArrowLeftText:'',
		dynamicArrowRightText:'',
		dynamicTabs: true,
		dynamicTabsAlign: 'left'
	});
});

		
</script>