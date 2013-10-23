
var WindowManager = function(node) {
	
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
		win.on('settingschange', function(e) {
			
			// pass up to root
			ext.trigger('settingschange', e);			
		});
		
		win.on('globalmessage', function(e) {
			// give to other windows
			

			 for (var i=0, il=windows.length; i<il; i++) {
			 	w = windows[i];
			 	
			 	if (w.id != id) {
			 		// pass message down
			 		w.sendMessage(e.data);
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
	
	function getSettings() {
		var settingsForAllWindows = [];
		
		for (var i=0, il=windows.length; i<il; i++) {
			settingsForAllWindows.push({
				'type': windows[i].className, 
				data: windows[i].getData()
			});
		}	
		
		return settingsForAllWindows;
	}
	
	var ext = {
		add: addWindow,
		remove: removeWindow,
		size: size,
		getSettings: getSettings
	};
	
	ext = $.extend(true, ext, EventEmitter);
	
	return ext;
}

var Window = function(id, parentNode, className, data, manager) {
	
	var node = $('<div class="window"></div>')
					.appendTo(parentNode);
					
	var controller = new window[className](id, node, data);
	
	// send settings up to th Manager, up to the app
	controller.on('settingschange', function(e) {
		// console.log(id, 'win settingschange');
		ext.trigger('settingschange', e); // {type: e.type, target: this, data: e.data});
	});
	controller.on('globalmessage', function(e) {
		ext.trigger('globalmessage', e); // {type: e.type, target: this, data: e.data});
	});	
	
	function size(width, height) {
		node.outerWidth(width)
			.outerHeight(height);
		
		controller.size(width, height);
	}
	
	function quit() {
		controller.quit();
	}
	
	function sendMessage(data) {
		if (typeof controller.sendMessage != 'undefined') {
			controller.sendMessage(data);
		} else {
			console.log(className, 'NO sendMessage');	
		}	
	}

	var ext = {
		size: size,
		quit: quit,
		id: id,
		className: className,
		sendMessage: sendMessage,
		getData: function() {
			return controller.getData();
		},
		controller: controller
	};
	
	ext = $.extend(true, ext, EventEmitter);
	
		
	return ext;
}