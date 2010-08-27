<?php
/**
* Process ajax requests sent from the Athena front end
*
* Author: Mike Pritchard
* Date: 5th August, 2010
*/

require_once("../setup.php");

$cmd = CommandHelper::getPara('cmd', true, CommandHelper::$PARA_TYPE_STRING);

// Grab global parameters that all commands must have
$site_id = CommandHelper::getPara('site_id', true, CommandHelper::$PARA_TYPE_STRING);

Logger::debug("Command = " . $cmd);

// Get the command type, and process
switch($cmd){


	// No security...
	
	case "getPosts":
		getPost($site_id);
		break;	
		
	case "getComments":
		$post_id = CommandHelper::getPara('post_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		getComments($post_id, $site_id);
		break;	
				
	
	case "addComment":
		//$post_id = CommandHelper::getPara('post_id', true, CommandHelper::$PARA_TYPE_NUMERIC);
		//addComment($post_id, $site_id);
		break;	
					
	default :
		CommandHelper::sendTextMessage("Undefined command '$cmd'");
		
}

// ///////////////////////////////////////////////////////////////////////////////////////
//
// No-security getters
//
// ///////////////////////////////////////////////////////////////////////////////////////

function getPosts($site_id){
			

	$msg['cmd'] = 'getPosts';
	$msg['result'] = 'ok';
	//$msg['data'] = array('gallery_images' => getGalleryImageList($site_id), 'gallery_meta' => GalleryTable::getAllMeta($site_id));

	CommandHelper::sendMessage($msg);	
}

// ///////////////////////////////////////////////////////////////////////////////////////

function getComments($post_id, $site_id){
			
	$msg['cmd'] = 'getComments';
	$msg['result'] = 'ok';
	//$msg['data'] = array('gallery_images' => getGalleryImageList($site_id), 'gallery_meta' => GalleryTable::getAllMeta($site_id));

	CommandHelper::sendMessage($msg);	
}

// ///////////////////////////////////////////////////////////////////////////////////////


?>