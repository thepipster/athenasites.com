<?php

$usernamme = 'charlottegeary';
$password = 'r00bies';
$password_hash = md5($password);

$cmd_url = "www.livejournal.com";
$user_agent = "XMLRPC Client 1.0";

$cmd_url = "www.livejournal.com/interface/xmlrpc HTTP/1.0";
$time = "2009-06-07 12:00:00";

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
						<value><string>$usernamme</string></value>
					</member>
					<member>
						<name>hpassword</name>
						<value><string>$password_hash</string></value>
					</member>
					<member>
						<name>ver</name>
						<value><int>1</int></value>
					</member>
					<member>
						<name>lastsync</name>
						<value><string>$time</string></value>
					</member>
				</struct>
			</value>
		</param>
	</params>
</methodCall>";


$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $cmd_url);
curl_setopt($ch, CURLOPT_USERAGENT, $user_agent);
curl_setopt($ch, CURLOPT_HTTPHEADER, Array("Content-Type:text/xml"));
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $sync_command);
$xmlData = curl_exec($ch);
curl_close($ch);


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
		echo "Count: $count <br>";
	}
	else if ($paraName == 'total'){
		$total = $val[0][0];
		echo "Total: $total <br>";
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
						$fieldName = $fields[0];
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
				
				switch($fieldName){
					case 'action' : $tempLJField['action'] = $value; break;
					case 'item' : $tempLJField['item'] = $value; break;
					case 'time' : $tempLJField['time'] = $value; break;
				}
			
				$i++;					
			}
			
			$ljItemList[] = $tempLJField;	
		}
	}
	
}

echo "<pre>" . print_r($ljItemList, true) . "</pre>";

/*
HTTP/1.1 200 OK
Connection: close
Content-length: 3360
Content-Type: text/xml
Date: Tue, 16 Jul 2002 22:39:30 GMT
Server: Apache/1.3.4 (Unix)
*/
/*
<?xml version="1.0"?>
<methodResponse>
<params>
	<param>
		<value>
			<struct>
				<member>
					<name>total</name>
					<value><int>11</int></value>
				</member>
				<member>
					<name>count</name>
					<value><int>11</int></value>
				</member>
				
				<member item='L-1947' time='2002-07-13 00:06:26' action='del'>


					<name>syncitems</name>
					<value>
						<array>
							<data>
								<value>
									<struct>
										<member>
											<name>item</name>
											<value><string>L-1947</string></value>
										</member>
										<member>
											<name>time</name>
											<value><string>2002-07-13 00:06:26</string></value>
										</member>
										<member>
											<name>action</name>
											<value><string>del</string></value>
										</member>
									</struct>
								</value>
								<value>
									<struct>
										<member>
											<name>item</name>
											<value><string>L-1954</string></value>
										</member>
										<member>
											<name>time</name>
											<value><string>2002-07-13 00:09:05</string></value>
										</member>
										<member>
											<name>action</name>
											<value><string>del</string></value>
										</member>
									</struct>
								</value>
							</data>
						</array>
					</value>
				</member>
			</struct>
		</value>
	</param>
</params>
</methodResponse>
*/
?>