<?php
/**
* Print out Javascript data that is used by the ImagePicker class
*/
function echoImagePickerJSImageData(){

	global $blog_id;
	
	ApolloLogger::debug("Blog ID: $blog_id");
	
	$args = array(
		'post_type' => 'attachment',
		'numberposts' => -1,
		'post_status' => null,
		'post_parent' => null, // any parent
		'orderby' => 'date'
		); 
		
	$attachments = get_posts($args);		
		
	$array_str = "Array(";
	$favicon_array_str = "Array(";
	$ct = 0;
	$fav_ct = 0;
		
	$domain = WordPressHelper::getDomain($blog_id);
	ApolloLogger::debug("Domain =  $domain");
		
	if (isset($attachments)) {
		foreach ($attachments as $post) {		
			
			//ApolloLogger::dump($post);
			
			$post_id = $post->ID;
			$mime_type = $post->post_mime_type; // e.g. image/jpeg
			$date_gmt = $post->post_date_gmt; // e.g. 2010-01-22 01:05:59
			
			$dateadded = date("m/d/Y H:i", strtotime($date_gmt)); // Convert to JS compatible date
			
			//$image_url = $post->guid;
			$image_url = WordPressHelper::getRealImageURL($post_id, $blog_id);
			
			$thumb_url = WordPressHelper::getRealThumbBasename($post_id, $blog_id);			
			//$thumb_url = wp_get_attachment_thumb_url($post_id);			
			//$thumb_url = substr($thumb_url, strlen($domain));
			
			$meta = wp_get_attachment_metadata($post_id);
			
			$caption = htmlentities($post->post_excerpt, ENT_QUOTES);
			$title = htmlentities($post->post_title, ENT_QUOTES);
			$description = htmlentities($post->post_content, ENT_QUOTES);
			$folder_id = FolderTable::getMediaFolderID($post_id, $blog_id);
			$image_width = $meta['width'];
			$image_height = $meta['height'];

			//ApolloLogger::debug("Post ID: $post_id Folder ID: $folder_id");
			if (!isset($folder_id)) $folder_id = 1; // unassigned folder id			

			if (ImageUtils::isImageFromMime($mime_type)){		
			
				if ($ct != 0){
					$array_str .= ',';
				}
				
				$array_str .= "{thumb_url:'$thumb_url', post_id:$post_id, title:'$title', date_added:'$dateadded', folder_id:'$folder_id', width:".$image_width.", height:".$image_height."}\n";			
											
				if ($image_width == 16 && $image_height == 16){
					if ($fav_ct != 0){
						$favicon_array_str .= ',';
					}
					$favicon_array_str .= "{thumb_url:'".$post->guid."', image_url:'$image_url', post_id:$post_id, title:'".basename($post->guid)."', date_added:'$dateadded', folder_id:'$folder_id', width:16, height:16}\n";							
					$fav_ct++;
				}
				
				$ct++;
			}
			elseif (stripos($post->guid, ".ico") > 0){
				if ($fav_ct != 0){
					$favicon_array_str .= ',';
				}
				$favicon_array_str .= "{thumb_url:'".$post->guid."', image_url:'$image_url', post_id:$post_id, title:'".basename($post->guid)."', date_added:'$dateadded', folder_id:'$folder_id', width:16, height:16}\n";							
				$fav_ct++;
			}
	
		}
	}		
		
	$array_str .= ")";	
	$favicon_array_str .= ")";
				
				
	// Get the folder list.........
	$folder_list = FolderTable::getFoldersForBlog($blog_id);
	
	$folder_array_str = 'Array(';
	for ($ct=0; $ct<count($folder_list); $ct++){
		if ($ct != 0){
			$folder_array_str .= ',';
		}
		$folder_id = $folder_list[$ct]['id'];
		$folder_name = $folder_list[$ct]['name'];
		$folder_array_str .= "{id:$folder_id, name:'$folder_name'}";			
	}
	$folder_array_str .= ')';		
					
	$command_url = 'http://' . $_SERVER['HTTP_HOST'] . substr($_SERVER['PHP_SELF'], 0, strpos($_SERVER['PHP_SELF'], "wp-content")) . '/wp-content/CommonCode/php/'; 
					
	echo '
	<div id="ApolloImageSelector" title="Select a image"></div>

	<script type="text/javascript">
	
	var ImagePickerData = {
	
		commandURL : "'.$command_url.'CommsManager.php",
		imageList : '.$array_str.',
		folderList : '.$folder_array_str.',
		favIconList : '.$favicon_array_str.'
						
	}
		
	//jQuery(document).ready(function($) {ApolloPlugin.init()});	
	
	</script>';
	
}

// ////////////////////////////////////////////////////////////////////////////////////////////////

