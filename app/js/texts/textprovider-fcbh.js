
sofia.textproviders['fcbh'] = (function() {

	// all
	// http://dbt.io/library/volume?v=2&key=111a125057abd2f8931f6d6ad9f2921f&media=text

	var text_data = [];

	var fcbh_versions = [
		// http://dbt.io/library/volume?v=2&key=111a125057abd2f8931f6d6ad9f2921f&dam_id=ENGEVDO2ET
		{
			"id": "fcbh_evd",
			"name": "English Version for the Deaf",
			"nameEnglish": "",
			"abbr": "EVD",
			"lang": "eng",
			"langName": "English",
			"langNameEnglish": "",
			"dir": "ltl",
			"type": "bible",
			"ot_dam_id": "ENGEVDO2ET",
			"nt_dam_id": "ENGEVDN2ET"
		},
		{
			"id": "fcbh_gbt",
			"name": "Global Bible Translators",
			"nameEnglish": "",
			"abbr": "GBT",
			"lang": "eng",
			"langName": "English",
			"langNameEnglish": "",
			"dir": "ltl",
			"type": "bible",
			"ot_dam_id": "ENGGBTO2ET",
			"nt_dam_id": "ENGGBTN2ET"
		},
		{
			"id": "fcbh_esv",
			"name": "English Standard Version",
			"nameEnglish": "",
			"abbr": "ESV",
			"lang": "eng",
			"langName": "English",
			"langNameEnglish": "",
			"dir": "ltl",
			"type": "bible",
			"ot_dam_id": "ENGESVO2ET",
			"nt_dam_id": "ENGESVN2ET"
		},
		{
			"id": "fcbh_ibs",
			"name": "1997 Today's Aceh Version",
			"nameEnglish": "",
			"abbr": "IBS",
			"lang": "ac1",
			"langName": "Aceh",
			"langNameEnglish": "Aceh",
			"dir": "ltl",
			"type": "bible",
			"ot_dam_id": "AC1IBSO2ET",
			"nt_dam_id": "AC1IBSN2ET"
		}
	];

	function getTextManifest (callback) {

		if (!sofia.config.enableOnlineSources || typeof sofia.config.fcbhKey == 'undefined' || sofia.config.fcbhKey == '') {
			callback(text_data);
			return;
		}


		if (text_data.length > 0) {

			callback(text_data);

		} else {

			$.ajax({
				url: 'http://dbt.io/library/volume?v=2&key=' + sofia.config.fcbhKey, //  + '&media=text',
				success: function(data) {

					// first do texts
					var fcbh_texts = data.filter(function(v) {
							return v.media == 'text';
						}),
						fcbh_audio = data.filter(function(v) {
							return v.media == 'audio';
						});

					// find and link up all text values
					for (var i=0, il=fcbh_texts.length; i<il; i++) {
						var fcbh_entry = fcbh_texts[i],
							matches = text_data.filter(function(text_info) {
								return text_info.abbr == fcbh_entry.version_code;
							});

						if (matches.length > 0) {
							if (fcbh_entry.collection_code == "OT") {
								matches[0].ot_dam_id = fcbh_entry.dam_id;
							} else if (fcbh_entry.collection_code == "NT") {
								matches[0].nt_dam_id = fcbh_entry.dam_id;
							}
						} else {
							var
								title = fcbh_entry.version_name != '' ? fcbh_entry.version_name : fcbh_entry.language_name + ' ' + fcbh_entry.volume_name,
								new_entry = matches.length > 0 ? matches[0] : {
								"id": "fcbh_" + fcbh_entry.version_code.toLowerCase(),
								"name": title + ' [DBP]',
								"nameEnglish": fcbh_entry.version_english,
								"abbr": fcbh_entry.version_code,
								"lang": fcbh_entry.language_iso,
								"langName": fcbh_entry.language_iso_name,
								"langNameEnglish": fcbh_entry.language_family_english,
								"dir": "ltl",
								"type": "bible",
								"ot_dam_id": fcbh_entry.collection_code == "OT" ? fcbh_entry.dam_id : '',
								"nt_dam_id": fcbh_entry.collection_code == "NT" ? fcbh_entry.dam_id : '',
								"aboutHtml": createAboutHtml(title, fcbh_entry.version_code)
							};

							text_data.push(new_entry);

						}
					}

					for (var i=0, il=text_data.length; i<il; i++) {
						var text_info = text_data[i],
							audio_matches = fcbh_audio.filter(function(audio_info) {
								return text_info.abbr == audio_info.version_code;
							});

						for (var j=0, jl=audio_matches.length; j<jl; j++) {
							var audio_info = audio_matches[j];

							if (audio_info.media_type == 'Drama' && audio_info.collection_code == 'OT') {
								text_info.fcbh_drama_ot = audio_info.dam_id;
							} else if (audio_info.media_type == 'Drama' && audio_info.collection_code == 'NT') {
								text_info.fcbh_drama_nt = audio_info.dam_id;
							} else if (audio_info.media_type == 'Non-Drama' && audio_info.collection_code == 'OT') {
								text_info.fcbh_audio_ot = audio_info.dam_id;
							} else if (audio_info.media_type == 'Non-Drama' && audio_info.collection_code == 'NT') {
								text_info.fcbh_audio_nt = audio_info.dam_id;
							}
						}

					}

					var w = new MovableWindow();
					w.body.html( '<textarea>' +  JSON.stringify(text_data, null, '\t') + '</textarea>' );
					w.show();

					//console.log( JSON.stringify(text_data) );

					console.log( text_data );

					callback(text_data);


				}
			});
		}
	}

	function createAboutHtml(title, version_code) {
		return '<h1>' + title + ' (' + version_code + ')' + '</h1>' +
				'<dl>' +
					'<dt>Source</dt>' +
					'<dd>This text comes from the <a href="https://www.digitalbibleplatform.com/">Digital Bible Platform</a> provided by <a href="http://faithcomesbyhearing.com/">Faith Comes By Hearing</a></dd>' +

					'<dt>API EULA</dt>' +
					'<dd><a href="https://www.digitalbibleplatform.com/eula/">End User License Agreement</a> for API</dd>' +


				'</dl>'


	}

	function getTextInfo(textid, callback) {

		// get initial data
		var info = text_data.filter(function(text) {
			return text.id == textid;
		})[0];

		if (typeof info.divisions == 'undefined') {

			info.provider = 'fcbh';
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
			url: 'http://dbt.io/library/book?v=2&key=' + sofia.config.fcbhKey + '&dam_id=' + dam_id,
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

		// get initial data
		var info = text_data.filter(function(text) {
			return text.id == textid;
		})[0];

		return info;
	}


	function loadSection(textid, sectionid, callback) {

		var textinfo = getTextInfoSync(textid),
			bookid = sectionid.substring(0,2),
			chapter = sectionid.substring(2),
			lang = '',
			//usfmbook = bible.BOOK_DATA[bookid].usfm.substr(0,1).toUpperCase() + bible.BOOK_DATA[bookid].usfm.substr(1).toLowerCase(),
			usfmbook = bible.BOOK_DATA[bookid].osis,
			dam_id = bible.OT_BOOKS.indexOf(bookid) > -1 ? textinfo.ot_dam_id : textinfo.nt_dam_id,
			sectionIndex = textinfo.sections.indexOf(sectionid),
			previd = sectionIndex > 0 ? textinfo.sections[sectionIndex-1] : null,
			nextid = sectionIndex < textinfo.sections.length ? textinfo.sections[sectionIndex+1] : null;
			url = 'http://dbt.io/library/verse?v=2&key=' + sofia.config.fcbhKey + '&dam_id=' + dam_id + '&book_id=' + usfmbook + '&chapter_id=' + chapter; // format=osis (sadly doesn't do anything)

		//console.log(url);

		$.ajax({
			url: url,
			success: function(chapter_data) {
				var html = [];


				//<div class="section chapter AC AC1 eng_kjv eng" dir="ltr" lang="eng" data-id="AC1" data-nextid="AC2" data-previd="JN21">
				html.push('<div class="section chapter ' + textid + ' ' + bookid + ' ' + sectionid + ' ' + lang + ' ' +
							'data-textid="' + textid + '"' +
							'data-id="' + sectionid + '"' +
							'data-nextid="' + nextid + '"' +
							'data-previd="' + previd + '"' +
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
	}

	return {
		getTextManifest: getTextManifest,
		getTextInfo: getTextInfo,
		loadSection: loadSection
	}

})();