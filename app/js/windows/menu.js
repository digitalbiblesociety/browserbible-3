
var MainMenu = function(node) {

	// simply create all 'menuComponents' define below
	for (var i=0, il=sofia.menuComponents.length; i<il; i++) {
		var component = new window[sofia.menuComponents[i]](node);
	}

	var ext = {

	};

	ext = $.extend(true, ext, EventEmitter);
	return ext;

};


var MainLogo = function(node) {
	var
		container = $('.windows-container'),
		body = $(document.body),
		win = $(window),
		logo = $('<div id="app-logo"></div>')
					.appendTo(node)
					.on('click', logoClick),

		modalOverlay = $('<div class="modal-overlay"></div>')
							.appendTo( body )
							.hide(),
		isAboutLoaded = false,
		aboutWindow = new MovableWindow(500,250,'About');

	aboutWindow.body
					.css({padding: '20px'});

	aboutWindow.closeButton.on('click', function() {
		aboutWindow.hide();
		modalOverlay.hide();
		container.removeClass('blur');
	});

	function logoClick() {
		if (aboutWindow.container.is(':visible')) {
			aboutWindow.hide();
			modalOverlay.hide();
			container.removeClass('blur');
		} else {

			var winWidth = win.width(),
				winHeight = win.height();


			container.addClass('blur');

			aboutWindow
				.size(.8*winWidth, 0.7*winHeight)
				.show()
				.center();

			modalOverlay
				.width( winWidth )
				.height( winHeight )
				.show();


			if (!isAboutLoaded) {

				aboutWindow.body.addClass('loading-indicator');

				// assume a local file first
				$.ajax({
					url: sofia.config.aboutPagePath,
					dataType: 'html',
					success: function(data) {
						aboutWindow.body.removeClass('loading-indicator');

						isAboutLoaded = true;

						showAbout(data, sofia.config.aboutPagePath);
					},
					error: function() {

						if (sofia.config.baseContentUrl != '') {

							console.log("No local about.html");

							// this one will go through the CDN
							sofia.ajax({
								url: sofia.config.aboutPagePath,
								dataType: 'text',
								success: function(data) {

									console.log('Success: CDN about.html', data.indexOf('<html'));

									aboutWindow.body.removeClass('loading-indicator');

									isAboutLoaded = true;

									showAbout(data, sofia.config.baseContentUrl + sofia.config.aboutPagePath);
								},
								error: function() {

									// error
									console.log("Can't find a about.html");

								}
							});
						} else {

							console.log("No local about.html, no CDN to check");

						}
					}
				});
			}
		}
	}

	function showAbout(data, url) {

		if (data.indexOf('<html') > -1) {

			aboutWindow.body.html('<iframe style="border: 0;" src="' + url + '"></iframe>');
			aboutWindow.body.css({padding: 2});

			var iframe = aboutWindow.body.find('iframe');

			iframe.css({
				width: aboutWindow.body.width(),
				height: aboutWindow.body.height() - 5
			});

		} else {

			aboutWindow.body.html(data);
		}
	}

	return logo;
};
sofia.menuComponents.push('MainLogo');

/*
var MobileButton = function(node) {
	var MobileButton = $('<a id="main-mobile-button" class="main-menu-button" style="" href="../mobile/index.html"></a>')
					.appendTo(node);
};
sofia.menuComponents.push('MobileButton');
*/

