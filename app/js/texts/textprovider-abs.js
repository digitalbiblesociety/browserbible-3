sofia.config = $.extend(sofia.config, {

	enableAmericanBibleSociety: true,

	absUrl: 'abs.php',

	absForceLoadVersions: false,

	absExclusions: []

});



sofia.textproviders['abs'] = (function() {

	var text_data = [],
		text_data_is_loaded = false,
		text_data_is_loading = false,
		text_data_callbacks = [],

		fums_loaded = false,

		providerName = 'abs',
		fullName = 'American Bible Society Bibles API';

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
					action: 'list',
					force: sofia.config.absForceLoadVersions
				},
				success: function(data) {

					if (data == null || data.textInfoData == null) {
						finish();
						return;
					}

					text_data = data.textInfoData;

					// remove versions you don't want
					if (sofia.config.absExclusions && sofia.config.absExclusions.length > 0) {
						text_data = text_data.filter(function(text) {
							return sofia.config.absExclusions.indexOf(text.id) == -1;
						});
					}

					TextLoader.processTexts(text_data, providerName);

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

		var textinfo = getTextInfoSync(textid),

			lang3 = textinfo.lang,
			lang = iso2iana.convert(lang3),
			dir = (textinfo.dir && (textinfo.dir == 'ltr' || textinfo.dir == 'rtl')) ? textinfo.dir : data.language.isRTL(lang) ? 'rtl' : 'ltr',

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
				lang3: lang3,
				lang: lang,
				dir: dir,
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

				function padLeft(s, n) {

				}

				for (var i=0, il=data.results.length; i<il; i++) {
					var result = data.results[i],
						fragmentid = Object.keys(result)[0],
						html = result[fragmentid],

						dbsBookCode = fragmentid.substring(0,2),
						bookData = bible.BOOK_DATA[dbsBookCode],
						bookIndex = (bookData) ? bookData.sortOrder : '0',
						chapterNum = fragmentid.split('_')[1].substring(2),
						verseNum = fragmentid.split('_')[0],
						pad = '000',
						canonicalOrder =
									(pad + bookIndex.toString()).slice(-pad.length) +
									(pad + chapterNum.toString()).slice(-pad.length) +
									(pad + verseNum.toString()).slice(-pad.length);


					if (html.indexOf('class="highlight"') == -1) {
						html = highlightWords(html, e.data.searchTermsRegExp);
					}

					// fix canonical order
					e.data.results.push({
						fragmentid: fragmentid,
						html: html,
						canonicalOrder: canonicalOrder
					});

				}

				// sort restuls
				e.data.results.sort(function(a,b) {
					if  (a.canonicalOrder > b.canonicalOrder) {
						return 1;
					} else if  (a.canonicalOrder < b.canonicalOrder) {
						return -1;
					} else {
						return 0;
					}
				});


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
		startSearch: startSearch,
		fullName: fullName
	}

})();
