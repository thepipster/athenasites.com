<?php

/**
 * Class to handle interactions with Authorize.Net using their CIM API 
 * @see http://developer.authorize.net/api/cim/
 *
 * @author Mike Pritchard (mike@adastrasystems.com)
 * @since 12th October, 2010
 */
class AuthorizeNet {

    private static $login_id = "64BsyK9EAE";
    private static $transaction_key = "52s29kzB4K58AG27";

    private static $api_host = "api.authorize.net"; // Production
    private static $api_path = "/xml/v1/request.api";
    
    private static $test_login_id = "64BsyK9EAE";
    private static $test_transaction_key = "52s29kzB4K58AG27";
    private static $test_api_host = "apitest.authorize.net"; // Test

    public static $error_code = "";
    public static $error_message = "";
    
    /*
      Login URL: https://test.authorize.net/
      Login ID: cnptest8152010 (do not use as the value for x_login)
      Password: Authnet001

      Use the following information to integrate an application or website to Authorize.Net:
      Transaction POST URL: https://test.authorize.net/gateway/transact.dll
      API Login ID: 75sqQ96qHEP8
      Transaction Key: 7r83Sb4HUd58Tz5p
     */
    private static $TEST_MODE = false;

    // /////////////////////////////////////////////////////////////////////////

    /**
     * Associate a credit card with a customer profile ID.<br>
     * Once we have a customer profile id using AuthorizeNet::createProfile we can then associated a credit card with this
     * customer using this method.
     *
     * @param int $customerProfileId The Authorize.Net customer profile id associated with this customer (see AuthorizeNet::createProfile)
     * @param int $shippingAddressId The Authorize.Net shipping profile id for this customer (if we have one, if not just set to 0)
     * @param string $firstName The first name on the credit card
     * @param string $lastName The last name on the credit card
     * @param string $address The address associated with the credit card
     * @param string $city The city associated with the credit card
     * @param string $state The state associated with the credit card
     * @param string $zip The zip associated with the credit card
     * @param string $cardNo The credit card number
     * @param string $expirationDate The card's expiration date, in the form YYYY-MM
     * @param string $ccvCode The three- or four- digit number on the back of a credit card (on the front for American Express
     * @return If successful, returns a customerPaymentProfileID which we store to use with AuthorizeNet::createTransaction to actually charge the card.
     * returns false if not successful.
     */
    public static function createPaymentProfile($customerProfileId, $shippingAddressId, $firstName, $lastName, $address, $city, $state, $zip, $cardNo, $ccvCode, $expirationDate, $country) {
    
    	//Logger::debug("createPaymentProfile(profile_id=$customerProfileId, shipping_id=$shippingAddressId, firstname=$firstName, lastname=$lastName, 
    	//				address=$address, city=$city, state=$state, zip=$zip, cardno=$cardNo, ccv=$ccvCode, exp=$expirationDate, country=$country");
		
        // build xml to post
        $content = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
        $content .= "<createCustomerPaymentProfileRequest xmlns=\"AnetApi/xml/v1/schema/AnetApiSchema.xsd\">";
        $content .= self::getMerchantAuthenticationBlock();
        $content .= "    <customerProfileId>$customerProfileId</customerProfileId>";
        $content .= "    <paymentProfile>";
        $content .= "        <billTo>";
        $content .= "            <firstName>$firstName</firstName>";
        $content .= "            <lastName>$lastName</lastName>";
        $content .= "            <address>$address</address>";
        $content .= "            <city>$city</city>";
        $content .= "            <state>$state</state>";
        $content .= "            <zip>$zip</zip>";
        $content .= "            <country>$country</country>";
        $content .= "        </billTo>";
        $content .= "        <payment>";
        $content .= "            <creditCard>";
        $content .= "                <cardNumber>$cardNo</cardNumber>";
        $content .= "                <expirationDate>$expirationDate</expirationDate>"; // required format for API is YYYY-MM
        $content .= "                <cardCode>$ccvCode</cardCode>"; // ccv code
        $content .= "            </creditCard>";
        $content .= "        </payment>";
        $content .= "    </paymentProfile>";

        if (self::$TEST_MODE) {
            $content .= "    <validationMode>testMode</validationMode>";
        } else {
            $content .= "    <validationMode>liveMode</validationMode>";
        }

        $content .= "</createCustomerPaymentProfileRequest>";

        $response = self::sendXMLRequest($content);

        Logger::debug("Raw response: $response");
        $parsedresponse = self::parseAPIResponse($response);

        if ($parsedresponse->messages->resultCode == 'Ok') {
            Logger::debug("Profile successfully created!");
            return $parsedresponse->customerPaymentProfileId;
        }

        return false;
    }

