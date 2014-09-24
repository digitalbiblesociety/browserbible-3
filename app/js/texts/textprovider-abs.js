sofia.config = $.extend(sofia.config, {

	enableAmericanBibleSociety: true,
	
	absUrl: 'abs.php',
	
	absUseLocalTextIndex: false
	
});



sofia.textproviders['abs'] = (function() {

	var text_data = [],
		text_data_is_loaded = false,
		text_data_is_loading = false,
		text_data_callbacks = [],
		
		fums_loaded = false,
		
		providerName = 'abs';

	function getTextManifest (callback) {

		// check for offline use
		if (!sofia.config.enableOnlineSources || !sofia.config.enableAmericanBibleSociety || sofia.config.absUrl == '') {
			callback(null);
			return;
		}

		// if loaded immediately callback
		if (text_data_is_loaded) {

			callback(text_data);

		} else {

			// store callback
			text_data_callbacks.push(callback);

			// don't continue
			if (text_data_is_loading) {
				return;
			}

			text_data_is_loading = true;

			$.ajax({
				url: sofia.config.baseContentUrl + sofia.config.absUrl,
				dataType: 'jsonp',
				beforeSend:  function(xhr){
					if (xhr.overrideMimeType) {
						xhr.overrideMimeType('application/javascript');
					}
				},
				cache: false,
				data: {
					action: 'list'
				},
				success: function(data) {
				
					text_data = data.textInfoData;

					TextLoader.processTexts(text_data, providerName);

					for (var i=0, il=text_data.length; i<il; i++) {
						text_data[i].aboutHtml = createAboutHtml(text_data[i].name, text_data[i].abbr);
					}

					finish();
				},
				error: function(jqXHR, textStatus, errorThrown) {
				
					text_data = null;
					finish();
				}
			});
		}
	}

	function finish() {
		text_data_is_loading = false;
		text_data_is_loaded = true;

		while (text_data_callbacks.length > 0) {
			var cb = text_data_callbacks.pop();
			cb(text_data);
		}
	}

	function createAboutHtml(title, version_code) {
		return '<h1>' + title + ' (' + version_code + ')' + '</h1>' +
				'<dl>' +
					'<dt>Source</dt>' +
					'<dd>This text comes from the <a href="https://bibles.org/pages/api/">BIBLESEARCH API</a> provided by <a href="http://www.americanbible.org/">American Bible Society</a></dd>' +

					'<dt>API EULA</dt>' +
					'<dd><a href="https://bibles.org/pages/legal#terms">End User License Agreement</a> for API</dd>' +
				'</dl>';
	}
	
	function getProviderid(textid) {
		var parts = textid.split(':'),
			fullid = providerName + ':' + (parts.length > 1 ? parts[1] : parts[0]);
			
		return fullid;
	}

	function getTextInfo(textid, callback) {
	
		if (!text_data_is_loaded) {

			getTextManifest (function() {
				getTextInfo(textid, callback);
			});
			return;
		}
		
		var providerid = getProviderid(textid);		

		// get initial data
		var info = text_data.filter(function(text) {
			return text.providerid == providerid;
		})[0];

		if (typeof info.divisions == 'undefined' || info.divisions.length == 0) {
				
			$.ajax({
				url: sofia.config.baseContentUrl + sofia.config.absUrl,
				dataType: 'jsonp',
				beforeSend:  function(xhr){
					if (xhr.overrideMimeType) {
						xhr.overrideMimeType('application/javascript');
					}
				},
				cache: false,
				data: {
					action: 'books',
					version: info.absid
				},
				success: function(data) {
					
					$.extend(info, data);
					callback(info);
					
				},
				error: function(jqXHR, textStatus, errorThrown) {
					callback(null);
				}				
				
			});

		} else {

			callback(info);
		}

	}


	function getTextInfoSync(textid) {

		var providerid = getProviderid(textid);

		// get initial data
		var info = text_data.filter(function(text) {
			return text.providerid == providerid;
		})[0];

		return info;
	}


	function loadSection(textid, sectionid, callback) {

		var textinfo = getTextInfoSync(textid)
			dbsBookCode = sectionid.substring(0,2),
			osisBookCode = bible.BOOK_DATA[dbsBookCode].osis,
			chapterNum = sectionid.substring(2),
			
			sectionIndex = textinfo.sections.indexOf(sectionid),
			previd = sectionIndex > 0 ? textinfo.sections[sectionIndex-1] : null,
			nextid = sectionIndex < textinfo.sections.length ? textinfo.sections[sectionIndex+1] : null;

		$.ajax({
			url: sofia.config.baseContentUrl + sofia.config.absUrl,
			dataType: 'jsonp',
			beforeSend:  function(xhr){
				if (xhr.overrideMimeType) {
					xhr.overrideMimeType('application/javascript');
				}
			},
			cache: false,
			data: {
				action: 'chapter',
				version: textinfo.id,
				lang3: textinfo.lang,
				lang: iso2iana.convert(textinfo.lang),
				sectionid: sectionid,
				osis: osisBookCode,
				chapter: chapterNum,
				previd: previd,
				nextid: nextid,
				bookname: textinfo.divisionNames[textinfo.divisions.indexOf(dbsBookCode)]			
			},
			success: function(data) {
			
				callback(data.html);	
				
				
				if (!fums_loaded) {
					
					$.getScript('//' + data.fums_js_include, function() {
						fums_loaded = true;
						
						eval(data.fums_js);
											
					});
					
				} else {
				
					eval(data.fums_js);
					
				}
							
			},
			error: function(jqXHR, textStatus, errorThrown) {
				callback(null);
			}				
			
		});
	}

	function startSearch(textid, divisions, text, onSearchLoad, onSearchIndexComplete, onSearchComplete) {

		var textinfo = getTextInfoSync(textid),
			e = {
				type:'complete',
				target: this,
				data: {
					results: [],
					searchIndexesData: [], // not needed for SearchWindow
					searchTermsRegExp: SearchTools.createSearchTerms(text, false),
					isLemmaSearch: false
				}
			};		

		$.ajax({
			url: sofia.config.baseContentUrl + sofia.config.absUrl,
			dataType: 'jsonp',
			beforeSend:  function(xhr){
				if (xhr.overrideMimeType) {
					xhr.overrideMimeType('application/javascript');
				}
			},
			cache: false,
			data: {
				action: 'search',
				version: textinfo.id,
				text: text,
				divisions: divisions
			},
			success: function(data) {
			
				//e.data.results = data.results;
				
				for (var i=0, il=data.results.length; i<il; i++) {
					var result = data.results[i],
						fragmentid = Object.keys(result)[0],
						html = result[fragmentid];

					e.data.results.push({
						fragmentid: fragmentid,
						html: html
					});
			
				}				
				
				console.log('search complete');
				console.log(e);
				
				onSearchComplete(e);				
				
				if (!fums_loaded) {
					
					$.getScript('//' + data.fums_js_include, function() {
						fums_loaded = true;
						
						eval(data.fums_js);
											
					});
					
				} else {
				
					eval(data.fums_js);
					
				}
							
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('search error', textStatus, errorThrown);
				onSearchComplete(null);
			}				
			
		});

		/*
		$.ajax({
			beforeSend: function(xhr){
				if (xhr.overrideMimeType){
					xhr.overrideMimeType("application/javascript");
				}
			},
			dataType: 'jsonp',
			
			// One giant call seems faster, than doing all the books individually?
			url: 'http://dbt.io/text/search?v=2&reply=jsonp&key=' + sofia.config.fcbhKey + '&dam_id=' + dam_id + '&query=' + text.replace(/\s/gi, '+') + '&limit=2000',
			success: function(data) {

				for (var i=0, il=data[1].length; i<il; i++) {
					var verse = data[1][i],
						dbsBookCode = bible.DEFAULT_BIBLE[ bible.DEFAULT_BIBLE_OSIS.indexOf(verse.book_id) ],
						fragmentid = dbsBookCode + verse.chapter_id + '_' + verse.verse_id,
						hasMatch = e.data.searchTermsRegExp[0].test(verse.verse_text);

					if (hasMatch && (divisions.length == 0 || divisions.indexOf(dbsBookCode) > -1)) {
						e.data.results.push({
							fragmentid: fragmentid,
							html: highlightWords(verse.verse_text, e.data.searchTermsRegExp)
						});
					}
				}

				callback(data);
			}
		});
		*/
	}

	function highlightWords(text, searchTermsRegExp) {

		var processedHtml = text;

		for (var j=0, jl=searchTermsRegExp.length; j<jl; j++) {

			searchTermsRegExp[j].lastIndex = 0;

			// surround the word with a highlight
			processedHtml = processedHtml.replace(searchTermsRegExp[j], function(match) {
				return '<span class="highlight">' + match + '</span>';
			});
		}

		return processedHtml;
	}


	return {
		getTextManifest: getTextManifest,
		getTextInfo: getTextInfo,
		loadSection: loadSection,
		startSearch: startSearch
	}

})();
