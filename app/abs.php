<?php
mb_internal_encoding('UTF-8');
mb_http_output('UTF-8');
mb_http_input('UTF-8');
mb_language('uni');
mb_regex_encoding('UTF-8');
ob_start('mb_output_handler');

header('Content-type: application/javascript');

//// START UP
$token = '';

$action = $_GET['action'];
$callback = $_GET['callback'];
$key = $_GET['key']; // TODO:STORE Access by key for analytics?

$results = null;

switch ($action) {
	case 'list':
		
		$results = get_list();
		
		break;
	
	
	
}


function get_list() {
	
	$abs_data = get_abs_data('https://bibles.org/v2/versions.js');

	
	$abs_versions = $abs_data->response->versions; // ['response']['versions']; // 
	
	
/*
{
	"id": "ara_svd",
	"name": "Smith & Van Dyke (1895)",
	"nameEnglish": "",
	"abbr": "SVD",
	"lang": "ara",
	"langName": "العربية",
	"langNameEnglish": "Arabic",
	"dir": "rtl",
	"type": "bible"
},
{
	id: "aai-AAINT",
	name: "Tur gewasin o baibasit boubun",
	lang: "aai",
	lang_code: "ISO 639-3",
	contact_url: "http://www.wycliffe.org",
	audio: "NONE",
	copyright: "© 2009, Wycliffe Bible Translators, Inc. All rights reserved.",
	info: "<h2>Copyright Information</h2> <p>&#169; 2009, Wycliffe Bible Translators, Inc. All rights reserved.</p> <p>This translation text is made available to you under the terms of the Creative Commons License: Attribution-Noncommercial-No Derivative Works. (<a href="http://creativecommons.org/licenses/by-nc-nd/3.0/">http://creativecommons.org/licenses/by-nc-nd/3.0/</a>) In addition, you have permission to port the text to different file formats, as long as you do not change any of the text or punctuation of the Bible.</p> <p>You may share, copy, distribute, transmit, and extract portions or quotations from this work, provided that you include the above copyright information:</p> <ul> <li>You must give Attribution to the work.</li> <li>You do not sell this work for a profit.</li> <li>You do not make any derivative works that change any of the actual words or punctuation of the Scriptures.</li> </ul> <p>Permissions beyond the scope of this license may be available if you <a href="mailto:ScriptureCopyrightPermissions_Intl@Wycliffe.org">contact us</a> with your request.</p> <p> <b>The New Testament</b> <br /> in Arifama-Miniafia</p>",
	lang_name: "Arifama-Miniafia",
	lang_name_eng: "Arifama-Miniafia",
	abbreviation: "AAINT",
	updated_at: "2014-06-20T12:22:59-05:00"
},

*/	
	$dbs_versions = array();
	
	foreach ($abs_versions as &$version) {
		
		$version_parts = explode('-', $version->id);
		$abbr = '';
		
		$lang_parts = explode('-', $version->lang);
		$lang = $version_parts[0];
		
		
		if (sizeof($version_parts) == 2) {
			$abbr = $version_parts[1];
		} else {
			$abbr = $version_parts[0];
		}
		
		$lang_name = $version->lang_name_eng;
		$lang_name = str_replace(' (UK)', '', $lang_name);
		$lang_name = str_replace(' (US)', '', $lang_name);		
		
		
		$dbs_version = array(
			"id" => $version->id,
			"name" => $version->name . ' [ABS]',
			"nameEnglish" => '',
			"abbr" => $abbr ,
			"lang" => $lang,
			"langName" => $lang_name,
			"langNameEnglish" => $version->lang_name_eng,
			"dir" => "ltr", // TODO: ?
			"type" => "bible",
			"absAudio" => $version->audio
		);
		
		array_push($dbs_versions, $dbs_version);
	}
	
	
	return array(
		"textInfoData" => $dbs_versions
	);
	
}

function get_abs_data($url) {

	global $token;

	$secure_url = str_replace('https://bibles.org','https://' . $token . ':X@bibles.org', $url ); 
	$response = file_get_contents( $secure_url );
	
	$json = json_decode($response);
	
	return $json;
	
	/*
	
	$ch = curl_init();
	
	curl_setopt($ch, CURLOPT_URL, $url);
	// don't verify SSL certificate
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
	// Return the contents of the response as a string
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	// Follow redirects
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
	// Set up authentication
	curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
	curl_setopt($ch, CURLOPT_USERPWD, $token . ':X');
	
	// Do the request
	$response = curl_exec($ch);
	curl_close($ch);	
	
	return $response; // 'asdfas';
	*/
	
}



echo $callback . '(' . json_encode($results) . ')';










//echo json_encode( $output );

?>
