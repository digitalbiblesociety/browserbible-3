
// GET LANGUAGES
// http://api.arclight.org/getLanguages?responseType=json&apiKey=52b06248a3c6e8.12980089


// GET VIDEOS
// http://api.arclight.org/getTitles?responseType=json&apiKey=52b06248a3c6e8.12980089&languageId=22812
// A-HMAO = 22812
// English = 529
// Spanish, Latin = 21028


// MAIN video
// http://api.arclight.org/getAssetDetails?refId=1_529-jf-0-0&responseType=json&apiKey=52b06248a3c6e8.12980089
// 529 = English

// related SEGMENTS 
// http://api.arclight.org/getAssociatedContent?refId=1_529-jf-0-0&apiKey=52b06248a3c6e8.12980089&requestPlayer=web


// SEGMENT detail
// http://api.arclight.org/getAssetDetails?refId=1_529-jf6101-0-0&apiKey=52b06248a3c6e8.12980089&requestPlayer=web


var JesusFilmMediaApi = (function() {

	var jfmLanguages = null,
		getPlayerCallbacks = [];


	function init() {
		// get all possible videos
		$.ajax({
			
			url: 'http://api.arclight.org/getLanguages?responseType=json&apiKey=' + sofia.config.jfmKey,
			success: function(data) {
				
				jfmLanguages = data;
				
				
				findPlayers();
			},
			error: function(a,b,c,d) {
				console.log('error', a,b,c,d);
			}
			
			
		});
		
		
	}
	
	
	function getPlayer(lang, segmentNumber, callback) {

		getPlayerCallbacks.push({lang: lang, segmentNumber: segmentNumber, callback:callback});
		
		findPlayers();
		
	}
	
	function findPlayers() {
		
		// wait until the languages are loaded
		if (jfmLanguages == null) {
			return;
		}
		
		// return all results
		while(getPlayerCallbacks.length > 0) {
			varcallbackInfo = getPlayerCallbacks.pop();
			
			findPlayer(callbackInfo.lang, callbackInfo.segmentNumber, callbackInfo.callback);
		}		
	}
	
	function findPlayer(lang, segmentNumber, callback) {

		// find language first
		var jfmLanguageNumber = '';
		
		for (var i=0, il=jfmLanguages.length; i<il; i++) {
			var jfmLanguageInfo = jfmLanguages[i];
			
			if (jfmLanguageInfo.language.isoCode == lang) {
				jfmLanguageNumber = jfmLanguageInfo.languageId;
				break;
				
			}			
		}	
		
		// return null if no match
		if (jfmLanguageNumber == '') {
			callback(null);
		}
		
			
		// get the player
		$.ajax({
			url: 'http://api.arclight.org/getAssetDetails?refId=1_' + jfmLanguageNumber + '-jf61' + segmentNumber + '-0-0&apiKey=' + sofia.config.jfmKey + '&requestPlayer=web',
			success: function(data) {
				var embedCode = data.embedCode;
				
				callback(embedCode);
				
			}, 
			error: function() {
				callback(null);				
			}
			
		});
			
		
	}
	
	
	init();
	var ext = {
		getPlayer: getPlayer
		
	}
	
	return ext;
})();