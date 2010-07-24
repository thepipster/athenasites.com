/**
* Utiliy functions
*
* @since 30th March, 2010
*/
var ApolloUtils = {

	/**
	* Encode characters to html tags;
	* ' becomes &#039;
	* & becomes &amp;
	* " becomes &quot;
	* < becomes &lt;
	* > becomes &gt;
	*/
	htmlEncode : function(string) {
	    string = string.toString();	    
        string = string.replace(/&/g, '&amp;');	    
        string = string.replace(/'/g, '&#039;');
        string = string.replace(/"/g, '&quot;');
	    string = string.replace(/</g, '&lt;').replace(/>/g, '&gt;');		
		return string;	
	}

}