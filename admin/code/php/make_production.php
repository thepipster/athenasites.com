<?php

$discRoot = realpath(dirname(__FILE__)) . "/";
$common_code_root = substr($discRoot, 0, strpos($discRoot, 'wp-content')) . 'wp-content/CommonCode/';

require_once($common_code_root . 'php/utils/ApolloLogger.class.php');
require_once($common_code_root . 'php/utils/JSMin.class.php');
require_once($common_code_root . 'php/utils/CSSMin.class.php');
require_once($common_code_root . 'php/utils/ProductionCodeBuilder.class.php');


Logger::catchSysErrors();
Logger::echoLog();

ProductionCodeBuilder::buildProductionJS($common_code_root . 'js/ApolloProduction.class.js');
ProductionCodeBuilder::buildApolloPluginCSS($common_code_root . 'ApolloPlugin.css');
			
?>