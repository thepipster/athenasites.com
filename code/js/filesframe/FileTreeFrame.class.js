/**
*
* This frame paints an interactive tree that represents a file system for a given
* user.
*
* @author Mike Pritchard (mikep76@gmail.com)
* @since 24th February, 2007
*
*/	
var FileTreeFrame = {

	/** Div to containt this frame */
	//m_targetDiv: "FileTreeFrame",	

	/** This frame's content div */
	m_contentDiv: 'filetreeframe_content',
	
	/** Function to be called when a file/image is selected */
	m_fileSelectCallback : '',

	/** Function to be called when a directory/folder is selected */
	m_dirSelectCallback : '',
	
	/** Currently selected folder */
	m_selectedFolderID : -999,

	/** Currently selected file */
	m_selectedFile : 0,
	
	/** Rename file flag, used by update_handler */
	m_renameFile : false,

	/** Reference to DataTree structure holding file data */
	m_dataTree : '',
	
	/** Currently selected folder id */
	m_selectedFolderID : -1,
	
	/** If set to true, show the root node */
	m_showRoot : false,
	
	/** If this is set to true, then this is set to display a site page structure */
	m_isPageTree : false,
	
	m_closedURL: 'images/FileTreeIcons/collapsed.png',
	m_openURL: 'images/FileTreeIcons/expanded.png',

	m_folderImgURL: 'images/FileTreeIcons/mac_dir.png',
	m_fileImgURL: 'images/FileTreeIcons/mac_file.png',
	m_zipImgURL: 'images/FileTreeIcons/zip_file.png',
	m_phpImgURL: 'images/FileTreeIcons/php_file.png',
	m_jsImgURL: 'images/FileTreeIcons/js_file.png',
	m_htmlImgURL: 'images/FileTreeIcons/html_file.png',
	m_pdfImgURL: 'images/FileTreeIcons/pdf_file.png',
	m_imgImgURL: 'images/FileTreeIcons/img_file.png',
	m_xmlImgURL: 'images/FileTreeIcons/xml_file.png',
	m_musicImgURL: 'images/FileTreeIcons/music_file.png',
	m_sysImgURL: 'images/FileTreeIcons/sys_file.png',
	m_wordImgURL: 'images/FileTreeIcons/word_file.png',
	m_excelImgURL: 'images/FileTreeIcons/excel_file.png',
	m_cssImgURL: 'images/FileTreeIcons/css_file.png',

	// TODO!!!!!!!!!!!!!!!!1
	m_sqlImgURL: 'images/FileTreeIcons/sys_file.png',	

	m_sitePageImgURL: 'images/FileTreeIcons/web_page.png',	

	// ////////////////////////////////////////////////////////////////////////////////

	/**
	 * Create the FileTreeFrame
	 * @param {string} targetDiv div for the div section that will contain this widget
	 * @param {string} dirSelectCallback
	 * @param {string} fileSelectCallback
	 * @param {boolean} (optional) isPageTree If set to true, shows site page structure instead
	 */
	paint : function(targetDiv, dirSelectCallback, fileSelectCallback, isPageTree) {
			 
		FileTreeFrame.m_dirSelectCallback = dirSelectCallback;
		FileTreeFrame.m_fileSelectCallback = fileSelectCallback;
		if (isPageTree) 
			FileTreeFrame.m_isPageTree = isPageTree;
		else
			FileTreeFrame.m_isPageTree = false;
		
		FrameHelper.drawFrame(targetDiv, FileTreeFrame.m_contentDiv, "File System", {overflow: 'auto'});

		// Create data tree instance
		if (FileTreeFrame.m_isPageTree) {
			//alert('page viewer');
			FileTreeFrame.m_dataTree = DataManager.m_pageTree;
			FrameHelper.addButton(FileTreeFrame.m_contentDiv, "create_page_button", "Add Page", "FileTreeFrame.onAddPage()");
			FrameHelper.addButton(FileTreeFrame.m_contentDiv, "save_order_button", "Save", "FileTreeFrame.onOrderChanged()");

			// Create page select light box...
			PageSelectLightBox.paint(DataManager.m_pageTree);
		}
		else {
			//alert('file viewer');
			FileTreeFrame.m_dataTree = DataManager.m_fileDataTree;
			FrameHelper.addButton(FileTreeFrame.m_contentDiv, "test_button_id", "Create Folder", "FileTreeFrame.onCreateFolder()");

			CreateFolderLightBox.paint("Select Folder");
		}
						

		$(FileTreeFrame.m_contentDiv).style.overflowY = 'auto';
		$(FileTreeFrame.m_contentDiv).style.overflowX = 'hidden';

		var text = "";
		text += "<div id='DirTreeList'></div>\n";
		text += "<div id='DirTree_ContextMenuDiv' class='ContextMenuDiv' onMouseOut='FileTreeFrame.onCloseContextMenu()'>";
		text += "<ul id='DirTree_ContextMenu'>";
		text += "	<li><a href='#' onClick='FileTreeFrame.onDeleteFile()'>Delete</a></li>";
//		text += "	<li><a href='#' onClick='FileTreeFrame.onNewFile()'>New File</a></li>";
		text += "	<li><a href='#' onClick='FileTreeFrame.onNewDir()'>New Dir</a></li>";
		text += "	<li><a href='#' onClick='FileTreeFrame.onRenameFile()'>Rename</a></li>";
		text += "</ul>";
		text += "</div>";
		$(FileTreeFrame.m_contentDiv).innerHTML = text;
		
		// Make background droppable, counting as a move folder to root...
		Droppables.add(FileTreeFrame.m_contentDiv, {onDrop: FileTreeFrame.onFileDroppedOnFolder});

		// Populate tree...
		FileTreeFrame.refreshTree();
		
	},	

	
	// /////////////////////////////////////////////////////////////////////////////////////

	onAddPage : function(){ 
		PageSelectLightBox.show(FileTreeFrame.onPageSelected);
	},
	
	onPageSelected : function(page_id, page_name){
		DataManager.addPage(page_id, page_name);
		FileTreeFrame.refreshTree();		
//		alert(page_id + " " + page_name);
	},

	// /////////////////////////////////////////////////////////////////////////////////////

	onCreateFolder : function() {
		CreateFolderLightBox.show(FileTreeFrame.onGotFolderName);
	},

	onGotFolderName : function(folder_name){
		ImageCommandsInterface.createFolder(folder_name, FileTreeFrame.onFolderCreated, true);
	},
	
	/**
	 * Ajax response; folder_name, folder_id
	 * @param {Object} resp
	 */
	onFolderCreated : function(resp){
		//alert(resp.folder_id)
		DataManager.addFolder(resp.folder_name);
		FileTreeFrame.refreshTree();
	},

	// /////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Returns true if the give node is a folder
	 * @param {Object} node
	 */
	isDir : function(node){

		if (FileTreeFrame.m_isPageTree) {
			if (node.children.length > 0) {
				return true;
			}
		}
		else {
			if (node.type == 'dir' || node.type == 'sysdir') {
				return true;
			}
		}
		
		return false;
	},

	// /////////////////////////////////////////////////////////////////////////////////////

	trace : function(msg) {
		FrameHelper.clearFlash(FileTreeFrame.m_contentDiv);
		FrameHelper.flash(FileTreeFrame.m_contentDiv, 'success', msg, true, 5000);
	},
			
	// /////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Repaint tree
	 */		
	refreshTree : function(){
		
		
		if (FileTreeFrame.m_isPageTree) {
			//alert('page tree');
			FileTreeFrame.m_dataTree = DataManager.m_pageTree;
		}
		else {
			//alert('file tree');
			FileTreeFrame.m_dataTree = DataManager.m_fileDataTree;
		}
				
		// Paint all the nodes....		
		FileTreeFrame.paintAllNodes(FileTreeFrame.m_dataTree.m_rootNode, 1);


		if (FileTreeFrame.m_dataTree.m_flatNodeList.length == 0) {
			return;
		}
		
		// For the page tree, make the pages under root sortable

		if (FileTreeFrame.m_isPageTree) {
				//		alert('refresh');
			Sortable.create('node_0_contents', {
				tag: 'div',
				overlap: 'vertical',
				constraint: false,
				onChange: FileTreeFrame.onOrderChanged
				//onUpdate : FileTreeFrame.onOrderChanged
			});
			
//			Sortable.create(name, {
//				dropOnEmpty: true,
//				containment: lists,
//				constraint: false,
//				only: 'sortable',
//				onUpdate: SortableLists.updated
//			});			
			
		}

		//alert($("node_0_contents").innerHTML);
		
		// Make nodes draggable or sortable.....
		
		for (var i = 0; i < FileTreeFrame.m_dataTree.m_flatNodeList.length; i++) {

			var node = FileTreeFrame.m_dataTree.m_flatNodeList[i];
		
			if (FileTreeFrame.m_isPageTree) {
				if ( FileTreeFrame.isDir(node) ){ 
/*
					var div_id = "node_" + node.id + "_contents";

					Sortable.create(div_id, {
//							tag:'node_',
							overlap:'vertical',
							constraint: false, 
							onUpdate:FileTreeFrame.onOrderChanged
					   	});		
	*/				   	
				}
			}
			else {
				var div_id = "node_" + node.id;
				new Draggable(div_id, {revert:true});				
				
				// Setup right click menue
				//$(div_id).oncontextmenu = FileTreeFrame.onContextMenu;
							
				// Make folders droppable
				if (node.type == 'dir' || node.type == 'sysdir') {
					Droppables.add(div_id, {onDrop: FileTreeFrame.onFileDroppedOnFolder});
				}
			}


		}	
		
	},
	
	// /////////////////////////////////////////////////////////////////////////////////////

	onOrderChanged : function(){

		var list = Sortable.sequence("node_0_contents");

//		FileTreeFrame.trace(list);

		var text = "";

		for (var i = 0; i < list.length; i++) {
			text += "["+i+"] = " + list[i];
		}

		FileTreeFrame.trace(text);
		
		
		
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
		FileTreeFrame.paintNode(node);
		
		// Paint all its children (if the node is open)
		for (var i = 0; i < node.children.length; i++) {
			var temp_node = node.children[i];
			FileTreeFrame.paintAllNodes(temp_node);
		}
	},

	// /////////////////////////////////////////////////////////////////////////////////////

	m_nodeOffset : 10,
	m_nodeMinHeight : 20,
	
	paintNode : function(node){

		//alert("Painting node id: " + node.id + " depth: " + node.depth + " name: " + node.name);
		
		var x = node.depth * FileTreeFrame.m_nodeOffset;
		var y = 0;
		var text = "";
			text += "\n\n";		
		
		var node_id = "node_" + node.id;
		var span_id = "span_" + node.id;
		var nimg_id = "nimg_" + node.id;
		var oimg_id = "oimg_" + node.id;

		if (FileTreeFrame.isDir(node)){

			var imgURL = FileTreeFrame.m_folderImgURL;
			var nodeOnClick = "FileTreeFrame.onToggleNode('"+node.id+"')";
			var folderOnClick = "FileTreeFrame.onSelectFolder('"+node.id+"')";

			if (node.isOpen == 0) {
				var contents_style = "visibility:hidden; border-width: 1px; border-color: red;";
				var nodeImgURL = FileTreeFrame.m_closedURL;
			}
			else {
				var contents_style = 'border-width: 1px; border-color: red;';
				var nodeImgURL = FileTreeFrame.m_openURL;
			}

			text += "<div id='"+node_id+"' style='position:relative; height: auto; left:"+x+"px; top:"+y+"px;'> \n";
			text += "   <span id='"+span_id+"' class='FileTreeFrame_Folder' onclick=\""+folderOnClick+"\">";
			text += "      <span style='position:relative; left:0px; top:5px; padding-right:0px' onclick=\""+nodeOnClick+"\"><img id='"+oimg_id+"' src='"+nodeImgURL+"'/></span>";
			text += "      <span style='position:relative; left:0px; top:5px; padding-right:5px'><img id='"+nimg_id+"' src='"+imgURL+"'/></span>";
			text +=        node.name;
			text += "   </span>";		
			text += "   <div id='"+node_id+"_contents' style='"+contents_style+"'> \n";
			text += "   </div>";		
			text += "</div> \n";
		}
		else {

			var imgURL = FileTreeFrame.getFileImg(node.ext);											
			var nodeOnClick = "FileTreeFrame.onSelectFile(this)";		
			
			x += 3 * FileTreeFrame.m_nodeOffset;

			text += "<div class='FileTreeFrame_File' id='"+node_id+"' onclick='"+nodeOnClick+"' style='position:relative; left:"+x+"px; top:"+y+"px; cursor:pointer;'> \n";
			text += "   <span id='"+span_id+"' >";
			text += "      <span style='position:relative; left:0px; top:5px; padding-right:5px'><img id='"+nimg_id+"' src='"+imgURL+"'/></span>";
			text +=        node.name;
			text += "   </span>";		
			text += "</div> \n";	
		}
		
		// Add to tree....
		if (node.parent_id == -1){
			$('DirTreeList').innerHTML = text;	
			if (!FileTreeFrame.m_showRoot) {
				$(span_id).style.visibility = 'hidden';	
			}
		}
		else {
			
			if ($("node_" + node.parent_id + "_contents")) {
				$("node_" + node.parent_id + "_contents").innerHTML += text;
			}
			else {
				alert('FileTreeFrame.paintNode - ERROR');
			}
		}	

	},	
	
	
	// /////////////////////////////////////////////////////////////////////////////////////

	/**
	 * This is used to fire the folder selected callback, without toggling the node state
	 * (open or closing it)
	 * @param {Object} id
	 */
	onSelectFolder : function(id){
		// Use callback, if set...
		if (FileTreeFrame.m_dirSelectCallback != '' ) {
			FileTreeFrame.m_selectedFolderID = id;			
			FileTreeFrame.m_dirSelectCallback(id);
		}
	},

	// /////////////////////////////////////////////////////////////////////////////////////

	/**
	 * This opens a node if is open, closes it if it's closed
	 * @param {Object} id
	 */
	onToggleNode : function(id){
		
		var node = FileTreeFrame.m_dataTree.getNodeFromID(id);

		var node_id = "node_" + id;
		var contents_id = node_id + "_contents";	
		var img_id = "oimg_"+id;

		if (node.isOpen == 0) {
			node.isOpen = 1;
			$(node_id).style.height = 'auto';
			$(contents_id).style.visibility = '';
			$(img_id).src = FileTreeFrame.m_closedURL;
		}
		else {
			node.isOpen = 0;
			$(node_id).style.height = FileTreeFrame.m_nodeMinHeight + 'px';
			$(contents_id).style.visibility = 'hidden';
			$(img_id).src = FileTreeFrame.m_openURL;
		}
		
		//FileTreeFrame.refreshTree();
		
		// Use callback, if set...
		if (FileTreeFrame.m_dirSelectCallback != '' ) {
			FileTreeFrame.m_selectedFolderID = id;			
			FileTreeFrame.m_dirSelectCallback(id);
		}
	},
	
	// /////////////////////////////////////////////////////////////////////////////////////
	
	/**
	* This is called when a user selects a file, this sends a message to WidgetCentral
	* which will be process by any other widgets that have subsribed to WidgetCentral
	*/
	onSelectFile : function(obj){

		if (FileTreeFrame.m_lockFileSelect) return;
		
		idStr = obj.id;
		id = parseInt(idStr.substring(5,idStr.length));	
		
		if (FileTreeFrame.m_fileSelectCallback != '') {
			FileTreeFrame.m_fileSelectCallback(id);
		}
		
	},
		
	// ////////////////////////////////////////////////////////////////////////////////
	
	onFileDroppedOnFolder : function(element, droppableElement){

		// Allow folders to be dropped on the background, and consider this a
		// request to move the folder to the root
		if (droppableElement.id == FileTreeFrame.m_contentDiv) {
			// Dropped on background
			var srcID = FileTreeFrame.extractNodeID(element.id);
			var node = FileTreeFrame.m_dataTree.getNodeFromID(srcID);
			if (node.type == 'dir' || node.type == 'sysdir') {
				DataManager.moveNode(srcID, -1);	
			}
		}
		else {
			var srcID = FileTreeFrame.extractNodeID(element.id);
			var targetID = FileTreeFrame.extractNodeID(droppableElement.id);

			// if the target folder is closed, open it!
			var targetNode = FileTreeFrame.m_dataTree.getNodeFromID(targetID);
			if (targetNode.isOpen == 0) {
				FileTreeFrame.toggleNode(targetID);
			}
			
			DataManager.moveNode(srcID, targetID);	
		}

		// Refresh the tree
		FileTreeFrame.refreshTree();		
	},

	// ////////////////////////////////////////////////////////////////////////////////
/*
	doFileRename : function(){

//		new_name = $F('new_file_name');
		new_name = document.rename_form.new_file_name.value;
		
		// Reset node...
		node = FileTreeFrame.m_nodeLevelList[FileTreeFrame.m_selectedFile];
		
		// Get new extension
		ext = new_name.substr(new_name.lastIndexOf(".")+1,new_name.length).toLowerCase(); 

		imgURL = FileTreeFrame.getFileImg(ext);
		text  = "<img id='nimg_"+node.id+"' src='"+imgURL+"'/>" + new_name;
		$("node_"+node.id).innerHTML = text;				
				
		// Do actual file rename........		
		var params = $H({ admin_cmd: 'rename_file', dir: node.directory, filename: node.basename, new_filename: new_name});
		
		var ajax = new Ajax.Request(FileTreeFrame.m_commandURL,{
			method: 'post',
			parameters: params.toQueryString()
		});		
										
		// Update node
		FileTreeFrame.m_nodeLevelList[FileTreeFrame.m_selectedFile].basename = new_name;
	
		// Now allow file selections
		FileTreeFrame.m_lockFileSelect = false;		
		
		// Update the root
		//FileTreeFrame.updateRoot();
					
	},
*/	
	// /////////////////////////////////////////////////////////////////////////////////////
/*
	onRenameFile : function(){
		
		// Close context menu
		$('DirTree_ContextMenuDiv').style.left = '-999em';	
		
		// Disallow file selections until we've finished
		FileTreeFrame.m_lockFileSelect = true;

		node = FileTreeFrame.m_nodeLevelList[FileTreeFrame.m_selectedFile];

		imgURL = FileTreeFrame.getFileImg(node.extension);
			
		doSrc = "var key = event.which || event.keyCode; if (key == 13) {FileTreeFrame.doFileRename(); return false; }";		
		text = "<form name='rename_form'>";
		text += "<img id='nimg_"+node.id+"' src='"+imgURL+"'/>";
		text += "<input name='new_file_name' style='align:right; margin:2px;' type='text' onkeydown='"+doSrc+"' value='"+node.basename+"'></input>";				
		text += "</form>";

		//codepress2.setCode($('DirTreeList').innerHTML);
		//codepress2.setLanguage('html');
		
		$("node_"+node.id).innerHTML = text;		
		
		document.rename_form.new_file_name.focus();
//		$F('new_file_name').focus();
		
	},
	*/
	// /////////////////////////////////////////////////////////////////////////////////////
	/*
	onDeleteFile : function(){
		
		// Close context menu
		$('DirTree_ContextMenuDiv').style.left = '-999em';				

		node = FileTreeFrame.m_nodeLevelList[FileTreeFrame.m_selectedFile];

		// Confirm
		if (!confirm("Are you sure you want to delete " + node.basename)){
			return;
		}
		
		// Do actual file rename........		
		var params = $H({ admin_cmd: 'delete_file', dir: node.directory, filename: node.basename});
		
		var ajax = new Ajax.Request(FileTreeFrame.m_commandURL,{
			method: 'post',			
			parameters: params.toQueryString()
		});		
		
		// Now remove the node....
		
		for (i=FileTreeFrame.m_selectedFile; i<FileTreeFrame.m_nodeLevelList.length-1; i++){
			FileTreeFrame.m_nodeLevelList[i] = FileTreeFrame.m_nodeLevelList[i+1];	
		}
		
		FileTreeFrame.m_nodeLevelList.length--;
		
		FileTreeFrame.updateRoot();
	},
	*/
	// /////////////////////////////////////////////////////////////////////////////////////
	/*
	onNewFolder : function(){
		alert('new folder');
		// Close context menu
		$('DirTree_ContextMenuDiv').style.left = '-999em';				
	},
	*/
	// /////////////////////////////////////////////////////////////////////////////////////
	
	/**
	* The user has requested to create a new file
	*/
	/*
	onNewFile : function(){
		
		// Close context menu
		$('DirTree_ContextMenuDiv').style.left = '-999em';	
		
		// Disallow file selections until we've finished
		FileTreeFrame.m_lockFileSelect = true;
		
		node = FileTreeFrame.m_nodeLevelList[FileTreeFrame.m_selectedFile];

		var params = $H({ admin_cmd: 'create_new_file', dir: node.directory, filename: 'newfile'});
		
		var ajax = new Ajax.Request(FileTreeFrame.m_commandURL,{
			onSuccess: FileTreeFrame.onNewFile_Handler,
			method: 'post',
			parameters: params.toQueryString()
		});


	},
	*/
	// /////////////////////////////////////////////////////////////////////////////////////
/*
	onNewFile_Handler : function(){		
	
		node = FileTreeFrame.m_nodeLevelList[FileTreeFrame.m_selectedFile];
		
		// Set the rename file flag, use by update_handler
		FileTreeFrame.m_renameFile = true;
		
		// Update dir tree, which will in turn call the correct functions afterwards
		// as the above flag is set (see update_handler)
		if (node.parent_id != -1){
			if (FileTreeFrame.m_nodeLevelList[node.parent_id].type == 'dir'){
				FileTreeFrame.updateChild(node.parent_id, node.directory);							
			}
			else {
				FileTreeFrame.updateChild(node.id, node.directory);			
			}
		}
		else {
			FileTreeFrame.updateRoot();
		}
		
	},
	*/
	
	// /////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Extract the node id for the given div
	 * @param {Object} div_id
	 */
	extractNodeID : function(div_id){
		return parseInt(div_id.substring(5,div_id.length));
	},

	// /////////////////////////////////////////////////////////////////////////////////////

	/**
	* This is called by WidgetCentral when the user right clicks on the menu, 
	* which replaces the usual context menu
	*/
	onContextMenu : function(e){

		// IE is evil and doesn't pass the event object 
		if (e == null) e = window.event; 
		
		// we assume we have a standards compliant browser, but check if we have IE 
		var target = e.target != null ? e.target : e.srcElement; 

		var idStr = target.id;
		
		if (idStr.length > 4){
			
			startStr = idStr.substring(0,4);
			
			if (startStr == 'node' || startStr == 'nimg' || startStr == 'span'){

				
				var nodeNo = FileTreeFrame.extractNodeID(idStr); //parseInt(idStr.substring(5,idStr.length));

				//var node = FileTreeFrame.m_dataTree.getNodeFromID(nodeNo);
				//node = FileTreeFrame.m_nodeLevelList[nodeNo];

				FileTreeFrame.m_selectedFile = nodeNo;
				
//				alert('FileTreeFrame Target = ' + target.id + ' no = ' + nodeNo + ' name = ' + node.basename);
				
				var xMouse =  Event.pointerX(e) - 40;
				var yMouse =  Event.pointerY(e) - 80;
				
				$('DirTree_ContextMenuDiv').style.left = xMouse + 'px';
				$('DirTree_ContextMenuDiv').style.top = yMouse + 'px';
				$('DirTree_ContextMenuDiv').onmouseout = FileTreeFrame.onCloseContextMenu;
				
			}

		}
		
		return false;
		
	},

	// /////////////////////////////////////////////////////////////////////////////////////

	onCloseContextMenu : function(e){
		
		if (!e) e = window.event;
			
		mx = Event.pointerX(e);
		my = Event.pointerY(e);
	
		element = $('DirTree_ContextMenuDiv');
			
		if (!Position.within(element, mx, my)){
			$('DirTree_ContextMenuDiv').style.left = '-999em';				
		}
	},

	// /////////////////////////////////////////////////////////////////////////////////////

	getFileImg : function(ext) {
		
		if (ext == 'php')
			imgURL = FileTreeFrame.m_phpImgURL;
		else if (ext == 'js')
			imgURL = FileTreeFrame.m_jsImgURL;
		else if (ext == 'dir')
			imgURL = FileTreeFrame.m_folderImgURL;
		else if (ext == 'html' || ext == 'htm')
			imgURL = FileTreeFrame.m_htmlImgURL;
		else if (ext == 'zip' || ext == 'jar' || ext == 'gz')
			imgURL = FileTreeFrame.m_zipImgURL;
		else if (ext == 'pdf')
			imgURL = FileTreeFrame.m_pdfImgURL;				
		else if (ext == 'sql')
			imgURL = FileTreeFrame.m_sqlImgURL;				
		else if (ext == 'css')
			imgURL = FileTreeFrame.m_cssImgURL;				
		else if (ext == 'xml')
			imgURL = FileTreeFrame.m_xmlImgURL;		
		else if (ext =='jpg' || ext == 'jpeg')
			imgURL = FileTreeFrame.m_imgImgURL;
		else if (ext =='png' || ext == 'gif' || ext == 'ico')
			imgURL = FileTreeFrame.m_imgImgURL;
		else if (ext =='bmp')
			imgURL = FileTreeFrame.m_imgImgURL;
		else if (ext =='xml')
			imgURL = FileTreeFrame.m_xmlImgURL;
		else if (ext =='doc')
			imgURL = FileTreeFrame.m_wordImgURL;
		else if (ext =='xls')
			imgURL = FileTreeFrame.m_excelImgURL;
		else if (ext =='mpg' || ext =='mpeg' || ext =='wav')
			imgURL = FileTreeFrame.m_musicImgURL;
		else if (ext =='ini' || ext =='exe')
			imgURL = FileTreeFrame.m_sysImgURL;
		else if (ext == 'page')
			imgURL = FileTreeFrame.m_sitePageImgURL;
		else 
			imgURL = FileTreeFrame.m_fileImgURL;		
			
		return imgURL;
	}
	
}

