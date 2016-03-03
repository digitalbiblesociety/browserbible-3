var fs = require('fs'),
	path = require('path'),
	jsdom = require("jsdom"),
	$ = require('jquery')(jsdom.jsdom('').defaultView),
	bibleData = require('../data/bible_data.js'),
	bibleFormatter = require('../bible_formatter.js'),
	verseIndexer = require('../verse_indexer.js');

function generate(inputPath, info, createIndex, startProgress, updateProgress) {

	var
		data = {
			chapterData: [],
			indexData: {},
			indexLemmaData: {},
			aboutHtml: ''
		}
		BOOK_LIST = ['RT'],
		breakChar = '\n';

	BOOK_LIST = bibleData.OT_BOOKS;

	data.aboutHtml = fs.readFileSync( path.join(inputPath, 'about.html'), 'utf8')

	// update info
	info.type = 'bible';
	info.divisions = [];
	info.divisionNames = [];
	info.sections = [];

	startProgress(BOOK_LIST.length, 'Books');

	// process books
	for (var i=0,il=BOOK_LIST.length; i<il; i++) {
		var dbsBookCode = BOOK_LIST[i],
			bookInfo = bibleData.getBookInfoByDbsCode(dbsBookCode),
			osisCode = bookInfo.osis,
			bookIndex = i,
			bookName = bibleData.getBookName(dbsBookCode, 'heb'),
			bookFilePath = path.join(inputPath, osisCode + '.xml');

		info.divisionNames.push(bookName);
		info.divisions.push(dbsBookCode);

		// read in file
		var text = fs.readFileSync(bookFilePath, 'utf8'),
			separator = '<div type="book"',
			separatorStart = text.indexOf(separator),
			$book = $( text.substr(separatorStart) );

		//console.log(osisCode, $book.find('chapter').length);

		$book.find('chapter').each(function(chapterIndex, chapterNode) {

			var $chapterNode = $(chapterNode),
				osisChapterCode = $chapterNode.attr('osisID'),
				osisChapterParts = osisChapterCode ? osisChapterCode.split('.') : [],
				chapterNumber = osisChapterParts.length > 1 ? osisChapterParts[1] : '',
				dbsChapterCode = dbsBookCode + chapterNumber,
				nextid = bibleData.getNextChapter(dbsChapterCode),
				previd = bibleData.getPrevChapter(dbsChapterCode);


			info.sections.push(dbsChapterCode);

			if (chapterNumber == '') {
				console.log('No chapter OSIS', $chapterNode[0].attributes["osisID"].value, $chapterNode.find('verse').length	);
				return;

			}

			var chapterData = {
				id: dbsChapterCode,
				previd: previd,
				nextid: nextid,
				html: '',
				title: bookName + ' ' + chapterNumber
			};
			var html = bibleFormatter.openChapter(info, chapterData)

			/*'<div class="section chapter ' + info.id + ' ' + dbsBookCode + ' ' + dbsChapterCode + ' ' + info.lang + '"' +
					' data-textid="' + info.id + '"' +
					' data-id="' + dbsChapterCode + '"' +
					' data-previd="' + previd + '"' +
					' data-nextid="' + nextid + '"' +
					' lang="' + info.lang + '">' + breakChar;
					*/

			// chapter number
			if (chapterNumber == 1) {
				html += '<div class="mt">' + bookName + '</div>' + bibleFormatter.breakChar;
			}
			html += '<div class="c">' + (dbsBookCode == 'PS' && info.lang == 'eng' ? 'Psalm ' : '') + chapterNumber + '</div>' + breakChar;

			html += '<div class="p">' + bibleFormatter.breakChar;


			$chapterNode.find('verse').each(function(verseIndex, verseNode) {
				var $verseNode = $(verseNode),
					osisVerseCode = $verseNode.attr('osisID'),
					verseNumber = osisVerseCode.split('.')[2],
					dbsVerseCode = dbsChapterCode + '_' + verseNumber;

				// verse number
				html += '<span class="v-num v-' + verseNumber + '">' + verseNumber + '</span>';

				// open verse
				html += '<span class="v ' + dbsVerseCode + '" data-id="' + dbsVerseCode + '">';

				//console.log(dbsVerseCode, verseNode.childNodes.length);

				var textToIndex = '';
				for (var i=0, il=verseNode.childNodes.length; i<il; i++) {
					var n = verseNode.childNodes[i];

					//console.log(n.nodeName);

					switch (n.nodeName.toLowerCase()) {
						// element
						case 'w':
							var $word = $(n),
								lemma = $word.attr('lemma'),
								morph = $word.attr('morph'),
								// TEMP: remove / from between words
								text = $word.html(),
								inlineWord = text.replace(/\//gi,''),
								indexedWordParts = text.replace(/[\u0591-\u05C7]/g,'').split('/'),
								indexedWord = indexedWordParts.length == 1 || indexedWordParts.length == 2 ?
												indexedWordParts[0] :
												indexedWordParts.length == 3 ?
													indexedWordParts[1] : indexedWordParts.join('');

								strongs = 'H' + lemma.replace(/[^\d]+/gi, '');

							html += '<l s="' + strongs + '"' + (morph ? ' m="' + morph + '"' : '') + '>' + inlineWord + '</l>';

							// strip out all vowels and such
							textToIndex += indexedWord + ' ';

							if (createIndex) {
								verseIndexer.indexStrongs(dbsVerseCode, strongs, data.indexLemmaData, info.lang);
							}

							break;
						// punctuation
						case 'seg':
							html += n.textContent;
							//textToIndex += n.nodeValue;

							break;
						// text
						case '#text':
							html += n.nodeValue;
							textToIndex += n.nodeValue;

							break;

					}


				}

				/*
				// words
				var textToIndex = '';
				$verseNode.find('w').each(function(wordIndex, wordNode) {
					var $word = $(wordNode),
						lemma = $word.attr('lemma'),
						morph = $word.attr('morph'),
						text = $word.html().replace('/','');

					var strongs = 'H' + lemma.replace(/\w\//gi, '');

					html += '<l s="' + strongs + '"' + (morph ? ' m="' + morph + '"' : '') + '>' + text + '</l> ';

					textToIndex += text + ' ';

					if (createIndex) {
						verseIndexer.indexStrongs(lemmaIndexOutputPath, dbsVerseCode, strongs, lemmaIndexData, info.lang);
					}

				});
				*/

				if (createIndex) {
					verseIndexer.indexVerse(dbsVerseCode, textToIndex, data.indexData, info.lang);
				}

				// close verse
				html += '</span>' + breakChar;;

			});

			html += bibleFormatter.breakChar + '</div>' + bibleFormatter.breakChar; // close paragraph

			// close chapter
			html += bibleFormatter.closeChapter();

			chapterData.html = html;

			data.chapterData.push(chapterData);

			// write out!
			//fs.writeFileSync( path.join(outputPath, dbsChapterCode + '.html'), html);
		});

		updateProgress();
	}

	// info
	/*
	fs.writeFileSync( path.join(outputPath, 'info.json'), JSON.stringify(info));

	// index!
	if (createIndex) {
		verseIndexer.createIndexFiles(indexOutputPath, indexData);

		if (!fs.existsSync(lemmaIndexOutputPath)) {
			fs.mkdirSync(lemmaIndexOutputPath);
		}

		verseIndexer.createIndexFiles(lemmaIndexOutputPath, lemmaIndexData);
	}
	*/

	return data;
}

// hebrew morph: http://openscriptures.github.io/morphhb/parsing/HebrewMorphologyCodes.html
// https://github.com/openscriptures/morphhb/blob/master/wlc/Ruth.xml


module.exports = {
	generate: generate
}
