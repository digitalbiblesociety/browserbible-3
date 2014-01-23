// truth AND Love
// 1. load indexes
// 2. find verses with both terms
// 3. reduce to chapters
// 4. load chapters
// 5. extract verses


// truth OR love
// 1. load indexes
// 2. merge lists of verses into canonical order
// 3. reduce to chaptesr
// 4. load chapters
// 5. extract verses


// "in truth"
// 1. load indexes
// 2. ...
// 3. reduce to chaptesr
// 4. load chapters
// 5. extract verses


// truth love
// 1. NO INDEX
// 2. load every chapter
// 3. use regexp to find verses with words

var singleWordLanguages = ['cht','chs','chi','zho','cmn', 'jpn', 'kor'];

TextSearch = function() {

	var
		baseContentPath = 'content/texts/',
		isSearching = false,
		canceled = false,
		searchText = '',
		searchTextid = '',
		isAsciiRegExp = new XRegExp('^[\040-\176]*$', 'gi'),
		isLemmaRegExp = /(G|H)\d{1,6}/g,
		
		isLemmaSearch = false,
		startTime = null,
		
		searchTermsRegExp = [],
		searchIndexLoader = new SearchIndexLoader(),
		searchIndexesData = [],
		searchIndexesCurrentIndex = 0
		
		searchFinalResults = [];
		;
		
	searchIndexLoader.on('complete', indexesLoaded);

	function start(text, textid) {
		
		console.log('TextSearch.start', text, textid);
		
		if (isSearching) {
			console.log('already started ... return');
			return false;
		}
		isSearching = true;
		
		// store variables
		searchText = text;
		searchTextid = textid;
		textInfo = TextInfoLoader.getText(searchTextid);
		
		
		// reset
		canceled = false;
		startTime = new Date();
		searchFinalResults = [];
		searchTermsRegExp = [];
		searchIndexesData = []
		searchIndexesCurrentIndex = 0;
	
		createSearchTerms();
		
		// load indexes
		searchIndexLoader.loadIndexes(textInfo, searchText, isLemmaSearch);
	
		return true;		
	}
	
	// fires after indexer loader is done
	function indexesLoaded(e) {
		console.log('searchIndexLoader:complete', e.data);
		
		if (e.data.loadedIndexes.length == 0) {
			
			isSearching = false;
		
			// BRUTE FORCE?
			ext.trigger('indexerror', {type: 'indexerror', target:this, data: {results: searchFinalResults}});
			
			
		} else {
			ext.trigger('indexcomplete', {type: 'indexcomplete', target:this, data: {searchIndexesData: e.data.loadedResults }});
			
			// begin loading

			
			searchIndexesData = e.data.loadedResults;
			searchIndexesCurrentIndex = -1;
			
			console.log('start loading indexes', searchIndexesData.length, searchIndexesCurrentIndex);			
			loadNextSectionid();
		}
		
	}
	
	function loadNextSectionid() {
		searchIndexesCurrentIndex++;
		
		//console.log('loadNextSectionid', searchIndexesData.length, searchIndexesCurrentIndex);		
		
		if (searchIndexesCurrentIndex > searchIndexesData.length) {
		
			console.log('OVER');
			
			isSearching = false;
		
		} else if (searchIndexesCurrentIndex == searchIndexesData.length) {
			// DONE!
			
			console.log('textSearch:complete');
			
			ext.trigger('complete', {type: 'complete', target:this, data: {results: searchFinalResults, searchIndexesData: searchIndexesData, searchTermsRegExp: searchTermsRegExp, isLemmaSearch: isLemmaSearch}});
			
			isSearching = false;
			
		} else {
			var sectionData = searchIndexesData[searchIndexesCurrentIndex],
				sectionid = sectionData ? sectionData.sectionid : null,
				fragmentids = sectionData ? sectionData.fragmentids : null;
				;// url = baseContentPath + textInfo.id + '/' + sectionid + '.json';
				
			if (!sectionData) {
				loadNextSectionid();
				return;
			}
			
			ext.trigger('load', {type: 'load', target:this, data: {sectionid: sectionid, index: searchIndexesCurrentIndex, total: searchIndexesData.length}});
				
			TextLoader.load(textInfo, sectionid, function(content) {

				for (var i=0, il=fragmentids.length; i<il; i++) {
					var 
						fragmentid = fragmentids[i],
						fragmentNode = content.find('.' + fragmentid).clone(),
						
						// assuming a single node
						//html = fragmentNode.html();
						
						html = '';
					
					// remove notes	
					fragmentNode.find('.note, .cf, .v-num, .verse-num').remove();
					
					// concat verses split over multiple <span class="v"> nodes (paragraphs)
					fragmentNode.each(function(i,el) {
						html += $(el).html() + ' ';
					});					
						
					if (fragmentNode.length > 0) {
						
						var foundMatch = false;
					
						for (var j=0, jl=searchTermsRegExp.length; j<jl; j++) {
							
							searchTermsRegExp[j].lastIndex = 0;
							
							if (isLemmaSearch) {
								
								// add the 'highlight' class to the <l> node
								html = html.replace(searchTermsRegExp[j], function(match) {
									foundMatch = true;
									return match + ' class="highlight" ';
								});							

							} else {

								// surround the word with a highlight
								html = html.replace(searchTermsRegExp[j], function(match) {
									foundMatch = true;
									return '<span class="highlight">' + match + '</span>';
								});								
								
							}
						}
					
						if (foundMatch) {
							searchFinalResults.push({fragmentid: fragmentid, html: html});
						}
					}
				}					
				
				
				// DEBUG!!
				//setTimeout(function() {
					loadNextSectionid();	
				//}, 10);			
		
			
			}, function(error) {	
			
				console.log('searchindex:error');
						
				loadNextSectionid();
			});
					
		}
	}
	
	function createSearchTerms() {
		searchTermsRegExp = [];
		
		
		isLemmaRegExp.lastIndex = 0;
		
		if (isLemmaRegExp.test(searchText)) {
			isLemmaSearch = true;
			
			//searchTermsRegExp.push( new XRegExp('\\b(' + part + ')\\b', 'gi') );
			
			// looking for 
			// <l s="H7259">Rebekah</l>
			
			var strongNumbers = searchText.split(' ');
			
					
			for (var i=0, il=strongNumbers.length; i<il; i++) {
			
				var part = strongNumbers[i];
								
				searchTermsRegExp.push( new RegExp('s="' + '(G|H)?' + part.substr(1) + '"', 'gi') );
		
			}	
			
			console.log('SEARCH TERMS LEMMA', searchTermsRegExp);
			
			
		} else {
	
			isLemmaSearch = false;
			
			// ASCII characters have predictable word boundaries (space ' ' = \b)
			isAsciiRegExp.lastIndex = -1;
			if (isAsciiRegExp.test( searchText )) {
						
				// check for quoted search "jesus christ"
				if (searchText.substring(0,1) == '"' && searchText.substring(searchText.length-1) == '"') {
					var part = searchText;
					part = part						
							.split(' OR ').join('|')
					
							// remove the quotes
							.replace(/"/gi,'')
					
							// find punctuation in between the words
							.replace(/ /gi,'[\\s\\.,"\';:]+');
			
					searchTermsRegExp.push( new XRegExp('\\b(' + part + ')\\b', 'gi') );			
				} else {
				
					// for non-quoted searches, use "AND" search				
					var andSearchParts = searchText.split(/\s+AND\s+|\s+/gi);
					
					for (var i=0, il=andSearchParts.length; i<il; i++) {
					
						var part = andSearchParts[i];
										
						searchTermsRegExp.push( new XRegExp('\\b(' + part + ')\\b', 'gi') );
				
					}			
				}
						
			}
			// non-ASCII characters
			else {	
	
				var words = SearchTools.splitWords(searchText);
				
				for (var j=0, jl=words.length; j<jl; j++) {
				
					searchTermsRegExp.push( new XRegExp(words[j], 'gi') );
				
				}
				
				/*
				if (texts.singleWordLanguages.indexOf(textInfo.lang) > -1) {
					searchTermsRegExp = [];
					var chText = searchText; // .split(' AND ').join('');
					
					for (var j=0, jl=chText.length; j<jl; j++) {
						var chTerm = chText[j];
						if (chTerm.trim().length > 0) {
							searchTermsRegExp.push( new XRegExp(chText[j], 'gi') );
						}
					}
					
				} else {
					searchTermsRegExp = [new XRegExp(searchText, 'gi')];				
				}
				*/
				
				console.log('non ASCII', searchTermsRegExp);			
			}	
		}		
	}
		

	
	var ext = {
		start: start
	};
	ext = $.extend(true, ext, EventEmitter);
	
	return ext;
};

SearchTools = {
	splitWords: function(input) {

		var 
			removeRegChars = ['\\', '^', '$', '.', '|', '?', '*', '+', '(', ')', '[', ']', '{', '}'];
			otherRemoveChars = [
				// roman
				',',';', '!', '-', '–', '―', '—', '~', ':', '"','/', "'s", '’s', "'", '‘', '’', '“', '”', '¿', '<', '>', '&',
				// chinese
				'。', '：', '，', '”', '“', '）', '（', '~', '「', '」'
			],
			punctuation = [].concat(removeRegChars).concat(otherRemoveChars),		
			innerWordExceptions = ["'", '’', '-'],
			words = [],
			word = '';
			
		function addWord() {
			if (word != '')	{
				words.push(word);
			}
			word = '';
		}
		
		// formalize string
		input = new String(input);
		
		// yes or no on apostrophes
		input = input.replace(/(['’]s)/gi, '');
	
	    for (var i = 0, il = input.length; i<il; i++) {
			var	letter = input.charAt(i),
				charCode = input.charCodeAt(i),
				isFirstChar = (i==0);
				isLastChar = (i==il-1),
				isPunctuation = punctuation.indexOf(letter) > -1,
				isWhitespace = letter == ' ',
				isLetter = !(isWhitespace || isPunctuation);
			
			// if this is a letter
			if ( isLetter ) {
				
				 word += letter;
				
				// If this is a Chinese/Japanese/Korean ideograph, it is a word by itself. No separator is needed.
				if (((charCode >= 0x4E00) && (charCode <= 0x9FFF)) || ((charCode >= 0x3400) && (charCode <= 0x4DFF)) || ((charCode >= 0x20000) && (charCode <= 0x2A6DF))) {   
					
	                addWord(); // Technically, some ideographs combine to make a compound word, but concordance/search will work without that refinement, possibly with extra hits.
	            }			
				
			} else if (!isFirstChar && !isLastChar && innerWordExceptions.indexOf(letter) > -1 && punctuation.indexOf(input[i-1]) == -1 && punctuation.indexOf(input[i+1]) == -1) {
				
				word += letter;
				
			} else {
				// it was puntuation!
				addWord();
			}
				
			//console.log(letter, charCode);
	    }
	    
		addWord();
	
		return words;
	}
};

SearchIndexLoader = function() {

	var 
		baseContentPath = 'content/texts/',
		textInfo = null,
		searchTerms = [],
		searchTermsIndex = -1,
		isLemmaSearch = false,
		// initial load: [{term:'light': occurrences: ['GN1_2', 'GN2_5']}, {term: 'love': ['JN3']}
		loadedIndexes = [], 
		// final: [{sectionid:'GN1', fragmentids: ['GN1_2', 'GN1_3']}, {sectionid:'GN2', fragmentids: ['GN2_4']} }
		loadedResults = [],
		searchType = 'AND'; // OR

	// START
	function loadIndexes(newTextInfo, searchText, isLemma) {
	
		isLemmaSearch = isLemma;
		textInfo = newTextInfo;
	
		// split up search into words for indexing
		/*
		if (texts.singleWordLanguages.indexOf(textInfo.lang) > -1) {
			searchTerms = [];
			for (var i=0,il=searchText.length; i<il; i++) {
				var text = searchText[i];
				if (text.replace(/\s/gi, '').length > 0) {
					searchTerms.push( text );
				}
			}
		} else {
			searchTerms = searchText.replace(/\sAND\s/gi,' ').replace(/\sOR\s/gi,' ').replace(/"/g,'').split(/\s+/g);
		}
		*/
		searchTerms = SearchTools.splitWords(searchText);
		
		searchTermsIndex = -1;
		loadedIndexes = [];
		loadedResults = [];
		
		searchType = /\bOR\b/gi.test(searchText) ? 'OR' : 'AND';
		
		console.log('SearchIndexLoader:loadIndexes', searchText, searchType, searchTerms, isLemmaSearch);
		
		// start it up
		loadNextIndex();		
	}
	
	
	function loadNextIndex() {
	
		// starts at -1, so this will make the first one 0
		searchTermsIndex++;
		
		if (searchTermsIndex < searchTerms.length) {
		
			loadSearchTermIndex( searchTerms[searchTermsIndex] );
			
		} else {
			
			// if we've done all the indexes, then it's time to start combining them
			//combineIndexes();
			processIndexes();
		}
		
	}
	
	function loadSearchTermIndex(searchTerm) {
		
		var indexUrl = '';
		
		if (isLemmaSearch) {
		
			indexUrl = baseContentPath + textInfo.id + '/indexlemma/' + searchTerm + '.json';
			
		} else {
		
			var searchTermEncoded = base32.encode(unescape(encodeURIComponent(searchTerm.toLowerCase())));
		
			indexUrl = baseContentPath + textInfo.id + '/index/' + searchTermEncoded + '.json';
		}
			
		if (searchTerm == 'undefined') {
			console.log('STOP search. undefined term');	
			return;
		}
			
		console.log('Loading Index:' + searchTerm + ',' + searchTermEncoded);	
			
		// attempt to load in index
		$.ajax({
			dataType: 'json',
			url: indexUrl,
			success: function(data) {		
				loadedIndexes.push(data);
				
				loadNextIndex();
			}, 
			error: function() {
				console.log('no index for: ' + searchTerm);
				loadNextIndex();
			}
		
		});
	
	}	
	
	function processIndexes() {
	
		// we'll combine everything into this ['GN1_1', 'GN1_2']
		fragmentids = [];
		// then pair down to this [{sectionid:'GN1', fragmentids: ['GN1_1','GN1_2']}]
		loadedResults = [];
			
		if (searchType == 'OR') {
			// combine all the fragments
			for (var i=0, il=loadedIndexes.length; i<il; i++) {
				fragmentids = fragmentids.concat( loadedIndexes[i].occurrences );
				//console.log(loadedIndexes[i].term);
				//console.log(loadedIndexes[i].occurrences);
			}
			
			// sort!
			fragmentids.sort(function(a, b) {
				// split into parts
				function splitFragment(fragmentid) {
					var parts = fragmentid.split('_'),
						sectionid = parts[0],
						sectionIndex = textInfo.sections.indexOf(sectionid),
						fragmentNum = parseInt(parts[1], 10),
						value = {
							sectionid: sectionid,
							sectionIndex: sectionIndex,
							fragmentNum: fragmentNum
						};
						
					return value;
				}
				
				var fraga = splitFragment(a),
					fragb = splitFragment(b);
			
			
				if (fraga.sectionIndex < fragb.sectionIndex || 
					(fraga.sectionIndex == fragb.sectionIndex && fraga.fragmentNum < fragb.fragmentNum) )
					return -1;
				if (fraga.sectionIndex > fragb.sectionIndex || 
					(fraga.sectionIndex == fragb.sectionIndex && fraga.fragmentNum > fragb.fragmentNum) )
					return 1;
				// a must be equal to b
				return 0;			
			});
				
		
		} else if (searchType == 'AND') {
		
			// combine arrays to only include fragments (verses) where all indexes overlap (truth AND love)
			var totalIndexes = loadedIndexes.length;	
			if (totalIndexes == 1) {		
				fragmentids = loadedIndexes[0].occurrences;
			} else if (totalIndexes > 1) {
				fragmentids = loadedIndexes[0].occurrences.filter(function(val) {
					var inOtherArrays = true;
					for (var i=1; i<totalIndexes; i++) {
						if (loadedIndexes[i].occurrences.indexOf(val) == -1) {
							inOtherArrays = false;
							break;
						}
					}	
					
					return inOtherArrays;				
				});
			}
		}
	
		// reformat fragments into sectionids
		// ['JN1_1','JN1_2'] => [{sectionid: 'JN1', fragmentids: ['JN1_1','JN1_2']}]
		for (var i=0, il=fragmentids.length; i<il; i++) {
			var fragmentid = fragmentids[i],
				sectionid = fragmentid.split('_')[0];
				
			// see if we already created data for this section id
			var sectionidInfo = $.grep(loadedResults, function(val){ return val.sectionid == sectionid; });	
			
			// create new data
			if (sectionidInfo.length == 0) { 
				loadedResults.push({sectionid: sectionid, fragmentids: [fragmentid]});
			} 
			// add to this sectionid
			else {	
				sectionidInfo[0].fragmentids.push(fragmentid);
			}
			
		
		}
		
		
		console.log('SearchIndexLoader:processIndexes', 'DONe');
		// send up the chain
		ext.trigger('complete', {type:'complete', target: this, data: {
																	loadedIndexes: loadedIndexes,
																	loadedResults: loadedResults,
																	fragmentids: fragmentids
																}});
	}

	var ext = {
		loadIndexes: loadIndexes
	};
	ext = $.extend(true, ext, EventEmitter);
	
	return ext;	
};