    // /////////////////////////////////////////////////////////////////////////

    /**
     * This method creates a customer profile on Authorize.Net servers, and returns their customer profile ID.
     * We can then associate a payment profile with this user, and perform transactions, i.e. this is the first
     * step in creating a customer profile on Authorize.Net.
     *
     * @param int $lazyUserID The lazy angel user's id for this customer
     * @param string $userEmail The lazy angel user's email for this customer
     * @param string $description (optional) We can add a description for this profile, this is optional
     */
    public static function createProfile($lazyUserID, $userEmail, $description="") {

        $content = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
        $content .= "<createCustomerProfileRequest xmlns=\"AnetApi/xml/v1/schema/AnetApiSchema.xsd\">";
        $content .= self::getMerchantAuthenticationBlock();
        $content .= "<profile>";
        $content .= "    <merchantCustomerId>$lazyUserID</merchantCustomerId>";
        $content .= "    <description>$description</description>";
        $content .= "    <email>$userEmail</email>";
        $content .= "</profile>";
        $content .= "</createCustomerProfileRequest>";

        $response = self::sendXMLRequest($content);

        Logger::debug("Raw response: $response");
        $parsedresponse = self::parseAPIResponse($response);

        if ($parsedresponse->messages->resultCode == 'Ok') {
            Logger::debug("Profile successfully created!");
            return $parsedresponse->customerProfileId;
        }
    }

    // /////////////////////////////////////////////////////////////////////////

    /**
     * Delete a customer profile from Authorize.Net's servers.
     *
     * @param int $profileId The Authorize.Net customer profile ID of the customer to delete
     * @return boolean returns true if succesfully deleted
     */
    public static function deleteProfile($profileId, $paymentProfileId) {

        $content = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
        $content .= "<deleteCustomerProfileRequest xmlns=\"AnetApi/xml/v1/schema/AnetApiSchema.xsd\">";
        $content .= self::getMerchantAuthenticationBlock();
        $content .= "    <customerProfileId>$profileId</customerProfileId>";
        $content .= "</deleteCustomerProfileRequest>";

        $response = self::sendXMLRequest($content);

        Logger::debug("Raw response: $response");
        $parsedresponse = self::parseAPIResponse($response);

        if ($parsedresponse->messages->resultCode == 'Ok') {
            Logger::debug("Profile successfully delete!");
            return true;
        }

        return false;
    }

    // /////////////////////////////////////////////////////////////////////////

    /**
     * Delete a payment profile.
     * @param <type> $customerProfileId
     * @param <type> $paymentProfileId
     */
    public static function deletePaymentProfile($customerProfileId, $paymentProfileId) {

        $content = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
        $content .= "<deleteCustomerPaymentProfileRequest xmlns=\"AnetApi/xml/v1/schema/AnetApiSchema.xsd\">";
        $content .= self::getMerchantAuthenticationBlock();
        $content .= "    <customerProfileId>$customerProfileId</customerProfileId>";
        $content .= "    <customerPaymentProfileId>$paymentProfileId</customerPaymentProfileId>";
        $content .= "</deleteCustomerPaymentProfileRequest>";

/*
<?xml version="1.0" encoding="utf-8"?>
<deleteCustomerPaymentProfileRequest
xmlns="AnetApi/xml/v1/schema/AnetApiSchema.xsd">
<merchantAuthentication>
<name>YourUserLogin</name>
<transactionKey>YourTranKey</transactionKey>
</merchantAuthentication>
<customerProfileId>10000</customerProfileId>
<customerPaymentProfileId>20000</customerPaymentProfileId>
</deleteCustomerPaymentProfileRequest>
*/
        $response = self::sendXMLRequest($content);

        Logger::debug("Raw response: $response");
        $parsedresponse = self::parseAPIResponse($response);

        if ($parsedresponse->messages->resultCode == 'Ok') {
            Logger::debug("Profile successfully deleted!");
            return true;
        }

        return false;
    }

