sofia.textproviders = {};

TextLoader = (function() {

	var
		textInfoDataIsLoading = false,

		textInfoLoadingCallbacks = [],

		textInfoDataIsLoaded = false,

		// simple data from manifests that includes name, lang
		textInfoData = [],

		// full data with chapter arrays, etc.
		textData = {},

		cachedTexts = {};

	function loadSection(textInfo, sectionid, successCallback, errorCallback) {

		// double check
		if (sectionid == 'null' || sectionid == null) {
			return;
		}

		var textid = '';

		if (textInfo != null && typeof textInfo == 'string') {
			textid = textInfo;

			getText(textid, function(textInfo) {
				loadSection(textInfo, sectionid, successCallback, errorCallback);
			});
			return;

		} else {
			textid = textInfo.id;

			// sometimes the sections aren't yet known, so we'll check for them and hope for the best :)
			if (textInfo.sections && textInfo.sections.length > 0 && textInfo.sections.indexOf(sectionid) == -1) {
				sectionid = textInfo.sections[0];
			}
		}

		// send analytics for loading
		if (sofia.analytics && sofia.analytics.record) {
			sofia.analytics.record('load', textInfo.id, sectionid);
		}

		// use stored text if present
		if (typeof cachedTexts[textid] == 'undefined') {
			cachedTexts[textid] = {};
		}
		if (typeof cachedTexts[textid][sectionid] != 'undefined') {
			successCallback ( $(cachedTexts[textid][sectionid])  );
			return;
		}


		// load from provider
		sofia.textproviders[textInfo.providerName].loadSection(textid, sectionid, function(html) {

			// store
			cachedTexts[textid][sectionid] = html;

			// send
			successCallback ( $(cachedTexts[textid][sectionid])  );
		});
	}


	function getTextid(input) {

		var parts = input.split(':'),
			textid = (parts.length > 1) ? parts[1] : parts[0];

		return textid;

	}

	function getProviderName(input) {

		// if not loaded, get it from provider
		var
			parts = input.split(':'),
			textid = parts.length > 1 ? parts[1] : parts[0],
			providerName = parts.length > 1 ? parts[0] : '';

		if (providerName == '') {
			var textInfo = textInfoData.filter(function(info) {
					return info.id == textid;
				})[0];

			if (textInfo && typeof textInfo.providerName != 'undefined') {
				providerName = textInfo.providerName;
			} else {
				providerName = 'local'; // ???
			}
		}

		return providerName;
	}

	function getProviderId(input) {

		// assume we have the full providerid
		if (input.indexOf(':') > -1) {
			return input;
		} else {
			// assume we only have the textid
			var textid = input,
				textInfo = textInfoData.filter(function(info) {
					return info.id == textid;
				})[0];

			return textInfo.providerid;
		}
	}


	function getText(textid, callback, errorCallback) {

		// if already loaded, then send it right back
		var t = this,
			textinfo = textData[textid];

		if (typeof textinfo != 'undefined') {
			if (typeof callback != 'undefined') {
				callback(textinfo);
			}
			return textinfo;
		}

		var providerName = getProviderName(textid),
			textid = getTextid(textid);


		sofia.textproviders[providerName].getTextInfo(textid, function(data) {

			var initialInfo = textInfoData[textid];
			data = $.extend({}, initialInfo, data, true);


			processText(data, providerName)
			//data.providerName = providerName;





			// store
			textData[data.id] = data;

			// set names
			if (data.divisionNames) {
				bible.addNames(data.lang, data.divisions, data.divisionNames);
			}

			// send back
			callback(data);

		}, errorCallback);

	}

	function loadTexts(callback) {
		if (textInfoDataIsLoaded) {
			callback(textInfoData);
		} else {
			loadTextsManifest(callback);
		}
	}

	function loadTextsManifest(callback) {

		if (callback) {
			textInfoLoadingCallbacks.push(callback);
		}

		if (textInfoDataIsLoading) {
			return;
		}

		textInfoDataIsLoading = true;

		var providerKeys = Object.keys(sofia.textproviders),
			currentProviderIndex = 0;

		function loadNextProvider() {
			if (currentProviderIndex < providerKeys.length) {

				var providerName = providerKeys[currentProviderIndex]

				sofia.textproviders[providerName].getTextManifest(function(data) {

					if (data && data != null) {

						// append to array from previous provider
						textInfoData = textInfoData.concat(data);
					}

					currentProviderIndex++;
					loadNextProvider();
				});


			} else {
				textInfoDataIsLoading = false;
				textInfoDataIsLoaded = true;


				while (textInfoLoadingCallbacks.length > 0) {

					var cb = textInfoLoadingCallbacks.pop();
					cb(textInfoData);

				}
			}
		}

		loadNextProvider();

	}

	function processTexts(text_array, providerName) {
		// add providerName, providerid, and id to each one
		for (var i=0, il=text_array.length; i<il; i++) {

			var text = text_array[i];

			processText(text, providerName);
		}
	}

	function processText(text, providerName) {
		// remove any provider info from the id
		if (text.id.split(':').length > 1) {
			text.id = text.id.split(':')[1];
		}

		text.providerName = providerName;
		text.providerid = providerName + ':' + text.id;

		// TEMP for DBS
		if (typeof text.country != 'undefined' && typeof text.countries == 'undefined' && text.country != text.langName && text.country != text.langNameEnglish) {
			text.countries = [];

			var possibleCountryMatches = sofia.countries.filter(function(c) {
				return c.name.indexOf(text.country) == 0;
			});

			if (possibleCountryMatches.length > 0) {
				text.countries.push( possibleCountryMatches[0]['alpha-2'] );
			}
		}
	}

	function startSearch(textid, divisions, searchTerms, onSearchLoad, onSearchIndexComplete, onSearchComplete) {

		var providerName = getProviderName(textid);

		sofia.textproviders[providerName].startSearch(textid, divisions, searchTerms, onSearchLoad, onSearchIndexComplete, onSearchComplete);

	}

	function getTextInfoData() {
		return textInfoData;
	}

	// when the document is ready, start loading texts from providers
	$(function() {
		loadTextsManifest();
	});

	var ext = {
		getText: getText,
		loadTexts: loadTexts,
		textData: textData,
		getTextInfoData: getTextInfoData,
		loadSection: loadSection,
		startSearch: startSearch,
		processTexts: processTexts,
		processText: processText
	}

	return ext;
})();
