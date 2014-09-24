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
$output = $_GET['output'];
$callback = $_GET['callback'];
$key = $_GET['key']; // TODO:STORE Access by key for analytics?

$results = null;


$dbs_book_codes = array(
"GN", "EX", "LV", "NU", "DT", "JS", "JG", "RT", "S1", "S2", "K1", "K2", "R1", "R2", "ER", "NH", "ET", "JB", "PS", "PR", "EC", "SS", "IS", "JR", "LM", "EK", "DN", "HS", "JL", "AM", "OB", "JH", "MC", "NM", "HK", "ZP", "HG", "ZC", "ML", 

"TB", "JT", "ED", "AE", "WS", "SR", "BR", "LJ", "S3Y", "SN", "BL", "M1", "M2", "E1", 

"MT", "MK", "LK", "JN", "AC", "RM", "C1", "C2", "GL", "EP", "PP", "CL", "H1", "H2", "T1", "T2", "TT", "PM", "HB", "JM", "P1", "P2", "J1", "J2", "J3", "JD", "RV");

$osis_book_codes = array("Gen", "Exod", "Lev", "Num", "Deut", "Josh", "Judg", "Ruth", "1Sam", "2Sam", "1Kgs", "2Kgs", "1Chr", "2Chr", "Ezra", "Neh", "Esth", "Job", "Ps", "Prov", "Eccl", "Song", "Isa", "Jer", "Lam", "Ezek", "Dan", "Hos", "Joel", "Amos", "Obad", "Jonah", "Mic", "Nah", "Hab", "Zeph", "Hag", "Zech", "Mal",

"Tob", "Jdt", "EsthGr", "AddEsth", "Wis", "Sir", "Bar", "EpJer", "PrAzar", "Sus", "Bel", "1Macc", "2Macc", "3Macc", "4Macc", "1Esd", "2Esd", "Ps151",

"Matt", "Mark", "Luke", "John", "Acts", "Rom", "1Cor", "2Cor", "Gal", "Eph", "Phil", "Col", "1Thess", "2Thess", "1Tim", "2Tim", "Titus", "Phlm", "Heb", "Jas", "1Pet", "2Pet", "1John", "2John", "3John", "Jude", "Rev"
);


switch ($action) {
	case 'list':
		
		$results = get_list( $_GET['force'] );
		
		break;
		
	case 'books':
		
		$results = get_books( $_GET['version'] );
		
		break;	
		
	case 'chapter':
		
		$results = get_chapter( $_GET['version'], $_GET['sectionid'], $_GET['osis'], $_GET['chapter'], $_GET['dir'], $_GET['lang'], $_GET['lang3'], $_GET['previd'], $_GET['nextid'], $_GET['bookname'] );
		
		break;
		
	case 'search':
		
		$results = get_search( $_GET['version'], $_GET['text'], $_GET['divisions'] );
		
		break;							
}

function dbs_code_to_osis($dbs_book_code) {
	global $dbs_book_codes;
	global $osis_book_codes;
		
	$dbs_index = array_search($dbs_book_code, $dbs_book_codes);
	$osis_book_code = $osis_book_codes[ $dbs_index ];		
	
	return $osis_book_code;
}

function osis_code_to_dbs($osis_book_code) {
	global $dbs_book_codes;
	global $osis_book_codes;
		
	$osis_index = array_search($osis_book_code, $osis_book_codes);
	$dbs_book_code = $dbs_book_codes[ $osis_index ];		
	
	return $dbs_book_code;
}

function get_search($version, $text, $divisions) {
	
	global $dbs_book_codes;
	global $osis_book_codes;
	
	if ($divisions == null) {
		$divisions = array();
	} else  {
		//$divisions = explode(',',$divisions);
	}
	

	// convert DBS books to OSIS
	$osis_books = array();
	foreach ($divisions as &$dbs_book) {
		array_push($osis_books, dbs_code_to_osis($dbs_book) );
	}

	$abs_url = 'https://bibles.org/v2/verses.js?limit=500&sort_order=canonical&keyword=' . $text . '&version=' . $version . '&book=' . join(',',$osis_books);
	$abs_data = get_abs_data($abs_url);
	
	if ($abs_data == null) {
		return null;
	}
	
	$abs_verses = $abs_data->response->search->result->verses;
	
	//echo json_encode($abs_data->response->search->result->verses);
	//return null;
	
	$results = array();
	
	foreach ($abs_verses as &$abs_verse) {
		
		$abs_verseid = $abs_verse->id;
		$osis_id = explode(':',$abs_verseid)[1];
		$osis_parts = explode('.',$osis_id);
		$osis_book_code = $osis_parts[0];
		$dbs_book_code = osis_code_to_dbs($osis_book_code);
		$chapter_num = $osis_parts[1];				
		$verse_num = $osis_parts[2];		
		$dbs_verseid = $dbs_book_code . $chapter_num . '_' . $verse_num;
		
		$text = $abs_verse->text;
		
		// remove verse numbers
		$text = preg_replace('/<sup([^>]+)?>\d+<\/sup>/', '', $text);
		$text = preg_replace('/<a.*<\/a>/', '', $text);		
		$text = preg_replace('/<\/?p([^>]+)?>/', '', $text);
		$text = preg_replace('/<h([^>]+)?>([^<]+)<\/h3>/', '', $text);		
		$text = preg_replace('/class="nd"/', 'class="nog"', $text);		
		$text = preg_replace('/<em>([^<]+)<\/em>/', '<span class="highlight">$1</span>', $text);				
		
		
		$results[] = array($dbs_verseid => $text);	
	}
	
	return array(
		abs_url => $abs_url,
		//fums_tid => 		$abs_data->response->meta->fums_tid,
		fums_js_include => 	$abs_data->response->meta->fums_js_include,
		fums_js => 			$abs_data->response->meta->fums_js,				
		results => $results
	);	
}



