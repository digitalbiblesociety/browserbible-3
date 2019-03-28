
var WindowManager = function(node, app) {

	var windows = [];

	function addWindow(className, data) {

		var id = 'win' + (new Date()).getTime().toString();

		if (className == 'TextWindow') className = 'BibleWindow';
		if (typeof window[className] == 'undefined') return;

		// create window and add to array
		var win = new Window(id, node, className, data, ext);
		windows.push(win);

		setTimeout(function() {
			app.resize();
		},10);
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
		//size();
		PlaceKeeper.restorePlace();

		windows[0].tab.addClass('active');
		windows[0].node.addClass('active');

		setTimeout(function() {
			app.resize();
		},10);


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

		var sizeThreshold = 560;

		if (width < sizeThreshold) {
			$('body').addClass('compact-ui');
		} else {
			$('body').removeClass('compact-ui');
		}


		if (windows.length > 0) {

			if (width < sizeThreshold) {

				var tabWidth = windows[0].tab.outerWidth()-10;

				// resize all windows to the same
				for (var i=0, il=windows.length; i<il; i++) {
					windows[i].size(width, height);
					windows[i].tab.css({right: ((il-i-1) * tabWidth) +'px'});
				}

			} else {

				//$('body').removeClass('compact-ui');

				// all windows to a percent of the width

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

	var ext = {},
		node = $('<div class="window ' + className + ' active"></div>')
					.appendTo(parentNode),
		closeBtn = $('<div class="close-container"><span class="close-button"><svg class="icon"><use xlink:href="' + sofia.config.icons + '#close-button"></use></svg></span></div>')
					.appendTo(node)
					.find('.close-button')
					.on('click', function() {
						console.log(id, 'remove', manager);


						manager.remove(id);
					}),
		tab = $('<div class="window-tab ' + className + ' active">' +
					'<div class="window-tab-inner">' +
						'<span class="window-tab-label ' + className + '-tab">' + className + '</span>' +
					'</div>' +
				'</div>')
					.appendTo( $('body') );

	// make sure this one is selected
	node.siblings('.window').removeClass('active');
	tab.siblings('.window-tab').removeClass('active');

	ext.id = id;
	ext.className = className;
	ext.node = node;
	ext.tab = tab;

	var controller = new window[className](id, ext, data);
	ext.controller = controller;

	// send settings up to the manager, up to the app
	controller.on('settingschange', function(e) {
		ext.trigger('settingschange', e); // {type: e.type, target: this, data: e.data});
	});
	controller.on('globalmessage', function(e) {
		e.id = id;
		ext.trigger('globalmessage', e); // {type: e.type, target: this, data: e.data});
	});


	// send focus/blur events down to controller
	node.on('mouseenter touchstart', function(e) {
		controller.trigger('focus', {});
		node
			.addClass('focused')
			.siblings()
				.removeClass('focused')
				.trigger('windowblur');
	});
	node.on('mouseleave windowblur', function(e) {
		node
			.removeClass('focused')		
		
		controller.trigger('blur', {});
	});

	tab.on('click', function(e) {
		// dectivate all other tabs and windows
		$('.window, .window-tab').removeClass('active');

		tab.addClass('active');
		node.addClass('active');
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

		if (typeof controller.close != 'undefined') {
			controller.close();
		}
		controller = null;

		ext.clearListeners();

		tab.remove();
		node.remove();
	}


	ext.size = size;
	ext.quit = quit;
	ext.getData =  function() {
			return controller.getData();
	};
	ext.close =  close;

	ext = $.extend(true, ext, EventEmitter);

	// receive from App, send down to controller
	ext.on('message', function(e) {
		controller.trigger('message', e);

		if (e.data.labelTab) {
			tab.find('span').html( e.data.labelTab );
		}
	});
	

	// when a window reports a settings change
	ext.on('settingschange', function(e) {

		// pass up to root
		manager.trigger('settingschange', e);
	});

	ext.on('globalmessage', sofia.app.handleGlobalMessage);	

	return ext;
};
