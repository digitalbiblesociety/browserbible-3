/**
 * Bible reference parser
 *
 * @author John Dyer (http://j.hn/)
 */
 
 
// Depends on bible.data.js

bible.parseReference = function (textReference, language) {

	var 
		bookIndex = -1,
		chapter1 = -1,
		verse1 = -1,
		chapter2 = -1,
		verse2 = -1,
		input = new String(textReference),
		i,
		lang,
		bookid,
		matchingbookid = null,
		matchingLanguage = null,
		afterRange = false,
		afterSeparator = false,
		startedNumber = false,
		currentNumber = '',
		name,
		possibleMatch;


	// go through all books and test all names
	for (bookid in bible.BOOK_DATA) {
		
		// match id?
		possibleMatch = input.substring(0, Math.floor(bookid.length, input.length)).toLowerCase();
		if (possibleMatch == bookid.toLowerCase()) {
			matchingbookid = bookid;
			input = input.substring(bookid.length);
			matchingLanguage = 'eng';
			break;
		}		
		
		// if no direct match on OSIS id, then go through names in each language
		for (lang in bible.BOOK_DATA[bookid].names) {	
		
			// test each name starting with the full name, then short code, then abbreviation, then alternates
			for (var i=0, il=bible.BOOK_DATA[bookid].names[lang].length; i<il; i++) {
				
				name = new String(bible.BOOK_DATA[bookid].names[lang][i]).toLowerCase();
				possibleMatch = input.substring(0, Math.floor(name.length, input.length)).toLowerCase();
	
				if (possibleMatch == name) {
					matchingbookid = bookid;
					matchingLanguage = lang;
					input = input.substring(name.length);
					break; // out of names
				}				
			}
		
			if (matchingbookid != null)
				break;	// out of languages

		}
		if (matchingbookid != null)
			break; // out of books
	}

	if (matchingbookid  == null)
		return null;
		
	// pull of _10_10 => 10_10
	if (input.substring(0,1) == '_') {
		input = input.substring(1)		
	}

	for (i = 0; i < input.length; i++) {
		var c = input.charAt(i);

		if (c == ' ' || isNaN(c)) {
			if (!startedNumber)
				continue;

			if (c == '-') {
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
					verse2 = parseInt(currentNumber);
				} else { // 1:1
					verse1 = parseInt(currentNumber);
				}
			} else {
				if (afterRange) {
					chapter2 = parseInt(currentNumber);
				} else { // 1
					chapter1 = parseInt(currentNumber);
				}
			}
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
	if (bookIndex > -1 && chapter1 <= 0 && verse1 <= 0 && chapter2 <= 0 && verse2 <= 0) {
		chapter1 = 1;
		//verse1 = 1;
	}

	// validate max chapter
	if (chapter1 == -1) {
		chapter1 = 1;
	} else if (chapter1 > bible.BOOK_DATA[matchingbookid].chapters.length) {
		chapter1 = bible.BOOK_DATA[matchingbookid].chapters.length;
		if (verse1 > 0)
			verse1 = 1;
	}

	// validate max verse
	/*
	if (verse1 == -1) {
	verse1 = 1;
	} else 
	*/
	if (verse1 > bible.BOOK_DATA[matchingbookid].chapters[chapter1 - 1]) {
		verse1 = bible.BOOK_DATA[matchingbookid].chapters[chapter1 - 1];
	}
	if (verse2 <= verse1) {
		chapter2 = -1;
		verse2 = -1;
	}

	// finalize
	return bible.Reference(matchingbookid, chapter1, verse1, chapter2, verse2, language);

}

bible.Reference = function () {

	var 
		_bookid = -1,
		_chapter1 = -1,
		_verse1 = -1,
		_chapter2 = -1,
		_verse2 = -1,
		_language = 'eng';

	if (arguments.length == 0) {
		// error		
	} else if (arguments.length == 1 && typeof arguments[0] == 'string') { // a string that needs to be parsed
		return bible.parseReference(arguments[0]);
					
	} else if (arguments.length == 1) { // unknonw
		return null;
		
	} else if (arguments.length == 2) { // a string that needs to be parsed
		_language = arguments[2];
		return bible.parseReference(arguments[0], arguments[1]);
		
	} else {
		_bookid = arguments[0];
		_chapter1 = arguments[1];
		if (arguments.length >= 3) _verse1 = arguments[2];
		if (arguments.length >= 4) _chapter2 = arguments[3];
		if (arguments.length >= 5) _verse2 = arguments[4];
		if (arguments.length >= 6) _language = arguments[5];		
	}

	function padLeft(input, length, s) {
		while (input.length < length)
			input = s + input;
		return input;
	}

	return {
		bookid: _bookid,
		chapter: _chapter1,
		verse: _verse1,
		chapter1: _chapter1,
		verse1: _verse1,
		chapter2: _chapter2,
		verse2: _verse2,
		language: _language,
		bookList: bible.DEFAULT_BIBLE,

		isValid: function () {
			return (typeof _bookid != 'undefined' && _bookid != null && _chapter1 > 0);
		},

		chapterAndVerse: function (cvSeparator, vvSeparator, ccSeparator) {
			cvSeparator = cvSeparator || ':';
			vvSeparator = vvSeparator || '-';
			ccSeparator = ccSeparator || '-';

			if (this.chapter1 > 0 && this.verse1 <= 0 && this.chapter2 <= 0 && this.verse2 <= 0) // John 1
				return this.chapter1;
			else if (this.chapter1 > 0 && this.verse1 > 0 && this.chapter2 <= 0 && this.verse2 <= 0) // John 1:1
				return this.chapter1 + cvSeparator + this.verse1;
			else if (this.chapter1 > 0 && this.verse1 > 0 && this.chapter2 <= 0 && this.verse2 > 0) // John 1:1-5
				return this.chapter1 + cvSeparator + this.verse1 + vvSeparator + this.verse2;
			else if (this.chapter1 > 0 && this.verse1 <= 0 && this.chapter2 > 0 && this.verse2 <= 0) // John 1-2
				return this.chapter1 + ccSeparator + this.chapter2;
			else if (this.chapter1 > 0 && this.verse1 > 0 && this.chapter2 > 0 && this.verse2 > 0) // John 1:1-2:2
				return this.chapter1 + cvSeparator + this.verse1 + ccSeparator + ((this.chapter1 != this.chapter2) ? this.chapter2 + cvSeparator : '') + this.verse2;
			else
				return 'unknown';
		},

		toString: function () {
			if (this.bookid == null) return "invalid";

			var bookName = '',
				bookNames = bible.BOOK_DATA[this.bookid].names[this.language];
			
			if (typeof bookNames != 'undefined') {
				bookName = bookNames[0];
			} else {
				bookName = bible.BOOK_DATA[this.bookid].names['eng'][0]
			}

			return bookName + ' ' + this.chapterAndVerse();
		},

		toSection: function () {
			if (this.bookid == null) return "invalid";
			
			return this.bookid + '_' + this.chapter1 + (this.verse1 > 0 ? '_' + this.verse1 : '');
		},

/*
		toOsis: function () {
			if (this.bookid == null) return "invalid";
			
			return this.bookid + '.' + this.chapter1 + (this.verse1 > 0 ? '.' + this.verse1 : '');
		},
		
		toOsisChapter: function () {
			if (this.bookid == null) return "invalid";
			
			return this.bookid + '.' + this.chapter1;
		},
		
		toOsisVerse: function () {
			if (this.bookid == null) return "invalid";
			
			return this.bookid + '.' + this.chapter1 + '.' + (this.verse1 > 0 ? this.verse1 : '0');
		},	
*/		
		
		prevChapter: function () {
			this.verse1 = 1;
			this.chapter2 = -1;
			this.verse2 = -1;
			if (this.chapter1 == 1 && this.bookList.indexOf(this.bookid) == 0) {
				return null;
			} else {
				if (this.chapter1 == 1) {
					// get the previous book
					this.bookid = this.bookList[this.bookList.indexOf(this.bookid)-1];
					
					// get the last chapter in this book
					this.chapter1 = bible.BOOK_DATA[this.bookid].chapters.length;
				} else {
					// just go back a chapter
					this.chapter1--;
				}
				
			}
			
			// return the object ()
			return this;
		},
		
		nextChapter: function () {
			this.verse1 = 1;
			this.chapter2 = -1;
			this.verse2 = -1;
			
			// check for the last chapter in the last book
			if (this.bookList[this.bookid] == this.bookList.length-1 && bible.BOOK_DATA[this.bookid].chapters.length == this.chapter1) {
				return null;
			} else {	
				
				if (this.chapter1 < bible.BOOK_DATA[this.bookid].chapters.length) {
					// just go up one chapter
					this.chapter1++;
				} else if (this.bookList.indexOf(this.bookid) < this.bookList.length-1) {
					// go to the next book, first chapter
					this.bookid = this.bookList[this.bookList.indexOf(this.bookid)+1];
					this.chapter1 = 1;
				}
				
			}

			return this;
		},
		
		isFirstChapter: function () {
			return (this.chapter1 == 1 && this.bookList.indexOf(this.bookid) == 0);
		},
		
		isLastChapter: function () {
			return (this.bookList[this.bookid] == this.bookList.length-1 && bible.BOOK_DATA[this.bookid].chapters.length == this.chapter1);
		}
	}
};
bible.utility = {};
