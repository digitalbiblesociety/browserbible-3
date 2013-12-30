
var App = function() {
		
	// create nodes
	var	win = $(window),
		body = $(document.body),
		header = $('<div class="windows-header"></div>').appendTo(body),
		main = $('<div class="windows-main"></div>').appendTo(body),
		footer = $('<div class="windows-footer"></div>').appendTo(body),
		
		floatingHeader = false;
	
	if (floatingHeader) {
		var width = win.width(),
			css = {
				position: 'absolute',
				zIndex: 100,
				top: 0,
				left: 0,
				width: width + 'px'
			}
		header.css(css).hide();		
		
		css.top = undefined;
		css.bottom = 0;			
		
		footer.css(css).hide();
		
		setTimeout(function()  {
			header.slideDown();
		}, 1000);
	}
	
	
		
	function resize() {
		//console.log('app resize');
	
		// get window size
		var width = win.width(),
			height = win.height(),
			
			// calculate size
			areaHeight = height - (floatingHeader ? 0 : header.outerHeight() + footer.outerHeight()),
			areaWidth = width - parseInt(main.css('margin-left'), 10) - parseInt(main.css('margin-right'), 10);

		// set height
		main.height(areaHeight);	
		main.width(areaWidth);
		
		// pass new size down to area
		windowManager.size(areaWidth, areaHeight);
	}	
	
	var mainMenu = new MainMenu(header);	
	
	// create objects
	var windowManager = new WindowManager(main);	
	this.windowManager = windowManager;
		
	// combine nodes and objects
	win.on('resize', resize);
	resize();
	
	
	var settingsKey = 'windowapp-13-12-29'
	
	function getWindowSettings() {
		
		// ORDER
		// 1. QueryString
		// 2. Cookie/localStorage
		// 3. Default
		
		var windowsData = [];
			
		// try querysring
		var queryData = stringUtility.parseQuerystring();

		for (var i=1; i<=4; i++) {
			var winType = queryData["win" + i.toString()],
				winData = queryData["data" + i.toString()];
				
			if (typeof winType != 'undefined' && typeof winData != 'undefined') {
				windowsData.push({
					type: winType,
					data: winData
				});
			}				
		}
		
		// return querystring data
		if (windowsData.length > 0) {
			return windowsData;
			
		} else {
			
			// get defaults from config
			windowsData = sofia.config.windows;			
			
			//windowsData = AppSettings.getValue(settingsKey, windowsData);
			
		}
		
		return windowsData;
	}
	
	var settings = getWindowSettings();
	console.log('settings',settings, settings.length);	
	
	// create windows
	for (var i=0, il=settings.length; i<il; i++) {
		var setting = settings[i],
			windowType = '';
		
		switch (setting.type) {
			case 'bible':
				windowType = 'ScrollerWindow';
				break;
			case 'map':
				windowType = 'MapsWindow';
				break;
			case 'search':
				windowType = 'SearchWindow'; 
				break;			
			default:
				windowType = setting.type; 
			
		}

		// create window
		console.log('create',i, windowType, setting.data);
		windowManager.add(windowType, setting.data);	
	}	

	
	/*
	var settingsKey = 'windowapp-11-24'
		defaultSettings = {
			windows: [
				{type: 'ScrollerWindow', data: {'textid':'eng_kjv','sectionid':'JN1','fragmentid':'JN1_10'}},
				//{type: 'ScrollerWindow', data: {'textid':'gre_tisch','sectionid':'JN1','fragmentid':'JN1_10'}},
				{type: 'SearchWindow', data: {textid: 'eng_web', searchString: 'truth love'}},
				{type: 'MapsWindow', data: {'latitude': 31.7833, 'longitude': 35.2167}}				
			]
		},
		settings = AppSettings.getValue(settingsKey, defaultSettings);
	
	console.log('startup settings', settings);	
	// create windows
	for (var i=0, il=settings.windows.length; i<il; i++) {
		var windowSetting = settings.windows[i];
		windowManager.add(windowSetting.type, windowSetting.data);	
	}	
	*/
	
	

	
	function storeSettings() {
	
			// get settings from al windows
		var windowSettings = windowManager.getSettings(),		
			// later we'll need these
			headerSettings = {},
			settings = {
				windows: windowSettings
			};	
			
		//console.log('storeSettings', settings);
		
		// store
		AppSettings.setValue(settingsKey, settings );
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
	this.plugins = plugins;
	// run plugins
	for (var x in sofia.plugins) {
		plugin = new window[ sofia.plugins[x] ](this);		
		plugins.push(plugin);
	}
	
	return this;	
}

$(function() {
	sofia.app = new App();
});