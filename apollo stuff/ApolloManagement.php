<?php

// Update page views table
$discRoot = realpath(dirname(__FILE__)) . '/';
$common_code_root = substr($discRoot, 0, strpos($discRoot, 'mu-plugins')) . 'CommonCode/';
$blog_downloads_root = substr($discRoot, 0, strpos($discRoot, 'mu-plugins')) . 'blogs.dir/';

global $url_root;
$url_root = 'http://' . $_SERVER['HTTP_HOST'] . substr($_SERVER['PHP_SELF'], 0, strpos($_SERVER['PHP_SELF'], "wp-content")) . '/wp-content/CommonCode/'; 

require_once($common_code_root . 'php/utils/ApolloLogger.class.php');
require_once($common_code_root . 'php/utils/Session.class.php');

add_action('admin_menu', 'apolloManagement_Menu');

// /////////////////////////////////////////////////////////////////////////////////////////////////////////

function apolloManagement_Menu()
{
	if (is_site_admin())
	{
		add_submenu_page('wpmu-admin.php', 'Apollo Management', 'Apollo Management', 8, 'ApolloManagement', 'showManagement');
	}

}

// /////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
* Stats page
*/
function showManagement()
{
	if (!is_site_admin()) return;
	
	$max_hd_space = get_site_option('blog_upload_space', false, false);	 
			
	echo '<div class="wrap" id="ApolloContentWrapper" style="position:relative;">';
	
	// Get detailed stats for all blogs....
	echo '<h2>Blog List</h2>';
	echo '<br/>';
	
	// Get a list of all the blogs on the systems
	//$blog_list = ApolloPageViewsTable::getBlogList();
	
	global $wpdb;		
	$blog_list = $wpdb->get_results("SELECT * FROM wp_blogs ORDER BY blog_id ASC", ARRAY_A);			

	echo '<table class="widefat">';
	echo '<thead>';
	echo '   <tr>';
	echo '      <th>Blog ID</th>';
	echo '      <th>Site ID</th>';
	echo '      <th>Domain</th>';
	echo '      <th>Number Pages</th>';
	echo '      <th>Number Posts</th>';
	echo '      <th>Weeks Unique Vistors</th>';
	echo '      <th>Months Unique Vistors</th>';
	echo '      <th>Disc Usage (MB)</th>';
	//echo '      <th>Last Update</th>';
	//echo '      <th>Date Registered</th>';
	echo '   </tr>';
	echo '</thead>';
	
	
	$ct = 0;

	foreach ($blog_list AS $blog) {
	
		$ct++;
		// class="alternate"
		
		if ($ct % 2 == 0){
			echo '<tr class="alternate">';
		}
		else {
			echo '<tr>';
		}
			
		$blogid = $blog['blog_id'];
		$siteid = $blog['site_id'];
		$domain = $blog['domain'];
		$date_registered = date("m/d/Y", strtotime($blog['registered']));
		$date_last_update = date("m/d/Y H:i", strtotime($blog['last_updated']));		
		$path = substr($blog['path'], 0, strlen($blog['path'])-1);
		
		$noPages = ApolloPageViewsTable::getNoPages($blogid);
		$noPosts = ApolloPageViewsTable::getNoPosts($blogid);
		$blog_details = get_blog_details($blogid, true);
		    	
		$media_dir =  $blog_downloads_root . $blogid;

		if (file_exists($media_dir)){
			$disc_usage = du($media_dir);
		}
		else {
			$disc_usage = 0;			
		}
				
		$views7uniques = ApolloPageViewsTable::getUniqueViewsLastNDays($blogid, 7);
		$views30uniques = ApolloPageViewsTable::getUniqueViewsLastNDays($blogid, 30);
		
		$disc_usage_pc = ceil(100*$disc_usage/$max_hd_space);
	
		echo '<td>'.$blogid.'</td>';	
		echo '<td>'.$siteid.'</td>';	

		echo "<td><input type='text' value='$domain' id='$blogid'><button onclick=\"updateDomain($blogid, $siteid)\">Update</button><button onclick=\"resetDomain($blogid, $siteid)\">Reset</button></td>";

		echo '<td>'.$noPages.'</td>';	
		echo '<td>'.$noPosts.'</td>';	
		echo '<td>'.$views7uniques.'</td>';	
		echo '<td>'.$views30uniques.'</td>';	

		if ($disc_usage_pc < 40){
			echo '<td><span style="color:green">'.$disc_usage.' (' . $disc_usage_pc . '% )</span></td>';	
		}
		else if ($disc_usage_pc < 80){
			echo '<td><span style="color:orange">'.$disc_usage.' (' . $disc_usage_pc . '% )</span></td>';	
		}
		else if ($disc_usage_pc < 90){
			echo '<td><span style="color:red">'.$disc_usage.' (' . $disc_usage_pc . '% )</span></td>';	
		}
		else {
			echo '<td><span style="color:red; font-weight: bold;">'.$disc_usage.' (' . $disc_usage_pc . '% )</span></td>';	
		}
		
//		echo '<td>'.$disc_usage.' ( ' . number_format(100*$disc_usage/$max_hd_space, 1) . '% )</td>';	
		
		//echo '<td>'.$date_last_update.'</td>';	
		//echo '<td>'.$date_registered.'</td>';	
		
		echo '</tr>';
		
	}	

	echo '</table>';

	echo '<br/>';

	echo '</div>';

	global $url_root;
	
	echo "
		<script type='text/javascript'>
		
		function updateDomain(blogId, siteID){
		
			var newDomain = jQuery('#'+blogId).val();
			
			//alert(blogId + ', ' + siteID);
			
			var commandURL = '{$url_root}php/CommsManager.php';
		
			var paras = {cmd: 101, blog_id: blogId, site_id: siteID, domain: newDomain};
																		
			jQuery.ajax({
				url: commandURL,
				dataType: 'json',
				data: paras,
				success: function(ret){ if(ret.result = 'ok'){window.location.href=window.location.href;}}
			});	
						
		}
		
		
		function resetDomain(blogId, siteID){
		
			var newDomain = jQuery('#'+blogId).val();
			
			var commandURL = '{$url_root}php/CommsManager.php';
					
			var paras = {cmd: 102, blog_id: blogId, site_id: siteID};
																		
			jQuery.ajax({
				url: commandURL,
				dataType: 'json',
				data: paras,
				success: function(ret){ if(ret.result = 'ok'){window.location.href=window.location.href;}}
			});	
						
		}		
		</script>
	";
}

?>