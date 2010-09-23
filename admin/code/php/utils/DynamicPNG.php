<?php
/**
* 
* Usage;  http://zip.local.com/DynamicPNG.php?r=40&g=144&b=85&a=55
* 
* Where
* r = red (0-255)
* g = green (0-255)
* b = blue (0-255)
* a = alpha (0-100);
*
* @since 18th December, 2009
* @author Mike Pritchard (mike@adastrasystems.com)
*
*/

$col = getPara('col');

if ($col == false) {
	$red1 = getPara('r'); // 0-255
	if ($red1 == '') {$red1 = 255;}
	if ($red1 > 255) {$red1 = 255;}
	if ($red1 < 0) {$red1 = 0;}
	$red = $red1; //preserve original
	
	$green1 = getPara('g'); // 0-255
	if ($green1 == '') {$green1 = 255;}
	if ($green1 > 255) {$green1 = 255;}
	if ($green1 < 0) {$green1 = 0;}
	$green = $green1;
	
	$blue1 = getPara('b'); // 0-25
	if ($blue1 == '') {$blue1 = 0;}
	if ($blue1 > 255) {$blue1 = 255;}
	if ($blue1 < 0) {$blue1 = 0;}
	$blue = $blue1;
}
else {
	sscanf($col, "%2x%2x%2x", $red, $green, $blue);
}

$alpha1 = getPara('a'); // 0-100 Percentage (transparent-opaque)
if ($alpha1 == '') {$alpha1 = 0;}
if ($alpha1 > 100) {$alpha1 = 100;}
if ($alpha1 < 0) {$alpha1 = 0;}
$alpha = $alpha1;

$alpha = round(($alpha * 127)/100);

$width = getPara('width');
$height = getPara('height');

if ($width == false) $width = 50;
if ($height == false) $height = 50;

$image = imagecreatetruecolor($width, $height);

imageSaveAlpha($image, true);
ImageAlphaBlending($image, false);

$transparentColor = imagecolorallocatealpha($image, $red, $green, $blue, $alpha);
imagefill($image, 0, 0, $transparentColor);

//Tell the browser what kind of file is come in 
header("Content-Type: image/png"); 

//Output the newly created image in jpeg format 
imagepng($image);


imagedestroy($image);

function getPara($name){
	if(isset($_POST[$name])) return $_POST[$name];
	if(isset($_GET[$name])) return $_GET[$name];	
	return false;
}

?>
