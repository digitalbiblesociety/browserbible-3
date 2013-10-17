/*
var Window = function(parentNode) {
	this.parentNode = parentNode;
	this.node = $('<div class="window"></div>')
					.appendTo(parentNode);	
};
Window.prototype = {
	size: function(width, height) {
		
	}
}
*/


var WindowManager = function(node, app) {
	
	var windows = [];
	
	
	function addWindow(className, data) {
	
		var id = 'win' + (windows.length+1);
	
		var win = new Window(id, node, className, data);
		windows.push(win);
		
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

var Window = function(id, parentNode, className, data) {
	
	var node = $('<div class="window"></div>')
					.appendTo(parentNode);
					
	var controller = new window[className](id, node);
	
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
		quit: quit
	};
	
	ext = $.extend(ext, EventEmitter);
		
	return ext;
}