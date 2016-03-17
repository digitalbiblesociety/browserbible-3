sofia.config = $.extend(sofia.config, {
	enableAudioWindow: true,
	audioWindowDefaultBibleFragmentid: 'JN1_1',
	audioWindowDefaultBibleVersion: 'ENGESV'
});


var AudioWindow = function(id, parent, init_data) {

	console.log('audiowindow init', init_data);

	var
		container =
			$('<div class="audio-window-container">'+
				'<div class="window-header audio-window-header">'+
					'<div class="audio-window-header-inner">'+
						'<input type="text" class="app-input text-nav" />' +
						'<div class="app-list text-list"></div>'+
						//'<span class="header-icon info-button"></span>'+
					'</div>'+
				'</div>'+
				'<div class="audio-window-main">' +
				'</div>' +
				'<div class="audio-window-version-info">' +
				'</div>' +
			'</div>').appendTo(parent.node),


		header = container.find('.audio-window-header'),
		main = container.find('.audio-window-main'),
		navui = header.find('.text-nav'),
		textlistui = header.find('.text-list'),
		versioninfo = container.find('.audio-window-version-info'),

		text_type = 'audio',
		currentTextInfo = null,
		currentLocationInfo = null,

		// objects
		textChooser = sofia.globalTextChooser,
		textNavigator = sofia.globalTextNavigator,

		scrollerMimic = {},
		audioController = null;

	// make something that functions like the text scroller so that the AudioController can understand it
	scrollerMimic = $.extend(true, scrollerMimic, EventEmitter);
	scrollerMimic.getLocationInfo = function() {
		return currentLocationInfo;
	};

	audioController = new AudioController(id, main, null, scrollerMimic);

	// TEXT NAVIGATOR
	navui
		.on('click', function(e) {

			if (Detection.hasTouch) {
				this.blur();
			}

			// if this is selected, then toggle
			if (textNavigator.getTarget() == navui) {
				textNavigator.toggle();
			} else {
				textNavigator.setTarget(container, navui);
				textNavigator.setTextInfo(currentTextInfo);
				textNavigator.show();
			}
		})
		.on('keypress', function(e) {
			if (e.keyCode == 13) {
				var
					userinput = navui.val(),
					bibleref = new bible.Reference(userinput),
					fragmentid = (bibleref.toSection) ? bibleref.toSection() : '',
					sectionid = fragmentid.split('_')[0];

				if (sectionid != '') {
					changeLocation(fragmentid);
				}
			}
		});

	function changeLocation(inputLocation) {
		var bibleref = new bible.Reference(inputLocation),
			fragmentid = (bibleref.toSection) ? bibleref.toSection() : '',
			sectionid = fragmentid.split('_')[0],

			newLocationInfo = {
				fragmentid: fragmentid,
				sectionid: sectionid
			};

		currentLocationInfo = newLocationInfo;

		if (scrollerMimic.trigger) {
			scrollerMimic.trigger('locationchange', {type:'locationchange', target: this, data: newLocationInfo});
		}
		if (ext && ext.trigger) {
			ext.trigger('settingschange', {type: 'settingschange', target: this, data: getData() });
		}

		textNavigator.hide();

		navui.val(bibleref.toString());
		navui[0].blur();
	}

	textNavigator.on('change', function (e) {

		if (e.data.target != navui) {
			return;
		}

		changeLocation(e.data.sectionid);
	});

	// TEXT CHOOSER
	textlistui.on('click', function(e) {

		// if this is selected, then toggle
		if (textChooser.getTarget() == textlistui) {
			textChooser.toggle();
		} else {
			textChooser.setTarget(container, textlistui, text_type);
			textChooser.setTextInfo(currentTextInfo);
			textChooser.show();
		}
	});

	textChooser.on('change', function(e) {
		if (e.data.target != textlistui) {
			return;
		}

		var newTextInfo = e.data.textInfo;

		updateText(newTextInfo);

	});

	function updateText(newTextInfo) {

		// ALWAYS UPDATE: for first load
		// update version name
		textlistui.html( newTextInfo.abbr );

		parent.tab.find('span').html( newTextInfo.abbr );

		// update the navigator with the latest header
		textNavigator.setTextInfo(newTextInfo);

		audioController.setTextInfo(newTextInfo);

		currentTextInfo = newTextInfo;

		//versioninfo.html( currentTextInfo.aboutHtml );
	}



	function init() {

		// TEMP
		navui.html('Reference').val('Reference');
		textlistui.html('Version');

		if (init_data == null) {
			return;
		}

		if (typeof init_data.fragmentid != 'undefined' && init_data.fragmentid != '') {
			//var bibleRef = new bible.Reference(init_data.fragmentid);
			//navui.val(bibleRef.toString());
			changeLocation(init_data.fragmentid);
		}

		if (typeof init_data.textid == 'undefined' || init_data.textid == '') {
			init_data.textid = sofia.config.newBibleWindowVersion;
		}

		// load the text specified by the init data
		TextLoader.getText(init_data.textid,

			// success
			function(loadedTextInfo) {

				// store this setting
				currentTextInfo = loadedTextInfo;

				updateText(loadedTextInfo);
			},

			// error handler
			function() {
//
//				console.log('ERROR', init_data.textid, 'doesnt exist');
//
//				// load all possible versions
//				TextLoader.loadTexts(function(textInfoData) {
//
//					// find a text with the same language
//					var newTextInfo = null,
//						lang = init_data.textid.toString().split('-')[0].split('_')[0];
//
//					for (var i=0, il=textInfoData.length; i<il; i++) {
//						var textInfo = textInfoData[i];
//
//						if (textInfo.type == text_type && (textInfo.lang == lang || textInfo.id.substring(0, lang.length) == lang)) {
//							newTextInfo = textInfo;
//							break;
//						}
//					}
//
//					// still nothing
//					if (newTextInfo == null) {
//						newTextInfo = textInfoData[0];
//					}
//
//					// let's try again with first one
//					TextLoader.getText(newTextInfo.id, function(loadedTextInfo) {
//						// store this setting
//						currentTextInfo = loadedTextInfo;
//
//						isInitialized = true;
//
//						startup();
//
//					});
//
//				});

		});
	}


	init();



	function size(width, height) {

		container.outerWidth(width);

		container
				.width(width)
				.height(height); // - header.outerHeight());
	}


	function getData() {
		// get data
		if (currentTextInfo == null) {
			currentTextInfo = textChooser.getTextInfo();
		}
		if (currentLocationInfo == null) {
			currentLocationInfo = scrollerMimic.getLocationInfo();
		}

		// if not ready, then kill it
		if (currentTextInfo == null || currentLocationInfo == null) {
			return null;
		}

		var data = {
			// textinfo
			textid: currentTextInfo.providerid,
			abbr: currentTextInfo.abbr,

			// location info
			sectionid: currentLocationInfo.sectionid,
			fragmentid: currentLocationInfo.fragmentid,
			label: currentLocationInfo.label,
			labelTab: currentTextInfo.abbr,
			labelLong: currentLocationInfo.labelLong,
			//hasFocus: hasFocus,
			params: {
				'win': 'audio',
				'textid': currentTextInfo.providerid,
				'fragmentid': currentLocationInfo.fragmentid
			}
		};

		return data;
	}

//	function getData() {
//
//		var data = {
//			params: {
//				'win': 'audio'
//			}
//		};
//
//		return data
//	}

	function close() {

		ext.clearListeners();

	}


	var ext = {
		size: size,
		getData: getData,
		sendMessage: function() {},
		close: close
	};
	ext = $.extend(true, ext, EventEmitter);


	ext.on('message', function(e) {
		if (e.data.messagetype == 'textload') {
		}
	});

	return ext;
};

sofia.initMethods.push(function() {

	if (sofia.config.enableAudioWindow) {

		sofia.windowTypes.push( {
				className:'AudioWindow',
				param: 'audio',
				paramKeys: {
					'textid': 't',
					'fragmentid':'v'
				},
				init: {
					'textid':sofia.config.audioWindowDefaultBibleVersion,
					'fragmentid':sofia.config.audioWindowDefaultBibleFragmentid
				}
		});
	}
});
