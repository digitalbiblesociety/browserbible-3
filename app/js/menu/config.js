
var ConfigButton = function(node) {
	var configButton = $('<div id="main-config-button" class="main-menu-button image-config" style=""></div>')
					.appendTo(node)
					.on('click', buttonClick),

		mobileConfigButton = $('<div id="mobile-config-button" class="mobile-menu-button image-logo" style=""></div>')
					.appendTo( $('body'))
					.on('click', buttonClick),

		configMenu = $('<div id="main-config-box" class="window-overlay">' +

						'<div class="config-section" id="config-type">' +
							'<span class="config-header i18n" data-i18n="[html]menu.config.font"></span>' +
							'<div class="config-body"></div>' +
							'<div class="clear"></div>' +
						'</div>' +
						'<div class="config-section" id="config-toggles">' +
							'<span class="config-header i18n" data-i18n="[html]menu.config.settings"></span>' +
							'<div class="config-body"></div>' +
							'<div class="clear"></div>' +
						'</div>' +
						'<div class="config-section" id="config-tools">' +
							'<span class="config-header i18n" data-i18n="[html]menu.config.tools"></span>' +
							'<div class="config-body"></div>' +
							'<div class="clear"></div>' +
						'</div>' +

					'</div>')
					.appendTo($('body'));


	function docClick(e) {

		// check for user clicking off, or 
		// for user clicking FLASH (copy/paste)
		if ($(e.target).closest('#main-config-box').length == 0 && e.target.nodeName != 'EMBED') {
			configMenu.hide();
			$(document).off('click', docClick);
		}
	}

	function buttonClick(e) {

		e.preventDefault();

		if (configMenu.is(':visible')) {
			configMenu.hide();

			$(document).off('click', docClick);
		} else {

			$('.window-overlay').hide();

			configMenu.show();

			$(document).on('click', docClick);
		}

		return false;
	}
};
sofia.menuComponents.push('ConfigButton');