
if (typeof sofia != 'undefined') {
	sofia.audioSources = [];
}

var AudioDataManager = function() {


	
	function getAudioInfo(textInfo, callback) {
	
		// TEST: do first for now
		//sofia.audioSources[0].getAudioInfo(textInfo, callback);		
		//return;
	
	
		(function(textInfo, callback) {
			
			//console.log('AudioDataManager.getAudioInfo',textInfo.id);
		
			
			var index = 0;
			function doNext() {
				
				var audioSource = sofia.audioSources[index];
				audioSource = audioSource.getAudioInfo(textInfo, recieveData);
				
			}
			function recieveData(data) {
				
				// send data back up
				if (data != null) {
					//console.log('found: ', data);
				
					callback(data);					
				} else {
					index++;
					
					if (index < sofia.audioSources.length) {
						// try again
						doNext();
						
					} else {
						// didn't find anything						
						callback(null);
					}
					
				}
				
			}
			
			
			doNext();
		})(textInfo, callback);
	
	}
	
	function getChapterUrl(textInfo, bookOsis, chapterNumber, callback) {

		// just do first for now
		sofia.audioSources[0].getChapterUrl(textInfo, bookOsis, chapterNumber, callback);
		
	}
	
	
	var audio = {
		getAudioInfo: getAudioInfo,
		getChapterUrl: getChapterUrl
	};
	return audio;	
};


var LocalAudio = (function() {

	function getAudioInfo(textInfo, callback) {
		$.ajax({
			dataType: 'json',
			url: 'content/audio/' + textInfo.id + '/info.json',
			success: function(data) {
				
				callback(data);			
			},
			error: function(e) {
				callback(null);				
			}				
		});
	}
	
	function getChapterUrl(textInfo, dbsBookCode, chapterNum, callback) {
		 var url = 'content/audio/' + textInfo.id + '/' + dbsBookCode + chapterNum + '.mp3';
		 
		 callback(url);
	}
	
	var audio = {
		getAudioInfo: getAudioInfo,
		getChapterUrl: getChapterUrl		
	};
	return audio;	
})();

if (typeof sofia != 'undefined') {
	//sofia.audioSources.push(LocalAudio);
}



