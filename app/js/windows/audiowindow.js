sofia.config = $.extend(sofia.config, {
	enableAudioWindow: true
});


var AudioWindow = function(id, parent, init_data) {

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
			'</div>').appendTo(parent.node),
			

		header = container.find('.audio-window-header'),
		main = container.find('.audio-window-main'),
		navui = header.find('.text-nav'),
		textlistui = header.find('.text-list'),
		
		text_type = 'audio',
		currentTextInfo = null,
		currentLocationInfo = null,

		// objects
		textChooser = sofia.globalTextChooser,
		textNavigator = new TextNavigator(container, navui),
		
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

			textNavigator.toggle();

			/*
			if (textNavigator.node().is(':visible')) {
				$(document).on('click', textNavigatorOffClick);
			}
			*/
		})
		.on('keypress', function(e) {
			if (e.keyCode == 13) {
				var
					userinput = navui.val(),
					bibleref = new bible.Reference(userinput),
					fragmentid = (bibleref.toSection) ? bibleref.toSection() : '',
					sectionid = fragmentid.split('_')[0];

				if (sectionid != '') {
					
					var newLocationInfo = {					
						fragmentid: fragmentid,	
						sectionid: sectionid
					};
					
					currentLocationInfo = newLocationInfo;
					
//					if (sofia.analytics) {
//						sofia.analytics.record('usernav', 'input', sectionid + ':' + currentTextInfo.id);
//					}

					//TextNavigation.locationChange(fragmentid);

					//scroller.load('text', sectionid, fragmentid);
					scrollerMimic.trigger('locationchange', {type:'locationchange', target: this, data: newLocationInfo});
				
					textNavigator.hide();

					navui.val(bibleref.toString());
					navui[0].blur();
				}
			}
		});

	textNavigator.on('change', function (e) {
		//console.log('scrollerapp:navigator:change', e);

		//ext.trigger('globalmessage', {type: 'usernav', target: ext, data: {usernavtype: 'menu', sectionid: e.data, textid: currentTextInfo.id}});

//		if (sofia.analytics) {
//			sofia.analytics.record('usernav', 'menu', e.data + ':' + currentTextInfo.id);
//		}
//
//		TextNavigation.locationChange(e.data);

		var
			sectionid = e.data,		
			bibleref = new bible.Reference(sectionid),
			newLocationInfo = {					
				fragmentid: sectionid,	
				sectionid: sectionid
			};
		
		currentLocationInfo = newLocationInfo;
		
		navui.val(bibleref.toString());
		navui[0].blur();		

		// load new content
		scrollerMimic.trigger('locationchange', {type:'locationchange', target: this, data: newLocationInfo});
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

		// ALWAYS UPDATE: for first load
		// update version name
		textlistui.html( newTextInfo.abbr );
		
		parent.tab.find('span').html( newTextInfo.abbr );

		// update the navigator with the latest header
		textNavigator.setTextInfo(newTextInfo);

		audioController.setTextInfo(newTextInfo);
		
		
				
	});
	
	
	
	function init() {

		// TEMP
		navui.html('Reference').val('Reference');
		textlistui.html('Version');
		
		if (init_data == null) {
			return;
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
				
				startup();
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

	function startup() {

		// send to objects
		textChooser.setTextInfo(currentTextInfo);
		textlistui.html(currentTextInfo.abbr);
		parent.tab.find('span').html( currentTextInfo.abbr );
		textNavigator.setTextInfo(currentTextInfo);
		audioController.setTextInfo(currentTextInfo);
		scrollerMimic.setTextInfo(currentTextInfo);

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
			hasFocus: hasFocus,
			params: {
				'win': text_type,
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

		removeHighlights();
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
					'textid':sofia.config.newBibleWindowVersion,
					'fragmentid':sofia.config.newBibleWindowVerse
				}
		});
	}
});
