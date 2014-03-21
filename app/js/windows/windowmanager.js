
var WindowManager = function(node) {
	
	var windows = [];
	
	
	function addWindow(className, data) {
	
		var id = 'win' + (windows.length+1);
		
		if (className == 'TextWindow') {
			className = 'BibleWindow';
		}
		
		// test for classname
		if (typeof window[className] == 'undefined')
			return;
	
		// create window and add to array
		var win = new Window(id, node, className, data, ext);
		windows.push(win);
		
		// when a window reports a settings change
		win.on('settingschange', function(e) {
			
			// pass up to root
			ext.trigger('settingschange', e);			
		});
		
		win.on('globalmessage', sofia.app.handleGlobalMessage);
		
		size();
	}
	function removeWindow(window_to_close) {
	
		var windowIndex = -1;
		
		for (var i=0, il=windows.length; i<il; i++) {
			var win = windows[i];
			
			if (win.id == window_to_close.id) {
				
				windowIndex = i				
				break;
			}
		}
		
		// remove this window from the array
		windows.splice(windowIndex, 1);
		
		window_to_close.close();
		
		PlaceKeeper.storePlace();
		
		// remove from DOM		
		window_to_close.node.remove();
		
		// resize
		size();

		PlaceKeeper.restorePlace();
		
		// trigger save
		ext.trigger('settingschange', {type: 'settingschange', target: this, data: null});
	}
	
	function size(width, height) {
		// set container size
		if (width && height) {
			node.width(width)
				.height(height);	
		} else {
			width = node.width();
			height = node.height();			
		}
			
			
		if (windows.length > 0) {
			var windowWidth = Math.floor(width/windows.length) 
									- parseInt(windows[0].node.css('margin-left'), 10)
									- parseInt(windows[0].node.css('margin-right'), 10);		
		
			for (var i=0, il=windows.length; i<il; i++) {
				windows[i].size(windowWidth, height);
			}
		}
		
		if (windows.length == 1) {
			$('body').addClass('one-window')
		} else {
			$('body').removeClass('one-window')
		}
	}
	
	function getSettings() {
		var settingsForAllWindows = [];
		
		for (var i=0, il=windows.length; i<il; i++) {
			settingsForAllWindows.push({
				'windowType': windows[i].className, 
				'data': windows[i].getData()
			});
		}	
		
		return settingsForAllWindows;
	}
	
	var ext = {
		add: addWindow,
		remove: removeWindow,
		size: size,
		getSettings: getSettings,
		windows: windows
	};
	
	ext = $.extend(true, ext, EventEmitter);
	
	return ext;
};

var Window = function(id, parentNode, className, data, manager) {
	
	var node = $('<div class="window ' + className + '"></div>')
					.appendTo(parentNode),
		closeBtn = $('<span class="window-close-button"></span>')
					.appendTo(node)			
					.on('click', function() {
						console.log(id, 'remove', manager);
						
						
						manager.remove(ext);
					});
					
	var controller = new window[className](id, node, data);
	
	// send settings up to the manager, up to the app
	controller.on('settingschange', function(e) {
		ext.trigger('settingschange', e); // {type: e.type, target: this, data: e.data});
	});
	controller.on('globalmessage', function(e) {
		e.id = id;
		ext.trigger('globalmessage', e); // {type: e.type, target: this, data: e.data});
	});	
	
	
	// send focus/blur events down to controller
	node.on('mouseenter', function(e) {
		controller.trigger('focus', {});
	});				
	node.on('mouseleave', function(e) {
		controller.trigger('blur', {});
	});			
	
	function size(width, height) {
		node.outerWidth(width)
			.outerHeight(height);
		
		controller.size(width, height);
	}
	
	function quit() {
		controller.quit();
	}
	
	function close() {
		console.log('window.close', controller.close);
		if (typeof controller.close != 'undefined') {
			controller.close();
		}
	}	

	var ext = {
		size: size,
		quit: quit,
		id: id,
		className: className,
		getData: function() {
			return controller.getData();
		},
		controller: controller,
		node: node,
		close: close
	};
	ext = $.extend(true, ext, EventEmitter);
	
	// recieve from App, send down to controller
	ext.on('message', function(e) {
		controller.trigger('message', e);
	});
		
	return ext;
};