var pandoraContactPage = {

	/** Width of flash gallery viewer */
	imgWidth : 1350,
	
	/** Height of flash gallery viewer */
	imgHeight : 800,

	/** Ratio of width to height */
	imgRatio : 0,

	/** Minimum allowed width */
	minWidth : 800,

	/** Maximum height, to avoid image scaling */	
	maxHeight : 800,
	
	commandURL : '',
	
	page_id : -1,
	
	nonce : '',
	
	sentMessage : 'Message sent, thankyou!',
	
	sentErrorMessage : 'Error sending message!',
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	init : function(options){

		pandoraContactPage.imgWidth = options.width;
		pandoraContactPage.imgHeight = options.height;
		pandoraContactPage.maxHeight = options.maxHeight;
		pandoraContactPage.minWidth = options.minWidth;
		
		pandoraContactPage.commandURL = options.commandURL;
		pandoraContactPage.page_id = options.pageID;
		pandoraContactPage.nonce = options.nonce;
		
						
		// Optimize size for gallery
		//pandoraContactPage.imgRatio = pandoraContactPage.imgHeight / pandoraContactPage.imgWidth;
		pandoraContactPage.imgRatio = pandoraContactPage.imgWidth / pandoraContactPage.imgHeight;
	
		pandoraContactPage.onResize();
		
		setTimeout("pandoraContactPage.onResize()", 200);
					
		// Set resize listener
		// TODO: Should append listener to any existing
		$(window).resize(pandoraContactPage.onResize);
		
		
			
		// Validation
		$("#contactForm").validate();
			
			
		$.validator.addMethod(
			"required_email", function(value, element) { 
			
		  		if (value == 'Your E-mail Address') return false; 
		  		if (value == '') return false; 
		  		
		  		// Check to see if this group is complete
		  		return pandoraContactPage.checkEmail(value);
			}, 
			"Enter a valid email");

		$.validator.addMethod(
			"required_name", function(value, element) { 
			
		  		if (value == 'Your Name') return false; 
		  		if (value == '') return false; 
		  		
		  		return true;
			}, 
			"Please enter your name");
	
					
		// Setup date picker...
		Date.firstDayOfWeek = 0;
		Date.format = 'mm/dd/yyyy';
		$('.datepicker').datePicker({clickInput:true, startDate:'01/01/2009'});								
	},
		
	// /////////////////////////////////////////////////////////////////////////////////
	
	checkEmail : function(email) {
		var filter = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
		if (!filter.test(email)) {
			return false;
		}
		return true;
	},
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	onChange : function(){
		$("#contactForm").valid();
	},
	
	// /////////////////////////////////////////////////////////////////////////////////
	
	onSubmit : function(){
								
		if ($("#contactForm").valid()){
			
			var aName = $("#name").val();
			var aEmail = $("#email").val();
			var aPhone = $("#phone").val();
			var aLocation = $("#location").val();
			var aDatetime = $("#datetime").val();
			var aComments = $("#comments").val();
			
			//alert(aName + " " + aEmail + " " + aPhone + " " + aLocation + " " + aDatetime + " " + aComments); 
			
			var paras = {page_id: pandoraContactPage.page_id, nonce: pandoraContactPage.nonce, name: aName, email: aEmail, phone: aPhone, location: aLocation, comments: aComments, datetime: aDatetime};
			
			jQuery.ajax({
				url: pandoraContactPage.commandURL,
				dataType: "text",
				data: paras,
				success: function(ret){pandoraContactPage.onSentForm(ret);}
			});	
		}		
		
		return false;
	},
		
	// /////////////////////////////////////////////////////////////////////////////////
		
	onSentForm : function(ret){
		
		if (ret == "TRUE"){
			$('.formMessage').html(pandoraContactPage.sentMessage);
		}
		else if (ret == "FALSE"){
			$('.formMessage').html(pandoraContactPage.sentErrorMessage);
		}
		else if (ret == "NA"){
			$('.formMessage').html("Not authorized error!");
		}
		else {
			$('.formMessage').html("Unknown error!");
		}
	},

	// /////////////////////////////////////////////////////////////////////////////////
	
	onResize : function(){

		var galH = $("#wrapper").height() - $("#nav_container").height();	
		if (galH > pandoraContactPage.maxHeight) galH = pandoraContactPage.maxHeight;						
		var galW = Math.floor(pandoraContactPage.imgRatio * galH);	
							
		if (galW > pandoraContactPage.minWidth){
		
			$("#nav_container").width(galW);	
			$("#container").width(galW);	
												
			$("#content").height(galH);
			$("#content").width(galW);
			
		}
		
	}

}