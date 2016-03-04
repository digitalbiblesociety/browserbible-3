var fs = require('fs'),
	path = require('path'),
	bibleData = require('../data/bible_data.js'),
	bibleFormatter = require('../bible_formatter.js'),
	readline = require('readline');
	stream = require('stream'),
	verseIndexer = require('../verse_indexer.js');

function generate(inputPath, info, createIndex, startProgress, updateProgress) {
	var
		sourceFilePath = path.join(inputPath, info['filename']),
		breakChar = '\r';
		data = {
			chapterData: [],
			indexData: {},
			lemmaindexData: {},
			aboutHtml: '<dt>Source</dt><dd>Text provided by the <a href="http://unbound.biola.edu/">Unbound Bible</a> project from Biola University.</dd>'
		}
		;

	if (!fs.existsSync(sourceFilePath)) {
		console.log('MSSING', sourceFilePath);
		return;
	}


	// SETUP
	var
		validBooks = [],
		validBookNames = [],
		validChapters = [],
		//chapterData = [],
		//indexData = {},
		currentChapter = null,
		chaperIndex = 0,
		rawText = fs.readFileSync( sourceFilePath , 'utf8'),
		lines = rawText.split('\r');

	//console.log('lines:', lines.length);

	startProgress(lines.length, 'Lines');


	//console.time('processTextFile');
	// READ TEXT
	for (var i=0, il=lines.length; i<il; i++) {
		var line = lines[i].trim();

		updateProgress();

		var parts = line.split('\t')
		if (line.substring(0,1) == '#' || parts.length <= 3) {
			continue;
		}

		var unboundCode = parts[0].trim(),
			bookInfo = bibleData.getBookInfoByUnboundCode(unboundCode),
			chapter = parts[1].trim(),
			verse = parts[2].trim(),
			text = '';

		if (bookInfo == null) {
			console.log("Can't find: " + unboundCode);
			continue;
		}

		if (parts.length == 9) {
			text = parts[8].trim();
		} else if (parts.length == 4) {
			text = parts[3].trim();
		}


		// add text to chapter.json
		dbsCode = bookInfo['dbsCode'];
		bookName = bibleData.getBookName(dbsCode, info['lang'])

		if (bookName == null) {
			bookName = bookInfo['name'].split('/')[0];
		}

		chapterCode = dbsCode + '' + chapter;
		verseCode = chapterCode + '_' + verse;


		// add to arrays
		if (validBooks.indexOf(dbsCode) == -1) {
			validBooks.push(dbsCode)
		}
		if (validBookNames.indexOf(bookName) == -1) {
			validBookNames.push(bookName)
		}
		if (validChapters.indexOf(chapterCode) == -1) {
			validChapters.push(chapterCode)
		}

		if (verse == '1') {
			// close final paragraph of last chapter
			if (currentChapter != null) {
				currentChapter["html"] += "</div>" + breakChar;
			}

			// start new chapter
			currentChapter = {
				id: chapterCode,
				nextid: null,
				lastid: null,
				html: '',
				title: bookName + ' ' + chapter,
			};

			data.chapterData.push(currentChapter)

			if (chapter == '1') {
				currentChapter['html'] += '<div class="mt">' + bookName + '</div>' + breakChar;

				//if verbose_output:
				//	print info['abbr'] + '::' + book_name

			}

			currentChapter['html'] += '<div class="c">' + chapter + "</div>" + breakChar;
			currentChapter['html'] += '<div class="p">' + breakChar;
		}

		currentChapter['html'] +=
				bibleFormatter.openVerse(verseCode, verse) +
				text +
				bibleFormatter.closeVerse();

		if (createIndex) {
			verseIndexer.indexVerse(verseCode, text, data.indexData, info.lang);
		}

	}
	//console.timeEnd('processTextFile');

	//console.time('addChapters');

	//console.log( 'chapters: ' + data.chapterData.length);
	//console.log('data.indexData',data.indexData.length);

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
	//console.timeEnd('addChapters');


	// CREATE INFO
	delete info.filename;

	info.type = 'bible';
	info.divisionNames = validBookNames;
	info.divisions = validBooks;
	info.sections = validChapters;

	// CREATE ABOUT
	data.infoHtml =
			'<h1>' + info['name'] + '</h1>' +
			'<dl>' +
				'<dt>Information</dt><dd>Text from from Biola\'s Unbound Bible project</dd>' +
				'<dt>Source</dt><dd><a href="http://unbound.biola.edu/">http://unbound.biola.edu/</a></dd>' +
			'</dl>';

	return data;
}




module.exports = {
	generate: generate
}
