<?php
/**
 * Spec here: http://www.crockford.com/wrmg/base32.html
 * I took the liberty of collapsing the decode of 'u' into 'v's slot, since that matches the visual funnelling of L, I, and O.
 * 
 * @package default
 * @author Bryan Elliott
 * 
 * @author johnder
 * Changed to match javascript version
 **/
class Crock32 {
	static private $encodeMap = array(0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f','g','h','h','k','m','n','p','q','r','t','u','v','w','x','y','z');
	static private $decodeMap = array('L'=>1,'I'=>1,'O'=>0,'S'=>5);
	static private function decodeMap($ch) {
		if (empty(self::$decodeMap['a'])) 
			forEach(self::$encodeMap as $i=>$v) self::$decodeMap[$v]=$i;
		return self::$decodeMap[strToUpper($ch)];
	}
	static private function bitsFromString($str) {
		$bStr = array();
		for ($i=0; $i<strlen($str); $i++)
			$bStr[]= str_pad(base_convert(ord($str[$i]), 10, 2), 8, '0', STR_PAD_LEFT);
		return join('', $bStr);		
	}
	static private function b32FromBits($bits) {
		$bStr = str_split($bits, 5);
		$enc='';
		for($i=0; $i<count($bStr); $i++) 
			$enc.=self::$encodeMap[base_convert(str_pad($bStr[$i],5,'0'),2,10)];
		return $enc;		
	}
	static private function bitsFromb32($str) {
		$bStr=array();
		$str = preg_replace('/[^\d\w]/','',$str);
		for ($i=0; $i<strlen($str); $i++) 
			$bStr[]=str_pad(base_convert(self::decodeMap($str[$i]),10,2),5,'0',STR_PAD_LEFT);
		return join('', $bStr);
	}
	static private function stringFromBits($bits) {
		$bStr = str_split(substr($bits,0,floor(strlen($bits)/8)*8), 8);
		$ret = '';
		for ($i=0; $i<count($bStr); $i++) {
			$b = $bStr[$i];
			$o = base_convert($b, 2, 10);
			$c = chr($o);
			$ret.=$c;
		}
		return $ret;
	}
	static function encode($str) {
		return self::b32FromBits(self::bitsFromString($str));
	}
	static function decode($enc) {
		return self::stringFromBits(self::bitsFromb32($enc));
	}
}


/// DATAT
$dbsBookCodes = array("GN","EX","");
$isLemmaRegExp = '/(G|H)\\d{1,6}/';
$base32 = new Crock32();

//// START UP
$textid = $_GET['textid'];
$search = $_GET['search'];
$output = array(
	"results" => array(),
	"textid" => $textid,
	"search" => $search
);


// SEARCH TYPE
$search_type = "AND";
$is_lemma_search = preg_match($isLemmaRegExp, $search);


// TODO: detect strongs search
// SPLIT INDEXES, LOAD INDEX FILES
$indexes = array();
$words = split(' ', $search);
foreach ($words as &$word) {

	$path_to_index = './content/texts/' . $textid;

	if ($is_lemma_search) {
		$path_to_index .= '/indexlemma/' . $word . '.json';		
		
	} else {
		// load index	
		$base_word = $base32->encode( utf8_encode(trim($word)) );
		$path_to_index .= '/index/' . $base_word . '.json';		
	}
	
		
	if (file_exists($path_to_index)) {
		$file_contents = file_get_contents($path_to_index);
		$json_data = json_decode($file_contents);
	
		// store this index along with other words to be combined later
		$indexes[] = $json_data->occurrences;
	}	
}

// Combined index
$combined_index = array();
$index_count = count($indexes);

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

// load the data
foreach ($combined_index as &$verseid) {
	//$chapter_code = substr($verseid, 0, 2);
	$chapter_code = split('_', $verseid)[0];
	$verse_html = '';
	
	// load chapter
	$path_to_index = './content/texts/' . $textid . '/' . $chapter_code . '.html';
	
	if (!file_exists($path_to_index)) {
		continue;
	}
	
	$file_contents = file_get_contents($path_to_index);
	
	// supress HTML5 errors
	$doc = new DOMDocument();
	
	$doc->preserveWhiteSpace = true;
	$doc->formatOutput       = true;
		
	libxml_use_internal_errors(true);
	$doc->loadHTML($file_contents);
	libxml_clear_errors();
	$XPath = new DOMXPath($doc);
	
			
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
	$xpath_query = "//span[contains(@class,'" . $verseid . "')]";
	$verse_nodes = $XPath->query($xpath_query);
		
	foreach ($verse_nodes as $verse_node) {
		
		//echo $verse_node->nodeValue;
		
		// need to double check that it's exact (DN1_1, but not DN1_12)
		if ( preg_match( '/\\b' . $verseid . '\\b/', $verse_node->attributes->getNamedItem('class')->nodeValue ) == 1) {
			$verse_html .= $doc->saveHTML($verse_node);
			// $verse_html .= $verse_node->nodeValue;			
		}
		
	}
	
	// TODO: highlight?
	
	// push into array
	$output[results][] = array($verseid => $verse_html);
}


header('Content-type: application/json');
echo json_encode( $output );

?>