var MainSearchBox = function(node) {

	var searchBox = $('<div id="main-search-box">' +
							//'<input type="search" placeholder="Search" id="main-search-input" />' +

							//'<input type="search" placeholder="' + i18n.t('menu.search.placeholder') + '" id="main-search-input" />' +
							'<input type="search" class="i18n" data-i18n="[placeholder]menu.search.placeholder" id="main-search-input" />' +

							'<input type="button" id="main-search-button" value="" />' +
					'</div>')
			.appendTo(node),

		searchInput = searchBox.find('#main-search-input')
								.on('keypress', checkInput),
		searchButton = searchBox.find('#main-search-button')
								.on('click', doMainSearch);


	function checkInput(e) {
		if (e.which == 13) {
			doMainSearch();
		}
	}

	function doMainSearch(e) {

		// do a search
		var searchtext = searchInput.val(),
			appSettings = sofia.app.windowManager.getSettings(),
			searchWindow = null,
			firstBibleWindow = null;

		for (var i=0,il=appSettings.length; i<il; i++) {
			var settings = appSettings[i];

			//console.log(settings);

			// first text
			if (settings.windowType == 'BibleWindow' && firstBibleWindow == null) {
				firstBibleWindow = settings;
			}

			// first search
			if (settings.windowType == 'SearchWindow' && searchWindow == null) {
				searchWindow = settings;
			}
		}


		PlaceKeeper.storePlace();

		textid = firstBibleWindow != null ? firstBibleWindow.data.textid : sofia.config.newBibleWindowVersion;
		sofia.app.windowManager.add('SearchWindow', {searchtext: searchtext, textid: textid});

		PlaceKeeper.restorePlace();

		searchBox.val('');

	}


	return searchBox;

};
sofia.menuComponents.push('MainSearchBox');



var FullScreenButton = function(node) {

	var
		el = document.body,
		fullscreenButton = $('<div id="main-fullscreen-button" class="main-menu-button"></div>')
			.appendTo(node)
			.on('click', toggleFullscreen),

		isFullscreen = false;

	function toggleFullscreen() {
		if (fullScreenApi.isFullScreen()) {
			exitFullscreen();
		} else {
			enterFullscreen();
		}
	}

	function enterFullscreen() {
		fullScreenApi.requestFullScreen(el);
	}

	function exitFullscreen() {
		fullScreenApi.cancelFullScreen();

	}

	//console.log(fullScreenApi);

	if (!fullScreenApi.supportsFullScreen) {
		fullscreenButton.hide();
	}

	return fullscreenButton;
};
sofia.menuComponents.push('FullScreenButton');

(function() {
    var
        fullScreenApi = {
            supportsFullScreen: false,
            isFullScreen: function() { return false; },
            requestFullScreen: function() {},
            cancelFullScreen: function() {},
            fullScreenEventName: '',
            prefix: ''
        },
        browserPrefixes = 'webkit moz o ms khtml'.split(' ');

    // check for native support
    if (typeof document.cancelFullScreen != 'undefined') {
        fullScreenApi.supportsFullScreen = true;
    } else {
        // check for fullscreen support by vendor prefix
        for (var i = 0, il = browserPrefixes.length; i < il; i++ ) {
            fullScreenApi.prefix = browserPrefixes[i];

            if (typeof document[fullScreenApi.prefix + 'CancelFullScreen' ] != 'undefined' ) {
                fullScreenApi.supportsFullScreen = true;

                break;
            }
        }
    }

    // update methods to do something useful
    if (fullScreenApi.supportsFullScreen) {
        fullScreenApi.fullScreenEventName = fullScreenApi.prefix + 'fullscreenchange';

        fullScreenApi.isFullScreen = function() {
            switch (this.prefix) {
                case '':
                    return document.fullScreen;
                case 'webkit':
                    return document.webkitIsFullScreen;
                default:
                    return document[this.prefix + 'FullScreen'];
            }
        }
        fullScreenApi.requestFullScreen = function(el) {
        	if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
	        	el.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        	}
            else {
            	return (this.prefix === '') ? el.requestFullScreen() : el[this.prefix + 'RequestFullScreen']();
            }
        }
        fullScreenApi.cancelFullScreen = function(el) {
            return (this.prefix === '') ? document.cancelFullScreen() : document[this.prefix + 'CancelFullScreen']();
        }
    }

    // jQuery plugin
    if (typeof jQuery != 'undefined') {
        jQuery.fn.requestFullScreen = function() {

            return this.each(function() {
                if (fullScreenApi.supportsFullScreen) {
                    fullScreenApi.requestFullScreen(this);
                }
            });
        };
    }

    // export api
    window.fullScreenApi = fullScreenApi;
})();

