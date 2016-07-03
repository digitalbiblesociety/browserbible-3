
sofia.textproviders['fcbh'] = (function() {

	var text_data = [],
		text_data_is_loaded = false,
		text_data_is_loading = false,
		text_data_callbacks = [],
		providerName = 'fcbh',
		fullName = 'Faith Comes by Hearing - Digital Bible Platform';
	

	function getTextManifest (callback) {

		// check for offline use
		if (!sofia.config.enableOnlineSources || typeof sofia.config.fcbhKey == 'undefined' || sofia.config.fcbhKey == '') {
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


			sofia.ajax({
				url: 'content/texts/texts_fcbh.json',
				dataType: 'json',
				cache: false,
				success: function(data) {

					text_data = data.textInfoData;

					TextLoader.processTexts(text_data, providerName);

					for (var i=0, il=text_data.length; i<il; i++) {
						text_data[i].aboutHtml = createAboutHtml(text_data[i].name, text_data[i].abbr);
					}

					// filter
					if (sofia.config.fcbhTextExclusions && sofia.config.fcbhTextExclusions.length > 0) {

						text_data = text_data.filter(function(t) {

							// keep the ones that aren't in the exclusion list
							return sofia.config.fcbhTextExclusions.indexOf(t.id) == -1;

						});

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
					'<dd>This text comes from the <a href="https://www.digitalbibleplatform.com/">Digital Bible Platform</a> provided by <a href="http://faithcomesbyhearing.com/">Faith Comes By Hearing</a></dd>' +

					'<dt>API EULA</dt>' +
					'<dd><a href="https://www.digitalbibleplatform.com/eula/">End User License Agreement</a> for API</dd>' +
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

			info.providerName = providerName;
			info.divisions = [];
			info.divisionNames = [];
			info.sections = [];

			if (info.ot_dam_id != '') {
				loadBooks(info, info.ot_dam_id, function() {

					if (info.nt_dam_id != '') {
						loadBooks(info, info.nt_dam_id, function() {

							callback(info);

						});
					}

				});
			} else 	if (info.nt_dam_id != '') {
				loadBooks(info, info.nt_dam_id, function() {

					callback(info);

				});
			} else {

				console.log('FCBH error', 'No NT or OT id', info);

			}

		} else {

			callback(info);
		}

	}

	function loadBooks(info, dam_id, callback) {

		$.ajax({
			beforeSend: function(xhr){
				if (xhr.overrideMimeType){
					xhr.overrideMimeType("application/javascript");
				}
			},
			dataType: 'jsonp',
			url: /*sofia.protocol + */ 'http://dbt.io/library/book?v=2&reply=jsonp&key=' + sofia.config.fcbhKey + '&dam_id=' + dam_id,
			success: function(data) {

				// push data onto info object
				for (var i=0, il=data.length; i<il; i++) {
					var book = data[i],
						osisIndex = bible.DEFAULT_BIBLE_OSIS.indexOf(book.book_id),
						dbsBookCode = bible.DEFAULT_BIBLE[osisIndex];


					info.divisions.push(dbsBookCode);
					info.divisionNames.push(book.book_name);

					for (var c=0; c<book.number_of_chapters; c++) {
						info.sections.push(dbsBookCode + (c+1).toString());
					}
				}

				callback();

			}
		});

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


		// check for complete textinfo first, since we'll need the .sections data to make this work
		getTextInfo(textid, function(textinfo) {

			var
				bookid = sectionid.substring(0,2),
				chapter = sectionid.substring(2),
				lang = textinfo.lang,
				dir = (textinfo.dir && (textinfo.dir == 'ltr' || textinfo.dir == 'rtl')) ? textinfo.dir : data.language.isRTL(lang) ? 'rtl' : 'ltr',
				//usfmbook = bible.BOOK_DATA[bookid].usfm.substr(0,1).toUpperCase() + bible.BOOK_DATA[bookid].usfm.substr(1).toLowerCase(),
				usfmbook = bible.BOOK_DATA[bookid].osis,
				dam_id = bible.OT_BOOKS.indexOf(bookid) > -1 ? textinfo.ot_dam_id : textinfo.nt_dam_id,
				sectionIndex = textinfo.sections.indexOf(sectionid),
				previd = sectionIndex > 0 ? textinfo.sections[sectionIndex-1] : null,
				nextid = sectionIndex < textinfo.sections.length ? textinfo.sections[sectionIndex+1] : null;
				url = /*sofia.protocol + */ 'http://dbt.io/library/verse?v=2&reply=jsonp&key=' + sofia.config.fcbhKey + '&dam_id=' + dam_id + '&book_id=' + usfmbook + '&chapter_id=' + chapter; // format=osis (sadly doesn't do anything)

			//console.log(url);

			$.ajax({
				beforeSend: function(xhr){
					if (xhr.overrideMimeType){
						xhr.overrideMimeType("application/javascript");
					}
				},
				dataType: 'jsonp',
				url: url,
				success: function(chapter_data) {
					var html = [];


					//<div class="section chapter AC AC1 eng_kjv eng" dir="ltr" lang="en" data-id="AC1" data-nextid="AC2" data-previd="JN21">
					html.push('<div class="section chapter ' + textid + ' ' + bookid + ' ' + sectionid + ' ' + iso2iana.convert(lang) + ' " ' +
								' data-textid="' + textid + '"' +
								' data-id="' + sectionid + '"' +
								' data-nextid="' + nextid + '"' +
								' data-previd="' + previd + '"' +
								' lang="' + iso2iana.convert(lang) + '"' +
								' data-lang3="' + lang + '"' +
								' dir="' + dir + '"' +
								'>');

					if (chapter == '1') {
						html.push('<div class="mt">' + textinfo.divisionNames[textinfo.divisions.indexOf(bookid)] + '</div>');
					}

					html.push('<div class="c">' + chapter + '</div>');

					html.push('<div class="p">');
					for (var i=0, il=chapter_data.length; i<il; i++ ) {
						var verse = chapter_data[i],
							text = verse.verse_text,
							vnum = verse.verse_id,
							vid = sectionid + '_' + vnum;

						html.push('<span class="v-num v-' + vnum + '">' + vnum + '&nbsp;</span><span class="v ' + vid + '" data-id="' + vid + '">' + text + '</span>');

					}

					html.push('</div>'); // p
					html.push('</div>'); // section



					callback(html.join(''));
				}

			});


		});



	}

	function startSearch(textid, divisions, text, onSearchLoad, onSearchIndexComplete, onSearchComplete) {

		var info = getTextInfoSync(textid);

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

		var dam_id = '';

		if (info.ot_dam_id != '') {
			dam_id = info.ot_dam_id;
		} else if (info.nt_dam_id != '') {
			dam_id = info.nt_dam_id;
		}


		doSearch(dam_id, divisions, text, e, function() {

			onSearchComplete(e);

		});
	}
	function doSearch(dam_id, divisions, text, e, callback) {

		$.ajax({
			beforeSend: function(xhr){
				if (xhr.overrideMimeType){
					xhr.overrideMimeType("application/javascript");
				}
			},
			dataType: 'jsonp',

			// One giant call seems faster, than doing all the books individually?
			url: /*sofia.protocol + */ 'http://dbt.io/text/search?v=2&reply=jsonp&key=' + sofia.config.fcbhKey + '&dam_id=' + dam_id + '&query=' + text.replace(/\s/gi, '+') + '&limit=2000',
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
