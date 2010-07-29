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
	private static $databaseName = "";

	/** Username of user with admin rights to database */
	private static $username = "";
	
	/** Password of user with admin rights to database */
	private static $password = "";

	/** set to true if you want the database object to ignore its destructor */
	private static $no_auto_destroy = false;
	
	/** verbose flag, if true debug data is dumped */
	private static $verbose = false;

	/** Database connection */
	private static $connection = NULL;

	/** Contains a string the represents the MySQL version */
	private static $mysql_version = '';
	
	/** Contains reference to the PDO object, if there is one */
	private static $pdo_conn = null;
	private static $pdo_statement = null;
	private static $pdo_bind_debug = null;
	
	// //////////////////////////////////////////////////////////////////////////////////////
	// PDO stuff
	// //////////////////////////////////////////////////////////////////////////////////////
	/**
	 * creates a PDO connection, stores it in self::$pdo_conn
	 * @return 
	 */
	public static function initPDO() {
	
		self::$username = Session::get("database_user");
		self::$password = Session::get("database_pass");
		self::$databaseName = Session::get("database_name");

		try {
			self::$pdo_conn = new PDO('mysql:host=' . self::$databaseURL . ';dbname=' . self::$databaseName, self::$username, self::$password, array(PDO::ATTR_PERSISTENT => false, PDO::ERRMODE_EXCEPTION => true));
			self::$pdo_conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, true);
		} catch (PDOException $e) {			
//			Logger::fatal('PDO connection error: ' . $e->getMessage() . " URL:".self::$databaseURL." User:".self::$username." Pass:".self::$password." DB Name:".self::$databaseName);
			Logger::fatal('PDO connection error: ' . $e->getMessage());
			die('PDO error');
		}
		return true;
	}
	
	/**
	 * Executes $query via PDO. returns array of associatove arrays of quert results
	 * @return 
	 * @param $query Object
	 */
	public static function executeQuery($query) {
		$arr_ret = array();

		if (! self::$pdo_conn) {
			self::initPDO();
		}
		$ret = self::$pdo_conn->query($query);
		if (!$ret) {
			Logger::warning('PDO Query: ' . $query);
			Logger::fatal("PDO Error: " . print_r(self::$pdo_conn->errorInfo(), true) )	;
		}
        else {
		   foreach ($ret as $row) {
		      $arr_ret[] = $row;
		   }			
		}
		self::$pdo_conn = null;
		return $arr_ret;
	}

	/**
	 * prepare a PDO query to accept bound parameters. Stores bound parameters to self::$pdo_statement
	 * @return 
	 * @param $sql Object
	 */
	public static function prepare($sql) {
		//Logger::debug("PDO: prepare($sql)");
		if (! self::$pdo_conn) {
			self::initPDO();
		}
		self::$pdo_statement = self::$pdo_conn->prepare($sql);
		self::$pdo_bind_debug = $sql;
	}
	
	/**
	 * binds a PDO param.
	 * @return 
	 * @param $i Int Order of the param
	 * @param $val param in question
	 */
	public static function bindParam($i, $val) {
		self::$pdo_statement->bindParam($i, $val);
		//Logger::debug("PDO: bind($i, $val)");
	}

    /**
	 * Executes bound query via PDO. returns array of associatove arrays of query results
	 *
	 * if the query being passed in is an INSERT, set $is_insert == true, and this function will
	 * pass back the ID of the inserted field
     *
     * @param <type> $is_insert [optional] Set to true if this is an insert, and the last inserted id is returned
     * @param <type> $is_update [optional] Set to true, and either returns the number of rows affected, or false
     * @return <type>
     */
	public static function execute($is_insert = false, $is_update = false) {
		$arr_ret = array();

		$ret = self::$pdo_statement->execute();
		if (!$ret) {

            Logger::error('PDO Binding Query: ' . self::$pdo_bind_debug);
			Logger::error("PDO Error: " . print_r(self::$pdo_statement->errorInfo(), true) )	;
            // clear the connection
            self::$pdo_conn = null;
            self::$pdo_statement = null;
            self::$pdo_bind_debug = null;

            return false;

		} else {
			if ($is_insert) {
				$arr_ret = 	self::$pdo_conn->lastInsertId();
			}
            elseif ($is_update){
                $arr_ret = self::$pdo_statement->rowCount();
            }
            else {
				$arr_ret = self::$pdo_statement->fetchAll(PDO::FETCH_ASSOC);
			}
		}

		// clear the connection
		self::$pdo_conn = null;
		self::$pdo_statement = null;
		self::$pdo_bind_debug = null;
		
		return $arr_ret;
	}

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
				Logger::debug("DB Username is not set, but found credentials stored in Session");
				self::$username = Session::get("database_user");
				self::$password = Session::get("database_pass");
				self::$databaseName = Session::get("database_name");
				self::$verbose = Session::get("database_verbose");	
				self::$databaseURL = Session::get("database_host");	
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
				Logger::debug("Connection to MySQL database '" . self::$databaseName . "' OK!");
			}
			else {
				Logger::fatal("Failed to connect to MySQL database '" . self::$databaseName . "'");
			}

			// It's handy to grab the meta data for the table that we are to work with,
			// i.e. it would be nice to know the field names, field types etc...
			//self::$imageTableStructure = mysql_list_fields(self::$databaseName, self::$tableName, self::$linkID);
			
			self::$mysql_version = mysql_get_server_info();
			
			Logger::info("MySQL server version: " . self::$mysql_version);
		}
		else {
			//if (self::$verbose)
			$msg = "connect() - Connection to MySQL database '" . self::$databaseName . "' Failed!"
				. " Username = " . self::$username . " Password = " . self::$password . " Host = " . self::$databaseURL;
			Logger::fatal($msg);
			//print($msg);
			//exit();
		}
		
		Logger::debug("Connection to database initialized ok!");
	}

	// //////////////////////////////////////////////////////////////////////////////////////

	/**
	* Close the connection to the database
	*/
	public static function close(){
		// Close the link with the MySql engine on the server
		Logger::debug("close() - Closing connection...");
        if (self::$connection) @mysql_close(self::$connection);
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
	
	public static function newMysqli() {
		
		if (self::$username == ""){
			if (Session::exist('database_user')){
				Logger::debug("DB Username is not set, but found credentials stored in Session");
				self::$username = Session::get("database_user");
				self::$password = Session::get("database_pass");
				self::$databaseName = Session::get("database_name");
				self::$verbose = Session::get("database_verbose");		
			}
			else {
				Logger::fatal("DB Username is not set, and could not find credentials in Session!!!");
			}
		}
		
		$mysqli = new mysqli(self::$databaseURL, self::$username, self::$password, self::$databaseName);


		if (mysqli_connect_errno()) {
			$error = mysqli_connect_error();
		    printf("Connect failed: %s\n", $error);
			Logger::fatal($error);
		    exit();
		} else {
			return $mysqli;
		}

	}
	
	public static function freeMysqli($mysqli) {
		mysqli_free_result($mysqli);
	}

		
}
?>