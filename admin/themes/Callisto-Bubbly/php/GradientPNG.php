<?php
/**
* Create a gradient png dynamically, derived from http://www.xtremepccentral.com/forums/showthread.php?t=17981
* 
* Usage;  http://zip.local.com/test1/wp-content/themes/Callisto/php/GradientPNG.php?c1=afc3ff&c2=000000&w=100&h=50&d=1
* 
* Where
* c1 = color 1 (in hex)
* c2 = color 2 (in hex)
* w = width;
* h = height;
* d = direction, 0 = horizontal (default), 1 = vertical
*
* @since 18th December, 2009
* @author Mike Pritchard (mike@adastrasystems.com)
*
*/

// Read input parameters....
$col1 = getPara('c1');
$col2 = getPara('c2');
$width = getPara('w');
$height = getPara('h');
$dir = getPara('d');

$isVertical = false;
if ($dir == 1) $isVertical = true;

// Make the gradient image................

// Break colours into RGB components
sscanf($col1, "%2x%2x%2x", $rbase, $gbase, $bbase);
sscanf($col2, "%2x%2x%2x", $rend, $gend, $bend);

// Set the Variable to step to use height
if ($isVertical == true){
	$step = floor($height/255);
	$varstep = $height;
}
else {
	$step = floor($width/255);
	$varstep = $width;
}
	
// Remove potential divide by 0 errors.
if ($rbase==$rend) $rend = $rend -1;
if ($gbase==$gend) $gend = $gend -1;
if ($bbase==$bend) $bend = $bend -1;

// Make sure the height is at least 1 pixel
if ($varstep == 0) $varstep=1;

// Set up step modifiers for each colour
$rmod = ($rend - $rbase) /$varstep;
$gmod = ($gend - $gbase) /$varstep;
$bmod = ($bend - $bbase) /$varstep;

// Create image
//$src_image = imagecreatetruecolor($width, $height);
$image = imagecreatetruecolor($width, $height);

// Serves no real purpose.
$white=imagecolorallocate($image,255,255,255);

// Loop for the height at a rate equal to the steps.
for($i=0; $i<$varstep; $i = $i+$step+1)
{
	//Adjust the colours
	$clour1 = ($i * $rmod) + $rbase;
	$clour2 = ($i * $gmod) + $gbase;
	$clour3 = ($i * $bmod) + $bbase;
	$col = imagecolorallocate($image, $clour1, $clour2, $clour3);
	
	//Paint the rectangle at current colour.
	if ($vertical == true)
		imagefilledrectangle($image, $width+1, $i, 0, $i+$step, $col);
	else
		imagefilledrectangle($image, $i, $height-1, $i+$step, 0, $col);
}

//Tell the browser what kind of file is come in 
header("Content-Type: image/png"); 

//Output the newly created image in jpeg format 
imagepng($image);

//Free up resources
imagedestroy($image); 


/**
 * Helper function to respond to posts or gets
 * @return 
 * @param $name Object
 */
function getPara($name){
	if(isset($_POST[$name])) return $_POST[$name];
	if(isset($_GET[$name])) return $_GET[$name];	
	return '';
}
	
?>