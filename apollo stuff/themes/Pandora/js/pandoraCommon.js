/**
* Common functionality for Pandora
*
* @since 17th May, 2010
* @author Mike Pritchard (mike@apollosites.com)
*/
var pandoraCommon = {

	onLoadList : -1,
		
	// ////////////////////////////////////////////////////////
		
	addOnLoadFunction : function(func){
		if (pandoraCommon.onLoadList == -1){
			pandoraCommon.onLoadList = new Array();
		}
		
		pandoraCommon.onLoadList.push(func);
	},

	// ////////////////////////////////////////////////////////

	doOnLoadFunctions : function(){
	
		for (var i=0; i<pandoraCommon.onLoadList.length; i++){
			eval(pandoraCommon.onLoadList[i]);
		}
		
	},
	
	// ////////////////////////////////////////////////////////
	
	navMouseOver : function(level, parentID, thisID){
		$('#'+thisID).addClass('sfhover'); // IE hover fix		
		//alert($('#'+parentID).css('left'))
		//alert(parentID);
		$('#'+parentID).css('left',-50);
	},

	// ////////////////////////////////////////////////////////

	navMouseOut : function(level, parentID, thisID){
		$('#'+thisID).removeClass('sfhover'); // IE hover fix	
	}
	
}
