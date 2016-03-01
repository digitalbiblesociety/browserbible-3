<?php
mb_internal_encoding('UTF-8');
mb_http_output('UTF-8');
mb_http_input('UTF-8');
mb_language('uni');
mb_regex_encoding('UTF-8');
ob_start('mb_output_handler');

header('Content-type: application/json');

function uniord($c) {
    $h = ord($c{0});
    if ($h <= 0x7F) {
        return $h;
    } else if ($h < 0xC2) {
        return false;
    } else if ($h <= 0xDF) {
        return ($h & 0x1F) << 6 | (ord($c{1}) & 0x3F);
    } else if ($h <= 0xEF) {
        return ($h & 0x0F) << 12 | (ord($c{1}) & 0x3F) << 6
                                 | (ord($c{2}) & 0x3F);
    } else if ($h <= 0xF4) {
        return ($h & 0x0F) << 18 | (ord($c{1}) & 0x3F) << 12
                                 | (ord($c{2}) & 0x3F) << 6
                                 | (ord($c{3}) & 0x3F);
    } else {
        return false;
    }
}


function hash_word($word) {
	$HASHSIZE = 20;

	$hash = 0;
	$word_length = mb_strlen($word, 'UTF-8');

	//echo 'length ' . $word_length . '<br>';

	for ($i=0; $i<$word_length; $i++) {
		//echo '-letter: ' . mb_substr($word, $i, 1, 'UTF-8') . ', ' . uniord( mb_substr($word, $i, 1, 'UTF-8') ) . '<br>';

		$hash += uniord( mb_substr($word, $i, 1, 'UTF-8') );

		$hash %= $HASHSIZE ;
	}

	return $hash;
}



/// DATAT
$isLemmaRegExp = '/[GgHh]\\d{1,6}/';
$is_stem_enabled = true;

//// START UP
$textid = $_GET['textid'];
$search = $_GET['search'];
$divisions = $_GET['divisions'];
if ($divisions == null) {
	$divisions = [];
} else {
	$divisions = split(",", $divisions);
}
$callback = $_GET['callback'];
$output = array(
	"results" => array(),
	"textid" => $textid,
	"search" => $search,
	"stems" => array(),
	"stem_words" => array(),	
	"divisions" => $divisions,
	"base32" => "",
	"success" => TRUE,
	"hash" => ""
);

$index_base_path = './content/texts/' . $textid;


$word_to_stem = null;
$word_to_stem_path = $index_base_path . '/index/stems.json';


if ($is_stem_enabled && file_exists($word_to_stem_path)) {
	$word_to_stem_contents = file_get_contents($word_to_stem_path);
	$word_to_stem = json_decode($word_to_stem_contents, true);	
}

// SEARCH TYPE
$search_type = "AND";
$is_lemma_search = preg_match($isLemmaRegExp, $search);



// TODO: detect strongs search
// SPLIT INDEXES, LOAD INDEX FILES
$indexes = array();
$words = explode(' ', $search);
$path_to_index = '';
$errors = '';
foreach ($words as &$word) {

	$path_to_index = $index_base_path;
	$key = '';
	$stem = '';
	
	if ($is_lemma_search) {
		//$path_to_index .= '/indexlemma/' . $word . '.json';

		$key = strtoupper($word);

		$letter = substr($word,0,1);
		$thousands = '0';
		if (strlen($word) == 5) {
			$thousands = substr($word,1,1);
		}

		$path_to_index .= '/indexlemma/' . '_' . strtoupper($letter) . $thousands . '000' . '.json';


	} else {
		
		if ($is_stem_enabled && $word_to_stem != null) {
			$stem = $word_to_stem[$word];
			
			$key = strtolower($stem);
			$hashed = hash_word($stem);	
			
			$path_to_index .= '/index/_stems_' . $hashed . '.json';
			$output['hash'] .= $key . ' = ' . $hashed . '; ';					
			
			$output['stems'][] = $stem;
		} else {
			
			$key = strtolower($word);
			$hashed = hash_word($word);
			
			// load index
			$path_to_index .= '/index/_' . $hashed . '.json';
			$output['hash'] .= $key . ' = ' . $hashed . '; ';			
		}



	}


	if (file_exists($path_to_index)) {
		$file_contents = file_get_contents($path_to_index);
		$json_data = json_decode($file_contents);

		// store this index along with other words to be combined later
		if (property_exists($json_data, $key)) {
			
			if (!$is_lemma_search && $is_stem_enabled && $word_to_stem != null) {
				
				$indexes[] = $json_data->{$key}->{"fragmentids"};
				$output["stem_words"] = array_merge($output["stem_words"],  $json_data->{$key}->{"words"});

			} else {
				$indexes[] = $json_data->{$key};			
			}
		} else {
			$errors .= "Can't find key: " . $key . ' in "' . $path_to_index + '"\n';
		}
	} else {
		$errors .= "Can't find index: " . $path_to_index . '\n';
	}
}

