
var WindowManager = function(node) {

	var windows = [];


	function addWindow(className, data) {

		var id = 'win' + (new Date()).getTime().toString();

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
	function removeWindow(id) {


		// find window
		var windowsToClose = windows.filter(function(win) {
				return win.id == id;
			}),
			windowToClose = (windowsToClose.length == 1) ? windowsToClose[0] : null;

		if (windowToClose == null) {
			console.log('ERROR', "Can't find window", id);
			return;
		}

		// remove from array
		windows = windows.filter(function(win) {
			return win.id != id;
		});

		PlaceKeeper.storePlace();

		// remove from DOM, run delete functions
		windowToClose.close();
		windowToClose = null;

		// resize and reset
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

		//console.log('manage resize', windows.length);

		if (windows.length > 0) {

			if (width < 460) {

				windows[0].size(width, height);

			} else {

				var windowWidth = Math.floor(width/windows.length),
					firstMarginLeft = parseInt(windows[0].node.css('margin-left'), 10),
					firstMarginRight =parseInt(windows[0].node.css('margin-right'), 10);


				if (!isNaN(firstMarginLeft)) {
					windowWidth = windowWidth - firstMarginLeft;
				}
				if (!isNaN(firstMarginRight)) {
					windowWidth = windowWidth - firstMarginRight;
				}

				for (var i=0, il=windows.length; i<il; i++) {
					windows[i].size(windowWidth, height);
				}
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
		getWindows: function() { return windows; }
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


						manager.remove(id);
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
		controller = null;

		ext.clearListeners();

		node.remove();
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

	// receive from App, send down to controller
	ext.on('message', function(e) {
		controller.trigger('message', e);
	});

	return ext;
};
