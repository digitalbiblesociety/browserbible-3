<?php
mb_internal_encoding('UTF-8');
mb_http_output('UTF-8');
mb_http_input('UTF-8');
mb_language('uni');
mb_regex_encoding('UTF-8');
ob_start('mb_output_handler');

header('Content-type: application/javascript');

//// START UP
$action = $_GET['action'];
$callback = $_GET['callback'];
$key = $_GET['key'];

// TODO:STORE Access by key for analytics?

// load file
$jsonformatted = '';
$filecontents = '';
if (file_exists($action)) {
	$filecontents = $file_contents = file_get_contents($action);
	$jsonformatted = $filecontents;
}

// determine type to return
$fileparts = explode('.',$action);
$fileext = $fileparts[count($fileparts)-1];


if ($fileext == 'json') {

	// do nothing

} else if ($fileext == 'html' || $fileext == 'txt') {
	$obj = array("text" => $filecontents);

	$jsonformatted = json_encode($obj);
}

echo $callback . '(' . $jsonformatted . ')';










//echo json_encode( $output );

?>