var FaithComesByHearingAudio = (function() {
	
	var fcbhLocation = null,
		fcbhList = null,
		fcbhIsLoaded = false,
		
		currentTextInfo = null,
		currentCallback = null
		
		
	function init() {
		loadFcbHearingLocations();	 
	}
	
	function loadFcbHearingLocations() {
		$.ajax({
			url: 'http://dbt.io/audio/location?v=2&key=' + sofia.config.fcbhKey,
			success: function(data) {
				fcbhLocation = data;				
			},
			complete: function() {
				loadFcbHearingInfo();
			}			
		});		
	}
	
	function loadFcbHearingInfo() {
		$.ajax({
			url: 'http://dbt.io/library/volume?v=2&media=audio&delivery=web&key=' + sofia.config.fcbhKey,
			success: function(data) {
				fcbhList = data;	
				
				//console.log('FCBH', fcbhLocation, fcbhList);
			
			},
			complete: function() {
				fcbhIsLoaded = true;
				
				attemptGetAudioInfo();
			}			
		});		
	}	
	

	function getAudioInfo(textInfo, callback) {
	
		// store
		currentTextInfo = textInfo;
		currentCallback = callback;
	
		// attempt
		attemptGetAudioInfo();
	}
	
	function attemptGetAudioInfo() {
		if (fcbhIsLoaded && currentTextInfo != null && currentCallback != null) {
			// find it!
			var fbchCollection = getFbchCollection(currentTextInfo, null);			
			
			currentCallback(fbchCollection);
			
			currentTextInfo = null;
			currentCallback = null;
		}
	}
	
	function getFbchCollection(textInfo, dbsBookCode) {
				
		var 
			testament = dbsBookCode ? 
							(bible.OT_BOOKS.indexOf(dbsBookCode) > -1 ? 'OT' : 
								bible.NT_BOOKS.indexOf(dbsBookCode) > -1 ? 'NT' : ''
							) : 
							'',
			dam_id_start = textInfo.id.replace(/[-_]/gi, '').toUpperCase(),
			results = [];
	

		// dam_id
		for (var i=0, il = fcbhList.length; i<il; i++) {
			var fbchCollection = fcbhList[i];
	
			if (fbchCollection.dam_id && fbchCollection.dam_id.indexOf(dam_id_start) > -1) {
				results.push(fbchCollection);
			}
		}
		
		// if no dam_id match, then try language
		if (results.length == 0 && textInfo.lang != 'eng') {
			// dam_id
			for (var i=0, il = fcbhList.length; i<il; i++) {
				var fbchCollection = fcbhList[i];
		
				if (fbchCollection.language_iso && fbchCollection.language_iso == textInfo.lang) {
					results.push(fbchCollection);
				} 
			}
		}
		
		// if no dam_id or langauge match, try family code
		if (results.length == 0 && textInfo.lang != 'eng') {
			// dam_id
			for (var i=0, il = fcbhList.length; i<il; i++) {
				var fbchCollection = fcbhList[i];
		
				if (fbchCollection.language_family_iso && fbchCollection.language_family_iso == textInfo.lang) {
					results.push(fbchCollection);
				} 
			}
		}		
		
		// filter by testament if needed
		if (testament != '') {
			var testamentResults = [];
			
			for (var i=0, il = results.length; i<il; i++) {
				var fbchCollection = results[i];
		
				if (fbchCollection.collection_code && fbchCollection.collection_code == testament) {
					testamentResults.push(fbchCollection);
				}
			}	
			
			results = testamentResults;		
		}
		
		// filter by drama if possible
		if ((testament == '' && results.length > 2) || (testament != '' && results.length > 1)) {
			var nonDramaResults = [];
			
			for (var i=0, il = results.length; i<il; i++) {
				var fbchCollection = results[i];
		
				if (fbchCollection.media_type && fbchCollection.media_type.toLowerCase() == 'non-drama') {
					nonDramaResults.push(fbchCollection);
				} 
			}
			
			if (nonDramaResults.length > 0) {
				results = nonDramaResults;
			}			
		}
					
		
		if (results.length > 0) {
			return results[0];
		} else {
			return null;
		}
	}	
	
	function getChapterUrl(textInfo, dbsBookCode, chapterNum, callback) {
		var fcbhCollection = getFbchCollection(textInfo, dbsBookCode);
		
		if (fcbhCollection == null) {
			//console.log('no id for', textInfo, dbsBookCode, chapterNum);
			callback(null);
			return;
		}
		
		var
			bookInfo = bible.BOOK_DATA[dbsBookCode],
			url = 'http://dbt.io/audio/path?v=2&dam_id=' + fcbhCollection.dam_id + '&book_id=' + bookInfo.osis.toLowerCase() + '&chapter_id=' + chapterNum.toString() + '&key=' + sofia.config.fcbhKey;
			
		$.ajax({
			url: url,
			success: function(data) {
				fcbhList = data;	
				
				var server = fcbhLocation[0],
					url = server.protocol + "://" + server.server + server.root_path + "/" + data[0].path;
				
				console.log('FCBH INFO', data, url);
			
				if (callback) {
					callback(url);
				}
			},
			error: function(a,b,c,d) {
				
				console.log('FCBH location error', a,b,c,d);
		
				if (callback) {
					callback(null);						
				}
			}
		});		
				
	}
	
	var audio = {
		getAudioInfo: getAudioInfo,
		getChapterUrl: getChapterUrl,
		getFbchCollection: getFbchCollection,
		getChapterUrl: getChapterUrl,
		fcbhIsLoaded: fcbhIsLoaded	
	};

	init();
	
	return audio;	
})();

if (typeof sofia != 'undefined') {
	sofia.audioSources.push(FaithComesByHearingAudio);
}



