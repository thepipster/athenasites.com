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

	/** Database connection */
	private static $connection = NULL;

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

		if (self::$username == ""){
			if (defined('database_user')){
				//Logger::debug("DB Username is not set, but found credentials stored in Session");
				self::$username = database_user;
				self::$password = database_pass;
				self::$databaseName = database_name;
				self::$verbose = database_verbose;	
				self::$databaseURL = database_host;	
			}
			else {
				Logger::fatal("DB Username is not set, and could not find credentials in Session!!!");
			}
			
		}
		
		// Attempt to connect to MySQL engine on target server (at specified IP)....
		self::$connection = mysql_connect(self::$databaseURL, self::$username, self::$password);

		if (self::$connection != FALSE){

			// Link established with database......
			//self::$debug("connect() - Connection to MySQL server OK!");

			// Select the relevant database.........
			if (mysql_select_db(self::$databaseName, self::$connection)) {
				//Logger::debug("Connection to MySQL database '" . self::$databaseName . "' OK!");
			}
			else {
				Logger::fatal("Failed to connect to MySQL database '" . self::$databaseName . "'");
			}

		}
		else {
			//if (self::$verbose)
			$msg = "connect() - Connection to MySQL database '" . self::$databaseName . "' Failed!"
				. " Username = " . self::$username . " Password = " . self::$password . " Host = " . self::$databaseURL;
			Logger::fatal($msg);
			//print($msg);
			//exit();
		}
		
		//Logger::debug("Connection to database initialized ok!");
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Close the connection to the database
	*/
	public static function close(){
		// Close the link with the MySql engine on the server
		//Logger::debug("close() - Closing connection...");
        if (self::$connection) @mysql_close(self::$connection);
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function insert($query){	
		$result = self::submitQuery($query);				
		return mysql_insert_id();
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function update($query){	
		$result = self::submitQuery($query);				
		return $result;
	}
	
	// //////////////////////////////////////////////////////////////////////////////////////

	public static function submitQuery($query){

		// Check to see if connection has been opened, if not connect to database
		if (self::$connection == NULL)
			self::connect();

		if (self::$verbose == true){
			Logger::debug($query);
		}
			
		// Submit query....
		$result = mysql_query($query, self::$connection);

		// Handle result.....
		if (!$result){
			Logger::fatal("Database query error = " . mysql_error() . " Query = [$query] ");
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
				@mysql_free_result($query_result);
			}
			catch (Exception $e) {
    			Logger::error('Caught exception: ',  $e->getMessage());
			}
	}

    // //////////////////////////////////////////////////////////////////////////////////////

    public static function make_sql_safe($string){
		if (self::$connection == NULL) self::connect();
        return mysql_real_escape_string($string);
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
			$args[$i] = mysql_real_escape_string($args[$i]);
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
	
		$results = DatabaseManager::submitQuery($sql);

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
		
		$results = DatabaseManager::submitQuery($sql);

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

		$results = DatabaseManager::submitQuery($sql);

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
		
		$results = DatabaseManager::submitQuery($sql);

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
		
		$results = DatabaseManager::submitQuery($sql);

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