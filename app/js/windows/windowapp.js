var App = function() {
		
	// create nodes
	var	win = $(window),
		body = $(document.body),
		header = $('<div class="windows-header"></div>').appendTo(body),
		main = $('<div class="windows-main"></div>').appendTo(body),
		footer = $('<div class="windows-footer"></div>').appendTo(body);				
		
		
		
	function resize() {
		// get window size
		var width = win.width(),
			height = win.height(),
			
			// calculate size
			areaHeight = height - header.outerHeight() - footer.outerHeight();

		// set height
		main.height(areaHeight);	
		
		// pass new size down to area
		windowManager.size(width, areaHeight);
	}		
	
	// create objects
	var windowManager = new WindowManager(main);	
		
	// combine nodes and objects
	win.on('resize', resize);
	resize();	
	
	var settingsKey = 'windowapp'
		defaultSettings = {
			windows: [
				{type: 'ScrollerWindow', data: {'textid':'eng_kjv','sectionid':'JN1','fragmentid':'JN1_10'}},
				{type: 'ScrollerWindow', data: {'textid':'eng_web','sectionid':'GN1','fragmentid':'GN1_10'}},
				{type: 'SearchWindow', data: {textid: 'eng_kjv', searchString: 'truth love'}},
				{type: 'MapsWindow', data: {'latitude': 31.7833 /*-34.397*/, 'longitude': 35.2167 /*150.644*/}}				
			]
		},
		settings = AppSettings.getValue(settingsKey, defaultSettings);
	
	//console.log('startup settings', settings);	
	
	// TEMP
	//settings = defaultSettings;
	
	// create windows
	for (var i=0, il=settings.windows.length; i<il; i++) {
		var windowSetting = settings.windows[i];
		windowManager.add(windowSetting.type, windowSetting.data);	
	}
	
	function storeSettings() {
	
			// get settings from al windows
		var windowSettings = windowManager.getSettings(),		
			// later we'll need these
			headerSettings = {},
			settings = {
				windows: windowSettings
			};	
			
		console.log('storeSettings', settings);
		
		// store
		AppSettings.setValue(settingsKey, settings );
	}
	
	var settingsTimer = new Timer(storeSettings, 1000);
	
	windowManager.on('settingschange', function(e) {
		
		// title to show active window's position
		if (e.data && e.data.label) {
			document.title = e.data.label;
		}
		
		settingsTimer.start();		
		
	});
	
	return this;	
}

$(function() {
	app = new App();
});