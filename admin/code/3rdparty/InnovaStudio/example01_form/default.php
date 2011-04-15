<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <style>
    body{font:11px verdana,arial,sans-serif;}
    a{color:#0000cc;font-size:xx-small;}
  </style>

  <!-- STEP 1: Include the Editor js file -->
  <script language=JavaScript src='../scripts/innovaeditor.js'></script>

</head>
<body>

<h4>Using in a HTML Form (PHP example) - <a href="../default.htm">Back</a></h4>

<form method="post" action="default.php" id="Form1">

  <textarea id="txtContent" name="txtContent" rows=4 cols=30>
  <?php
function encodeHTML($sHTML)
    {
    $sHTML=preg_replace('/&/i','&amp;',$sHTML);
    $sHTML=preg_replace('/</i','&lt;',$sHTML);
    $sHTML=preg_replace('/>/i','&gt;',$sHTML);
    return $sHTML;
    }


  if(isset($_POST["txtContent"]))
    {
    $sContent=stripslashes($_POST['txtContent']); /*** remove (/) slashes ***/
    echo encodeHTML($sContent);
    }
  ?>
  </textarea>

  <script> //STEP 2: Replace the textarea (txtContent)
    var oEdit1 = new InnovaEditor("oEdit1");
    oEdit1.REPLACE("txtContent");//Specify the id of the textarea here
  </script>

  <input type="submit" value="Submit">
</form>

<?php
if(isset($_POST["txtContent"]))
  {
  $sContent=stripslashes($_POST['txtContent']); /*** remove (/) slashes ***/
  echo $sContent;
  }
?>

</body>
</html>