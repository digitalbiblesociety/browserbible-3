
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
	
		// (1) get default settings
		var settings = {
			windows: sofia.config.windows
		};
		
		// (2) replace defaults with user settings
		settings = AppSettings.getValue(settingsKey, settings);
		
		// (3) overwrite with QueryString when present
		var queryData = stringUtility.parseQuerystring();
		if (queryData["win1"]) {
		
			var tempSettings = [];
	
			for (var i=1; i<=4; i++) {
				var winType = queryData["win" + i.toString()],
					setting = {
						type: winType,
						data: {}
					};
									
				if (typeof winType != 'undefined') {
					// go though all querystring values, and anything that ends with '1' goes with this data
					for (var q in queryData) {
						var key = q.substring(0, q.length-1),
							number = q.substring(q.length-1),
							value = queryData[q];
					
						if (key != 'win' && number == i.toString()) {
							setting.data[key] = value;
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
	
	var settings = getWindowSettings();
	console.log('settings',settings, settings.length);	
	
	// create windows
	for (var i=0, il=settings.windows.length; i<il; i++) {
		var setting = settings.windows[i],
			windowType = setting.windowType;
			
		if (!setting.windowType) {
			
			switch (setting.type) {
				case 'bible':
					windowType = 'TextWindow';
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
		}

		// create window
		console.log('create',i, windowType, setting.data);
		windowManager.add(windowType, setting.data);	
	}	
	
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
};

$(function() {
	sofia.app = new App();
});