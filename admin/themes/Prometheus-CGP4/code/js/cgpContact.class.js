var cgpContact = {

	// //////////////////////////////////////////////////////////////////////////////

	init : function(){
		
		Date.firstDayOfWeek = 7;
		Date.format = 'yyyy-mm-dd';
		$('.date-pick').datePicker({clickInput:true, createButton:false});
		
		cgpCommon.init('contact');
		
	}
		
}