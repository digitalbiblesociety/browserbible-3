sofia.config = $.extend(sofia.config, {
	dbsEnabled: true,
	dbsKey: '',
	dbsBase: 'https://api.dbp4.org/',	
	dbsIncludeList: [],
	dbsExcludeList: [],
});



sofia.textproviders['dbs'] = (function() {

	var text_data = [],
		text_data_is_loaded = false,
		text_data_is_loading = false,
		text_data_callbacks = [],

		providerName = 'dbs',
		fullName = 'Digital Bible Society';

	function getTextManifest (callback) {

		// check for offline use
		if (!sofia.config.enableOnlineSources || !sofia.config.dbsEnabled || sofia.config.dbsKey == '' ) {
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
				url: sofia.config.dbsBase + 'bibles?v=4&key=' + sofia.config.dbsKey,
				/*
				dataType: 'jsonp',
				beforeSend:  function(xhr){
					if (xhr.overrideMimeType) {
						xhr.overrideMimeType('application/javascript');
					}
				},
				*/
				dataType: 'json',
				cache: false,
				success: function(data) {

					if (data == null || data.data == null) {
						finish();
						return;
					}

					// convert to older DBS version
	/*
	{
		"id":"eng-CEV",
		"name":"Contemporary English Version (US Version)",
		"nameEnglish":"",
		"abbr":"CEV",
		"lang":"eng",
		"langName":"English",
		"langNameEnglish":"English",
		"dir":"ltr",
		"type":"bible",
		"absid":"eng-CEV",
		"absAudio":"NONE"
	},
	*/
					text_data = [];
					for (var id in data.data) {

						var dbs = data.data[id];

						// skip not in include list
						if (sofia.config.dbsIncludeList.length > 0 && sofia.config.dbsIncludeList.indexOf(dbs.abbr) == -1) {
							continue;
						}
						
						// skip in exclude list
						if (sofia.config.dbsExcludeList.length > 0 && sofia.config.dbsExcludeList.indexOf(dbs.abbr) > -1) {
							continue;
						}						
						
						// keep this one!
						if (dbs.name != null) {
							var sofiabible = {
								type: 'bible',
								id: dbs.abbr,
								name: dbs.name,
								nameEnglish: dbs.vname,
								abbr: dbs.abbr,
								lang: dbs.iso,
								langName: dbs.language,
								langNameEnglish: dbs.language,
								dbs: dbs
							};
							text_data.push(sofiabible);
						}
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
				url: sofia.config.dbsBase + 'bibles/' + info.id + '?v=4&key=' + sofia.config.dbsKey ,
				dataType: 'json',
				/*
				dataType: 'jsonp',
				beforeSend:  function(xhr){
					if (xhr.overrideMimeType) {
						xhr.overrideMimeType('application/javascript');
					}
				},
				*/
				cache: false,
				success: function(data) {


					// transfer books and chapters
					/*
					divisions: ['GN','EX']
					sections: ['GN1','GN2']
					*/

					info.divisions = [];
					info.sections = [];
					info.divisionNames = [];

					// book list (divisions)
					for (var i=0, il=data.data.books.length; i<il; i++) {
						var bookinfo = data.data.books[i],
							usfmCode = bookinfo.book_id,
							bookIndex = bible.APOCRYPHAL_BIBLE_USFM.indexOf(usfmCode),
							dbsCode = bible.APOCRYPHAL_BIBLE[bookIndex];

						if (typeof dbsCode == 'undefined') {
							console.warn(bookinfo, usfmCode);
						}

						info.divisions.push(dbsCode);
						info.divisionNames.push(bookinfo.name);

						// chapter list (sections)
						for (var j=0, jl=bookinfo.chapters.length; j<jl; j++) {

							info.sections.push(dbsCode + (j+1));

						}

					}


					console.log('converted DBS' + info.id);
					console.log(info);



					//$.extend(info, data);
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

		loadSectionText(textid, sectionid, callback);

	}


	function loadSectionText(textid, sectionid, callback) {

		var textinfo = getTextInfoSync(textid),

			lang3 = textinfo.lang,
			lang = iso2iana.convert(lang3),
			dir = (textinfo.dir && (textinfo.dir == 'ltr' || textinfo.dir == 'rtl')) ? textinfo.dir : data.language.isRTL(lang) ? 'rtl' : 'ltr',


			bookid = dbsBookCode = sectionid.substring(0,2),
			usfm = bible.BOOK_DATA[dbsBookCode].usfm,
			chapterNum = sectionid.substring(2),

			sectionIndex = textinfo.sections.indexOf(sectionid),
			previd = sectionIndex > 0 ? textinfo.sections[sectionIndex-1] : null,
			nextid = sectionIndex < textinfo.sections.length ? textinfo.sections[sectionIndex+1] : null;


		// TEXT VERSION


		$.ajax({
			url: sofia.config.dbsBase + 'bibles/filesets/' + textinfo.id + '/' + usfm + '/' + chapterNum + '?v=4&key=' + sofia.config.dbsKey ,
			dataType: 'json',
			/*
			dataType: 'jsonp',
			beforeSend:  function(xhr){
				if (xhr.overrideMimeType) {
					xhr.overrideMimeType('application/javascript');
				}
			},
			*/
			cache: false,
			success: function(data) {

				// create HTML
				var html = [];

				//<div class="section chapter AC AC1 eng_kjv eng" dir="ltr" lang="en" data-id="AC1" data-nextid="AC2" data-previd="JN21">
				html.push('<div class="section chapter ' + textid + ' ' + bookid + ' ' + sectionid + ' ' + iso2iana.convert(lang) + ' " ' +
							' data-textid="' + textid + '"' +
							' data-id="' + sectionid + '"' +
							' data-nextid="' + nextid + '"' +
							' data-previd="' + previd + '"' +
							' lang="' + lang + '"' +
							' data-lang3="' + lang + '"' +
							' dir="' + dir + '"' +
							'>');


				if (chapterNum == '1') {
					html.push('<div class="mt">' + textinfo.divisionNames[textinfo.divisions.indexOf(bookid)] + '</div>');
				}

				html.push('<div class="c">' + chapterNum + '</div>');

				html.push('<div class="p">');
				for (var i=0, il=data.data.length; i<il; i++ ) {
					var verse = data.data[i],
						text = verse.verse_text,
						vnum = verse.verse_start,
						vid = sectionid + '_' + vnum;

					html.push(' <span class="v-num v-' + vnum + '">' + vnum + '</span><span class="v ' + vid + '" data-id="' + vid + '">' + text + '</span>');

				}

				html.push('</div>'); // p
				html.push('</div>'); // section



				callback(html.join(''));


			},
			error: function(jqXHR, textStatus, errorThrown) {
				callback(null);
			}

		});
	}

	function startSearch(textid, divisions, text, onSearchLoad, onSearchIndexComplete, onSearchComplete) {

		var e = {
			type:'complete',
			target: this,
			data: {
				results: [],
				searchIndexesData: [], // not needed for SearchWindow
				searchTermsRegExp: SearchTools.createSearchTerms(text, false),
				isLemmaSearch: false
			}
		};

		doSearch(textid, divisions, text, e, function() {

			onSearchComplete(e);

		});
	}
	function doSearch(textid, divisions, text, e, callback) {

		var textinfo = getTextInfoSync(textid);

		$.ajax({
			/*
			beforeSend: function(xhr){
				if (xhr.overrideMimeType){
					xhr.overrideMimeType("application/javascript");
				}
			},
			dataType: 'jsonp',
			*/
			dataType: 'json',

			// One giant call seems faster, than doing all the books individually?
			url: sofia.config.dbsBase + 'text/search?v=4&key=' + sofia.config.dbsKey + '&fileset_id=' + textid + '&query=' + text.replace(/\s/gi, '+') + '&limit=2000',
			success: function(data) {

				for (var i=0, il=data.data.length; i<il; i++) {
					var verse = data.data[i],
						dbsBookCode = bible.DEFAULT_BIBLE[ bible.DEFAULT_BIBLE_USFM.indexOf(verse.book_id) ],
						fragmentid = dbsBookCode + verse.chapter + '_' + verse.verse_start,
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