var ConfigButton = function(node) {
	var configButton = $('<div id="main-config-button" class="main-menu-button" style=""></div>')
					.appendTo(node)
					.on('click', buttonClick),

		mobileConfigButton = $('<div id="mobile-config-button" class="mobile-menu-button" style=""></div>')
					.appendTo( $('body'))
					.on('click', buttonClick),

		configMenu = $('<div id="main-config-box" class="window-overlay">' +

						'<div class="config-section" id="config-type">' +
							//'<span class="config-header">Font</span>' +
							'<span class="config-header i18n" data-i18n="[html]menu.config.font"></span>' +
							'<div class="config-body"></div>' +
							'<div class="clear"></div>' +
						'</div>' +
						'<div class="config-section" id="config-toggles">' +
//							'<span class="config-header">Settings</span>' +
							'<span class="config-header i18n" data-i18n="[html]menu.config.settings"></span>' +
							'<div class="config-body"></div>' +
							'<div class="clear"></div>' +
						'</div>' +
						'<div class="config-section" id="config-tools">' +
							'<span class="config-header i18n" data-i18n="[html]menu.config.tools"></span>' +
							//'<span class="config-header">Tools</span>' +
							'<div class="config-body"></div>' +
							'<div class="clear"></div>' +
						'</div>' +

					'</div>')
					.appendTo($('body'));


	function docClick(e) {

		if ($(e.target).closest('#main-config-box').length == 0) { // } && $(e.target).closest('#main-add-button').length == 0) {
			configMenu.hide();
			$(document).off('click', docClick);
		}
	}

	function buttonClick(e) {

		e.preventDefault();

		if (configMenu.is(':visible')) {
			configMenu.hide();

			$(document).off('click', docClick);
		} else {

			$('.window-overlay').hide();

			configMenu.show();

			$(document).on('click', docClick);
		}

		return false;
	}
};
sofia.menuComponents.push('ConfigButton');



var AddWindowButton = function(node) {


	var addButton = $('<div id="main-add-button" class="main-menu-button"></div>')
					.appendTo(node)
					.on('click', buttonClick),
		buttonMenu = $('<div id="add-button-box" class="window-overlay"></div>')
					.appendTo($('body'))

	function buttonClick(e) {


		e.preventDefault();

		if (buttonMenu.is(':visible')) {
			buttonMenu.hide();
			$(document).off('click', docClick);
		} else {
			$('.window-overlay').hide();
			buttonMenu.show();
			setTimeout(function() {
				$(document).on('click', docClick);
			},50);
		}

		return false;
	}

	function docClick(e) {

		if ($(e.target).closest('#add-button-box').length == 0) { // } && $(e.target).closest('#main-add-button').length == 0) {

			buttonMenu.hide();

			$(document).off('click', docClick);

		}
	}

	// create window buttons from window Types
	windowTools = [];
	for (var i=0, il=sofia.windowTypes.length; i<il; i++) {
		var winType = sofia.windowTypes[i];

		windowTools.push({
			type: winType.className,
			label: winType.param,
			data: winType.init
		});


	}



	for (var x in windowTools) {
		var tool = windowTools[x];
		// ADD Button
		var addButton = $('<div class="window-add i18n" id="add-' + tool.type + '" data-i18n="[html]windows.' + tool.label + '.label"></div>')
					.appendTo(buttonMenu)
					.data('init', tool);
	}

	buttonMenu.on('click', '.window-add', function(e) {
		buttonMenu.hide();

		var label = $(this),
			settings = label.data('init');

		// when starting a bible or commentary window, try to match it up with the others
		if (settings.type == 'BibleWindow' || settings.type == 'CommentaryWindow') {

			// get location from first window
			var
				firstBCWindow = (sofia.app.windowManager) ?
									sofia.app.windowManager.getWindows().filter(function(w) { return w.className == 'BibleWindow' || w.className == 'CommentaryWindow'})[0] :
									null,
				currentData = (firstBCWindow != null) ? firstBCWindow.getData() : null;


			// if no location, then use the defaults from config
			if (currentData != null) {
				console.log('first window', currentData);
				settings.data.fragmentid = currentData.fragmentid;
				settings.data.sectionid = currentData.sectionid;
			} else {
				var fragmentid = (typeof sofia.config.newWindowFragmentid != 'undefined') ? sofia.config.newWindowFragmentid : 'JN1_1',
					sectionid = fragmentid.split('_')[0];

				settings.data.fragmentid = fragmentid;
				settings.data.sectionid = sectionid;
			}

			console.log('new window', settings);
		}

		PlaceKeeper.storePlace();
		sofia.app.windowManager.add(settings.type, settings.data);
		PlaceKeeper.restorePlace();

		if (sofia.analytics) {
			sofia.analytics.record('createwindow', settings.type);
		}

		//windowManager.trigger('settingschange',{});
	});

	$('<span class="window-reset i18n" data-i18n="[html]menu.reset">Reset</span>')
		.on('click', function() {

			if (typeof sofia.config.windows != 'undefined') {

				var querystring = [];

				for (var i=0, il=sofia.config.windows.length; i<il; i++) {
					var win = sofia.config.windows[i];

					// type
					querystring.push('win'+ (i+1) + '=' + win.type);

					// data
					var keys = Object.keys(win.data);
					for (var k in keys) {
						querystring.push(keys[k] + (i+1) + '=' + win.data[keys[k]]);
					}
				}

				window.location.href = window.location.pathname + '?' + querystring.join('&');



			} else {
				window.location.reload();
			}
		})
		.appendTo(buttonMenu);


	return addButton;

};
sofia.menuComponents.push('AddWindowButton');