    // /////////////////////////////////////////////////////////////////////////

    /**
     * Associated a shipping address with the given customer profile.
     *
     * @param string $firstName The first name for this address
     * @param string $lastName The last name for this address
     * @param string $phoneNo The phone number associated with this address
     * @return If successful, returns a customerAddressId which we store to use with AuthorizeNet::createPaymentProfile. Returns false if not successful.
     */
    public static function addShippingAddress($customerProfileId, $firstName, $lastName, $phoneNo) {

        $content = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
        $content .= "<createCustomerShippingAddressRequest xmlns=\"AnetApi/xml/v1/schema/AnetApiSchema.xsd\">";
        $content .= self::getMerchantAuthenticationBlock();
        $content .= "    <customerProfileId>$customerProfileId</customerProfileId>";
        $content .= "    <address>";
        $content .= "        <firstName>$firstName</firstName>";
        $content .= "        <lastName>$lastName</lastName>";
        $content .= "        <phoneNumber>$phoneNo</phoneNumber>";
        $content .= "    </address>";
        $content .= "</createCustomerShippingAddressRequest>";

        $response = self::sendXMLRequest($content);

        Logger::debug("Raw response: $response");
        $parsedresponse = self::parseAPIResponse($response);

        if ($parsedresponse->messages->resultCode == 'Ok') {
            Logger::debug("Profile successfully created!");
            return $parsedresponse->customerAddressId;
        }

        return false;
    }

    // /////////////////////////////////////////////////////////////////////////

    /**
     * Associated a shipping address with the given customer profile.
     *
     * @param int $profileId The Authorize.Net customer's profile id for this customer
     * @param int $paymentProfileId The Authorize.Net customer's payment profile id for this customer
     * @param int $addressId The Authorize.Net customer's shipping address id for this customer, or set to 0 if we don't have any
     * @param float $totalAmount The total amount to bill, should include tax, shipping, and everything.
     * @param array $items An assiative array of items in this transaction, in the form;
     *     {{itemID: 123456, name: 'name if item', description: 'item description', quantity: 1, unitPrice: 5.6, taxable: 'true'/'false'}, {}...}
     * @param string $orderID (optional)  Our order ID to associate with this order
     * @param string $orderDescription (optional) A description to include for this order
     * @param array $taxInfo (optional) An associative array of of tax info of the form [amount: 5.6, name: 'Internet Tax', description: 'Some evil internet tax']
     * @param array $shippingInfo (optional) An associative array of of shipping info of the form [amount: 5.6, name: 'UPS', description: 'Free UPS Ground shipping. Ships in 5-10 days.']
     * @return If successful, returns a customerAddressId which we store to use with AuthorizeNet::createPaymentProfile. Returns false if not successful.
     */
    public static function createTransaction($profileId, $paymentProfileId, $addressId, $totalAmount, $items, $orderID = "", $orderDescription = "", $taxInfo = null, $shippingInfo = null) {

		// The 'profileTransAuthOnly' start tag on line 1 does not match the end tag of 'transaction'. Line 1, position 587.

        $content = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
        $content .= "<createCustomerProfileTransactionRequest xmlns=\"AnetApi/xml/v1/schema/AnetApiSchema.xsd\">";
        $content .= self::getMerchantAuthenticationBlock();
        $content .= "<transaction>";
        
        $content .= "    <profileTransAuthOnly>";
        $content .= "        <amount>$totalAmount</amount>"; // should include tax, shipping, and everything.

        if (isset($taxInfo)) {
            $content .= "        <tax>";
            $content .= "            <amount>" . $taxInfo['amount'] . "</amount>";
            $content .= "            <name>" . $taxInfo['name'] . "</name>";
            $content .= "            <description>" . $taxInfo['description'] . "</description>";
            $content .= "        </tax>";
        }

        if (isset($shippingInfo)) {
            $content .= "        <shipping>";
            $content .= "            <amount>" . $shippingInfo['amount'] . "</amount>";
            $content .= "            <name>" . $shippingInfo['name'] . "</name>";
            $content .= "            <description>" . $shippingInfo['description'] . "</description>";
            $content .= "        </shipping>";
        }

        foreach ($items as $item) {
            $content .= "        <lineItems>";
            $content .= "            <itemId>" . $item['itemId'] . "</itemId>";
            $content .= "            <name>" . $item['name'] . "</name>";
            $content .= "            <description>" . $item['description'] . "</description>";
            $content .= "            <quantity>" . $item['quantity'] . "</quantity>";
            $content .= "            <unitPrice>" . $item['unitPrice'] . "</unitPrice>";
            $content .= "            <taxable>" . $item['taxable'] . "</taxable>";
            $content .= "         </lineItems>";
        }

        $content .= "        <customerProfileId>$profileId</customerProfileId>";
        $content .= "        <customerPaymentProfileId>$paymentProfileId</customerPaymentProfileId>";
        if ($addressId != 0) {
            $content .= "        <customerShippingAddressId>$addressId</customerShippingAddressId>";
        }

        $content .= "        <order>";
        $content .= "            <invoiceNumber>$orderID</invoiceNumber>";
        $content .= "            <description>$orderDescription</description>";
        $content .= "        </order>";
        $content .= "    </profileTransAuthOnly>";
        $content .= "</transaction>";
        
        $content .= "</createCustomerProfileTransactionRequest>";

        $response = self::sendXMLRequest($content);

        Logger::debug("Raw response: $response");
        
        $parsedresponse = self::parseAPIResponse($response);

        $data = array();
        $data['result'] = 'fail';

        if ($parsedresponse->messages->resultCode == 'Ok') {
            Logger::debug("Transaction successfully created for customer $profileId!");

            if (isset($parsedresponse->directResponse)) {

                $directResponseFields = explode(",", $parsedresponse->directResponse);
                $responseCode = $directResponseFields[0]; // 1 = Approved 2 = Declined 3 = Error
                $responseReasonCode = $directResponseFields[2]; // See http://www.authorize.net/support/AIM_guide.pdf
                $responseReasonText = $directResponseFields[3];
                $approvalCode = $directResponseFields[4]; // Authorization code
                $transId = $directResponseFields[6];

                $data['responseCode'] = $responseCode;
                $data['responseText'] = $responseReasonText;
                $data['approvalCode'] = $approvalCode;
                $data['transId'] = $transId;

                if ($responseCode == "1") {
                    Logger::debug("The transaction was successful");
                    $data['result'] = 'ok';
                } else if ($responseCode == "2") {
                    Logger::error("The transaction was declined. Response: [$responseReasonCode] $responseReasonText");
                    $data['result'] = 'declined';
                } else {
                    Logger::error("The transaction resulted in an error. Response: [$responseReasonCode] $responseReasonText");
                    $data['result'] = 'error';
                }
            }

            Logger::dump($data);

            return $data;
        }
    }

