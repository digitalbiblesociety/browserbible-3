var MainMenu = function(node) {

	// simply create all 'menuComponents' define below
	for (var i=0, il=sofia.menuComponents.length; i<il; i++) {
		var component = new window[sofia.menuComponents[i]](node);
	}

	var ext = {

	};

	ext = $.extend(true, ext, EventEmitter);
	return ext;

};


var MainMenuButton = function(node) {
	var
		body = $(document.body),
		win = $(window),

		container = $('.windows-container'),
		mainMenuLogo = $('<div id="app-logo"></div>')
					.appendTo(node),
		mainMenuButton = $('<div id="main-menu-button"></div>')
					.appendTo(node)
					.on('click', mainMenuClick),
		mainMenuDropDown = $('<div id="main-menu-dropdown">' +
								'<div class="main-menu-heading i18n" data-i18n="[html]menu.labels.addwindow">Add Window</div>' +
								'<div id="main-menu-windows-list" class="main-menu-list"></div>' +
								'<div class="main-menu-heading i18n" data-i18n="[html]menu.labels.options"></div>' +
								'<div id="main-menu-features" class="main-menu-list"></div>' +
							'</div>')
							.appendTo( body )
							.hide();


	function mainMenuClick(e) {

		if (mainMenuDropDown.is(':visible')) {
			hide();
		} else {
			show();
		}
	}

	function show() {
		mainMenuButton.addClass('active');
		mainMenuDropDown.show();
		ext.onshow();
	}

	function hide() {
		mainMenuButton.removeClass('active');
		mainMenuDropDown.hide();
		ext.onhide();
	}

	mainMenuDropDown.on('click', '.main-menu-item', function() {
		hide();
	});


	var ext = {};
	ext = $.extend(true, ext, EventEmitter);
	ext = $.extend(true, ext, ClickOff);
	ext.clickoffid = 'version picker';
	ext.on('offclick', function() {
		hide();
	});
	ext.setClickTargets([mainMenuButton, mainMenuDropDown]);

	return ext;

}


sofia.menuComponents.push('MainMenuButton');
