/**
 * Holds a Bible reference or range (Genesis 1, John 2:1-5, Philipians  )
 *
 * @param {string} args Bible reference as a string
 */
class BibleReference {

	constructor() {
		let args = arguments;
		
		this.bookid = null;
		this.chapter1 = null;	
		this.chapter2 = null;	
		this.verse1 = null;	
		this.verse2 = null;	
		this.language = 'en';		
	
		if (args.length == 0) {
			return this;		
		} else if (args.length == 1 && typeof args[0] == 'string') { // a string that needs to be parsed
			
			return BibleReference.parse(args[0]);
		
		} else if (args.length >= 2 && args.length <= 6) {
			
			this.bookid = args[0];
			this.chapter1 = args[1];
			if (args.length >= 3) this.verse1 = args[2];
			if (args.length >= 4) this.chapter2 = args[3];
			if (args.length >= 5) this.verse2 = args[4];
			if (args.length >= 6) this.language = args[5];
			
			return this;
		} else {
			return null;
		}
		
	}

	/**
	 * Tells whether or not the object is valid (i.e. has a book and chapter)
	 *
	 * @returns {boolean}
	 */
	isValid() {	
		if (this.getBook() != null && this.chapter1 > 0) {
			return true;
		}
		return false;
	}

	/**
	 * Gets the book object for this reference
	 *
	 * @returns {object} Name, chapters, etc.
	 */
	getBook() {		
		if (this.bookid == null) {
			return null;
		}
		
		var book = bible.BIBLE_DATA[this.bookid];
		return book;
	}	

	/**
	 * Formats the chapter:verse range
	 *
	 * @returns {string} 1:5-6 or 12:1-18:2
	 */
	chapterAndVerse(cvSeparator = ':', vvSeparator = '-', ccSeparator = '-') {
		
		var chapter1 = this.chapter1, 
			chapter2 = this.chapter2, 
			verse1 = this.verse1, 
			verse2 = this.verse2;

		if (chapter1 > 0 && verse1 <= 0 && chapter2 <= 0 && verse2 <= 0) // John 1
			return chapter1;
		else if (chapter1 > 0 && verse1 > 0 && chapter2 <= 0 && verse2 <= 0) // John 1:1
			return chapter1 + cvSeparator + verse1;
		else if (chapter1 > 0 && verse1 > 0 && chapter2 <= 0 && verse2 > 0) // John 1:1-5
			return chapter1 + cvSeparator + verse1 + vvSeparator + verse2;
		else if (chapter1 > 0 && verse1 <= 0 && chapter2 > 0 && verse2 <= 0) // John 1-2
			return chapter1 + ccSeparator + chapter2;
		else if (chapter1 > 0 && verse1 > 0 && chapter2 > 0 && verse2 > 0) // John 1:1-2:2
			return chapter1 + cvSeparator + verse1 + ccSeparator + ((chapter1 != chapter2) ? chapter2 + cvSeparator : '') + verse2;
		else
			return '?';
	}

	/**
	 * Formats the book name and chapter:verse range
	 *
	 * @returns {string} Luke 1:5-6 or 12:1-18:2
	 */
	toString() {
		let book = this.getBook();
	
		if (book == null) 
			return "invalid";

		return book.names[this.language][0] + ' ' + this.chapterAndVerse();
	}

	/**
	 * Formatted code for Bible App
	 *
	 * @returns {string} USFM plus chapter JHN_1
	 */
	toChapterCode() {
		return this.bookid + '_' + (this.chapter1 > 0 ? this.chapter1 : '1');
	}

	/**
	 * Formatted code for Bible App
	 *
	 * @returns {string} USFM plus chapter and verse JHN_1_2
	 */
	toVerseCode() {
		return this.bookid + '_' + (this.chapter1 > 0 ? this.chapter1 : '1') + '_' + (this.verse1 > 0 ? this.verse1 : '1');
	}	

