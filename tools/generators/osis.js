var fs = require('fs'),
	path = require('path'),
	bibleData = require('../data/bible_data.js'),
	bibleFormatter = require('../bible_formatter.js'),
	verseIndexer = require('../verse_indexer.js'),
	jsdom = require("jsdom"),
	$ = require('jquery')(jsdom.jsdom('').defaultView);

unparsedTags = [];

function generate(inputPath, info, createIndex, startProgress, updateProgress) {


	if (typeof info.type == 'undefined' || info.type == '') {
		info.type = 'bible';
	}
	info.divisions = [];
	info.divisionNames = [];
	info.sections = [];

	if (info.type == 'commentary') {
		createIndex = false;
	}


	// read in OSIS, split into books
	var filepath = path.join(inputPath, info.filename),
		text = fs.readFileSync( filepath , 'utf8'),
		separator = '<div type="book"',
		chunks = text.split(separator),
		data = {
			indexData: {},
			indexLemmaData: {},
			chapterData: []
		},
		singleBookIndex = -1;


	// copy about if present
	var aboutPath = path.join(inputPath, 'about.html');
	if (fs.existsSync(aboutPath)) {
		data.aboutHtml = fs.readFileSync( aboutPath , 'utf8');
	}


	if (singleBookIndex > -1) {
		processBook(data, separator + chunks[singleBookIndex] , info, inputPath, createIndex);

	} else {
		startProgress(chunks.length-1, 'Books');

		// run through books
		for (var i=1; i<=chunks.length-1; i++) {
			var bookXml = separator + chunks[i];

			processBook(data, bookXml, info, inputPath, createIndex);

			updateProgress();
		}
	}

	/*
	if (createIndex) {
		verseIndexer.createIndexFiles(indexOutputPath, indexData);

		if (!fs.existsSync(lemmaIndexOutputPath)) {
			fs.mkdirSync(lemmaIndexOutputPath);
		}

		verseIndexer.createIndexFiles(lemmaIndexOutputPath, lemmaIndexData);
	}

	fs.writeFileSync(path.join(outputPath, 'info.json'), JSON.stringify(info), 'utf8');
	*/

	return data;
}


