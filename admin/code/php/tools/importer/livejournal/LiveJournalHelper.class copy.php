<?php

/**
* Class to abstract interface to LiveJournal API
* http://www.livejournal.com/doc/server/ljp.csp.xml-rpc.protocol.html
*
*/
class LiveJournalHelper {

	private static $usernamme = 'charlottegeary';
	private static $password = 'r00bies';

	private static $host = "www.livejournal.com";
//	private static $cmd_url = "www.livejournal.com/interface/xmlrpc HTTP/1.0";

	private static $user_agent = "XMLRPC Client 1.0";

	private static $last_sync_time = "2009-06-09 00:01:00";

	// /////////////////////////////////////////////////////////////////////////////////

	public static function setLastSyncTime($dateTime){
	}
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Returns a list of all the items that have been created or updated for a user. 
	*/
	public static function getSyncItems(){

		/*
		POST /interface/xmlrpc HTTP/1.0
		User-Agent: XMLRPC Client 1.0
		Host: www.livejournal.com
		Content-Type: text/xml
		Content-Length: 495
		*/
		
		$sync_command = "<?xml version=\"1.0\"?>
		<methodCall>
			<methodName>LJ.XMLRPC.syncitems</methodName>
			<params>
				<param>
					<value>
						<struct>
							<member>
								<name>username</name>
								<value><string>".self::$usernamme."</string></value>
							</member>
							<member>
								<name>hpassword</name>
								<value><string>".md5(self::$password)."</string></value>
							</member>
							<member>
								<name>ver</name>
								<value><int>1</int></value>
							</member>
							<member>
								<name>lastsync</name>
								<value><string>".self::$last_sync_time."</string></value>
							</member>
						</struct>
					</value>
				</param>
			</params>
		</methodCall>";
		
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, self::$cmd_url);
		curl_setopt($ch, CURLOPT_USERAGENT, self::$user_agent);
		curl_setopt($ch, CURLOPT_HTTPHEADER, Array("Content-Type:text/xml"));
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $sync_command);
		$xmlData = curl_exec($ch);
		curl_close($ch);
		
		return self::decodeSyncItems($xmlData);
	}
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	private static function decodeSyncItems($xmlData){
	
		// Decode response
		//$xmlData = file_get_contents("resp.xml");
		$root = new SimpleXMLElement($xmlData);	
		
		// Ugh, xml-rpc is so inefficient....
		$data = $root->children()->children()->children()->children()->children();
		
		//$temp = $data->attributes();
		//echo "<pre>".print_r($temp, true)."</pre>";
		
		$ljItemList = array();
		
		foreach($data as $member) {
		
			$name = $member->getName();
			
			$memberData = $member->children();
			
			// Get the high level data.....
			$paraName = $memberData[0][0];
			$val = $memberData[1]->children();
				
			// Now parse.....
			if ($paraName == 'count'){
				$count = $val[0][0];
				//echo "Count: $count <br>";
			}
			else if ($paraName == 'total'){
				$total = $val[0][0];
				//echo "Total: $total <br>";
			}
			else if ($paraName == 'syncitems'){
				$temp = $val->children();
				foreach($temp[0]->children() as $item){
					
					$sructChilds = $item->children();
					$struct = $sructChilds[0];
					$struct_members = $struct[0];
					
					$i = 0;
		
					$tempLJField = array();
					
					// Get the 3 member types 
					foreach($struct_members->children() as $temp){
					
						$vals = $temp->children();
						
						
						foreach($temp->children() as $fields){
						
							if ($fields->getName() == 'name'){
								$fieldName = "".$fields[0];
							}
							elseif ($fields->getName() == 'value'){
								$vals2 = $fields->children();
								foreach($vals2 as $pants){
									$value = "".$pants;
									//echo "[$ct] $fieldName : $value <br>";
								}
							}
							
						}
						
						//echo "[$i] $fieldName : $value <br>";
						$tempLJField[$fieldName] = $value; 
						
						//switch($fieldName){
						//	case 'action' : $tempLJField['action'] = $value; break;
						//	case 'item' : $tempLJField['item'] = $value; break;
						//	case 'time' : $tempLJField['time'] = $value; break;
						//}
					
						$i++;					
					}
					
					$ljItemList[] = $tempLJField;	
				}
			}
			
		}
		
		return $ljItemList;
	}
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	/**
	* Returns a list of all the items that have been created or updated for a user. 
	*/
	public static function getEvents(){
		
		$client = new IXR_Client(self::$host, '/interface/xmlrpc');

		$args = array(
			'username' => self::$usernamme,
			'hpassword' => md5(self::$password),
			'ver' => 1,
			'truncate' => 0,
			'selecttype' => 'syncitems',
			'lastsync' => self::$last_sync_time,
			'noprops' => false,
			'lineendings' => 'unix'
		);

/*
		$args = array(
			'username' => self::$usernamme,
			'hpassword' => md5(self::$password),
			'ver' => 1,
			'truncate' => 0,
			'selecttype' => 'lastn',
			'howmany' => 10,
			'noprops' => false,
			'lineendings' => 'unix'
		);
*/		
		if (!$client->query('LJ.XMLRPC.getevents', $args)) {
			error_log('Something went wrong - '.$client->getErrorCode().' : '.$client->getErrorMessage());
			die();
		}
		
		$response = $client->getResponse();
		echo "Got response";
		echo "<pre>".print_r($response, true)."</pre>";



	/*	
		$year = '2009';
		$month = '06';
		$day = '07';
		
		$sync_command = "<?xml version=\"1.0\"?>
		<methodCall>
			<methodName>LJ.XMLRPC.getevents</methodName>
			<params>
				<param>
					<value>
						<struct>
							<member>
								<name>username</name>
								<value><string>".self::$usernamme."</string></value>
							</member>
							<member>
								<name>hpassword</name>
								<value><string>".md5(self::$password)."</string></value>
							</member>
							<member>
								<name>ver</name>
								<value><int>1</int></value>
							</member>
							<member>
								<name>truncate</name>
								<value><int>0</int></value>
							</member>
							<member>
								<name>selecttype</name>							
								<value><string>lastn</string></value>
							</member>
							<member>
								<name>howmany</name>							
								<value><string>10</string></value>
							</member>
							<member>
								<name>noprops</name>
								<value><boolean>0</boolean></value>
							</member>
							<member>
								<name>lineendings</name>							
								<value><string>unix</string></value>
							</member>
						</struct>
					</value>
				</param>
			</params>
		</methodCall>";
		
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, self::$cmd_url);
		curl_setopt($ch, CURLOPT_USERAGENT, self::$user_agent);
		curl_setopt($ch, CURLOPT_HTTPHEADER, Array("Content-Type:text/xml"));
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $sync_command);
		$xmlData = curl_exec($ch);
		curl_close($ch);
		
		error_log($xmlData);
		
		//file_put_contents("resp.xml", $xmlData);
		return self::decodeEvents($xmlData);
		
		*/
	}
	
	// /////////////////////////////////////////////////////////////////////////////////


	public static function decodeEvents($xmlData){
	
		$root = new SimpleXMLElement($xmlData);	
		$dataRoot = self::findNode($root, 'events');		
				
		$eventList = array();
		
		if ($dataRoot->getName() == 'array'){

			$dataNode = $dataRoot->children();
			
			$event = array();
					
			foreach($dataNode[0]->children() as $valueNode){
				
				foreach($valueNode->children()->children() as $member){
					$node_data = self::getValues($member);		
					$event[$node_data['name']] = $node_data['value'];
				}
				
				$eventList[] = $event;
			}

			
		}
		
		return $eventList;	

	}
	
	// /////////////////////////////////////////////////////////////////////////////////
	//
	// Support Methods
	//
	// /////////////////////////////////////////////////////////////////////////////////
	
	private static function findNode($node, $paraname, $depth=0){

		//echo "parseNode($node, $paraname, $depth)<br>";
		
		if ($depth > 100) {
			echo "NOT FOUND, EXCEEDED DEPTH";
			return null;
		}
		 
		//echo "Depth: $depth Current Node Name: " . $node->getName() . "<br>";
		
		$data = $node->children();
			
		$localFound = false;
		$returnNode = false;
			
		foreach($data as $member){
		
			$name = $member->getName();
			//echo "Name: [$name] Type: [" . $member[0] . "] (looking for $paraname)<br>";
			
			if ($name == 'name' && $member[0] == $paraname){
				//echo "Found: $paraname Type: " . $member[0] . " <br>";					
				$localFound = true;
			}
			
			if ($name == 'value'){
				$memberData = $member->children();
				$returnNode = $memberData[0];
			}
			
	
		}
		
		if ($localFound && $returnNode){
			return $returnNode;
		}
		else {
			return self::findNode($node->children(), $paraname, $depth+1);
		}

	}

	// /////////////////////////////////////////////////////////////////////////////////

	private static function getValues($xmlNode){
	
		/*
			<member>
				<name>itemid</name>
				<value>
					<int>1093</int>
				</value>
			</member>
		*/
						
		// Get the 3 member types 
		
		foreach($xmlNode->children() as $temp){

			$name = $temp->getName();
			
			if ($name == 'name'){
				$fieldName = "".$temp[0];		
			}
			else {			
				$vals = $temp->children();									
				$value = "".$vals[0][0];
			}
		
		}			
		
		$data = array();
		$data['name'] = $fieldName;
		$data['value'] = $value;
		
		return $data;
	}
		
	// /////////////////////////////////////////////////////////////////////////////////

}
?>