//echo 'index';
//echo var_dump($indexes);
//return;

// Combined index
$combined_index = array();
$index_count = count($indexes);

if ($index_count == 0) {
	header('Content-type: application/json');
	$output["success"] = FALSE;
	$output["errorMessage"] = $errors;
	echo json_encode( $output );
	return;

}



// TODO: add "OR" and strongs
if ($search_type == "AND") {
	if ($index_count == 1) {
		$combined_index = $indexes[0];
	} else {

		$first_index = $indexes[0];

		// filter down to in all verses
		$combined_index = array_filter($first_index, function( $val ) {
			$inOtherArrays = TRUE;

			// get values outside this array's scope
			global $index_count;
			global $indexes;

			// go through other arrays
			for ($ic = 1; $ic < $index_count; $ic++) {

				// if we can't find the verse in any sub arrays then it's not in all
				if ( !(array_search($val, $indexes[$ic]) > 0)) {
					$inOtherArrays = FALSE;
					break;
				}
			}

			return $inOtherArrays;
		});
	}
}



if (is_array($combined_index)) {

	// load the data
	foreach ($combined_index as &$verseid) {
		//$chapter_code = substr($verseid, 0, 2);;
		$verse_exploded = explode('_', $verseid);
		$chapter_code = $verse_exploded[0];
		$book_code = mb_substr($chapter_code, 0, 2);
		
		if (sizeof($divisions) > 0) {			
			if (!in_array($book_code, $divisions)) {
				continue;
			}			
		}
		
		$verse_html = '';

		// load chapter
		$path_to_chapter = './content/texts/' . $textid . '/' . $chapter_code . '.html';

		if (!file_exists($path_to_chapter)) {
			continue;
		}

		$file_contents = file_get_contents($path_to_chapter);

		// suppress HTML5 errors
		$doc = new DOMDocument();

		$doc->preserveWhiteSpace = true;
		$doc->formatOutput       = true;

		libxml_use_internal_errors(true);
		$doc->loadHTML($file_contents);
		libxml_clear_errors();
		$XPath = new DOMXPath($doc);

		$doc->preserveWhiteSpace = true;
		$doc->formatOutput       = true;

		// remove notes
		$note_nodes = $XPath->query("//span[contains(@class,'note')]");
		foreach ($note_nodes as $note_node) {
			$note_node->parentNode->removeChild($note_node);
		}

		// remove v-num
		$verse_num_nodes = $XPath->query("//span[contains(@class,'v-num')]");
		foreach ($verse_num_nodes as $verse_num_node) {
			$verse_num_node->parentNode->removeChild($verse_num_node);
		}

		// find matching verses
		//$xpath_query = "//span[contains(@class,'" . $verseid . "')]";
		$xpath_query = "//span[contains(@class,'v')]";
		$verse_nodes = $XPath->query($xpath_query);

		foreach ($verse_nodes as $verse_node) {

			//echo $verse_node->nodeValue;

			// need to double check that it's exact (DN1_1, but not DN1_12)
			if ( preg_match( '/\\b' . $verseid . '\\b/', $verse_node->attributes->getNamedItem('class')->nodeValue ) == 1) {


				$outXML = $verse_node->ownerDocument->saveXML($verse_node);
				$verse_html .= $outXML;


				// I thought this would be better, but ... I guess not
				/*
				$xml = new DOMDocument();
				$xml->preserveWhiteSpace = false;
				$xml->formatOutput = true;
				$xml->loadXML($outXML);
				$verse_html .= $xml->saveXML();
				*/

				// unnecessary I guess
				/*
				foreach($verse_node->childNodes as $child_node) {
					if (is_object($child_node)) {

						//$verse_html .= $dom->saveHTML($child_node);
						$verse_html .= $verse_node->ownerDocument->saveHTML($child_node);
					}
					$verse_html .= ' ';
				}
				*/

				//$verse_html .= $doc->saveHTML($verse_node);
				// $verse_html .= $verse_node->nodeValue;

				$verse_html .= ' ';
			}



		}

		// strange fix for PHP?
		$verse_html = str_replace('l><', 'l> <', $verse_html);
		$verse_html = str_replace('<?xml version="1.0"?>','', $verse_html);

		// TODO: highlight?

		// fix entities
		$verse_html = html_entity_decode($verse_html);

		if (is_null($verse_html) || $verse_html == null) {
			$verse_html = '';
		}

		// push into array
		$output['results'][] = array($verseid => $verse_html);
	}
} else {
	$output['error'] = 'combined_index is not an array';
}


echo
	($callback != '' ? $callback . '(' : '' ) .
	json_encode( $output ) .
	($callback != '' ? ');' : '' );

?>