    // /////////////////////////////////////////////////////////////////////////

    /**
     * Get a list of all the customer profiles we have on the Authorize.Net system
     */
    public static function getAllCustomerProfiles() {

        $content = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
        $content .= "<getCustomerProfileIdsRequest xmlns=\"AnetApi/xml/v1/schema/AnetApiSchema.xsd\">";
        $content .= self::getMerchantAuthenticationBlock();
        $content .= "</getCustomerProfileIdsRequest>";

        $response = self::sendXMLRequest($content);
		
        $parsedresponse = self::parseAPIResponse($response);

        $idList = array();
        
        if ($parsedresponse->messages->resultCode == 'Ok') {
            foreach ($parsedresponse->ids as $id) {
                $idList[] = intval($id->numericString);
            }
        }

        return $idList;
    }

    // /////////////////////////////////////////////////////////////////////////

    /**
     * Get info for a given profile id, this returns all of their payment profiles as well
     * @param int $profileID Customer's Authorize.Net profile id
     * @return <type>
     */
    public static function getProfileInfo($profileID) {

        $content = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
        $content .= "<getCustomerProfileRequest xmlns=\"AnetApi/xml/v1/schema/AnetApiSchema.xsd\">";
        $content .= self::getMerchantAuthenticationBlock();
        $content .= "<customerProfileId>$profileID</customerProfileId>";
        $content .= "</getCustomerProfileRequest>";

        $response = self::sendXMLRequest($content);

        $parsedresponse = self::parseAPIResponse($response);

        //Logger::dump($parsedresponse);

        $info = array();

        if ($parsedresponse->messages->resultCode == 'Ok') {

            $info['lazy_user_id'] = intval($parsedresponse->profile->merchantCustomerId);
            $info['description'] = (string) $parsedresponse->profile->description;
            $info['email'] = (string) $parsedresponse->profile->email;

            $info['payment_profiles'] = array();

            foreach ($parsedresponse->profile->paymentProfiles as $profile) {

                $temp['payment_profile_id'] = intval($profile->customerPaymentProfileId);

                $temp['firstname'] = (string) $profile->billTo->firstName;
                $temp['lastname'] = (string) $profile->billTo->lastName;
                $temp['company'] = (string) $profile->billTo->company;
                $temp['address'] = (string) $profile->billTo->address;
                $temp['city'] = (string) $profile->billTo->city;
                $temp['state'] = (string) $profile->billTo->state;
                $temp['zip'] = (string) $profile->billTo->zip;
                $temp['country'] = (string) $profile->billTo->country;
                $temp['phone'] = (string) $profile->billTo->phoneNumber;

                $temp['card_number'] = (string) $profile->payment->creditCard->cardNumber;

                $info['payment_profiles'][] = $temp;
            }
        }

        return $info;
    }

