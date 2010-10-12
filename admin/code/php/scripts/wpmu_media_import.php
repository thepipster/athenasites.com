<?php
/* 
 * This script imports media from Wordpress to Athena. We assume we have access to
 * both databases to make this work!
 * 
 * This was built to move Holly Pacione from our old version to the new system (Athena). 
 * Also, intend to used the same to move Charlotte Geary from a standard WP install
 * over to Athena.
 *
 * @author Mike Pritchard
 * @since 6th October, 2010
 */

// Setup, which will also open a connection to the Athena database
require_once("../setup.php");

Logger::echoLog();

global $wpdb, $wpHost, $wpUsername, $wpPassword, $wpDatabase;

$wpHost = database_host;
$wpUsername = database_user;
$wpPassword = database_pass;
$wpDatabase = "apollo_wpmu";
$wpBaseDir = "/Users/mikep/sites/apollosites.com";

$wpSiteID = 2;
$athenaSiteID = 5;
$athenaUserID = 3;

// Get the base folder for ahthena user's media
$base_folder = SecurityUtils::getMediaFolder($athenaSiteID);

// Clear the athena sites tables
mysql_select_db('athenasites');

DatabaseManager::submitQuery("TRUNCATE TABLE athena_{$athenaSiteID}_GalleryMeta");
DatabaseManager::submitQuery("TRUNCATE TABLE athena_{$athenaSiteID}_GalleryTable");
DatabaseManager::submitQuery("TRUNCATE TABLE athena_{$athenaSiteID}_Pages");
DatabaseManager::submitQuery("DROP TABLE IF EXISTS athena_{$athenaSiteID}_Folders");
DatabaseManager::submitQuery("DROP TABLE IF EXISTS athena_{$athenaSiteID}_Media");
FolderTable::createTableForSite($athenaSiteID);

DatabaseManager::submitQuery("DELETE FROM stats_PageViews WHERE site_id = $athenaSiteID");

// Clear the media folder
//rmdir($base_folder . "2010/");


Logger::debug("Athena base media folder: $base_folder");

// Get connection to WP database
wpConnect();

// ////////////////////////////////////////////////////////////////////////////////////////
//
// Create the folders for this user
//
// ////////////////////////////////////////////////////////////////////////////////////////

$wp_folder_list = wpGetResults("SELECT * FROM apollo_Folders WHERE blog_id = $wpSiteID AND id > 9");

$folder_mapping = array();
$folder_mapping[0] = 0;

mysql_select_db('athenasites');

foreach($wp_folder_list as $folder){
    //$sql = DatabaseManager::prepare("INSERT INTO athena_%d_Folders (id, name) VALUES (%d, %s)", $athenaSiteID, , $folder['name']);
    //DatabaseManager::insert($sql);
    $athena_folder_id = FolderTable::addFolder($folder['name'], $athenaSiteID);
    $folder_mapping[$folder['id']] = $athena_folder_id;
}


// ////////////////////////////////////////////////////////////////////////////////////////
//
// Get the page data
//
// ////////////////////////////////////////////////////////////////////////////////////////

$wp_page_list = wpGetResults("SELECT * FROM wp_{$wpSiteID}_posts WHERE post_type = 'page'");

$page_mapping = array();
$page_mapping[0] = 0;

foreach($wp_page_list as $page){

    $id = $page['ID'];
    $wp_parent_id = $page['post_parent'];
    $created_date = $page['post_date_gmt'];
    $content = $page['post_content'];
    $title = $page['post_title'];
    $status = $page['post_status']; // publush, draft, private

    if ($status == 'publish')
        $status = 'Published';
    else if ($status == 'private')
        $status = 'Private';
    else if ($status == 'draft')
        $status = 'Draft';
    else
        $status = 'Draft';

    $wp_parent_id = 0;
    $path = '';
    $slug = StringUtils::encodeSlug($title);

    // Get the template name
    $template_name = wpGetVar("SELECT meta_value FROM wp_{$wpSiteID}_postmeta WHERE meta_key = '_wp_page_template' AND post_id = $id");
    Logger::debug("Template name: " . $template_name);

    mysql_select_db('athenasites');
    $athena_page_id = PagesTable::create($athenaUserID, $athenaSiteID, $wp_parent_id, $content, $status, $title, $template_name, $slug, $path, 1, 0);
    $page_mapping[$id] = $athena_page_id;

}

// ////////////////////////////////////////////////////////////////////////////////////////
//
// Import page stats
//
// ////////////////////////////////////////////////////////////////////////////////////////

$wp_stat_list = wpGetResults("SELECT * FROM apollo_PageViews WHERE blog_id = $wpSiteID");

mysql_select_db('athenasites');

