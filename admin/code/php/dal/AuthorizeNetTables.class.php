<?php
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

class AdsAuthorizeNetTables {

    // /////////////////////////////////////////////////////////////////////////////////

    public static function createProfile($lz_user_id, $profile_id) {

        $sql = DatabaseManager::prepare("INSERT INTO lzads_authorizenet_profile_ids (profile_id, user_id) VALUES (%d, %d)", $profile_id, $lz_user_id);
        return DatabaseManager::insert($sql);
    }

    // /////////////////////////////////////////////////////////////////////////////////

    public static function addPaymentProfile($profile_id, $payment_profile_id, $is_primary, $expirationDate) {

        $date_str = date('Y-m-d', time());
                
        $sql = DatabaseManager::prepare("INSERT INTO lzads_authorizenet_payment_profile_ids (profile_id, payment_profile_id, is_primary, date_added, expiration) VALUES (%d, %d, %d, '$date_str', %s)",
                $profile_id, $payment_profile_id, $is_primary, $expirationDate);                
        $id =  DatabaseManager::insert($sql);
        
        // Make sure that all other cards are set to secondary if this is primary
        if ($is_primary == 1){
        	self::setPrimaryCard($id, $profile_id);
        }
        
        return $id;        
    }

    // /////////////////////////////////////////////////////////////////////////////////

	/**
	* Get a list of payment profile's for the given profile id, and return with primary payment profile first
	*/
	public static function getPaymentProfiles($profile_id){
        $sql = DatabaseManager::prepare("SELECT * FROM lzads_authorizenet_payment_profile_ids WHERE profile_id = %d ORDER BY is_primary DESC", $profile_id);
        return DatabaseManager::getResults($sql);
	}
	
    // /////////////////////////////////////////////////////////////////////////////////

    /**
     * Set the specified credit card to be primary, and flip all other cards to secondary for this user
     * @param int $id
     * @return int The profile_id used by Authorize.Net
     */
	public static function setPrimaryCard($id, $profile_id){
		// Update all cards associated with this profile id and make them secondary
        $sql = DatabaseManager::prepare("UPDATE lzads_authorizenet_payment_profile_ids SET is_primary = 0 WHERE profile_id = %d", $profile_id);
        DatabaseManager::update($sql);
        
        // Now flip this card to primary
        $sql = DatabaseManager::prepare("UPDATE lzads_authorizenet_payment_profile_ids SET is_primary = 1 WHERE id = %d", $id);
        DatabaseManager::update($sql);
	}
	
    // /////////////////////////////////////////////////////////////////////////////////

    public static function deletePaymentProfile($id) {
        $sql = DatabaseManager::prepare("DELETE FROM lzads_authorizenet_payment_profile_ids WHERE id = %d", $id);
        return DatabaseManager::submitQuery($sql);
    }

    // /////////////////////////////////////////////////////////////////////////////////
    
    /**
     * Get a user's profile id used by Authorize.Net
     * @param int $lz_user_id
     * @return int The profile_id used by Authorize.Net
     */
    public static function getUserProfileID($lz_user_id){
        $sql = DatabaseManager::prepare("SELECT profile_id FROM lzads_authorizenet_profile_ids WHERE user_id = %d", $lz_user_id);
        return DatabaseManager::getVar($sql);
    }

    // /////////////////////////////////////////////////////////////////////////////////

    /**
     * Get the Authorize.Net payment profile id associated with the card id
     * @param int $id Card id (the id of the lzads_authorizenet_payment_profile_ids table)
     * @return The payment_profile_id used by Authorize.Net
     */
    public static function getPaymentProfileID($id){
        $sql = DatabaseManager::prepare("SELECT payment_profile_id FROM lzads_authorizenet_payment_profile_ids WHERE id = %d", $id);
        return DatabaseManager::getVar($sql);
    }

    /**
     * Get the credit card type
     * @param int $id Card id (the id of the lzads_authorizenet_payment_profile_ids table)
     * @return <type>
     */
    public static function getCardType($id){
        $sql = DatabaseManager::prepare("SELECT card_type FROM lzads_authorizenet_payment_profile_ids WHERE id = %d", $id);
        return DatabaseManager::getVar($sql);
    }

   public static function getCardTypeFromPaymentProfileID($payment_profile_id){
        $sql = DatabaseManager::prepare("SELECT card_type FROM lzads_authorizenet_payment_profile_ids WHERE payment_profile_id = %d", $payment_profile_id);
        return DatabaseManager::getVar($sql);
   }

   public static function getExpirationFromPaymentProfileID($payment_profile_id){
        $sql = DatabaseManager::prepare("SELECT expiration FROM lzads_authorizenet_payment_profile_ids WHERE payment_profile_id = %d", $payment_profile_id);
        return DatabaseManager::getVar($sql);
   }

   public static function getPaymentProfile($payment_profile_id){
        $sql = DatabaseManager::prepare("SELECT * FROM lzads_authorizenet_payment_profile_ids WHERE payment_profile_id = %d", $payment_profile_id);
        return DatabaseManager::getSingleResult($sql);
   }
}

?>
