texts.TextSearch = function() {

	var
		encoder = new base32.Encoder(),
		isSearching = false,
		canceled = false,
		searchText = '',
		searchTextid = '',
		searchTextEncoded = '',
		isAsciiRegExp = new XRegExp('^[\040-\176]*$', 'gi'),
		
		startTime = null,
		
		searchTermsRegExp = [],
		searchIndexLoader = new texts.SearchIndexLoader()
		
		;

	function start(text, textid) {
		
		console.log('TextSearch.start', text, textid);
		
		if (isSearching) {
			return false;
		}
		
		// store variables
		searchText = text;
		searchTextid = textid;
		textInfo = texts.Texts.getText(searchTextid);
		searchTextEncoded = encoder.update(searchText);
		
		// reset
		canceled = false;
		startTime = new Date();
	
		createSearchTerms();
		
		// first attempt to load indexes
		searchIndexLoader = new texts.SearchIndexLoader();
		searchIndexLoader.on('complete', function(e) {
			
			console.log('searchIndexLoader:complete', e.indexedSections);
			
			
		});
		searchIndexLoader.loadIndexes(textInfo, searchText);
	
		return true;		
	}
	
	function createSearchTerms() {
		searchTermsRegExp = [];
		
		// ASCII characters have predictable word boundaries (space ' ')
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
			searchTermsRegExp = [new XRegExp(searchText, 'gi')];
		}			
	}
		

	
	var ext = {
		start: start
	};
	ext = $.extend(true, ext, EventEmitter);
	
	return ext;
};


texts.SearchIndexLoader = function() {

	var 
		baseContentPath = 'content/texts/',
		encoder = new base32.Encoder(),
		textInfo = textInfo,
		searchTerms = [],
		searchTermsIndex = -1,
		indexedSections = [], // return data ['GN1', 'GN2', 'SS5' ... ]
		divisionMatches = {}, // for OR search:  merge all sections (chapters) together {'GN': [4,5], 'EX': [1,2]
		indexGroups = [],     // for AND search: sections (chapters) per word {'light': ['GN1'], 'love': ['JN3']} that we merge after ward
		searchType = 'AND'; // OR

	// START
	function loadIndexes(newTextInfo, searchText) {
	
		textInfo = newTextInfo;
	
		// split up search into words for indexing
		searchTerms = searchText.replace(/\sAND\s/gi,' ').replace(/\sOR\s/gi,' ').replace(/"/g,'').split(/\s+/g);
		searchTermsIndex = -1;
		
		// create an index of just the chapters (JN1) instead of all the verses (John.1.1 and John.1.7)
		indexedSections = [];
		divisionMatches = {};
		indexGroups = [];	
			
		for (var i=0,il=searchTerms.length; i<il; i++) {
			indexGroups.push([]);	
		}
		
		// start it up
		loadNextIndex();		
	}
	
	function loadNextIndex() {
	
		// starts at -1, so this will make the first one 0
		searchTermsIndex++;
		
		if (searchTermsIndex < searchTerms.length) {
		
			loadSearchTerm( searchTerms[searchTermsIndex] );
			
		} else {
			
			// if we've done all the indexes, then it's time to start combining them
			combineIndexes();
		}
		
	} 
	
	/*
	function loadSearchTerm(searchTerm) {
		var
			searchTermEncoded = encoder.update(searchTerm);
			indexUrl = baseContentPath + textInfo.id + '/index/' + searchTermEncoded + '.json';
			
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
			
				console.log('index:', data);
				
				var fragmentidarray = data[searchTerm];
			
				processFragments(fragmentidarray);		
				
				console.log('load next index');
				loadNextIndex();
			}, 
			error: function() {
				console.log('no index for: ' + searchTerm);
				loadNextIndex();
			}
		
		});
	
	}
	
	function processFragments(fragmentidarray) {
		// spin through data
		for (var i=0, il=fragmentidarray.length; i<il; i++) {
			var fragmentid = fragmentidarray[i],
				parts = fragmentid.split('_'), // JN1_5
				fragmentNum = parts.length > 1 ? parts[1] : '',
				sectionid = parts[0],
				divisionid = sectionid.substring(0,2),
				sectionNum = sectionid.substring(2);
					
			// for OR searches, we are combining the indexes into one LONGER list that we sort at the end	
			if (searchType == 'OR') {
				var divisionSectionArray = divisionMatches[divisionid];
							
				if (typeof divisionSectionArray == 'undefined') {
					// create new array for this division (bible book) with this section (chapter)
					divisionMatches[divisionid] = [sectionNum];
				} else {
					if (divisionSectionArray.indexOf(sectionNum) == -1) {
						divisionSectionArray.push(sectionNum);
					}
				}
			
			// for AND searches, we store all the indexes and then combine them after we're done
			} else if (searchType == 'AND') {
			
				var group = indexGroups[searchTermsIndex];
					
				if (group.indexOf(sectionid) == -1) {
					group.push(sectionid);
				}
			
			}
		
		}		
	}	
	
	function combineIndexes() {
		
		// reset the final list of sections (Bible chapters) we are going to load
		indexedSections = [];
		
		// OR Search
		if (searchType == 'OR') {
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
		} else if (searchType == 'AND') {
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
			
			//console.log('COMBINE', indexedSections.length, indexedSections);							
		}
			
		if (indexedSections.length > 0) {		
			// set the first one
			indexedSectionsIndex = -1;
			bookOsisID = indexedSections[indexedSectionsIndex+1].split('.')[0];
			chapterIndex = parseInt(indexedSections[indexedSectionsIndex+1].split('.')[1])-1;	
		}
		
		//console.log( 'loaded indexes', indexedSections);
			
		ext.trigger('complete', {type:'complete', target: this, indexedSections: indexedSections});			
	}
	*/


	var ext = {
		loadIndexes: loadIndexes
	};
	ext = $.extend(true, ext, EventEmitter);
	
	return ext;	

}




texts.TextSearch2 = function() {

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
}