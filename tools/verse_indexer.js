var fs = require('fs'),
	path = require('path'),
	base32 = require('base32'),
	natural = require('natural');

var
	useBase32 = true,
	removeRegChars = ['\\', '^', '$', '.', '|', '?', '*', '+', '(', ')', '[', ']', '{', '}'];
	otherRemoveChars = [
		// roman
		',',';', '!', '-', '–', '―', '—', '~', ':', '"','/', "'s", '’s', "'", '‘', '’', '“', '”', '¿', '<', '>', '&',
		// chinese
		'。', '：', '，', '”', '“', '）', '（', '~', '「', '」'
	],

	//removeChars = ['.',',',';','?','!','-','–','―','—','~',':','"',')','(','[',']','/','\\',"'s",'’s',"'",'‘','’','“','”', '¿', '*', '<','>','&','{','}'],


	restrictedWords = ['a', 'and', 'about', 'above', 'across', 'after', 'against', 'along', 'among', 'around', 'at', 'before', 'behind', 'below', 'beneath', 'beside', 'between', 'beyond', 'but', 'by', 'despite', 'down', 'during', 'except', 'for', 'from', 'in', 'inside', 'into', 'like', 'near', 'of', 'off', 'on', 'onto', 'id', 'outside', 'over', 'past', 'since', 'the', 'through', 'throughout', 'till', 'to', 'toward', 'under', 'underneath', 'until', 'up', 'upon', 'with', 'within', 'without'],
	regExp = new RegExp('(' + '\\' + removeRegChars.join('|\\') + '|' + otherRemoveChars.join('|') + ')', 'gi');

function indexVerse(verseCode, text, indexData, lang) {

	// remove punctuation
	//for (var i=0, il=removeChars.length; i<il; i++) {
	//	text = text.replace(removeChars[i], '')
	//}
	text = text.replace(regExp, '');

	var words = text.split(' ');

	if (lang == 'chs' || lang == 'cht' || lang == 'cmn' || lang == 'zho') {
		words = text;
	}

	for (var i=0, il=words.length; i<il; i++)  {
		var word = words[i].trim().toLowerCase();

		if (word != '' && restrictedWords.indexOf(word) == -1) {

			var
				key = word,
				wordData = indexData[key];

			// create it
			if (!wordData) {
				wordData = {
					"term": word,
					"occurrences": []
				}
				indexData[key] = wordData;
			}

			try {
				if (wordData['occurrences'].indexOf(verseCode) == -1) {
					wordData['occurrences'].push(verseCode);
				}
			} catch (e) {
				console.log("error", e, key);

			}
		}
	}
}

function indexStrongs(verseCode, strongsData, lemmaIndexData, lang) {

	var strongsArray = strongsData.split(' ');

	for (var i=0, il=strongsArray.length; i<il; i++) {

		var strongsNumber = strongsArray[i];

		// see if we've already started doing this word
		var wordData = lemmaIndexData[strongsNumber];


		// create it
		if (!wordData) {
			wordData = {
				"term": strongsNumber,
				"occurrences": []
			}
			lemmaIndexData[strongsNumber] = wordData;
		}

		if (wordData['occurrences'].indexOf(verseCode) == -1) {
			wordData['occurrences'].push(verseCode);
		}
	}
}

var HASHSIZE = 20;
function hashWord(word) {
    var hash = 0;
    for (i = 0; i < word.length; i++) {
        hash += word.charCodeAt(i);
        hash %= HASHSIZE;
   }
   return hash;
}


