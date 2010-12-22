<?php
/**
* Class to provide support for getting geo-location of users
*
* @since 22nd December, 2010
* @author Mike Pritchard (mike@apollosites.com)
*/

class GeoLocation {

	/**
	* Get lat/long from a free-text address using the Google Map API
	*/
	public static function addressToLocation($address){
	
		$api_key = "ABQIAAAApd3TaflLK-nGV6GT_CxTqhSdm2A-7rwoGsE41YlBtCPOmvFDPxRCd_p-ugGZEcWT4iPDE9N7Rn-KXg";
				
		$url = 'http://maps.google.com/maps/geo?q='.urlencode($address).'&output=json&oe=utf8&sensor=false&key='.$api_key;
		$data = @file_get_contents($url);
		
		/*
		$ch = curl_init();
		$timeout = 0; // set to zero for no timeout
		curl_setopt ($ch, CURLOPT_URL, $url);
		curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
		$data = curl_exec($ch);
		curl_close($ch);
		*/
				
		$jsondata = json_decode($data,true);
		
		$pos = array();
		$pos['lat'] = 0;
		$pos['lon'] = 0;
		
		if(is_array($jsondata )&& $jsondata ['Status']['code']==200){
			$pos['lat'] = $jsondata ['Placemark'][0]['Point']['coordinates'][0];
			$pos['lon'] = $jsondata ['Placemark'][0]['Point']['coordinates'][1];
		}
		
		return $pos;		

	}
	
}


?>