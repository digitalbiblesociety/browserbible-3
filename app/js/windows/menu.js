
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
	var logo = $('<div id="app-logo"></div>')
					.appendTo(node)
					.on('click', logoClick),
		aboutNode = $('#about'),
		aboutWindow = new MovableWindow(500,250,'About');
										
	aboutWindow.body
					.css({padding: '20px'})
					.append(aboutNode);
					
	function logoClick() {
		console.log('logo clicked', aboutWindow.container.is(':visible'));
	
		if (aboutWindow.container.is(':visible')) {
			aboutWindow.hide();			
		} else {
			aboutWindow.show();
		}	
	}
		
	return logo;
};
sofia.menuComponents.push('MainLogo');

var MainSearchBox = function(node) {
		
	var searchBox = $('<div id="main-search-box">' + 
							'<input type="search" placeholder="Search" id="main-search-input" />' +
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
			firstTextWindow = null;
			
		for (var i=0,il=appSettings.length; i<il; i++) {
			var settings = appSettings[i];
			
			console.log(settings);
			
			// first text 
			if (settings.windowType == 'TextWindow' && firstTextWindow == null) {
				firstTextWindow = settings;
			}
			
			// first search
			if (settings.windowType == 'SearchWindow' && searchWindow == null) {
				searchWindow = settings;
			}			
		}
		
		console.log(firstTextWindow);
		
		
		//if (searchWindow == null) {
			
			// search based on first open window
			textid = firstTextWindow.data.textid;		
			sofia.app.windowManager.add('SearchWindow', {searchtext: searchtext, textid: textid});
			
		//} else {
			
			// restart search
			
		//	console.log( searchWindow );
			
		//}



		
		searchBox.val('');
		

	}
	
	
	return searchBox;			

};
sofia.menuComponents.push('MainSearchBox');


var AddWindowButton = function(node) {


	var addButton = $('<div id="main-add-button" class="main-menu-button"></div>')
					.appendTo(node)
					.on('click', buttonClick),
		buttonMenu = $('<div id="add-button-box" class="window-overlay"></div>')
					.appendTo($('body')) 
	
	function buttonClick(e) {
	
		if (buttonMenu.is(':visible')) {
			buttonMenu.hide();
			$(document).off('click', docClick);			
		} else {
			buttonMenu.show();
			setTimeout(function() {
				$(document).on('click', docClick);
			},50);
		}
		
		//return false;
	}
	
	function docClick(e) {
	
		if ($(e.target).closest('#add-button-box').length == 0) { // } && $(e.target).closest('#main-add-button').length == 0) {
		
			buttonMenu.hide();
			
			$(document).off('click', docClick);					
		
		}
	}
	

	var windowTools = [
		{type: 'TextWindow', label: 'Bible', data: {'textid':sofia.config.newBibleWindowVersion,'fragmentid':sofia.config.newBibleWindowVerse}}
	];
	
	if (sofia.config.enableOnlineSources) {
		windowTools.push(	
			{type: 'MapsWindow', label: 'Maps', data: {'latitude': 31.7833, 'longitude': 35.2167}}
		);
	}	
	windowTools.push(		
		{type: 'SearchWindow', label: 'Search', data: {}}
	);
	windowTools.push(	
		{type: 'MediaWindow', label: 'Media', data: {}}
	);
	
	
	
	for (var x in windowTools) {
		var tool = windowTools[x];
		// ADD Button
		var addButton = $('<div class="window-add" id="add-' + tool.type + '">' + tool.label + '</div>')
					.appendTo(buttonMenu) 
					.data('init', tool);			
	}
	
	buttonMenu.on('click', '.window-add', function(e) {
		buttonMenu.hide();
	
		var label = $(this),
			settings = label.data('init');
	
		sofia.app.windowManager.add(settings.type, settings.data);	
		
		if (sofia.analytics) {
			sofia.analytics.record('createwindow', settings.type);
		}		

		//windowManager.trigger('settingschange',{});
	});	
	
	return addButton;

};
sofia.menuComponents.push('AddWindowButton');

var MobileButton = function(node) {
	var MobileButton = $('<a id="main-mobile-button" class="main-menu-button" style="" href="../mobile/index.html"></a>')
					.appendTo(node);
};
sofia.menuComponents.push('MobileButton');

var ConfigButton = function(node) {
	var configButton = $('<div id="main-config-button" class="main-menu-button" style=""></div>')
					.appendTo(node)
					.on('click', buttonClick),
		configMenu = $('<div id="main-config-box" class="window-overlay"></div>')
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
			configMenu.show();
			
			$(document).on('click', docClick);
		}
		
		return false;		
	}
};
sofia.menuComponents.push('ConfigButton');


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
            return (this.prefix === '') ? el.requestFullScreen() : el[this.prefix + 'RequestFullScreen']();
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



var FontFamilySettings = function(node) {
	var base = $('#main-config-box'),
		main = $('<div class="config-section">' + 
					'<span class="config-header">Font</span>' + 
					'<div class="config-body"></div>' +
				'</div>').appendTo(base),
		body = main.find('.config-body'),
		fontFamilyNames = ['Cambria','Helvetica', 'Baskerville', 'Georgia', 'Times'],
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
	}
 	
	// handle clciks
	body.on('change', 'input', function() {
		var radio = $(this),
			newFontFamilyValue = radio.val();
					
		setFontFamily(newFontFamilyValue);
	});
	
	// set default
	body.find('#config-font-family-' + fontFamilySetting.fontName + '-value').trigger('click');
};


