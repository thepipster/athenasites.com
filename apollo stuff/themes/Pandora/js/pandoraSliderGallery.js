var pandoraSliderGallery = {
	
	// target div
	targetDiv : 'content',

	// /////////////////////////////////////////////////////////////////////////////////
	
	init : function(options){
	
		if (options.targetDiv != undefined){
			pandoraSliderGallery.targetDiv = options.targetDiv;
		}
		
		//pandoraSliderGallery.onResize();
								
		// Set resize listener
		// TODO: Should append listener to any existing
		$(window).resize(pandoraSliderGallery.onResize);
		
		setTimeout("pandoraSliderGallery.onResize()", 50);
   				
	},
					
	// /////////////////////////////////////////////////////////////////////////////////

	setup : false,
	
	onResize : function(){
		
		$('#coda-slider-1').codaSlider
		var w = $('#content').width();
		//w = 400;
		
		$('.coda-slider').width(w);
		$('.coda-slider .panel').width(w);
		$('.coda-slider-wrapper.arrows .coda-slider').width(w);
		$('.coda-slider-wrapper.arrows .coda-slider .panel').width(w);

		var h = $('#content').height();
		
		$('.coda-slider').height(h);
		$('.coda-slider .panel').height(h);
		$('.coda-slider-wrapper.arrows .coda-slider').height(h);
		$('.coda-slider-wrapper.arrows .coda-slider .panel').height(h);
		
		// see http://www.ndoherty.biz/demos/coda-slider/2.0/#3
		// Setup codaSlider plugin
	
		if (pandoraSliderGallery.setup){
			//$('#coda-slider-1').codaSlider('destroy');
		}
		else {
			pandoraSliderGallery.setup = true;			
		}
		
		$('img').height(h);
		$('img').css('width','auto');

		
		
		$('#coda-slider-1').codaSlider({
		   dynamicArrows: false,
		   dynamicTabs: false,
		   autoSlide: true,
		   autoSlideInterval: 4000,
		   autoSlideStopWhenClicked: true
		});
		
	}	
}
