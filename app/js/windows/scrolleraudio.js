
var AudioController = function(container, ui, scroller) {
	
	var block = $(
				'<div class="audio-controller">' + 
					'<audio></audio>' + 
					'<div class="audio-slider">' + 
						'<div class="audio-slider-current"></div>' + 
						'<div class="audio-slider-loaded"></div>' + 						
						'<span class="audio-slider-handle"></span>' + 
					'</div>' +
					'<input type="button" class="audio-prev" value="Prev" />' +
					'<input type="button" class="audio-play" value="Play" />' +
					'<input type="button" class="audio-next" value="Next" />' +
					'<span class="audio-currenttime">00:00</span>' +
					'<span class="audio-duration">00:00</span>' +					
					'<label><input type="checkbox" class="audio-scroll" checked />Scroll</label>' +
					'<label><input type="checkbox" class="audio-autoplay" checked />Autoplay</label>' +					
					'<span class="audio-title"></span>' +
				'</div>'	
				).appendTo(container),
		audio = block.find('audio')[0],
		playButton = block.find('.audio-play'),
		nextButton = block.find('.audio-next'),
		prevButton = block.find('.audio-prev'),
		scrollCheckbox = block.find('.audio-scroll'),
		autoplayCheckbox = block.find('.audio-autoplay'),
		
		currenttime = block.find('.audio-currenttime'),
		duration = block.find('.audio-duration'),
		title = block.find('.audio-title'),
		
		audioSlider = block.find('.audio-slider'),
		audioSliderCurrent = block.find('.audio-slider-current'),		
		audioSliderHandle = block.find('.audio-slider-handle'),				
		
		isDraggingSliderHandle = false,
		
		textInfo = null,
		audioInfo = null,
		locationInfo = null,
		sectionid = '',
		sectionHeight = 0,
		sectionNode = null,
		hasAudio = false,
		audioDataManager = new AudioDataManager();
		
	autoplayCheckbox.parent().hide();
		
	//block.hide();
		
		
	ui.on('click', function() {
		if (block.is(':visible')) {
			block.hide();			
		} else {
			block.show();			
		}		
	});
		
	playButton.on('click', function() {
		
		if (audio.src == '') {
			return;
		}
		
	
		if (audio.paused || audio.ended) {
			audio.play();
		} else {
			audio.pause();			
		}		
	});
			
	
	prevButton.on('click', function() {
		var sectionidIndex = textInfo.sections.indexOf(sectionid),
			prevSectionid = (sectionidIndex > 0 ) ? audioInfo.sections[sectionidIndex - 1] : null;
			
		if (prevSectionid != null) {
			if (!audio.paused) {
				$(audio).on('loadeddata', playWhenLoaded);	
			}
			
			loadAudio(prevSectionid);
			
			if (scrollCheckbox.is(':checked')) {
				//scroller.scrollTo(prevSectionid + '_1', -10);
				scroller.load('text',prevSectionid);
			}
		}
	});
	nextButton.on('click', function() {
		var sectionidIndex = textInfo.sections.indexOf(sectionid),
			nextSectionid = (sectionidIndex < textInfo.sections.length-1) ? textInfo.sections[sectionidIndex+1] : null;
			
		if (nextSectionid != null) {
			
			if (!audio.paused) {
				$(audio).on('loadeddata', playWhenLoaded);	
			}
				
			loadAudio(nextSectionid);
			
			
			if (scrollCheckbox.is(':checked')) {
				//scroller.scrollTo(nextSectionid + '_1', -10);
				scroller.load('text',nextSectionid);
			}
		}
	});		
	
	scroller.on('locationchange', updateLocation);
	//scroller.on('load', loadAudio);
	
	function updateLocation(e) {

		var newLocationInfo = e.data;
		
		//console.log('audio locationchange', e, newLocationInfo);
						
		// found a fragment
		if (newLocationInfo != null) {
		
			locationInfo = newLocationInfo;
			
			loadAudio(locationInfo.sectionid);					
		}
	}

	function loadAudio(newSectionid) {
		
		
		
		if (!hasAudio) {
			return;
		}	
			
		if (sectionid != newSectionid) {
		
			console.log('loading',newSectionid,textInfo, hasAudio);			
		
			sectionid = newSectionid;
			
			var dbsBookCode =  sectionid.substring(0,2),
				chaperNumber = sectionid.substring(2);
		
			audioDataManager.getChapterUrl(textInfo, dbsBookCode, chaperNumber, function(url) {
			
				console.log('Got URL', url);
			
				if (url == null) {
					block.hide();					
					return;
				}
			
				audio.src = url
				audio.load();
				
				sectionNode = container.find('.section[data-id="' + sectionid + '"]');
				
				sectionHeight = sectionNode.height();
				
				title.html( new bible.Reference(sectionid).toString() + ' [' + (audioInfo.dam_id ? 'FCBH' : '') + ']');						
			});
		}			
	}
	
				
	function playWhenLoaded(){
		console.log('playWhenLoaded');
		audio.play();
		$(audio).off('loadeddata', playWhenLoaded);					
	}	

	
	$(audio)
		.on('play playing', function() {
			playButton
				.attr('value','Pause')
				.addClass('playing');
		})
		.on('pause ended', function() {
			playButton
				.attr('value','Play')
				.removeClass('playing');
		})
		.on('loadstart', function() {
			playButton
				.attr('value','Play')
				.removeClass('playing');
			
			currenttime.html( secondsToTimeCode(0) );		
			duration.html( secondsToTimeCode(0) );			
		})		
		.on('loadedmetadata', function() {
			duration.html( secondsToTimeCode(audio.duration) );			
		})				
		.on('ended', function() {
			if (autoplayCheckbox.is(':checked')) {
				
				$(audio).on('loadeddata', playWhenLoaded);			
				
				nextButton.trigger('click');
				//audio.play();
				
				
			}							
		})		
		.on('timeupdate', function() {	
			currenttime.html( secondsToTimeCode(audio.currentTime) );		
			duration.html( secondsToTimeCode(audio.duration) );
	
			// slider
			audioSliderCurrent.css({width: (audio.currentTime / audio.duration * 100) + '%' });
			if (!isDraggingSliderHandle) {
				audioSliderHandle.css({left: (audio.currentTime / audio.duration * 100) + '%' });				
			}
	
			
			if (!scrollCheckbox.is(':checked')) {
				return;				
			}
			
			if (sectionNode.length == 0) {
				
				sectionNode = container.find('.section[data-id="' + sectionid + '"]');				
				sectionHeight = sectionNode.height();				
			}			
			
			var 
				// calculate percent to scroll
				chapter = parseInt(sectionid.substring(2), 10),
				skipSeconds = (chapter == 1) ? 10 : 8,
				fraction = (audio.currentTime-skipSeconds) / (audio.duration-skipSeconds);	
			
				// calculate node position
				pane = container.find('.scroller-main'),
				paneTop = pane.offset().top,
				scrollTop = pane.scrollTop(),
				nodeTop = sectionNode.offset().top,
				nodeTopAdjusted = nodeTop - paneTop + scrollTop,
				
				offset = sectionHeight * fraction							
							// adjust the offset by two lines or so
							- 20;
				
			if (offset <= 0) {
				offset = 0;	
			}		
			
			// go to it
			scroller.setFocus(true);
			pane.scrollTop(nodeTopAdjusted + offset);			
		});	
	
	audioSliderHandle.on('mousedown', function(e) {
		isDraggingSliderHandle = true;
		$(document).on('mousemove', documentMouseMove);
		$(document).on('mouseup', documentMouseUp);		
	});

	
	function documentMouseUp(e) {
		console.log('mouseup');
	
		isDraggingSliderHandle = false;
		$(document).off('mousemove', documentMouseMove);
		$(document).off('mouseup', documentMouseUp);		
	}
	
	function documentMouseMove(e) {
	
		var 
			width = audioSlider.width(),
			pos = audioSlider.offset(),
			clientX = e.clientX,
			offsetX = clientX - pos.left,
			percent = offsetX/width,
			newTime = percent * audio.duration;
			
		audioSliderHandle.css({left: (percent*100) + '%'});
			
		audio.currentTime = newTime;				
	}
	
		
	audioSlider.on('click', function(e) {

		console.log('slider:click');
			
		var 
			width = audioSlider.width(),
			offsetX = e.offsetX,
			percent = offsetX/width,
			newTime = percent * audio.duration;
	
		audio.currentTime = newTime;
				
	});
	
	function setTextInfo(newTextInfo) {
		if (textInfo == null || textInfo.id != newTextInfo.id) {
			
			textInfo = newTextInfo;
			
			audioDataManager.getAudioInfo(textInfo, function(newAudioInfo) {
			
				if (newAudioInfo != null) {		
					audioInfo = newAudioInfo;
				
					console.log('loaded audio', textInfo, newAudioInfo);
					
					hasAudio = true;
					
					if (sectionid != '') {
						console.log('info, loading', hasAudio, sectionid);
						loadAudio(sectionid);
					}
					
					// start load
					block.show();
					ui.show();	
								
				} else {
					hasAudio = false;
										
					console.log('NO audio found for', textInfo.id, textInfo.lang, newAudioInfo);
					
					block.hide();
					ui.hide();
				}				
			});
			
		}
		
		
		
		// attempt to load
	}
	
	function secondsToTimeCode(time) {

		var hours = Math.floor(time / 3600) % 24,
			minutes = Math.floor(time / 60) % 60,
			seconds = Math.floor(time % 60),
			result = 
   					(minutes < 10 ? '0' + minutes : minutes) + ':'
					+ (seconds < 10 ? '0' + seconds : seconds);
					
		return result;
	}
		
	function size(width, height) {
		
		block.outerWidth(width);
	}
	
	//$(window).on('resize')
	
	var ext = {
		setTextInfo: setTextInfo,
		size: size
	}	
	ext = $.extend(true, ext, EventEmitter);
		
	return ext;
}

if (typeof sofia != 'undefined') {
	sofia.audioSources = [];
}

var AudioDataManager = function() {
	
	function getAudioInfo(textInfo, callback) {
		
		// just do first for now
		sofia.audioSources[0].getAudioInfo(textInfo, callback);
	
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
			console.log('no id for', textInfo, dbsBookCode, chapterNum);
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