/**
* Print out Javascript data that is used by the StatViewer class
*/
function echoPageViewsData($isGlobal=false){

	global $blog_id;
	date_default_timezone_set('UTC');
	
	
	// Get detailed stats for all blogs....
	if (!$isGlobal){
		$view_data = StatsRollupTables::getPageViewsLastNDays($blog_id, 30);
		$crawler_data = StatsRollupTables::getCrawlerViewsLastNDays($blog_id, 30);		
		$browser_data = StatsRollupTables::getBrowserViewsLastNDays($blog_id, 30);		
		$os_data = StatsRollupTables::getOSViewsLastNDays($blog_id, 30);		
	}
	else {
		$view_data = StatsRollupTables::getGlobalPageViewsLastNDays(30);
		$crawler_data = StatsRollupTables::getGlobalCrawlerViewsLastNDays(30);
		$browser_data = StatsRollupTables::getGlobalBrowserViewsLastNDays(30);		
		$os_data = StatsRollupTables::getGlobalOSViewsLastNDays(30);		
	}

	//ApolloLogger::dump($view_data);

	// Create the page view array

	$data_length = count($view_data);
	$unique_str = '';
	$views_str = '';
	$dates_str = '';
	
	for($ct=0; $ct<$data_length; $ct++){

		if ($ct != 0){
			$unique_str .= ',';
			$views_str .= ',';
			$dates_str .= ',';
		}

		//$array_str .= "{daysago:'".$ct."', views:'".$ct."'}";			
		$unique_str .= $view_data[$ct]['unique_visits'];			
		$views_str .= $view_data[$ct]['page_views'];	
		
		// Change date to JS friendly formt
		$jsDate = date("m/d/Y", strtotime($view_data[$ct]['rollup_date']));
		$dates_str .= '"'.$jsDate.'"';
	}


	// Get the crawler data....
		
	$crawler_str = '';
	$data_length = count($crawler_data);
	
	for($ct=0; $ct<$data_length; $ct++){

		if ($ct != 0){
			$crawler_str .= ',';
		}

		// Crawler data
		$jsDate = date("m/d/Y", strtotime($crawler_data[$ct]['rollup_date']));
		$crawler_str .= '{crawler:"'.$crawler_data[$ct]['crawler'].'", hits:'.$crawler_data[$ct]['hits'].', statdate:"'.$jsDate.'"}';									
	}	
	
	// Get the browser stats
	
	$browser_str = '';
			
	$data_length = count($browser_data);
		
	for($ct=0; $ct<$data_length; $ct++){

		if ($ct != 0){
			$browser_str .= ',';
		}

		// Crawler data
		//$jsDate = date("m/d/Y", strtotime($crawler_data[$ct]['rollup_date']));
		$browser_str .= '{browser:"'.$browser_data[$ct]['browser'].'", version:"'.$browser_data[$ct]['browser_ver'].'", hits:'.$browser_data[$ct]['hits'].'}';									
	}	
	
	//error_log($browser_str);
	
	// Get the OS stats
	
	$os_str = '';
	
	//ApolloLogger::debug("Unique Views: " . $unique_str);
	//ApolloLogger::debug("Page Views: " . $views_str);
			
	$is_global_str = 'false';
	if ($isGlobal) $is_global_str = 'true';
			
	echo '

	<div align="center">
		<table border="0" width="100%" cellspacing="15px">
			<tr>
				<td colspan="2" align="center">
					Traffic last 30 days
				</td>
			</tr>
			<tr>
				<td colspan="2" align="center">
					<div id="ApolloStatGraph" style="width:100%; height:500px; background-color:white"></div>
				</td>
			</tr>
			<tr>
				<td align="center">Search Engine Crawler Activity
				</td>
				<td width="50%" align="center">Browser Share					
				</td>
			</tr>
			<tr>
				<td align="center">
					<div id="ApolloCrawlerGraph" style="width:100%; height:500px; background-color:white"></div>
				</td>
				<td width="50%" align="center">					
					<div id="ApolloPieGraph" style="width:100%; height:500px; background-color:white"></div>
				</td>
			</tr>
		</table>
	</div>
	
	<script type="text/javascript">
			
		var StatViewerData = {	
			dateList : Array('.$dates_str.'),		
			uniqueViewList : Array('.$unique_str.'),		
			pageViewList : Array('.$views_str.'),						
			crawlerStats : Array('.$crawler_str.'),						
			osStats : Array('.$os_str.'),						
			browserStats : Array('.$browser_str.'),
			isGlobal : '.$is_global_str.'			
		}
		
		StatViewer.paintStatGraph("#ApolloStatGraph");
		StatViewer.paintCrawlerGraph("#ApolloCrawlerGraph");
		StatViewer.paintPieChart("#ApolloPieGraph");
		
		
	</script>';
}
?>