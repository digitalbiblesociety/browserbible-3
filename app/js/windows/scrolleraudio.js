
var AudioController = function(container, ui, scroller) {
	
	var block = $(
				'<div class="audio-controller">' + 
					'<audio></audio>' + 
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
		textInfo = null,
		audioInfo = null,
		locationInfo = null,
		sectionid = '',
		sectionHeight = 0,
		sectionNode = null,
		hasAudio = false;
		
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
		var sectionidIndex = audioInfo.sections.indexOf(sectionid),
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
		var sectionidIndex = audioInfo.sections.indexOf(sectionid),
			nextSectionid = (sectionidIndex < audioInfo.sections.length-1) ? audioInfo.sections[sectionidIndex+1] : null;
			
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
		
			sectionid = newSectionid;
		
			var url = 'content/audio/' + textInfo.id + '/' + sectionid + '.mp3';
			audio.src = url
			audio.load();
			
			sectionNode = container.find('.section[data-id="' + sectionid + '"]');
			
			sectionHeight = sectionNode.height();
			
			title.html( new bible.Reference(sectionid).toString() );						
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
	
	function setTextInfo(newTextInfo) {
		if (textInfo == null || textInfo.id != newTextInfo.id) {
			
			textInfo = newTextInfo;
			
			$.ajax({
				dataType: 'json',
				url: 'content/audio/' + textInfo.id + '/info.json',
				success: function(data) {
					
					audioInfo = data;
				
					console.log('loaded audio', textInfo, audioInfo);
					
					hasAudio = true;
					
					if (sectionid != '') {
						loadAudio(sectionid);
					}
					
					// start load
					block.show();
					ui.show();				
				},
				error: function(e) {
					
					hasAudio = false;
										
					console.log('error loading audio', textInfo.id, e);
					
					block.hide();
					ui.hide();					
				}				
			})
			
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
	
	var ext = {
		setTextInfo: setTextInfo,
		size: size
	}	
	ext = $.extend(true, ext, EventEmitter);
		
	return ext;
}