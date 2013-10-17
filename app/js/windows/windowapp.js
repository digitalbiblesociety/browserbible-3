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
				{type: 'MapsWindow', data: {'latitude': -34.397, 'longitude': 150.644}}
			]
		},
		settings = AppSettings.getValue(settingsKey, defaultSettings);
		
	
	// TEMP
	settings = defaultSettings;
	
	// create windows
	for (var i=0, il=settings.windows.length; i<il; i++) {
		var windowSetting = settings.windows[i];
		//console.log('creating', windowSetting);
		windowManager.add(windowSetting.type, windowSetting.data);	
	}
	
	windowManager.on('settingschange', function(e) {
		var settings = {
			windows: e.data.settings
		};
		
		document.title = e.data.active.fragmentid;
		
		console.log('appsettings', settings);
		
		//AppSettings.setValue(settingsKey, settings);
	});
	
		
	// dummy
	//windowManager.add('TextScrollerWindow', {'textid':'eng_kjv','sectionid':'JN1','fragmentid':'JN1_10'});	
	//windowManager.add('TextScrollerWindow', {'textid':'eng_kjv','sectionid':'GN1','fragmentid':'GN1_10'});		
	//windowManager.add('MapsWindow', {'data':'stuff'});
	
	return this;	
}

$(function() {
	app = new App();
});