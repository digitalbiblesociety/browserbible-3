var JesusFilmMediaApi = (function() {

	var
		isLoaded = false,
		isLoading = false,
		jfmLanguages = null,
		getPlayerCallbacks = [];

	function load() {

		if (isLoaded || isLoading) {
			return;
		}

		isLoading = true;
		isLoaded = false;

		$.ajax({

			url: 'content/media/jesusfilmmedia/jesusfilmlanguages.json',
			success: function(data) {

				isLoading = true;
				isLoaded = true;

				jfmLanguages = data;

				findPlayers();
			},
			error: function(a,b,c,d) {
				console.log('error', a,b,c,d);
			}

		});
	}

	// public method
	function getPlayer(lang, segmentNumber, callback) {

		getPlayerCallbacks.push({lang: lang, segmentNumber: segmentNumber, callback:callback});

		if (!isLoaded) {
			if (!isLoading) {
				load();
			}
		} else {
			findPlayers();
		}
	}

	function findPlayers() {

		// wait until the languages are loaded
		if (jfmLanguages == null) {
			load();
			return;
		}

		// return all results
		while(getPlayerCallbacks.length > 0) {
			var callbackInfo = getPlayerCallbacks.pop();

			findPlayer(callbackInfo.lang, callbackInfo.segmentNumber, callbackInfo.callback);
		}
	}

	function findPlayer(lang, segmentNumber, callback) {


		var languageId = jfmLanguages[lang],
			iframeUrl = '';

		if (typeof languageId == 'undefined' || languageId == null)	{
			languageId = 529;
			lang = 'eng';
		}

		iframeUrl = sofia.protocol + '//api.arclight.org/videoPlayerUrl?refId=1_' + languageId + '-jf61' + segmentNumber + '-0-0&amp;apiSessionId=' + sofia.config.jfmKey + '&playerStyle=vanilla';

		callback(iframeUrl, lang);
	}

	var ext = {
		getPlayer: getPlayer

	}

	return ext;
})();
