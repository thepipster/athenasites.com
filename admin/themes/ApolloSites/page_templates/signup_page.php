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

$months = array(
	1 => 'Jan',
	2 => 'Feb',
	3 => 'Mar',
	4 => 'Apr',
	5 => 'May',
	6 => 'Jun',
	7 => 'Jul',
	8 => 'Aug',
	9 => 'Sep',
	10 => 'Oct',
	11 => 'Nov',
	12 => 'Dec'
);

?>


<h2>Signup Page</h2>
			
<div class='leftCol' align="left">

	<?=$theme_id?>

    <h3>Select URL</h3>
    
</div>			

<div class='rightCol' align="left">

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
				<?php
				for ($m=1; $m<=12; $m++){
	            	echo "<option value='$m'>$m - " . $months[$m] . "</option>";
	            }
	            ?>
	        </select>
	
	        <select class='expYear'>
				<?php
				for ($y=2011; $y<=2030; $y++){
	            	echo "<option value='$y'>$y</option>";
	            }
	            ?>
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
		<script type="text/javascript">
			document.write(isoCountry.getHTML());
		</script>	
	</div>	
		
</div>	
		
<button class='basic_button' onclick='AccountDialog.changeCard()'>Update</button>

