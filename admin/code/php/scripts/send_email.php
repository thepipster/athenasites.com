<?php

require_once("../setup.php");

Logger::echoLog();

EmailMessaging::sendMessagesFromQueue();

?>
