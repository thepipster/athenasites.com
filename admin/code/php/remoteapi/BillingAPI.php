<?php

/**
 * Process ajax requests regarding billing issues (these should be sent via ssh!)
 *
 * Author: Mike Pritchard (mike@adastrasystems.com)
 * Date: 14th October, 2010
 */
require_once("../setup.php");

$cmd = CommandHelper::getPara('cmd', true, CommandHelper::$PARA_TYPE_STRING);
$site_id = CommandHelper::getPara('site_id', true, CommandHelper::$PARA_TYPE_STRING);

Logger::debug("Command = " . $cmd);

// Check that a user is logged in, and that they have access to this site
if (!SecurityUtils::isLoggedInForSite($site_id)) {
    error_log("You are not authorized for this site!");
    CommandHelper::sendAuthorizationFailMessage("You are not authorized for this site!");
    die();
}

$user_id = SecurityUtils::getCurrentUserID();

// Get the command type, and process
switch ($cmd) {

    // Acount Management...........

	case "getAccountInfo":
		getAccountInfo($site_id, $user_id);
		break;
		
    case "changeEmail":
        $newEmail = CommandHelper::getPara('email', true, CommandHelper::$PARA_TYPE_STRING);
		changeEmail($user_id, $newEmail);
		break;

    case "changeDomain":
        $newDomain = CommandHelper::getPara('domain', true, CommandHelper::$PARA_TYPE_STRING);
		changeDomain($site_id, $newDomain);
		break;

    case "changePassword":
        $new_password = CommandHelper::getPara('new_pswd', true, CommandHelper::$PARA_TYPE_STRING);
        $old_password = CommandHelper::getPara('old_pswd', true, CommandHelper::$PARA_TYPE_STRING);
		changePassword($user_id, $new_password, $old_password);
		break;
		
    // Credit Card Management (Payment Profiles)...........

    case "getAllCustomerProfiles":
            getAllCustomerProfiles();
            break;
		
    case "addCreditCard":
        $firstName = CommandHelper::getPara('fnm', true, CommandHelper::$PARA_TYPE_STRING);
        $lastName = CommandHelper::getPara('lnm', true, CommandHelper::$PARA_TYPE_STRING);
        $address = CommandHelper::getPara('add', true, CommandHelper::$PARA_TYPE_STRING);
        $city = CommandHelper::getPara('cty', true, CommandHelper::$PARA_TYPE_STRING);
        $state = CommandHelper::getPara('st', true, CommandHelper::$PARA_TYPE_STRING);
        $zip = CommandHelper::getPara('zp', true, CommandHelper::$PARA_TYPE_STRING);
        $cardNo = CommandHelper::getPara('cno', true, CommandHelper::$PARA_TYPE_NUMERIC);
        $ccvCode = CommandHelper::getPara('ccv', true, CommandHelper::$PARA_TYPE_NUMERIC);
        $expirationDate = CommandHelper::getPara('exp', true, CommandHelper::$PARA_TYPE_STRING);
        $isPrimary = CommandHelper::getPara('pri', true, CommandHelper::$PARA_TYPE_NUMERIC);
        addCreditCard($user_id, $firstName, $lastName, $address, $city, $state, $zip, $cardNo, $ccvCode, $expirationDate, $isPrimary);
        break;

    case "updateCreditCard":
        $card_id = CommandHelper::getPara('cid', true, CommandHelper::$PARA_TYPE_NUMERIC);
        $new_expiration_date = CommandHelper::getPara('exp', true, CommandHelper::$PARA_TYPE_STRING);
        $isPrimary = CommandHelper::getPara('pri', true, CommandHelper::$PARA_TYPE_NUMERIC);
        updateCreditCard($user_id, $card_id, $new_expiration_date, $isPrimary);
        break;

    case "deleteCreditCard":
        $card_id = CommandHelper::getPara('cid', true, CommandHelper::$PARA_TYPE_NUMERIC);
        deleteCreditCard($user_id, $card_id);
        break;

    case "makeCardPrimary":
        $card_id = CommandHelper::getPara('cid', true, CommandHelper::$PARA_TYPE_NUMERIC);
        makeCardPrimary($user_id, $card_id);
        break;
        
    case "getCreditCards":
        getCreditCards($user_id);
        break;
	
	case "getCountryCodes":
		getCountryCodes();
		
    default :
        Logger::fatal("Undefined command!");
    //CommandHelper::sendErrorMessage("Undefined command '$cmd'");
}

