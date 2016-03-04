
var App = function() {
	// create nodes
	var	win = $(window),
		body = $(document.body),
		container = $('<div class="windows-container"></div>').appendTo(body),
		header = $('<div class="windows-header"></div>').appendTo(container),
		main = $('<div class="windows-main"></div>').appendTo(container),
		footer = $('<div class="windows-footer"></div>').appendTo(container),
		settingsKey = 'app-windows',
		ext = {},
		windowManager = null,
		mainMenu = null;

	function init() {
		// create objects
		mainMenu = new MainMenu(header);
		windowManager = new WindowManager(main, ext);

		ext.windowManager = windowManager;

		// combine nodes and objects
		win.on('resize', resize);
		win.on('orientationchange', resize);
		resize();


		// if not fullscreen and is touch screen
		//if (Detection.hasTouch) {
		try {
			window.top.scrollTo(0, 1);
		} catch (ex) {

		}
		//}


		var settings = getWindowSettings(),
			windowWidth = win.width();
		//console.log('settings',settings, settings.length);

		/*
		if (windowWidth < 768 && settings.windows.length >= 3) {
			settings.windows = settings.windows.slice(0,2);
		}
		if (windowWidth < 460 && settings.windows.length >= 2) {
			settings.windows = settings.windows.slice(0,1);
		}
		*/

		// create windows
		for (var i=0, il=settings.windows.length; i<il; i++) {
			var setting = settings.windows[i],
				windowClassName = setting.windowType;

			// try to find ClassName by the parameter
			if (!windowClassName) {
				var param = setting.type,
					filteredWindowTypes = sofia.windowTypes.filter(function(wt) {
						return wt.param == param;
					});

				if (filteredWindowTypes.length == 1) {
					windowClassName = filteredWindowTypes[0].className;
				}
			}

			//console.log('create window', setting, windowClassName);
			windowManager.add(windowClassName, setting.data);
		}
		// make sure first is active
		$('.window, .window-tab').removeClass('active');
		$('.window:first, .window-tab:first').addClass('active');

		// get first window
		var bibleWindows = settings.windows.filter(function(s) { return s.windowType == 'BibleWindow'; }),
			firstBibleWindow = bibleWindows.length > 0 ? bibleWindows[0] : null,
			firstFragmentid = firstBibleWindow != null && firstBibleWindow.data != null ? firstBibleWindow.data.fragmentid : null;

		if (firstFragmentid != null) {
			TextNavigation.firstState( firstFragmentid );
		}

		var settingsTimer = new Timer(storeSettings, 1000);

		windowManager.on('settingschange', function(e) {

			// title to show active window's position
			if (e.data && e.data.label && e.data.hasFocus) {
				document.title = e.data.labelLong;
			}

			settingsTimer.start();

		});

		var plugins = []
		ext.plugins = plugins;
		// run plugins
		for (var x in sofia.plugins) {
			plugin = new window[ sofia.plugins[x] ](this);
			plugins.push(plugin);

			if (plugin.on) {

				plugin.on('globalmessage', handleGlobalMessage);
			}
		}
	}

	function resize() {
		//console.log('app resize');
		PlaceKeeper.storePlace();

		if (windowManager && windowManager.getWindows().length == 1) {
			body.addClass('one-window')
		} else {
			body.removeClass('one-window')
		}

		// get window size
		var width = win.width(),
			height = win.height(),

			// calculate size
			areaHeight = height - header.outerHeight() + footer.outerHeight(),
			areaWidth = width - parseInt(main.css('margin-left'), 10) - parseInt(main.css('margin-right'), 10);

		/*
		if (width < 460) {
			//header.hide();
			areaHeight = height;
		} else {
			header.show();
		}
		*/

		// set height
		main.height(areaHeight);
		main.width(areaWidth);

		// pass new size down to area
		ext.windowManager.size(areaWidth, areaHeight);

		PlaceKeeper.restorePlace();
	}
	ext.resize = resize;

	function getWindowSettings() {

		// (1) get default settings
		var settings = {
			windows: sofia.config.windows
		};

		// (2) replace defaults with user settings
		settings = AppSettings.getValue(settingsKey, settings);

		// (3) overwrite with QueryString when present
		var queryData = stringUtility.parseQuerystring();
		if (queryData["w1"]) {

			var tempSettings = [];

			for (var i=1; i<=4; i++) {
				var winTypeName = queryData["w" + i.toString()],
					winTypeInfo = sofia.windowTypes.filter(function(winType) { return winType.param == winTypeName; })[0],
					winTypeParamKeys = typeof winTypeInfo != 'undefined' ? Object.keys(winTypeInfo.paramKeys) : [],
					setting = {
						type: winTypeName,
						data: {}
					};

				if (typeof winTypeName != 'undefined') {
					// go though all querystring values, and anything that ends with '1' goes with this data
					for (var q in queryData) {
						var key = q.substring(0, q.length-1),
							number = q.substring(q.length-1),
							value = queryData[q];

						if (key != 'w' && number == i.toString()) {

							// convert short querystring key to longer one if needed
							var longParamKey = winTypeParamKeys.filter(function(lpk) {
								console.log(key, lpk, winTypeInfo.paramKeys[lpk]);
								return key == winTypeInfo.paramKeys[lpk] || key == lpk;
							})[0];

							setting.data[longParamKey] = value;
						}
					}

					tempSettings.push(setting);
				}
			}

			// overwrite settings
			if (tempSettings.length > 0) {
				settings.windows = tempSettings;
			}

		}
		return settings;
	}

	function storeSettings() {
			// get settings from all windows
		var windowSettings = ext.windowManager.getSettings(),
			// later we'll need these
			headerSettings = {},
			settings = {
				windows: windowSettings
			};

		//console.log('storeSettings', settings);

		// store
		AppSettings.setValue(settingsKey, settings );
	}

	function handleGlobalMessage(e) {
		// give to other windows
		var windows = ext.windowManager.getWindows();

		for (var i=0, il=windows.length; i<il; i++) {
			var w = windows[i];

			if (w.id != e.id) {
		 		// pass message down
		 		w.trigger('message', e);
			}
		}

		// plugins
		if (ext.plugins) {
			for (var i=0, il=ext.plugins.length; i<il; i++) {
				var p = sofia.app.plugins[i];

				if (p.trigger) {
					// pass message down
					p.trigger('message', e);
				}
			}
		}

	}

	ext.init = init;
	ext.handleGlobalMessage = handleGlobalMessage;

	// internationalization: i18n

	// if this is the first visit, we need a way to set the language
	var lngSetting = '',
		i18nCookieValue = AppSettings.getCookieValue('i18next');

	if (i18nCookieValue == '' || i18nCookieValue == null && sofia.config.defaultLanguage != '') {
		lngSetting = sofia.config.defaultLanguage;
	}

	i18n.init({fallbackLng: 'en', lng: lngSetting, resStore: sofia.resources});

	setTimeout(function() {

		var lang = i18n.lng(),
			langSelector = $('#config-language');

		langSelector.val( lang );

		if (lang != langSelector.val() ) {
			langSelector.val(  lang.split('-')[0] );
		}

		if (langSelector[0] && langSelector[0].localizeLanguages) {
			langSelector[0].localizeLanguages();
		}

	}, 50);

	return ext;
};