var FontSizeSettings = function(node) {
	var
		body = $('#config-type .config-body'),
		fontSizes = [14,16,18,20,22,24,26,28],
		defaultFontSize = {"fontSize": 18},
		fontSizeKey = 'config-font-size',
		fontSizeSetting = AppSettings.getValue(fontSizeKey, defaultFontSize);

	$('<table id="font-size-table"><tr><td><span style="font-size:' + fontSizes[0] + 'px">A</span><td style="width:100%"></td><td><span style="font-size:' + fontSizes[fontSizes.length-1] + 'px">A</span></td></tr></table>')
		.appendTo(body);

	// HTML5 range control (IE10+, FF35+)
	$('<input type="range" min="14" max="28" step="2" value="' + fontSizeSetting.fontSize + '" style="width: 100%;" />')
		.appendTo(body.find('td:eq(1)') )
		.on('change input', function() {

			console.log( $(this).val() );
			setFontSize( $(this).val() );

		});

	setFontSize(fontSizeSetting.fontSize);

	function setFontSize(newFontSize) {


		var	body = $('body');

		PlaceKeeper.storePlace();

		// remove all others
		for(var i=0, il=fontSizes.length; i<il; i++) {
			var fontSize = fontSizes[i],
				className = 'config-font-size-' + fontSize;

			body.removeClass(className);
		}

		body.addClass('config-font-size-' + newFontSize);

		AppSettings.setValue(fontSizeKey, {fontSize: newFontSize});


		if (sofia.analytics) {
			sofia.analytics.record('setting', 'fontsize', newFontSize);
		}

		PlaceKeeper.restorePlace();
	}

};


sofia.menuComponents.push('FontSizeSettings');




var FontFamilySettings = function(node) {
	var
		body = $('#config-type .config-body'),
		fontFamilyNames = ['Cambria', 'Helvetica', 'Baskerville', 'Georgia', 'Times', 'Libertine'],
		defaultFont = {"fontName": fontFamilyNames[0]},
		fontFamilyKey = 'config-font-family',
		fontFamilySetting = AppSettings.getValue(fontFamilyKey, defaultFont);


	for(var i=0, il=fontFamilyNames.length; i<il; i++) {
		var fontName = fontFamilyNames[i];

		$('<label id="config-font-family-' + fontName + '" class="config-font-family">' +
				'<input type="radio" id="config-font-family-' + fontName + '-value" name="config-font-family" value="' + fontName + '" />' +
				/* fontName */ 'Aa' +
			'</label>')
			.appendTo(body);
	}


	function setFontFamily(newFontName) {

		var body = $('body');

		PlaceKeeper.storePlace();

		// remove all others
		for(var i=0, il=fontFamilyNames.length; i<il; i++) {
			var fontName = fontFamilyNames[i],
				className = 'config-font-family-' + fontName;

			body.removeClass(className);
		}

		$(body).addClass('config-font-family-' + newFontName);

		AppSettings.setValue(fontFamilyKey, {fontName: newFontName});

		if (sofia.analytics) {
			sofia.analytics.record('setting', 'fontfamily', newFontName);
		}

		PlaceKeeper.restorePlace();

	}

	// handle clicks
	body.on('change', 'input', function() {
		var radio = $(this),
			newFontFamilyValue = radio.val();

		setFontFamily(newFontFamilyValue);
	});

	// set default
	body.find('#config-font-family-' + fontFamilySetting.fontName + '-value').trigger('click');
};


