/* 
 * Pages Page functionality
 *
 * @author Mike Pritchard (mike@apollosites.com)
 * @since 3rd January, 2011
 */
var Pages = {

    // ////////////////////////////////////////////////////////////////////////

    init : function(siteID){
                
        $('#PagesFrame').show();
                
        // Setup the data store for the site
        DataStore.init(siteID);

        // Setup classes...
        PagesFrame.init();

        // Paint the custom wyswig editors
        Pages.paintOpenWYSIWYG();

        // Start loading data
        DataStore.load(Pages.onDataLoaded);
                
    },

    // ////////////////////////////////////////////////////////////////////////

	/**
	* Force a refresh by reloading all the data and then repaint
	*/    
    refresh : function() {
        DataStore.load(Pages.onDataLoaded);
    },
    
    // ////////////////////////////////////////////////////////////////////////

    onDataLoaded : function(){    
        PagesFrame.repaint();
        SidebarFrame.repaint();
    },
	
    // ////////////////////////////////////////////////////////////////////////
    
    paintOpenWYSIWYG : function(){

		// Paint the InnovaStudio editor...
		
        var ht = $('.ViewFrame').height() - 40;

        var groupsObj = [
            ["grpPage", "Page & View", ["FullScreen", "XHTMLSource", "Search", "BRK", "Undo", "Redo", "SpellCheck", "RemoveFormat"]],
            ["grpFont", "Font",
                ["FontName", "FontSize", "Strikethrough", "Superscript", "Subscript", "BRK",
                    "Bold", "Italic", "Underline", "ForeColor", "BackColor"
                ]
            ],
            ["grpStyles", "Styles", ["Table", "Guidelines", "BRK",  "StyleAndFormatting", "Styles"]], //"Absolute"
            ["grpPara", "Paragraph",
                ["Paragraph", "Indent", "Outdent", "LTR", "RTL", "BRK", "JustifyLeft",
                    "JustifyCenter", "JustifyRight","JustifyFull", "Numbering", "Bullets"
                ]
            ],
            ["grpObjects", "Objects", ["Image", "InsertInternalImage", "Flash", "Media", "BRK", "Hyperlink", "Characters", "Line",  "ApolloPageBreak"]]
        ];

		// apolloContentEditor
        oUtil.initializeEditor("#pageContentEditor", {
            width:"100%",
            height:ht+"px",
//            height:"100%",
            btnSpellCheck:true,
            useTagSelector:false,
            toolbarMode: 2,
            mode:"XHTML",
            useBR:true, // Force to use <br> for line breaks by default
            arrCustomButtons: [
                ["InsertInternalImage","ImagePickerDialog.show('#apollo_image_picker', Pages.onInsertImage)","Insert an image from your media library", "btnInternalImage.gif"],
                ["ApolloPageBreak","Pages.onInsertPageBreak()","Insert a more link into your blog post", "btnApolloPageBreak.png"]],
            //features:featuresObj,
            //css: DataStore.m_theme.cms_blog_css
            groups: groupsObj
        });

 		setInterval(Pages.setEditorChangeListener, 500);

    },
	
	m_contentChangedTO : '',
	m_prevContent : '',
	
	/**
	* Called whenever is key is pressed in the content editor. We want to wait until the user has stopped
	* typing before we submit changes
	*/
	setEditorChangeListener : function(){
								
		// Get content
		var content = oUtil.obj.getXHTMLBody();

		if (Pages.m_prevContent == '') {
			Pages.m_prevContent = content;
		}
		
		// If its changed, save it
		if (content != Pages.m_prevContent){
	    	PagesFrame.onChange(); 								
		}		
				
    	Pages.m_prevContent = content;    	
	},	

    // ////////////////////////////////////////////////////////////////////////

    onInsertImage : function(imageID){
        var img = DataStore.getImage(imageID);
        var txt = "<img src='"+img.file_url+"' alt='"+img.description+"' width='"+img.width+"px' height='"+img.height+"px'/>";
        oUtil.obj.insertHTML(txt);
    },

    // ////////////////////////////////////////////////////////////////////////

    /**
     * Insert a custom apollo page break
     */
    onInsertPageBreak : function(){

		if (Pages.view != Pages.VIEW_Pages) return;
		
        // Has the user already got a apollo page break in this page?
        var content = oUtil.obj.getXHTMLBody();
        var myRegExp = /apolloPageBreak/;
        var pos = content.search(myRegExp);

        if (pos > 0){
            AthenaDialog.alert("Sorry, you already have a break in this post and you can only have one, you'll need to delete the old one before you can add one here!", "Can't add more than 1 break");
            return;
        }

        var txt = "<div class='apolloPageBreak'>More...</div> ";
        oUtil.obj.insertHTML(txt);
    }

    
}