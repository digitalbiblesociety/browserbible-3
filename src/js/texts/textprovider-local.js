
sofia.textproviders['local'] = (function() {

	var providerName = 'local',
		fullName = '',
		textData = {};

	function getTextManifest(callback) {
		var textsUrl = 'content/texts/' + sofia.config.textsIndexPath;

		sofia.ajax({
			url: textsUrl,
			dataType: 'json',
			cache: false,
			success: function(data) {

				var textInfoData = data.textInfoData;

				//text_data = TextLoader.processTexts(textInfoData, providerName);

				callback(textInfoData);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				//console.log('error loading texts.json', jqXHR, textStatus, errorThrown);
				//console.log(textStatus);

				var modal = new MovableWindow(600,250, 'Texts Error');
				//modal.size(500, 200).center();

				modal.body.css({background: '#000', color: '#fff' }).html(
					'<div style="padding: 20px;">' +
						'<p>Problem loading <code>' + sofia.config.baseContentUrl + textsUrl + '</code></p>' +
						'<p>Status: ' + textStatus + '</p>'+
						'<p>Error: ' + errorThrown + '</p>'+
					'</div>'
				);
				modal.show().center();

			}
		});
	}

	function getTextInfo(textid, callback, errorCallback) {

		if (typeof textData[textid] != 'undefined') {
			callback(textData[textid]);
			return;
		}

		// load it!
		var infoUrl = 'content/texts/' + textid + '/info.json';

		sofia.ajax({
			url: infoUrl,
			dataType: 'json',
			success: function(data) {
				textData[textid] = data;
				callback(data);
			},
			error: function(error) {

				console.log("ERROR TextInfoLoader.getText", infoUrl);

				if (errorCallback) {
					errorCallback(error);
				}
			}
		});
	}

	function loadSection(textid, sectionid, callback, errorCallback) {

		getTextInfo(textid, function(textInfo) {

			var url = 'content/texts/' + textid + '/' + sectionid + '.html';

			sofia.ajax({
				dataType: 'text',
				url: url,
				success: function(data) {

					// text to treat this like JSON or text/html
					var text = data,
						// split at the closing head tag to prevent problems with loading head material
						main = $( text.indexOf('</head>') > -1 ? text.split('</head>')[1] : text ),
						content = main.filter('.section'),
						footnotes = main.filter('.footnotes'),
						notes = footnotes.find('.footnote');

					// move notes into place
					if (notes.length > 0) {
						notes.each(function() {
							var footnote = $(this),
								noteid = footnote.find('a').attr('href'),
								footnotetext = footnote.find('.text'),
								noteintext = content.find(noteid);

							//console.log(noteid, noteintext);

							noteintext.append(footnotetext);

						});
					}

					content.attr('data-textid', textid);
					content.attr('data-lang3', textInfo.lang);

					// FIX title after chapter number
					var c = content.find('.c'),
						afterc = c.next();
					if (afterc.hasClass('s')) {
						c.before(afterc);
					}

					// FIX verse numbers inside verse
					content.find('.v-num').each(function() {
						var vnum = $(this),
							v = vnum.closest('.v');

						if (v.length > 0) {
							v.before(vnum);
						}

					});

					var html = content.wrapAll('<div></div>').parent().html();

					callback(html);

				}, error: function(jqXHR, textStatus, errorThrown) {
					if (errorCallback) {
						errorCallback(textid, sectionid);
					}

					//console.log('error', textStatus, errorThrown, jqXHR );
				}
			});
		});

	}

	function startSearch(textid, divisions, text, onSearchLoad, onSearchIndexComplete, onSearchComplete) {

		var textSearch = new TextSearch();

		textSearch.on('load', onSearchLoad);
		textSearch.on('indexcomplete', onSearchIndexComplete);
		textSearch.on('complete', onSearchComplete);

		textSearch.start(textid, divisions, text);

	}

	return {
		getTextManifest: getTextManifest,
		getTextInfo: getTextInfo,
		loadSection: loadSection,
		startSearch: startSearch,
		fullName: fullName
	}

})();

/*
sofia.textproviders['example'] = (function() {

	function getTextManifest (callback) {
		callback({});
	}

	function getTextInfo(textid, callback) {
		callback({});
	}

	function loadSection(textid, sectionid, callback) {
		callback(null);
	}

	return {
		getTextManifest: getTextManifest,
		getTextInfo: getTextInfo,
		loadSection: loadSection
	}

})();
*/
