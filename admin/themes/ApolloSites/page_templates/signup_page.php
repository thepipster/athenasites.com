<?php
/**
* @Theme: ApolloSites
* @Template: Signup Page
* @Description: Signup Page
*/

$theme_id = CommandHelper::getPara('theme', false, CommandHelper::$PARA_TYPE_NUMERIC);

/*
require_once('/Users/mikep/Sites/apollosites.com/wp-admin/admin.php');

$blog_domain  = 'zip.local.com';
$blog_path    = '/test4';
$user_name    = $blog_name;
$user_email   = 'mikep76@gmail.com';
$blog_title   = 'New Blog';


$password = 'N/A';
$user_id = email_exists($user_email);

if( !$user_id ) { // Create a new user with a random password
	$password = generate_random_password();
	$user_id = wpmu_create_user($blog_domain, $password, $user_email);
	if(false == $user_id) {
		wp_die( __('There was an error creating the user') );
	} else {
		wp_new_user_notification($user_id, $password);
	}
}

error_log("Current site id: ".  $current_site->id);
$blog_id = wpmu_create_blog($blog_domain, $blog_path, $blog_title, $user_id , array( "public" => 1 ));

//$blog_id = 14;
$template_name = 'AdAstra';
$stylesheet_name = $template_name;
error_log("Blog id: $blog_id");

$wpdb->query($wpdb->prepare("UPDATE wp_".$blog_id."_options SET option_value = %s WHERE option_name = 'template'",  $template_name));	
$wpdb->query($wpdb->prepare("UPDATE wp_".$blog_id."_options SET option_value = %s WHERE option_name = 'stylesheet'",  $template_name));	
*/
		
?>

<div id="content" class="widecolumn">
				
	<h2>Signup Page</h2>

	<?=$theme_id?>

    <h3>Select URL</h3>

    <h3>Credit Card</h3>
		
    <div class='dataWrapper'>
    <span class='dataLabel'>Name on Card</span><input class='dataValue' type='text' />
    <span class='cardTypeIcon'></span>
    </div>

    <div class='dataWrapper'>
    <span class='dataLabel'>Card Number</span><input id='cardNumber' class='dataValue' type='text' />
    </div>
		
    <div class='dataWrapper'>
    <span class='dataLabel'>Expiration</span>
		
    <span class='dataValue'>
        <select class='expMonth'>
		for (var m=1; m<=12; m++){
            <option value='"+m+"'>"+m+" - " + AccountDialog.monthToName(m) + "</option>
		}
        </select>

        <select class='expYear'>
		for (var y=2011; y<=2020; y++){
            <option value='"+y+"'>"+y+"</option>
		}
        </select>
    </span>		
    </div>
		
    <div class='dataWrapper'>
    <span class='dataLabel'>Security Code</span><input class='dataValue' type='text' />
    </div>
		
    <br/>
		
    <div class='dataWrapper'>
    <span class='dataLabel'>Address</span><input class='dataValue' type='text' />
    </div>

    <div class='dataWrapper'>
    <span class='dataLabel'>Address</span><input class='dataValue' type='text' />
    </div>

    <div class='dataWrapper'>
    <span class='dataLabel'>City</span><input class='dataValue' type='text' />
    </div>

    <div class='dataWrapper'>
    <span class='dataLabel'>State/Province</span><input class='dataValue' type='text' />
    </div>
		
    <div class='dataWrapper'>
    <span class='dataLabel'>Zip/Postcode</span><input class='dataValue' type='text' />
    </div>

    <div class='dataWrapper'>
    <span class='dataLabel'>Country</span>
		
		txt += isoCountry.getHTML();
		
    <button class='basic_button' onclick='AccountDialog.changeCard()'>Update</button>"

</div>