sofia.menuComponents.push('FontFamilySettings');


var ThemeSetting = function(node) {
	var
		body = $('#config-type .config-body'),
		themesBlock = $('<div id="config-themes"></div>')
			.appendTo(body),
		themeNames = ['default','sepia','dark'],
		defaultThemeSetting = {"themeName": themeNames[0]},
		themeKey = 'config-theme',
		themeSetting = AppSettings.getValue(themeKey, defaultThemeSetting);


	for(var i=0, il=themeNames.length; i<il; i++) {
		var themeName = themeNames[i];

		$('<span id="config-theme-' + themeName + '" class="config-theme-toggle i18n" data-i18n="[html]menu.themes.' + themeName + '" data-themename="' + themeName + '">' + themeName + '</span>')
			.appendTo(themesBlock);
	}

	// handle clicks
	themesBlock.on('click', '.config-theme-toggle', function() {
		var span = $(this),
			selectedTheme = span.attr('data-themename'),
			selectedThemeClass = 'theme-' + selectedTheme,
			$body = $(document.body);

		// remove all themes
		for(var i=0, il=themeNames.length; i<il; i++) {
			var themeClassName = 'theme-' + themeNames[i];
			$body.removeClass(themeClassName);
		}

		$body.addClass(selectedThemeClass);

		span
			.addClass('config-theme-toggle-selected')
			.siblings()
			.removeClass('config-theme-toggle-selected');


		AppSettings.setValue(themeKey, {themeName: selectedTheme} );
	});

	body.find('#config-theme-' + themeSetting.themeName + '').trigger('click');
};


sofia.menuComponents.push('ThemeSetting');


var LanguageSetting = function(node) {
	var
		body = $('#config-toggles .config-body'),
		list = $('<select id="config-language"></select>')
					.appendTo(body),
		langKeys = Object.keys(sofia.resources);

	body.append($('<div class="clear"></div>'));

	// make sure English isn't first!
	langKeys.sort();

	for(var i=0, il=langKeys.length; i<il; i++) {
		var langKey = langKeys[i],
			langName = sofia.resources[langKey].translation.name;

		$('<option value="' + langKey + '">' + langName + '</option>')
			.appendTo(list);
	}

	// handle clicks
	list.on('change', function() {
		var newLang = list.val();

		i18n.setLng(newLang);
		$('.i18n').i18n();
	});
};


sofia.menuComponents.push('LanguageSetting');


var ConfigToggles = function(node) {
	var body = $('#config-toggles .config-body'),
		toggleNames = ['Chapters', 'Verses', 'Titles', 'Notes', 'Words of Christ', 'Media', 'Justify'],
		toggleDefaults = [true, true, true, true, true, true, false],
		prefix = 'config-toggle-';

	sofia.globals.createToggle = function(toggleName, defaultValue) {

		var
			toggleId = toggleName.replace(/\s/gi, '').toLowerCase(),
			toggleDefaultSetting = {checked: defaultValue},
			toggleSetting = AppSettings.getValue(toggleId, toggleDefaultSetting),
			toggle = $('<div id="config-toggle-' + toggleId + '" class="config-toggle">' +
						'<input id="config-toggle-' + toggleId + '-input" type="checkbox" value="' + toggleId + '" />' +
						'<label for="config-toggle-' + toggleId + '-input" title="' + toggleName + '">' + toggleName + '</label>' +
					'</div>')
						.appendTo(body);

		toggle
			.find('input')
				.on('click', function() {
					var cb = $(this),
						checked = cb.is(':checked'),
						value = cb.val();

					setToggle(value, checked); 

				});

		setToggle(toggleId, toggleSetting.checked);

	}

	function setToggle(toggleId, checked) {

		PlaceKeeper.storePlace();

		var toggle = $('#config-toggle-' + toggleId),
			body = $('body'),
			onClass = 'toggle-' + toggleId + '-on',
			offClass = 'toggle-' + toggleId + '-off';

		if (checked == true || checked == 'true') {
			toggle.addClass('toggle-on');
			toggle.find('input').prop('checked', true);
			body
				.addClass(onClass)
				.removeClass(offClass);

		} else {
			toggle.removeClass('toggle-on');
			toggle.find('input').prop('checked', false);
			body
				.removeClass(onClass)
				.addClass(offClass);
		}

		PlaceKeeper.restorePlace();


		if (sofia.analytics) {
			sofia.analytics.record('setting', toggleId, checked);
		}

		//console.log('setValue', toggleId, checked);
		AppSettings.setValue(toggleId, {checked: checked});

	}


	for(var i=0, il=toggleNames.length; i<il; i++) {
		var toggleName = toggleNames[i]
		sofia.globals.createToggle(toggleName, toggleDefaults[i]);
	}

};


