<?php

require_once("code/php/setup.php");

$file_root = dirname(__FILE__);

$mime_type = 'image/jpeg';

$filepath = $file_root . '/test2.jpg';
$thumbfilepath = $file_root . '/test2_thumb.png';

$src_image = ImageUtils::createImageFromFile($filepath, $mime_type);
$thumb_img = ImageUtils::resizeImage($src_image, $mime_type, 'letterbox', 400, 400);

header('Content-type: image/png');
imagepng($thumb_img);
imagedestroy($thumb_img);

?>