function get_chapter($version, $sectionid, $osis_book, $chapter, $dir, $lang, $lang3, $previd, $nextid, $bookname) {
	
	global $dbs_book_codes;
	global $osis_book_codes;
	
	$dbs_book = substr($sectionid, 0, 2);
	
	// regex for text changing
	$regexp_verse_num = '/<sup.+<\/sup>/';
	$regexp_p = '/<\/?p([^>]+)?>/';
	$regexp_h = '/<h3 class="s\d?">([^<]+)<\/h3>/';
	
	$abs_data = get_abs_data('https://bibles.org/v2/chapters/' . $version . ':' . $osis_book . '.' . $chapter . '/verses.js');
	
	if ($abs_data == null) {
		return null;
	}	
	
	$abs_verses = $abs_data->response->verses;
	
	$html = '<div class="section chapter ' . $version . ' ' . $dbs_book . ' ' . $sectionid . ' ' . $lang . '" ' .
								' data-textid="' . $version . '"' .
								' data-id="' . $sectionid . '"' .
								' data-nextid="' . $nextid . '"' .
								' data-previd="' . $previd . '"' .
								' lang="' . $lang . '"' .
								' data-lang3="' . $lang3 . '"' .
								' dir="' . $dir . '"' .
								'>';

	if ($chapter == '1') {
		$html .= '<div class="mt">' . $bookname . '</div>';
	}
	
	
		
	foreach ($abs_verses as &$abs_verse) {
		$text = $abs_verse->text;
		$vnum = $abs_verse->verse;
		$vid = $sectionid . '_' . $vnum;
		
		// check for title
		if (preg_match($regexp_h, $text, $heading_matches)) {
			if ($vnum > 1) {
				$html .= '</div>'; // close paragraph
			}
			
			$html .= '<div class="s">' . $heading_matches[1] . '</div>'; 
			
			if ($vnum > 1) {
				$html .= '<div class="p">'; // reopen paragraph
			}			
		}

		if ($vnum == 1) {
			$html .= '<div class="c">' . $chapter . '</div>';
		
			$html .= '<div class="p">';				
		}
		
		
		
		//echo $text;
		
		// "fix" text
		$text = preg_replace($regexp_verse_num, '', $text);
		$text = preg_replace($regexp_p, '', $text);		
		$text = preg_replace($regexp_h, '', $text);		

		$html .= '<span class="v-num v-' . $vnum . '">' . $vnum . '&nbsp;</span><span class="v ' . $vid . '" data-id="' . $vid . '">' . $text . '</span>';

	}

	$html .= '</div>'; // p
	$html .= '</div>'; // section;
	
	return array(
		//fums_tid => 		$abs_data->response->meta->fums_tid,
		fums_js_include => 	$abs_data->response->meta->fums_js_include,
		fums_js => 			$abs_data->response->meta->fums_js,				
		html => $html
	);	
}

function get_books($version) {
	
	global $dbs_book_codes;
	global $osis_book_codes;

	$abs_data = get_abs_data('https://bibles.org/v2/versions/' . $version . '/books.js');
	
	if ($abs_data == null) {
		return null;
	}	
	
	$abs_books = $abs_data->response->books;
	
	$divisions = array();
	$divisionNames = array();
	$divisionAbbreviations = array();
	$sections = array();

	
	foreach ($abs_books as &$abs_book) {
		
		$dbs_book_code = osis_code_to_dbs($abs_book->abbr);
		
		if ($dbs_book_code != null) {			
			array_push($divisions, $dbs_book_code);
			array_push($divisionNames, $abs_book->name);
			array_push($divisionAbbreviations, $abs_book->abbr);	
						
			// find the last chapter
			$osis_end = $abs_book->osis_end; // "eng-AMP:Gen.50.26
			$osis_end_parts = explode('.', $osis_end);
			$last_chapter = $osis_end_parts[2];
			
			//array_push($sections, $osis_end); // sizeof($osis_end_parts)); //  $dbs_book_code . strval($last_chapter));
			
			// create sections
			for ($c=1; $c<=$last_chapter; $c++) {
				array_push($sections, $dbs_book_code . strval($c));
			}
		}			
	}
	
	$dbs_books = array(
		divisions => $divisions,
		divisionNames => $divisionNames,
		divisionAbbreviations => $divisionAbbreviations,
		sections => $sections
	);	

	return $dbs_books;	
}


function get_list($force) {

	if ($force != 'true') {

		global $token;
	
		if ($token == '') {
			return null;
		}
	
		// try local file
		$local_abs_file = 'content/texts/texts_abs.json';	
		if (file_exists($local_abs_file)) {
			return json_decode( file_get_contents($local_abs_file) );
		} else {		
			return null;
		}
			
	} else {

		// load remote data
		$abs_data = get_abs_data('https://bibles.org/v2/versions.js');
		$abs_versions = $abs_data->response->versions; 
			
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
			
			// special case for English which we currently combine
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
				"absid" => $version->id,			
				"absAudio" => $version->audio
			);
			
			array_push($dbs_versions, $dbs_version);
		}
		
		
		return array(
			"textInfoData" => $dbs_versions
		);
	}
}

function get_abs_data($url) {

	global $token;

	if ($token == '') {
		return null;
	}

	$secure_url = str_replace('https://','https://' . $token . ':X@', $url ); 

	$response = file_get_contents( $secure_url );
	
	$json = json_decode($response);
	
	return $json;
}


if ($callback != '') {
	echo $callback . '(';	
}

echo json_encode($results);

if ($callback != '') {
	echo ')';	
}

?>
