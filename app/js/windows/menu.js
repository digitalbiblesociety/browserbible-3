
var MainMenu = function(node) {
	
	// simply create all 'menuComponents' define below
	for (var i=0, il=sofia.menuComponents.length; i<il; i++) {
		var component = new window[sofia.menuComponents[i]](node);
	}
	
	var ext = {
		
	};
	
	ext = $.extend(true, ext, EventEmitter);
	return ext;

}


var MainLogo = function(node) {
	var logo = $('<div id="app-logo"></div>')
					.appendTo(node)
					.on('click', logoClick);
					
					
	function logoClick() {
	
	
	}
	
	
	return logo;
}
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
		var searchString = searchInput.val(),
			appSettings = sofia.app.windowManager.getSettings(),
			searchWindow = null,
			firstTextWindow = null;
			
		for (var i=0,il=appSettings.length; i<il; i++) {
			var settings = appSettings[i];
			
			// first text 
			if (settings.type == 'ScrollerWindow' && firstTextWindow == null) {
				firstTextWindow = settings;
			}
			
			// first search
			if (settings.type == 'SearchWindow' && searchWindow == null) {
				searchWindow = settings;
			}			
		}
		
		
		//if (searchWindow == null) {
			
			// search based on first open window
			textid = firstTextWindow.data.textid;		
			sofia.app.windowManager.add('SearchWindow', {searchString: searchString, textid: textid});
			
		//} else {
			
			// restart search
			
		//	console.log( searchWindow );
			
		//}



		
		searchBox.val('');
		

	}
	
	
	return searchBox;			

}
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
		} else {
			buttonMenu.show();
		}
	}
	

	var windowTools = [
		{type: 'ScrollerWindow', label: 'Bible', data: {'textid':'eng_kjv','sectionid':'JN1','fragmentid':'JN1_10'}},
		{type: 'MapsWindow', label: 'Maps', data: {'latitude': 31.7833, 'longitude': 35.2167}},
		{type: 'SearchWindow', label: 'Search', data: {}},
		{type: 'MediaWindow', label: 'Media', data: {}}
		//{type: 'VideoWindow', label: 'Video', data: {}},
		//{type: 'AudioWindow', label: 'Audio', data: {}},
		//{type: 'PicturesWindow', label: 'Pictures', data: {}},		
	];
	
	for (var x in windowTools) {
		var tool = windowTools[x];
		// ADD Button
		var addButton = $('<div class="window-add" id="add-' + tool.type + '">' + tool.label + '</div>')
					.appendTo(buttonMenu) 
					.data('init', tool);		

	}
	
	buttonMenu.on('click', '.window-add', function() {
	
		var label = $(this),
			settings = label.data('init');
	
		sofia.app.windowManager.add(settings.type, settings.data);	
		
		buttonMenu.hide();
		//windowManager.trigger('settingschange',{});
	});	
	
	return addButton;

}
sofia.menuComponents.push('AddWindowButton');

var ConfigButton = function(node) {
	var configButton = $('<div id="main-config-button" class="main-menu-button" style=""></div>')
					.appendTo(node)
					.on('click', buttonClick),
		configMenu = $('<div id="main-config-box" class="window-overlay"></div>')
					.appendTo($('body')) 
	
	function buttonClick(e) {
	
		if (configMenu.is(':visible')) {
			configMenu.hide();
		} else {
			configMenu.show();
		}
	}
		


}
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
		
		$('<label id="config-font-family-' + fontName + '" class="config-font-family"><input type="radio" name="config-font-family" value="' + fontName + '" />' + /* fontName */ 'Aa' + '</label>')
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
	}
 	
	// handle clciks
	body.on('change', 'input', function() {
		var radio = $(this),
			newFontFamilyValue = radio.val();
					
		setFontFamily(newFontFamilyValue);
	});
	
	// set default
	body.find('#config-font-family-' + fontFamilySetting.fontName).trigger('click');
}


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
		
	
	for(var i=0, il=fontSizes.length; i<il; i++) {
		var fontSize = fontSizes[i];
		
		$('<label id="config-font-size-' + fontSize + '" class="config-font-size"><input type="radio" name="config-font-size" value="' + fontSize + '" />' + fontSize + '</label>')
			.appendTo(body);		
	}
	
	
	function setFontSize(newFontSize) {
	
		var body = $('body');
	
		// remove all others
		for(var i=0, il=fontSizes.length; i<il; i++) {		
			var fontSize = fontSizes[i],
				className = 'config-font-size-' + fontSize;
				
			body.removeClass(className);			
		}
	
		$(body).addClass('config-font-size-' + newFontSize);
		
		AppSettings.setValue(fontSizeKey, {fontSize: newFontSize});		
	}
 	
	// handle clciks
	body.on('change', 'input', function() {
		var radio = $(this),
			newFontSize = radio.val();
					
		setFontSize(newFontSize);
	});
	
	// set default
	body.find('#config-font-size-' + fontSizeSetting.fontSize).trigger('click');
}


sofia.menuComponents.push('FontSizeSettings');




var ConfigToggles = function(node) {
	var base = $('#main-config-box'),
		main = $('<div class="config-section">' + 
					'<span class="config-header">Settings</span>' + 
					'<div class="config-body" id="config-toggles"></div>' +
				'</div>').appendTo(base),
		body = main.find('.config-body'),
		toggleNames = ['Chapters', 'Verses', 'Titles', 'Notes', 'Words of Christ'],
		prefix = 'config-toggle-';
		
	
	
	sofia.createToggle = function(toggleName) {
		
		var
			toggleId = toggleName.replace(/\s/gi, '').toLowerCase(),
			toggle = $('<span id="config-toggle-' + toggleId + '" class="config-toggle">' + 
						'<input type="checkbox" value="' + toggleId + ' />' + 
						'<label for="config-toggle-' + toggleId + '">' + toggleName + '</label>' + 
					'</span>')
						.appendTo(body);
			
		toggle
			.find('input')
				.on('click', function() {
					var cb = $(this),
						checked = cb.is(':checked'),
						value = cb.val();
						
					setToggle(value, checked);
						
				});

		return toggleId;
		
	}
	
	function setToggle(toggleId, checked) {
		
		
	}
	
	
	for(var i=0, il=toggleNames.length; i<il; i++) {
		var toggleName = toggleNames[i],
			toggleId = createToggle(toggleName),
			toggleDefaultSetting = {checked: true},
			toggleSetting = AppSettings.getValue(toggleId, toggleDefaultSetting);
			
	
		setToggle(toggleId, toggleSetting);
	}
	
}


sofia.menuComponents.push('ConfigToggles');




var ConfigAddIns = function(node) {
	var base = $('#main-config-box'),
		main = $('<div class="config-section">' + 
					'<span class="config-header">Add Ons</span>' + 
					'<div class="config-body" id="config-addons"></div>' +
				'</div>').appendTo(base);
}


sofia.menuComponents.push('ConfigAddIns');