	/**
	 * Takes a string and returns an class
	 *
	 * @param {string} textReference Any Bible reference format
	 * @returns {BibleReference} Populated object
	 */
	static parse(textReference, language = 'en') {
	
		var 
			bookid = null,
			bookInfo = null,
			chapter1 = -1,
			verse1 = -1,
			chapter2 = -1,
			verse2 = -1,
			input = new String(textReference).replace('&ndash;','-').replace('–','-').replace(/(\d+[\.:])\s+(\d+)/gi, '$1$2'),
			i, j, il, jl,
			afterRange = false,
			afterSeparator = false,
			startedNumber = false,
			currentNumber = '',
			possibleMatch = null,
			c;

		// TODO: parse: GEN_1_1, EXO_1, etc.	
			
		// take the entire reference (John 1:1 or 1 Cor) and move backwards until we find a letter or space
		// 'John 1:1' => 'John '
		// '1 Cor' => '1 Cor'
		// 'July15' => 'July'
		for (i=input.length; i>=0; i--) {
			if (/[A-Za-z\s]/.test(input.substring(i-1,i))) {
				possibleMatch = input.substring(0,i);					
				break;			
			}
		}
		
		if (possibleMatch != null) {
			
			// tear off any remaining spaces
			// 'John ' => 'John'
			possibleMatch = possibleMatch.replace(/\s+$/,'').replace(/\.+$/,'').toLowerCase();
			
			// find USFM or complete name match
			var bookMatches = Object.values(bible.BIBLE_DATA).filter( function(b) { 
				if (b.usfm == possibleMatch.toUpperCase()) {
					return true;
				}

				var names = b.names[language];
				if (names) {
					return names.filter(function(n) {
						return n.toLowerCase() == possibleMatch;
					}).length > 0;
				}
				
				return false;
			});
			if (bookMatches.length == 1) {
				bookInfo = bookMatches[0]; 
				bookid = bookInfo.usfm;
			} else {
				
				// find an abbreviation
				bookMatches = bible.BIBLE_DATA.filter(
												function(b) { 
													return b.abbr[language].filter(function(abbr) { 
														return abbr.toLowerCase() == possibleMatch; 
													}).length > 0;
												});					
				
				if (bookMatches.length > 0) {
					bookInfo = bookMatches[0]; 
					bookid = bookInfo.bookid;
				}			
			}
	
			if (bookid != null) {
	
				for (i = 0; i < input.length; i++) {
					c = input.charAt(i);
	
					if (c == ' ' || isNaN(c)) {
						if (!startedNumber)
							continue;
	
						if (c == '-' || c == '–') {
							afterRange = true;
							afterSeparator = false;
						} else if (c == ':' || c == ',' || c == '.' || c == '_') {
							afterSeparator = true;
						} else {
							// ignore
						}
	
						// reset
						currentNumber = '';
						startedNumber = false;
	
					} else {
						startedNumber = true;
						currentNumber += c;
	
						if (afterSeparator) {
							if (afterRange) {
								verse2 = parseInt(currentNumber, 10);
							} else { // 1:1
								verse1 = parseInt(currentNumber, 10);
							}
						} else {
							if (afterRange) {
								chapter2 = parseInt(currentNumber, 10);
							} else { // 1
								chapter1 = parseInt(currentNumber, 10);
							}
						}
					}
				}
				
				// for books with only one chapter, treat the chapter as a vers
				if (bookInfo.chapters.length == 1) {
					
					// Jude 6 ==> Jude 1:6
					if (chapter1 > 1 && verse1 == -1) {
						verse1 = chapter1;
						chapter1 = 1;
					}
				}	
				
	
				// reassign 1:1-2	
				if (chapter1 > 0 && verse1 > 0 && chapter2 > 0 && verse2 <= 0) {
					verse2 = chapter2;
					chapter2 = chapter1;
				}
				
				// fix 1-2:5
				if (chapter1 > 0 && verse1 <= 0 && chapter2 > 0 && verse2 > 0) {
					verse1 = 1;
				}
	
				// just book
				if (bookid != null && chapter1 <= 0 && verse1 <= 0 && chapter2 <= 0 && verse2 <= 0) {
					chapter1 = 1;
					//verse1 = 1;
				}
	
				// validate max chapter
				if ( typeof bookInfo.chapters  != 'undefined') {
					if (chapter1 == -1) {
						chapter1 = 1;
					} else if (chapter1 > bookInfo.chapters.length) {
						chapter1 = bookInfo.chapters.length;
						if (verse1 > 0)
							verse1 = 1;
					}
	
					// validate max verse
					if (verse1 > bookInfo.chapters[chapter1 - 1]) {
						verse1 = bookInfo.chapters[chapter1 - 1];
					}
					if (verse1 > 0 && verse2 <= verse1) {
						chapter2 = -1;
						verse2 = -1;
					}
				}
			}
		}
			
		// finalize
		return new BibleReference(bookid, chapter1, verse1, chapter2, verse2);
	}	
}