<?php
mb_internal_encoding('UTF-8');
mb_http_output('UTF-8');
mb_http_input('UTF-8');
mb_language('uni');
mb_regex_encoding('UTF-8');
ob_start('mb_output_handler');

header('Content-type: application/javascript');


$from_email = 'johndyer@gmail.com';

//// START UP
$name = $_POST['name'];
$email = $_POST['email'];
$subject = $_POST['subject'];
$comments = $_POST['comments'];
$callback = $_POST['callback'];
$success = true;


$message = 
	'SUBJECT: ' . $subject . "\r\n" .
	'NAME: ' . $$email . "\r\n" .
	'EMAIL: ' . email . "\r\n" .
	'MESSAGE: ' . "\r\n" + 
	$comments;



// send email with PHP
$headers = 'From: ' . $from_email . "\r\n" .
    'Reply-To: ' . $from_email . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

mail($email, 'FEEDBACK: ' . $subject, $message, $headers);


// RETURN DATA
$jsonformatted = json_encode(array("success" => $success));


if ($callback != '') {
	echo $callback . '('; 
} 

echo $jsonformatted;

if ($callback != '') {
	echo ')'; 
} 








//echo json_encode( $output );

?>