    // /////////////////////////////////////////////////////////////////////////

    /**
     * Get info for a specific payment profile id
     * @param int $profileID Customer's Authorize.Net profile id
     * @param int $profilePaymentID Customer's Authorize.Net payment profile id we want information on
     * @return <type>
     */
    public static function getPaymentProfileInfo($profileID, $profilePaymentID) {

        $content = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
        $content .= "<getCustomerPaymentProfileRequest xmlns=\"AnetApi/xml/v1/schema/AnetApiSchema.xsd\">";
        $content .= self::getMerchantAuthenticationBlock();
        $content .= "    <customerProfileId>$profileID</customerProfileId>";
        $content .= "    <customerPaymentProfileId>$profilePaymentID</customerPaymentProfileId>";
        $content .= "</getCustomerPaymentProfileRequest>";

        $response = self::sendXMLRequest($content);

        $parsedresponse = self::parseAPIResponse($response);

        $info = array();

        if ($parsedresponse->messages->resultCode == 'Ok') {

            $info['payment_profile_id'] = intval($parsedresponse->paymentProfile->customerPaymentProfileId);

            $info['firstname'] = (string) $parsedresponse->paymentProfile->billTo->firstName;
            $info['lastname'] = (string) $parsedresponse->paymentProfile->billTo->lastName;
            $info['company'] = (string) $parsedresponse->paymentProfile->billTo->company;
            $info['address'] = (string) $parsedresponse->paymentProfile->billTo->address;
            $info['city'] = (string) $parsedresponse->paymentProfile->billTo->city;
            $info['state'] = (string) $parsedresponse->paymentProfile->billTo->state;
            $info['zip'] = (string) $parsedresponse->paymentProfile->billTo->zip;
            $info['country'] = (string) $parsedresponse->paymentProfile->billTo->country;
            $info['phone'] = (string) $parsedresponse->paymentProfile->billTo->phoneNumber;

            $info['card_number'] = (string) $parsedresponse->paymentProfile->payment->creditCard->cardNumber;
        }

        return $info;
    }

    // /////////////////////////////////////////////////////////////////////////

