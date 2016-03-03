var fs = require('fs'),
	path = require('path'),
	bibleData = require('bible_data'),
	bibleFormatter = require('bible_formatter'),
	readline = require('readline');
	stream = require('stream'),
	verseIndexer = require('verse_indexer'),
	XRegExp = require('xregexp').XRegExp;

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
		files = ['RVR09 (OT).txt', 'RVR09 (NT).txt'],
		rvBookNames = ["Genesis", "Exodo", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "1Samuel", "2Samuel", "1Kings", "2Kings", "1Chronicles", "2Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi", "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1Corinthians", "2Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1Thessalonians", "2Thessalonians", "1Timothy", "2Timothy", "Titus", "Philemon", "Hebrews", "James", "1Peter", "2Peter", "1John", "2John", "3John", "Jude", "Revelation"],
		lastDbsBookCode = '',
		lastChapterNumber = -1,
		lastVerseNumber = -1,
		currentChapter = null,
		
		strongXRegExp = new XRegExp('(\\p{Latin}+)\\((([GH]\\d{1,4}(, )?)+)\\)','gi');
				
	// process files
	files.forEach(function(filename) {

		var filePath = path.join(inputPath, filename),
			rawText = fs.readFileSync(filePath, 'utf8'),
			lines = rawText.split('\n');
			
		startProgress(lines.length, "Books");	
			
		for (var i=0, il=lines.length; i<il; i++) {
			var line = lines[i].trim(),
				firstSpace = line.indexOf(' '),
				secondSpace = line.indexOf(' ', firstSpace + 1),
				rvBook = line.substr(0,firstSpace),
				chapterVerse = line.substring(firstSpace+1,secondSpace),
				chapterVerseParts = chapterVerse.split(':'),
				chapterNumber = chapterVerseParts[0],
				verseNumber = chapterVerseParts[1],
				text = line.substr(secondSpace).trim(),
				
				rvBookIndex = rvBookNames.indexOf(rvBook),
								
				dbsBookCode = bibleData.DEFAULT_BIBLE[rvBookIndex],
				bookInfo = bibleData.getBookInfoByDbsCode( dbsBookCode ),
				chapterCode = dbsBookCode + '' + chapterNumber.toString(),
				verseCode = chapterCode + '_' + verseNumber.toString();
				
			if (bookInfo == null) {
				console.log('can"t find' + rvBook);
			}
			
			// new book
			if (dbsBookCode != lastDbsBookCode) {

				bookName = bibleData.getBookName(dbsBookCode, info['lang'])
				
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
				lastDbsBookCode = dbsBookCode;
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
				
				currentChapter.html += '<div class="c">' + chapterNumber + '</div>' + bibleFormatter.breakChar;
				
				if (text.indexOf('<title>') > -1) {
					var title = text.split('</title>')[0].replace('<title>','');
					text = text.split('</title>')[1];
					
					currentChapter.html += '<div class="s1">' + title + '</div>' + bibleFormatter.breakChar;
				}
				
				
				currentChapter.html += '<div class="p">' + bibleFormatter.breakChar;
									
				lastChapterNumber = chapterNumber;
				lastVerseNumber = -1;
			}
			
			// new verse
			if (verseNumber != lastVerseNumber) {
			
			
				if (createIndex) {
					verseIndexer.indexVerse(verseCode, text.replace(strongXRegExp, '$1'), data.indexData, info.lang);
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
			
			// process text
			text = text.replace(/<i>/gi,'<ins>');
			text = text.replace(/<\/i>/gi,'</ins>');
			
			var strongs = [];
			text = text.replace(strongXRegExp, function(w, p1, p2) { // '<l s="$2">$1</l>'
			
				var p2s = p2.split(', ');
				
				strongs = strongs.concat(p2s);
			
				return '<l s="' + p2.replace(',') + '">' + p1 + '</l>';
			});
			
			
			// add word
			currentChapter.html += text;
			
			
			if (createIndex && strongs) {
				for (var si=0, sil=strongs.length; si<sil; si++) {
					verseIndexer.indexStrongs(verseCode, strongs[si], data.indexLemmaData, info.lang);
				}
			}
		
		
			updateProgress();	
		}

	
		currentChapter.html += '</span>' + bibleFormatter.breakChar +
						'</div>' + bibleFormatter.breakChar +
						+ bibleFormatter.closeChapter();		
	});

		
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