/**
* Utiliy functions
*
* @since 30th March, 2010
*/
var AthenaUtils = {

    /**
	* Encode characters to html tags;
	* ' becomes &#039;
	* & becomes &amp;
	* " becomes &quot;
	* < becomes &lt;
	* > becomes &gt;
	*/
    htmlEncode : function(string) {
        if (string == '' || string == undefined){
            return '';
        }
        string = string.toString();
        string = string.replace(/&/g, '&amp;');	    
        string = string.replace(/'/g, '&#039;');
        string = string.replace(/"/g, '&quot;');
        string = string.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return string;
    },

    /**
	* Decode content coing back from the DB
	*/
    decodeContent : function(string){
        if (string == '' || string == undefined){
            return '';
        }
        string = string.toString();
        string = string.replace(/\\/g, '');	    
        return string;
    },
	
    /**
	* Encode a post/page title, do nothing on client side for now
	*/
    encodeTitle : function(string){
        return string;
    },
	
    /**
	* Encode the page/post slug, do nothing on client side for now
	*/
    encodeSlug : function(title){
        return title;
    },


	/**
	* Format a number, and add commas
	*
	* @nStr Number to be formatted
	* @nDP Number of decimal places
	*/
	addCommas : function(nStr, nDP) {
		nStr = parseFloat(nStr).toFixed(nDP);
		nStr += '';
		x = nStr.split('.');
		x1 = x[0];
		x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2; //.toFixed(nDP);
	}    
}