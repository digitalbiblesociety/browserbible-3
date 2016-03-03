var fs = require('fs'),
	path = require('path'),
	bibleData = require('../data/bible_data.js'),
	bibleFormatter = require('../bible_formatter.js'),
	verseIndexer = require('../verse_indexer.js'),
	readline = require('readline'),
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
		filesInputPath = path.join(inputPath,'Unicode'),
		bookCodes =  ["MT","MR","LU","JOH","AC","RO","1CO","2CO","GA","EPH","PHP","COL","1TH","2TH","1TI","2TI","TIT","PHM","HEB","JAS","1PE","2PE","1JO","2JO","3JO","JUDE","RE"],
			//["MT"],
		lastBookNumber = -1,
		lastChapterNumber = -1,
		lastVerseNumber = -1,
		currentChapter = null;


	startProgress(bookCodes.length, "Books");

	// process files
	bookCodes.forEach(function(bookCode) {

		var filePath = path.join(filesInputPath, bookCode + '.txt'),
			rawText = fs.readFileSync(filePath, 'utf8'),
			lines = rawText.split('\n'),
			bookIndex = bookCodes.indexOf(bookCode),
			bookName = '',
			dbsBookCode = bibleData.NT_BOOKS[bookIndex],
			isNewBook = true,
			bookInfo = bibleData.getBookInfoByDbsCode( dbsBookCode );

		//console.log(bookCode, lines.length, dbsBookCode);

		//console.time('processTextFile');
		// READ TEXT
		for (var i=0, il=lines.length; i<il; i++) {
			var line = lines[i].trim(),
				parts = line.split(' ');

			if (parts.length <= 3) {
				continue;
			}

			var
				verseParts = parts[1].trim().split(/[\.:]/gi),
				chapterNumber = parseInt(verseParts[0], 10),
				verseNumber = parseInt(verseParts[1], 10),

				lineType = parts[2].trim(),
				word = parts[3].trim(),
				morph = parts[5].trim(),
				strongs = parts[6].trim(),

				chapterCode = dbsBookCode + '' + chapterNumber.toString(),
				verseCode = chapterCode + '_' + verseNumber.toString();



			// new book
			if (isNewBook) {

				bookName = bibleData.getBookName(dbsBookCode, info['lang']);

				if (bookName == null) {
					bookName = bookInfo['name'].split('/')[0];
				}
				if (validBooks.indexOf(dbsBookCode) == -1) {
					validBooks.push(dbsBookCode)
				}
				if (validBookNames.indexOf(bookName) == -1) {
					validBookNames.push(bookName)
				}

				// reset
				lastChapterNumber = -1;
				lastVerseNumber = -1;
				isNewBook = false;
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
					title: bookName + ' ' + chapterNumber,
					html: ''
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

					if (lineType == 'P') {
						currentChapter.html += '<p>\n<p>\n';
					}
				}

				// open
				currentChapter.html += bibleFormatter.openVerse(verseCode, verseNumber.toString());

				// store
				lastVerseNumber = verseNumber;
			}

			// add word
			currentChapter.html += '<l ' + (strongs != 'undefined' && typeof strongs != 'undefined' ? 's="' + 'G' + strongs + '"' : '') + ( morph ? ' m="' + morph + '"' : '') + '>' + word + '</l> ';


			if (createIndex && strongs) {
				verseIndexer.indexStrongs(verseCode, 'G' + strongs, data.indexLemmaData, info.lang);
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
