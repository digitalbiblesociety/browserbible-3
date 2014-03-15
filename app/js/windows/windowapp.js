
var App = function() {
		
	// create nodes
	var	win = $(window),
		body = $(document.body),
		container = $('<div class="windows-container"></div>').appendTo(body),
		header = $('<div class="windows-header"></div>').appendTo(container),
		main = $('<div class="windows-main"></div>').appendTo(container),
		footer = $('<div class="windows-footer"></div>').appendTo(container),		
		ext = {};
		
	
	function init() {
		
		var mainMenu = new MainMenu(header);	
		
		// create objects
		var windowManager = new WindowManager(main);	
		
		ext.windowManager = windowManager;
			
		// combine nodes and objects
		win.on('resize', resize);
		win.on('orientationchange', resize);
		resize();	
		
		
		var settings = getWindowSettings(),
			windowWidth = win.width();
		//console.log('settings',settings, settings.length);
		
		if (windowWidth < 768 && settings.windows.length >= 3) {
			settings.windows = settings.windows.slice(0,2);
		}			
		if (windowWidth < 480 && settings.windows.length >= 2) {
			settings.windows = settings.windows.slice(0,1);			
		}			
		
		// create windows
		for (var i=0, il=settings.windows.length; i<il; i++) {
			var setting = settings.windows[i],
				windowType = setting.windowType;
				
			if (!setting.windowType) {
				
				switch (setting.type) {
					case 'bible':
						windowType = 'BibleWindow';
						break;
					case 'commentary':
						windowType = 'CommentaryWindow';
						break;
					case 'map':
						windowType = 'MapsWindow';
						break;
					case 'search':
						windowType = 'SearchWindow'; 
						break;	
					case 'media':
						windowType = 'MediaWindow'; 
						break;								
					default:
						windowType = setting.type; 
					
				}
			}
	
			// create window
			//console.log('create',i, windowType, setting.data);
			windowManager.add(windowType, setting.data);	
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
		////console.log('app resize');
	
		PlaceKeeper.storePlace();
	
		// get window size
		var width = win.width(),
			height = win.height(),
			
			// calculate size
			areaHeight = height - header.outerHeight() + footer.outerHeight(),
			areaWidth = width - parseInt(main.css('margin-left'), 10) - parseInt(main.css('margin-right'), 10);

		if (width < 410) {
			header.hide();
			areaHeight = height;
		} else {
			header.show();
		}

		// set height
		main.height(areaHeight);	
		main.width(areaWidth);
		
		// pass new size down to area
		ext.windowManager.size(areaWidth, areaHeight);
		
		
		PlaceKeeper.restorePlace();
	}	

	
	var settingsKey = 'app-windows';
		
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
	
	
	function storeSettings() {
	
			// get settings from al windows
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
						
		for (var i=0, il=ext.windowManager.windows.length; i<il; i++) {
			var w = ext.windowManager.windows[i];
		 	
			if (w.id != e.id) {
		 		// pass message down
		 		w.trigger('message', e);
			}
		}				
		 
		// plugins
		for (var i=0, il=ext.plugins.length; i<il; i++) {
			var p = sofia.app.plugins[i];
		 	
			if (p.trigger) {
				// pass message down
				p.trigger('message', e);
			}
		}		
		
	}	
	
	ext.init = init;
	ext.handleGlobalMessage = handleGlobalMessage;
	
	return ext;	
};