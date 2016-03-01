var fs = require('fs'),
	path = require('path'),
	base32 = require('base32'),
	natural = require('natural');
	


var content_path = '../../app/content/texts/';

var stemmers = {
		'eng': '', 
		'esp': 'Es', 
		'spa': 'Es',
	
		'fas': 'Fa',		
		'fra': 'Fr',		
		'ita': 'It',		
		'jpn': 'Ja',		
		'nor': 'No',		
		'pol': 'Pl',
		'rus': 'Ru'
		
};

/*
function create_stems(version) {
	var version_path = path.join(content_path, version),
		version_info_path = path.join(version_path, 'info.json'),
		version_index_path = path.join(version_path, 'index'),
		version_stem_path = path.join(version_index_path, 'stems.json');
		stemmer = null;
		
	// load info
	var info = JSON.parse(fs.readFileSync(version_info_path, 'utf8'));
	
	if (typeof stemmers[info.lang] != 'undefined') {
		
		stemmer = natural['PorterStemmer' + stemmers[info.lang]];
	} else {
		
		console.log('No Stemmer for lang: ' + info.lang);		
		
		return;
	}
	
	
	var index_files = fs.readdirSync(version_index_path),
		stem_data = {
			words_to_stem: {},
			stem_to_words: {}				
		};
	
	for (var i=0,il = index_files.length; i<il; i++) {
		var index_file_name = index_files[i],
			index_file_path = path.join(version_index_path, index_file_name);
		
		// only use _1.js, _2.js, etc.
		if (index_file_name.substring(0,1) != '_') {
			continue;
		}
		
		var index_data = JSON.parse(fs.readFileSync(index_file_path, 'utf8'));
	
	
		// make stems
		for (var key in index_data) {
			
			var wordData = index_data[key],
				stemmedWord = stemmer.stem(key);
			
			// put in stem	
			stem_data.words_to_stem[key] = stemmedWord;
				
			// add to words
			var words_from_stem = stem_data.stem_to_words[stemmedWord];			
			if (typeof words_from_stem == 'undefined') {
				stem_data.stem_to_words[stemmedWord] = [];
			}			

			stem_data.stem_to_words[stemmedWord].push(key);
		}	
	}

	//console.log(stemData);
	
	
	// SORT
	var sorted_stem_data =  {
		words_to_stem: {},
		stem_to_words: {}					
	};
	
	var words_to_stem_keys = Object.keys(stem_data.words_to_stem),
		stem_to_words_keys = Object.keys(stem_data.stem_to_words);
		
	words_to_stem_keys.sort();
	stem_to_words_keys.sort();				
	
	for (var k=0,kl = words_to_stem_keys.length; k<kl; k++) { 
		sorted_stem_data.words_to_stem[ words_to_stem_keys[k] ] = stem_data.words_to_stem[ words_to_stem_keys[k] ];
	}
	
	for (var k=0,kl = stem_to_words_keys.length; k<kl; k++) { 
		sorted_stem_data.stem_to_words[ stem_to_words_keys[k] ] = stem_data.stem_to_words[ stem_to_words_keys[k] ];
	}		
	
	
	fs.writeFileSync(version_stem_path, JSON.stringify(sorted_stem_data, null, '\t'));		
	
}
*/

function create_stems_index_from_version(version) {
	var version_path = path.join(content_path, version),
		version_info_path = path.join(version_path, 'info.json'),
		info = JSON.parse(fs.readFileSync(version_info_path, 'utf8'));
		
	create_stems_index(version, info, version_path);		
}


function create_stems_index(version, info, version_path) {
	var version_index_path = path.join(version_path, 'index'),
		version_stem_path = path.join(version_index_path, 'stems.json');
		stemmer = null;
		
	console.log('Stemming: ', info.name, info.abbr);	
	console.time('startStem');
	
	// get language stemmer
	if (typeof stemmers[info.lang] != 'undefined') {
		
		stemmer = natural['PorterStemmer' + stemmers[info.lang]];
	} else {
		
		console.log(' == No Stemmer for lang: ' + info.lang);		
		
		return;
	}
	
	
	var index_files = null;
	
	try {
		index_files = fs.readdirSync(version_index_path);
	} catch (ex) {
		console.log(' Cannot open index: ' + version_index_path);		
		
		return;		
	}

	
	var stem_data = {
			stemmed_index: {},
			words_to_stem: {}				
		};
	
	for (var i=0,il = index_files.length; i<il; i++) {
		var index_file_name = index_files[i],
			index_file_path = path.join(version_index_path, index_file_name);
		
		// only use _1.js, _2.js, etc.
		if (index_file_name.indexOf('_') != 0 || index_file_name.indexOf('stem') > -1) {
			continue;
		}
		
		var index_data = JSON.parse(fs.readFileSync(index_file_path, 'utf8'));
	
		// make stems
		for (var key in index_data) {
			
			var word_data = index_data[key],
				stemmed_word = stemmer.stem(key),
				stem_index_data = stem_data.stemmed_index[stemmed_word];
			
			// new stemmed indexes
			if (typeof stem_index_data == 'undefined') {
				stem_data.stemmed_index[stemmed_word] = {
					words: [],
					fragmentids: []
				};
				
			}			
			stem_data.stemmed_index[stemmed_word].words.push( key );
			stem_data.stemmed_index[stemmed_word].fragmentids = 
						stem_data.stemmed_index[stemmed_word].fragmentids.concat( word_data );
			
			// loving => love :: stems.js	
			stem_data.words_to_stem[key] = stemmed_word;
				
		}
	}


	// stems.js SORT and SAVE
	var sorted_words_to_stem = sort_object_keys( stem_data.words_to_stem );
	fs.writeFileSync(version_stem_path, JSON.stringify( sorted_words_to_stem , null, '\t'));		

	
	var sorted_stemmed_index = sort_object_keys( stem_data.stemmed_index );	
	fs.writeFileSync(version_stem_path.replace('.js','_all.js'), JSON.stringify( sorted_stemmed_index , null, '\t'));		
	//return;
	
	// index files
	
	// sort occurences
	for (var stem_key in stem_data.stemmed_index) {

		stem_data.stemmed_index[stem_key].fragmentids.sort(compare_dbs_verse);
	}	
	
	
	// hash the stems into individual files
	var hashed_index = {};
	for (var i=0;i<HASHSIZE; i++) {
		hashed_index[i.toString()] = {};
	}		
	
	for (var stem_key in stem_data.stemmed_index) {

		var hashed_stem_key = hash_word(stem_key),
			stem_word_data = stem_data.stemmed_index[stem_key];

		hashed_index[hashed_stem_key.toString()][stem_key] = stem_word_data;
	}


	for (var hash_number in hashed_index) {
		var
			hash_data = hashed_index[hash_number],
			hash_path = path.join(version_index_path, '_stems_' + hash_number + '.json');

		fs.writeFileSync(hash_path, JSON.stringify(hash_data, null, '\t'));
	}
	
		
	console.timeEnd('startStem');
	
}

