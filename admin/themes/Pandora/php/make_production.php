<?php

$discRoot = realpath(dirname(__FILE__)) . "/";
$common_code_root = substr($discRoot, 0, strpos($discRoot, 'wp-content')) . 'wp-content/CommonCode/';
$theme_root = substr($discRoot, 0, strpos($discRoot, 'wp-content')) . 'wp-content/themes/pandora/';

require_once($common_code_root . 'php/utils/ApolloLogger.class.php');
require_once($common_code_root . 'php/utils/JSMin.class.php');
require_once($common_code_root . 'php/utils/CSSMin.class.php');
require_once($theme_root . 'php/ProductionCodeBuilder.class.php');

ApolloLogger::catchSysErrors();
ApolloLogger::echoLog();

ProductionCodeBuilder::buildProductionJS($theme_root, $theme_root . 'js/pandora-min.js');
ProductionCodeBuilder::buildApolloPluginCSS($theme_root, $theme_root . 'pandora-min.css');
			
			
?>