// ///////////////////////////////////////////////////////////////////////////////////////
//
// Support
//
// ///////////////////////////////////////////////////////////////////////////////////////

/**
 * Get the Authorize.Net profile_id for this user, or kill script if we can't find one
 * @param int $user_id
 */
function getUsersProfileID_OrDie($user_id){

    $msg['result'] = 'fail';
    
    $profile_id = AdsAuthorizeNetTables::getUserProfileID($user_id);

	if (!isset($profile_id)){
	    $user_email = UserTable::getEmail($user_id);
	    $profile_id = AuthorizeNet::createProfile($user_id, $user_email);
	    AdsAuthorizeNetTables::createProfile($user_id, $profile_id);
	}

    // If this user has no profile id, then return..
    if (!isset($profile_id) || $profile_id == 0){
        $msg['message'] = "This user ($user_id) has no profile id yet!";
        Logger::error("This user ($user_id) has no Authorize.Net profile id yet!");
        CommandHelper::sendMessage($msg);
        die();
    }

    return $profile_id;
}


function getPaymentProfileID_OrDie($card_id){

    $msg['result'] = 'fail';
    
    $payment_profile_id = AdsAuthorizeNetTables::getPaymentProfileID($card_id);

    // If this payment profile id does not exist, return....
    if (!isset($payment_profile_id) || $payment_profile_id == 0){
        $msg['message'] = "No payment profile id found for card id = $card_id";
        Logger::error("No payment profile id found for card id = $card_id");
        CommandHelper::sendMessage($msg);
        return;
    }

    return $payment_profile_id;

}

// ///////////////////////////////////////////////////////////////////////////////////////
//
// Acount Management
//
// ///////////////////////////////////////////////////////////////////////////////////////