function createIndexFiles(indexPath, indexData, type) {

	//var indexArray = [],
	//	indexInfo = {};

	var hashedIndex = {};
	for (var i=0;i<HASHSIZE; i++) {
		hashedIndex[i.toString()] = {};
	}


	if (type == 'words') {

		for (var key in indexData) {

			var filename = base32.encode(unescape(encodeURIComponent(key))),
				hashed = hashWord(key),
				wordData = indexData[key],
				wordPath = path.join(indexPath, filename + '.json');

			//fs.writeFileSync(wordPath, JSON.stringify(wordData));

			hashedIndex[hashed.toString()][key] = wordData.occurrences;


			//indexArray.push(wordData.term);
			//indexInfo[wordData.term] = [key,wordData.occurrences.length];
		}


		for (var hash in hashedIndex) {
			var
				hashData = hashedIndex[hash],
				hashPath = path.join(indexPath, '_' + hash + '.json');

			fs.writeFileSync(hashPath, JSON.stringify(hashData));
		}


	} else if (type == 'strongs') {

		var groupedIndexes = {};

		/*
		for (var i=0; i<9; i++) {
			groupedIndexes['H' + i.toString() + '000'] = {};
		}
		for (var i=0; i<6; i++) {
			groupedIndexes['G' + i.toString() + '000'] = {};
		}
		*/

		for (var key in indexData) {

			var letter = key.substr(0,1),
				thousands = key.length == 5 ? key.substr(1,1) : '0',
				groupKey = letter + thousands + '000';

			//useBase32 ? base32.encode(unescape(encodeURIComponent(word))) :

			var wordData = indexData[key]	,
				wordPath = path.join(indexPath, key + '.json');

			//fs.writeFileSync(wordPath, JSON.stringify(wordData));

			if (typeof groupedIndexes[groupKey] == 'undefined') {
				groupedIndexes[groupKey] = {};
			}

			groupedIndexes[groupKey][key] = wordData.occurrences;



			//indexArray.push(wordData.term);
			//indexInfo[wordData.term] = [key,wordData.occurrences.length];
		}


		for (var groupKey in groupedIndexes) {
			var
				groupData = groupedIndexes[groupKey],
				groupPath = path.join(indexPath, '_' + groupKey + '.json');

			fs.writeFileSync(groupPath, JSON.stringify(groupData));
		}


	}

	//fs.writeFileSync(path.join(indexPath, 'indexArray.min.json'), JSON.stringify(indexArray));
	//fs.writeFileSync(path.join(indexPath, 'indexArray.json'), JSON.stringify(indexArray, null, '\t'));
	//fs.writeFileSync(path.join(indexPath, 'indexInfo.min.json'), JSON.stringify(indexInfo));
	//fs.writeFileSync(path.join(indexPath, 'indexInfo.json'), JSON.stringify(indexInfo, null, '\t'));
}



function createHashedIndexFiles(lang, indexPath, indexData, type) {

	var words_to_stem = {};
	var stem_to_words = {};	
	var stemmer = null; 
	
	switch (lang) {
		case 'eng':
			stemmer = natural.PorterStemmer;
			break;
		case 'esp':
			stemmer = natural.PorterStemmerEs;
			break;					
	}
	
	//console.log('trying to create index', stemmer);

	if (type == 'words' && stemmer != null) {
		
		// make stems
		for (var key in indexData) {
			
			var wordData = indexData[key],
				stemmedWord = stemmer.stem(key);
				
			words_to_stem[key] = stemmedWord;
				
			var words_from_stem = stem_to_words[stemmedWord];
			
			if (typeof words_from_stem == 'undefined') {
				stem_to_words[stemmedWord] = [];
			}			

			stem_to_words[stemmedWord].push(key);
		}

		//console.log(stemData);
		
		fs.writeFileSync(path.join(indexPath, 'words_to_stem.js'), JSON.stringify(words_to_stem));
		fs.writeFileSync(path.join(indexPath, 'stem_to_words.js'), JSON.stringify(stem_to_words));		

	} else if (type == 'strongs') {


	}
}

module.exports = {
	createIndexFiles: createIndexFiles,
	createHashedIndexFiles: createHashedIndexFiles,
	indexVerse: indexVerse,
	indexStrongs: indexStrongs

}