function processBook(data, bookXml, info, inputPath, createIndex) {

	var book = $(bookXml),
		bookOsisID = book.attr('osisID'),
		bookInfo = bibleData.getBookInfoByOsisCode(bookOsisID),
		dbsBookCode = bookInfo.dbsCode,
		bookName = bookInfo.names["eng"][0],
		chapters = book.find('chapter'),
		breakChar = '\n';

	info.divisions.push(dbsBookCode);
	info.divisionNames.push(bookName);

	//fs.writeFileSync( path.join(inputPath, bookOsisID + '.xml' ), bookXml);

	chapters.each(function(i, el) {
		var chapter = $(el),
			chapterOsisID = chapter.attr('osisID'),
			chapterNum = chapterOsisID.split('.')[1],
			dbsChapterCode = dbsBookCode + chapterNum,
			nextid = bibleData.getNextChapter(dbsChapterCode),
			previd = bibleData.getPrevChapter(dbsChapterCode),
			html = '',
			notes = '',
			noteNumber = 1,
			paragraphIsOpen = false,
			verseIsOpen = false,
			wordsOfChristIsActive = false,
			chapterData = {id: dbsChapterCode, previd: previd, nextid: nextid, text: ''},
			verseText = '';

		function handleChildNodes(nodes) {
			for (var i=0, il=nodes.length; i<il; i++) {
				var node = nodes[i];

				//console.log(node.nodeType, node.nodeValue || node.nodeName);

				if (node.nodeType == 3) { // TEXT_NODE
					html += node.nodeValue;

					verseText += node.nodeValue;
				} else if (node.nodeType == 1) { // ELEMENT_NODE

					var tagName = node.nodeName.toLowerCase();

					switch (tagName) {
						case 'verse':


							//console.log( node.attributes[0] ? node.attributes[0].name + ':' + node.attributes[0].value : '' );
							//console.log( node.attributes[1] ? node.attributes[1].name + ':' + node.attributes[1].value : '');

							if (node.attributes["sid"]) {


								var osisID = node.attributes["osisid"] ? node.attributes["osisid"].value : '',
									verseNum = osisID != '' ? osisID.split('.')[2] : '',
									dbsVerseCode = dbsChapterCode + '_' + verseNum;

								if (verseIsOpen) {
									html += '</span>' + breakChar;
									verseIsOpen = false;
								}

								// new paragrap
								var nextNode = node.nextSibling;
								if (nextNode != null && nextNode.nodeType == 1 && nextNode.attributes["marker"] && nextNode.attributes["marker"].value == '¶') {
									html += '</div>' + breakChar;
									paragraphIsOpen = false;
									html += '<div class="p">' + breakChar;
									paragraphIsOpen = true;
								}


								html += bibleFormatter.openVerse(dbsVerseCode, verseNum);

								//html += '<span class="v-num v-' + verseNum + '">' + verseNum + '</span>';
								//html += '<span class="v ' + dbsVerseCode + '" data-id="' + dbsVerseCode + '">';



								verseIsOpen = true;

								if (wordsOfChristIsActive) {
									html += '<span class="woc">';
								}

								// reset for index
								verseText = '';

							} else if (node.attributes["eid"]) {
								if (wordsOfChristIsActive) {
									html += '</span>';
								}

								if (createIndex) {
									verseIndexer.indexVerse(dbsVerseCode, verseText, data.indexData, info.lang);
								}


								html += '</span>' + breakChar;
								verseIsOpen = false;
							} else if (node.attributes["osisid"]) {


								var osisID = node.attributes["osisid"] ? node.attributes["osisid"].value : '',
									verseNum = osisID != '' ? osisID.split('.')[2] : '',
									dbsVerseCode = dbsChapterCode + '_' + verseNum;

								if (verseIsOpen) {
									html += '</span>' + breakChar;
									verseIsOpen = false;
								}

								//html += bibleFormatter.openVerse(dbsVerseCode, verseNum);
								html += '<span class="comm-v-num">Verse ' + verseNum + '</span>';
								html += '<span class="v ' + dbsVerseCode + '" data-id="' + dbsVerseCode + '">';


								if (info.id == 'comm_eng_scofield') {
									var $node = $(node);

									// remove extra breaks
									$node.find('br').remove();


									// replace hard-coded titles
									$node.find('b font[color="maroon"]').each(function(i, el) {
										var $title = $(this),
											$newTitle = $('<span class="sco-title">' + this.textContent + '</span>');

										$title.closest('b').after($newTitle).remove();
									});

									// fix bible references
									$node.find('scripref').each(function(i, el) {
										var $scripref = $(this),
											$newScripref = $('<span class="bibleref" data-id="' + $scripref.attr('passage') + '">' + this.textContent + '</span>');

										$scripref.after($newScripref).remove();
									});




									html += $node.html();
								} else {

									html += node.innerHTML;

								}


								html += '</span>' + breakChar;

								/*verseIsOpen = true;

								verseText = '';

								if (node.childNodes.length > 0) {

									handleChildNodes(node.childNodes);

									if (wordsOfChristIsActive) {
										html += '</span>';
									}

									if (createIndex) {
										verseIndexer.indexVerse(dbsVerseCode, verseText, data.indexData, info.lang);
									}

									html += '</span>' + breakChar;
									verseIsOpen = false;

								}
								*/


							}

							break;
						case 'w':

							if (node.textContent != '') {

								var
									morph = node.attributes['morph'] ? node.attributes['morph'].value : '',
									morphData = morph.replace(/robinson:/gi,''), // (morph.indexOf(':') > -1) ? morph.split(':')[1] : '',
									lemma = node.attributes['lemma'] ? node.attributes['lemma'].value : '',
									strongs = lemma.replace(/strong:/gi,''); //(lemma.indexOf(':') > -1) ? lemma.split(':')[1]: ''; // .replace('G','').replace('H','') : ''

								strongs = strongs.replace(/H0+/g, 'H').replace(/G0+/g, 'G');

								if (createIndex) {
									var ss = strongs.split(' ');
									for (var si=0, sil=ss.length; si<sil; si++) {
										verseIndexer.indexStrongs(dbsVerseCode, ss[si], data.indexLemmaData, info.lang);
									}
								}

								html += '<l' + (strongs != '' ? ' s="' + strongs + '"' : '') + (morphData != '' ? ' m="' + morphData + '"' : '') + '>';
								handleChildNodes(node.childNodes);
								//html += node.textContent;
								html += '</l>';

								//verseText += node.textContent;
							}

							break;

						case 'transchange':

							if (node.attributes["type"] && node.attributes["type"].value == 'added') {
								html += '<span class="add">' + node.textContent + '</span>';
								verseText += node.textContent;
							}

							break;

						case 'q':

							if (node.attributes["who"] && node.attributes["who"].value == 'Jesus') {
								html += '<span class="woc">';
								wordsOfChristIsActive = true;

								handleChildNodes(node.childNodes);

								wordsOfChristIsActive = false;
								html += '</span>';

							}

							break;

						case 'divinename':
							html += '<span class="yhwh">' + node.textContent + "</span>";
							verseText += node.textContent;

							break;

						case 'milestone':


							// handling paragraph breaks under 'verse'

							break;

						case 'title':
							// book and chapters titles
							// ignore

							break;

						case 'inscription':
						case 'seg':
							handleChildNodes(node.childNodes);


						case 'note':

							if (node.attributes["type"] && node.attributes["type"].value == 'study') {

								html += '<span class="note" id="note-' + noteNumber + '"><a class="key" href="#footnote-' + noteNumber + '">' + noteNumber + '</a></span>';

								notes += '<span class="footnote" id="footnote-' + noteNumber + '">' +
											'<span class="key">' + noteNumber + '</span>' +
											'<a class="backref" href="#note-' + noteNumber + '">' + chapterNum + ':' + verseNum + '</a>' +
											'<span class="text">' + node.textContent + '</span>' +
										'</span>';

								noteNumber++;
							}

							break;


						// SCOFIELD
						case 'br':
							break;
						case 'center':
							html += node.innerHTML;
						case 'b':
						case 'i':
						case 'p':
						case 'pb':
						case 'hr':
						case 'table':
							html += node.outerHTML;

							break;

						case 'scripref':

							var refid = node.attributes["passage"].value;

							html += '<span class="bibleref" data-id="' + refid + '">' + node.textContent + '</span>';



							break;

						default:
							if (unparsedTags.indexOf(tagName) == -1) {
								unparsedTags.push(tagName);
								console.log('MISSING:' + tagName);

							}

					}

				}

			}
		}


		info.sections.push(dbsChapterCode);

		//if (info.type == 'commentary') {
		//	html = bibleFormatter.openChapter(info, chapterData).replace('chapter', 'commentary');
		//}

		html = bibleFormatter.openChapter(info, chapterData)

		/*
		html = '<div class="chapter section ' + info.id + ' ' + dbsBookCode + ' ' + dbsChapterCode + ' ' + info.lang + '"' +
					' data-textid="' + info.id + '"' +
					' data-id="' + dbsChapterCode + '"' +
					' data-previd="' + previd + '"' +
					' data-nextid="' + nextid + '"' +
					' lang="' + info.lang + '">' + breakChar;
		*/

		if (info.type == 'bible') {

			if (chapterNum == 1) {
				html += '<div class="mt">' + bookName + '</div>' + breakChar;
			}

			html += '<div class="c">' + (dbsBookCode == 'PS' && info.lang == 'eng' ? 'Psalm ' : '') + chapterNum + '</div>' + breakChar;



			html += '<div class="p">';
			paragraphIsOpen = true;

		} if (info.type == 'commentary') {
			html += '<div class="mt">' + bookName + ' ' + chapterNum + '</div>' + breakChar;
		}




		handleChildNodes(el.childNodes);

		if (paragraphIsOpen) {
			html += '</div>'; // p
			paragraphIsOpen = false;
		}
		//html += '</div>'; // chapter
		html += bibleFormatter.closeChapter();

		chapterData.html = html;
		chapterData.notes = notes;

		data.chapterData.push(chapterData);

		//fs.writeFileSync( path.join(outputPath, dbsChapterCode + '.html'), html);


		//bookXmlconsole.log(dbsChapterCode, el.childNodes.length, chapter.children().length);

	});




	/*
	var doc = $(text);
	console.log('jqueried');

	var books = doc.find('div');
	console.log(books.length);

	books.each(function() {

		console.log( $(this).attr('osisID'));
	});
	*/
}




module.exports = {
	generate: generate
}
