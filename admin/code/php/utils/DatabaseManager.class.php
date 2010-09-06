<?php
/**
* *******************************************************************
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
* 
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* 
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
* 
* *******************************************************************
*
* Class to handle and abstract interations to database
*
* @author Mike Pritchard (mike@adastrasystems.com)
* @since July 6th, 2006
* @version 2.1
*/
class DatabaseManager {

	/** URL of MySQL server */
	private static  $databaseURL = "localhost";
	
	/** Name of MySQL database */
	private static $databaseName = "";

	/** Username of user with admin rights to database */
	private static $username = "";
	
	/** Password of user with admin rights to database */
	private static $password = "";
	
	/** verbose flag, if true debug data is dumped */
	private static $verbose = false;

	/** 
	* Array of connections, we only store a connections to the master DB and 
	* and a single random slave to use for this session
	*/
	private static $connections = null;
			
	/** Maximum number of slaves */
	public static $MAX_NO_SLAVES = 10;
	
	/** Store the currently used connection */
	private static $currentCon = null;
	
	// //////////////////////////////////////////////////////////////////////////////////////
	
	public static function setUsername($newVal) {self::$username = $newVal;}
	public static function setPassword($newVal) {self::$password = $newVal;}
	public static function setURL($newVal) {self::$databaseURL = $newVal;}
	public static function setDatabaseName($newVal) {self::$databaseName = $newVal;}
	public static function setVerbose($newVal) {self::$verbose = $newVal;}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Connects to the MySQL database with the parameters defined in the
	* admin class (settings.php)
	*
	* @param oSettings Site-specific paramaters, such as username, password, server etc.
	* @see settings.php
	*/
	public static function connect(){

		$slaveDBs = array();
		$noSlaves = 0;

		if (self::$username == ""){
			
			if (defined('database_user')){
				//Logger::debug("DB Username is not set, but found credentials stored in Session");
				self::$username = database_user;
				self::$password = database_pass;
				self::$databaseName = database_name;
				self::$verbose = database_verbose;	
				self::$databaseURL = database_host;
				for ($i=0; $i<self::$MAX_NO_SLAVES; $i++){
					if (defined('slave_host_'.$i)) eval('$slaveDBs[] = slave_host_'.$i.';');
				}
				$noSlaves = count($slaveDBs);
			}
			else {
				Logger::fatal("DB Username is not set, and could not find credentials in Session!!!");
			}
			
		}
		
		self::$connections = array();
		$hosts = array();
		
		// Attempt to connect to master DB....
		self::$connections['master'] = mysql_connect(self::$databaseURL, self::$username, self::$password);
		$hosts['master'] = self::$databaseURL;
				
		// Connect to a single random slave, to use for this session
		if ($noSlaves > 0){
			$host = $slaveDBs[mt_rand(0, $noSlaves-1)];
			self::$connections['slave'] = mysql_connect($host, self::$username, self::$password);		
			$hosts['slave'] = $host;
		}		
								

		// Connect to database
		//for($i=0; $i<count(self::$connection); $i++)
		foreach(self::$connections as $host=>$cx){		
		
			//$cx = self::$connection[$i];
			//$host = ($i == 0) ? $databaseURL . "(Master)" : $slaveDBs[$i-1];
			
			if ($cx != FALSE){
	
				// Select the relevant database.........
				if (mysql_select_db(self::$databaseName, $cx)) {
					Logger::debug("Connected to MySQL database '".self::$databaseName."' OK for " . $hosts[$host] . " ($host)");
				}	
				else {
					Logger::fatal("Connection to MySQL database '".self::$databaseName."' FAILED for " . $hosts[$host] . " ($host)");
				}			
	
			}
			else {
				Logger::fatal("Connection to MySQL database '$host' failed with username " . self::$username . "!");
			}
			
		}
				
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Close the connection to the database
	*/
	public static function close(){
		// Close the connections
		foreach(self::$connections as $cx){		
	        if ($cx) @mysql_close($cx);
		}
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	/** 
	* Use the slave connection, if not available or set use the master DB instead
	*/
	private static function useSlave(){	
		if (isset(self::$connections['slave'])){
			self::$currentCon = self::$connections['slave'];
		}
		else {
			self::useMaster();
		}
	}

	/** Use the master connections */
	private static function useMaster(){self::$currentCon = self::$connections['master'];}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function insert($query){	
		self::useMaster();
		$result = self::internalQuery($query);				
		return mysql_insert_id(self::$currentCon);
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function update($query){	
		self::useMaster();
		$result = self::internalQuery($query);				
		return $result;
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Perform a basic query, this will use the master connection is it can not know what kind
	* of query the user is attempting
	*/
	public static function submitQuery($query){
		self::useMaster();
		return self::internalQuery($query);
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Perform a basic query using the current connection
	*/
	private static function internalQuery($query){

		// Check to see if connection has been opened, if not connect to database
		if (self::$currentCon == NULL)
			self::connect();

		if (self::$verbose == true){
			Logger::debug($query);
		}
			
		// Submit query....
		$result = mysql_query($query, self::$currentCon);

		// Handle result.....
		if (!$result){
			Logger::fatal("Database query error = " . mysql_error(self::$currentCon) . " Query = [$query] ");
		}
		//else
		//	Logger::debug("Database Query = [$query] ");	
				
		return $result;

	}
	
	// //////////////////////////////////////////////////////////////////////////////////////
	
	public static function freeResult($query_result){	
		if ($query_result != false || $query_result != NULL)
			//mysql_free_result($query_result, self::$connection);
			try {
				@mysql_free_result($query_result, self::$currentCon);
			}
			catch (Exception $e) {
    			Logger::error('Caught exception: ',  $e->getMessage());
			}
	}

    // //////////////////////////////////////////////////////////////////////////////////////

    public static function make_sql_safe($string){
		if (self::$currentCon == NULL) self::connect();
        return mysql_real_escape_string($string, self::$currentCon);
    }

    // //////////////////////////////////////////////////////////////////////////////////////
	//
	// Helper methods
	//
    // //////////////////////////////////////////////////////////////////////////////////////
		
	/**
	 * Prepares a SQL query for safe execution using sprintf style execution, it currently only
	 * supports %d (decimal number), %s (string). Both %d and %s should be left unquoted in the 
	 * query string.
	 *
	 * <code>
	 * DatabaseManager::prepare( "SELECT * FROM someTable WHERE 'someField' = %s AND 'anotherField' = %d", "a string", 43346 )
	 * </code>
	 *
	 * This function was borrowed from and inspired by the Wordpress implementation.
	 *
	 * @param string $query Query statement with sprintf()-like placeholders
	 * @param array|mixed $args The array of variables to substitute into the query's placeholders if being called like {@link http://php.net/vsprintf vsprintf()}, or the first variable to substitute into the query's placeholders if being called like {@link http://php.net/sprintf sprintf()}.
	 * @param mixed $args,... further variables to substitute into the query's placeholders if being called like {@link http://php.net/sprintf sprintf()}.
	 * @return null|string Sanitized query string
	 */
	public static function prepare($query = null) { // ( $query, *$args )
			
		$args = func_get_args();
				
		array_shift($args);

		// If args were passed as an array (as in vsprintf), move them up
		if ( isset($args[0]) && is_array($args[0]) ){
			$args = $args[0];
		}
			
		$query = str_replace("'%s'", '%s', $query); // in case someone mistakenly already singlequoted it
		$query = str_replace('"%s"', '%s', $query); // doublequote unquoting
		$query = str_replace('%s', "'%s'", $query); // quote the strings
		
		for($i=0; $i<count($args); $i++){
			$args[$i] = mysql_real_escape_string($args[$i], self::$currentCon);
		}
		
		//array_walk($args, array(&$this, 'mysql_real_escape_string'));

		return @vsprintf($query, $args);
	}	
		
    // //////////////////////////////////////////////////////////////////////////////////////
	

	/**
	 * Performs the given SQL query and returns a single value, if multiple values are recieved it will 
	 * simply return the first.
	 *
	 */
	public static function getVar($sql) {
	
		self::useSlave();

		$results = DatabaseManager::internalQuery($sql);

		// Return null if there are no results
		if (!$results) {
			return null;
		}
		
		$row = mysql_fetch_array($results, MYSQL_NUM);
		mysql_free_result($results);
		
		if (isset($row) && isset($row[0])){
			return $row[0];
		}
		
		return null;
	}
	
    // //////////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Get an array for a single column, i.e. similar to getVar but returns an array of results
	* rather then a single result
	*/
	public static function getColumn($sql){
		
		self::useSlave();
		
		$results = DatabaseManager::internalQuery($sql);

		if (!$results || mysql_num_rows($results) == 0) {
			return null;
		}
		
		$data = array();
		
		// Build the output data		
		while ($row = mysql_fetch_array($results)) {
			$data[] = $row[0];
		}

		mysql_free_result($results);

		return $data;		
	}
    	
    // //////////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Return the first row as an associative array from a result set, or null if no results found
	*/
	public static function getRow($sql){

		self::useSlave();

		$results = DatabaseManager::internalQuery($sql);

		if (!$results || mysql_num_rows($results) == 0) {
			return null;
		}
		

		$row = mysql_fetch_assoc($result);
		mysql_free_result($results);

		return $row;
	}
	
    // //////////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Get all the results for a query as an associative array, returns null if no results found
	*/
	public static function getResults($sql){
		
		self::useSlave();
		
		$results = DatabaseManager::internalQuery($sql);

		if (!$results || mysql_num_rows($results) == 0) {
			return null;
		}
		
		$data = array();
		
		// Build the output data		
		while ($row = mysql_fetch_assoc($results)) {
			$data[] = $row;
		}

		mysql_free_result($results);

		return $data;		
	}
	
    // //////////////////////////////////////////////////////////////////////////////////////


	/**
	* Get a single result and return as an asssociative array
	*/
	public static function getSingleResult($sql){
		
		self::useSlave();
		
		$results = DatabaseManager::internalQuery($sql);

		if (!$results || mysql_num_rows($results) == 0) {
			return null;
		}
		
		$data = array();
		
		// Build the output data		
		while ($row = mysql_fetch_assoc($results)) {
			$data[] = $row;
		}

		if (isset($data[0])){
			$data = $data[0];
		}
		
		mysql_free_result($results);

		return $data;		
	}
	
}
?>