/**
 * @author mikep
 */

// ///////////////////////////////////////////////////////////////////

//code_url = window.location.href.substr(0, window.location.href.indexOf("/admin") ) + "/code/";
//base_url = window.location.href.substr(0, window.location.href.indexOf("/admin") );

// location object:
//<protocol>//<host>[:<port>]/<pathname>[<hash>][<search>]
var base_url = location.protocol + '//' + location.host + "/";
var admin_base_url = location.protocol + '//' + location.host + '/admin/';
var code_url = admin_base_url + 'code/';

/**
* This class contains all the globally required constants
*/
var defines = {
	flash_upload_processor:	code_url + "php/FlashProcessUpload.php",
	upload_processor:		code_url + "php/ProcessUpload.php",
	root_url: 				admin_base_url,
	code_url: 				code_url,
//	user_files_root_url: 	base_url + "user_files/",
	user_files_root_url: 	"http://files.apollosites.com/",
	domain:                 "athenasites.com",
	max_hdd:				500 // MB
};