var HASHSIZE = 20;
function hash_word(word) {
    var hash = 0;
    for (i = 0; i < word.length; i++) {
        hash += word.charCodeAt(i);
        hash %= HASHSIZE;
   }
   return hash;
}

function sort_object_keys(obj) {
	
	var sorted_obj = {},
		obj_keys = Object.keys(obj);
		
	obj_keys.sort();
	
	for (var i=0,il = obj_keys.length; i<il; i++) { 
		sorted_obj[ obj_keys[i] ] = obj[ obj_keys[i] ];
	}	
	
	return sorted_obj;
}

function compare_dbs_verse(ref1, ref2) {
	
	var dbs_book_order = ["GN", "EX", "LV", "NU", "DT", "JS", "JG", "RT", "S1", "S2", "K1", "K2", "R1", "R2", "ER", "NH", "ET", "JB", "PS", "PR", "EC", "SS", "IS", "JR", "LM", "EK", "DN", "HS", "JL", "AM", "OB", "JH", "MC", "NM", "HK", "ZP", "HG", "ZC", "ML", "TB", "JT", "ED", "AE", "WS", "SR", "BR", "LJ", "S3Y", "SN", "BL", "M1", "M2", "E1", "MT", "MK", "LK", "JN", "AC", "RM", "C1", "C2", "GL", "EP", "PP", "CL", "H1", "H2", "T1", "T2", "TT", "PM", "HB", "JM", "P1", "P2", "J1", "J2", "J3", "JD", "RV"];
	
	if (ref1 === ref2) {
		return 0;
	} else {
		var ref1_b = ref1.substring(0,2),
			ref1_bi = dbs_book_order.indexOf(ref1_b),
			ref1_parts = ref1.length > 2 ? ref1.substring(2).split('_') : [],
			ref1_c = ref1_parts.length > 0 ? parseInt(ref1_parts[0],10) : 0,
			ref1_v = ref1_parts.length > 1 ? parseInt(ref1_parts[1],10) : 0,

			ref2_b = ref2.substring(0,2),
			ref2_bi = dbs_book_order.indexOf(ref2_b),
			ref2_parts = ref2.length > 2 ? ref2.substring(2).split('_') : [],
			ref2_c = ref2_parts.length > 0 ? parseInt(ref2_parts[0],10) : 0,
			ref2_v = ref2_parts.length > 1 ? parseInt(ref2_parts[1],10) : 0;
			
		// check for non-matching book
		if (ref1_bi == -1) {
			return -1;
		}	
		if (ref2_bi == -1) {
			return 1;
		}
		
		if (ref1_bi > ref2_bi) {
			return 1;
			
		} else if (ref1_bi < ref2_bi) {
			return -1;
			
		} else if (ref1_bi == ref2_bi) {
			
			if (ref1_c > ref2_c) {
				return 1;
				
			} else if (ref1_c < ref2_c) {
				return -1;
				
			} else if (ref1_c == ref2_c) {
		
				if (ref1_v > ref2_v) {
					return 1;
					
				} else if (ref1_v < ref2_v) {
					return -1;
					
				} else if (ref1_v == ref2_v) {
					return 0;
					
				}
			}				
		}
	}	
}


function stem_all_available_languages() {
	var overwrite_all = true;


	var text_folders = fs.readdirSync(content_path),
		langs = Object.keys(stemmers);
	
	for (var i=0, il=text_folders.length; i<il; i++) {
		var version_path = path.join(content_path, text_folders[i]);
		
		if (fs.lstatSync(version_path).isDirectory()) {
			
			
			
			var info_path = path.join(version_path, 'info.json');			
				version_info_path = path.join(version_path, 'info.json');
			
			if (fs.existsSync(version_info_path)) {
				
				var info = JSON.parse(fs.readFileSync(version_info_path, 'utf8')),
					has_stemmer = langs.indexOf(info.lang) > -1;
					
				if (has_stemmer && info.type == 'bible') {
					try {
						create_stems_index(info.id, info, version_path);		
					} catch (ex) {
						console.log('error', ex);
					}
				}
				//console.log(info.name, );	
			
				
			}			
		}
	}
}


stem_all_available_languages();

//create_stems_index_from_version('spa_rv1909');

/*
var verse_array = ['GN1','GN2','IS1','RV12_2','K11','RV12_1'];
verse_array.sort(compare_dbs_verse);


console.log(verse_array);
*/