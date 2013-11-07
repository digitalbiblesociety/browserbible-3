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


texts.TextSearch = function() {

	var
		baseContentPath = 'content/texts/',
		isSearching = false,
		canceled = false,
		searchText = '',
		searchTextid = '',
		isAsciiRegExp = new XRegExp('^[\040-\176]*$', 'gi'),
		
		startTime = null,
		
		searchTermsRegExp = [],
		searchIndexLoader = new texts.SearchIndexLoader(),
		searchIndexesData = [],
		searchIndexesCurrentIndex = 0
		
		searchFinalResults = [];
		;
		
	searchIndexLoader.on('complete', indexesLoaded);

	function start(text, textid) {
		
		console.log('TextSearch.start', text, textid);
		
		if (isSearching) {
			return false;
		}
		isSearching = true;
		
		// store variables
		searchText = text;
		searchTextid = textid;
		textInfo = texts.Texts.getText(searchTextid);
		
		
		// reset
		canceled = false;
		startTime = new Date();
		searchFinalResults = [];
	
		createSearchTerms();
		
		// first attempt to load indexes
		searchIndexLoader.loadIndexes(textInfo, searchText);
	
		return true;		
	}
	
	// fires after indexer loader is done
	function indexesLoaded(e) {
		console.log('searchIndexLoader:complete', e.data);
		
		if (e.data.loadedIndexes.length == 0) {
			// BRUTE FORCE?
			
		} else {
			// begin loading
			searchIndexesData = e.data.loadedResults;
			searchIndexesCurrentIndex = -1;
			loadNextSectionid();
		}
		
	}
	
	function loadNextSectionid() {
		searchIndexesCurrentIndex++;
		
		if (searchIndexesCurrentIndex == searchIndexesData.length) {
			// DONE!
			
			ext.trigger('complete', {type: 'complete', target:this, data: {results: searchFinalResults}});
			
			isSearching = false;
			
		} else {
			var sectionData = searchIndexesData[searchIndexesCurrentIndex],
				sectionid = sectionData.sectionid,
				fragmentids = sectionData.fragmentids,
				url = baseContentPath + textInfo.id + '/' + sectionid + '.json';
			
			ext.trigger('load', {type: 'load', target:this, data: {sectionid: sectionid}});
				
			$.ajax({
				dataType: 'json',
				url: url,
				success: function(data) {
					
					var content = $(data.text);
					
					for (var i=0, il=fragmentids.length; i<il; i++) {
						var 
							fragmentid = fragmentids[i],
							fragmentNode = content.find('.' + fragmentid),
							html = fragmentNode.html();
							
						if (fragmentNode.length > 0) {
							
							var foundMatch = false;
						
							for (var j=0, jl=searchTermsRegExp.length; j<jl; j++) {
								
								searchTermsRegExp.lastIndex = 0;
								html = html.replace(searchTermsRegExp[j], function(match) {
									foundMatch = true;
									return '<span class="highlight">' + match + '</span>';
								});
							}
						
							if (foundMatch) {
								searchFinalResults.push({fragmentid: fragmentid, html: html});
							}
						}
					}					
					
					loadNextSectionid();					
				}, 
				error: function() {
					loadNextSectionid();
				}
			});
			
		}
	}
	
	function createSearchTerms() {
		searchTermsRegExp = [];
		
		// ASCII characters have predictable word boundaries (space ' ')
		isAsciiRegExp.lastIndex = 0;
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
		textInfo = textInfo,
		searchTerms = [],
		searchTermsIndex = -1,
		// initial load: [{term:'light': occurrences: ['GN1_2', 'GN2_5']}, {term: 'love': ['JN3']}
		loadedIndexes = [], 
		// final: [{sectionid:'GN1', fragmentids: ['GN1_2', 'GN1_3']}, {sectionid:'GN2', fragmentids: ['GN2_4']} }
		loadedResults = [],
		searchType = 'AND'; // OR

	// START
	function loadIndexes(newTextInfo, searchText) {
	
		textInfo = newTextInfo;
	
		// split up search into words for indexing
		searchTerms = searchText.replace(/\sAND\s/gi,' ').replace(/\sOR\s/gi,' ').replace(/"/g,'').split(/\s+/g);
		searchTermsIndex = -1;
		loadedIndexes = [];
		
		searchType = /\bOR\b/gi.test(searchText) ? 'OR' : 'AND';
		
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
		var
			searchTermEncoded = base32.encode(searchTerm);
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
			

				
				var fragmentidarray = data[searchTerm];
				
				loadedIndexes.push({term: searchTerm, occurrences: fragmentidarray});
				
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
				console.log(loadedIndexes[i].term);
				console.log(loadedIndexes[i].occurrences);
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
}