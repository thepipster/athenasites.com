/**
 * @author mikep
 */

// ///////////////////////////////////////////////////////////////////

//code_url = window.location.href.substr(0, window.location.href.indexOf("/admin") ) + "/code/";
//base_url = window.location.href.substr(0, window.location.href.indexOf("/admin") );

// location object:
//<protocol>//<host>[:<port>]/<pathname>[<hash>][<search>]
var base_url = location.protocol + '//' + location.host + '/';
var code_url = base_url + 'code/';


/**
* This class contains all the globally required constants
*/
var defines = {
	flash_upload_processor:	code_url + "admin/php/FlashProcessUpload.php",
	upload_processor:		code_url + "admin/php/ProcessUpload.php",
	root_url: 				base_url,
	code_url: 				code_url
};
