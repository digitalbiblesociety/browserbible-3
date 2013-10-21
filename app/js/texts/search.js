texts.TextSearch = function() {

	var
		encoder = new base32.Encoder(),
		isSearching = false,
		canceled = false,
		searchText = '',
		searchTextid = '',
		searchTextEncoded = '',
		
		searchRegExp = null,
		highlightRegExp = null,
		
		isAsciiRegExp = new XRegExp('^[\040-\176]*$', 'gi'),
		verseRegExp = new XRegExp('<span class="verse[^>]*?>(.)*?</span>(\r|\n)', 'gi'),
		verseNumRegExp = new XRegExp('\\w{1,6}\\.\\d{1,3}\\.\\d{1,3}','gi'),
		//stripNotesRegExp = new RegExp('<span class="(note|cf)">.+?</span>','gi'),
		stripNotesRegExp = new XRegExp('<span class="(note|cf)"><span class="key">[a-zA-Z0-9]+</span><span class="text">.+?</span></span>','gi'),
		replaceLexRegExp = new XRegExp('<span class="word"[^>]+>(.+?)</span>','gi'),
		
		startTime = null,
		searchResultsArray = [],
		searchRegExp = [],
		
		searchTerms = [],
		
		isLemmaSearch = false,

		textInfo = null,
		baseBiblePath = 'content/bibles/',
		baseLemmaPath = 'content/lexicons/index/',
		
		indexedSections = [],
		indexedSectionsInidex = -1,
		divisionMatches = {},
		indexGroups = [],
		searchType = 'single'; // single, multiple, exact


	function start(text, textid) {
		
		if (isSearching) {
			return false;
		}
		
		searchText = text;
		searchTextid = textid;
		searchTextEncoded = encoder.update(searchText);
		
		
		// reset
		canceled = false;
		startTime = new Date();
		searchResultsArray = [];
		isAsciiRegExp.lastIndex = 0;		
				
		// lemma?
		isLemmaSearch = /(G|H)\d{1,5}/.test(searchText);	
		
	
		// ASCII vs. non-ASCII
		if (isAsciiRegExp.test( searchText )) {
			
			// reset the regexes
			searchRegExp = [];
			
			// check for quoted search "jesus christ"
			if (searchText.substring(0,1) == '"' && searchText.substring(searchText.length-1) == '"') {
				var part = searchText;
				part = part.split(' OR ').join('|');
				
				// remove the quotes
				part = part.replace(/"/gi,'');
				
				// find punctuation in between the words
				part = part.replace(/ /gi,'[\\s\\.,"\';:]+');
		
				searchRegExp.push( new XRegExp('\\b(' + part + ')\\b', 'gi') );			
			} else {
			
				// for non-quoted searches, use "AND" search
				
				var andSearchParts = searchText.split(/\s+AND\s+|\s+/gi);
				
				for (var i=0, il=andSearchParts.length; i<il; i++) {
				
					var part = andSearchParts[i];
	
					//part = part.split(' OR ').join('|');
					//part = part.split(' ').join('|');
				
					searchRegExp.push( new XRegExp('\\b(' + part + ')\\b', 'gi') );
			
				}			
			}
					
			console.log('SEARCH', searchRegExp);
		
		}
		// non-ASCII characters
		else {			
			console.log('non ASCII');
		
			searchRegExp = [new XRegExp(s.searchText, 'gi')];
		}		
			
		// get text info so we can do divisions	
		texts.Texts.getText(searchTextid, function(newTextInfo) {
			
			textInfo = newTextInfo;
			
			checkForIndexes();
	
		});
			
	
		return true;
	}
	
	function checkForIndexes() {
	
		// split up search into words for indexing
		searchTerms = searchText.replace(/\sAND\s/gi,' ').replace(/\sOR\s/gi,' ').replace(/"/g,'').split(/\s+/g);
		searchTermsIndex = -1;
		
		// create an index of just the chapters (JN1) instead of all the verses (John.1.1 and John.1.7)
		indexedSections = []
		divisionMatches = {};
		indexGroups = [];	
			
		for (var i=0,il=searchTerms.length; i<il; i++) {
			indexGroups.push([]);		
		}
		
		// start it up
		loadNextIndex();		
	}
	
	function loadNextIndex() {
	
		searchTermsIndex++;
		
		// if we've done all the indexes, then it's time to start combining them
		if (searchTermsIndex == searchTerms.length) {
		
			// reset the final list of OSIS chapters we are going to load
			indexedSections = [];
			
			// OR Search
			if (searchRegExp.length == 1) {
				// create unique indexed chapters
				for (var i=0, il=textInfo.divisions.length; i<il; i++) {
					var divisionid = textInfo.divisions[i],
						divisionSections = divisionMatches[divisionid];
						
					if (typeof divisionSections != 'undefined') {
						for (var j=0, jl=divisionSections.length; j<jl; j++) {
							
							indexedSections.push(divisionid + divisionSections[j]);
						}
					}
				}
			} else {
				console.log('COMBINING indexes',indexGroups);	
						
				var firstArray = indexGroups[0];
					
				// go through all the values of the first array and see if it's in the others
				// LOVE => Gen.1, Gen.2
				// TRUTH => Gen.2, Mark.3
				// result => Gen.2
				for (var i=1, il=firstArray.length; i<il; i++) {
					var sectionid = firstArray[i],
						inAllArrays = true;


					// see if the other arrays have this value					
					for (var j=1, jl=indexGroups.length; j<jl; j++) {
						var group = indexGroups[j];
						
						if (group.indexOf(sectionid) == -1) {
							inAllArrays = false;
							//break;
						}
					}
					
					//console.log(osis, inAllArrays, s.indexGroups[1].indexOf
					
					if (inAllArrays) {
						indexedSections.push(sectionid);
					}
				}
				
				console.log('COMBINE', indexedSections.length, indexedSections);							
			}
				
			if (indexedSections.length > 0) {		
				// set the first one
				indexedSectionsIndex = -1;
				bookOsisID = indexedSections[indexedSectionsIndex+1].split('.')[0];
				chapterIndex = parseInt(indexedSections[indexedSectionsIndex+1].split('.')[1])-1;	
			}
			
			console.log( 'loaded indexes', s.indexedSections);
			
			isSearching = true;
			nextChapter();				
		
			
		} else {
			
			// since we are not at the end of the indexes, we'll get the next one
			
			var
				term = searchTerms[searchTermsIndex],
				indexUrl = (isLemmaSearch) ? 
								baseLemmaPath + term + '.json' :
								baseBiblePath + textid + '/index/' + term + '.json';
				
			if (term == 'undefined') {
				console.log('STOP search. undefined term');	
				return;
			}
				
			console.log('Loading Index:' + term);	
				
			// attempt to load in index
			$.ajax({
				dataType: 'json',
				url: indexUrl,
				success: function(data) {
				
					console.log('index:' + data);
					//return;
				
					for (var i=0, il=data.length; i<il; i++) {
						var fragmentid = data[i],
							parts = fragmentid.split('_'),
							fragmentNum = parts.length > 1 ? parts[1] : '',
							sectionid = parts[0],
							divisionid = sectionid.substring(0,2),
							sectionNum = sectionid.substring(2);
								
						// for OR searches, we are combining the indexes into one LONGER list that we sort at the end	
						if (searchRegExp.length == 1) {
							var bookCheck = divisionMatches[bookOsis];
										
							if (typeof bookCheck == 'undefined') {
								osisBookMatches[bookOsis] = [chapterNumber];
							} else {
								if (bookCheck.indexOf(chapterNumber) == -1) {
									bookCheck.push(chapterNumber);
								}
							}
						
						// for AND searches, we store all the indexes and then combine them after we're doing
						} else {
						
							var group = indexGroups[searchTermsIndex],
								sectionid = divisionid + '' + sectionnumber;
								
							//console.log(group, s.indexGroups, chapterOsis);
							
							if (group.indexOf(chapterOsis) == -1) {
								group.push(chapterOsis);
							}
						
						}
				
					}			
					
					console.log('load next index', s.osisBookMatches);
					loadNextIndex();
	
				}, 
				error: function() {
					console.log('no index for: ' + term);
					loadNextIndex();
				}
			
			});
		}
	
	}	
	
	function nextChapter() {
	
	}

	
	var ext = {
		start: start
	};
	ext = $.extend(true, ext, EventEmitter);
	
	return ext;
};