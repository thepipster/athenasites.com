<style type="text/css">

test {
	
	color: #e6e6e6;
}

</style>
<?php

require_once("code/php/setup.php");

PageManager::init(1);
PageManager::$page_title = 'ApolloSites | Comment Update';

// Echo header
require_once('themes/ApolloSites/header.php');

$action = CommandHelper::getPara('act', false, CommandHelper::$PARA_TYPE_STRING);
$comment_id = CommandHelper::getPara('cid', false, CommandHelper::$PARA_TYPE_NUMERIC);
$site_id = CommandHelper::getPara('sid', false, CommandHelper::$PARA_TYPE_NUMERIC);
$key = CommandHelper::getPara('key', false, CommandHelper::$PARA_TYPE_STRING);

$sql = DatabaseManager::prepare("SELECT * FROM athena_{$site_id}_Comments WHERE activation_key = %s AND id = %d", $key, $comment_id);
$comment = DatabaseManager::getSingleResult($sql);

if (isset($comment)){

	$follower = SiteFollowersTable::getFollower($comment['site_follower_id']);
	$post = new Post();
	$post->get($site_id, $comment['post_id']);

	switch($action){
		case 'approve': 
			$action_text = "approved"; 
			CommentsTable::updateStatus($comment_id, $site_id, 'Approved');			
			break;
		case 'spam': 
			$action_text = "marked as spam"; 
			CommentsTable::updateStatus($comment_id, $site_id, 'Spam');			
			break;
		case 'delete': 
			$action_text = "deleted"; 
			CommentsTable::updateStatus($comment_id, $site_id, 'Trash');			
			break;
	}
	
	$post_title = "<a style='color:#004080' href='".$post->getLink()."'><i>&ldquo;".$post->getTitle()."&rdquo</i></a>";

	$follower_name = $follower['name'];
	$follower_url = "<a style='color:#b5bace' href='http://".urldecode($follower['url'])."'>".urldecode($follower['url'])."</a>";
	$follower_email = "<a style='color:#b5bace' href='mailto:".$follower['email']."'>".$follower['email']."</a>";
	
	$comment_date = date("m/d/Y H:i", strtotime($comment['created']));
	$comment_content = "&ldquo;" . $comment['content'] . "&rdquo;</span>";

?>

<table width="100%" border="0">
	<tr valign="top">
		<td width="50%">
			<h2>This comment has been <?=$action_text?></h2>
			<img src='/admin/images/email_activation.png'/>
		</td>
		<td align="left" style='background-color:#f7f7f7; padding:10px; border-color: #cccccc; border-width: 1px; border-style: solid;'>
			
			    <p>
			    	<?=$comment_content?>		    	
			    	<br/><br/>
			    	<span style='color:#5f79c5'>
					    On <?=$post_title?><br/>
					    At <?=$comment_date?> by <?=$follower_name?><br/>
					    <?=$follower_email?><br/>
					    <?=$follower_url?><br/>
			    	</span>
			    </p>
		    
		</td>
	</tr>
</table>




<?php        
}
else {

?>
	<h2 style='color:#d22'>Sorry, we could not find this comment</h2>
	<img src='/admin/images/email_activation_failure.png'/>
	<p>Sorry, we could not find an activation code that matched the one you gave us? This could be because the activation code is either incorrect, 
	or it has expired because this comment's status has already been changed by you. Please contact support at support@apollosites.com for help.
	</b></p>

<?php
}

// Echo footer
PageManager::$page_title = 'Admin';
require_once('themes/ApolloSites/footer.php');
?>