
var WindowManager = function(node, app) {
	
	var windows = []
	
	
	function addWindow(className, data) {
	
		var id = 'win' + (windows.length+1);
		
		// test for classname
		if (typeof window[className] == 'undefined')
			return;
	
		// create window and add to array
		var win = new Window(id, node, className, data, ext);
		windows.push(win);
		
		// when a window reports a settings change
		win.on('settingschange', function() {
			 
			 // get all windows settings, bubble up
			 var settingsForAllWindows = [];
			 
			 for (var i=0, il=windows.length; i<il; i++) {
			 	settingsForAllWindows.push({
			 		'type': className, 
			 		data: windows[i].getData()
			 	});
			 }
			 
			 ext.trigger('settingschange', settingsForAllWindows);
			
		});
		
		win.on('globalmessage', function(message) {
			// give to other windows

			 for (var i=0, il=windows.length; i<il; i++) {
			 	window = windows[i];
			 	
			 	if (window.id != id) {
			 		// pass message down
			 		window.trigger('globalmessage', message);
			 	}
			 }				
		});
		
		size();
	}
	function removeWindow(index) {
		var window = windows[index];
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
			
		var windowWidth = Math.floor(width/windows.length);		
	
		for (var i=0, il=windows.length; i<il; i++) {
			windows[i].size(windowWidth, height);
		}
	}
	
	var ext = {
		add: addWindow,
		remove: removeWindow,
		size: size
	};
	
	ext = $.extend(true, ext, EventEmitter);
	
	return ext;
}

var Window = function(id, parentNode, className, data, manager) {
	
	var node = $('<div class="window"></div>')
					.appendTo(parentNode);
					
	var controller = new window[className](id, node, data);
	
	// send settings up to th Manager, up to the app
	controller.on('settingschange', function() {
		ext.trigger('settingschange');
	});
	controller.on('sendmessage', function(data) {
		ext.trigger('sendmessage', data);
	});	
	
	function size(width, height) {
		node.outerWidth(width)
			.outerHeight(height);
		
		controller.size(width, height);
	}
	
	function quit() {
		controller.quit();
	}

	var ext = {
		size: size,
		quit: quit,
		id: id,
		getData: function() {
			return controller.getData();
		}
	};
	
	ext = $.extend(ext, EventEmitter);
	
	ext.on('globalmessage', function(message) {
		controller.trigger('globalmessage', message);
	});
		
	return ext;
}