<?php
/**
 * IXR_Base64
 *
 * @package IXR
 * @since 1.5
 */
class IXR_Base64 {
    var $data;
    function IXR_Base64($data) {
        $this->data = $data;
    }
    function getXml() {
        return '<base64>'.base64_encode($this->data).'</base64>';
    }
}
?>