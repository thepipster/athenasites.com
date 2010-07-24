<?php

require_once('../utils/ApolloLogger.class.php');

ApolloLogger::debug('This is a debug test');
ApolloLogger::info('This is a info test');
ApolloLogger::warn('This is a warn test');
ApolloLogger::error('This is a error test');
ApolloLogger::fatal('This is a fatal test');

?>