sofia.menuComponents.push('FontFamilySettings');




var FontSizeSettings = function(node) {
	var base = $('#main-config-box'),
		main = $('<div class="config-section">' + 
					'<span class="config-header">Size</span>' + 
					'<div class="config-body"></div>' +
				'</div>').appendTo(base),
		body = main.find('.config-body'),
		fontSizes = [10,12,14,16,18,22,24,26,28],
		defaultFontSize = {"fontSize": 18},
		fontSizeKey = 'config-font-size',
		fontSizeSetting = AppSettings.getValue(fontSizeKey, defaultFontSize);
	
	
	$('<div class="font-slider"></div>')
		.appendTo(body)
		.slider({
			value: fontSizeSetting.fontSize,
			min: fontSizes[0],
			max: fontSizes[fontSizes.length-1],
			step: 2,			
			slide: function( event, ui ) {
				setFontSize(ui.value);
			}						
		});
	
	function setFontSize(newFontSize) {
	
		var body = $('body');
	
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
	}	

};


sofia.menuComponents.push('FontSizeSettings');




var ConfigToggles = function(node) {
	var base = $('#main-config-box'),
		main = $('<div class="config-section">' + 
					'<span class="config-header">Settings</span>' + 
					'<div class="config-body" id="config-toggles"></div>' +
					'<div class="clear"></div>' + 
				'</div>').appendTo(base),
		body = main.find('.config-body'),
		toggleNames = ['Chapters', 'Verses', 'Titles', 'Notes', 'Words of Christ', 'Media'],
		prefix = 'config-toggle-';
		
	
	
	sofia.globals.createToggle = function(toggleName) {
		
		var
			toggleId = toggleName.replace(/\s/gi, '').toLowerCase(),
			toggleDefaultSetting = {checked: true},
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

		setToggle(toggleId, toggleSetting);
		
	}
	
	function setToggle(toggleId, checked) {
		var toggle = $('#config-toggle-' + toggleId),
			body = $('body'),
			onClass = 'toggle-' + toggleId + '-on',
			offClass = 'toggle-' + toggleId + '-off';			
		
		if (checked) {
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
		
		if (sofia.analytics) {
			sofia.analytics.record('setting', toggleId, checked);
		}		
		
		AppSettings.setValue(toggleId, {checked: checked});
		
	}
	
	
	for(var i=0, il=toggleNames.length; i<il; i++) {
		var toggleName = toggleNames[i]
		sofia.globals.createToggle(toggleName);
	}
	
};


sofia.menuComponents.push('ConfigToggles');




var ConfigAddIns = function(node) {
	var base = $('#main-config-box'),
		main = $('<div class="config-section">' + 
					'<span class="config-header">Add Ons</span>' + 
					'<div class="config-body" id="config-addons"></div>' +
				'</div>').appendTo(base);
};

sofia.menuComponents.push('ConfigAddIns');





var ConfigUrl = function(node) {
	var base = $('#main-config-box'),
		urlBox = 
		$('<div class="config-section">' + 
				'<span class="config-header">URL</span>' + 
				'<input type="text" id="sofia-global-url" style="width:100%;" />' +
			'</div>').appendTo(base),
		urlInput = urlBox.find('input');
					//.on('focus', function() {
					//	$(this).select();						
					//});
		
	var urlTimer = new Timer(updateUrl, 500);
	
	setTimeout(function() {
		sofia.app.windowManager.on('settingschange', function(e) {
			
			//console.log('update');
			
			// title to show active window's position		
			urlTimer.start();		
			
		});
		
		updateUrl();
	}, 1000);
	
	
	function updateUrl() {
			// get settings from al windows
		var windowSettings = sofia.app.windowManager.getSettings(),
			url = '?',
			parts = [];
			
		for (var i=0, il=windowSettings.length; i<il; i++) {
			var winSettings = windowSettings[i];
			
			console.log('setting', i, winSettings);
			
			switch (winSettings.windowType) {
				case 'TextWindow':
					parts.push('win' + (i+1) + '=' + 'bible');
					parts.push('textid' + (i+1) + '=' + winSettings.data.textid);
					parts.push('fragmentid' + (i+1) + '=' + winSettings.data.fragmentid);
					break;
				case 'SearchWindow':
					parts.push('win' + (i+1) + '=' + 'search');
					parts.push('textid' + (i+1) + '=' + winSettings.data.textid);
					parts.push('searchtext' + (i+1) + '=' + winSettings.data.searchtext);
					break;
				case 'MapsWindow':
					parts.push('win' + (i+1) + '=' + 'map');
					break;									
				case 'MediaWindow':
					parts.push('win' + (i+1) + '=' + 'media');
					break;									
				
			}			
		}

		
		url = location.href + '?' + parts.join('&');
			
		urlInput.val(url);
			
		console.log('URL', windowSettings, parts);
	}

	
	
	base.height('300px');
};

sofia.menuComponents.push('ConfigUrl');
