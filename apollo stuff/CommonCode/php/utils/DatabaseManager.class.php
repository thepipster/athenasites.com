<?php
/**
 * Class to handle and abstract interations to database
 *
 * @author Mike Pritchard
 * @since July 6th, 2006
 */
class DatabaseManager {

	/** URL of MySQL server */
	private static  $databaseURL = "localhost";
	
	/** Name of MySQL database */
	private static $databaseName = "apollo_wpmu";

	/** Username of user with admin rights to database */
	private static $username = "mike";
	
	/** Password of user with admin rights to database */
	private static $password = "mike76";
	
	/** verbose flag, if true debug data is dumped */
	private static $verbose = false;

	/** Database connection */
	private static $connection = NULL;

	/** Contains a string the represents the MySQL version */
	private static $mysql_version = '';
	
	// //////////////////////////////////////////////////////////////////////////////////////
	
	public static function setUsername($newVal) {self::$username = $newVal;}
	public static function setPassword($newVal) {self::$password = $newVal;}
	public static function setURL($newVal) {self::$databaseURL = $newVal;}
	public static function setDatabaseName($newVal) {self::$databaseName = $newVal;}
	public static function setVerbose($newVal) {self::$verbose = $newVal;}
	
	public static function getMySQLVersion(){ return self::$mysql_version; }
	
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
			if (Session::exist('database_user')){
				ApolloLogger::debug("DB Username is not set, but found credentials stored in Session");
				self::$username = Session::get("database_user");
				self::$password = Session::get("database_pass");
				self::$databaseName = Session::get("database_name");
				self::$verbose = Session::get("database_verbose");	
				self::$databaseURL = Session::get("database_host");	
			}
			else {
				ApolloLogger::fatal("DB Username is not set, and could not find credentials in Session!!!");
			}
			
		}
		
		// Attempt to connect to MySQL engine on target server (at specified IP)....
		self::$connection = mysql_connect(self::$databaseURL, self::$username, self::$password);

		if (self::$connection != FALSE){

			// Link established with database......
			//self::$debug("connect() - Connection to MySQL server OK!");

			// Select the relevant database.........
			if (mysql_select_db(self::$databaseName, self::$connection)) {
				ApolloLogger::debug("Connection to MySQL database '" . self::$databaseName . "' OK!");
			}
			else {
				ApolloLogger::fatal("Failed to connect to MySQL database '" . self::$databaseName . "'");
			}

			// It's handy to grab the meta data for the table that we are to work with,
			// i.e. it would be nice to know the field names, field types etc...
			//self::$imageTableStructure = mysql_list_fields(self::$databaseName, self::$tableName, self::$linkID);
			
			self::$mysql_version = mysql_get_server_info();
			
			ApolloLogger::info("MySQL server version: " . self::$mysql_version);
		}
		else {
			//if (self::$verbose)
			$msg = "connect() - Connection to MySQL database '" . self::$databaseName . "' Failed!"
				. " Username = " . self::$username . " Password = " . self::$password . " Host = " . self::$databaseURL;
			ApolloLogger::fatal($msg);
			//print($msg);
			//exit();
		}
		
		ApolloLogger::debug("Connection to database initialized ok!");
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Close the connection to the database
	*/
	public static function close(){
		// Close the link with the MySql engine on the server
		ApolloLogger::debug("close() - Closing connection...");
        if (self::$connection) @mysql_close(self::$connection);
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function query($query){

		// Check to see if connection has been opened, if not connect to database
		if (self::$connection == NULL)
			self::connect();

		if (self::$verbose == true){
			ApolloLogger::debug($query);
		}
			
		// Submit query....
		$result = mysql_query($query, self::$connection);

		// Handle result.....
		if (!$result){
			ApolloLogger::fatal("Database query error = " . mysql_error() . " Query = [$query] ");
		}
		//else
		//	ApolloLogger::debug("Database Query = [$query] ");	
				
		return $result;

	}

	// //////////////////////////////////////////////////////////////////////////////////////

	public static function free($query_result){	
		if ($query_result != false || $query_result != NULL)
			//mysql_free_result($query_result, self::$connection);
			try {
				@mysql_free_result($query_result);
			}
			catch (Exception $e) {
    			ApolloLogger::error('Caught exception: ',  $e->getMessage());
			}
	}

    // //////////////////////////////////////////////////////////////////////////////////////

    public static function make_sql_safe($string){
        return mysql_real_escape_string($string);
    }

	// //////////////////////////////////////////////////////////////////////////////////////		
}
?>