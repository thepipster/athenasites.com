<?php
/**
 * @Theme: AdAstra
 */
 
global $tracker_code;

?>
    	
<div align="center">
	<div id='footer'>&copy; 2009 Ad Astra Systems, Inc.</div>				
</div>

<!--Tracking /////////////////////////////////////////////////////////////// -->

<script type="text/javascript">

<?= PageManager::echoGoogleTracker($tracker_code); ?>

</script>

<!--Syntax Highlighting for posts //////////////////////////////////////////// -->

<!-- (if you need to add a language, add an include for it here)  -->
<!-- (http://code.google.com/p/syntaxhighlighter/) -->

<link rel="stylesheet" type="text/css" href="<?= PageManager::$theme_url_root; ?>/js/syntaxhighlighter/SyntaxHighlighter.css"></link>
<script language="javascript" src="<?= PageManager::$theme_url_root; ?>/js/syntaxhighlighter/shCore.js"></script>
<!--	<script language="javascript" src="<?= PageManager::$theme_url_root; ?>/js/syntaxhighlighter/shBrushCpp.js"></script> -->
<!--	<script language="javascript" src="<?= PageManager::$theme_url_root; ?>/js/syntaxhighlighter/shBrushCSharp.js"></script> -->
<script language="javascript" src="<?= PageManager::$theme_url_root; ?>/js/syntaxhighlighter/shBrushCss.js"></script>
<script language="javascript" src="<?= PageManager::$theme_url_root; ?>/js/syntaxhighlighter/shBrushJava.js"></script>
<script language="javascript" src="<?= PageManager::$theme_url_root; ?>/js/syntaxhighlighter/shBrushJScript.js"></script>
<script language="javascript" src="<?= PageManager::$theme_url_root; ?>/js/syntaxhighlighter/shBrushPhp.js"></script>
<!--	<script language="javascript" src="<?= PageManager::$theme_url_root; ?>/js/syntaxhighlighter/shBrushPython.js"></script> -->
<!--	<script language="javascript" src="<?= PageManager::$theme_url_root; ?>/js/syntaxhighlighter/shBrushRuby.js"></script> -->
<script language="javascript" src="<?= PageManager::$theme_url_root; ?>/js/syntaxhighlighter/shBrushSql.js"></script>
<script language="javascript" src="<?= PageManager::$theme_url_root; ?>/js/syntaxhighlighter/shBrushXml.js"></script>
<script language="javascript">
	dp.SyntaxHighlighter.ClipboardSwf = '<?= PageManager::$theme_url_root; ?>/flash/clipboard.swf';
	dp.SyntaxHighlighter.HighlightAll('code');
</script>
	
<?php PageManager::doFooter(); ?>

</body>
</html>