function changeEmail($user_id, $newEmail){

    $msg['cmd'] = 'changeEmail';
    $msg['result'] = 'ok';
	
	$user_info = UserTable::get($user_id);
	
	// Send an email with a verify this email link
	
	$activation_key = sha1( ceil(time()) . 'update_email' . $user_info['name']);	
	//$activation_key = SecurityUtils::generateNonceHash('email_verify');
	
    $date_str = date('Y-m-d H:i:s', time());
	
	$sql = DatabaseManager::prepare("INSERT INTO apollo_EmailActivationTable (user_id, email, activation_key, created_date) VALUES (%d, %s, %s, %s)", $user_id, $newEmail, $activation_key, $date_str);
	DatabaseManager::insert($sql);
	
	EmailMessaging::sendEmailActivateLink($newEmail, $user_info['name'], $activation_key);
	
    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

function changeDomain($site_id, $newDomain){

    $msg['cmd'] = 'changeDomain';
    $msg['result'] = 'ok';

	SitesTable::updateDomain($site_id, $newDomain);

    $msg['data'] = array('domain' => $newDomain);
		
    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

function changePassword($user_id, $new_password, $old_password){

    $msg['cmd'] = 'changePassword';
	
	$user_info = UserTable::get($user_id);
	$email = $user_info['email'];
		
	// Check to see if the old password is correct
	$db_pass = UserTable::getPasswordFromEmail($email);			
	$password_hash = SecurityUtils::generatePassHash($old_password, $db_pass);
			
	$user_id = UserTable::checkValid($email, $password_hash);
		
	if ($user_id){
		// Old password is valid, so update to new password
	    $msg['result'] = 'ok';
		$new_password_hash = SecurityUtils::generatePassHash($new_password, $db_pass);
		UserTable::updatePassword($user_id, $new_password_hash);
	}
	else {
	    $msg['result'] = 'fail';
	}
	
    CommandHelper::sendMessage($msg);

}

// ///////////////////////////////////////////////////////////////////////////////////////

function getAccountInfo($site_id, $user_id){

	$user_info = UserTable::get($user_id);
    
    if ($user_info['payment_plan'] == 'Monthly'){
		$due_date = strtotime($user_info['last_payment'] . ' +1 month');
    }
    else {
		$due_date = strtotime($user_info['last_payment'] . ' +1 year');
    }
    	
	$user_info['last_payment'] = date("m/d/Y H:i", strtotime($user_info['last_payment'])); // Convert to JS compatible date
//	$user_info['next_payment_due'] = date("m/d/Y H:i", strtotime($user_info['next_payment_due'])); // Convert to JS compatible date
	$user_info['next_payment_due'] = date("m/d/Y H:i", $due_date); // Convert to JS compatible date
	$user_info['account_created'] = date("m/d/Y H:i", strtotime($user_info['account_created'])); // Convert to JS compatible date
	$user_info['domain'] = SitesTable::getDomain($site_id);
	
	Logger::debug(">>>>>>> " . $user_info['next_payment_due']);
	
    $msg['cmd'] = 'getAccountInfo';
    $msg['result'] = 'ok';
    $msg['data'] = array('user_info' => $user_info);
	
    CommandHelper::sendMessage($msg);
	
}

// ///////////////////////////////////////////////////////////////////////////////////////
//
// Credit Card Management (Payment Profiles)
//
// ///////////////////////////////////////////////////////////////////////////////////////

function getAllCustomerProfiles(){

    $msg['cmd'] = 'getAllCustomerProfiles';
    $msg['result'] = 'fail';


	if (SecurityUtils::isSuperUser()){
	
		//getProfileInfo($profileID)
		
	    $data = AuthorizeNet::getAllCustomerProfiles();
	    
	    $msg['result'] = 'ok';
	    $msg['message'] = 'success';
	    $msg['data'] = array('profiles' => $data);
	}
	else {
	    $msg['message'] = 'not authorized';
	}

    CommandHelper::sendMessage($msg);
    
}

// ///////////////////////////////////////////////////////////////////////////////////////

/**
 * Add a new credit card for this user. If succesful, this will return the card_id for the new credit card.
 *
 * @param user_id The lazy angel user id for this card
 * @param firstName The first name on the credit card
 * @param lastName The last name on the credit card
 * @param address The address associated with the credit card
 * @param city The city associated with the credit card
 * @param state The state associated with the credit card
 * @param zip The zip associated with the credit card
 * @param cardNo The credit card number
 * @param ccvCode The three- or four- digit number on the back of a credit card (on the front for American Express
 * @param expirationDate The card's expiration date, in the form YYYY-MM
 * @param country The country of the credit card
 * @param isPrimary Set to 1 if this is the primary card for this user, otherwise use 0 to indicate a secondary card
 * @param callback Reference to function call when this asynchronous command completes
 */
function addCreditCard($user_id, $firstName, $lastName, $address, $city, $state, $zip, $cardNo, $ccvCode, $expirationDate, $isPrimary=1) {

    $msg['cmd'] = 'addCreditCard';
    $msg['result'] = 'fail';
	
    $shippingAddressId = 0;
	$country = "USA";
	
    // Get this users Authorize.Net profile id
    $customerProfileId = getUsersProfileID_OrDie($user_id);
    	
    $payment_profile_id = AuthorizeNet::createPaymentProfile($customerProfileId, $shippingAddressId, $firstName, $lastName, $address, $city, $state, $zip, $cardNo, $ccvCode, $expirationDate, $country);
            
    if (isset($payment_profile_id) && $payment_profile_id > 0){
        $card_id = AdsAuthorizeNetTables::addPaymentProfile($customerProfileId, $payment_profile_id, 1, $expirationDate);
        $msg['result'] = 'ok';
        $msg['message'] = 'success';
        $msg['data'] = array('card_id' => $card_id);
    }
    else {
        $msg['error_code'] = AuthorizeNet::$error_code;
        $msg['message'] = AuthorizeNet::$error_message;
    }

    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

/**
 * Update an existing credit card for this user
 *
 * @param int $user_id The lazy angel user id for this card
 * @param int $card_id The card id (the internal id used by us for each payment profile, i.e. the id of the lzads_authorizenet_payment_profile_ids table)
 * @param string $expirationDate The card's expiration date, in the form YYYY-MM
 * @param int $isPrimary Set to 1 if this is the primary card for this user, otherwise use 0 to indicate a secondary card
 */
function updateCreditCard($user_id, $card_id, $new_expiration_date, $isPrimary=1) {

    $msg['cmd'] = 'updateCreditCard';
    $msg['result'] = 'fail';

    // Get this users Authorize.Net profile id
    $profile_id = AdsAuthorizeNetTables::getUserProfileID($user_id);

    // Get this users Authorize.Net profile id
    $profile_id = getUsersProfileID_OrDie($user_id);

    // Get the payment profile id
    $payment_profile_id = getPaymentProfileID_OrDie($card_id);

    if (AuthorizeNet::updatePaymentProfileExpirationDate($profile_id, $payment_profile_id, $new_expiration_date)){
        $msg['result'] = 'ok';
        $msg['message'] = 'Card updated';
    }
    else {
        $msg['error_code'] = AuthorizeNet::$error_code;
        $msg['message'] = AuthorizeNet::$error_message;
    }

    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

/**
 * Deleta a user's credit card
 * @param int $user_id The lazy angel user id for this card
 * @param int $card_id The card id (the internal id used by us for each payment profile, i.e. the id of the lzads_authorizenet_payment_profile_ids table)
 */
function deleteCreditCard($user_id, $card_id){

    $msg['cmd'] = 'deleteCreditCard';
    $msg['result'] = 'fail';

    // Get this users Authorize.Net profile id
    $profile_id = AdsAuthorizeNetTables::getUserProfileID($user_id);

    // Get this users Authorize.Net profile id
    $profile_id = getUsersProfileID_OrDie($user_id);

    // Get the payment profile id
    $payment_profile_id = getPaymentProfileID_OrDie($card_id);
    
    Logger::debug("[$card_id] User id = $user_id Profile id = $profile_id Payment profile = $payment_profile_id");

    if (AuthorizeNet::deletePaymentProfile($profile_id, $payment_profile_id)){
    	// Delete from LazyAngel tables
    	AdsAuthorizeNetTables::deletePaymentProfile($card_id);
        $msg['result'] = 'ok';
        $msg['message'] = 'Card deleted';
    }
    else {
        $msg['error_code'] = AuthorizeNet::$error_code;
        $msg['message'] = AuthorizeNet::$error_message;
    }

    CommandHelper::sendMessage($msg);
}

// ///////////////////////////////////////////////////////////////////////////////////////

/**
 * Make a credit card primary, and flip and other cards to secondary
 * @param int $user_id The lazy angel user id for this card
 * @param int $card_id The card id (the internal id used by us for each payment profile, i.e. the id of the lzads_authorizenet_payment_profile_ids table)
 */
function makeCardPrimary($user_id, $card_id){

    $msg['cmd'] = 'makeCardPrimary';
    $msg['result'] = 'ok';

    // Get this users Authorize.Net profile id
    $profile_id = AdsAuthorizeNetTables::getUserProfileID($user_id);

	AdsAuthorizeNetTables::setPrimaryCard($card_id, $profile_id);

    CommandHelper::sendMessage($msg);
    
}

// ///////////////////////////////////////////////////////////////////////////////////////

function getCreditCards($user_id){

    $msg['cmd'] = 'getCreditCards';
    $msg['result'] = 'fail';

    // Get this users Authorize.Net profile id
    $profile_id = getUsersProfileID_OrDie($user_id);

    // Get a data on this user's profile, this includes any payment profiles set
    $info = AuthorizeNet::getProfileInfo($profile_id);
    $cardData = array();

    if (!isset($info) || $info == null){
        $msg['error_code'] = AuthorizeNet::$error_code;
        $msg['message'] = AuthorizeNet::$error_message;
    }
    else {

        // Parse out we are ok sending to the client
        foreach($info['payment_profiles'] as $payment_profile){
            
            $lazy_profile_info = AdsAuthorizeNetTables::getPaymentProfile($payment_profile['payment_profile_id']);            
            $profile_info = AdsAuthorizeNetTables::getPaymentProfile($payment_profile['payment_profile_id']);
			
            $card = array();
            $card['id'] = $lazy_profile_info['id'];
            $card['firstname'] = $payment_profile['firstname'];
            $card['lastname'] = $payment_profile['lastname'];
            $card['company'] = $payment_profile['company'];
            $card['address'] = $payment_profile['address'];
            $card['city'] = $payment_profile['city'];
            $card['state'] = $payment_profile['state'];
            $card['zip'] = $payment_profile['zip'];
            $card['country'] = $payment_profile['country'];
            $card['phone'] = $payment_profile['phone'];
            $card['card_number'] = $payment_profile['card_number'];
            $card['card_type'] = $profile_info['card_type'];
            $card['is_primary'] = $profile_info['is_primary'];
            $card['expiration'] = date("m/Y", strtotime($lazy_profile_info['expiration']));

            $cardData[] = $card;
        }

        $msg['data'] = array("credit_cards" => $cardData);
        $msg['result'] = 'ok';
    }

    CommandHelper::sendMessage($msg);

}

?>