foreach($wp_stat_list as $stats){

    $page_title = '';
    $page_path = '';

    if (isset($page_mapping[$stats['page_post_id']])){

        $page_id = $page_mapping[$stats['page_post_id']];
        $query_string = substr($stats['referer'], stripos($stats['referer'], "?"));
        $server_ip = $stats['server_ip'];
        if (!isset($server_ip)) $server_ip = ip2long('10.179.62.127');

        $sql = "INSERT INTO stats_PageViews (
            site_id,
            page_id,
            page,
            path,
            query_string,
            view_date,
            ip_long,
            is_bot,
            browser,
            browser_ver,
            os,
            referer,
            user_agent,
            server_ip) VALUES (
            $athenaSiteID,
            $page_id,
            '$page_title',
            '$page_path',
            '$query_string',
            '".$stats['view_date']."',
            ".$stats['ip_long'].",
            ".$stats['is_bot'].",
            '".$stats['browser']."',
            '".$stats['browser_ver']."',
            '".$stats['os_name']."',
            '".$stats['referer']."',
            '".$stats['user_agent']."',
            $server_ip)";

        DatabaseManager::insert($sql);

    }

}

// ////////////////////////////////////////////////////////////////////////////////////////
//
// Get the media
//
// ////////////////////////////////////////////////////////////////////////////////////////

$wp_media_list = wpGetResults("SELECT * FROM wp_{$wpSiteID}_posts WHERE post_type = 'attachment'");

foreach($wp_media_list as $media){

    $id = $media['ID'];
    
    if (substr($media['guid'], 0, 4) != 'http'){
	    $url = 'http://' . $media['guid'];
    }
    else {
	    $url = $media['guid'];
    }
    
    $description = $media['post_content'];
    $title = $media['post_title'];
    $created_date = $media['post_date_gmt'];

    // Get alt text
    $alt_text = wpGetVar("SELECT meta_value FROM wp_{$wpSiteID}_postmeta WHERE meta_key = '_wp_attachment_image_alt' AND post_id = $id");

    // Get meta data
    $meta = wpGetResults("SELECT * FROM wp_{$wpSiteID}_postmeta WHERE post_id = $id AND meta_key = '_wp_attachment_metadata'");
    $meta_data = unserialize($meta[0]['meta_value']);

    //Logger::dump($meta_data);

    $width = $meta_data['width'];
    $height = $meta_data['height'];
    $filename = basename($meta_data['file']);

    // Internally, use a file path of /<year>/<month>/
    $year = date("Y", strtotime($created_date));
    $month = date("m", strtotime($created_date));
    $filepath = $year . "/" . $month . "/";

    // Make sure that directory exists, if not create it
    if (!is_dir($base_folder . $year)) @mkdir($base_folder . $year, 0777);
    if (!is_dir($base_folder . $filepath)) @mkdir($base_folder . $filepath, 0777);

    // Copy image into athena media folder
    $new_filepath = $base_folder . $filepath . $filename;
    downloadImage($url, $new_filepath);
    $file_size = filesize($new_filepath);

    // Get its folder id
    $wp_folder_id = wpGetVar("SELECT folder_id FROM apollo_MediaToFolder WHERE media_post_id = $id AND blog_id = $wpSiteID");
    if (!isset($wp_folder_id)) $wp_folder_id = 0;

    // Get the folder id from the wpmu-to-athena folder id mapping
    $folder_id = $folder_mapping[$wp_folder_id];
    //Logger::debug("Folder ID: $folder_id --> $wp_folder_id (" . $folder_mapping[$wp_folder_id] . ")");
    
    // Get the image info    
    $image_info = getimagesize($new_filepath);
    
    if ($image_info) {

        $thumb_name = getThumbName($filename, $base_folder);
        $new_thumbfilepath = $base_folder . $filepath . $thumb_name;

        $width = $image_info[0];
        $height = $image_info[1];
        $mime_type = $image_info['mime'];

        // Create thumbnails!
        $src_image = ImageUtils::createImageFromFile($new_filepath, $mime_type);
        //$thumb_img = ImageUtils::resizeImage($src_image, $mime_type, 'letterbox', THUMB_WIDTH, THUMB_HEIGHT);
        $thumb_img = ImageUtils::resizeImage($src_image, $mime_type, 'crop', THUMB_WIDTH, THUMB_HEIGHT);

        $thumb_width = imagesx($thumb_img);
        $thumb_height = imagesy($thumb_img);

        imagepng($thumb_img, $new_thumbfilepath);
    }
    else {
        $mime = new MimeType();
        $mime_type = $mime->getType(strtolower($new_filepath));
        $width = null;
        $height = null;
        $thumb_name = null;
        $thumb_width = null;
        $thumb_height = null;
    }
        
    // Add into Athena
    $name = friendlyName($filename, $base_folder);
    
    mysql_select_db('athenasites');
    // addMedia($folder_id, $site_id, $filename, $mime_type, $file_size, $filepath, $title, $descriptions, $tags, $width, $height, $thumb_filename, $thumb_width, $thumb_height)
    $athena_image_id = FolderTable::addMedia($folder_id, $athenaSiteID, $name, $mime_type, $file_size, $filepath, $title, $description, $alt_text, $width, $height, $thumb_name, $thumb_width, $thumb_height);

    // If it has been assigned to a gallery, create the mapping.....
    $gal_data = wpGetResults("SELECT * FROM apollo_GalleryTable WHERE blog_id = $wpSiteID AND image_post_id = $id");
    
    if (isset($gal_data)){
        
        mysql_select_db('athenasites');
        
        //Logger::dump($gal_data);
        
        foreach($gal_data as $gal){
        	
            if (isset($page_mapping[$gal['page_post_id']])){
                GalleryTable::addImageToSlot($athena_image_id, $page_mapping[$gal['page_post_id']], $gal['slot_number'], $gal['theme_para_id'], 1, $athenaSiteID);
            }
        }
        
    }

}