sofia.menuComponents.push('ConfigToggles');


var ConfigUrl = function(node) {

	if (location.protocol == 'file:') {
		return;
	}

	var body = $('#config-tools .config-body'),
		urlBox =
		$('<div id="config-global-url">' +
				//'<span class="config-header">URL</span>' +
				'<span ></span>' +
				'<input type="text" />' +
				//'<div ></div>' +
			'</div>'),
		linkButton = urlBox.find('span'),
		urlInput = urlBox.find('input'),
		urlDiv = urlBox.find('div'),
		clickables = [linkButton, urlInput, urlDiv];
					//.on('focus', function() {
					//	$(this).select();
					//});

	body.after(urlBox);

	var urlTimer = new Timer(updateUrl, 500);

	setTimeout(function() {
		sofia.app.windowManager.on('settingschange', function(e) {

			////console.log('update');

			// title to show active window's position
			urlTimer.start();

		});

		updateUrl();
	}, 1000);


	if (Detection.hasFlash) {
		ZeroClipboard.config( { moviePath: sofia.config.baseContentUrl + 'build/ZeroClipboard.swf' } );
		for (var c in clickables) {
			var el = clickables[c];

			var client = new ZeroClipboard(el);
			client.on( 'dataRequested', function (client, args) {

				updateUrl();

				client.setText( urlInput.val() );

				urlInput.select();
			});
		}
	}



	urlInput.on('click', function() {
		updateUrl();
	});

	linkButton.on('click', function() {
		updateUrl();

		urlInput.select();
	});


	function updateUrl() {
			// get settings from all windows
		var windowSettings = sofia.app.windowManager.getSettings(),
			existingParams = stringUtility.parseQuerystring();
			newParams = {},
			mergedParams = {},
			mergedArray = [];

		for (var i=0, il=windowSettings.length; i<il; i++) {
			var winSettings = windowSettings[i];

			if (winSettings.data == null || typeof winSettings.data.params == 'undefined') {
				continue;
			}

			// go through the params object
			// params: {'win': 'bible', 'fragmentid': 'JN1_1'}
			//for (var j=0,jl=winSettings.data.params.length; j<jl; j++) {
			for (var paramName in winSettings.data.params) {
				var paramData = winSettings.data.params[paramName];
				newParams[ paramName + (i+1) ] = paramData;

				//console.log(paramName, paramData);
			}

		}

		// keep all parameters that aren't windowed ones
		for (var param in existingParams) {
			// check if it's blank or if it's a previously existing parameter (say the third window, and now there is only 2)
			if (param != '' && param.indexOf('win') != 0  && param.indexOf('textid') != 0  && param.indexOf('searchtext') != 0  && param.indexOf('fragmentid') != 0 ) {
				mergedParams[ param ] = existingParams[param];
			}
		}


		mergedParams = $.extend({}, mergedParams, newParams);

		for (var param in mergedParams) {
			if (param != '' ) {
				mergedArray.push( param + '=' + mergedParams[param] );
			}
		}
		//mergedArray.reverse();

		url = location.protocol + '//' + location.host + location.pathname + '?' + mergedArray.join('&');

		urlInput.val(url);
		urlDiv.html(url);

		//console.log('URL', windowSettings, parts);
	}



	//base.height('300px');
};

sofia.menuComponents.push('ConfigUrl');