    /**
     * Update an existing payment profile
     *
     * @param int $profileId The Authorize.Net customer profile id associated with this customer (see AuthorizeNet::createProfile)
     * @param int $paymentProfileId The Authorize.Net payment profile we want to update
     * @param int $shippingAddressId The Authorize.Net shipping profile id for this customer (if we have one, if not just set to 0)
     * @param string $firstName The first name on the credit card
     * @param string $lastName The last name on the credit card
     * @param string $company The company name for the credit card (can be empty)
     * @param string $address The address associated with the credit card
     * @param string $city The city associated with the credit card
     * @param string $state The state associated with the credit card
     * @param string $zip The zip associated with the credit card
     * @param string $phoneNo The phone number associated with this card
     * @param string $cardNo The credit card number
     * @param string $expirationDate The card's expiration date, in the form YYYY-MM
     * @param string $ccvCode The three- or four- digit number on the back of a credit card (on the front for American Express
     * @return If successful, returns a customerPaymentProfileID which we store to use with AuthorizeNet::createTransaction to actually charge the card.
     * returns false if not successful.
     */
    public static function updatePaymentProfile($profileId, $paymentProfileId, $shippingAddressId, $firstName, $lastName, $company, $address, $city, $state, $zip, $phoneNo, $cardNo, $expirationDate, $ccvCode) {

        // build xml to post
        $content = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
        $content .= "<updateCustomerPaymentProfileRequest xmlns=\"AnetApi/xml/v1/schema/AnetApiSchema.xsd\">";
        $content .= self::getMerchantAuthenticationBlock();
        $content .= "    <customerProfileId>$customerProfileId</customerProfileId>";
        $content .= "    <customerPaymentProfileId>$paymentProfileId</customerPaymentProfileId>";
        $content .= "    <paymentProfile>";
        $content .= "        <billTo>";
        $content .= "            <firstName>$firstName</firstName>";
        $content .= "            <lastName>$lastName</lastName>";
        $content .= "            <company>$company</company>";
        $content .= "            <address>$address</address>";
        $content .= "            <city>$city</city>";
        $content .= "            <state>$state</state>";
        $content .= "            <zip>$zip</zip>";
        $content .= "            <country>USA</country>";
        $content .= "            <phoneNumber>$phoneNo</phoneNumber>";
        $content .= "        </billTo>";
        $content .= "        <payment>";
        $content .= "            <creditCard>";
        $content .= "                <cardNumber>$cardNo</cardNumber>";
        $content .= "                <expirationDate>$expirationDate</expirationDate>"; // required format for API is YYYY-MM
        $content .= "                <cardCode>$ccvCode</cardCode>"; // ccv code
        $content .= "            </creditCard>";
        $content .= "        </payment>";

        $content .= "    </paymentProfile>";

        if (self::$TEST_MODE) {
            $content .= "    <validationMode>testMode</validationMode>";
        } else {
            $content .= "    <validationMode>liveMode</validationMode>";
        }

        $content .= "</updateCustomerPaymentProfileRequest>";

        $response = self::sendXMLRequest($content);

        Logger::debug("Raw response: $response");
        $parsedresponse = self::parseAPIResponse($response);

        if ($parsedresponse->messages->resultCode == 'Ok') {
            Logger::debug("Profile successfully updated!");
            return $parsedresponse->customerPaymentProfileId;
        }

        return false;
    }

    /**
     * Allows a user to just update a card's expiration date
     * @param int $profileId The Authorize.Net customer profile id associated with this customer (see AuthorizeNet::createProfile)
     * @param int $paymentProfileId The Authorize.Net payment profile we want to update
     * @param string $expirationDate The card's expiration date, in the form YYYY-MM
     * returns false if not successful.
     */
    public static function updatePaymentProfileExpirationDate($profileId, $paymentProfileId, $expirationDate) {

        // build xml to post
        $content = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
        $content .= "<updateCustomerPaymentProfileRequest xmlns=\"AnetApi/xml/v1/schema/AnetApiSchema.xsd\">";
        $content .= self::getMerchantAuthenticationBlock();
        $content .= "    <customerProfileId>$customerProfileId</customerProfileId>";
        $content .= "    <customerPaymentProfileId>$paymentProfileId</customerPaymentProfileId>";
        $content .= "    <paymentProfile>";
        $content .= "        <payment>";
        $content .= "            <creditCard>";
        $content .= "                <expirationDate>$expirationDate</expirationDate>"; // required format for API is YYYY-MM
        $content .= "            </creditCard>";
        $content .= "        </payment>";

        $content .= "    </paymentProfile>";

        if (self::$TEST_MODE) {
            $content .= "    <validationMode>testMode</validationMode>";
        } else {
            $content .= "    <validationMode>liveMode</validationMode>";
        }

        $content .= "</updateCustomerPaymentProfileRequest>";

        $response = self::sendXMLRequest($content);

        Logger::debug("Raw response: $response");
        $parsedresponse = self::parseAPIResponse($response);

        if ($parsedresponse->messages->resultCode == 'Ok') {
            Logger::debug("Profile successfully updated!");
            return $parsedresponse->customerPaymentProfileId;
        }

        return false;
    }

    // /////////////////////////////////////////////////////////////////////////

