<?php
/**
 * IXR_Error
 *
 * @package IXR
 * @since 1.5
 */
class IXR_Error {
    var $code;
    var $message;
    function IXR_Error($code, $message) {
        $this->code = $code;
        // WP adds htmlspecialchars(). See #5666
        $this->message = htmlspecialchars($message);
    }
    function getXml() {
        $xml = <<<EOD
<methodResponse>
  <fault>
    <value>
      <struct>
        <member>
          <name>faultCode</name>
          <value><int>{$this->code}</int></value>
        </member>
        <member>
          <name>faultString</name>
          <value><string>{$this->message}</string></value>
        </member>
      </struct>
    </value>
  </fault>
</methodResponse>

EOD;
        return $xml;
    }
}
?>