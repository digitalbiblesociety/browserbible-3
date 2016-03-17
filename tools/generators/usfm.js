var fs = require('fs'),
	path = require('path'),
	bibleData = require('../data/bible_data.js'),
	bibleFormatter = require('../bible_formatter.js'),
	verseIndexer = require('../verse_indexer.js'),
	usfmParser = require('./usfm_parser.js'),
	readline = require('readline'),
	stream = require('stream'),
	jsdom = require("jsdom"),
	$ = require('jquery')(jsdom.jsdom().defaultView);

function generate(inputBasePath, info, createIndex, startProgress, updateProgress) {
	var breakChar = '\n';

	var
		unparsedUsfmFlags = [],
		bookCodes = [],
		bookNames = [],
		bookAbbreviations = [],
		chapterList = [],
		aboutPath = path.join(inputBasePath, 'about.html'),
		data = {
			chapterData: [],
			indexData: {},
			indexLemmaData: {},
			aboutHtml: fs.existsSync(aboutPath) ? fs.readFileSync(path.join(inputPath, 'about.html'), 'utf8') : ''
		}

	skipAheadKeys = ['', 'add', 'add*', 'wj', 'wj*', 'x', 'x*', 'f', 'f*', 'qs', 'ft', 'bk', 'fqa'];

	var usfmFiles = fs.readdirSync(inputBasePath);


	startProgress(usfmFiles.length, 'Books');


	usfmFiles.forEach(function(filename) {

		if (filename.indexOf('.usfm') == -1) {
			return;
		}

		var filePath = path.join(inputBasePath, filename),
			rawText = fs.readFileSync(filePath, 'utf8'),
			lines = rawText.split('\n');

		//console.log(filePath, lines.length);

		var bookName = '',
			bookAbbr = '';

		var
			currentBookInfo = null,
			currentChapterNum = null,
			currentVerseNum = '',
			currentChapterHtml = '',
			currentChapterCode = '',
			paragraphIsOpen = false,
			currentVerseCode = null,
			quoteIsOpen = false,
			verseIsOpen = false,
			currentHeader = '',
			currentVerseText = '',
			notes = '',
			noteNumber = 1,
			chapterVerse = '';

		for (var i = 0, il = lines.length; i < il; i++) {
			var line = lines[i],
				usfm = usfmParser.parseLine(line);

			if (usfm == null) {
				return;
			}


			// check the next line
			if (skipAheadKeys.indexOf(usfm.key) == -1) {

				var nextLineIndex = i + 1;
				while (nextLineIndex < lines.length) {

					var nextLine = lines[nextLineIndex],
						nextUsfm = usfmParser.parseLine(nextLine);

					if (skipAheadKeys.indexOf(nextUsfm.key) > -1) {
						usfm.text += ' ' + nextLine;
					} else if (nextUsfm == null) {
						usfm.text += ' ' + nextLine;
					} else {
						break;
					}
					nextLineIndex++;
				}
			} else {
				// skip these
				continue;

			}


			switch (usfm.key) {
				default:
				// store all the flags we can use
				if (unparsedUsfmFlags.indexOf(usfm.key) == -1) {
					unparsedUsfmFlags.push(usfm.key);
				}

				// do nothing?
				break;

				case 'ide':
					// assume usfm
					break;

				case 'id':
					// get book info
					var bookId = usfm.text.split(' ')[0].trim();
					currentBookInfo = bibleData.getBookInfoByUsfmCode(bookId.toUpperCase());

					//console.log(bookId, (typeof currentBookInfo != 'undefined' ? currentBookInfo.dbsCode : '?'));

					bookCodes.push(currentBookInfo.dbsCode);
					//console.log('book', currentBookInfo != null ? currentBookInfo.names.eng[0] : 'NULL: ' + bookId);
					break;

				// intro stuff
				case 'is':
				case 'ip':
				case 'ili':
				case 'ili2':

				// headings
				case 'mt':
				case 'mt1':
				case 'mt2':
				case 'mt3':
				case 'ms':
				case 'd':
				case 'sp':
				case 'sr':
				case 's1':
				case 's2':
				case 'r':

					if (verseIsOpen) {
						currentChapterHtml += '</span>' + breakChar;
						verseIsOpen = false;
					}

					if (paragraphIsOpen) {
						currentChapterHtml += '</div>' + breakChar;
						paragraphIsOpen = false;
					}

					var formatted = usfmParser.formatText(usfm.text, noteNumber, chapterVerse);
					notes += formatted.notes;


					currentChapterHtml += '<div class="' + usfm.key + '">' + formatted.text + '</div>' + breakChar;



					break;

				case 'b':

					if (verseIsOpen) {
						currentChapterHtml += '</span>' + breakChar;
						verseIsOpen = false;
					}

					if (paragraphIsOpen) {
						currentChapterHtml += '</div>' + breakChar;
						paragraphIsOpen = false;
					}
					currentChapterHtml += '<div class="b">&nbsp;</div>' + breakChar;


					break;

				// TEXT BLOCKS
				case 'cp':
				case 'nb':
				case 'bd':
				case 'm':
				case 'mi':
				case 'pi':
				case 'li':
				case 'li1':
				case 'li2':
					// letting this fall through for now.

				case 'p':
					if (verseIsOpen) {
						currentChapterHtml += '</span>' + breakChar;
						verseIsOpen = false;
					}

					if (paragraphIsOpen) {
						currentChapterHtml += '</div>' + breakChar;
						paragraphIsOpen = false;
					}

					if (quoteIsOpen) {
						currentChapterHtml += '</div>' + breakChar;
						quoteIsOpen = false;
					}

					currentChapterHtml += '<div class="' + usfm.key + '">' + breakChar;
					paragraphIsOpen = true;

					if (usfm.text != '') {

						var formatted = usfmParser.formatText(usfm.text, noteNumber, chapterVerse);
						notes += formatted.notes;


						currentChapterHtml += bibleFormatter.openVerse(currentVerseCode, null) +
						//'<span class="v ' + currentVerseCode + '" data-id="' + currentVerseCode + '">' +
						formatted.text;

						verseIsOpen = true;

						currentVerseText += usfmParser.plainText(usfm.text);
					}

					break;

				case 'c':
					// new chapter
					if (usfm.text > 1) {


						if (verseIsOpen) {
							currentChapterHtml += '</span>' + breakChar;
							verseIsOpen = false;
						}
						if (paragraphIsOpen || quoteIsOpen) {
							currentChapterHtml += '</div>' + breakChar;
							paragraphIsOpen = false;
							quoteIsOpen = false;
						}


						/*
						// pull out notes
						var notesHtml = '',
							chapterNode = $(currentChapterHtml),
							notes = chapterNode.find('.note');

						//console.log(notes.length);

						notes.each(function(i, n) {
							var note = $(this),
								key = note.find('.key').html(),
								noteNumber = i+1,
								noteText = note.find('.text');

							note.attr('id','note-' + noteNumber);
							note.find('.key').attr('href','#footnote-' + noteNumber);

							notesHtml += '<span class="footnote" id="footnote-' + noteNumber + '">' +
												'<a class="key" href="#note-' + noteNumber + '">' + key + '</a>' +
												'<span class="text">' + noteText.html() + '</span>' +
											'</span>' + bibleFormatter.breakChar;

							noteText.remove();
						});
						*/


						// finish previous chapter
						data.chapterData.push({
							id: currentChapterCode,
							previd: null,
							nextid: null,
							html: currentChapterHtml,
							//html: chapterNode[0].outerHTML,
							//html: chapterNode.wrapAll('<div></div>').parent().html(),
							notes: notes,
							title: currentBookInfo.name + ' ' + chapter
						});
						currentChapterHtml = '';
						paragraphIsOpen = false;
						quoteIsOpen = false;
						verseIsOpen = false;
						chapterList.push(currentChapterCode);
					}

					//console.log('c', usfm.text);

					currentChapterNum = usfm.text;
					currentChapterCode = bibleFormatter.formatChapterCode(currentBookInfo.dbsCode, currentChapterNum);
					currentChapterHtml += '<div class="c">' +
						(currentBookInfo.dbsCode == 'PS' ?
						(currentHeader.substring(currentHeader.length - 1) == 's' ? currentHeader.substring(0, currentHeader.length - 1) : currentHeader) + ' ' : ''
					) + usfm.text.toString() +
						'</div>' + breakChar;

					break;

				case 'v':
					if (verseIsOpen) {
						currentChapterHtml += '</span>' + breakChar;
						verseIsOpen = false;
					}

					// handle index
					if (createIndex && currentVerseText != '' && currentVerseCode != null) {
						verseIndexer.indexVerse(currentVerseCode, currentVerseText, data.indexData, info.lang);
					}
					// restart
					currentVerseText = usfmParser.plainText(usfm.text);



					// start new verse
					currentVerseNum = usfm.number;

					if (currentVerseNum == '' && usfm.text != '' && usfm.text.trim().indexOf(' ') == -1) {
						currentVerseNum = usfm.text;
					}

					if (!currentVerseNum || !currentChapterNum) {
						console.log('ERROR with verse:', i, currentBookInfo.dbsCode, 'cc:' + currentChapterCode, 'v:' + currentVerseNum, 'c:' + currentChapterNum);
						console.log(usfm);
						return;
					}

					currentVerseCode = bibleFormatter.formatVerseCode(currentBookInfo.dbsCode, currentChapterNum, currentVerseNum);

					chapterVerse = currentChapterNum + ':' + currentVerseNum;

					var formatted = usfmParser.formatText(usfm.text, noteNumber, chapterVerse);
					notes += formatted.notes;

					currentChapterHtml += bibleFormatter.openVerse(currentVerseCode, currentVerseNum) +
					//'<span class="v-num v-' + currentVerseNum + '">' + currentVerseNum + '&nbsp;</span>' +
					//'<span class="v ' + currentVerseCode + '" data-id="' + currentVerseCode + '">' +
					formatted.text;


					verseIsOpen = true;

					break;
				case '':

					// ignore b/c we use a peak ahead function

					//currentChapterHtml += usfmParser.formatText(usfm.text);
					break;

				case 'q':
					// continue
				case 'q1':
				case 'q2':
				case 'q3':

					if (verseIsOpen) {
						currentChapterHtml += '</span>' + breakChar;
						verseIsOpen = false;
					}

					if (quoteIsOpen) {
						currentChapterHtml += '</div>' + breakChar;
						quoteIsOpen = false;
					}

					if (paragraphIsOpen) {
						currentChapterHtml += '</div>' + breakChar;
						paragraphIsOpen = false;
					}

					currentChapterHtml += '<div class="' + usfm.key + '">' + breakChar;
					quoteIsOpen = true;

					if (usfm.text != '') {

						var formatted = usfmParser.formatText(usfm.text, noteNumber, chapterVerse);
						notes += formatted.notes;

						currentChapterHtml += '<span class="v ' + currentVerseCode + '" data-id="' + currentVerseCode + '">' + formatted.text;

						currentVerseText += usfmParser.plainText(usfm.text);
						verseIsOpen = true;
					}


					break;

				case 'h':
					currentHeader = usfm.text.trim();
					break;
				case 'toc1':
					if (usfm.text.trim() != '') {
						bookName = usfm.text.trim();
					}
					break;
				case 'toc2':
					// use this shorter one for the listing
					if (usfm.text.trim() != '') {
						bookName = usfm.text.trim();
					}
					break;
				case 'toc3':
					if (usfm.text.trim() != '') {
						bookAbbr = usfm.text.trim();
					}
					// TODO: add to book names and
					break;



			}

			/*
			if (currentVerseCode == 'PS1_2') {
				console.log('PS1_2', usfm.key, usfm.text);
				console.log( usfmParser.formatText(usfm.text) );

			}
			*/
		}

		// last index
		if (createIndex && currentVerseText != '' && currentVerseCode != null) {
			verseIndexer.indexVerse(currentVerseCode, currentVerseText, data.indexData, info.lang);
		}


		// final closing tags
		if (verseIsOpen) {
			currentChapterHtml += '</span>' + breakChar;
			verseIsOpen = false;
		}
		if (paragraphIsOpen || quoteIsOpen) {
			currentChapterHtml += '</div>' + breakChar;
			paragraphIsOpen = false;
			quoteIsOpen = false;
		}

		if (bookName != '') {
			bookNames.push(bookName);
		} else {
			bookNames.push(currentBookInfo.names.eng[0]);
		}
		if (bookAbbr != '') {
			bookAbbreviations.push(bookAbbr);
		} else {
			bookAbbreviations.push(currentBookInfo.names.eng[0].replace(/\s/gi, '').substring(0, 3));
		}


		// pull out notes
		var notesHtml = '',
			chapterNode = $(currentChapterHtml),
			notes = chapterNode.find('.note');

		//console.log(notes.length);

		notes.each(function(i, n) {
			var note = $(this),
				key = note.find('.key').html(),
				noteNumber = i + 1,
				noteText = note.find('.text');

			note.attr('id', 'note-' + noteNumber);
			note.find('.key').attr('href', '#footnote-' + noteNumber);

			notesHtml += '<span class="footnote" id="footnote-' + noteNumber + '">' +
				'<a class="key" href="#note-' + noteNumber + '">' + key + '</a>' +
				'<span class="text">' + noteText.html() + '</span>' +
				'</span>' + bibleFormatter.breakChar;

			noteText.remove();
		});



		// add final html
		data.chapterData.push({
			id: currentChapterCode,
			//html: chapterNode[0].outerHTML,
			html: chapterNode.wrapAll('<div></div>').parent().html(),
			notes: notesHtml
		});
		chapterList.push(currentChapterCode);


		updateProgress();
	});

	console.log('chapters:', data.chapterData.length);


	// create prev/next code and wrappers
	for (var i = 0, il = data.chapterData.length; i < il; i++) {
		var chapter = data.chapterData[i];

		chapter.previd = (i == 0) ? null : data.chapterData[i - 1].id;
		chapter.nextid = (i == il - 1) ? null : data.chapterData[i + 1].id;
		chapter.html =
			bibleFormatter.openChapter(info, chapter) +
			chapter.html +
			bibleFormatter.closeChapter();

	}


	// spit out info
	info.type = 'bible';
	info.divisions = bookCodes;
	info.divisionNames = bookNames;
	info.divisionAbbreviations = bookAbbreviations;
	info.sections = chapterList;


	console.log('unparsed', unparsedUsfmFlags);

	return data;

}

module.exports = {
	generate: generate
}
