var fs = require('fs'),
	path = require('path'),
	bibleData = require('../data/bible_data.js'),
	bibleFormatter = require('../bible_formatter.js'),
	verseIndexer = require('../verse_indexer.js'),
	readline = require('readline');
	stream = require('stream');

function generate(inputPath, info, createIndex, startProgress, updateProgress) {
	var
		breakChar = '\r';
		data = {
			chapterData: [],
			indexData: {},
			indexLemmaData: {},
			infoHtml: ''
		},
		validBooks = [],
		validBookNames = [],
		validChapters = [],
		files = fs.readdirSync(inputPath),

		lastBookNumber = -1,
		lastChapterNumber = -1,
		lastVerseNumber = -1,
		currentChapter = null;


	// LOAD strongs
	var strongsPath = filePath = path.join(inputPath, 'strongs.json'),
		strongsText = fs.readFileSync(strongsPath, 'utf8')
		strongsData = JSON.parse(strongsText),
		strongsLemmaKey = {};


	for (var strongsNumber in strongsData) {
		var strongsEntry = strongsData[strongsNumber];

		strongsLemmaKey[strongsEntry.lemma] = strongsNumber;
	}

	startProgress(files.length, "Books");


	// process files
	files.forEach(function(filename) {

		if (filename.indexOf('.txt') == -1) {
			return;
		}

		var filePath = path.join(inputPath, filename),
			rawText = fs.readFileSync(filePath, 'utf8'),
			lines = rawText.split('\n');

		//console.log(filename, lines.length);

		//console.time('processTextFile');
		// READ TEXT
		for (var i=0, il=lines.length; i<il; i++) {
			var line = lines[i].trim(),
				parts = line.split(' ');

			if (parts.length <= 3) {
				continue;
			}

			var
				location = parts[0].trim()
				bookNumber = parseInt(location.substr(0,2), 10),
				chapterNumber = parseInt(location.substr(2,2), 10),
				verseNumber = parseInt(location.substr(4,2), 10),

				dbsCode = bibleData.NT_BOOKS[bookNumber-1],
				bookInfo = bibleData.getBookInfoByDbsCode( dbsCode ),

				partOfSpeech = parts[1].trim(),
				parsing = parts[2].trim(),
				word = parts[3].trim(),
				wordStripped  = parts[4].trim(),
				normalizedWord = parts[5].trim(),
				lemma = parts[6].trim(),
				strongs = strongsLemmaKey[lemma],

				dbsCode = bookInfo['dbsCode'],
				chapterCode = dbsCode + '' + chapterNumber.toString(),
				verseCode = chapterCode + '_' + verseNumber.toString();


			// new book
			if (bookNumber != lastBookNumber) {

				bookName = bibleData.getBookName(dbsCode, info['lang'])

				if (bookName == null) {
					bookName = bookInfo['name'].split('/')[0];
				}
				if (validBooks.indexOf(dbsCode) == -1) {
					validBooks.push(dbsCode)
				}
				if (validBookNames.indexOf(bookName) == -1) {
					validBookNames.push(bookName)
				}

				// reset
				lastBookNumber = bookNumber;
				lastChapterNumber = -1;
				lastVerseNumber = -1;
			}

			// new chapter
			if (chapterNumber != lastChapterNumber) {

				// close old
				if (currentChapter != null) {
					currentChapter.html +=
						'</span>' + bibleFormatter.breakChar + // verse
						'</div>' + bibleFormatter.breakChar + // paragraph
						bibleFormatter.closeChapter();
				}

				// create new
				currentChapter = {
					id: chapterCode,
					nextid: bibleData.getNextChapter(chapterCode),
					previd: bibleData.getPrevChapter(chapterCode),
					html: '',
					title: bookName + ' ' + chapterNumber,
				};
				data.chapterData.push( currentChapter );

				if (validChapters.indexOf(chapterCode) == -1) {
					validChapters.push(chapterCode)
				}


				// setup new
				currentChapter.html = bibleFormatter.openChapter(info, currentChapter);

				if (chapterNumber == 1) {
					currentChapter.html += '<div class="mt">' + bookName + '</div>' + bibleFormatter.breakChar;

				}

				currentChapter.html +=
									'<div class="c">' + chapterNumber + '</div>' + bibleFormatter.breakChar +
									'<div class="p">' + bibleFormatter.breakChar;

				lastChapterNumber = chapterNumber;
				lastVerseNumber = -1;
			}

			// new verse
			if (verseNumber != lastVerseNumber) {


				if (createIndex) {
					//verseIndexer.indexVerse(verseCode, text, data.indexData, info.lang);
				}

				if (verseNumber > 1) {
					// close
					currentChapter.html += bibleFormatter.closeVerse();
				}

				// open
				currentChapter.html += bibleFormatter.openVerse(verseCode, verseNumber.toString());

				// store
				lastVerseNumber = verseNumber;
			}

			// add word
			currentChapter.html += '<l' + (strongs != 'undefined' && typeof strongs != 'undefined' ? ' s="' + strongs + '"' : '') + ' m="' + partOfSpeech.replace('-','') + '-' + parsing.replace(/-/gi,'') + '">' + word + '</l> ';

			if (createIndex && strongs) {
				verseIndexer.indexStrongs(verseCode, strongs, data.indexLemmaData, info.lang);
			}
		}

		updateProgress();
	});

	currentChapter.html += '</span>' + bibleFormatter.breakChar +
						'</div>' + bibleFormatter.breakChar +
						+ bibleFormatter.closeChapter();



	// copy about if present
	var aboutPath = path.join(inputPath, 'about.html');
	if (fs.existsSync(aboutPath)) {
		data.aboutHtml = fs.readFileSync( aboutPath , 'utf8');
	}

	// CREATE INFO
	info.type = 'bible';
	info.divisionNames = validBookNames;
	info.divisions = validBooks;
	info.sections = validChapters;

	return data;
}




module.exports = {
	generate: generate
}
