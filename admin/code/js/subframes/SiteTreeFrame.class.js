/**
*
* This frame paints an interactive tree that represents a page tree for a given
* user.
*
* @author Mike Pritchard (mikep76@gmail.com)
* @since July 20th, 2008
*
*/	
var SiteTreeFrame = {

	/** This frame's content div */
	m_contentDiv: 'SiteTreeFrame_content',
	
	/** Function to be called when a file/image is selected */
	m_pageSelectCallback : '',

	/** Reference to DataTree structure holding file data */
	m_dataTree : '',

	/** URL for tree node image (representing a web pag) */
	m_sitePageImgURL: defines.icon_url + '/FileTreeIcons/web_page.png',	

	m_closedURL: defines.icon_url + '/FileTreeIcons/collapsed.png',
	m_openURL: defines.icon_url + '/FileTreeIcons/expanded.png',

	m_folderImgURL: defines.icon_url + '/FileTreeIcons/mac_dir.png',
	
	/** If set to true, show the root node */
	m_showRoot : false,

	// ////////////////////////////////////////////////////////////////////////////////

	/**
	 * Create the SiteTreeFrame
	 * @param {string} targetDiv div for the div section that will contain this widget
	 * @param {string} pageSelectCallback
	 */
	paint : function(targetDiv, pageSelectCallback) {

		SiteTreeFrame.m_pageSelectCallback = pageSelectCallback;
				
		FrameHelper.drawFrame(targetDiv, SiteTreeFrame.m_contentDiv, "Page Tree", {overflow: 'auto'});

		// Create data tree instance
		SiteTreeFrame.m_dataTree = DataManager.m_pageTree;

		// Add buttons
		FrameHelper.addButton(SiteTreeFrame.m_contentDiv, "create_page_button", "Add Page", "SiteTreeFrame.onAddPage()");
		FrameHelper.addButton(SiteTreeFrame.m_contentDiv, "save_order_button", "Save", "SiteTreeFrame.onOrderChanged()");

		// Create page select light box...
		PageSelectLightBox.paint(DataManager.m_pageTree);						

		$(SiteTreeFrame.m_contentDiv).style.overflowY = 'auto';
		$(SiteTreeFrame.m_contentDiv).style.overflowX = 'hidden';

		var text = "";
		text += "<div id='SiteTreeList'></div>\n";

		$(SiteTreeFrame.m_contentDiv).innerHTML = text;
		
		// Make background droppable, counting as a move folder to root...
		//Droppables.add(SiteTreeFrame.m_contentDiv, {onDrop: SiteTreeFrame.onFileDroppedOnFolder});

		// Populate tree...
		SiteTreeFrame.refreshTree();
		
	},	

	
	// /////////////////////////////////////////////////////////////////////////////////////

	onAddPage : function(){ 
		PageSelectLightBox.show(SiteTreeFrame.onPageSelected);
	},
	
	onPageSelected : function(page_id, page_name){
		DataManager.addPage(page_id, page_name);
		SiteTreeFrame.refreshTree();		
//		alert(page_id + " " + page_name);
	},

	// /////////////////////////////////////////////////////////////////////////////////////

	trace : function(msg) {
		FrameHelper.clearFlash(SiteTreeFrame.m_contentDiv);
		FrameHelper.flash(SiteTreeFrame.m_contentDiv, 'success', msg);
	},
			
	// /////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Repaint tree
	 */		
	refreshTree : function(reloadData){
		
		if (reloadData && reloadData == true) {
			DataManager.reloadPageData();
		}

		// Get instance of data object		
		SiteTreeFrame.m_dataTree = DataManager.m_pageTree;
				
		// Paint all the nodes....		
		SiteTreeFrame.paintAllNodes(SiteTreeFrame.m_dataTree.m_rootNode, 1);

				
//			Sortable.create(name, {
//				dropOnEmpty: true,
//				containment: lists,
//				constraint: false,
//				only: 'sortable',
//				onUpdate: SortableLists.updated
//			});			
				
		
	},
	
	// /////////////////////////////////////////////////////////////////////////////////////

	onOrderChanged : function(){

//alert('order changed');

		var order = Sortable.serialize("node_0_contents", {tag:'div', name:'node_id'});
		//alert(order);
		
		//for (var i = 0; i < order.length; i++) {
		//}

		// Get the current list order....		
		//var list = Sortable.sequence("node_0_contents");
		//alert(list);


	/*
		// Get the current order, this will return an array with key = 'img_id'
		var order = Sortable.serialize(GalleryFrame.m_contentDiv, {name:'img_id'});
		//alert(order);
		
		// Get the current list order....		
		var list = Sortable.sequence(GalleryFrame.m_contentDiv);

		// Figure out which elements have been swapped
		swapIndex = ArrayUtils.findSwapped(list, GalleryFrame.m_thumb_id_list);
			
		// Get values	
		id0 = GalleryFrame.m_thumb_id_list[swapIndex[0]];
		id1 = GalleryFrame.m_thumb_id_list[swapIndex[1]];	
		url0 = GalleryFrame.m_thumb_url_list[swapIndex[0]];
		url1 = GalleryFrame.m_thumb_url_list[swapIndex[1]];
			
		// Swap local copies	
		GalleryFrame.m_thumb_url_list[swapIndex[0]]	= url1;
		GalleryFrame.m_thumb_url_list[swapIndex[1]]	= url0;
		GalleryFrame.m_thumb_id_list[swapIndex[0]]	= id1;
		GalleryFrame.m_thumb_id_list[swapIndex[1]]	= id0;

		DataManager.swapGalleryImages(swapIndex[0], swapIndex[1], GalleryFrame.m_currentGalleryID);
	*/
		
	},

	// /////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Recurse through node list, an paint all the nodes
	 * @param {Object} node
	 */
	paintAllNodes : function(node, isOpen) {

		// Paint this node		
		SiteTreeFrame.paintNode(node);
		
		if (node.children.length == 0) return;
		
		// Paint all its children (if the node is open)
		for (var i = 0; i < node.children.length; i++) {
			var temp_node = node.children[i];
			SiteTreeFrame.paintAllNodes(temp_node);
		}

		// Make root node sortable
		Sortable.create('node_0_contents', {
			tag: 'li',
			overlap: 'vertical',
			constraint: false,
			//onChange: SiteTreeFrame.onOrderChanged
			onUpdate : SiteTreeFrame.onOrderChanged
		});
		
		// Make page-group contents sortable
		for (var i = 0; i < node.children.length; i++) {

			var temp_node = node.children[i];

			if (SiteTreeFrame.isDir(temp_node)) {

				var node_id = "node_" + node.id + "_contents";

				Sortable.create(node_id, {
					tag: 'li',
					overlap: 'vertical',
					constraint: false,
					//onChange: SiteTreeFrame.onOrderChanged
					onUpdate : SiteTreeFrame.onOrderChanged
				});

			}
		}

	},

	// /////////////////////////////////////////////////////////////////////////////////////

	
	paintNode : function(node){


		//var x = node.depth * SiteTreeFrame.m_nodeOffset;
		var text = "";
					
		var node_id = "node_" + node.id;
		var span_id = "span_" + node.id;
		var nimg_id = "nimg_" + node.id;
		var oimg_id = "oimg_" + node.id;

		if (SiteTreeFrame.isDir(node)){

//			var imgURL = SiteTreeFrame.m_folderImgURL;
			var imgURL = SiteTreeFrame.m_sitePageImgURL;											
			var nodeOnClick = "SiteTreeFrame.onToggleNode('"+node.id+"')";
			var folderOnClick = "SiteTreeFrame.onSelectPage('"+node.id+"')";

			if (node.isOpen == 0) {
				var contents_style = "visibility:hidden; list-style: none; ";
				var nodeImgURL = SiteTreeFrame.m_closedURL;
			}
			else {
				var contents_style = 'list-style: none; ';
				var nodeImgURL = SiteTreeFrame.m_openURL;
			}

			text += "<div id='"+node_id+"'> \n";
			
			text += "   <span id='"+span_id+"' class='FileTreeFrame_Folder' onclick=\""+folderOnClick+"\">";
			text += "      <span style='position:relative; left:0px; top:5px; padding-right:0px' onclick=\""+nodeOnClick+"\"><img id='"+oimg_id+"' src='"+nodeImgURL+"'/></span>";
			text += "      <span style='position:relative; left:5px; top:10px; padding-right:5px'><img id='"+nimg_id+"' src='"+imgURL+"'/></span>";
//			text +=        node.name + " [" + node.id + ", " + node.depth + "]\n";
			text += "      <span style='position:relative; left:0px; top:5px; padding-right:5px'>" + node.name + "</span>";;
			text += "   </span>";		

			text += "   <ul id='"+node_id+"_contents' style='"+contents_style+"'> \n";
			text += "   </ul>";	
				
			text += "</div> \n";
		}
		else {

			var imgURL = SiteTreeFrame.m_sitePageImgURL;											
			var nodeOnClick = "SiteTreeFrame.onSelectPage(this)";		
//			var nodeOnClick = "";		
			
			text += "<li class='FileTreeFrame_File' id='"+node_id+"' onclick='"+nodeOnClick+"' style='cursor:pointer;'> \n";
			text += "   <span id='"+span_id+"' class='FileTreeFrame_Folder' onclick=\""+nodeOnClick+"\">";
			text += "      <span style='position:relative; left:0px; top:5px; padding-right:5px'><img id='"+nimg_id+"' src='"+imgURL+"'/></span>";
			text +=        node.name + " [" + node.id + ", " + node.depth + "]\n";
//			text +=        node.name;
			text += "   </span>";		
			text += "</li> \n";	
		}
		
		
		// Add to tree....
		if (node.parent_id == -1){
			if (!SiteTreeFrame.m_showRoot) {
				$('SiteTreeList').innerHTML = text;
				$(span_id).style.visibility = 'hidden';
			}
			else {
				$('SiteTreeList').innerHTML = "<br>";
				$('SiteTreeList').innerHTML += text;	
			}
		}
		else {
			
			if ($("node_" + node.parent_id + "_contents")) {
				$("node_" + node.parent_id + "_contents").innerHTML += text;
			}
			else {
				alert('SiteTreeFrame.paintNode - ERROR');
			}
		}	

	},	
	
	
	// /////////////////////////////////////////////////////////////////////////////////////

	onToggleNode : function(id){
		
		var node = SiteTreeFrame.m_dataTree.getNodeFromID(id);

		var node_id = "node_" + id;
		var contents_id = node_id + "_contents";	
		var img_id = "oimg_"+id;

		if (node.isOpen == 0) {
			node.isOpen = 1;
			$(node_id).style.height = 'auto';
			$(contents_id).style.visibility = '';
			$(img_id).src = SiteTreeFrame.m_closedURL;
		}
		else {
			node.isOpen = 0;
			$(node_id).style.height = SiteTreeFrame.m_nodeMinHeight + 'px';
			$(contents_id).style.visibility = 'hidden';
			$(img_id).src = SiteTreeFrame.m_openURL;
		}
		
		//SiteTreeFrame.refreshTree();
		
		// Use callback, if set...
		if (SiteTreeFrame.m_dirSelectCallback != '' ) {
			SiteTreeFrame.m_selectedFolderID = id;			
			SiteTreeFrame.m_dirSelectCallback(id);
		}
		
	},
	
	// /////////////////////////////////////////////////////////////////////////////////////
	
	/**
	* This is called when a user selects a file
	*/
	onSelectPage : function(obj){

		if (SiteTreeFrame.m_lockFileSelect) return;
		
		idStr = obj.id;
		id = parseInt(idStr.substring(5,idStr.length));	
		
		// If id = 0 then this is the root node, so we ignore
		if (id != 0 && SiteTreeFrame.m_pageSelectCallback != '') {
			SiteTreeFrame.m_pageSelectCallback(id);
		}
		
	},
		
	// ////////////////////////////////////////////////////////////////////////////////
	
	onFileDroppedOnFolder : function(element, droppableElement){

		// Refresh the tree
		SiteTreeFrame.refreshTree();		
	},
	
	// /////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Returns true if the give node is a folder
	 * @param {Object} node
	 */
	isDir : function(node){

		if (node.children.length > 0) {
			return true;
		}
		
		return false;
	},
	
	// /////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Extract the node id for the given div
	 * @param {Object} div_id
	 */
	extractNodeID : function(div_id){
		return parseInt(div_id.substring(5,div_id.length));
	}

	// /////////////////////////////////////////////////////////////////////////////////////
	
}

