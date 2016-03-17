
var ConfigButton = function(node) {
	var

		container = $('.windows-container'),
		body = $(document.body),
		win = $(window),

		configButton = $('<div class="main-menu-item image-config i18n" data-i18n="[html]menu.labels.settings"></div>')
					.appendTo( $('#main-menu-features') )
					.on('click', buttonClick),

		modalOverlay = $('<div class="modal-overlay"></div>')
							.appendTo( body )
							.hide(),

		configWindow = new MovableWindow(300, 380, i18n.t('menu.labels.settings'), 'config-window');

		configWindow.body.html(
					'<div id="main-config-box">' +
						'<div class="config-section" id="config-type">' +
							'<span class="config-header i18n" data-i18n="[html]menu.config.font"></span>' +
							'<div class="config-body"></div>' +
							'<div class="clear"></div>' +
						'</div>' +
						/*
						'<div class="config-section" id="config-toggles">' +
							'<span class="config-header i18n" data-i18n="[html]menu.config.settings"></span>' +
							'<div class="config-body"></div>' +
							'<div class="clear"></div>' +
						'</div>' +
						*/
						'<div class="config-section" id="config-tools">' +
							'<span class="config-header i18n" data-i18n="[html]menu.config.tools"></span>' +
							'<div class="config-body"></div>' +
							'<div class="clear"></div>' +
						'</div>' +
					'</div>'
					);

	function showConfig() {
		var winWidth = win.width(),
			winHeight = win.height();

		modalOverlay
			.width( winWidth )
			.height( winHeight )
			.show();

		configWindow
			.show()
			.center();

		container.addClass('blur');

		$('#main-menu-dropdown').hide();
		$('#main-menu-button').removeClass('active');
	}

	function hideConfig() {
		configWindow.hide();
		modalOverlay.hide();
		container.removeClass('blur');
	}

	modalOverlay.on('click', function() {
		hideConfig();
	});

	configWindow.closeButton.on('click', function() {
		hideConfig();
	});

	function buttonClick(e) {

		e.preventDefault();

		if (configWindow.container.is(':visible')) {

			hideConfig();

		} else {

			showConfig();

		}

		return false;
	}
};
sofia.menuComponents.push('ConfigButton');
