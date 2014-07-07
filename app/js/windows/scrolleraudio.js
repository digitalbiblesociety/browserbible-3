
var AudioController = function(id, container, ui, scroller) {

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
					'<span class="audio-title"></span>' +
					'<span class="audio-subtitle"></span>' +
					'<input type="button" class="audio-options-button" />' +
				'</div>'
				).appendTo(container),
		optionsButton = block.find('.audio-options-button'),

		options = $(
				'<div class="audio-options">' +
					'<span class="audio-options-close"></span>' +
					'<strong class="i18n" data-i18n="[html]windows.audio.options"></strong>' +
					'<label><input type="checkbox" class="audio-scroll" checked /><span class="i18n" data-i18n="[html]windows.audio.synctext" /></label>' +
					'<label><input type="checkbox" class="audio-autoplay" checked /><span class="i18n" data-i18n="[html]windows.audio.autoplay" /></label>' +

					'<div class="audio-dramatic-option">' +
						'<label><input type="radio" name="' + id + '-dramatic-option" class="audio-dramatic-audio" disabled /><span class="i18n" data-i18n="[html]windows.audio.nondrama" /></label>' +
						'<label><input type="radio" name="' + id + '-dramatic-option" class="audio-dramatic-drama" disabled /><span class="i18n" data-i18n="[html]windows.audio.drama" /></label>' +
					'</div>' +
				'</div>'
				).appendTo(container),
		scrollCheckbox = options.find('.audio-scroll').prop('checked', true),
		autoplayCheckbox = options.find('.audio-autoplay').prop('checked', true),
		optionsCloseButton = options.find('.audio-options-close'),

		optionsDramaticBox = options.find('.audio-dramatic-option'),
		optionsDramaticDrama = options.find('.audio-dramatic-drama'),
		optionsDramaticAudio = options.find('.audio-dramatic-audio'),

		audio = block.find('audio')[0],

		playButton = block.find('.audio-play'),
		nextButton = block.find('.audio-next'),
		prevButton = block.find('.audio-prev'),
		currenttime = block.find('.audio-currenttime'),
		duration = block.find('.audio-duration'),
		title = block.find('.audio-title'),
		subtitle = block.find('.audio-subtitle'),

		audioSlider = block.find('.audio-slider'),
		audioSliderCurrent = block.find('.audio-slider-current'),
		audioSliderHandle = block.find('.audio-slider-handle'),

		isDraggingSliderHandle = false,

		textInfo = null,
		audioInfo = null,
		locationInfo = null,
		sectionid = '',
		fragmentid = '',
		fragmentAudioData = null,
		sectionHeight = 0,
		sectionNode = null,
		hasAudio = false,
		audioDataManager = new AudioDataManager();

	//autoplayCheckbox.prop('checked',false);
	//autoplayCheckbox.parent().hide();

	options.find('.i18n').i18n();

	block.hide();
	ui.hide();
	options.hide();


	// OPTIONS
	optionsButton.on('click', function() {
		if (options.is(':visible')) {
			options.hide();
		} else {
			options.show();
		}
	});
	optionsCloseButton.on('click', function() {
		options.hide();
	});

	optionsDramaticAudio.on('change', updateDramatic);
	optionsDramaticDrama.on('change', updateDramatic);

	function updateDramatic() {

		console.log('change dramatic');

		var storedFragmentid = fragmentid;

		// kill all existing values
		fragmentid = '';
		sectionid = '';
		fragmentAudioData = null;

		// stop audio
		if (!audio.paused && !audio.ended) {
			audio.pause();
			audio.src = '';
		}

		$(audio).on('loadeddata', playWhenLoaded);
		loadAudio(storedFragmentid);
	}


	// MAIN
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

		audioDataManager.getPrevFragment(textInfo, audioInfo, fragmentid, function(prevFragmentid) {


			// console.log('prev', fragmentid, prevFragmentid);

			if (prevFragmentid == null) {
				return;
			}

			if (scrollCheckbox.is(':checked')) {
				//scroller.scrollTo(nextSectionid + '_1', -10);
				scroller.load('text', prevFragmentid.split('_')[0], prevFragmentid);
			}

			if (fragmentAudioData == null || prevFragmentid != fragmentAudioData.fragmentid) {
				loadAudio(prevFragmentid);
				$(audio).on('loadeddata', playWhenLoaded);
			}
		});

	});
	nextButton.on('click', function() {

		audioDataManager.getNextFragment(textInfo, audioInfo, fragmentid, function(nextFragmentid) {

			// console.log('next', fragmentid, nextFragmentid);

			if (nextFragmentid == null) {
				return;
			}

			if (scrollCheckbox.is(':checked')) {
				//scroller.scrollTo(nextSectionid + '_1', -10);
				scroller.load('text', nextFragmentid.split('_')[0], nextFragmentid);
			}

			if (fragmentAudioData == null || nextFragmentid != fragmentAudioData.fragmentid) {
				loadAudio(nextFragmentid);
				$(audio).on('loadeddata', playWhenLoaded);
			}
		});

		//alert('no implementation');
		return;

	});

	scroller.on('locationchange', updateLocation);
	//scroller.on('load', loadAudio);

	function updateLocation(e) {

		var newLocationInfo = e.data;

		//// console.log('AUDIO:locationchange', e, newLocationInfo);

		// found a fragment
		if (newLocationInfo != null) {

			locationInfo = newLocationInfo;

			loadAudio(locationInfo.fragmentid);
		}
	}

	function loadAudio(newFragmentid) {

		if (!hasAudio) {
			return;
		}

		if (typeof newFragmentid == 'undefined') {
			return;
		}

		if (fragmentid != newFragmentid) {

			//// console.log('AUDIO loading',newFragmentid,textInfo, hasAudio);

			fragmentid = newFragmentid;

			var newSectionid = fragmentid.split('_')[0],
				dbsBookCode =  sectionid.substring(0,2),
				chaperNumber = sectionid.substring(2),
				loadNewData = audioInfo.pericopeBased || newSectionid != sectionid;

			sectionid = newSectionid;


			// only do checks when we need to!
			if (loadNewData) {

				var audioOption = optionsDramaticDrama.is(':checked') ? 'drama' : optionsDramaticAudio.is(':checked') ? 'audio' : '';

				audioDataManager.getFragmentAudio(textInfo, audioInfo, fragmentid, audioOption, function(newFragmentAudioData) {

					// only update if this is new data
					if (fragmentAudioData == null || newFragmentAudioData == null || fragmentAudioData.id != newFragmentAudioData.id) {


						// if no data was received, then we need to hide everything
						if (!newFragmentAudioData || newFragmentAudioData.url == null) {
							audio.src = null;

							title.html('[No audio]');

							ui.hide();
							block.hide();

							fragmentAudioData = newFragmentAudioData;
							return;
						} else {

							// if we get a URL, then show the ear icon again
							ui.show();

							// only when the previous data was null, do we reshow the control bar
							if (fragmentAudioData == null) {
								// let's not do it ever
								//block.show();
							}

							fragmentAudioData = newFragmentAudioData;
						}

						//audio.currentTime = 0;
						audio.src = fragmentAudioData.url;
						audio.load();


						// store height info

						// TODO: start and finish verse instead!
						sectionNode = container.find('.section[data-id="' + sectionid + '"]');
						sectionHeight = sectionNode.height();

						// give feedback
						//title.html( new bible.Reference(sectionid).toString() + (audioInfo.title ? ' [' + audioInfo.title + ']' : ''));
						title.html( new bible.Reference(sectionid).toString() );
						subtitle.html( audioInfo.title );

					}
				});
			}
		}
	}


	function playWhenLoaded(){
		//// console.log('playWhenLoaded');
		audio.play();
		$(audio).off('loadeddata', playWhenLoaded);
	}


	$(audio)
		.on('play playing', function() {

			var thisAudio = this;

			playButton
				.attr('value','Pause')
				.addClass('playing');


			// pause all other media on the page
			$('audio,video').each(function() {
				var audioOrVideoNode = this;

				if (audioOrVideoNode != thisAudio && !audioOrVideoNode.paused && !audioOrVideoNode.ended) {
					audioOrVideoNode.pause();
				}
			});

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

			audioSliderHandle.css({left: '0%' });
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

			}

			sectionHeight = sectionNode.height();

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
							// - 20
							- sectionNode.find('.v:first').height()
							- (sectionNode.find('.v:last').height()*fraction);

			//// console.log(fraction, sectionHeight, offset);

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
		// console.log('mouseup');

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

		// console.log('slider:click');

		var
			width = audioSlider.width(),
			offsetX = e.offsetX,
			percent = offsetX/width,
			newTime = percent * audio.duration;

		audio.currentTime = newTime;

	});

	function setTextInfo(newTextInfo) {
		if (textInfo == null || textInfo.id != newTextInfo.id) {

			// reset
			title.html('');
			subtitle.html('');
			audioSliderCurrent.css({left: '0%' });
			audioSliderHandle.css({left: '0%' });
			currenttime.html( secondsToTimeCode(0) );
			duration.html( secondsToTimeCode(0) );

			textInfo = newTextInfo;

			if (!audio.paused && !audio.ended) {
				try {
					audio.pause();
					audio.src = null;
				} catch (e) {
					// boom!
				}
			}


			if (textInfo.type == 'bible') {


				audioDataManager.getAudioInfo(textInfo, function(newAudioInfo) {

					if (newAudioInfo != null) {
						audioInfo = newAudioInfo;

						console.log('AUDIO: YES', textInfo.id, textInfo.lang, audioInfo.type);

						hasAudio = true;

						sectionid = '';


						if (audioInfo.type == 'local') {
							optionsDramaticBox.hide();
						} else if (audioInfo.type == 'fcbh') {
							optionsDramaticBox.show();

							var hasNonDrama =
										(typeof audioInfo.fcbh_audio_nt != 'undefined' && audioInfo.fcbh_audio_nt != '') ||
										(typeof audioInfo.fcbh_audio_ot != 'undefined' && audioInfo.fcbh_audio_ot != ''),
								hasDrama =
										(typeof audioInfo.fcbh_drama_nt != 'undefined' && audioInfo.fcbh_drama_nt != '') ||
										(typeof audioInfo.fcbh_drama_ot != 'undefined' && audioInfo.fcbh_drama_ot != '');

							console.log(audioInfo, 'drama', hasDrama, 'audio', hasNonDrama);

							// show hide
							if (hasNonDrama && hasDrama) {
								optionsDramaticAudio.prop('disabled', false);
								optionsDramaticDrama.prop('disabled', false);
							} else {
								optionsDramaticAudio.prop('disabled', true);
								optionsDramaticDrama.prop('disabled', true);
							}

							if (hasNonDrama) {
								optionsDramaticAudio.prop('checked', true);
								optionsDramaticDrama.prop('checked', false);
							} else {
								optionsDramaticAudio.prop('checked', false);
								optionsDramaticDrama.prop('checked', true);
							}



						}

						/*
						if (audioInfo.type == 'local') {
							optionsDramaticBox.hide();

						} else if (audioInfo.type == 'fcbh') {
							optionsDramaticBox.show();

							var hasDrama = (audioInfo.fcbh_audio_nt != '' || audioInfo.fcbh_audio_ot != ''),
								hasAudio = (audioInfo.fcbh_drama_nt != '' || audioInfo.fcbh_drama_nt != '');
						}
						*/

						console.log("after dramatic switch");

						if (fragmentid != '') {
							var newFragmentid = fragmentid;

							fragmentid = '';
							// console.log('AUDIO, new from old ', newFragmentid);
							loadAudio(newFragmentid);
						} else {

							locationInfo = scroller.getLocationInfo();

							// console.log('AUDIO, new from new ', locationInfo);
							if (locationInfo != null) {
								loadAudio(locationInfo.fragmentid);
							}


						}
						//}

						// start load
						//block.show();
						ui.show();

					} else {
						hasAudio = false;

						// console.log('AUDIO: NO', textInfo.id, textInfo.lang, newAudioInfo);

						block.hide();
						ui.hide();
					}
				});
			}

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

	function close() {
		ext.clearListeners();

		block.remove();
		options.remove();

		block = null;
		options = null;
	}

	var ext = {
		setTextInfo: setTextInfo,
		size: size,
		close: close
	}
	ext = $.extend(true, ext, EventEmitter);

	return ext;
}