Logger::debug("Done adding images...");


// //////////////////////////////////////////////////////////////////////////////////

/**
 * Connect to the WP database
 */
function wpConnect(){
    global $wpdb, $wpHost, $wpUsername, $wpPassword, $wpDatabase;
    $wpdb = mysql_connect($wpHost, $wpUsername, $wpPassword);
    mysql_select_db($wpDatabase, $wpdb);
}

// ////////////////////////////////////////////////////////////////////////////////

/**
 * Get results from the WPMU database
 * @return <type>
 */
function wpGetResults($query){

    global $wpdb, $wpDatabase;

    mysql_select_db($wpDatabase, $wpdb);

    // Get a list of the media from WP
    $results = mysql_query($query, $wpdb);
    
    $data = array();

    if (!$results){
        Logger::error("Did not get any results for query!");
    }
    else {

        // Build the output data
        while ($row = mysql_fetch_assoc($results)) {
            $data[] = $row;
        }

        mysql_free_result($results);
    }

    return $data;
}

// ////////////////////////////////////////////////////////////////////////////////

/**
 * Get a single val
 * @global <type> $wpdb
 * @param <type> $query
 * @return <type>
 */
function wpGetVar($query){

    global $wpdb, $wpDatabase;

    mysql_select_db($wpDatabase, $wpdb);

    $results = mysql_query($query, $wpdb);

    if (!$results || mysql_num_rows($results) == 0) {
        return null;
    }
    
    $row = mysql_fetch_array($results);
    
    if (isset($row[0])){
        $data = $row[0];
    }
    else {
        $data = null;
    }

    mysql_free_result($results);

    return $data;
}


// ////////////////////////////////////////////////////////////////////////////////

function friendlyName($filename, $dir) {

    // separate filename from extension
    $path_parts = pathinfo($filename);
    $ext = $path_parts['extension'];
    $name = $path_parts['filename'];

    //remove non-standard characters from URL
    $name = ereg_replace("[[:punct:]]+", "", $name);
    $name = ereg_replace("[^[:alnum:]]+", "_", $name);

    if (file_exists($dir . $name . '.' . $ext)) {
        $i = 1;
        $name .= '_';
        while (file_exists($dir . $name . $i . '.' . $ext)) {
            $i++;
        }
        $name .= $i;
    }

    return $name . '.' . $ext;
}

// ////////////////////////////////////////////////////////////////////////////////

function getThumbName($filename, $dir) {
    // separate filename from extension
    $path_parts = pathinfo($filename);
    $ext = $path_parts['extension'];
    $name = $path_parts['filename'];
    return $name . '_thumb.' . $ext;
}

// ////////////////////////////////////////////////////////////////////////////////

function downloadImage($url, $new_filepath){
    
    try {
        copy($url, $new_filepath);
    }
    catch (Exception $e) {
        // try again!
        Logger::error('Error downloading image from $url: ',  $e->getMessage());
        downloadImage($url, $new_filepath);
        return;
    }

    // Check the image
    $image_info = getimagesize($new_filepath);
    
    if (!isset($image_info)){
        Logger::error("Error downloading image from $url, trying again");
        downloadImage($url, $new_filepath);
    }

    $width = $image_info[0];
    $height = $image_info[1];

    if ($width == 0 || $height == 0){
        Logger::error("Error downloading image from $url, trying again");
        downloadImage($url, $new_filepath);
    }
}
?>
