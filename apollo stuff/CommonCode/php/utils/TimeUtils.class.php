<?php

class TimeUtils {

	public static function getPastDateString($no_days_ago){		
		date_default_timezone_set('UTC');
		return date("Y-m-d H:i", mktime(date("H"), date("i"), date("s"), date("m")  , date("d")-$no_days_ago, date("Y")));
	}
	
	// ///////////////////////////////////////////////////////////////////////

	/**
	* Get the current time as accuratly as possible
	*
	*/
	public static function getMicroTime(){
		$tmp = split(" ",microtime());
		$rt = $tmp[0]+$tmp[1];
		return $rt;
	}
    
	// ///////////////////////////////////////////////////////////////////////

	public static function getMicroSeconds(){
		$tmp = split(" ",microtime());
		$rt = $tmp[0];
		return $rt;
	}

	// ///////////////////////////////////////////////////////////////////////
	
	public static function getElapsedHours($data_string){
		$epoch_1 = strtotime($data_string);
		$epoch_2 = mktime(date("H"), date("i"), date("s"), date("m")  , date("d"), date("Y"));					
		$e_secs  = $epoch_2 - $epoch_1;
		return $e_secs/3600;
	}
	
	// ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Get the number of seconds between the given date string and now
     * @param <type> $data_string
     * @return <type>
     */
	public static function getElapsedSeconds($data_string){
		$epoch_1 = strtotime($data_string);
		$epoch_2 = mktime(date("H"), date("i"), date("s"), date("m")  , date("d"), date("Y"));					
		$e_secs  = $epoch_2 - $epoch_1;
		return $e_secs;
	}

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Get the number of minutes between the given date string and now
     * @param <type> $data_string
     * @return <type>
     */
	public static function getElapsedMinutes($data_string){
		$epoch_1 = strtotime($data_string);
		$epoch_2 = mktime(date("H"), date("i"), date("s"), date("m")  , date("d"), date("Y"));
		$e_secs  = $epoch_2 - $epoch_1;
		return $e_secs/60;
	}

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Get the number of days between the given date string and now
     * @param <type> $data_string
     * @return <type>
     */
	public static function getElapsedDays($data_string){
		$epoch_1 = strtotime($data_string);
		$epoch_2 = mktime(date("H"), date("i"), date("s"), date("m")  , date("d"), date("Y"));
		$e_secs  = $epoch_2 - $epoch_1;
		return $e_secs/86400;
	}

    // ///////////////////////////////////////////////////////////////////////////////////////

    /**
     * Get the number of days between the 2 given date strings 
     * @param <type> $data_string
     * @return <type>
     */
	public static function getDaysDif($date_string1, $date_string2){
		$epoch_1 = strtotime($date_string1);
		$epoch_2 = strtotime($date_string2);
		$e_secs  = $epoch_2 - $epoch_1;
		return $e_secs/86400;
	}

    // ///////////////////////////////////////////////////////////////////////////////////////
	
	public static function time2sec($time) {
	    $hours = substr($time, 0, -6);
	    $minutes = substr($time, -5, 2);
	    $seconds = substr($time, -2);
	
	    return $hours * 3600 + $minutes * 60 + $seconds;
	}

	// ///////////////////////////////////////////////////////////////////////////////////////

	public static function sec2time($seconds) {
	    $hours = floor($seconds / 3600);
	    $minutes = floor($seconds % 3600 / 60);
	    $seconds = $seconds % 60;
		    return sprintf("%d:%02d:%02d", $hours, $minutes, $seconds);
	} 
	
}

?>