    /**
     * Update an existing profile
     * @param int $profileID
     * @param string $email The new email for the customer
     * @return boolean returns true if successful, false otherwise
     */
    public static function updateProfile($profileID, $email) {

        $content = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
        $content .= "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
        $content .= "<updateCustomerProfileRequest xmlns=\"AnetApi/xml/v1/schema/AnetApiSchema.xsd\">";
        $content .= self::getMerchantAuthenticationBlock();
        $content .= "    <customerProfileId>$profileId</customerProfileId>";
        $content .= "    <email>$email</email>";
        $content .= "</updateCustomerProfileRequest>";

        $response = self::sendXMLRequest($content);

        Logger::debug("Raw response: $response");
        $parsedresponse = self::parseAPIResponse($response);

        if ($parsedresponse->messages->resultCode == 'Ok') {
            Logger::debug("Profile successfully delete!");
            return true;
        }

        return false;
    }

    // /////////////////////////////////////////////////////////////////////////
    //
    // Support Methods
    //
    // /////////////////////////////////////////////////////////////////////////

    private static function getMerchantAuthenticationBlock() {
        $text = "<merchantAuthentication>";
        if (self::$TEST_MODE) {
            $text .= "    <name>" . self::$test_login_id . "</name>";
            $text .= "    <transactionKey>" . self::$test_transaction_key . "</transactionKey>";
        } else {
            $text .= "    <name>" . self::$login_id . "</name>";
            $text .= "    <transactionKey>" . self::$transaction_key . "</transactionKey>";
        }
        $text .= "</merchantAuthentication>";
        return $text;
    }

    // /////////////////////////////////////////////////////////////////////////

    /**
     * Method to send xml request to Api. There is more than one way to send https requests in PHP (such as CURL).
     */
    private static function sendXMLRequest($content) {

        $host = self::$api_host;
        if (self::$TEST_MODE)
            $host = self::$test_api_host;

        $posturl = "ssl://" . $host;

        $header = "Host: " . $host . "\r\n";
        $header .= "User-Agent: PHP Script\r\n";
        $header .= "Content-Type: text/xml\r\n";
        $header .= "Content-Length: " . strlen($content) . "\r\n";
        $header .= "Connection: close\r\n\r\n";

        $fp = fsockopen($posturl, 443, $errno, $errstr, 30);

        if (!$fp) {
            $body = false;
        } else {

            fputs($fp, "POST " . self::$api_path . " HTTP/1.1\r\n");
            fputs($fp, $header . $content);
            //fwrite($fp, $out);
            $response = "";
            while (!feof($fp)) {
                $response = $response . fgets($fp, 128);
            }
            fclose($fp);

            $len = strlen($response);
            $bodypos = strpos($response, "\r\n\r\n");
            if ($bodypos <= 0) {
                $bodypos = strpos($response, "\n\n");
            }
            while ($bodypos < $len && $response[$bodypos] != '<') {
                $bodypos++;
            }
            $body = substr($response, $bodypos);
        }
        return $body;
    }

    // /////////////////////////////////////////////////////////////////////////

    /**
     * Send XML request via CURL
     */
    private static function sendCURLRequest($content) {

        $host = self::$api_host;
        if (self::$TEST_MODE)
            $host = self::$test_api_host;

        $posturl = "https://" . $host . self::$api_path;
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $posturl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, Array("Content-Type: text/xml"));
        curl_setopt($ch, CURLOPT_HEADER, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $content);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        $response = curl_exec($ch);
        return $response;
    }

    // /////////////////////////////////////////////////////////////////////////

    /**
     * function to parse the api response using SimpleXML
     */
    private static function parseAPIResponse($content) {
        $parsedresponse = simplexml_load_string($content, "SimpleXMLElement", LIBXML_NOWARNING);
        if ($parsedresponse->messages->resultCode != "Ok") {
            Logger::error("Failed to parse resonse from Authorize.Net API. The operation failed with the following errors:");
            foreach ($parsedresponse->messages->message as $msg) {
                Logger::error("[" . htmlspecialchars($msg->code) . "] " . htmlspecialchars($msg->text));
                self::$error_message = (string)$msg->text;
                self::$error_code = (string)$msg->code;
            }
            // Dump all info for inspection
            Logger::errorDump($parsedresponse);
        }
        return $parsedresponse;
    }

}

?>