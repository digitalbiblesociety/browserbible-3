var fs = require('fs'),
	path = require('path'),
	bibleData = require('../data/bible_data.js'),
	bibleReference = require('../data/bible_reference.js'),
	bibleFormatter = require('../bible_formatter.js'),
	verseIndexer = require('../verse_indexer.js');
	readline = require('readline');
	stream = require('stream');

function generate(inputPath, info, createIndex, startProgress, updateProgress) {
	var
		sourceFilePath = path.join(inputPath, info['filename']),
		aboutPath = path.join(inputPath,'about.html'),
		breakChar = bibleFormatter.breakChar;
		data = {
			chapterData: [],
			indexData: {},
			lemmaindexData: {},
			aboutHtml: fs.existsSync(aboutPath) ? fs.readFileSync(aboutPath, 'utf8') : ''
		}
		;

	if (!fs.existsSync(sourceFilePath)) {
		console.log('MSSING', sourceFilePath);
		return;
	}


	var bookMap = { Gen: 'GN',
  Exo: 'EX',
  Lev: 'LV',
  Num: 'NU',
  Deu: 'DT',
  Jos: 'JS',
  Jdg: 'JG',
  Rth: 'RT',
  '1Sa': 'S1',
  '2Sa': 'S2',
  '1Ki': 'K1',
  '2Ki': 'K2',
  '1Ch': 'R1',
  '2Ch': 'R2',
  Ezr: 'ER',
  Neh: 'NH',
  Est: 'ET',
  Job: 'JB',
  Psa: 'PS',
  Pro: 'PR',
  Ecc: 'EC',
  Son: 'SS',
  Isa: 'IS',
  Jer: 'JR',
  Lam: 'LM',
  Eze: 'EK',
  Dan: 'DN',
  Hos: 'HS',
	Joe: 'JL',
  Amo: 'AM',
	Oba: 'OB',
  Jon: 'JH',
	Mic: 'MC',
  Nah: 'NM',
  Hab: 'HK',
  Zep: 'ZP',
  Hag: 'HG',
  Zec: 'ZC',
  Mal: 'ML',
  Tob: 'TB',
  Jdt: 'JT',
  Bar: 'BR',
	Lje:	'LJ',
	'S3y':	'PA',
	'1Es':	'E1',
	Wis:	'WS',
	Sir:	'SR',
	Sus:	'SN',
	Bel:	'BL',
	'1Ma':	'M1',
	'2Ma':	'M2',
	'3Ma':	'M3',
	Man:	'PN',
  Mat: 'MT',
  Mar: 'MK',
  Luk: 'LK',
  Joh: 'JN',
  Act: 'AC',
  Rom: 'RM',
  '1Co': 'C1',
  '2Co': 'C2',
  Gal: 'GL',
  Eph: 'EP',
  Phi: 'PP',
  Col: 'CL',
  '1Th': 'H1',
  '2Th': 'H2',
  '1Ti': 'T1',
  '2Ti': 'T2',
  Tit: 'TT',
  Phm: 'PM',
  Heb: 'HB',
  Jam: 'JM',
  '1Pe': 'P1',
  '2Pe': 'P2',
  '1Jo': 'J1',
  '2Jo': 'J2',
  '3Jo': 'J3',
  Jud: 'JD',
  Rev: 'RV' }

	//for (var x in bookMap) {
	//	console.log( x, bookMap[x] );
	//}


	// SETUP
	var
		validBooks = [],
		validBookNames = [],
		validChapters = [],
		currentChapter = null,
		chaperIndex = 0,
		rawText = fs.readFileSync( sourceFilePath , 'utf8'),
		lines = rawText.split('\n'),
		foundFirstVerse = false,

		startBookIndex = 0,
		endBookIndex = 35,

		startChapterIndex = 35,
		endChapterIndex = 1207,

		startVerseIndex = 1207,
		endVerseIndex = lines.length,
		//endVerseIndex = startVerseIndex + 50,

		bookIntros = {},
		chapterIntros = {},

		bookNames = {};

	//console.log('lines:', lines.length);

	// PROCESS BOOKS
	for (var i=startBookIndex, il=endBookIndex; i<il; i++) {
		var line = lines[i].trim(),
			verseBookCode = line.substr(0,3),
			dbsBookCode = bookMap[verseBookCode],
			text = line.substr(4);

		bookIntros[dbsBookCode] = text;
	}

	for (var i=startChapterIndex, il=endChapterIndex; i<il; i++) {
		var line = lines[i].trim(),
			colonIndex = line.indexOf(':'),
			text = line.substr(colonIndex + 1),
			verseBookCode = line.substr(0,3),
			dbsBookCode = bookMap[verseBookCode],
			chapterNumber = line.substr(4,colonIndex-4),

			chapterCode =dbsBookCode+chapterNumber;

		text = text.replace('<b>Overview</b><br>', '<div class="is">Overview</div>'); // <div class="p">');


		text = text.replace(/<u>([^<]+)<\/u>,/gi,function(m, a) {
			var textRef = a,
				r = null,
				s = '';

			// fix missing
			for (var x in bookMap) {
				textRef = textRef.replace(x + '_', bookMap[x]);
			}

			r = new bibleReference(textRef);

			if (typeof r.toSection != 'undefined') {
				s =  '<span class="bibleref" data-id="' + r.toSection() + '">' + r.chapterAndVerse() + '</span>';
			} else {
				console.log('err', a);
			}

			lastReference = r;

			return s;
		});

		//text += '</div>';

		chapterIntros[chapterCode] = text;
	}

	//console.log(bookIntros);


	startProgress(endVerseIndex-startVerseIndex, 'Lines');


	//console.time('processTextFile');
	// READ TEXT
	for (var i=startVerseIndex, il=endVerseIndex; i<il; i++) {
		var line = lines[i].trim();

		updateProgress();


		var
			firstBracket = line.indexOf('<'),
			verseReference = line.substr(0, firstBracket-1).trim(),
			text = line.substr(firstBracket),

			verseMainParts = verseReference.split(' ')

			// TODO: convert
			verseBookCode = verseMainParts[0],
			dbsBookCode = bookMap[verseBookCode],

			verseReferenceParts = verseMainParts.length > 1 ? verseMainParts[1].split(':') : [],

			chapterNumber = verseReferenceParts.length > 0 ? verseReferenceParts[0] : '',
			verseNumber = verseReferenceParts.length > 1 ? verseReferenceParts[1] : '',
			bookInfo = bibleData.getBookInfoByDbsCode(dbsBookCode);

		/*
		if (bookInfo == null) {
			if (missingBooks.indexOf(dbsBookCode) == -1)  {
				missingBooks.push(dbsBookCode);

				bookMatches[verseBookCode] = 'XXXXXXX';
			}
			//console.log("Can't find: " + unboundCode);
			continue;
		} else {
			bookMatches[verseBookCode] = bookInfo.dbsCode;

		}
		continue;
		*/

		if (verseNumber == '' || chapterNumber == '') {
			//console.log("missing: " , verseBookCode, verseNumber, chapterNumber);
			continue;
		}

		// process text


		// between words
		text = text.replace(/<br><br><b>/gi, 	'<b>');


		// between headings and a list of verses
		text = text.replace(/<\/b><br>/gi, 		'</b>');
		// between verses
		text = text.replace(/<\/u><br><u>/gi, 	'</u>; <u>');


		// between reciprocal
		text = text.replace(/<br><u>/gi, 		'; <u>');

		// headings
		text = text.replace(/<b>/gi, 			'<span class="note-word">');
		text = text.replace(/:<\/b>/gi, 		'</span>');

		// references

		var lastReference = {bookid: ''};
		text = text.replace(/<u>([^<]+)<\/u>/gi,function(m, a) {
			var textRef = a,
				r = null,
				s = '';

			for (var x in bookMap) {
				textRef = textRef.replace(x + '_', bookMap[x]);
			}

			r = new bibleReference(textRef);

			if (typeof r.toSection != 'undefined') {
				s =  '<span class="bibleref" data-id="' + r.toSection() + '">' + (r.bookid == lastReference.bookid ? r.chapterAndVerse() : r.toString()) + '</span>';
			} else {
				s = '<span class="bibleref">' + a + '</span>';
			}

			lastReference = r;

			return s;
		});


		//text = text.replace(/<u>/gi, 	'<span class="bibleref">');
		//text = text.replace(/<\/u>/gi,	'</span>');



		// add text to chapter.json
		dbsBookCode = bookInfo['dbsCode'];
		bookName = bibleData.getBookName(dbsBookCode, info['lang'])

		if (bookName == null) {
			bookName = bookInfo['name'].split('/')[0];
		}

		dbsChapterCode = dbsBookCode + '' + chapterNumber;
		dbsVerseCode = dbsChapterCode + '_' + verseNumber;

		//console.log(dbsVerseCode, verseNumber);

		// add to arrays
		if (validBooks.indexOf(dbsBookCode) == -1) {
			validBooks.push(dbsBookCode)
		}
		if (validBookNames.indexOf(bookName) == -1) {
			validBookNames.push(bookName)
		}
		if (validChapters.indexOf(dbsChapterCode) == -1) {
			validChapters.push(dbsChapterCode)
		}

		if (verseNumber == '1') {
			// close final paragraph of last chapter
			//if (currentChapter != null) {
			//	currentChapter["html"] += "</div>" + breakChar;
			//}

			// start new chapter
			currentChapter = {
				id: dbsChapterCode,
				nextid: null,
				lastid: null,
				html: '',
				title: bookName + ' ' + chapterNumber,
			};

			data.chapterData.push(currentChapter);


			if (chapterNumber == '1') {
				currentChapter['html'] += '<div class="mt">' + bookName + '</div>' + breakChar;

				if (typeof bookIntros[dbsBookCode] != 'undefined') {
					currentChapter['html'] += '<div class="ip">' + bookIntros[dbsBookCode] + '</div>' + breakChar;
				}
			}



			currentChapter['html'] += '<div class="mt2">' + bookName + ' ' + chapterNumber + '</div>' + breakChar;

			var ccode = dbsBookCode + chapterNumber;

			if (typeof chapterIntros[ccode] != 'undefined') {
				//currentChapter['html'] += '<div class="p">' + chapterIntros[ccode] + '</div>' + breakChar;
				currentChapter['html'] += chapterIntros[ccode]  + breakChar;
			}

		}

		currentChapter['html'] +=
				//bibleFormatter.openVerse(verseCode, verseNumber) +
				'<span class="comm-v-num">Verse ' + verseNumber + '</span>' +
				//'<div class="p">' + breakChar +
					'<span class="v ' + dbsVerseCode + '" data-id="' + dbsVerseCode + '">' +
						text +
					'</span>' + breakChar;
				//'</div>' + breakChar;

		if (createIndex) {
			verseIndexer.indexVerse(dbsVerseCode, text, data.indexData, info.lang);
		}

	}

	// UPDATE with chapter wrappers and prev/next
	for (var i=0, il=data.chapterData.length; i<il; i++) {

		// do prev/next
		var thisChapter = data.chapterData[i];

		thisChapter.previd = (i > 0) ? data.chapterData[i-1]['id'] : null;
		thisChapter.nextid = (i < il-1) ? data.chapterData[i+1]['id'] : null;


		thisChapter.html =
			//'<!-- start -->\n' +
			bibleFormatter.openChapter(info, thisChapter) +
			//'\n<!-- end -->\n' +
			thisChapter.html +
			bibleFormatter.closeChapter();
	}

	// CREATE INFO
	delete info.filename;

	info.divisionNames = validBookNames;
	info.divisions = validBooks;
	info.sections = validChapters;

	return data;
}




module.exports = {
	generate: generate
}
