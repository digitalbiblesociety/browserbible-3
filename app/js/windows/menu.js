
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
				
				$.ajax({
					url: sofia.config.aboutPageUrl,
					dataType: 'html',
					success: function(data) {
						aboutWindow.body.removeClass('loading-indicator');
						
						isAboutLoaded = true;
												
						aboutWindow.body.html(data);
					
					}
					
				});
				
			}
			
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
			
		textid = firstBibleWindow.data.textid;		
		sofia.app.windowManager.add('SearchWindow', {searchtext: searchtext, textid: textid});
			
		PlaceKeeper.restorePlace();

		
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
	
		e.preventDefault();
	
		if (buttonMenu.is(':visible')) {
			buttonMenu.hide();
			$(document).off('click', docClick);			
		} else {
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
	

	var windowTools = [
		{type: 'BibleWindow', label: 'Bible', data: {'textid':sofia.config.newBibleWindowVersion,'fragmentid':sofia.config.newBibleWindowVerse}}
	];

	if (typeof sofia.config.newCommentaryWindowTextId != 'undefined') {
		windowTools.push(	
			{type: 'CommentaryWindow', label: 'Commentary', data: {'textid':sofia.config.newCommentaryWindowTextId,'fragmentid':''}}
		);
	}
	
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
			
		// when starting a bible or commentary window, try to match it up with the others
		if (settings.type == 'BibleWindow' || settings.type == 'CommentaryWindow') {
			
			// get location from ifrst window
			var 
				firstBCWindow = (sofia.app.windowManager) ? 
									sofia.app.windowManager.windows.filter(function(w) { return w.className == 'BibleWindow' || w.className == 'CommentaryWindow'})[0] : 
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
					
		mobileConfigButton = $('<div id="mobile-config-button" class="mobile-menu-button" style=""></div>')
					.appendTo( $('body'))
					.on('click', buttonClick),
					
		configMenu = $('<div id="main-config-box" class="window-overlay">' + 

						'<div class="config-section" id="config-type">' + 
							'<span class="config-header">Font</span>' + 
							'<div class="config-body"></div>' +
							'<div class="clear"></div>' +	
						'</div>' + 
						'<div class="config-section" id="config-toggles">' + 
							'<span class="config-header">Settings</span>' + 
							'<div class="config-body"></div>' +
							'<div class="clear"></div>' +	
						'</div>' + 						
						'<div class="config-section" id="config-tools">' + 
							'<span class="config-header">Tools</span>' + 
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
	
	console.log(fullScreenApi);
	
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






var FontSizeSettings = function(node) {
	var 
		body = $('#config-type .config-body'),
		fontSizes = [14,16,18,20,22,24,26,28],
		defaultFontSize = {"fontSize": 18},
		fontSizeKey = 'config-font-size',
		fontSizeSetting = AppSettings.getValue(fontSizeKey, defaultFontSize);
	
	$('<table id="font-size-table"><tr><td><span style="font-size:' + fontSizes[0] + 'px">A</span><td style="width:100%"></td><td><span style="font-size:' + fontSizes[fontSizes.length-1] + 'px">A</span></td></tr></table>')
		.appendTo(body);
	
	$('<div class="font-slider"></div>')
		.appendTo(body.find('td:eq(1)') )
		.slider({
			value: fontSizeSetting.fontSize,
			min: fontSizes[0],
			max: fontSizes[fontSizes.length-1],
			step: 2,			
			slide: function( event, ui ) {
				setFontSize(ui.value);
			}						
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



var ConfigToggles = function(node) {
	var body = $('#config-toggles .config-body'),
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
		
		//console.log('createToggle', toggleSetting);
					
		toggle
			.find('input')
				.on('click', function() {
					var cb = $(this),
						checked = cb.is(':checked'),
						value = cb.val();
						
					setToggle(value, checked); // .toString().toLowerCase() );
						
				});

		setToggle(toggleId, toggleSetting.checked);
		
	}
	
	function setToggle(toggleId, checked) {
		
		//console.log('setToggle', toggleId, checked);
		
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
		sofia.globals.createToggle(toggleName);
	}
	
};


sofia.menuComponents.push('ConfigToggles');


var ConfigUrl = function(node) {
	var body = $('#config-tools .config-body'),
		urlBox = 
		$('<div id="config-global-url">' + 
				//'<span class="config-header">URL</span>' + 
				'<span ></span>' +
				'<input type="text"  />' +
			'</div>'),
		linkButton = urlBox.find('span');
		urlInput = urlBox.find('input');
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
	
	
	ZeroClipboard.config( { moviePath: 'build/ZeroClipboard.swf' } );
	var client = new ZeroClipboard(linkButton);	
	client.on( 'dataRequested', function (client, args) {
		client.setText( urlInput.val() );
		
		urlInput.select();		
	});	
	
	
	linkButton.on('click', function() {
		urlInput.select();		
	});
	
	
	function updateUrl() {
			// get settings from al windows
		var windowSettings = sofia.app.windowManager.getSettings(),
			existingParams = stringUtility.parseQuerystring();
			newParams = {},
			mergedParams = {},
			mergedArray = [];
			
		for (var i=0, il=windowSettings.length; i<il; i++) {
			var winSettings = windowSettings[i];
			
			if (winSettings.data == null) {
				continue;
			}
			
			//console.log('setting', i, winSettings);
			
			switch (winSettings.windowType) {
				case 'BibleWindow':
					newParams['win' + (i+1)] = 'bible';
					newParams['textid' + (i+1)] =  winSettings.data.textid;
					newParams['fragmentid' + (i+1)] = winSettings.data.fragmentid;
					break;
				case 'CommentaryWindow':
					newParams['win' + (i+1)] = 'commentary';
					newParams['textid' + (i+1)] =  winSettings.data.textid;
					newParams['fragmentid' + (i+1)] = winSettings.data.fragmentid;
					break;
				case 'SearchWindow':
					newParams['win' + (i+1)] = 'search';
					newParams['textid' + (i+1)] =  winSettings.data.textid;
					newParams['searchtext' + (i+1)] = winSettings.data.searchtext;
					break;
				case 'MapsWindow':
					newParams['win' + (i+1)] = 'map';
					break;									
				case 'MediaWindow':
					newParams['win' + (i+1)] =  'media';
					break;									
				
			}			
		}
		
		mergedParams = $.extend(mergedParams, existingParams, newParams); 
		
		for (var index in mergedParams) {
			if (index != '') {
				mergedArray.push( index + '=' + mergedParams[index] );			
			}
		}
		//mergedArray.reverse();
		
		url = location.origin + location.pathname + '?' + mergedArray.join('&');
			
		urlInput.val(url);
			
		//console.log('URL', windowSettings, parts);
	}

	
	
	//base.height('300px');
};

sofia.menuComponents.push('ConfigUrl');


var PlaceKeeper = (function() {
	
	var currentWindow = null,
		currentData = null;
		
	function storePlace() {
		currentWindow = (sofia.app.windowManager) ? 
							sofia.app.windowManager.windows.filter(function(w) { return w.className == 'BibleWindow'})[0] : 
							null;
		
		currentData = (currentWindow != null) ? currentWindow.getData() : null;
	
	}
	
	function restorePlace() {
		if (currentWindow != null) { 
			// 
			//firstWindow.trigger('message', {type:'globalmessage', messagetype: 'nav', })
			
			currentWindow.trigger('globalmessage', {
				type: 'globalmessage', 
				target: currentWindow, 
				data: {
					messagetype: 'nav', 
					type: 'bible',
					locationInfo: currentData // firstWindow.getData()
				}
			});			
		}			
		
	}
	
	
	return {
		storePlace: storePlace,
		restorePlace: restorePlace		
	}
	
	
})();