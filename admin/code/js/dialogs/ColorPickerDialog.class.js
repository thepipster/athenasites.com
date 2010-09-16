/**
* Javascript class that allows a user to pick an image from their wordpress media library
* @see http://www.eyecon.ro/ColorPickerDialog
*/
var ColorPickerDialog = {
			
    m_callback : '',
			
    m_targetDiv : '',
			
    // ////////////////////////////////////////////////////////////////////////////
	
    /**
	*
	*/
    show : function(targetDiv, currentCol, callback){
	
        ColorPickerDialog.m_targetDiv = targetDiv;
        ColorPickerDialog.m_callback = callback;
		
        var txt = "<div id='apolloSelectColor'></div>";
        //txt += "<button class='colorSelectButton' onclick=\"ColorPickerDialog.onSelectColor()\">OK</button>";
						
        ColorPickerDialog.col = currentCol;
        
        $(targetDiv).dialog('destroy');
        $(targetDiv).html(txt);
        
        //jQuery(targetDiv).ColorPicker({color: currentCol, flat: true, onSubmit: ColorPickerDialog.onSelectColor(), onChange: function(hsb, hex, rgb, el) {ColorPickerDialog.col = hex;}});

        
        $(targetDiv).dialog({
            modal: true,
            width:385,
            height:235,
            resizable:false,
            title: 'Pick a color'
            });

        $('#apolloSelectColor').ColorPicker({
            color: currentCol,
            flat: true,
            onSubmit: function(hsb, hex, rgb, el) {
                ColorPickerDialog.onSelectColor(hex);
            }
        });
        
    },

    // ////////////////////////////////////////////////////////////////////////////

    /**
    * Get the image list for the currently selected gallery page
    */
    onSelectColor : function(col){

        if (ColorPickerDialog.m_callback != ''){
            ColorPickerDialog.m_callback(col);
        }

        $(ColorPickerDialog.m_targetDiv).dialog('close');

    }
	
		
}