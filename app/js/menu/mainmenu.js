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
		mainMenuButton = $('<div id="main-menu-button" class="image-logo"></div>')
					.appendTo(node)
					.on('click', mainMenuClick),
		mainMenuDropDown = $('<div id="main-menu-dropdown">' + 
								'<div class="main-menu-heading">Add Window</div>' +
								'<div id="main-menu-windows-list" class="main-menu-list"></div>' +
								'<div class="main-menu-heading">Settings</div>' +
								'<div id="main-menu-features" class="main-menu-list"></div>' +								
							'</div>')
							.appendTo( body )
							.hide();


	function mainMenuClick(e) {

		e.preventDefault();

		if (mainMenuDropDown.is(':visible')) {
			
			mainMenuButton.removeClass('active');
			mainMenuDropDown.hide();

			$(document).off('click', docClick);			
			
		} else {
			$('.window-overlay').hide();

			mainMenuButton.addClass('active');			
			mainMenuDropDown.show();
			
			setTimeout(function() {
				$(document).on('click', docClick);
			},50);
		}

		return false;
	}

	function docClick(e) {

		if ($(e.target).closest('#add-button-box').length == 0) { // } && $(e.target).closest('#main-add-button').length == 0) {

			mainMenuDropDown.hide();
			mainMenuButton.removeClass('active');			

			$(document).off('click', docClick);
		}
	}
}


sofia.menuComponents.push('MainMenuButton');